import { Selector, SelectorFactory } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

import { OpponentSelector } from "./selectors/OpponentSelector";
import { PlayerSelector } from "./selectors/PlayerSelector";

/**
 * Selects actions for each team.
 */
export class Selectors extends Section<FullScreenPokemon> {
    /**
     * Generates selectors for an opponent's actions.
     */
    public readonly opponent: SelectorFactory = (): Selector => new OpponentSelector(this.game);

    /**
     * Generates selectors for a player's actions.
     */
    public readonly player: SelectorFactory = (): Selector => new PlayerSelector(this.game);
}
