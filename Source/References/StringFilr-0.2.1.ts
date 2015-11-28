declare module StringFilr {
    export interface IStringFilrSettings {
        /**
         * An Object containing data stored as children of sub-Objects.
         */
        library: any;

        /**
         * A String to use as a default key to rescue on, if provided.
         */
        normal?: string;

        /**
         * Whether it's ok for the library to have Objects that don't contain the
         * normal key (by default, false).
         */
        requireNormalKey?: boolean;
    }

    export interface IStringFilr {
        getLibrary(): any;
        getNormal(): string;
        getCache(): any;
        getCached(key: string): any;
        clearCache(): void;
        clearCached(key: string): void;
        get(keyRaw: string): any;
    }
}

module StringFilr {
    "use strict";

    /**
     * A general utility for retrieving data from an Object based on nested class
     * names. You can think of the internal "library" Object as a tree structure,
     * such that you can pass in a listing (in any order) of the path to data for 
     * retrieval.
     */
    export class StringFilr implements IStringFilr {
        // The library of data.
        private library: any;

        // Listing of previously found lookups, for speed's sake.
        private cache: any;

        // Optional default class to use when no suitable option is found.
        private normal: string;

        // Whether to crash when a sub-object in reset has no normal child.
        private requireNormalKey: boolean;

        /**
         * @param {IStringFilrSettings} settings
         */
        constructor(settings: IStringFilrSettings) {
            if (!settings) {
                throw new Error("No settings given to StringFilr.");
            }
            if (!settings.library) {
                throw new Error("No library given to StringFilr.");
            }

            this.library = settings.library;
            this.normal = settings.normal;
            this.requireNormalKey = settings.requireNormalKey;

            this.cache = {};

            if (this.requireNormalKey) {
                if (typeof this.normal === "undefined") {
                    throw new Error("StringFilr is given requireNormalKey, but no normal class.");
                }

                this.ensureLibraryNormal();
            }
        }

        /**
         * @return {Object} The base library of stored information.
         */
        getLibrary(): any {
            return this.library;
        }

        /**
         * @return {String} The optional normal class String.
         */
        getNormal(): string {
            return this.normal;
        }

        /**
         * @return {Object} The complete cache of cached output.
         */
        getCache(): any {
            return this.cache;
        }

        /**
         * @return {Mixed} A cached value, if it exists/
         */
        getCached(key: string): any {
            return this.cache[key];
        }

        /**
         * Completely clears the cache Object.  
         */
        clearCache(): void {
            this.cache = {};
        }

        /**
         * Clears the cached entry for a key.
         * 
         * @param {String} key
         */
        clearCached(key: string): void {
            delete this.cache[key];

            if (this.normal) {
                delete this.cache[key.replace(this.normal, "")];
            }
        }

        /**
         * Retrieves the deepest matching data in the library for a key. 
         * 
         * @param {String} keyRaw
         * @return {Mixed}
         */
        get(keyRaw: string): any {
            var key: string,
                result: any;

            if (this.normal) {
                key = keyRaw.replace(this.normal, "");
            } else {
                key = keyRaw;
            }

            // Quickly return a cached result if it exists
            if (this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }

            // Since no existed, it must be found deep within the library
            result = this.followClass(key.split(/\s+/g), this.library);

            this.cache[key] = this.cache[keyRaw] = result;
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
         * @param {String[]} output   An Array of the String paths to parts that
         *                           don't have a matching key.
         * @return {String[]} output
         */
        private findLackingNormal(current: any, path: string, output: string[]): string[] {
            var i: string;

            if (!current.hasOwnProperty(this.normal)) {
                output.push(path);
            }

            if (typeof current[i] === "object") {
                for (i in current) {
                    if (current.hasOwnProperty(i)) {
                        this.findLackingNormal(current[i], path + " " + i, output);
                    }
                }
            }

            return output;
        }

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
        private followClass(keys: string[], current: any): any {
            var key: string,
                i: number;

            // If keys runs out, we're done
            if (!keys || !keys.length) {
                return current;
            }

            // For each key in the current array...
            for (i = 0; i < keys.length; i += 1) {
                key = keys[i];

                // ...if it matches, recurse on the other keys
                if (current.hasOwnProperty(key)) {
                    keys.splice(i, 1);
                    return this.followClass(keys, current[key]);
                }
            }

            // If no key matched, try the normal (default)
            if (this.normal && current.hasOwnProperty(this.normal)) {
                return this.followClass(keys, current[this.normal]);
            }

            // Nothing matches anything; we're done.
            return current;
        }

        /**
         * Driver for this.findLackingNormal. If library directories are found to
         * not have a normal, it throws an error.
         */
        private ensureLibraryNormal(): void {
            var caught: string[] = this.findLackingNormal(this.library, "base", []);

            if (caught.length) {
                throw new Error("Found " + caught.length + " library "
                    + "sub-directories missing the normal: "
                    + "\r\n  " + caught.join("\r\n  "));
            }
        }
    }
}
