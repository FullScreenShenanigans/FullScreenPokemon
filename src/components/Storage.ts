import { GeneralComponent } from "gamestartr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../FullScreenPokemon";
import { ItemNames } from "./storage/ItemNames";

/**
 * Settings for storing items in ItemsHoldrs.
 */
export class Storage<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Keys for ItemsHoldr items.
     */
    @component(ItemNames)
    public readonly names: ItemNames<TGameStartr>;
}
