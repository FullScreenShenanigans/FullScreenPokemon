import { IFleeAction, IItemAction, IMoveAction, IOnActions, ISwitchAction } from "battlemovr/lib/Actions";
import { ITeamAndAction } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { FleeAttempt } from "./actions/FleeAttempt";
import { Effects } from "./Effects";
import { Moves } from "./Moves";
import { DefaultMovesBag } from "./moves/MovesBag";

/**
 * Player action animations used by FullScreenPokemon instances.
 */
export class Actions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IOnActions {
    /**
     * Action effect animations.
     */
    public readonly effects: Effects<TGameStartr> = new Effects(this.gameStarter);

    /**
     * Callback for when a team attempts to leave the battle.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public flee(_action: ITeamAndAction<IFleeAction>, onComplete: () => void): void {
        new FleeAttempt<TGameStartr>(this.gameStarter).attempt(onComplete);
    }

    /**
     * Callback for when a team uses an item.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public item(action: ITeamAndAction<IItemAction>, onComplete: () => void): void {
        console.log("Player item action:", action);
        onComplete();
    }

    /**
     * Callback for when a team's selected actor uses a move.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public move(teamAndAction: ITeamAndAction<IMoveAction>, onComplete: () => void): void {
        new Moves(this.gameStarter, DefaultMovesBag).playMove(
            teamAndAction,
            (): void => new Effects(this.gameStarter).runMoveEffects(teamAndAction, onComplete));
    }

    /**
     * Callback for when a team switches actors.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public switch(action: ITeamAndAction<ISwitchAction>, onComplete: () => void): void {
        console.log("Player switch action:", action);
        onComplete();
    }
}
