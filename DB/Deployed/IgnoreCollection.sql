/*
    Ignore My Collection when building armies.

    AspNetUsers.IgnoreCollection   when on, the Army builder behaves as if the user owns every unit with unlimited
                                   copies: no collection checks and no "needs review" warning for missing copies.
                                   Off by default.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod),
    at the same time as deploying the matching site build.
*/

IF COL_LENGTH(N'dbo.AspNetUsers', N'IgnoreCollection') IS NULL
    ALTER TABLE dbo.AspNetUsers ADD IgnoreCollection BIT NOT NULL
        CONSTRAINT DF_AspNetUsers_IgnoreCollection DEFAULT (0);
GO
