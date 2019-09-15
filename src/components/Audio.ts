import { component } from "babyioc";
import { Audio as EightBittrAudio } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { SoundAliases } from "./audio/SoundAliases";
import { SoundNames } from "./audio/SoundNames";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TEightBittr extends FullScreenPokemon> extends EightBittrAudio<TEightBittr> {
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

    /**
     * Transforms provided names into file names.
     */
    public readonly nameTransform = (name: string): string =>
        `sounds/${name}.mp3`
}
