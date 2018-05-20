import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Shrinking } from "./animations/Shrinking";
import { Sliding } from "./animations/Sliding";

/**
 * Generic animations for Things.
 */
export class Animations<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Shrinks (and expands) Things.
     */
    @component(Shrinking)
    public readonly shrinking: Shrinking<TEightBittr>;

    /**
     * Slides Things across the screen.
     */
    @component(Sliding)
    public readonly sliding: Sliding<TEightBittr>;
}
