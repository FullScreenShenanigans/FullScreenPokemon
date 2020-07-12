import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPlayer } from "./Things";

/**
 * Starts and stop characters cycling.
 */
export class Cycling extends Section<FullScreenPokemon> {
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

        if (!this.game.mapScreener.variables.allowCycling) {
            return false;
        }

        thing.cycling = true;
        this.game.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = thing.speed * 2;

        this.game.graphics.classes.addClass(thing, "cycling");
        this.game.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got on the bicycle!");

        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    public stopCycling(thing: IPlayer): void {
        thing.cycling = false;

        this.game.graphics.classes.removeClass(thing, "cycling");
        this.game.saves.popStateHistory(thing, "speed");
        this.game.classCycler.cancelClassCycle(thing, "cycling");

        this.game.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got off the bicycle.");
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
