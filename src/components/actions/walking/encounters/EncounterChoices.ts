import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../../../Battles";
import { IArea, IAreaWildPokemonOptionGroups, IMap, IWildPokemonSchema } from "../../../Maps";
import { ICharacter, IPlayer, IThing } from "../../../Things";

/**
 * Chooses wild Pokemon to encounter during walking.
 */
export class EncounterChoices<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * May randomly starts a wild Pokemon encounter if the player while walking.
     *
     * @param thing   In-game Player that may encounter a wild Pokemon.
     * @returns Wild Pokemon schemas to choose from, if a battle is to start.
     */
    public getWildEncounterPokemonOptions(thing: IPlayer): IWildPokemonSchema[] | undefined {
        let options: IWildPokemonSchema[] | undefined = this.getGrassPokemonOptions(thing);
        if (options !== undefined) {
            return options;
        }

        options = this.getSurfingPokemonOptions(thing);
        if (options !== undefined) {
            return options;
        }

        return this.getWalkingPokemonOptions();
    }

    /**
     * Gets options for a grass battle if the player is in grass.
     *
     * @param thing A Player in grass.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesGrassEncounterHappen equation internally.
     */
    private getGrassPokemonOptions(thing: IPlayer): IWildPokemonSchema[] | undefined {
        const { grass } = thing;
        if (grass === undefined) {
            return undefined;
        }

        if (!this.gameStarter.equations.doesGrassEncounterHappen(grass)) {
            return undefined;
        }

        const areaWildPokemon = this.gameStarter.mapScreener.activeArea.wildPokemon;
        if (areaWildPokemon === undefined) {
            throw new Error("Grass area doesn't have any wild Pokemon options defined.");
        }

        const options: IWildPokemonSchema[] | undefined = areaWildPokemon.grass;
        if (options === undefined) {
            throw new Error("Grass area doesn't have any wild grass Pokemon options defined.");
        }

        return options;
    }

    /**
     * Gets options for a wild Pokemon battle while walking.
     *
     * @param thing   A walking Player.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesWalkingEncounterHappen equation internally.
     */
    private getWalkingPokemonOptions(): IWildPokemonSchema[] | undefined {
        const area = this.gameStarter.mapScreener.activeArea;
        if (area.wildPokemon === undefined
            || area.wildPokemon.walking === undefined
            || !this.gameStarter.equations.doesWalkingEncounterHappen()) {
            return undefined;
        }

        return area.wildPokemon.walking;
    }

    /**
     * Gets options for a wild Pokemon battle while surfing.
     *
     * @param thing   A surfing Player.
     * @returns Wild Pokemon options to start battle with, if a battle should start.
     * @remarks Uses the doesWalkingEncounterHappen equation internally.
     */
    private getSurfingPokemonOptions(thing: IPlayer): IWildPokemonSchema[] | undefined {
        const { surfing } = thing;
        if (surfing === undefined || !this.gameStarter.equations.doesWalkingEncounterHappen()) {
            return undefined;
        }

        const areaWildPokemon = this.gameStarter.mapScreener.activeArea.wildPokemon;
        if (areaWildPokemon === undefined) {
            throw new Error("SUrfing area doesn't have any wild Pokemon options defined.");
        }

        const options: IWildPokemonSchema[] | undefined = areaWildPokemon.surfing;
        if (options === undefined) {
            throw new Error("SUrfing area doesn't have any wild surfing Pokemon options defined.");
        }

        return options;
    }
}
