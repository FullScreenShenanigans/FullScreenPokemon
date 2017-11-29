import { IGeneratorModuleSettings } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Generator settings for the FullScreenPokemon instance.
 */
export function GenerateGeneratorSettings(_fsp: FullScreenPokemon): IGeneratorModuleSettings {
    "use strict";

    return {
        possibilities: {}
    };
}
