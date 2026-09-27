/*
    Point systems - moves unit points out of army_card into army_card_points.

    Every unit has a Standard value. Renegade and Delta are optional overrides and are only stored when they
    differ from Standard (a CHECK constraint enforces this), so a missing override falls back to Standard.

      Standard  - Hasbro's original points, or the printed points for units Renegade produced.
      Renegade  - Renegade's official points adjustments to original Hasbro units.
      Delta     - Community-maintained Delta points (the "Delta VC" list, which covers C3V and SoV units too).

    Seed data source: https://heroscape.org/builder/ (points_standard, points_renegade_points, points_delta_vc),
    matched to army_card by id. Cards without a match keep their current army_card.Points as Standard.

    Idempotent: safe to run more than once. Re-running refreshes the seeded values.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod), at the same time
    as deploying the matching site build - the new build no longer reads army_card.Points, which this script drops.
*/

IF OBJECT_ID(N'dbo.army_card_points', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.army_card_points
    (
        army_card_id     INT NOT NULL,
        standard_points  INT NOT NULL,
        renegade_points  INT NULL,
        delta_points     INT NULL,

        CONSTRAINT PK_army_card_points PRIMARY KEY (army_card_id),
        CONSTRAINT FK_army_card_points_army_card FOREIGN KEY (army_card_id) REFERENCES dbo.army_card (id) ON DELETE CASCADE,
        -- Overrides equal to Standard are pointless; leave them NULL so Standard is used.
        CONSTRAINT CK_army_card_points_renegade CHECK (renegade_points IS NULL OR renegade_points <> standard_points),
        CONSTRAINT CK_army_card_points_delta CHECK (delta_points IS NULL OR delta_points <> standard_points)
    );
END;
GO

-- Cards not in the seed below keep their current points as Standard. army_card.Points is dropped at the
-- end of this script, so this only runs while it still exists.
IF COL_LENGTH(N'dbo.army_card', N'Points') IS NOT NULL
BEGIN
    EXEC(N'
        INSERT INTO dbo.army_card_points (army_card_id, standard_points)
        SELECT a.id, CAST(a.Points AS INT)
        FROM dbo.army_card a
        WHERE a.Points IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM dbo.army_card_points p WHERE p.army_card_id = a.id);
    ');
END;
GO

-- (army_card_id, standard, renegade override, delta override)
MERGE dbo.army_card_points AS target
USING (
    SELECT v.army_card_id, v.standard_points, v.renegade_points, v.delta_points
    FROM (VALUES
        (   1, 100, NULL,   60),  -- Agent Carr -> Agent Carr (1.0)
        (   2, 110, NULL,  120),  -- Airborne Elite -> Airborne Elite
        (   3, 110, NULL,  115),  -- Alastair Macdirk -> Alastair MacDirk
        (   4,  75, NULL,   65),  -- Anubian Wolves -> Anubian Wolves
        (   5, 135, NULL,  125),  -- Avernus -> Avernus
        (   6, 180, NULL, NULL),  -- Axentia -> Axentia
        (   7, 145, NULL,  160),  -- Azurite Warlord -> Azurite Warlord
        (   8, 210, NULL,  215),  -- Braxas -> Braxas
        (   9, 110, NULL,   90),  -- Brunak -> Brunak
        (  10,  25, NULL,   20),  -- Swog Rider -> Swog Rider
        (  11, 210, NULL,  200),  -- Charos -> Charos
        (  12,  80, NULL,   60),  -- Concan The Kyrie Warrior -> Concan the Kyrie Warrior (1.0)
        (  13,  60, NULL,   55),  -- Deadeye Dan -> Deadeye Dan
        (  14,  40,   60,   65),  -- Deathreavers -> Deathreavers
        (  15, 100, NULL,   70),  -- Deathstalkers -> Deathstalkers
        (  16, 100, NULL,   70),  -- Deathwalker 7000 -> Deathwalker 7000
        (  17, 130, NULL,   90),  -- Deathwalker 8000 -> Deathwalker 8000
        (  18, 140, NULL,   90),  -- Deathwalker 9000 -> Deathwalker 9000
        (  19,  25, NULL,   15),  -- Dumutef Guard -> Dumutef Guard
        (  20, 110, NULL,   80),  -- Dünd -> Dünd
        (  21,  35, NULL,   25),  -- Earth Elemental -> Earth Elemental
        (  22,  30, NULL,   35),  -- Eldgrim The Viking Champion -> Eldgrim the Viking Champion
        (  23,  90, NULL,   70),  -- Empress Kiova -> Empress Kiova
        (  24,  80, NULL, NULL),  -- Finn The Viking Champion -> Finn the Viking Champion
        (  25,  55, NULL,   50),  -- Goblin Slashers -> Goblin Slashers
        (  26, 120,  160,  165),  -- Grimnak -> Grimnak
        (  27,  60, NULL, NULL),  -- Izumi Samurai -> Izumi Samurai
        (  28,  65, NULL,   55),  -- Johnny Shotgun Sullivan -> Johnny "Shotgun" Sullivan
        (  29, 225, NULL,  200),  -- Jotun -> Jotun
        (  30, 120, NULL,  135),  -- Kaemon Awa -> Kaemon Awa
        (  31, 120, NULL,  190),  -- Kantono Daishi -> Kantono Daishi
        (  32, 130, NULL,   80),  -- Kee-Mo-Shi -> Kee-Mo-Shi
        (  33,  45, NULL,   40),  -- Koggo -> Koggo
        (  34, 100, NULL,  125),  -- Krav Maga Agents -> Krav Maga Agents
        (  35, 120, NULL,  125),  -- Krug -> Krug
        (  36,  80,   65,   75),  -- Macdirk Warriors -> MacDirk Warriors
        (  37, 150, NULL,  170),  -- Major Q10 -> Major Q10
        (  38, 180,  250,  260),  -- Major Q9 -> Major Q9
        (  39, 100, NULL,  110),  -- Marcus Decimus Gallus -> Marcus Decimus Gallus
        (  40,  30, NULL,   35),  -- Marrden Nagrubs -> Marrden Nagrubs
        (  41,  50, NULL,   45),  -- Marro Drudge -> Marro Drudge
        (  42, 160, NULL,  130),  -- Marro Hive -> Marro Hive
        (  43,  60, NULL,   80),  -- Marro Stingers -> Marro Stingers
        (  44,  50,  105,  110),  -- Marro Warriors -> Marro Warriors
        (  45, 150, NULL,  170),  -- Mimring -> Mimring
        (  46,  90, NULL, NULL),  -- Ne-Gok-Sa -> Ne-Gok-Sa
        (  47,  50, NULL,   75),  -- Nerak The Glacian Swog Rider -> Nerak the Glacian Swog Rider
        (  48, 185,  240,  250),  -- Nilfheim -> Nilfheim
        (  49, 100, NULL,   90),  -- Omnicron Snipers -> Omnicron Snipers
        (  50, 100, NULL,   60),  -- Ornak -> Ornak
        (  51,  95, NULL, NULL),  -- Pel The Hill Giant -> Pel the Hill Giant
        (  52,  80,  125,  140),  -- Raelin The Kyrie Warrior -> Raelin the Kyrie Warrior (1.0)
        (  53, 120, NULL,  100),  -- Raelin The Kyrie Warrior -> Raelin the Kyrie Warrior (2.0)
        (  54,  90, NULL,   55),  -- Retiarius -> Retiarius
        (  55, 100, NULL, NULL),  -- Syvarris -> Syvarris (1.0)
        (  56,  55, NULL,   40),  -- Roman Archers -> Roman Archers
        (  57,  50, NULL,   70),  -- Roman Legionnaires -> Roman Legionnaires
        (  58, 120, NULL,  100),  -- Runa -> Runa
        (  59,  80, NULL,   40),  -- Saylind The Kyrie Warrior -> Saylind the Kyrie Warrior
        (  60, 110, NULL,  100),  -- Sgt. Drake Alexander -> Sgt. Drake Alexander (1.0)
        (  61, 170, NULL,  145),  -- Sgt. Drake Alexander -> Sgt. Drake Alexander (2.0)
        (  62,  60, NULL,   35),  -- Shiori -> Shiori (1.0)
        (  63, 160, NULL,  125),  -- Sonlen -> Sonlen (1.0)
        (  64, 160, NULL,  120),  -- Su-Bak-Na -> Su-Bak-Na
        (  65,  85, NULL,   60),  -- Suskra -> Suskra
        (  66,  50, NULL,   45),  -- Tarn Viking Warriors -> Tarn Viking Warriors
        (  67,  40, NULL,   35),  -- Theracus -> Theracus
        (  68,  80, NULL,   75),  -- Thorgrim The Viking Champion -> Thorgrim the Viking Champion
        (  69, 220, NULL, NULL),  -- Tor-Kul-Na -> Tor-Kul-Na
        (  70, 100, NULL,   70),  -- Tornak -> Tornak
        (  71,  40, NULL, NULL),  -- Venoc Vipers -> Venoc Vipers
        (  72,  50, NULL,   60),  -- Warriors Of Ashra -> Warriors of Ashra
        (  73,  30, NULL,   35),  -- Water Elemental -> Water Elemental
        (  74, 140, NULL, NULL),  -- Wildwood Monarch -> Wildwood Monarch
        (  75,  40, NULL,   50),  -- Wildwood Runner -> Wildwood Runner
        (  76, 100, NULL,   85),  -- Wildwood Sentinel -> Wildwood Sentinel
        (  77, 140, NULL,  130),  -- Z'thoth Mouth Of The Abyss -> Z'Thoth, Mouth of the Abyss
        (  78,  70, NULL,   50),  -- Zettian Guards -> Zettian Guards
        (  81,  60, NULL, NULL),  -- Zombies Of Morindan -> Zombies of Morindan
        (  82,  60, NULL,   70),  -- Zetacron -> Zetacron
        (  83, 185, NULL,  195),  -- Zelrig -> Zelrig
        (  84, 100, NULL,   80),  -- Wyvern -> Wyvern
        (  85, 135, NULL,   85),  -- Wo-Sa-Ga -> Wo-Sa-Ga
        (  86,  80, NULL,   65),  -- Wolves Of Badru -> Wolves of Badru
        (  87,  30, NULL, NULL),  -- White Wyrmling -> White Wyrmling
        (  88, 140, NULL,  100),  -- Werewolf Lord -> Werewolf Lord
        (  89,  80, NULL,   75),  -- Warforged Soldiers -> Warforged Soldiers
        (  90,  90, NULL,   75),  -- Warden 816 -> Warden 816
        (  91, 150, NULL,  165),  -- Venom -> Venom
        (  92, 120, NULL,  100),  -- Venoc Warlord -> Venoc Warlord
        (  94, 110, NULL,   85),  -- Valguard -> Valguard
        (  95, 150, NULL,  130),  -- Ulginesh -> Ulginesh
        (  96, 130, NULL,   70),  -- Tul-Bak-Ra -> Tul-Bak-Ra
        (  97, 120, NULL,   70),  -- Torin -> Torin
        (  98, 140, NULL,  100),  -- The Einar Imperium -> The Einar Imperium
        (  99,  70, NULL,   90),  -- The Axegrinders Of Burning Forge -> The Axegrinders of Burning Forge
        ( 100, 360, NULL,  390),  -- Thanos -> Thanos
        ( 101, 120, NULL,   95),  -- Templar Cavalry -> Templar Cavalry
        ( 102, 120, NULL,  100),  -- Tandros Kreel -> Tandros Kreel
        ( 103, 120, NULL,   95),  -- Tagawa Samurai -> Tagawa Samurai
        ( 104,  65, NULL, NULL),  -- Tagawa Samurai Archers -> Tagawa Samurai Archers
        ( 105, 180, NULL,  160),  -- Taelord The Kyrie Warrior -> Taelord the Kyrie Warrior (1.0)
        ( 106, 185, NULL,  140),  -- Sujoah -> Sujoah
        ( 107, 140, NULL,  115),  -- Sudema -> Sudema (1.0)
        ( 108, 160, NULL,  155),  -- Spider-Man -> Spider-Man
        ( 109, 200, NULL,  210),  -- Spartacus -> Spartacus
        ( 110, 110, NULL, NULL),  -- M.a.r.s. -> M.A.R.S.
        ( 111,  45, NULL, NULL),  -- Sonya Esenwein -> Sonya Esenwein
        ( 112,  90, NULL,   85),  -- Sir Hawthorne -> Sir Hawthorne
        ( 113, 105,  150,  150),  -- Sir Gilbert -> Sir Gilbert
        ( 114, 150, NULL,   70),  -- Sir Dupuis -> Sir Dupuis
        ( 115, 100, NULL,   60),  -- Sir Denrick -> Sir Denrick
        ( 116, 320, NULL,  370),  -- Silver Surfer -> Silver Surfer
        ( 117, 120, NULL,   80),  -- Siege -> Siege
        ( 118, 160, NULL,  125),  -- Shurrak -> Shurrak
        ( 120, 110, NULL,   75),  -- Sharwin Wildborn -> Sharwin Wildborn
        ( 121,  80, NULL,   70),  -- Shaolin Monks -> Shaolin Monks
        ( 122, 100, NULL,   80),  -- Shades Of Bleakwoode -> Shades of Bleakewoode
        ( 123, 110, NULL,   90),  -- Sentinels Of Jandar -> Sentinels of Jandar
        ( 125,  25, NULL,   10),  -- Sahuagin Raider -> Sahuagin Raider
        ( 126,  50, NULL,   65),  -- Sacred Band -> Sacred Band
        ( 127, 110, NULL,   85),  -- Rhogar Dragonspine -> Rhogar Dragonspine
        ( 128,  30, NULL,   35),  -- Red Wyrmling -> Red Wyrmling
        ( 129, 190, NULL,  160),  -- Red Skull -> Red Skull
        ( 130,  50, NULL,   40),  -- Rechets Of Bogdan -> Rechets of Bogdan
        ( 131, 100, NULL,   70),  -- Quasatch Hunters -> Quasatch Hunters
        ( 132, 110, NULL,   95),  -- Protectors Of Ullar -> Protectors of Ullar
        ( 133,  70, NULL,   80),  -- Phantom Knights -> Phantom Knights
        ( 134, 100, NULL,   40),  -- Pelloth -> Pelloth
        ( 135,  90, NULL,   65),  -- Parmenio -> Parmenio
        ( 136,  10, NULL, NULL),  -- Otonashi -> Otonashi
        ( 137, 140, NULL,   85),  -- Othkurik The Black Dragon -> Othkurik The Black Dragon
        ( 138,  40, NULL, NULL),  -- Omnicron Repulsors -> Omnicron Repulsors
        ( 139, 150, NULL,  130),  -- Ogre Warhulk -> Ogre Warhulk
        ( 140, 100, NULL,   95),  -- Ogre Pulverizer -> Ogre Pulverizer
        ( 141, 100, NULL,   60),  -- Obsidian Guards -> Obsidian Guards
        ( 142, 110, NULL,   70),  -- Ninjas Of The Northern Wind -> Ninjas of the Northern Wind
        ( 144, 120, NULL,  105),  -- Nakita Agents -> Nakita Agents
        ( 145, 100, NULL,   90),  -- Morsbane -> Morsbane
        ( 146, 110, NULL,   65),  -- Moriko -> Moriko
        ( 147, 170, NULL, NULL),  -- Moltenclaw -> Moltenclaw
        ( 148,  70, NULL, NULL),  -- Mohican River Tribe -> Mohican River Tribe
        ( 149, 120, NULL,  135),  -- Mogrimm Forgehammer -> Mogrimm Forgehammer
        ( 150, 110, NULL,   95),  -- Minions Of Utgar -> Minions of Utgar
        ( 151, 100, NULL,   70),  -- Mind Flayer Mastermind -> Mind Flayer Mastermind
        ( 152, 110, NULL,   55),  -- Mika Connour -> Mika Connour
        ( 153, 110, NULL,   95),  -- Migol Ironwill -> Migol Ironwill
        ( 154, 100, NULL,  110),  -- Microcorp Agents -> Microcorp Agents
        ( 155,  65, NULL,   75),  -- Mezzodemon Warmongers -> Mezzodemon Warmongers
        ( 156,  50,   70,   80),  -- Me-Burq-Sa -> Me-Burq-Sa
        ( 157, 140, NULL,  125),  -- Master Win Chiu Woo -> Master Win Chiu Woo
        ( 158, 140, NULL,  100),  -- Master Of The Hunt -> Master of the Hunt
        ( 159,  50, NULL,   55),  -- Marro Drones -> Marro Drones
        ( 160,  50, NULL,   60),  -- Marro Dividers -> Marro Dividers
        ( 161,  90, NULL,   95),  -- Marrden Hounds -> Marrden Hounds
        ( 163,  20, NULL,   30),  -- Marcu Esenwein -> Marcu Esenwein
        ( 164, 100, NULL,   75),  -- Major X17 -> Major X17
        ( 165, 110, NULL,  115),  -- Laglor -> Laglor
        ( 166,  20, NULL, NULL),  -- Kyntela Gwyn -> Kyntela Gwyn
        ( 167, 120, NULL,   70),  -- Kurrok The Elementalist -> Kurrok the Elementalist
        ( 168,  80, NULL,   55),  -- Kumiko -> Kumiko
        ( 169, 100, NULL,   80),  -- Kozuke Samurai -> Kozuke Samurai
        ( 170,  70,   80,   85),  -- Knights Of Weston -> Knights of Weston
        ( 171,  75, NULL,   55),  -- Khosumet The Darklord -> Khosumet the Darklord
        ( 172,  80, NULL,   70),  -- Kelda The Kyrie Warrior -> Kelda the Kyrie Warrior
        ( 173, 200, NULL,  170),  -- Kato Katsuro -> Kato Katsuro
        ( 174, 100, NULL,   85),  -- Jorhdawn -> Jorhdawn
        ( 176,  75, NULL,   60),  -- James Murphy -> James Murphy
        ( 177,  50, NULL,   35),  -- Iskra Esenwein -> Iskra Esenwein
        ( 178,  10, NULL,   20),  -- Isamu -> Isamu (1.0)
        ( 179, 240, NULL, NULL),  -- Iron Man -> Iron Man
        ( 180, 100, NULL,   70),  -- Iron Golem -> Iron Golem
        ( 181, 370, NULL,  350),  -- Incredible Hulk -> Incredible Hulk
        ( 182,  85, NULL,   90),  -- Ice Troll Berserker -> Ice Troll Berserker
        ( 183,  75, NULL,   70),  -- Horned Skull Brutes -> Horned Skull Brutes
        ( 184,  90, NULL, NULL),  -- Heirloom -> Heirloom
        ( 185,  70, NULL,   90),  -- Heavy Gruts -> Heavy Gruts
        ( 186, 130, NULL,  110),  -- Hatamoto Taro -> Hatamoto Taro
        ( 187, 100, NULL,   45),  -- Gurei-Oni -> Gurei-Oni
        ( 188,  30, NULL,   45),  -- Guilty Mccreech -> Guilty McCreech (1.0)
        ( 189, 130, NULL,   60),  -- Grok Riders -> Grok Riders
        ( 190,  60, NULL,   70),  -- Greenscale Warriors -> Greenscale Warriors
        ( 191, 130, NULL,   75),  -- Greater Ice Elemental -> Greater Ice Elemental
        ( 192, 100, NULL,   80),  -- Granite Guardians -> Granite Guardians
        ( 193,  90, NULL,   75),  -- Gorillinators -> Gorillinators
        ( 194,  50, NULL,   60),  -- Goblin Cutters -> Goblin Cutters
        ( 195,  80, NULL,   90),  -- Gladiatrons -> Gladiatrons
        ( 196,  40, NULL,   50),  -- Fyorlag Spiders -> Fyorlag Spiders
        ( 197, 140, NULL,  100),  -- Frost Giant Of Morh -> Frost Giant of Morh
        ( 198,  35, NULL,   40),  -- Fire Elemental -> Fire Elemental
        ( 199,  90, NULL,   80),  -- Feral Troll -> Feral Troll
        ( 200, 120, NULL,  135),  -- Fen Hydra -> Fen Hydra
        ( 201, 110, NULL,   80),  -- Evar Scarcarver -> Evar Scarcarver
        ( 202,  80, NULL,   60),  -- Estivara -> Estivara
        ( 203,  80, NULL,   45),  -- Erevan Sunshadow -> Erevan Sunshadow
        ( 204,  80, NULL,   50),  -- Emirroon -> Emirroon
        ( 205, 140, NULL,  145),  -- Eltahale -> Eltahale
        ( 206, 100, NULL,   70),  -- Elite Onyx Vipers -> Elite Onyx Vipers
        ( 208,  75, NULL,   60),  -- Dzu-Teh -> Dzu-Teh
        ( 209,  25, NULL, NULL),  -- Drow Chainfighter -> Drow Chainfighter
        ( 210, 245, NULL,  195),  -- Doctor Doom -> Doctor Doom
        ( 211,  70, NULL,   60),  -- Deepwyrm Drow -> Deepwyrm Drow
        ( 212,  60, NULL,   50),  -- Death Knights Of Valkrill -> Death Knights of Valkrill
        ( 213,  55, NULL,   65),  -- Death Chasers Of Thesk -> Death Chasers of Thesk
        ( 214,  60, NULL,   70),  -- Darrak Ambershard -> Darrak Ambershard
        ( 215, 150, NULL,  160),  -- Cyprien Esenwein -> Cyprien Esenwein
        ( 216,  90, NULL,  100),  -- Crixus -> Crixus
        ( 218,  90, NULL,   65),  -- Chardris -> Chardris
        ( 219,  70, NULL,   65),  -- Capuan Gladiators -> Capuan Gladiators
        ( 220, 220, NULL,  270),  -- Captain America -> Captain America
        ( 223,  70,  100,  115),  -- 4th Massachusetts Line -> 4th Massachusetts Line
        ( 224,  50, NULL,   40),  -- Brave Arrow -> Brave Arrow
        ( 225,  90, NULL,   60),  -- Brandis Skyhunter -> Brandis Skyhunter
        ( 226,  90, NULL,  100),  -- Atlaga The Kyrie Warrior -> Atlaga the Kyrie Warrior
        ( 227,  30, NULL,   35),  -- Black Wyrmling -> Black Wyrmling
        ( 228,  60, NULL,   80),  -- Blastatrons -> Blastatrons
        ( 229,  40, NULL,   60),  -- Blade Gruts -> Blade Gruts
        ( 230,  70, NULL,   75),  -- Aubrien Archers -> Aubrien Archers
        ( 231,  65, NULL,   60),  -- Bugbear Basher -> Bugbear Basher
        ( 232,  40, NULL,   30),  -- Ashigaru Yari -> Ashigaru Yari
        ( 233,  60, NULL,   80),  -- Ashigaru Harquebus -> Ashigaru Harquebus
        ( 234,  40, NULL,   45),  -- Arrow Gruts -> Arrow Gruts
        ( 235,  75, NULL,  110),  -- Cathar Spearmen -> Cathar Spearmen
        ( 236,  65, NULL,   55),  -- Armoc Vipers -> Armoc Vipers
        ( 237,  50, NULL,   40),  -- Arkmer -> Arkmer
        ( 238, 100, NULL,   90),  -- Ana Karithon -> Ana Karithon
        ( 239,  30, NULL, NULL),  -- Air Elemental -> Air Elemental
        ( 240, 120, NULL,   90),  -- Agent Skahen -> Agent Skahen
        ( 241, 110, NULL,   80),  -- Acolarh -> Acolarh
        ( 242,  75,   95,  110),  -- 10th Regiment Of Foot -> 10th Regiment of Foot
        ( 243, 320, NULL,  300),  -- Abomination -> Abomination
        ( 244, 170, NULL,  130),  -- Admiral Ej-1m -> Admiral EJ-1M
        ( 245, 100, NULL,   95),  -- Dorim the Bulkhead Brawler -> Dorim the Bulkhead Brawler
        ( 246,  75, NULL,   95),  -- Exiles Of The Sundered Sea -> Exiles of the Sundered Sea
        ( 247, 120, NULL, NULL),  -- Frostclaw Paladins -> Frostclaw Paladins
        ( 248,  65, NULL,   55),  -- Knaves Of The Silver Scimitar -> Knaves of the Silver Scimitar
        ( 249, 110, NULL,  100),  -- Knight Irene -> Knight Irene
        ( 250,  80, NULL,   75),  -- Loviatäk The Kyrie Warrior -> Loviatäk the Kyrie Warrior
        ( 251,  50, NULL,   45),  -- Misaerx The Kyrie Warrior -> Misaerx the Kyrie Warrior
        ( 252, 100, NULL,   80),  -- Raakchott, Steward Of Death -> Raakchott, Steward of Death
        ( 253, 100, NULL, NULL),  -- Raelin The Kyrie Warrior -> Raelin the Kyrie Warrior (3.0)
        ( 254, 135, NULL, NULL),  -- Sgt. Drake Alexander -> Sgt. Drake Alexander (3.0)
        ( 255, 200, NULL,  180),  -- Xenithrax The Vineweaver -> Xenithrax the Vineweaver
        ( 256, 105, NULL,   95),  -- Gorillitroopers -> Gorillitroopers
        ( 257, 130, NULL, NULL),  -- Zaeus -> Zaeus
        ( 258,  35, NULL,   30),  -- 8th Infantry Pathfinder -> 8th Infantry Pathfinder
        ( 259,  60, NULL,   55),  -- 12th Caucasus Rifles -> 12th Caucasus Rifles
        ( 260,  60, NULL,   50),  -- 20th Maine Volunteers -> 20th Maine Volunteers
        ( 261,  55, NULL,   50),  -- 53rd North Carolina Sharpshooters -> 53rd North Carolina Sharpshooters
        ( 262,  50, NULL,   40),  -- Acolytes Of Vorganund -> Acolytes of Vorganund
        ( 263, 110, NULL, NULL),  -- Akumaken -> Akumaken
        ( 264,  50, NULL,   45),  -- Amberhive Protectors -> Amberhive Protectors
        ( 265, 200, NULL,  110),  -- Arashara Goshiri -> Arashara Goshiri
        ( 266,  40, NULL,   30),  -- Achillean Gladiatrix -> Achillean Gladiatrix
        ( 267,  95, NULL,  120),  -- Arktos -> Arktos
        ( 268,  70, NULL,   60),  -- Arthur Of Sherwood -> Arthur of Sherwood
        ( 269, 160, NULL,  110),  -- Ataraxis The Starlich -> Ataraxis the Starlich
        ( 270, 155, NULL,  140),  -- Augamo -> Augamo
        ( 271, 140, NULL,  175),  -- Azazel The Kyrie Warrior -> Azazel the Kyrie Warrior
        ( 272, 110, NULL,  120),  -- B-11 Resistance Corps -> B-11 Resistance Corps
        ( 273, 120, NULL,  100),  -- Bahadur -> Bahadur
        ( 274,  70, NULL,   65),  -- Banshees Of Durgeth Swamp -> Banshees of Durgeth Swamp
        ( 275,  50, NULL, NULL),  -- Beorn Boltcutter -> Beorn Boltcutter
        ( 276,  30, NULL,   25),  -- Bloodburst Thrall -> Bloodburst Thrall
        ( 277, 125, NULL,  100),  -- Bok-Bur-Na -> Bok-Bur-Na
        ( 278, 115, NULL,   95),  -- Ewashia, Master of Tides -> Ewashia, Master of Tides
        ( 279,  80, NULL, NULL),  -- Fia Bonny The Void Siren -> Fia Bonny the Void Siren
        ( 280,  80, NULL,   70),  -- Killian Vane Iii -> Killian Vane III
        ( 281,  30, NULL,   25),  -- Kita The Springrunner -> Kita the Springrunner
        ( 282,  50, NULL,   40),  -- Onshu The Welkineye -> Onshu the Welkineye
        ( 283, 110, NULL,   75),  -- Shiori -> Shiori (2.0)
        ( 284, 115, NULL,  130),  -- Boreos -> Boreos
        ( 285, 230, NULL,  220),  -- Bramcephys -> Bramcephys
        ( 286, 145, NULL,  125),  -- Breach -> Breach
        ( 287, 175, NULL,  140),  -- Brontos -> Brontos
        ( 288,  65, NULL,  105),  -- Brute Gruts -> Brute Gruts
        ( 289,  70, NULL,   65),  -- Buccaneers Of Tortuga -> Buccaneers of Tortuga
        ( 290,  60, NULL, NULL),  -- Cal The Smuggler -> Cal the Smuggler
        ( 291, 130, NULL,  110),  -- Calibrax The Kyrie Warrior -> Calibrax the Kyrie Warrior
        ( 292,  80, NULL,   75),  -- Capt. John Varan -> Capt. John Varan
        ( 294,  90, NULL,   60),  -- Chen Tang -> Chen Tang
        ( 295,  50, NULL,   40),  -- Clawfoot Interceptor -> Clawfoot Interceptor
        ( 296,  35, NULL,   15),  -- Command Courier -> Command Courier
        ( 297, 175, NULL, NULL),  -- Corvor The Tainted One -> Corvor the Tainted One
        ( 298,  90, NULL,   80),  -- Count Raymond -> Count Raymond
        ( 299,  60, NULL, NULL),  -- Crypt Guardian -> Crypt Guardian
        ( 300,  30, NULL,   20),  -- Darkprowl Thrall -> Darkprowl Thrall
        ( 301, 130, NULL,  120),  -- Deathcommander Mark 3 -> Deathcommander Mark 3
        ( 302,  30, NULL,   20),  -- Deathstrike Thrall -> Deathstrike Thrall
        ( 303,  90, NULL,   75),  -- Deltacron -> Deltacron
        ( 304,  65, NULL, NULL),  -- Dreadgul Raiders -> Dreadgul Raiders
        ( 305,  65, NULL,   50),  -- Durgeth Ravagers -> Durgeth Ravagers
        ( 306, 125, NULL,  100),  -- Ebon Armor -> Ebon Armor
        ( 307,  40, NULL,   35),  -- Eilan Sidhe -> Eilan Sidhe
        ( 308,  60, NULL,   55),  -- Elaria The Pale -> Elaria the Pale
        ( 309, 130, NULL,  100),  -- Emperor Andask -> Emperor Andask
        ( 310,  55, NULL,   40),  -- Father Caylus -> Father Caylus
        ( 311,  70, NULL,   55),  -- Garrett Burns -> Garrett Burns
        ( 312,  45, NULL,   50),  -- Gen. Simon Fraser -> Gen. Simon Fraser
        ( 313, 130, NULL,  105),  -- Gothlok -> Gothlok
        ( 314, 170, NULL,  120),  -- Grigor & Rogirg -> Grigor & Rogirg
        ( 315, 100, NULL,  110),  -- Haduc -> Haduc
        ( 316,  90, NULL,   95),  -- Havech Eradicators -> Havech Eradicators
        ( 317, 200, NULL,  220),  -- Heracles -> Heracles
        ( 318, 100, NULL,  105),  -- Himmelskralle -> Himmelskralle
        ( 319,  65, NULL,   60),  -- Honor Guard Of The Blasted Lands -> Honor Guard of the Blasted Lands
        ( 320, 205, NULL,  160),  -- Hrognak -> Hrognak (2.0)
        ( 321,  70, NULL,   65),  -- Josie Whistlestop -> Josie Whistlestop
        ( 322, 190, NULL,  165),  -- Kalagrith -> Kalagrith
        ( 323,  30, NULL, NULL),  -- Kira Jax -> Kira Jax
        ( 324, 120, NULL,  105),  -- Knights Of Blackgaard -> Knights of Blackgaard
        ( 325, 130, NULL,  115),  -- Kozil -> Kozil
        ( 326,  55, NULL, NULL),  -- Kursus -> Kursus
        ( 327,  70, NULL,   90),  -- Kuthnak -> Kuthnak
        ( 328, 130, NULL,  105),  -- Locksley -> Locksley
        ( 329,  60, NULL,   70),  -- Louis Mad Dog Malone -> Louis "Mad Dog" Malone
        ( 330,  65, NULL,   50),  -- M-43 Resistance Fighters -> M-43 Resistance Fighters
        ( 331, 115, NULL, NULL),  -- Maekor -> Maekor
        ( 332,  95, NULL,  105),  -- Major J15 -> Major J15
        ( 333,  35, NULL, NULL),  -- Makwa Tribesman -> Makwa Tribesman
        ( 334, 110, NULL,   70),  -- Manauvi -> Manauvi
        ( 335,  50, NULL,   40),  -- Marro Gnids -> Marro Gnids
        ( 336,  70, NULL,   45),  -- Martial La Hire -> Martial La Hire
        ( 337, 195, NULL,  180),  -- Marutuk -> Marutuk
        ( 338, 130, NULL, NULL),  -- Master Lao Xin -> Master Lao Xin
        ( 339, 100, NULL, NULL),  -- Mellifera -> Mellifera
        ( 340,  80, NULL,  100),  -- Microcorp Troopers -> Microcorp Troopers
        ( 341, 105, NULL,   85),  -- Millerson -> Millerson
        ( 342, 220, NULL,  160),  -- Mok -> Mok
        ( 343,  60, NULL,   65),  -- Morgan's Riflemen -> Morgan's Riflemen
        ( 344, 140, NULL,  160),  -- Morgoloth -> Morgoloth
        ( 345, 135, NULL,  130),  -- Motley Max -> Motley Max
        ( 346,  90, NULL,   80),  -- Myrddin -> Myrddin
        ( 347,  80, NULL, NULL),  -- Nhah Scirh Cultists -> Nhah Scirh Cultists
        ( 348, 140, NULL, NULL),  -- Nicholas Esenwein -> Nicholas Esenwein
        ( 349,  35, NULL,   25),  -- Nottingham Brigand -> Nottingham Brigand
        ( 350, 180, NULL, NULL),  -- Omegacron -> Omegacron
        ( 351,  45, NULL,   40),  -- Otar -> Otar
        ( 352,  40, NULL,   35),  -- Patrick Ferguson -> Patrick Ferguson
        ( 353,  30, NULL,   15),  -- Preyblood Thrall -> Preyblood Thrall
        ( 354, 190, NULL,  260),  -- Quahon -> Quahon
        ( 356, 140, NULL,  135),  -- Racheim -> Racheim
        ( 357, 140, NULL,   90),  -- Ranjit Singh -> Ranjit Singh
        ( 358,  80, NULL,   75),  -- Red Mantis Blade Dancers -> Red Mantis Blade Dancers
        ( 359,  80, NULL, NULL),  -- Re-Tak-Shi -> Re-Tak-Shi
        ( 360,  90, NULL,  100),  -- Rygarn -> Rygarn
        ( 361,  35, NULL, NULL),  -- Seleena -> Seleena
        ( 362, 100, NULL, NULL),  -- Sentinels Of Grax -> Sentinels of Grax
        ( 363,  80, NULL,   65),  -- Shieldsmiths Of Granite Keep -> Shieldsmiths of Granite Keep
        ( 365,  50, NULL,   40),  -- Sir Orrick -> Sir Orrick
        ( 366, 105, NULL,   90),  -- Skeletons Of Annellintia -> Skeletons of Annellintia
        ( 367,  65, NULL, NULL),  -- Skull Demon -> Skull Demon
        ( 368, 100, NULL, NULL),  -- Talingul -> Talingul
        ( 369,  70, NULL,   75),  -- Teeth Of The Makwa -> Teeth of the Makwa
        ( 370, 160, NULL,  170),  -- The Varja -> The Varja
        ( 371,  30, NULL,   25),  -- Tomb Skeleton Archers -> Tomb Skeleton Archers
        ( 372,  40, NULL,   25),  -- Tomb Skeletons -> Tomb Skeletons
        ( 373,  25, NULL,   20),  -- Tombstone Gunslinger -> Tombstone Gunslinger
        ( 374, 110, NULL,   80),  -- Tomoe Gozen -> Tomoe Gozen
        ( 375, 100, NULL,  105),  -- Ulfrid Hornwrangler -> Ulfrid Hornwrangler
        ( 376, 105, NULL, NULL),  -- Van Nessing -> Van Nessing
        ( 377,  80, NULL,   70),  -- Varkaanan Blade Dancers -> Varkaanan Blade Dancers
        ( 378, 120, NULL,  110),  -- Varkaanan Darkclaws -> Varkaanan Darkclaws
        ( 379, 110, NULL,  140),  -- Varkaanan Greyspears -> Varkaanan Greyspears
        ( 380, 100, NULL, NULL),  -- Varkaanan Quickblades -> Varkaanan Quickblades
        ( 381,  80, NULL,  100),  -- Varkaanan Swiftfangs -> Varkaanan Swiftfangs
        ( 382, 180, NULL,  210),  -- Vulcanmech Incendiborgs -> Vulcanmech Incendiborgs
        ( 383,  90, NULL, NULL),  -- Wastewalker Gage -> Wastewalker Gage
        ( 384,  55, NULL, NULL),  -- Xualtiaca Fire Ants -> Xualtiaca Fire Ants
        ( 385,  60, NULL,   45),  -- Yi Feng -> Yi Feng
        ( 386,  50, NULL,   45),  -- Zettian Deathwings -> Zettian Deathwings
        ( 387,  70, NULL,   50),  -- Zhen Yuan -> Zhen Yuan
        ( 388, 120, NULL,  110),  -- Zogross Hardscale -> Zogross Hardscale
        ( 389, 110, NULL,   90),  -- Tyrian The Kyrie Warrior -> Tyrian the Kyrie Warrior
        ( 390,  60, NULL,   40),  -- Zombie Hulk -> Zombie Hulk
        ( 391,  35, NULL,   25),  -- Blue Wyrmling -> Blue Wyrmling
        ( 392,  65, NULL, NULL),  -- Zettian Infantry -> Zettian Infantry
        ( 393, 150, NULL,   70),  -- Xundar -> Xundar
        ( 394, 130, NULL,  110),  -- Viceron The Blood Knight -> Viceron the Blood Knight
        ( 395, 110, NULL,   85),  -- Uzog -> Uzog
        ( 396,  65, NULL,   30),  -- Urk -> Urk
        ( 398, 110, NULL,   95),  -- Tetraites -> Tetraites
        ( 399,  50, NULL, NULL),  -- Swaysil -> Swaysil
        ( 400,  60, NULL, NULL),  -- Specters Of Aldorn -> Specters of Aldorn
        ( 402,  50, NULL, NULL),  -- Soontir Van -> Soontir Van
        ( 403,  35, NULL,   30),  -- Shadow Hound -> Shadow Hound
        ( 404,  35, NULL,   30),  -- Shadow Fiend -> Shadow Fiend
        ( 405,  25, NULL,   20),  -- Shadow Binder -> Shadow Binder
        ( 406,  85, NULL,   70),  -- Rendar Fy -> Rendar Fy
        ( 407,  40, NULL, NULL),  -- Red Ants Of Aunstrom -> Red Ants of Aunstrom
        ( 408, 100, NULL,   55),  -- Priscus -> Priscus
        ( 409,  80, NULL,   55),  -- Prince Al'kahora -> Prince al'Kahora
        ( 410,  35, NULL, NULL),  -- Olog -> Olog
        ( 411, 115, NULL,   90),  -- Ashi-Dhulu -> Ashi-Dhulu
        ( 412, 140, NULL,   60),  -- Cxurg'gyath -> Cxurg'gyath
        ( 413, 115, NULL,  105),  -- Executioner 616 -> Executioner 616
        ( 414, 120, NULL,  130),  -- Asterios -> Asterios
        ( 415,  35, NULL,   30),  -- Hoplitron -> Hoplitron
        ( 416, 100, NULL,   80),  -- Jarek Guy -> Jarek Guy
        ( 417,  40, NULL,   45),  -- Kate Crawford -> Kate Crawford
        ( 418,  75, NULL,   65),  -- Kha -> Kha
        ( 419, 150, NULL, NULL),  -- Kon-Tar-Na -> Kon-Tar-Na
        ( 420, 115, NULL,  105),  -- Lilja -> Lilja
        ( 421,  35, NULL,   30),  -- Maltis Tez -> Maltis Tez
        ( 422,  75, NULL,   35),  -- Cormin The Dark -> Cormin the Dark
        ( 423,  90, NULL, NULL),  -- Clayton Pierce -> Clayton Pierce
        ( 424, 150, NULL,   70),  -- Brimstone -> Brimstone
        ( 425,  25, NULL,   20),  -- Beakface Rogue -> Beakface Rogue
        ( 426,  10, NULL, NULL),  -- Bol -> Bol
        ( 427,  30, NULL,   25),  -- Beakface Sneaks -> Beakface Sneaks
        ( 428, 160, NULL, NULL),  -- Major Q11 -> Major Q11
        ( 432,  80, NULL, NULL),  -- Oathbound Phalanx -> Oathbound Phalanx
        ( 434,  25, NULL, NULL),  -- Deflectatron -> Deflectatron
        ( 435,  65, NULL, NULL),  -- Decker The Burrowbreaker -> Decker the Burrowbreaker
        ( 436,  30, NULL, NULL),  -- Chana the Zenithwing -> Chana the Zenithwing
        ( 437,  80, NULL, NULL),  -- Cornelius Breech, The Derelict Prince -> Cornelius Breech, The Derelict Prince
        ( 438, 150, NULL,  130),  -- Crimson Widow -> Crimson Widow
        ( 439,  80, NULL, NULL),  -- Dreadnoughts of Caraway Cavern -> Dreadnoughts of Caraway Cavern
        ( 440,  60, NULL,   80),  -- Festering Honor Guard -> Festering Honor Guard
        ( 441,  65, NULL,   70),  -- Gelryie Vanguards -> Gelryie Vanguards
        ( 442,  90, NULL, NULL),  -- Girushia, Grove Keeper -> Girushia, Grove Keeper
        ( 443,  90, NULL, NULL),  -- Glinerva the Kyrie Warrior -> Glinerva the Kyrie Warrior
        ( 444,  40, NULL, NULL),  -- Grave Grim -> Grave Grim
        ( 445,  80, NULL,   90),  -- Greatbow Archers -> Greatbow Archers
        ( 446, 125, NULL,  130),  -- Haluchott, Corruptor of Beasts -> Haluchott, Corruptor of Beasts
        ( 447, 120, NULL, NULL),  -- Halushia, Scion of The Wild -> Halushia, Scion of the Wild
        ( 448, 130, NULL,  120),  -- Hellforge Mandukor -> Hellforge Mandukor
        ( 449, 130, NULL, NULL),  -- Imperator Kayne -> Imperator Kayne
        ( 450, 150, NULL,  140),  -- Iron Lich Viscerot -> Iron Lich Viscerot
        ( 451,  95, NULL,   60),  -- Kilkorax the Kyrie Warrior -> Kilkorax the Kyrie Warrior
        ( 453,  85, NULL,   90),  -- Krakenling -> Krakenling
        ( 454, 110, NULL,   90),  -- Marachott, Mind Whisperer -> Marachott, Mind Whisperer
        ( 455, 100, NULL,   80),  -- Mielki the Kyrie Warrior -> Mielki the Kyrie Warrior
        ( 456,  45, NULL, NULL),  -- Molten Crustaceans -> Molten Crustaceans
        ( 457,  90, NULL,   85),  -- Necrotech Wraithriders -> Necrotech Wraithriders
        ( 458,  50, NULL, NULL),  -- Oathbound Legionnaries -> Oathbound Legionnaires
        ( 459, 110, NULL,  150),  -- Ordo Borealis -> Ordo Borealis
        ( 460, 160, NULL,  190),  -- Queen Maladrix The Conqueror -> Queen Maladrix the Conqueror
        ( 461, 105, NULL,  110),  -- Raelin the Kyrie Warrior -> Raelin the Kyrie Warrior (4.0)
        ( 462,  40, NULL, NULL),  -- Revnan Acolytes -> Revnan Acolytes
        ( 463, 185, NULL,  200),  -- Scavorith, Lord of Ruin -> Scavorith, Lord of Ruin
        ( 464,  75, NULL,   55),  -- Scions of Icaria -> Scions of Icaria
        ( 466,  45, NULL,   50),  -- Tanuki Tricksters -> Tanuki Tricksters
        ( 467, 195, NULL,  190),  -- Thyraxis Dragoon -> Thyraxis Dragoon
        ( 468,  65, NULL,   45),  -- Vorid Glide Strikers -> Vorid Glide Strikers
        ( 469,  45, NULL,   40),  -- Vrono the Brambletooth -> Vrono the Brambletooth
        ( 470, 110, NULL,   80),  -- Queen Qhyrion -> Queen Qhyrion
        ( 471,  60, NULL, NULL),  -- Wing Commander Tuck Harrigan -> Wing Commander Tuck Harrigan
        ( 473,  80, NULL,   70),  -- Xiamara the Kyrie Warrior -> Xiamara the Kyrie Warrior
        ( 474, 130, NULL,  120),  -- Agent Carr (TT) -> Agent Carr (2.0)
        ( 475,  30, NULL, NULL),  -- Bursting Hive Soldier -> Bursting Hive Soldier
        ( 476,  20, NULL, NULL),  -- Blink Dawson -> "Blink" Dawson
        ( 477,  80, NULL, NULL),  -- Agent SI-4X -> Agent SI-4X
        ( 478, 140, NULL,  100),  -- Air Marshall Zed Nesbitt -> Air Marshal Zed Nesbitt
        ( 479, 110, NULL,  115),  -- Alastair MacDirk -> Alastair MacDirk
        ( 480, 120, NULL,  110),  -- Baroness -> Baroness
        ( 481,  35, NULL, NULL),  -- Battle Copter -> Battle Copter
        ( 482, 110, NULL,  120),  -- COBRA Commander -> COBRA Commander
        ( 483,  35, NULL, NULL),  -- COBRA Flight Pod -> COBRA Flight Pod
        ( 484,  70, NULL,   75),  -- COBRA Troopers -> COBRA Troopers
        ( 485,  85, NULL, NULL),  -- Cainak, Private Eye -> Cainak, Private Eye
        ( 486,  75, NULL, NULL),  -- Chain Gruts -> Chain Gruts
        ( 487, 100, NULL, NULL),  -- Concan the Kyrie Warrior (SotC) -> Concan the Kyrie Warrior (2.0)
        ( 488,  30, NULL, NULL),  -- Corvynn the Rotbeak -> Corvynn the Rotbeak
        ( 489,  70, NULL,   80),  -- Crimson Twins -> Crimson Twins
        ( 490, 120, NULL, NULL),  -- Deathwalker 10000 -> Deathwalker 10000
        ( 491, 120, NULL,  140),  -- Destro -> Destro
        ( 492,  70, NULL, NULL),  -- Doctor Mindbender -> Doctor Mindbender
        ( 493,  40, NULL, NULL),  -- Dr. Torvik Morinstein -> Dr. Torvik Morinstein
        ( 494, 140, NULL,  120),  -- Duke -> Duke
        ( 495,  75, NULL, NULL),  -- Durnipia -> Durnipia
        ( 496, 155, NULL, NULL),  -- Eel & F'fuoh -> Eel & F'fuoh
        ( 497, 105, NULL,  100),  -- Elites of Ullar -> Elites of Ullar
        ( 498,  35, NULL, NULL),  -- Frizzt Galagan -> Frizzt Galagan
        ( 499, 150, NULL, NULL),  -- Gimbal -> Gimbal
        ( 500,  90, NULL, NULL),  -- Gnarlfur Raiders -> Gnarlfur Raiders
        ( 501,  85, NULL,   75),  -- Greenshirts -> Greenshirts
        ( 502,  50, NULL, NULL),  -- Guilty McCreech (SotC) -> Guilty McCreech (2.0)
        ( 503,  10, NULL, NULL),  -- Isamu (SotC) -> Isamu (2.0)
        ( 504,  40, NULL, NULL),  -- Jeanne d'Arc -> Jeanne d'Arc
        ( 505,  90, NULL,  100),  -- Jinx and Kamakura -> Jinx and Kamakura
        ( 506, 140, NULL, NULL),  -- Kha-Re-Ga -> Kha-Re-Ga
        ( 507,  70,   80,   85),  -- Knights of Weston -> Knights of Weston
        ( 508,  90, NULL, NULL),  -- Krampus -> Krampus
        ( 509,  60, NULL, NULL),  -- Lady Jaye -> Lady Jaye
        ( 510,  30, NULL, NULL),  -- Lurking Hive Soldier -> Lurking Hive Soldier
        ( 511,  80,   65,   75),  -- MacDirk Warriors -> MacDirk Warriors
        ( 512,  20, NULL, NULL),  -- Morinstein's Masterpiece -> Morinstein's Masterpiece
        ( 513,  30, NULL, NULL),  -- Necrotech Geistfire -> Necrotech Geistfire
        ( 514,  30, NULL,   35),  -- Necrotech Ghastblade -> Necrotech Ghastblade
        ( 515,  30, NULL,   25),  -- Necrotech Ghoulgrip -> Necrotech Ghoulgrip
        ( 516,  65, NULL,   70),  -- Necrotech Reavers -> Necrotech Reavers
        ( 517,  75, NULL, NULL),  -- Nishi Souta -> Nishi Souta
        ( 518,  50, NULL, NULL),  -- Nuckelavee -> Nuckelavee
        ( 519,  35, NULL,   40),  -- Ramosaur Rider -> Ramosaur Rider
        ( 520,  50, NULL, NULL),  -- Ranoc Vipers -> Ranoc Vipers
        ( 521,  70, NULL,   65),  -- Revenants of Revna -> Revenants of Revna
        ( 522, 100, NULL, NULL),  -- Roadblock -> Roadblock
        ( 523,  60, NULL,   55),  -- Samuel Brown -> Samuel Brown
        ( 524,  80, NULL, NULL),  -- Scarlett -> Scarlett
        ( 525, 130, NULL,  170),  -- Serpentor -> Serpentor
        ( 526, 105,  150,  150),  -- Sir Gilbert -> Sir Gilbert
        ( 527,  45, NULL, NULL),  -- Skordyre Infantry -> Skordyre Infantry
        ( 528,  70, NULL, NULL),  -- Snake Eyes -> Snake Eyes
        ( 529, 170, NULL,  150),  -- Sonlen (AoA) -> Sonlen (2.0)
        ( 530,  30, NULL, NULL),  -- Spitting Hive Soldier -> Spitting Hive Soldier
        ( 531,  80, NULL, NULL),  -- Storm Shadow -> Storm Shadow
        ( 532,  70, NULL, NULL),  -- Students of Kalari Payatt -> Students of Kalari Payatt
        ( 533, 110, NULL, NULL),  -- Sudema (SotC) -> Sudema (2.0)
        ( 534, 110, NULL,  125),  -- Syvarris (GS) -> Syvarris (2.0)
        ( 535, 120, NULL, NULL),  -- Taelord the Kyrie Warrior (SotC) -> Taelord the Kyrie Warrior (2.0)
        ( 536,  90, NULL, NULL),  -- Takanawa Kaiga -> Takanawa Kaiga
        ( 537,  75, NULL, NULL),  -- The Eisen Expedition -> The Eisen Expedition
        ( 538, 100, NULL, NULL),  -- The Kraken -> The Kraken
        ( 539, 180, NULL,  160),  -- Thormun -> Thormun
        ( 540,  55, NULL, NULL),  -- Twilight Clan Riders -> Twilight Clan Riders
        ( 541, 110, NULL,   80),  -- Vydar Queen Qhyrion -> Queen Qhyrion
        ( 542,  60, NULL,   70)   -- Zetacron -> Zetacron
    ) AS v (army_card_id, standard_points, renegade_points, delta_points)
    -- Dev and prod share ids but not every card exists in both.
    WHERE EXISTS (SELECT 1 FROM dbo.army_card a WHERE a.id = v.army_card_id)
) AS source
ON target.army_card_id = source.army_card_id
WHEN MATCHED THEN
    UPDATE SET standard_points = source.standard_points,
               renegade_points = source.renegade_points,
               delta_points = source.delta_points
WHEN NOT MATCHED THEN
    INSERT (army_card_id, standard_points, renegade_points, delta_points)
    VALUES (source.army_card_id, source.standard_points, source.renegade_points, source.delta_points);
GO

IF COL_LENGTH(N'dbo.army_card', N'Points') IS NOT NULL
    ALTER TABLE dbo.army_card DROP COLUMN Points;
GO

IF COL_LENGTH(N'dbo.battlegroup', N'PointSystem') IS NULL
    ALTER TABLE dbo.battlegroup ADD PointSystem NVARCHAR(20) NOT NULL
        CONSTRAINT DF_battlegroup_PointSystem DEFAULT (N'Renegade')
        CONSTRAINT CK_battlegroup_PointSystem CHECK (PointSystem IN (N'Standard', N'Renegade', N'Delta'));
GO
