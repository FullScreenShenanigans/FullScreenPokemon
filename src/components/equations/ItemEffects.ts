import { IMove } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";

export class ItemEffects<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {

    /**
     * Restores a certain amount of PP to a Pokemon's move.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param index   The index of the moveset that is being modified.
     * @param amount   The amount of PP that is being restored.
     */
    public addPP(move: IMove, amount: number) {
        if (amount < 0) {
            return;
        }
        move.remaining = Math.min(move.remaining + amount, move.uses);
    }
}
