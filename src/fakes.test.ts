import { AudioElementSound } from "audioplayr";
import { IGameStartrConstructorSettings } from "gamestartr";
import * as sinon from "sinon";

import { FullScreenPokemon } from "./FullScreenPokemon";

/**
 * Creates a stubbed instance of the FullScreenPokemon class.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class.
 */
export const stubFullScreenPokemon = (settings?: IGameStartrConstructorSettings): FullScreenPokemon => {
    settings = settings || {
        width: 256,
        height: 256,
    };

    const fsp = new FullScreenPokemon({
        height: settings.height || 256,
        components: {
            audio: {
                createSound: () => sinon.createStubInstance(AudioElementSound),
            },
        },
        width: settings.width || 256,
    });

    return fsp;
};

/**
 * Creates a new instance of the FullScreenPokemon class with an in-progress game.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class with an in-progress game.
 */
export const stubBlankGame = (settings?: IGameStartrConstructorSettings): FullScreenPokemon => {
    const fsp: FullScreenPokemon = stubFullScreenPokemon(settings);

    fsp.itemsHolder.setItem("name", "Test".split(""));

    fsp.maps.setMap("Blank");
    fsp.maps.addPlayer(0, 0);

    return fsp;
};
