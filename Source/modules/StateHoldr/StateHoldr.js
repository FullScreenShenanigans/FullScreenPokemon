/**
 * StateHoldr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function StateHoldr(settings) {
    "use strict";
    if (!this || this === window) {
        return new StateHoldr(settings);
    }
    var self = this,

        // The StatsHoldr instance that stores data
        StatsHolder,

        // A String prefix used for the StatsHolder keys
        prefix,

        // The current String key for the collection, with the prefix
        collectionKey,

        // The current String key for the collection, without the prefix
        collectionKeyRaw,

        // The current Object with attributes saved within
        collection;

    /**
     * 
     */
    self.reset = function (settings) {
        StatsHolder = settings.StatsHolder;
        if (!StatsHolder) {
            throw new Error("No StatsHolder given to StateHoldr.");
        }

        prefix = settings.prefix || "StateHolder";
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getStatsHolder = function () {
        return StatsHolder;
    };

    /**
     * 
     */
    self.getPrefix = function () {
        return prefix;
    };

    /**
     * 
     */
    self.getCollectionKeyRaw = function () {
        return collectionKeyRaw;
    };

    /**
     * 
     */
    self.getCollectionKey = function () {
        return collectionKey;
    };

    /**
     * 
     */
    self.getCollection = function () {
        return collection;
    };

    /**
     * 
     */
    self.getOtherCollection = function (otherCollectionKey) {
        otherCollectionKey = prefix + otherCollectionKey;

        ensureCollectionKeyExists(otherCollectionKey);

        return StatsHolder.get(otherCollectionKey);
    };

    /**
     * 
     */
    self.getChanges = function (itemKey) {
        return collection[itemKey];
    };

    /**
     * 
     */
    self.getChange = function (itemKey, valueKey) {
        return collection[itemKey][valueKey];
    };
    

    /* Storage
    */

    /**
     * 
     */
    self.setCollection = function (collectionKeyNew, value) {
        collectionKeyRaw = collectionKeyNew;
        collectionKey = prefix + collectionKeyRaw;

        ensureCollectionKeyExists(collectionKey);

        if (value) {
            StatsHolder.set(collectionKey, value);
        }

        collection = StatsHolder.get(collectionKey);
    };

    /**
     * 
     */
    self.saveCollection = function () {
        StatsHolder.set(collectionKey, collection);
    };

    /**
     * 
     */
    self.addChange = function (itemKey, valueKey, value) {
        if (typeof collection[itemKey] === "undefined") {
            collection[itemKey] = {};
        }

        collection[itemKey][valueKey] = value;
    };

    /**
     * 
     */
    self.addCollectionChange = function (collectionKeyOtherRaw, itemKey, valueKey, value) {
        var collectionKeyOther = prefix + collectionKeyOtherRaw,
            otherCollection;

        ensureCollectionKeyExists(collectionKeyOther);
        otherCollection = StatsHolder.get(collectionKeyOther);

        if (typeof otherCollection[itemKey] === "undefined") {
            otherCollection[itemKey] = {};
        }

        otherCollection[itemKey][valueKey] = value;

        StatsHolder.set(collectionKeyOther, otherCollection);
    };

    /**
     * 
     */
    self.applyChanges = function (id, output) {
        var changes = collection[id],
            key;
        
        if (!changes) {
            return;
        }

        for (key in changes) {
            output[key] = changes[key];
        }
    };

    /* Utilities
    */

    /**
     * 
     */
    function ensureCollectionKeyExists(collectionKey) {
        if (!StatsHolder.hasKey(collectionKey)) {
            StatsHolder.addStatistic(collectionKey, {
                "valueDefault": {},
                "storeLocally": true
            });
        }
    }
    
    
    self.reset(settings);
}