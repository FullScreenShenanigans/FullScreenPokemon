import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../../../Battles";
import { IWildPokemonSchema } from "../../../Maps";
import { IPlayer } from "../../../Things";

/**
 * Starts wild Pokemon encounters during walking.
 */
export class EncounterStarting extends Section<FullScreenPokemon> {
    /**
     * Starts a wild encounter against one of the possible options.
     *
     * @param thing   In-game Player to start the battle on.
     * @param options   Wild Pokemon schemas to choose from.
     * @remarks Uses chooseRandomWildPokemon internally to choose the Pokemon.
     */
    public startWildEncounterBattle(thing: IPlayer, options: IWildPokemonSchema[]): void {
        const wildPokemon: IPokemon = this.chooseWildPokemonForBattle(options);

        this.eightBitter.graphics.classes.removeClass(thing, "walking");
        if (thing.shadow) {
            this.eightBitter.graphics.classes.removeClass(thing.shadow, "walking");
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
