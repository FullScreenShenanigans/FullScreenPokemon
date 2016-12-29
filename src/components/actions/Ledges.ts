import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IThing } from "../Things";

/**
 * Ledge functions used by FullScreenPokemon instances.
 */
export class Ledges<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * 
     */
    public startLedgeHop(thing: ICharacter, other: IThing): void {
        const ticksPerBlock: number = 32 / thing.speed;

        thing.nocollide = true;
        thing.ledge = other;

        this.addHopOffset(thing);
        this.addHopShadow(thing);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.endLedgeHop(thing),
            ticksPerBlock * 2);
    }

    /**
     * 
     */
    public endLedgeHop(thing: ICharacter): void {
        this.gameStarter.physics.killNormal(thing.shadow!);
        thing.nocollide = false;
        thing.ledge = undefined;
        thing.shadow = undefined;
    }

    /**
     * 
     */
    protected addHopOffset(thing: ICharacter): void {
        const ticksPerBlock: number = 32 / thing.speed;
        let dy: number = -1;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                thing.offsetY += dy;
            },
            1,
            ticksPerBlock * 2);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                dy *= -1;
            },
            ticksPerBlock);
    }

    /**
     * 
     */
    protected addHopShadow(thing: ICharacter): void {
        thing.shadow = this.gameStarter.things.add("Shadow");

        this.gameStarter.timeHandler.addEventInterval(
            (): boolean => this.updateShadowPosition(thing),
            1,
            Infinity);
    }

    /**
     * 
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
