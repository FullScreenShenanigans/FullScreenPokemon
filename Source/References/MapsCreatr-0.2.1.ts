/// <reference path="ObjectMakr-0.2.2.ts" />

declare module MapsCreatr {
    /**
     *
     */
    export interface IMapsCreatrMapRaw {
        name: string;
        locations: {
            [i: string]: IMapsCreatrLocationRaw;
            [i: number]: IMapsCreatrLocationRaw;
        };
        areas: {
            [i: string]: IMapsCreatrAreaRaw;
        };
    }
    
    /**
     *
     */
    export interface IMapsCreatrAreaRaw {
        creation: any[];
    }
    
    /**
     *
     */
    export interface IMapsCreatrLocationRaw {
        entry?: string;
        area?: number | string;
    }
    
    /**
     *
     */
    export interface IMapsCreatrMap {
        /**
         * Whether the Map has had its areas and locations set in getMap.
         */
        initialized: boolean;
        
        /**
         * A listing of areas in the Map, keyed by name.
         */
        areas: {
            [i: string]: IMapsCreatrArea;
            [i: number]: IMapsCreatrArea;
        };
        
        /**
         * A listing of locations in the Map, keyed by name.
         */
        locations: any;
    }
    
    /**
     *
     */
    export interface IMapsCreatrArea {
        /**
         * The user-friendly label for this Area.
         */
        name: string;
        
        /**
         * The Map this Area is a part of.
         */
        map: IMapsCreatrMap;
        
        /**
         * A list of PreThing and macro commands to build this area from scratch.
         */
        creation: any[];
        
        /**
         * Groups that may be requested by creation commands to store generated
         * Things, so they may reference each other during gameplay.
         */
        collections?: any;
        
        /**
         * The boundaries for the map; these all start at 0 and are stretched by
         * PreThings placed inside.
         */
        boundaries: {
            "top": number;
            "right": number;
            "bottom": number;
            "left": number;
        };
        
        /**
         * Optional listing of Things to provide to place at the end of the Area.
         */
        afters?: (string | IPreThingSettings)[];
        
        /**
         * Optional listing of Things to provide to stretch across the Area.
         */
        stretches?: (string | IPreThingSettings)[];
    }

    export interface IMapsCreatrLocation {
        /**
         * The user-friendly label for this Location.
         */
        name: string;
        
        /**
         * The Area this Location is a part of.
         */
        area: IMapsCreatrArea;
        
        /**
         * The source name for the keyed entry Function used for this Location.
         */
        entryRaw?: string;
        
        /**
         * The entrance Function used to enter this Location.
         */
        entry?: Function;
    }

    /**
     * 
     */
    export interface IPreThingSettings {
        /**
         * The horizontal starting location of the Thing (by default, 0).
         */
        x?: number;
        
        /**
         * The vertical starting location of the Thing (by default, 0).
         */
        y?: number;
        
        /**
         * How wide the Thing is (by default, the Thing's prototype's width from
         * ObjectMaker.getFullPropertiesOf).
         */
        width?: number;
        
        /**
         * How tall the Thing is (by default, the Thing's prototype's height from
         * ObjectMaker.getFullPropertiesOf).
         */
        height?: number;
        
        /**
         * An optional immediate modifier instruction for where the Thing should be
         * in its GroupHoldr group (either "beginning", "end", or undefined).
         */
        position?: string;

        /**
         * PreThings may pass any settings onto their created Things.
         */
        [i: string]: any;
    }

    /**
     * 
     */
    export interface IThing {
        /**
         * The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
         */
        title: string;

        /**
         * An optional group for the Thing to be in, keyed by its id.
         */
        collection?: any;

        /**
         * The key of the collection to place this Thing in, if collection isn't undefined.
         */
        collectionKey?: string;

        /**
         * The name this is referred to in its collection, if collection isn't undefined.
         */
        collectionName?: string;

        /**
         * Whether this should skip stretching the boundaries of an area
         */
        noBoundaryStretch?: boolean;
    }

    /**
     *
     */
    export interface IMapsCreatrEntrance {
        (scope: any, location: IMapsCreatrLocation);
    }
    
    /**
     *
     */
    export interface IMapsCreatrMacro {
        (
            reference: any,
            prethings: { [i: string]: MapsCreatr.IPreThing[] },
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrAreaRaw,
            scope: any
        ): MapsCreatr.IPreThing | MapsCreatr.IPreThing[];
    }
    
