import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { FlashTransition } from "./transitions/FlashTransition";
import { Transition } from "./transitions/Transition";

/**
 * Settings to play a transition.
 */
export interface ITransitionSettings {
    /**
     * Name of the transition, if not chosen at random.
     */
    name?: string;

    /**
     * Callback for when the transition is done.
     */
    onComplete: () => void;
}

/**
 * Transition classes, keyed by name.
 */
interface ITransitions {
    [i: string]: typeof Transition;
}

/**
 * Battle transition animations used by FullScreenPokemon instances.
 */
export class Transitions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Transitions, keyed by name.
     */
    private readonly transitions: ITransitions = {
        flash: FlashTransition
    };

    /**
     * Plays a transition.
     * 
     * @param settings   Settings to play the transition.
     */
    public play<TSettings extends ITransitionSettings>(settings: TSettings): void {
        const name: string = settings.name || this.gameStarter.numberMaker.randomArrayMember(Object.keys(this.transitions));

        new (this.transitions[name] || Transition)(this.gameStarter, settings).play();
    }
}
