import { IEventsModuleSettings } from "gamestartr/lib/IGameStartr";

export function GenerateEventsSettings(): IEventsModuleSettings {
    "use strict";

    return {
        keyOnClassCycleStart: "onThingAdd",
        keyDoClassCycleStart: "placed",
        keyCycleCheckValidity: "alive",
        timingDefault: 9
    };
}
