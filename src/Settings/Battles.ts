import * as ibattlemovr from "battlemovr/lib/IBattleMovr";
import * as igamestartr from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding in-game battles, particularly for an IBattleMovr.
 */
export interface IBattlesModuleSettings extends ibattlemovr.IBattleMovrSettings, igamestartr.IModuleSettingsObject { }

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Battle settings for the FullScreenPokemon instance.
 */
export function GenerateBattlesSettings(fsp: FullScreenPokemon): IBattlesModuleSettings {
    "use strict";

    return {
        gameStarter: fsp,
        menuGrapher: fsp.menuGrapher,
        battleOptions: [
            {
                text: "FIGHT",
                callback: (): void => {
                    fsp.battles.openBattleMovesMenu();
                }
            },
            {
                text: "ITEM",
                callback: (): void => {
                    fsp.battles.openBattleItemsMenu();
                }
            },
            {
                text: ["Poke", "Mon"],
                callback: (): void => {
                    fsp.battles.openBattlePokemonMenu();
                }
            },
            {
                text: "RUN",
                callback: (): void => {
                    fsp.battles.startBattleExit();
                }
            }
        ],
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
    };
}
