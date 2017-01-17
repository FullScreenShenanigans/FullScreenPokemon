import { FullScreenPokemon } from "../../../../FullScreenPokemon";

import { Transition } from "./Transition";

/**
 * Flash battle transition animation used by FullScreenPokemon instances.
 */
export class FlashTransition<TGameStartr extends FullScreenPokemon> extends Transition<TGameStartr> {
    /**
     * How much to change the visible opacity each change.
     */
    private readonly change: number = .33;

    /**
     * Colors to flash in.
     */
    private readonly flashColors: string[] = ["Black", "White"];

    /**
     * How many times to flash.
     */
    private readonly flashes: number = 6;

    /**
     * How many game ticks between each opacity change.
     */
    private readonly speed: number = 1;

    /**
     * How many flashes have been completed.
     */
    private completed: number = 0;

    /**
     * Plays the transition.
     */
    public play(): void {
        this.flash();
    }

    /**
     * Flashes to and from a color.
     */
    private flash(): void {
        if (this.completed >= this.flashes) {
            this.settings.onComplete();
            return;
        }

        const color: string = this.flashColors[this.completed % this.flashColors.length];
        this.completed += 1;

        this.gameStarter.actions.animateFadeToColor({
            color,
            change: this.change,
            speed: this.speed,
            callback: (): void => {
                this.gameStarter.actions.animateFadeFromColor({
                    color,
                    change: this.change,
                    speed: this.speed,
                    callback: (): void => this.play()
                });
            }
        });
    }
}
