import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Bubble battle move.
 */
export class Bubble<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const xPositions: number[] = [];
        const yPositions: number[] = [];

        if (this.direction === 1) {
            xPositions[0] = this.menu.left + (this.attackerThing.width + 6);
            xPositions[1] = xPositions[0] + 10;
            xPositions[2] = xPositions[1] + 10;
            xPositions[3] = xPositions[2] + 10;
            yPositions[0] = this.menu.bottom - (this.attackerThing.height * 2 - 4);
            yPositions[1] = yPositions[0];
            yPositions[2] = yPositions[1] - (this.menu.bottom - yPositions[1]) / 3;
            yPositions[3] = yPositions[2] - (this.menu.bottom - yPositions[1]) / 3;
        } else {
            // These positions are incorrect and need to be updated. See issue #343.
            xPositions[0] = this.menu.right - this.attackerThing.width / 2;
            yPositions[0] = this.menu.top + this.attackerThing.height;
        }

        this.animateGroupOne(xPositions[0], yPositions[0]);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.animateGroupTwo(xPositions[1], yPositions[1]),
            24);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.animateGroupThree(xPositions[2], yPositions[2]),
            48);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.animateGroupFour(xPositions[3], yPositions[3]),
            72);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.battles.animations.things.shake({ callback });
            },
            100);
    }

    /**
     * Animates the first cluster of bubbles.
     *
     * @param x   Horizontal position to animate on.
     * @param y   Vertical position to animate on.
     */
    private animateGroupOne(x: number, y: number): void {
        const bubbleLarge: IThing = this.eightBitter.things.add(this.eightBitter.things.names.bubbleLarge, x, y);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(bubbleLarge);
            },
            96);
    }

    /**
     * Animates the second cluster of bubbles.
     *
     * @param x   Horizontal position to animate on.
     * @param y   Vertical position to animate on.
     */
    private animateGroupTwo(x: number, y: number): void {
        const bubbleLarge: IThing = this.eightBitter.things.add(this.eightBitter.things.names.bubbleLarge, x, y);
        const bubblesSmall: IThing[] = [];

        for (let j = 0; j < 4; j += 1) {
            bubblesSmall[j] = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleSmall);
        }

        this.eightBitter.things.add(bubblesSmall[0], x, y - 4);
        this.eightBitter.things.add(bubblesSmall[1], x + 4, y - 3);
        this.eightBitter.things.add(bubblesSmall[2], x + 8, y + 4);
        this.eightBitter.things.add(bubblesSmall[3], x, y + 8);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(bubbleLarge);
                for (let j = 0; j < 4; j += 1) {
                    this.eightBitter.physics.killNormal(bubblesSmall[j]);
                }
            },
            72);
    }

    /**
     * Animates the third cluster of bubbles.
     *
     * @param x   Horizontal position to animate on.
     * @param y   Vertical position to animate on.
     */
    private animateGroupThree(x: number, y: number): void {
        const bubblesLarge: IThing[] = [];
        const bubblesSmall: IThing[] = [];

        for (let j = 0; j < 3; j += 1) {
            bubblesLarge[j] = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleLarge);
            bubblesSmall[j] = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleSmall);
        }

        this.eightBitter.things.add(bubblesLarge[0], x, y - 4);
        this.eightBitter.things.add(bubblesLarge[1], x, y);
        this.eightBitter.things.add(bubblesLarge[2], x + 4, y - 2);
        this.eightBitter.things.add(bubblesSmall[0], x, y - 4);
        this.eightBitter.things.add(bubblesSmall[1], x, y + 8);
        this.eightBitter.things.add(bubblesSmall[2], x + 8, y + 6);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                for (let j = 0; j < 4; j += 1) {
                    this.eightBitter.physics.killNormal(bubblesLarge[j]);
                    this.eightBitter.physics.killNormal(bubblesSmall[j]);
                }
            },
            42);
    }

    /**
     * Animates the fourth cluster of bubbles.
     *
     * @param x   Horizontal position to animate on.
     * @param y   Vertical position to animate on.
     */
    private animateGroupFour(x: number, y: number): void {
        const bubblesLarge: IThing[] = [];
        const bubblesSmall: IThing[] = [];

        for (let j = 0; j < 4; j += 1) {
            bubblesLarge[j] = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleLarge);
            bubblesSmall[j] = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleSmall);
        }

        this.eightBitter.things.add(bubblesLarge[0], x + 4, y + 12);
        this.eightBitter.things.add(bubblesLarge[1], x, y);
        this.eightBitter.things.add(bubblesLarge[2], x + 8, y + 4);
        this.eightBitter.things.add(bubblesSmall[0], x + 4, y - 4);
        this.eightBitter.things.add(bubblesSmall[1], x + 8, y);
        this.eightBitter.things.add(bubblesSmall[2], x, y + 12);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                for (let j = 0; j < 4; j += 1) {
                    this.eightBitter.physics.killNormal(bubblesLarge[j]);
                    this.eightBitter.physics.killNormal(bubblesSmall[j]);
                }
            },
            24);
    }
}
