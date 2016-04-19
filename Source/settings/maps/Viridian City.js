FullScreenPokemon.FullScreenPokemon.settings.maps.library["Viridian City"] = {
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
            "width": 320,
            "height": 288,
            "creation": [
                { "thing": "AreaSpawner", "width": 320, "map": "Route 2", "area": "Land", "direction": 0, "offsetX": 48 },
                { "thing": "AreaSpawner", "height": 288, "map": "Route 22", "area": "Land", "direction": 3, "offsetY": 64 },
                { "macro": "Mountain", "width": 48, "height": 112, "bottom": true, "right": true },
                { "thing": "DirtMedium", "x": 48, "width": 80, "height": 144 },
                { "thing": "PlantSmall", "x": 48, "width": 80, "height": 32 },
                { "thing": "DirtWhite", "x": 128, "width": 16, "height": 32 },
                { "thing": "FenceVertical", "x": 128, "width": 8, "height": 32 },
                { "thing": "ThemePlayer", "x": 136, "width": 24, "theme": "Pewter City" },
                { "thing": "DirtLight", "x": 144, "width": 16, "height": 16 },
                { "thing": "DirtMedium", "x": 160, "width": 128, "height": 16 },
                { "thing": "PlantSmall", "x": 160, "width": 32, "height": 32 },
                { "thing": "PlantSmall", "x": 192, "width": 96, "height": 16 },
                { "thing": "DirtMedium", "x": 288, "width": 32, "height": 256 },
                { "thing": "PlantSmall", "x": 288, "width": 32, "height": 256 },
                { "thing": "Sign", "x": 152, "y": 8, "dialog": ["TRAINER TIPS", "Catch %%%%%%%POKEMON%%%%%%% and expand your collection!", "The more you have, the easier it is to fight!"] },
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
                { "thing": "Sign", "x": 216, "y": 56, "dialog": "VIRIDIAN CITY \n %%%%%%%POKEMON%%%%%%% GYM" },
                { "macro": "House", "x": 160, "y": 64, "door": true, "entrance": "Nicknamer House Front Door", "transport": "Nicknamer House Floor 1 Door" },
                { "thing": "Elder", "x": 240, "y": 64, "name": "GymWatcher", "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["This %%%%%%%POKEMON%%%%%%% gym is always closed.", "I wonder who the LEADER is?"] },
                { "thing": "MenuTriggerer", "x": 248, "y": 64, "dialog": "The GYM's doors are locked...", "pushDirection": 2, "pushSteps": [1] },
                { "thing": "DirtMedium", "x": 224, "y": 64, "width": 48, "height": 16 },
                { "thing": "Lady", "x": 136, "y": 72, "id": "CrankyGranddaughter", "direction": 1, "directionPreferred": 1, "dialog": "Oh Grandpa! Don't be so mean! \n He hasn't had his coffee yet." },
                { "thing": "Lady", "x": 136, "y": 72, "id": "HappyGranddaughter", "alive": false, "direction": 1, "directionPreferred": 1, "dialog": "When I go to shop in PEWTER CITY, I have to take the winding trail in VIRIDIAN FOREST." },
                { "thing": "Elder", "x": 144, "y": 72, "id": "CrankyGrandpa", "resting": true, "pushDirection": 2, "pushSteps": [1], "dialog": "You can't go through here! This is private property!" },
                {
                    "thing": "Elder", "x": 144, "y": 40, "id": "HappyGrandpa", "alive": false, "roaming": true, "roamingDirections": [1, 3], "dialog": ["Ahh, I've had my coffee now and I feel great!", "Sure you can go through.", "Are you in a hurry?"], "dialogOptions":
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
                { "thing": "MenuTriggerer", "x": 152, "y": 72, "id": "CrankyGrandpaBlocker", "pushDirection": 2, "pushSteps": [1], "keepAlive": true, "requireOverlap": true, "dialog": "You can't go through here! This is private property!" },
                { "thing": "Ledge", "x": 192, "y": 76, "width": 32, "jagged": true },
                { "thing": "Ledge", "x": 224, "y": 76, "width": 48 },
                { "thing": "Ledge", "x": 272, "y": 76, "width": 16, "jagged": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 80, "xnum": 14, "ynum": 2 },
                { "thing": "DirtLight", "x": 160, "y": 96, "width": 128, "height": 16 },
                { "thing": "FenceVertical", "x": 160, "y": 104, "width": 128, "height": 8 },
                { "thing": "DirtMedium", "y": 112, "width": 56, "height": 16 },
                { "thing": "ThemePlayer", "x": 8, "y": 112, "height": 32, "theme": "Pewter City" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 112, "xnum": 16, "ynum": 2 },
                { "macro": "House", "x": 160, "y": 112, "door": true, "entrance": "School Front Door", "transport": "School Floor 1 Door" },
                { "thing": "DirtLight", "y": 128, "width": 16, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 128, "xnum": 4, "ynum": 2 },
                { "thing": "DirtLight", "x": 128, "y": 128, "width": 16, "height": 16 },
                { "thing": "DirtLight", "x": 160, "y": 128, "width": 32, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 128, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 208, "y": 128, "width": 64, "height": 32 },
                { "macro": "Building", "x": 224, "y": 128, "door": true, "label": "Mart", "transport": { "map": "Viridian City", "location": "PokeMart Inside Door" }, "entrance": "PokeMart Outside Door" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 128, "xnum": 2, "ynum": 4 },
                { "thing": "Sign", "x": 136, "y": 136, "dialog": "VIRIDIAN CITY \n The Eternally Green Paradise" },
                { "thing": "FenceVertical", "x": 160, "y": 136, "width": 32 },
                { "macro": "Mountain", "y": 144, "width": 32, "height": 80, "top": true, "right": true, "bottom": true },
                { "thing": "DirtLight", "x": 24, "y": 144 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 144, "xnum": 2, "ynum": 8 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 144, "xnum": 14, "ynum": 2 },
                { "thing": "DirtMedium", "x": 160, "y": 144, "width": 32, "height": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 160, "y": 148, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtMedium", "x": 48, "y": 160, "width": 80, "height": 32 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 160, "xnum": 20, "ynum": 2 },
                { "thing": "BugCatcher", "x": 104, "y": 160, "name": "WaistHappy", "direction": 1, "roaming": true, "dialog": ["Those %%%%%%%POKE%%%%%%% BALLs at your waist! You have %%%%%%%POKEMON%%%%%%%!", "It's great that you can carry and use %%%%%%%POKEMON%%%%%%% any time, anywhere!"] },
                { "thing": "PlantSmall", "x": 32, "y": 168, "width": 32 },
                { "thing": "Tree", "x": 64, "y": 176 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 176, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 144, "y": 176, "width": 16, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 160, "y": 176, "xnum": 8, "ynum": 4 },
                { "macro": "Building", "x": 176, "y": 176, "door": true, "label": "Poke", "entrance": "PokeCenter Outside Door", "transport": { "map": "Viridian City", "location": "PokeCenter Inside Door" } },
                { "thing": "DirtMedium", "x": 224, "y": 176, "width": 48, "height": 32 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 176, "xnum": 2, "ynum": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 80, "y": 180, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 144, "y": 180, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 224, "y": 180, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "Fatty", "x": 48, "y": 184, "dialog": "Who knows?" },
                { "thing": "PlantSmall", "x": 64, "y": 184, "width": 16 },
                { "thing": "DirtMedium", "x": 48, "y": 192, "width": 16, "height": 32 },
                { "macro": "Water", "x": 64, "y": 192, "width": 48, "height": 32, "open": [false, false, true, false] },
                { "thing": "DirtMedium", "x": 112, "y": 192, "width": 16, "height": 32 },
                { "thing": "BugCatcher", "x": 240, "y": 200, "name": "CaterpillerGuy", "roaming": true, "dialog": "You want to know about the 2 kinds of caterpillar %%%%%%%POKEMON%%%%%%%?", "dialogOptions": { "type": "Yes/No", "options": { "Yes": ["CATERPIE has no poison, but WEEDLE does.", "Watch out for its POISON STING!"], "No": "Oh, OK then!" } } },
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
                { "thing": "ThemePlayer", "x": 160, "y": 272, "width": 16, "theme": "Pewter City" },
                { "thing": "AreaSpawner", "y": 288, "width": 320, "map": "Route 1", "area": "Land", "direction": 1, "offsetX": -240 },
                { "thing": "CyclingTriggerer", "x": 160, "y": 80, "width": 48, "height": 176, "alwaysMoving": 2 }
            ]
        },
        "Nicknamer House": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "Cabinet", "width": 16 },
                { "thing": "Painting", "x": 24, "dialog": "A TOWN MAP." },
                { "thing": "Clipboard", "x": 32, "dialog": "SPEAROW \n Name: SPEARY" },
                { "thing": "Window", "x": 40 },
                { "thing": "Bookshelf", "x": 56 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                { "thing": "Table2x3", "x": 24, "y": 24 },
                { "thing": "Dad", "x": 40, "y": 24, "direction": 3, "roaming": true, "roamingDirections": [], "dialog": ["Coming up with nicknames is fun, but hard.", "Simple names are the easiest to remember."] },
                { "thing": "Stool", "x": 16, "y": 24 },
                { "thing": "Stool", "x": 40, "y": 24 },
                { "thing": "Stool", "x": 16, "y": 32 },
                { "thing": "Stool", "x": 40, "y": 32 },
                { "thing": "LittleGirl", "x": 8, "y": 32, "roaming": true, "roamingDirections": [0, 2], "dialog": "My daddy loves %%%%%%%POKEMON%%%%%%% too." },
                { "thing": "BirdPokemon", "x": 48, "y": 40, "direction": 3, "roaming": true, "roamingDirections": [1, 3], "dialog": "SPEARY: Tetweet!" },
                { "thing": "PottedPalmTree", "y": 48 },
                { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                { "thing": "DoormatDashed", "x": 16, "y": 56, "width": 16, "entrance": "Nicknamer House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "location": "Nicknamer House Front Door" }, "requireDirection": 2 }
            ]
        },
        "School": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "Window", "x": 8 },
                { "thing": "Blackboard", "x": 24 },
                { "thing": "Bookshelf", "x": 56 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                { "thing": "Lass", "x": 32, "y": 8, "direction": 2, "directionPreferred": 2, "dialog": ["Okay!", "Be sure to read the blackboard carefully!"] },
                { "thing": "Table2x3", "x": 24, "y": 24 },
                { "thing": "Notepad", "x": 24, "y": 28 },
                {
                    "thing": "DialogResponder", "x": 24, "y": 28, "dialog": ["Looked at the notebook!", "First page...", "%%%%%%%POKE%%%%%%% BALLs are used to catch %%%%%%%POKEMON%%%%%%%.", "Up to 6 %%%%%%%POKEMON%%%%%%% can be carried.", "People who raise and make %%%%%%%POKEMON%%%%%%% fight are called %%%%%%%POKEMON%%%%%%% trainers.", "Turn the page?"], "dialogOptions":
                      {
                          "options": {
                              "Yes": {
                                  "words": ["Second page...", "A healty %%%%%%%POKEMON%%%%%%% may be hard to catch, so weaken it first!", "Poison, burns, and other damage are effective!", "Turn the page?"],
                                  "options": {
                                      "Yes": {
                                          "words": ["Third page...", "%%%%%%%POKEMON%%%%%%% trainers seek others to engage in %%%%%%%POKEMON%%%%%%% fights.", "Battles are constantly fought at %%%%%%%POKEMON%%%%%%% GYMs.", "Turn the page?"],
                                          "options": {
                                              "Yes": {
                                                  "words": ["Fourth page...", "The goal for %%%%%%%POKEMON%%%%%%% trainers is to beat the top 8 %%%%%%%POKEMON%%%%%%% GYM LEADERs.", "Do so to earn the right to face...", "The ELITE FOUR of %%%%%%%POKEMON%%%%%%% LEAGUE!", "GIRL: Hey! Don't look at my notes!"]
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                },
                { "thing": "Stool", "x": 24, "y": 40 },
                { "thing": "Girl", "x": 24, "y": 40, "direction": 0, "dialog": "Whew! I'm trying to memorize all my notes." },
                { "thing": "PottedPalmTree", "y": 48 },
                { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                { "thing": "DoormatDashed", "x": 16, "y": 56, "width": 16, "entrance": "School Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "location": "School Front Door" }, "requireDirection": 2 }
            ]
        },
        "PokeCenter": {
            "allowCycling": false,
            "width": 112,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeCenter", "entrance": "PokeCenter Inside Door", "transport": "PokeCenter Outside Door" },
                { "thing": "CoolTrainerM", "x": 32, "y": 24, "roaming": true, "roamingDirections": [], "dialog": ["There's a %%%%%%%POKEMON%%%%%%% CENTER in every town ahead.", "They don't charge any money either!"] },
                { "thing": "Gentleman", "x": 80, "y": 40, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": ["You can use that PC in the corner.", "The receptionist told me. So kind!"] }
            ]
        },
        "PokeMart": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeMart", "entrance": "PokeMart Inside Door", "transport": "PokeMart Outside Door", "responderId": "CashierDetector", "responderDialog": "Okay! Say hi to PROF. Oak for me!", "items": [{ "item": "Pokeball", "cost": 200 }, { "item": "Antidote", "cost": 100 }, { "item": "Parlyz Heal", "cost": 200 }, { "item": "Burn Heal", "cost": 250 }] },
                { "thing": "CoolTrainerM", "x": 24, "y": 24, "direction": 2, "roaming": true, "roamingDirections": [], "dialog": "No! POTIONS are all sold out." },
                { "thing": "BugCatcher", "x": 48, "y": 40, "direction": 0, "roaming": true, "roamingDirections": [0, 2], "dialog": "This shop sells many ANTIDOTEs." },
                { "thing": "CutsceneTriggerer", "x": 24, "y": 56, "width": 16, "id": "OakParcelPickup", "active": true, "cutscene": "OakParcelPickup" }
            ]
        }
    }
};