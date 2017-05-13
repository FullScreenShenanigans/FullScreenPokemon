import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { 
    IPokemonEvolution, IPokemonEvolutionByItem, IPokemonEvolutionByLevel, 
    IPokemonEvolutionByStats, IPokemonEvolutionByTrade, IPokemonEvolutionRequirement
} from "./constants/Pokemon";

/**
 * Holds arguments used in IRequirementHander functions.
 * 
 * @type ModifierType   What type of modifier is being used.
 * @type RequirementType   What type of requirement is being used.
 */
export interface IRequirementHandlerArgs<ModifierType, RequirementType> {
    /**
     * Modifiers for this evolution.
     */
    modifier?: ModifierType;

    /**
     * Pokemon to evolve.
     */
    pokemon: IPokemon;

    /**
     * Requirement for evolution. 
     */
    requirement: RequirementType;
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
    (args: IRequirementHandlerArgs<IEvolutionModifier, IPokemonEvolutionRequirement>): boolean;
}

/**
 * Handles logic related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Holds evolution requirement checks, keyed by the method of evolution.
     */
    private readonly requirementHandlers: IRequirementHandlers = {
        level: (args: IRequirementHandlerArgs<IEvolutionModifier, IPokemonEvolutionByLevel>): boolean => {
            return args.pokemon.level >= args.requirement.level;
        },
        item: (args: IRequirementHandlerArgs<IItemModifier, IPokemonEvolutionByItem>): boolean => {
            if (args.modifier) {
                return args.requirement.item === args.modifier.item.join("");
            }
            return false;
        },
        trade: (args: IRequirementHandlerArgs<ITradeModifier, IPokemonEvolutionByTrade>): boolean => {
            if (args.modifier) {
                return args.modifier.type === "trade";
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
        stats: (args: IRequirementHandlerArgs<IEvolutionModifier, IPokemonEvolutionByStats>): boolean => {
            const difference: number = 
                args.pokemon.statistics[args.requirement.greaterStat].normal 
                - args.pokemon.statistics[args.requirement.lesserStat].normal;
            if (args.requirement.mayBeEqual) {
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

            if (!this.requirementHandlers[requirement.method]({ modifier, pokemon, requirement })) {
                return false;
            }
        }

        return true;
    }
}
