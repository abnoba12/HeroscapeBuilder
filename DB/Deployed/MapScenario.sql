/*
    Optional scenario for a map.

    Some maps are built for one particular scenario. This is free text typed in by an admin on the map upload / edit
    form; NULL means the map is not tied to a scenario.

    Idempotent: safe to run more than once.
    Run against the target database (HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF COL_LENGTH('dbo.map', 'scenario') IS NULL
    ALTER TABLE dbo.map ADD scenario NVARCHAR(2000) NULL;
GO
