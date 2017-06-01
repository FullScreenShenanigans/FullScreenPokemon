import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWildPokemonSchema } from "../Maps";

/**
 * Mod that randomizes Pokemon encounters based on the original wild Pokemon's
 * type.
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
            console.log(chosen);
            //Create the pokemon name via the chosen object.
            for (i = 0; i < chosen.title.length; i++) {
                pokemonName += chosen.title[i];
            }
            //Get the types for the original pokemon.
            for (i = 0; i < this.gameStarter.constants.pokemon.byName[pokemonName].types.length; i++) {
                pokemonTypes.push(this.gameStarter.constants.pokemon.byName[pokemonName].types[i]);
            }
            //Store pokemon that match one or more of original pokemon's types.
            for (const pokemonz in this.gameStarter.constants.pokemon.byName) {
                for (i = 0; i < this.gameStarter.constants.pokemon.byName[pokemonz].types.length; i++) {
                    if (pokemonTypes.indexOf(this.gameStarter.constants.pokemon.byName[pokemonz].types[i]) !== -1) {
                        randomPokemon.push(pokemonz); //use just pokemonz
                    }
                }
            }
            //Pick a random pokemon from the all the candidates(can include original pokemon).
            const random: string = this.gameStarter.numberMaker.randomArrayMember(randomPokemon);
            chosen.title = random.split("");
            return chosen;
        }

    };
} 
