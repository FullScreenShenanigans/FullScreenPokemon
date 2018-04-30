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

        if (this.direction === Direction.Right) {
            startX[0] = menu.right - this.defenderThing.width;
            startY[0] = menu.top;
            startX[1] = startX[0] + 50;
            startY[1] = startY[0] + 50;
        } else {
            startX[0] = menu.left + this.defenderThing.width;
            startY[0] = menu.bottom - (this.defenderThing.height + 8);
        }

        this.gameStarter.things.add(explosions[0], startX[0], startY[0]);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[0]);
                this.gameStarter.things.add(explosions[1], startX[1], startY[1]);
            },
            4);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.things.add(coin, startX[0], startY[1] + 30);
                this.gameStarter.physics.killNormal(explosions[1]);
            },
            8);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.physics.shiftHoriz(coin, -8);
                this.gameStarter.physics.shiftVert(coin, 12);
            },
        10);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.physics.shiftHoriz(coin, -8);
                this.gameStarter.physics.shiftVert(coin, -12);
            },
        14);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.physics.shiftHoriz(coin, -8);
                this.gameStarter.physics.shiftVert(coin, 12);
            },
        18);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.physics.shiftHoriz(coin, -8);
                this.gameStarter.physics.shiftVert(coin, -12);
            },
        22);
        this.gameStarter.timeHandler.addEvent(
            (): void => 
            {
                this.gameStarter.physics.killNormal(coin)
            },
            26);
        }
}
