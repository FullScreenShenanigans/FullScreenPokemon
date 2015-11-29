FullScreenPokemon.FullScreenPokemon.settings.maps.library["Viridian Forest"] = {
    "name": "Viridian Forest",
    "theme": "Viridian Forest",
    "locationDefault": "Forest Top",
    "locations": {
        "Gate North Door North": {
            "area": "Gate North",
            "direction": 2,
            "push": true
        },
        "Gate North Door South": {
            "area": "Gate North",
            "direction": 0
        },
        "Forest Bottom": {
            "area": "Forest",
            "xloc": 136,
            "yloc": 376,
            "direction": 0
        },
        "Forest Top": {
            "area": "Forest",
            "xloc": 8,
            "direction": 2,
        },
        "Gate South Door North": {
            "area": "Gate South",
            "direction": 2,
            "push": true
        },
        "Gate South Door South": {
            "area": "Gate South",
            "direction": 0
        }
    },
    "areas": {
        "Gate North": {
            "width": 80,
            "height": 64,
            "theme": "Pewter City",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorFancyWithDarkBottom", "width": 40 },
                { "thing": "InvisibleWall", "width": 40 },
                { "thing": "Door", "x": 40, "indoor": true, "transport": { "map": "Route 2", "location": "Viridian Forest Top" }, "entrance": "Gate North Door North" },
                { "thing": "WallIndoorFancyWithDarkBottom", "x": 48, "width": 32 },
                { "thing": "InvisibleWall", "x": 48, "width": 32 },
                { "thing": "FloorCheckered", "y": 8, "width": 80, "height": 56 },
                { "thing": "PottedPalmTree", "y": 16, "height": 48 },
                { "thing": "Guy", "x": 24, "y": 16, "roaming": true, "roamingDirections": [], "dialog": ["Many %%%%%%%POKEMON%%%%%%% live only in forests and caves.", "You need to look everywhere to get different kinds!"] },
                { "thing": "Table1x2", "x": 48, "y": 16 },
                { "thing": "Table1x2", "x": 64, "y": 16 },
                { "thing": "PottedPalmTree", "x": 72, "y": 16, "height": 48 },
                { "thing": "OldMan", "x": 16, "y": 40, "roaming": true, "roamingDirections": [], "dialog": ["Have you noticed the bushes on the roadside?", "They can be cut down by a special %%%%%%%POKEMON%%%%%%% move."] },
                { "thing": "Table1x2", "x": 48, "y": 40 },
                { "thing": "Table1x2", "x": 64, "y": 40 },
                { "thing": "Doormat", "x": 32, "y": 56, "width": 16, "entrance": "Gate North Door South" },
                { "thing": "HiddenTransporter", "x": 32, "y": 56, "width": 16, "directionRequired": 2, "transport": { "map": "Viridian Forest", "location": "Forest Top" } }
            ],
        },
        "Forest": {
            "width": 272,
            "height": 384,
            "wildPokemon": {
                "grass": [{
                    "title": "CATERPIE".split(""),
                    "levels": [3, 5],
                    "rate": .5
                }, {
                    "title": "METAPOD".split(""),
                    "levels": [4, 5, 6],
                    "rate": .35
                }, {
                    "title": "WEEDLE".split(""),
                    "level": 3,
                    "rate": .05
                }, {
                    "title": "KAKUNA".split(""),
                    "level": 4,
                    "rate": .05
                }, {
                    "title": "PIKACHU".split(""),
                    "levels": [3, 5],
                    "rate": .05
                }]
            },
            "creation": [
                { "thing": "HiddenTransporter", "x": 8, "width": 16, "directionRequired": 0, "transport": "Gate North Door South" },
                { "thing": "DirtForest", "width": 272, "height": 384 },
                { "thing": "Stump", "height": 208 },
                { "thing": "Stump", "x": 24, "height": 176 },
                { "thing": "PlantLarge", "x": 32, "height": 176 },
                { "thing": "Stump", "x": 48, "width": 64 },
                { "thing": "PlantLarge", "x": 112, "height": 128 },
                { "thing": "Stump", "x": 128, "width": 144 },
                { "thing": "Sign", "x": 16, "y": 8, "forest": true, "dialog": "LEAVING \n VIRIDIAN FOREST PEWTER CITY AHEAD" },
                { "thing": "Stump", "x": 264, "y": 8, "height": 264 },
                { "thing": "Stump", "x": 160, "y": 24, "width": 80 },
                { "thing": "ForestDirt", "x": 104, "y": 28 },
                { "thing": "ForestDirt", "x": 152, "y": 28 },
                { "thing": "ForestDirt", "x": 248, "y": 28 },
                { "thing": "Stump", "x": 72, "y": 32, "height": 160 },
                { "thing": "Stump", "x": 80, "y": 32, "height": 128 },
                { "thing": "Stump", "x": 152, "y": 32, "height": 32 },
                { "thing": "PlantLarge", "x": 160, "y": 32, "width": 80, "height": 32 },
                { "thing": "Stump", "x": 240, "y": 32, "height": 32 },
                { "thing": "Grass", "x": 8, "y": 48, "width": 16, "height": 144 },
                { "thing": "Grass", "x": 48, "y": 48, "width": 24, "height": 144 },
                { "thing": "Grass", "x": 88, "y": 48, "width": 24, "height": 96 },
                { "thing": "Grass", "x": 128, "y": 48, "width": 24, "height": 96 },
                { "thing": "Grass", "x": 152, "y": 64, "width": 40, "height": 16 },
                { "thing": "ForestDirt", "x": 216, "y": 76 },
                { "thing": "Stump", "x": 152, "y": 80, "height": 80 },
                { "thing": "PlantLarge", "x": 160, "y": 80, "width": 32, "height": 80 },
                { "thing": "Stump", "x": 192, "y": 80, "height": 240 },
                { "thing": "Stump", "x": 216, "y": 80, "height": 64 },
                { "thing": "PlantLarge", "x": 224, "y": 80, "height": 64 },
                { "thing": "Grass", "x": 240, "y": 80, "width": 24, "height": 64 },
                { "thing": "Pokeball", "x": 200, "y": 88, "name": "Item One", "item": "Antidote" },
                { "thing": "Sign", "x": 208, "y": 136, "forest": true, "dialog": ["TRAINER TIPS", "Contact PROF. OAK via PC to get your %%%%%%%POKEDEX%%%%%%% evaluated!"] },
                {
                    "thing": "BugCatcher", "x": 240, "y": 152, "name": "Trainer Two", "direction": 3, "sight": 4, "trainer": true,
                    "reward": 70,
                    "dialog": "Yo! You can't jam out if you're a %%%%%%%POKEMON%%%%%%% trainer!",
                    "textDefeat": "BUG CATCHER: No! CATERPIE can't cut it!",
                    "dialogNext": "Ssh! You'll scare the bugs away!",
                    "actors": [{
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 7
                    }, {
                        "title": ["K", "A", "K", "U", "N", "A"],
                        "level": 7
                    }, {
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 7
                    }]
                },
                { "thing": "ForestDirt", "x": 104, "y": 156 },
                { "thing": "ForestDirt", "x": 216, "y": 156 },
                { "thing": "PlantLarge", "x": 80, "y": 160, "width": 112, "height": 32 },
                { "thing": "Grass", "x": 200, "y": 160, "width": 24, "height": 96 },
                { "thing": "PlantLarge", "x": 224, "y": 160, "height": 96 },
                { "thing": "Stump", "x": 240, "y": 160, "height": 96 },
                { "thing": "Grass", "x": 24, "y": 176, "height": 16 },
                {
                    "thing": "BugCatcher", "x": 16, "y": 144, "name": "Trainer Three", "direction": 3, "sight": 1,
                    "reward": 90,
                    "dialog": "Hey, wait up! What's the hurry?",
                    "textDefeat": "BUG CATCHER: I give! You're good at this!",
                    "dialogNext": ["Sometimes, you can find stuff on the ground!", "I'm looking for the stuff I dropped!"],
                    "actors": [{
                        "title": "Weedle",
                        "level": 9
                    }]
                },
                { "thing": "Sign", "x": 32, "y": 192, "forest": true, "dialog": ["TRAINER TIPS", "No stealing of %%%%%%%POKEMON%%%%%%% from other trainers! Catch only wild %%%%%%%POKEMON%%%%%%%!"] },
                { "thing": "ForestDirt", "x": 56, "y": 204 },
                { "thing": "Stump", "x": 104, "y": 192, "height": 48 },
                { "thing": "PlantLarge", "x": 112, "y": 192, "width": 80, "height": 48 },
                { "thing": "PlantLarge", "y": 208, "width": 80, "height": 32 },
                { "thing": "Stump", "x": 80, "y": 208, "height": 32 },
                { "thing": "Pokeball", "x": 96, "y": 224, "name": "Item Two", "item": "Potion" },
                { "thing": "Stump", "y": 240, "height": 16 },
                { "thing": "Grass", "x": 8, "y": 240, "width": 64, "height": 16 },
                { "thing": "Stump", "x": 72, "y": 240, "height": 16 },
                { "thing": "PlantLarge", "x": 80, "y": 240, "width": 112 },
                { "thing": "PlantLarge", "y": 256, "width": 48, "height": 64 },
                { "thing": "Grass", "x": 64, "y": 256, "width": 64, "height": 16 },
                { "thing": "Sign", "x": 128, "y": 256, "forest": true },
                { "thing": "Grass", "x": 144, "y": 256, "height": 80 },
                { "thing": "Stump", "x": 152, "y": 256, "height": 64 },
                { "thing": "PlantLarge", "x": 160, "y": 256, "width": 32, "height": 64 },
                { "thing": "Grass", "x": 200, "y": 256, "height": 80 },
                {
                    "thing": "BugCatcher", "x": 232, "y": 264, "name": "Trainer One", "direction": 3, "sight": 3, "trainer": true,
                    "reward": 60,
                    "dialog": "Hey! You have %%%%%%%POKEMON%%%%%%%! Come on! Let's battle' em!",
                    "textDefeat": "BUG CATCHER: No! CATERPIE can't cut it!",
                    "dialogNext": "Ssh! You'll scare the bugs away!",
                    "actors": [{
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 6
                    }, {
                        "title": ["C", "A", "T", "E", "R", "P", "I", "E"],
                        "level": 6
                    }]
                },
                { "thing": "ForestDirt", "x": 56, "y": 268 },
                { "thing": "ForestDirt", "x": 248, "y": 268 },
                { "thing": "Grass", "x": 64, "y": 272, "height": 64 },
                { "thing": "Stump", "x": 72, "y": 272, "height": 48 },
                { "thing": "PlantLarge", "x": 80, "y": 272, "width": 32, "height": 48 },
                { "thing": "Stump", "x": 112, "y": 272, "height": 48 },
                { "thing": "Grass", "x": 120, "y": 272, "height": 64 },
                { "thing": "PlantLarge", "x": 224, "y": 272, "width": 48, "height": 48 },
                { "thing": "Stump", "y": 320, "height": 32 },
                { "thing": "Grass", "x": 8, "y": 320, "width": 32, "height": 32 },
                { "thing": "Grass", "x": 72, "y": 320, "width": 48, "height": 16 },
                { "thing": "Grass", "x": 152, "y": 320, "width": 48, "height": 16 },
                { "thing": "Sign", "x": 192, "y": 320, "forest": true, "dialog": ["TRAINER TIPS", "If you want to avoid battles", "stay away from grassy areas!"] },
                { "thing": "BugCatcher", "x": 216, "y": 320, "roaming": true, "roamingDirections": [], "dialog": ["I ran out of %%%%%%%POKE%%%%%%% BALLs to catch %%%%%%%POKEMON%%%%%%% with!", "You should carry extras!"] },
                { "thing": "Grass", "x": 224, "y": 320, "width": 40, "height": 32 },
                { "thing": "Stump", "x": 264, "y": 320, "height": 32 },
                { "thing": "PlantLarge", "x": 128, "y": 328 },
                { "thing": "PlantLarge", "y": 352, "width": 112, "height": 32 },
                { "thing": "Stump", "x": 112, "y": 352, "height": 32 },
                { "thing": "Stump", "x": 152, "y": 352, "height": 32 },
                { "thing": "PlantLarge", "x": 160, "y": 352, "width": 112, "height": 32 },
                { "thing": "BugCatcher", "x": 160, "y": 368, "direction": 2, "directionPreferred": 2, "dialog": ["I cam here with some friends!", "They're out for %%%%%%%POKEMON%%%%%%% fights!"] },
                { "thing": "Sign", "x": 144, "y": 360, "forest": true, "dialog": ["TRAINER TIPS", "Weaken %%%%%%%POKEMON%%%%%%% before attempting capture!", "When healthy, they may escape!"] },
                { "thing": "GroundArrow", "x": 132, "y": 368, "width": 8 },
                { "thing": "HiddenTransporter", "x": 120, "y": 376, "width": 32, "directionRequired": 2, "transport": "Gate South Door North" }
            ]
        },
        "Gate South": {
            "width": 80,
            "height": 64,
            "theme": "Pewter City",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorFancyWithDarkBottom", "width": 40 },
                { "thing": "InvisibleWall", "width": 40 },
                { "thing": "Door", "x": 40, "indoor": true, "transport": "Forest Bottom", "entrance": "Gate South Door North" },
                { "thing": "WallIndoorFancyWithDarkBottom", "x": 48, "width": 32 },
                { "thing": "InvisibleWall", "x": 48, "width": 32 },
                { "thing": "FloorCheckered", "y": 8, "width": 80, "height": 56 },
                { "thing": "PottedPalmTree", "y": 16, "height": 48 },
                { "thing": "Table1x2", "x": 48, "y": 16 },
                { "thing": "Table1x2", "x": 64, "y": 16 },
                { "thing": "PottedPalmTree", "x": 72, "y": 16, "height": 48 },
                { "thing": "Table1x2", "x": 48, "y": 40 },
                { "thing": "Table1x2", "x": 64, "y": 40 },
                { "thing": "Lady", "x": 64, "y": 32, "direction": 3, "dialog": "Are you going to VIRIDIAN FOREST? Be careful, it's a natural maze!" },
                { "thing": "LittleGirl", "x": 16, "y": 40, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": "RATTATA may be small, but its bite is wicked! Did you get one?" },
                { "thing": "Doormat", "x": 32, "y": 56, "width": 16, "entrance": "Gate South Door South" },
                { "thing": "HiddenTransporter", "x": 32, "y": 56, "width": 16, "directionRequired": 2, "transport": { "map": "Route 2" } }
            ]
        }
    }
};