import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a PayDay battle move.
 */
export class PayDay<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const menu: IMenu = this.eightBitter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const explosions: IThing[] = [
            this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.explosionSmall),
            this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.explosionSmall),
        ];
        const coin = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.bubbleSmall);
        const startX: number[] = [];
        const startY: number[] = [];
        const coinXOffset = -8;
        const coinYOffset = 12;
        const shiftDown = (): void => {
            this.eightBitter.physics.shiftHoriz(coin, coinXOffset);
            this.eightBitter.physics.shiftVert(coin, coinYOffset);
        };
        const shiftUp = (): void => {
            this.eightBitter.physics.shiftHoriz(coin, coinXOffset);
            this.eightBitter.physics.shiftVert(coin, -coinYOffset);
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
        this.eightBitter.things.add(explosions[0], startX[0], startY[0]);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(explosions[0]);
                this.eightBitter.things.add(explosions[1], startX[1], startY[1]);
            },
            4);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(coin, startX[0], startY[1] + 30);
                this.eightBitter.physics.killNormal(explosions[1]);
            },
            8);
        this.eightBitter.timeHandler.addEvent(
            shiftDown,
            10);
        this.eightBitter.timeHandler.addEvent(
            shiftUp,
            14);
        this.eightBitter.timeHandler.addEvent(
            shiftDown,
            18);
        this.eightBitter.timeHandler.addEvent(
            shiftUp,
            22);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(coin);
                this.eightBitter.battles.animations.things.flicker({
                    callback,
                    clearTime: 12,
                    interval: 6,
                    thing: this.defenderThing,
                });
            },
            26);
        }
}
