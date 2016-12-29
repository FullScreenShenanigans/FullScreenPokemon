import { IMapRaw } from "../../components/Maps";

/* tslint:disable max-line-length */

export const PalletTown: IMapRaw = {
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
            "xloc": 96,
            "yloc": 160,
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
            "width": 608,
            "height": 544,
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
                { "thing": "AreaSpawner", "width": 608, "height": 544, "map": "Route 1", "area": "Land", "direction": 0 },
                { "thing": "FenceWide", "width": 320 },
                { "thing": "Grass", "x": 320, "width": 64 },
                { "thing": "CutsceneTriggerer", "x": 320, "width": 64, "cutscene": "OakIntro", "singleUse": true, "requireOverlap": true, "id": "OakIntroGrassTriggerer" },
                { "thing": "FenceWide", "x": 384, "width": 256 },
                { "thing": "FenceWide", "y": 32, "height": 512 },
                { "thing": "DirtMedium", "width": 640 },
                { "thing": "DirtMedium", "y": 32, "width": 64, "height": 512 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 32, "xnum": 16, "ynum": 2, "offset": 4 },
                { "thing": "DirtMedium", "x": 576, "y": 32, "height": 512, "width": 64 },
                { "thing": "FenceWide", "x": 608, "y": 32, "height": 512 },
                { "macro": "House", "x": 128, "y": 64, "stories": 2, "door": true, "entrance": "Player's House Door", "transport": { "map": "Pallet Town", "location": "Player's House Floor 1 Door" } },
                { "macro": "House", "x": 384, "y": 64, "stories": 2, "door": true, "entrance": "Rival's House Door", "transport": { "map": "Pallet Town", "location": "Rival's House Floor 1 Door" } },
                { "thing": "DirtLight", "x": 64, "y": 96, "width": 64, "height": 64 },
                { "thing": "DirtLight", "x": 320, "y": 96, "width": 64, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 96, "xnum": 6, "ynum": 2 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 384, "y": 96, "xnum": 6, "ynum": 2 },
                { "thing": "Sign", "x": 96, "y": 128, "dialog": "%%%%%%%PLAYER%%%%%%%'s house" },
                { "thing": "Sign", "x": 352, "y": 128, "dialog": "%%%%%%%RIVAL%%%%%%%'s house" },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 160, "xnum": 16, "ynum": 2 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 64, "y": 224, "xnum": 2, "ynum": 6 },
                { "thing": "Lady", "x": 96, "y": 224, "roaming": true, "dialog": ["I'm raising %%%%%%%POKEMON%%%%%%% too!", "When they get strong, they can protect me!"] },
                { "thing": "DirtLight", "x": 128, "y": 224, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 256, "y": 224, "xnum": 2, "ynum": 6 },
                { "macro": "HouseLarge", "x": 320, "y": 224, "width": 192, "height": 128, "door": true, "stories": 2, "white": { "start": 336, "end": 384 }, "id": "Oak's Lab Door", "entrance": "Oak's Lab Door", "transport": { "map": "Pallet Town", "location": "Oak's Lab Floor 1 Door" } },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 320, "y": 224, "xnum": 8, "ynum": 4 },
                { "thing": "FenceVertical", "x": 128, "y": 256, "width": 96 },
                { "thing": "Sign", "x": 224, "y": 256, "dialog": "PALLET TOWN \n Shades of your journey await!" },
                { "thing": "DirtMedium", "x": 128, "y": 288, "width": 128, "height": 64 },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 128, "y": 304, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "macro": "Checkered", "things": ["DirtClean", "DirtWhite"], "x": 128, "y": 352, "xnum": 4, "ynum": 2 },
                { "thing": "DirtLight", "x": 320, "y": 352, "width": 256, "height": 64 },
                { "thing": "FenceVertical", "x": 320, "y": 384, "width": 96 },
                { "thing": "Sign", "x": 416, "y": 384, "dialog": "Oak %%%%%%%POKEMON%%%%%%% Research Lab" },
                { "thing": "FenceVertical", "x": 448, "y": 384, "width": 64 },
                { "thing": "DirtMedium", "x": 64, "y": 416, "width": 64, "height": 128 },
                { "macro": "Water", "x": 128, "y": 416, "width": 128, "height": 128, "open": [false, false, true, false] },
                { "thing": "DirtLight", "x": 256, "y": 416, "width": 64, "height": 128 },
                { "thing": "DirtMedium", "x": 320, "y": 416, "width": 192, "height": 64 },
                { "thing": "Fatty", "x": 352, "y": 416, "roaming": true, "dialog": ["Technology is incredible!", "You can now store and recall items and %%%%%%%POKEMON%%%%%%% as data via PC!"] },
                { "macro": "Checkered", "things": ["", "Flower"], "x": 320, "y": 432, "xnum": 8, "ynum": 2, "xwidth": 16, "yheight": 16 },
                { "thing": "DirtLight", "x": 512, "y": 416, "width": 64, "height": 128 },
                { "thing": "DirtLight", "x": 320, "y": 480, "width": 192, "height": 64 },
                { "thing": "FenceWide", "x": 256, "y": 512, "width": 352 },
                { "thing": "FenceWide", "x": 32, "y": 512 },
                { "thing": "AreaSpawner", "y": 512, "map": "Route 21", "area": "Land", "direction": 2 }
            ]
        },
        "Player's House": {
            "allowCycling": false,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "WindowBlinds", "x": 96 },
                { "thing": "WindowBlinds", "x": 160 },
                { "thing": "WindowBlinds", "x": 224 },
                { "thing": "Bookshelf", "width": 64 },
                { "thing": "TelevisionMonitor", "x": 96, "y": 32, "dialogDirections": true, "dialog": ["Oops, wrong side.", "Oops, wrong side.", ["There's a movie on TV. Four boys are walking on railroad tracks.", "I better go too."], "Oops, wrong side."] },
                { "thing": "StairsUp", "x": 224, "y": 32, "entrance": "Player's House Floor 1 Stairs", "transport": { "map": "Pallet Town", "location": "Player's House Floor 2 Stairs" } },
                { "thing": "Table2x3", "x": 96, "y": 128 },
                { "thing": "Stool", "x": 64, "y": 128 },
                { "thing": "Stool", "x": 64, "y": 160 },
                { "thing": "Stool", "x": 160, "y": 128 },
                { "thing": "Stool", "x": 160, "y": 160 },
                { "thing": "FlowerVase", "x": 116, "y": 136 },
                { "thing": "Mother", "x": 160, "y": 128, "direction": 3, "directionPreferred": 12, "dialog": ["MOM: Right. All boys leave home some day. It said so on TV.", "PROF.OAK, next door, is looking for you."] },
                { "thing": "DoormatDotted", "x": 64, "y": 224, "width": 64, "entrance": "Player's House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "map": "Pallet Town", "location": "Player's House Door" }, "requireDirection": 2 }
            ]
        },
        "Player's House Floor 2": {
            "allowCycling": false,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
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
                { "thing": "Table2x2", "x": 32, "tolBottom": 0 },
                { "thing": "StairsDown", "x": 224, "y": 32, "entrance": "Player's House Floor 2 Stairs", "transport": { "map": "Pallet Town", "location": "Player's House Floor 1 Stairs" } },
                { "thing": "WindowBlinds", "x": 160 },
                { "thing": "WindowBlinds", "x": 224 },
                { "thing": "ConsoleAndController", "x": 96, "y": 128, "dialog": "%%%%%%%PLAYER%%%%%%% is playing the SNES! ...Okay! It's time to go!" },
                { "thing": "TelevisionMonitor", "x": 96, "y": 96 },
                { "thing": "BedSingle", "y": 192 },
                { "thing": "PottedPalmTree", "x": 192, "y": 192 }
            ]
        },
        "Rival's House": {
            "allowCycling": false,
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorHorizontalBands", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "FloorTiledDiagonal", "y": 32, "width": 256, "height": 224 },
                { "thing": "Cabinet", "width": 64 },
                { "thing": "Painting", "x": 96, "dialog": "A TOWN MAP." },
                { "thing": "Window", "x": 160 },
                { "thing": "Bookshelf", "x": 224 },
                { "thing": "Table2x3", "x": 96, "y": 96 },
                { "thing": "Book", "x": 96, "y": 96, "id": "Book", "dialog": "It's a big map! This is useful!" },
                { "thing": "Daisy", "x": 64, "y": 96, "direction": 1, "directionPreferred": 4, "dialog": "Hi %%%%%%%PLAYER%%%%%%%! %%%%%%%RIVAL%%%%%%% is out at Grandpa's lab." },
                { "thing": "Stool", "x": 64, "y": 96 },
                { "thing": "Stool", "x": 64, "y": 128 },
                { "thing": "Stool", "x": 160, "y": 96 },
                { "thing": "Stool", "x": 160, "y": 128 },
                { "thing": "PottedPalmTree", "y": 192 },
                { "thing": "PottedPalmTree", "x": 224, "y": 192 },
                { "thing": "DoormatDotted", "x": 64, "y": 224, "width": 64, "entrance": "Rival's House Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 64, "y": 224, "width": 64, "transport": { "map": "Pallet Town", "location": "Rival's House Door" }, "requireDirection": 2 }
            ]
        },
        "Oak's Lab": {
            "allowCycling": false,
            "theme": "Oak Research Lab",
            "invisibleWallBorders": true,
            "creation": [
                { "thing": "WallIndoorLightWithDarkBottom", "width": 256 },
                { "thing": "InvisibleWall", "width": 256 },
                { "thing": "Table2x2", "y": 16, "width": 128 },
                { "thing": "LabComputer", "y": 32, "dialog": ["There's an e-mail message here!", "...", "Calling all %%%%%%%POKEMON%%%%%%% trainers!", "The elite trainers of %%%%%%%POKEMON%%%%%%% LEAGUE are ready to take on all comers!", "Bring your best %%%%%%%POKEMON%%%%%%% and see how you rate as a trainer!", "%%%%%%%POKEMON%%%%%%% LEAGUE HQ INDIGO PLATEAU", "PS: PROF. OAK, please visit us! ..."] },
                { "thing": "Book", "x": 64, "y": 32, "id": "BookLeft", "dialog": "It's encyclopedia- like, but the pages are blank!" },
                { "thing": "Book", "x": 96, "y": 32, "id": "BookRight", "dialog": "It's encyclopedia- like, but the pages are blank!" },
                { "thing": "FloorLinedHorizontal", "y": 32, "width": 320, "height": 352 },
                { "thing": "AsianScroll", "x": 128, "dialog": "Push START to open the MENU!" },
                { "thing": "AsianScroll", "x": 160, "dialog": "The SAVE option is on the MENU screen." },
                { "thing": "Oak", "x": 160, "y": 64, "id": "Oak", "hidden": true, "nocollide": true },
                { "thing": "Rival", "x": 128, "y": 96, "id": "Rival", "dialog": "Yo %%%%%%%PLAYER%%%%%%%! Gramps isn't around!" },
                { "thing": "Table3x1", "x": 192, "y": 96 },
                { "thing": "Pokeball", "x": 192, "y": 96, "id": "PokeballCHARMANDER", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"], "description": "fire" },
                { "thing": "Pokeball", "x": 224, "y": 96, "id": "PokeballSQUIRTLE", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["S", "Q", "U", "I", "R", "T", "L", "E"], "description": "water" },
                { "thing": "Pokeball", "x": 256, "y": 96, "id": "PokeballBULBASAUR", "action": "cutscene", "cutscene": "OakIntroPokemonChoice", "pokemon": ["B", "U", "L", "B", "A", "S", "A", "U", "R"], "description": "plant" },
                { "thing": "Bookshelf", "x": 192, "width": 128 },
                { "thing": "Bookshelf", "y": 192, "width": 128 },
                { "thing": "Bookshelf", "x": 192, "y": 192, "width": 128 },
                { "thing": "MenuTriggerer", "x": 128, "y": 224, "width": 128, "id": "OakBlocker", "pushSteps": [{ direction: 0, blocks: 1 }], "keepAlive": true, "nocollide": true, "dialog": "OAK: Hey! Don't go away yet!" },
                { "thing": "CutsceneTriggerer", "x": 128, "y": 192, "width": 128, "id": "RivalBlocker", "cutscene": "OakIntroRivalBattle", "routine": "Approach", "nocollide": true },
                { "thing": "Lady", "x": 32, "y": 288, "dialog": ["PROF.OAK is the authority on %%%%%%%POKEMON%%%%%%%!", "Many %%%%%%%POKEMON%%%%%%% trainers hold him in high regard!"], "roaming": true, "roamingDirections": [0, 8] },
                { "thing": "Scientist", "x": 64, "y": 320, "name": "Scientist One", "dialog": "I study %%%%%%%POKEMON%%%%%%% as PROF.OAK's aide.", "roaming": true, "roamingDirections": [] },
                { "thing": "Scientist", "x": 256, "y": 320, "name": "Scientist Two", "dialog": "I study %%%%%%%POKEMON%%%%%%% as PROF.OAK's aide.", "roaming": true, "roamingDirections": [] },
                { "thing": "Doormat", "x": 128, "y": 352, "id": "DoormatLeft" },
                { "thing": "Doormat", "x": 160, "y": 352, "id": "DoormatRight", "entrance": "Oak's Lab Floor 1 Door" },
                { "thing": "HiddenTransporter", "x": 128, "y": 352, "width": 64, "transport": { "map": "Pallet Town", "location": "Oak's Lab Door" }, "requireDirection": 2 },
            ]
        }
    }
};

/* tslint:enable max-line-length */
