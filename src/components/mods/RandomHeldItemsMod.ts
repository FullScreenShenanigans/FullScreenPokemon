import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { INewPokemon } from "../constants/Pokemon";

/**
 * Mod that randomizes items found on wild Pokemon.
 */
export class RandomHeldItemsMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Random Held Items";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onRandomItems: (chosenInfo: INewPokemon): INewPokemon => {
            const pokemonName: string = chosenInfo.title.join("");
            const pokemonType: string = this.gameStarter.constants.pokemon.byName[pokemonName].types[0];
            const generatedNumber = Math.random();
            if (generatedNumber > .995) {
                if (this.typeItems[pokemonType][2] !== "") {
                    chosenInfo.item = this.gameStarter.constants.items.byName[this.typeItems[pokemonType][2]].name;
                }
            } else if (generatedNumber < .995 && generatedNumber > .975) {
                if (this.typeItems[pokemonType][1] !== "") {
                    chosenInfo.item = this.gameStarter.constants.items.byName[this.typeItems[pokemonType][1]].name;
                }
            } else if (generatedNumber < .975 && generatedNumber > .945) {
                if (this.typeItems[pokemonType][0] !== "") {
                    chosenInfo.item = this.gameStarter.constants.items.byName[this.typeItems[pokemonType][0]].name;
                }
            }

            return chosenInfo;
        }
    };

    /**
     * What items can be found on wild Pokemon by their primary type.
     */
    public readonly typeItems: { [i: string]: string[] } = {
        "Normal": ["", "Potion", "Moon Stone"],
        "Fire": ["" , "Burn Heal", "Fire Stone"],
        "Fighting": ["", "Dire Hit", "TM01"],
        "Water": ["Fresh Water", "", "Water Stone"],
        "Flying": ["", "", "TM43"],
        "Grass": ["", "", "Leaf Stone"],
        "Poison": ["Antidote", "", "TM06"],
        "Eletric": ["", "", "Thunderstone"],
        "Ground": ["", "", "Guard Spec"],
        "Psychic": ["", "", "Ultra Ball"],
        "Rock": ["Escape Rope", "", "Iron"],
        "Ice": ["", "Ice Heal", "TM13"],
        "Bug": ["", "Repel", "Max Repel"],
        "Dragon": ["", "", "Rare Candy"]
    };

}
