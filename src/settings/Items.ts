import { IItemsHoldrSettings } from "itemsholdr";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Item settings for the FullScreenPokemon instance.
 */
export const GenerateItemsSettings = (): Partial<IItemsHoldrSettings> => ({
    autoSave: false,
    defaults: {
        storeLocally: {
            value: true,
        },
    },
    prefix: "FullScreenPokemon::",
    values: {
        area: {
            valueDefault: "",
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
                Earth: false,
            },
        },
        gameStarted: {
            valueDefault: false,
        },
        hasPokedex: {
            valueDefault: false,
        },
        items: {
            valueDefault: [],
        },
        lastPokecenter: {
            valueDefault: {
                map: "Pallet Town",
                location: "Player's House Door",
            },
        },
        location: {
            valueDefault: "",
        },
        map: {
            valueDefault: "",
        },
        money: {
            valueDefault: 0,
            minimum: 0,
        },
        name: {},
        nameRival: {},
        Pokedex: {
            valueDefault: {},
        },
        PokemonInParty: {
            valueDefault: [],
        },
        PokemonInPC: {
            valueDefault: [],
        },
        starter: {},
        starterRival: {},
        time: {
            valueDefault: 0,
        },
    },
});
