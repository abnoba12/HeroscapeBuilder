/*
    Maps feature - new tables.

    A map is an uploaded PDF (stored in the MinIO "maps" bucket) plus the tiles needed to build it.
    Tiles are a terrain type + terrain size + quantity. Terrain types and sizes are lookup tables so new ones
    can be added with a plain INSERT.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

IF OBJECT_ID(N'dbo.terrain_type', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.terrain_type
    (
        id    INT IDENTITY(1,1) NOT NULL,
        name  NVARCHAR(100)     NOT NULL,

        CONSTRAINT PK_terrain_type PRIMARY KEY (id),
        CONSTRAINT UQ_terrain_type_name UNIQUE (name)
    );
END;
GO

IF OBJECT_ID(N'dbo.terrain_size', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.terrain_size
    (
        id          INT IDENTITY(1,1) NOT NULL,
        name        NVARCHAR(50)      NOT NULL,
        -- Number of spaces (hexes) the tile covers; also the display order.
        spaces      INT               NOT NULL,

        CONSTRAINT PK_terrain_size PRIMARY KEY (id),
        CONSTRAINT UQ_terrain_size_name UNIQUE (name),
        CONSTRAINT CK_terrain_size_spaces CHECK (spaces > 0)
    );
END;
GO

IF OBJECT_ID(N'dbo.map', N'U') IS NULL
BEGIN
    -- creator.id is BIGINT in prod but INT in some databases; a foreign key needs the exact same type.
    -- Falls back to BIGINT (prod) if the lookup finds nothing; a NULL here would make the CREATE TABLE silently do nothing.
    DECLARE @creatorIdType NVARCHAR(20) = ISNULL((
        SELECT UPPER(t.name)
        FROM sys.columns c
        JOIN sys.types t ON t.user_type_id = c.user_type_id
        WHERE c.object_id = OBJECT_ID(N'dbo.creator') AND c.name = N'id'), N'BIGINT');

    -- There is deliberately no foreign key to dbo.creator: prod's creator primary key is (id, abbreviation), so id alone
    -- can't be referenced. Every database gets the same (FK-less) shape; creator_id is indexed and the app validates it.
    DECLARE @sql NVARCHAR(MAX) = N'
    CREATE TABLE dbo.map
    (
        id             INT IDENTITY(1,1) NOT NULL,
        name           NVARCHAR(200)     NOT NULL,
        -- Exactly one of creator_id / customer_name is set. Customers are free text and are never added to dbo.creator.
        creator_id     ' + @creatorIdType + N' NULL,
        customer_name  NVARCHAR(200)     NULL,
        player_count   INT               NOT NULL,
        -- Location of the PDF in file storage, including the bucket, e.g. /map/my-map-1a2b3c4d.pdf
        file_path      NVARCHAR(500)     NOT NULL,
        -- Location of the thumbnail image, including the bucket, e.g. /map/thumbs/my-map-1a2b3c4d.webp
        thumbnail_path NVARCHAR(500)     NOT NULL,
        created_at     DATETIME2         NOT NULL CONSTRAINT DF_map_created_at DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_map PRIMARY KEY (id),
        CONSTRAINT CK_map_player_count CHECK (player_count > 0),
        CONSTRAINT CK_map_creator_or_customer CHECK (
            (creator_id IS NOT NULL AND customer_name IS NULL)
            OR (creator_id IS NULL AND customer_name IS NOT NULL AND LEN(LTRIM(RTRIM(customer_name))) > 0))
    );
    CREATE INDEX IX_map_creator_id ON dbo.map (creator_id);';

    EXEC sys.sp_executesql @sql;
END;
GO

IF OBJECT_ID(N'dbo.map', N'U') IS NULL
    THROW 50000, N'dbo.map was not created - check the errors above.', 1;
GO

-- Databases where an earlier version of this script created the creator FK (e.g. dev) drop it so they match prod.
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_map_creator' AND parent_object_id = OBJECT_ID(N'dbo.map'))
    ALTER TABLE dbo.map DROP CONSTRAINT FK_map_creator;
GO

IF OBJECT_ID(N'dbo.map_tile', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.map_tile
    (
        id               INT IDENTITY(1,1) NOT NULL,
        map_id           INT               NOT NULL,
        terrain_type_id  INT               NOT NULL,
        terrain_size_id  INT               NOT NULL,
        quantity         INT               NOT NULL,

        CONSTRAINT PK_map_tile PRIMARY KEY (id),
        CONSTRAINT FK_map_tile_map FOREIGN KEY (map_id) REFERENCES dbo.map (id) ON DELETE CASCADE,
        CONSTRAINT FK_map_tile_terrain_type FOREIGN KEY (terrain_type_id) REFERENCES dbo.terrain_type (id),
        CONSTRAINT FK_map_tile_terrain_size FOREIGN KEY (terrain_size_id) REFERENCES dbo.terrain_size (id),
        CONSTRAINT UQ_map_tile_map_type_size UNIQUE (map_id, terrain_type_id, terrain_size_id),
        CONSTRAINT CK_map_tile_quantity CHECK (quantity > 0)
    );
END;
GO

-- Tree was renamed to Evergreen Tree 10. Rename in place so an existing database keeps the same id (and any map_tile rows stay linked).
UPDATE dbo.terrain_type
SET name = N'Evergreen Tree 10'
WHERE name = N'Tree'
  AND NOT EXISTS (SELECT 1 FROM dbo.terrain_type e WHERE e.name = N'Evergreen Tree 10');
GO

-- Seed data. Re-running only adds what is missing.
INSERT INTO dbo.terrain_type (name)
SELECT v.name
FROM (VALUES
    (N'Grass'), (N'Sand'), (N'Rock'), (N'Swamp'), (N'Dungeon'), (N'Concrete'), (N'Asphalt'),
    (N'Lava Field'), (N'Snow'), (N'Swamp Water'), (N'Water'), (N'Wellspring Water'), (N'Molten Lava'),
    (N'Ice'), (N'Shadow'), (N'Wall'), (N'Road'), (N'Fortress Wall'), (N'Fortress Base'),
    (N'Evergreen Tree 10'), (N'Evergreen Tree 11'), (N'Evergreen Tree 12'), (N'Evergreen Tree 15'),
    (N'Fortress Column')
) AS v (name)
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type t WHERE t.name = v.name);
GO

INSERT INTO dbo.terrain_size (name, spaces)
SELECT v.name, v.spaces
FROM (VALUES
    (N'Single space', 1), (N'Double space', 2), (N'Triple space', 3),
    (N'Quad space', 4), (N'5 space', 5), (N'7 space', 7), (N'24 space', 24)
) AS v (name, spaces)
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_size s WHERE s.name = v.name);
GO

-- Restricts a terrain type to the sizes it actually comes in. A type with NO rows here is allowed in every size.
IF OBJECT_ID(N'dbo.terrain_type_size', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.terrain_type_size
    (
        terrain_type_id  INT NOT NULL,
        terrain_size_id  INT NOT NULL,

        CONSTRAINT PK_terrain_type_size PRIMARY KEY (terrain_type_id, terrain_size_id),
        CONSTRAINT FK_terrain_type_size_type FOREIGN KEY (terrain_type_id) REFERENCES dbo.terrain_type (id) ON DELETE CASCADE,
        CONSTRAINT FK_terrain_type_size_size FOREIGN KEY (terrain_size_id) REFERENCES dbo.terrain_size (id) ON DELETE CASCADE
    );
END;
GO

-- Land terrain (from the official terrain chart; the chart has no quad or 5 space pieces):
--   Grass, rock, swamp and dungeon: single, double, triple, 7 and 24 space.
--   Sand: single, double, triple and 7 space.
--   Concrete, asphalt and lava field: single, double and 7 space.
--   Snow: single and double space.
-- Other types:
--   Road: single, double and 5 space (5 space exists only for road).
--   Evergreen Tree 10, 11, 12 and 15: single and quad. Shadow: single and triple. Ice: single, triple and quad.
--   Swamp water, wellspring water, water, molten lava, fortress wall, fortress base and fortress column: single only.
-- Wall is listed explicitly with every size except 5 space (a type with no rows would otherwise be allowed in 5 space too).
INSERT INTO dbo.terrain_type_size (terrain_type_id, terrain_size_id)
SELECT t.id, s.id
FROM dbo.terrain_type t
JOIN dbo.terrain_size s
  ON (t.name IN (N'Grass', N'Rock', N'Swamp', N'Dungeon')
      AND s.name IN (N'Single space', N'Double space', N'Triple space', N'7 space', N'24 space'))
  OR (t.name = N'Sand' AND s.name IN (N'Single space', N'Double space', N'Triple space', N'7 space'))
  OR (t.name IN (N'Concrete', N'Asphalt', N'Lava Field') AND s.name IN (N'Single space', N'Double space', N'7 space'))
  OR (t.name = N'Snow' AND s.name IN (N'Single space', N'Double space'))
  OR (t.name IN (N'Evergreen Tree 10', N'Evergreen Tree 11', N'Evergreen Tree 12', N'Evergreen Tree 15') AND s.name IN (N'Single space', N'Quad space'))
  OR (t.name = N'Shadow' AND s.name IN (N'Single space', N'Triple space'))
  OR (t.name = N'Ice' AND s.name IN (N'Single space', N'Triple space', N'Quad space'))
  OR (t.name IN (N'Swamp Water', N'Wellspring Water', N'Water', N'Molten Lava', N'Fortress Wall', N'Fortress Base', N'Fortress Column') AND s.name = N'Single space')
  OR (t.name = N'Wall' AND s.name <> N'5 space')
  OR (t.name = N'Road' AND s.name IN (N'Single space', N'Double space', N'5 space'))
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type_size x WHERE x.terrain_type_id = t.id AND x.terrain_size_id = s.id);
GO
