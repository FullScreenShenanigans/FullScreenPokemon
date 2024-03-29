import { DamageEffect, MoveAction, TeamAndAction } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { Pokemon } from "../../../../../Battles";
import { MoveSchema } from "../../../../../constants/Moves";

/**
 * Calculates damage dealt from battle moves.
 */
export class Calculator extends Section<FullScreenPokemon> {
    /**
     * Calculates how much damage a move should do to a Pokemon.
     *
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking pokemon.
     * @param defender   The defending Pokemon.
     * @returns How much damage should be dealt.
     * @see http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
     * @see http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     * @remarks Todo: Factor in spec differences from burns, etc.
     */
    public calculateDamage(
        teamAndAction: TeamAndAction<MoveAction>,
        effect: DamageEffect
    ): number {
        const base: number = effect.damage;

        if (!isFinite(base)) {
            return teamAndAction.target.actor.statistics.health.current;
        }

        const attacker: Pokemon = teamAndAction.source.actor as Pokemon;
        const defender: Pokemon = teamAndAction.target.actor as Pokemon;
        const critical: boolean = this.isCriticalHit(teamAndAction.action.move, attacker);
        const level: number = attacker.level * Number(critical);
        const attack: number = attacker.statistics.attack.current;
        const defense: number = defender.statistics.defense.current;
        const modifier: number = this.getDamageModifier(
            teamAndAction.action.move,
            attacker,
            defender
        );

        const damage: number = Math.round(
            Math.max(
                ((((level * 2 + 10) / 250) * (attack / defense) * base + 2) | 0) * modifier,
                1
            )
        );

        return Math.min(teamAndAction.target.actor.statistics.health.current, damage);
    }

    /**
     * Determines the damage modifier against a defending Pokemon.
     *
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking Pokemon.
     * @param defender   The defending Pokemon.
     * @returns The damage modifier, as a multiplication constant.
     * @see http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
     * @see http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     */
    public getDamageModifier(move: string, attacker: Pokemon, defender: Pokemon): number {
        const moveSchema: MoveSchema = this.game.constants.moves.byName[move];
        const stab: number = attacker.types.indexOf(moveSchema.type) !== -1 ? 1.5 : 1;
        const type: number = this.getTypeEffectiveness(move, defender);

        return stab * type * this.game.numberMaker.randomWithin(0.85, 1);
    }

    /**
     * Determines the type effectiveness of a move on a defending Pokemon.
     *
     * @param move   The concatenated name of the move.
     * @param defender   The defending Pokemon.
     * @returns A damage modifier, as a multiplication constant.
     * @see http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
     */
    public getTypeEffectiveness(move: string, defender: Pokemon): number {
        const defenderTypes: string[] = this.game.constants.pokemon.byName[
            defender.title.join("")
        ].types;
        const typeIndices: { [i: string]: number } = this.game.constants.types.indices;
        const moveIndex: number = typeIndices[this.game.constants.moves.byName[move].type];
        let total = 1;

        for (const defenderType of defenderTypes) {
            const effectivenesses: number[] = this.game.constants.types.effectivenessTable[
                moveIndex
            ];
            total *= effectivenesses[typeIndices[defenderType]];
        }

        return total;
    }

    /**
     * Determines whether a move should be a critical hit.
     *
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking Pokemon.
     * @returns Whether the move should be a critical hit.
     * @see http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     */
    public isCriticalHit(move: string, attacker: Pokemon): boolean {
        const moveInfo: MoveSchema = this.game.constants.moves.byName[move];
        const baseSpeed: number = this.game.constants.pokemon.byName[attacker.title.join("")]
            .speed;
        let denominator = 512;

        // Moves with a high critical-hit ratio, such as Slash, are eight times more likely to land a critical hit,
        // resulting in a probability of BaseSpeed / 64.
        if (moveInfo.criticalRaised) {
            denominator /= 8;
        }

        // "Focus Energy and Dire Hit were intended to increase the critical hit rate, ..."
        // In FullScreenPokemon, they work as intended! Fans who prefer the
        // original behavior are free to fork the repo. As the original
        // behavior is a glitch (and conflicts with creators' intentions),
        // it is not duplicated here.
        if (attacker.raisedCriticalHitProbability) {
            denominator /= 4;
        }

        // As with move accuracy in the handheld games, if the probability of landing a critical hit would be 100%,
        // it instead becomes 255/256 or about 99.6%.
        return this.game.numberMaker.randomBooleanProbability(
            Math.max(baseSpeed / denominator, 255 / 256)
        );
    }
}
