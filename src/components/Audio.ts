import { component } from "babyioc";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { SoundAliases } from "./audio/SoundAliases";
import { SoundNames } from "./audio/SoundNames";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Aliases for playable sounds.
     */
    @component(SoundAliases)
    public readonly aliases: SoundAliases;

    /**
     * Names for playable sounds.
     */
    @component(SoundNames)
    public readonly names: SoundNames;
}
