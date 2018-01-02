import { IAudioPlayrSettings } from "audioplayr";

/**
 * @returns Audio settings for a FullScreenPokemon instance.
 */
export const GenerateAudioSettings = (): Partial<IAudioPlayrSettings> => ({
    nameTransform: (name: string): string => `sounds/${name}.mp3`,
});
