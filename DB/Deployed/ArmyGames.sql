/*
    Army game log - new tables, plus the extra columns the power rating keeps about game results.

    army_game       one logged win or loss for one of a user's armies.
    army_game_unit  the units that were in the army when the game was logged (just unit, quantity and points -
                    not a copy of the army), so editing the army later never changes old results and a mistaken
                    entry can be removed cleanly.

    Idempotent: safe to run more than once. Run PowerRanking.sql first.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF OBJECT_ID(N'dbo.army_game', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.army_game
    (
        id            INT IDENTITY(1,1)  NOT NULL,
        UserId        NVARCHAR(450)      NOT NULL,
        -- The army the game was played with. NULL once that army has been deleted (the results are kept).
        -- No ON DELETE rule here: SQL Server rejects SET NULL beside the cascading UserId path, so the app clears it.
        BattlegroupId INT                NULL,
        Won           BIT                NOT NULL,
        PlayedAt      DATETIME2          NOT NULL CONSTRAINT DF_army_game_PlayedAt DEFAULT (SYSUTCDATETIME()),
        Note          NVARCHAR(500)      NULL,
        CreatedAt     DATETIME2          NOT NULL CONSTRAINT DF_army_game_CreatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_army_game PRIMARY KEY (id),
        CONSTRAINT FK_army_game_AspNetUsers FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id) ON DELETE CASCADE,
        CONSTRAINT FK_army_game_battlegroup FOREIGN KEY (BattlegroupId) REFERENCES dbo.battlegroup (id)
    );

    CREATE INDEX IX_army_game_UserId ON dbo.army_game (UserId);
    CREATE INDEX IX_army_game_BattlegroupId ON dbo.army_game (BattlegroupId);
    CREATE INDEX IX_army_game_CreatedAt ON dbo.army_game (CreatedAt);
END;
GO

IF OBJECT_ID(N'dbo.army_game_unit', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.army_game_unit
    (
        id          INT IDENTITY(1,1) NOT NULL,
        ArmyGameId  INT               NOT NULL,
        ArmyCardId  INT               NOT NULL,
        Quantity    INT               NOT NULL,
        -- The unit's points under the army's point system when the game was logged; used to split credit by points share.
        Points      INT               NOT NULL,

        CONSTRAINT PK_army_game_unit PRIMARY KEY (id),
        CONSTRAINT FK_army_game_unit_army_game FOREIGN KEY (ArmyGameId) REFERENCES dbo.army_game (id) ON DELETE CASCADE,
        CONSTRAINT FK_army_game_unit_army_card FOREIGN KEY (ArmyCardId) REFERENCES dbo.army_card (id),
        CONSTRAINT CK_army_game_unit_Quantity CHECK (Quantity > 0)
    );

    CREATE INDEX IX_army_game_unit_ArmyGameId ON dbo.army_game_unit (ArmyGameId);
    CREATE INDEX IX_army_game_unit_ArmyCardId ON dbo.army_game_unit (ArmyCardId);
END;
GO

-- unit_rating keeps the pieces of the combined rating so they can be compared side by side.
IF COL_LENGTH(N'dbo.unit_rating', N'DuelRating') IS NULL
    ALTER TABLE dbo.unit_rating ADD DuelRating FLOAT NOT NULL CONSTRAINT DF_unit_rating_DuelRating DEFAULT (0);
GO
-- Null until the unit has enough logged games, from enough different players, for results to count.
IF COL_LENGTH(N'dbo.unit_rating', N'ResultsRating') IS NULL
    ALTER TABLE dbo.unit_rating ADD ResultsRating FLOAT NULL;
GO
IF COL_LENGTH(N'dbo.unit_rating', N'GameCount') IS NULL
    ALTER TABLE dbo.unit_rating ADD GameCount INT NOT NULL CONSTRAINT DF_unit_rating_GameCount DEFAULT (0);
GO
IF COL_LENGTH(N'dbo.unit_rating', N'GameUserCount') IS NULL
    ALTER TABLE dbo.unit_rating ADD GameUserCount INT NOT NULL CONSTRAINT DF_unit_rating_GameUserCount DEFAULT (0);
GO
