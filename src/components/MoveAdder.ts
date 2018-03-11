import { IMove } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

export class MoveAdder<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Adds a new move to a Pokemon's set of moves.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     * @param index   The position the move is going into in the Pokemon's moves.
     */
    public addMove(pokemon: IPokemon, move: IMove, index: number) {
        pokemon.moves[index] = move;
    }
}
