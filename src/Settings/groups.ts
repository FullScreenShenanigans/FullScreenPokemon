import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateGroupsSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.groups = {
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
