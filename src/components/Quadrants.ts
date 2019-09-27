import { Physics as EightBittrPhysics } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<TEightBittr extends FullScreenPokemon> extends EightBittrPhysics<TEightBittr> {
    /**
     * How many Quadrant columns there are in the game, if not 6.
     */
    public readonly numCols = Math.ceil(this.eightBitter.settings.width / 64);

    /**
     * How many Quadrant rows there are in the game, if not 6.
     */
    public readonly numRows = Math.ceil(this.eightBitter.settings.height / 64);
}
