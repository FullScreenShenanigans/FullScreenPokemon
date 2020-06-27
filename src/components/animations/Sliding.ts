import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";

/**
 * Slides Things across the screen.
 */
export class Sliding extends Section<FullScreenPokemon> {
    /**
     * Slides a Thing across the screen horizontally over time.
     *
     * @param thing   A Thing to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midX location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onComplete   A callback for when the Thing reaches the goal.
     */
    public slideHorizontally(thing: IThing, change: number, goal: number, speed: number, onComplete?: () => void): void {
        this.eightBitter.physics.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.eightBitter.physics.getMidX(thing) >= goal) {
                this.eightBitter.physics.setMidX(thing, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        } else {
            if (this.eightBitter.physics.getMidX(thing) <= goal) {
                this.eightBitter.physics.setMidX(thing, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.slideHorizontally(
                    thing,
                    change,
                    goal,
                    speed,
                    onComplete);
            },
            speed);
    }

    /**
     * Slides a Thing across the screen vertically over time.
     *
     * @param thing   A Thing to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midY location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onComplete   A callback for when the Thing reaches the goal.
     */
    public slideVertically(thing: IThing, change: number, goal: number, speed: number, onComplete?: () => void): void {
        this.eightBitter.physics.shiftVert(thing, change);

        if (change > 0) {
            if (this.eightBitter.physics.getMidY(thing) >= goal) {
                this.eightBitter.physics.setMidY(thing, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        } else {
            if (this.eightBitter.physics.getMidY(thing) <= goal) {
                this.eightBitter.physics.setMidY(thing, goal);
                if (onComplete) {
                    onComplete();
                }

                return;
            }
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.slideVertically(
                    thing,
                    change,
                    goal,
                    speed,
                    onComplete);
            },
            speed);
    }

    /**
     * Slides a Thing across the screen horizontally and fades it over time.
     *
     * @param thing   A Thing to slide across the screen.
     * @param goal   A midX location to stop sliding at.
     * @param timeout   How many ticks the animation should last.
     * @param onComplete   A callback for when the Thing reaches the goal.
     */
    public slideHorizontallyAndFadeOut(thing: IThing, goal: number, timeout: number, onComplete?: () => void): void {
        this.slideHorizontally(
            thing,
            (goal - this.eightBitter.physics.getMidX(thing)) / timeout,
            goal,
            1,
            onComplete);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    thing,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);
    }
}
