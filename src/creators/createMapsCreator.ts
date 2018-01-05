import { MapsCreatr } from "mapscreatr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { PalletTown } from "./mapsLibrary/PalletTown";
import { PewterCity } from "./mapsLibrary/PewterCity";
import { Route1 } from "./mapsLibrary/Route1";
import { Route2 } from "./mapsLibrary/Route2";
import { Route21 } from "./mapsLibrary/Route21";
import { Route22 } from "./mapsLibrary/Route22";
import { ViridianCity } from "./mapsLibrary/ViridianCity";
import { ViridianForest } from "./mapsLibrary/ViridianForest";

export const createMapsCreator = (fsp: FullScreenPokemon): MapsCreatr =>
    new MapsCreatr({
        entrances: {
            Blank: fsp.maps.entrances.blank,
            Normal: fsp.maps.entrances.normal,
        },
        groupTypes: ["Text", "Character", "Solid", "Scenery", "Terrain"],
        macros: {
            Checkered: fsp.maps.macros.macroCheckered,
            Water: fsp.maps.macros.macroWater,
            House: fsp.maps.macros.macroHouse,
            HouseLarge: fsp.maps.macros.macroHouseLarge,
            Building: fsp.maps.macros.macroBuilding,
            Gym: fsp.maps.macros.macroGym,
            Mountain: fsp.maps.macros.macroMountain,
            PokeCenter: fsp.maps.macros.macroPokeCenter,
            PokeMart: fsp.maps.macros.macroPokeMart,
        },
        maps: {
            "Blank": {
                name: "Blank",
                locationDefault: "Black",
                locations: {
                    Black: {
                        area: "Black",
                        entry: "Blank",
                    },
                    White: {
                        area: "White",
                        entry: "Blank",
                    },
                },
                areas: {
                    Black: {
                        creation: [],
                    },
                    White: {
                        background: "white",
                        creation: [],
                    },
                },
            },
            "Pallet Town": PalletTown,
            "Pewter City": PewterCity,
            "Route 1": Route1,
            "Route 2": Route2,
            "Route 21": Route21,
            "Route 22": Route22,
            "Viridian City": ViridianCity,
            "Viridian Forest": ViridianForest,
        },
        objectMaker: fsp.objectMaker,
        requireEntrance: true,
        ...fsp.settings.components.maps,
    });
