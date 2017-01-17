import { ISelector, ISelectorFactory } from "battlemovr/lib/Selectors";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { OpponentSelector } from "./selectors/OpponentSelector";
import { PlayerSelector } from "./selectors/PlayerSelector";

/**
 * Battle action selectors used by FullScreenPokemon instances.
 */
export class Selectors<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Generates selectors for an opponent's actions.
     */
    public readonly opponent: ISelectorFactory = (): ISelector => new OpponentSelector(this.gameStarter);

    /**
     * Generates selectors for a player's actions.
     */
    public readonly player: ISelectorFactory = (): ISelector => new PlayerSelector(this.gameStarter);
}
