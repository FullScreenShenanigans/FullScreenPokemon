import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IThing } from "../Things";

/**
 * Ledge functions used by FullScreenPokemon instances.
 */
export class Ledges<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Character hopping over a ledge.
     * 
     * @param thing   A Character hopping over a ledge.
     * @param other   The ledge the Character is hopping over.
     */
    public startLedgeHop(thing: ICharacter, other: IThing): void {
        const ticksPerBlock: number = this.gameStarter.equations.walkingTicksPerBlock(thing);

        thing.nocollide = true;
        thing.wantsToWalk = true;
        thing.ledge = other;

        this.addHopOffset(thing);
        this.addHopShadow(thing);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.endLedgeHop(thing),
            ticksPerBlock * 2);
    }

    /**
     * Finishes a Character hopping over a ledge.
     * 
     * @param thing   A Character done hopping over a ledge.
     * @param other   The ledge the Character is done hopping over.
     */
    public endLedgeHop(thing: ICharacter): void {
        this.gameStarter.physics.killNormal(thing.shadow!);
        thing.nocollide = false;
        thing.wantsToWalk = false;
        thing.ledge = undefined;
        thing.shadow = undefined;
    }

    /**
     * Adds a visual "hop" to a hopping Character.
     * 
     * @param thing   A Character hopping over a ledge.
     */
    protected addHopOffset(thing: ICharacter): void {
        const ticksPerBlock: number = this.gameStarter.equations.walkingTicksPerBlock(thing);
        let dy: number = -2;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                dy *= -1;
            },
            ticksPerBlock + 1);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                thing.offsetY += dy;
            },
            1,
            ticksPerBlock * 2);
    }

    /**
     * Adds a visual shadow to a hopping Character.
     * 
     * @param thing   A Character hopping over a ledge.
     */
    protected addHopShadow(thing: ICharacter): void {
        thing.shadow = this.gameStarter.things.add(this.gameStarter.things.names.shadow);

        this.gameStarter.timeHandler.addEventInterval(
            (): boolean => this.updateShadowPosition(thing),
            1,
            Infinity);
    }

    /**
     * Updates a hopping Character's shadow.
     * 
     * @param thing   A Character hopping over a ledge.
     * @param other   The ledge the Character is hopping over.
     */
    protected updateShadowPosition(thing: ICharacter): boolean {
        if (!thing.shadow) {
            return true;
        }

        this.gameStarter.physics.setMidXObj(thing.shadow, thing);
        this.gameStarter.physics.setBottom(thing.shadow, thing.bottom);
        return false;
    }
}
