import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateStateSettings(): void {
    "use strict";
    FullScreenPokemon.prototype.settings.states = {
        "prefix": "StateHolder::"
    } as any;
}
