import { IEventsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Event settings for the FullScreenPokemon instance.
 */
export function GenerateEventsSettings(_fsp: FullScreenPokemon): IEventsModuleSettings {
    "use strict";

    return {
        keyOnClassCycleStart: "onThingAdd",
        keyDoClassCycleStart: "placed",
        keyCycleCheckValidity: "alive",
        timingDefault: 9
    };
}
