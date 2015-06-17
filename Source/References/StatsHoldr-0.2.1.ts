declare module StatsHoldr {
    export interface IStatsValueSettings {
        value?: any;
        valueDefault?: any;
        hasElement?: boolean;
        elementTag?: string;
        storeLocally?: boolean;
        triggers?: any;
        modularity?: number;
        onModular?: any;
        digits?: number;
        minimum?: number;
        onMinimum?: any;
        maximum?: number;
        onMaximum?: number;
    }

    export interface IStatsValue {
        value: any;
        element: HTMLElement;
        hasElement: boolean;
        StatsHolder: IStatsHoldr;
        key: string;
        valueDefault: any;
        elementTag: string;
        minimum: number;
        maximum: number;
        modularity: number;
        triggers: any;
        onModular: Function;
        onMinimum: Function;
        onMaximum: Function;
        storeLocally: boolean;
        update(): void;
        checkTriggers(): void;
        checkModularity(): void;
        updateElement(): void;
        retrieveLocalStorage(): void;
        updateLocalStorage(overrideAutoSave?: boolean): void;
    }

    export interface IStatsHoldrSettings {
        prefix?: string;
        allowNewItems?: boolean;
        autoSave?: boolean;
        callbackArgs?: any[];
        localStorage?: any;
        defaults?: any;
        displayChanges?: any;
        values?: { [i: string]: any };
        doMakeContainer?: boolean;
        containersArguments?: any[][]
    }

    export interface IStatsHoldr {
        getValues(): { [i: string]: IStatsValue };
        getDefaults(): any;
        getLocalStorage(): Storage;
        getAutoSave(): boolean;
        getPrefix(): string;
        getContainer(): HTMLElement;
        getContainersArguments(): any[][];
        getDisplayChanges(): any;
        getCallbackArgs(): any[];
        getKeys(): string[];
        getItem(key: string): any;
        getObject(key: string): any;
        hasKey(key: string): boolean;
        exportItems(): any;
        addItem(key: string, settings: any): IStatsValue;
        setItem(key: string, value: any): void;
        increase(key: string, amount?: number | string): void;
    }
}


module StatsHoldr {
    "use strict";

    export class StatsValue implements IStatsValue {
        value: any;

        element: HTMLElement;

        hasElement: boolean;

        StatsHolder: StatsHoldr;

        key: string;

        valueDefault: any;

        elementTag: string;

        minimum: number;

        maximum: number;

        modularity: number;

        triggers: any;

        onModular: Function;

        onMinimum: Function;

        onMaximum: Function;

        storeLocally: boolean;

        /**
         * Creates a new StatsValue with the given key and settings. Defaults are given
         * to the value via proliferate before the settings.
         * 
         * @constructor
         * @param {StatsHoldr} StatsHolder   The container for this value.
         * @param {String} key   The key to reference this new StatsValue by.
         * @param {IStatsValueSettings} settings   Any optional custom settings.
         */
        constructor(StatsHolder: StatsHoldr, key: string, settings: any = {}) {
            this.StatsHolder = StatsHolder;

            StatsHolder.proliferate(this, StatsHolder.getDefaults());
            StatsHolder.proliferate(this, settings);

            this.key = key;

            if (!this.hasOwnProperty("value")) {
                this.value = this.valueDefault;
            }

            if (this.hasElement) {
                this.element = StatsHolder.createElement(this.elementTag || "div", {
                    className: StatsHolder.getPrefix() + "_value " + key
                });
                this.element.appendChild(StatsHolder.createElement("div", {
                    "textContent": key
                }));
                this.element.appendChild(StatsHolder.createElement("div", {
                    "textContent": this.value
                }));
            }

            if (this.storeLocally) {
                // If there exists an old version of this property, get it 
                if (StatsHolder.getLocalStorage().hasOwnProperty(StatsHolder.getPrefix() + key)) {
                    this.value = this.retrieveLocalStorage();
                } else {
                    // Otherwise save the new version to memory
                    this.updateLocalStorage();
                }
            }
        }

        /**
         * General update Function to be run whenever the internal value is changed.
         * It runs all the trigger, modular, etc. checks, updates the HTML element
         * if there is one, and updates localStorage if needed.
         */
        update(): void {
            // Mins and maxes must be obeyed before any other considerations
            if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
                this.value = this.minimum;
                if (this.onMinimum) {
                    this.onMinimum.apply(this, this.StatsHolder.getCallbackArgs());
                }
            } else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
                this.value = this.maximum;
                if (this.onMaximum) {
                    this.onMaximum.apply(this, this.StatsHolder.getCallbackArgs());
                }
            }

