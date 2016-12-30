import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * Roaming functions used by FullScreenPokemon instances.
 */
export class Roaming<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Character roaming in random directions.
     * 
     * @param thing   A Character to start roaming.
     */
    public startRoaming(thing: ICharacter): void {
        if (!thing.alive) {
            return;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.startRoaming(thing),
            70 + this.gameStarter.numberMaker.randomInt(210));

        if (!thing.talking && !this.gameStarter.menuGrapher.getActiveMenu()) {
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
        if (!direction) {
            return;
        }

        if (thing.roamingDirections.indexOf(direction) === -1) {
            this.gameStarter.actions.animateCharacterSetDirection(thing, direction);
        } else {
            this.gameStarter.actions.walking.startWalking(thing, direction);
        }
    }

    /**
     * Determines the next direction a Character should roam, if possible.
     * 
     * @param thing   A roaming Character.
     * @returns The next direction it should roam, if any.
     */
    protected getNextRoamingDirection(thing: ICharacter): Direction | undefined {
        let totalAllowed: number = 0;
        let direction: Direction;

        for (const border of thing.bordering) {
            if (!border) {
                totalAllowed += 1;
            }
        }

        if (totalAllowed === 0) {
            return undefined;
        }

        direction = this.gameStarter.numberMaker.randomInt(totalAllowed);

        for (let i: number = 0; i <= direction; i += 1) {
            if (thing.bordering[i]) {
                direction += 1;
            }
        }

        return direction;
    }
}
