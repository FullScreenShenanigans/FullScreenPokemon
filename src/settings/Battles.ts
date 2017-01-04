import { IBattleMovrSettings } from "battlemovr/lib/IBattleMovr";
import * as igamestartr from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding in-game battles, particularly for an IBattleMovr.
 */
export interface IBattlesModuleSettings extends igamestartr.IModuleSettingsObject, IBattleMovrSettings { }

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Battle settings for the FullScreenPokemon instance.
 */
export function GenerateBattlesSettings(fsp: FullScreenPokemon): IBattlesModuleSettings {
    "use strict";

    return {
        animations: fsp.battles.animations
    };
}
