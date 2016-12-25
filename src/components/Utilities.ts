import { Utilities as GameStartrUtilities } from "gamestartr/lib/components/Utilities";
import { IGameStartrProcessedSettings, IGameStartrSettings } from "gamestartr/lib/IGameStartr";
import { IGroupHoldr } from "groupholdr/lib/IGroupHoldr";
import { IMathDecidr } from "mathdecidr/lib/IMathDecidr";
import { INumberMakr } from "numbermakr/lib/INumberMakr";

import { IModuleSettings, IPokemon, IThing, IWildPokemonSchema } from "../IFullScreenPokemon";

/**
 * Settings to initialize a new instance of the Utilities class.
 */
export interface IUtilitiesSettings {
    /**
     * Canvas upon which the game's screen is constantly drawn.
     */
    canvas: HTMLCanvasElement;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    groupHolder: IGroupHoldr;

    /**
     * A computation utility to automate running common equations.
     */
    mathDecider: IMathDecidr;

    /**
     * A state-based random number generator.
     */
    numberMaker: INumberMakr;
}

/**
 * Miscellaneous utility functions used by FullScreenPokemon instances.
 */
export class Utilities extends GameStartrUtilities {
    /**
     * A general storage abstraction for keyed containers of items.
     */
    protected readonly groupHolder: IGroupHoldr;

    /**
     * A computation utility to automate running common equations.
     */
    protected readonly mathDecider: IMathDecidr;

    /**
     * A state-based random number generator.
     */
    protected readonly numberMaker: INumberMakr;

    /**
     * Initializes a new instance of the Utilities class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUtilitiesSettings) {
        super(settings.canvas);

        this.groupHolder = settings.groupHolder;
        this.mathDecider = settings.mathDecider;
        this.numberMaker = settings.numberMaker;
    }

    /**
     * Processes raw instantiation settings for sizing based on UI defaults.
     * 
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Raw instantiation settings.
     * @returns Initialization settings with filled out, finite sizes.
     */
    public static processUiSettings(moduleSettings: IModuleSettings, settings: IGameStartrSettings): IGameStartrProcessedSettings {
        if (!settings.size && !settings.width && !settings.height) {
            settings.size = moduleSettings.ui.sizeDefault;
        }

        if (settings.size) {
            settings.height = moduleSettings.ui.sizes![settings.size].height;
            settings.width = moduleSettings.ui.sizes![settings.size].width;
        }

        return Utilities.processSettings(settings);
    }

    /**
     * Retrieves the Thing in MapScreener.thingById of the given id.
     * 
     * @param id   An id of a Thing to retrieve.
     * @returns The Thing under the given id, if it exists.
     */
    public getThingById(id: string): IThing {
        return (this.groupHolder.getGroup("Thing") as any)[id];
    }

    /**
     * Creates a new Pokemon from a schema, using the newPokemon equation.
     * 
     * @param schema   A description of the Pokemon.
     * @returns A newly created Pokemon.
     */
    public createPokemon(schema: IWildPokemonSchema): IPokemon {
        const level: number = typeof schema.levels !== "undefined"
            ? this.numberMaker.randomArrayMember(schema.levels)
            : schema.level;

        return this.mathDecider.compute("newPokemon", schema.title, level);
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
     * Function to add a stackable item to an Array. If it already exists,
     * the Function increases its value by count. Otherwise, it adds a new item
     * to the Array.
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

        const object: any = {};
        object[keyTitle] = title;
        object[keyCount] = count;
        array.push(object);

        return true;
    }
}
