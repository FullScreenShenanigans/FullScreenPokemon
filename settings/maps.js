FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Player's House",
    "locationDefault": "Bedroom Stairs",
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
            "name": "Player's House",
            "locations": {
                "Start Game": {
                    "area": "Bedroom",
                    "xloc": 24,
                    "yloc": 40
                },
                "Bedroom Stairs": {
                    "area": "Bedroom"
                },
                "Ground Floor Stairs": {
                    "area": "Ground Floor"
                }
            },
            "locationDefault": "Start Game",
            "areas": {
                "Bedroom": {
                    "creation": [
                        { "thing": "WallIndoorHorizontalBands", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                        { "thing": "ComputerDesk" },
                        { "thing": "Table3x2", "x": 8 },
                        { "thing": "StairsDown", "x": 56, "y": 8, "entrance": "Bedroom Stairs", "transport": "Ground Floor Stairs" },
                        { "thing": "WindowBlinds", "x": 40 },
                        { "thing": "WindowBlinds", "x": 56 },
                        { "thing": "ConsoleAndController", "x": 24, "y": 32 },
                        { "thing": "TelevisionMonitor", "x": 24, "y": 24 },
                        { "thing": "BedSingle", "y": 48 },
                        { "thing": "PottedPalmTree", "x": 48, "y": 48 }
                    ]
                },
                "Ground Floor": {
                    "creation": [
                        { "thing": "WallIndoorHorizontalBands", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                        { "thing": "WindowBlinds", "x": 24 },
                        { "thing": "WindowBlinds", "x": 40 },
                        { "thing": "WindowBlinds", "x": 56 },
                        { "thing": "Bookshelf", "width": 16 },
                        { "thing": "TelevisionMonitor", "x": 24, "y": 8 },
                        { "thing": "StairsUp", "x": 56, "y": 8, "entrance": "Ground Floor Stairs", "transport": "Bedroom Stairs" },
                        { "thing": "Stool", "x": 16, "y": 32 },
                        { "thing": "Stool", "x": 16, "y": 40 },
                        { "thing": "Stool", "x": 40, "y": 32 },
                        { "thing": "Stool", "x": 40, "y": 40 },
                        { "thing": "Table3x3", "x": 24, "y": 32 },
                        { "thing": "FlowerVase", "x": 29, "y": 34 },
                        { "thing": "Mother", "x": 40, "y": 28 },
                        { "thing": "Doormat", "x": 16, "y": 56, "width": 16 }
                    ]
                }
            }
        }
    ])
};