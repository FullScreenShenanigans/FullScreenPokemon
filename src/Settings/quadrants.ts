/// <reference path="../../typings/GameStartr.d.ts" />

import { Unitsize } from "../Constants";

export function GenerateQuadrantsSettings(): GameStartr.IQuadsKeeprCustoms {
    "use strict";

    return {
        numRows: 5,
        numCols: 6,
        tolerance: Unitsize / 2,
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        keyGroupName: "groupType"
    };
}
