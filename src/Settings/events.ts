import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateEventsSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.events = {
        keyOnClassCycleStart: "onThingAdd",
        keyDoClassCycleStart: "placed",
        keyCycleCheckValidity: "alive",
        timingDefault: 9
    };
}
