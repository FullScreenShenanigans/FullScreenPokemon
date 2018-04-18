import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Slash battle move.
 */
export class Slash<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const differenceX: number = this.defenderThing.width / 2;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const slashes: IThing[] = [
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.scratchLine),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.scratchLine),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.scratchLine),
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
        this.gameStarter.things.add(slashes[0], startX, startY);
        this.gameStarter.things.add(slashes[1], startX +  offset * this.direction * -5, startY);
        this.gameStarter.things.add(slashes[2], startX + offset * this.direction * -10, startY);
        let time = 0;
        const explosionArray: IThing[] = [];
        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                for (const slash of slashes) {
                    const left: number = this.direction === Direction.Right ? slash.left : slash.right - 3;
                    const top: number =  slash.bottom - 3;

                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftHoriz(slash, differenceX * (this.direction * -1) / 16),
                        1);
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftVert(slash, differenceX * (this.direction) / 16),
                        1);

                    const line: IThing = this.gameStarter.things.add(this.gameStarter.things.names.scratchLine, left, top);
                    if (this.direction === 1) {
                        this.gameStarter.graphics.flipHoriz(line);
                    }
                    lineArray.push(line);
                    if (time === 14) {
                        const explosion = this.gameStarter.things.add(this.gameStarter.things.names.explosionSmall,
                                                                      left - 18, top);
                        explosionArray.push(explosion);
                    }
                }
                time += 1;
            },
            1,
            16);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const slash of slashes) {
                    this.gameStarter.physics.killNormal(slash);
                }

                for (const line of lineArray) {
                    this.gameStarter.battles.animations.things.flicker({
                        clearTime: 10,
                        interval: 2,
                        thing: line,
                    });
                }
                for (const explosion of explosionArray) {
                    this.gameStarter.physics.killNormal(explosion);
                }

                for (const line of lineArray) {
                    this.gameStarter.physics.killNormal(line);
                }

                this.gameStarter.battles.animations.things.flicker({
                    callback,
                    clearTime: 14,
                    interval: 5,
                    thing: this.defenderThing,
                });
            },
            24);
    }
}
