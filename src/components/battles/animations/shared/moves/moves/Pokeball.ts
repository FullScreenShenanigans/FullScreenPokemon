import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Direction } from "../../../../../Constants";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Pokeball throw.
 */
export class Pokeball<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Runs the Pokeball throwing animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {

        const arc = (x: number) => x ** 2 * 0.006805 - x * 10.8452 + 4610.268436;

        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const currentX = menu.left + this.defenderThing.width * 3 / 4;
        const currentY = menu.bottom - 30;
        let time = 0;
        const pokeball = this.gameStarter.objectMaker.make<IThing>("CharBallStatus"); //TODO: Replace w/ proper Pokeball sprite

        this.gameStarter.things.add(pokeball, currentX, currentY);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                if (time < 36) {
                    if (time % 8 === 0) {
                        this.gameStarter.graphics.flipVert(pokeball);
                    }
                    if (time % 16 === 0) {
                        this.gameStarter.graphics.unflipVert(pokeball);
                    }
                    this.gameStarter.physics.shiftHoriz(pokeball, 5);
                    this.gameStarter.physics.shiftVert(pokeball, (arc(pokeball.left) - arc(pokeball.left - 5)));
                }
                if (time === 36) {
                    pokeball.hidden = true;
                    this.gameStarter.actions.animateSmokeSmall(pokeball.left + 5, arc(pokeball.left + 5), callback);
                }
                if (time === 70) {
                    this.defenderThing.hidden = true;
                }
                if (time === 80) {
                    pokeball.hidden = false;
                    //TODO: Animate ball shaking.
                }
                time += 1;
            },
            1,
            81);
    }
}
