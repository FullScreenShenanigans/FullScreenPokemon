import { AudioPlayr } from "audioplayr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createAudioPlayer = (fsp: FullScreenPokemon) =>
    new AudioPlayr({
        nameTransform: (name: string): string => `sounds/${name}.mp3`,
        ...fsp.settings.components.audio,
    });
