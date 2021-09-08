import { member } from "babyioc";
import { Collisions as EightBittrCollisions } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Detectors } from "./collisions/Detectors";
import { Obstacles } from "./collisions/Obstacles";
import { Direction } from "./Constants";
import { Character, Actor } from "./Actors";

/**
 * ActorHittr collision function generators.
 */
export class Collisions<Game extends FullScreenPokemon> extends EightBittrCollisions<Game> {
    /**
     * Names of groups that should be checked for collisions.
     */
    public readonly collidingGroupNames: string[] = ["Character"];

    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ActorHittr to generate separately optimized
     * Functions for different Actor types.
     *
     * @returns A Function that generates isCharacterTouchingCharacter.
     */
    public generateIsCharacterTouchingCharacter = () => {
        /**
         * Generic checker for whether two characters are touching each other.
         * This checks to see if either has the nocollide flag, or if they're
         * overlapping, respecting tolerances.
         *
         * @param actor
         * @param other
         * @returns Whether actor is touching other.
         */
        return (actor: Character, other: Character): boolean =>
            !actor.nocollide &&
            !other.nocollide &&
            actor.following !== other &&
            other.following !== actor &&
            actor.right >= other.left + other.tolLeft &&
            actor.left <= other.right - other.tolRight &&
            actor.bottom >= other.top + other.tolTop &&
            actor.top <= other.bottom - other.tolBottom;
    };

    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ActorHittr to generate separately optimized
     * Functions for different Actor types.
     *
     * @returns A Function that generates isCharacterTouchingSolid.
     */
    public generateIsCharacterTouchingSolid = () => {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         *
         * @param actor
         * @param other
         * @returns Whether actor is touching other.
         */
        return (actor: Character, other: Actor): boolean =>
            !actor.nocollide &&
            !other.nocollide &&
            actor.right >= other.left + other.tolLeft &&
            actor.left <= other.right - other.tolRight &&
            actor.bottom >= other.top + other.tolTop &&
            actor.top <= other.bottom - other.tolBottom;
    };

    /**
     * Function generator for the generic hitCharacterActor callback. This is
     * used repeatedly by ActorHittr to generate separately optimized Functions
     * for different Actor types.
     *
     * @returns A Function that generates hitCharacterActor.
     */
    public generateHitCharacterActor = () => {
        /**
         * Generic callback for when a Character touches An Actor. Other may have a
         * .collide to override with, but normally this just sets actor's position.
         *
         * @param actor
         * @param other
         * @returns Whether actor is hitting other.
         */
        return (actor: Character, other: Actor): boolean => {
            // If either Actor is the player, it should be the first
            if ((other as Character).player && !actor.player) {
                [actor, other] = [other as Character, actor];
            }

            // The other's collide may return true to cancel overlapping checks
            if (other.collide && other.collide.call(this, actor, other)) {
                return false;
            }

            // Both the actor and other should know they're bordering each other
            // If other is a large solid, this will be irreleveant, so it's ok
            // that multiple borderings will be replaced by the most recent
            switch (this.game.physics.getDirectionBordering(actor, other)) {
                case Direction.Top:
                    if (
                        actor.left !== other.right - other.tolRight &&
                        actor.right !== other.left + other.tolLeft
                    ) {
                        this.setActorBordering(actor, other, Direction.Top);
                        this.setActorBordering(other, actor, Direction.Bottom);
                        this.game.physics.setTop(actor, other.bottom - other.tolBottom);
                    }
                    break;

                case Direction.Right:
                    if (
                        actor.top !== other.bottom - other.tolBottom &&
                        actor.bottom !== other.top + other.tolTop
                    ) {
                        this.setActorBordering(actor, other, Direction.Right);
                        this.setActorBordering(other, actor, Direction.Left);
                        this.game.physics.setRight(actor, other.left + other.tolLeft);
                    }
                    break;

                case Direction.Bottom:
                    if (
                        actor.left !== other.right - other.tolRight &&
                        actor.right !== other.left + other.tolLeft
                    ) {
                        this.setActorBordering(actor, other, Direction.Bottom);
                        this.setActorBordering(other, actor, Direction.Top);
                        this.game.physics.setBottom(actor, other.top + other.tolTop);
                    }
                    break;

                case Direction.Left:
                    if (
                        actor.top !== other.bottom - other.tolBottom &&
                        actor.bottom !== other.top + other.tolTop
                    ) {
                        this.setActorBordering(actor, other, Direction.Left);
                        this.setActorBordering(other, actor, Direction.Right);
                        this.game.physics.setLeft(actor, other.right - other.tolRight);
                    }
                    break;

                default:
                    break;
            }

            // Todo: nvestigate why this never returns true?
            return false;
        };
    };

    /**
     * Function generators for checking whether An Actor may collide.
     */
    public readonly globalCheckGenerators = {
        Character: this.generateCanActorCollide,
        Solid: this.generateCanActorCollide,
    };

    /**
     * Function generators for checking whether two Actors are colliding.
     */
    public readonly hitCheckGenerators = {
        Character: {
            Character: this.generateIsCharacterTouchingCharacter,
            Solid: this.generateIsCharacterTouchingSolid,
        },
    };

    /**
     * Function generators for reacting to two Actors colliding.
     */
    public readonly hitCallbackGenerators = {
        Character: {
            Solid: this.generateHitCharacterActor,
            Character: this.generateHitCharacterActor,
        },
    };

    /**
     * Marks other as being a border of actor in the given direction, respecting borderPrimary.
     *
     * @param actor   An Actor whose borders are being checked.
     * @param other   A new border for actor.
     * @param direction   The direction border being changed.
     */
    public setActorBordering(actor: Actor, other: Actor, direction: Direction): void {
        if (
            actor.bordering[direction] &&
            actor.bordering[direction]!.borderPrimary &&
            !other.borderPrimary
        ) {
            return;
        }

        actor.bordering[direction] = other;
    }

    /**
     * Handlers for collisions with Detector Actors.
     */
    @member(Detectors)
    public readonly detectors: Detectors;

    /**
     * Handlers for collisions with obstacle-like Actors.
     */
    @member(Obstacles)
    public readonly obstacles: Obstacles;
}
