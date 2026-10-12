/*
    Army point variations.

    armybuilder.ParentArmyBuilderId   NULL for an army's primary version. A variation (another version of the same
                                      army: a different point limit, creator restriction, anything) is another
                                      armybuilder row pointing at the primary. A variation is a full army of its own
                                      (units, limit, point system, creator, notes, results, journal). The army's
                                      Name is copied onto variations and kept in sync by the app; IsShared / ShareId /
                                      IsRetired are only meaningful on the primary.
    armybuilder.VariationLabel        Optional name for a variation ("Tournament").

    Name uniqueness now only applies to primaries (variations repeat the army's name).

    Idempotent: safe to run more than once. Run against HeroscapeBuilder_dev, then HeroscapeBuilder.
*/

IF COL_LENGTH(N'dbo.armybuilder', N'ParentArmyBuilderId') IS NULL
    ALTER TABLE dbo.armybuilder ADD ParentArmyBuilderId INT NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_armybuilder_Parent')
    ALTER TABLE dbo.armybuilder ADD CONSTRAINT FK_armybuilder_Parent
        FOREIGN KEY (ParentArmyBuilderId) REFERENCES dbo.armybuilder (id);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_armybuilder_UserId_Name' AND object_id = OBJECT_ID(N'dbo.armybuilder') AND has_filter = 0)
    DROP INDEX UX_armybuilder_UserId_Name ON dbo.armybuilder;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_armybuilder_UserId_Name' AND object_id = OBJECT_ID(N'dbo.armybuilder'))
    CREATE UNIQUE INDEX UX_armybuilder_UserId_Name ON dbo.armybuilder (UserId, Name) WHERE ParentArmyBuilderId IS NULL;
GO

IF COL_LENGTH(N'dbo.armybuilder', N'VariationLabel') IS NULL
    ALTER TABLE dbo.armybuilder ADD VariationLabel NVARCHAR(100) NULL;
GO
