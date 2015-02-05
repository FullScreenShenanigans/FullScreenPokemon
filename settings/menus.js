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
        "PLAYER": "Your name",
        "RIVAL": "Rival's name",
        "POKEMON": "POKÈMON",
        "POKEDEX": "POKÈDEX"
    },
    "schemas": {
        "GeneralText": {
            "size": {
                "height": 24,
                "width": 100
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
        "Items": {
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
            "backMenu": "Pause",
            "textXOffset": 8,
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
        }
    }
};