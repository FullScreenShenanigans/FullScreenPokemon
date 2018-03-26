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
     * Increases a stat
     *
     * @param statistic   The statistic that is being modified.
     * @param amount   How much a statistic is increased by.
     */
    public addBattleStats(statistic: IStatistic, amount: number) {
        if (amount < 0) {
            throw new Error("Battle stat decrements aren't allowed");
        }
        statistic.current = Math.min(statistic.normal * 4, (statistic.normal / 2) * amount + statistic.current);
    }

}
