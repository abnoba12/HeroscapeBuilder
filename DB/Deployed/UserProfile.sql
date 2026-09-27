/*
    User profile - adds each account's default point system.

    Accounts that never choose one use Renegade.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod),
    after PointSystems.sql and at the same time as deploying the matching site build.
*/

IF COL_LENGTH(N'dbo.AspNetUsers', N'PointSystem') IS NULL
    ALTER TABLE dbo.AspNetUsers ADD PointSystem NVARCHAR(20) NOT NULL
        CONSTRAINT DF_AspNetUsers_PointSystem DEFAULT (N'Renegade')
        CONSTRAINT CK_AspNetUsers_PointSystem CHECK (PointSystem IN (N'Standard', N'Renegade', N'Delta'));
GO
