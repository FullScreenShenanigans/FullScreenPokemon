import { member } from "babyioc";

import { Modifications } from "./battles/Modifications";
import { Texts } from "./battles/Texts";

/**
 * Universal battle constants.
 */
export class Battles {
    /**
     * Battle modifications for the second turn.
     */
    @member(Modifications)
    public readonly modifications: Modifications;

    /**
     * Battle text generators.
     */
    @member(Texts)
    public readonly texts: Texts;
}
