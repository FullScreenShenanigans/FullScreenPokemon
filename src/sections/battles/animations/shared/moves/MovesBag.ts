import { Move } from "./Move";
import { Bubble } from "./moves/Bubble";
import { Ember } from "./moves/Ember";
import { Growl } from "./moves/Growl";
import { PayDay } from "./moves/PayDay";
import { PoisonSting } from "./moves/PoisonSting";
import { QuickAttack } from "./moves/QuickAttack";
import { Scratch } from "./moves/Scratch";
import { Slash } from "./moves/Slash";
import { Tackle } from "./moves/Tackle";
import { TailWhip } from "./moves/TailWhip";

/**
 * Battle move runners, keyed by move name.
 */
export interface MovesBag {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof Move;

    [i: string]: typeof Move;
}

/**
 * Built-in battle move runners, keyed by move name.
 */
export const DefaultMovesBag: MovesBag = {
    BUBBLE: Bubble,
    EMBER: Ember,
    GROWL: Growl,
    "QUICK ATTACK": QuickAttack,
    SCRATCH: Scratch,
    TACKLE: Tackle,
    "TAIL WHIP": TailWhip,
    SLASH: Slash,
    "PAY DAY": PayDay,
    "POISON STING": PoisonSting,
    default: Move,
};
