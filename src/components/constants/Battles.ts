import { component } from "babyioc";

import { Modifications } from "./battles/Modifications";
import { Texts } from "./battles/Texts";

/**
 * Universal battle constants.
 */
export class Battles {
    /**
     * Battle modifications for the second turn.
     */
    @component(Modifications)
    public readonly modifications: Modifications;

    /**
     * Battle text generators.
     */
    @component(Texts)
    public readonly texts: Texts;
}
