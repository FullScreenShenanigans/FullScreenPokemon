import { BattleOutcome } from "battlemovr";
import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IPokemon } from "../../../../../Battles";
import { IBattleBall } from "../../../../../constants/Items";
import { ItemEffects } from "../../../../../equations/ItemEffects";
import { IMenu } from "../../../../../Menus";
import { IThing } from "../../../../../Things";
import { Item } from "../Item";

/**
 * Animates a Pokeball item usage.
 */
export class Pokeball<TGameStarter extends FullScreenPokemon> extends Item<TGameStarter> {

    /**
     * Runs the items animation.
     *
     * @param onComplete   Callback for when the animation is done.
     */
    public runAnimation(onComplete: () => void): void {
        const arc = (x: number) => x ** 2 * 0.006805 - x * 10.8452 + 4610.268436;

        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const currentX = menu.left + this.defenderThing.width * 3 / 4;
        const currentY = menu.bottom - 30;
        let time = 0;
        const pokeball = this.gameStarter.objectMaker.make<IThing>("CharBallStatus"); //TODO: Replace w/ proper Pokeball sprite
        const itemType: IBattleBall = this.makeBattleBall();
        const numShakes = this.gameStarter.equations.numBallShakes(this.defender, itemType);
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
                    this.gameStarter.actions.animateSmokeSmall(pokeball.left + 5, arc(pokeball.left + 5), onComplete);
                }
                if (time === 70) {
                    this.defenderThing.hidden = true;
                }
                if (time === 80) {
                    pokeball.hidden = false;
                    //TODO: Animate ball shaking.

                    if (numShakes === 4) {
                        //stop battle
                        const outcome: BattleOutcome = 3;
                        this.gameStarter.battleMover.stopBattle(outcome, onComplete);
                    } else {
                        const itemEffects = new ItemEffects(this);
                        itemEffects.capturePokemon(this.attacker);
                    }
                }
                time += 1;
            },
            1,
            81);
    }

    /**
     * Makes a BattleBall based on the item data read in for Pokeball.
     */
    public makeBattleBall(): IBattleBall {
        let probability = 0;
        if (this.item === "Poke") { //should this be Poke?
            probability = 255;
        } else if (this.item === "Great") {
            probability = 200;
        } else {
            probability = 150;
        }

        const itemValue = this.gameStarter.constants.items.byName[this.item];
        const pokeball: IBattleBall = {
            effect: itemValue.effect,
            name: itemValue.name,
            rate: probability,
            probabilityMax: 255,
            type: this.item,
            category: "Pokeball",
        };
        return pokeball;
    }
}
