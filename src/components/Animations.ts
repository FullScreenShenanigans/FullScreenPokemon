import { component } from "babyioc";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Shrinking } from "./animations/Shrinking";
import { Sliding } from "./animations/Sliding";

/**
 * Generic animations for Things.
 */
export class Animations<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Shrinks (and expands) Things.
     */
    @component(Shrinking)
    public readonly shrinking: Shrinking<TGameStartr>;

    /**
     * Slides Things across the screen.
     */
    @component(Sliding)
    public readonly sliding: Sliding<TGameStartr>;
}
