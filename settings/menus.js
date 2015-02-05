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
            "onDelete": FullScreenPokemon.prototype.closeItemsMenu,
            "backMenu": "Pause",
            "textXOffset": 8,
        }
    }
};