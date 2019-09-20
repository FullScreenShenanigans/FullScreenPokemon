import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPlayer } from "./Things";

/**
 * Starts and stop characters cycling.
 */
export class Cycling<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
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

        if (!this.eightBitter.mapScreener.variables.allowCycling) {
            return false;
        }

        thing.cycling = true;
        this.eightBitter.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = thing.speed * 2;

        this.eightBitter.graphics.classes.addClass(thing, "cycling");
        this.eightBitter.menus.displayMessage("%PLAYER% got on the bicycle!");

        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    public stopCycling(thing: IPlayer): void {
        thing.cycling = false;

        this.eightBitter.graphics.classes.removeClass(thing, "cycling");
        this.eightBitter.saves.popStateHistory(thing, "speed");
        this.eightBitter.classCycler.cancelClassCycle(thing, "cycling");

        this.eightBitter.menus.displayMessage("%PLAYER% got off the bicycle.");
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
