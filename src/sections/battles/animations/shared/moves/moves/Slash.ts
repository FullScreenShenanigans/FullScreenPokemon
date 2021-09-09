import { Direction } from "../../../../../Constants";
import { Menu } from "../../../../../Menus";
import { Actor } from "../../../../../Actors";
import { Move } from "../Move";

/**
 * Animates a Slash battle move.
 */
export class Slash extends Move {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const differenceX: number = this.defenderActor.width / 2;
        const lineArray: Actor[] = [];
        const menu: Menu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as Menu;
        const slashes: Actor[] = [
            this.game.objectMaker.make<Actor>(this.game.actors.names.scratchLine),
            this.game.objectMaker.make<Actor>(this.game.actors.names.scratchLine),
            this.game.objectMaker.make<Actor>(this.game.actors.names.scratchLine),
        ];
        let startX: number;
        let startY: number;

        if (this.direction === Direction.Right) {
            startX = menu.right;
            startY = menu.top + this.defenderActor.height / 2;
        } else {
            startX = menu.left + this.defenderActor.width;
            startY = menu.bottom - (this.defenderActor.height + 8);
        }

        const offset: number = slashes[0].width / 2;
        this.game.actors.add(slashes[0], startX, startY);
        this.game.actors.add(slashes[1], startX + offset * this.direction * -5, startY);
        this.game.actors.add(slashes[2], startX + offset * this.direction * -10, startY);
        let time = 0;
        const explosionArray: Actor[] = [];
        this.game.timeHandler.addEventInterval(
            (): void => {
                for (const slash of slashes) {
                    const left: number =
                        this.direction === Direction.Right ? slash.left : slash.right - 3;
                    const top: number = slash.bottom - 3;

                    this.game.timeHandler.addEvent(
                        (): void =>
                            this.game.physics.shiftHoriz(
                                slash,
                                (differenceX * (this.direction * -1)) / 16
                            ),
                        1
                    );
                    this.game.timeHandler.addEvent(
                        (): void =>
                            this.game.physics.shiftVert(
                                slash,
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
                    if (time === 14) {
                        const explosion = this.game.actors.add(
                            this.game.actors.names.explosionSmall,
                            left - 18,
                            top
                        );
                        explosionArray.push(explosion);
                    }
                }
                time += 1;
            },
            1,
            16
        );
        this.game.timeHandler.addEvent((): void => {
            for (const slash of slashes) {
                this.game.death.kill(slash);
            }

            for (const line of lineArray) {
                this.game.battles.animations.actors.flicker({
                    clearTime: 10,
                    interval: 2,
                    actor: line,
                });
            }
            for (const explosion of explosionArray) {
                this.game.death.kill(explosion);
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
        }, 24);
    }
}
