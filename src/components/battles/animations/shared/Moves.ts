import { IMoveAction } from "battlemovr/lib/Actions";
import { ITeamAndAction, Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { Move } from "./moves/Move";
import { IMovesBag } from "./moves/MovesBag";

/**
 * Battle move animations used by FullScreenPokemon instances.
 */
export class Moves<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly movesBag: IMovesBag;

    /**
     * Initializes a new instance of the Moves class.
     *
     * @param gameStarter   FullScreenPokemon instance this is used for.
     * @param movesBag   Battle move runners, keyed by move name.
     */
    public constructor(gameStarter: TGameStartr, movesBag: IMovesBag) {
        super(gameStarter);

        this.movesBag = movesBag;
    }

    /**
     * Plays a battle move.
     * 
     * @param teamAndAction   Team and action for the move.
     * @param source   Team whose Pokemon is using the move.
     * @param target   Team whose Pokemon is being targeted.
     * @param callback   Callback for when the move is done.
     */
    public playMove(teamAndAction: ITeamAndAction<IMoveAction>, callback: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const animatorType: typeof Move = this.movesBag[teamAndAction.action.move] || this.movesBag.default;
        const animator: Move<TGameStartr> = new animatorType(this.gameStarter, teamAndAction);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[Team[teamAndAction.source.team]].move(
                battleInfo.teams[Team[teamAndAction.source.team]],
                battleInfo.teams[Team[teamAndAction.source.team]].selectedActor.title.join(""),
                teamAndAction.action.move),
            (): void => animator.runAnimation(callback));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
