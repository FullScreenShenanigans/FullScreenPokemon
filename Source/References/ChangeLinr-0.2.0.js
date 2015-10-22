var ChangeLinr;
(function (ChangeLinr_1) {
    "use strict";
    /**
     * A general utility for transforming raw input to processed output. This is
     * done by keeping an Array of transform Functions to process input on.
     * Outcomes for inputs are cached so repeat runs are O(1).
     */
    var ChangeLinr = (function () {
        /**
         * @param {IChangeLinrSettings} settings
         */
        function ChangeLinr(settings) {
            var i;
            if (typeof settings.pipeline === "undefined") {
                throw new Error("No pipeline given to ChangeLinr.");
            }
            this.pipeline = settings.pipeline || [];
            if (typeof settings.transforms === "undefined") {
                throw new Error("No transforms given to ChangeLinr.");
            }
            this.transforms = settings.transforms || {};
            this.doMakeCache = typeof settings.doMakeCache === "undefined"
                ? true : settings.doMakeCache;
            this.doUseCache = typeof settings.doUseCache === "undefined"
                ? true : settings.doUseCache;
            this.cache = {};
            this.cacheFull = {};
            // Ensure the pipeline is formatted correctly
            for (i = 0; i < this.pipeline.length; ++i) {
                // Don't allow null/false transforms
                if (!this.pipeline[i]) {
                    throw new Error("Pipe[" + i + "] is invalid.");
                }
                // Make sure each part of the pipeline exists
                if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                    if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                        throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                            + "not found in transforms.");
                    }
                }
                // Also make sure each part of the pipeline is a Function
                if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                    throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                        + "is not a valid Function from transforms.");
                }
                this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
            }
        }
        /* Simple gets
        */
        /**
         * @return {Mixed} The cached output of this.process and this.processFull.
         */
        ChangeLinr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @param {String} key   The key under which the output was processed
         * @return {Mixed} The cached output filed under the given key.
         */
        ChangeLinr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * @return {Object} A complete listing of the cached outputs from all
         *                  processed information, from each pipeline transform.
         */
        ChangeLinr.prototype.getCacheFull = function () {
            return this.cacheFull;
        };
        /**
         * @return {Boolean} Whether the cache object is being kept.
         */
        ChangeLinr.prototype.getDoMakeCache = function () {
            return this.doMakeCache;
        };
        /**
         * @return {Boolean} Whether previously cached output is being used in new
         *                   process requests.
         */
        ChangeLinr.prototype.getDoUseCache = function () {
            return this.doUseCache;
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
        ChangeLinr.prototype.process = function (data, key, attributes) {
            if (key === void 0) { key = undefined; }
            if (attributes === void 0) { attributes = undefined; }
            var i;
            if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
                key = data;
            }
            // If this keyed input was already processed, get that
            if (this.doUseCache && this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Apply (and optionally cache) each transform in order
            for (i = 0; i < this.pipeline.length; ++i) {
                data = this.transforms[this.pipeline[i]](data, key, attributes, this);
                if (this.doMakeCache) {
                    this.cacheFull[this.pipeline[i]][key] = data;
                }
            }
            if (this.doMakeCache) {
                this.cache[key] = data;
            }
            return data;
        };
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Object} The complete output of the transforms.
         */
        ChangeLinr.prototype.processFull = function (raw, key, attributes) {
            if (attributes === void 0) { attributes = undefined; }
            var output = {}, i;
            this.process(raw, key, attributes);
            for (i = 0; i < this.pipeline.length; ++i) {
                output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
            }
            return output;
        };
        return ChangeLinr;
    })();
    ChangeLinr_1.ChangeLinr = ChangeLinr;
})(ChangeLinr || (ChangeLinr = {}));
