/// <reference path="MapsCreatr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />

declare module MapsHandlr {
    /**
     * A Function to add a map command, such as an after or stretch.
     * 
     * @param thing   The raw command to create a Thing, as either a title
     *                or a JSON object.
     * @param index   Which command this is, as passed through Array.forEach.
     */
    export interface ICommandAdder {
        (thing: string | MapsCreatr.IPreThingSettings, index: number): void;
    }

    /**
     * Settings to initialize a new IMapsHandlr.
     */
    export interface IMapsHandlrSettings {
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
         * Any property names to copy from Areas to MapScreenr.
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

    export interface IMapsHandlr {
        getMapsCreator(): MapsCreatr.IMapsCreatr;
        getMapScreener(): MapScreenr.IMapScreenr;
        getScreenAttributes(): string[];
        getMapName(): string;
        getMap(name?: string): MapsCreatr.IMapsCreatrMap;
        getMaps(): { [i: string]: MapsCreatr.IMapsCreatrMap };
        getArea(): MapsCreatr.IMapsCreatrArea;
        getAreaName(): string;
        getLocation(location: string): MapsCreatr.IMapsCreatrLocation;
        getLocationEntered(): MapsCreatr.IMapsCreatrLocation;
        getPreThings(): { [i: string]: MapsCreatr.IPreThing[] };
        setMap(name: string, location?: string): MapsCreatr.IMapsCreatrMap;
        setLocation(name: string): void;
        setStretches(stretchesRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        setAfters(aftersRaw: (string | MapsCreatr.IPreThingSettings)[]): void;
        spawnMap(direction: string, top: number, right: number, bottom: number, left: number): void;
        unspawnMap(direction: string, top: number, right: number, bottom: number, left: number): void;
    }
}


module MapsHandlr {
    "use strict";

    /**
     * Map manipulator and spawner for GameStartr maps that is the front-end
     * counterpart to MapsCreatr. PreThing listings are loaded from Maps stored in a
     * MapsCreatr and added or removed from user input. Area properties are given to
     * a MapScreenr when a new Area is loaded.
     */
    export class MapsHandlr implements IMapsHandlr {
        /**
         * Directional equivalents for converting from directions to keys.
         */
        public static directionKeys: any = {
            "xInc": "left",
            "xDec": "right",
            "yInc": "top",
            "yDec": "bottom"
        };

        /**
         * Opposite directions for when finding descending order Arrays.
         */
        public static directionOpposites: any = {
            "xInc": "xDec",
            "xDec": "xInc",
            "yInc": "yDec",
            "yDec": "yInc"
        };

        /**
         * MapsCreatr container for Maps from which this obtains Thing settings.
         */
        private MapsCreator: MapsCreatr.IMapsCreatr;

        /**
         * MapScreenr container for attributes copied from Areas.
         */
        private MapScreener: MapScreenr.IMapScreenr;

        /**
         * The names of attributes to be copied to the MapScreenr during setLocation.
         */
        private screenAttributes: string[];

        /**
         * The currently referenced Map, set by setMap.
         */
        private mapCurrent: MapsCreatr.IMapsCreatrMap;

        /**
         * The currently referenced Area, set by setLocation.
         */
        private areaCurrent: MapsCreatr.IMapsCreatrArea;

        /**
         * The currently referenced Location, set by setLocation.
         */
        private locationEntered: MapsCreatr.IMapsCreatrLocation;

        /**
         * The name of the currently referenced Area, set by setMap.
         */
        private mapName: string;

        /**
         * The current Area's listing of PreThings.
         */
        private prethings: { [i: string]: MapsCreatr.IPreThing[] };

        /**
         * Function for when a PreThing is to be spawned.
         */
        private onSpawn: (prething: MapsCreatr.IPreThing) => void;

        /**
         * Function for when a PreThing is to be un-spawned.
         */
        private onUnspawn: (prething: MapsCreatr.IPreThing) => void;

        /**
         * Optionally, PreThing settings to stretch across an Area.
         */
        private stretches: (string | MapsCreatr.IPreThingSettings)[];

        /**
         * If stretches exists, a Function to add stretches to an Area.
         */
        private stretchAdd: ICommandAdder;

