import { IIntroductionAnimations } from "battlemovr/lib/animators/Introductions";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

/**
 * Battle introduction animations used by FullScreenPokemon instances.
 */
export class Introductions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IIntroductionAnimations {
    /**
     * Animation for the opponent introducing themselves.
     * 
     * @param onComplete   Callback for when the animation is done.
     */
    public opponent(onComplete: () => void): void {
        console.log("opponent intro");
        onComplete();
    }

    /**
     * Animation for the player introducing themselves.
     * 
     * @param onComplete   Callback for when the animation is done.
     */
    public player(onComplete: () => void): void {
        console.log("player intro");
        onComplete();
    }
}
