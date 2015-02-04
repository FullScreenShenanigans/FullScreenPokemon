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
        "POKEMON": "POKÈMON"
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
                "height": 100
            },
            "position": {
                "horizontal": "center",
                "vertical": "bottom",
                "offset": {
                    "horizontal": 60 // 50 + (40 / 2)
                }
            }
        }
    }
};