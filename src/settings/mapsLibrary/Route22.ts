import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const Route22: IMapRaw = {
    "name": "Route 22",
    "theme": "Cerulean from Mount Moon",
    "locationDefault": "Pokemon League",
    "locations": {
        "Pokemon League": {
            "area": "Land"
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 1280,
            "height": 576,
            "wildPokemon": {
                "grass": [{
                    "title": "RATTATA".split(""),
                    "levels": [2, 3, 4],
                    "rate": .5
                }, {
                    "title": "SPEAROW".split(""),
                    "levels": [3, 5],
                    "rate": 0.1
                }, {
                    "title": ["N", "I", "D", "O", "R", "A", "N", "FemaleSymbol"],
                    "levels": [2, 3, 4],
                    "rate": 0.35
                }, {
                    "title": ["N", "I", "D", "O", "R", "A", "N", "MaleSymbol"],
                    "levels": [3, 4],
                    "rate": 0.05
                }],
                "fishing": {
                    "old": [{
                        "title": "MAGIKARP".split(""),
                        "levels": [5],
                        "rate": 1
                    }],
                    "good": [{
                        "title": "POLIWAG".split(""),
                        "levels": [10],
                        "rate": .5
                    }, {
                        "title": "GOLDEEN".split(""),
                        "levels": [10],
                        "rate": .5
                    }],
                    "super": [{
                        "title": "POLIWAG".split(""),
                        "levels": [20],
                        "rate": .5
                    }, {
                        "title": "GOLDEEN".split(""),
                        "levels": [20],
                        "rate": .5
                    }]
                }
            },
            "creation": [
                { "thing": "AreaSpawner", "x": 1280, "height": 1280, "map": "Viridian City", "area": "Land", "direction": 1, "offsetY": -256 },
                { "thing": "FenceWide", "width": 64, "height": 64 },
                { "thing": "DirtLight", "width": 448, "height": 192 },
                { "macro": "Building", "x": 64, "stories": 3, "width": 384, /* "door": true,*/ "doorOffset": 192, "entrance": "Pokemon League" },
                { "macro": "Mountain", "x": 448, "width": 832, "height": 32, "left": true },
                { "macro": "Mountain", "x": 448, "y": 32, "width": 512, "height": 96, "right": true, "bottom": true, "left": true },
                { "macro": "Mountain", "x": 928, "y": 32, "width": 224, "bottom": true },
                { "macro": "Mountain", "x": 1152, "y": 32, "width": 128, "height": 160, "bottom": true, "left": true },
                { "macro": "Mountain", "y": 64, "top": true, "right": true, "width": 64, "height": 448 },
                { "thing": "DirtMedium", "x": 960, "y": 64, "width": 192, "height": 64 },
                { "thing": "DirtLight", "x": 448, "y": 128, "width": 64, "height": 256 },
                { "thing": "FenceWide", "x": 448, "y": 128, "width": 64, "height": 256 },
                { "thing": "Ledge", "x": 960, "y": 112, "width": 96, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 1056, "y": 112 },
                { "thing": "Ledge", "x": 1088, "y": 112, "width": 64 },
                { "thing": "BrickRoad", "x": 512, "y": 128, "width": 640, "height": 64 },
                { "thing": "BrickRoad", "x": 64, "y": 192, "width": 384, "height": 64 },
                { "thing": "CutsceneTriggerer", "x": 912, "y": 128, "height": 64, "id": "RivalTriggerer", "cutscene": "RivalRoute22" },
                { "thing": "DirtMedium", "x": 512, "y": 192, "width": 192, "height": 64 },
                { "macro": "Water", "x": 704, "y": 192, "width": 128, "height": 128, "open": [false, false, true, false] },
                { "thing": "DirtMedium", "x": 832, "y": 192, "width": 320, "height": 256 },
                { "thing": "DirtMedium", "x": 1152, "y": 192, "width": 128, "height": 64 },
                { "macro": "Mountain", "x": 832, "y": 192, "width": 128, "height": 256, "top": true, "right": true, "bottom": true, "left": true },
                { "thing": "FenceWide", "x": 1088, "y": 192, "width": 64 },
                { "thing": "ThemePlayer", "x": 1248, "y": 192, "height": 128, "theme": "Cerulean from Mount Moon" },
                { "thing": "FenceWide", "x": 1088, "y": 224, "height": 160 },
                { "thing": "Ledge", "x": 512, "y": 240, "width": 192 },
                { "thing": "Ledge", "x": 960, "y": 240, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 992, "y": 240 },
                { "thing": "Ledge", "x": 1024, "y": 240, "width": 64 },
                { "thing": "DirtMedium", "x": 64, "y": 256, "width": 384, "height": 64 },
                { "thing": "DirtMedium", "x": 512, "y": 256, "width": 192, "height": 128 },
                { "thing": "Grass", "x": 512, "y": 256, "width": 192, "height": 128 },
                { "thing": "Grass", "x": 960, "y": 256, "width": 128, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1152, "y": 256, "xnum": 4, "ynum": 2 },
                { "thing": "Ledge", "x": 64, "y": 304, "width": 288, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 352, "y": 304 },
                { "thing": "Ledge", "x": 384, "y": 304, "width": 64 },
                { "thing": "DirtLight", "x": 64, "y": 320, "width": 384, "height": 64 },
                { "thing": "BrickRoad", "x": 704, "y": 320, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1152, "y": 320, "xnum": 2, "ynum": 2 },
                { "thing": "FenceVertical", "x": 192, "y": 352, "width": 32 },
                { "thing": "Sign", "x": 224, "y": 352, "dialog": "POKEMON LEAGUE Front Gate" },
                { "thing": "FenceVertical", "x": 256, "y": 352, "width": 192 },
                { "thing": "DirtClean", "x": 1216, "y": 320 },
                { "macro": "Mountain", "x": 1216, "y": 320, "top": true, "left": true, "width": 64, "height": 192 },
                { "thing": "DirtMedium", "x": 64, "y": 384, "width": 768, "height": 64 },
                { "thing": "DirtMedium", "x": 1152, "y": 384, "width": 64, "height": 64 },
                { "thing": "Ledge", "x": 64, "y": 432, "width": 768 },
                { "thing": "Ledge", "x": 960, "y": 432, "width": 96, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 1056, "y": 432 },
                { "thing": "Ledge", "x": 1088, "y": 432, "width": 128 },
                { "thing": "BrickRoad", "x": 64, "y": 448, "width": 1152, "height": 64 },
                { "thing": "Mountain", "y": 512, "width": 64, "height": 64 },
                { "macro": "Mountain", "x": 64, "y": 512, "width": 1152, "height": 64, "top": true },
                { "thing": "Mountain", "x": 1216, "y": 512, "width": 64, "height": 64 }
            ]
        }
    }
};

/* tslint:enable max-line-length */
