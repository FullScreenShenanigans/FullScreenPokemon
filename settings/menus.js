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
        "PauseMenu": {
            "size": {
                "width": 40,
                "height": 64,
                "offsets": {
                    "textXOffset": 8
                }
            },
            "position": {
                "horizontal": "center",
                "vertical": "top",
                "offset": {
                    "horizontal": 60 // 50 + (40 / 2)
                }
            },
            "textYOffset": 8,
            "textPaddingY": 7.75
        }
    }
};