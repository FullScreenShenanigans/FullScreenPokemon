/// <reference path="../typings/ItemsHoldr.d.ts" />
declare namespace StateHoldr {
    /**
     * A collection of groups of changes.
     */
    interface ICollection {
        [i: string]: IChangeGroup;
    }
    /**
     * A group of changes to an item.
     */
    interface IChangeGroup {
        [i: string]: any;
    }
    /**
     * Settings to initialize a new IStateHoldr.
     */
    interface IStateHoldrSettings {
        /**
         * The internal ItemsHoldr instance that stores data.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        /**
         * A prefix to prepend keys for the ItemsHolder.
         */
        prefix?: string;
    }
    /**
     * General localStorage saving for collections of state.
     */
    interface IStateHoldr {
        /**
         * @returns The ItemsHoldr instance that stores data.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        /**
         * @returns The prefix used for ItemsHoldr keys.
         */
        getPrefix(): string;
        /**
         * @returns The current key for the collection, with the prefix.
         */
        getCollectionKey(): string;
        /**
         * @returns the list of keys of collections, with the prefix.
         */
        getCollectionKeys(): string[];
        /**
         * @returns The current key for the collection, without the prefix.
         */
        getCollectionKeyRaw(): string;
        /**
         * @returns The current Object with attributes saved within.
         */
        getCollection(): ICollection;
        /**
         * @param otherCollectionKeyRaw   A key for a collection to retrieve.
         * @returns The collection stored under the raw key, if it exists.
         */
        getOtherCollection(otherCollectionKeyRaw: string): void;
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @returns Any changes under the itemKey, if it exists.
         */
        getChanges(itemKey: string): any;
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @param valueKey   The specific change being requested.
         * @returns The changes for the specific item, if it exists.
         */
        getChange(itemKey: string, valueKey: string): any;
        /**
         * Sets the currently tracked collection.
         *
         * @param collectionKeyRawNew   The raw key of the new collection
         *                              to switch to.
         * @param value   An optional container of values to set the new
         *                collection equal to.
         */
        setCollection(collectionKeyRawNew: string, value?: any): void;
        /**
         * Saves the currently tracked collection into the ItemsHolder.
         */
        saveCollection(): void;
        /**
         * Adds a change to the collection, stored as a key-value pair under an item.
         *
         * @param itemKey   The key for the item experiencing the change.
         * @param valueKey   The attribute of the item being changed.
         * @param value   The actual value being stored.
         */
        addChange(itemKey: string, valueKey: string, value: any): void;
        /**
         * Adds a change to any collection requested by the key, stored as a key-value
         * pair under an item.
         *
         * @param collectionKeyOtherRaw   The raw key for the other collection
         *                                to add the change under.
         * @param itemKey   The key for the item experiencing the change.
         * @param valueKey   The attribute of the item being changed.
         * @param value   The actual value being stored.
         */
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void;
        /**
         * Copies all changes from a contained item into an output item.
         *
         * @param itemKey   The key for the contained item.
         * @param output   The recipient for all the changes.
         */
        applyChanges(itemKey: string, output: any): void;
    }
    /**
     * General localStorage saving for collections of state.
     */
    class StateHoldr implements IStateHoldr {
        /**
         * The internal ItemsHoldr instance that stores data.
         */
        private ItemsHolder;
        /**
         * What prefix to prepend keys for the ItemsHolder.
         */
        private prefix;
        /**
         * The current key for the collection, with the prefix.
         */
        private collectionKey;
        /**
         * The list of collection keys referenced, with the prefix.
         */
        private collectionKeys;
        /**
         * The current key for the collection, without the prefix.
         */
        private collectionKeyRaw;
        /**
         * The current Object with attributes saved within.
         */
        private collection;
        /**
         * Initializes a new instance of the StateHoldr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IStateHoldrSettings);
        /**
         * @returns The ItemsHoldr instance that stores data.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        /**
         * @returns The prefix used for ItemsHoldr keys.
         */
        getPrefix(): string;
        /**
         * @returns The current key for the collection, with the prefix.
         */
        getCollectionKey(): string;
        /**
         * @returns The list of keys of collections, with the prefix.
         */
        getCollectionKeys(): string[];
        /**
         * @returns The current key for the collection, without the prefix.
         */
        getCollectionKeyRaw(): string;
        /**
         * @returns The current Object with attributes saved within.
         */
        getCollection(): ICollection;
        /**
         * @param otherCollectionKeyRaw   A key for a collection to retrieve.
         * @returns The collection stored under the raw key, if it exists.
         */
        getOtherCollection(otherCollectionKeyRaw: string): void;
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @returns Any changes under the itemKey, if it exists.
         */
        getChanges(itemKey: string): any;
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @param valueKey   The specific change being requested.
         * @returns The changes for the specific item, if it exists.
         */
        getChange(itemKey: string, valueKey: string): any;
        /**
         * Sets the currently tracked collection.
         *
         * @param collectionKeyRawNew   The raw key of the new collection
         *                              to switch to.
         * @param value   An optional container of values to set the new
         *                collection equal to.
         */
        setCollection(collectionKeyRawNew: string, value?: any): void;
        /**
         * Saves the currently tracked collection into the ItemsHolder.
         */
        saveCollection(): void;
        /**
         * Adds a change to the collection, stored as a key-value pair under an item.
         *
         * @param itemKey   The key for the item experiencing the change.
         * @param valueKey   The attribute of the item being changed.
         * @param value   The actual value being stored.
         */
        addChange(itemKey: string, valueKey: string, value: any): void;
        /**
         * Adds a change to any collection requested by the key, stored as a key-value
         * pair under an item.
         *
         * @param collectionKeyOtherRaw   The raw key for the other collection
         *                                to add the change under.
         * @param itemKey   The key for the item experiencing the change.
         * @param valueKey   The attribute of the item being changed.
         * @param value   The actual value being stored.
         */
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void;
        /**
         * Copies all changes from a contained item into an output item.
         *
         * @param itemKey   The key for the contained item.
         * @param output   The recipient for all the changes.
         */
        applyChanges(itemKey: string, output: any): void;
        /**
         * Ensures a collection exists by checking for it and creating it under
         * the internal ItemsHoldr if it doesn't.
         *
         * @param collectionKey   The key for the collection that must exist,
         *                        including the prefix.
         */
        private ensureCollectionKeyExists(collectionKey);
        /**
         * Ensures an item in the current collection exists by checking for it and
         * creating it if it doesn't.
         *
         * @param itemKey   The item key that must exist.
         * @returns The item in the collection under the given key.
         */
        private getCollectionItemSafely(itemKey);
    }
}
declare var module: any;
