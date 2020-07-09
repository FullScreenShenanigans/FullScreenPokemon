import { Physics as EightBittrPhysics } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Direction } from "./Constants";
import { ICharacter, IGrass, IThing } from "./Things";

/**
 * Physics functions to move Things around.
 */
export class Physics<TEightBittr extends FullScreenPokemon> extends EightBittrPhysics<TEightBittr> {
    /**
     * Determines the bordering direction from one Thing to another.
     *
     * @param thing   The source Thing.
     * @param other   The destination Thing.
     * @returns The direction from thing to other.
     */
    public getDirectionBordering(thing: IThing, other: IThing): Direction | undefined {
        if (Math.abs((thing.top) - (other.bottom - other.tolBottom)) < 4) {
            return Direction.Top;
        }

        if (Math.abs(thing.right - other.left) < 4) {
            return Direction.Right;
        }

        if (Math.abs(thing.bottom - other.top) < 4) {
            return Direction.Bottom;
        }

        if (Math.abs(thing.left - other.right) < 4) {
            return Direction.Left;
        }

        return undefined;
    }

    /**
     * Determines the direction from one Thing to another.
     *
     * @param thing   The source Thing.
     * @param other   The destination Thing.
     * @returns The direction from thing to other.
     * @remarks Like getDirectionBordering, but for cases where the two Things
     *          aren't necessarily touching.
     */
    public getDirectionBetween(thing: IThing, other: IThing): Direction {
        const dx: number = this.getMidX(other) - this.getMidX(thing);
        const dy: number = this.getMidY(other) - this.getMidY(thing);

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0
                ? Direction.Right
                : Direction.Left;
        }

        return dy > 0
            ? Direction.Bottom
            : Direction.Top;
    }

    /**
     * Checks whether one Thing is overlapping another.
     *
     * @param thing   An in-game Thing.
     * @param other   An in-game Thing.
     * @returns Whether thing and other are overlapping.
     */
    public isThingWithinOther(thing: IThing, other: IThing): boolean {
        return (
            thing.top >= other.top
            && thing.right <= other.right
            && thing.bottom <= other.bottom
            && thing.left >= other.left);
    }

    /**
     * Determines whether a Character is visually within grass.
     *
     * @param thing   An in-game Character.
     * @param other   Grass that thing might be in.
     * @returns Whether thing is visually within other.
     */
    public isThingWithinGrass(thing: ICharacter, other: IGrass): boolean {
        if (thing.right <= other.left) {
            return false;
        }

        if (thing.left >= other.right) {
            return false;
        }

        if (other.top > (thing.top + thing.height / 2)) {
            return false;
        }

        if (other.bottom < (thing.top + thing.height / 2)) {
            return false;
        }

        return true;
    }

    /**
     * Shifts a Character according to its xvel and yvel.
     *
     * @param thing   A Character to shift.
     */
    public shiftCharacter(thing: ICharacter): void {
        if (thing.bordering[Direction.Top] && thing.yvel < 0) {
            thing.yvel = 0;
        }

        if (thing.bordering[Direction.Right] && thing.xvel > 0) {
            thing.xvel = 0;
        }

        if (thing.bordering[Direction.Bottom] && thing.yvel > 0) {
            thing.yvel = 0;
        }

        if (thing.bordering[Direction.Left] && thing.xvel < 0) {
            thing.xvel = 0;
        }

        this.shiftBoth(thing, thing.xvel, thing.yvel);
    }

    /**
     * Snaps a moving Thing to a predictable grid position.
     *
     * @param thing   A Thing to snap the position of.
     */
    public snapToGrid(thing: IThing): void {
        const grid = 32;
        const x: number = (this.game.mapScreener.left + thing.left) / grid;
        const y: number = (this.game.mapScreener.top + thing.top) / grid;

        this.setLeft(thing, Math.round(x) * grid - this.game.mapScreener.left);
        this.setTop(thing, Math.round(y) * grid - this.game.mapScreener.top);
    }
}
