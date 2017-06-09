import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Generations whose feature modes may be enabled.
 */
export enum Generation {
    I = 1,
    II = 2
}

/**
 * Determines feature availability based on current generation.
 * 
 * @todo #489   Use a proper node module instead.
 */
export class Features<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Which generation to act as.
     */
    public readonly generation: Generation = Generation.I;

    /**
     * Whether HM moves can be activated by pressing the A key.
     */
    public get keyActivatedHmMoves(): boolean {
        return this.generation !== Generation.I;
    }

    /**
     * Whether Pokemon are able to hold items.
     */
    public get heldItems(): boolean {
        return this.generation !== Generation.I;
    }
}
