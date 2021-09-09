import { Move } from "../Move";

/**
 * Animates a TailWhip battle move.
 */
export class TailWhip extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt = 11;
        const dx = 16;

        this.game.physics.shiftHoriz(this.attackerActor, dx * this.direction);

        this.game.timeHandler.addEvent(
            (): void => this.game.physics.shiftHoriz(this.attackerActor, -dx * this.direction),
            dt
        );
        this.game.timeHandler.addEvent(
            (): void => this.game.physics.shiftHoriz(this.attackerActor, dx * this.direction),
            dt * 2
        );
        this.game.timeHandler.addEvent(
            (): void => this.game.physics.shiftHoriz(this.attackerActor, -dx * this.direction),
            dt * 3
        );

        this.game.timeHandler.addEvent((): void => {
            this.game.battles.animations.actors.shake({ callback });
        }, (dt * 3.5) | 0);
    }
}