    /**
     *
     */
    export interface IMapsCreatrSettings {
        /**
         * An ObjectMakr used to create Maps and Things.Note that it must store 
         * full properties of Things, for quick size lookups.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;
        
        /**
         * The names of groups Things may be in.
         */
        groupTypes: string[];
        
        /**
         * The key for Things to determine what group they belong to (by default,
         * "groupType").
         */
        keyGroupType?: string;
        
        /**
         * The key for Things to determine what, if any, Location they act as an
         * entrance for (by default, "entrance").
         */
        keyEntrance?: string;
        
        /**
         * A listing of macros that can be used to automate common operations.
         */
        macros?: any;
        
        /**
         * A scope to give as a last parameter to macro Functions (by default, the
         * calling MapsCreatr).
         */
        scope?: any;
        
        /**
         * Optional entrance Functions that may be used as the openings for 
         * Locations.
         */
        entrances?: any;
        
        /**
         * Whether Locations must have an entrance Function defined by "entry" (by
         * default, false).
         */
        requireEntrance?: boolean;
        
        /**
         * Any maps that should be immediately stored via a storeMaps call, keyed
         * by name.
         */
        maps?: any;
    }
    
    /**
     *
     */
    export interface IPreThing {
        thing: IThing;
        title: any;
        reference: any;
        spawned: boolean;
        position: string;
        top: number;
        right: number;
        bottom: number;
        left: number;
    }
    
