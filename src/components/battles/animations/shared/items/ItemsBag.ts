import { Item } from "./Item";
import { Pokeball } from "./items/Pokeball";
/**
 * Battle move runners, keyed by move name.
 */
export interface IItemsBag {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof Item;

    [i: string]: typeof Item;
}

/**
 * Built-in battle move runners, keyed by move name.
 */
export const DefaultItemsBag: IItemsBag = {
    POKEBALL: Pokeball,
    default: Item,
};
