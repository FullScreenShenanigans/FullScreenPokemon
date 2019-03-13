import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

import { FlashTransition } from "./transitions/FlashTransition";
import { InstantTransition } from "./transitions/InstantTransition";
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
    onComplete(): void;
}

/**
 * Transition classes, keyed by name.
 */
interface ITransitions {
    [i: string]: typeof Transition;
}

/**
 * Flashy animation transitions to start battles.
 */
export class Transitions<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Transitions, keyed by name.
     */
    private readonly transitions: ITransitions = {
        flash: FlashTransition,
        instant: InstantTransition,
    };

    /**
     * Plays a transition.
     *
     * @param settings   Settings to play the transition.
     */
    public play<TSettings extends ITransitionSettings>(settings: TSettings): void {
        const name: string = settings.name || this.eightBitter.numberMaker.randomArrayMember(Object.keys(this.transitions));

        new (this.transitions[name] || Transition)(this.eightBitter, settings).play();
    }
}
