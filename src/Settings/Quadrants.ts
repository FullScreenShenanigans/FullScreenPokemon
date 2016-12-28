import { IQuadrantsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Quadrant settings for the FullScreenPokemon instance.
 */
export function GenerateQuadrantsSettings(_fsp: FullScreenPokemon): IQuadrantsModuleSettings {
    "use strict";

    return {
        numRows: 5,
        numCols: 6,
        tolerance: 2,
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        keyGroupName: "groupType"
    };
}
