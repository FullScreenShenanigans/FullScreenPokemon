import { IMoveAction, IMoveEffect, ITeamAndAction } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";

/**
 * Runs statistics animations for FullScreenPokemon instances.
 */
export class Statistics<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Runs the statistic effect animation for a battle move effect.
     *
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move that missed.
     * @param onComplete   Handler for when this is done.
     */
    public run(teamAndAction: ITeamAndAction<IMoveAction>, effect: IMoveEffect, onComplete: () => void): void {
        console.log("Statistic:", teamAndAction, effect);
        onComplete();
    }
}
