/*
    Terrain audit fixes (sizes, missing types, rules). Run TerrainSpecialRules.sql first.

    1. New size: 9 space (Wall Walk).
    2. Size fixes for existing types:
         Ice          + 6 space (glacier base)
         Swamp Water  + 6 space (hive base)
         Road         + 7 space, 9 space (Wall Walk)
         Wall         = 1, 2, 3, 6 space (short/long wall, connector, Marvel ruin)
    3. Sizes the reference list does not have (Wood 1; Lava Field / Concrete / Asphalt / Snow extras) are removed
       ONLY when no map_tile or user_terrain row uses them. Ones in use are kept and listed by the report at the end.
    4. New types: Jungle Tree 10 / 13 / 16 / 17, Swamp Underbrush, Snow Evergreen 10 / 12, Cannon, Rope Ladder,
       Fortified Wall. Trees and underbrush join the 'scenery' single-space swap group.
    5. Cannon / Rope Ladder / Fortified Wall rules text.

    Idempotent: safe to run more than once. Run against HeroscapeBuilder_dev first, then HeroscapeBuilder.
*/

-- 1. 9 space size
IF NOT EXISTS (SELECT 1 FROM dbo.terrain_size WHERE spaces = 9)
    INSERT INTO dbo.terrain_size (name, spaces) VALUES (N'9 space', 9);
GO

-- 4. New types (before the size work so they get their sizes in step 2)
DECLARE @tree NVARCHAR(1000) = N'Small, Medium or Large figures adjacent to a tree or underbrush roll 1 additional defense die against a non-adjacent attack. The bonus does not stack with the number of trees the figure is adjacent to.';

INSERT INTO dbo.terrain_type (name, swap_group, single_swap_group, special_rules)
SELECT v.name, NULL, N'scenery', v.rules
FROM (VALUES
    (N'Jungle Tree 10', @tree),
    (N'Jungle Tree 13', @tree),
    (N'Jungle Tree 16', @tree),
    (N'Jungle Tree 17', @tree),
    (N'Swamp Underbrush', @tree),
    (N'Snow Evergreen 10', NULL),
    (N'Snow Evergreen 12', NULL)
) v(name, rules)
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type t WHERE t.name = v.name);

INSERT INTO dbo.terrain_type (name, swap_group, single_swap_group, special_rules)
SELECT v.name, NULL, NULL, v.rules
FROM (VALUES
    (N'Cannon', N'Instead of attacking normally, a figure adjacent to a cannon that is not engaged may rotate the cannon on its space and make a Cannon Fire Special Attack: Range 8, Attack 3, Explosion 1. Measure line of sight from the barrel and range from the cannon space. Each cannon can fire once per Player Turn. Destructible Objects never roll defense dice against it.'),
    (N'Rope Ladder', N'A Small, Medium or Large single-space figure at the bottom of a rope ladder may count the distance to the space at the top as 1 level, and one at the top may count the ladder as 1 level of elevation. If the ladder ends 1 or more spaces above the space below, the figure falls the remaining distance. A figure at either end may consider itself adjacent to a figure at the other end when attacking.'),
    (N'Fortified Wall', N'Can be placed on any spaces where it fits. Cannot be placed on 0-height tiles.')
) v(name, rules)
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type t WHERE t.name = v.name);
GO

-- Jungle Tree 9 / 14 / 15 already exist; make sure the new tree names carry the same rule if re-run after edits.
-- 2. Sizes to add: (type, size spaces)
INSERT INTO dbo.terrain_type_size (terrain_type_id, terrain_size_id)
SELECT t.id, s.id
FROM (VALUES
    (N'Ice', 6), (N'Swamp Water', 6),
    (N'Road', 7), (N'Road', 9),
    (N'Wall', 1), (N'Wall', 2), (N'Wall', 3), (N'Wall', 6),
    (N'Jungle Tree 10', 1), (N'Jungle Tree 13', 1), (N'Jungle Tree 16', 1), (N'Jungle Tree 17', 1),
    (N'Swamp Underbrush', 1), (N'Snow Evergreen 10', 1), (N'Snow Evergreen 12', 1),
    (N'Cannon', 1), (N'Rope Ladder', 1), (N'Fortified Wall', 1)
) v(typeName, spaces)
JOIN dbo.terrain_type t ON t.name = v.typeName
JOIN dbo.terrain_size s ON s.spaces = v.spaces
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type_size x WHERE x.terrain_type_id = t.id AND x.terrain_size_id = s.id);
GO

-- 3. Sizes to remove, only when nothing uses them
DELETE x
FROM dbo.terrain_type_size x
JOIN dbo.terrain_type t ON t.id = x.terrain_type_id
JOIN dbo.terrain_size s ON s.id = x.terrain_size_id
JOIN (VALUES
    (N'Wood', 1),
    (N'Wall', 4), (N'Wall', 7), (N'Wall', 24),
    (N'Lava Field', 3), (N'Lava Field', 24),
    (N'Concrete', 3), (N'Concrete', 24),
    (N'Asphalt', 24),
    (N'Snow', 3), (N'Snow', 7), (N'Snow', 24)
) v(typeName, spaces) ON v.typeName = t.name AND v.spaces = s.spaces
WHERE NOT EXISTS (SELECT 1 FROM dbo.map_tile m WHERE m.terrain_type_id = x.terrain_type_id AND m.terrain_size_id = x.terrain_size_id)
  AND NOT EXISTS (SELECT 1 FROM dbo.user_terrain u WHERE u.terrain_type_id = x.terrain_type_id AND u.terrain_size_id = x.terrain_size_id);
GO

-- Report: reference-list exceptions that stayed because maps or users have them.
SELECT t.name AS terrain_type, s.name AS size_kept_because_in_use
FROM dbo.terrain_type_size x
JOIN dbo.terrain_type t ON t.id = x.terrain_type_id
JOIN dbo.terrain_size s ON s.id = x.terrain_size_id
JOIN (VALUES
    (N'Wood', 1), (N'Wall', 4), (N'Wall', 7), (N'Wall', 24),
    (N'Lava Field', 3), (N'Lava Field', 24), (N'Concrete', 3), (N'Concrete', 24),
    (N'Asphalt', 24), (N'Snow', 3), (N'Snow', 7), (N'Snow', 24)
) v(typeName, spaces) ON v.typeName = t.name AND v.spaces = s.spaces
ORDER BY t.name, s.spaces;
GO
