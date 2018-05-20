import { Team } from "battlemovr";

import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Move } from "../Move";

/**
 * Animates a Tackle battle move.
 */
export class Tackle<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt = 7;
        let xvel: number = this.direction * 7;

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                this.eightBitter.physics.shiftHoriz(this.attackerThing, xvel);
            },
            1,
            dt * 2 - 1);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        if (this.teamAndAction.source.team === Team.player) {
            this.eightBitter.timeHandler.addEvent(
                (): void => this.flickerDefender(callback),
                dt * 2);
        } else {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    this.eightBitter.battles.animations.things.shake({
                        callback: (): void => {
                            this.flickerDefender(callback);
                        },
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
        this.eightBitter.battles.animations.things.flicker({
            callback,
            clearTime: 14,
            interval: 5,
            thing: this.defenderThing,
        });
    }
}
