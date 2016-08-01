/// <reference path="../FullScreenPokemon.ts" />

module FullScreenPokemon {
    "use strict";

    FullScreenPokemon.settings.help = {
        "aliases": [
            ["{GAME}", "FSP"]
        ],
        "openings": [
            ["%cHi, thanks for playing FullScreenPokemon!%c :)", "head"],
            ["If you'd like to know the common cheats, enter %c{GAME}.UsageHelper.displayHelpOptions();%c here.", "code"],
            "http://www.github.com/FullScreenShenanigans/FullScreenPokemon"
        ],
        "options": {
            "Map": [
                {
                    "title": "{GAME}.setMap",
                    "description": "Go to a specified map and location.",
                    "usage": "{GAME}.setMap(<map>[, <location>]);",
                    "examples": [
                        {
                            "code": `{GAME}.setMap("Pallet Town");`,
                            "comment": "Starts the Pallet Town map."
                        }, {
                            "code": `{GAME}.setMap("Pallet Town", "Oak's Lab Door");`,
                            "comment": "Starts the Pallet Town map, at Oak's lab."
                        }]
                }],
            "Things": [
                {
                    "title": "{GAME}.addThing",
                    "description": "Adds a new Thing to the game.",
                    "usage": "{GAME}.addThing(<thing>, left, top);",
                    "examples": [
                        {
                            "code": `{GAME}.addThing("BugCatcher", 256, 384);`,
                            "comment": "Adds a BugCatcher to the game."
                        }, {
                            "code": `{GAME}.addThing("BugCatcher", {GAME}.player.right + 80, {GAME}.player.top);`,
                            "comment": "Adds a BugCatcher to the right of the player."
                        }, {
                            "code": `{GAME}.addThing(["BugCatcher", { "dialog": "Hello world!" }], 256, 368);`,
                            "comment": "Adds a talkative BugCatcher to the game."
                        }, {
                            "code": `{GAME}.addThing({GAME}.ObjectMaker.make("BugCatcher", { "dialog": "Hello world!" }), 256, 368);`,
                            "comment": "Adds a talkative BugCatcher to the game."
                        }]
                }, {
                    "title": "{GAME}.GroupHolder.getGroups",
                    "description": "Gets the groups of in-game Things.",
                    "usage": "{GAME}.GroupHolder.getGroups();"
                }, {
                    "title": "{GAME}.GroupHolder.get*******Group",
                    "description": "Retrieves the group of in-game Things under that name.",
                    "usage": "{GAME}.GroupHolder.get*******Group();",
                    "examples": [
                        {
                            "code": "{GAME}.GroupHolder.getCharacterGroup();",
                            "comment": "Retrieves the currently playing Characters."
                        }]
                }, {
                    "title": "{GAME}.GroupHolder.get*******",
                    "description": "Retrieves the numbered Thing from its group.",
                    "usage": "{GAME}.GroupHolder.get*******(<index>);",
                    "examples": [
                        {
                            "code": "{GAME}.GroupHolder.getCharacter(0);",
                            "comment": "Retrieves the first playing Character."
                        }]
                }],
            "Physics": [
                {
                    "title": "{GAME}.shiftBoth",
                    "description": "Shifts a Thing horizontally and/or vertically.",
                    "usage": "{GAME}.shiftBoth(<thing>, <dx>[, <dy>]);",
                    "examples": [
                        {
                            "code": "{GAME}.shiftBoth({GAME}.player, 700);",
                            "comment": "Shifts the player 700 spaces to the right"
                        }, {
                            "code": "{GAME}.player.resting = undefined;\r\n{GAME}.shiftBoth({GAME}.player, 0, -{GAME}.player.top);",
                            "comment": "Shifts the player to the top of the screen."
                        }]
                }, {
                    "title": "{GAME}.killNormal",
                    "description": "Kills a specified Character with animation.",
                    "usage": "{GAME}.killNormal(<thing>);",
                    "examples": [
                        {
                            "code": "{GAME}.killNormal({GAME}.GroupHolder.getCharacter(0));",
                            "comment": "Kills the first playing Character."
                        }, {
                            "code": "{GAME}.GroupHolder.getSceneryGroup().forEach({GAME}.killNormal.bind(FSM));",
                            "comment": "Kills all playing Scenery."
                        }]
                }]
        },
        "optionHelp": `To focus on a group, enter %c{GAME}.UsageHelper.displayHelpOption("<group-name>");%c`
    };
}
