import { FullScreenPokemon } from "../FullScreenPokemon";
import { Macros } from "../Macros";
import { Maps } from "../Maps";
import { Scrolling } from "../Scrolling";

export function GenerateMapsSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.maps = {
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
            }
        }
    };
}
