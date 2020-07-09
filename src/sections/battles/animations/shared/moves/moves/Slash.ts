import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
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
        const differenceX: number = this.defenderThing.width / 2;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const slashes: IThing[] = [
            this.game.objectMaker.make<IThing>(this.game.things.names.scratchLine),
            this.game.objectMaker.make<IThing>(this.game.things.names.scratchLine),
            this.game.objectMaker.make<IThing>(this.game.things.names.scratchLine),
        ];
        let startX: number;
        let startY: number;

        if (this.direction === Direction.Right) {
            startX = menu.right;
            startY = menu.top + this.defenderThing.height / 2;
        } else {
            startX = menu.left + this.defenderThing.width;
            startY = menu.bottom - (this.defenderThing.height + 8);
        }

        const offset: number = slashes[0].width / 2;
        this.game.things.add(slashes[0], startX, startY);
        this.game.things.add(slashes[1], startX + offset * this.direction * -5, startY);
        this.game.things.add(slashes[2], startX + offset * this.direction * -10, startY);
        let time = 0;
        const explosionArray: IThing[] = [];
        this.game.timeHandler.addEventInterval(
            (): void => {
                for (const slash of slashes) {
                    const left: number = this.direction === Direction.Right ? slash.left : slash.right - 3;
                    const top: number = slash.bottom - 3;

                    this.game.timeHandler.addEvent(
                        (): void => this.game.physics.shiftHoriz(slash, differenceX * (this.direction * -1) / 16),
                        1);
                    this.game.timeHandler.addEvent(
                        (): void => this.game.physics.shiftVert(slash, differenceX * (this.direction) / 16),
                        1);

                    const line: IThing = this.game.things.add(this.game.things.names.scratchLine, left, top);
                    if (this.direction === 1) {
                        this.game.graphics.flipping.flipHoriz(line);
                    }
                    lineArray.push(line);
                    if (time === 14) {
                        const explosion = this.game.things.add
                            (this.game.things.names.explosionSmall,
                                left - 18, top);
                        explosionArray.push(explosion);
                    }
                }
                time += 1;
            },
            1,
            16);
        this.game.timeHandler.addEvent(
            (): void => {
                for (const slash of slashes) {
                    this.game.death.kill(slash);
                }

                for (const line of lineArray) {
                    this.game.battles.animations.things.flicker({
                        clearTime: 10,
                        interval: 2,
                        thing: line,
                    });
                }
                for (const explosion of explosionArray) {
                    this.game.death.kill(explosion);
                }

                for (const line of lineArray) {
                    this.game.death.kill(line);
                }

                this.game.battles.animations.things.flicker({
                    callback,
                    clearTime: 14,
                    interval: 5,
                    thing: this.defenderThing,
                });
            },
            24);
    }
}
