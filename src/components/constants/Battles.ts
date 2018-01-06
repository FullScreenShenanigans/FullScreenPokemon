import { component } from "babyioc";

import { Modifications } from "./battles/Modifications";
import { Texts } from "./battles/Texts";

/**
 * Battle constants used by FullScreenPokemon instances.
 */
export class Battles {
    /**
     * Battle modifications for the second turn.
     */
    @component(Modifications)
    public readonly modifications: Modifications;

    /**
     * Default texts during battles.
     */
    @component(Texts)
    public readonly texts: Texts;
}
