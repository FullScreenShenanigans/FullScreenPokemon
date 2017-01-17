import { Move } from "./Move";
import { Bubble } from "./moves/Bubble";
import { Ember } from "./moves/Ember";
import { Growl } from "./moves/Growl";
import { QuickAttack } from "./moves/QuickAttack";
import { Scratch } from "./moves/Scratch";
import { Tackle } from "./moves/Tackle";
import { TailWhip } from "./moves/TailWhip";

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
    BUBBLE: Bubble,
    EMBER: Ember,
    GROWL: Growl,
    "QUICK ATTACK": QuickAttack,
    SCRATCH: Scratch,
    TACKLE: Tackle,
    "TAIL WHIP": TailWhip,
    default: Move
};
