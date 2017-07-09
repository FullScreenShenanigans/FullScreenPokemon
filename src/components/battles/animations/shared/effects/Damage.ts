import { IMoveAction } from "battlemovr/lib/Actions";
import { IActor, IStatistic } from "battlemovr/lib/Actors";
import { IDamageEffect } from "battlemovr/lib/Effects";
import { ITeamAndAction } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IPokemon } from "../../../../Battles";
import { Calculator } from "./damage/Calculator";

/**
 * Runs damage effect animations for FullScreenPokemon instances.
 */
export class Damage<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Calculates damage dealt from battle moves.
     */
    private readonly calculator: Calculator<TGameStartr> = new Calculator(this.gameStarter);

    /**
     * Runs the damage animation for a battle move effect.
     *
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move whose damage is being calculated.
     * @param onComplete   Handler for when this is done.
     */
    public run(teamAndAction: ITeamAndAction<IMoveAction>, effect: IDamageEffect, onComplete: () => void): void {
        const statistic: IStatistic = teamAndAction.target.actor.statistics.health;
        const amount: number = this.calculator.calculateDamage(teamAndAction, effect);
        const attackingPokemon: IActor = teamAndAction.source.actor;

        this.updateBattleParticipants(attackingPokemon, teamAndAction);
        this.gameStarter.battles.decorations.health.animatePokemonHealthBar(
            teamAndAction.target.team,
            statistic.current,
            statistic.current - amount,
            (): void => {
                if (statistic.current !== 0) {
                    onComplete();
                    return;
                }

                this.gameStarter.battles.animations.getTeamAnimations(teamAndAction.target.team)
                    .actions.effects.fainting.run(
                        teamAndAction.target.actor as IPokemon,
                        teamAndAction.target.team, onComplete);
            });

        statistic.current -= amount;
    }

    /**
     * Updates the battleParticipant list.
     *
     * @param attackingPokemon  Pokemon that performed attack
     * @param teamAndAction  Team and move being performed
     */
    private updateBattleParticipants(attackingPokemon: IActor, teamAndAction: ITeamAndAction<IMoveAction>): void {
        if (teamAndAction.source.team === 1 &&
            (this.gameStarter.itemsHolder.getItem("battleParticipants").indexOf(attackingPokemon) === -1)) {
            const participants = this.gameStarter.itemsHolder.getItem("battleParticipants");
            participants.push(teamAndAction.source.actor);
            this.gameStarter.itemsHolder.setItem("battleParticipants", participants);
        }
    }
}
