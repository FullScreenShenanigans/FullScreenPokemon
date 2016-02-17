FullScreenPokemon.FullScreenPokemon.settings.maps.library["Pewter City"] = {
    "name": "Pewter City",
    "theme": "Pewter City",
    "locationDefault": "PokeCenter Outside Door",
    "locations": {
        "Museum of Science Outside Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Pewter Gym Outside Door": {
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
        "Outsider House Front Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Info House Front Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Museum of Science Inside Door": {
            "area": "Museum of Science"
        },
        "Pewter Gym Floor 1 Door": {
            "area": "Pewter Gym",
            "direction": 0
        },
        "PokeCenter Inside Door": {
            "area": "PokeCenter",
            "direction": 0
        },
        "PokeMart Inside Door": {
            "area": "PokeMart",
            "direction": 0
        },
        "Museum of Science Floor 1 Door": {
            "area": "Museum of Science",
            "yloc": 8,
            "direction": 0
        },
        "Outsider House Floor 1 Door": {
            "area": "Outsider House",
            "direction": 0
        },
        "Info House Floor 1 Door": {
            "area": "Info House",
            "direction": 0
        },
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 320,
            "height": 288,
            "creation": [
                { "thing": "DirtMedium", "width": 320, "height": 16 },
                { "thing": "FenceWide", "x": 32, "y": 8, "width": 240 },
                { "thing": "PlantSmall", "x": 272, "y": 8, "width": 48 },
                { "macro": "Mountain", "y": 16, "height": 216, "width": 32, "top": true, "right": true },
                { "thing": "DirtLight", "x": 24, "y": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 16, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 48, "y": 16, "width": 96, "height": 48 },
                { "thing": "HouseLargeTopLeft", "x": 80, "y": 16, "height": 20 },
                { "thing": "HouseLargeTopMiddle", "x": 88, "y": 16, "width": 48, "height": 16 },
                { "thing": "HouseLargeTopRight", "x": 136, "y": 16, "height": 20 },
                { "thing": "DirtMedium", "x": 144, "y": 16, "width": 136, "height": 32 },
                { "macro": "Building", "x": 144, "y": 16, "width": 48, "door": true },
                { "thing": "DirtMedium", "x": 280, "y": 8, "width": 40, "height": 72 },
                { "thing": "PlantSmall", "x": 280, "y": 8, "width": 40, "height": 72 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 48, "y": 20, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 240, "y": 20, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "PlantSmall", "x": 192, "y": 24, "width": 32 },
                { "macro": "HouseLarge", "x": 80, "y": 32, "width": 64, "stories": 2, "door": true, "doorOffset": 32, "entrance": "Museum of Science Outside Door", "transport": { "map": "Pewter City", "location": "Museum of Science Floor 1 Door" } },
                { "thing": "Tree", "x": 208, "y": 32 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 48, "y": 36, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 240, "y": 36, "xnum": 8, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "PlantSmall", "x": 208, "y": 40 },
                { "thing": "PlantSmall", "x": 216, "y": 40, "height": 24 },
                { "thing": "DirtLight", "x": 32, "y": 48, "width": 16, "height": 16 },
                { "thing": "DirtLight", "x": 144, "y": 48, "width": 16, "height": 16 },
                { "thing": "DirtMedium", "x": 160, "y": 48, "width": 120, "height": 32 },
                { "thing": "Ledge", "x": 32, "y": 60, "width": 24, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 56, "y": 60 },
                { "thing": "Ledge", "x": 64, "y": 60, "width": 16 },
                { "thing": "Ledge", "x": 144, "y": 60, "width": 72, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "Ledge", "x": 224, "y": 60, "width": 24, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 248, "y": 60 },
                { "thing": "Ledge", "x": 256, "y": 60, "width": 24, "crumbleRight": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 64, "xnum": 10, "ynum": 2 },
                { "thing": "DirtLight", "x": 112, "y": 64, "width": 16, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 64, "xnum": 4, "ynum": 2 },
                { "thing": "Sign", "x": 120, "y": 72, "dialog": "PEWTER MUSEUM OF SCIENCE" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 32, "y": 80, "xnum": 2, "ynum": 22 },
                { "thing": "DirtMedium", "x": 48, "y": 80, "width": 96, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 80, "xnum": 16, "ynum": 2 },
                { "macro": "Mountain", "x": 272, "y": 80, "width": 48, "height": 48, "top": true, "bottom": true, "left": true },
                { "thing": "DirtWhite", "x": 272, "y": 80 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 64, "y": 84, "xnum": 20, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 96, "xnum": 14, "ynum": 2 },
                { "thing": "DirtLight", "x": 160, "y": 96, "width": 96, "height": 16 },
                { "macro": "House", "x": 224, "y": 96, "door": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 256, "y": 96, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 48, "y": 112, "width": 32, "height": 32 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 80, "y": 112, "xnum": 24, "ynum": 2 },
                { "macro": "Gym", "x": 96, "y": 112, "door": true, "doorOffset": 40, "transport": { "map": "Pewter City", "location": "Pewter Gym Floor 1 Door" }, "entrance": "Pewter Gym Outside Door" },
                { "macro": "Building", "x": 168, "y": 112, "door": true, "label": "Mart", "transport": { "map": "Pewter City", "location": "PokeMart Inside Door" }, "entrance": "PokeMart Outside Door" },
                { "thing": "Lass", "x": 64, "y": 120, "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["It's rumored that CLEFAIRYs came from the moon!", "They appeared after MOON STONE fell on MT. MOON."] },
                { "thing": "DirtLight", "x": 80, "y": 128, "width": 64, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 128, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 160, "y": 128, "width": 96, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 256, "y": 128, "xnum": 8, "ynum": 2 },
                { "thing": "Sign", "x": 88, "y": 136 },
                {
                    "thing": "CoolTrainerM", "x": 208, "y": 136, "name": "MuseumLover", "roaming": true, "roamingDirections": [], "dialog": "Did you check out the museum?",
                    "dialogOptions": {
                        "type": "Yes/No",
                        "options": {
                            "Yes": "Weren't those fossils from MT. Moon amazing?",
                            "No": {
                                "words": "Really? You absolutely have to go!",
                                "cutscene": "WalkToMuseum"
                            }
                        }
                    }
                },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 144, "xnum": 26, "ynum": 2 },
                { "thing": "FenceVertical", "x": 144, "y": 144, "width": 8, "height": 32 },
                { "thing": "DirtLight", "x": 256, "y": 144, "width": 16, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 272, "y": 144, "xnum": 6, "ynum": 2 },
                { "thing": "Sign", "x": 264, "y": 152, "dialog": ["NOTICE!", "Thieves have been stealing %%%%%%%POKEMON%%%%%%% fossils at MT. MOON! Please call PEWTER POLICE with any info!"] },
                { "thing": "DirtMedium", "x": 48, "y": 160, "width": 32, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 80, "y": 160, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 96, "y": 160, "width": 48, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 160, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 160, "y": 160, "width": 96, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 256, "y": 160, "xnum": 2, "ynum": 12 },
                { "thing": "DirtWhite", "x": 272, "y": 160 },
                { "macro": "Mountain", "x": 272, "y": 160, "width": 48, "height": 48, "top": true, "bottom": true, "left": true },
                { "thing": "PlantSmall", "x": 32, "y": 168, "width": 112 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 176, "xnum": 14, "ynum": 2 },
                { "macro": "Building", "x": 96, "y": 176, "door": true, "label": "Poke", "entrance": "PokeCenter Outside Door", "transport": { "map": "Pewter City", "location": "PokeCenter Inside Door" } },
                { "thing": "DirtLight", "x": 160, "y": 176, "width": 96, "height": 16 },
                { "thing": "FenceVertical", "x": 176, "y": 184, "width": 24 },
                { "thing": "Sign", "x": 200, "y": 184, "dialog": "PEWTER CITY \n A Stone Gray \n City" },
                {
                    "thing": "CoolTrainerM", "x": 200, "y": 200, "name": "Gardener", "direction": 3, "roaming": true, "roamingDirections": [1, 3], "dialog": "Psssst! Do you know what I'm doing?",
                    "dialogOptions": {
                        "type": "Yes/No",
                        "options": {
                            "Yes": "That's right! It's hard work!",
                            "No": "I'm spraying REPEL to keep %%%%%%%POKEMON%%%%%%% out of my garden!"
                        }
                    }
                },
                { "thing": "FenceVertical", "x": 208, "y": 184, "width": 32 },
                { "thing": "DirtMedium", "x": 48, "y": 192, "width": 96, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 192, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 160, "y": 192, "width": 96, "height": 48 },
                { "thing": "PlantSmall", "x": 168, "y": 192, "height": 48 },
                { "thing": "PlantSmall", "x": 240, "y": 192, "height": 48 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 196, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 176, "y": 196, "xnum": 16, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "CoolTrainerM", "x": 136, "y": 200, "name": "SeriousTrainer", "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["There aren't many serious %%%%%%%POKEMON%%%%%%% trainers here!", "They're all like BUG CATCHERs, but PEWTER GYM's BROCK is totally into it!"] },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 208, "xnum": 14, "ynum": 2 },
                { "thing": "DirtMedium", "x": 272, "y": 208, "width": 48, "height": 48 },
                { "thing": "FenceWide", "x": 280, "y": 208, "height": 48 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 176, "y": 212, "xnum": 16, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtMedium", "x": 48, "y": 224, "width": 96, "height": 16 },
                { "macro": "House", "x": 48, "y": 224, "door": true, "entrance": "Info House Front Door", "transport": { "map": "Pewter City", "location": "Info House Floor 1 Door" } },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 80, "y": 228, "xnum": 4, "ynum": 2, "xwidth": 4, "yheight": 4 },
                { "thing": "DirtLight", "x": 144, "y": 224, "width": 16, "height": 16 },
                { "thing": "Sign", "x": 152, "y": 232, "dialog": ["TRAINER TIPS", "Any %%%%%%%POKEMON%%%%%%% that takes part in battle, however short, earns EXP!"] },
                { "macro": "Mountain", "y": 232, "width": 16, "height": 32, "right": true, "bottom": true },
                { "macro": "Mountain", "x": 16, "y": 232, "width": 16, "bottom": true, "right": true },
                { "thing": "Ledge", "x": 176, "y": 236, "width": 24 },
                { "thing": "LedgeOpening", "x": 200, "y": 236 },
                { "thing": "Ledge", "x": 208, "y": 236, "width": 32 },
                { "thing": "DirtWhite", "x": 16, "y": 240, "width": 16, "height": 16 },
                { "thing": "FenceWide", "x": 16, "y": 240, "width": 16, "height": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 48, "y": 240, "xnum": 26, "ynum": 2 },
                { "thing": "DirtMedium", "x": 16, "y": 256, "width": 128 },
                { "thing": "FenceWide", "x": 16, "y": 256, "width": 80 },
                { "thing": "PlantSmall", "x": 96, "y": 256, "width": 48, "height": 32 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 144, "y": 256, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 160, "y": 256, "width": 160, "height": 32 },
                { "thing": "PlantSmall", "x": 160, "y": 256, "width": 48, "height": 32 },
                { "thing": "FenceWide", "x": 208, "y": 256, "width": 80 },
                { "thing": "DirtMedium", "y": 264, "width": 144, "height": 24 },
                { "thing": "ThemePlayer", "x": 144, "y": 280, "width": 16, "height": 200, "theme": "Pewter City" },
                { "thing": "AreaSpawner", "y": 288, "width": 320, "map": "Route 2", "area": "Land", "direction": 1, "offsetX": 48 }
            ]
        },
        "Museum of Science": {
            "allowCycling": false,
            "width": 8,
            "height": 16,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "FloorCheckered", "width": 8, "height": 16 },
                { "thing": "Scientist", "dialog": "Apologies, the Pewter Museum of Science is closed in this release of Full Screen %%%%%%%POKEMON%%%%%%%. Try again later!", "transport": { "map": "Pewter City", "location": "Museum of Science Outside Door" } }
            ]
        },
        "Pewter Gym": {
            "allowCycling": false,
            "width": 80,
            "height": 112,
            "theme": "Gym",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBandsInverse", "width": 80, "height": 112 },
                { "thing": "Rock", "width": 80 },
                { "thing": "Rock", "y": 8, "height": 72 },
                {
                    "thing": "CoolTrainerM", "x": 32, "y": 8, "name": "Brock", "trainer": true, "battleName": "Brock", "battleSprite": "Brock", "dialog": ["I'm BROCK! \n I'm PEWTER's GYM LEADER!", "I believe in rock hard defense and determination!", "That's why my %%%%%%%POKEMON%%%%%%% are all the rock-type!", "Do you still want to challenge me? Fine then! Show me your best!"],
                    "reward": 1386,
                    "badge": "Brock",
                    "textVictory": ["BROCK: I took you for granted.", "As proof of your victory, here's the BOULDERBADGE!", "%%%%%%%PLAYER%%%%%%% received the BOULDERBADGE!", "That's an official %%%%%%%POKEMON%%%%%%% LEAGUE BADGE!", "Its bearer's %%%%%%%POKEMON%%%%%%% become more powerful!", "The technique FLASH can now be used any time!"],
                    "giftAfterBattle": "TM34",
                    "textAfterBattle": ["Wait! Take this with you!", "%%%%%%%PLAYER%%%%%%% received TM34!", "A TM contains a technique that can be taught to %%%%%%%POKEMON%%%%%%%!", "A TM is good only once! So when you use one to teach a new technique, pick the %%%%%%%POKEMON%%%%%%% carefully!", "TM34 contains BIDE! Your %%%%%%%POKEMON%%%%%%% will absorb damage in battle then pay it back double!"],
                    "dialogNext": ["There are all kinds of trainers in the world!", "You appear to be very gifted as a %%%%%%%POKEMON%%%%%%% trainer!", "Go to the GYM in CERULEAN and test your abilities!"],
                    "actors": [{
                        "title": "Geodude",
                        "level": 12
                    }, {
                        "title": "Onix",
                        "level": 14
                    }]
                },
                { "thing": "Rock", "x": 72, "y": 8, "height": 72 },
                { "thing": "Rock", "x": 8, "y": 24, "width": 24 },
                { "thing": "Rock", "x": 48, "y": 24, "width": 24 },
                { "thing": "Rock", "x": 16, "y": 40 },
                { "thing": "Rock", "x": 40, "y": 40, "width": 24 },
                {
                    "thing": "CoolTrainerM", "x": 24, "y": 48, "direction": 1, "trainer": true, "sight": 4, "battleName": "Jr. Trainer", "battleSprite": "JrTrainer", "dialog": ["Stop right there, kid!", "You're still light years from facing BROCK!"],
                    "reward": 220,
                    "textDefeat": ["Darn!", "Light years isn't time! It measures distance!"],
                    "dialogNext": "You're pretty hot, but not as hot as BROCK!",
                    "actors": [{
                        "title": "Diglett",
                        "level": 11
                    }, {
                        "title": "Sandshrew",
                        "level": 11
                    }]
                },
                { "thing": "Rock", "x": 16, "y": 56 },
                { "thing": "Rock", "x": 40, "y": 56, "width": 24 },
                { "thing": "Rock", "x": 8, "y": 72, "width": 16 },
                { "thing": "GymStatue", "x": 24, "y": 72, "gym": "Pewter City", "leader": "Brock" },
                { "thing": "GymStatue", "x": 48, "y": 72, "gym": "Pewter City", "leader": "Brock" },
                { "thing": "Rock", "x": 56, "y": 72, "width": 16 },
                {
                    "thing": "GymGuide", "x": 64, "y": 80, "dialog": "nope", "dialog": ["Hiya! I can tell you have what it takes to become a %%%%%%%POKEMON%%%%%%% champ!", "I'm no trainer, but I can tell you how to win!", "Let me take you to the top!"],
                    "dialogOptions": {
                        "type": "Yes/No",
                        "options": {
                            "Yes": ["All right! Let's get happening!", "The 1st %%%%%%%POKEMON%%%%%%% out in a match is at the top of the %%%%%%%POKEMON%%%%%%% LIST!", "By changing the order of %%%%%%%POKEMON%%%%%%%, matches could be made easier!"],
                            "No": ["It's a free service! Let's get happening!", "The 1st %%%%%%%POKEMON%%%%%%% out in a match is at the top of the %%%%%%%POKEMON%%%%%%% LIST!", "By changing the order of %%%%%%%POKEMON%%%%%%%, matches could be made easier!"]
                        }
                    }
                },
                { "thing": "Doormat", "x": 32, "y": 104, "width": 16, "entrance": "Pewter Gym Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 32, "y": 104, "width": 16, "transport": { "map": "Pewter City", "location": "Pewter Gym Outside Door" }, "requireDirection": 2 }
            ]
        },
        "PokeCenter": {
            "allowCycling": false,
            "width": 112,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeCenter", "entrance": "PokeCenter Inside Door", "transport": "PokeCenter Outside Door", "coolTrainerDialog": ["Yawn!", "When JIGGLYPUFF sings, %%%%%%%POKEMON%%%%%%% get drowsy...", "...Me too... \n Snore..."] },
            ]
        },
        "PokeMart": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeMart", "entrance": "PokeMart Inside Door", "transport": "PokeMart Outside Door", "responderId": "CashierDetector", "responderDialog": "Okay! Say hi to PROF. Oak for me!", "items": [{ "item": "Pokeball", "cost": 200 }, { "item": "Antidote", "cost": 100 }, { "item": "Parlyz Heal", "cost": 200 }, { "item": "Burn Heal", "cost": 250 }] },
                { "thing": "Gentleman", "x": 88, "y": 56, "direction": 3, "directionPreferred": 3, "dialog": ["What!?", "TEAM ROCKET is at MT. MOON? Huh? I'm on the phone!", "Scram!"] }
            ]
        },
        "Outsider House": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "Cabinet", "width": 16 },
                { "thing": "Painting", "x": 24, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 40 },
                { "thing": "Bookshelf", "x": 56 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                { "thing": "ChubbyGuy", "x": 8, "y": 16, "direction": 1, "roaming": true, "roamingDirections": [], "dialog": ["Our %%%%%%%POKEMON%%%%%%%'s an outsider, so it's hard to handle.", "An outsider is a %%%%%%%POKEMON%%%%%%% that you get in a trade.", "It grows fast, but it may ignore an unskilled trainer in battle!", "If only we had some BADGEs..."] },
                { "thing": "Table2x3", "x": 24, "y": 24 },
                { "thing": "Stool", "x": 16, "y": 24 },
                { "thing": "Stool", "x": 40, "y": 24 },
                { "thing": "Stool", "x": 16, "y": 32 },
                { "thing": "Stool", "x": 40, "y": 32 },
                { "thing": "Toddler", "x": 24, "y": 40, "direction": 1, "directionPreferred": 1, "dialog": "NIDORAN sit!" },
                { "thing": "LandPokemon", "x": 32, "y": 40, "direction": 3, "directionPreferred": 3, "dialog": "NIDORAN: Bowbow! x" },
                { "thing": "PottedPalmTree", "y": 48 },
                { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                { "thing": "DoormatDashed", "x": 16, "y": 56, "width": 16, "entrance": "Outsider House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "location": "Outsider House Front Door" }, "requireDirection": 2 }
            ]
        },
        "Info House": {
            "allowCycling": false,
            "width": 64,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "Cabinet", "width": 16 },
                { "thing": "Painting", "x": 24, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 40 },
                { "thing": "Bookshelf", "x": 56 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                { "thing": "Table2x3", "x": 24, "y": 24 },
                { "thing": "Elder", "x": 16, "y": 24, "direction": 1, "directionPreferred": 1, "dialog": ["%%%%%%%POKEMON%%%%%%% learn new techniques as they grow!", "But, some moves must be taught by the trainer!"] },
                { "thing": "Stool", "x": 16, "y": 24 },
                { "thing": "Stool", "x": 40, "y": 24 },
                { "thing": "Stool", "x": 16, "y": 32 },
                { "thing": "Stool", "x": 40, "y": 32 },
                { "thing": "BugCatcher", "x": 32, "y": 40, "direction": 2, "roaming": true, "roamingDirections": [], "dialog": ["%%%%%%%POKEMON%%%%%%% become easier to catch when they are hurt or asleep!", "But, it's not a sure thing!"] },
                { "thing": "PottedPalmTree", "y": 48 },
                { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                { "thing": "DoormatDashed", "x": 16, "y": 56, "width": 16, "entrance": "Info House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "location": "Info House Front Door" }, "requireDirection": 2 }
            ]
        },
    }
};