import { AudioPlayr } from "audioplayr";

import { EightBittr } from "../EightBittr";

export const createAudioPlayer = (eightBitter: EightBittr) =>
    new AudioPlayr({
        nameTransform: eightBitter.audio.nameTransform,
        storage: eightBitter.itemsHolder,
        ...eightBitter.settings.components.audioPlayer,
    });