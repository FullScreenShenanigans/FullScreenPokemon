FullScreenPokemon.prototype.settings.menus = {
    "textSpeed": 1,
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
                "vertical": "top",
                "offset": {
                    "horizontal": 60
                }
            },
            "onDelete": FullScreenPokemon.prototype.closePauseMenu,
            "textXOffset": 8,
            "textYOffset": 8,
            "textPaddingY": 7.75
        },
        "Items": {
            "size": {
                "width": 64,
                "height": 44,
            },
            "position": {
                "horizontal": "center",
                "vertical": "top",
                "offset": {
                    "horizontal": 48,
                    "vertical": 8
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
                    "horizontal": -4
                }
            },
            "childrenSchemas": [{
                "type": "thing",
                "thing": "PokedexLineDecorator",
                "left": 60,
                "top": 3,
                "bottom": 3,
                "stretch": {
                    "vertical": true
                }
            }],
            "backMenu": "Pause",
        }
    }
};