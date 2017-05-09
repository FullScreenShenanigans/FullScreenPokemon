import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { 
    IPokemonEvolution, IPokemonEvolutionByItem, IPokemonEvolutionByLevel, 
    IPokemonEvolutionByStats, IPokemonEvolutionRequirement
} from "./constants/Pokemon";

/**
 * Handler arguments.
 */
export interface IHandlerArgs {
    /**
     * Requirement for evolution. 
     */
    requirement: IPokemonEvolutionRequirement;

    /**
     * Pokemon to evolve.
     */
    pokemon: IPokemon;

    /**
     * Modifiers for this evolution.
     */
    modifier?: IEvolutionModifier;
}

/**
 * The modifiers necessary for a pokemon's evolution.
 */
export type IEvolutionModifier = ITradeModifier | IItemModifier;

/**
 * Modifier to indicate a pokemon has just been traded.
 */
export interface ITradeModifier {
    /**
     * The type of modifier.
     */
    type: string;
}

/**
 * Modifier to indicate an item is being used.
 */
export interface IItemModifier {
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
export interface IRequirementHandlers {
    [i: string]: IRequirementHandler; 
}

/**
 * Handler that takes in a pokemon and the requirements for its evolution, and outputs if it is eligible to evolve.
 */
export interface IRequirementHandler {
    /**
     * Outputs true if the input pokemon is ready to evolve, and false otherwise.
     * 
     * @param args   Arguments for this evolution check.
     */
    (args: IHandlerArgs): boolean;
}

/**
 * Handles logic related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Holds evolution requirement checks, keyed by the method of evolution.
     */
    private readonly requirementHandlers: IRequirementHandlers = {
        level: (args: IHandlerArgs): boolean => {
            return args.pokemon.level >= (args.requirement as IPokemonEvolutionByLevel).level;
        },
        item: (args: IHandlerArgs): boolean => {
            if (args.modifier) {
                if ((args.requirement as IPokemonEvolutionByItem).item === (args.modifier as IItemModifier).item.join("")) {
                    return true;
                }
            }
            return false;
        },
        trade: (args: IHandlerArgs): boolean => {
            if (args.modifier) {
                if (args.modifier.type === "trade") {
                    return true;
                }
            }
            // Currently no value for held item (Issue #439)
            // Trading is not implemented yet (Issue #440)
            return false;
        },
        happiness: (): boolean => {
            // currently no happiness value of a Pokemon (Issue #439)
            return false;
        },
        time: (): boolean => {
            // Time of day does not seem to be implemented yet (#441)
            return false;
        },
        stats: (args: IHandlerArgs): boolean => {
            const difference: number = 
                args.pokemon.statistics[(args.requirement as IPokemonEvolutionByStats).greaterStat].normal 
                - args.pokemon.statistics[(args.requirement as IPokemonEvolutionByStats).lesserStat].normal;
            if ((args.requirement as IPokemonEvolutionByStats).mayBeEqual) {
                return difference === 0;
            }

            return difference > 0;
        }
    };
    
    /**
     * Checks to see if a Pokemon can evolve.
     * 
     * @param pokemon   The pokemon in the party to check.
     * @param modifier   Modifier for specific situations such as trade.
     * @returns The name of the pokemon it should evolve into, or undefined if it should not evolve.
     */
    public checkEvolutions(pokemon: IPokemon, modifier?: IEvolutionModifier): string[] | undefined {
        const evolutions: IPokemonEvolution[] | undefined = this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].evolutions;
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
    public evolve(pokemon: IPokemon, evolvedForm: string[]): void {
        pokemon.title = evolvedForm;
        pokemon.statistics = this.gameStarter.equations.newPokemonStatistics(pokemon.title, pokemon.level, pokemon.ev, pokemon.iv);
        pokemon.types = this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].types;
    }

    /**
     * Checks to see if a Pokemon is ready for this specific evolution.
     * 
     * @param pokemon   The pokemon in the party to check.
     * @param evolution   The evolution of this pokemon to check.
     * @param modifier   Modifier for specific situations such as trade.
     * @returns Whether the Pokemon meets the requirements to evolve.
     */
    private checkEvolution(pokemon: IPokemon, evolution: IPokemonEvolution, modifier?: IEvolutionModifier): boolean {
        for (const requirement of evolution.requirements) {
            if (!this.requirementHandlers[requirement.method]) { 
                throw new Error("Evolution requirement does not have a correct method property");
            }

            if (!this.requirementHandlers[requirement.method]({ requirement, pokemon, modifier })) {
                return false;
            }
        }

        return true;
    }
}