    /**
     *
     */
    export interface IMapsCreatr {
        getObjectMaker(): ObjectMakr.IObjectMakr;
        getGroupTypes(): string[];
        getKeyGroupType(): string;
        getKeyEntrance(): string;
        getMacros(): { [i: string]: IMapsCreatrMacro; };
        getScope(): any;
        getRequireEntrance(): boolean;
        getMapsRaw(): any;
        getMaps(): any;
        getMapRaw(name: string): IMapsCreatrMapRaw;
        getMap(name: string): IMapsCreatrMap;
        storeMaps(maps: { [i: string]: IMapsCreatrMapRaw }): void;
        storeMap(name: string, mapRaw: IMapsCreatrMapRaw): IMapsCreatrMap;
        getPreThings(area: IMapsCreatrArea): any;
        analyzePreSwitch(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[] | any;
        analyzePreMacro(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[] | any;
        analyzePreThing(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[] | any;
    }
}


module MapsCreatr {
    "use strict";

    /**
     * Basic storage container for a single Thing to be stored in an Area's
     * PreThings member. A PreThing stores an actual Thing along with basic
     * sizing and positioning information, so that a MapsHandler may accurately
     * spawn or unspawn it as needed.
     */
    export class PreThing implements IPreThing {
        /**
         * The contained Thing to be placed during gameplay.
         */
        public thing: IThing;

        /**
         * A copy of the Thing's title.
         */
        public title: any;

        /**
         * The creation command used to create the Thing.
         */
        public reference: any;

        /**
         * Whether this PreThing has already spawned (initially false).
         */
        public spawned: boolean;

        /**
         * An optional modifier instruction for group placement, from reference.
         */
        public position: string;

        /**
         * Top edge of the Thing's bounding box.
         */
        public top: number;

        /**
         * Riight edge of the Thing's bounding box.
         */
        public right: number;

        /**
         * Bottom edge of the Thing's bounding box.
         */
        public bottom: number;

        /**
         * Left edge of the Thing's bounding box.
         */
        public left: number;

        /**
         * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
         * @param {IPreThingSettings} reference   The creation Object instruction 
         *                                        used to create the Thing.
         */
        constructor(thing: IThing, reference: IPreThingSettings, ObjectMaker: ObjectMakr.IObjectMakr) {
            this.thing = thing;
            this.title = thing.title;
            this.reference = reference;
            this.spawned = false;

            this.left = reference.x || 0;
            this.top = reference.y || 0;

            this.right = this.left + (
                reference.width
                || ObjectMaker.getFullPropertiesOf(this.title).width
                );
            this.bottom = this.top + (
                reference.height
                || ObjectMaker.getFullPropertiesOf(this.title).height
                );

            if (reference.position) {
                this.position = reference.position;
            }
        }
    }

    /**
     * Storage container and lazy loader for GameStarter maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved. 
     * Areas contain a "creation" Object[] detailing the instructions on creating 
     * that Area's "PreThing" objects, which store Things along with basic position
     * information. 
     * 
     * In short, a Map contains a set of Areas, each of which knows its size and the
     * steps to create its contents. Each Map also contains a set of Locations, 
     * which are entry points into one Area each. 
     * 
     * See Schema.txt for the minimum recommended format for Maps, Locations, 
     * Areas, and creation commands.
     * 
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    export class MapsCreatr {
        /**
         * ObjectMakr factory used to create Maps, Areas, Locations, and Things.
         */
        private ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * Raw map objects passed to this.createMap, keyed by name.
         */
        private mapsRaw: {
            [i: string]: IMapsCreatrMapRaw;
        };

        /**
         * Map objects created by this.createMap, keyed by name.
         */
        private maps: {
            [i: string]: IMapsCreatrMap
        };

        /**
         * The possible group types processed PreThings may be placed in.
         */
        private groupTypes: string[];

        /**
         * Macro functions to create PreThings, keyed by String alias.
         */
        private macros: {
            [i: string]: IMapsCreatrMacro;
        };

        /**
         * String key under which Things store their group.
         */
        private keyGroupType: string;

        /**
         * String key under which Things may store that they are a Location entrance.
         */
        private keyEntrance: string;

        /**
         * Allowed entrance Functions, keyed by string alias.
         */
        private entrances: {
            [i: string]: IMapsCreatrEntrance;
        };

        /**
         * Whether an entrance is required on all Locations.
         */
        private requireEntrance: boolean;

        /**
         * An optional scope to pass to macros as an argument after maps, instead
         * of this MapsCreatr.
         */
        private scope: any;

        /**
         * @param {IMapsCreatrSettings} settings
         */
        constructor(settings: IMapsCreatrSettings) {
            if (!settings) {
                throw new Error("No settings object given to MapsCreatr.");
            }
            if (!settings.ObjectMaker) {
                throw new Error("No ObjectMakr given to MapsCreatr.");
            }
            if (typeof settings.ObjectMaker.getFullProperties() === "undefined") {
                throw new Error("MapsCreatr's ObjectMaker must store full properties.");
            }
            if (!settings.groupTypes) {
                throw new Error("No groupTypes given to MapsCreatr.");
            }

            this.ObjectMaker = settings.ObjectMaker;
            this.groupTypes = settings.groupTypes;

            this.keyGroupType = settings.keyGroupType || "groupType";
            this.keyEntrance = settings.keyEntrance || "entrance";

            this.macros = settings.macros || {};
            this.scope = settings.scope || this;

            this.entrances = settings.entrances;
            this.requireEntrance = settings.requireEntrance;

            this.mapsRaw = {};
            this.maps = {};
            if (settings.maps) {
                this.storeMaps(settings.maps);
            }
        }


        /* Simple gets
        */

        /**
         * @return {ObjectMakr}   The internal ObjectMakr.
         */
        getObjectMaker(): ObjectMakr.IObjectMakr {
            return this.ObjectMaker;
        }

        /**
         * @return {String[]}   The allowed group types.
         */
        getGroupTypes(): string[] {
            return this.groupTypes;
        }

        /**
         * @return {String}   The key under which Things are to store their group.
         */
        getKeyGroupType(): string {
            return this.keyGroupType;
        }

        /**
         * @return {String}   The key under which Things declare themselves an entrance.
         */
        getKeyEntrance(): string {
            return this.keyEntrance;
        }

        /**
         * @return {Object}   The allowed macro Functions.
         */
        getMacros(): { [i: string]: IMapsCreatrMacro; } {
            return this.macros;
        }

        /**
         * @return {Mixed}   The scope to give as a last parameter to macros.
         */
        getScope(): any {
            return this.scope;
        }

        /**
         * @return {Boolean} Whether Locations must have an entrance Function.
         */
        getRequireEntrance(): boolean {
            return this.requireEntrance;
        }

        /**
         * @return {Object}   The Object storing raw maps, keyed by name.
         */
        getMapsRaw(): any {
            return this.mapsRaw;
        }

        /**
         * @return {Object}   The Object storing maps, keyed by name.
         */
        getMaps(): any {
            return this.maps;
        }

        /**
         * @param {Mixed} name   A key to find the map under. This will typically be
         *                       a String.
         * @return {Map}   The raw map keyed by the given name.
         */
        getMapRaw(name?: string): IMapsCreatrMapRaw {
            var mapRaw: IMapsCreatrMapRaw = this.mapsRaw[name];
            if (!mapRaw) {
                throw new Error("No map found under: " + name);
            }

            return mapRaw;
        }

        /**
         * Getter for a map under the maps container. If the map has not yet been
         * initialized (had its areas and locations set), that is done here as lazy
         * loading.
         * 
         * @param {Mixed} name   A key to find the map under. This will typically be
         *                       a String.
         * @return {Map}
         */
        getMap(name: string): IMapsCreatrMap {
            var map: IMapsCreatrMap = this.maps[name];
            if (!map) {
                throw new Error("No map found under: " + name);
            }

            if (!map.initialized) {
                // Set the one-to-many Map->Area relationships within the Map
                this.setMapAreas(map);

                // Set the one-to-many Area->Location relationships within the Map
                this.setMapLocations(map);

                map.initialized = true;
            }

            return map;
        }

        /**
         * Creates and stores a set of new maps based on the key/value pairs in a 
         * given Object. These will be stored as maps by their string keys via 
         * this.storeMap.
         * 
         * @param {Object} maps   An Object containing a set of key/map pairs to
         *                       store as maps.
         * @return {Object}   The newly created maps object.
         */
        storeMaps(maps: { [i: string]: IMapsCreatrMapRaw }): void {
            var i: string;

            for (i in maps) {
                if (maps.hasOwnProperty(i)) {
                    this.storeMap(i, maps[i]);
                }
            }
        }

        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         * 
         * @param {Mixed} name   A name under which the map should be stored, 
         *                       commonly a String or Array.
         * @param {Object} settings   An Object containing arguments to be sent to
         *                            the ObjectMakr being used as a Maps factory.
         * @return {Map}   The newly created Map.
         */
        storeMap(name: string, mapRaw: IMapsCreatrMapRaw): IMapsCreatrMap {
            if (!name) {
                throw new Error("Maps cannot be created with no name.");
            }

            var map: IMapsCreatrMap = this.ObjectMaker.make("Map", mapRaw);

            this.mapsRaw[name] = mapRaw;

            if (!map.areas) {
                throw new Error("Maps cannot be used with no areas: " + name);
            }

            if (!map.locations) {
                throw new Error("Maps cannot be used with no locations: " + name);
            }

            this.maps[name] = map;
            return map;
        }


        /* Area setup (PreThing analysis)
        */

        /**
         * Given a Area, this processes and returns the PreThings that are to 
         * inhabit the Area per its creation instructions.
         * 
         * Each reference (which is a JSON object taken from an Area's .creation 
         * Array) is an instruction to this script to switch to a location, push 
         * some number of PreThings to the PreThings object via a predefined macro,
         * or push a single PreThing to the PreThings object.
         * 
         * Once those PreThing objects are obtained, they are filtered for validity
         * (e.g. location setter commands are irrelevant after a single use), and 
         * sorted on .xloc and .yloc.
         * 
         * @param {Area} area 
         * @return {Object}   An associative array of PreThing containers. The keys 
         *                    will be the unique group types of all the allowed 
         *                    Thing groups, which will be stored in the parent
         *                    EightBittr's GroupHoldr. Each container stores Arrays
         *                    of the PreThings sorted by .xloc and .yloc in both
         *                    increasing and decreasing order.
         */
        getPreThings(area: IMapsCreatrArea): any {
            var map: IMapsCreatrMap = area.map,
                creation: any = area.creation,
                prethings: any = this.fromKeys(this.groupTypes),
                i: number;

            area.collections = {};

            for (i = 0; i < creation.length; i += 1) {
                this.analyzePreSwitch(creation[i], prethings, area, map);
            }

            return this.processPreThingsArrays(prethings);
        }

        /**
         * PreThing switcher: Given a JSON representation of a PreThing, this 
         * determines what to do with it. It may be a location setter (to switch the
         * x- and y- location offset), a macro (to repeat some number of actions),
         * or a raw PreThing.
         * Any modifications done in a called function will be to push some number
         * of PreThings to their respective group in the output PreThings Object.
         * 
         * @param {Object} reference   A JSON mapping of some number of PreThings. 
         * @param {Object} PreThings   An associative array of PreThing Arrays, 
         *                             keyed by the allowed group types.
         * @param {Area} area   The Area object to be populated by these PreThings.
         * @param {Map} map   The Map object containing the Area object.
         */
        analyzePreSwitch(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[]| any {
            // Case: macro (unless it's undefined)
            if (reference.macro) {
                return this.analyzePreMacro(reference, prethings, area, map);
            } else {
                // Case: default (a regular PreThing)
                return this.analyzePreThing(reference, prethings, area, map);
            }
        }

        /**
         * PreThing case: Macro instruction. This calls the macro on the same input,
         * captures the output, and recursively repeats the analyzePreSwitch driver
         * function on the output(s). 
         * 
         * @param {Object} reference   A JSON mapping of some number of PreThings. 
         * @param {Object} PreThings   An associative array of PreThing Arrays, 
         *                             keyed by the allowed group types.
         * @param {Area} area   The Area object to be populated by these PreThings.
         * @param {Map} map   The Map object containing the Area object.
         */
        analyzePreMacro(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[]| any {
            var macro: any = this.macros[reference.macro],
                outputs: any[]| any,
                i: number;

            if (!macro) {
                console.warn(
                    "A non-existent macro is referenced. It will be ignored:",
                    macro, reference, prethings, area, map
                    );
                return;
            }

            // Avoid modifying the original macro by creating a new object in its
            // place, while submissively proliferating any default macro settings
            outputs = macro(reference, prethings, area, map, this.scope);

            // If there is any output, recurse on all components of it, Array or not
            if (outputs) {
                if (outputs instanceof Array) {
                    for (i = 0; i < outputs.length; i += 1) {
                        this.analyzePreSwitch(outputs[i], prethings, area, map);
                    }
                } else {
                    this.analyzePreSwitch(outputs, prethings, area, map);
                }
            }

            return outputs;
        }

        /**
         * Macro case: PreThing instruction. This creates a PreThing from the
         * given reference and adds it to its respective group in PreThings (based
         * on the PreThing's [keyGroupType] variable).
         * 
         * @param {Object} reference   A JSON mapping of some number of PreThings. 
         * @param {Object} PreThings   An associative array of PreThing Arrays, 
         *                             keyed by the allowed group types.
         * @param {Area} area   The Area object to be populated by these PreThings.
         * @param {Map} map   The Map object containing the Area object.
         */
        analyzePreThing(
            reference: any,
            prethings: any,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[]| any {
            var title: string = reference.thing,
                thing: IThing,
                prething: PreThing;

            if (!this.ObjectMaker.hasFunction(title)) {
                console.warn("A non-existent Thing type is referenced. It will be ignored:", title, reference, prethings, area, map);
                return;
            }

            prething = new PreThing(this.ObjectMaker.make(title, reference), reference, this.ObjectMaker);
            thing = prething.thing;

            if (!prething.thing[this.keyGroupType]) {
                console.warn(
                    "A Thing does not contain a " + this.keyGroupType + ". It will be ignored:",
                    prething, "\n", arguments
                    );
                return;
            }

            if (this.groupTypes.indexOf(prething.thing[this.keyGroupType]) === -1) {
                console.warn(
                    "A Thing contains an unknown " + this.keyGroupType + ". It will be ignored:",
                    thing[this.keyGroupType], prething, reference, prethings, area, map
                    );
                return;
            }

            prethings[prething.thing[this.keyGroupType]].push(prething);
            if (!thing.noBoundaryStretch && (<IMapsCreatrArea>area).boundaries) {
                this.stretchAreaBoundaries(prething, <IMapsCreatrArea>area);
            }

            // If a Thing is an entrance, then the location it is an entrance to 
            // must know it and its position. Note that this will have to be changed
            // for Pokemon/Zelda style games.
            if (thing[this.keyEntrance] !== undefined && typeof thing[this.keyEntrance] !== "object") {
                if (typeof map.locations[thing[this.keyEntrance]] !== "undefined") {
                    if (typeof map.locations[thing[this.keyEntrance]].xloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].xloc = prething.left;
                    }
                    if (typeof map.locations[thing[this.keyEntrance]].yloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].yloc = prething.top;
                    }
                    map.locations[thing[this.keyEntrance]].entrance = prething.thing;
                }
            }

            if (reference.collectionName && (<IMapsCreatrArea>area).collections) {
                this.ensureThingCollection(
                    prething,
                    reference.collectionName,
                    reference.collectionKey,
                    <IMapsCreatrArea>area
                    );
            }

            return prething;
        }

        /**
         * Converts the raw area settings in a Map into Area objects.
         * 
         * These areas are typically stored as an Array or Object inside the Map 
         * containing some number of attribute keys (such as "settings") along with
         * an Array under "Creation" that stores some number of commands for 
         * populating that area in MapsHandlr::spawnMap.
         * 
         * @param {Map} map
         */
        private setMapAreas(map: IMapsCreatrMap): void {
            var areasRaw: any = map.areas,
                locationsRaw: any = map.locations,
                // The parsed containers should be the same types as the originals
                areasParsed: any = new areasRaw.constructor(),
                locationsParsed: any = new locationsRaw.constructor(),
                area: IMapsCreatrArea,
                location: IMapsCreatrLocation,
                i: string;

            // Parse all the Area objects (works for both Arrays and Objects)
            for (i in areasRaw) {
                if (areasRaw.hasOwnProperty(i)) {
                    area = this.ObjectMaker.make("Area", areasRaw[i]);
                    areasParsed[i] = area;

                    area.map = map;
                    area.name = i;

                    area.boundaries = {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    };
                }
            }

            // Parse all the Location objects (works for both Arrays and Objects)
            for (i in locationsRaw) {
                if (locationsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locationsRaw[i]);
                    locationsParsed[i] = location;

                    location.entryRaw = locationsRaw[i].entry;
                    location.name = i;
                    location.area = locationsRaw[i].area || 0;

                    if (this.requireEntrance) {
                        if (!this.entrances.hasOwnProperty(location.entryRaw)) {
                            throw new Error("Location " + i + " has unknown entry string: " + location.entryRaw);
                        }
                    }

                    if (this.entrances && location.entryRaw) {
                        location.entry = this.entrances[location.entryRaw];
                    } else if (location.entry && location.entry.constructor === String) {
                        location.entry = this.entrances[String(location.entry)];
                    }
                }
            }

            // Store the output object in the Map, and keep the raw settings for the
            // sake of debugging / user interest
            map.areas = areasParsed;
            map.locations = locationsParsed;
        }

        /**
         * Converts the raw location settings in a Map into Location objects.
         * 
         * These locations typically have very little information, generally just a
         * container Area, x-location, y-location, and spawning function.
         * 
         * @param {Map} map
         */
        private setMapLocations(map: IMapsCreatrMap): void {
            var locsRaw: any = map.locations,
                // The parsed container should be the same type as the original
                locsParsed: any = new locsRaw.constructor(),
                location: IMapsCreatrLocation,
                i: string;

            // Parse all the keys in locasRaw (works for both Arrays and Objects)
            for (i in locsRaw) {
                if (locsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locsRaw[i]);
                    locsParsed[i] = location;

                    // The area should be an object reference, under the Map's areas
                    location.area = map.areas[locsRaw[i].area || 0];
                    if (!locsParsed[i].area) {
                        throw new Error("Location " + i + " references an invalid area:" + locsRaw[i].area);
                    }
                }
            }

            // Store the output object in the Map, and keep the old settings for the
            // sake of debugging / user interest
            map.locations = locsParsed;
        }

        /**
         * "Stretches" an Area's boundaries based on a PreThing. For each direction,
         * if the PreThing has a more extreme version of it (higher top, etc.), the
         * boundary is updated.
         * 
         * @param {PreThing} prething
         * @param {Area} area
         */
        private stretchAreaBoundaries(prething: PreThing, area: IMapsCreatrArea): void {
            var boundaries: any = area.boundaries;

            boundaries.top = Math.min(prething.top, boundaries.top);
            boundaries.right = Math.max(prething.right, boundaries.right);
            boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
            boundaries.left = Math.min(prething.left, boundaries.left);
        }

        /**
         * Adds a Thing to the specified collection in the Map's Area.
         * 
         * @param {PreThing} prething
         * @param {String} collectionName
         * @param {String} collectionKey
         * @param {Area} area
         */
        private ensureThingCollection(prething: PreThing, collectionName: string, collectionKey: string, area: IMapsCreatrArea): void {
            var thing: IThing = prething.thing,
                collection: any = area.collections[collectionName];

            if (!collection) {
                collection = area.collections[collectionName] = {};
            }

            thing.collection = collection;
            collection[collectionKey] = thing;
        }

        /**
         * Creates an Object wrapper around a PreThings Object with versions of
         * each child PreThing[] sorted by xloc and yloc, in increasing and 
         * decreasing order.
         * 
         * @param {Object} prethings
         * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
         *                  "yInc", and "yDec".
         */
        private processPreThingsArrays(prethings: any): any {
            var scope: MapsCreatr = this,
                output: any = {},
                i: string;

            for (i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    var children: PreThing[] = prethings[i],
                        array: any = {
                            "xInc": this.getArraySorted(children, this.sortPreThingsXInc),
                            "xDec": this.getArraySorted(children, this.sortPreThingsXDec),
                            "yInc": this.getArraySorted(children, this.sortPreThingsYInc),
                            "yDec": this.getArraySorted(children, this.sortPreThingsYDec)
                        };

                    // Adding in a "push" lambda allows MapsCreatr to interact with
                    // this using the same .push syntax as Arrays.
                    array.push = (function (prething: PreThing): void {
                        scope.addArraySorted(this.xInc, prething, scope.sortPreThingsXInc);
                        scope.addArraySorted(this.xDec, prething, scope.sortPreThingsXDec);
                        scope.addArraySorted(this.yInc, prething, scope.sortPreThingsYInc);
                        scope.addArraySorted(this.yDec, prething, scope.sortPreThingsYDec);
                    }).bind(array);

                    output[i] = array;
                }
            }

            return output;
        }


