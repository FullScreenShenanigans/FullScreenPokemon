import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Scratch battle move.
 */
export class Scratch<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const differenceX: number = this.defenderThing.width / 2;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionSmall),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionSmall),
            this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.ExplosionSmall)
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

        const offset: number = scratches[0].width / 2;
        this.gameStarter.things.add(scratches[0], startX, startY);
        this.gameStarter.things.add(scratches[1], startX + offset * this.direction * -1, startY + offset);
        this.gameStarter.things.add(scratches[2], startX + offset * this.direction * -2, startY + offset * 2);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = this.direction === -1 ? scratch.left : scratch.right - 3;
                    const top: number =  scratch.bottom - 3;

                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftHoriz(scratch, differenceX * this.direction / 16),
                        1);
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftVert(scratch, differenceX * this.direction / 16),
                        1);

                    const line: IThing = this.gameStarter.things.add(this.gameStarter.things.names.ScratchLine, left, top);
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
                for (const scratch of scratches) {
                    this.gameStarter.physics.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.gameStarter.physics.killNormal(line);
                }

                this.gameStarter.battles.animations.things.flicker({
                    callback,
                    clearTime: 14,
                    interval: 5,
                    thing: this.defenderThing
                });
            },
            17);
    }
}
