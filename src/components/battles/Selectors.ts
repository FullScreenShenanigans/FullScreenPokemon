import { ISelector, ISelectorFactory } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

import { OpponentSelector } from "./selectors/OpponentSelector";
import { PlayerSelector } from "./selectors/PlayerSelector";

/**
 * Selects actions for each team.
 */
export class Selectors<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Generates selectors for an opponent's actions.
     */
    public readonly opponent: ISelectorFactory = (): ISelector => new OpponentSelector(this.eightBitter);

    /**
     * Generates selectors for a player's actions.
     */
    public readonly player: ISelectorFactory = (): ISelector => new PlayerSelector(this.eightBitter);
}
