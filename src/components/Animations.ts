import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Fading } from "./animations/Fading";
import { Shrinking } from "./animations/Shrinking";
import { Sliding } from "./animations/Sliding";

/**
 * Generic animations for Things.
 */
export class Animations extends Section<FullScreenPokemon> {
    /**
     * Fades Things in and out.
     */
    @member(Fading)
    public readonly fading: Fading;

    /**
     * Shrinks (and expands) Things.
     */
    @member(Shrinking)
    public readonly shrinking: Shrinking;

    /**
     * Slides Things across the screen.
     */
    @member(Sliding)
    public readonly sliding: Sliding;
}
