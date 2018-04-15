import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
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
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.explosionSmall),
        ];
        let startX: number;
        let startY: number;

        if (this.direction === -1) {
            startX = menu.right - this.defenderThing.width / 2;
            startY = menu.top;
        } else {
            startX = menu.left + this.defenderThing.width;
            startY = menu.bottom - (this.defenderThing.height + 8);
        }

        const offset: number = slashes[0].width / 2;
        this.gameStarter.things.add(slashes[0], startX, startY);
        this.gameStarter.things.add(slashes[1], startX + offset * this.direction * -1, startY + offset);
        this.gameStarter.things.add(slashes[2], startX + offset * this.direction * -2, startY + offset * 2);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                for (const slash of slashes) {
                    const left: number = this.direction === -1 ? slash.left : slash.right - 3;
                    const top: number =  slash.bottom - 3;

                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftHoriz(slash, differenceX * this.direction / 16),
                        1);
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftVert(slash, differenceX * this.direction / 16),
                        1);

                    const line: IThing = this.gameStarter.things.add(this.gameStarter.things.names.scratchLine, left, top);
                    if (this.direction === 1) {
                        this.gameStarter.graphics.flipHoriz(line);
                    }

                    lineArray.push(line);
                }
            },
            1,
            16);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const slash of slashes) {
                    this.gameStarter.physics.killNormal(slash);
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
            17);
    }
}
