import { ITeamAnimations } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { Actions } from "./player/Actions";
import { Switching } from "./player/Switching";

/**
 * Player animations used by FullScreenPokemon instances.
 */
export class Player<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ITeamAnimations {
    /**
     * Player action animations used by the FullScreenPokemon instance.
     */
    public readonly actions: Actions<TGameStartr> = new Actions<TGameStartr>(this.gameStarter);

    /**
     * Player switching animations used by the FullScreenPokemon instance.
     */
    public readonly switching: Switching<TGameStartr> = new Switching<TGameStartr>(this.gameStarter);

    /**
     * Animation for when the player's actor's health changes.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public healthChange(_health: number, onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for the player introducing themselves.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public introduction(onComplete: () => void): void {
        onComplete();
    }
}
