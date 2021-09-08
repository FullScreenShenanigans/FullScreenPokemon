import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Actor } from "../Actors";

/**
 * Shrinks (and expands) Actors.
 */
export class Shrinking extends Section<FullScreenPokemon> {
    /**
     * Shrinks An Actor down to noactor.
     *
     * @param actor   Actor to be shrunk.
     * @param onComplete   Callback for when this is done.
     */
    public contractDown(actor: Actor, onComplete: () => void): void {
        console.log("Todo: shrink", actor);
        actor.opacity = 0;
        onComplete();
    }

    /**
     * Expands An Actor from noactor to full size.
     *
     * @param actor   Actor to be expanded.
     * @param onComplete   Callback for when this is done.
     */
    public expandUp(actor: Actor, onComplete: () => void): void {
        console.log("Todo: expand", actor);
        actor.opacity = 1;
        onComplete();
    }
}
