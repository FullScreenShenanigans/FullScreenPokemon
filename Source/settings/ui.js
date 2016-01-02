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