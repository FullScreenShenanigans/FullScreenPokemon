var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.items = {
        "prefix": "FullScreenPokemon::",
        "defaults": {
            "storeLocally": true
        },
        "values": {
            "gameStarted": {
                "valueDefault": false
            },
            "map": {
                "valueDefault": ""
            },
            "area": {
                "valueDefault": ""
            },
            "location": {
                "valueDefault": ""
            },
            "lastPokecenter": {
                "valueDefault": {
                    "map": "Pallet Town",
                    "location": "Player's House Door"
                }
            },
            "badges": {
                "valueDefault": {
                    "Brock": false,
                    "Misty": false,
                    "LtSurge": false,
                    "Erika": false,
                    "Koga": false,
                    "Sabrina": false,
                    "Blaine": false,
                    "Giovanni": false
                }
            },
            "items": {
                "valueDefault": []
            },
            "money": {
                "valueDefault": 0,
                "minimum": 0
            },
            "time": {
                "valueDefault": 0
            },
            "name": {},
            "nameRival": {},
            "starter": {},
            "starterRival": {},
            "hasPokedex": {
                "valueDefault": false
            },
            "Pokedex": {
                "valueDefault": {}
            },
            "PokemonInParty": {
                "valueDefault": []
            },
            "PokemonInPC": {
                "valueDefault": []
            }
        }
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
