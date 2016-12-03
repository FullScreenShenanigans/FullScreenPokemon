import { IBattlesModuleSettings } from "../IFullScreenPokemon";

export function GenerateBattlesSettings(): IBattlesModuleSettings {
    "use strict";

    return {
        menuNames: {
            battle: "Battle",
            battleDisplayInitial: "BattleDisplayInitial",
            generalText: "GeneralText",
            player: "BattleOptions"
        },
        backgroundType: "DirtWhite",
        defaults: {
            exitDialog: "Got away safely!",
            textStart: [
                "A wild ".split(""),
                " appeared!".split("")
            ],
            textEntry: [
                "Go! ".split(""),
                "!".split("")
            ],
            textOpponentSendOut: [
                "".split(""),
                " sent out ".split(""),
                "!".split("")
            ],
            textPlayerSendOut: [
                "Go! ".split(""),
                "!".split("")
            ]
        },
        positions: {
            player: {
                left: 4,
                top: 20
            },
            opponent: {
                left: 52,
                top: 8
            }
        }
    } as any;
}
