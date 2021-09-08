import { Direction } from "../../../../../Constants";
import { Menu } from "../../../../../Menus";
import { Actor } from "../../../../../Actors";
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
        const explosion = this.game.objectMaker.make<Actor>(
            this.game.actors.names.explosionSmall
        );
        const menu: Menu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as Menu;
        let startX: number;
        let startY: number;
        if (this.direction === Direction.Right) {
            startX = menu.right - this.defenderActor.width / 2 - 8;
            startY = menu.top + 16;
        } else {
            startX = menu.left + this.defenderActor.width;
            startY = menu.bottom - (this.defenderActor.height + 8);
        }
        this.game.actors.add(explosion, startX, startY);
        this.game.timeHandler.addEvent((): void => {
            this.game.death.kill(explosion);
            this.game.battles.animations.actors.flicker({
                callback,
                clearTime: 14,
                interval: 5,
                actor: this.defenderActor,
            });
        }, 2);
    }
}
