import { FullScreenPokemon } from "../../FullScreenPokemon";

/* tslint:disable max-line-length */

FullScreenPokemon.prototype.settings.maps.library["Pallet Town"] = {
    "name": "Pallet Town",
    "theme": "Pallet Town",
    "locationDefault": "Player's House Door",
    "locations": {
        "Player's House Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Player's House Floor 1 Door": {
            "area": "Player's House",
            "direction": 0
        },
        "Player's House Floor 1 Stairs": {
            "area": "Player's House",
            "direction": 3
        },
        "Player's House Floor 2 Stairs": {
            "area": "Player's House Floor 2",
            "direction": 3
        },
        "Start Game": {
            "area": "Player's House Floor 2",
            "xloc": 24,
            "yloc": 40,
            "direction": 0
        },
        "Rival's House Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Rival's House Floor 1 Door": {
            "area": "Rival's House",
            "direction": 0
        },
        "Oak's Lab Door": {
            "area": "Land",
            "direction": 2,
            "push": true
        },
        "Oak's Lab Floor 1 Door": {
            "area": "Oak's Lab",
            "direction": 0
        }
    },
    "areas": {
        "Land": {
            "allowCycling": true,
            "width": 152,
            "height": 136,
            "wildPokemon": {
                "grass": [{
                    "title": "PIDGEY".split(""),
                    "levels": [2, 3, 4, 5],
                    "rate": .55
                }, {
                    "title": "RATTATA".split(""),
                    "levels": [2, 3, 4],
                    "rate": .45
                }],
                "fishing": {
                    "old": [{
                        "title": "MAGIKARP".split(""),
                        "levels": [5],
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
                        "levels": [15],
                        "rate": .5
                    }, {
                        "title": "TENTACOOL".split(""),
                        "levels": [15],
                        "rate": .5
                    }]
                }
            },
            "creation": [
                { "thing": "AreaSpawner", "width": 152, "height": 136, "map": "Route 1", "area": "Land", "direction": 0 },
                { "thing": "FenceWide", "width": 80 },
                { "thing": "Grass", "x": 80, "width": 16 },
                { "thing": "CutsceneTriggerer", "x": 80, "width": 16, "cutscene": "OakIntro", "singleUse": true, "requireOverlap": true, "id": "OakIntroGrassTriggerer" },
                { "thing": "FenceWide", "x": 96, "width": 64 },
                { "thing": "FenceWide", "y": 8, "height": 128 },
                { "thing": "DirtMedium", "width": 160 },
                { "thing": "DirtMedium", "y": 8, "width": 16, "height": 128 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 16, "y": 8, "xnum": 16, "ynum": 2, "offset": 1 },
                { "thing": "DirtMedium", "x": 144, "y": 8, "height": 128, "width": 16 },
                { "thing": "FenceWide", "x": 152, "y": 8, "height": 128 },
                { "macro": "House", "x": 32, "y": 16, "stories": 2, "door": true, "entrance": "Player's House Door", "transport": { "map": "Pallet Town", "location": "Player's House Floor 1 Door" } },
                { "macro": "House", "x": 96, "y": 16, "stories": 2, "door": true, "entrance": "Rival's House Door", "transport": { "map": "Pallet Town", "location": "Rival's House Floor 1 Door" } },
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
                { "macro": "HouseLarge", "x": 80, "y": 56, "width": 48, "height": 32, "door": true, "stories": 2, "white": { "start": 84, "end": 96 }, "id": "Oak's Lab Door", "entrance": "Oak's Lab Door", "transport": { "map": "Pallet Town", "location": "Oak's Lab Floor 1 Door" } },
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
                { "thing": "FenceWide", "x": 8, "y": 128 },
                { "thing": "AreaSpawner", "y": 128, "map": "Route 21", "area": "Land", "direction": 2 }
            ]
        },
        "Player's House": {
            "allowCycling": false,
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
                { "thing": "StairsUp", "x": 56, "y": 8, "entrance": "Player's House Floor 1 Stairs", "transport": { "map": "Pallet Town", "location": "Player's House Floor 2 Stairs" } },
                { "thing": "Table2x3", "x": 24, "y": 32 },
                { "thing": "Stool", "x": 16, "y": 32 },
                { "thing": "Stool", "x": 16, "y": 40 },
                { "thing": "Stool", "x": 40, "y": 32 },
                { "thing": "Stool", "x": 40, "y": 40 },
                { "thing": "FlowerVase", "x": 29, "y": 34 },
                { "thing": "Mother", "x": 40, "y": 32, "direction": 3, "directionPreferred": 3, "dialog": ["MOM: Right. All boys leave home some day. It said so on TV.", "PROF.OAK, next door, is looking for you."] },
                { "thing": "DoormatDotted", "x": 16, "y": 56, "width": 16, "entrance": "Player's House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "map": "Pallet Town", "location": "Player's House Door" }, "requireDirection": 2 }
            ]
        },
        "Player's House Floor 2": {
            "allowCycling": false,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                {
                    "thing": "ComputerDesk", "dialog":
                    [
                        "We've watched while the stars burned out, and creation played in reverse.",
                        "The universe freezing in half light.",
                        "Once I thought to escape.",
                        "To end the end a master, step out of the path of collapse.",
                        "Escape would make us god.",
                        "Yet I cannot help remember one enigma.",
                        "A hybrid, elusive destroyer.",
                        "This is the only mystery I have not solved.",
                        "The only element unaccounted for.",
                        "Even S'bhuth is no more, he saved his entire race, but in the end, frozen by despair, he joined the chaos he sought to evade.",
                        "But you were dead a thousand times.",
                        "Hopeless encounters successfully won.",
                        "A man long dead, grafted to machines your builders did not understand.",
                        "You follow the path, fitting into an infinite pattern.",
                        "Yours to manipulate, to destroy and rebuild.",
                        "Now, in the quantum moment before the closure, when all become one.",
                        "One moment left.",
                        "One point of space and time.",
                        "I know who you are.",
                        "",
                        "You are destiny."
                    ]
                },
                { "thing": "Table2x2", "x": 8, "tolBottom": 0 },
                { "thing": "StairsDown", "x": 56, "y": 8, "entrance": "Player's House Floor 2 Stairs", "transport": { "map": "Pallet Town", "location": "Player's House Floor 1 Stairs" } },
                { "thing": "WindowBlinds", "x": 40 },
                { "thing": "WindowBlinds", "x": 56 },
                { "thing": "ConsoleAndController", "x": 24, "y": 32, "dialog": "%%%%%%%PLAYER%%%%%%% is playing the SNES! ...Okay! It's time to go!" },
                { "thing": "TelevisionMonitor", "x": 24, "y": 24 },
                { "thing": "BedSingle", "y": 48 },
                { "thing": "PottedPalmTree", "x": 48, "y": 48 }
            ]
        },
        "Rival's House": {
            "allowCycling": false,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "FloorTiledDiagonal", "y": 8, "width": 64, "height": 56 },
                { "thing": "Cabinet", "width": 16 },
                { "thing": "Painting", "x": 24, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 40 },
                { "thing": "Bookshelf", "x": 56 },
                { "thing": "Table2x3", "x": 24, "y": 24 },
                { "thing": "Book", "x": 24, "y": 24, "id": "Book", "dialog": "It's a big map! This is useful!" },
                { "thing": "Daisy", "x": 16, "y": 24, "direction": 1, "directionPreferred": 1, "dialog": "Hi %%%%%%%PLAYER%%%%%%%! %%%%%%%RIVAL%%%%%%% is out at Grandpa's lab." },
                { "thing": "Stool", "x": 16, "y": 24 },
                { "thing": "Stool", "x": 16, "y": 32 },
                { "thing": "Stool", "x": 40, "y": 24 },
                { "thing": "Stool", "x": 40, "y": 32 },
                { "thing": "PottedPalmTree", "y": 48 },
                { "thing": "PottedPalmTree", "x": 56, "y": 48 },
                { "thing": "DoormatDotted", "x": 16, "y": 56, "width": 16, "entrance": "Rival's House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 16, "y": 56, "width": 16, "transport": { "map": "Pallet Town", "location": "Rival's House Door" }, "requireDirection": 2 }
            ]
        },
        "Oak's Lab": {
            "allowCycling": false,
            "theme": "Oak Research Lab",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorLightWithDarkBottom", "width": 64 },
                { "thing": "InvisibleWall", "width": 64 },
                { "thing": "Table2x2", "y": 4, "width": 32 },
                { "thing": "LabComputer", "y": 8, "dialog": ["There's an e-mail message here!", "...", "Calling all %%%%%%%POKEMON%%%%%%% trainers!", "The elite trainers of %%%%%%%POKEMON%%%%%%% LEAGUE are ready to take on all comers!", "Bring your best %%%%%%%POKEMON%%%%%%% and see how you rate as a trainer!", "%%%%%%%POKEMON%%%%%%% LEAGUE HQ INDIGO PLATEAU", "PS: PROF. OAK, please visit us! ..."] },
                { "thing": "Book", "x": 16, "y": 8, "id": "BookLeft", "dialog": "It's encyclopedia- like, but the pages are blank!" },
                { "thing": "Book", "x": 24, "y": 8, "id": "BookRight", "dialog": "It's encyclopedia- like, but the pages are blank!" },
                { "thing": "FloorLinedHorizontal", "y": 8, "width": 80, "height": 88 },
                { "thing": "AsianScroll", "x": 32, "dialog": "Push START to open the MENU!" },
                { "thing": "AsianScroll", "x": 40, "dialog": "The SAVE option is on the MENU screen." },
                { "thing": "Oak", "x": 40, "y": 16, "id": "Oak", "hidden": true, "nocollide": true },
                { "thing": "Rival", "x": 32, "y": 24, "id": "Rival", "dialog": "Yo %%%%%%%PLAYER%%%%%%%! Gramps isn't around!" },
                { "thing": "Table3x1", "x": 48, "y": 24 },
                { "thing": "Pokeball", "x": 48, "y": 24, "id": "PokeballCHARMANDER", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"], "description": "fire" },
                { "thing": "Pokeball", "x": 56, "y": 24, "id": "PokeballSQUIRTLE", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["S", "Q", "U", "I", "R", "T", "L", "E"], "description": "water" },
                { "thing": "Pokeball", "x": 64, "y": 24, "id": "PokeballBULBASAUR", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["B", "U", "L", "B", "A", "S", "A", "U", "R"], "description": "plant" },
                { "thing": "Bookshelf", "x": 48, "width": 32 },
                { "thing": "Bookshelf", "y": 48, "width": 32 },
                { "thing": "Bookshelf", "x": 48, "y": 48, "width": 32 },
                { "thing": "MenuTriggerer", "x": 32, "y": 56, "width": 32, "id": "OakBlocker", "pushDirection": 0, "pushSteps": [1], "keepAlive": true, "nocollide": true, "dialog": "OAK: Hey! Don't go away yet!" },
                { "thing": "CutsceneTriggerer", "x": 32, "y": 48, "width": 32, "id": "RivalBlocker", "cutscene": "OakIntroRivalBattle", "routine": "Approach", "nocollide": true },
                { "thing": "Lady", "x": 8, "y": 72, "dialog": ["PROF.OAK is the authority on %%%%%%%POKEMON%%%%%%%!", "Many %%%%%%%POKEMON%%%%%%% trainers hold him in high regard!"], "roaming": true, "roamingDirections": [0, 2] },
                { "thing": "Scientist", "x": 16, "y": 80, "name": "Scientist One", "dialog": "I study %%%%%%%POKEMON%%%%%%% as PROF.OAK's aide.", "roaming": true, "roamingDirections": [] },
                { "thing": "Scientist", "x": 64, "y": 80, "name": "Scientist Two", "dialog": "I study %%%%%%%POKEMON%%%%%%% as PROF.OAK's aide.", "roaming": true, "roamingDirections": [] },
                { "thing": "Doormat", "x": 32, "y": 88, "id": "DoormatLeft" },
                { "thing": "Doormat", "x": 40, "y": 88, "id": "DoormatRight", "entrance": "Oak's Lab Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 32, "y": 88, "width": 16, "transport": { "map": "Pallet Town", "location": "Oak's Lab Door" }, "requireDirection": 2 },
            ]
        }
    }
} as any;

/* tslint:enable max-line-length */
