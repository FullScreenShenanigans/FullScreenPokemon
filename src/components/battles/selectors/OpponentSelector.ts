import { member } from "babyioc";
import { BattleOutcome, IOnChoice, ISelector, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IBattleTeam, IPokemon } from "../../Battles";

import { IMovePossibility, MovePriorityGenerator } from "./opponent/MovePriorityGenerator";

/**
 * Selector for an opponent's actions.
 */
export class OpponentSelector extends Section<FullScreenPokemon> implements ISelector {
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
    public afterKnockout(battleInfo: IBattleInfo, team: Team, onComplete: () => void): void {
        const newPokemon: IPokemon | undefined = battleInfo.teams[Team[team]].actors
            .filter((actor: IPokemon): boolean =>
                actor.statistics.health.current !== 0)
        [0] as IPokemon | undefined;

        if (newPokemon !== undefined) {
            this.eightBitter.battleMover.switchSelectedActor(team, newPokemon);
            this.eightBitter.battles.animations.getTeamAnimations(team).switching.enter(onComplete);
        } else {
            this.eightBitter.battleMover.stopBattle(
                team === Team.opponent
                    ? BattleOutcome.playerVictory
                    : BattleOutcome.opponentVictory);
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
    public nextAction(battleInfo: IBattleInfo, team: Team, onChoice: IOnChoice): void {
        const attackingTeam: IBattleTeam = battleInfo.teams[Team[team]];
        const defendingTeam: IBattleTeam = team === Team.opponent
            ? battleInfo.teams.player
            : battleInfo.teams.opponent;
        const attackingActor: IPokemon = battleInfo.teams[Team[team]].selectedActor;

        // Wild Pokemon just choose randomly
        if (!attackingTeam.leader) {
            onChoice({
                move: this.eightBitter.numberMaker.randomArrayMember(attackingActor.moves).title,
                type: "move",
            });

            return;
        }

        let possibilities: IMovePossibility[] = this.movePriorityGenerator.generate(attackingTeam, defendingTeam, attackingActor.moves);

        // The AI uses rejection sampling on the four moves with ratio 63:64:63:66,
        // with only the moves that are most favored after applying the modifications being acceptable.
        let lowest: number = possibilities[0].priority;
        if (possibilities.length > 1) {
            for (const possibility of possibilities) {
                if (possibility.priority < lowest) {
                    lowest = possibility.priority;
                }
            }

            possibilities = possibilities.filter((possibility: IMovePossibility): boolean =>
                possibility.priority === lowest);
        }

        onChoice({
            move: this.eightBitter.numberMaker.randomArrayMember(possibilities).move,
            type: "move",
        });
    }
}
