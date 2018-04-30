import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IThing } from "../../../../../Things";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { Move } from "../Move";

/**
 * Animates a PoisonSting battle move.
 */
export class PoisonSting<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const explosion = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall);
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let startX: number;
        let startY: number;
        if (this.direction === Direction.Right) {
            startX = menu.right - this.defenderThing.width / 2 - 8;
            startY = menu.top + 16;
        } else {
            startX = menu.left + this.defenderThing.width;
            startY = menu.bottom - (this.defenderThing.height + 8);
        }
        this.gameStarter.things.add(explosion, startX, startY);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosion);
                this.gameStarter.battles.animations.things.flicker({
                    callback,
                    clearTime: 14,
                    interval: 5,
                    thing: this.defenderThing,
                });
            },
            2);
        }
}
