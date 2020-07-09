import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { IRoamingCharacter } from "../Things";

export const randomRoamingMaximumFrequency = 210;

export const randomRoamingMinimumTicks = 70;

/**
 * Idle characters turning and walking in random directions.
 */
export class Roaming extends Section<FullScreenPokemon> {
    /**
     * Starts a Character roaming in random directions.
     *
     * @param thing   A Character to start roaming.
     */
    public startRoaming(thing: IRoamingCharacter): void {
        thing.roamingDistances = {
            horizontal: 0,
            vertical: 0,
        };

        this.continueRoaming(thing);
    }

    /**
     * Continues a step of a Character roaming in random directions.
     *
     * @param thing   A Character to start roaming.
     */
    private continueRoaming(thing: IRoamingCharacter): void {
        if (thing.removed) {
            return;
        }

        this.game.timeHandler.addEvent(
            (): void => this.continueRoaming(thing),
            this.game.numberMaker.randomInt(randomRoamingMaximumFrequency) + randomRoamingMinimumTicks);

        if (!thing.walking && !thing.talking && !this.game.menuGrapher.getActiveMenu()) {
            this.takeRoamingStep(thing);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     *
     * @param thing   A roaming Character.
     */
    private takeRoamingStep(thing: IRoamingCharacter): void {
        const direction: Direction | undefined = this.getNextRoamingDirection(thing);
        if (direction === undefined) {
            return;
        }

        if (thing.roamingDirections.indexOf(direction) === -1) {
            this.game.actions.animateCharacterSetDirection(thing, direction);
            return;
        }

        this.game.actions.walking.startWalking(thing, direction);

        switch (direction) {
            case Direction.Top:
                thing.roamingDistances.vertical -= 1;
                break;
            case Direction.Right:
                thing.roamingDistances.horizontal += 1;
                break;
            case Direction.Bottom:
                thing.roamingDistances.vertical += 1;
                break;
            case Direction.Left:
                thing.roamingDistances.horizontal -= 1;
                break;
        }
    }

    /**
     * Determines the next direction a Character should roam, if possible.
     *
     * @param thing   A roaming Character.
     * @returns The next direction it should roam, if any.
     */
    private getNextRoamingDirection(thing: IRoamingCharacter): Direction | undefined {
        const allowed: Direction[] = [];

        if (thing.bordering[Direction.Top] === undefined && thing.roamingDistances.vertical !== -3) {
            allowed.push(Direction.Top);
        }

        if (thing.bordering[Direction.Right] === undefined && thing.roamingDistances.horizontal !== 3) {
            allowed.push(Direction.Right);
        }

        if (thing.bordering[Direction.Bottom] === undefined && thing.roamingDistances.vertical !== 3) {
            allowed.push(Direction.Bottom);
        }

        if (thing.bordering[Direction.Left] === undefined && thing.roamingDistances.horizontal !== -3) {
            allowed.push(Direction.Left);
        }

        if (allowed.length === 0) {
            return undefined;
        }

        return this.game.numberMaker.randomArrayMember(allowed);
    }
}
