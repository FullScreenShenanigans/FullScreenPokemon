import { IGroupsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Group settings for the FullScreenPokemon instance.
 */
export function GenerateGroupsSettings(_fsp: FullScreenPokemon): IGroupsModuleSettings {
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
