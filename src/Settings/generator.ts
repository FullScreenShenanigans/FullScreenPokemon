import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateGeneratorSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.generator = {
        possibilities: {}
    };
}
