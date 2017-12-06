import { stub } from "sinon";

import { FullScreenPokemon, IFullScreenPokemonSettings } from "../../src/FullScreenPokemon";

/**
 * Creates a stubbed instance of the FullScreenPokemon class.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class.
 */
export function stubFullScreenPokemon(settings?: IFullScreenPokemonSettings): FullScreenPokemon {
    settings = settings || {
        width: 256,
        height: 256
    };

    const fsp = new FullScreenPokemon();

    fsp.reset({
        height: settings.height || 256,
        moduleSettings: {
            audio: {
                fileTypes: []
            }
        },
        width: settings.width || 256,
    });

    stub(fsp.audioPlayer, "play");
    stub(fsp.audioPlayer, "playLocal");
    stub(fsp.audioPlayer, "playTheme");
    stub(fsp.audioPlayer, "playThemePrefixed");

    return fsp;
}

/**
 * Creates a new instance of the FullScreenPokemon class with an in-progress game.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class with an in-progress game.
 */
export function stubBlankGame(settings?: IFullScreenPokemonSettings): FullScreenPokemon {
    const fsp: FullScreenPokemon = stubFullScreenPokemon(settings);

    fsp.itemsHolder.setItem("name", "Test".split(""));

    fsp.maps.setMap("Blank");
    fsp.maps.addPlayer(0, 0);

    return fsp;
}
