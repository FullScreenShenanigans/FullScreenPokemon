/// <reference path="../../typings/GameStartr.d.ts" />

import { IStateHoldrSettings } from "../IFullScreenPokemon";

export function GenerateStateSettings(): IStateHoldrSettings {
    "use strict";

    return {
        prefix: "StateHolder::"
    } as any;
}
