FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Pallet Town",
    "locationDefault": "StartGame",
    "requireEntrance": true,
    "screenAttributes": [],
    "screenVariables": {},
    "onSpawn": FullScreenPokemon.prototype.addPreThing,
    "macros": {},
    "entrances": {
        "Normal": FullScreenPokemon.prototype.mapEntranceNormal
    },
    "library": (function (maps) {
        var library = {},
            i;
        
        for (i = 0; i < maps.length; i += 1) {
            library[maps[i].name] = maps[i];
        }
        
        return library;
    })([
        {
            "name": "Pallet Town",
            "locations": {
                "StartGame": {
                    "xloc": 24,
                    "yloc": 48
                },
            },
            "areas": [
                {
                    "setting": "Land",
                    "creation": [
                        { "thing": "ComputerDesk" },
                        { "thing": "Table", "x": 8 },
                        { "thing": "StairsDown", "x": 56, "y": 16 },
                        { "thing": "WindowBlinds", "x": 40, "y": 8 },
                        { "thing": "WindowBlinds", "x": 56, "y": 8 },
                        { "thing": "TelevisionMonitor", "x": 24, "y": 32 },
                        { "thing": "ConsoleAndController", "x": 24, "y": 40 },
                        { "thing": "BedSingle", "y": 64 },
                        { "thing": "PottedPalmTree", "x": 48, "y": 64 }
                    ]
                }
            ]
        }
    ])
};