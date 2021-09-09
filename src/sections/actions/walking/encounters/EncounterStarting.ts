import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { BattleTeam, Pokemon } from "../../../Battles";
import { WildPokemonSchema } from "../../../Maps";
import { Player } from "../../../Actors";

/**
 * Starts wild Pokemon encounters during walking.
 */
export class EncounterStarting extends Section<FullScreenPokemon> {
    /**
     * Starts a wild encounter against one of the possible options.
     *
     * @param actor   In-game Player to start the battle on.
     * @param options   Wild Pokemon schemas to choose from.
     * @remarks Uses chooseRandomWildPokemon internally to choose the Pokemon.
     */
    public startWildEncounterBattle(actor: Player, options: WildPokemonSchema[]): void {
        const wildPokemon: Pokemon = this.chooseWildPokemonForBattle(options);

        this.game.graphics.classes.removeClass(actor, "walking");
        if (actor.shadow) {
            this.game.graphics.classes.removeClass(actor.shadow, "walking");
        }

        this.game.actions.walking.animateCharacterPreventWalking(actor);

        this.game.battles.startBattle({
            teams: {
                opponent: {
                    actors: [wildPokemon],
                },
            },
            texts: {
                start: (team: BattleTeam): string =>
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
    private chooseWildPokemonForBattle(options: WildPokemonSchema[]): Pokemon {
        const chosen: WildPokemonSchema = this.game.equations.chooseRandomWildPokemon(options);

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onWildPokemonChosen, chosen);

        return this.game.equations.createPokemon(chosen);
    }
}
