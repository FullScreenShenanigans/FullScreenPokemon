import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const Route1: IMapRaw = {
    "name": "Route 1",
    "theme": "Viridian City from Pallet Town",
    "locationDefault": "Top Path",
    "locations": {
        "Top Path": {
            "area": "Land",
            "xloc": 320,
        },
        "Bottom Path": {
            "area": "Land",
            "xloc": 320,
            "yloc": 1152
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 640,
            "height": 1184,
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
                { "thing": "AreaSpawner", "width": 640, "map": "Viridian City", "area": "Land", "direction": 0, "offsetX": -320 },
                { "thing": "ThemePlayer", "x": 320, "width": 64, "theme": "Viridian City from Pallet Town" },
                { "thing": "DirtMedium", "width": 128, "height": 1184 },
                { "thing": "FenceWide", "x": 96, "height": 192 },
                { "thing": "DirtMedium", "x": 96, "width": 224, "height": 320 },
                { "thing": "FenceWide", "x": 288 },
                { "thing": "DirtLight", "x": 320, "width": 64, "height": 128 },
                { "thing": "FenceWide", "x": 384 },
                { "thing": "DirtMedium", "x": 384, "width": 192, "height": 128 },
                { "thing": "DirtMedium", "x": 576, "width": 64, "height": 1184 },
                { "thing": "FenceWide", "x": 576, "height": 192 },
                { "thing": "FenceWide", "x": 128, "y": 32, "width": 192 },
                { "thing": "FenceWide", "x": 384, "y": 32, "width": 192 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 512, "y": 80, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 320, "y": 128, "width": 256, "height": 64 },
                { "thing": "PlantSmall", "x": 288, "y": 128, "height": 192 },
                { "thing": "Ledge", "x": 128, "y": 176, "width": 160, "crumbleRight": true },
                { "thing": "Ledge", "x": 320, "y": 176, "width": 128, "jagged": true },
                { "thing": "PlantSmall", "x": 96, "y": 192, "height": 256 },
                { "thing": "DirtMedium", "x": 320, "y": 192, "width": 256, "height": 128 },
                { "thing": "Grass", "x": 320, "y": 192, "width": 256, "height": 128 },
                { "thing": "PlantSmall", "x": 576, "y": 192, "height": 256 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 208, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "Ledge", "x": 128, "y": 304, "width": 160, "crumbleRight": true },
                { "thing": "DirtMedium", "x": 128, "y": 320, "width": 256, "height": 192 },
                { "thing": "DirtLight", "x": 384, "y": 320, "width": 192, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 192, "y": 336, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 384, "y": 384, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 448, "y": 384, "width": 128, "height": 192 },
                { "thing": "Grass", "x": 448, "y": 384, "width": 128, "height": 128 },
                { "thing": "PlantSmall", "x": 128, "y": 416, "width": 64 },
                { "thing": "PlantSmall", "x": 320, "y": 416, "width": 128 },
                { "thing": "BugCatcher", "x": 480, "y": 416, "direction": 3, "roaming": true, "roamingDirections": [4, 12], "name": "LedgeAdvertiser", "dialog": ["See those ledges along the road?", "It's a bit scary, but you can jump from them.", "You can get back to Pallet Town quicker that way."] },
                { "thing": "Ledge", "x": 192, "y": 432, "width": 128 },
                { "thing": "FenceWide", "x": 96, "y": 448, "height": 448 },
                { "thing": "FenceWide", "x": 576, "y": 448, "height": 448 },
                { "thing": "DirtLight", "x": 384, "y": 448, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 256, "y": 464, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtMedium", "x": 128, "y": 512, "width": 64, "height": 192 },
                { "thing": "DirtLight", "x": 192, "y": 512, "width": 256, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 448, "y": 528, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 192, "y": 576, "width": 64, "height": 64 },
                { "thing": "DirtMedium", "x": 256, "y": 576, "width": 320, "height": 64 },
                { "thing": "Ledge", "x": 128, "y": 624, "width": 32 },
                { "thing": "LedgeOpening", "x": 160, "y": 624, "width": 32 },
                { "thing": "Ledge", "x": 192, "y": 624, "width": 96, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 288, "y": 624, "width": 32 },
                { "thing": "Ledge", "x": 320, "y": 624, "width": 256 },
                { "thing": "DirtLight", "x": 192, "y": 640, "width": 384, "height": 64 },
                { "thing": "DirtMedium", "x": 128, "y": 704, "width": 384, "height": 128 },
                { "thing": "Grass", "x": 384, "y": 704, "width": 128, "height": 128 },
                { "thing": "DirtLight", "x": 512, "y": 704, "width": 64, "height": 128 },
                { "thing": "PlantSmall", "x": 128, "y": 736, "width": 256 },
                { "thing": "BugCatcher", "x": 160, "y": 768, "direction": 2, "roaming": true, "roamingDirections": [0, 8], "name": "ShopAdvertiser", "dialog": ["Hi! I work at a %%%%%%%POKEMON%%%%%%% MART.", "It's a convenient shop, so please visit us in VIRIDIAN CITY.", "I know, I'll give you a sample! Here you go!"], "dialogNext": "We also carry %%%%%%%POKE%%%%%%% BALLs for catching %%%%%%%POKEMON%%%%%%%!", "gift": "Potion" },
                { "thing": "Ledge", "x": 512, "y": 752, "width": 64, "jagged": true },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 256, "y": 784, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 128, "y": 832, "width": 448, "height": 64 },
                { "thing": "Sign", "x": 288, "y": 864, "dialog": "ROUTE 1 \n PALLET TOWN - VIRIDIAN CITY" },
                { "thing": "Ledge", "x": 128, "y": 880, "width": 64, "jagged": true },
                { "thing": "Ledge", "x": 320, "y": 880, "width": 256, "jagged": true },
                { "thing": "PlantSmall", "x": 96, "y": 896, "height": 256 },
                { "thing": "DirtMedium", "x": 128, "y": 896, "width": 192, "height": 288 },
                { "thing": "Grass", "x": 192, "y": 896, "width": 128, "height": 64 },
                { "thing": "DirtLight", "x": 320, "y": 896, "width": 64, "height": 160 },
                { "thing": "DirtMedium", "x": 384, "y": 896, "width": 192, "height": 288 },
                { "thing": "Grass", "x": 448, "y": 896, "width": 128, "height": 64 },
                { "thing": "PlantSmall", "x": 576, "y": 896, "height": 256 },
                { "thing": "Grass", "x": 128, "y": 960, "width": 128, "height": 64 },
                { "thing": "Grass", "x": 384, "y": 960, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 256, "y": 976, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 512, "y": 976, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "FenceWide", "x": 128, "y": 1024, "width": 192 },
                { "thing": "DirtMedium", "x": 320, "y": 1024, "width": 64, "height": 160 },
                { "thing": "Grass", "x": 320, "y": 1024, "width": 64, "height": 160 },
                { "thing": "FenceWide", "x": 384, "y": 1024, "width": 192 },
                { "thing": "FenceWide", "x": 288, "y": 1056, "height": 128 },
                { "thing": "FenceWide", "x": 384, "y": 1056, "height": 128 },
                { "thing": "ThemePlayer", "x": 320, "y": 1120, "width": 64, "theme": "Viridian City from Pallet Town" },
                { "thing": "FenceWide", "x": 96, "y": 1152 },
                { "thing": "ThemePlayer", "x": 320, "y": 1152, "width": 64, "theme": "Pallet Town" },
                { "thing": "FenceWide", "x": 576, "y": 1152 },
                { "thing": "AreaSpawner", "y": 1152, "width": 640, "map": "Pallet Town", "area": "Land", "direction": 2 }
            ]
        }
    }
};

/* tslint:enable max-line-length */
