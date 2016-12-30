import { IRendererModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Renderer settings for the FullScreenPokemon instance.
 */
export function GenerateRendererSettings(_fsp: FullScreenPokemon): IRendererModuleSettings {
    "use strict";

    return {
        groupNames: ["Text", "Character", "Scenery", "Solid", "Terrain"],
        spriteCacheCutoff: 2048,
        framerateSkip: 2,
        keyOffsetX: "offsetX",
        keyOffsetY: "offsetY"
    };
}
