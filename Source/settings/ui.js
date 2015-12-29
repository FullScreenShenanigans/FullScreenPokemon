FullScreenPokemon.FullScreenPokemon.settings.ui = {
    "globalName": "FSP",
    "styleSheet": {
        ".FullScreenPokemon": {
            "color": "black"
        },
        "@font-face": {
            "font-family": "'Press Start'",
            "src": "url('Fonts/pressstart2p-webfont.eot')",
            "src": [
                    "url('Fonts/pressstart2p-webfont.eot?#iefix') format('embedded-opentype')",
                    "url('Fonts/pressstart2p-webfont.woff') format('woff')",
                    "url('Fonts/pressstart2p-webfont.ttf') format('truetype')",
                    "url('Fonts/pressstart2p-webfont.svg') format('svg')"
                ].join(", "),
            "font-weight": "normal",
            "font-style": "normal"
        }
    },
    "helpSettings": {
        "globalNameAlias": "{%%%%GAME%%%%}",
        "openings": [
            "Hi, thanks for playing FullScreenPokemon! It looks like you're using the console.",
            "There's not really any way to stop you from messing around so if you'd like to know the common cheats, enter `{%%%%GAME%%%%}.UserWrapper.displayHelpOptions()` here.",
            "If you'd like, go ahead and look around the source code. There are a few surprises you might have fun with... ;)",
            "http://www.github.com/DiogenesTheCynic/FullScreenPokemon"
        ],
        "options": {
            "Map": [{
                "title": "{%%%%GAME%%%%}.AreaSpawner.setMap",
                "description": "Go to a specified map and location.",
                "usage": "{%%%%GAME%%%%}.AreaSpawner.setMap(<map>[, <location>]);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.AreaSpawner.setMap('Lavender Town');",
                    "comment": "Starts map 'Lavender Town'."
                }, {
                    "code": "{%%%%GAME%%%%}.AreaSpawner.setMap('Lavender Town', 'TopEntrance');",
                    "comment": "Starts map 'Lavender Town', at the top entrance."
                //}, {
                //    "code": "{%%%%GAME%%%%}.AreaSpawner.setMap('Random');",
                //    "comment": "Starts the random map."
                //}, {
                //    "code": "{%%%%GAME%%%%}.AreaSpawner.setMap('Random', 'Underworld');",
                //    "comment": "Starts the random map in the Underworld."
                }]
            }],
            "Things": [{
                "title": "{%%%%GAME%%%%}.addThing",
                "description": "Adds a new Thing to the game.",
                "usage": "{%%%%GAME%%%%}.addThing(<thing>, left, top);",
                "examples": [{
                //    "code": "{%%%%GAME%%%%}.addThing('Goomba', 256, 384);",
                //    "comment": "Adds a Goomba to the game."
                //}, {
                //    "code": "{%%%%GAME%%%%}.addThing('Mushroom', {%%%%GAME%%%%}.player.right + 80, {%%%%GAME%%%%}.player.top);",
                //    "comment": "Adds a Mushroom to the right of the player."
                //}, {
                //    "code": "{%%%%GAME%%%%}.addThing(['Koopa', { 'smart': true }], 256, 368);",
                //    "comment": "Adds a smart Koopa to the game."
                //}, {
                //    "code": "{%%%%GAME%%%%}.addThing({%%%%GAME%%%%}.ObjectMaker.make('Koopa', { 'smart': true, 'jumping': true }), 256, 368);",
                //    "comment": "Adds a smart, jumping Koopa to the game."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.ObjectMaker.getProperties",
                "description": "Retrieves the defaults for different types of objects.",
                "usage": "{%%%%GAME%%%%}.ObjectMaker.getProperties();"
            }, {
                "title": "{%%%%GAME%%%%}.GroupHolder.get*******Group",
                "description": "Retrieves the appropriate group of Things being manipulated. Choices are 'Text', 'Character', 'Solid', and 'Scenery'.",
                "usage": "{%%%%GAME%%%%}.get*******Group();",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacterGroup();",
                    "comment": "Retrieves the currently playing Characters."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.GroupHolder.get*******",
                "description": "Retrieves the numbered Thing from its group.",
                "usage": "{%%%%GAME%%%%}.GroupHolder.get*******(<index>);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacter(0);",
                    "comment": "Retrieves the first playing Character."
                }, {
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacter({%%%%GAME%%%%}.GroupHolder.getCharacterGroup().length - 1);",
                    "comment": "Retrieves the last playing Character."
                }]
            }],
            "Physics": [{
                "title": "{%%%%GAME%%%%}.shiftBoth",
                "description": "Shifts a Thing horizontally and/or vertically.",
                "usage": "{%%%%GAME%%%%}.shiftBoth(<thing>, <dx>[, <dy>]);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.shiftBoth({%%%%GAME%%%%}.player, 700);",
                    "comment": "Shifts the player 700 spaces to the right"
                }, {
                    "code": "{%%%%GAME%%%%}.shiftBoth({%%%%GAME%%%%}.player, 0, -{%%%%GAME%%%%}.MapScreener.height);",
                    "comment": "Shifts the player to the top of the screen."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.killNormal",
                "description": "Kills a specified Character with animation.",
                "usage": "{%%%%GAME%%%%}.killNormal(<thing>)",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.killNormal({%%%%GAME%%%%}.GroupHolder.getCharacter(0)",
                    "comment": "Kills the first playing Character."
                }, {
                    "code": "{%%%%GAME%%%%}.GroupHolder.getSceneryGroup().forEach({%%%%GAME%%%%}.killNormal)",
                    "comment": "Kills all playing Scenery."
                }]
            }]
        }
    },
    "sizeDefault": "Wide",
    "sizes": {
        "GameBoy": {
            "width": 320,
            "height": 288
        },
        "NES": {
            "width": 512,
            "height": 464,
            "full": false
        },
        "Wide": {
            "width": Infinity,
            "height": 580,
            "full": false
        },
        "Large": {
            "width": Infinity,
            "height": Infinity,
            "full": false
        },
        "Full!": {
            "width": Infinity,
            "height": Infinity,
            "full": true
        }
    },
    "schemas": [
        {
            "title": "Options",
            "generator": "OptionsTable",
            "options": [
                {
                    "title": "Volume",
                    "type": "Number",
                    "minimum": 0,
                    "maximum": 100,
                    "source": function (FSP) {
                        return Math.round(FSP.AudioPlayer.getVolume() * 100);
                    },
                    "update": function (FSP, value) {
                        FSP.AudioPlayer.setVolume(value / 100);
                    }
                },
                {
                    "title": "Mute",
                    "type": "Boolean",
                    "source": function (FSP) {
                        return FSP.AudioPlayer.getMuted();
                    },
                    "enable": function (FSP) {
                        FSP.AudioPlayer.setMutedOn();
                    },
                    "disable": function (FSP) {
                        FSP.AudioPlayer.setMutedOff();
                    }
                },
                {
                    "title": "Speed",
                    "type": "Select",
                    "options": function (FSP) {
                        return [".25x", ".5x", "1x", "2x", "5x"];
                    },
                    "source": function (FSP) {
                        return "1x";
                    },
                    "update": function (FSP, value) {
                        FSP.GamesRunner.setSpeed(
                            Number(value.replace('x', ''))
                        );
                    },
                    "storeLocally": true
                },
                {
                    "title": "View Mode",
                    "type": "ScreenSize"
                },
                {
                    "title": "Framerate",
                    "type": "Select",
                    "options": function (FSP) {
                        return ["60fps", "30fps"];
                    },
                    "source": function (FSP) {
                        return (1 / FSP.PixelDrawer.getFramerateSkip() * 60) + "fps";
                    },
                    "update": function (FSP, value) {
                        var numeric = Number(value.replace("fps", ""));
                        FSP.PixelDrawer.setFramerateSkip(1 / numeric * 60);
                    },
                    "storeLocally": true
                },
                {
                    "title": "Tilt Controls",
                    "type": "Boolean",
                    "storeLocally": true,
                    "source": function (FSP) {
                        return false;
                    },
                    "enable": function (FSP) {
                        window.ondevicemotion = FSP.InputWriter.makePipe("ondevicemotion", "type");
                    },
                    "disable": function (FSP) {
                        window.ondevicemotion = undefined;
                    }
                }
            ],
            "actions": [
                {
                    "title": "Screenshot",
                    "action": function (FSP) {
                        FSP.takeScreenshot();
                    }
                }
            ]
        }, {
            "title": "Controls",
            "generator": "OptionsTable",
            "options": (function (controls) {
                return controls.map(function (title) {
                    return {
                        "title": title[0].toUpperCase() + title.substr(1),
                        "type": "Keys",
                        "storeLocally": true,
                        "source": function (FSP) {
                            return FSP.InputWriter
                                .getAliasAsKeyStrings(title)
                                .map(function (string) {
                                    return string.toLowerCase();
                                });
                        },
                        "callback": function (FSP, valueOld, valueNew) {
                            FSP.InputWriter.switchAliasValues(
                                title,
                                [FSP.InputWriter.convertKeyStringToAlias(valueOld)],
                                [FSP.InputWriter.convertKeyStringToAlias(valueNew)]
                            );
                        }
                    };
                });
            })(["a", "b", "left", "right", "up", "down", "pause"])
        //}, {
        //    "title": "Mods!",
        //    "generator": "OptionsButtons",
        //    "keyActive": "enabled",
        //    "assumeInactive": true,
        //    "options": function (FSP) {
        //        return FSP.ModAttacher.getMods();
        //    },
        //    "callback": function (FSP, schema, button) {
        //        FSP.ModAttacher.toggleMod(button.getAttribute("value") || button.textContent);
        //    }
        //}, {
        //    "title": "Editor",
        //    "generator": "LevelEditor"
        //}, {
        //    "title": "Maps",
        //    "generator": "MapsGrid",
        //    "extras": {
        //        "Map Generator!": (function () {
        //            var shuffle = function (string) {
        //                return string
        //                    .split('')
        //                    // Same function used in browserchoice.eu :)
        //                    .sort(function () {
        //                        return 0.5 - Math.random()
        //                    })
        //                    .reverse()
        //                    .join('');
        //            };
                    
        //            var getNewSeed = function () {
        //                return shuffle(String(new Date().getTime()));
        //            };
                    
        //            return {
        //                "title": "Map Generator!",
        //                "callback": function (FSP, schema, button, event) {
        //                    var parent = event.target.parentNode,
        //                        randomizer = parent.querySelector(".randomInput");
                                
        //                    randomizer.value = randomizer.value.replace(/[^\d]/g, '');
        //                    if (!randomizer.value) {
        //                        randomizer.value = getNewSeed();
        //                    }
                            
        //                    FSP.LevelEditor.disable();
        //                    FSP.NumberMaker.resetFromSeed(randomizer.value);
        //                    FSP.setMap("Random");
                            
        //                    if (!randomizer.getAttribute("custom")) {
        //                        randomizer.value = getNewSeed();
        //                    }
        //                },
        //                "extraElements": [
        //                    [
        //                        "input", {
        //                            "className": "randomInput maps-grid-input",
        //                            "type": "text",
        //                            "value": getNewSeed(),
        //                            "onchange": function (event) {
        //                                event.target.setAttribute("custom", true)
        //                            }
        //                        }
        //                    ]
        //                ]
        //            };
        //        })()
        //    },
        //    "callback": function (FSP, schema, button, event) {
        //        FSP.LevelEditor.disable();
        //        FSP.setMap(button.getAttribute("value") || button.textContent);
        //    }
        }
    ]
};