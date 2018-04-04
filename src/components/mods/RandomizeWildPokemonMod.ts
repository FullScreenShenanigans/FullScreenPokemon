import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWildPokemonSchema } from "../Maps";
import { ModComponent } from "./ModComponent";

/**
 * Mod that randomizes Pokemon encounters based on the original wild Pokemon's type(s).
 */
export class RandomizeWildPokemonMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Randomize Wild Pokemon";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onWildPokemonChosen]: (chosen: IWildPokemonSchema): IWildPokemonSchema => {
            const pokemonName: string = chosen.title.join("");
            const pokemonTypes: string[] = this.gameStarter.constants.pokemon.byName[pokemonName].types;
            const randomPokemon: string[][] = [];
            for (const pokemon in this.gameStarter.constants.pokemon.byName) {
                for (const randomsType of this.gameStarter.constants.pokemon.byName[pokemon].types) {
                    if (pokemonTypes.indexOf(randomsType) !== -1) {
                        randomPokemon.push(this.gameStarter.constants.pokemon.byName[pokemon].name);
                    }
                }
            }

            chosen.title = this.gameStarter.numberMaker.randomArrayMember(randomPokemon);
            return chosen;
        },
    };
}
