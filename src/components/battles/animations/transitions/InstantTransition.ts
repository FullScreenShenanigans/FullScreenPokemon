import { Transition } from "./Transition";

/**
 * Instantly-completing battle transition animation.
 *
 * @remarks Useful for tests!
 */
export class InstantTransition extends Transition {
    /**
     * Plays and immediately finishes the transition.
     */
    public play(): void {
        this.settings.onComplete();
    }
}
