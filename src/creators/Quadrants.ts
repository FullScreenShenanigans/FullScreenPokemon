import { IQuadsKeeprSettings } from "quadskeepr";

import { IThing } from "../components/Things";

export const quadrantsSettings: Partial<IQuadsKeeprSettings<IThing>> = {
    numRows: 5,
    numCols: 6,
    groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
};
