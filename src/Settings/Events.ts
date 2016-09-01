/// <reference path="../../typings/GameStartr.d.ts" />

export function GenerateEventsSettings(): GameStartr.ITimeHandlrCustoms {
    "use strict";

    return {
        keyOnClassCycleStart: "onThingAdd",
        keyDoClassCycleStart: "placed",
        keyCycleCheckValidity: "alive",
        timingDefault: 9
    };
}
