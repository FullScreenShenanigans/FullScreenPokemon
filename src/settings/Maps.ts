import * as igamestartr from "gamestartr/lib/IGameStartr";

import { IMapRaw } from "../components/Maps";
import { FullScreenPokemon } from "../FullScreenPokemon";
import { PalletTown } from "./mapsLibrary/PalletTown";
import { PewterCity } from "./mapsLibrary/PewterCity";
import { Route1 } from "./mapsLibrary/Route1";
import { Route2 } from "./mapsLibrary/Route2";
import { Route21 } from "./mapsLibrary/Route21";
import { Route22 } from "./mapsLibrary/Route22";
import { ViridianCity } from "./mapsLibrary/ViridianCity";
import { ViridianForest } from "./mapsLibrary/ViridianForest";

/**
 * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
 * and MapsCreatr.
 */
export interface IMapsModuleSettings extends igamestartr.IMapsModuleSettings {
    /**
     * Known maps, keyed by name.
     */
    library?: {
        [i: string]: IMapRaw;
    };
}

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Map settings for the FullScreenPokemon instance.
 */
export function GenerateMapsSettings(fsp: FullScreenPokemon): IMapsModuleSettings {
    "use strict";

    return {
        mapDefault: "Blank",
        locationDefault: "Black",
        groupTypes: ["Text", "Character", "Solid", "Scenery", "Terrain", "Thing"],
        requireEntrance: true,
        screenAttributes: [
            "allowCycling"
        ],
        screenVariables: {
            boundaries: fsp.scrolling.getAreaBoundariesReal.bind(fsp.scrolling),
            scrollability: fsp.scrolling.getScreenScrollability.bind(fsp.scrolling)
        },
        onSpawn: fsp.maps.addPreThing.bind(fsp.maps),
        afterAdd: fsp.maps.addAfter.bind(fsp.maps),
        macros: {
            Checkered: fsp.macros.macroCheckered.bind(fsp.macros),
            Water: fsp.macros.macroWater.bind(fsp.macros),
            House: fsp.macros.macroHouse.bind(fsp.macros),
            HouseLarge: fsp.macros.macroHouseLarge.bind(fsp.macros),
            Building: fsp.macros.macroBuilding.bind(fsp.macros),
            Gym: fsp.macros.macroGym.bind(fsp.macros),
            Mountain: fsp.macros.macroMountain.bind(fsp.macros),
            PokeCenter: fsp.macros.macroPokeCenter.bind(fsp.macros),
            PokeMart: fsp.macros.macroPokeMart.bind(fsp.macros)
        },
        entrances: {
            Blank: fsp.maps.entranceBlank.bind(fsp.maps),
            Normal: fsp.maps.entranceNormal.bind(fsp.maps)
        },
        library: {
            Blank: {
                name: "Blank",
                locationDefault: "Black",
                locations: {
                    Black: {
                        area: "Black",
                        entry: "Blank"
                    },
                    White: {
                        area: "White",
                        entry: "Blank"
                    }
                },
                areas: {
                    Black: {
                        creation: []
                    },
                    White: {
                        background: "white",
                        creation: []
                    }
                }
            },
            "Pallet Town": PalletTown,
            "Pewter City": PewterCity,
            "Route 1": Route1,
            "Route 2": Route2,
            "Route 21": Route21,
            "Route 22": Route22,
            "Viridian City": ViridianCity,
            "Viridian Forest": ViridianForest
        }
    };
}
