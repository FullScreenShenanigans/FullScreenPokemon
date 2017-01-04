import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { GrowlMove } from "./moves/GrowlMove";
import { Move } from "./moves/Move";

/**
 * Battle move runners, keyed by move name.
 */
export interface IMoves {
    /**
     * Move for when an implementation cannot be found.
     */
    default: typeof Move;

    [i: string]: typeof Move;
}

/**
 * Battle move functions used by FullScreenPokemon instances.
 */
export class Moves<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly moves: IMoves = {
        GROWL: GrowlMove,
        default: Move
    };

    /**
     * Plays a battle move.
     * 
     * @param title   Title of the move.
     * @param source   Team whose Pokemon is using the move.
     * @param target   Team whose Pokemon is being targeted.
     * @param callback   Callback for when the move is done.
     */
    public playMove(title: string, source: Team, target: Team, callback: () => void): void {
        new (this.moves[title] || this.moves.default)(this.gameStarter, title, source, target).runAnimation(callback);
    }
}
