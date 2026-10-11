/*
    Terrain special rules shown when hovering a terrain name.

    terrain_type.special_rules - short plain-text summary of the gameplay effect. NULL = no special rules.
    To change a rule, UPDATE the row; no deploy needed.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod),
    at the same time as deploying the matching site build.
*/

IF COL_LENGTH(N'dbo.terrain_type', N'special_rules') IS NULL
    ALTER TABLE dbo.terrain_type ADD special_rules NVARCHAR(1000) NULL;
GO

DECLARE @tree NVARCHAR(1000) = N'Small, Medium or Large figures adjacent to a tree or underbrush roll 1 additional defense die against a non-adjacent attack. The bonus does not stack with the number of trees the figure is adjacent to.';

UPDATE dbo.terrain_type SET special_rules = v.rules
FROM dbo.terrain_type t
JOIN (VALUES
    (N'Water', N'A single-space figure that steps here must end its movement unless it has an ability that says otherwise (such as Flying or Slither). A double-space figure only stops if both its leading and non-leading ends are on water at the same time.'),
    (N'Swamp Water', N'Same as water, except movement does not stop when entering swamp water. Counts as normal water for special abilities.'),
    (N'Wellspring Water', N'Counts as water. At the beginning of a round, roll the 20-sided die for each Hero you control on Wellspring water: 12 or higher removes 1 Wound Marker from its Army Card; 1 or 2 means the Hero suffers 2 wounds.'),
    (N'Molten Lava', N'When a figure moves onto molten lava, roll the 20-sided die: 1-19 destroys the figure, 20 and it survives. A double-space figure passing through lava also rolls. Otherwise treated like water.'),
    (N'Lava Field', N'Any figure remaining on a lava field space at the end of the round rolls 1 attack die. On a skull the figure receives a wound.'),
    (N'Snow', N'The scenario sets Light Snow or Heavy Snow. Light Snow has no effect. Heavy Snow counts as 2 spaces when moving, including the last space of a flying figure. Only the tops of tiles count double, not the sides when climbing.'),
    (N'Ice', N'The scenario sets Regular Ice or Slippery Ice. Regular Ice has no effect. Slippery Ice counts as 2 spaces when moving, including the last space of a flying figure.'),
    (N'Shadow', N'Small, Medium and Large figures standing on at least one shadow space roll 1 additional defense die when defending.'),
    (N'Road', N'A figure that begins its movement on a road space (both spaces for a double-space figure) may move up to 3 additional spaces, all of which must also be road. Road, Wall Walk and Wood tiles treated as Road are interchangeable for this.'),
    (N'Wood', N'The scenario sets Wood tiles as Decking or Road. Decking has no special rules. Road lets a figure that begins on it move up to 3 additional road spaces.'),
    (N'Jungle Tree 9', @tree),
    (N'Jungle Tree 14', @tree),
    (N'Jungle Tree 15', @tree),
    (N'Toxic Land', N'A figure on a Toxic Land space subtracts 1 from its Defense Value.'),
    (N'Toxic Water', N'A figure on a Toxic Water space subtracts 2 from its Defense Value. Counts as water, but figures do not have to stop when they land on one. A figure on both Toxic Land and Toxic Water only subtracts 2.'),
    (N'Shroudshroom Young', N'Cannot be placed on 0-height tiles. Counts as a tree for special powers. Small and Medium figures within 1 space cannot determine clear sight and are not in clear sight of any figure. Destructible Object: 0 defense, 2 life. When destroyed, no replacement is placed.'),
    (N'Shroudshroom Mature', N'Cannot be placed on 0-height tiles. Counts as a tree for special powers. Small, Medium and Large figures within 1 space cannot determine clear sight and are not in clear sight of any figure. Destructible Object: 0 defense, 3 life. When destroyed, place a Young Shroudshroom on an empty space within 3 spaces if possible.'),
    (N'Shroudshroom Ancient', N'Cannot be placed on 0-height tiles. Counts as a tree for special powers. Small, Medium, Large and Huge figures within 1 space cannot determine clear sight and are not in clear sight of any figure. Destructible Object: 0 defense, 4 life. When destroyed, place a Mature Shroudshroom on an empty space within 3 spaces if possible.'),
    (N'Ship Piece', N'Ship pieces are height 9 from the outside, height 8 from the inside on the lower level, and height 2 from the inside on the upper level. Connect the lower level to enough terrain tiles to keep it stable.')
) v(name, rules) ON v.name = t.name;
GO
