import { IQuadrantsModuleSettings } from "gamestartr/lib/IGameStartr";

export function GenerateQuadrantsSettings(): IQuadrantsModuleSettings {
    "use strict";

    return {
        numRows: 5,
        numCols: 6,
        tolerance: 2,
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        keyGroupName: "groupType"
    };
}
