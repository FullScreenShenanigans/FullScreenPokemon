import { Quadrants as EightBittrQuadrants } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<TEightBittr extends FullScreenPokemon> extends EightBittrQuadrants<TEightBittr> {
    /**
     * Groups that should have their quadrants updated.
     */
    public readonly activeGroupNames = [
        "Character",
        "Scenery",
        "Solid",
        "Terrain",
        "Text",
    ];

    /**
     * How many Quadrant columns there are in the game.
     */
    public readonly numCols = 8;

    /**
     * How many Quadrant rows there are in the game.
     */
    public readonly numRows = 8;
}
