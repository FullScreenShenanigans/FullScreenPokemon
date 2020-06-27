import { member } from "babyioc";
import { Collisions as EightBittrCollisions } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Detectors } from "./collisions/Detectors";
import { Obstacles } from "./collisions/Obstacles";
import { Direction } from "./Constants";
import { ICharacter, IThing } from "./Things";

/**
 * ThingHittr collision function generators.
 */
export class Collisions<TEightBittr extends FullScreenPokemon> extends EightBittrCollisions<TEightBittr> {
    /**
     * Function generator for the generic canThingCollide checker. This is used
     * repeatedly by ThingHittr to generate separately optimized Functions for
     * different Thing types.
     *
     * @returns A Function that generates a canThingCollide checker.
     */
    public generateCanThingCollide = () => {
        /**
         * Generic checker for canCollide. This just returns if the Thing is alive.
         *
         * @param thing
         * @returns Whether the thing can collide.
         */
        return (thing: IThing): boolean => thing.alive;
    }

    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     *
     * @returns A Function that generates isCharacterTouchingCharacter.
     */
    public generateIsCharacterTouchingCharacter = () => {
        /**
         * Generic checker for whether two characters are touching each other.
         * This checks to see if either has the nocollide flag, or if they're
         * overlapping, respecting tolerances.
         *
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: ICharacter): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.following !== other
            && other.following !== thing
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     *
     * @returns A Function that generates isCharacterTouchingSolid.
     */
    public generateIsCharacterTouchingSolid = () => {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         *
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: IThing): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic hitCharacterThing callback. This is
     * used repeatedly by ThingHittr to generate separately optimized Functions
     * for different Thing types.
     *
     * @returns A Function that generates hitCharacterThing.
     */
    public generateHitCharacterThing = () => {
        /**
         * Generic callback for when a Character touches a Thing. Other may have a
         * .collide to override with, but normally this just sets thing's position.
         *
         * @param thing
         * @param other
         * @returns Whether thing is hitting other.
         */
        return (thing: ICharacter, other: IThing): boolean => {
            // If either Thing is the player, it should be the first
            if ((other as ICharacter).player && !thing.player) {
                // tslint:disable-next-line:no-parameter-reassignment
                [thing, other] = [other as ICharacter, thing];
            }

            // The other's collide may return true to cancel overlapping checks
            if (other.collide && other.collide.call(this, thing, other)) {
                return false;
            }

            // Both the thing and other should know they're bordering each other
            // If other is a large solid, this will be irreleveant, so it's ok
            // that multiple borderings will be replaced by the most recent
            switch (this.eightBitter.physics.getDirectionBordering(thing, other)) {
                case Direction.Top:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Top);
                        this.setThingBordering(other, thing, Direction.Bottom);
                        this.eightBitter.physics.setTop(thing, other.bottom - other.tolBottom);
                    }
                    break;

                case Direction.Right:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Right);
                        this.setThingBordering(other, thing, Direction.Left);
                        this.eightBitter.physics.setRight(thing, other.left + other.tolLeft);
                    }
                    break;

                case Direction.Bottom:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Bottom);
                        this.setThingBordering(other, thing, Direction.Top);
                        this.eightBitter.physics.setBottom(thing, other.top + other.tolTop);
                    }
                    break;

                case Direction.Left:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Left);
                        this.setThingBordering(other, thing, Direction.Right);
                        this.eightBitter.physics.setLeft(thing, other.right - other.tolRight);
                    }
                    break;

                default:
                    break;
            }

            // Todo: investigate why this never returns true?
            return false;
        };
    }

    /**
     * Function generators for checking whether a Thing may collide.
     */
    public readonly globalCheckGenerators = {
        Character: this.generateCanThingCollide,
        Solid: this.generateCanThingCollide,
    };

    /**
     * Function generators for checking whether two Things are colliding.
     */
    public readonly hitCheckGenerators = {
        Character: {
            Character: this.generateIsCharacterTouchingCharacter,
            Solid: this.generateIsCharacterTouchingSolid,
        },
    };

    /**
     * Function generators for reacting to two Things colliding.
     */
    public readonly hitCallbackGenerators = {
        Character: {
            Solid: this.generateHitCharacterThing,
            Character: this.generateHitCharacterThing,
        },
    };

    /**
     * Marks other as being a border of thing in the given direction, respecting borderPrimary.
     *
     * @param thing   A Thing whose borders are being checked.
     * @param other   A new border for thing.
     * @param direction   The direction border being changed.
     */
    public setThingBordering(thing: IThing, other: IThing, direction: Direction): void {
        if (thing.bordering[direction] && thing.bordering[direction]!.borderPrimary && !other.borderPrimary) {
            return;
        }

        thing.bordering[direction] = other;
    }

    /**
     * Handlers for collisions with Detector Things.
     */
    @member(Detectors)
    public readonly detectors: Detectors;

    /**
     * Handlers for collisions with obstacle-like Things.
     */
    @member(Obstacles)
    public readonly obstacles: Obstacles;
}
