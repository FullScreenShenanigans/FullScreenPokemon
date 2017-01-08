import { IFleeAction, IItemAction, IMoveAction, IOnActions, ISwitchAction } from "battlemovr/lib/Actions";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";

/**
 * Player action animations used by FullScreenPokemon instances.
 */
export class Actions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IOnActions {
    /**
     * Callback for when a team attempts to leave the battle.
     * 
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public flee(action: IFleeAction, onComplete: () => void): void {
        console.log("Player flee action:", action);
        onComplete();
    }

    /**
     * Callback for when a team uses an item.
     * 
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public item(action: IItemAction, onComplete: () => void): void {
        console.log("Player item action:", action);
        onComplete();
    }

    /**
     * Callback for when a team's selected actor uses a move.
     * 
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public move(action: IMoveAction, onComplete: () => void): void {
        console.log("Player move action:", action);
        onComplete();
    }

    /**
     * Callback for when a team switches actors.
     * 
     * @param action   Action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public switch(action: ISwitchAction, onComplete: () => void): void {
        console.log("Player switch action:", action);
        onComplete();
    }
}
