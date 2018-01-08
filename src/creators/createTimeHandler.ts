import { TimeHandlr } from "timehandlr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createTimeHandler = (fsp: FullScreenPokemon) =>
    new TimeHandlr({
        keyCycleCheckValidity: "alive",
        timingDefault: 9,
    });
