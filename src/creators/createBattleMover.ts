import { BattleMovr, Action, TeamAndAction, UnderEachTeam } from "battlemovr";

import { BattleInfo } from "../sections/Battles";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createBattleMover = (fsp: FullScreenPokemon) =>
    new BattleMovr({
        actionsOrderer: (actions: UnderEachTeam<Action>): TeamAndAction<any>[] =>
            fsp.battles.actionsOrderer.order(
                actions,
                fsp.battleMover.getBattleInfo() as BattleInfo
            ),
        animations: fsp.battles.animations,
        selectorFactories: {
            opponent: fsp.battles.selectors.opponent,
            player: fsp.battles.selectors.player,
        },
    });
