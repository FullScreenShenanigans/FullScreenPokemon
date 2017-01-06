import { IOnChoice, ISelector } from "battlemovr/lib/Selectors";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";

/**
 * Selector for an opponent's actions.
 */
export class OpponentSelector<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISelector {
    /**
     * Determines the next action to take.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    public nextAction(battleInfo: IBattleInfo, onChoice: IOnChoice): void {
        console.log({ battleInfo, onChoice });
        return {} as any;
    }
}
