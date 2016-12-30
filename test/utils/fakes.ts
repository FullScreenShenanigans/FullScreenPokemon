import { ISizeSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../../src/FullScreenPokemon";

/**
 * Creates a new instance of the FullScreenPokemon class.
 * 
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class.
 */
export function stubFullScreenPokemon(settings?: ISizeSettings): FullScreenPokemon {
    return new FullScreenPokemon(settings || {
        width: 256,
        height: 256
    });
};

/**
 * Creates a new instance of the FullScreenPokemon class with an in-progress game.
 * 
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class with an in-progress game.
 */
export function stubBlankGame(settings?: ISizeSettings): FullScreenPokemon {
    const fsp: FullScreenPokemon = stubFullScreenPokemon(settings);

    fsp.itemsHolder.setItem("name", "Test".split(""));

    fsp.maps.setMap("Blank");
    fsp.maps.addPlayer(0, 0);

    return fsp;
}
