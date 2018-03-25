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
    public addPP(pokemon: IPokemon, index: number, amount: number) {
        if (index < 0 || index > 4) {
            return;
        }
        if (pokemon.moves[index].remaining + amount > pokemon.moves[index].uses) {
            pokemon.moves[index].remaining = pokemon.moves[index].uses;
        } else if (pokemon.moves[index].remaining + amount < 0) {
            pokemon.moves[index].remaining = 0;
        } else {
            pokemon.moves[index].remaining += amount;
        }
        return;
    }
}
