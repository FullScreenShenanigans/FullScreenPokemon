import { Utilities as GameStartrUtilities } from "gamestartr/lib/components/Utilities";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { IWildPokemonSchema } from "./Maps";
import { IThing } from "./Things";

/**
 * Miscellaneous utility functions used by FullScreenPokemon instances.
 */
export class Utilities<TGameStartr extends FullScreenPokemon> extends GameStartrUtilities<TGameStartr> {

    /**
     * Retrieves the Thing in MapScreener.thingById of the given id.
     * 
     * @param id   An id of a Thing to retrieve.
     * @returns The Thing under the given id, if it exists.
     */
    public getThingById(id: string): IThing {
        return (this.gameStarter.groupHolder.getGroup("Thing") as any)[id];
    }

    /**
     * Creates a new Pokemon from a schema, using the newPokemon equation.
     * 
     * @param schema   A description of the Pokemon.
     * @returns A newly created Pokemon.
     */
    public createPokemon(schema: IWildPokemonSchema): IPokemon {
        const level: number = schema.levels
            ? this.gameStarter.numberMaker.randomArrayMember(schema.levels)
            : schema.level!;

        return this.gameStarter.equations.newPokemon(schema.title, level);
    }

    /**
     * Creates a new String equivalent to an old String repeated any number of
     * times. If times is 0, a blank String is returned.
     * 
     * @param {String} string   The characters to repeat.
     * @param {Number} [times]   How many times to repeat (by default, 1).
     */
    public stringOf(str: string, times: number = 1): string {
        return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     * 
     * @param {Mixed} number   The original Number being padded.
     * @param {Number} size   How many digits the output must contain.
     * @param {Mixed} [prefix]   A prefix to repeat for padding (by default, "0").
     * @returns {String}
     * @example 
     * makeDigit(7, 3); // '007'
     * makeDigit(7, 3, 1); // '117'
     */
    public makeDigit(num: number | string, size: number, prefix?: any): string {
        return this.stringOf(
            prefix ? prefix.toString() : "0",
            Math.max(0, size - String(num).length)
        ) + num;
    }

    /**
     * Checks all members of an Array to see if a specified key exists within one of them.
     * 
     * @param array   The Array being checked.
     * @param key   The key being searched for.
     * @returns Whether the key exists within the Array members.
     */
    public checkArrayMembersIndex(array: any[], key: string): boolean {
        for (const member of array) {
            if (member[key]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds a stackable item to an Array. If it already exists, its value is increased by count.
     * Otherwise it adds a new item to the Array.
     * 
     * @param array   The Array containing the stackable items.
     * @param title   The name of the stackable item to be added.
     * @param count   The number of these stackable items.
     * @param keyTitle   The key associated with the item's name, such as "item".
     * @param keyCount   The key associated with the item's count, such as "amount".
     * @returns Whether the stackable item was newly added.
     */
    public combineArrayMembers(array: any[], title: string, count: number, keyTitle: string, keyCount: string): boolean {
        for (const member of array) {
            if (member[keyTitle] === title) {
                member[keyCount] += count;
                return false;
            }
        }

        array.push({
            [keyTitle]: title,
            [keyCount]: count
        });

        return true;
    }
}
