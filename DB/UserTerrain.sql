/*
    My Terrain feature - new table.

    The terrain a user owns: terrain type + terrain size + quantity, using the same lookups as map_tile so a
    user's terrain can be compared against the tiles a map needs.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF OBJECT_ID(N'dbo.user_terrain', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_terrain
    (
        id               INT IDENTITY(1,1) NOT NULL,
        user_id          NVARCHAR(450)     NOT NULL,
        terrain_type_id  INT               NOT NULL,
        terrain_size_id  INT               NOT NULL,
        quantity         INT               NOT NULL,

        CONSTRAINT PK_user_terrain PRIMARY KEY (id),
        CONSTRAINT FK_user_terrain_user FOREIGN KEY (user_id) REFERENCES dbo.AspNetUsers (Id) ON DELETE CASCADE,
        CONSTRAINT FK_user_terrain_terrain_type FOREIGN KEY (terrain_type_id) REFERENCES dbo.terrain_type (id),
        CONSTRAINT FK_user_terrain_terrain_size FOREIGN KEY (terrain_size_id) REFERENCES dbo.terrain_size (id),
        CONSTRAINT CK_user_terrain_quantity CHECK (quantity > 0),
        CONSTRAINT UQ_user_terrain_user_type_size UNIQUE (user_id, terrain_type_id, terrain_size_id)
    );
END;
GO
