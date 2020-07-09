import { BattleMovr, IAction, ITeamAndAction, IUnderEachTeam } from "battlemovr";

import { IBattleInfo } from "../sections/Battles";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createBattleMover = (fsp: FullScreenPokemon) =>
    new BattleMovr({
        actionsOrderer: (actions: IUnderEachTeam<IAction>): ITeamAndAction<any>[] =>
            fsp.battles.actionsOrderer.order(actions, fsp.battleMover.getBattleInfo() as IBattleInfo),
        animations: fsp.battles.animations,
        selectorFactories: {
            opponent: fsp.battles.selectors.opponent,
            player: fsp.battles.selectors.player,
        },
    });
