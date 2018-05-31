import { IItemsHoldr } from "itemsholdr";
import { ModAttachr } from "modattachr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createModAttacher = (fsp: FullScreenPokemon): ModAttachr =>
    new ModAttachr({
        itemsHolder: fsp.itemsHolder as IItemsHoldr,
        transformModName: (name: string): string => `Mods::${name}`,
        mods: fsp.mods.mods,
        ...fsp.settings.components.modAttacher,
    });
