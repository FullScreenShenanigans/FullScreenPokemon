import { ModAttachr } from "modattachr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createModAttacher = (game: FullScreenPokemon) =>
    new ModAttachr({
        itemsHolder: game.itemsHolder,
        mods: game.mods.mods,
        transformModName: (name: string): string => `Mods::${name}`,
        ...game.settings.components.modAttacher,
    });	