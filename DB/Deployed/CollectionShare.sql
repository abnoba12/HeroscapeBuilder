/*
    My Collection sharing - adds the per-account share switch and secret link id.

    Sharing starts off for every account; each account gets its own random link id.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod),
    at the same time as deploying the matching site build.
*/

IF COL_LENGTH(N'dbo.AspNetUsers', N'CollectionIsShared') IS NULL
    ALTER TABLE dbo.AspNetUsers ADD CollectionIsShared BIT NOT NULL
        CONSTRAINT DF_AspNetUsers_CollectionIsShared DEFAULT (0);
GO

IF COL_LENGTH(N'dbo.AspNetUsers', N'CollectionShareId') IS NULL
    ALTER TABLE dbo.AspNetUsers ADD CollectionShareId UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT DF_AspNetUsers_CollectionShareId DEFAULT (NEWID());
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_AspNetUsers_CollectionShareId' AND object_id = OBJECT_ID(N'dbo.AspNetUsers'))
    CREATE UNIQUE INDEX UX_AspNetUsers_CollectionShareId ON dbo.AspNetUsers (CollectionShareId);
GO