            if (this.modularity) {
                this.checkModularity();
            }

            if (this.triggers) {
                this.checkTriggers();
            }

            if (this.hasElement) {
                this.updateElement();
            }

            if (this.storeLocally) {
                this.updateLocalStorage();
            }
        }

        /**
         * Checks if the current value should trigger a callback, and if so calls 
         * it.
         * 
         * @this {StatsValue}
         */
        checkTriggers(): void {
            if (this.triggers.hasOwnProperty(this.value)) {
                this.triggers[this.value].apply(this, this.StatsHolder.getCallbackArgs());
            }
        }

        /**
         * Checks if the current value is greater than the modularity (assuming
         * modular is a non-zero Numbers), and if so, continuously reduces value and 
         * calls this.onModular.
         * 
         * @this {StatsValue}
         */
        checkModularity(): void {
            if (this.value.constructor !== Number || !this.modularity) {
                return;
            }

            while (this.value >= this.modularity) {
                this.value = Math.max(0, this.value - this.modularity);
                if (this.onModular) {
                    this.onModular.apply(this, this.StatsHolder.getCallbackArgs());
                }
            }
        }

        /**
         * Updates the StatsValue's element's second child to be the StatsValue's value.
         * 
         * @this {StatsValue}
         */
        updateElement(): void {
            if (this.StatsHolder.hasDisplayChange(this.value)) {
                this.element.children[1].textContent = this.StatsHolder.getDisplayChange(this.value);
            } else {
                this.element.children[1].textContent = this.value;
            }
        }

        /**
         * Retrieves a StatsValue's value from localStorage, making sure not to try to
         * JSON.parse an undefined or null value.
         * 
         * @return {Mixed}
         */
        retrieveLocalStorage(): void {
            var value: any = localStorage.getItem(this.StatsHolder.getPrefix() + this.key);

            switch (value) {
                case "undefined":
                    return undefined;
                case "null":
                    return null;
            }

            if (value.constructor !== String) {
                return value;
            }

            return JSON.parse(value);
        }

        /**
         * Stores a StatsValue's value in localStorage under the prefix plus its key.
         * 
         * @param {Boolean} [overrideAutoSave]   Whether the policy on saving should
         *                                       be ignored (so saving happens
         *                                       regardless). By default, false.
         */
        updateLocalStorage(overrideAutoSave: boolean = false): void {
            if (this.StatsHolder.getAutoSave() || overrideAutoSave) {
                this.StatsHolder.getLocalStorage()[this.StatsHolder.getPrefix() + this.key] = JSON.stringify(this.value);
            }
        }
    }

    /**
     * A versatile container to store and manipulate values in localStorage, and
     * optionally keep an updated HTML container showing these values. Operations 
     * such as setting, increasing/decreasing, and default values are all abstracted
     * automatically. StatsValues are stored in memory as well as in localStorage for
     * fast lookups.
     * 
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    export class StatsHoldr implements IStatsHoldr {
        /**
         * The StatsValues being stored, keyed by name.
         */
        private items: { [i: string]: StatsValue };

        /**
         * A listing of all the String keys for the stored items.
         */
        private itemKeys: string[];

        /**
         * Default attributes for StatsValues.
         */
        private defaults: { [i: string]: any };

        /**
         * A reference to localStorage or a replacement object.
         */
        private localStorage: Storage;

        /**
         * Whether new items are allowed to be created using setItem.
         */
        private allowNewItems: boolean;

        /**
         * Whether this should save changes to localStorage automatically.
         */
        private autoSave: boolean;

        /**
         * A prefix to store things under in localStorage.
         */
        private prefix: string;

        /**
         * A container element containing children for each value's element.
         */
        private container: HTMLElement;

        // An Array of elements as createElement arguments, outside-to-inside.
        /**
         * An Array of elements as createElement arguments, outside-to-inside.
         */
        private containersArguments: any[][];

        /**
         * Any hardcoded changes to element content, such as "INF" for Infinity.
         */
        private displayChanges: any;

        /**
         * Arguments to be passed to triggered events.
         */
        private callbackArgs: any[];

        /**
         * @param {IStatsHoldrSettings} [settings]
         */
        constructor(settings: IStatsHoldrSettings = {}) {
            var key: string;

            this.prefix = settings.prefix || "";
            this.autoSave = settings.autoSave;
            this.callbackArgs = settings.callbackArgs || [];

            this.allowNewItems = settings.allowNewItems === undefined ? true : settings.allowNewItems;

            if (settings.localStorage) {
                this.localStorage = settings.localStorage;
            } else if (typeof localStorage === "undefined") {
                this.localStorage = this.createPlaceholderStorage();
            } else {
                this.localStorage = localStorage;
            }

            this.defaults = settings.defaults || {};
            this.displayChanges = settings.displayChanges || {};

            this.items = {};
            if (settings.values) {
                this.itemKeys = Object.keys(settings.values);

                for (key in settings.values) {
                    if (settings.values.hasOwnProperty(key)) {
                        this.addItem(key, settings.values[key]);
                    }
                }
            } else {
                this.itemKeys = [];
            }

            if (settings.doMakeContainer) {
                this.containersArguments = settings.containersArguments || [
                    ["div", {
                        "className": this.prefix + "_container"
                    }]
                ];
                this.container = this.makeContainer(settings.containersArguments);
            }
        }


        /* Simple gets
        */

        /**
         * 
         */
        key(index: number): string {
            return this.itemKeys[index];
        }

        /**
         * @return {Mixed} The values contained within, keyed by their keys.
         */
        getValues(): { [i: string]: IStatsValue } {
            return this.items;
        }

        /**
         * @return {Mixed} Default attributes for values.
         */
        getDefaults(): any {
            return this.defaults;
        }

        /**
         * @return {Mixed} A reference to localStorage or a replacment object.
         */
        getLocalStorage(): Storage {
            return this.localStorage;
        }

        /**
         * @return {Boolean} Whether this should save changes to localStorage 
         *                   automatically.
         */
        getAutoSave(): boolean {
            return this.autoSave;
        }

        /**
         * @return {String} The prefix to store thigns under in localStorage.
         */
        getPrefix(): string {
            return this.prefix;
        }

        /**
         * @return {HTMLElement} The container HTML element, if it exists.
         */
        getContainer(): HTMLElement {
            return this.container;
        }

        /**
         * @return {Mixed[][]} The createElement arguments for the HTML container
         *                     elements, outside-to-inside.
         */
        getContainersArguments(): any[][] {
            return this.containersArguments;
        }

        /**
         * @return {Mixed} Any hard-coded changes to element content.
         */
        getDisplayChanges(): any {
            return this.displayChanges;
        }

        /**
         * @return {Mixed[]} Arguments to be passed to triggered events.
         */
        getCallbackArgs(): any[] {
            return this.callbackArgs;
        }


        /* Retrieval
        */

        /**
         * @return {String[]} The names of all value's keys.
         */
        getKeys(): string[] {
            return Object.keys(this.items);
        }

        /**
         * @param {String} key   The key for a known value.
         * @return {Mixed} The known value of a key, assuming that key exists.
         */
        getItem(key: string): any {
            this.checkExistence(key);

            return this.items[key].value;
        }

        /**
         * @param {String} key   The key for a known value.
         * @return {Object} The settings for that particular key.
         */
        getObject(key: string): any {
            return this.items[key];
        }

        /**
         * @param {String} key   The key for a potentially known value.
         * @return {Boolean} Whether there is a value under that key.
         */
        hasKey(key: string): boolean {
            return this.items.hasOwnProperty(key);
        }

        /**
         * @return {Object} A mapping of key names to the actual values of all 
         *                  objects being stored.
         */
        exportItems(): any {
            var output: any = {},
                i: string;

            for (i in this.items) {
                if (this.items.hasOwnProperty(i)) {
                    output[i] = this.items[i].value;
                }
            }

            return output;
        }


        /* StatsValues
        */

        /**
         * Adds a new key & value pair to by linking to a newly created StatsValue.
         * 
         * @param {String} key   The key to reference by new StatsValue by.
         * @param {Object} settings   The settings for the new StatsValue.
         * @return {StatsValue} The newly created StatsValue.
         */
        addItem(key: string, settings: any = {}): StatsValue {
            this.items[key] = new StatsValue(this, key, settings);
            this.itemKeys.push(key);
            return this.items[key];
        }


        /* Updating values
        */

        /**
         * Clears a value from the listing, and removes its element from the
         * container (if they both exist).
         * 
         * @param {String} key   The key of the element to remove.
         */
        removeItem(key: string): void {
            if (!this.items.hasOwnProperty(key)) {
                return;
            }

            if (this.container && this.items[key].hasElement) {
                this.container.removeChild(this.items[key].element);
            }

            this.itemKeys.splice(this.itemKeys.indexOf(key), 1);

            delete this.items[key];
        }

        /**
         * Completely clears all values from the StatsHoldr, removing their
         * elements from the container (if they both exist) as well.
         */
        clear(): void {
            var i: string;

            if (this.container) {
                for (i in this.items) {
                    if (this.items[i].hasElement) {
                        this.container.removeChild(this.items[i].element);
                    }
                }
            }

            this.items = {};
            this.itemKeys = [];
        }

        /**
         * Sets the value for the StatsValue under the given key, then updates the StatsValue
         * (including the StatsValue's element and localStorage, if needed).
         * 
         * @param {String} key   The key of the StatsValue.
         * @param {Mixed} value   The new value for the StatsValue.
         */
        setItem(key: string, value: any): void {
            this.checkExistence(key);

            this.items[key].value = <string>value;
            this.items[key].update();
        }

        /**
         * Increases the value for the StatsValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         * 
         * @param {String} key   The key of the StatsValue.
         * @param {Mixed} [amount]   The amount to increase by (by default, 1).
         */
        increase(key: string, amount: number | string = 1): void {
            this.checkExistence(key);

            this.items[key].value += arguments.length > 1 ? amount : 1;
            this.items[key].update();
        }

        /**
         * Increases the value for the StatsValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         * 
         * @param {String} key   The key of the StatsValue.
         * @param {Number} [amount]   The amount to increase by (by default, 1).
         */
        decrease(key: string, amount: number = 1): void {
            this.checkExistence(key);

            this.items[key].value -= amount;
            this.items[key].update();
        }

        /**
         * Toggles whether a value is 1 or 0.
         * 
         * @param {String} key   The key of the StatsValue.
         */
        toggle(key: string): void {
            this.checkExistence(key);
            this.items[key].value = this.items[key].value ? 0 : 1;
            this.items[key].update();
        }

        /**
         * Ensures a key exists in values. If it doesn't, and new values are
         * allowed, it creates it; otherwise, it throws an Error.
         * 
         * @param {String} key
         */
        checkExistence(key: string): void {
            if (!this.items.hasOwnProperty(key)) {
                if (this.allowNewItems) {
                    this.addItem(key);
                } else {
                    throw new Error("Unknown key given to StatsHoldr: '" + key + "'.");
                }
            }
        }

        /**
         * Manually saves all values to localStorage, ignoring the autoSave flag. 
         */
        saveAll(): void {
            for (var key in this.items) {
                if (this.items.hasOwnProperty(key)) {
                    this.items[key].updateLocalStorage(true);
                }
            }
        }


        /* HTML helpers
        */

        /**
         * Hides the container Element by setting its visibility to hidden.
         */
        hideContainer(): void {
            this.container.style.visibility = "hidden";
        }

        /**
         * Shows the container Element by setting its visibility to visible.
         */
        displayContainer(): void {
            this.container.style.visibility = "visible";
        }

        /**
         * Creates the container Element, which contains a child for each StatsValue that
         * specifies hasElement to be true.
         * 
         * @param {Mixed[][]} containers   An Array representing the Element to be
         *                                 created and the children between it and 
         *                                 the contained StatsValues. Each contained 
         *                                 Mixed[]  has a String tag name as its 
         *                                 first member, followed by any number of 
         *                                 Objects to apply via createElement.
         * @return {HTMLElement}
         */
        makeContainer(containers: any[][]): HTMLElement {
            var output: HTMLElement = this.createElement.apply(this, containers[0]),
                current: HTMLElement = output,
                child: HTMLElement,
                key: string,
                i: number;

            for (i = 1; i < containers.length; ++i) {
                child = this.createElement.apply(this, containers[i]);
                current.appendChild(child);
                current = child;
            }

            for (key in this.items) {
                if (this.items[key].hasElement) {
                    child.appendChild(this.items[key].element);
                }
            }

            return output;
        }

        /**
         * @return {Boolean} Whether displayChanges has an entry for a particular
         *                   value.
         */
        hasDisplayChange(value: string): boolean {
            return this.displayChanges.hasOwnProperty(value);
        }

        /**
         * @return {String} The displayChanges entry for a particular value.
         */
        getDisplayChange(value: string): string {
            return this.displayChanges[value];
        }


        /* Utilities
        */

        /**
         * Creates a new HTMLElement of the given type. For each Object given as
         * arguments after, each member is proliferated onto the element.
         * 
         * @param {String} [tag]   The type of the HTMLElement (by default, "div").
         * @param {...args} [any[]]   Any number of Objects to be proliferated
         *                             onto the new HTMLElement.
         * @return {HTMLElement}
         */
        createElement(tag: string = "div", ...args: any[]): HTMLElement {
            var element: HTMLElement = document.createElement(tag),
                i: number;

            // For each provided object, add those settings to the element
            for (i = 0; i < args.length; i += 1) {
                this.proliferateElement(element, args[i]);
            }

            return element;
        }

        /**
         * Proliferates all members of the donor to the recipient recursively, as
         * a deep copy.
         * 
         * @param {Object} recipient   An object receiving the donor's members.
         * @param {Object} donor   An object whose members are copied to recipient.
         * @param {Boolean} [noOverride]   If recipient properties may be overriden
         *                                 (by default, false).
         */
        proliferate(recipient: any, donor: any, noOverride: boolean = false): any {
            var setting: any,
                i: string;

            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient.hasOwnProperty(i)) {
                        continue;
                    }

                    // If it's an object, recurse on a new version of it
                    setting = donor[i];
                    if (typeof setting === "object") {
                        if (!recipient.hasOwnProperty(i)) {
                            recipient[i] = new setting.constructor();
                        }
                        this.proliferate(recipient[i], setting, noOverride);
                    } else {
                        // Regular primitives are easy to copy otherwise
                        recipient[i] = setting;
                    }
                }
            }
            return recipient;
        }

        /**
         * Identical to proliferate, but tailored for HTML elements because many
         * element attributes don't play nicely with JavaScript Array standards. 
         * Looking at you, HTMLCollection!
         * 
         * @param {HTMLElement} recipient
         * @param {Any} donor
         * @param {Boolean} [noOverride]
         * @return {HTMLElement}
         */
        proliferateElement(recipient: any, donor: any, noOverride: boolean = false): HTMLElement {
            var setting: any,
                i: string,
                j: number;

            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient.hasOwnProperty(i)) {
                        continue;
                    }

                    setting = donor[i];

                    // Special cases for HTML elements
                    switch (i) {
                        // Children: just append all of them directly
                        case "children":
                            if (typeof (setting) !== "undefined") {
                                for (j = 0; j < setting.length; j += 1) {
                                    recipient.appendChild(setting[j]);
                                }
                            }
                            break;

                        // Style: proliferate (instead of making a new Object)
                        case "style":
                            this.proliferate(recipient[i], setting);
                            break;

                        // By default, use the normal proliferate logic
                        default:
                            // If it's an object, recurse on a new version of it
                            if (typeof setting === "object") {
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferate(recipient[i], setting, noOverride);
                            } else {
                                // Regular primitives are easy to copy otherwise
                                recipient[i] = setting;
                            }
                            break;
                    }
                }
            }
            return recipient;
        }

        /**
         * Creates an Object that can be used to create a new LocalStorage
         * replacement, if the JavaScript environment doesn't have one.
         * 
         * @return {Object}
         */
        private createPlaceholderStorage(): Storage {
            var i: string,
                output: any = {
                    "keys": [],
                    "getItem": function (key: string): any {
                        return this.localStorage[key];
                    },
                    "setItem": function (key: string, value: string): void {
                        this.localStorage[key] = value;
                    },
                    "clear": function (): void {
                        for (i in this) {
                            if (this.hasOwnProperty(i)) {
                                delete this[i];
                            }
                        }
                    },
                    "removeItem": function (key: string): void {
                        delete this[key];
                    },
                    "key": function (index: number): string {
                        return this.keys[index];
                    }
                };

            Object.defineProperties(output, {
                "length": {
                    "get": function (): number {
                        return output.keys.length;
                    }
                },
                "remainingSpace": {
                    "get": function (): number {
                        return 9001; // Is there a way to calculate this?
                    }
                }
            });

            return output;
        }
    }
}
