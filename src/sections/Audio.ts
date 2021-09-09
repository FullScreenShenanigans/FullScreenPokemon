import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { SoundAliases } from "./audio/SoundAliases";
import { SoundNames } from "./audio/SoundNames";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio extends Section<FullScreenPokemon> {
    /**
     * Aliases for playable sounds.
     */
    @member(SoundAliases)
    public readonly aliases: SoundAliases;

    /**
     * Names for playable sounds.
     */
    @member(SoundNames)
    public readonly names: SoundNames;

    /**
     * Transforms provided names into file names.
     */
    public readonly nameTransform = (name: string) => `../src/sounds/${name}.mp3`;
}
