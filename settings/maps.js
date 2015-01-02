FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Pallet Town Player Bedroom",
    "locationDefault": "StartGame",
    "groupTypes": ["Character", "Solid", "Scenery", "Terrain"],
    "requireEntrance": true,
    "screenAttributes": [],
    "screenVariables": {
        "boundaries": FullScreenPokemon.prototype.getAreaBoundariesReal,
        "scrollability": FullScreenPokemon.prototype.getScreenScrollability
    },
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
            "name": "Pallet Town Player Bedroom",
            "locations": {
                "StartGame": {
                    "xloc": 24,
                    "yloc": 40
                },
            },
            "areas": [
                {
                    "setting": "Land",
                    "creation": [
                        { "thing": "WallIndoorHorizontalBands", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                        { "thing": "ComputerDesk" },
                        { "thing": "Table", "x": 8 },
                        { "thing": "StairsDown", "x": 56, "y": 8 },
                        { "thing": "WindowBlinds", "x": 40 },
                        { "thing": "WindowBlinds", "x": 56 },
                        { "thing": "ConsoleAndController", "x": 24, "y": 32 },
                        { "thing": "TelevisionMonitor", "x": 24, "y": 24 },
                        { "thing": "BedSingle", "y": 48 },
                        { "thing": "PottedPalmTree", "x": 48, "y": 48 }
                    ]
                }
            ]
        }
    ])
};