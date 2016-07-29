/// <reference path="../FullScreenPokemon.ts" />
var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.menus = {
        "aliases": {
            " ": "Space",
            "(": "LeftParenthesis",
            ")": "RightParenthesis",
            ":": "Colon",
            ";": "Semicolon",
            "[": "LeftSquareBracket",
            "]": "RightSquareBracket",
            "-": "Hyphen",
            "MDash": "MDash",
            "_": "Underscore",
            "?": "QuestionMark",
            "!": "ExclamationMark",
            "/": "Slash",
            ".": "Period",
            ",": "Comma",
            "'": "Apostrophe",
            "�": "eFancy"
        },
        "replacements": {
            "PLAYER": function (FSP) {
                return FSP.ItemsHolder.getItem("name");
            },
            "RIVAL": function (FSP) {
                return FSP.ItemsHolder.getItem("nameRival");
            },
            "POKE": "POK�".split(""),
            "POKEMON": "POK�MON".split(""),
            "POKEDEX": "POK�DEX".split(""),
            "POKEDEX.SEEN": function (FSP) {
                return FSP.makeDigit(FSP.getPokedexListingsOrdered()
                    .filter(function (listing) {
                    return listing && listing.seen;
                })
                    .length, 3, "\t")
                    .split("");
            },
            "POKEDEX.OWN": function (FSP) {
                return FSP.makeDigit(FSP.getPokedexListingsOrdered()
                    .filter(function (listing) {
                    return listing && listing.caught;
                })
                    .length, 3, "\t")
                    .split("");
            },
            "BADGES.LENGTH": function (FSP) {
                var badges = FSP.ItemsHolder.getItem("badges"), total = 0;
                for (var i in badges) {
                    if (badges.hasOwnProperty(i)) {
                        total += Number(badges[i]);
                    }
                }
                return total.toString().split("");
            },
            "POKEDEX.LENGTH": function (FSP) {
                var pokedex = FSP.ItemsHolder.getItem("Pokedex");
                if (!pokedex || !pokedex.length) {
                    return ["0"];
                }
                return pokedex
                    .map(function (listing) {
                    return Number(listing.seen);
                })
                    .reduce(function (a, b) {
                    return a + b;
                })
                    .toString()
                    .split("");
            },
            "TIME": function (FSP) {
                var ticksRecorded = FSP.ItemsHolder.getItem("time"), ticksUnrecorded = FSP.FPSAnalyzer.getNumRecorded() - FSP.ticksElapsed, ticksTotal = Math.floor(ticksRecorded + ticksUnrecorded), secondsTotal = Math.floor(ticksTotal / FSP.settings.runner.interval), hours = Math.floor(secondsTotal / 3600).toString(), minutes = Math.floor((secondsTotal - Number(hours)) / 60).toString();
                if (hours.length < 2) {
                    hours = " " + hours;
                }
                else if (hours.length > 2) {
                    hours = "99";
                }
                if (minutes.length < 2) {
                    minutes = "0" + minutes;
                }
                else if (minutes.length > 2) {
                    minutes = "99";
                }
                return (hours + ":" + minutes).split("");
            },
            "MONEY": function (FSP) {
                return FSP.ItemsHolder.getItem("money").toString().split("");
            }
        },
        "replacementStatistics": {
            "PLAYER": true,
            "RIVAL": true,
            "TIME": true,
            "MONEY": true
        },
        "replaceFromItemsHolder": true,
        "sounds": {
            "menuSound": "Menu Bleep"
        },
        "schemas": {
            "StartOptions": {
                "size": {
                    "width": 60,
                    "height": 40
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "textXOffset": 8,
                "ignoreB": true
            },
            "GeneralText": {
                "size": {
                    "height": 24,
                    "width": 80
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "top": 36
                    }
                },
                "ignoreB": true
            },
            "Pause": {
                "size": {
                    "width": 40,
                    "height": 64
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 60
                    }
                },
                "onMenuDelete": FullScreenPokemon.FullScreenPokemon.prototype.closePauseMenu,
                "textXOffset": 8,
                "textYOffset": 8,
                "textPaddingY": 7.75
            },
            "Pokedex": {
                "size": {
                    "width": 88
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "LineDecoratorVertical",
                        "position": {
                            "vertical": "stretch",
                            "offset": {
                                "left": 60,
                                "top": 3,
                                "bottom": 3
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "LineSeparatorHorizontal",
                        "size": {
                            "width": 21.5
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "left": -3,
                                "top": 35
                            }
                        }
                    },
                    {
                        "type": "text",
                        "words": ["CONTENTS"],
                        "position": {
                            "offset": {
                                "left": 7,
                                "top": 7
                            }
                        }
                    },
                    {
                        "type": "menu",
                        "name": "PokedexNumbers"
                    }],
                "backMenu": "Pause",
                "ignoreProgressB": true,
                "scrollingItemsComputed": true,
                "singleColumnList": true,
                "textSpeed": 0,
                "textXOffset": 7,
                "textYOffset": 11
            },
            "PokedexNumbers": {
                "size": {
                    "width": 16,
                    "height": 20
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -4,
                        "top": 12
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["SEEN \r\n %%%%%%%POKEDEX.SEEN%%%%%%%"],
                        "position": {
                            "vertical": "top"
                        }
                    },
                    {
                        "type": "text",
                        "words": ["OWN \r\n %%%%%%%POKEDEX.OWN%%%%%%%"],
                        "position": {
                            "offset": {
                                "top": 12
                            }
                        }
                    }],
                "container": "Pokedex",
                "hidden": true,
                "textSpeed": 0,
                "textPaddingY": 4
            },
            "PokedexOptions": {
                "size": {
                    "width": 21.5,
                    "height": 37
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -3,
                        "top": 38
                    }
                },
                "container": "Pokedex",
                "backMenu": "Pokedex",
                "keepOnBack": true,
                "hidden": true,
                "arrowXOffset": 1,
                "textSpeed": 0,
                "textXOffset": 4,
                "textYOffset": 5
            },
            "PokedexListing": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokedexListingSprite"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingName"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingLabel"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingHeight"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingWeight"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingNumber"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingInfo"
                    },
                    {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalLeft",
                        "position": {
                            "offset": {
                                "top": 36.5,
                                "left": 2
                            }
                        },
                        "size": {
                            "width": 38
                        }
                    }, {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalRight",
                        "position": {
                            "offset": {
                                "top": 36.5,
                                "left": 38
                            }
                        },
                        "size": {
                            "width": 40
                        }
                    }],
                "lined": true
            },
            "PokedexListingSprite": {
                "position": {
                    "offset": {
                        "left": 8,
                        "top": 12
                    }
                },
                "size": {
                    "width": 20,
                    "height": 20
                },
                "hidden": true,
                "container": "PokedexListing"
            },
            "PokedexListingName": {
                "position": {
                    "offset": {
                        "left": 32,
                        "top": 7.5
                    }
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textYOffset": 0
            },
            "PokedexListingLabel": {
                "position": {
                    "offset": {
                        "left": 32,
                        "top": 15.5
                    }
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textYOffset": 0
            },
            "PokedexListingHeight": {
                "position": {
                    "offset": {
                        "left": 36,
                        "top": 23.5
                    }
                },
                "size": {
                    "height": 10,
                    "width": 40
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["HT"]
                    }, {
                        "type": "menu",
                        "name": "PokedexListingHeightFeet"
                    }, {
                        "type": "menu",
                        "name": "PokedexListingHeightInches"
                    },
                    {
                        "type": "thing",
                        "thing": "CharFeet",
                        "position": {
                            "offset": {
                                "left": 20,
                                "top": .5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharInches",
                        "position": {
                            "offset": {
                                "left": 32,
                                "top": .5
                            }
                        }
                    }],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 0
            },
            "PokedexListingHeightFeet": {
                "size": {
                    "height": 10,
                    "width": 20
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 16.5,
                "textYOffset": 0,
                "textPaddingX": -8
            },
            "PokedexListingHeightInches": {
                "size": {
                    "height": 10,
                    "width": 20
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 28,
                "textYOffset": 0,
                "textPaddingX": -8
            },
            "PokedexListingWeight": {
                "position": {
                    "offset": {
                        "left": 36,
                        "top": 31.5
                    }
                },
                "size": {
                    "height": 10,
                    "width": 40
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["WT"]
                    }, {
                        "type": "text",
                        "words": ["lb"],
                        "position": {
                            "offset": {
                                "left": 32
                            }
                        }
                    }],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 16,
                "textYOffset": 0
            },
            "PokedexListingNumber": {
                "size": {
                    "width": 20,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 8,
                        "top": 32
                    }
                },
                "childrenSchemas": [{
                        "type": "text",
                        "words": [["No", "."]]
                    }],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": -.5
            },
            "PokedexListingInfo": {
                "position": {
                    "vertical": "bottom",
                    "horizontal": "center",
                    "offset": {
                        "top": -4
                    }
                },
                "size": {
                    "width": 76,
                    "height": 32
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 2
            },
            "Pokemon": {
                "size": {
                    "width": 88,
                    "height": 75
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [{
                        "type": "menu",
                        "name": "PokemonDialog"
                    }],
                "backMenu": "Pause",
                "arrowXOffset": 8,
                "arrowYOffset": 3,
                "ignoreProgressB": true,
                "textSpeed": 0,
                "textXOffset": 15.75,
                "textYOffset": 4
            },
            "PokemonDialog": {
                "size": {
                    "height": 24
                },
                "position": {
                    "horizontal": "stretch",
                    "vertical": "bottom"
                },
                "childrenSchemas": [{
                        "type": "text",
                        "words": [
                            "Choose a %%%%%%%POKEMON%%%%%%%"
                        ],
                        "position": {
                            "offset": {
                                "left": 4,
                                "top": 7.5
                            }
                        }
                    }],
                "container": "Pokemon",
                "textSpeed": 0
            },
            "PokemonMenuContext": {
                "size": {
                    "width": 36,
                    "height": 28
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom"
                },
                "container": "PokemonDialog",
                "textXOffset": 8,
                "textYOffset": 4
            },
            "PokemonMenuStats": {
                "size": {
                    "width": 88,
                    "height": 75
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokemonMenuStatsTitle"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsLevel"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHPBar"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHP"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsNumber"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsStatus"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsType1"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsID"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsOT"
                    },
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 1,
                            "height": 26.5
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 4,
                                "left": -5
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 43.5,
                            "height": 1
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 30,
                                "left": -5.5
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 29,
                                "left": -49
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 1,
                            "height": 34
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 36,
                                "left": -5
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 25,
                            "height": 1
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 69.5,
                                "left": -5.5
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 68.5,
                                "left": -30.5
                            }
                        }
                    }]
            },
            "PokemonMenuStatsTitle": {
                "size": {
                    "width": 44,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "top": 4,
                        "left": 39
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "PokemonMenuStatsLevel": {
                "size": {
                    "width": 36,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 61,
                        "top": 8
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": [["Level"]],
                        "position": {
                            "offset": {
                                "top": 1.5
                            }
                        }
                    }]
            },
            "PokemonMenuStatsHPBar": {
                "position": {
                    "offset": {
                        "left": 48,
                        "top": 14
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 1
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 8
                            }
                        }
                    }],
                "container": "PokemonMenuStats",
                "hidden": true
            },
            "PokemonMenuStatsHP": {
                "size": {
                    "width": 24,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 59,
                        "top": 16
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "PokemonMenuStatsNumber": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 6,
                        "top": 26
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 8,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": [[["No"], "."]]
                    }]
            },
            "PokemonMenuStatsStatus": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 39,
                        "top": 24
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 28,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": ["STATUS/"]
                    }]
            },
            "PokemonMenuStatsType1": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 35.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": ["TYPE1/"]
                    }]
            },
            "PokemonMenuStatsType2": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 43.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": ["TYPE2/"]
                    }]
            },
            "PokemonMenuStatsID": {
                "size": {
                    "width": 72,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 51.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": [[["ID"], ["No"], "/"]]
                    }]
            },
            "PokemonMenuStatsOT": {
                "size": {
                    "width": 72,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 59.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                        "type": "text",
                        "words": ["OT/"]
                    }]
            },
            "PokemonMenuStatsExperience": {
                "size": {
                    "width": 43,
                    "height": 20
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "top",
                    "offset": {
                        "top": 9,
                        "left": -6
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["EXP POINTS"],
                        "position": {
                            "offset": {
                                "top": 3
                            }
                        }
                    }, {
                        "type": "text",
                        "words": ["LEVEL UP"],
                        "position": {
                            "offset": {
                                "top": 11
                            }
                        }
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceFrom"
                    }, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceNext"
                    }, {
                        "type": "text",
                        "words": [["To"]],
                        "position": {
                            "offset": {
                                "top": 16,
                                "left": 20.5
                            }
                        }
                    }],
                "container": "PokemonMenuStats",
                "plain": true,
                "textXOffset": 0,
                "textYOffset": 7,
                "textSpeed": 0
            },
            "PokemonMenuStatsExperienceFrom": {
                "size": {
                    "width": 15
                },
                "position": {
                    "offset": {
                        "top": 15,
                        "left": 8
                    }
                },
                "container": "PokemonMenuStatsExperience",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 0,
                "textYOffset": 0
            },
            "PokemonMenuStatsExperienceNext": {
                "position": {
                    "offset": {
                        "top": 15,
                        "left": 28
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [["Level"]],
                        "position": {
                            "offset": {
                                "top": 1.5
                            }
                        }
                    }],
                "container": "PokemonMenuStatsExperience",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 4,
                "textYOffset": 0
            },
            "PokemonMenuStatsMoves": {
                "size": {
                    "width": 88,
                    "height": 43
                },
                "position": {
                    "vertical": "bottom"
                },
                "container": "PokemonMenuStats",
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "Items": {
                "size": {
                    "width": 64
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch",
                    "offset": {
                        "left": 8
                    }
                },
                "backMenu": "Pause",
                "scrollingItemsComputed": true,
                "textXOffset": 8
            },
            "Player": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PlayerTop"
                    },
                    {
                        "type": "thing",
                        "thing": "DirtWhite",
                        "position": {
                            "horizontal": "stretch",
                            "vertical": "center"
                        }
                    }, {
                        "type": "text",
                        "words": ["BADGES"],
                        "position": {
                            "offset": {
                                "left": 28,
                                "top": 35.5
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 24.5,
                                "top": 37
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 52.5,
                                "top": 37
                            }
                        }
                    }, {
                        "type": "menu",
                        "name": "PlayerBottom"
                    }],
                "backMenu": "Pause",
                "dirty": true,
                "ignoreProgressB": true,
                "textSpeed": 0
            },
            "PlayerTop": {
                "size": {
                    "width": 77,
                    "height": 29
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 1.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            "NAME/%%%%%%%PLAYER%%%%%%%",
                            "\n",
                            "MONEY/%%%%%%%MONEY%%%%%%%",
                            "\n",
                            "TIME/%%%%%%%TIME%%%%%%%",
                        ],
                        "position": {
                            "offset": {
                                "left": 6.5,
                                "top": 6
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "PlayerPortrait",
                        "position": {
                            "horizontal": "right",
                            "vertical": "top",
                            "offset": {
                                "left": -4.5,
                                "top": 3.5
                            }
                        }
                    }],
                "light": true,
                "container": "Player",
                "textSpeed": 0
            },
            "PlayerBottom": {
                "size": {
                    "width": 69,
                    "height": 29
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 41.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            ["1Shadow"], " ", ["2Shadow"], " ", ["3Shadow"], " ", ["4Shadow"],
                            ["5Shadow"], " ", ["6Shadow"], " ", ["7Shadow"], " ", ["8Shadow"],
                        ],
                        "position": {
                            "offset": {
                                "left": 2.5,
                                "top": 3
                            }
                        }
                    },
                    {
                        "type": "thing",
                        "thing": "BrockPortrait",
                        "position": {
                            "offset": {
                                "left": 6.5,
                                "top": 6.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "MistyPortrait",
                        "position": {
                            "offset": {
                                "left": 22.5,
                                "top": 6.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LtSurgePortrait",
                        "position": {
                            "offset": {
                                "left": 38.5,
                                "top": 6.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "ErikaPortrait",
                        "position": {
                            "offset": {
                                "left": 54.5,
                                "top": 6.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "KogaPortrait",
                        "position": {
                            "offset": {
                                "left": 6.5,
                                "top": 18
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "SabrinaPortrait",
                        "position": {
                            "offset": {
                                "left": 22.5,
                                "top": 18
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "BlainePortrait",
                        "position": {
                            "offset": {
                                "left": 38.5,
                                "top": 18
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "GiovanniPortrait",
                        "position": {
                            "offset": {
                                "left": 54.5,
                                "top": 18
                            }
                        }
                    }],
                "light": true,
                "container": "Player",
                "textSpeed": 0,
                "textPaddingX": 8.5,
                "textPaddingY": 12
            },
            "Save": {
                "size": {
                    "width": 64,
                    "height": 40
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 8
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            "PLAYER",
                            "\n",
                            "BADGES",
                            "\n",
                            "%%%%%%%POKEDEX%%%%%%%",
                            "\n",
                            "TIME"
                        ],
                        "position": {
                            "offset": {
                                "left": 4,
                                "top": 7
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%PLAYER%%%%%%%",
                                "alignRight": true
                            },
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%BADGES.LENGTH%%%%%%%",
                                "alignRight": true
                            },
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%POKEDEX.LENGTH%%%%%%%",
                                "alignRight": true
                            },
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%TIME%%%%%%%",
                                "alignRight": true
                            }],
                        "position": {
                            "offset": {
                                "top": 7
                            }
                        }
                    }],
                "textSpeed": 0
            },
            "Yes/No": {
                "size": {
                    "width": 24,
                    "height": 20
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -28,
                        "top": 14
                    }
                },
                "arrowXOffset": 1,
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "Heal/Cancel": {
                "size": {
                    "width": 36,
                    "height": 24
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 22,
                        "top": 14
                    }
                },
                "arrowXOffset": 1,
                "textXOffset": 8
            },
            "Buy/Sell": {
                "size": {
                    "width": 44,
                    "height": 28
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -18,
                        "top": -10
                    }
                },
                "textXOffset": 8,
                "textYOffset": 4
            },
            "Money": {
                "size": {
                    "width": 36,
                    "height": 12
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 22,
                        "top": -18
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "WhiteSquare",
                        "size": {
                            "width": 20,
                            "height": 3.5
                        },
                        "position": {
                            "vertical": "top",
                            "horizontal": "right",
                            "offset": {
                                "left": -8
                            }
                        }
                    }, {
                        "type": "text",
                        "words": ["MONEY"],
                        "position": {
                            "offset": {
                                "left": 8,
                                "top": -.25
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [{
                                "command": "padLeft",
                                "length": "%%%%%%%MONEY%%%%%%%",
                                "word": "$"
                            }],
                        "position": {
                            "offset": {
                                "top": 4
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [{
                                "command": "padLeft",
                                "length": 8,
                                "word": "%%%%%%%MONEY%%%%%%%"
                            }],
                        "position": {
                            "offset": {
                                "top": 4
                            }
                        }
                    }],
                "textSpeed": 0
            },
            "ShopItems": {
                "size": {
                    "width": 64,
                    "height": 44
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 8,
                        "top": 6
                    }
                },
                "textXOffset": 8,
                "scrollingItems": 4
            },
            "ShopItemsAmount": {
                "size": {
                    "width": 52,
                    "height": 12
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "top": -4
                    }
                },
                "container": "ShopItems",
                "backMenu": "ShopItems",
                "textSpeed": 0
            },
            "Town Map": {
                "size": {
                    "width": 88,
                    "height": 81
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "Town Map Inside"
                    }],
                "ignoreProgressB": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "Town Map Inside": {
                "size": {
                    "width": 80,
                    "height": 68
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 8
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "TownMapNoWater"
                    }],
                "container": "Town Map",
                "watery": true
            },
            "Battle": {
                "size": {
                    "width": 80,
                    "height": 48
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [{
                        "type": "menu",
                        "name": "GeneralText"
                    }],
                "hidden": true
            },
            "BattlePlayerHealth": {
                "size": {
                    "width": 38.5,
                    "height": 6.5
                },
                "position": {
                    "vertical": "bottom",
                    "horizontal": "right",
                    "offset": {
                        "top": -1.5,
                        "left": -5.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "position": {
                            "horizontal": "right"
                        },
                        "args": {
                            "height": 5.75
                        }
                    }, {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 37.5
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": .5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "position": {
                            "vertical": "bottom"
                        },
                        "args": {
                            "flipHoriz": true
                        }
                    }],
                "container": "Battle",
                "hidden": true,
                "textXOffset": 8.5,
                "textYOffset": .5,
                "textPaddingX": .5,
                "textSpeed": 0
            },
            "BattlePlayerHealthTitle": {
                "size": {
                    "width": 38
                },
                "position": {
                    "offset": {
                        "top": -12.5,
                        "left": 4
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "BattlePlayerHealthLevel": {
                "position": {
                    "offset": {
                        "top": -8.5,
                        "left": 20
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "top": 1.5,
                                "left": .5
                            }
                        }
                    }],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "BattlePlayerHealthAmount": {
                "size": {
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 4,
                        "top": -3
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 1
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 8
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 24,
                            "id": "HPBarFillPlayer"
                        },
                        "position": {
                            "offset": {
                                "left": 8.5,
                                "top": .5
                            }
                        }
                    }],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textSpeed": 0
            },
            "BattlePlayerHealthNumbers": {
                "size": {
                    "width": 36,
                    "height": 10
                },
                "position": {
                    "offset": {
                        "top": -1,
                        "left": 4
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "BattleOpponentHealth": {
                "size": {
                    "width": 38.5,
                    "height": 6.5
                },
                "position": {
                    "offset": {
                        "top": 8,
                        "left": 5.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "height": 5.75
                        }
                    }, {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 34
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": .5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "position": {
                            "vertical": "bottom",
                            "horizontal": "right"
                        }
                    }],
                "container": "Battle",
                "hidden": true,
                "textXOffset": 7,
                "textYOffset": .5,
                "textPaddingX": .5,
                "textSpeed": 0
            },
            "BattleOpponentHealthTitle": {
                "position": {
                    "offset": {
                        "top": -8.5,
                        "left": -1.5
                    }
                },
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "BattleOpponentHealthLevel": {
                "position": {
                    "offset": {
                        "top": -4.5,
                        "left": 10.5
                    }
                },
                "childrenSchemas": [{
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "top": 1.5,
                                "left": .5
                            }
                        }
                    }],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            },
            "BattleOpponentHealthAmount": {
                "position": {
                    "offset": {
                        "left": 3,
                        "top": 1
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP"
                    }, {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 7
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 24,
                            "id": "HPBarFillOpponent"
                        },
                        "position": {
                            "offset": {
                                "left": 7.5,
                                "top": .5
                            }
                        }
                    }],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "height": 4,
                "textSpeed": 0
            },
            "BattleDisplayInitial": {
                "size": {
                    "width": 72
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch"
                },
                "container": "Battle",
                "hidden": true
            },
            "BattleOptions": {
                "size": {
                    "width": 48,
                    "height": 24
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom"
                },
                "container": "GeneralText",
                "ignoreB": true,
                "textXOffset": 8,
                "textColumnWidth": 24
            },
            "BattleDisplayPlayer": {
                "size": {
                    "width": 45,
                    "height": 21
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "left": 8.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "left": 21,
                                "top": 6
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 12,
                                "top": 10
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 5,
                                "top": 10
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharSlash",
                        "position": {
                            "offset": {
                                "left": 20.5,
                                "top": 12.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowLeft",
                        "position": {
                            "offset": {
                                "left": .5,
                                "top": 17.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "width": 34
                        },
                        "position": {
                            "offset": {
                                "left": 4.5,
                                "top": 18.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "height": 10
                        },
                        "position": {
                            "offset": {
                                "left": 38,
                                "top": 9
                            }
                        }
                    }],
                "container": "Battle",
                "hidden": true
            },
            "BattleDisplayOpponent": {
                "size": {
                    "width": 41,
                    "height": 15
                },
                "position": {
                    "offset": {
                        "left": 3
                    }
                },
                // "childrenSchemas": [{
                // }],
                "container": "Battle",
                "plain": true,
                "textSpeed": 0,
                "textXOffset": 1,
                "textYOffset": -.5
            },
            "BattleFightList": {
                "size": {
                    "width": 64
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "stretch"
                },
                "container": "GeneralText",
                "backMenu": "BattleOptions",
                "textXOffset": 8,
                "textYOffset": 3.5,
                "textPaddingY": 4,
                "arrowXOffset": 1
            },
            "LevelUpStats": {
                "size": {
                    "width": 48,
                    "height": 40
                },
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 4,
                "textPaddingY": 4
            },
            "NameOptions": {
                "size": {
                    "width": 44,
                    "height": 48
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -18
                    }
                },
                "ignoreB": true,
                "textXOffset": 8
            },
            "Keyboard": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "vertical": "center",
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "KeyboardKeys"
                    }, {
                        "type": "menu",
                        "name": "KeyboardTitle"
                    }, {
                        "type": "menu",
                        "name": "KeyboardResult"
                    }],
                "plain": true
            },
            "KeyboardKeys": {
                "size": {
                    "width": 80,
                    "height": 44
                },
                "position": {
                    "offset": {
                        "top": 16
                    }
                },
                "container": "Keyboard",
                "textColumnWidth": 8,
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "KeyboardResult": {
                "size": {
                    "height": 8,
                    "width": 32
                },
                "position": {
                    "offset": {
                        "left": 39,
                        "top": 10.5
                    }
                },
                "container": "Keyboard",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": .5,
                "textYOffset": 0
            },
            "KeyboardTitle": {
                "size": {
                    "height": 8
                },
                "position": {
                    "horizontal": "stretch",
                    "offset": {
                        "top": -4,
                        "left": -4
                    }
                },
                "container": "Keyboard",
                "hidden": true,
                "textSpeed": 0
            }
        }
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
