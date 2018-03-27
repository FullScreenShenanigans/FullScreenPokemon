import { IMove, IStatistic } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";

export class ItemEffects<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Restores a certain amount of PP to a move.
     *
     * @param move   The move whose PP is being modified.
     * @param amount   The amount of PP that is being restored.
     */
    public addPP(move: IMove, amount: number) {
        if (amount < 0) {
            throw new Error("PP decrements aren't allowed");
        }

        move.remaining = Math.min(move.remaining + amount, move.uses);
    }

    /**
     * Increases a stat by 1.
     *
     * @param statistic   The statistic that is being modified.
     */
    private addBattleStat(statistic: IStatistic) {
        statistic.current = Math.min(statistic.normal * 4, (statistic.normal / 2) + statistic.current);
        console.log(statistic.current);
    }

    /**
     * Opens dialog menu for using a battle item like X Attack / X Defend.
     *
     * @param pokemon   The pokemon who the X Item is being used on.
     * @param statistic   The stat that is being modified by the item.
     * @param type   The string representing the stat name.
     */
    public useXItem(pokemon: IPokemon, statistic: IStatistic, type: string) {

        //TODO: Implement X Accuracy
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% used X " + type.toUpperCase() + "!",
                ],
                pokemon.title.join("") + "'s " + type.toUpperCase() + " rose!",
            ],
            (): void => {
                this.addBattleStat(statistic);
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
