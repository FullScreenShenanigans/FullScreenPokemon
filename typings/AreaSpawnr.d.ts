/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
declare namespace AreaSpawnr {
    /**
     * A Function to add a map command, such as an after or stretch.
     *
     * @param thing   The raw command to create a Thing, as either a title
     *                or a JSON object.
     * @param index   Which command this is, as per Array.forEach.
     */
    interface ICommandAdder {
        (thing: string | MapsCreatr.IPreThingSettings, index: number): void;
    }
    /**
     * Settings to initialize a new IAreaSpawnr.
     */
    interface IAreaSpawnrSettings {
        /**
         * A MapsCreatr used to store and lazily initialize Maps.
         */
        MapsCreator: MapsCreatr.IMapsCreatr;
        /**
         * A MapScreenr used to store attributes of Areas.
         */
        MapScreener: MapScreenr.IMapScreenr;
        /**
         * Function for when a PreThing's Thing should be spawned.
         */
        onSpawn?: (prething: MapsCreatr.IPreThing) => void;
        /**
         * Function for when a PreThing's Thing should be un-spawned.
         */
        onUnspawn?: (prething: MapsCreatr.IPreThing) => void;
        /**
         * Any property names to copy from Areas to
         */
        screenAttributes?: string[];
        /**
         * Function to add an Area's provided "stretches" commands to stretch
         * across an Area.
         */
        stretchAdd?: ICommandAdder;
        /**
         * Function to add an Area provides an "afters" command to add PreThings
         * to the end of an Area.
         */
        afterAdd?: ICommandAdder;
        /**
         * An optional scope to call stretchAdd and afterAdd on, if not this.
         */
        commandScope?: any;
    }
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    interface IAreaSpawnr {
        /**
         * @returns The internal MapsCreator.
         */
        getMapsCreator(): MapsCreatr.IMapsCreatr;
        /**
         * @returns The internal MapScreener.
         */
        getMapScreener(): MapScreenr.IMapScreenr;
        /**
         * @returns The attribute names to be copied to MapScreener.
         */
        getScreenAttributes(): string[];
        /**
         * @returns The key by which the current Map is indexed.
         */
        getMapName(): string;
        /**
         * Gets the map listed under the given name. If no name is provided, the
         * mapCurrent is returned instead.
         *
         * @param name   An optional key to find the map under.
         * @returns A Map under the given name, or the current map if none given.
         */
        getMap(name?: string): MapsCreatr.IMap;
        /**
         * Simple getter pipe to the internal MapsCreator.getMaps() function.
         *
         * @returns A listing of maps, keyed by their names.
         */
        getMaps(): {
            [i: string]: MapsCreatr.IMap;
        };
        /**
         * @returns The current Area.
         */
        getArea(): MapsCreatr.IArea;
        /**
         * @returns The name of the current Area.
         */
        getAreaName(): string;
        /**
         * @param location   The key of the Location to return.
         * @returns A Location within the current Map.
         */
        getLocation(location: string): MapsCreatr.ILocation;
        /**
         * @returns The most recently entered Location in the current Area.
         */
        getLocationEntered(): MapsCreatr.ILocation;
        /**
         * Simple getter function for the internal prethings object. This will be
         * undefined before the first call to setMap.
         *
         * @returns A listing of the current area's Prethings.
         */
        getPreThings(): MapsCreatr.IPreThingsContainers;
        /**
         * Sets the scope to run PreThing commands in.
         *
         * @param commandScope   A scope to run PreThing commands in.
         */
        setCommandScope(commandScope: any): any;
        /**
         * Sets the currently manipulated Map in the handler to be the one under a
         * given name. Note that this will do very little unless a location is
         * provided.
         *
         * @param name   A key to find the map under.
         * @param location   An optional key for a location to immediately start the
         *                   map in (if not provided, ignored).
         * @returns The now-current map.
         */
        setMap(name: string, location?: string): MapsCreatr.IMap;
        /**
         * Goes to a particular location in the given map. Area attributes are
         * copied to the MapScreener, PreThings are loaded, and stretches and afters
         * are checked.
         *
         * @param name   The key of the Location to start in.
         */
        setLocation(name: string): void;
        /**
         * Applies the stretchAdd Function to each given "stretch" command and
         * stores the commands in stretches.
         *
         * @param stretchesRaw   Raw descriptions of the stretches.
         */
        setStretches(stretchesRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        /**
         * Applies the afterAdd Function to each given "after" command and stores
         * the commands in afters.
         *
         * @param aftersRaw   Raw descriptions of the afters.
         */
        setAfters(aftersRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        /**
         * Calls onSpawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is a simple wrapper
         * around applySpawnAction that also gives it true as the status.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to spawn within.
         * @param right   The right-most bound to spawn within.
         * @param bottom    The bottom-most bound to spawn within.
         * @param left    The left-most bound to spawn within.
         */
        spawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;
        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is a simple wrapper
         * around applySpawnAction that also gives it false as the status.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to spawn within.
         * @param right   The right-most bound to spawn within.
         * @param bottom    The bottom-most bound to spawn within.
         * @param left    The left-most bound to spawn within.
         */
        unspawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;
    }
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    class AreaSpawnr implements IAreaSpawnr {
        /**
         * Directional equivalents for converting from directions to keys.
         */
        static directionKeys: {
            [i: string]: string;
        };
        /**
         * Opposite directions for when finding descending order Arrays.
         */
        static directionOpposites: {
            [i: string]: string;
        };
        /**
         * MapsCreatr container for Maps from which this obtains Thing settings.
         */
        private MapsCreator;
        /**
         * MapScreenr container for attributes copied from Areas.
         */
        private MapScreener;
        /**
         * The names of attributes to be copied to the MapScreenr during setLocation.
         */
        private screenAttributes;
        /**
         * The currently referenced Map, set by setMap.
         */
        private mapCurrent;
        /**
         * The currently referenced Area, set by setLocation.
         */
        private areaCurrent;
        /**
         * The currently referenced Location, set by setLocation.
         */
        private locationEntered;
        /**
         * The name of the currently referenced Area, set by setMap.
         */
        private mapName;
        /**
         * The current Area's listing of PreThings.
         */
        private prethings;
        /**
         * Function for when a PreThing is to be spawned.
         */
        private onSpawn;
        /**
         * Function for when a PreThing is to be un-spawned.
         */
        private onUnspawn;
        /**
         * Optionally, PreThing settings to stretch across an Area.
         */
        private stretches;
        /**
         * If stretches exists, a Function to add stretches to an Area.
         */
        private stretchAdd;
        /**
         * Optionally, PreThing settings to place at the end of an Area.
         */
        private afters;
        /**
         * If afters exists, a Function to add afters to an Area.
         */
        private afterAdd;
        /**
         * An optional scope to call Prething commands in, if not this.
         */
        private commandScope;
        /**
         * @param {IAreaSpawnrSettings} settings
         */
        constructor(settings: IAreaSpawnrSettings);
        /**
         * @returns The internal MapsCreator.
         */
        getMapsCreator(): MapsCreatr.IMapsCreatr;
        /**
         * @returns The internal MapScreener.
         */
        getMapScreener(): MapScreenr.IMapScreenr;
        /**
         * @returns The attribute names to be copied to MapScreener.
         */
        getScreenAttributes(): string[];
        /**
         * @returns The key by which the current Map is indexed.
         */
        getMapName(): string;
        /**
         * Gets the map listed under the given name. If no name is provided, the
         * mapCurrent is returned instead.
         *
         * @param name   An optional key to find the map under.
         * @returns A Map under the given name, or the current map if none given.
         */
        getMap(name?: string): MapsCreatr.IMap;
        /**
         * Simple getter pipe to the internal MapsCreator.getMaps() function.
         *
         * @returns A listing of maps, keyed by their names.
         */
        getMaps(): {
            [i: string]: MapsCreatr.IMap;
        };
        /**
         * @returns The current Area.
         */
        getArea(): MapsCreatr.IArea;
        /**
         * @returns The name of the current Area.
         */
        getAreaName(): string;
        /**
         * @param location   The key of the Location to return.
         * @returns A Location within the current Map.
         */
        getLocation(location: string): MapsCreatr.ILocation;
        /**
         * @returns The most recently entered Location in the current Area.
         */
        getLocationEntered(): MapsCreatr.ILocation;
        /**
         * Simple getter function for the internal prethings object. This will be
         * undefined before the first call to setMap.
         *
         * @returns A listing of the current area's Prethings.
         */
        getPreThings(): MapsCreatr.IPreThingsContainers;
        /**
         * Sets the scope to run PreThing commands in.
         *
         * @param commandScope   A scope to run PreThing commands in.
         */
        setCommandScope(commandScope: any): any;
        /**
         * Sets the currently manipulated Map in the handler to be the one under a
         * given name. Note that this will do very little unless a location is
         * provided.
         *
         * @param name   A key to find the map under.
         * @param location   An optional key for a location to immediately start the
         *                   map in (if not provided, ignored).
         * @returns The now-current map.
         */
        setMap(name: string, location?: string): MapsCreatr.IMap;
        /**
         * Goes to a particular location in the given map. Area attributes are
         * copied to the MapScreener, PreThings are loaded, and stretches and afters
         * are checked.
         *
         * @param name   The key of the Location to start in.
         */
        setLocation(name: string): void;
        /**
         * Applies the stretchAdd Function to each given "stretch" command and
         * stores the commands in stretches.
         *
         * @param stretchesRaw   Raw descriptions of the stretches.
         */
        setStretches(stretchesRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        /**
         * Applies the afterAdd Function to each given "after" command and stores
         * the commands in afters.
         *
         * @param aftersRaw   Raw descriptions of the afters.
         */
        setAfters(aftersRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        /**
         * Calls onSpawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is a simple wrapper
         * around applySpawnAction that also gives it true as the status.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to spawn within.
         * @param right   The right-most bound to spawn within.
         * @param bottom    The bottom-most bound to spawn within.
         * @param left    The left-most bound to spawn within.
         */
        spawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;
        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is a simple wrapper
         * around applySpawnAction that also gives it false as the status.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to spawn within.
         * @param right   The right-most bound to spawn within.
         * @param bottom    The bottom-most bound to spawn within.
         * @param left    The left-most bound to spawn within.
         */
        unspawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;
        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is used both to spawn
         * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
         * status is used as a filter: all PreThings that already have the status
         * (generally true or false as spawned or unspawned, respectively) will have
         * the callback called on them.
         *
         * @param callback   The callback to be run whenever a matching matching
         *                   PreThing is found.
         * @param status   The spawn status to match PreThings against. Only PreThings
         *                 with .spawned === status will have the callback applied.
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to apply within.
         * @param right   The right-most bound to apply within.
         * @param bottom    The bottom-most bound to apply within.
         * @param left    The left-most bound to apply within.
         */
        private applySpawnAction(callback, status, direction, top, right, bottom, left);
        /**
         * Finds the index from which PreThings should stop having an action
         * applied to them in applySpawnAction. This is less efficient than the
         * unused version below, but is more reliable for slightly unsorted groups.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param group   The group to find a PreThing index within.
         * @param mid   The middle of the group. This is currently unused.
         * @param top   The upper-most bound to apply within.
         * @param right   The right-most bound to apply within.
         * @param bottom    The bottom-most bound to apply within.
         * @param left    The left-most bound to apply within.
         * @returns The index to start spawning PreThings from.
         */
        private findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
        /**
         * Finds the index from which PreThings should stop having an action
         * applied to them in applySpawnAction. This is less efficient than the
         * unused version below, but is more reliable for slightly unsorted groups.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param group   The group to find a PreThing index within.
         * @param mid   The middle of the group. This is currently unused.
         * @param top   The upper-most bound to apply within.
         * @param right   The right-most bound to apply within.
         * @param bottom    The bottom-most bound to apply within.
         * @param left    The left-most bound to apply within.
         * @returns The index to stop spawning PreThings from.
         */
        private findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);
        /**
         * Conditionally returns a measurement based on what direction String is
         * given. This is useful for generically finding boundaries when the
         * direction isn't known, such as in findPreThingsSpawnStart and -End.
         *
         * @param direction   The direction by which to order PreThings, as "xInc",
         *                    "xDec", "yInc", or "yDec".
         * @param top   The upper-most bound to apply within.
         * @param right   The right-most bound to apply within.
         * @param bottom    The bottom-most bound to apply within.
         * @param left    The left-most bound to apply within.
         * @returns Either top, right, bottom, or left, depending on direction.
         */
        private getDirectionEnd(directionKey, top, right, bottom, left);
    }
}
declare var module: any;
