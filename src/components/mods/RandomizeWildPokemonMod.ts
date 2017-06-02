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
            for (let i: number = 0; i < this.gameStarter.constants.pokemon.byName[pokemonName].types.length; i++) {
                pokemonTypes.push(this.gameStarter.constants.pokemon.byName[pokemonName].types[i]);
            }
            const randomPokemon: string[] = [];
            for (const pokemon in this.gameStarter.constants.pokemon.byName) {
                for (let j: number = 0; j < this.gameStarter.constants.pokemon.byName[pokemon].types.length; j++) {
                    if (pokemonTypes.indexOf(this.gameStarter.constants.pokemon.byName[pokemon].types[j]) !== -1) {
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
