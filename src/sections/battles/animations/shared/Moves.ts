import { IMoveAction, ITeamAndAction, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { IMovesBag } from "./moves/MovesBag";

/**
 * Announces and launches battle move animations.
 */
export class Moves extends Section<FullScreenPokemon> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly movesBag: IMovesBag;

    /**
     * Initializes a new instance of the Moves class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param movesBag   Battle move runners, keyed by move name.
     */
    public constructor(eightBitter: FullScreenPokemon, movesBag: IMovesBag) {
        super(eightBitter);

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
        const battleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;
        const animatorType = this.movesBag[teamAndAction.action.move.toUpperCase()] || this.movesBag.default;
        const animator = new animatorType(this.game, teamAndAction);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[Team[teamAndAction.source.team]].move(
                battleInfo.teams[Team[teamAndAction.source.team]],
                battleInfo.teams[Team[teamAndAction.source.team]].selectedActor.title.join(""),
                teamAndAction.action.move),
            (): void => animator.runAnimation(callback));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
