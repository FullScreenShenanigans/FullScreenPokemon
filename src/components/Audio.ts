import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { SoundAliases } from "./audio/SoundAliases";
import { SoundNames } from "./audio/SoundNames";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
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
