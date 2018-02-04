import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

/**
 * Calculates experience gains and level ups for Pokemon.
 */
export class Experience<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Levels up a specified pokemon.
     *
     * @param pokemon   The pokemon in the party to level up.
     */
    public levelup(pokemon: IPokemon): void {
        pokemon.level += 1;
        pokemon.statistics = this.gameStarter.equations.newPokemonStatistics(pokemon.title, pokemon.level, pokemon.ev, pokemon.iv);

        // TODO: display text box containing levelup info

        const evolvedForm: string[] | undefined = this.gameStarter.evolution.checkEvolutions(pokemon);
        if (evolvedForm) {
            this.gameStarter.evolution.evolve(pokemon, evolvedForm);
        }
    }

    /**
     * Gives experience to a specified pokemon
     *
     * @param pokemon   The pokemon to give experience to.
     * @param experience   The amount of experience to give.
     * @returns True if the pokemon leveled up, false otherwise.
     */
    public gainExperience(pokemon: IPokemon, experience: number): boolean {
        pokemon.experience += experience;
        if (pokemon.experience >= this.gameStarter.equations.experienceStarting(pokemon.title, pokemon.level + 1)) {
            this.levelup(pokemon);
            return true;
        }
        return false;
    }
}