        /**
         * Optionally, PreThing settings to place at the end of an Area.
         */
        private afters: (string | MapsCreatr.IPreThingSettings)[];

        /**
         * If afters exists, a Function to add afters to an Area.
         */
        private afterAdd: ICommandAdder;

        /** 
         * An optional scope to call stretchAdd and afterAdd on, if not this.
         */
        private commandScope: any;

        /**
         * @param {IMapsHandlrSettings} settings
         */
        constructor(settings: IMapsHandlrSettings) {
            if (!settings) {
                throw new Error("No settings given to MapsHandlr.");
            }

            // Maps themselves should have been created in the MapsCreator object
            if (!settings.MapsCreator) {
                throw new Error("No MapsCreator provided to MapsHandlr.");
            }
            this.MapsCreator = settings.MapsCreator;

            // Map/Area attributes will need to be stored in a MapScreenr object
            if (!settings.MapScreener) {
                throw new Error("No MapScreener provided to MapsHandlr.");
            }
            this.MapScreener = settings.MapScreener;

            this.onSpawn = settings.onSpawn;
            this.onUnspawn = settings.onUnspawn;

            this.screenAttributes = settings.screenAttributes || [];
            this.stretchAdd = settings.stretchAdd;
            this.afterAdd = settings.afterAdd;
            this.commandScope = settings.commandScope;
        }


        /* Simple gets
        */

        /**
         * @return {MapsCreatr}   The internal MapsCreator.
         */
        getMapsCreator(): MapsCreatr.IMapsCreatr {
            return this.MapsCreator;
        }

        /**
         * @return {MapScreenr}   The internal MapScreener.
         */
        getMapScreener(): MapScreenr.IMapScreenr {
            return this.MapScreener;
        }

        /**
         * @return {String[]}   The attribute names to be copied to MapScreener.
         */
        getScreenAttributes(): string[] {
            return this.screenAttributes;
        }

        /**
         * @return {String}   The key by which the current Map is indexed.
         */
        getMapName(): string {
            return this.mapName;
        }

        /** 
         * Gets the map listed under the given name. If no name is provided, the
         * mapCurrent is returned instead.
         * 
         * @param {String} [name]   An optional key to find the map under.
         * @return {Map}
         */
        getMap(name: string = undefined): MapsCreatr.IMapsCreatrMap {
            if (typeof name !== "undefined") {
                return this.MapsCreator.getMap(name);
            } else {
                return this.mapCurrent;
            }
        }

        /**
         * Simple getter pipe to the internal MapsCreator.getMaps() function.
         * 
         * @return {Object<Map>}   A listing of maps, keyed by their names.
         */
        getMaps(): { [i: string]: MapsCreatr.IMapsCreatrMap } {
            return this.MapsCreator.getMaps();
        }

        /**
         * @return {Area} The current Area.
         */
        getArea(): MapsCreatr.IMapsCreatrArea {
            return this.areaCurrent;
        }

        /**
         * @return {String} The name of the current Area.
         */
        getAreaName(): string {
            return this.areaCurrent.name;
        }

        /**
         * @param {String} location   The key of the Location to return.
         * @return {Location} A Location within the current Map.
         */
        getLocation(location: string): MapsCreatr.IMapsCreatrLocation {
            return this.areaCurrent.map.locations[location];
        }

        /**
         * @return {Location} The most recently entered Location in the current Area.
         */
        getLocationEntered(): MapsCreatr.IMapsCreatrLocation {
            return this.locationEntered;
        }

        /**
         * Simple getter function for the internal prethings object. This will be
         * undefined before the first call to setMap.
         * 
         * @return {Object} A listing of the current area's Prethings.
         */
        getPreThings(): { [i: string]: MapsCreatr.IPreThing[] } {
            return this.prethings;
        }


        /* Map / location setting
        */

