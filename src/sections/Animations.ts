import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Fading } from "./animations/Fading";
import { Shrinking } from "./animations/Shrinking";
import { Sliding } from "./animations/Sliding";

/**
 * Generic animations for Actors.
 */
export class Animations extends Section<FullScreenPokemon> {
    /**
     * Fades Actors in and out.
     */
    @member(Fading)
    public readonly fading: Fading;

    /**
     * Shrinks (and expands) Actors.
     */
    @member(Shrinking)
    public readonly shrinking: Shrinking;

    /**
     * Slides Actors across the screen.
     */
    @member(Sliding)
    public readonly sliding: Sliding;
}
