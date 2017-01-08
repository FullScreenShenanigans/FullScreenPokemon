import { ISwitchingAnimations } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";

/**
 * Opponent switching animations used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISwitchingAnimations {
    /**
     * Animation for when the opponent's actor enters battle.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public enter(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the opponent's actor exits battle.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public exit(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the opponent's actor gets knocked out.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public knockout(onComplete: () => void): void {
        onComplete();
    }
}
