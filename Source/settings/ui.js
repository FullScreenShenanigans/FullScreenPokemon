/// <reference path="../FullScreenPokemon.ts" />
var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.ui = {
        "globalName": "FSP",
        "styleSheet": {
            ".FullScreenPokemon": {
                "color": "black"
            },
            "@font-face": {
                "font-family": "'Press Start'",
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
                            FSP.GamesRunner.setSpeed(Number(value.replace("x", "")));
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
                            var numeric = parseInt(value.replace("fps", ""), 10);
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
                    },
                    {
                        "title": "Auto Save",
                        "type": "Boolean",
                        "storeLocally": true,
                        "source": function (FSP) {
                            return true;
                        },
                        "enable": function (FSP) {
                            FSP.ItemsHolder.toggle("autoSave");
                        },
                        "disable": function (FSP) {
                            FSP.ItemsHolder.toggle("autoSave");
                        }
                    }
                ],
                "actions": [
                    {
                        "title": "Screenshot",
                        "action": function (FSP) {
                            FSP.takeScreenshot("FullScreenPokemon " + Date.now());
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
                                    .map(function (text) { return text.toLowerCase(); });
                            },
                            "callback": function (FSP, valueOld, valueNew) {
                                FSP.InputWriter.switchAliasValues(title, [FSP.InputWriter.convertKeyStringToAlias(valueOld)], [FSP.InputWriter.convertKeyStringToAlias(valueNew)]);
                            }
                        };
                    });
                })(["a", "b", "left", "right", "up", "down", "pause"])
            }, {
                "title": "Mods!",
                "generator": "OptionsButtons",
                "keyActive": "enabled",
                "assumeInactive": true,
                "options": function (FSP) {
                    var mods = FSP.ModAttacher.getMods(), output = [], mod;
                    for (var i in mods) {
                        if (!mods.hasOwnProperty(i)) {
                            continue;
                        }
                        mod = mods[i];
                        output.push({
                            "title": mod.name,
                            "source": function () { return mod.enabled; },
                            "storeLocally": true,
                            "type": "text"
                        });
                    }
                    return output;
                },
                "callback": function (FSM, schema, button) {
                    var name = button.textContent, key = button.getAttribute("localStorageKey"), mod = FSM.ModAttacher.getMod(name);
                    FSM.ModAttacher.toggleMod(name);
                    FSM.ItemsHolder.setItem(key, mod.enabled);
                    FSM.ItemsHolder.saveItem(key);
                }
            }
        ]
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
