/*
    Shadow Fiend (SOV) - adds its two abilities, which were missing from army_card_abilities.

    Text transcribed from the printed card (SoV_Shadow_Fiend_Print.pdf). Names are stored as printed (capitals), the
    same way the other SoV abilities are, and apostrophes use the typographic one (U+2019) like the rest of the SoV
    text. It is written as ~ below and swapped in with NCHAR(8217) so the script does not depend on file encoding.

    Idempotent: safe to run more than once; an ability that already exists for the card is left alone.
    Run against the target database (HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

DECLARE @cardId INT = (SELECT id FROM dbo.army_card WHERE Creator = N'SOV' AND Name = N'Shadow Fiend');

IF @cardId IS NULL
    THROW 50000, N'Shadow Fiend (SOV) was not found in army_card.', 1;

IF NOT EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE army_card_id = @cardId AND ability_name = N'SHADOW SWOOP')
    INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
    VALUES (@cardId, N'SHADOW SWOOP', REPLACE(
        N'After moving and before attacking, if a Shadow Fiend used its Stealth Flying special power this turn, you may choose a Squad figure it passed over this turn and roll the 20-sided die. Add 1 to your roll for every other Shadow figure you control adjacent to the chosen figure. If you roll a 13 or higher, the chosen figure receives a wound.',
        N'~', NCHAR(8217)));

IF NOT EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE army_card_id = @cardId AND ability_name = N'STEALTH FLYING')
    INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
    VALUES (@cardId, N'STEALTH FLYING', REPLACE(
        N'When counting spaces for a Shadow Fiend~s movement, ignore elevations. A Shadow Fiend may fly over water without stopping, pass over figures without becoming engaged, and fly over obstacles such as ruins. When a Shadow Fiend starts to fly, if it is engaged, it will not take any leaving engagement attacks.',
        N'~', NCHAR(8217)));
