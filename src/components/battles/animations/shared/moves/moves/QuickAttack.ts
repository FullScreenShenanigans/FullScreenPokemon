import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a QuickAttack battle move.
 */
export class QuickAttack<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        let xvel: number = -7 * this.direction;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => this.gameStarter.physics.shiftHoriz(this.attackerThing, xvel),
            1,
            38);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            20);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.attackerThing.hidden = !this.attackerThing.hidden;
            },
            15);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.attackerThing.hidden = !this.attackerThing.hidden;
                this.gameStarter.battles.animations.things.flicker({
                    callback,
                    clearTime: 12,
                    interval: 6,
                    thing: this.defenderThing
                });
            },
            40);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.animateExplosions(),
            20);
    }

    /**
     * Runs the move's explosion sprites.
     */
    private animateExplosions(): void {
        const explosions: IThing[] = [
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionLarge),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionLarge),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionLarge)
        ];

        const startX: number[] = [];
        const startY: number[] = [];
        if (this.direction === -1) {
            startX[0] = this.menu.right - this.defenderThing.width / 2;
            startY[0] = this.menu.top;
        } else {
            startX[0] = this.menu.left + (this.defenderThing.width + 32);
            startY[0] = this.menu.bottom - (this.defenderThing.height + 16);
            startX[1] = startX[0] + 6;
            startY[1] = startY[0] - 6;
            startX[2] = startX[1] + 6;
            startY[2] = startY[1] - 8;
        }

        this.gameStarter.things.add(explosions[0], startX[0], startY[0]);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[0]);
                this.gameStarter.things.add(explosions[1], startX[1], startY[1]);
            },
            4);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[1]);
                this.gameStarter.things.add(explosions[2], startX[2], startY[2]);
            },
            8);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(explosions[2]),
            12);
    }
}
