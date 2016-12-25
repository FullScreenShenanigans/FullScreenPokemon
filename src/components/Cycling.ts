import { IPlayer } from "../IFullScreenPokemon";
import { Component } from "./Component";

/**
 * Cycling functions used by FullScreenPokemon instances.
 */
export class Cycling extends Component {
    /**
     * Starts the Player cycling if the current Area allows it.
     *
     * @param thing   A Player to start cycling.
     * @param area   The current Area.
     * @returns Whether the properties were changed.
     */
    public startCycling(thing: IPlayer): boolean {
        if (thing.surfing) {
            return false;
        }

        if (!this.fsp.mapScreener.variables.allowCycling) {
            return false;
        }

        thing.cycling = true;
        this.fsp.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = this.fsp.mathDecider.compute("speedCycling", thing);

        this.fsp.graphics.addClass(thing, "cycling");

        this.fsp.menus.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got on the bicycle!");
        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    public stopCycling(thing: IPlayer): void {
        thing.cycling = false;
        this.fsp.saves.popStateHistory(thing, "speed");

        this.fsp.graphics.removeClass(thing, "cycling");
        this.fsp.timeHandler.cancelClassCycle(thing, "cycling");

        this.fsp.menus.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got off the bicycle.");
    }

    /**
     * Toggles the Player's cycling status.
     *
     * @param thing   A Player to start or stop cycling.
     * @returns Whether the Player started cycling.
     */
    public toggleCycling(thing: IPlayer): boolean {
        if (thing.cycling) {
            this.stopCycling(thing);
            return true;
        }

        return this.startCycling(thing);
    }
}
