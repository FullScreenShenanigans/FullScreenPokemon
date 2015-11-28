(function (prethings, macros) {
    FullScreenPokemon.FullScreenPokemon.settings.editor = {
        "blocksize": FullScreenPokemon.FullScreenPokemon.unitsize * 4,
        "mapDefault": {
            "name": "New Map",
            "locations": {
                "StartGame": {}
            },
            "areas": [
                {
                    "setting": "Overworld",
                    "creation": [
                        { "location": "0" },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 }
                    ]
                }
            ]
        },
        "mapSettingDefault": "Overworld",
        "prethings": prethings,
        "thingGroups": ["Character", "Solid", "Scenery"],
        "things": (function () {
            var things = {},
                i, j;

            for (i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    for (j in prethings[i]) {
                        if (prethings[i].hasOwnProperty(j)) {
                            things[j] = prethings[i][j];
                        }
                    }
                }
            }

            return things;
        })(),
        "macros": macros
    };
    
})({
    "Characters": {},
    "Solids": {},
    "Scenery": {},
    "Terrain": {}
}, {
    
});