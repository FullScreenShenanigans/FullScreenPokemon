import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPlayer } from "./Things";

/**
 * Cycling functions used by FullScreenPokemon instances.
 */
export class Cycling<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
        this.gameStarter.saves.popStateHistory(thing, "speed");

        this.gameStarter.graphics.removeClass(thing, "cycling");
        this.gameStarter.timeHandler.cancelClassCycle(thing, "cycling");

        this.gameStarter.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got off the bicycle.");
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
