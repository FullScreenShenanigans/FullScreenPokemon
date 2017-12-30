import { ICallbackRegister, IMod } from "modattachr";

// import { IPokemon } from "../../components/Battles";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make the trainer's Pokemon all level 100.
 */
export class Level100Mod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Level 100";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            for (const pokemon of this.gameStarter.itemsHolder.getItem("PokemonInParty")) {
                this.gameStarter.saves.addStateHistory(pokemon, "level", pokemon.level);

                pokemon.level = 100;
                pokemon.statistics = this.gameStarter.equations.newPokemonStatistics(pokemon.title, pokemon.level, pokemon.ev, pokemon.iv);
            }
        },
        [this.eventNames.onModDisable]: (): void => {
            for (const pokemon of this.gameStarter.itemsHolder.getItem("PokemonInParty")) {
                this.gameStarter.saves.popStateHistory(pokemon, "level");

                pokemon.statistics = this.gameStarter.equations.newPokemonStatistics(pokemon.title, pokemon.level, pokemon.ev, pokemon.iv);
            }
        },
    };
}
