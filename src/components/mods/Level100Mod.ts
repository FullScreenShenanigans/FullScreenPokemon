import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

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
    public readonly name: string = "Level 100";
    public readonly readBoolean: boolean = false;
    public readonly readString: boolean = true;
    public readonly selectString: boolean = true;
    public level: number = 100; //set pokemon.level = level, modify level w/ MOption

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
        }
    };
}
