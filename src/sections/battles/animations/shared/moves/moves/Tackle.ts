import { TeamId } from "battlemovr";

import { Move } from "../Move";

/**
 * Animates a Tackle battle move.
 */
export class Tackle extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt = 7;
        let xvel: number = this.direction * 7;

        this.game.timeHandler.addEventInterval(
            (): void => {
                this.game.physics.shiftHoriz(this.attackerActor, xvel);
            },
            1,
            dt * 2 - 1
        );

        this.game.timeHandler.addEvent((): void => {
            xvel *= -1;
        }, dt);

        if (this.teamAndAction.source.team === TeamId.player) {
            this.game.timeHandler.addEvent((): void => this.flickerDefender(callback), dt * 2);
        } else {
            this.game.timeHandler.addEvent((): void => {
                this.game.battles.animations.actors.shake({
                    callback: (): void => {
                        this.flickerDefender(callback);
                    },
                });
            }, dt * 2);
        }
    }

    /**
     * Flickers the defending Actor.
     *
     * @param callback   Callback for when the animation is done.
     */
    private flickerDefender(callback: () => void): void {
        this.game.battles.animations.actors.flicker({
            callback,
            clearTime: 14,
            interval: 5,
            actor: this.defenderActor,
        });
    }
}
