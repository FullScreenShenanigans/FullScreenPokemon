import { IModsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Mod settings for the FullScreenPokemon instance.
 */
export function GenerateModsSettings(fsp: FullScreenPokemon): IModsModuleSettings {
    "use strict";

    return {
        mods: fsp.mods.mods
    };
}
