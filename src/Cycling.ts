/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IPlayer, IThing } from "./IFullScreenPokemon";

/**
 * Cycling functions used by FullScreenPokemon instances.
 */
export class Cycling<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Starts the Player cycling if the current Area allows it.
     *
     * @param thing   A Player to start cycling.
     * @param area   The current Area.
     * @returns Whether the properties were changed.
     */
    startCycling(thing: IPlayer): boolean {
        if (thing.surfing) {
            return false;
        }

        if (!(<IArea>this.AreaSpawner.getArea()).allowCycling) {
            return false;
        }

        thing.cycling = true;
        thing.FSP.addStateHistory(thing, "speed", thing.speed);
        thing.speed = thing.FSP.MathDecider.compute("speedCycling", thing);

        thing.FSP.addClass(thing, "cycling");

        thing.FSP.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got on the bicycle!");
        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param thing   A Player to stop cycling.
     */
    stopCycling(thing: IPlayer): void {
        thing.cycling = false;
        thing.FSP.popStateHistory(thing, "speed");

        thing.FSP.removeClass(thing, "cycling");
        thing.FSP.TimeHandler.cancelClassCycle(thing, "cycling");

        thing.FSP.displayMessage(thing, "%%%%%%%PLAYER%%%%%%% got off the bicycle.");
    }

    /**
     * Toggles the Player's cycling status.
     *
     * @param thing   A Player to start or stop cycling.
     * @returns Whether the Player started cycling.
     */
    toggleCycling(thing: IPlayer): boolean {
        if (thing.cycling) {
            thing.FSP.stopCycling(thing);
            return true;
        }

        return thing.FSP.startCycling(thing);
    }
}
