/// <reference path="ItemsHoldr-0.2.1.ts" />

declare module StateHoldr {
    export interface IStateHoldrSettings {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        prefix?: string;
    }

    export interface IStateHoldr {
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        getPrefix(): string;
        getCollectionKey(): string;
        getCollectionKeyRaw(): string;
        getCollection(): any;
        getOtherCollection(otherCollectionKeyRaw: string): void;
        getChanges(itemKey: string): any;
        getChange(itemKey: string, valueKey: string): any;
        setCollection(collectionKeyRawNew: string, value?: any): void;
        saveCollection(): void;
        addChange(itemKey: string, valueKey: string, value: any): void;
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void;
        applyChanges(itemKey: string, output: any): void;
    }
}


module StateHoldr {
    "use strict";

    export class StateHoldr implements IStateHoldr {

        // The ItemsHoldr instance that stores data.
        private ItemsHolder: ItemsHoldr.IItemsHoldr;

        // A prefix used for the ItemsHolder keys.
        private prefix: string;

        // The current key for the collection, with the prefix.
        private collectionKey: string;

        // The current key for the collection, without the prefix.
        private collectionKeyRaw: string;

        // The current Object with attributes saved within.
        private collection: any;

        /**
         * @param {IStateHoldrSettings} settings
         */
        constructor(settings: IStateHoldrSettings) {
            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHolder given to StateHoldr.");
            }

            this.ItemsHolder = settings.ItemsHolder;
            this.prefix = settings.prefix || "StateHolder";
        }


        /* Simple gets
        */

        /**
         * @return {ItemsHoldr} The ItemsHoldr instance that stores data.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * @return {String} The prefix used for ItemsHoldr keys.
         */
        getPrefix(): string {
            return this.prefix;
        }

        /**
         * @return {String} The current key for the collection, with the prefix.
         */
        getCollectionKey(): string {
            return this.collectionKey;
        }

        /**
         * @return {String} The current key for the collection, without the prefix.
         */
        getCollectionKeyRaw(): string {
            return this.collectionKeyRaw;
        }

        /**
         * @reutrn {Object} The current Object with attributes saved within.
         */
        getCollection(): any {
            return this.collection;
        }

        /**
         * @param {String} otherCollectionKeyRaw   A key for a collection to retrieve.
         * @return {Object} The collection stored under the raw key, if it exists.
         */
        getOtherCollection(otherCollectionKeyRaw: string): void {
            var otherCollectionKey: string = this.prefix + otherCollectionKeyRaw;

            this.ensureCollectionKeyExists(otherCollectionKey);

            return this.ItemsHolder.getItem(otherCollectionKey);
        }

        /**
         * @param {String} itemKey   The item key whose changes are being retrieved.
         * @return {Object} Any changes under the itemKey, if it exists.
         */
        getChanges(itemKey: string): any {
            this.ensureCollectionItemExists(itemKey);
            return this.collection[itemKey];
        }

        /**
         * @param {String} itemKey   The item key whose changes are being retrieved.
         * @param {String} valueKey   The specific change being requested.
         * @return {Mixed} The changes for the specific item, if it exists.
         */
        getChange(itemKey: string, valueKey: string): any {
            this.ensureCollectionItemExists(itemKey);
            return this.collection[itemKey][valueKey];
        }


        /* Storage
        */

        /**
         * Sets the currently tracked collection.
         * 
         * @param {String} collectionKeyRawNew   The raw key of the new collection
         *                                       to switch to.
         * @param {Object} [value]   An optional container of values to set the new
         *                           collection equal to.
         */
        setCollection(collectionKeyRawNew: string, value?: any): void {
            this.collectionKeyRaw = collectionKeyRawNew;
            this.collectionKey = this.prefix + this.collectionKeyRaw;

            this.ensureCollectionKeyExists(this.collectionKey);

            if (value) {
                this.ItemsHolder.setItem(this.collectionKey, value);
            }

            this.collection = this.ItemsHolder.getItem(this.collectionKey);
        }

        /**
         * Saves the currently tracked collection into the ItemsHolder.
         */
        saveCollection(): void {
            this.ItemsHolder.setItem(this.collectionKey, this.collection);
        }

        /**
         * Adds a change to the collection, stored as a key-value pair under an item.
         * 
         * @param {String} itemKey   The key for the item experiencing the change.
         * @param {String} valueKey   The attribute of the item being changed.
         * @param {Mixed} value   The actual value being stored.
         */
        addChange(itemKey: string, valueKey: string, value: any): void {
            this.ensureCollectionItemExists(itemKey);
            this.collection[itemKey][valueKey] = value;
        }

        /**
         * Adds a change to any collection requested by the key, stored as a key-value
         * pair under an item.
         * 
         * @param {String} collectionKeyOtherRaw   The raw key for the other collection
         *                                         to add the change under.
         * @param {String} itemKey   The key for the item experiencing the change.
         * @param {String} valueKey   The attribute of the item being changed.
         * @param {Mixed} value   The actual value being stored.
         */
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void {
            var collectionKeyOther: string = this.prefix + collectionKeyOtherRaw,
                otherCollection: any;

            this.ensureCollectionKeyExists(collectionKeyOther);
            otherCollection = this.ItemsHolder.getItem(collectionKeyOther);

            if (typeof otherCollection[itemKey] === "undefined") {
                otherCollection[itemKey] = {};
            }

            otherCollection[itemKey][valueKey] = value;

            this.ItemsHolder.setItem(collectionKeyOther, otherCollection);
        }

        /**
         * Copies all changes from a contained item into an output item.
         * 
         * @param {String} itemKey   The key for the contained item.
         * @param {Mixed} output   The recipient for all the changes.
         */
        applyChanges(itemKey: string, output: any): void {
            var changes: any = this.collection[itemKey],
                key: string;

            if (!changes) {
                return;
            }

            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    output[key] = changes[key];
                }
            }
        }


        /* Utilities
        */

        /**
         * Ensures a collection exists by checking for it and creating it under
         * the internal ItemsHoldr if it doesn't.
         * 
         * @param {String} collectionKey   The key for the collection that must
         *                                 exist, including the prefix.
         */
        private ensureCollectionKeyExists(collectionKey: string): void {
            if (!this.ItemsHolder.hasKey(collectionKey)) {
                this.ItemsHolder.addItem(collectionKey, {
                    "valueDefault": {},
                    "storeLocally": true
                });
            }
        }

        /**
         * Ensures an item in the current collection exists by checking for it and
         * creating it if it doesn't.
         * 
         * @param {String} itemKey   The item key that must exist.
         */
        private ensureCollectionItemExists(itemKey: string): void {
            if (typeof this.collection[itemKey] === "undefined") {
                this.collection[itemKey] = {};
            }
        }
    }
}
