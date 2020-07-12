import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
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
        const menu: IMenu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const explosions: IThing[] = [
            this.game.objectMaker.make<IThing>(this.game.things.names.explosionSmall),
            this.game.objectMaker.make<IThing>(this.game.things.names.explosionSmall),
        ];
        const coin = this.game.objectMaker.make<IThing>(this.game.things.names.bubbleSmall);
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
            startX[0] = menu.right - this.defenderThing.width;
            startY[0] = menu.top;
            startX[1] = startX[0] + 50;
            startY[1] = startY[0] + 50;
        } else {
            startX[0] = menu.left + this.defenderThing.width;
            startY[0] = menu.bottom - (this.defenderThing.height + 8);
            startX[1] = startX[0] - 50;
            startY[1] = startY[0] - 50;
        }
        this.game.things.add(explosions[0], startX[0], startY[0]);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosions[0]);
            this.game.things.add(explosions[1], startX[1], startY[1]);
        }, 4);
        this.game.timeHandler.addEvent((): void => {
            this.game.things.add(coin, startX[0], startY[1] + 30);
            this.game.death.kill(explosions[1]);
        }, 8);
        this.game.timeHandler.addEvent(shiftDown, 10);
        this.game.timeHandler.addEvent(shiftUp, 14);
        this.game.timeHandler.addEvent(shiftDown, 18);
        this.game.timeHandler.addEvent(shiftUp, 22);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(coin);
            this.game.battles.animations.things.flicker({
                callback,
                clearTime: 12,
                interval: 6,
                thing: this.defenderThing,
            });
        }, 26);
    }
}
