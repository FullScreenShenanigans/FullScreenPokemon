import { FullScreenPokemon } from "../../../../FullScreenPokemon";

import { Transition } from "./Transition";

/**
 * Instantly-completing battle transition animation.
 *
 * @remarks Useful for tests!
 */
export class InstantTransition<TEightBittr extends FullScreenPokemon> extends Transition<TEightBittr> {
    /**
     * Plays and immediately finishes the transition.
     */
    public play(): void {
        this.settings.onComplete();
    }
}
