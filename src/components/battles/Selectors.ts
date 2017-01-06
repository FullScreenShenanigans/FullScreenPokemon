import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { OpponentSelector } from "./selectors/OpponentSelector";
import { PlayerSelector } from "./selectors/PlayerSelector";

/**
 * Battle action selectors used by FullScreenPokemon instances.
 */
export class Selectors<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Selector for an opponent's actions.
     */
    public readonly opponent: OpponentSelector<TGameStartr> = new OpponentSelector(this.gameStarter);

    /**
     * Selector for a player's actions.
     */
    public readonly player: PlayerSelector<TGameStartr> = new PlayerSelector(this.gameStarter);
}
