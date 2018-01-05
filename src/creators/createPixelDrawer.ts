import { PixelDrawr } from "pixeldrawr";

import { IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createPixelDrawer = (fsp: FullScreenPokemon) =>
    new PixelDrawr({
        boundingBox: fsp.mapScreener,
        canvas: fsp.canvas,
        createCanvas: (width: number, height: number): HTMLCanvasElement =>
            fsp.utilities.createCanvas(width, height),
        framerateSkip: 2,
        generateObjectKey: (thing: IThing): string =>
            fsp.graphics.generateThingKey(thing),
        pixelRender: fsp.pixelRender,
        spriteCacheCutoff: 2048,
        thingArrays: [
            fsp.groupHolder.getGroup("Terrain"),
            fsp.groupHolder.getGroup("Solid"),
            fsp.groupHolder.getGroup("Scenery"),
            fsp.groupHolder.getGroup("Character"),
            fsp.groupHolder.getGroup("Text"),
        ],
        ...fsp.settings.components.drawing,
    });
