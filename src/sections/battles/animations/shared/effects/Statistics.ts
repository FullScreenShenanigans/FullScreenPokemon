import { IMoveAction, IMoveEffect, ITeamAndAction } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";

/**
 * Runs statistics animations for FullScreenPokemon instances.
 */
export class Statistics extends Section<FullScreenPokemon> {
    /**
     * Runs the statistic effect animation for a battle move effect.
     *
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move that missed.
     * @param onComplete   Handler for when this is done.
     */
    public run(
        _teamAndAction: ITeamAndAction<IMoveAction>,
        _effect: IMoveEffect,
        onComplete: () => void
    ): void {
        onComplete();
    }
}
