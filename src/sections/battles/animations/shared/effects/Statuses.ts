import { MoveAction, MoveEffect, TeamAndAction } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";

/**
 * Runs status effect animations for FullScreenPokemon instances.
 */
export class Statuses extends Section<FullScreenPokemon> {
    /**
     * Runs the status effect animation for a battle move effect.
     *
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move that missed.
     * @param onComplete   Handler for when this is done.
     */
    public run(
        teamAndAction: TeamAndAction<MoveAction>,
        effect: MoveEffect,
        onComplete: () => void
    ): void {
        console.log("Status!", teamAndAction, effect);
        onComplete();
    }
}
