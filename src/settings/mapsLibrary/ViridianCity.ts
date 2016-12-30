import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const ViridianCity: IMapRaw = {
    "name": "Viridian City",
    "theme": "Pewter City",
    "locationDefault": "PokeCenter Outside Door",
    "locations": {
        "Nicknamer House Front Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "School Front Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "PokeCenter Outside Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "PokeMart Outside Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Nicknamer House Floor 1 Door": {
            "area": "Nicknamer House"
        },
        "School Floor 1 Door": {
            "area": "School"
        },
        "PokeCenter Inside Door": {
            "area": "PokeCenter"
        },
        "PokeMart Inside Door": {
            "area": "PokeMart"
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 1280,
            "height": 1152,
            "wildPokemon": {
                "fishing": {
                    "old": [{
                        "title": "MAGIKARP".split(""),
                        "levels": [20],
                        "rate": 1
                    }],
                    "good": [{
                        "title": "POLIWAG".split(""),
                        "levels": [10],
                        "rate": .5
                    }, {
                        "title": "GOLDEEN".split(""),
                        "levels": [10],
                        "rate": .5
                    }],
                    "super": [{
                        "title": "POLIWAG".split(""),
                        "levels": [20],
                        "rate": .5
                    }, {
                        "title": "TENTACOOL".split(""),
                        "levels": [20],
                        "rate": .5
                    }]
                }
            },
            "creation": [
                { "thing": "AreaSpawner", "width": 1280, "map": "Route 2", "area": "Land", "direction": 0, "offsetX": 192 },
                { "thing": "AreaSpawner", "height": 1152, "map": "Route 22", "area": "Land", "direction": 3, "offsetY": 256 },
                { "macro": "Mountain", "width": 192, "height": 448, "bottom": true, "right": true },
                { "thing": "DirtMedium", "x": 192, "width": 320, "height": 576 },
                { "thing": "PlantSmall", "x": 192, "width": 320, "height": 128 },
                { "thing": "DirtWhite", "x": 512, "width": 64, "height": 128 },
                { "thing": "FenceVertical", "x": 512, "width": 32, "height": 128 },
                { "thing": "ThemePlayer", "x": 544, "width": 96, "theme": "Pewter City" },
                { "thing": "DirtLight", "x": 576, "width": 64, "height": 64 },
                { "thing": "DirtMedium", "x": 640, "width": 512, "height": 64 },
                { "thing": "PlantSmall", "x": 640, "width": 128, "height": 128 },
                { "thing": "PlantSmall", "x": 768, "width": 384, "height": 64 },
                { "thing": "DirtMedium", "x": 1152, "width": 128, "height": 1024 },
                { "thing": "PlantSmall", "x": 1152, "width": 128, "height": 1024 },
                { "thing": "Sign", "x": 608, "y": 32, "dialog": ["TRAINER TIPS", "Catch %%%%%%%POKEMON%%%%%%% and expand your collection!", "The more you have, the easier it is to fight!"] },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 64, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 640, "y": 64, "width": 128, "height": 64 },
                { "thing": "DirtLight", "x": 768, "y": 64, "width": 384, "height": 64 },
                { "thing": "Tree", "x": 448, "y": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 512, "y": 128, "xnum": 6, "ynum": 2 },
                { "thing": "DirtLight", "x": 704, "y": 128, "width": 192, "height": 192 },
                { "thing": "DirtLight", "x": 896, "y": 128, "width": 192, "height": 128 },
                { "macro": "Gym", "x": 896, "y": 128 },
                { "thing": "DirtLight", "x": 1088, "y": 128, "width": 64, "height": 256 },
                { "thing": "FenceWide", "x": 256, "y": 160, "width": 192 },
                { "thing": "PlantSmall", "x": 448, "y": 160, "width": 64 },
                { "thing": "FenceWide", "x": 224, "y": 192, "height": 320 },
                { "thing": "PlantSmall", "x": 256, "y": 192, "width": 256, "height": 352 },
                { "thing": "DirtWhite", "x": 512, "y": 192, "width": 64, "height": 320 },
                { "thing": "FenceVertical", "x": 512, "y": 192, "width": 32, "height": 320 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 192, "xnum": 2, "ynum": 12 },
                { "thing": "DirtWhite", "x": 640, "y": 192, "width": 64, "height": 128 },
                { "thing": "FenceVertical", "x": 640, "y": 192, "width": 32, "height": 64 },
                { "thing": "Sign", "x": 864, "y": 224, "dialog": "VIRIDIAN CITY \n %%%%%%%POKEMON%%%%%%% GYM" },
                { "macro": "House", "x": 640, "y": 256, "door": true, "entrance": "Nicknamer House Front Door", "transport": "Nicknamer House Floor 1 Door" },
                { "thing": "Elder", "x": 960, "y": 256, "name": "GymWatcher", "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["This %%%%%%%POKEMON%%%%%%% gym is always closed.", "I wonder who the LEADER is?"] },
                { "thing": "MenuTriggerer", "x": 992, "y": 256, "dialog": "The GYM's doors are locked...", "pushSteps": [{ direction: 2, blocks: 1 }] },
                { "thing": "DirtMedium", "x": 896, "y": 256, "width": 192, "height": 64 },
                { "thing": "Lady", "x": 544, "y": 288, "id": "CrankyGranddaughter", "direction": 1, "directionPreferred": 1, "dialog": "Oh Grandpa! Don't be so mean! \n He hasn't had his coffee yet." },
                { "thing": "Lady", "x": 544, "y": 288, "id": "HappyGranddaughter", "alive": false, "direction": 1, "directionPreferred": 1, "dialog": "When I go to shop in PEWTER CITY, I have to take the winding trail in VIRIDIAN FOREST." },
                { "thing": "Elder", "x": 576, "y": 288, "id": "CrankyGrandpa", "resting": true, "pushSteps": [{ direction: 2, blocks: 1 }], "dialog": "You can't go through here! This is private property!" },
                {
                    "thing": "Elder", "x": 576, "y": 160, "id": "HappyGrandpa", "alive": false, "roaming": true, "roamingDirections": [1, 3], "dialog": ["Ahh, I've had my coffee now and I feel great!", "Sure you can go through.", "Are you in a hurry?"], "dialogOptions":
                    {
                        "type": "Yes/No",
                        "options": {
                            "Yes": "Time is money... Go along then.",
                            "No": {
                                "words": ["I see you're using a %%%%%%%POKEDEX%%%%%%%.", "When you catch a %%%%%%%POKEMON%%%%%%%, %%%%%%%POKEDEX%%%%%%% is automatically updated.", "What? Don't you know how to catch %%%%%%%POKEMON%%%%%%%?", "I'll show you how to then."],
                                "cutscene": "ElderTraining"
                            }
                        }
                    }
                },
                { "thing": "MenuTriggerer", "x": 608, "y": 288, "id": "CrankyGrandpaBlocker", "pushSteps": [{ direction: 2, blocks: 1 }], "keepAlive": true, "requireOverlap": true, "dialog": "You can't go through here! This is private property!" },
                { "thing": "Ledge", "x": 768, "y": 304, "width": 128, "jagged": true },
                { "thing": "Ledge", "x": 896, "y": 304, "width": 192 },
                { "thing": "Ledge", "x": 1088, "y": 304, "width": 64, "jagged": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 640, "y": 320, "xnum": 14, "ynum": 2 },
                { "thing": "DirtLight", "x": 640, "y": 384, "width": 512, "height": 64 },
                { "thing": "FenceVertical", "x": 640, "y": 416, "width": 512, "height": 32 },
                { "thing": "DirtMedium", "y": 448, "width": 224, "height": 64 },
                { "thing": "ThemePlayer", "x": 32, "y": 448, "height": 128, "theme": "Pewter City" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 640, "y": 448, "xnum": 16, "ynum": 2 },
                { "macro": "House", "x": 640, "y": 448, "door": true, "entrance": "School Front Door", "transport": "School Floor 1 Door" },
                { "thing": "DirtLight", "y": 512, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 512, "xnum": 4, "ynum": 2 },
                { "thing": "DirtLight", "x": 512, "y": 512, "width": 64, "height": 64 },
                { "thing": "DirtLight", "x": 640, "y": 512, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 768, "y": 512, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 832, "y": 512, "width": 256, "height": 128 },
                { "macro": "Building", "x": 896, "y": 512, "door": true, "label": "Mart", "transport": { "map": "Viridian City", "location": "PokeMart Inside Door" }, "entrance": "PokeMart Outside Door" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1088, "y": 512, "xnum": 2, "ynum": 4 },
                { "thing": "Sign", "x": 544, "y": 544, "dialog": "VIRIDIAN CITY \n The Eternally Green Paradise" },
                { "thing": "FenceVertical", "x": 640, "y": 544, "width": 128 },
                { "macro": "Mountain", "y": 576, "width": 128, "height": 320, "top": true, "right": true, "bottom": true },
                { "thing": "DirtLight", "x": 96, "y": 576 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 576, "xnum": 2, "ynum": 8 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 576, "xnum": 14, "ynum": 2 },
                { "thing": "DirtMedium", "x": 640, "y": 576, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 640, "y": 592, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtMedium", "x": 192, "y": 640, "width": 320, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 512, "y": 640, "xnum": 20, "ynum": 2 },
                { "thing": "BugCatcher", "x": 416, "y": 640, "name": "WaistHappy", "direction": 1, "roaming": true, "dialog": ["Those %%%%%%%POKE%%%%%%% BALLs at your waist! You have %%%%%%%POKEMON%%%%%%%!", "It's great that you can carry and use %%%%%%%POKEMON%%%%%%% any time, anywhere!"] },
                { "thing": "PlantSmall", "x": 128, "y": 672, "width": 128 },
                { "thing": "Tree", "x": 256, "y": 704 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 512, "y": 704, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 576, "y": 704, "width": 64, "height": 256 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 640, "y": 704, "xnum": 8, "ynum": 4 },
                { "macro": "Building", "x": 704, "y": 704, "door": true, "label": "Poke", "entrance": "PokeCenter Outside Door", "transport": { "map": "Viridian City", "location": "PokeCenter Inside Door" } },
                { "thing": "DirtMedium", "x": 896, "y": 704, "width": 192, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1088, "y": 704, "xnum": 2, "ynum": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 320, "y": 720, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 576, "y": 720, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 896, "y": 720, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "Fatty", "x": 192, "y": 736, "dialog": "Who knows?" },
                { "thing": "PlantSmall", "x": 256, "y": 736, "width": 64 },
                { "thing": "DirtMedium", "x": 192, "y": 768, "width": 64, "height": 128 },
                { "macro": "Water", "x": 256, "y": 768, "width": 192, "height": 128, "open": [false, false, true, false] },
                { "thing": "DirtMedium", "x": 448, "y": 768, "width": 64, "height": 128 },
                { "thing": "BugCatcher", "x": 960, "y": 800, "name": "CaterpillerGuy", "roaming": true, "dialog": "You want to know about the 8 kinds of caterpillar %%%%%%%POKEMON%%%%%%%?", "dialogOptions": { "type": "Yes/No", "options": { "Yes": ["CATERPIE has no poison, but WEEDLE does.", "Watch out for its POISON STING!"], "No": "Oh, OK then!" } } },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 1024, "y": 784, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 128, "y": 832, "width": 64, "height": 64 },
                { "thing": "DirtLight", "x": 512, "y": 832, "width": 64, "height": 64 },
                { "thing": "DirtLight", "x": 640, "y": 832, "width": 512, "height": 64 },
                { "thing": "Ledge", "x": 128, "y": 880, "width": 128, "crumbleLeft": true },
                { "thing": "Ledge", "x": 448, "y": 880, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 480, "y": 880 },
                { "thing": "Ledge", "x": 512, "y": 880, "width": 96, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 608, "y": 880 },
                { "thing": "Ledge", "x": 640, "y": 880, "width": 512, "jagged": true },
                { "thing": "DirtMedium", "y": 896, "width": 128, "height": 256 },
                { "thing": "FenceWide", "x": 96, "y": 896, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 896, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 192, "y": 896, "width": 320, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 512, "y": 896, "xnum": 2, "ynum": 2 },
                { "thing": "DirtLight", "x": 640, "y": 896, "width": 64, "height": 64 },
                { "thing": "DirtMedium", "x": 704, "y": 896, "width": 192, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 896, "y": 896, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 960, "y": 896, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1088, "y": 896, "xnum": 2, "ynum": 2 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 192, "y": 912, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 768, "y": 912, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 960, "y": 912, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "Sign", "x": 672, "y": 928 },
                { "thing": "DirtLight", "x": 128, "y": 960, "width": 512, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 640, "y": 960, "xnum": 2, "ynum": 6 },
                { "thing": "DirtLight", "x": 704, "y": 960, "width": 448, "height": 64 },
                { "thing": "FenceVertical", "x": 128, "y": 992, "width": 512 },
                { "thing": "FenceVertical", "x": 704, "y": 992, "width": 448 },
                { "thing": "DirtMedium", "x": 128, "y": 1024, "width": 512, "height": 128 },
                { "thing": "DirtMedium", "x": 704, "y": 1024, "width": 576, "height": 128 },
                { "thing": "FenceWide", "x": 416, "y": 1024, "height": 128 },
                { "thing": "FenceWide", "x": 608, "y": 1024, "height": 128 },
                { "thing": "FenceWide", "x": 704, "y": 1024, "height": 128 },
                { "thing": "FenceWide", "x": 896, "y": 1024, "height": 128 },
                { "thing": "ThemePlayer", "x": 640, "y": 1088, "width": 64, "theme": "Pewter City" },
                { "thing": "AreaSpawner", "y": 1152, "width": 1280, "map": "Route 1", "area": "Land", "direction": 1, "offsetX": -960 }
            ]
        },
        "Nicknamer House": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "Cabinet", "width": 64 },
                { "thing": "Painting", "x": 96, "dialog": "A TOWN MAP." },
                { "thing": "Clipboard", "x": 128, "dialog": "SPEAROW \n Name: SPEARY" },
                { "thing": "Window", "x": 160 },
                { "thing": "Bookshelf", "x": 224 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "Table2x3", "x": 96, "y": 96 },
                { "thing": "Dad", "x": 160, "y": 96, "direction": 3, "roaming": true, "roamingDirections": [], "dialog": ["Coming up with nicknames is fun, but hard.", "Simple names are the easiest to remember."] },
                { "thing": "Stool", "x": 64, "y": 96 },
                { "thing": "Stool", "x": 160, "y": 96 },
                { "thing": "Stool", "x": 64, "y": 128 },
                { "thing": "Stool", "x": 160, "y": 128 },
                { "thing": "LittleGirl", "x": 32, "y": 128, "roaming": true, "roamingDirections": [0, 2], "dialog": "My daddy loves %%%%%%%POKEMON%%%%%%% too." },
                { "thing": "BirdPokemon", "x": 192, "y": 160, "direction": 3, "roaming": true, "roamingDirections": [1, 3], "dialog": "SPEARY: Tetweet!" },
                { "thing": "PottedPalmTree", "y": 192 },
                { "thing": "PottedPalmTree", "x": 224, "y": 192 },
                { "thing": "DoormatDashed", "x": 64, "y": 224, "width": 64, "entrance": "Nicknamer House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "location": "Nicknamer House Front Door" }, "requireDirection": 2 }
            ]
        },
        "School": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "Window", "x": 32 },
                { "thing": "Blackboard", "x": 96 },
                { "thing": "Bookshelf", "x": 224 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "Lass", "x": 128, "y": 32, "direction": 2, "directionPreferred": 2, "dialog": ["Okay!", "Be sure to read the blackboard carefully!"] },
                { "thing": "Table2x3", "x": 96, "y": 96 },
                { "thing": "Notepad", "x": 96, "y": 112 },
                {
                    "thing": "DialogResponder", "x": 96, "y": 112, "dialog": ["Looked at the notebook!", "First page...", "%%%%%%%POKE%%%%%%% BALLs are used to catch %%%%%%%POKEMON%%%%%%%.", "Up to 24 %%%%%%%POKEMON%%%%%%% can be carried.", "People who raise and make %%%%%%%POKEMON%%%%%%% fight are called %%%%%%%POKEMON%%%%%%% trainers.", "Turn the page?"], "dialogOptions":
                    {
                        "options": {
                            "Yes": {
                                "words": ["Second page...", "A healty %%%%%%%POKEMON%%%%%%% may be hard to catch, so weaken it first!", "Poison, burns, and other damage are effective!", "Turn the page?"],
                                "options": {
                                    "Yes": {
                                        "words": ["Third page...", "%%%%%%%POKEMON%%%%%%% trainers seek others to engage in %%%%%%%POKEMON%%%%%%% fights.", "Battles are constantly fought at %%%%%%%POKEMON%%%%%%% GYMs.", "Turn the page?"],
                                        "options": {
                                            "Yes": {
                                                "words": ["Fourth page...", "The goal for %%%%%%%POKEMON%%%%%%% trainers is to beat the top 32 %%%%%%%POKEMON%%%%%%% GYM LEADERs.", "Do so to earn the right to face...", "The ELITE FOUR of %%%%%%%POKEMON%%%%%%% LEAGUE!", "GIRL: Hey! Don't look at my notes!"]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { "thing": "Stool", "x": 96, "y": 160 },
                { "thing": "Girl", "x": 96, "y": 160, "direction": 0, "dialog": "Whew! I'm trying to memorize all my notes." },
                { "thing": "PottedPalmTree", "y": 192 },
                { "thing": "PottedPalmTree", "x": 224, "y": 192 },
                { "thing": "DoormatDashed", "x": 64, "y": 224, "width": 64, "entrance": "School Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "location": "School Front Door" }, "requireDirection": 2 }
            ]
        },
        "PokeCenter": {
            "allowCycling": false,
            "width": 448,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeCenter", "entrance": "PokeCenter Inside Door", "transport": "PokeCenter Outside Door" },
                { "thing": "CoolTrainerM", "x": 128, "y": 96, "roaming": true, "roamingDirections": [], "dialog": ["There's a %%%%%%%POKEMON%%%%%%% CENTER in every town ahead.", "They don't charge any money either!"] },
                { "thing": "Gentleman", "x": 320, "y": 160, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": ["You can use that PC in the corner.", "The receptionist told me. So kind!"] }
            ]
        },
        "PokeMart": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeMart", "entrance": "PokeMart Inside Door", "transport": "PokeMart Outside Door", "responderId": "CashierDetector", "responderDialog": "Okay! Say hi to PROF. Oak for me!", "items": [{ "item": "Pokeball", "cost": 200 }, { "item": "Antidote", "cost": 100 }, { "item": "Parlyz Heal", "cost": 200 }, { "item": "Burn Heal", "cost": 250 }] },
                { "thing": "CoolTrainerM", "x": 96, "y": 96, "direction": 2, "roaming": true, "roamingDirections": [], "dialog": "No! POTIONS are all sold out." },
                { "thing": "BugCatcher", "x": 192, "y": 160, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": "This shop sells many ANTIDOTEs." },
                { "thing": "CutsceneTriggerer", "x": 96, "y": 224, "width": 64, "id": "OakParcelPickup", "active": true, "cutscene": "OakParcelPickup" }
            ]
        }
    }
};

/* tslint:enable max-line-length */
