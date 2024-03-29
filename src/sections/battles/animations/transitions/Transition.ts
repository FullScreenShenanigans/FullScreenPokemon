import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { TransitionSettings } from "../Transitions";

/**
 * Base transition class for battle start transition animations.
 */
export class Transition extends Section<FullScreenPokemon> {
    /**
     * Settings for the transition.
     */
    protected readonly settings: TransitionSettings;

    /**
     * Initializes a new instance of the Transition class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Settings for the transition.
     */
    public constructor(eightBitter: FullScreenPokemon, settings: TransitionSettings) {
        super(eightBitter);

        this.settings = settings;
    }

    /**
     * Plays the transition.
     */
    public play(): void {
        console.warn(`Unknown transition: '${this.settings.name}'`);
        this.settings.onComplete();
    }
}
