import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IThing } from "../../Things";

/**
 * Settings for a flicker animation.
 */
export interface IFlickerSettings {
    /**
     * Handler for when this is done.
     */
    callback?(): void;

    /**
     * How long to wait to stop the effect.
     */
    clearTime?: number;

    /**
     * How many steps between hidden toggles.
     */
    interval?: number;

    /**
     * A Thing to flicker.
     */
    thing: IThing;
}

/**
 * Settings for a shake animation.
 */
export interface IShakeSettings {
    /**
     * Handler for when this is done.
     */
    callback?(): void;

    /**
     * How long until the screen is done shaking.
     */
    clearTime?: number;

    /**
     * How far to shift horizontally.
     */
    dx?: number;

    /**
     * How far to shift vertically.
     */
    dy?: number;

    /**
     * How long to wait between movements.
     */
    interval?: number;

}

/**
 * Thing animations for battles.
 */
export class Things extends Section<FullScreenPokemon> {
    /**
     * Animates a "flicker" effect on a Thing by repeatedly toggling its hidden
     * flag for a little while.
     *
     * @param settings   Settings for the flicker effect.
     */
    public flicker(settings: IFlickerSettings): void {
        const clearTime: number = settings.clearTime || 49;
        const interval: number = settings.interval || 2;

        settings.thing.flickering = true;

        this.game.timeHandler.addEventInterval(
            (): void => {
                settings.thing.hidden = !settings.thing.hidden;
            },
            interval,
            clearTime || 49);

        this.game.timeHandler.addEvent(
            (): void => {
                settings.thing.flickering = settings.thing.hidden = false;

                if (settings.callback) {
                    settings.callback();
                }
            },
            clearTime * interval + 1);
    }

    /**
     * Shakes all Things on the screen for a little bit.
     *
     * @param Settings for the shake animation.
     */
    public shake(settings: IShakeSettings): void {
        const clearTime: number = settings.clearTime || 8;
        const interval: number = settings.interval || 8;
        let dx = 0;
        let dy = 0;

        this.game.timeHandler.addEventInterval(
            (): void => {
                this.game.groupHolder.callOnAll((thing: IThing) => {
                    this.game.physics.shiftBoth(thing, dx, dy);
                });
            },
            1,
            clearTime * interval);

        this.game.timeHandler.addEvent(
            (): void => {
                dx *= -1;
                dy *= -1;

                this.game.timeHandler.addEventInterval(
                    (): void => {
                        dx *= -1;
                        dy *= -1;
                    },
                    interval,
                    clearTime);

                if (settings.callback) {
                    this.game.timeHandler.addEvent(settings.callback, interval * clearTime);
                }
            },
            (interval / 2) | 0);
    }
}
