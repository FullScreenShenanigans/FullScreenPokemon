FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Blank",
    "locationDefault": "Black",
    "groupTypes": ["Text", "Character", "Solid", "Scenery", "Terrain"],
    "requireEntrance": true,
    "screenAttributes": [],
    "screenVariables": {
        "boundaries": FullScreenPokemon.prototype.getAreaBoundariesReal,
        "scrollability": FullScreenPokemon.prototype.getScreenScrollability,
        "thingsById": FullScreenPokemon.prototype.generateThingsByIdContainer
    },
    "onSpawn": FullScreenPokemon.prototype.addPreThing,
    "macros": {
        "Checkered": FullScreenPokemon.prototype.macroCheckered,
        "Water": FullScreenPokemon.prototype.macroWater,
        "House": FullScreenPokemon.prototype.macroHouse,
        "HouseLarge": FullScreenPokemon.prototype.macroHouseLarge,
        "Building": FullScreenPokemon.prototype.macroBuilding,
        "Gym": FullScreenPokemon.prototype.macroGym,
        "Mountain": FullScreenPokemon.prototype.macroMountain
    },
    "entrances": {
        "Blank": FullScreenPokemon.prototype.mapEntranceBlank,
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
            "name": "Blank",
            "locations": {
                "Black": {
                    "area": "Black",
                    "entry": "Blank"
                },
                "White": {
                    "area": "White",
                    "entry": "Blank"
                }
            },
            "locationDefault": "Black",
            "areas": {
                "Black": {
                    "creation": []
                },
                "White": {
                    "background": "white",
                    "creation": []
                }
            }
        }, {
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
            "locationDefault": "Player's House Door",
            "areas": {
                "Land": {
                    "width": 152,
                    "height": 136,
                    "wildPokemon": {
                        "grass": [{
                            "title": "Pidgey",
                            "levels": [2, 3, 4, 5],
                            "rate": .55
                        }, {
                            "title": "Rattata",
                            "levels": [2, 3, 4],
                            "rate": .45
                        }]
                    },
                    "creation": [
                        { "thing": "AreaSpawner", "width": 152, "height": 136, "map": "Route 1", "area": "Land", "direction": 0 },
                        { "thing": "FenceWide", "width": 80 },
                        { "thing": "Grass", "x": 80, "width": 16 },
                        { "thing": "CutsceneTriggerer", "x": 80, "width": 16, "cutscene": "OakIntro", "singleUse": true, "requireOverlap": true },
                        { "thing": "FenceWide", "x": 96, "width": 64 },
                        { "thing": "FenceWide", "y": 8, "height": 128 },
                        { "thing": "DirtMedium", "width": 160 },
                        { "thing": "DirtMedium", "y": 8, "width": 16, "height": 128 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 8, "xnum": 16, "ynum": 2, "offset": 1 },
                        { "thing": "DirtMedium", "x": 144, "y": 8, "height": 128, "width": 16 },
                        { "thing": "FenceWide", "x": 152, "y": 8, "height": 128 },
                        { "macro": "House", "x": 32, "y": 16, "stories": 2, "door": true, "entrance": "Player's House Door", "transport": { "map": "Player's House", "location": "Ground Floor Door" } },
                        { "macro": "House", "x": 96, "y": 16, "stories": 2, "door": true, "entrance": "Rival's House Door", "transport": { "map": "Rival's House", "location": "Ground Floor Door" } },
                        { "thing": "DirtLight", "x": 16, "y": 24, "width": 16, "height": 16 },
                        { "thing": "DirtLight", "x": 80, "y": 24, "width": 16, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 24, "xnum": 6, "ynum": 2 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 96, "y": 24, "xnum": 6, "ynum": 2 },
                        { "thing": "Sign", "x": 24, "y": 32, "dialog": "%%%%%%%PLAYER%%%%%%%'s house" },
                        { "thing": "Sign", "x": 88, "y": 32, "dialog": "%%%%%%%RIVAL%%%%%%%'s house" },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 40, "xnum": 16, "ynum": 2 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 56, "xnum": 2, "ynum": 6 },
                        { "thing": "Lady", "x": 24, "y": 56, "roaming": true, "dialog": ["I'm raising %%%%%%%POKEMON%%%%%%% too!", "When they get strong, they can protect me!"] },
                        { "thing": "DirtLight", "x": 32, "y": 56, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 56, "xnum": 2, "ynum": 6 },
                        { "macro": "HouseLarge", "x": 80, "y": 56, "width": 48, "height": 32, "door": true, "stories": 2, "white": { "start": 84, "end": 96 }, "id": "Oak's Lab Door", "entrance": "Oak's Lab Door", "transport": { "map": "Oak's Lab", "location": "Ground Floor Door" } },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 80, "y": 56, "xnum": 8, "ynum": 4 },
                        { "thing": "FenceVertical", "x": 32, "y": 64, "width": 24 },
                        { "thing": "Sign", "x": 56, "y": 64, "dialog": "PALLET TOWN \n Shades of your journey await!" },
                        { "thing": "DirtMedium", "x": 32, "y": 72, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 32, "y": 76, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 88, "xnum": 4, "ynum": 2 },
                        { "thing": "DirtLight", "x": 80, "y": 88, "width": 64, "height": 16 },
                        { "thing": "FenceVertical", "x": 80, "y": 96, "width": 24 },
                        { "thing": "Sign", "x": 104, "y": 96, "dialog": "Oak %%%%%%%POKEMON%%%%%%% Research Lab" },
                        { "thing": "FenceVertical", "x": 112, "y": 96, "width": 16 },
                        { "thing": "DirtMedium", "x": 16, "y": 104, "width": 16, "height": 32 },
                        { "macro": "Water", "x": 32, "y": 104, "width": 32, "height": 32, "open": [false, false, true, false] },
                        { "thing": "DirtLight", "x": 64, "y": 104, "width": 16, "height": 32 },
                        { "thing": "DirtMedium", "x": 80, "y": 104, "width": 48, "height": 16 },
                        { "thing": "Fatty", "x": 88, "y": 104, "roaming": true, "dialog": ["Technology is incredible!", "You can now store and recall items and %%%%%%%POKEMON%%%%%%% as data via PC!"] },
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
                    "yloc": 40,
                    "direction": 0
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
                        { "thing": "TelevisionMonitor", "x": 24, "y": 8, "dialogDirections": true, "dialog": ["Oops, wrong side.", "Oops, wrong side.", ["There's a movie on TV. Four boys are walking on railroad tracks.", "I better go too."], "Oops, wrong side."] },
                        { "thing": "StairsUp", "x": 56, "y": 8, "entrance": "Ground Floor Stairs", "transport": "Bedroom Stairs" },
                        { "thing": "Table2x3", "x": 24, "y": 32 },
                        { "thing": "Stool", "x": 16, "y": 32 },
                        { "thing": "Stool", "x": 16, "y": 40 },
                        { "thing": "Stool", "x": 40, "y": 32 },
                        { "thing": "Stool", "x": 40, "y": 40 },
                        { "thing": "FlowerVase", "x": 29, "y": 34 },
                        { "thing": "Mother", "x": 40, "y": 32, "direction": 3, "dialog": ["MOM: %%%%%%%PLAYER%%%%%%%! You and your %%%%%%%POKEMON%%%%%%% should take a quick rest."] },
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
                        { "thing": "ConsoleAndController", "x": 24, "y": 32, "dialog": "%%%%%%%PLAYER%%%%%%% is playing the SNES! ...Okay! It's time to go!" },
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
                        { "thing": "Painting", "x": 24, "dialog": "A TOWN MAP (do town map action)" },
                        { "thing": "Window", "x": 40 },
                        { "thing": "Bookshelf", "x": 56 },
                        { "thing": "Table2x3", "x": 24, "y": 24 },
                        { "thing": "Book", "x": 24, "y": 24, "dialog": "It's a big map! This is useful!" },
                        { "thing": "RivalMother", "x": 16, "y": 24, "dialog": "This is dynamic!" },
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
                    "area": "Ground Floor",
                    "routine": "WalkToTable"
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
                        { "thing": "Book", "x": 16, "y": 8, "width": 16 },
                        { "thing": "FloorLinedHorizontal", "y": 8, "width": 80, "height": 88 },
                        { "thing": "AsianScroll", "x": 32, "dialog": "Push START to open the MENU!" },
                        { "thing": "AsianScroll", "x": 40, "dialog": "The SAVE option is on the MENU screen." },
                        { "thing": "Oak", "x": 40, "y": 16, "id": "Oak", "hidden": true }, 
                        { "thing": "Rival", "x": 32, "y": 24, "id": "Rival" },
                        { "thing": "Table3x1", "x": 48, "y": 24 },
                        { "thing": "Pokeball", "x": 48, "y": 24, "id": "PokeballCharmander", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": "Charmander", "description": "fire" },
                        { "thing": "Pokeball", "x": 56, "y": 24, "id": "PokeballSquirtle", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": "Squirtle", "description": "water" },
                        { "thing": "Pokeball", "x": 64, "y": 24, "id": "PokeballBulbasaur", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": "Bulbasaur", "description": "plant" },
                        { "thing": "Bookshelf", "x": 48, "width": 32 },
                        { "thing": "Bookshelf", "y": 48, "width": 32 },
                        { "thing": "Bookshelf", "x": 48, "y": 48, "width": 32 },
                        { "thing": "MenuTriggerer", "x": 32, "y": 56, "width": 32, "id": "OakBlocker", "dialog": ["OAK: Hey! Don't go away yet!"], "pushDirection": 0, "pushSteps": [1], "keepAlive": true, "nocollide": true },
                        { "thing": "CutsceneTriggerer", "x": 32, "y": 56, "width": 32, "id": "RivalBlocker", "cutscene": "OakIntroRivalBattle", "routine": "Challenge", "nocollide": true },
                        { "thing": "Doormat", "x": 32, "y": 88 },
                        { "thing": "Doormat", "x": 40, "y": 88, "entrance": "Ground Floor Door" },
                        { "thing": "HiddenTransporter", "x": 40, "y": 88, "width": 16, "transport": { "map": "Pallet Town", "location": "Oak's Lab Door" }, "requireDirection": 2 },
                    ]
                }
            }
        }, {
            "name": "Route 1",
            "locations": {
                "Top Path": {
                    "area": "Land",
                    "xloc": 80,
                },
                "Bottom Path": {
                    "area": "Land",
                    "xloc": 80,
                    "yloc": 288
                }
            },
            "areas": {
                "Land": {
                    "width": 160,
                    "height": 296,
                    "wildPokemon": {
                        "grass": [{
                            "title": "Pidgey",
                            "levels": [2, 3, 4, 5],
                            "rate": .55
                        }, {
                            "title": "Rattata",
                            "levels": [2, 3, 4],
                            "rate": .45
                        }]
                    },
                    "creation": [
                        { "thing": "AreaSpawner", "width": 160, "map": "Viridian City", "area": "Land", "direction": 0, "offsetX": -80 },
                        { "thing": "DirtMedium", "width": 32, "height": 296 },
                        { "thing": "FenceWide", "x": 24, "height": 48 },
                        { "thing": "DirtMedium", "x": 24, "width": 56, "height": 80 },
                        { "thing": "FenceWide", "x": 72 },
                        { "thing": "DirtLight", "x": 80, "width": 16, "height": 32 },
                        { "thing": "FenceWide", "x": 96 },
                        { "thing": "DirtMedium", "x": 96, "width": 48, "height": 32 },
                        { "thing": "DirtMedium", "x": 144, "width": 16, "height": 296 },
                        { "thing": "FenceWide", "x": 144, "height": 48 },
                        { "thing": "FenceWide", "x": 32, "y": 8, "width": 48 },
                        { "thing": "FenceWide", "x": 96, "y": 8, "width": 48 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 20, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtLight", "x": 80, "y": 32, "width": 64, "height": 16 },
                        { "thing": "PlantSmall", "x": 72, "y": 32, "height": 48 },
                        { "thing": "Ledge", "x": 32, "y": 44, "width": 40, "crumbleRight": true },
                        { "thing": "Ledge", "x": 80, "y": 44, "width": 32, "jagged": true },
                        { "thing": "PlantSmall", "x": 24, "y": 48, "height": 64 },
                        { "thing": "DirtMedium", "x": 80, "y": 48, "width": 64, "height": 32 },
                        { "thing": "Grass", "x": 80, "y": 48, "width": 64, "height": 32 },
                        { "thing": "PlantSmall", "x": 144, "y": 48, "height": 64 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 32, "y": 52, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "Ledge", "x": 32, "y": 76, "width": 40, "crumbleRight": true },
                        { "thing": "DirtMedium", "x": 32, "y": 80, "width": 64, "height": 48 },
                        { "thing": "DirtLight", "x": 96, "y": 80, "width": 48, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 48, "y": 84, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 96, "y": 96, "xnum": 2, "ynum": 2 },
                        { "thing": "DirtMedium", "x": 112, "y": 96, "width": 32, "height": 48 },
                        { "thing": "Grass", "x": 112, "y": 96, "width": 32, "height": 32 },
                        { "thing": "PlantSmall", "x": 32, "y": 104, "width": 16 },
                        { "thing": "PlantSmall", "x": 80, "y": 104, "width": 32 },
                        { "thing": "Ledge", "x": 48, "y": 108, "width": 32 },
                        { "thing": "FenceWide", "x": 24, "y": 112, "height": 112 },
                        { "thing": "FenceWide", "x": 144, "y": 112, "height": 112 },
                        { "thing": "DirtLight", "x": 96, "y": 112, "width": 16, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 116, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtMedium", "x": 32, "y": 128, "width": 16, "height": 48 },
                        { "thing": "DirtLight", "x": 48, "y": 128, "width": 64, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 112, "y": 132, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtLight", "x": 48, "y": 144, "width": 16, "height": 16 },
                        { "thing": "DirtMedium", "x": 64, "y": 144, "width": 80, "height": 16 },
                        { "thing": "Ledge", "x": 32, "y": 156, "width": 8 },
                        { "thing": "LedgeOpening", "x": 40, "y": 156, "width": 8 },
                        { "thing": "Ledge", "x": 48, "y": 156, "width": 24, "crumbleLeft": true, "crumbleRight": true },
                        { "thing": "LedgeOpening", "x": 72, "y": 156, "width": 8 },
                        { "thing": "Ledge", "x": 80, "y": 156, "width": 64 },
                        { "thing": "DirtLight", "x": 48, "y": 160, "width": 96, "height": 16 },
                        { "thing": "DirtMedium", "x": 32, "y": 176, "width": 96, "height": 32 },
                        { "thing": "Grass", "x": 96, "y": 176, "width": 32, "height": 32 },
                        { "thing": "DirtLight", "x": 128, "y": 176, "width": 16, "height": 32 },
                        { "thing": "PlantSmall", "x": 32, "y": 184, "width": 64 },
                        { "thing": "Ledge", "x": 128, "y": 188, "width": 16, "jagged": true },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 196, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtLight", "x": 32, "y": 208, "width": 112, "height": 16 },
                        { "thing": "Sign", "x": 72, "y": 216 },
                        { "thing": "Ledge", "x": 32, "y": 220, "width": 16, "jagged": true },
                        { "thing": "Ledge", "x": 80, "y": 220, "width": 64, "jagged": true },
                        { "thing": "PlantSmall", "x": 24, "y": 224, "height": 64 },
                        { "thing": "DirtMedium", "x": 32, "y": 224, "width": 48, "height": 72 },
                        { "thing": "Grass", "x": 48, "y": 224, "width": 32, "height": 16 },
                        { "thing": "DirtLight", "x": 80, "y": 224, "width": 16, "height": 40 },
                        { "thing": "DirtMedium", "x": 96, "y": 224, "width": 48, "height": 72 },
                        { "thing": "Grass", "x": 112, "y": 224, "width": 32, "height": 16 },
                        { "thing": "PlantSmall", "x": 144, "y": 224, "height": 64 },
                        { "thing": "Grass", "x": 32, "y": 240, "width": 32, "height": 16 },
                        { "thing": "Grass", "x": 96, "y": 240, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 244, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 244, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "FenceWide", "x": 32, "y": 256, "width": 48 },
                        { "thing": "DirtMedium", "x": 80, "y": 256, "width": 16, "height": 40 },
                        { "thing": "Grass", "x": 80, "y": 256, "width": 16, "height": 40 },
                        { "thing": "FenceWide", "x": 96, "y": 256, "width": 48 },
                        { "thing": "FenceWide", "x": 72, "y": 264, "height": 32 },
                        { "thing": "FenceWide", "x": 96, "y": 264, "height": 32 },
                        { "thing": "FenceWide", "x": 24, "y": 288 },
                        { "thing": "FenceWide", "x": 144, "y": 288 },
                        { "thing": "AreaSpawner", "y": 288, "width": 160, "map": "Pallet Town", "area": "Land", "direction": 2 }
                    ]
                }
            }
        }, {
            "name": "Viridian City",
            "locations": {
                "Temp": {
                    "area": "Land",
                    "xloc": 200,
                    "yloc": 140
                }
            },
            "areas": {
                "Land": {
                    "width": 320,
                    "height": 288,
                    "creation": [
                        { "macro": "Mountain", "width": 48, "height": 112, "bottom": true, "right": true },
                        { "thing": "DirtMedium", "x": 48, "width": 80, "height": 144 },
                        { "thing": "PlantSmall", "x": 48, "width": 80, "height": 32 },
                        { "thing": "DirtWhite", "x": 128, "width": 16, "height": 32 },
                        { "thing": "FenceVertical", "x": 128, "width": 8, "height": 32 },
                        { "thing": "DirtLight", "x": 144, "width": 16, "height": 16 },
                        { "thing": "DirtMedium", "x": 160, "width": 128, "height": 16 },
                        { "thing": "PlantSmall", "x": 160, "width": 32, "height": 32 },
                        { "thing": "PlantSmall", "x": 192, "width": 96, "height": 16 },
                        { "thing": "DirtMedium", "x": 288, "width": 32, "height": 256 },
                        { "thing": "PlantSmall", "x": 288, "width": 32, "height": 256 },
                        { "thing": "Sign", "x": 152, "y": 8 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 16, "xnum": 2, "ynum": 2 },
                        { "thing": "DirtMedium", "x": 160, "y": 16, "width": 32, "height": 16 },
                        { "thing": "DirtLight", "x": 192, "y": 16, "width": 96, "height": 16 },
                        { "thing": "Tree", "x": 112, "y": 32 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 32, "xnum": 6, "ynum": 2 },
                        { "thing": "DirtLight", "x": 176, "y": 32, "width": 48, "height": 48 },
                        { "thing": "DirtLight", "x": 224, "y": 32, "width": 48, "height": 32 },
                        { "macro": "Gym", "x": 224, "y": 32 },
                        { "thing": "DirtLight", "x": 272, "y": 32, "width": 16, "height": 64 },
                        { "thing": "FenceWide", "x": 64, "y": 40, "width": 48 },
                        { "thing": "PlantSmall", "x": 112, "y": 40, "width": 16 },
                        { "thing": "FenceWide", "x": 56, "y": 48, "height": 80 },
                        { "thing": "PlantSmall", "x": 64, "y": 48, "width": 64, "height": 88 },
                        { "thing": "DirtWhite", "x": 128, "y": 48, "width": 16, "height": 80 },
                        { "thing": "FenceVertical", "x": 128, "y": 48, "width": 8, "height": 80 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 48, "xnum": 2, "ynum": 12 },
                        { "thing": "DirtWhite", "x": 160, "y": 48, "width": 16, "height": 32 },
                        { "thing": "FenceVertical", "x": 160, "y": 48, "width": 8, "height": 16 },
                        { "thing": "Sign", "x": 216, "y": 56, "dialog": "NOPE" },
                        { "macro": "House", "x": 160, "y": 64, "door": true },
                        { "thing": "DirtMedium", "x": 224, "y": 64, "width": 48, "height": 16 },
                        { "thing": "Ledge", "x": 192, "y": 76, "width": 32, "jagged": true },
                        { "thing": "Ledge", "x": 224, "y": 76, "width": 48 },
                        { "thing": "Ledge", "x": 272, "y": 76, "width": 16, "jagged": true },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 80, "xnum": 14, "ynum": 2 },
                        { "thing": "DirtLight", "x": 160, "y": 96, "width": 128, "height": 16 },
                        { "thing": "FenceVertical", "x": 160, "y": 104, "width": 128, "height": 8 },
                        { "thing": "DirtMedium", "y": 112, "width": 56, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 112, "xnum": 16, "ynum": 2 },
                        { "macro": "House", "x": 160, "y": 112, "door": true },
                        { "thing": "DirtLight", "y": 128, "width": 16, "height": 24 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 128, "xnum": 4, "ynum": 2 },
                        { "thing": "DirtLight", "x": 128, "y": 128, "width": 16, "height": 16 },
                        { "thing": "DirtLight", "x": 160, "y": 128, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 128, "xnum": 2, "ynum": 4 },
                        { "thing": "DirtMedium", "x": 208, "y": 128, "width": 64, "height": 32 },
                        { "macro": "Building", "x": 224, "y": 128, "door": true, "label": "Mart" },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 128, "xnum": 2, "ynum": 4 },
                        { "thing": "Sign", "x": 136, "y": 136 },
                        { "thing": "FenceVertical", "x": 160, "y": 136, "width": 32 },
                        { "macro": "Mountain", "y": 144, "width": 32, "height": 80, "top": true, "right": true, "bottom": true },
                        { "thing": "DirtLight", "x": 24, "y": 144 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 144, "xnum": 2, "ynum": 8 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 144, "xnum": 14, "ynum": 2 },
                        { "thing": "DirtMedium", "x": 160, "y": 144, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 160, "y": 148, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtMedium", "x": 48, "y": 160, "width": 80, "height": 32 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 160, "xnum": 20, "ynum": 2 },
                        { "thing": "PlantSmall", "x": 32, "y": 168, "width": 32 },
                        { "thing": "Tree", "x": 64, "y": 176 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 176, "xnum": 2, "ynum": 4 },
                        { "thing": "DirtMedium", "x": 144, "y": 176, "width": 16, "height": 64 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 176, "xnum": 8, "ynum": 4 },
                        { "macro": "Building", "x": 176, "y": 176, "door": true, "label": "Poke" },
                        { "thing": "DirtMedium", "x": 224, "y": 176, "width": 48, "height": 32 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 176, "xnum": 2, "ynum": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 80, "y": 180, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 144, "y": 180, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 224, "y": 180, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "PlantSmall", "x": 64, "y": 184, "width": 16 },
                        { "thing": "DirtMedium", "x": 48, "y": 192, "width": 16, "height": 32 },
                        { "macro": "Water", "x": 64, "y": 192, "width": 48, "height": 32, "open": [false, false, true, false] },
                        { "thing": "DirtMedium", "x": 112, "y": 192, "width": 16, "height": 32 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 256, "y": 196, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "DirtLight", "x": 32, "y": 208, "width": 16, "height": 16 },
                        { "thing": "DirtLight", "x": 128, "y": 208, "width": 16, "height": 16 },
                        { "thing": "DirtLight", "x": 160, "y": 208, "width": 128, "height": 16 },
                        { "thing": "Ledge", "x": 32, "y": 220, "width": 32, "crumbleLeft": true },
                        { "thing": "Ledge", "x": 112, "y": 220, "crumbleRight": true },
                        { "thing": "LedgeOpening", "x": 120, "y": 220 },
                        { "thing": "Ledge", "x": 128, "y": 220, "width": 24, "crumbleLeft": true, "crumbleRight": true },
                        { "thing": "LedgeOpening", "x": 152, "y": 220 },
                        { "thing": "Ledge", "x": 160, "y": 220, "width": 128, "jagged": true },
                        { "thing": "DirtMedium", "y": 224, "width": 32, "height": 64 },
                        { "thing": "FenceWide", "x": 24, "y": 224, "height": 32 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 224, "xnum": 2, "ynum": 2 },
                        { "thing": "DirtMedium", "x": 48, "y": 224, "width": 80, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 224, "xnum": 2, "ynum": 2 },
                        { "thing": "DirtLight", "x": 160, "y": 224, "width": 16, "height": 16 },
                        { "thing": "DirtMedium", "x": 176, "y": 224, "width": 48, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 224, "y": 224, "xnum": 2, "ynum": 2 },
                        { "thing": "DirtMedium", "x": 240, "y": 224, "width": 32, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 224, "xnum": 2, "ynum": 2 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 48, "y": 228, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 192, "y": 228, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "macro": "Checkered", "things": ["", "Flower"], "x": 240, "y": 228, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                        { "thing": "Sign", "x": 168, "y": 232 },
                        { "thing": "DirtLight", "x": 32, "y": 240, "width": 128, "height": 16 },
                        { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 240, "xnum": 2, "ynum": 6 },
                        { "thing": "DirtLight", "x": 176, "y": 240, "width": 112, "height": 16 },
                        { "thing": "FenceVertical", "x": 32, "y": 248, "width": 128 },
                        { "thing": "FenceVertical", "x": 176, "y": 248, "width": 112 },
                        { "thing": "DirtMedium", "x": 32, "y": 256, "width": 128, "height": 32 },
                        { "thing": "DirtMedium", "x": 176, "y": 256, "width": 144, "height": 32 },
                        { "thing": "FenceWide", "x": 104, "y": 256, "height": 32 },
                        { "thing": "FenceWide", "x": 152, "y": 256, "height": 32 },
                        { "thing": "FenceWide", "x": 176, "y": 256, "height": 32 },
                        { "thing": "FenceWide", "x": 224, "y": 256, "height": 32 },
                        { "thing": "AreaSpawner", "y": 280, "width": 320, "map": "Route 1", "area": "Land", "offsetX": 80 },
                    ]
                }
            }
        }
    ])
};