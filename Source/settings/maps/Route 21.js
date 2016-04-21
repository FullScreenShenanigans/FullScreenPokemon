FullScreenPokemon.FullScreenPokemon.settings.maps.library["Route 21"] = {
    "name": "Route 21",
    "locationDefault": "Temp",
    "locations": {
        "Temp": {
            "area": "Land"
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 160,
            "height": 720,
            "wildPokemon": {
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
                        "title": "SHELLDER".split(""),
                        "levels": [15],
                        "rate": .25
                    }, {
                        "title": "HORSEA".split(""),
                        "levels": [15],
                        "rate": .25
                    }, {
                        "title": "GOLDEEN".split(""),
                        "levels": [15],
                        "rate": .25
                    }, {
                        "title": "STARYU".split(""),
                        "levels": [15],
                        "rate": .25
                    }]
                }
            },
            "creation": [
                { "thing": "AreaSpawner", "map": "Pallet Town", "area": "Land", "direction": 0 },
                { "thing": "DirtMedium", "width": 32, "height": 112 },
                { "thing": "FenceWide", "width": 32 },
                { "macro": "Water", "x": 32, "width": 32, "height": 80, "open": [true, false, true, false] },
                { "thing": "DirtMedium", "x": 64, "width": 96, "height": 80 },
                { "thing": "FenceWide", "x": 64, "width": 96 },
                { "thing": "FenceWide", "x": 24, "y": 8, "height": 104 },
                { "thing": "FenceWide", "x": 112, "y": 8, "height": 120 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 80, "y": 20, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "Grass", "x": 64, "y": 32, "width": 48, "height": 48 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 36, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 36, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 52, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 68, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Water", "x": 32, "y": 80, "width": 32, "height": 32, "open": [true, true, true, false] },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 84, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Water", "x": 64, "y": 80, "width": 96, "height": 32, "open": [false, true, true, true] },
                { "macro": "Water", "y": 112, "width": 32, "height": 200, "open": [false, true, true, true] },
                { "macro": "Water", "x": 32, "y": 112, "width": 128, "height": 200, "open": [true, true, true, true] },
            ]
        }
    }
};