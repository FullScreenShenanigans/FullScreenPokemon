/// <reference path="ItemsHoldr-0.2.1.ts" />
var StateHoldr;
(function (_StateHoldr) {
    "use strict";
    var StateHoldr = (function () {
        /**
         * @param {IStateHoldrSettings} settings
         */
        function StateHoldr(settings) {
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
        StateHoldr.prototype.getItemsHolder = function () {
            return this.ItemsHolder;
        };
        /**
         * @return {String} The prefix used for ItemsHoldr keys.
         */
        StateHoldr.prototype.getPrefix = function () {
            return this.prefix;
        };
        /**
         * @return {String} The current key for the collection, with the prefix.
         */
        StateHoldr.prototype.getCollectionKey = function () {
            return this.collectionKey;
        };
        /**
         * @return {String} The current key for the collection, without the prefix.
         */
        StateHoldr.prototype.getCollectionKeyRaw = function () {
            return this.collectionKeyRaw;
        };
        /**
         * @reutrn {Object} The current Object with attributes saved within.
         */
        StateHoldr.prototype.getCollection = function () {
            return this.collection;
        };
        /**
         * @param {String} otherCollectionKeyRaw   A key for a collection to retrieve.
         * @return {Object} The collection stored under the raw key, if it exists.
         */
        StateHoldr.prototype.getOtherCollection = function (otherCollectionKeyRaw) {
            var otherCollectionKey = this.prefix + otherCollectionKeyRaw;
            this.ensureCollectionKeyExists(otherCollectionKey);
            return this.ItemsHolder.getItem(otherCollectionKey);
        };
        /**
         * @param {String} itemKey   The item key whose changes are being retrieved.
         * @return {Object} Any changes under the itemKey, if it exists.
         */
        StateHoldr.prototype.getChanges = function (itemKey) {
            this.ensureCollectionItemExists(itemKey);
            return this.collection[itemKey];
        };
        /**
         * @param {String} itemKey   The item key whose changes are being retrieved.
         * @param {String} valueKey   The specific change being requested.
         * @return {Mixed} The changes for the specific item, if it exists.
         */
        StateHoldr.prototype.getChange = function (itemKey, valueKey) {
            this.ensureCollectionItemExists(itemKey);
            return this.collection[itemKey][valueKey];
        };
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
        };
        /**
         * Adds a change to the collection, stored as a key-value pair under an item.
         *
         * @param {String} itemKey   The key for the item experiencing the change.
         * @param {String} valueKey   The attribute of the item being changed.
         * @param {Mixed} value   The actual value being stored.
         */
        StateHoldr.prototype.addChange = function (itemKey, valueKey, value) {
            this.ensureCollectionItemExists(itemKey);
            this.collection[itemKey][valueKey] = value;
        };
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
         * @param {String} itemKey   The key for the contained item.
         * @param {Mixed} output   The recipient for all the changes.
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
         * @param {String} collectionKey   The key for the collection that must
         *                                 exist, including the prefix.
         */
        StateHoldr.prototype.ensureCollectionKeyExists = function (collectionKey) {
            if (!this.ItemsHolder.hasKey(collectionKey)) {
                this.ItemsHolder.addItem(collectionKey, {
                    "valueDefault": {},
                    "storeLocally": true
                });
            }
        };
        /**
         * Ensures an item in the current collection exists by checking for it and
         * creating it if it doesn't.
         *
         * @param {String} itemKey   The item key that must exist.
         */
        StateHoldr.prototype.ensureCollectionItemExists = function (itemKey) {
            if (typeof this.collection[itemKey] === "undefined") {
                this.collection[itemKey] = {};
            }
        };
        return StateHoldr;
    })();
    _StateHoldr.StateHoldr = StateHoldr;
})(StateHoldr || (StateHoldr = {}));
