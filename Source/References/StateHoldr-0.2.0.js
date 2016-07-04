/// <reference path="ItemsHoldr-0.2.1.ts" />
var StateHoldr;
(function (StateHoldr_1) {
    "use strict";
    /**
     * A utility to save collections of game state using an ItemsHoldr.
     * Keyed changes to named collections can be saved temporarily or permanently.
     */
    var StateHoldr = (function () {
        /**
         * Initializes a new instance of the StateHoldr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        function StateHoldr(settings) {
            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHolder given to StateHoldr.");
            }
            this.ItemsHolder = settings.ItemsHolder;
            this.prefix = settings.prefix || "StateHolder";
            this.collectionKeys = [];
        }
        /* Simple gets
        */
        /**
         * @returns The ItemsHoldr instance that stores data.
         */
        StateHoldr.prototype.getItemsHolder = function () {
            return this.ItemsHolder;
        };
        /**
         * @returns The prefix used for ItemsHoldr keys.
         */
        StateHoldr.prototype.getPrefix = function () {
            return this.prefix;
        };
        /**
         * @returns The current key for the collection, with the prefix.
         */
        StateHoldr.prototype.getCollectionKey = function () {
            return this.collectionKey;
        };
        /**
         * @returns The list of keys of collections, with the prefix.
         */
        StateHoldr.prototype.getCollectionKeys = function () {
            return this.collectionKeys;
        };
        /**
         * @returns The current key for the collection, with the prefix.
         */
        StateHoldr.prototype.getCollectionKeyRaw = function () {
            return this.collectionKeyRaw;
        };
        /**
         * @returns The current Object with attributes saved within.
         */
        StateHoldr.prototype.getCollection = function () {
            return this.collection;
        };
        /**
         * @param otherCollectionKeyRaw   A key for a collection to retrieve.
         * @returns The collection stored under the raw key, if it exists.
         */
        StateHoldr.prototype.getOtherCollection = function (otherCollectionKeyRaw) {
            var otherCollectionKey = this.prefix + otherCollectionKeyRaw;
            this.ensureCollectionKeyExists(otherCollectionKey);
            return this.ItemsHolder.getItem(otherCollectionKey);
        };
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @returns Any changes under the itemKey, if it exists.
         */
        StateHoldr.prototype.getChanges = function (itemKey) {
            return this.getCollectionItemSafely(itemKey);
        };
        /**
         * @param itemKey   The item key whose changes are being retrieved.
         * @param valueKey   The specific change being requested.
         * @returns The changes for the specific item, if it exists.
         */
        StateHoldr.prototype.getChange = function (itemKey, valueKey) {
            return this.getCollectionItemSafely(itemKey)[valueKey];
        };
        /* Storage
        */
        /**
         * Sets the currently tracked collection.
         *
         * @param collectionKeyRawNew   The raw key of the new collection
         *                              to switch to.
         * @param value   An optional container of values to set the new
         *                collection equal to.
         */
        StateHoldr.prototype.setCollection = function (collectionKeyRawNew, value) {
            this.collectionKeyRaw = collectionKeyRawNew;
            this.collectionKey = this.prefix + this.collectionKeyRaw;
            this.ensureCollectionKeyExists(this.collectionKey);
            if (value) {
                this.ItemsHolder.setItem(this.collectionKey, value);
            }
            this.collection = this.ItemsHolder.getItem(this.collectionKey);
        };
        /**
         * Saves the currently tracked collection into the ItemsHolder.
         */
        StateHoldr.prototype.saveCollection = function () {
            this.ItemsHolder.setItem(this.collectionKey, this.collection);
            this.ItemsHolder.setItem(this.prefix + "collectionKeys", this.collectionKeys);
        };
        /**
         * Adds a change to the collection, stored as a key-value pair under an item.
         *
         * @param itemKey   The key for the item experiencing the change.
         * @param valueKey   The attribute of the item being changed.
         * @param value   The actual value being stored.
         */
        StateHoldr.prototype.addChange = function (itemKey, valueKey, value) {
            this.getCollectionItemSafely(itemKey)[valueKey] = value;
        };
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
        StateHoldr.prototype.addCollectionChange = function (collectionKeyOtherRaw, itemKey, valueKey, value) {
            var collectionKeyOther = this.prefix + collectionKeyOtherRaw, otherCollection;
            this.ensureCollectionKeyExists(collectionKeyOther);
            otherCollection = this.ItemsHolder.getItem(collectionKeyOther);
            if (typeof otherCollection[itemKey] === "undefined") {
                otherCollection[itemKey] = {};
            }
            otherCollection[itemKey][valueKey] = value;
            this.ItemsHolder.setItem(collectionKeyOther, otherCollection);
        };
        /**
         * Copies all changes from a contained item into an output item.
         *
         * @param itemKey   The key for the contained item.
         * @param output   The recipient for all the changes.
         */
        StateHoldr.prototype.applyChanges = function (itemKey, output) {
            var changes = this.collection[itemKey], key;
            if (!changes) {
                return;
            }
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    output[key] = changes[key];
                }
            }
        };
        /* Utilities
        */
        /**
         * Ensures a collection exists by checking for it and creating it under
         * the internal ItemsHoldr if it doesn't.
         *
         * @param collectionKey   The key for the collection that must exist,
         *                        including the prefix.
         */
        StateHoldr.prototype.ensureCollectionKeyExists = function (collectionKey) {
            if (!this.ItemsHolder.hasKey(collectionKey)) {
                this.ItemsHolder.addItem(collectionKey, {
                    "valueDefault": {},
                    "storeLocally": true
                });
                this.collectionKeys.push(collectionKey);
                this.ItemsHolder.setItem(this.prefix + "collectionKeys", this.collectionKeys);
            }
        };
        /**
         * Ensures an item in the current collection exists by checking for it and
         * creating it if it doesn't.
         *
         * @param itemKey   The item key that must exist.
         * @returns The item in the collection under the given key.
         */
        StateHoldr.prototype.getCollectionItemSafely = function (itemKey) {
            if (typeof this.collection[itemKey] === "undefined") {
                return this.collection[itemKey] = {};
            }
            return this.collection[itemKey];
        };
        return StateHoldr;
    })();
    StateHoldr_1.StateHoldr = StateHoldr;
})(StateHoldr || (StateHoldr = {}));
