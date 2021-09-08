import { MoveAction, TeamAndAction, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { BattleInfo } from "../../../Battles";
import { MovesBag } from "./moves/MovesBag";

/**
 * Announces and launches battle move animations.
 */
export class Moves extends Section<FullScreenPokemon> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly movesBag: MovesBag;

    /**
     * Initializes a new instance of the Moves class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param movesBag   Battle move runners, keyed by move name.
     */
    public constructor(eightBitter: FullScreenPokemon, movesBag: MovesBag) {
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
    public playMove(teamAndAction: TeamAndAction<MoveAction>, callback: () => void): void {
        const battleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;
        const animatorType =
            this.movesBag[teamAndAction.action.move.toUpperCase()] || this.movesBag.default;
        const animator = new animatorType(this.game, teamAndAction);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[TeamId[teamAndAction.source.team]].move(
                battleInfo.teams[TeamId[teamAndAction.source.team]],
                battleInfo.teams[TeamId[teamAndAction.source.team]].selectedActor.title.join(""),
                teamAndAction.action.move
            ),
            (): void => animator.runAnimation(callback)
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
