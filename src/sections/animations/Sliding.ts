import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Actor } from "../Actors";

/**
 * Slides Actors across the screen.
 */
export class Sliding extends Section<FullScreenPokemon> {
    /**
     * Slides An Actor across the screen horizontally over time.
     *
     * @param actor   An Actor to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midX location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onComplete   A callback for when the Actor reaches the goal.
     */
    public slideHorizontally(
        actor: Actor,
        change: number,
        goal: number,
        speed: number,
        onComplete?: () => void
    ): void {
        this.game.physics.shiftHoriz(actor, change);

        if (change > 0) {
            if (this.game.physics.getMidX(actor) >= goal) {
                this.game.physics.setMidX(actor, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        } else {
            if (this.game.physics.getMidX(actor) <= goal) {
                this.game.physics.setMidX(actor, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        }

        this.game.timeHandler.addEvent((): void => {
            this.slideHorizontally(actor, change, goal, speed, onComplete);
        }, speed);
    }

    /**
     * Slides An Actor across the screen vertically over time.
     *
     * @param actor   An Actor to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midY location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onComplete   A callback for when the Actor reaches the goal.
     */
    public slideVertically(
        actor: Actor,
        change: number,
        goal: number,
        speed: number,
        onComplete?: () => void
    ): void {
        this.game.physics.shiftVert(actor, change);

        if (change > 0) {
            if (this.game.physics.getMidY(actor) >= goal) {
                this.game.physics.setMidY(actor, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        } else {
            if (this.game.physics.getMidY(actor) <= goal) {
                this.game.physics.setMidY(actor, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        }

        this.game.timeHandler.addEvent((): void => {
            this.slideVertically(actor, change, goal, speed, onComplete);
        }, speed);
    }

    /**
     * Slides An Actor across the screen horizontally and fades it over time.
     *
     * @param actor   An Actor to slide across the screen.
     * @param goal   A midX location to stop sliding at.
     * @param timeout   How many ticks the animation should last.
     * @param onComplete   A callback for when the Actor reaches the goal.
     */
    public slideHorizontallyAndFadeOut(
        actor: Actor,
        goal: number,
        timeout: number,
        onComplete?: () => void
    ): void {
        this.slideHorizontally(
            actor,
            (goal - this.game.physics.getMidX(actor)) / timeout,
            goal,
            1,
            onComplete
        );

        this.game.timeHandler.addEvent((): void => {
            this.game.animations.fading.animateFadeAttribute(
                actor,
                "opacity",
                -2 / timeout,
                0,
                1
            );
        }, (timeout / 2) | 0);
    }
}
