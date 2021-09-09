import { Move } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { BattleTeam, Pokemon } from "../../../Battles";
import { BattleModification } from "../../../constants/battles/Modifications";
import { MoveSchema } from "../../../constants/Moves";

/**
 * A possible move to be chosen, with its probability.
 */
export interface MovePossibility {
    /**
     * The concatenated name of the move.
     */
    move: string;

    /**
     * What priority the move has.
     */
    priority: number;
}

/**
 * Determines priorities of battle move possibilities.
 */
export class MovePriorityGenerator extends Section<FullScreenPokemon> {
    /**
     * Generates priorities for potential moves.
     *
     * @param attackingTeam   Attacking team deciding on a move.
     * @param defendingTeam   Defending team being moved on.
     * @param moves   Potential moves to use.
     * @returns Move possibilities for the potential moves.
     */
    public generate(
        attackingTeam: BattleTeam,
        defendingTeam: BattleTeam,
        moves: Move[]
    ): MovePossibility[] {
        const possibilities: MovePossibility[] = moves.map(
            (move: Move): MovePossibility => ({
                move: move.title,
                priority: 10,
            })
        );

        // Modification 1: Do not use a move that only statuses if the defending Pokemon already has a status.
        if (defendingTeam.selectedActor.status && !attackingTeam.dumb) {
            for (const possibility of possibilities) {
                if (
                    this.game.equations.moves.moveOnlyStatuses(
                        this.game.constants.moves.byName[possibility.move]
                    )
                ) {
                    possibility.priority += 5;
                }
            }
        }

        // Modification 2: On the second turn the Pokemon is out, prefer a move with one of the following effects...
        if (this.teamKnowsSecondTurnEffects(attackingTeam)) {
            for (const possibility of possibilities) {
                this.applyMoveEffectPriority(
                    possibility,
                    this.game.constants.battles.modifications.turnTwo,
                    defendingTeam.selectedActor,
                    1
                );
            }
        }

        // Modification 3 (Good AI): Prefer a move that is super effective.
        // Do not use moves that are not very effective as long as there is an alternative.
        if (this.teamKnowsSuperEffectiveness(attackingTeam)) {
            for (const possibility of possibilities) {
                this.applyMoveEffectPriority(
                    possibility,
                    this.game.constants.battles.modifications.goodAi,
                    defendingTeam.selectedActor,
                    1
                );
            }
        }

        return possibilities;
    }

    /**
     * Determines whether a team is smart enough for turn two special effect moves.
     *
     * @param team   A battling team.
     * @returns Whether the team is smart enough for turn two special effect moves.
     */
    private teamKnowsSecondTurnEffects(team: BattleTeam): boolean {
        if (!team.leader) {
            return false;
        }

        if (team.smart) {
            return true;
        }

        return (
            team.leader.title.join("") in
            this.game.constants.battles.modifications.turnTwo.opponentType
        );
    }

    /**
     * Determines whether a team is smart enough for super effective moves.
     *
     * @param team   A battling team.
     * @returns Whether the team is smart enough for super effective moves.
     */
    private teamKnowsSuperEffectiveness(team: BattleTeam): boolean {
        if (!team.leader) {
            return false;
        }

        if (team.smart) {
            return true;
        }

        return (
            team.leader.title.join("") in
            this.game.constants.battles.modifications.goodAi.opponentType
        );
    }

    /**
     * Modifies a move possibility's priority based on battle state.
     *
     * @param possibility   A move possibility.
     * @param modification   A modification summary for a part of the battle state.
     * @param target   The Pokemon being targeted.
     * @param amount   How much to modify the move's priority.
     */
    private applyMoveEffectPriority(
        possibility: MovePossibility,
        modification: BattleModification,
        target: Pokemon,
        amount: number
    ): void {
        const moveSchema: MoveSchema = this.game.constants.moves.byName[possibility.move];

        for (const preference of modification.preferences) {
            switch (preference[0]) {
                case "Move":
                    if (possibility.move === preference[1]) {
                        possibility.priority -= amount;
                        return;
                    }
                    break;

                case "Statistic":
                    if (
                        this.game.equations.moves.moveChangesStatisticByAmount(
                            moveSchema,
                            preference[1],
                            preference[2]
                        )
                    ) {
                        possibility.priority -= amount;
                        return;
                    }
                    break;

                case "Super":
                    if (
                        this.game.equations.moves.moveIsRelevantAgainst(moveSchema, target.types)
                    ) {
                        possibility.priority -= amount;
                        return;
                    }
                    break;

                case "Weak":
                    if (
                        this.game.equations.moves.moveIsRelevantAgainst(moveSchema, target.types)
                    ) {
                        possibility.priority += amount;
                        return;
                    }
                    break;

                default:
                    break;
            }
        }
    }
}
