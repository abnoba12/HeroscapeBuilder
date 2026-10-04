/*
    Power Ranking feature - new tables.

    unit_duel_vote  one answer to "which unit would you rather have on your side?" for one pair, from a
                    signed-in user or an anonymous visitor.
    unit_rating     the Bradley-Terry strength of every unit, recomputed in batch from the votes.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF OBJECT_ID(N'dbo.unit_duel_vote', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.unit_duel_vote
    (
        id           INT IDENTITY(1,1)  NOT NULL,
        -- Exactly one of UserId / AnonymousId is set. Anonymous votes carry a random id kept in the visitor's browser.
        UserId       NVARCHAR(450)      NULL,
        AnonymousId  NVARCHAR(64)       NULL,
        -- The pair is stored in a canonical order (A < B) so a user can hold only one vote per pair.
        ArmyCardAId  INT                NOT NULL,
        ArmyCardBId  INT                NOT NULL,
        -- 0 = "it depends" (no preference), 1 = A is preferred, 2 = B is preferred.
        Result       TINYINT            NOT NULL,
        CreatedAt    DATETIME2          NOT NULL CONSTRAINT DF_unit_duel_vote_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt    DATETIME2          NOT NULL CONSTRAINT DF_unit_duel_vote_UpdatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_unit_duel_vote PRIMARY KEY (id),
        CONSTRAINT FK_unit_duel_vote_AspNetUsers FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id) ON DELETE CASCADE,
        CONSTRAINT FK_unit_duel_vote_army_card_A FOREIGN KEY (ArmyCardAId) REFERENCES dbo.army_card (id),
        CONSTRAINT FK_unit_duel_vote_army_card_B FOREIGN KEY (ArmyCardBId) REFERENCES dbo.army_card (id),
        CONSTRAINT CK_unit_duel_vote_Order CHECK (ArmyCardAId < ArmyCardBId),
        CONSTRAINT CK_unit_duel_vote_Result CHECK (Result IN (0, 1, 2)),
        CONSTRAINT CK_unit_duel_vote_Voter CHECK ((UserId IS NULL AND AnonymousId IS NOT NULL) OR (UserId IS NOT NULL AND AnonymousId IS NULL))
    );

    CREATE UNIQUE INDEX UX_unit_duel_vote_User_Pair ON dbo.unit_duel_vote (UserId, ArmyCardAId, ArmyCardBId) WHERE UserId IS NOT NULL;
    CREATE UNIQUE INDEX UX_unit_duel_vote_Anonymous_Pair ON dbo.unit_duel_vote (AnonymousId, ArmyCardAId, ArmyCardBId) WHERE AnonymousId IS NOT NULL;
    CREATE INDEX IX_unit_duel_vote_ArmyCardAId ON dbo.unit_duel_vote (ArmyCardAId);
    CREATE INDEX IX_unit_duel_vote_ArmyCardBId ON dbo.unit_duel_vote (ArmyCardBId);
    CREATE INDEX IX_unit_duel_vote_UpdatedAt ON dbo.unit_duel_vote (UpdatedAt);
END;
GO

-- Databases that ran the earlier version (signed-in votes only) are upgraded here.
IF COL_LENGTH(N'dbo.unit_duel_vote', N'AnonymousId') IS NULL
BEGIN
    DROP INDEX UX_unit_duel_vote_User_Pair ON dbo.unit_duel_vote;
    ALTER TABLE dbo.unit_duel_vote ALTER COLUMN UserId NVARCHAR(450) NULL;
    ALTER TABLE dbo.unit_duel_vote ADD AnonymousId NVARCHAR(64) NULL;
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_unit_duel_vote_User_Pair' AND object_id = OBJECT_ID(N'dbo.unit_duel_vote'))
    CREATE UNIQUE INDEX UX_unit_duel_vote_User_Pair ON dbo.unit_duel_vote (UserId, ArmyCardAId, ArmyCardBId) WHERE UserId IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_unit_duel_vote_Anonymous_Pair' AND object_id = OBJECT_ID(N'dbo.unit_duel_vote'))
    CREATE UNIQUE INDEX UX_unit_duel_vote_Anonymous_Pair ON dbo.unit_duel_vote (AnonymousId, ArmyCardAId, ArmyCardBId) WHERE AnonymousId IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CK_unit_duel_vote_Voter')
    ALTER TABLE dbo.unit_duel_vote ADD CONSTRAINT CK_unit_duel_vote_Voter
        CHECK ((UserId IS NULL AND AnonymousId IS NOT NULL) OR (UserId IS NOT NULL AND AnonymousId IS NULL));
GO

IF OBJECT_ID(N'dbo.unit_rating', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.unit_rating
    (
        ArmyCardId     INT        NOT NULL,
        -- Bradley-Terry strength on the log scale (a difference of 1 is roughly a 73% win rate).
        Rating         FLOAT      NOT NULL,
        -- Where the unit started, derived from its Renegade points. Rating minus SeedRating is how far the crowd
        -- has moved the unit away from its points.
        SeedRating     FLOAT      NOT NULL,
        -- Votes that picked a side (counted in Rating) and "it depends" votes (not counted).
        VoteCount      INT        NOT NULL CONSTRAINT DF_unit_rating_VoteCount DEFAULT (0),
        DependsCount   INT        NOT NULL CONSTRAINT DF_unit_rating_DependsCount DEFAULT (0),
        UpdatedAt      DATETIME2  NOT NULL CONSTRAINT DF_unit_rating_UpdatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_unit_rating PRIMARY KEY (ArmyCardId),
        CONSTRAINT FK_unit_rating_army_card FOREIGN KEY (ArmyCardId) REFERENCES dbo.army_card (id) ON DELETE CASCADE
    );

    CREATE INDEX IX_unit_rating_Rating ON dbo.unit_rating (Rating DESC);
END;
GO
