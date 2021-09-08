import { Physics as EightBittrPhysics } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Direction } from "./Constants";
import { Character, Grass, Actor } from "./Actors";

/**
 * Physics functions to move Actors around.
 */
export class Physics<Game extends FullScreenPokemon> extends EightBittrPhysics<Game> {
    /**
     * Determines the bordering direction from one Actor to another.
     *
     * @param actor   The source Actor.
     * @param other   The destination Actor.
     * @returns The direction from actor to other.
     */
    public getDirectionBordering(actor: Actor, other: Actor): Direction | undefined {
        if (Math.abs(actor.top - (other.bottom - other.tolBottom)) < 4) {
            return Direction.Top;
        }

        if (Math.abs(actor.right - other.left) < 4) {
            return Direction.Right;
        }

        if (Math.abs(actor.bottom - other.top) < 4) {
            return Direction.Bottom;
        }

        if (Math.abs(actor.left - other.right) < 4) {
            return Direction.Left;
        }

        return undefined;
    }

    /**
     * Determines the direction from one Actor to another.
     *
     * @param actor   The source Actor.
     * @param other   The destination Actor.
     * @returns The direction from actor to other.
     * @remarks Like getDirectionBordering, but for cases where the two Actors
     *          aren't necessarily touching.
     */
    public getDirectionBetween(actor: Actor, other: Actor): Direction {
        const dx: number = this.getMidX(other) - this.getMidX(actor);
        const dy: number = this.getMidY(other) - this.getMidY(actor);

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? Direction.Right : Direction.Left;
        }

        return dy > 0 ? Direction.Bottom : Direction.Top;
    }

    /**
     * Checks whether one Actor is overlapping another.
     *
     * @param actor   An in-game Actor.
     * @param other   An in-game Actor.
     * @returns Whether actor and other are overlapping.
     */
    public isActorWithinOther(actor: Actor, other: Actor): boolean {
        return (
            actor.top >= other.top &&
            actor.right <= other.right &&
            actor.bottom <= other.bottom &&
            actor.left >= other.left
        );
    }

    /**
     * Determines whether a Character is visually within grass.
     *
     * @param actor   An in-game Character.
     * @param other   Grass that actor might be in.
     * @returns Whether actor is visually within other.
     */
    public isActorWActorrass(actor: Character, other: Grass): boolean {
        if (actor.right <= other.left) {
            return false;
        }

        if (actor.left >= other.right) {
            return false;
        }

        if (other.top > actor.top + actor.height / 2) {
            return false;
        }

        if (other.bottom < actor.top + actor.height / 2) {
            return false;
        }

        return true;
    }

    /**
     * Shifts a Character according to its xvel and yvel.
     *
     * @param actor   A Character to shift.
     */
    public shiftCharacter(actor: Character): void {
        if (actor.bordering[Direction.Top] && actor.yvel < 0) {
            actor.yvel = 0;
        }

        if (actor.bordering[Direction.Right] && actor.xvel > 0) {
            actor.xvel = 0;
        }

        if (actor.bordering[Direction.Bottom] && actor.yvel > 0) {
            actor.yvel = 0;
        }

        if (actor.bordering[Direction.Left] && actor.xvel < 0) {
            actor.xvel = 0;
        }

        this.shiftBoth(actor, actor.xvel, actor.yvel);
    }

    /**
     * Snaps a moving Actor to a predictable grid position.
     *
     * @param actor   An Actor to snap the position of.
     */
    public snapToGrid(actor: Actor): void {
        const grid = 32;
        const x: number = (this.game.mapScreener.left + actor.left) / grid;
        const y: number = (this.game.mapScreener.top + actor.top) / grid;

        this.setLeft(actor, Math.round(x) * grid - this.game.mapScreener.left);
        this.setTop(actor, Math.round(y) * grid - this.game.mapScreener.top);
    }
}
