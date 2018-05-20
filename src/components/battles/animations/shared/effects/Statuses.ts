import { IMoveAction, IMoveEffect, ITeamAndAction } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";

/**
 * Runs status effect animations for FullScreenPokemon instances.
 */
export class Statuses<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Runs the status effect animation for a battle move effect.
     *
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move that missed.
     * @param onComplete   Handler for when this is done.
     */
    public run(teamAndAction: ITeamAndAction<IMoveAction>, effect: IMoveEffect, onComplete: () => void): void {
        console.log("Status!", teamAndAction, effect);
        onComplete();
    }
}
