/// <reference path="../FullScreenPokemon.ts" />
var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.maps = {
        "mapDefault": "Blank",
        "locationDefault": "Black",
        "groupTypes": ["Text", "Character", "Solid", "Scenery", "Terrain"],
        "requireEntrance": true,
        "screenAttributes": [],
        "screenVariables": {
            "boundaries": FullScreenPokemon.FullScreenPokemon.prototype.getAreaBoundariesReal,
            "scrollability": FullScreenPokemon.FullScreenPokemon.prototype.getScreenScrollability,
            "thingsById": FullScreenPokemon.FullScreenPokemon.prototype.generateThingsByIdContainer
        },
        "onSpawn": FullScreenPokemon.FullScreenPokemon.prototype.addPreThing,
        "onUnspawn": FullScreenPokemon.FullScreenPokemon.prototype.removePreThing,
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
