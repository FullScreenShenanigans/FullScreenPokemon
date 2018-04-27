import { IQuadrant, QuadsKeepr } from "quadskeepr";

import { IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

const numRows = 7;
const numCols = 7;

export const createQuadsKeeper = (fsp: FullScreenPokemon) => {
    const quadrantWidth: number = fsp.settings.width / (numRows - 2);
    const quadrantHeight: number = fsp.settings.height / (numCols - 2);

    return new QuadsKeepr<any>({
        quadrantFactory: (): IQuadrant<IThing> => fsp.objectMaker.make<IQuadrant<IThing>>("Quadrant"),
        quadrantWidth,
        quadrantHeight,
        numRows,
        numCols,
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        startLeft: -quadrantWidth,
        startTop: -quadrantHeight,
        onAdd: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            fsp.maps.onAreaSpawn(direction, top, right, bottom, left);
        },
        onRemove: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            fsp.maps.onAreaUnspawn(direction, top, right, bottom, left);
        },
        ...fsp.settings.components.quadrants,
    });
};
