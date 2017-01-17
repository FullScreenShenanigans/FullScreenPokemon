import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Move } from "../Move";

/**
 * Animates a TailWhip battle move.
 */
export class TailWhip<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const dt: number = 11;
        const dx: number = 16;

        this.gameStarter.physics.shiftHoriz(this.attackerThing, dx * this.direction);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(this.attackerThing, -dx * this.direction),
            dt);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(this.attackerThing, dx * this.direction),
            dt * 2);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(this.attackerThing, -dx * this.direction),
            dt * 3);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.battles.animations.things.shake({ callback });
            },
            (dt * 3.5) | 0);
    }
}
