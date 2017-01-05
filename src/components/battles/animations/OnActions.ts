import { IFleeAction, IItemAction, IMoveAction, ISwitchAction } from "battlemovr/lib/Actions";
import { IOnActions } from "battlemovr/lib/Animations";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Battle action animations used by FullScreenPokemon instances.
 */
export class OnActions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IOnActions {
    /**
     * Callback for when a team attempting to leave the battle.
     * 
     * @param team   Which team is performing the action.
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public flee(team: Team, action: IFleeAction, onComplete: () => void): void {
        console.log("Flee action:", team, action);
        onComplete();
    }

    /**
     * Callback for when a team using an item.
     * 
     * @param team   Which team is performing the action.
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public item(team: Team, action: IItemAction, onComplete: () => void): void {
        console.log("Item action:", team, action);
        onComplete();
    }

    /**
     * Callback for when a team's selected actor using a move.
     * 
     * @param team   Which team is performing the action.
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public move(team: Team, action: IMoveAction, onComplete: () => void): void {
        console.log("Move action:", team, action);
        onComplete();
    }

    /**
     * Callback for when a team switching actors.
     * 
     * @param team   Which team is performing the action.
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public switch(team: Team, action: ISwitchAction, onComplete: () => void): void {
        console.log("Move action:", team, action);
        onComplete();
    }
}
