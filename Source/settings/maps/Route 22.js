FullScreenPokemon.FullScreenPokemon.settings.maps.library["Route 22"] = {
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
            "width": 320,
            "height": 144,
            "wildPokemon": {
                "grass": [{
                    "title": "RATTATA".split(""),
                    "levels": [2, 3, 4],
                    "rate": .5
                }, {
                    "title": "SPEAROW".split(""),
                    "levels": [3, 5],
                    "rate": .1
                }, {
                    "title": ["N", "I", "D", "O", "R", "A", "N", "FemaleSymbol"],
                    "levels": [2, 3, 4],
                    "rate": .35
                }, {
                    "title": ["N", "I", "D", "O", "R", "A", "N", "MaleSymbol"],
                    "levels": [3, 4],
                    "rate": .05
                }]
            },
            "creation": [
                { "thing": "AreaSpawner", "x": 320, "height": 320, "map": "Viridian City", "area": "Land", "direction": 1, "offsetY": -64 },
                { "thing": "FenceWide", "width": 16, "height": 16 },
                { "thing": "DirtLight", "width": 112, "height": 48 },
                { "macro": "Building", "x": 16, "stories": 3, "width": 96,/* "door": true,*/ "doorOffset": 48, "entrance": "Pokemon League" },
                { "macro": "Mountain", "x": 112, "width": 208, "height": 8, "left": true },
                { "macro": "Mountain", "x": 112, "y": 8, "width": 128, "height": 24, "right": true, "bottom": true, "left": true },
                { "macro": "Mountain", "x": 232, "y": 8, "width": 56, "bottom": true },
                { "macro": "Mountain", "x": 288, "y": 8, "width": 32, "height": 40, "bottom": true, "left": true },
                { "macro": "Mountain", "y": 16, "top": true, "right": true, "width": 16, "height": 112 },
                { "thing": "DirtMedium", "x": 240, "y": 16, "width": 48, "height": 16 },
                { "thing": "DirtLight", "x": 112, "y": 32, "width": 16, "height": 64 },
                { "thing": "FenceWide", "x": 112, "y": 32, "width": 16, "height": 64 },
                { "thing": "Ledge", "x": 240, "y": 28, "width": 24, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 264, "y": 28 },
                { "thing": "Ledge", "x": 272, "y": 28, "width": 16 },
                { "thing": "BrickRoad", "x": 128, "y": 32, "width": 160, "height": 16 },
                { "thing": "BrickRoad", "x": 16, "y": 48, "width": 96, "height": 16 },
                { "thing": "CutsceneTriggerer", "x": 228, "y": 32, "height": 16, "id": "RivalTriggerer", "cutscene": "RivalRoute22" },
                { "thing": "DirtMedium", "x": 128, "y": 48, "width": 48, "height": 16 },
                { "macro": "Water", "x": 176, "y": 48, "width": 32, "height": 32, "open": [false, false, true, false] },
                { "thing": "DirtMedium", "x": 208, "y": 48, "width": 80, "height": 64 },
                { "thing": "DirtMedium", "x": 288, "y": 48, "width": 32, "height": 16 },
                { "macro": "Mountain", "x": 208, "y": 48, "width": 32, "height": 64, "top": true, "right": true, "bottom": true, "left": true },
                { "thing": "FenceWide", "x": 272, "y": 48, "width": 16 },
                { "thing": "ThemePlayer", "x": 312, "y": 48, "height": 32, "theme": "Cerulean from Mount Moon" },
                { "thing": "FenceWide", "x": 272, "y": 56, "height": 40 },
                { "thing": "Ledge", "x": 128, "y": 60, "width": 48 },
                { "thing": "Ledge", "x": 240, "y": 60, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 248, "y": 60 },
                { "thing": "Ledge", "x": 256, "y": 60, "width": 16 },
                { "thing": "DirtMedium", "x": 16, "y": 64, "width": 96, "height": 16 },
                { "thing": "DirtMedium", "x": 128, "y": 64, "width": 48, "height": 32 },
                { "thing": "Grass", "x": 128, "y": 64, "width": 48, "height": 32 },
                { "thing": "Grass", "x": 240, "y": 64, "width": 32, "height": 32 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 288, "y": 64, "xnum": 4, "ynum": 2 },
                { "thing": "Ledge", "x": 16, "y": 76, "width": 72, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 88, "y": 76 },
                { "thing": "Ledge", "x": 96, "y": 76, "width": 16 },
                { "thing": "DirtLight", "x": 16, "y": 80, "width": 96, "height": 16 },
                { "thing": "BrickRoad", "x": 176, "y": 80, "width": 32, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 288, "y": 80, "xnum": 2, "ynum": 2 },
                { "thing": "FenceVertical", "x": 48, "y": 88, "width": 8 },
                { "thing": "Sign", "x": 56, "y": 88, "dialog": "POKEMON LEAGUE Front Gate" },
                { "thing": "FenceVertical", "x": 64, "y": 88, "width": 48 },
                { "thing": "DirtClean", "x": 304, "y": 80 },
                { "macro": "Mountain", "x": 304, "y": 80, "top": true, "left": true, "width": 16, "height": 48 },
                { "thing": "DirtMedium", "x": 16, "y": 96, "width": 192, "height": 16 },
                { "thing": "DirtMedium", "x": 288, "y": 96, "width": 16, "height": 16 },
                { "thing": "Ledge", "x": 16, "y": 108, "width": 192 },
                { "thing": "Ledge", "x": 240, "y": 108, "width": 24, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 264, "y": 108 },
                { "thing": "Ledge", "x": 272, "y": 108, "width": 32 },
                { "thing": "BrickRoad", "x": 16, "y": 112, "width": 288, "height": 16 },
                { "thing": "Mountain", "y": 128, "width": 16, "height": 16 },
                { "thing": "Mountain", "x": 16, "y": 128, "width": 288, "height": 16, "top": true },
                { "thing": "Mountain", "x": 304, "y": 128, "width": 16, "height": 16 }
            ]
        }
    }
};