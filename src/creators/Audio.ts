import { IAudioPlayrSettings } from "audioplayr";

export const audioSettings: Partial<IAudioPlayrSettings> = {
    nameTransform: (name: string): string => `sounds/${name}.mp3`,
};
