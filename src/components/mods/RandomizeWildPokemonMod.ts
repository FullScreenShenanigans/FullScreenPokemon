import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWildPokemonSchema } from "../Maps";

/**
 * Mod that randomizes Pokemon encounters based on the original wild Pokemon's type(s).
 */
export class RandomizeWildPokemonMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Randomize Wild Pokemon";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onRandomizePokemon: (chosen: IWildPokemonSchema): IWildPokemonSchema => {
            let pokemonName: string = "";
            pokemonName = chosen.title.join("");
            const pokemonTypes: string[] = [];
            for (const type of this.gameStarter.constants.pokemon.byName[pokemonName].types) {
                pokemonTypes.push(type);
            }
            const randomPokemon: string[] = [];
            for (const pokemon in this.gameStarter.constants.pokemon.byName) {
                for (const pokemonType of this.gameStarter.constants.pokemon.byName[pokemon].types) {
                    if (pokemonTypes.indexOf(pokemonType) !== -1) {
                        randomPokemon.push(pokemon);
                    }
                }
            }
            const random: string = this.gameStarter.numberMaker.randomArrayMember(randomPokemon);
            chosen.title = random.split("");
            return chosen;
        }
    };
} 
