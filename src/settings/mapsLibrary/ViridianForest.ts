import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const ViridianForest: IMapRaw = {
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
            "xloc": 544,
            "yloc": 1504,
            "direction": 0
        },
        "Forest Top": {
            "area": "Forest",
            "xloc": 32,
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
            "allowCycling": false,
            "width": 320,
            "height": 256,
            "theme": "Pewter City",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorFancyWithDarkBottom", "width": 160 },
                { "thing": "InvisibleWall", "width": 160 },
                { "thing": "Door", "x": 160, "indoor": true, "transport": { "map": "Route 2", "location": "Viridian Forest Top" }, "entrance": "Gate North Door North" },
                { "thing": "WallIndoorFancyWithDarkBottom", "x": 192, "width": 128 },
                { "thing": "InvisibleWall", "x": 192, "width": 128 },
                { "thing": "FloorCheckered", "y": 32, "width": 320, "height": 224 },
                { "thing": "PottedPalmTree", "y": 64, "height": 192 },
                { "thing": "Guy", "x": 96, "y": 64, "roaming": true, "roamingDirections": [], "dialog": ["Many %%%%%%%POKEMON%%%%%%% live only in forests and caves.", "You need to look everywhere to get different kinds!"] },
                { "thing": "Table1x2", "x": 192, "y": 64 },
                { "thing": "Table1x2", "x": 256, "y": 64 },
                { "thing": "PottedPalmTree", "x": 288, "y": 64, "height": 192 },
                { "thing": "OldMan", "x": 64, "y": 160, "roaming": true, "roamingDirections": [], "dialog": ["Have you noticed the bushes on the roadside?", "They can be cut down by a special %%%%%%%POKEMON%%%%%%% move."] },
                { "thing": "Table1x2", "x": 192, "y": 160 },
                { "thing": "Table1x2", "x": 256, "y": 160 },
                { "thing": "Doormat", "x": 128, "y": 224, "width": 64, "entrance": "Gate North Door South" },
                { "thing": "HiddenTransporter", "x": 128, "y": 224, "width": 64, "directionRequired": 2, "transport": { "map": "Viridian Forest", "location": "Forest Top" } }
            ],
        },
        "Forest": {
            "allowCycling": true,
            "width": 1088,
            "height": 1536,
            "wildPokemon": {
                "grass": [{
                    "title": "CATERPIE".split(""),
                    "levels": [3, 5],
                    "rate": 0.5
                }, {
                    "title": "METAPOD".split(""),
                    "levels": [4, 5, 6],
                    "rate": 0.35
                }, {
                    "title": "WEEDLE".split(""),
                    "level": 3,
                    "rate": 0.05
                }, {
                    "title": "KAKUNA".split(""),
                    "level": 4,
                    "rate": 0.05
                }, {
                    "title": "PIKACHU".split(""),
                    "levels": [3, 5],
                    "rate": 0.05
                }]
            },
            "creation": [
                { "thing": "HiddenTransporter", "x": 32, "width": 64, "directionRequired": 0, "transport": "Gate North Door South" },
                { "thing": "DirtForest", "width": 1088, "height": 1536 },
                { "thing": "Stump", "height": 832 },
                { "thing": "Stump", "x": 96, "height": 704 },
                { "thing": "PlantLarge", "x": 128, "height": 704 },
                { "thing": "Stump", "x": 192, "width": 256 },
                { "thing": "PlantLarge", "x": 448, "height": 512 },
                { "thing": "Stump", "x": 512, "width": 576 },
                { "thing": "Sign", "x": 64, "y": 32, "forest": true, "dialog": "LEAVING \n VIRIDIAN FOREST PEWTER CITY AHEAD" },
                { "thing": "Stump", "x": 1056, "y": 32, "height": 1056 },
                { "thing": "Stump", "x": 640, "y": 96, "width": 320 },
                { "thing": "ForestDirt", "x": 416, "y": 112 },
                { "thing": "ForestDirt", "x": 608, "y": 112 },
                { "thing": "ForestDirt", "x": 992, "y": 112 },
                { "thing": "Stump", "x": 288, "y": 128, "height": 640 },
                { "thing": "Stump", "x": 320, "y": 128, "height": 512 },
                { "thing": "Stump", "x": 608, "y": 128, "height": 128 },
                { "thing": "PlantLarge", "x": 640, "y": 128, "width": 320, "height": 128 },
                { "thing": "Stump", "x": 960, "y": 128, "height": 128 },
                { "thing": "Grass", "x": 32, "y": 192, "width": 64, "height": 576 },
                { "thing": "Grass", "x": 192, "y": 192, "width": 96, "height": 576 },
                { "thing": "Grass", "x": 352, "y": 192, "width": 96, "height": 384 },
                { "thing": "Grass", "x": 512, "y": 192, "width": 96, "height": 384 },
                { "thing": "Grass", "x": 608, "y": 256, "width": 160, "height": 64 },
                { "thing": "ForestDirt", "x": 864, "y": 304 },
                { "thing": "Stump", "x": 608, "y": 320, "height": 320 },
                { "thing": "PlantLarge", "x": 640, "y": 320, "width": 128, "height": 320 },
                { "thing": "Stump", "x": 768, "y": 320, "height": 960 },
                { "thing": "Stump", "x": 864, "y": 320, "height": 256 },
                { "thing": "PlantLarge", "x": 896, "y": 320, "height": 256 },
                { "thing": "Grass", "x": 960, "y": 320, "width": 96, "height": 256 },
                { "thing": "Pokeball", "x": 800, "y": 352, "name": "Item One", "item": "Antidote" },
                { "thing": "Sign", "x": 832, "y": 544, "forest": true, "dialog": ["TRAINER TIPS", "Contact PROF. OAK via PC to get your %%%%%%%POKEDEX%%%%%%% evaluated!"] },
                {
                    "thing": "BugCatcher", "x": 960, "y": 608, "name": "Trainer Two", "direction": 3, "sight": 16, "trainer": true,
                    "reward": 280,
                    "dialog": "Yo! You can't jam out if you're a %%%%%%%POKEMON%%%%%%% trainer!",
                    "textDefeat": "BUG CATCHER: No! CATERPIE can't cut it!",
                    "dialogNext": "Ssh! You'll scare the bugs away!",
                    "actors": [{
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 28
                    }, {
                        "title": ["K", "A", "K", "U", "N", "A"],
                        "level": 28
                    }, {
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 28
                    }]
                },
                { "thing": "ForestDirt", "x": 416, "y": 624 },
                { "thing": "ForestDirt", "x": 864, "y": 624 },
                { "thing": "PlantLarge", "x": 320, "y": 640, "width": 448, "height": 128 },
                { "thing": "Grass", "x": 800, "y": 640, "width": 96, "height": 384 },
                { "thing": "PlantLarge", "x": 896, "y": 640, "height": 384 },
                { "thing": "Stump", "x": 960, "y": 640, "height": 384 },
                { "thing": "Grass", "x": 96, "y": 704, "height": 64 },
                {
                    "thing": "BugCatcher", "x": 64, "y": 576, "name": "Trainer Three", "direction": 3, "sight": 4,
                    "reward": 360,
                    "dialog": "Hey, wait up! What's the hurry?",
                    "textDefeat": "BUG CATCHER: I give! You're good at this!",
                    "dialogNext": ["Sometimes, you can find stuff on the ground!", "I'm looking for the stuff I dropped!"],
                    "actors": [{
                        "title": "Weedle",
                        "level": 36
                    }]
                },
                { "thing": "Sign", "x": 128, "y": 768, "forest": true, "dialog": ["TRAINER TIPS", "No stealing of %%%%%%%POKEMON%%%%%%% from other trainers! Catch only wild %%%%%%%POKEMON%%%%%%%!"] },
                { "thing": "ForestDirt", "x": 224, "y": 816 },
                { "thing": "Stump", "x": 416, "y": 768, "height": 192 },
                { "thing": "PlantLarge", "x": 448, "y": 768, "width": 320, "height": 192 },
                { "thing": "PlantLarge", "y": 832, "width": 320, "height": 128 },
                { "thing": "Stump", "x": 320, "y": 832, "height": 128 },
                { "thing": "Pokeball", "x": 384, "y": 896, "name": "Item Two", "item": "Potion" },
                { "thing": "Stump", "y": 960, "height": 64 },
                { "thing": "Grass", "x": 32, "y": 960, "width": 256, "height": 64 },
                { "thing": "Stump", "x": 288, "y": 960, "height": 64 },
                { "thing": "PlantLarge", "x": 320, "y": 960, "width": 448 },
                { "thing": "PlantLarge", "y": 1024, "width": 192, "height": 256 },
                { "thing": "Grass", "x": 256, "y": 1024, "width": 256, "height": 64 },
                { "thing": "Sign", "x": 512, "y": 1024, "forest": true },
                { "thing": "Grass", "x": 576, "y": 1024, "height": 320 },
                { "thing": "Stump", "x": 608, "y": 1024, "height": 256 },
                { "thing": "PlantLarge", "x": 640, "y": 1024, "width": 128, "height": 256 },
                { "thing": "Grass", "x": 800, "y": 1024, "height": 320 },
                {
                    "thing": "BugCatcher", "x": 928, "y": 1056, "name": "Trainer One", "direction": 3, "sight": 12, "trainer": true,
                    "reward": 240,
                    "dialog": "Hey! You have %%%%%%%POKEMON%%%%%%%! Come on! Let's battle' em!",
                    "textDefeat": "BUG CATCHER: No! CATERPIE can't cut it!",
                    "dialogNext": "Ssh! You'll scare the bugs away!",
                    "actors": [{
                        "title": ["W", "E", "E", "D", "L", "E"],
                        "level": 24
                    }, {
                        "title": ["C", "A", "T", "E", "R", "P", "I", "E"],
                        "level": 24
                    }]
                },
                { "thing": "ForestDirt", "x": 224, "y": 1072 },
                { "thing": "ForestDirt", "x": 992, "y": 1072 },
                { "thing": "Grass", "x": 256, "y": 1088, "height": 256 },
                { "thing": "Stump", "x": 288, "y": 1088, "height": 192 },
                { "thing": "PlantLarge", "x": 320, "y": 1088, "width": 128, "height": 192 },
                { "thing": "Stump", "x": 448, "y": 1088, "height": 192 },
                { "thing": "Grass", "x": 480, "y": 1088, "height": 256 },
                { "thing": "PlantLarge", "x": 896, "y": 1088, "width": 192, "height": 192 },
                { "thing": "Stump", "y": 1280, "height": 128 },
                { "thing": "Grass", "x": 32, "y": 1280, "width": 128, "height": 128 },
                { "thing": "Grass", "x": 288, "y": 1280, "width": 192, "height": 64 },
                { "thing": "Grass", "x": 608, "y": 1280, "width": 192, "height": 64 },
                { "thing": "Sign", "x": 768, "y": 1280, "forest": true, "dialog": ["TRAINER TIPS", "If you want to avoid battles", "stay away from grassy areas!"] },
                { "thing": "BugCatcher", "x": 864, "y": 1280, "roaming": true, "roamingDirections": [], "dialog": ["I ran out of %%%%%%%POKE%%%%%%% BALLs to catch %%%%%%%POKEMON%%%%%%% with!", "You should carry extras!"] },
                { "thing": "Grass", "x": 896, "y": 1280, "width": 160, "height": 128 },
                { "thing": "Stump", "x": 1056, "y": 1280, "height": 128 },
                { "thing": "PlantLarge", "x": 512, "y": 1312 },
                { "thing": "PlantLarge", "y": 1408, "width": 448, "height": 128 },
                { "thing": "Stump", "x": 448, "y": 1408, "height": 128 },
                { "thing": "Stump", "x": 608, "y": 1408, "height": 128 },
                { "thing": "PlantLarge", "x": 640, "y": 1408, "width": 448, "height": 128 },
                { "thing": "BugCatcher", "x": 640, "y": 1472, "direction": 2, "directionPreferred": 2, "dialog": ["I cam here with some friends!", "They're out for %%%%%%%POKEMON%%%%%%% fights!"] },
                { "thing": "Sign", "x": 576, "y": 1440, "forest": true, "dialog": ["TRAINER TIPS", "Weaken %%%%%%%POKEMON%%%%%%% before attempting capture!", "When healthy, they may escape!"] },
                { "thing": "GroundArrow", "x": 528, "y": 1472, "width": 32 },
                { "thing": "HiddenTransporter", "x": 480, "y": 1504, "width": 128, "directionRequired": 2, "transport": "Gate South Door North" }
            ]
        },
        "Gate South": {
            "allowCycling": false,
            "width": 320,
            "height": 256,
            "theme": "Pewter City",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorFancyWithDarkBottom", "width": 160 },
                { "thing": "InvisibleWall", "width": 160 },
                { "thing": "Door", "x": 160, "indoor": true, "transport": "Forest Bottom", "entrance": "Gate South Door North" },
                { "thing": "WallIndoorFancyWithDarkBottom", "x": 192, "width": 128 },
                { "thing": "InvisibleWall", "x": 192, "width": 128 },
                { "thing": "FloorCheckered", "y": 32, "width": 320, "height": 224 },
                { "thing": "PottedPalmTree", "y": 64, "height": 192 },
                { "thing": "Table1x2", "x": 192, "y": 64 },
                { "thing": "Table1x2", "x": 256, "y": 64 },
                { "thing": "PottedPalmTree", "x": 288, "y": 64, "height": 192 },
                { "thing": "Table1x2", "x": 192, "y": 160 },
                { "thing": "Table1x2", "x": 256, "y": 160 },
                { "thing": "Lady", "x": 256, "y": 128, "direction": 3, "dialog": "Are you going to VIRIDIAN FOREST? Be careful, it's a natural maze!" },
                { "thing": "LittleGirl", "x": 64, "y": 160, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": "RATTATA may be small, but its bite is wicked! Did you get one?" },
                { "thing": "Doormat", "x": 128, "y": 224, "width": 64, "entrance": "Gate South Door South" },
                { "thing": "HiddenTransporter", "x": 128, "y": 224, "width": 64, "directionRequired": 2, "transport": { "map": "Route 2", "location": "Viridian Forest Bottom" } }
            ]
        }
    }
};

/* tslint:enable max-line-length */
