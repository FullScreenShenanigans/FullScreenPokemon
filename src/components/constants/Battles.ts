import { Modifications } from "./battles/Modifications";
import { Texts } from "./battles/Texts";

/**
 * Battle constants used by FullScreenPokemon instances.
 */
export class Battles {
    /**
     * Battle modifications for the second turn.
     */
    public readonly modifications: Modifications = new Modifications();

    /**
     * Default texts during battles.
     */
    public readonly texts: Texts = new Texts();
}
