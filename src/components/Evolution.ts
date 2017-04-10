import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { 
    IPokemonEvolution, IPokemonEvolutionByLevel, IPokemonEvolutionByStats, 
    IPokemonEvolutionRequirements, Pokemon 
} from "./constants/Pokemon";

/**
 * Interface for evolution requirement handler.
 */
export interface IRequirementHandlers {
    [method: string]: { (pokemon?: IPokemon, requirements?: IPokemonEvolutionRequirements): boolean }; 
}

/**
 * Handles logic related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Data needed for evolution.
     */
    public readonly data: Pokemon = this.gameStarter.constants.pokemon;

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
     */
    public checkEvolutions(pokemon: IPokemon): string | undefined {
        const evolutions: IPokemonEvolution[] | undefined = this.data.byName[pokemon.title.join()].evolutions;
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
     * Checks to see if a Pokemon is ready for this specific evolution.
     * 
     * @param pokemon   The pokemon in the party to check.
     * @param evolution The evolution of this pokemon to check.
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
};
