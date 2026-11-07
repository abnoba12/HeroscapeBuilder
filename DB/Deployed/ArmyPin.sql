/*
    Pinned armies.

    armybuilder.IsPinned   a pinned army is listed first on My Armies.

    Idempotent: safe to run more than once. Run ArmyBuilderRename.sql first.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF COL_LENGTH(N'dbo.armybuilder', N'IsPinned') IS NULL
    ALTER TABLE dbo.armybuilder ADD IsPinned BIT NOT NULL CONSTRAINT DF_armybuilder_IsPinned DEFAULT (0);
GO
