import { IOnChoice, ISelector } from "battlemovr/lib/Selectors";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IBattleTeam, IPokemon } from "../../Battles";
import { IMovePossibility, MovePriorityGenerator } from "./opponent/MovePriorityGenerator";

/**
 * Selector for an opponent's actions.
 */
export class OpponentSelector<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISelector {
    /**
     * 
     */
    private readonly movePriorityGenerator: MovePriorityGenerator<TGameStartr> = new MovePriorityGenerator(this.gameStarter);

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
                move: this.gameStarter.numberMaker.randomArrayMember(attackingActor.moves),
                type: "move"
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

            possibilities = possibilities.filter((possibility: IMovePossibility): boolean => {
                return possibility.priority === lowest;
            });
        }

        onChoice({
            move: this.gameStarter.numberMaker.randomArrayMember(possibilities).move,
            type: "move"
        });
    }
}
