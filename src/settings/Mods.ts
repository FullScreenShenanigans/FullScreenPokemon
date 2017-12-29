import { IModAttachrSettings } from "modattachr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Mod settings for the FullScreenPokemon instance.
 */
export const GenerateModsSettings = (fsp: FullScreenPokemon): Partial<IModAttachrSettings> => ({
    mods: fsp.mods.mods,
});
