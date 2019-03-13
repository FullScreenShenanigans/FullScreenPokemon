import { component } from "babyioc";
import { IMoveAction, IMoveEffect, ITeamAndAction, Queue, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";

import { Damage } from "./effects/Damage";
import { Missed } from "./effects/Missed";
import { Statistics } from "./effects/Statistics";
import { Statuses } from "./effects/Statuses";
import { Switching } from "./effects/Switching";
import { Fainting } from "./Fainting";

/**
 * Battle animations for move effects.
 */
export class Effects<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Runs animations for fainting.
     */
    @component(Fainting)
    public readonly fainting: Fainting<TEightBittr>;

    /**
     * Runs animations for effect damages.
     */
    @component(Damage)
    private readonly damage: Damage<TEightBittr>;

    /**
     * Runs animations for missed effects.
     */
    @component(Missed)
    private readonly missed: Missed<TEightBittr>;

    /**
     * Runs animations for statistic effects.
     */
    @component(Statistics)
    private readonly statistics: Statistics<TEightBittr>;

    /**
     * Runs animations for status effects.
     */
    @component(Statuses)
    private readonly statuses: Statuses<TEightBittr>;

    /**
     * Runs animations for switching effects.
     */
    @component(Switching)
    private readonly switching: Switching<TEightBittr>;

    /**
     * Runs a move action's effects consecutively.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when the action is done.
     */
    public runMoveEffects(teamAndAction: ITeamAndAction<IMoveAction>, onComplete: () => void): void {
        const queue: Queue = new Queue();

        for (const effect of this.eightBitter.constants.moves.byName[teamAndAction.action.move].effects) {
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
        if (this.eightBitter.numberMaker.randomIntWithin(0, 100) > effect.probability!) {
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

        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

        battleInfo.teams[Team[teamAndAction.target.team]].selector.afterKnockout(
            battleInfo,
            teamAndAction.target.team,
            onComplete);
    }
}
