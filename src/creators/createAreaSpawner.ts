import { AreaSpawnr } from "areaspawnr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createAreaSpawner = (fsp: FullScreenPokemon): AreaSpawnr =>
    new AreaSpawnr({
        afterAdd: fsp.maps.addAfter,
        mapsCreatr: fsp.mapsCreator,
        mapScreenr: fsp.mapScreener,
        onSpawn: fsp.maps.addPreThing,
        screenAttributes: [
            "allowCycling",
        ],
        ...fsp.settings.components.areas,
    });
