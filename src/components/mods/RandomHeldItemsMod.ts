import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { INewPokemon } from "../constants/Pokemon";

interface IItemProbabilities {
    /**
     * Name of item.
     */
    name: string;

    /**
     * Probability of Pokemon having item.
     */
    probability: number;
}

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
             const generatedNumber = this.gameStarter.numberMaker.randomReal1();
             let counter: number = 0;
             for (const chosenObject of this.typeItems[pokemonType]) {
                 counter += chosenObject.probability;
                 if (counter >= generatedNumber) {
                     chosenInfo.item = this.gameStarter.constants.items.byName[chosenObject.name].name;
                     break;
                 }

             }

             return chosenInfo;
         }
     };

     /**
      * What items can be found on wild Pokemon by their primary type.
      *
      * @remarks No need to make probabilites add to 100.
      */
     private readonly typeItems: { [i: string]: IItemProbabilities[] } = {
        "Normal": [
            {
                "name": "Potion",
                "probability": .025
            },
            {
                "name": "Moon Stone",
                "probability": .005
            }
        ],
        "Fire": [
            {
                "name": "Burn heal",
                "probability": .025
            },
            {
                "name": "Fire Stone",
                "probability": .005
            }
        ],
        "Fighting": [
            {
                "name": "Dire Hit",
                "probability": .025
            },
            {
                "name": "TM01",
                "probability": .005
            }
        ],
        "Water": [
            {
                "name": "Fresh Water",
                "probability": .05
            },
            {
                "name": "Water Stone",
                "probability": .005
            }
        ],
        "Flying": [
            {
                "name": "TM43",
                "probability": .005
            }
        ],
        "Grass": [
            {
                "name": "Leaf Stone",
                "probability": .005
            }
        ],
        "Poison": [
            {
                "name": "Antidote",
                "probability": .05
            },
            {
                "name": "TM06",
                "probability": .005
            }
        ],
        "Electric": [
            {
                "name": "Thundertone",
                "probability": .005
            }
        ],
        "Ground": [
            {
                "name": "Guard Spec",
                "probability": .005
            }
        ],
        "Psychic": [
            {
                "name": "Ultra Ball",
                "probability": .005
            }
        ],
        "Rock": [
            {
                "name": "Escape Rope",
                "probability": .05
            },
            {
                "name": "Iron",
                "probability": .005
            }
        ],
        "Ice": [
            {
                "name": "Ice Heal",
                "probability": .025
            },
            {
                "name": "TM13",
                "probability": .005
            }
        ],
        "Bug": [
            {
                "name": "Repel",
                "probability": .025
            },
            {
                "name": "Max Repel",
                "probability": .005
            }
        ],
        "Dragon": [
            {
                "name": "Rare Candy",
                "probability": .0025
            }
        ],
        "Ghost": [
            {
                "name": "Full Restore",
                "probability": .0025
            }
        ]
     };

}
