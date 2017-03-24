import { IMoveAction } from "battlemovr/lib/Actions";
import { Queue } from "battlemovr/lib/animators/Queue";
import { IMoveEffect } from "battlemovr/lib/Effects";
import { ITeamAndAction, Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { Damage } from "./effects/Damage";
import { Missed } from "./effects/Missed";
import { Statistics } from "./effects/Statistics";
import { Statuses } from "./effects/Statuses";
import { Switching } from "./effects/Switching";
import { Fainting } from "./Fainting";

/**
 * Action effect animations used by FullScreenPokemon instances.
 */
export class Effects<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Runs animations for fainting.
     */
    public readonly fainting: Fainting<TGameStartr> = new Fainting(this.gameStarter);

    /**
     * Runs animations for effect damages.
     */
    private readonly damage: Damage<TGameStartr> = new Damage(this.gameStarter);

    /**
     * Runs animations for missed effects.
     */
    private readonly missed: Missed<TGameStartr> = new Missed(this.gameStarter);

    /**
     * Runs animations for statistic effects.
     */
    private readonly statistics: Statistics<TGameStartr> = new Statistics(this.gameStarter);

    /**
     * Runs animations for status effects.
     */
    private readonly statuses: Statuses<TGameStartr> = new Statuses(this.gameStarter);

    /**
     * Runs animations for switching effects.
     */
    private readonly switching: Switching<TGameStartr> = new Switching(this.gameStarter);

    /**
     * Runs a move action's effects consecutively.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public runMoveEffects(teamAndAction: ITeamAndAction<IMoveAction>, onComplete: () => void): void {
        const queue: Queue = new Queue();

        for (const effect of this.gameStarter.constants.moves.byName[teamAndAction.action.move].effects) {
            queue.add((afterEffect: () => void): void => this.runEffect(teamAndAction, effect, afterEffect));
            queue.add((afterEffect: () => void): void => this.runAfterEffect(teamAndAction, afterEffect));
        }

        queue.run(onComplete);
    }

    /**
     * Runs a move action's effect.
     * 
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the effect is done.
     */
    private runEffect(teamAndAction: ITeamAndAction<IMoveAction>, effect: IMoveEffect, onComplete: () => void): void {
        if (this.gameStarter.numberMaker.randomIntWithin(0, 100) > effect.probability!) {
            this.missed.run(teamAndAction, effect, onComplete);
            return;
        }

        switch (effect.type) {
            case "damage":
                this.damage.run(teamAndAction, effect, onComplete);
                return;

            case "statistic":
                this.statistics.run(teamAndAction, effect, onComplete);
                return;

            case "status":
                this.statuses.run(teamAndAction, effect, onComplete);
                return;

            case "switch":
                this.switching.run(teamAndAction, effect, onComplete);
                return;

            default:
                throw new Error(`Unknown effect type: '${(effect as IMoveEffect).type}'.`);
        }
    }

    /**
     * Switches Pokemon if needed.
     * 
     * @param teamAndAction   Team and action that was performed.
     * @param onComplete   Handler for when this is done.
     */
    private runAfterEffect(teamAndAction: ITeamAndAction<IMoveAction>, onComplete: () => void): void {
        if (teamAndAction.target.actor.statistics.health.current !== 0) {
            onComplete();
            return;
        }

        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        battleInfo.teams[Team[teamAndAction.target.team]].selector.afterKnockout(
            battleInfo,
            teamAndAction.target.team,
            onComplete);
    }
}
