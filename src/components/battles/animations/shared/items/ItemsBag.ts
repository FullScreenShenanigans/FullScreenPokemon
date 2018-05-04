import { ItemAnimation } from "./ItemAnimation";
import { Pokeball } from "./items/Pokeball";
/**
 * Battle move runners, keyed by move name.
 */
export interface IItemsBag {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof ItemAnimation;

    [i: string]: typeof ItemAnimation;
}

/**
 * Built-in battle move runners, keyed by move name.
 */
export const DefaultItemsBag: IItemsBag = {
    POKEBALL: Pokeball,
    default: ItemAnimation,
};
