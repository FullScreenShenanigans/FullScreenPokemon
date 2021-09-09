import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Player } from "./Actors";

/**
 * Starts and stop characters cycling.
 */
export class Cycling extends Section<FullScreenPokemon> {
    /**
     * Starts the Player cycling if the current Area allows it.
     *
     * @param actor   A Player to start cycling.
     * @param area   The current Area.
     * @returns Whether the player started cycling.
     */
    public startCycling(actor: Player): boolean {
        if (actor.surfing) {
            return false;
        }

        if (!this.game.mapScreener.variables.allowCycling) {
            return false;
        }

        actor.cycling = true;
        this.game.saves.addStateHistory(actor, "speed", actor.speed);
        actor.speed = actor.speed * 2;

        this.game.graphics.classes.addClass(actor, "cycling");
        this.game.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got on the bicycle!");

        return true;
    }

    /**
     * Stops the Player cycling.
     *
     * @param actor   A Player to stop cycling.
     */
    public stopCycling(actor: Player): void {
        actor.cycling = false;

        this.game.graphics.classes.removeClass(actor, "cycling");
        this.game.saves.popStateHistory(actor, "speed");
        this.game.classCycler.cancelClassCycle(actor, "cycling");

        this.game.menus.displayMessage("%%%%%%%PLAYER%%%%%%% got off the bicycle.");
    }

    /**
     * Toggles the Player's cycling status.
     *
     * @param actor   A Player to start or stop cycling.
     */
    public toggleCycling(actor: Player): void {
        if (actor.cycling) {
            this.stopCycling(actor);
        } else {
            this.startCycling(actor);
        }
    }
}
