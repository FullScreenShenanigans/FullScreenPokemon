import { IQuadsKeeprSettings } from "quadskeepr";

import { IThing } from "../components/Things";

/**
 * @returns Quadrant settings for a FullScreenPokemon instance.
 */
export const GenerateQuadrantsSettings = (): Partial<IQuadsKeeprSettings<IThing>> => ({
    numRows: 5,
    numCols: 6,
    groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
});
