import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { INewPokemon } from "../constants/Pokemon";
import { ModComponent } from "./ModComponent";

/**
 * Information on items and their probability of being held.
 */
interface IItemProbabilities {
    /**
     * Name of the item.
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
export class RandomHeldItemsMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * What items can be found on wild Pokemon by their primary type.
     *
     * @remarks No need to make probabilites add to 1 as the mod will just pick no item if generated
     *          number is higher than what the probabilities add up to.
     */
     private static typeItems: { [i: string]: IItemProbabilities[] } = {
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

     /**
      * Name of the mod.
      */
     public readonly name: string = "Random Held Items";

     /**
      * Mod events, keyed by name.
      */
     public readonly events: ICallbackRegister = {
         [this.eventNames.onWildGrassPokemonChosen]: (chosenInfo: INewPokemon) => {
             const pokemonName: string = chosenInfo.title.join("");
             const pokemonType: string = this.gameStarter.constants.pokemon.byName[pokemonName].types[0];
             const chosenItem = this.randomHeldItemGenerator(chosenInfo, pokemonType);

             if (chosenItem[0] !== "") {
                 chosenInfo.item = chosenItem;
             }
         }
     };

     /**
      * Chooses which item is chosen for onNewPokemonCreation.
      *
      * @param chosenInfo   Info chosen by chooseRandomWildPokemon.
      * @param pokemonType   Type of the wild encountered Pokemon.
      * @returns Returns the name of an item or "" if no item generated.
      */
     private randomHeldItemGenerator(chosenInfo: INewPokemon, pokemonType: string): string[] {
            let counter: number = 0;
            const probabilityOfHeldItem: number = this.gameStarter.numberMaker.randomReal1();

            for (const chosenObject of RandomHeldItemsMod.typeItems[pokemonType]) {
                counter += chosenObject.probability;
                if (counter >= probabilityOfHeldItem) {
                    return this.gameStarter.constants.items.byName[chosenObject.name].name;
                }
            }

            return [""];
      }
}
