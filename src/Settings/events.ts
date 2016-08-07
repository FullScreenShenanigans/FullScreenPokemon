import { FullScreenPokemon } from "../FullScreenPokemon";

FullScreenPokemon.prototype.settings.events = {
    keyOnClassCycleStart: "onThingAdd",
    keyDoClassCycleStart: "placed",
    keyCycleCheckValidity: "alive",
    timingDefault: 9
};