        /**
         * Sets the currently manipulated Map in the handler to be the one under a
         * given name. Note that this will do very little unless a location is 
         * provided.
         * 
         * @param {String} name   A key to find the map under.
         * @param {Mixed} [location]   An optional key for a location to immediately
         *                              start the map in (if not provided, ignored). 
         *                          
         */
        setMap(name: string, location: string = undefined): MapsCreatr.IMapsCreatrMap {
            // Get the newly current map from this.getMap normally
            this.mapCurrent = this.getMap(name);
            if (!this.mapCurrent) {
                throw new Error("Unknown Map in setMap: '" + name + "'.");
            }

            this.mapName = name;

            // Most of the work is done by setLocation (by default, the map's first)
            if (arguments.length > 1) {
                this.setLocation(location);
            }

            return this.mapCurrent;
        }

        /**
         * Goes to a particular location in the given map. Area attributes are 
         * copied to the MapScreener, PreThings are loaded, and stretches and afters
         * are checked.
         * 
         * @param {String} name   The key of the Location to start in.
         */
        setLocation(name: string): void {
            var location: MapsCreatr.IMapsCreatrLocation,
                attribute: string,
                i: number;

            // Query the location from the current map and ensure it exists
            location = this.mapCurrent.locations[name];
            if (!location) {
                throw new Error("Unknown location in setLocation: '" + name + "'.");
            }

            // Since the location is valid, mark it as current (with its area)
            this.locationEntered = location;
            this.areaCurrent = location.area;
            this.areaCurrent.boundaries = {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
            };

            // Copy all the settings from that area into the MapScreenr container
            for (i = 0; i < this.screenAttributes.length; i += 1) {
                attribute = this.screenAttributes[i];
                this.MapScreener[attribute] = this.areaCurrent[attribute];
            }

            // Reset the prethings object, enabling it to be used as a fresh start
            // for the new Area/Location placements
            this.prethings = this.MapsCreator.getPreThings(location.area);

            // Optional: set stretch commands
            if (this.areaCurrent.stretches) {
                this.setStretches(this.areaCurrent.stretches);
            } else {
                this.stretches = undefined;
            }

            // Optional: set after commands
            if (this.areaCurrent.afters) {
                this.setAfters(this.areaCurrent.afters);
            } else {
                this.afters = undefined;
            }
        }

        /**
         * Applies the stretchAdd Function to each given "stretch" command and  
         * stores the commands in stretches.
         * 
         * @param {Object[]} stretchesRaw
         */
        setStretches(stretchesRaw: (string | MapsCreatr.IPreThingSettings)[]): void {
            this.stretches = stretchesRaw;
            this.stretches.forEach(this.stretchAdd.bind(this.commandScope || this));
        }

        /**
         * Applies the afterAdd Function to each given "after" command and stores
         * the commands in afters.
         * 
         * @param {Object[]} aftersRaw
         */
        setAfters(aftersRaw: (string | MapsCreatr.IPreThingSettings)[]): void {
            this.afters = aftersRaw;
            this.afters.forEach(this.afterAdd.bind(this.commandScope || this));
        }

