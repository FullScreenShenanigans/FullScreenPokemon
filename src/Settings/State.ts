/// <reference path="../../typings/GameStartr.d.ts" />

import { IStateHoldrCustoms } from "../IFullScreenPokemon";

export function GenerateStateSettings(): IStateHoldrCustoms {
    "use strict";

    return {
        prefix: "StateHolder::"
    } as any;
}
