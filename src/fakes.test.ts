import { createClock } from "@sinonjs/fake-timers";
import { AudioElementSound } from "audioplayr";
import { EightBittrConstructorSettings } from "eightbittr";
import { createStorage } from "itemsholdr";
import * as sinon from "sinon";

import { Menu } from "./sections/Menus";
import { Player } from "./sections/Actors";
import { FullScreenPokemon } from "./FullScreenPokemon";

export interface StubFullScreenPokemonSettings extends Partial<EightBittrConstructorSettings> {
    /**
     * Whether to enable MenuGraphr's finishAutomatically and finishLinesAutomatically.
     */
    automaticallyAdvanceMenus?: boolean;
}

/**
 * Creates a stubbed instance of the FullScreenPokemon class.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class.
 */
export const stubFullScreenPokemon = (settings: StubFullScreenPokemonSettings = {}) => {
    settings = {
        width: 256,
        height: 256,
        ...settings,
    };

    const clock = createClock();
    const prefix = `${new Date().getTime()}`;
    const storage = createStorage();
    const fsp = new FullScreenPokemon({
        height: settings.height || 256,
        components: {
            audioPlayer: {
                createSound: () => sinon.createStubInstance(AudioElementSound),
            },
            frameTicker: {
                timing: {
                    cancelFrame: clock.clearTimeout,
                    getTimestamp: () => clock.now,
                    requestFrame: (callback) =>
                        clock.setTimeout(() => {
                            callback(clock.now);
                        }, 1),
                },
            },
            itemsHolder: { prefix, storage },
            pixelDrawer: {
                framerateSkip: 9000001,
            },
        },
        width: settings.width || 256,
    });

    // Makes menus auto-complete during unit tests without extra ticks or waiting
    if (settings.automaticallyAdvanceMenus) {
        const menuPrototype = fsp.objectMaker.getPrototypeOf<Menu>(fsp.actors.names.menu);

        menuPrototype.textSpeed = 0;
        menuPrototype.finishAutomatically = true;
        menuPrototype.finishLinesAutomatically = true;
    }

    return { clock, fsp, prefix, storage };
};

/**
 * Creates a new instance of the FullScreenPokemon class in the Blank map.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class with an in-progress game.
 */
export const stubBlankGame = (settings?: StubFullScreenPokemonSettings) => {
    const { fsp, ...options } = stubFullScreenPokemon(settings);

    fsp.itemsHolder.setItem(fsp.storage.names.name, "Test".split(""));

    fsp.maps.setMap("Blank");
    fsp.maps.addPlayer(0, 0);

    const player: Player = fsp.players[0];

    return { fsp, player, ...options };
};

export const stubGameForMapsTest = () => stubFullScreenPokemon().fsp;
