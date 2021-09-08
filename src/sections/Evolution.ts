import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Pokemon } from "./Battles";
import {
    PokemonEvolution,
    PokemonEvolutionByItem,
    PokemonEvolutionByLevel,
    PokemonEvolutionByStats,
    PokemonEvolutionByTrade,
    PokemonEvolutionRequirement,
} from "./constants/Pokemon";

/**
 * Holds arguments used in IRequirementHander functions.
 *
 * @type ModifierType   What type of modifier is being used.
 * @type RequirementType   What type of requirement is being used.
 */
export interface RequirementHandlerArgs<ModifierType, RequirementType> {
    /**
     * Modifiers for this evolution.
     */
    modifier?: ModifierType;

    /**
     * Pokemon to evolve.
     */
    pokemon: Pokemon;

    /**
     * Requirement for evolution.
     */
    requirement: RequirementType;
}

/**
 * The modifiers necessary for a pokemon's evolution.
 */
export type EvolutionModifier = TradeModifier | ItemModifier;

/**
 * Modifier to indicate a pokemon has just been traded.
 */
export interface TradeModifier {
    /**
     * The type of modifier.
     */
    type: string;
}

/**
 * Modifier to indicate an item is being used.
 */
export interface ItemModifier {
    /**
     * The type of modifier.
     */
    type: string;

    /**
     * The necessary item to evolve.
     */
    item: string[];
}

/**
 * Handles different methods of evolution, keyed by requirement type.
 */
export interface RequirementHandlers {
    [i: string]: RequirementHandler;
}

/**
 * Handler that takes in a pokemon and the requirements for its evolution, and outputs if it is eligible to evolve.
 */
export type RequirementHandler = (
    args: RequirementHandlerArgs<EvolutionModifier, PokemonEvolutionRequirement>
) => boolean;

/**
 * Logic for what Pokemon are able to evolve into.
 */
export class Evolution extends Section<FullScreenPokemon> {
    /**
     * Holds evolution requirement checks, keyed by the method of evolution.
     */
    private readonly requirementHandlers: RequirementHandlers = {
        level: (
            args: RequirementHandlerArgs<EvolutionModifier, PokemonEvolutionByLevel>
        ): boolean => args.pokemon.level >= args.requirement.level,
        item: (args: RequirementHandlerArgs<ItemModifier, PokemonEvolutionByItem>): boolean => {
            if (args.modifier) {
                return args.requirement.item === args.modifier.item.join("");
            }
            return false;
        },
        trade: (
            args: RequirementHandlerArgs<TradeModifier, PokemonEvolutionByTrade>
        ): boolean => {
            if (args.modifier) {
                return args.modifier.type === "trade";
            }
            // Currently no value for held item (Issue #439)
            // Trading is not implemented yet (Issue #440)
            return false;
        },
        // No happiness value of a Pokemon yet (Issue #439)
        happiness: (): boolean => false,
        // Time of day does not seem to be implemented yet (#441)
        time: (): boolean => false,
        stats: (
            args: RequirementHandlerArgs<EvolutionModifier, PokemonEvolutionByStats>
        ): boolean => {
            const difference: number =
                args.pokemon.statistics[args.requirement.greaterStat].normal -
                args.pokemon.statistics[args.requirement.lesserStat].normal;
            if (args.requirement.mayBeEqual) {
                return difference === 0;
            }

            return difference > 0;
        },
    };

    /**
     * Checks to see if a Pokemon can evolve.
     *
     * @param pokemon   The pokemon in the party to check.
     * @param modifier   Modifier for specific situations such as trade.
     * @returns The name of the pokemon it should evolve into, or undefined if it should not evolve.
     */
    public checkEvolutions(pokemon: Pokemon, modifier?: EvolutionModifier): string[] | undefined {
        const evolutions: PokemonEvolution[] | undefined = this.game.constants.pokemon.byName[
            pokemon.title.join("")
        ].evolutions;
        if (!evolutions) {
            return undefined;
        }

        for (const evolution of evolutions) {
            if (this.checkEvolution(pokemon, evolution, modifier)) {
                return evolution.evolvedForm;
            }
        }

        return undefined;
    }

    /**
     * Evolves a specified pokemon.
     *
     * @param pokemon   The pokemon in the party to evolve.
     * @param evolvedForm   The pokemon it should become.
     */
    public evolve(pokemon: Pokemon, evolvedForm: string[]): void {
        pokemon.title = evolvedForm;
        pokemon.statistics = this.game.equations.newPokemonStatistics(
            pokemon.title,
            pokemon.level,
            pokemon.ev,
            pokemon.iv
        );
        pokemon.types = this.game.constants.pokemon.byName[pokemon.title.join("")].types;
    }

    /**
     * Checks to see if a Pokemon is ready for this specific evolution.
     *
     * @param pokemon   The pokemon in the party to check.
     * @param evolution   The evolution of this pokemon to check.
     * @param modifier   Modifier for specific situations such as trade.
     * @returns Whether the Pokemon meets the requirements to evolve.
     */
    private checkEvolution(
        pokemon: Pokemon,
        evolution: PokemonEvolution,
        modifier?: EvolutionModifier
    ): boolean {
        for (const requirement of evolution.requirements) {
            if (!this.requirementHandlers[requirement.method]) {
                throw new Error("Evolution requirement does not have a correct method property.");
            }

            if (
                !this.requirementHandlers[requirement.method]({ modifier, pokemon, requirement })
            ) {
                return false;
            }
        }

        return true;
    }
}
