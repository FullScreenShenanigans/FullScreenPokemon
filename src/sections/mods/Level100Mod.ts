import { ICallbackRegister, IMod } from "modattachr";

import { ModComponent } from "./ModComponent";

/**
 * Mod to make the trainer's Pokemon all level 100.
 */
export class Level100Mod extends ModComponent implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Level 100";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            for (const pokemon of this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInParty
            )) {
                this.game.saves.addStateHistory(pokemon, "level", pokemon.level);

                pokemon.level = 100;
                pokemon.statistics = this.game.equations.newPokemonStatistics(
                    pokemon.title,
                    pokemon.level,
                    pokemon.ev,
                    pokemon.iv
                );
            }
        },
        [this.eventNames.onModDisable]: (): void => {
            for (const pokemon of this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInParty
            )) {
                this.game.saves.popStateHistory(pokemon, "level");

                pokemon.statistics = this.game.equations.newPokemonStatistics(
                    pokemon.title,
                    pokemon.level,
                    pokemon.ev,
                    pokemon.iv
                );
            }
        },
    };
}
