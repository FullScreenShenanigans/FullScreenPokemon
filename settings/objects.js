(function () {
    FullScreenPokemon.prototype.settings.objects = {
        "onMake": "onMake",
        "indexMap": ["width", "height"],
        "doPropertiesFull": true,
        "inheritance": {
            "Quadrant": {},
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "Character": {
                    "Player": {},
                    "Lady": {},
                    "Fatty": {}
                },
                "Solid": {
                    "BedSingle": {},
                    "ComputerDesk": {},
                    "ConsoleAndController": {},
                    "InvisibleWall": {},
                    "PottedPalmTree": {},
                    "StairsDown": {},
                    "Table": {},
                    "TelevisionMonitor": {}
                },
                "Scenery": {
                    "WindowBlinds": {}
                },
                "Terrain": {
                    "FloorTiledDiagonal": {},
                    "TerrainSmall": {
                        "TerrainSmallRepeating": {
                            "WallIndoorHorizontalBands": {}
                        }
                    }
                }
            }
        },
        "properties": {
            "Quadrant": {
                "tolx": 0,
                "toly": 0
            },
            "Map": {
                "initialized": false
            },
            "Area": {
                "background": "black"
            },
            "Location": {
                "entry": "Normal"
            },
            "Thing": {
                // Sizing
                "width": 8,
                "height": 8,
                // Placement
                "alive": true,
                "placed": false,
                "maxquads": 4,
                // Sprites
                "sprite": "",
                "spriteType": "neither",
                "opacity": 1,
                // Triggered Functions
                "onMake": FullScreenPokemon.prototype.thingProcess,
            },
            "Character": {
                "groupType": "Character"
            },
            "Player": {
                "player": true
            },
            "Solid": {
                "groupType": "Solid"
            },
            "BedSingle": [8, 16],
            "ComputerDesk": [8, 16],
            "ConsoleController": [8, 5],
            "InvisibleWall": {
                "hidden": true
            },
            "PottedPalmTree": [8, 16],
            "Table": [16, 16],
            "Scenery": {
                "groupType": "Scenery"
            },
            "Terrain": {
                "groupType": "Terrain",
                "repeat": true
            },
            "TerrainSmall": [2, 2],
            "TerrainSmallRepeating": {
                "width": 8,
                "height": 8,
                "spritewidth": 2,
                "spriteheight": 2
            }
        }
    };
})();