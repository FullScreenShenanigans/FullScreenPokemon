import { member } from "babyioc";
import {
    FleeAction,
    ItemAction,
    MoveAction,
    OnActions,
    SwitchAction,
    TeamAndAction,
} from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";

import { FleeAttempt } from "./actions/FleeAttempt";
import { Effects } from "./Effects";
import { Moves } from "./Moves";
import { DefaultMovesBag } from "./moves/MovesBag";

/**
 * Shared animations for team actions.
 */
export class Actions extends Section<FullScreenPokemon> implements OnActions {
    /**
     * Battle animations for move effects.
     */
    @member(Effects)
    public readonly effects: Effects;

    /**
     * Callback for when a team attempts to leave the battle.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public flee(_action: TeamAndAction<FleeAction>, onComplete: () => void): void {
        new FleeAttempt(this.game).attempt(onComplete);
    }

    /**
     * Callback for when a team uses an item.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public item(action: TeamAndAction<ItemAction>, onComplete: () => void): void {
        console.log("Team item action:", action);
        onComplete();
    }

    /**
     * Callback for when a team's selected actor uses a move.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public move(teamAndAction: TeamAndAction<MoveAction>, onComplete: () => void): void {
        new Moves(this.game, DefaultMovesBag).playMove(teamAndAction, (): void =>
            new Effects(this.game).runMoveEffects(teamAndAction, onComplete)
        );
    }

    /**
     * Callback for when a team switches actors.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public switch(action: TeamAndAction<SwitchAction>, onComplete: () => void): void {
        console.log("Team switch action:", action);
        onComplete();
    }
}
