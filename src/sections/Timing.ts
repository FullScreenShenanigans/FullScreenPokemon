import { Timing as EightBittrTiming } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Timing constants for delayed events.
 */
export class Timing<TEightBittr extends FullScreenPokemon> extends EightBittrTiming<TEightBittr> {
    /**
     * Default time separation between repeated events.
     */
    public readonly timingDefault = 9;
}
