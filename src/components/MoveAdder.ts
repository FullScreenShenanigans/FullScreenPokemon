import { IMove } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

export class MoveAdder<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {

    //returns whether the move has been successfully added or not
    public AddMove(pokemon: IPokemon, move: IMove, index: number) {
        pokemon.moves[index] = move;
    }
}
