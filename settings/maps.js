FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Pallet Town",
    "locationDefault": "Player's House Door",
    //"mapDefault": "Route 1",
    //"locationDefault": "Top Path",
    "groupTypes": ["Character", "Solid", "Scenery", "Terrain"],
    "requireEntrance": true,
    "screenAttributes": [],
    "screenVariables": {
        "boundaries": FullScreenPokemon.prototype.getAreaBoundariesReal,
        "scrollability": FullScreenPokemon.prototype.getScreenScrollability
    },
    "onSpawn": FullScreenPokemon.prototype.addPreThing,
    "macros": {
        "Checkered": FullScreenPokemon.prototype.macroCheckered,
        "Water": FullScreenPokemon.prototype.macroWater,
        "House": FullScreenPokemon.prototype.macroHouse,
        "HouseLarge": FullScreenPokemon.prototype.macroHouseLarge
    },
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
                "Player's House Door": {
                    "area": "Land"
                },
                "Rival's House Door": {
                    "area": "Land"
                },
                "Oak's Lab Door": {
                    "area": "Land"
                }
            },
            "locationDefault": "",
            "areas": {
                "Land": {
                    "borders": [
                        { "map": "Route 1", "location": "Land", "border": "top", "x": 0 }
                    ],
                    "creation": [
                        { "thing": "FenceWide", "width": 80 },
                        { "thing": "Grass", "x": 80, "width": 16 },
                        { "thing": "FenceWide", "x": 96, "width": 64 },
                        { "thing": "FenceWide", "y": 8, "height": 128 },
                        { "thing": "DirtMedium", "width": 160 },
                        { "thing": "DirtMedium", "y": 8, "width": 16, "height": 128 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 8, "xnum": 16, "ynum": 2, "offset": 1 },
                        { "thing": "DirtMedium", "x": 144, "y": 8, "height": 128, "width": 16 },
                        { "thing": "FenceWide", "x": 152, "y": 8, "height": 128 },
                        { "macro": "House", "x": 32, "y": 16, "stories": 2, "entrance": "Player's House Door", "transport": { "map": "Player's House", "location": "Ground Floor Door" } },
                        { "macro": "House", "x": 96, "y": 16, "stories": 2, "entrance": "Rival's House Door", "transport": { "map": "Rival's House", "location": "Ground Floor Door" } },
                        { "thing": "DirtLight", "x": 16, "y": 24, "width": 16, "height": 16 },
                        { "thing": "DirtLight", "x": 80, "y": 24, "width": 16, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 24, "xnum": 6, "ynum": 2 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 96, "y": 24, "xnum": 6, "ynum": 2 },
                        { "thing": "Sign", "x": 24, "y": 32, "text": "%%%%%%%PLAYER%%%%%%%'s house" },
                        { "thing": "Sign", "x": 88, "y": 32, "text": "%%%%%%%RIVAL%%%%%%%'s house" },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 40, "xnum": 16, "ynum": 2 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 56, "xnum": 2, "ynum": 6 },
                        { "thing": "DirtLight", "x": 32, "y": 56, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 56, "xnum": 2, "ynum": 6 },
                        { "macro": "HouseLarge", "x": 80, "y": 56, "width": 48, "height": 32, "stories": 2, "white": { "start": 84, "end": 96 }, "entrance": "Oak's Lab Door", "transport": { "map": "Oak's Lab", "location": "Ground Floor Door" } },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 80, "y": 56, "xnum": 8, "ynum": 4 },
                        { "thing": "FenceVertical", "x": 32, "y": 64, "width": 24 },
                        { "thing": "Sign", "x": 56, "y": 64, "text": ["Palette Town", "Shades of your journey await!"] },
                        { "thing": "DirtMedium", "x": 32, "y": 72, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 32, "y": 76, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 88, "xnum": 4, "ynum": 2 },
                        { "thing": "DirtLight", "x": 80, "y": 88, "width": 64, "height": 16 },
                        { "thing": "FenceVertical", "x": 80, "y": 96, "width": 24 },
                        { "thing": "Sign", "x": 104, "y": 96 },
                        { "thing": "FenceVertical", "x": 112, "y": 96, "width": 16 },
                        { "thing": "DirtMedium", "x": 16, "y": 104, "width": 16, "height": 32 },
                        { "macro": "Water", "x": 32, "y": 104, "width": 32, "height": 32, "open": [false, false, true, false] },
                        { "thing": "DirtLight", "x": 64, "y": 104, "width": 16, "height": 32 },
                        { "thing": "DirtMedium", "x": 80, "y": 104, "width": 48, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 80, "y": 108, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtLight", "x": 128, "y": 104, "width": 16, "height": 32 },
                        { "thing": "DirtLight", "x": 80, "y": 120, "width": 48, "height": 16 },
                        { "thing": "FenceWide", "x": 64, "y": 128, "width": 88 },

                        { "thing": "FenceWide", "x": 8, "y": 128 }
                    ]
                }
            }
        }, {
            "name": "Player's House",
            "locations": {
                "Ground Floor Stairs": {
                    "area": "Ground Floor"
                },
                "Ground Floor Door": {
                    "area": "Ground Floor"
                },
                "Start Game": {
                    "area": "Bedroom",
                    "xloc": 24,
                    "yloc": 40
                },
                "Bedroom Stairs": {
                    "area": "Bedroom"
                }
            },
            "locationDefault": "Ground Floor Door",
            "areas": {
                "Ground Floor": {
                    "invisibleWallBorders": true,
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
                        { "thing": "Table2x3", "x": 24, "y": 32 },
                        { "thing": "Stool", "x": 16, "y": 32 },
                        { "thing": "Stool", "x": 16, "y": 40 },
                        { "thing": "Stool", "x": 40, "y": 32 },
                        { "thing": "Stool", "x": 40, "y": 40 },
                        { "thing": "FlowerVase", "x": 29, "y": 34 },
                        { "thing": "Mother", "x": 40, "y": 32 },
                        { "thing": "DoormatDotted", "x": 16, "y": 56, "width": 16, "entrance": "Ground Floor Door" },
                        { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "map": "Pallet Town", "location": "Player's House Door" }, "requireDirection": 2 }
                    ]
                },
                "Bedroom": {
                    "invisibleWallBorders": true,
                    "creation": [
                        { "thing": "WallIndoorHorizontalBands", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                        { "thing": "ComputerDesk" },
                        { "thing": "Table2x2", "x": 8 },
                        { "thing": "StairsDown", "x": 56, "y": 8, "entrance": "Bedroom Stairs", "transport": "Ground Floor Stairs" },
                        { "thing": "WindowBlinds", "x": 40 },
                        { "thing": "WindowBlinds", "x": 56 },
                        { "thing": "ConsoleAndController", "x": 24, "y": 32 },
                        { "thing": "TelevisionMonitor", "x": 24, "y": 24 },
                        { "thing": "BedSingle", "y": 48 },
                        { "thing": "PottedPalmTree", "x": 48, "y": 48 }
                    ]
                }
            }
        }, {
            "name": "Rival's House",
            "locations": {
                "Ground Floor Door": {
                    "area": "Ground Floor"
                }
            },
            "locationDefault": "Ground Floor Door",
            "areas": {
                "Ground Floor": {
                    "invisibleWallBorders": true,
                    "creation": [
                        { "thing": "WallIndoorHorizontalBands", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                        { "thing": "Cabinet", "width": 16 },
                        { "thing": "Painting", "x": 24 },
                        { "thing": "Window", "x": 40 },
                        { "thing": "Bookshelf", "x": 56 },
                        { "thing": "Table2x3", "x": 24, "y": 24 },
                        { "thing": "Book", "x": 24, "y": 24 },
                        { "thing": "RivalMother", "x": 16, "y": 24 },
                        { "thing": "Stool", "x": 16, "y": 24 },
                        { "thing": "Stool", "x": 16, "y": 32 },
                        { "thing": "Stool", "x": 40, "y": 24 },
                        { "thing": "Stool", "x": 40, "y": 32 },
                        { "thing": "PottedPalmTree", "y": 48 },
                        { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                        { "thing": "DoormatDotted", "x": 16, "y": 56, "width": 16, "entrance": "Ground Floor Door" },
                        { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "map": "Pallet Town", "location": "Rival's House Door" }, "requireDirection": 2 }
                    ]
                }
            }
        }, {
            "name": "Oak's Lab",
            "locations": {
                "Ground Floor Door": {
                    "area": "Ground Floor"
                }
            },
            "locationDefault": "Ground Floor Door",
            "areas": {
                "Ground Floor": {
                    "invisibleWallBorders": true,
                    "creation": [
                        { "thing": "WallIndoorLightWithDarkBottom", "width": 64 },
                        { "thing": "InvisibleWall", "width": 64 },
                        { "thing": "Table2x2", "y": 4, "width": 32 },
                        { "thing": "LabComputer", "y": 8 },
                        { "thing": "Book", "x": 16, "y": 8 },
                        { "thing": "FloorLinedHorizontal", "y": 8, "width": 80, "height": 88 },
                        { "thing": "AsianScroll", "x": 32 },
                        { "thing": "Table3x1", "x": 48, "y": 24 },
                        { "thing": "Pokeball", "x": 48, "y": 24 },
                        { "thing": "Pokeball", "x": 56, "y": 24 },
                        { "thing": "Pokeball", "x": 64, "y": 24 },
                        { "thing": "Bookshelf", "x": 48, "width": 32 },
                        { "thing": "Bookshelf", "y": 48, "width": 32 },
                        { "thing": "Bookshelf", "x": 48, "y": 48, "width": 32 },
                        { "thing": "Doormat", "x": 32, "y": 88, "width": 16, "entrance": "Ground Floor Door" },
                        { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "map": "Pallet Town", "location": "Oak's Lab Door" }, "requireDirection": 2 }
                    ]
                }
            }
        }, {
            "name": "Route 1",
            "locations": {
                "Bottom Path": {
                    "area": "Land"
                },
                "Top Path": {
                    "area": "Land"
                }
            },
            "areas": {
                "Land": {
                    "creation": [
                        { "thing": "Grass", "width": 48, "height": 288 },
                        { "thing": "FloorLinedHorizontal", "width": 48, "width": 224, "height": 288 },
                        { "thing": "Grass", "x": 272, "width": 48, "height": 288 }
                    ]
                }
            }
        }
    ])
};