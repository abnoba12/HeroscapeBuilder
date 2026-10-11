/*
    Retired armies and the army play journal.

    battlegroup.IsRetired / RetiredAt   a retired army is hidden from the active list on My Armies (kept, not deleted).
    battlegroup_journal                 the owner's private, dated observations about an army (what went well, what
                                        went poorly, anything else). Never shown on the shared link.

    Idempotent: safe to run more than once. Run Battlegroup.sql first.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF COL_LENGTH(N'dbo.battlegroup', N'IsRetired') IS NULL
    ALTER TABLE dbo.battlegroup ADD IsRetired BIT NOT NULL CONSTRAINT DF_battlegroup_IsRetired DEFAULT (0);
GO

IF COL_LENGTH(N'dbo.battlegroup', N'RetiredAt') IS NULL
    ALTER TABLE dbo.battlegroup ADD RetiredAt DATETIME2 NULL;
GO

IF OBJECT_ID(N'dbo.battlegroup_journal', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.battlegroup_journal
    (
        id            INT IDENTITY(1,1)  NOT NULL,
        -- No UserId: ownership comes from the army, and a second cascading path to AspNetUsers is not allowed.
        BattlegroupId INT                NOT NULL,
        -- The day the army was played (or the day being reflected on); the owner can change it.
        EntryDate     DATE               NOT NULL,
        WentWell      NVARCHAR(4000)     NULL,
        WentPoorly    NVARCHAR(4000)     NULL,
        Notes         NVARCHAR(4000)     NULL,
        CreatedAt     DATETIME2          NOT NULL CONSTRAINT DF_battlegroup_journal_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt     DATETIME2          NOT NULL CONSTRAINT DF_battlegroup_journal_UpdatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_battlegroup_journal PRIMARY KEY (id),
        CONSTRAINT FK_battlegroup_journal_battlegroup FOREIGN KEY (BattlegroupId) REFERENCES dbo.battlegroup (id) ON DELETE CASCADE
    );

    CREATE INDEX IX_battlegroup_journal_BattlegroupId ON dbo.battlegroup_journal (BattlegroupId, EntryDate);
END;
GO
