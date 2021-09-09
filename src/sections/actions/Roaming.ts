import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { RoamingCharacter } from "../Actors";

export const randomRoamingMaximumFrequency = 210;

export const randomRoamingMinimumTicks = 70;

/**
 * Idle characters turning and walking in random directions.
 */
export class Roaming extends Section<FullScreenPokemon> {
    /**
     * Starts a Character roaming in random directions.
     *
     * @param actor   A Character to start roaming.
     */
    public startRoaming(actor: RoamingCharacter): void {
        actor.roamingDistances = {
            horizontal: 0,
            vertical: 0,
        };

        this.continueRoaming(actor);
    }

    /**
     * Continues a step of a Character roaming in random directions.
     *
     * @param actor   A Character to start roaming.
     */
    private continueRoaming(actor: RoamingCharacter): void {
        if (actor.removed) {
            return;
        }

        this.game.timeHandler.addEvent(
            (): void => this.continueRoaming(actor),
            this.game.numberMaker.randomInt(randomRoamingMaximumFrequency) +
                randomRoamingMinimumTicks
        );

        if (!actor.walking && !actor.talking && !this.game.menuGrapher.getActiveMenu()) {
            this.takeRoamingStep(actor);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     *
     * @param actor   A roaming Character.
     */
    private takeRoamingStep(actor: RoamingCharacter): void {
        const direction: Direction | undefined = this.getNextRoamingDirection(actor);
        if (direction === undefined) {
            return;
        }

        if (actor.roamingDirections.indexOf(direction) === -1) {
            this.game.actions.animateCharacterSetDirection(actor, direction);
            return;
        }

        this.game.actions.walking.startWalking(actor, direction);

        switch (direction) {
            case Direction.Top:
                actor.roamingDistances.vertical -= 1;
                break;
            case Direction.Right:
                actor.roamingDistances.horizontal += 1;
                break;
            case Direction.Bottom:
                actor.roamingDistances.vertical += 1;
                break;
            case Direction.Left:
                actor.roamingDistances.horizontal -= 1;
                break;
        }
    }

    /**
     * Determines the next direction a Character should roam, if possible.
     *
     * @param actor   A roaming Character.
     * @returns The next direction it should roam, if any.
     */
    private getNextRoamingDirection(actor: RoamingCharacter): Direction | undefined {
        const allowed: Direction[] = [];

        if (
            actor.bordering[Direction.Top] === undefined &&
            actor.roamingDistances.vertical !== -3
        ) {
            allowed.push(Direction.Top);
        }

        if (
            actor.bordering[Direction.Right] === undefined &&
            actor.roamingDistances.horizontal !== 3
        ) {
            allowed.push(Direction.Right);
        }

        if (
            actor.bordering[Direction.Bottom] === undefined &&
            actor.roamingDistances.vertical !== 3
        ) {
            allowed.push(Direction.Bottom);
        }

        if (
            actor.bordering[Direction.Left] === undefined &&
            actor.roamingDistances.horizontal !== -3
        ) {
            allowed.push(Direction.Left);
        }

        if (allowed.length === 0) {
            return undefined;
        }

        return this.game.numberMaker.randomArrayMember(allowed);
    }
}
