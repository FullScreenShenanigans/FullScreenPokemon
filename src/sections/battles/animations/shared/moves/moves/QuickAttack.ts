import { Actor } from "../../../../../Actors";
import { Move } from "../Move";

/**
 * Animates a QuickAttack battle move.
 */
export class QuickAttack extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        let xvel: number = this.direction * -7;

        this.game.timeHandler.addEventInterval(
            (): void => this.game.physics.shiftHoriz(this.attackerActor, xvel),
            1,
            38
        );

        this.game.timeHandler.addEvent((): void => {
            xvel *= -1;
        }, 20);

        this.game.timeHandler.addEvent((): void => {
            this.attackerActor.hidden = !this.attackerActor.hidden;
        }, 15);

        this.game.timeHandler.addEvent((): void => {
            this.attackerActor.hidden = !this.attackerActor.hidden;
            this.game.battles.animations.actors.flicker({
                callback,
                clearTime: 12,
                interval: 6,
                actor: this.defenderActor,
            });
        }, 40);

        this.game.timeHandler.addEvent((): void => this.animateExplosions(), 20);
    }

    /**
     * Runs the move's explosion sprites.
     */
    private animateExplosions(): void {
        const explosions: Actor[] = [
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionLarge),
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionLarge),
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionLarge),
        ];

        const startX: number[] = [];
        const startY: number[] = [];
        if (this.direction === -1) {
            startX[0] = this.menu.right - this.defenderActor.width / 2;
            startY[0] = this.menu.top;
        } else {
            startX[0] = this.menu.left + (this.defenderActor.width + 32);
            startY[0] = this.menu.bottom - (this.defenderActor.height + 16);
            startX[1] = startX[0] + 6;
            startY[1] = startY[0] - 6;
            startX[2] = startX[1] + 6;
            startY[2] = startY[1] - 8;
        }

        this.game.actors.add(explosions[0], startX[0], startY[0]);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosions[0]);
            this.game.actors.add(explosions[1], startX[1], startY[1]);
        }, 4);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosions[1]);
            this.game.actors.add(explosions[2], startX[2], startY[2]);
        }, 8);
        this.game.timeHandler.addEvent((): void => this.game.death.kill(explosions[2]), 12);
    }
}
