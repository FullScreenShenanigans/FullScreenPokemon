import { IMoveAction } from "battlemovr/lib/Actions";
import { IMoveEffect } from "battlemovr/lib/Effects";
import { ITeamAndAction } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";

/**
 * Runs missed effect animations for FullScreenPokemon instances.
 */
export class Missed<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Runs the missed effect animation for a battle move effect.
     * 
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move that missed.
     * @param onComplete   Handler for when this is done.
     */
    public run(teamAndAction: ITeamAndAction<IMoveAction>, effect: IMoveEffect, onComplete: () => void): void {
        console.log("Missed!", teamAndAction, effect);
        onComplete();
    }
}
