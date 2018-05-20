import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Move } from "../Move";

/**
 * Animates a TailWhip battle move.
 */
export class TailWhip<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt = 11;
        const dx = 16;

        this.eightBitter.physics.shiftHoriz(this.attackerThing, dx * this.direction);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(this.attackerThing, -dx * this.direction),
            dt);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(this.attackerThing, dx * this.direction),
            dt * 2);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(this.attackerThing, -dx * this.direction),
            dt * 3);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.battles.animations.things.shake({ callback });
            },
            (dt * 3.5) | 0);
    }
}
