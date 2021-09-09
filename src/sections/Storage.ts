import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Pokemon } from "./Battles";
import { Pokedex } from "./constants/Pokemon";
import { InventoryListing } from "./menus/Items";
import { ItemNames } from "./storage/ItemNames";

export interface LastPokecenter {
    location: string | undefined;
    map: string;
}

/**
 * Items to be held in storage.
 */
export interface StorageItems {
    area: string;
    autoSave: boolean;
    badges: {
        [i: string]: boolean;
    };
    gameStarted: boolean;
    hasPokedex: boolean;
    items: InventoryListing[];
    lastPokecenter: LastPokecenter;
    location: string | undefined;
    map: string;
    money: number;
    name: string[];
    nameRival: string[];
    oldLocalStorage?: StorageItems;
    pokedex: Pokedex;
    pokemonInParty: Pokemon[];
    pokemonInPC: Pokemon[];
    selectItem: string[] | undefined;
    stateCollectionKeys: string[];
    starter: string[];
    starterRival: string[];
    time: number;
}

/**
 * Settings for storing items in ItemsHoldrs.
 */
export class Storage extends Section<FullScreenPokemon> {
    /**
     * Keys for ItemsHoldr items.
     */
    @member(ItemNames)
    public readonly names: ItemNames;
}
