import { ISelector, ISelectorFactory } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { OpponentSelector } from "./selectors/OpponentSelector";
import { PlayerSelector } from "./selectors/PlayerSelector";

/**
 * Battle action selectors used by FullScreenPokemon instances.
 */
export class Selectors<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Generates selectors for an opponent's actions.
     */
    public readonly opponent: ISelectorFactory = (): ISelector => new OpponentSelector(this.gameStarter);

    /**
     * Generates selectors for a player's actions.
     */
    public readonly player: ISelectorFactory = (): ISelector => new PlayerSelector(this.gameStarter);
}
