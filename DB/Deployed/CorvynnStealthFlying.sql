/*
    Corvynn the Rotbeak (Renegade) - adds the Stealth Flying ability, which was missing from army_card_abilities.

    Text follows the standard single-figure Stealth Flying wording (same as Boreos). Verify against the printed card.

    Idempotent: safe to run more than once.
    Run against the target database (HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

DECLARE @cardId INT = (SELECT id FROM dbo.army_card WHERE Creator = N'Renegade' AND Name = N'Corvynn the Rotbeak');

IF @cardId IS NULL
    THROW 50000, N'Corvynn the Rotbeak (Renegade) was not found in army_card.', 1;

IF NOT EXISTS (SELECT 1 FROM dbo.army_card_abilities WHERE army_card_id = @cardId AND ability_name = N'Stealth Flying')
    INSERT INTO dbo.army_card_abilities (army_card_id, ability_name, ability)
    VALUES (@cardId, N'Stealth Flying',
        N'When counting spaces for Corvynn''s movement, ignore elevations. Corvynn may fly over water without stopping, pass over figures without becoming engaged, and fly over obstacles such as ruins. If Corvynn is engaged when it starts to fly, it will not take any leaving engagement attacks.');