        /* Utilities
        */

        /**
         * Creates an Object pre-populated with one key for each of the Strings in
         * the input Array, each pointing to a new Array. 
         * 
         * @param {String[]} arr
         * @return {Object}
         * @remarks This is a rough opposite of Object.keys, which takes in an 
         *          Object and returns an Array of Strings.
         */
        private fromKeys(arr: string[]): any {
            var output: any = {},
                i: number;

            for (i = 0; i < arr.length; i += 1) {
                output[arr[i]] = [];
            }

            return output;
        }

        /**
         * Returns a shallow copy of an Array, in sorted order based on a given
         * sorter Function.
         * 
         * @param {Array} array
         * @param {Function} sorter
         * @
         */
        private getArraySorted(array: any[], sorter: (a: any, b: any) => number): any[] {
            var copy: any[] = array.slice();
            copy.sort(sorter);
            return copy;
        }

        /**
         * Adds an element into an Array using a sorter Function. 
         * 
         * @param {Array} array
         * @param {Mixed} element
         * @param {Function} sorter   A Function that returns the difference between
         *                            two elements (for example, a Numbers sorter
         *                            given (a,b) would return a - b).     
         */
        private addArraySorted(array: any, element: any, sorter: (a: any, b: any) => number): void {
            var lower: number = 0,
                upper: number = array.length,
                index: number;

            while (lower !== upper) {
                index = ((lower + upper) / 2) | 0;

                // Case: element is less than the index
                if (sorter(element, array[index]) < 0) {
                    upper = index;
                } else {
                    // Case: element is higher than the index
                    lower = index + 1;
                }
            }

            if (lower === upper) {
                array.splice(lower, 0, element);
                return;
            }
        }

        /**
         * Sorter for PreThings that results in increasing horizontal order.
         * 
         * @param {PreThing} a
         * @param {PreThing} b
         */
        private sortPreThingsXInc(a: PreThing, b: PreThing): number {
            return a.left === b.left ? a.top - b.top : a.left - b.left;
        }

        /**
         * Sorter for PreThings that results in decreasing horizontal order.
         * 
         * @param {PreThing} a
         * @param {PreThing} b
         */
        private sortPreThingsXDec(a: PreThing, b: PreThing): number {
            return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
        }

        /**
         * Sorter for PreThings that results in increasing vertical order.
         * 
         * @param {PreThing} a
         * @param {PreThing} b
         */
        private sortPreThingsYInc(a: PreThing, b: PreThing): number {
            return a.top === b.top ? a.left - b.left : a.top - b.top;
        }

        /**
         * Sorter for PreThings that results in decreasing vertical order.
         * 
         * @param {PreThing} a
         * @param {PreThing} b
         */
        private sortPreThingsYDec(a: PreThing, b: PreThing): number {
            return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
        }
    }
}
