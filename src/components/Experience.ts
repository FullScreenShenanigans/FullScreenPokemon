import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

/**
 * Pokemon and its held experience.
 */
export interface IExperienceGains {
    /**
     * Name of the Pokemon.
     */
    pokemonName: string[];

    /**
     * Experience gained by this Pokemon.
     */
    experienceGained: string;
}

/**
 * Handles logic related to Pokemon level ups.
 */
export class Experience<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
     * Gives experience to a specified pokemon.
     *
     * @param pokemon   The pokemon to give experience to.
     * @param experience   The amount of experience to give.
     */
    public gainExperience(pokemon: IPokemon, experience: number): void {
        pokemon.experience += experience;
        if (pokemon.experience >= this.gameStarter.equations.experienceStarting(pokemon.title, pokemon.level + 1)
            && pokemon.statistics.health.current !== 0) {
            this.levelup(pokemon);
        }
    }

    /**
     * Calculates how much experience a defeated Pokemon is worth.
     * https://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
     *
     * @param pokemon   The defeated Pokemon.
     * @param trainer   If the defeated Pokemon had a trainer.
     */
    public calculateExperience(pokemon: IPokemon, trainer: boolean): IExperienceGains[] {
        const participatedPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("battleParticipants");
        const numerator: number = this.calculateNumerator(pokemon.level, trainer,
                                                          this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].experience);

        return "EXP ALL" in this.gameStarter.itemsHolder.getItem("items")
            ? this.ExpAll(participatedPokemon, numerator)
            : this.NoExpAll(participatedPokemon, numerator);
    }

    /**
     * Calculates the numerator of the experience formula.
     *
     * @param pokemonLevel   The defeated Pokemon.
     * @param trainer   1.5 if there is a trainer, 1 if the Pokemon was wild.
     * @param experienceValue   How much experience the defeated Pokemon is worth.
     */
    private calculateNumerator(pokemonLevel: number, trainer: boolean, experienceValue: number): number {
        return trainer
            ? experienceValue * pokemonLevel * 1.5
            : experienceValue * pokemonLevel * 1;
    }

    /**
     * Calculates experience given out if the player owns Exp. All.
     *
     * @param participatedPokemon   Pokemon that participated in the battle.
     * @param numerator   Top of experience formula fraction.
     */
    private ExpAll(participatedPokemon: IPokemon[], numerator: number): IExperienceGains[] {
        const s = participatedPokemon.length;
        const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
        let experienceGained: number = 0;
        const gainedEXP: IExperienceGains[] = [];

        for (const chosenPartyPokemon of partyPokemon) {
            if (participatedPokemon.indexOf(chosenPartyPokemon) !== -1) {
                experienceGained = Math.floor(numerator / (s * 2 * 7));
                this.gainExperience(chosenPartyPokemon, experienceGained);
                const pokemonAndEXP = {
                    pokemonName: chosenPartyPokemon.title,
                    experienceGained: String(experienceGained)
                };
                gainedEXP.push(pokemonAndEXP);
            } else {
                experienceGained = Math.floor(numerator / (s * 2 * 7 * partyPokemon.length));
                this.gainExperience(chosenPartyPokemon, experienceGained);
                const pokemonAndEXP = {
                    pokemonName: chosenPartyPokemon.title,
                    experienceGained: String(experienceGained)
                };
                gainedEXP.push(pokemonAndEXP);
            }
        }

        return gainedEXP;
    }

    /**
     * Calculates experience given out if the player doesn't own Exp. All.
     *
     * @param participatedPokemon   Pokemon that participated in the battle.
     * @param numerator   Top of experience formula fraction.
     */
    private NoExpAll(participatedPokemon: IPokemon[], numerator: number): IExperienceGains[] {
        const s = participatedPokemon.length;
        const experienceGained: number = Math.floor(numerator / (s * 7));
        const gainedEXP: IExperienceGains[] = [];

        for (const chosenPartyPokemon of participatedPokemon) {
            this.gainExperience(chosenPartyPokemon, experienceGained);
            const pokemonAndEXP = {
                pokemonName: chosenPartyPokemon.title,
                experienceGained: String(experienceGained)
            };
            gainedEXP.push(pokemonAndEXP);
        }
        return gainedEXP;
    }
}
