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

        this.game.graphics.classes.removeClass(thing, "walking");
        if (thing.shadow) {
            this.game.graphics.classes.removeClass(thing.shadow, "walking");
        }

        this.game.actions.walking.animateCharacterPreventWalking(thing);

        this.game.battles.startBattle({
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
        const chosen: IWildPokemonSchema = this.game.equations.chooseRandomWildPokemon(options);

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onWildPokemonChosen, chosen);

        return this.game.equations.createPokemon(chosen);
    }
}
