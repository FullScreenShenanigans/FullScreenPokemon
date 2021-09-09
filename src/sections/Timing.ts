import { Timing as EightBittrTiming } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Timing constants for delayed events.
 */
export class Timing<Game extends FullScreenPokemon> extends EightBittrTiming<Game> {
    /**
     * Default time separation between repeated events.
     */
    public readonly timingDefault = 9;
}
