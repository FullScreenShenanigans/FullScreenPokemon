import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "./Battles";
import { Pokemon } from "./constants/Pokemon";
import { IPokeball } from "./Things";
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

     /**
      * Processes experience gain for one or more pokemon
      *
      * @param battleInfo   Information about the current battle.
      * @param onComplete   Handler for when this is done.
      *
      */
    public processBattleExperience(battleInfo: IBattleInfo, onComplete: () => void): void {
        const experienceToGain =  this.gameStarter.equations.experienceGained(
            battleInfo.teams.player, battleInfo.teams.opponent);

        const experienceText: (string | string[])[][] = [[
            battleInfo.teams.player.selectedActor.nickname,
            ` gained ${experienceToGain} experience!`]];
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        const levelUp = this.gainExperience(battleInfo.teams.player.selectedActor, experienceToGain);
        if (levelUp) {
            this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText", experienceText,
                () => this.processBattleLevelUp(battleInfo.teams.player.selectedActor, onComplete));
        } else {
            this.gameStarter.menuGrapher.addMenuDialog("GeneralText", experienceText, onComplete);
        }
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

     /**
      * Processes level up for a given pokemon
      *
      * @param pokemon   Pokemon who is going to level up.
      * @param onComplete   Handler for when this is done.
      *
      */
    private processBattleLevelUp(pokemon: IPokemon, onComplete: () => void) {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        const experienceText: (string | string[])[][] = [[
            pokemon.nickname,
            ` grew to level ${pokemon.level}!`]];
        if (this.canLearnMove(pokemon)) {
            this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText", experienceText,
                () => this.learnBattleMove(pokemon, onComplete));
        } else {
            this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText", experienceText, onComplete);
        }
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

     /**
      * Determines whether a pokemon should or shouldn't learn a move
      *
      * @param pokemon   Pokemon who is going to going to learn a move.
      * @returns True is pokemon can learn a move at the given level, false otherwise
      *
      */
    private canLearnMove(pokemon: IPokemon): boolean {
        return false;
    }

     /**
      * Processes learning a move during a battle for a given pokemon
      *
      * @param pokemon   Pokemon who is going to going to learn a move.
      * @param onComplete   Handler for when this is done.
      *
      */
    private learnBattleMove(pokemon: IPokemon, onComplete: () => void): boolean {
        return true;
    }

}
