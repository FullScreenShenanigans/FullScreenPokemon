import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { GrowlMove } from "./moves/GrowlMove";
import { Move } from "./moves/Move";

/**
 * Battle move runners, keyed by move name.
 */
export interface IMoves {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof Move;

    [i: string]: typeof Move;
}

/**
 * Battle move functions used by FullScreenPokemon instances.
 */
export class Moves<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly moves: IMoves = {
        GROWL: GrowlMove,
        default: Move
    };

    /**
     * Plays a battle move.
     * 
     * @param move   Title of the move.
     * @param source   Team whose Pokemon is using the move.
     * @param target   Team whose Pokemon is being targeted.
     * @param callback   Callback for when the move is done.
     */
    public playMove(move: string, source: Team, target: Team, callback: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const animator: Move<TGameStartr> = new (this.moves[move] || this.moves.default)(this.gameStarter, move, source, target);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.texts.teams[Team[source]].move[0],
                    battleInfo.teams[Team[source]].selectedActor.nickname,
                    battleInfo.texts.teams[Team[source]].move[1],
                    move,
                    battleInfo.texts.teams[Team[source]].move[2]
                ]
            ],
            (): void => animator.runAnimation(callback));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
