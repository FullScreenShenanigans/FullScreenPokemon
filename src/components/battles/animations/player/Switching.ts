import { IOnEnter, ISwitchingAnimations } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { Enter } from "./switching/Enter";

/**
 * Player switching animations used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISwitchingAnimations {
    /**
     * Animation for when the player's actor enters battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public enter: IOnEnter = (onComplete: () => void): void => {
        new Enter(this.gameStarter).run(onComplete);
    }

    /**
     * Animation for when the player's actor exits battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public exit(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the player's actor gets knocked out.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public knockout(onComplete: () => void): void {
        onComplete();
    }
}
