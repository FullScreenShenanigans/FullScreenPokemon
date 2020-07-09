import { AudioPlayr } from "audioplayr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createAudioPlayer = (game: FullScreenPokemon) =>
    new AudioPlayr({
        nameTransform: game.audio.nameTransform,
        storage: game.itemsHolder,
        ...game.settings.components.audioPlayer,
    });