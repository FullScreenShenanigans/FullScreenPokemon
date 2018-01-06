import { MapScreenr } from "mapscreenr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createMapScreener = (fsp: FullScreenPokemon): MapScreenr =>
    new MapScreenr({
        height: fsp.settings.height,
        variableFunctions: {
            boundaries: fsp.scrolling.getAreaBoundariesReal,
            scrollability: fsp.scrolling.getScreenScrollability,
        },
        width: fsp.settings.width,
    });
