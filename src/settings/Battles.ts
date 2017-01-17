import { IAction } from "battlemovr/lib/Actions";
import { IBattleMovrSettings } from "battlemovr/lib/IBattleMovr";
import { ITeamAndAction, IUnderEachTeam } from "battlemovr/lib/Teams";
import * as igamestartr from "gamestartr/lib/IGameStartr";

import { IBattleInfo } from "../components/Battles";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding in-game battles, particularly for an IBattleMovr.
 */
export interface IBattlesModuleSettings extends igamestartr.IModuleSettingsObject, IBattleMovrSettings { }

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Battle settings for the FullScreenPokemon instance.
 */
export function GenerateBattlesSettings(fsp: FullScreenPokemon): IBattlesModuleSettings {
    "use strict";

    return {
        actionsOrderer: (actions: IUnderEachTeam<IAction>): ITeamAndAction<any>[] => {
            return fsp.battles.actionsOrderer.order(actions, fsp.battleMover.getBattleInfo() as IBattleInfo);
        },
        animations: fsp.battles.animations,
        selectorFactories: {
            opponent: fsp.battles.selectors.opponent,
            player: fsp.battles.selectors.player
        }
    };
}
