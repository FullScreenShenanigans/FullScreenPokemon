import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { 
    IPokemonEvolution, IPokemonEvolutionByHappiness, IPokemonEvolutionByItem, 
    IPokemonEvolutionByLevel, IPokemonEvolutionByStats, IPokemonEvolutionByTime, 
    IPokemonEvolutionByTrade, Pokemon 
} from "./constants/Pokemon";

/**
 * Handles logic related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Holds evolution requirement checks, keyed by the method of evolution.
     */
    public requirementHandlers: IRequirementHandlers = {
        level: (pokemon: IPokemon, requirements: IPokemonEvolutionByLevel): boolean => {
            return pokemon.level >= requirements.level;
        },
        item: (): boolean => {
            // Need some way to pass a flag for the item being used
            // Item usage outside of battle does not seem to be implemented (Issue #364)
            return false;
        },
        trade: (requirements: IPokemonEvolutionByTrade): boolean => {
            // Need some way to pass a flag in that the pokemon has just been traded
            // Currently no value for held item (Issue #439)
            // Trading is not implemented yet (Issue #440)
            if (requirements.item) { return false; }
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
        stats: (pokemon: IPokemon, requirements: IPokemonEvolutionByStats): boolean => {
            if (requirements.statsAreEqual) {
                return pokemon.statistics[requirements.greaterStat].normal === pokemon.statistics[requirements.lesserStat].normal;
            } else {
                return pokemon.statistics[requirements.greaterStat].normal > pokemon.statistics[requirements.lesserStat].normal;
            }
        }
    };

    /**
     * Data needed for evolution.
     */
    public data: Pokemon = new Pokemon();

    /**
     * Checks to see if a Pokemon can evolve.
     * 
     * @param pokemon   The pokemon in the party to check.
     */
    public checkEvolutions(pokemon: IPokemon): string | undefined {
        const evolutions: IPokemonEvolution[] | undefined = this.data.byName[pokemon.title.join()].evolutions;
        if (!evolutions) {
            return undefined;
        }      
        for (const evolution of evolutions) {
            if (checkEvolution(pokemon, evolution)) {
                return evolution.evolvedForm;
            }
        }
        return undefined;
    }

    /**
     * Checks to see if a Pokemon is ready for this specific evolution.
     * 
     * @param pokemon    The pokemon in the party to check.
     * @param evolution    The evolution of this pokemon to check.
     */
    public checkEvolution(pokemon: IPokemon, evolution: IPokemonEvolution): boolean {
            for (const requirement of evolution.requirements) {
                if (!this.requirementHandlers[requirement.method]) { 
                    throw new Error("Evolution requirement does not have a correct method property");
                }
                if (!this.requirementHandlers[requirement.method](pokemon, requirement)) {
                    return false;
                }
            }
            return true;
    }

    /**
     * Interface for evolution requirement handler.
     */
    interface IRequirementHandlers {
        level: IRequirementHandlerFunction;
        item: IRequirementHandlerFunction;
        trade: IRequirementHandlerFunction;
        happiness: IRequirementHandlerFunction;
        time: IRequirementHandlerFunction;
        stats: IRequirementHandlerFunction;
    }

    /**
     * Interface for standard evolution requirement functions.
     */
    interface IRequirementHandlerFunction {
        (pokemon: IPokemon, requirements: IPokemonEvolutionByLevel): boolean;
    }
}
