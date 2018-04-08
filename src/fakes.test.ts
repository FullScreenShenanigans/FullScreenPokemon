import { AudioElementSound } from "audioplayr";
import { IGameStartrConstructorSettings } from "gamestartr";
import * as lolex from "lolex";
import * as sinon from "sinon";

import { IMenu } from "./components/Menus";
import { IPlayer } from "./components/Things";
import { FullScreenPokemon } from "./FullScreenPokemon";

export interface IStubFullScreenPokemonSettings extends Partial<IGameStartrConstructorSettings> {
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
export const stubFullScreenPokemon = (settings: IStubFullScreenPokemonSettings = {}) => {
    settings = {
        width: 256,
        height: 256,
        ...settings,
    };

    const clock = lolex.createClock();
    const prefix = `${new Date().getTime()}`;
    const fsp = new FullScreenPokemon({
        height: settings.height || 256,
        components: {
            audio: {
                createSound: () => sinon.createStubInstance(AudioElementSound),
            },
            drawing: {
                framerateSkip: 9000001,
            },
            items: { prefix },
            runner: {
                tickCanceller: clock.clearTimeout,
                tickScheduler: clock.setTimeout,
            },
        },
        width: settings.width || 256,
    });

    // Makes menus auto-complete during unit tests without extra ticks or waiting
    if (settings.automaticallyAdvanceMenus) {
        const menuPrototype = fsp.objectMaker.getPrototypeOf<IMenu>(fsp.things.names.menu);

        menuPrototype.textSpeed = 0;
        menuPrototype.finishAutomatically = true;
        menuPrototype.finishLinesAutomatically = true;
    }

    return { clock, fsp, prefix };
};

/**
 * Creates a new instance of the FullScreenPokemon class in the Blank map.
 *
 * @param settings   Size settings, if not a default small window size.
 * @returns A new instance of the FullScreenPokemon class with an in-progress game.
 */
export const stubBlankGame = (settings?: IStubFullScreenPokemonSettings) => {
    const { fsp, ...options } = stubFullScreenPokemon(settings);

    fsp.itemsHolder.setItem(fsp.storage.names.name, "Test".split(""));

    fsp.maps.setMap("Blank");
    fsp.maps.addPlayer(0, 0);

    const player: IPlayer = fsp.players[0];

    return { fsp, player, ...options };
};

export const stubGameForMapsTest = () => stubFullScreenPokemon().fsp;
