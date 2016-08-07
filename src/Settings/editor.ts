/// <reference path="../../typings/AreaSpawnr.d.ts" />
/// <reference path="../../typings/MapsCreatr.d.ts" />

import { FullScreenPokemon } from "../FullScreenPokemon";

((prethings: { [i: string]: any }, macros: { [i: string]: string }): void => {
    FullScreenPokemon.prototype.settings.editor = {
        blocksize: FullScreenPokemon.prototype.unitsize * 4,
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
})({
    Characters: {},
    Solids: {},
    Scenery: {},
    Terrain: {}
}, {
    // ...
});
