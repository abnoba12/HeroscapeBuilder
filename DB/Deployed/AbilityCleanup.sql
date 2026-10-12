/*
    General ability / card-name cleanup found during the abilities review.

    1. Standardize typographic quotes/hyphens to plain ASCII (ability, ability_name, army_card.Name).
    2. Remove hard line breaks in the middle of sentences (PDF wrap artifacts), and newlines inside ability names.
       Intentional breaks are kept: after a sentence-ending period, before bullets (• or -), and blank lines.
    3. Fix card-name typos: Viceron The Blood Knight, Johnny "Shotgun" Sullivan, Louis "Mad Dog" Malone,
       and Quonk Warwitch -> Quorik Warwitch (the card text says Quorik).
    4. Raelin the Kyrie Warrior (Renegade): Vengeful Swoop 8 text said 9 or higher; it is 8.
    5. Add missing Flying / Stealth Flying (name only; Renegade no longer prints the text for common abilities):
       Air Marshall Zed Nesbitt, Battle Copter, COBRA Flight Pod -> Flying
       Taelord the Kyrie Warrior (SotC) -> Stealth Flying
    6. Add the missing Flying ability to Sonlen (Heroscape) and Sonlen (AoA) (Renegade), with full standard text.
    7. Fix unit-name misspellings in ability text (Karithion, Adelbern, Maruchott, Zetracron), rename Shades Of Bleakwoode
       to Shades Of Bleakewoode (printed spelling), fix "Lolth'S Wrath", and drop "See Mimring for more details." from Moltenclaw.

    Idempotent: safe to run more than once.
    Run against the target database (HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

-- 1. quotes and hyphens
UPDATE dbo.army_card_abilities
SET ability = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ability, NCHAR(8217), N''''), NCHAR(8216), N''''), NCHAR(8220), N'"'), NCHAR(8221), N'"'), NCHAR(8209), N'-'),
    ability_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ability_name, NCHAR(8217), N''''), NCHAR(8216), N''''), NCHAR(8220), N'"'), NCHAR(8221), N'"'), NCHAR(8209), N'-')
WHERE ability LIKE N'%[' + NCHAR(8216) + NCHAR(8217) + NCHAR(8220) + NCHAR(8221) + NCHAR(8209) + N']%'
   OR ability_name LIKE N'%[' + NCHAR(8216) + NCHAR(8217) + NCHAR(8220) + NCHAR(8221) + NCHAR(8209) + N']%';

UPDATE dbo.army_card
SET Name = REPLACE(REPLACE(REPLACE(REPLACE(Name, NCHAR(8217), N''''), NCHAR(8216), N''''), NCHAR(8220), N'"'), NCHAR(8221), N'"')
WHERE Name LIKE N'%[' + NCHAR(8216) + NCHAR(8217) + NCHAR(8220) + NCHAR(8221) + N']%';

-- 2. newlines inside ability names
UPDATE dbo.army_card_abilities
SET ability_name = REPLACE(REPLACE(REPLACE(ability_name, CHAR(13) + CHAR(10), N' '), CHAR(13), N' '), CHAR(10), N' ')
WHERE ability_name LIKE N'%' + CHAR(13) + N'%' OR ability_name LIKE N'%' + CHAR(10) + N'%';

-- 2. mid-sentence line breaks: a letter/digit/comma, then CR or LF, then anything other than a bullet, dash or another break
DECLARE @pCr NVARCHAR(40) = N'%[A-Za-z0-9,]' + CHAR(13) + N'[^' + NCHAR(8226) + N'-' + CHAR(13) + CHAR(10) + N']%';
DECLARE @pLf NVARCHAR(40) = N'%[A-Za-z0-9,]' + CHAR(10) + N'[^' + NCHAR(8226) + N'-' + CHAR(13) + CHAR(10) + N']%';

WHILE EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE ability LIKE @pCr)
    UPDATE dbo.army_card_abilities
    SET ability = STUFF(ability, PATINDEX(@pCr, ability) + 1, 1, N' ')
    WHERE ability LIKE @pCr;

WHILE EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE ability LIKE @pLf)
    UPDATE dbo.army_card_abilities
    SET ability = STUFF(ability, PATINDEX(@pLf, ability) + 1, 1, N' ')
    WHERE ability LIKE @pLf;

-- 3. card names
UPDATE dbo.army_card SET Name = N'Viceron The Blood Knight' WHERE Creator = N'SOV' AND Name = N'Viceron TheBlood Knight';
UPDATE dbo.army_card SET Name = N'Concan The Kyrie Warrior' WHERE Creator = N'Heroscape' AND Name = N'Concan TheKyrie Warrior';
UPDATE dbo.army_card SET Name = N'Johnny "Shotgun" Sullivan' WHERE Creator = N'Heroscape' AND Name = N'Johnny"shotgun" Sullivan';
UPDATE dbo.army_card SET Name = N'Louis "Mad Dog" Malone' WHERE Name LIKE N'Louis "mad Dog" Malone';
UPDATE dbo.army_card SET Name = N'Quorik Warwitch' WHERE Creator = N'C3V' AND Name = N'Quonk Warwitch';

-- 4. Raelin the Kyrie Warrior (Renegade) Vengeful Swoop threshold
UPDATE a
SET ability = REPLACE(a.ability, N'roll 9 or higher', N'roll 8 or higher')
FROM dbo.army_card_abilities a
JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Renegade' AND c.Name = N'Raelin the Kyrie Warrior' AND a.ability_name = N'Vengeful Swoop 8';

-- 5. missing flying abilities
INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
SELECT c.id, v.ability_name, v.ability_name
FROM (VALUES
    (N'Air Marshall Zed Nesbitt', N'Flying'),
    (N'Battle Copter', N'Flying'),
    (N'COBRA Flight Pod', N'Flying'),
    (N'Taelord the Kyrie Warrior (SotC)', N'Stealth Flying')
) v (card_name, ability_name)
JOIN dbo.army_card c ON c.Creator = N'Renegade' AND c.Name = v.card_name
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.army_card_abilities a
    WHERE a.army_card_id = c.id AND a.ability_name = v.ability_name);

-- 6. Sonlen: missing Flying (text follows the standard single-figure Flying wording; verify against the printed cards)
DECLARE @sonlenOfficial INT = (SELECT id FROM dbo.army_card WHERE Creator = N'Heroscape' AND Name = N'Sonlen');
DECLARE @sonlenAoa INT = (SELECT id FROM dbo.army_card WHERE Creator = N'Renegade' AND Name = N'Sonlen (AoA)');

IF @sonlenOfficial IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE army_card_id = @sonlenOfficial AND ability_name = N'FLYING')
    INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
    VALUES (@sonlenOfficial, N'FLYING',
        N'When counting spaces for Sonlen''s movement, ignore elevations. Sonlen may fly over water without stopping, pass over figures without becoming engaged, and fly over obstacles such as ruins. When Sonlen starts to fly, if he is engaged he will take any leaving engagement attacks.');

IF @sonlenAoa IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE army_card_id = @sonlenAoa AND ability_name = N'Flying')
    INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
    VALUES (@sonlenAoa, N'Flying',
        N'When counting spaces for Sonlen''s movement, ignore elevations. Sonlen may fly over water without stopping, pass over figures without becoming engaged, and fly over obstacles such as ruins. When Sonlen starts to fly, if he is engaged he will take any leaving engagement attacks.');

-- 7. Unit-name misspellings inside ability text, and Moltenclaw cross-reference
UPDATE a SET ability = REPLACE(a.ability, N'Ana Karithion', N'Ana Karithon')
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Heroscape' AND c.Name = N'Ana Karithon' AND a.ability LIKE N'%Karithion%';

UPDATE a SET ability = REPLACE(a.ability, N'Adelbern', N'Adelbren')
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Renegade' AND c.Name = N'Knight Primus Adelbren' AND a.ability LIKE N'%Adelbern%';

UPDATE a SET ability = REPLACE(a.ability, N'Maruchott', N'Marachott')
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Renegade' AND c.Name LIKE N'Marachott%' AND a.ability LIKE N'%Maruchott%';

UPDATE a SET ability = REPLACE(a.ability, N'Zetracron', N'Zetacron')
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Renegade' AND c.Name = N'Zetacron' AND a.ability LIKE N'%Zetracron%';

-- The printed spelling is Bleakewoode; the card name was the typo
UPDATE dbo.army_card SET Name = N'Shades Of Bleakewoode' WHERE Creator = N'Heroscape' AND Name = N'Shades Of Bleakwoode';

UPDATE a SET ability_name = N'Lolth''s Wrath'
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Heroscape' AND c.Name = N'Pelloth' AND a.ability_name = N'Lolth''S Wrath' COLLATE Latin1_General_BIN;

UPDATE a SET ability = RTRIM(REPLACE(a.ability, N'See Mimring for more details.', N''))
FROM dbo.army_card_abilities a JOIN dbo.army_card c ON c.id = a.army_card_id
WHERE c.Creator = N'Heroscape' AND c.Name = N'Moltenclaw' AND a.ability LIKE N'%See Mimring for more details.%';