        /**
         * Calls onSpawn on every PreThing touched by the given bounding box, 
         * determined in order of the given direction. This is a simple wrapper 
         * around applySpawnAction that also gives it true as the status.
         * 
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {Number} top   The upper-most bound to spawn within.
         * @param {Number} right   The right-most bound to spawn within.
         * @param {Number} bottom    The bottom-most bound to spawn within.
         * @param {Number} left    The left-most bound to spawn within.
         */
        spawnMap(direction: string, top: number, right: number, bottom: number, left: number): void {
            if (this.onSpawn) {
                this.applySpawnAction(this.onSpawn, true, direction, top, right, bottom, left);
            }
        }

        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is a simple wrapper
         * around applySpawnAction that also gives it false as the status.
         * 
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {Number} top   The upper-most bound to spawn within.
         * @param {Number} right   The right-most bound to spawn within.
         * @param {Number} bottom    The bottom-most bound to spawn within.
         * @param {Number} left    The left-most bound to spawn within.
         */
        unspawnMap(direction: string, top: number, right: number, bottom: number, left: number): void {
            if (this.onUnspawn) {
                this.applySpawnAction(this.onUnspawn, false, direction, top, right, bottom, left);
            }
        }

        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is used both to spawn
         * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
         * status is used as a filter: all PreThings that already have the status
         * (generally true or false as spawned or unspawned, respectively) will have
         * the callback called on them.
         * 
         * @param {Function} callback   The callback to be run whenever a matching
         *                              matching PreThing is found.
         * @param {Boolean} status   The spawn status to match PreThings against.
         *                           Only PreThings with .spawned === status will 
         *                           have the callback applied to them.
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @todo This will almost certainly present problems when different 
         *       directions are used. For Pokemon/Zelda style games, the system
         *       will probably need to be adapted to use a Quadrants approach
         *       instead of plain Arrays.
         */
        private applySpawnAction(
            callback: (prething: MapsCreatr.IPreThing) => void,
            status: boolean,
            direction: string,
            top: number,
            right: number,
            bottom: number,
            left: number): void {
            var name: string,
                group: MapsCreatr.IPreThing[],
                prething: MapsCreatr.IPreThing,
                mid: number,
                start: number,
                end: number,
                i: number;

            // For each group of PreThings currently able to spawn...
            for (name in this.prethings) {
                if (!this.prethings.hasOwnProperty(name)) {
                    continue;
                }

                // Don't bother trying to spawn the group if it has no members
                group = this.prethings[name][direction];
                if (group.length === 0) {
                    continue;
                }

                // Find the start and end points within the PreThings Array
                // Ex. if direction="xInc", go from .left >= left to .left <= right
                mid = (group.length / 2) | 0;
                start = this.findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
                end = this.findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);

                // Loop through all the directionally valid PreThings, spawning if 
                // they're within the bounding box
                for (i = start; i <= end; i += 1) {
                    prething = group[i];

                    // For example: if status is true (spawned), don't spawn again
                    if (prething.spawned !== status) {
                        prething.spawned = status;
                        callback(prething);
                    }
                }
            }
        }

        /**
         * Finds the index from which PreThings should stop having an action 
         * applied to them in applySpawnAction. This is less efficient than the 
         * unused version below, but is more reliable for slightly unsorted groups.
         * 
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {PreThing[]} group   The group to find a PreThing index within.
         * @param {Number} mid   The middle of the group. This is currently unused.
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @return {Number}
         */
        private findPreThingsSpawnStart(
            direction: string,
            group: MapsCreatr.IPreThing[],
            mid: number,
            top: number,
            right: number,
            bottom: number,
            left: number): number {
            var directionKey: string = MapsHandlr.directionKeys[direction],
                directionEnd: number = this.getDirectionEnd(directionKey, top, right, bottom, left),
                i: number;

            for (i = 0; i < group.length; i += 1) {
                if (group[i][directionKey] >= directionEnd) {
                    return i;
                }
            }

            return i;
        }

        /**
         * Finds the index from which PreThings should stop having an action 
         * applied to them in applySpawnAction. This is less efficient than the 
         * unused version below, but is more reliable for slightly unsorted groups.
         * 
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {PreThing[]} group   The group to find a PreThing index within.
         * @param {Number} mid   The middle of the group. This is currently unused.
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @return {Number}
         */
        private findPreThingsSpawnEnd(
            direction: string,
            group: MapsCreatr.IPreThing[],
            mid: number,
            top: number,
            right: number,
            bottom: number,
            left: number): number {
            var directionKey: string = MapsHandlr.directionKeys[direction],
                directionKeyOpposite: string = MapsHandlr.directionKeys[MapsHandlr.directionOpposites[direction]],
                directionEnd: number = this.getDirectionEnd(directionKeyOpposite, top, right, bottom, left),
                i: number;

            for (i = group.length - 1; i >= 0; i -= 1) {
                if (group[i][directionKey] <= directionEnd) {
                    return i;
                }
            }

            return i;
        }

        /**
         * Conditionally returns a measurement based on what direction String is
         * given. This is useful for generically finding boundaries when the 
         * direction isn't known, such as in findPreThingsSpawnStart and -End.
         * 
         * @param {String} direction   The direction by which to order PreThings: 
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @return {Number} top, right, bottom, or left, depending on direction.
         */
        private getDirectionEnd(directionKey: string, top: number, right: number, bottom: number, left: number): number {
            switch (directionKey) {
                case "top":
                    return top;
                case "right":
                    return right;
                case "bottom":
                    return bottom;
                case "left":
                    return left;
                default:
                    throw new Error("Unknown directionKey: " + directionKey);
            }
        }
    }
}
