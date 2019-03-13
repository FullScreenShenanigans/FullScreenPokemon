import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { INewPokemon } from "../constants/Pokemon";

import { ModComponent } from "./ModComponent";

/**
 * Information on items and their probability of being held.
 */
export interface IItemProbabilities {
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
export class RandomHeldItemsMod<TEightBittr extends FullScreenPokemon> extends ModComponent<TEightBittr> implements IMod {
     /**
      * Name of the mod.
      */
    public static readonly modName: string = "Random Held Items";

    /**
     * What items can be found on wild Pokemon by their primary type.
     *
     * @remarks No need to make probabilites add to 1 as the mod will just pick no item if generated
     *          number is higher than what the probabilities add up to.
     */
    private static readonly typeItems: { [i: string]: IItemProbabilities[] } = {
        Normal: [
            {
                name: "Potion",
                probability: 0.025,
            },
            {
                name: "Moon Stone",
                probability: 0.005,
            },
        ],
        Fire: [
            {
                name: "Burn Heal",
                probability: 0.025,
            },
            {
                name: "Fire Stone",
                probability: 0.005,
            },
        ],
        Fighting: [
            {
                name: "Dire Hit",
                probability: 0.025,
            },
            {
                name: "TM01",
                probability: 0.005,
            },
        ],
        Water: [
            {
                name: "Fresh Water",
                probability: 0.05,
            },
            {
                name: "Water Stone",
                probability: 0.005,
            },
        ],
        Flying: [
            {
                name: "TM43",
                probability: 0.005,
            },
        ],
        Grass: [
            {
                name: "Leaf Stone",
                probability: 0.005,
            },
        ],
        Poison: [
            {
                name: "Antidote",
                probability: 0.05,
            },
            {
                name: "TM06",
                probability: 0.005,
            },
        ],
        Electric: [
            {
                name: "Thundertone",
                probability: 0.005,
            },
        ],
        Ground: [
            {
                name: "Guard Spec",
                probability: 0.005,
            },
        ],
        Psychic: [
            {
                name: "Ultra Ball",
                probability: 0.005,
            },
        ],
        Rock: [
            {
                name: "Escape Rope",
                probability: 0.05,
            },
            {
                name: "Iron",
                probability: 0.005,
            },
        ],
        Ice: [
            {
                name: "Ice Heal",
                probability: 0.025,
            },
            {
                name: "TM13",
                probability: 0.005,
            },
        ],
        Bug: [
            {
                name: "Repel",
                probability: 0.025,
            },
            {
                name: "Max Repel",
                probability: 0.005,
            },
        ],
        Dragon: [
            {
                name: "Rare Candy",
                probability: 0.0025,
            },
        ],
        Ghost: [
            {
                name: "Full Restore",
                probability: 0.0025,
            },
        ],
     };

     /**
      * Mod events, keyed by name.
      */
    public readonly events: ICallbackRegister = {
         [this.eventNames.onNewPokemonCreation]: (chosenInfo: INewPokemon) => {
             const pokemonName: string = chosenInfo.title.join("");
             const pokemonType: string = this.eightBitter.constants.pokemon.byName[pokemonName].types[0];
             const chosenItem: string[] | undefined = this.randomHeldItemGenerator(pokemonType);

             if (chosenItem !== undefined) {
                 chosenInfo.item = chosenItem;
             }
         },
     };

     /**
      * Chooses which item is chosen for onNewPokemonCreation.
      *
      * @param pokemonType   Type of the wild encountered Pokemon.
      * @returns The name of an item or undefined if no item generated.
      */
    private randomHeldItemGenerator(pokemonType: string): string[] | undefined {
            const probabilityOfHeldItem: number = this.eightBitter.numberMaker.randomReal1();
            let counter = 0;

            for (const chosenObject of RandomHeldItemsMod.typeItems[pokemonType]) {
                counter += chosenObject.probability;
                if (counter >= probabilityOfHeldItem) {
                    return this.eightBitter.constants.items.byName[chosenObject.name].name;
                }
            }

            return undefined;
      }
}
