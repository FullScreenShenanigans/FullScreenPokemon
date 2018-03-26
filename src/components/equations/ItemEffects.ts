import { IMove } from "battlemovr";
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
}
