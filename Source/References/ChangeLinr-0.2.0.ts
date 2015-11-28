declare module ChangeLinr {
    export interface IChangeLinrTransform {
        (data: any, key: string, attributes: any, scope: IChangeLinr): any;
    }

    export interface IChangeLinrCache {
        [i: string]: any;
    }

    export interface IChangeLinrCacheFull {
        [i: string]: {
            [i: string]: any;
        }
    }

    export interface IChangeLinrSettings {
        pipeline: string[];
        transforms: {
            [i: string]: IChangeLinrTransform
        };
        doMakeCache?: boolean;
        doUseCache?: boolean;
    }

    export interface IChangeLinr {
        getCache(): IChangeLinrCache;
        getCached(key: string): any;
        getCacheFull(): IChangeLinrCacheFull;
        getDoMakeCache(): boolean;
        getDoUseCache(): boolean;
        process(data: any, key?: string, attributes?: any): any;
        processFull(data: any, key?: string, attributes?: any): any;
    }
}


module ChangeLinr {
    "use strict";

    /**
     * A general utility for transforming raw input to processed output. This is
     * done by keeping an Array of transform Functions to process input on.
     * Outcomes for inputs are cached so repeat runs are O(1).
     */
    export class ChangeLinr implements IChangeLinr {
        /**
         * Functions that may be used to transform data, keyed by name.
         */
        private transforms: {
            [i: string]: IChangeLinrTransform;
        };

        /**
         * Ordered listing of Function names to be applied to raw input.
         */
        private pipeline: string[];

        /**
         * Cached output of previous results of the the pipeline.
         */
        private cache: IChangeLinrCache;

        /**
         * Cached output of each step of the pipeline.
         */
        private cacheFull: IChangeLinrCacheFull;

        /**
         * Whether this should be caching responses.
         */
        private doMakeCache: boolean;

        /**
         * Whether this should be retrieving and using cached results.
         */
        private doUseCache: boolean;

        /**
         * @param {IChangeLinrSettings} settings
         */
        constructor(settings: IChangeLinrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to ChangeLinr.");
            }
            if (typeof settings.pipeline === "undefined") {
                throw new Error("No pipeline given to ChangeLinr.");
            }
            if (typeof settings.transforms === "undefined") {
                throw new Error("No transforms given to ChangeLinr.");
            }

            var i: number;

            this.pipeline = settings.pipeline || [];

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
                        throw new Error(
                            "Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                            + "not found in transforms."
                            );
                    }
                }

                // Also make sure each part of the pipeline is a Function
                if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                    throw new Error(
                        "Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                        + "is not a valid Function from transforms."
                        );
                }

                this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
            }
        }


        /* Simple gets
        */

        /**
         * @return {Mixed} The cached output of this.process and this.processFull.
         */
        getCache(): IChangeLinrCache  {
            return this.cache;
        }

        /**
         * @param {String} key   The key under which the output was processed
         * @return {Mixed} The cached output filed under the given key.
         */
        getCached(key: string): any {
            return this.cache[key];
        }

        /**
         * @return {Object} A complete listing of the cached outputs from all 
         *                  processed information, from each pipeline transform.
         */
        getCacheFull(): IChangeLinrCacheFull {
            return this.cacheFull;
        }

        /**
         * @return {Boolean} Whether the cache object is being kept.
         */
        getDoMakeCache(): boolean {
            return this.doMakeCache;
        }

        /**
         * @return {Boolean} Whether previously cached output is being used in new
         *                   process requests.
         */
        getDoUseCache(): boolean {
            return this.doUseCache;
        }


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
        process(data: any, key: string = undefined, attributes: any = undefined): any {
            var i: number;

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
        }

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
        processFull(raw: any, key: string, attributes: any = undefined): any {
            var output: any = {},
                i: number;

            this.process(raw, key, attributes);

            for (i = 0; i < this.pipeline.length; ++i) {
                output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
            }

            return output;
        }
    }
}
