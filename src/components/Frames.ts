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

        this.eightBitter.quadsKeeper.determineAllQuadrants(
            this.eightBitter.groups.names.terrain,
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.terrain),
        );
        this.eightBitter.quadsKeeper.determineAllQuadrants(
            this.eightBitter.groups.names.scenery,
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.scenery),
        );
        this.eightBitter.quadsKeeper.determineAllQuadrants(
            this.eightBitter.groups.names.solid,
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.solid),
        );

        this.eightBitter.maintenance.maintainGeneric(
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.text),
        );
        this.eightBitter.maintenance.maintainGeneric(
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.terrain),
        );
        this.eightBitter.maintenance.maintainGeneric(
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.scenery),
        );
        this.eightBitter.maintenance.maintainGeneric(
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.solid),
        );
    
        this.eightBitter.maintenance.maintainCharacters(
            this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.character),
        );
        this.eightBitter.maintenance.maintainPlayer(
            this.eightBitter.players[0],
        );

        this.eightBitter.timeHandler.advance();
    }
}
