import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";

/**
 * Shrinks (and expands) Things.
 */
export class Shrinking extends Section<FullScreenPokemon> {
    /**
     * Shrinks a Thing down to nothing.
     *
     * @param thing   Thing to be shrunk.
     * @param onComplete   Callback for when this is done.
     */
    public contractDown(thing: IThing, onComplete: () => void): void {
        console.log("Todo: shrink", thing);
        thing.opacity = 0;
        onComplete();
    }

    /**
     * Expands a Thing from nothing to full size.
     *
     * @param thing   Thing to be expanded.
     * @param onComplete   Callback for when this is done.
     */
    public expandUp(thing: IThing, onComplete: () => void): void {
        console.log("Todo: expand", thing);
        thing.opacity = 1;
        onComplete();
    }
}
