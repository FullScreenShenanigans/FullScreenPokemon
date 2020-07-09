import { Utilities as EightBittrUtilities } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IThing } from "./Things";

/**
 * Miscellaneous utility functions.
 */
export class Utilities<TEightBittr extends FullScreenPokemon> extends EightBittrUtilities<TEightBittr> {
    /**
     * Creates a new String equivalent to an old String repeated any number of
     * times. If times is 0, a blank String is returned.
     *
     * @param string   The characters to repeat.
     * @param times   How many times to repeat (by default, 1).
     */
    public stringOf(str: string, times: number = 1): string {
        return (times === 0) ? "" : new Array((times || 1) + 1).join(str);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     *
     * @param number   The original Number being padded.
     * @param size   How many digits the output must contain.
     * @param [prefix]   A prefix to repeat for padding (by default, "0").
     * @example makeDigit(7, 3); // '007'
     * @example makeDigit(7, 3, 1); // '117'
     */
    public makeDigit(num: number | string, size: number, prefix?: any): string {
        return this.stringOf(
            prefix ? prefix.toString() : "0",
            Math.max(0, size - String(num).length),
        ) + num;
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
            [keyCount]: count,
        });

        return true;
    }

    /**
     * Decrements the value of a stackable item in an Array. If the value goes below zero, the item is removed.
     *
     * @param array   The Array containing the stackable items.
     * @param title   The name of the stackable item whose value is going to be decremented.
     * @param count   The number of these stackable items.
     * @param keyTitle   The key associated with the item's name, such as "item".
     * @param keyCount   The key associated with the item's count, such as "amount".
     * @returns Whether the stackable item was removed.
     */
    public removeArrayMembers(array: any[], title: string, count: number, keyTitle: string, keyCount: string): boolean {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][keyTitle] === title) {
                array[i][keyCount] -= count;
                if (array[i][keyCount] <= 0) {
                    array.splice(i, 1);
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Gets a Thing known to exist by its ID.
     *
     * @template TThing   Type of Thing to retrieve.
     * @param id   ID of a Thing.
     * @returns Thing under the ID.
     */
    public getExistingThingById<TThing extends IThing = IThing>(id: string): TThing {
        return this.game.groupHolder.getThing(id) as TThing;
    }
}
