declare namespace StringFilr {
    /**
     * The core stored library in a StringFilr, as a tree of data.
     */
    interface ILibrary<T> {
        [i: string]: T | ILibrary<T>;
    }
    /**
     * A cache of previously completed lookups.
     */
    interface ICache<T> {
        [i: string]: T | ILibrary<T>;
    }
    /**
     * Settings to initialize a new IStringFilr.
     */
    interface IStringFilrSettings<T> {
        /**
         * An Object containing data stored as children of sub-Objects.
         */
        library: ILibrary<T>;
        /**
         * A String to use as a default key to rescue on, if provided.
         */
        normal?: string;
        /**
         * Whether the library is required to contain the normal key in every
         * descendent (by default, false).
         */
        requireNormalKey?: boolean;
    }
    /**
     * A path-based cache for quick loops in nested data structures.
     */
    interface IStringFilr<T> {
        /**
         * @returns The base library of stored information.
         */
        getLibrary(): ILibrary<T>;
        /**
         * @returns The optional normal class String.
         */
        getNormal(): string;
        /**
         * @returns The complete cache of previously completed lookups.
         */
        getCache(): ICache<T>;
        /**
         * @returns A cached value, if it exists.
         */
        getCached(key: string): T | ILibrary<T>;
        /**
         * Completely clears the lookup cache.
         */
        clearCache(): void;
        /**
         * Clears the cached entry for a key.
         *
         * @param keyRaw   The raw key whose lookup is to be cleared.
         */
        clearCached(key: string): void;
        /**
         * Retrieves the deepest matching data in the library for a key.
         *
         * @param keyRaw   The raw key for data to look up, in String form.
         * @returns The deepest matching data in the library.
         */
        get(keyRaw: string): T | ILibrary<T>;
    }
    /**
     * A path-based cache for quick loops in nested data structures.
     */
    class StringFilr<T> implements IStringFilr<T> {
        /**
         * The library of data.
         */
        private library;
        /**
         * A cache of previously completed lookups.
         */
        private cache;
        /**
         * Optional default index to check when no suitable option is found.
         */
        private normal;
        /**
         * Whether to crash when a sub-object in reset has no normal child.
         */
        private requireNormalKey;
        /**
         * Initializes a new instance of the StringFilr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IStringFilrSettings<T>);
        /**
         * @returns The base library of stored information.
         */
        getLibrary(): ILibrary<T>;
        /**
         * @returns The optional normal class String.
         */
        getNormal(): string;
        /**
         * @returns The complete cache of previously completed lookups.
         */
        getCache(): ICache<T>;
        /**
         * @returns A cached value, if it exists.
         */
        getCached(key: string): any;
        /**
         * Completely clears the lookup cache.
         */
        clearCache(): void;
        /**
         * Clears the cached entry for a key.
         *
         * @param keyRaw   The raw key whose lookup is to be cleared.
         */
        clearCached(keyRaw: string): void;
        /**
         * Retrieves the deepest matching data in the library for a key.
         *
         * @param keyRaw   The raw key for data to look up, in String form.
         * @returns The deepest matching data in the library.
         */
        get(keyRaw: string): T | ILibrary<T>;
        /**
         * Utility Function to follow a path into the library (this is the driver
         * for searching into the library). For each available key, if it matches
         * a key in current, it is removed from keys and recursion happens on the
         * sub-directory in current.
         *
         * @param keys   The currently available keys to search within.
         * @param current   The current location being searched within the library.
         * @returns The most deeply matched part of the library.
         */
        private followClass(keys, current);
    }
}
declare var module: any;
