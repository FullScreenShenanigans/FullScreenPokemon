/// <reference path="../FullScreenPokemon.ts" />
var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.maps = {
        "mapDefault": "Blank",
        "locationDefault": "Black",
        "groupTypes": ["Text", "Character", "Solid", "Scenery", "Terrain", "Thing"],
        "requireEntrance": true,
        "screenAttributes": [
            "allowCycling"
        ],
        "screenVariables": {
            "boundaries": FullScreenPokemon.FullScreenPokemon.prototype.getAreaBoundariesReal,
            "scrollability": FullScreenPokemon.FullScreenPokemon.prototype.getScreenScrollability
        },
        "onSpawn": FullScreenPokemon.FullScreenPokemon.prototype.addPreThing,
        "afterAdd": FullScreenPokemon.FullScreenPokemon.prototype.mapAddAfter,
        "macros": {
            "Checkered": FullScreenPokemon.FullScreenPokemon.prototype.macroCheckered,
            "Water": FullScreenPokemon.FullScreenPokemon.prototype.macroWater,
            "House": FullScreenPokemon.FullScreenPokemon.prototype.macroHouse,
            "HouseLarge": FullScreenPokemon.FullScreenPokemon.prototype.macroHouseLarge,
            "Building": FullScreenPokemon.FullScreenPokemon.prototype.macroBuilding,
            "Gym": FullScreenPokemon.FullScreenPokemon.prototype.macroGym,
            "Mountain": FullScreenPokemon.FullScreenPokemon.prototype.macroMountain,
            "PokeCenter": FullScreenPokemon.FullScreenPokemon.prototype.macroPokeCenter,
            "PokeMart": FullScreenPokemon.FullScreenPokemon.prototype.macroPokeMart
        },
        "entrances": {
            "Blank": FullScreenPokemon.FullScreenPokemon.prototype.mapEntranceBlank,
            "Normal": FullScreenPokemon.FullScreenPokemon.prototype.mapEntranceNormal
        },
        "paletteSchema": {
            "Pallet Town": [
                [0, 0, 0, 0],
                [255, 255, 255, 255],
                [0, 0, 0, 255],
                [188, 0, 188, 255],
                [60, 188, 252, 255],
                [116, 116, 116, 255],
                [156, 252, 240, 255],
                [188, 188, 188, 255],
                [252, 216, 168, 255],
                [252, 116, 180, 255],
                [136, 112, 0, 255],
                [24, 60, 92, 255],
                [0, 128, 136, 255],
                [92, 148, 252, 255]
            ]
        },
        "library": {
            "Blank": {
                "name": "Blank",
                "locationDefault": "Black",
                "locations": {
                    "Black": {
                        "area": "Black",
                        "entry": "Blank"
                    },
                    "White": {
                        "area": "White",
                        "entry": "Blank"
                    }
                },
                "areas": {
                    "Black": {
                        "creation": []
                    },
                    "White": {
                        "background": "white",
                        "creation": []
                    }
                }
            }
        }
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
