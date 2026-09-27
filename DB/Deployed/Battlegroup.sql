/*
    Battlegroup feature - new tables.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF OBJECT_ID(N'dbo.battlegroup', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.battlegroup
    (
        id          INT IDENTITY(1,1)  NOT NULL,
        UserId      NVARCHAR(450)      NOT NULL,
        Name        NVARCHAR(100)      NOT NULL,
        PointLimit  INT                NOT NULL,
        -- Restricts the battlegroup to a single creator (matches army_card.Creator). NULL = any creator.
        Creator     NVARCHAR(450)      NULL,
        -- Free-form notes from the owner on how to play this battlegroup (strategy, tips). Plain text.
        Notes       NVARCHAR(MAX)      NULL,
        IsShared    BIT                NOT NULL CONSTRAINT DF_battlegroup_IsShared DEFAULT (0),
        -- Unguessable identifier used in the public share link. Only resolvable while IsShared = 1.
        ShareId     UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_battlegroup_ShareId DEFAULT (NEWID()),
        CreatedAt   DATETIME2          NOT NULL CONSTRAINT DF_battlegroup_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt   DATETIME2          NOT NULL CONSTRAINT DF_battlegroup_UpdatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_battlegroup PRIMARY KEY (id),
        CONSTRAINT FK_battlegroup_AspNetUsers FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id) ON DELETE CASCADE,
        CONSTRAINT CK_battlegroup_PointLimit CHECK (PointLimit > 0)
    );

    -- A user cannot have two battlegroups with the same name (default collation is case-insensitive).
    CREATE UNIQUE INDEX UX_battlegroup_UserId_Name ON dbo.battlegroup (UserId, Name);
    CREATE UNIQUE INDEX UX_battlegroup_ShareId ON dbo.battlegroup (ShareId);
END;
GO

-- Databases that already ran an earlier version of this script get the column added here.
IF COL_LENGTH(N'dbo.battlegroup', N'Notes') IS NULL
    ALTER TABLE dbo.battlegroup ADD Notes NVARCHAR(MAX) NULL;
GO

IF OBJECT_ID(N'dbo.battlegroup_unit', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.battlegroup_unit
    (
        id             INT IDENTITY(1,1) NOT NULL,
        BattlegroupId  INT               NOT NULL,
        ArmyCardId     INT               NOT NULL,
        Quantity       INT               NOT NULL,

        CONSTRAINT PK_battlegroup_unit PRIMARY KEY (id),
        CONSTRAINT FK_battlegroup_unit_battlegroup FOREIGN KEY (BattlegroupId) REFERENCES dbo.battlegroup (id) ON DELETE CASCADE,
        CONSTRAINT FK_battlegroup_unit_army_card FOREIGN KEY (ArmyCardId) REFERENCES dbo.army_card (id),
        CONSTRAINT CK_battlegroup_unit_Quantity CHECK (Quantity > 0)
    );

    CREATE UNIQUE INDEX UX_battlegroup_unit_Battlegroup_ArmyCard ON dbo.battlegroup_unit (BattlegroupId, ArmyCardId);
    CREATE INDEX IX_battlegroup_unit_ArmyCardId ON dbo.battlegroup_unit (ArmyCardId);
END;
GO
