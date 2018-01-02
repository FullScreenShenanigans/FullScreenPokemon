import { Component } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { SoundAliases } from "./audio/SoundAliases";
import { SoundNames } from "./audio/SoundNames";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Aliases for playable sounds.
     */
    public readonly aliases = new SoundAliases();

    /**
     * Names for playable sounds.
     */
    public readonly names = new SoundNames();
}
