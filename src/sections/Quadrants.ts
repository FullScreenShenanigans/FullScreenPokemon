import { Quadrants as EightBittrQuadrants } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<Game extends FullScreenPokemon> extends EightBittrQuadrants<Game> {
    /**
     * Groups that should have their quadrants updated.
     */
    public readonly activeGroupNames = ["Character", "Scenery", "Solid", "Terrain", "Text"];

    /**
     * How many Quadrant columns there are in the game.
     */
    public readonly numCols = 8;

    /**
     * How many Quadrant rows there are in the game.
     */
    public readonly numRows = 8;
}
