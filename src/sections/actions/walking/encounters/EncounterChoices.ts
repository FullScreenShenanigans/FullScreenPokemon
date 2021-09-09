import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { WildPokemonSchema } from "../../../Maps";
import { Player } from "../../../Actors";

/**
 * Chooses wild Pokemon to encounter during walking.
 */
export class EncounterChoices extends Section<FullScreenPokemon> {
    /**
     * May randomly starts a wild Pokemon encounter if the player while walking.
     *
     * @param actor   In-game Player that may encounter a wild Pokemon.
     * @returns Wild Pokemon schemas to choose from, if a battle is to start.
     */
    public getWildEncounterPokemonOptions(actor: Player): WildPokemonSchema[] | undefined {
        let options: WildPokemonSchema[] | undefined = this.getGrassPokemonOptions(actor);
        if (options !== undefined) {
            return options;
        }

        options = this.getSurfingPokemonOptions(actor);
        if (options !== undefined) {
            return options;
        }

        return this.getWalkingPokemonOptions();
    }

    /**
     * Gets options for a grass battle if the player is in grass.
     *
     * @param actor A Player in grass.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesGrassEncounterHappen equation internally.
     */
    private getGrassPokemonOptions(actor: Player): WildPokemonSchema[] | undefined {
        const { grass } = actor;
        if (grass === undefined) {
            return undefined;
        }

        if (!this.game.equations.doesGrassEncounterHappen(grass)) {
            return undefined;
        }

        const areaWildPokemon = this.game.mapScreener.activeArea.wildPokemon;
        if (areaWildPokemon === undefined) {
            throw new Error("Grass area doesn't have any wild Pokemon options defined.");
        }

        const options: WildPokemonSchema[] | undefined = areaWildPokemon.grass;
        if (options === undefined) {
            throw new Error("Grass area doesn't have any wild grass Pokemon options defined.");
        }

        return options;
    }

    /**
     * Gets options for a wild Pokemon battle while walking.
     *
     * @param actor   A walking Player.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesWalkingEncounterHappen equation internally.
     */
    private getWalkingPokemonOptions(): WildPokemonSchema[] | undefined {
        const area = this.game.mapScreener.activeArea;
        if (
            area.wildPokemon === undefined ||
            area.wildPokemon.walking === undefined ||
            !this.game.equations.doesWalkingEncounterHappen()
        ) {
            return undefined;
        }

        return area.wildPokemon.walking;
    }

    /**
     * Gets options for a wild Pokemon battle while surfing.
     *
     * @param actor   A surfing Player.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesWalkingEncounterHappen equation internally.
     */
    private getSurfingPokemonOptions(actor: Player): WildPokemonSchema[] | undefined {
        const { surfing } = actor;
        if (surfing === undefined || !this.game.equations.doesWalkingEncounterHappen()) {
            return undefined;
        }

        const areaWildPokemon = this.game.mapScreener.activeArea.wildPokemon;
        if (areaWildPokemon === undefined) {
            throw new Error("SUrfing area doesn't have any wild Pokemon options defined.");
        }

        const options: WildPokemonSchema[] | undefined = areaWildPokemon.surfing;
        if (options === undefined) {
            throw new Error(
                "SUrfing area doesn't have any wild surfing Pokemon options defined."
            );
        }

        return options;
    }
}
