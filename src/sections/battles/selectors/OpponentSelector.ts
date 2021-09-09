import { member } from "babyioc";
import { BattleOutcome, OnChoice, Selector, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo, BattleTeam, Pokemon } from "../../Battles";

import { MovePossibility, MovePriorityGenerator } from "./opponent/MovePriorityGenerator";

/**
 * Selector for an opponent's actions.
 */
export class OpponentSelector extends Section<FullScreenPokemon> implements Selector {
    /**
     * Determines priorities of battle move possibilities.
     */
    @member(MovePriorityGenerator)
    private readonly movePriorityGenerator: MovePriorityGenerator;

    /**
     * Reacts to an actor getting knocked out.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    public afterKnockout(battleInfo: BattleInfo, teamId: TeamId, onComplete: () => void): void {
        const newPokemon: Pokemon | undefined = battleInfo.teams[TeamId[teamId]].actors.filter(
            (actor: Pokemon): boolean => actor.statistics.health.current !== 0
        )[0] as Pokemon | undefined;

        if (newPokemon !== undefined) {
            this.game.battleMover.switchSelectedActor(teamId, newPokemon);
            this.game.battles.animations.getTeamAnimations(teamId).switching.enter(onComplete);
        } else {
            this.game.battleMover.stopBattle(
                teamId === TeamId.opponent
                    ? BattleOutcome.playerVictory
                    : BattleOutcome.opponentVictory
            );
        }
    }

    /**
     * Determines the next action to take.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     * @see http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
     * @todo Items?
     */
    public nextAction(battleInfo: BattleInfo, teamId: TeamId, onChoice: OnChoice): void {
        const attackingTeam: BattleTeam = battleInfo.teams[TeamId[teamId]];
        const defendingTeam: BattleTeam =
            teamId === TeamId.opponent ? battleInfo.teams.player : battleInfo.teams.opponent;
        const attackingActor: Pokemon = battleInfo.teams[TeamId[teamId]].selectedActor;

        // Wild Pokemon just choose randomly
        if (!attackingTeam.leader) {
            onChoice({
                move: this.game.numberMaker.randomArrayMember(attackingActor.moves).title,
                type: "move",
            });

            return;
        }

        let possibilities: MovePossibility[] = this.movePriorityGenerator.generate(
            attackingTeam,
            defendingTeam,
            attackingActor.moves
        );

        // The AI uses rejection sampling on the four moves with ratio 63:64:63:66,
        // with only the moves that are most favored after applying the modifications being acceptable.
        let lowest: number = possibilities[0].priority;
        if (possibilities.length > 1) {
            for (const possibility of possibilities) {
                if (possibility.priority < lowest) {
                    lowest = possibility.priority;
                }
            }

            possibilities = possibilities.filter(
                (possibility: MovePossibility): boolean => possibility.priority === lowest
            );
        }

        onChoice({
            move: this.game.numberMaker.randomArrayMember(possibilities).move,
            type: "move",
        });
    }
}
