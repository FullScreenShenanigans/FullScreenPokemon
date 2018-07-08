import { ItemAnimation } from "./ItemAnimation";
import { Pokeball } from "./items/Pokeball";
/**
 * Battle item runners, keyed by item name.
 */
export interface IItemsBag {
    /**
     * Item for when an implementation cannot be found.
     */
    default: typeof ItemAnimation;

    [i: string]: typeof ItemAnimation;
}

/**
 * Built-in battle item runners, keyed by item name.
 */
export const DefaultItemsBag: IItemsBag = {
    POKEBALL: Pokeball,
    default: ItemAnimation,
};
