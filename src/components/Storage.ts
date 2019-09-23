import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPokemon } from "./Battles";
import { IPokedex } from "./constants/Pokemon";
import { IInventoryListing } from "./menus/Items";
import { ItemNames } from "./storage/ItemNames";

export interface ILastPokecenter {
    location: string | undefined;
    map: string;
}

/**
 * Items to be held in storage.
 */
export interface IStorageItems {
    area: string;
    autoSave: boolean;
    badges: {
        [i: string]: boolean;
    };
    gameStarted: boolean;
    hasPokedex: boolean;
    items: IInventoryListing[];
    lastPokecenter: ILastPokecenter;
    location: string | undefined;
    map: string;
    money: number;
    name: string[];
    nameRival: string[];
    oldLocalStorage?: IStorageItems;
    optionBattleAnimations: "ON" | "OFF";
    optionBattleStyle: "SHIFT" | "SET";
    optionTextSpeed: "FAST" | "MEDIUM" | "SLOW";
    pokedex: IPokedex;
    pokemonInParty: IPokemon[];
    pokemonInPC: IPokemon[];
    selectItem: string[] | undefined;
    stateCollectionKeys: string[];
    starter: string[];
    starterRival: string[];
    time: number;
}

/**
 * Settings for storing items in ItemsHoldrs.
 */
export class Storage<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Keys for ItemsHoldr items.
     */
    @component(ItemNames)
    public readonly names: ItemNames<TEightBittr>;
}
