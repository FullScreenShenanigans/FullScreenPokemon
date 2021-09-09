import { Direction } from "../../../../../Constants";
import { Menu } from "../../../../../Menus";
import { Actor } from "../../../../../Actors";
import { Move } from "../Move";

/**
 * Animates a PayDay battle move.
 */
export class PayDay extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const menu: Menu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as Menu;
        const explosions: Actor[] = [
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionSmall),
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionSmall),
        ];
        const coin = this.game.objectMaker.make<Actor>(this.game.actors.names.bubbleSmall);
        const startX: number[] = [];
        const startY: number[] = [];
        const coinXOffset = -8;
        const coinYOffset = 12;
        const shiftDown = (): void => {
            this.game.physics.shiftHoriz(coin, coinXOffset);
            this.game.physics.shiftVert(coin, coinYOffset);
        };
        const shiftUp = (): void => {
            this.game.physics.shiftHoriz(coin, coinXOffset);
            this.game.physics.shiftVert(coin, -coinYOffset);
        };
        if (this.direction === Direction.Right) {
            startX[0] = menu.right - this.defenderActor.width;
            startY[0] = menu.top;
            startX[1] = startX[0] + 50;
            startY[1] = startY[0] + 50;
        } else {
            startX[0] = menu.left + this.defenderActor.width;
            startY[0] = menu.bottom - (this.defenderActor.height + 8);
            startX[1] = startX[0] - 50;
            startY[1] = startY[0] - 50;
        }
        this.game.actors.add(explosions[0], startX[0], startY[0]);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosions[0]);
            this.game.actors.add(explosions[1], startX[1], startY[1]);
        }, 4);
        this.game.timeHandler.addEvent((): void => {
            this.game.actors.add(coin, startX[0], startY[1] + 30);
            this.game.death.kill(explosions[1]);
        }, 8);
        this.game.timeHandler.addEvent(shiftDown, 10);
        this.game.timeHandler.addEvent(shiftUp, 14);
        this.game.timeHandler.addEvent(shiftDown, 18);
        this.game.timeHandler.addEvent(shiftUp, 22);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(coin);
            this.game.battles.animations.actors.flicker({
                callback,
                clearTime: 12,
                interval: 6,
                actor: this.defenderActor,
            });
        }, 26);
    }
}
