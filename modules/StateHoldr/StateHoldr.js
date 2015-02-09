/**
 * AreaDenotr.js
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
    self.getCollection = function () {
        return collection;
    };

    /**
     * 
     */
    self.getKeys = function () {
        return Object.keys(collections);
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
    self.getItem = function (itemKey) {
        return collection[itemKey];
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
    

    /* Storage
    */

    /**
     * 
     */
    self.setCollection = function (collectionKeyNew) {
        collectionKeyRaw = collectionKeyNew;
        collectionKey = prefix + collectionKeyRaw;

        if (!StatsHolder.hasKey(collectionKey)) {
            StatsHolder.addStatistic(collectionKey, {
                "valueDefault": {},
                "storeLocally": true
            });
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
    self.setItem = function (itemKey, valueKey) {
        collection[itemKey] = valueKey;
    };

    /**
     * 
     */
    self.markCollectionState = function (collectionKeyOther, itemKey, value) {
        var otherCollection = StatsHolder.get(prefix + collectionKeyOther);
        otherCollection[itemKey] = value;
        StatsHolder.set(item, value);
    };
    
    
    self.reset(settings);
}