import { Move } from "./Move";
import { GrowlMove } from "./moves/GrowlMove";

/**
 * Battle move runners, keyed by move name.
 */
export interface IMovesBag {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof Move;

    [i: string]: typeof Move;
}

/**
 * Built-in battle move runners used by FullScreenPokemon instances.
 */
export const DefaultMovesBag: IMovesBag = {
    GROWL: GrowlMove,
    default: Move
};
