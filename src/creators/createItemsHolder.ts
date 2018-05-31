import { ItemsHoldr } from "itemsholdr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createItemsHolder = (fsp: FullScreenPokemon) => {
    const itemsHolder = new ItemsHoldr({
        prefix: "FullScreenPokemon::",
        values: {
            [fsp.storage.names.area]: {
                valueDefault: "",
            },
            [fsp.storage.names.badges]: {
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
            [fsp.storage.names.gameStarted]: {
                valueDefault: false,
            },
            [fsp.storage.names.hasPokedex]: {
                valueDefault: false,
            },
            [fsp.storage.names.items]: {
                valueDefault: [],
            },
            [fsp.storage.names.lastPokecenter]: {
                valueDefault: {
                    map: "Pallet Town",
                    location: "Player's House Door",
                },
            },
            [fsp.storage.names.location]: {
                valueDefault: "",
            },
            [fsp.storage.names.map]: {
                valueDefault: "",
            },
            [fsp.storage.names.money]: {
                valueDefault: 0,
                minimum: 0,
            },
            [fsp.storage.names.name]: {},
            [fsp.storage.names.nameRival]: {},
            [fsp.storage.names.pokedex]: {
                valueDefault: {},
            },
            [fsp.storage.names.pokemonInParty]: {
                valueDefault: [],
            },
            [fsp.storage.names.pokemonInPC]: {
                valueDefault: [],
            },
            [fsp.storage.names.starter]: {},
            [fsp.storage.names.starterRival]: {},
            [fsp.storage.names.time]: {
                valueDefault: 0,
            },
        },
        ...fsp.settings.components.itemsHolder,
    });

    itemsHolder.setAutoSave(itemsHolder.getItem(fsp.storage.names.autoSave));

    return itemsHolder;
};
