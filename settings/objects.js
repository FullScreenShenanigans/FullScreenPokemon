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
                    "Mother": {},
                    "Player": {}
                },
                "Solid": {
                    "BedSingle": {},
                    "Bookshelf": {},
                    "ComputerDesk": {},
                    "ConsoleAndController": {},
                    "FenceWide": {},
                    "FenceVertical": {},
                    "Grass": {},
                    "House": {},
                    "InvisibleWall": {},
                    "Lab": {},
                    "PottedPalmTree": {},
                    "Sign": {},
                    "Table3x2": {},
                    "Table3x3": {},
                    "TelevisionMonitor": {},
                    "Transporter": {
                        "StairsDown": {},
                        "StairsUp": {}
                    }
                },
                "Scenery": {
                    "Doormat": {},
                    "Flower": {},
                    "FlowerVase": {},
                    "Stool": {},
                    "WindowBlinds": {}
                },
                "Terrain": {
                    "DirtClean": {},
                    "DirtLight": {},
                    "DirtMedium": {},
                    "DirtWhite": {},
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
                "background": "black",
                "afters": [
                    { "thing": "InvisibleWall", "noBoundaryStretch": true },
                    { "thing": "InvisibleWall", "noBoundaryStretch": true },
                    { "thing": "InvisibleWall", "noBoundaryStretch": true },
                    { "thing": "InvisibleWall", "noBoundaryStretch": true }
                ]
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
                // Movements
                "direction": 2, // top,right,bottom,left is 0,1,2,3
                "direction": 2,
                "movement": undefined,
                // Triggered Functions
                "onMake": FullScreenPokemon.prototype.thingProcess,
            },
            "Character": {
                "groupType": "Character",
                "speed": FullScreenPokemon.unitsize / 2,
                "isWalking": false,
                "shouldWalk": false,
                "onWalkingStart": FullScreenPokemon.prototype.animateCharacterStartWalking,
                "onWalkingStop": FullScreenPokemon.prototype.animateCharacterStopWalking
            },
            "Player": {
                "player": true,
                "canKeyWalking": true,
                "onWalkingStart": FullScreenPokemon.prototype.animatePlayerStartWalking,
                "onWalkingStop": FullScreenPokemon.prototype.animatePlayerStopWalking,
                "getKeys": function () {
                    return {
                        "0": false,
                        "1": false,
                        "2": false,
                        "3": false,
                        "a": false,
                        "b": false
                    };
                }
            },
            "Solid": {
                "groupType": "Solid",
                "repeat": true
            },
            "BedSingle": [8, 16],
            "Bookshelf": [8, 16],
            "ComputerDesk": [8, 16],
            "ConsoleController": [8, 5],
            "FenceVertical": [4, 8],
            "House": [32, 24],
            "InvisibleWall": {
                "hidden": true
            },
            "Lab": [48, 32],
            "PottedPalmTree": [8, 16],
            "Table3x2": [16, 16],
            "Table3x3": [16, 16],
            "Transporter": {
                "collide": FullScreenPokemon.prototype.collideTransporter,
                "activate": FullScreenPokemon.prototype.activateTransporter,
                "activated": false
            },
            "Scenery": {
                "groupType": "Scenery",
                "repeat": true
            },
            "Flower": {
                "width": 4,
                "height": 4,
                "spriteCycle": [
                    ["one", "one", "two", "three"], "waving", 14
                ]
            },
            "FlowerVase": [6, 6],
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