import { IModuleSettingsObject } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding large-scale state storage, particularly for an IStateHoldr.
 */
export interface IStateModuleSettings extends IModuleSettingsObject {
    /**
     * A prefix to prepend keys for the itemsHolder.
     */
    prefix?: string;
}

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns State settings for the FullScreenPokemon instance.
 */
export function GenerateStateSettings(_fsp: FullScreenPokemon): IStateModuleSettings {
    "use strict";

    return {
        prefix: "StateHolder::"
    };
}
