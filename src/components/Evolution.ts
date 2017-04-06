import { Component } from "eightbittr/lib/Component";

import { IPokemon } from "./Battles";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPokemonEvolution, IPokemonEvolutionByHappiness, IPokemonEvolutionByItem, 
    IPokemonEvolutionByLevel, IPokemonEvolutionByStats, IPokemonEvolutionByTime, 
    IPokemonEvolutionByTrade, Pokemon } from "./constants/Pokemon";
/**
 * Holds things related to Pokemon evolution.
 */
export class Evolution<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Acts according to what form of requirement is passed to it.
     */
    public requirementHandlers: IRequirementHandlers = {
        "level": function (pokemon: IPokemon, requirements: IPokemonEvolutionByLevel): boolean {
            return pokemon.level >= requirements.level;
        },
        "item": function (): boolean {
            // Need some way to pass a flag for the item being used
            // Item usage outside of battle does not seem to be implemented
            return false;
        },
        "trade": function (requirements: IPokemonEvolutionByTrade): boolean {
            // Need some way to pass a flag in that the pokemon has just been traded
            // Currently no value for held item
            // Trading is not implemented yet
            if (requirements.item) { return false; }
            return false;
        },
        "happiness": function (): boolean {
            // currently no happiness value of a Pokemon
            return false;
        },
        "time": function (): boolean {
            // Time of day does not seem to be implemented yet
            return false;
        },
        "stats": function (pokemon: IPokemon, requirements: IPokemonEvolutionByStats): boolean {
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
    public checkEvolution(pokemon: IPokemon): string | undefined {
        const evolutions: IPokemonEvolution[] | undefined = this.data.byName[pokemon.title.join()].evolutions;
        if (evolutions) {      
            for (const possibleEvo of evolutions) {
                let passedRequirements: boolean = true;
                for (const requirement of possibleEvo.requirements) {
                    if (!this.requirementHandlers[requirement.method]) { 
                        console.log("Error: Requirement has no method property");  
                    }
                    if (!this.requirementHandlers[requirement.method](pokemon, requirement)) {
                        passedRequirements = false;
                    }
                }
                if (passedRequirements) {
                    return possibleEvo.evolvedForm;
                }
            }
        }
        return undefined;
    }

    /**
     * Interface for evolution requirement handler.
     */
    export interface IRequirementHandlers {
        "level": Function;
        "item": Function;
        "trade": Function;
        "happiness": Function;
        "time": Function;
        "stats": Function;
    }
}
