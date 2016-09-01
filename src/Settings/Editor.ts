/// <reference path="../../typings/AreaSpawnr.d.ts" />
/// <reference path="../../typings/GameStartr.d.ts" />
/// <reference path="../../typings/MapsCreatr.d.ts" />

import { Unitsize } from "../Constants";
import { ILevelEditrCustoms } from "../IFullScreenPokemon";

export function GenerateEditorSettings(): ILevelEditrCustoms {
    "use strict";

    return {
        blocksize: Unitsize * 4,
        mapDefault: {
            name: "New Map",
            locations: {
                StartGame: {}
            },
            areas: [
                {
                    setting: "Blank",
                    creation: [
                        { location: "StartGame" }
                    ]
                }
            ]
        },
        mapEntryDefault: undefined,
        mapSettingDefault: "Blank",
        prethings: {
            Text: {},
            Characters: {},
            Solids: {},
            Scenery: {},
            Terrain: {}
        },
        thingGroups: ["Character", "Solid", "Scenery"],
        thingKeys: undefined,
        things: {},
        macros: {}
    };
}
