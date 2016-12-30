import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const Route21: IMapRaw = {
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
            "width": 640,
            "height": 2880,
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
                { "thing": "DirtMedium", "width": 128, "height": 448 },
                { "thing": "FenceWide", "width": 128 },
                { "macro": "Water", "x": 128, "width": 128, "height": 320, "open": [true, false, true, false] },
                { "thing": "DirtMedium", "x": 256, "width": 384, "height": 320 },
                { "thing": "FenceWide", "x": 256, "width": 384 },
                { "thing": "FenceWide", "x": 96, "y": 32, "height": 416 },
                { "thing": "FenceWide", "x": 448, "y": 32, "height": 480 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 320, "y": 80, "xnum": 8 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "thing": "Grass", "x": 256, "y": 128, "width": 192, "height": 192 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 512, "y": 144, "xnum": 4 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 144, "xnum": 4 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 208, "xnum": 4 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 272, "xnum": 4 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "macro": "Water", "x": 128, "y": 320, "width": 128, "height": 128, "open": [true, true, true, false] },
                { "macro": "Checkered", "things": ["", "Flower"], "y": 336, "xnum": 4 /* fixed */, "ynum": 2 /* fixed */, "xwidth": 16, "yheight": 16 },
                { "macro": "Water", "x": 256, "y": 320, "width": 384, "height": 128, "open": [false, true, true, true] },
                { "macro": "Water", "y": 448, "width": 128, "height": 800, "open": [false, true, true, true] },
                { "macro": "Water", "x": 128, "y": 448, "width": 512, "height": 800, "open": [true, true, true, true] },
            ]
        }
    }
};

/* tslint:enable max-line-length */
