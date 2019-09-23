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
        [this.eightBitter.storage.names.area]: {
            valueDefault: "",
        },
        [this.eightBitter.storage.names.badges]: {
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
        [this.eightBitter.storage.names.gameStarted]: {
            valueDefault: false,
        },
        [this.eightBitter.storage.names.hasPokedex]: {
            valueDefault: false,
        },
        [this.eightBitter.storage.names.items]: {
            valueDefault: [],
        },
        [this.eightBitter.storage.names.lastPokecenter]: {
            valueDefault: {
                map: "Pallet Town",
                location: "Player's House Door",
            },
        },
        [this.eightBitter.storage.names.location]: {
            valueDefault: "",
        },
        [this.eightBitter.storage.names.optionBattleAnimations]: {
            valueDefault: "ON",
        },
        [this.eightBitter.storage.names.optionBattleStyle]: {
            valueDefault: "SHIFT",
        },
        [this.eightBitter.storage.names.optionTextSpeed]: {
            valueDefault: "FAST",
        },
        [this.eightBitter.storage.names.map]: {
            valueDefault: "",
        },
        [this.eightBitter.storage.names.money]: {
            valueDefault: 0,
            minimum: 0,
        },
        [this.eightBitter.storage.names.name]: {},
        [this.eightBitter.storage.names.nameRival]: {},
        [this.eightBitter.storage.names.pokedex]: {
            valueDefault: {},
        },
        [this.eightBitter.storage.names.pokemonInParty]: {
            valueDefault: [],
        },
        [this.eightBitter.storage.names.pokemonInPC]: {
            valueDefault: [],
        },
        [this.eightBitter.storage.names.starter]: {},
        [this.eightBitter.storage.names.starterRival]: {},
        [this.eightBitter.storage.names.time]: {
            valueDefault: 0,
        },
    };
}
