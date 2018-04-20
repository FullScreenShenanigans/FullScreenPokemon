import { FullScreenPokemon } from "../../../../FullScreenPokemon";

import { Transition } from "./Transition";

/**
 * Instantly-completing battle transition animation.
 *
 * @remarks Useful for tests!
 */
export class InstantTransition<TGameStartr extends FullScreenPokemon> extends Transition<TGameStartr> {
    /**
     * Plays and immediately finishes the transition.
     */
    public play(): void {
        this.settings.onComplete();
    }
}
