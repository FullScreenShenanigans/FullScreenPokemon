import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMoveSchema } from "../constants/Moves";

/**
 * Move equations used by FullScreenPokemon instances.
 */
export class Moves<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Checks whether a move only has a status effect (does no damage, or nothing).
     * 
     * @param move   Schema for a move.
     * @returns Whether the moves has only a status effect primarily.
     */
    public moveOnlyStatuses(moveSchema: IMoveSchema): boolean {
        for (const effect of moveSchema.effects) {
            if (effect.type === "damage") {
                return false;
            }
        }

        return true;
    }

    /**
     * Determines whether a move primarily changes a statistic by a certain amount.
     * 
     * @param moveSchema   Schema for a move.
     * @param statistic   Statistic that should be changed.
     * @param change   How much the statistic should be changed.
     * @returns Whether the move raises the statistic by the amount.
     */
    public moveChangesStatisticByAmount(moveSchema: IMoveSchema, statistic: string, change: number): boolean {
        for (const effect of moveSchema.effects) {
            if (effect.probability && effect.probability !== 100) {
                continue;
            }

            if (effect.type === "statistic" && effect.statistic === statistic && effect.change === change) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines whether a move is primarily effective against a set of types.
     * 
     * @param moveSchema   Schema for a move.
     * @param types   Set of Pokemon types.
     * @returns Whether the move is primarily effective against the types.
     */
    public moveIsRelevantAgainst(moveSchema: IMoveSchema, types: string[]): boolean {
        for (const effect of moveSchema.effects) {
            if (effect.type !== "damage" || (effect.probability && effect.probability !== 100)) {
                continue;
            }

            if (types.indexOf(moveSchema.type) !== -1) {
                return true;
            }
        }

        return false;
    }
}
