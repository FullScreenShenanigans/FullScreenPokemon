import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateItemsSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.items = {
        allowAutoSave: true,
        autoSave: false,
        containersArguments: undefined,
        defaults: {
            storeLocally: {
                value: true
            } as any
        },
        prefix: "FullScreenPokemon::",
        values: {
            area: {
                valueDefault: ""
            },
            badges: {
                valueDefault: {
                    Boulder: false,
                    Cascade: false,
                    Thunder: false,
                    Rainbow: false,
                    Soul: false,
                    Marsh: false,
                    Volcano: false,
                    Earth: false
                }
            },
            gameStarted: {
                valueDefault: false
            },
            hasPokedex: {
                valueDefault: false
            },
            items: {
                valueDefault: []
            },
            lastPokecenter: {
                valueDefault: {
                    map: "Pallet Town",
                    location: "Player's House Door"
                }
            },
            location: {
                valueDefault: ""
            },
            map: {
                valueDefault: ""
            },
            money: {
                valueDefault: 0,
                minimum: 0
            },
            name: {},
            nameRival: {},
            Pokedex: {
                valueDefault: {}
            },
            PokemonInParty: {
                valueDefault: []
            },
            PokemonInPC: {
                valueDefault: []
            },
            starter: {},
            starterRival: {},
            time: {
                valueDefault: 0
            }
        }
    };
}
