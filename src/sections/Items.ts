import { Items as EightBittrItems } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

// TODO: declare item interface here (or at bottom of file?)
// ...then put that in FullScreenPokemon.ts

/**
 * Storage keys and value settings.
 */
export class Items<TEightBittr extends FullScreenPokemon> extends EightBittrItems<TEightBittr> {
    /**
     * Prefix to add before keys in storage.
     */
    public readonly prefix = "FullScreenPokemon::";

    /**
     * Initial settings for item values to store.
     */
    public readonly values = {
        [this.game.storage.names.area]: {
            valueDefault: "",
        },
        [this.game.storage.names.badges]: {
            valueDefault: {
                Boulder: false,
                Cascade: false,
                Thunder: false,
                Rainbow: false,
                Soul: false,
                Marsh: false,
                Volcano: false,
                Earth: false,
            },
        },
        [this.game.storage.names.gameStarted]: {
            valueDefault: false,
        },
        [this.game.storage.names.hasPokedex]: {
            valueDefault: false,
        },
        [this.game.storage.names.items]: {
            valueDefault: [],
        },
        [this.game.storage.names.lastPokecenter]: {
            valueDefault: {
                map: "Pallet Town",
                location: "Player's House Door",
            },
        },
        [this.game.storage.names.location]: {
            valueDefault: "",
        },
        [this.game.storage.names.map]: {
            valueDefault: "",
        },
        [this.game.storage.names.money]: {
            valueDefault: 0,
            minimum: 0,
        },
        [this.game.storage.names.name]: {},
        [this.game.storage.names.nameRival]: {},
        [this.game.storage.names.pokedex]: {
            valueDefault: {},
        },
        [this.game.storage.names.pokemonInParty]: {
            valueDefault: [],
        },
        [this.game.storage.names.pokemonInPC]: {
            valueDefault: [],
        },
        [this.game.storage.names.starter]: {},
        [this.game.storage.names.starterRival]: {},
        [this.game.storage.names.time]: {
            valueDefault: 0,
        },
    };
}
