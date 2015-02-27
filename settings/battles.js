FullScreenPokemon.prototype.settings.battles = {
    "battleMenuName": "Battle",
    "battleOptionNames": {
        "moves": "FIGHT",
        "items": "ITEM",
        "actors": ["Poke", "Mon"],
        "exit": "RUN"
    },
    "menuNames": {
        "moves": "BattleFightList",
        "items": "Items",
        "actors": "Pokemon"
    },
    "backgroundType": "DirtWhite",
    "defaults": {
        "exitDialog": "Got away safely!",
        "textStart": ["A wild ", " appeared!"],
        "textEntry": ["Go! ", "!"],
    },
    "positions": {
        "player": {
            "left": 4,
            "top": 20
        },
        "opponent": {
            "left": 52,
            "top": 8
        }
    },
    "animations": {
        "playerLeaveLeft": FullScreenPokemon.prototype.animatePlayerLeaveLeft,
        "actorEntrance": FullScreenPokemon.prototype.animatePokeballOpening
    },
};