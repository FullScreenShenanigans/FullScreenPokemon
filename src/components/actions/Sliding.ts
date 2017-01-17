import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";

/**
 * Sliding functions used by FullScreenPokemon instances.
 */
export class Sliding<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
        this.gameStarter.physics.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.gameStarter.physics.getMidX(thing) >= goal) {
                this.gameStarter.physics.setMidX(thing, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        } else {
            if (this.gameStarter.physics.getMidX(thing) <= goal) {
                this.gameStarter.physics.setMidX(thing, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        }

        this.gameStarter.timeHandler.addEvent(
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
        this.gameStarter.physics.shiftVert(thing, change);

        if (change > 0) {
            if (this.gameStarter.physics.getMidY(thing) >= goal) {
                this.gameStarter.physics.setMidY(thing, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        } else {
            if (this.gameStarter.physics.getMidY(thing) <= goal) {
                this.gameStarter.physics.setMidY(thing, goal);
                if (onComplete) {
                    onComplete();
                }
                return;
            }
        }

        this.gameStarter.timeHandler.addEvent(
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
            (goal - this.gameStarter.physics.getMidX(thing)) / timeout,
            goal,
            1,
            onComplete);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    thing,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);
    }
}
