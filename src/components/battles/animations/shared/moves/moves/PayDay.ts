import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a PayDay battle move.
 */
export class PayDay<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const explosions: IThing[] = [
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall),
        ];
        const coin = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.bubbleSmall);
        const startX: number[] = [];
        const startY: number[] = [];
        const CoinXOffset = -8;
        const CoinYOffset = 12;
        const shiftDown = (): void => {
            this.gameStarter.physics.shiftHoriz(coin, CoinXOffset);
            this.gameStarter.physics.shiftVert(coin, CoinYOffset);
        };
        const shiftUp = (): void => {
            this.gameStarter.physics.shiftHoriz(coin, CoinXOffset);
            this.gameStarter.physics.shiftVert(coin, -CoinYOffset);
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
        this.gameStarter.things.add(explosions[0], startX[0], startY[0]);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[0]);
                this.gameStarter.things.add(explosions[1], startX[1], startY[1]);
            },
            4);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(coin, startX[0], startY[1] + 30);
                this.gameStarter.physics.killNormal(explosions[1]);
            },
            8);
        this.gameStarter.timeHandler.addEvent(
            shiftDown,
            10);
        this.gameStarter.timeHandler.addEvent(
            shiftUp,
            14);
        this.gameStarter.timeHandler.addEvent(
            shiftDown,
            18);
        this.gameStarter.timeHandler.addEvent(
            shiftUp,
            22);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(coin);
                this.gameStarter.battles.animations.things.flicker({
                    callback,
                    clearTime: 12,
                    interval: 6,
                    thing: this.defenderThing,
                });
            },
            26);
        }
}
