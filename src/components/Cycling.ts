import { IPlayer } from "./IFullScreenPokemon";

/**
 * Cycling functions used by FullScreenPokemon instances.
 */
export class Cycling {
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

        if (!this.mapScreener.variables.allowCycling) {
            return false;
        }

        thing.cycling = true;
        this.storage.addStateHistory(thing, "speed", thing.speed);
        thing.speed = this.mathDecider.compute("speedCycling", thing);

        this.graphics.addClass(thing, "cycling");

        this.menus.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got on the bicycle!");
        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    public stopCycling(thing: IPlayer): void {
        thing.cycling = false;
        this.storage.popStateHistory(thing, "speed");

        this.graphics.removeClass(thing, "cycling");
        this.timeHandler.cancelClassCycle(thing, "cycling");

        this.menus.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got off the bicycle.");
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
