/*
    Glacier terrain tile.

    Comes in single, triple, quad (4) and 6 space pieces. Swappable with the other outcrops (Rock Outcrop,
    Lava Rock Outcrop) at the same size, so it joins the 'outcrop' swap group.
    Adds the new "6 space" terrain size (no existing tile uses it).

    Idempotent: safe to run more than once.
    Run against the target database (HeroscapeBuilder_dev, then HeroscapeBuilder for prod).
*/

INSERT INTO dbo.terrain_size (name, spaces)
SELECT N'6 space', 6
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_size WHERE name = N'6 space');
GO

INSERT INTO dbo.terrain_type (name)
SELECT N'Glacier'
WHERE NOT EXISTS (SELECT 1 FROM dbo.terrain_type WHERE name = N'Glacier');
GO

UPDATE dbo.terrain_type SET swap_group = N'outcrop' WHERE name = N'Glacier';
GO

INSERT INTO dbo.terrain_type_size (terrain_type_id, terrain_size_id)
SELECT t.id, s.id
FROM dbo.terrain_type t
JOIN dbo.terrain_size s ON s.name IN (N'Single space', N'Triple space', N'Quad space', N'6 space')
WHERE t.name = N'Glacier'
  AND NOT EXISTS (SELECT 1 FROM dbo.terrain_type_size x WHERE x.terrain_type_id = t.id AND x.terrain_size_id = s.id);
GO
