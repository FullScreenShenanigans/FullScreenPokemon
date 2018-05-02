import { Team } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { ItemEffects } from "../../../../components/equations/ItemEffects";
import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { IThing } from "../../../Things";
import { IMenu } from "./../../../Menus";

export class ThrowBall<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {

    /**
     * Handles the logic and animations behind throwing a Pokeball.
     *
     * @param numShakes   How many times the Pokeball shakes.
     * @param pokemon   The pokemon that you're trying to catch.
     * @param callback   The method to call upon return.
     */
    public runAnimation(numShakes: number, pokemon: IPokemon, callback: () => void) {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const opponent: IThing = battleInfo.things.opponent;
        const arc = (x: number) => x ** 2 * 0.006805 - x * 10.8452 + 4610.268436;
        const pokeball = this.gameStarter.objectMaker.make<IThing>("CharBallStatus"); //TODO: Replace w/ proper Pokeball sprite
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const currentX = menu.left + opponent.width * 3 / 4;
        const currentY = menu.bottom - 30;
        let time = 0;

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
                    this.gameStarter.actions.animateSmokeSmall(pokeball.left + 5, arc(pokeball.left + 5), (): void => {
                        if (numShakes === 4) {
                            //potentially add dialog lines here
                            //const itemEffects = new ItemEffects(this);
                            //itemEffects.capturePokemon(pokemon);
                        } else {
                            callback();
                        }
                    });
                }
                if (time === 70) {
                    opponent.hidden = true;
                }
                if (time === 80) {
                    pokeball.hidden = false;
                    //TODO: Animate ball shaking.
                }
                time += 1;
            },
            1,
            81);

        time++;
    }
}
