import { IPixelDrawrSettings } from "pixeldrawr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Renderer settings for the FullScreenPokemon instance.
 */
export const GenerateRendererSettings = (_fsp: FullScreenPokemon): Partial<IPixelDrawrSettings> => ({
    groupNames: ["Text", "Character", "Scenery", "Solid", "Terrain"],
    spriteCacheCutoff: 2048,
    framerateSkip: 2,
    keyOffsetX: "offsetX",
    keyOffsetY: "offsetY",
});
