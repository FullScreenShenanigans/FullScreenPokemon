import { IQuadrant, QuadsKeepr } from "quadskeepr";

import { IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createQuadsKeeper = (fsp: FullScreenPokemon) => {
    const numRows = 5;
    const numCols = 6;

    const quadrantWidth: number = fsp.settings.width / numCols;
    const quadrantHeight: number = fsp.settings.height / numRows;

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
        ...fsp.settings.components.quadsKeeper,
    });
};
