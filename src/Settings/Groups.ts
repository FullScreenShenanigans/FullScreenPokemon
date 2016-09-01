/// <reference path="../../typings/GameStartr.d.ts" />

export function GenerateGroupsSettings(): GameStartr.IGroupHoldrCustoms {
    "use strict";

    return {
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text", "Thing"],
        groupTypes: {
            Solid: "Array",
            Character: "Array",
            Scenery: "Array",
            Terrain: "Array",
            Text: "Array",
            Thing: "Object"
        }
    };
}
