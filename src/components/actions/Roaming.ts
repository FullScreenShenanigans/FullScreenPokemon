import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * Idle characters turning and walking in random directions.
 */
export class Roaming<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Starts a Character roaming in random directions.
     *
     * @param thing   A Character to start roaming.
     */
    public startRoaming(thing: ICharacter): void {
        if (!thing.alive) {
            return;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => this.startRoaming(thing),
            this.eightBitter.numberMaker.randomInt(210) + 70);

        if (!thing.talking && !this.eightBitter.menuGrapher.getActiveMenu()) {
            this.takeRoamingStep(thing);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     *
     * @param thing   A roaming Character.
     */
    protected takeRoamingStep(thing: ICharacter): void {
        if (!thing.roamingDirections) {
            throw new Error("Roaming Thing should define a .roamingDirections.");
        }

        const direction: Direction | undefined = this.getNextRoamingDirection(thing);
        if (direction === undefined) {
            return;
        }

        if (thing.roamingDirections.indexOf(direction) === -1) {
            this.eightBitter.actions.animateCharacterSetDirection(thing, direction);
        } else {
            this.eightBitter.actions.walking.startWalking(thing, direction);
        }
    }

    /**
     * Determines the next direction a Character should roam, if possible.
     *
     * @param thing   A roaming Character.
     * @returns The next direction it should roam, if any.
     */
    private getNextRoamingDirection(thing: ICharacter): Direction | undefined {
        let totalAllowed = 0;
        let direction: Direction;

        for (const border of thing.bordering) {
            if (!border) {
                totalAllowed += 1;
            }
        }

        if (totalAllowed === 0) {
            return undefined;
        }

        direction = this.eightBitter.numberMaker.randomInt(totalAllowed);

        for (let i = 0; i <= direction; i += 1) {
            if (thing.bordering[i]) {
                direction += 1;
            }
        }

        return direction;
    }
}
