import { FullScreenPokemon } from "../FullScreenPokemon"

/**
 * A FullScreenPokemon component with full access to game state.
 * 
 * @todo Eventually each component should have as little state access as possible.
 */
export abstract class Component {
    /**
     * FullScreenPokemon instance this is used for.
     */
    protected readonly fsp: FullScreenPokemon;

    /**
     * Initializes a new instance of the Component class.
     * 
     * @param fsp   FullScreenPokemon instance this is used for.
     */
    public constructor(fsp: FullScreenPokemon) {
        this.fsp = fsp;
    }
}