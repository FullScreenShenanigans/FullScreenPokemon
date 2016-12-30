import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const PewterCity: IMapRaw = {
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
            "yloc": 32,
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
            "width": 1280,
            "height": 1152,
            "creation": [
                { "thing": "DirtMedium", "width": 1280, "height": 64 },
                { "thing": "FenceWide", "x": 128, "y": 32, "width": 960 },
                { "thing": "PlantSmall", "x": 1088, "y": 32, "width": 192 },
                { "macro": "Mountain", "y": 64, "height": 864, "width": 128, "top": true, "right": true },
                { "thing": "DirtLight", "x": 96, "y": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 64, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 192, "y": 64, "width": 384, "height": 192 },
                { "thing": "HouseLargeTopLeft", "x": 320, "y": 64, "height": 80 },
                { "thing": "HouseLargeTopMiddle", "x": 352, "y": 64, "width": 192, "height": 64 },
                { "thing": "HouseLargeTopRight", "x": 544, "y": 64, "height": 80 },
                { "thing": "DirtMedium", "x": 576, "y": 64, "width": 544, "height": 128 },
                { "macro": "Building", "x": 576, "y": 64, "width": 192, "door": true },
                { "thing": "DirtMedium", "x": 1120, "y": 32, "width": 160, "height": 288 },
                { "thing": "PlantSmall", "x": 1120, "y": 32, "width": 160, "height": 288 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 192, "y": 80, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 960, "y": 80, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "PlantSmall", "x": 768, "y": 96, "width": 128 },
                { "macro": "HouseLarge", "x": 320, "y": 128, "width": 256, "stories": 8, "door": true, "doorOffset": 128, "entrance": "Museum of Science Outside Door", "transport": { "map": "Pewter City", "location": "Museum of Science Floor 1 Door" } },
                { "thing": "Tree", "x": 832, "y": 128 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 192, "y": 144, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 960, "y": 144, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "PlantSmall", "x": 832, "y": 160 },
                { "thing": "PlantSmall", "x": 864, "y": 160, "height": 96 },
                { "thing": "DirtLight", "x": 128, "y": 192, "width": 64, "height": 64 },
                { "thing": "DirtLight", "x": 576, "y": 192, "width": 64, "height": 64 },
                { "thing": "DirtMedium", "x": 640, "y": 192, "width": 480, "height": 128 },
                { "thing": "Ledge", "x": 128, "y": 240, "width": 96, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 224, "y": 240 },
                { "thing": "Ledge", "x": 256, "y": 240, "width": 64 },
                { "thing": "Ledge", "x": 576, "y": 240, "width": 288, "crumbleLeft": true, "crumbleRight": true },
                { "thing": "Ledge", "x": 896, "y": 240, "width": 96, "crumbleRight": true },
                { "thing": "LedgeOpening", "x": 992, "y": 240 },
                { "thing": "Ledge", "x": 1024, "y": 240, "width": 96, "crumbleRight": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 256, "xnum": 10, "ynum": 2 },
                { "thing": "DirtLight", "x": 448, "y": 256, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 512, "y": 256, "xnum": 4, "ynum": 2 },
                { "thing": "Sign", "x": 480, "y": 288, "dialog": "PEWTER MUSEUM OF SCIENCE" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 320, "xnum": 2, "ynum": 22 },
                { "thing": "DirtMedium", "x": 192, "y": 320, "width": 384, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 320, "xnum": 8, "ynum": 4 },
                { "macro": "Mountain", "x": 1088, "y": 320, "width": 192, "height": 192, "top": true, "bottom": true, "left": true },
                { "thing": "DirtWhite", "x": 1088, "y": 320 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 256, "y": 336, "xnum": 20, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 384, "xnum": 14, "ynum": 2 },
                { "thing": "DirtLight", "x": 640, "y": 384, "width": 384, "height": 64 },
                { "macro": "House", "x": 896, "y": 384, "door": true },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1024, "y": 384, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 192, "y": 448, "width": 128, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 320, "y": 448, "xnum": 24, "ynum": 2 },
                { "macro": "Gym", "x": 384, "y": 448, "door": true, "doorOffset": 160, "transport": { "map": "Pewter City", "location": "Pewter Gym Floor 1 Door" }, "entrance": "Pewter Gym Outside Door" },
                { "macro": "Building", "x": 672, "y": 448, "door": true, "label": "Mart", "transport": { "map": "Pewter City", "location": "PokeMart Inside Door" }, "entrance": "PokeMart Outside Door" },
                { "thing": "Lass", "x": 256, "y": 480, "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["It's rumored that CLEFAIRYs came from the moon!", "They appeared after MOON STONE fell on MT. MOON."] },
                { "thing": "DirtLight", "x": 320, "y": 512, "width": 256, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 512, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 640, "y": 512, "width": 384, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1024, "y": 512, "xnum": 8, "ynum": 2 },
                { "thing": "Sign", "x": 352, "y": 544 },
                {
                    "thing": "CoolTrainerM", "x": 832, "y": 544, "name": "MuseumLover", "roaming": true, "roamingDirections": [], "dialog": "Did you check out the museum?",
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
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 576, "xnum": 26, "ynum": 2 },
                { "thing": "FenceVertical", "x": 576, "y": 576, "width": 32, "height": 128 },
                { "thing": "DirtLight", "x": 1024, "y": 576, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1088, "y": 576, "xnum": 6, "ynum": 2 },
                { "thing": "Sign", "x": 1056, "y": 608, "dialog": ["NOTICE!", "Thieves have been stealing %%%%%%%POKEMON%%%%%%% fossils at MT. MOON! Please call PEWTER POLICE with any info!"] },
                { "thing": "DirtMedium", "x": 192, "y": 640, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 320, "y": 640, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 384, "y": 640, "width": 192, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 640, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 640, "y": 640, "width": 384, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 1024, "y": 640, "xnum": 2, "ynum": 12 },
                { "thing": "DirtWhite", "x": 1088, "y": 640 },
                { "macro": "Mountain", "x": 1088, "y": 640, "width": 192, "height": 192, "top": true, "bottom": true, "left": true },
                { "thing": "PlantSmall", "x": 128, "y": 672, "width": 448 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 704, "xnum": 14, "ynum": 2 },
                { "macro": "Building", "x": 384, "y": 704, "door": true, "label": "Poke", "entrance": "PokeCenter Outside Door", "transport": { "map": "Pewter City", "location": "PokeCenter Inside Door" } },
                { "thing": "DirtLight", "x": 640, "y": 704, "width": 384, "height": 64 },
                { "thing": "FenceVertical", "x": 704, "y": 736, "width": 96 },
                { "thing": "Sign", "x": 800, "y": 736, "dialog": "PEWTER CITY \n A Stone Gray \n City" },
                {
                    "thing": "CoolTrainerM", "x": 800, "y": 800, "name": "Gardener", "direction": 3, "roaming": true, "roamingDirections": [4, 12], "dialog": "Psssst! Do you know what I'm doing?",
                    "dialogOptions": {
                        "type": "Yes/No",
                        "options": {
                            "Yes": "That's right! It's hard work!",
                            "No": "I'm spraying REPEL to keep %%%%%%%POKEMON%%%%%%% out of my garden!"
                        }
                    }
                },
                { "thing": "FenceVertical", "x": 832, "y": 736, "width": 128 },
                { "thing": "DirtMedium", "x": 192, "y": 768, "width": 384, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 768, "xnum": 2, "ynum": 2 },
                { "thing": "DirtMedium", "x": 640, "y": 768, "width": 384, "height": 192 },
                { "thing": "PlantSmall", "x": 672, "y": 768, "height": 192 },
                { "thing": "PlantSmall", "x": 960, "y": 768, "height": 192 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 512, "y": 784, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 704, "y": 784, "xnum": 61, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "CoolTrainerM", "x": 544, "y": 800, "name": "SeriousTrainer", "direction": 0, "roaming": true, "roamingDirections": [], "dialog": ["There aren't many serious %%%%%%%POKEMON%%%%%%% trainers here!", "They're all like BUG CATCHERs, but PEWTER GYM's BROCK is totally into it!"] },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 832, "xnum": 14, "ynum": 2 },
                { "thing": "DirtMedium", "x": 1088, "y": 832, "width": 192, "height": 192 },
                { "thing": "FenceWide", "x": 1120, "y": 832, "height": 192 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 704, "y": 848, "xnum": 16, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtMedium", "x": 192, "y": 896, "width": 384, "height": 64 },
                { "macro": "House", "x": 192, "y": 896, "door": true, "entrance": "Info House Front Door", "transport": { "map": "Pewter City", "location": "Info House Floor 1 Door" } },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 320, "y": 912, "xnum": 4, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 576, "y": 896, "width": 64, "height": 64 },
                { "thing": "Sign", "x": 608, "y": 928, "dialog": ["TRAINER TIPS", "Any %%%%%%%POKEMON%%%%%%% that takes part in battle, however short, earns EXP!"] },
                { "macro": "Mountain", "y": 928, "width": 64, "height": 128, "right": true, "bottom": true },
                { "macro": "Mountain", "x": 64, "y": 928, "width": 64, "bottom": true, "right": true },
                { "thing": "Ledge", "x": 704, "y": 944, "width": 96 },
                { "thing": "LedgeOpening", "x": 800, "y": 944 },
                { "thing": "Ledge", "x": 832, "y": 944, "width": 128 },
                { "thing": "DirtWhite", "x": 64, "y": 960, "width": 64, "height": 64 },
                { "thing": "FenceWide", "x": 64, "y": 960, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 192, "y": 960, "xnum": 26, "ynum": 2 },
                { "thing": "DirtMedium", "x": 64, "y": 1024, "width": 512 },
                { "thing": "FenceWide", "x": 64, "y": 1024, "width": 320 },
                { "thing": "PlantSmall", "x": 384, "y": 1024, "width": 192, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 576, "y": 1024, "xnum": 2, "ynum": 4 },
                { "thing": "DirtMedium", "x": 640, "y": 1024, "width": 640, "height": 128 },
                { "thing": "PlantSmall", "x": 640, "y": 1024, "width": 192, "height": 128 },
                { "thing": "FenceWide", "x": 832, "y": 1024, "width": 320 },
                { "thing": "DirtMedium", "y": 1056, "width": 576, "height": 96 },
                { "thing": "ThemePlayer", "x": 576, "y": 1120, "width": 64, "height": 800, "theme": "Pewter City" },
                { "thing": "AreaSpawner", "y": 1152, "width": 1280, "map": "Route 2", "area": "Land", "direction": 1, "offsetX": 192 }
            ]
        },
        "Museum of Science": {
            "allowCycling": false,
            "width": 32,
            "height": 64,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "FloorCheckered", "width": 32, "height": 64 },
                { "thing": "Scientist", "dialog": "Apologies, the Pewter Museum of Science is closed in this release of Full Screen %%%%%%%POKEMON%%%%%%%. Try again later!", "transport": { "map": "Pewter City", "location": "Museum of Science Outside Door" } }
            ]
        },
        "Pewter Gym": {
            "allowCycling": false,
            "width": 320,
            "height": 448,
            "theme": "Gym",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBandsInverse", "width": 320, "height": 448 },
                { "thing": "Rock", "width": 320 },
                { "thing": "Rock", "y": 32, "height": 288 },
                {
                    "thing": "CoolTrainerM", "x": 128, "y": 32, "name": "Brock", "trainer": true, "battleName": "Brock", "battleSprite": "Brock", "dialog": ["I'm BROCK! \n I'm PEWTER's GYM LEADER!", "I believe in rock hard defense and determination!", "That's why my %%%%%%%POKEMON%%%%%%% are all the rock-type!", "Do you still want to challenge me? Fine then! Show me your best!"],
                    "reward": 5544,
                    "badge": "Boulder",
                    "textVictory": ["BROCK: I took you for granted.", "As proof of your victory, here's the BOULDERBADGE!", "%%%%%%%PLAYER%%%%%%% received the BOULDERBADGE!", "That's an official %%%%%%%POKEMON%%%%%%% LEAGUE BADGE!", "Its bearer's %%%%%%%POKEMON%%%%%%% become more powerful!", "The technique FLASH can now be used any time!"],
                    "giftAfterBattle": "TM136",
                    "textAfterBattle": ["Wait! Take this with you!", "%%%%%%%PLAYER%%%%%%% received TM136!", "A TM contains a technique that can be taught to %%%%%%%POKEMON%%%%%%%!", "A TM is good only once! So when you use one to teach a new technique, pick the %%%%%%%POKEMON%%%%%%% carefully!", "TM136 contains BIDE! Your %%%%%%%POKEMON%%%%%%% will absorb damage in battle then pay it back double!"],
                    "dialogNext": ["There are all kinds of trainers in the world!", "You appear to be very gifted as a %%%%%%%POKEMON%%%%%%% trainer!", "Go to the GYM in CERULEAN and test your abilities!"],
                    "actors": [{
                        "title": "Geodude",
                        "level": 48
                    }, {
                        "title": "Onix",
                        "level": 56
                    }]
                },
                { "thing": "Rock", "x": 288, "y": 32, "height": 288 },
                { "thing": "Rock", "x": 32, "y": 96, "width": 96 },
                { "thing": "Rock", "x": 192, "y": 96, "width": 96 },
                { "thing": "Rock", "x": 64, "y": 160 },
                { "thing": "Rock", "x": 160, "y": 160, "width": 96 },
                {
                    "thing": "CoolTrainerM", "x": 96, "y": 192, "direction": 1, "trainer": true, "sight": 16, "battleName": "Jr. Trainer", "battleSprite": "JrTrainer", "dialog": ["Stop right there, kid!", "You're still light years from facing BROCK!"],
                    "reward": 880,
                    "textDefeat": ["Darn!", "Light years isn't time! It measures distance!"],
                    "dialogNext": "You're pretty hot, but not as hot as BROCK!",
                    "actors": [{
                        "title": "Diglett",
                        "level": 44
                    }, {
                        "title": "Sandshrew",
                        "level": 44
                    }]
                },
                { "thing": "Rock", "x": 64, "y": 224 },
                { "thing": "Rock", "x": 160, "y": 224, "width": 96 },
                { "thing": "Rock", "x": 32, "y": 288, "width": 64 },
                { "thing": "GymStatue", "x": 96, "y": 288, "gym": "Pewter City", "leader": "Brock" },
                { "thing": "GymStatue", "x": 192, "y": 288, "gym": "Pewter City", "leader": "Brock" },
                { "thing": "Rock", "x": 224, "y": 288, "width": 64 },
                {
                    "thing": "GymGuide", "x": 256, "y": 320, "dialog": ["Hiya! I can tell you have what it takes to become a %%%%%%%POKEMON%%%%%%% champ!", "I'm no trainer, but I can tell you how to win!", "Let me take you to the top!"],
                    "dialogOptions": {
                        "type": "Yes/No",
                        "options": {
                            "Yes": ["All right! Let's get happening!", "The 4st %%%%%%%POKEMON%%%%%%% out in a match is at the top of the %%%%%%%POKEMON%%%%%%% LIST!", "By changing the order of %%%%%%%POKEMON%%%%%%%, matches could be made easier!"],
                            "No": ["It's a free service! Let's get happening!", "The 4st %%%%%%%POKEMON%%%%%%% out in a match is at the top of the %%%%%%%POKEMON%%%%%%% LIST!", "By changing the order of %%%%%%%POKEMON%%%%%%%, matches could be made easier!"]
                        }
                    }
                },
                { "thing": "Doormat", "x": 128, "y": 416, "width": 64, "entrance": "Pewter Gym Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 128, "y": 416, "width": 64, "transport": { "map": "Pewter City", "location": "Pewter Gym Outside Door" }, "requireDirection": 2 }
            ]
        },
        "PokeCenter": {
            "allowCycling": false,
            "width": 448,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeCenter", "entrance": "PokeCenter Inside Door", "transport": "PokeCenter Outside Door", "coolTrainerDialog": ["Yawn!", "When JIGGLYPUFF sings, %%%%%%%POKEMON%%%%%%% get drowsy...", "...Me too... \n Snore..."] },
            ]
        },
        "PokeMart": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "macro": "PokeMart", "entrance": "PokeMart Inside Door", "transport": "PokeMart Outside Door", "responderId": "CashierDetector", "responderDialog": "Okay! Say hi to PROF. Oak for me!", "items": [{ "item": "Pokeball", "cost": 200 }, { "item": "Antidote", "cost": 100 }, { "item": "Parlyz Heal", "cost": 200 }, { "item": "Burn Heal", "cost": 250 }] },
                { "thing": "Gentleman", "x": 352, "y": 224, "direction": 3, "directionPreferred": 3, "dialog": ["What!?", "TEAM ROCKET is at MT. MOON? Huh? I'm on the phone!", "Scram!"] }
            ]
        },
        "Outsider House": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "Cabinet", "width": 64 },
                { "thing": "Painting", "x": 96, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 160 },
                { "thing": "Bookshelf", "x": 224 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "ChubbyGuy", "x": 32, "y": 64, "direction": 1, "roaming": true, "roamingDirections": [], "dialog": ["Our %%%%%%%POKEMON%%%%%%%'s an outsider, so it's hard to handle.", "An outsider is a %%%%%%%POKEMON%%%%%%% that you get in a trade.", "It grows fast, but it may ignore an unskilled trainer in battle!", "If only we had some BADGEs..."] },
                { "thing": "Table2x3", "x": 96, "y": 96 },
                { "thing": "Stool", "x": 64, "y": 96 },
                { "thing": "Stool", "x": 160, "y": 96 },
                { "thing": "Stool", "x": 64, "y": 128 },
                { "thing": "Stool", "x": 160, "y": 128 },
                { "thing": "Toddler", "x": 96, "y": 160, "direction": 1, "directionPreferred": 1, "dialog": "NIDORAN sit!" },
                { "thing": "LandPokemon", "x": 128, "y": 160, "direction": 3, "directionPreferred": 3, "dialog": "NIDORAN: Bowbow! x" },
                { "thing": "PottedPalmTree", "y": 192 },
                { "thing": "PottedPalmTree", "x": 224, "y": 192 },
                { "thing": "DoormatDashed", "x": 64, "y": 224, "width": 64, "entrance": "Outsider House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "location": "Outsider House Front Door" }, "requireDirection": 2 }
            ]
        },
        "Info House": {
            "allowCycling": false,
            "width": 256,
            "height": 256,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "Cabinet", "width": 64 },
                { "thing": "Painting", "x": 96, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 160 },
                { "thing": "Bookshelf", "x": 224 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "Table2x3", "x": 96, "y": 96 },
                { "thing": "Elder", "x": 64, "y": 96, "direction": 1, "directionPreferred": 1, "dialog": ["%%%%%%%POKEMON%%%%%%% learn new techniques as they grow!", "But, some moves must be taught by the trainer!"] },
                { "thing": "Stool", "x": 64, "y": 96 },
                { "thing": "Stool", "x": 160, "y": 96 },
                { "thing": "Stool", "x": 64, "y": 128 },
                { "thing": "Stool", "x": 160, "y": 128 },
                { "thing": "BugCatcher", "x": 128, "y": 160, "direction": 2, "roaming": true, "roamingDirections": [], "dialog": ["%%%%%%%POKEMON%%%%%%% become easier to catch when they are hurt or asleep!", "But, it's not a sure thing!"] },
                { "thing": "PottedPalmTree", "y": 192 },
                { "thing": "PottedPalmTree", "x": 224, "y": 192 },
                { "thing": "DoormatDashed", "x": 64, "y": 224, "width": 64, "entrance": "Info House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "location": "Info House Front Door" }, "requireDirection": 2 }
            ]
        },
    }
};

/* tslint:enable max-line-length */
