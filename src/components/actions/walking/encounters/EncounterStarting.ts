import { GeneralComponent } from "eightbittr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../../../Battles";
import { IArea, IMap, IWildPokemonSchema } from "../../../Maps";
import { ICharacter, IPlayer } from "../../../Things";
import { EncounterChoices } from "../encounters/EncounterChoices";

/**
 * Starts wild Pokemon encounters during walking.
 */
export class EncounterStarting<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Starts a wild encounter against one of the possible options.
     *
     * @param thing   In-game Player to start the battle on.
     * @param options   Wild Pokemon schemas to choose from.
     * @remarks Uses chooseRandomWildPokemon internally to choose the Pokemon.
     */
    public startWildEncounterBattle(thing: IPlayer, options: IWildPokemonSchema[]): void {
        const wildPokemon: IPokemon = this.chooseWildPokemonForBattle(options);

        this.eightBitter.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.eightBitter.graphics.removeClass(thing.shadow, "walking");
        }

        this.eightBitter.actions.walking.animateCharacterPreventWalking(thing);

        this.eightBitter.battles.startBattle({
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
        const chosen: IWildPokemonSchema = this.eightBitter.equations.chooseRandomWildPokemon(options);

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onWildPokemonChosen, chosen);

        return this.eightBitter.equations.createPokemon(chosen);
    }
}
