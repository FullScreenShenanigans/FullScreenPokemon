import { IMapRaw } from "../../IFullScreenPokemon";

/* tslint:disable max-line-length */

export const Route1: IMapRaw = {
    "name": "Route 1",
    "theme": "Viridian City from Pallet Town",
    "locationDefault": "Top Path",
    "locations": {
        "Top Path": {
            "area": "Land",
            "xloc": 80,
        },
        "Bottom Path": {
            "area": "Land",
            "xloc": 80,
            "yloc": 288
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 160,
            "height": 296,
            "wildPokemon": {
                "grass": [{
                    "title": "PIDGEY".split(""),
                    "levels": [2, 3, 4, 5],
                    "rate": .55
                }, {
                    "title": "RATTATA".split(""),
                    "levels": [2, 3, 4],
                    "rate": .45
                }]
            },
            "creation": [
                { "thing": "AreaSpawner", "width": 160, "map": "Viridian City", "area": "Land", "direction": 0, "offsetX": -80 },
                { "thing": "ThemePlayer", "x": 80, "width": 16, "theme": "Viridian City from Pallet Town" },
                { "thing": "DirtMedium", "width": 32, "height": 296 },
                { "thing": "FenceWide", "x": 24, "height": 48 },
                { "thing": "DirtMedium", "x": 24, "width": 56, "height": 80 },
                { "thing": "FenceWide", "x": 72 },
                { "thing": "DirtLight", "x": 80, "width": 16, "height": 32 },
                { "thing": "FenceWide", "x": 96 },
                { "thing": "DirtMedium", "x": 96, "width": 48, "height": 32 },
                { "thing": "DirtMedium", "x": 144, "width": 16, "height": 296 },
                { "thing": "FenceWide", "x": 144, "height": 48 },
                { "thing": "FenceWide", "x": 32, "y": 8, "width": 48 },
                { "thing": "FenceWide", "x": 96, "y": 8, "width": 48 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 20, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtLight", "x": 80, "y": 32, "width": 64, "height": 16 },
                { "thing": "PlantSmall", "x": 72, "y": 32, "height": 48 },
                { "thing": "Ledge", "x": 32, "y": 44, "width": 40, "crumbleRight": true },
                { "thing": "Ledge", "x": 80, "y": 44, "width": 32, "jagged": true },
                { "thing": "PlantSmall", "x": 24, "y": 48, "height": 64 },
                { "thing": "DirtMedium", "x": 80, "y": 48, "width": 64, "height": 32 },
                { "thing": "Grass", "x": 80, "y": 48, "width": 64, "height": 32 },
                { "thing": "PlantSmall", "x": 144, "y": 48, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 32, "y": 52, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "Ledge", "x": 32, "y": 76, "width": 40, "crumbleRight": true },
                { "thing": "DirtMedium", "x": 32, "y": 80, "width": 64, "height": 48 },
                { "thing": "DirtLight", "x": 96, "y": 80, "width": 48, "height": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 48, "y": 84, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 96, "y": 96, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 112, "y": 96, "width": 32, "height": 48 },
                { "thing": "Grass", "x": 112, "y": 96, "width": 32, "height": 32 },
                { "thing": "PlantSmall", "x": 32, "y": 104, "width": 16 },
                { "thing": "PlantSmall", "x": 80, "y": 104, "width": 32 },
                { "thing": "BugCatcher", "x": 120, "y": 104, "direction": 3, "roaming": true, "roamingDirections": [1, 3], "name": "LedgeAdvertiser", "dialog": ["See those ledges along the road?", "It's a bit scary, but you can jump from them.", "You can get back to Pallet Town quicker that way."] },
                { "thing": "Ledge", "x": 48, "y": 108, "width": 32 },
                { "thing": "FenceWide", "x": 24, "y": 112, "height": 112 },
                { "thing": "FenceWide", "x": 144, "y": 112, "height": 112 },
                { "thing": "DirtLight", "x": 96, "y": 112, "width": 16, "height": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 116, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtMedium", "x": 32, "y": 128, "width": 16, "height": 48 },
                { "thing": "DirtLight", "x": 48, "y": 128, "width": 64, "height": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 112, "y": 132, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtLight", "x": 48, "y": 144, "width": 16, "height": 16 },
                { "thing": "DirtMedium", "x": 64, "y": 144, "width": 80, "height": 16 },
                { "thing": "Ledge", "x": 32, "y": 156, "width": 8 },
                { "thing": "LedgeOpening", "x": 40, "y": 156, "width": 8 },
                { "thing": "Ledge", "x": 48, "y": 156, "width": 24, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 72, "y": 156, "width": 8 },
                { "thing": "Ledge", "x": 80, "y": 156, "width": 64 },
                { "thing": "DirtLight", "x": 48, "y": 160, "width": 96, "height": 16 },
                { "thing": "DirtMedium", "x": 32, "y": 176, "width": 96, "height": 32 },
                { "thing": "Grass", "x": 96, "y": 176, "width": 32, "height": 32 },
                { "thing": "DirtLight", "x": 128, "y": 176, "width": 16, "height": 32 },
                { "thing": "PlantSmall", "x": 32, "y": 184, "width": 64 },
                { "thing": "BugCatcher", "x": 40, "y": 192, "direction": 2, "roaming": true, "roamingDirections": [0, 2], "name": "ShopAdvertiser", "dialog": ["Hi! I work at a %%%%%%%POKEMON%%%%%%% MART.", "It's a convenient shop, so please visit us in VIRIDIAN CITY.", "I know, I'll give you a sample! Here you go!"], "dialogNext": "We also carry %%%%%%%POKE%%%%%%% BALLs for catching %%%%%%%POKEMON%%%%%%%!", "gift": "Potion" },
                { "thing": "Ledge", "x": 128, "y": 188, "width": 16, "jagged": true },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 196, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtLight", "x": 32, "y": 208, "width": 112, "height": 16 },
                { "thing": "Sign", "x": 72, "y": 216, "dialog": "ROUTE 1 \n PALLET TOWN - VIRIDIAN CITY" },
                { "thing": "Ledge", "x": 32, "y": 220, "width": 16, "jagged": true },
                { "thing": "Ledge", "x": 80, "y": 220, "width": 64, "jagged": true },
                { "thing": "PlantSmall", "x": 24, "y": 224, "height": 64 },
                { "thing": "DirtMedium", "x": 32, "y": 224, "width": 48, "height": 72 },
                { "thing": "Grass", "x": 48, "y": 224, "width": 32, "height": 16 },
                { "thing": "DirtLight", "x": 80, "y": 224, "width": 16, "height": 40 },
                { "thing": "DirtMedium", "x": 96, "y": 224, "width": 48, "height": 72 },
                { "thing": "Grass", "x": 112, "y": 224, "width": 32, "height": 16 },
                { "thing": "PlantSmall", "x": 144, "y": 224, "height": 64 },
                { "thing": "Grass", "x": 32, "y": 240, "width": 32, "height": 16 },
                { "thing": "Grass", "x": 96, "y": 240, "width": 32, "height": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 244, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 244, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "FenceWide", "x": 32, "y": 256, "width": 48 },
                { "thing": "DirtMedium", "x": 80, "y": 256, "width": 16, "height": 40 },
                { "thing": "Grass", "x": 80, "y": 256, "width": 16, "height": 40 },
                { "thing": "FenceWide", "x": 96, "y": 256, "width": 48 },
                { "thing": "FenceWide", "x": 72, "y": 264, "height": 32 },
                { "thing": "FenceWide", "x": 96, "y": 264, "height": 32 },
                { "thing": "ThemePlayer", "x": 80, "y": 280, "width": 16, "theme": "Viridian City from Pallet Town" },
                { "thing": "FenceWide", "x": 24, "y": 288 },
                { "thing": "ThemePlayer", "x": 80, "y": 288, "width": 16, "theme": "Pallet Town" },
                { "thing": "FenceWide", "x": 144, "y": 288 },
                { "thing": "AreaSpawner", "y": 288, "width": 160, "map": "Pallet Town", "area": "Land", "direction": 2 }
            ]
        }
    }
};

/* tslint:enable max-line-length */
