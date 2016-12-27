import { Macros } from "../components/Macros";
import { Maps } from "../components/Maps";
import { Scrolling } from "../components/Scrolling";
import { IMapsModuleSettings } from "../IFullScreenPokemon";
import { PalletTown } from "./mapsLibrary/PalletTown";
import { PewterCity } from "./mapsLibrary/PewterCity";
import { Route1 } from "./mapsLibrary/Route1";
import { Route2 } from "./mapsLibrary/Route2";
import { Route21 } from "./mapsLibrary/Route21";
import { Route22 } from "./mapsLibrary/Route22";
import { ViridianCity } from "./mapsLibrary/ViridianCity";
import { ViridianForest } from "./mapsLibrary/ViridianForest";

export function GenerateMapsSettings(): IMapsModuleSettings {
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
            boundaries: Scrolling.prototype.getAreaBoundariesReal,
            scrollability: Scrolling.prototype.getScreenScrollability
        },
        onSpawn: Maps.prototype.addPreThing,
        afterAdd: Maps.prototype.addAfter,
        macros: {
            Checkered: Macros.prototype.macroCheckered,
            Water: Macros.prototype.macroWater,
            House: Macros.prototype.macroHouse,
            HouseLarge: Macros.prototype.macroHouseLarge,
            Building: Macros.prototype.macroBuilding,
            Gym: Macros.prototype.macroGym,
            Mountain: Macros.prototype.macroMountain,
            PokeCenter: Macros.prototype.macroPokeCenter,
            PokeMart: Macros.prototype.macroPokeMart
        },
        entrances: {
            Blank: Maps.prototype.entranceBlank,
            Normal: Maps.prototype.entranceNormal
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
