import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWildPokemonSchema } from "../Maps";

/**
 * Mod that randomizes Pokemon encounters based on the original wild Pokemon's type.
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
            const pokemonTypes: string[] = [];
            const randomPokemon: string[] = [];
            let i: number = 0;
            pokemonName = chosen.title.join("");
            for (i = 0; i < this.gameStarter.constants.pokemon.byName[pokemonName].types.length; i++) {
                pokemonTypes.push(this.gameStarter.constants.pokemon.byName[pokemonName].types[i]);
            }
            for (const pokemon in this.gameStarter.constants.pokemon.byName) {
                for (i = 0; i < this.gameStarter.constants.pokemon.byName[pokemon].types.length; i++) {
                    if (pokemonTypes.indexOf(this.gameStarter.constants.pokemon.byName[pokemonz].types[i]) !== -1) {
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
