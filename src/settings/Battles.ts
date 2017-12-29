import { IAction, IBattleMovrSettings, ITeamAndAction, IUnderEachTeam } from "battlemovr";

import { IBattleInfo } from "../components/Battles";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Battle settings for the FullScreenPokemon instance.
 */
export const GenerateBattlesSettings = (fsp: FullScreenPokemon): IBattleMovrSettings => ({
    actionsOrderer: (actions: IUnderEachTeam<IAction>): ITeamAndAction<any>[] =>
        fsp.battles.actionsOrderer.order(actions, fsp.battleMover.getBattleInfo() as IBattleInfo),
    animations: fsp.battles.animations,
    selectorFactories: {
        opponent: fsp.battles.selectors.opponent,
        player: fsp.battles.selectors.player,
    },
});
