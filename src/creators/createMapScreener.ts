import { MapScreenr } from "mapscreenr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createMapScreener = (fsp: FullScreenPokemon): MapScreenr =>
    new MapScreenr({
        height: fsp.settings.height,
        variableFunctions: {
            boundaries: fsp.scrolling.getAreaBoundariesReal.bind(fsp.scrolling),
            scrollability: fsp.scrolling.getScreenScrollability.bind(fsp.scrolling),
        },
        width: fsp.settings.width,
    });
