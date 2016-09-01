/// <reference path="../../typings/GameStartr.d.ts" />

import { IBattleMovrCustoms } from "../IFullScreenPokemon";

export function GenerateBattlesSettings(): IBattleMovrCustoms {
    "use strict";

    return {
        battleMenuName: "Battle",
        battleOptionNames: {
            moves: "FIGHT",
            items: "ITEM",
            actors: ["Poke", "Mon"],
            exit: "RUN"
        },
        menuNames: {
            moves: "BattleFightList",
            items: "Items",
            actors: "Pokemon"
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
