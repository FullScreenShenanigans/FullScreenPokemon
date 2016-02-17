/// <reference path="../FullScreenPokemon.ts" />

module FullScreenPokemon {
    "use strict";

    FullScreenPokemon.settings.maps = {
        "mapDefault": "Blank",
        "locationDefault": "Black",
        "groupTypes": ["Text", "Character", "Solid", "Scenery", "Terrain"],
        "requireEntrance": true,
        "screenAttributes": [
            "allowCycling"
        ],
        "screenVariables": {
            "boundaries": FullScreenPokemon.prototype.getAreaBoundariesReal,
            "scrollability": FullScreenPokemon.prototype.getScreenScrollability,
            "thingsById": FullScreenPokemon.prototype.generateThingsByIdContainer
        },
        "onSpawn": FullScreenPokemon.prototype.addPreThing,
        "afterAdd": FullScreenPokemon.prototype.mapAddAfter,
        "macros": {
            "Checkered": FullScreenPokemon.prototype.macroCheckered,
            "Water": FullScreenPokemon.prototype.macroWater,
            "House": FullScreenPokemon.prototype.macroHouse,
            "HouseLarge": FullScreenPokemon.prototype.macroHouseLarge,
            "Building": FullScreenPokemon.prototype.macroBuilding,
            "Gym": FullScreenPokemon.prototype.macroGym,
            "Mountain": FullScreenPokemon.prototype.macroMountain,
            "PokeCenter": FullScreenPokemon.prototype.macroPokeCenter,
            "PokeMart": FullScreenPokemon.prototype.macroPokeMart
        },
        "entrances": {
            "Blank": FullScreenPokemon.prototype.mapEntranceBlank,
            "Normal": FullScreenPokemon.prototype.mapEntranceNormal
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
}
