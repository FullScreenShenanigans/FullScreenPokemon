import { GeneralComponent } from "gamestartr";
import { FullScreenPokemon } from "../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "./Battles";

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
      * @param partyIsWipedText   Text to be displayed when the opposing pokemon faints.
      *
      */
    public processBattleExperience(battleInfo: IBattleInfo, onComplete: () => void): void {
        const experienceToGain =  this.gameStarter.equations.experienceGained(
            battleInfo.teams.player, battleInfo.teams.opponent);

        // BattleInfo should keep track of all pokemon the player has sent out in the battle and process
        // them one by one if they have not fainted to allow for shared exp. The same logic will apply
        // for an exp share where the pokemon holding the exp share is always considered to have been "sent out"
        // The code below will be applied to each sent out in the battle
        const battleText: (string | string[])[][] = [[battleInfo.teams.player.selectedActor.nickname,
                                                      " gained ", experienceToGain.toString(), " experience!"]];
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        const levelUp = this.gainExperience(battleInfo.teams.player.selectedActor, experienceToGain);
        if (levelUp) {
            battleText.push([battleInfo.teams.player.selectedActor.nickname, " grew to level ",
                             (battleInfo.teams.player.selectedActor.level).toString(), "!"]);
            const canLearMove = false;
            if (canLearMove) {
                this.gameStarter.menuGrapher.addMenuDialog("GeneralText", battleText,
                                                           () => this.learnBattleMove(battleInfo.teams.player.selectedActor
                                                                            ,         onComplete));
            } else {
                this.gameStarter.menuGrapher.addMenuDialog("GeneralText", battleText, onComplete);
            }
        } else {
            this.gameStarter.menuGrapher.addMenuDialog("GeneralText", battleText, onComplete);
        }
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
    private learnBattleMove(pokemon: IPokemon, onComplete: () => void): boolean {
        //Deals with the process of learning a move - can be moved to its own class/module
        return true;
    }
}
