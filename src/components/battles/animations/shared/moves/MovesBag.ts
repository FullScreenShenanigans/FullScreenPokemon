import { Move } from "./Move";
import { Bubble } from "./moves/Bubble";
import { Ember } from "./moves/Ember";
import { Growl } from "./moves/Growl";
import { QuickAttack } from "./moves/QuickAttack";
import { Scratch } from "./moves/Scratch";
import { Slash } from "./moves/Slash";
import { Tackle } from "./moves/Tackle";
import { TailWhip } from "./moves/TailWhip";
import { PayDay } from "./moves/PayDay";

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
 * Built-in battle move runners, keyed by move name.
 */
export const DefaultMovesBag: IMovesBag = {
    "BUBBLE": Bubble,
    "EMBER": Ember,
    "GROWL": Growl,
    "QUICK ATTACK": QuickAttack,
    "SCRATCH": Scratch,
    "TACKLE": Tackle,
    "TAIL WHIP": TailWhip,
    "SLASH" : Slash,
    "PAY DAY" : PayDay,
    "default": Move,
};
