/*
    Rename battlegroup -> armybuilder.
    Tables:   battlegroup -> armybuilder, battlegroup_unit -> armybuilder_unit, battlegroup_journal -> armybuilder_journal
    Columns:  BattlegroupId -> ArmyBuilderId (armybuilder_unit, armybuilder_journal, army_game)
    Also renames the keys, defaults, checks and indexes so names match the EF mapping.
    Idempotent: safe to run more than once. Deploy together with the code that uses the new names.
*/

-- Tables
IF OBJECT_ID(N'dbo.battlegroup', N'U') IS NOT NULL AND OBJECT_ID(N'dbo.armybuilder', N'U') IS NULL
    EXEC sp_rename N'dbo.battlegroup', N'armybuilder';
IF OBJECT_ID(N'dbo.battlegroup_unit', N'U') IS NOT NULL AND OBJECT_ID(N'dbo.armybuilder_unit', N'U') IS NULL
    EXEC sp_rename N'dbo.battlegroup_unit', N'armybuilder_unit';
IF OBJECT_ID(N'dbo.battlegroup_journal', N'U') IS NOT NULL AND OBJECT_ID(N'dbo.armybuilder_journal', N'U') IS NULL
    EXEC sp_rename N'dbo.battlegroup_journal', N'armybuilder_journal';
GO

-- Columns
IF COL_LENGTH(N'dbo.armybuilder_unit', N'BattlegroupId') IS NOT NULL
    EXEC sp_rename N'dbo.armybuilder_unit.BattlegroupId', N'ArmyBuilderId', N'COLUMN';
IF COL_LENGTH(N'dbo.armybuilder_journal', N'BattlegroupId') IS NOT NULL
    EXEC sp_rename N'dbo.armybuilder_journal.BattlegroupId', N'ArmyBuilderId', N'COLUMN';
IF COL_LENGTH(N'dbo.army_game', N'BattlegroupId') IS NOT NULL
    EXEC sp_rename N'dbo.army_game.BattlegroupId', N'ArmyBuilderId', N'COLUMN';
GO

-- Constraints (PK / FK / DF / CK): every object whose name contains 'battlegroup'
DECLARE @old SYSNAME, @new SYSNAME;
DECLARE c CURSOR LOCAL FAST_FORWARD FOR
    SELECT name FROM sys.objects
    WHERE type IN ('PK', 'F', 'D', 'C') AND name LIKE N'%battlegroup%';
OPEN c;
FETCH NEXT FROM c INTO @old;
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @new = REPLACE(@old, N'Battlegroup', N'ArmyBuilder');
    SET @new = REPLACE(@new, N'battlegroup', N'armybuilder');
    EXEC sp_rename @old, @new, N'OBJECT';
    FETCH NEXT FROM c INTO @old;
END
CLOSE c; DEALLOCATE c;
GO

-- Indexes
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_army_game_BattlegroupId' AND object_id = OBJECT_ID(N'dbo.army_game'))
    EXEC sp_rename N'dbo.army_game.IX_army_game_BattlegroupId', N'IX_army_game_ArmyBuilderId', N'INDEX';
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_battlegroup_journal_BattlegroupId' AND object_id = OBJECT_ID(N'dbo.armybuilder_journal'))
    EXEC sp_rename N'dbo.armybuilder_journal.IX_battlegroup_journal_BattlegroupId', N'IX_armybuilder_journal_ArmyBuilderId', N'INDEX';
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_battlegroup_unit_ArmyCardId' AND object_id = OBJECT_ID(N'dbo.armybuilder_unit'))
    EXEC sp_rename N'dbo.armybuilder_unit.IX_battlegroup_unit_ArmyCardId', N'IX_armybuilder_unit_ArmyCardId', N'INDEX';
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_battlegroup_ShareId' AND object_id = OBJECT_ID(N'dbo.armybuilder'))
    EXEC sp_rename N'dbo.armybuilder.UX_battlegroup_ShareId', N'UX_armybuilder_ShareId', N'INDEX';
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_battlegroup_unit_Battlegroup_ArmyCard' AND object_id = OBJECT_ID(N'dbo.armybuilder_unit'))
    EXEC sp_rename N'dbo.armybuilder_unit.UX_battlegroup_unit_Battlegroup_ArmyCard', N'UX_armybuilder_unit_ArmyBuilder_ArmyCard', N'INDEX';
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_battlegroup_UserId_Name' AND object_id = OBJECT_ID(N'dbo.armybuilder'))
    EXEC sp_rename N'dbo.armybuilder.UX_battlegroup_UserId_Name', N'UX_armybuilder_UserId_Name', N'INDEX';
GO
