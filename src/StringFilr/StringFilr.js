/**
 * StringFilr.js
 * 
 * A general utility for retrieving data from an Object based on nested class
 * names. You can think of the internal "library" Object as a tree structure,
 * such that you can pass in a listing (in any order) of the path to data for 
 * retrieval.
 * 
 * @example
 * // Creating and using a StringFilr to store simple measurements.
 * var StringFiler = new StringFilr({
 *     "library": {
 *         "cup": "8oz",
 *         "gallon": "128oz",
 *         "half": {
 *             "cup": "4oz",
 *             "gallon": "64oz",
 *         }
 *     }
 * });
 * console.log(StringFiler.get("cup")); // "8oz"
 * console.log(StringFiler.get("half cup")); // "4oz"
 * 
 * @example 
 * // Creating and using a StringFilr to store order-sensitive information.
 * var StringFiler = new StringFilr({
 *     "library": {
 *         "milk": {
 *             "chocolate": "A lighter chocolate"
 *         },
 *         "chocolate": {
 *             "milk": "Milk mixed with syrup" 
 *         }
 *     }
 * });
 * console.log(StringFiler.get("milk chocolate")); // "A lighter chocolate"
 * console.log(StringFiler.get("chocolate milk")); // "Milk mixed with syrup"
 * 
 * @example 
 * // Creating and using a StringFilr to store a few people's measurements.
 * var StringFiler = new StringFilr({
 *     "normal": "color",
 *     "library": {
 *         "my": {
 *             "color": {
 *                 "eye": "blue-green",
 *                 "hair": "dirty blonde"
 *             },
 *             "major": "Computer Science"
 *         },
 *         "Mariah's": {
 *             "color": {
 *                 "eye": "brown",
 *                 "hair": "blonde"
 *             },
 *             "major": "Biomedical Engineering"
 *         },
 *         "Brandon's": {
 *             "color": {
 *                 "eye": "black",
 *                 "hair": "black"
 *             },
 *             "major": "Computer Science"
 *         }
 *     }
 * });
 * console.log(StringFiler.get("my major")); // "Computer Science"
 * console.log(StringFiler.get("Mariah's eye color")); // "brown"
 * console.log(StringFiler.get("Brandon's hair")); // "black"
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function StringFilr(settings) {
    "use strict";
    if (!this || this === window) {
        return new StringFilr(settings);
    }
    var self = this,

        // The library of data.
        library,

        // Listing of previously found lookups, for speed's sake.
        cache,

        // Optional default class to use when no suitable option is found.
        normal,

        // Whether to crash when a sub-object in reset has no normal child.
        requireNormalKey;

    /**
     * Resets the StringFilr.
     * 
     * @constructor
     * @param {Object} library   An Object containing data stored as children
     *                           of sub-Objects.
     * @param {String} [normal]   A String to use as a default key to recurse 
     *                            on. Defaults to undefined, so falsy.
     * @param {Boolean} [requireNormalKey]   Whether it's ok for the library to 
     *                                   have Objects that don't contain the
     *                                   normal key. Defaults to false.
     */
    self.reset = function (settings) {
        library = settings.library;
        normal = settings.normal;
        requireNormalKey = settings.requireNormalKey;
        
        cache = {};

        if (requireNormalKey) {
            if (!normal) {
                throw new Error("StringFilr is given requireNormalKey, but no normal class.");
            }
            
            var caught = findLackingNormal(library, "base", []);
            if (caught.length) {
                throw new Error("Found " + caught.length + " library "
                    + "sub-directories missing the normal: " 
                    + "\r\n  " + caught.join("\r\n  "));
            }
        }
    };

    /**
     * @return {Object} The base library of stored information.
     */
    self.getLibrary = function () {
        return library;
    };

    /**
     * @return {Object} The complete cache of cached output.
     */
    self.getCache = function () {
        return cache;
    };

    /**
     * Completely clears the cache Object.  
     */
    self.clearCache = function () {
        cache = {};
    };

    /**
     * Clears the cached entry for a key.
     * 
     * @param {String} key
     */
    self.clearCached = function(key) {
        if (normal) {
            key = key.replace(normal, '');
        }
        
        delete cache[key];
    }

    /**
     * Retrieves the deepest matching data in the library for a key. 
     * 
     * @param {String} key
     * @return {Mixed}
     */
    self.get = function(key) {
        var result;
        
        if (normal) {
            key = key.replace(normal, "");
        }

        // Quickly return a cached result if it exists
        if (cache.hasOwnProperty(key)) {
            return cache[key]
        };

        result = followClass(key.split(/\s+/g), library);

        cache[key] = result;
        return result;
    }

    /**
     * Utility helper to recursively check for tree branches in the library 
     * that don't have a key equal to the normal. For each sub-directory that
     * is caught, the path to it is added to output.
     * 
     * @param {Object} current   The current location being searched within
     *                           the library.
     * @param {String} path   The current path within the library.
     * @param {String[] output   An Array of the String paths to parts that
     *                           don't have a matching key.
     * @return {String[]} output
     */
    self.findLackingNormal = function (current, path, output) {
        var i;
        
        if (!current.hasOwnProperty(normal)) {
            output.push(path);
        }
        
        if (typeof current[i] === "object") {
            for (i in current) {
                findLackingNormal(current[i], path + " " + i, output);
            }
        }
        
        return output;
    };

    /**
     * Utility function to follow a path into the library (this is the driver 
     * for searching into the library). For each available key, if it matches
     * a key in current, it is removed from keys and recursion happens on the
     * sub-directory in current.
     * 
     * @param {String[]} keys   The currently available keys to search within.
     * @param {Object} current   The current location being searched within
     *                           the library.
     * @return {Mixed} The most deeply matched part of the library.
     */
    function followClass(keys, current) {
        var key, i;
        
        // If keys runs out, we're done
        if (!keys || !keys.length) {
            return current;
        }

        // For each key in the current array...
        for (i in keys) {
            key = keys[i];
            
            // ...if it matches, recurse on the other keys
            if (current.hasOwnProperty(key)) {
                keys.splice(i, 1);
                return followClass(keys, current[key]);
            }
        }

        // If no key matched, try the normal (default)
        if (normal && current.hasOwnProperty(normal)) {
            return followClass(keys, current[normal]);
        }
        
        // Nothing matches anything; we're done.
        return current;
    }

    /**
     * Simple utility function to get the last (deepest) parts of self.get 
     * results. This is useful because they're normally in reverse-order.
     * 
     * @param {Mixed} results 
     */
    function getResultsFinal(results) {
        if (typeof results[2] === "object") {
            return getResultsFinal(results[2]);
        }
        
        return results;
    }
    

    self.reset(settings || {});
}