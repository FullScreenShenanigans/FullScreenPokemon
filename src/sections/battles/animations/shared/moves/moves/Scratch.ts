import { Direction } from "../../../../../Constants";
import { Menu } from "../../../../../Menus";
import { Actor } from "../../../../../Actors";
import { Move } from "../Move";

/**
 * Animates a Scratch battle move.
 */
export class Scratch extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const differenceX: number = this.defenderActor.width / 2;
        const lineArray: Actor[] = [];
        const menu: Menu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as Menu;
        const scratches: Actor[] = [
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionSmall),
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionSmall),
            this.game.objectMaker.make<Actor>(this.game.actors.names.explosionSmall),
        ];
        let startX: number;
        let startY: number;

        if (this.direction === Direction.Right) {
            startX = menu.right - this.defenderActor.width / 2;
            startY = menu.top;
        } else {
            startX = menu.left + this.defenderActor.width;
            startY = menu.bottom - (this.defenderActor.height + 8);
        }

        const offset: number = scratches[0].width / 2;
        this.game.actors.add(scratches[0], startX, startY);
        this.game.actors.add(
            scratches[1],
            startX + offset * this.direction * -1,
            startY + offset
        );
        this.game.actors.add(
            scratches[2],
            startX + offset * this.direction * -2,
            startY + offset * 2
        );

        this.game.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = this.direction === -1 ? scratch.left : scratch.right - 3;
                    const top: number = scratch.bottom - 3;

                    this.game.timeHandler.addEvent(
                        (): void =>
                            this.game.physics.shiftHoriz(
                                scratch,
                                (differenceX * this.direction) / 16
                            ),
                        1
                    );
                    this.game.timeHandler.addEvent(
                        (): void =>
                            this.game.physics.shiftVert(
                                scratch,
                                (differenceX * this.direction) / 16
                            ),
                        1
                    );

                    const line: Actor = this.game.actors.add(
                        this.game.actors.names.scratchLine,
                        left,
                        top
                    );
                    if (this.direction === 1) {
                        this.game.graphics.flipping.flipHoriz(line);
                    }

                    lineArray.push(line);
                }
            },
            1,
            16
        );

        this.game.timeHandler.addEvent((): void => {
            for (const scratch of scratches) {
                this.game.death.kill(scratch);
            }

            for (const line of lineArray) {
                this.game.death.kill(line);
            }

            this.game.battles.animations.actors.flicker({
                callback,
                clearTime: 14,
                interval: 5,
                actor: this.defenderActor,
            });
        }, 17);
    }
}
