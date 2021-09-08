import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { Actor } from "../../Actors";

/**
 * Settings for a flicker animation.
 */
export interface FlickerSettings {
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
     * An Actor to flicker.
     */
    actor: Actor;
}

/**
 * Settings for a shake animation.
 */
export interface ShakeSettings {
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
 * Actor animations for battles.
 */
export class Actors extends Section<FullScreenPokemon> {
    /**
     * Animates a "flicker" effect on An Actor by repeatedly toggling its hidden
     * flag for a little while.
     *
     * @param settings   Settings for the flicker effect.
     */
    public flicker(settings: FlickerSettings): void {
        const clearTime: number = settings.clearTime || 49;
        const interval: number = settings.interval || 2;

        settings.actor.flickering = true;

        this.game.timeHandler.addEventInterval(
            (): void => {
                settings.actor.hidden = !settings.actor.hidden;
            },
            interval,
            clearTime || 49
        );

        this.game.timeHandler.addEvent((): void => {
            settings.actor.flickering = settings.actor.hidden = false;

            if (settings.callback) {
                settings.callback();
            }
        }, clearTime * interval + 1);
    }

    /**
     * Shakes all Actors on the screen for a little bit.
     *
     * @param Settings for the shake animation.
     */
    public shake(settings: ShakeSettings): void {
        const clearTime: number = settings.clearTime || 8;
        const interval: number = settings.interval || 8;
        let dx = 0;
        let dy = 0;

        this.game.timeHandler.addEventInterval(
            (): void => {
                this.game.groupHolder.callOnAll((actor: Actor) => {
                    this.game.physics.shiftBoth(actor, dx, dy);
                });
            },
            1,
            clearTime * interval
        );

        this.game.timeHandler.addEvent((): void => {
            dx *= -1;
            dy *= -1;

            this.game.timeHandler.addEventInterval(
                (): void => {
                    dx *= -1;
                    dy *= -1;
                },
                interval,
                clearTime
            );

            if (settings.callback) {
                this.game.timeHandler.addEvent(settings.callback, interval * clearTime);
            }
        }, (interval / 2) | 0);
    }
}
