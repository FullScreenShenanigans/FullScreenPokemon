import { IQuadrant, QuadsKeepr } from "quadskeepr";

import { IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createQuadsKeeper = (fsp: FullScreenPokemon) => {
    const quadrantWidth: number = fsp.settings.width / 6;
    const quadrantHeight: number = fsp.settings.height / 6;

    return new QuadsKeepr<any>({
        quadrantFactory: (): IQuadrant<IThing> => fsp.objectMaker.make<IQuadrant<IThing>>("Quadrant"),
        quadrantWidth,
        quadrantHeight,
        numRows: 5,
        numCols: 6,
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
