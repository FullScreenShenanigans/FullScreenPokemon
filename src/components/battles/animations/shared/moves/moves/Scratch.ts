import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Scratch battle move.
 */
export class Scratch<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const differenceX: number = this.defenderThing.width / 2;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.eightBitter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.explosionSmall),
            this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.explosionSmall),
            this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.explosionSmall),
        ];
        let startX: number;
        let startY: number;

        if (this.direction === Direction.Right) {
            startX = menu.right - this.defenderThing.width / 2;
            startY = menu.top;
        } else {
            startX = menu.left + this.defenderThing.width;
            startY = menu.bottom - (this.defenderThing.height + 8);
        }

        const offset: number = scratches[0].width / 2;
        this.eightBitter.things.add(scratches[0], startX, startY);
        this.eightBitter.things.add(scratches[1], startX + offset * this.direction * -1, startY + offset);
        this.eightBitter.things.add(scratches[2], startX + offset * this.direction * -2, startY + offset * 2);

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = this.direction === -1 ? scratch.left : scratch.right - 3;
                    const top: number =  scratch.bottom - 3;

                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.physics.shiftHoriz(scratch, differenceX * this.direction / 16),
                        1);
                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.physics.shiftVert(scratch, differenceX * this.direction / 16),
                        1);

                    const line: IThing = this.eightBitter.things.add(this.eightBitter.things.names.scratchLine, left, top);
                    if (this.direction === 1) {
                        this.eightBitter.graphics.flipHoriz(line);
                    }

                    lineArray.push(line);
                }
            },
            1,
            16);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                for (const scratch of scratches) {
                    this.eightBitter.death.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.eightBitter.death.killNormal(line);
                }

                this.eightBitter.battles.animations.things.flicker({
                    callback,
                    clearTime: 14,
                    interval: 5,
                    thing: this.defenderThing,
                });
            },
            17);
    }
}
