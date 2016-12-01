import { IQuadrantsModuleSettings } from "gamestartr/lib/IGameStartr";

import { Unitsize } from "../Constants";

export function GenerateQuadrantsSettings(): IQuadrantsModuleSettings {
    "use strict";

    return {
        numRows: 5,
        numCols: 6,
        tolerance: Unitsize / 2,
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        keyGroupName: "groupType"
    };
}
