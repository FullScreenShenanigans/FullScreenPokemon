import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

/**
 * Information on a Pokemon during the experience giving phase of battle.
 */
export interface IExperienceGains {
    /**
     * Pokemon being looked at.
     */
    pokemon: IPokemon;

    /**
     * Experience gained by this Pokemon.
     */
    experienceGained: number;

    /**
     * Experience item held by Pokemon.
     */
    experienceItem?: string[];

    /**
     * If the Pokemon paticipated in the battle or not
     */
    participation: boolean;
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
        if (pokemon.experience >= this.gameStarter.equations.experienceStarting(pokemon.title, pokemon.level + 1)) {
            this.levelup(pokemon);
        }
    }

    /**
     * Calculates how much experience a defeated Pokemon is worth.
     *
     * @param pokemon   The defeated Pokemon.
     * @param trainer   If the defeated Pokemon had a trainer.
     * @returns   An array of objects of type IExperienceGains.
     * @see   https://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
     */
    public calculateExperience(pokemon: IPokemon, trainer: boolean): IExperienceGains[] {
        const participatedPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("battleParticipants");
        const numerator: number = this.calculateNumerator(
            pokemon.level, trainer, this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].experience);
        const experienceGains: IExperienceGains[] = this.experienceGainBeforeItems(participatedPokemon, numerator);
        //this.experienceWithItems(experienceGains);

        for (const chosenPartyPokemon of experienceGains) {
            if (chosenPartyPokemon.pokemon.statistics.health.current !== 0) {
                this.gainExperience(chosenPartyPokemon.pokemon, chosenPartyPokemon.experienceGained);
            }
        }

        return experienceGains;
    }

    /**
     * Calculates the numerator of the experience formula.
     *
     * @param pokemonLevel   The defeated Pokemon.
     * @param trainer   1.5 if there is a trainer, 1 if the Pokemon was wild.
     * @param experienceValue   How much experience the defeated Pokemon is worth.
     * @returns   The top numerator of the experience formula.
     */
    private calculateNumerator(pokemonLevel: number, trainer: boolean, experienceValue: number): number {
        const multiplier: number = (trainer ? 1.5 : 1);
        return experienceValue * pokemonLevel * multiplier;
    }

    /**
     * Calculates experience given out before items.
     *
     * @param participatedPokemon   Pokemon that participated in the battle.
     * @param numerator   Top of experience formula fraction.
     * @returns   An array of Pokemon objects along with participation status and experience gains before calculating for items.
     * @see   https://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
     */
    private experienceGainBeforeItems(participatedPokemon: IPokemon[], numerator: number): IExperienceGains[] {
        const s = participatedPokemon.length;
        const experienceGained: number = Math.floor(numerator / (s * 7));
        const gainedEXP: IExperienceGains[] = [];
        const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
        let participation: boolean = false;

        for (const chosenPartyPokemon of partyPokemon) {
            if (participatedPokemon.indexOf(chosenPartyPokemon) !== -1) {
                participation = true;
            }
            gainedEXP.push({
                pokemon: chosenPartyPokemon,
                participation,
                experienceGained,
                experienceItem: chosenPartyPokemon.item
            });
        }

        return gainedEXP;
    }

    /**
     * Calls for item experience functionality.
     *
     * @param experienceGains   Experience that is gained by each individual party Pokemon.
     */
    /*private experienceWithItems(experienceGains: IExperienceGains[]): void {
        for (const chosenPartyPokemon of experienceGains) {
            const item = chosenPartyPokemon.experienceItem;
            const lookAtItem = this.gameStarter.constants.items;
            if (item !== undefined && lookAtItem.byName[item.join("")].bagActivate !== undefined) {
                lookAtItem.byName[item.join("")].bagActivate;
            }

        }
    }*/
}
