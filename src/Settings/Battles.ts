import * as ibattlemovr from "battlemovr/lib/IBattleMovr";
import * as igamestartr from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding in-game battles, particularly for an IBattleMovr.
 */
export interface IBattlesModuleSettings extends igamestartr.IModuleSettingsObject {
    /**
     * Names of known MenuGraphr menus.
     */
    menuNames: ibattlemovr.IMenuNames;

    /**
     * Option menus the player may select during battle.
     */
    battleOptions: ibattlemovr.IBattleOption[];

    /**
     * Default settings for running battles.
     */
    defaults?: ibattlemovr.IBattleInfoDefaults;

    /**
     * Default positions of in-battle Things.
     */
    positions?: ibattlemovr.IPositions;

    /**
     * The type of Thing to create and use as a background.
     */
    backgroundType?: string;
}

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Battle settings for the FullScreenPokemon instance.
 */
export function GenerateBattlesSettings(fsp: FullScreenPokemon): IBattlesModuleSettings {
    "use strict";

    return {
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
                left: 16,
                top: 80
            },
            opponent: {
                left: 204,
                top: 32
            }
        }
    };
}
