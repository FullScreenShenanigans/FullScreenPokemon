import { IItemsHoldr } from "itemsholdr";
import { StateHoldr } from "stateholdr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createStateHolder = (fsp: FullScreenPokemon): StateHoldr =>
    new StateHoldr({
        itemsHolder: fsp.itemsHolder as IItemsHoldr,
        prefix: "StateHolder::",
    });
