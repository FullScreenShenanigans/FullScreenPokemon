FullScreenPokemon.prototype.settings.menus = {
    "aliases": {
        "(": "LeftParenthesis",
        ")": "RightParenthesis",
        ":": "Colon",
        ";": "Semicolon",
        "[": "LeftSquareBracket",
        "]": "RightSquareBracket",
        "-": "Hyphen",
        "?": "QuestionMark",
        "!": "ExclamationMark",
        "/": "Slash",
        ".": "Period",
        ",": "Comma",
        "'": "Apostrophe",
        "È": "eFancy"
    },
    "replacements": {
        "PLAYER": "name",
        "RIVAL": "nameRival",
        "POKEMON": "POKÈMON",
        "POKEDEX": "POKÈDEX",
        "BADGES.LENGTH": "?",
        "POKEDEX.LENGTH": "?",
        "TIME": "time",
        "MONEY": "money"
    },
    "replacementStatistics": {
        "PLAYER": true,
        "RIVAL": true,
        "TIME": true,
        "MONEY": true
    },
    "replaceFromStatsHolder": true,
    "schemas": {
        "StartOptions": {
            "size": {
                "width": 60,
                "height": 40
            },
            "position": {
                "horizontal": "center",
                "vertical": "center",
            },
            "textXOffset": 8
        },
        "GeneralText": {
            "size": {
                "height": 24,
                "width": 96
            },
            "position": {
                "horizontal": "center",
                "vertical": "bottom",
            }
        },
        "Pause": {
            "size": {
                "width": 40,
                "height": 64,
            },
            "position": {
                "horizontal": "center",
                "offset": {
                    "left": 60
                }
            },
            "onDelete": FullScreenPokemon.prototype.closePauseMenu,
            "textXOffset": 8,
            "textYOffset": 8,
            "textPaddingY": 7.75
        },
        "Pokedex": {
            "size": {
                "width": 88,
            },
            "position": {
                "horizontal": "center",
                "vertical": "stretch",
                "offset": {
                    "left": -4
                }
            },
            "childrenSchemas": [{
                "type": "thing",
                "thing": "LineDecorator",
                "position": {
                    "vertical": "stretch",
                    "offset": {
                        "left": 60,
                        "top": 3,
                        "bottom": 3
                    }
                }
            }, {
                "type": "thing",
                "thing": "LineSeparatorHorizontal",
                "size": {
                    "width": 21.5,
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -3,
                        "top": 35,
                    }
                }
            }, {
                "type": "text",
                "words": ["CONTENTS"],
                "position": {
                    "offset": {
                        "left": 7,
                        "top": 7
                    }
                }
            }, {
                "type": "text",
                "words": ["SEEN"],
                "position": {
                    "horizontal": "right",
                    "vertical": "top",
                    "offset": {
                        "left": -13,
                        "top": 11
                    }
                }
            }, {
                "type": "text",
                "words": ["OWN"],
                "position": {
                    "horizontal": "right",
                    "vertical": "top",
                    "offset": {
                        "left": -13,
                        "top": 23
                    }
                }
            }],
            "backMenu": "Pause",
            "startMenu": "PokedexOptions",
            "textSpeed": 0,
            "textXOffset": 7,
            "textYOffset": 11
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
            "plain": true,
            "arrowXOffset": 1,
            "textSpeed": 0,
            "textXOffset": 4,
            "textYOffset": 5
        },
        "Pokemon": {
            "size": {
                "width": 88,
                "height": 80
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
            "onActivate": console.log.bind("HA"),
            "backMenu": "Pause",
            "arrowXOffset": 4,
            "arrowYOffset": 5,
            "textSpeed": 0,
            "textXOffset": 15.75,
            "textYOffset": 3
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
                        "top": 6
                    }
                }
            }],
            "container": "Pokemon",
            "textSpeed": 0
        },
        "Items": {
            "size": {
                "width": 64,
            },
            "position": {
                "horizontal": "center",
                "vertical": "stretch",
                "offset": {
                    "left": 8
                }
            },
            "backMenu": "Pause",
            "textXOffset": 8,
        },
        "Player": {
            "size": {
                "width": 80,
                "height": 72
            },
            "position": {
                "horizontal": "center",
            },
            "childrenSchemas": [{
                "type": "menu",
                "name": "PlayerTop",
            }, {
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
            "dirty": true,
            "backMenu": "Pause",
            "textSpeed": 0
        },
        "PlayerTop": {
            "size": {
                "width": 77,
                "height": 29,
            },
            "position": {
                "horizontal": "center",
                "offset": {
                    "top": 1.5
                }
            },
            "childrenSchemas": [{
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
            }, {
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
            "childrenSchemas": [{
                "type": "text",
                "words": [
                    ["1Shadow"], ["2Shadow"], ["3Shadow"], ["4Shadow"],
                    ["5Shadow"], ["6Shadow"], ["7Shadow"], ["8Shadow"],
                ],
                "position": {
                    "offset": {
                        "left": 2.5,
                        "top": 3
                    }
                }
            }, {
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
            "childrenSchemas": [{
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
                "words": [{
                    "command": "padLeft",
                    "length": 15,
                    "word": "%%%%%%%PLAYER%%%%%%%",
                    "skipSpacing": true
                }, {
                    "command": "padLeft",
                    "length": 15,
                    "word": "%%%%%%%BADGES.LENGTH%%%%%%%",
                    "skipSpacing": true
                }, {
                    "command": "padLeft",
                    "length": 15,
                    "word": "%%%%%%%POKEDEX.LENGTH%%%%%%%",
                    "skipSpacing": true
                }, {
                    "command": "padLeft",
                    "length": 15,
                    "word": "%%%%%%%TIME%%%%%%%",
                    "skipSpacing": true
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
                "vertical": "bottom",
                "offset": {
                    "left": -36,
                    "top": -24
                }
            },
            "arrowXOffset": 4.5,
            "textXOffset": 8,
            "textYOffset": 3.5
        },
        "Battle": {
            "size": {
                "width": 80,
                "height": 48
            },
            "position": {
                "horizontal": "center",
                "vertical": "bottom",
                "offset": {
                    "top": -24
                }
            },
            "childrenSchemas": [{
                "type": "menu",
                "name": "GeneralText"
            }],
            "plain": true
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
            "plain": true
        },
        "BattleOptions": {
            "size": {
                "width": 48,
                "height": 24
            },
            "position": {
                "horizontal": "center",
                "vertical": "bottom",
                "offset": {
                    "left": 24
                }
            },
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
                    "left": .5
                }
            },
            "childrenSchemas": [{
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
            "transparent": true
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
            "childrenSchemas": [{

            }],
            "container": "Battle",
            "plain": true,
            "textSpeed": 0,
            "textXOffset": 1,
            "textYOffset": -.5
        },
        "BattleFightList": {
            "size": {
                "width": 64,
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
    }
};