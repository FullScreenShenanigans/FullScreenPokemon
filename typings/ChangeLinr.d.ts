declare namespace ChangeLinr {
    /**
     * A chained automator for applying and caching transforms.
     */
    class ChangeLinr implements IChangeLinr {
        /**
         * Functions that may be used to transform data, keyed by name.
         */
        private transforms;
        /**
         * Ordered listing of Function names to be applied to raw input.
         */
        private pipeline;
        /**
         * Cached output of previous results of the the pipeline.
         */
        private cache;
        /**
         * Cached output of each step of the pipeline.
         */
        private cacheFull;
        /**
         * Whether this should be caching responses.
         */
        private doMakeCache;
        /**
         * Whether this should be retrieving and using cached results.
         */
        private doUseCache;
        /**
         * @param {IChangeLinrSettings} settings
         */
        constructor(settings: IChangeLinrSettings);
        /**
         * @returns The cached output of this.process and this.processFull.
         */
        getCache(): ICache;
        /**
         * @param key   The key under which the output was processed
         * @returns The cached output filed under the given key.
         */
        getCached(key: string): any;
        /**
         * @returns A complete listing of the cached outputs from all
         *          processed information, from each pipeline transform.
         */
        getCacheFull(): ICacheFull;
        /**
         * @returns Whether the cache object is being kept.
         */
        getDoMakeCache(): boolean;
        /**
         * @returns Whether previously cached output is being used in new
         *          process requests.
         */
        getDoUseCache(): boolean;
        /**
         * Applies a series of transforms to input data. If doMakeCache is on, the
         * outputs of this are stored in cache and cacheFull.
         *
         * @param data   The data to be transformed.
         * @param [key]   They key under which the data is to be stored. If needed
         *                for caching but not provided, defaults to data.
         * @param [attributes]   Any extra attributes to be given to transforms.
         * @returns The final output of the pipeline.
         */
        process(data: any, key?: string, attributes?: any): any;
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param data   The data to be transformed.
         * @param key   They key under which the data is to be stored.
         * @param [attributes]   Any extra attributes to be given to the transforms.
         * @returns The final output of the transforms.
         */
        processFull(data: any, key: string, attributes?: any): any;
    }
    /**
     * A container of transform Functions, referenced by their keys.
     */
    interface ITransforms {
        [i: string]: ITransform;
    }
    /**
     * A transformation Function to apply to input.
     *
     * @param data   The raw input data to be transformed.
     * @param [key]   They key under which the data is to be stored.
     * @param [attributes]   Any extra attributes to be given to the transforms.
     * @param [scope]   The ChangeLinr calling the transformation.
     * @returns The input data, transformed.
     * @remarks All the parameters after data are listed as optional, but they
     *          will be passed in by the calling ChangeLinr.
     */
    interface ITransform {
        (data: any, key?: string, attributes?: any, scope?: IChangeLinr): any;
    }
    /**
     * Cached storage for outputs of transformations, keyed by their request key.
     */
    interface ICache {
        [i: string]: any;
    }
    /**
     * Complete cached storage for transforms, keyed by their request key to
     * a mapping of transforms to results.
     */
    interface ICacheFull {
        [i: string]: {
            [j: string]: any;
        };
    }
    /**
     * Settings to initialize a new instance of an IChangeLinr.
     */
    interface IChangeLinrSettings {
        /**
         * Transformation functions to be applied to inputs.
         */
        transforms: ITransforms;
        /**
         * The order to apply transformation functions to inputs.
         */
        pipeline: string[];
        /**
         * Whether a cache should be created of transformation results.
         */
        doMakeCache?: boolean;
        /**
         * Whether cache results should be used for computations.
         */
        doUseCache?: boolean;
    }
    /**
     * A chained automator for applying and caching transforms.
     */
    interface IChangeLinr {
        /**
         * @returns The cached output of this.process and this.processFull.
         */
        getCache(): ICache;
        /**
         * @param key   The key under which the output was processed
         * @returns The cached output filed under the given key.
         */
        getCached(key: string): any;
        /**
         * @returns A complete listing of the cached outputs from all
         *          processed information, from each pipeline transform.
         */
        getCacheFull(): ICacheFull;
        /**
         * @returns Whether the cache object is being kept.
         */
        getDoMakeCache(): boolean;
        /**
         * @returns Whether previously cached output is being used in new
         *          process requests.
         */
        getDoUseCache(): boolean;
        /**
         * Applies a series of transforms to input data. If doMakeCache is on, the
         * outputs of this are stored in cache and cacheFull.
         *
         * @param data   The data to be transformed.
         * @param [key]   They key under which the data is to be stored.
         *                If needed but not provided, defaults to data.
         * @param [attributes]   Any extra attributes to be given to the
         *                       transform Functions.
         * @returns The final output of the pipeline.
         */
        process(data: any, key?: string, attributes?: any): any;
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param data   The data to be transformed.
         * @param key   They key under which the data is to be stored.
         * @param [attributes]   Any extra attributes to be given to the transforms.
         * @returns The final output of the transforms.
         */
        processFull(data: any, key: string, attributes?: any): any;
    }
}
declare var module: any;
