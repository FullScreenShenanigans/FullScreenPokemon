(function (things, macros) {
    FullScreenPokemon.prototype.settings.editor = {
        "blocksize": FullScreenPokemon.unitsize * 4,
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
        "things": things,
        "thingGroups": ["Character", "Solid", "Scenery"],
        "thingKeys": (function () {
            var keys = [];
            Object.keys(things).forEach(function (group) {
                keys.push.apply(keys, Object.keys(things[group]));
            });
            return keys;
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