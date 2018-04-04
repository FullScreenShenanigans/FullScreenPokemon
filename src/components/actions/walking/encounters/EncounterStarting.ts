import { GeneralComponent } from "gamestartr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../../../Battles";
import { IArea, IMap, IWildPokemonSchema } from "../../../Maps";
import { ICharacter, IPlayer } from "../../../Things";
import { EncounterChoices } from "../encounters/EncounterChoices";

/**
 * Starts wild Pokemon encounters during walking.
 */
export class EncounterStarting<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Starts a wild encounter against one of the possible options.
     *
     * @param thing   In-game Player to start the battle on.
     * @param options   Wild Pokemon schemas to choose from.
     * @remarks Uses chooseRandomWildPokemon internally to choose the Pokemon.
     */
    public startWildEncounterBattle(thing: IPlayer, options: IWildPokemonSchema[]): void {
        const wildPokemon: IPokemon = this.chooseWildPokemonForBattle(options);

        this.gameStarter.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.gameStarter.graphics.removeClass(thing.shadow, "walking");
        }

        this.gameStarter.actions.walking.animateCharacterPreventWalking(thing);

        this.gameStarter.battles.startBattle({
            teams: {
                opponent: {
                    actors: [wildPokemon],
                },
            },
            texts: {
                start: (team: IBattleTeam): string =>
                    `Wild ${team.selectedActor.nickname.join("")} appeared!`,
            },
        });
    }

    /**
     * Chooses a wild Pokemon to start a battle with.
     *
     * @param options   Wild Pokemon schemas to choose from.
     * @returns A wild Pokemon to start a battle with.
     */
    private chooseWildPokemonForBattle(options: IWildPokemonSchema[]): IPokemon {
        const chosen: IWildPokemonSchema = this.gameStarter.equations.chooseRandomWildPokemon(options);

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onWildPokemonChosen, chosen);

        return this.gameStarter.equations.createPokemon(chosen);
    }
}
