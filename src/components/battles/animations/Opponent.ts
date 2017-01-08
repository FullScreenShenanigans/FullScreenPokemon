import { ITeamAnimations } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { Actions } from "./opponent/Actions";
import { Switching } from "./opponent/Switching";

/**
 * Opponent animations used by FullScreenPokemon instances.
 */
export class Opponent<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ITeamAnimations {
    /**
     * Opponent action animations used by the FullScreenPokemon instance.
     */
    public readonly actions: Actions<TGameStartr> = new Actions<TGameStartr>(this.gameStarter);

    /**
     * Opponent switching animations used by the FullScreenPokemon instance.
     */
    public readonly switching: Switching<TGameStartr> = new Switching<TGameStartr>(this.gameStarter);

    /**
     * Animation for when the opponent's actor's health changes.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public healthChange(_health: number, onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the opponent introducing themselves.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public introduction(onComplete: () => void): void {
        onComplete();
    }
}
