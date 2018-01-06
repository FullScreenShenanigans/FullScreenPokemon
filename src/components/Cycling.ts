import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPlayer } from "./Things";

/**
 * Starts and stop characters cycling.
 */
export class Cycling<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Starts the Player cycling if the current Area allows it.
     *
     * @param thing   A Player to start cycling.
     * @param area   The current Area.
     * @returns Whether the player started cycling.
     */
    public startCycling(thing: IPlayer): boolean {
        if (thing.surfing) {
            return false;
        }

        if (!this.gameStarter.mapScreener.variables.allowCycling) {
            return false;
        }

        thing.cycling = true;
        this.gameStarter.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = thing.speed * 2;

        this.gameStarter.graphics.addClass(thing, "cycling");
        this.gameStarter.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got on the bicycle!");

        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    public stopCycling(thing: IPlayer): void {
        thing.cycling = false;

        this.gameStarter.graphics.removeClass(thing, "cycling");
        this.gameStarter.saves.popStateHistory(thing, "speed");
        this.gameStarter.timeHandler.cancelClassCycle(thing, "cycling");

        this.gameStarter.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got off the bicycle.");
    }

    /**
     * Toggles the Player's cycling status.
     *
     * @param thing   A Player to start or stop cycling.
     */
    public toggleCycling(thing: IPlayer): void {
        if (thing.cycling) {
            this.stopCycling(thing);
        } else {
            this.startCycling(thing);
        }
    }
}
