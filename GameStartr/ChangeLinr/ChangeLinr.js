/**
 * ChangeLinr.js
 * 
 * A general utility for transforming raw input to processed output. This is 
 * done by keeping an Array of transform Functions to process input on.  
 * Outcomes for inputs are cached so repeat runs are O(1).
 * 
 * @example 
 * // Creating and using a ChangeLinr to square numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *          "square": function (number) {
 *              return number * number;
 *          }    
 *      },
 *     "pipeline": ["square"]
 * });
 * console.log(ChangeLiner.process(7, "Test")); // 49
 * console.log(ChangeLiner.getCached("Test")); // 49
 * 
 * @example
 * // Creating and using a ChangeLinr to calculate Fibonacci numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "fibonacci": function (number, key, attributes, ChangeLiner) {
 *             if (!number) {
 *                 return 0;
 *             } else if (number === 1) {
 *                 return 1;
 *             }
 *             return ChangeLiner.process(number - 1) + ChangeLiner.process(number - 2);
 *         }
 *     },
 *     "pipeline": ["fibonacci"]
 * });
 * console.log(ChangeLiner.process(7)); // 13
 * console.log(ChangeLiner.getCache()); // {0: 0, 1: 1, ... 6: 8, 7: 13}
 * 
 * @example
 * // Creating and using a ChangeLinr to lowercase a string, remove whitespace,
 * // and sum the character codes of the result. 
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "toLowerCase": function (string) {
 *             return string.toLowerCase();
 *         },
 *         "removeWhitespace": function (string) {
 *             return string.replace(/\s/g, '');
 *         },
 *         "sum": function (string) {
 *             var total = 0,
 *                 i;
 *             for (i = 0; i < string.length; i += 1) {
 *                 total += string.charCodeAt(i);
 *             }
 *             return total;
 *         }
 *     },
 *     "pipeline": ["toLowerCase", "removeWhitespace", "sum"]
 * });
 * console.log(ChangeLiner.process("Hello world!", "Test")); // 1117
 * console.log(ChangeLiner.getCached("Test")); // 1117
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ChangeLinr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ChangeLinr(settings);
    }
    var self = this,

        // Associative array of functions ("name"=>function)
        transforms,

        // Ordered array of function names to be applied to raw input
        pipeline,
        pipelineLength,

        // Cached output of the pipeline: out-facing and inward, respectively
        cache,
        cacheFull,
        
        // Whether this should be caching responses
        doMakeCache,

        // Whether this should be retrieving cached results
        doUseCache,

        // Whether global functions are allowed in the pipeline (normally true)
        doUseGlobals;

    /**
     * Resets the ChangeLinr.
     * 
     * @constructor
     * @param {String[]} pipeline   The ordered pipeline of String names of the
     *                              transforms to call.
     * @param {Object} [transforms]   An Object containing Functions keyed by
     *                                their String name.
     * @param {Boolean} [doMakeCache]   Whether a cache should be constructed
     *                                  from inputs (defaults to true).
     * @param {Boolean} [doUseCache]   Whether the cache should be used to 
     *                                 cache outputs (defaults to true).
     * @param {Boolean} [doUseGlobals]   Whether global Functions may be 
     *                                   referenced by the pipeline Strings,
     *                                   rather than just ones in transforms
     *                                   (defaults to false).
     */
    self.reset = function (settings) {
        var i;
        
        if (typeof settings.pipeline === "undefined") {
            throw new Error("No pipeline given to ChangeLinr.");
        }
        
        if (!settings.pipeline.length) {
            throw new Error("Empty or invalid pipeline given to ChangeLinr.");
        }
        
        pipeline = settings.pipeline || [];
        transforms = settings.transforms || {};
        
        doMakeCache = (typeof settings.doMakeCache === "undefined") 
            ? true : settings.doMakeCache;
        
        doUseCache = (typeof settings.doUseCache === "undefined")
            ? true : settings.doUseCache;
        
        doUseGlobals = settings.hasOwnProperty("doUseGlobals")
            ? false : settings.doUseGlobals;
        
        pipelineLength = pipeline.length;
        
        cache = {};
        cacheFull = {};

        // Ensure the pipeline is formatted correctly
        for (i = 0; i < pipelineLength; ++i) {
            // Don't allow null/false transforms
            if (!pipeline[i]) {
                throw new Error("Pipe[" + i + "] is invalid.");
            }

            // Make sure each part of the pipeline exists
            if (!transforms.hasOwnProperty(pipeline[i])) {
                if (doUseGlobals) {
                    transforms[pipeline[i]] = window[pipeline[i]];
                }
                if (!transforms.hasOwnProperty(pipeline[i])) {
                    throw new Error("Pipe[" + i + "] (" + pipeline[i] + ") "
                        + "not found in transforms.");
                }
            }

            // Also make sure each part of the pipeline is a function
            if (!(transforms[pipeline[i]] instanceof Function)) {
                throw new Error("Pipe[" + i + "] (" + pipeline[i] + ") "
                    + "is not a valid function from transforms.");
            }

            cacheFull[i] = cacheFull[pipeline[i]] = {};
        }
    };
    
    
    /* Simple gets
    */

    /**
     * @return {Object} The cached output of self.process and self.processFull.
     */
    self.getCache = function () {
        return cache;
    };
    
    /**
     * @param {String} key   The key under which the output was processed
     * @return {Mixed} The cached output filed under the given key.
     */
    self.getCached = function (key) {
        return cache[key];
    };
    
    /**
     * @return {Object} A complete listing of the cached outputs from all 
     *                  processed information, from each pipeline transform.
     */
    self.getCacheFull = function () {
        return cacheFull;
    };
    
    /**
     * @return {Boolean} Whether the cache object is being kept.
     */
    self.getDoMakeCache = function () {
        return doMakeCache;
    };
    
    /**
     * @return {Boolean} Whether previously cached output is being used in new
     *                   process requests.
     */
    self.getDoUseCache = function () {
        return doUseCache;
    };
    
    
    /* Simple sets
    */
    
    /**
     * Sets whether the cache object is being kept.
     * 
     * @param {Boolean} value
     */
    self.setDoMakeCache = function (value) {
        doMakeCache = value;
    };
    
    /**
     * Sets whether previously cached output is being used in new process 
     * requests.
     * 
     * @param {Boolean} value
     */
    self.setDoUseCache = function (value) {
        doUseCache = value;
    };
    
    
    /* Core processing
    */

    /**
     * Applies a series of transforms to input data. If doMakeCache is on, the
     * outputs of this are stored in cache and cacheFull.
     * 
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Mixed} The final output of the pipeline.
     */
    self.process = function (data, key, attributes) {
        var i;
        
        if ((doMakeCache || doUseCache) && typeof key === "undefined") {
            key = data;
        }

        // If this keyed input was already processed, get that
        if (doUseCache && cache.hasOwnProperty(key)) {
            return cache[key];
        }
        
        // Apply (and optionally cache) each transform in order
        for (i = 0; i < pipelineLength; ++i) {
            data = transforms[pipeline[i]](data, key, attributes, self);
            
            if (doMakeCache) {
                cacheFull[pipeline[i]][key] = data;
            }
        }
        
        if (doMakeCache) {
            cache[key] = data;
        }

        return data;
    };

    /**
     * A version of self.process that returns the complete output from each 
     * pipelined transform Function in an Object.
     * 
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Object} The complete output of the transforms.
     */
    self.processFull = function (raw, key, attributes) {
        var output = {},
            i;
        
        self.process(raw, key, attributes);
        
        for (i = 0; i < pipelineLength; ++i) {
            output[i] = output[pipeline[i]] = cacheFull[pipeline[i]][key];
        }
        
        return output;
    };

    self.reset(settings || {});
}