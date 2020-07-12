import { NumberMakr } from "numbermakr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createNumberMaker = (game: FullScreenPokemon) =>
    new NumberMakr(game.settings.components.numberMaker);
