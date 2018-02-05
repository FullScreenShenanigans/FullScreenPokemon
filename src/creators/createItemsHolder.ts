import { ItemsHoldr } from "itemsholdr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createItemsHolder = (fsp: FullScreenPokemon) => {
    const itemsHolder = new ItemsHoldr({
        prefix: "FullScreenPokemon::",
        values: {
            [fsp.items.names.area]: {
                valueDefault: "",
            },
            [fsp.items.names.badges]: {
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
            [fsp.items.names.gameStarted]: {
                valueDefault: false,
            },
            [fsp.items.names.hasPokedex]: {
                valueDefault: false,
            },
            [fsp.items.names.items]: {
                valueDefault: [],
            },
            [fsp.items.names.lastPokecenter]: {
                valueDefault: {
                    map: "Pallet Town",
                    location: "Player's House Door",
                },
            },
            [fsp.items.names.location]: {
                valueDefault: "",
            },
            [fsp.items.names.map]: {
                valueDefault: "",
            },
            [fsp.items.names.money]: {
                valueDefault: 0,
                minimum: 0,
            },
            [fsp.items.names.name]: {},
            [fsp.items.names.nameRival]: {},
            [fsp.items.names.pokedex]: {
                valueDefault: {},
            },
            [fsp.items.names.pokemonInParty]: {
                valueDefault: [],
            },
            [fsp.items.names.pokemonInPC]: {
                valueDefault: [],
            },
            [fsp.items.names.starter]: {},
            [fsp.items.names.starterRival]: {},
            [fsp.items.names.time]: {
                valueDefault: 0,
            },
        },
        ...fsp.settings.components.items,
    });

    itemsHolder.setAutoSave(itemsHolder.getItem(fsp.items.names.autoSave));

    return itemsHolder;
};
