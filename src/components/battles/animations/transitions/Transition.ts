import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { ITransitionSettings } from "../Transitions";

/**
 * Base transition class for battle start transition animations.
 */
export class Transition<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Settings for the transition.
     */
    protected readonly settings: ITransitionSettings;

    /**
     * Initializes a new instance of the Transition class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Settings for the transition.
     */
    public constructor(eightBitter: TEightBittr, settings: ITransitionSettings) {
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
