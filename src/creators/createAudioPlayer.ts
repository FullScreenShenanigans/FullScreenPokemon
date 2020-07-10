import { AudioPlayr, wrapNativeStorage } from "audioplayr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createAudioPlayer = (game: FullScreenPokemon) =>
    new AudioPlayr({
        nameTransform: game.audio.nameTransform,
        storage: wrapNativeStorage(game.itemsHolder as Storage),
        ...game.settings.components.audioPlayer,
    });