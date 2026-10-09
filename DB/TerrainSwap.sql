/*
    Terrain tile swapping + Evergreen Tree 15 fix.

    1. terrain_type.swap_group / single_swap_group
       Tiles of the same size whose types share a swap group have no gameplay difference, so a user who allows
       tile swaps (AspNetUsers.AllowTileSwap) can build a map with a tile they own in place of one they lack.
         swap_group         - group used for every size. NULL = the type has special rules and is never swapped.
         single_swap_group  - overrides swap_group for single space tiles only (water / swamp water, trees, columns).
       Two tiles can swap when they are the same size and the group that applies at that size is the same and not NULL.
       Types with special rules (Snow, Water, Swamp Water, Molten Lava, Shadow, Road, Ice, Wellspring Water, Wall,
       fortress wall/base) are left NULL. Outcrops swap with each other only. To change a type, UPDATE its swap_group.

    2. AspNetUsers.AllowTileSwap - the profile setting that turns swapping on. On by default, including for
       existing accounts when the column is first added.

    3. Evergreen Tree 15 only comes in the quad base. Its single space allowance is removed and any map_tile
       (and user_terrain) quantity counted as single space is moved to quad space.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod),
    at the same time as deploying the matching site build.
*/

IF COL_LENGTH(N'dbo.terrain_type', N'swap_group') IS NULL
    ALTER TABLE dbo.terrain_type ADD swap_group NVARCHAR(30) NULL;
GO

IF COL_LENGTH(N'dbo.terrain_type', N'single_swap_group') IS NULL
    ALTER TABLE dbo.terrain_type ADD single_swap_group NVARCHAR(30) NULL;
GO

IF COL_LENGTH(N'dbo.AspNetUsers', N'AllowTileSwap') IS NULL
    ALTER TABLE dbo.AspNetUsers ADD AllowTileSwap BIT NOT NULL
        CONSTRAINT DF_AspNetUsers_AllowTileSwap DEFAULT (1);
GO

-- Plain land: swappable with each other at every size.
UPDATE dbo.terrain_type SET swap_group = N'land'
WHERE name IN (N'Grass', N'Sand', N'Rock', N'Swamp', N'Dungeon', N'Concrete', N'Asphalt', N'Lava Field');

-- Outcrops swap with each other (same size), but not with plain land.
UPDATE dbo.terrain_type SET swap_group = N'outcrop'
WHERE name LIKE N'%Outcrop';

-- Single space only: water and swamp water swap; every tree, pillar and fortress column swap.
UPDATE dbo.terrain_type SET single_swap_group = N'water'
WHERE name IN (N'Water', N'Swamp Water');

UPDATE dbo.terrain_type SET single_swap_group = N'scenery'
WHERE name IN (N'Evergreen Tree 10', N'Evergreen Tree 11', N'Evergreen Tree 12', N'Evergreen Tree 15',
               N'Jungle Tree 9', N'Jungle Tree 14', N'Jungle Tree 15', N'Fortress Column', N'Pillar');
GO

-- Evergreen Tree 15: quad base only.
DECLARE @tree INT = (SELECT id FROM dbo.terrain_type WHERE name = N'Evergreen Tree 15');
DECLARE @single INT = (SELECT id FROM dbo.terrain_size WHERE name = N'Single space');
DECLARE @quad INT = (SELECT id FROM dbo.terrain_size WHERE name = N'Quad space');

IF @tree IS NOT NULL AND @single IS NOT NULL AND @quad IS NOT NULL
BEGIN
    -- Maps that already list the quad row: add the single count to it, then drop the single row.
    UPDATE q SET q.quantity = q.quantity + s.quantity
    FROM dbo.map_tile q
    JOIN dbo.map_tile s ON s.map_id = q.map_id AND s.terrain_type_id = q.terrain_type_id
    WHERE q.terrain_type_id = @tree AND q.terrain_size_id = @quad AND s.terrain_size_id = @single;

    DELETE s FROM dbo.map_tile s
    WHERE s.terrain_type_id = @tree AND s.terrain_size_id = @single
      AND EXISTS (SELECT 1 FROM dbo.map_tile q WHERE q.map_id = s.map_id AND q.terrain_type_id = @tree AND q.terrain_size_id = @quad);

    -- Everything else: just change the size.
    UPDATE dbo.map_tile SET terrain_size_id = @quad
    WHERE terrain_type_id = @tree AND terrain_size_id = @single;

    IF OBJECT_ID(N'dbo.user_terrain', N'U') IS NOT NULL
    BEGIN
        UPDATE q SET q.quantity = q.quantity + s.quantity
        FROM dbo.user_terrain q
        JOIN dbo.user_terrain s ON s.user_id = q.user_id AND s.terrain_type_id = q.terrain_type_id
        WHERE q.terrain_type_id = @tree AND q.terrain_size_id = @quad AND s.terrain_size_id = @single;

        DELETE s FROM dbo.user_terrain s
        WHERE s.terrain_type_id = @tree AND s.terrain_size_id = @single
          AND EXISTS (SELECT 1 FROM dbo.user_terrain q WHERE q.user_id = s.user_id AND q.terrain_type_id = @tree AND q.terrain_size_id = @quad);

        UPDATE dbo.user_terrain SET terrain_size_id = @quad
        WHERE terrain_type_id = @tree AND terrain_size_id = @single;
    END;

    INSERT INTO dbo.terrain_type_size (terrain_type_id, terrain_size_id)
    SELECT @tree, @quad
    WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type_size WHERE terrain_type_id = @tree AND terrain_size_id = @quad);

    DELETE FROM dbo.terrain_type_size WHERE terrain_type_id = @tree AND terrain_size_id = @single;
END;
GO
