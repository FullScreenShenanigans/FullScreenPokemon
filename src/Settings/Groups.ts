import { IGroupsModuleSettings } from "gamestartr/lib/IGameStartr";

export function GenerateGroupsSettings(): IGroupsModuleSettings {
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
