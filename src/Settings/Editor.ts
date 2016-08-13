/// <reference path="../../typings/AreaSpawnr.d.ts" />
/// <reference path="../../typings/GameStartr.d.ts" />
/// <reference path="../../typings/MapsCreatr.d.ts" />

import { Unitsize } from "../Constants";

export function GenerateEditorSettings(): GameStartr.ILevelEditrCustoms {
    "use strict";

    const prethings: { [i: string]: any } = {
        Characters: {},
        Solids: {},
        Scenery: {},
        Terrain: {}
    };

    const macros: { [i: string]: string } = {};

    return {
        blocksize: Unitsize * 4,
        mapDefault: {
            name: "New Map",
            locations: {
                StartGame: {}
            },
            areas: [
                {
                    setting: "Overworld",
                    creation: [
                        { "location": "0" },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 }
                    ]
                }
            ] as any
        },
        mapEntryDefault: undefined,
        mapSettingDefault: "Overworld",
        prethings: prethings,
        thingGroups: ["Character", "Solid", "Scenery"],
        thingKeys: undefined,
        things: ((): { [i: string]: any } => {
            const things: { [i: string]: any } = {};

            for (const i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    for (const j in prethings[i]) {
                        if (prethings[i].hasOwnProperty(j)) {
                            things[j] = prethings[i][j];
                        }
                    }
                }
            }

            return things;
        })(),
        macros: macros as any
    };
}
