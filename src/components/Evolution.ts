import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { 
    IPokemonEvolution, IPokemonEvolutionByLevel, IPokemonEvolutionByStats, 
    IPokemonEvolutionRequirements
} from "./constants/Pokemon";

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
     * @param pokemon   The pokemon in the party to check.
     * @param requirements   The requirements for this pokemon to evolve.
     */
    (pokemon: IPokemon, requirements: IPokemonEvolutionRequirements): boolean;
}

/**
 * Handles logic related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Holds evolution requirement checks, keyed by the method of evolution.
     */
    private readonly requirementHandlers: IRequirementHandlers = {
        level: (pokemon: IPokemon, requirements: IPokemonEvolutionByLevel): boolean => {
            return pokemon.level >= requirements.level;
        },
        item: (): boolean => {
            // Need some way to pass a flag for the item being used
            // Item usage outside of battle does not seem to be implemented (Issue #364)
            return false;
        },
        trade: (): boolean => {
            // Need some way to pass a flag in that the pokemon has just been traded
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
        stats: (pokemon: IPokemon, requirements: IPokemonEvolutionByStats): boolean => {
            const difference: number = 
                pokemon.statistics[requirements.greaterStat].normal - pokemon.statistics[requirements.lesserStat].normal;
            if (requirements.mayBeEqual) {
                return difference === 0;
            }

            return difference > 0;
        }
    };
    
    /**
     * Checks to see if a Pokemon can evolve.
     * 
     * @param pokemon   The pokemon in the party to check.
     * @returns The name of the pokemon it should evolve into, or undefined if it should not evolve.
     */
    public checkEvolutions(pokemon: IPokemon): string[] | undefined {
        const evolutions: IPokemonEvolution[] | undefined = this.gameStarter.constants.pokemon.byName[pokemon.title.join()].evolutions;
        if (!evolutions) {
            return undefined;
        }

        for (const evolution of evolutions) {
            if (this.checkEvolution(pokemon, evolution)) {
                return evolution.evolvedForm;
            }
        }

        return undefined;
    }

    /**
     * Evolves a specified pokemon.
     * 
     * @param pokemon   The pokemon in the party to evolve.
     */
    public evolve(pokemon: IPokemon, evolvedForm: string[]): void {
        pokemon.title = evolvedForm;
        pokemon.statistics = this.gameStarter.equations.newPokemonStatistics(pokemon.title, pokemon.level, pokemon.ev, pokemon.iv);
        pokemon.types = this.gameStarter.constants.pokemon.byName[pokemon.title.join()].types;
    }

    /**
     * Checks to see if a Pokemon is ready for this specific evolution.
     * 
     * @param pokemon   The pokemon in the party to check.
     * @param evolution   The evolution of this pokemon to check.
     * @returns Whether the Pokemon meets the requirements to evolve.
     */
    private checkEvolution(pokemon: IPokemon, evolution: IPokemonEvolution): boolean {
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
}
