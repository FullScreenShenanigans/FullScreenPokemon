import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a PoisonSting battle move.
 */
export class PoisonSting extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const explosion = this.game.objectMaker.make<IThing>(
            this.game.things.names.explosionSmall
        );
        const menu: IMenu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let startX: number;
        let startY: number;
        if (this.direction === Direction.Right) {
            startX = menu.right - this.defenderThing.width / 2 - 8;
            startY = menu.top + 16;
        } else {
            startX = menu.left + this.defenderThing.width;
            startY = menu.bottom - (this.defenderThing.height + 8);
        }
        this.game.things.add(explosion, startX, startY);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosion);
            this.game.battles.animations.things.flicker({
                callback,
                clearTime: 14,
                interval: 5,
                thing: this.defenderThing,
            });
        }, 2);
    }
}
