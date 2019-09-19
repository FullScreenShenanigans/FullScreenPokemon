import { Frames as EightBittrFrames } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * How to advance each frame of the game.
 */
export class Frames<TEightBittr extends FullScreenPokemon> extends EightBittrFrames<TEightBittr> {
    /**
     * How many milliseconds should be between each game tick.
     */
    public readonly interval = 1000 / 60;

    /**
     * Function run each frame of the game, on the interval.
     *
     * @param adjustedTimestamp   Current millisecond timestamp.
     */
    public readonly tick = (adjustedTimestamp: DOMHighResTimeStamp) => {
        this.eightBitter.fpsAnalyzer.tick(adjustedTimestamp);

        this.eightBitter.pixelDrawer.refillGlobalCanvas();

        this.eightBitter.quadsKeeper.determineAllQuadrants("Terrain", this.eightBitter.groupHolder.getGroup("Terrain"));
        this.eightBitter.quadsKeeper.determineAllQuadrants("Scenery", this.eightBitter.groupHolder.getGroup("Scenery"));
        this.eightBitter.quadsKeeper.determineAllQuadrants("Solid", this.eightBitter.groupHolder.getGroup("Solid"));

        this.eightBitter.maintenance.maintainGeneric(this.eightBitter.groupHolder.getGroup("Text"));
        this.eightBitter.maintenance.maintainGeneric(this.eightBitter.groupHolder.getGroup("Terrain"));
        this.eightBitter.maintenance.maintainGeneric(this.eightBitter.groupHolder.getGroup("Scenery"));
        this.eightBitter.maintenance.maintainGeneric(this.eightBitter.groupHolder.getGroup("Solid"));
        this.eightBitter.maintenance.maintainCharacters(this.eightBitter.groupHolder.getGroup("Character"));
        this.eightBitter.maintenance.maintainPlayer(this.eightBitter.players[0]);

        this.eightBitter.timeHandler.advance();
    }
}
