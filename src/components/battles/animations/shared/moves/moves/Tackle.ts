import { Team } from "battlemovr/lib/Teams";

import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Move } from "../Move";

/**
 * Animates a Tackle battle move.
 */
export class Tackle<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt: number = 7;
        let xvel: number = 7 * this.direction;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                this.gameStarter.physics.shiftHoriz(this.attackerThing, xvel);
            },
            1,
            dt * 2 - 1);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        if (this.teamAndAction.source.team === Team.player) {
            this.gameStarter.timeHandler.addEvent(
                (): void => this.flickerDefender(callback),
                dt * 2);
        } else {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    this.gameStarter.battles.animations.things.shake({
                        callback: (): void => {
                            this.flickerDefender(callback);
                        }
                    });
                },
                dt * 2);
        }
    }

    /**
     * Flickers the defending Thing.
     * 
     * @param callback   Callback for when the animation is done.
     */
    private flickerDefender(callback: () => void): void {
        this.gameStarter.battles.animations.things.flicker({
            callback,
            clearTime: 14,
            interval: 5,
            thing: this.defenderThing
        });
    }
}
