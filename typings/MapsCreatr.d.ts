/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
declare namespace MapsCreatr {
    /**
     * A raw JSON-friendly description of a map.
     */
    interface IMapRaw {
        /**
         * The name of the map.
         */
        name: string;
        /**
         * Descriptions of locations in the map.
         */
        locations: {
            [i: string]: ILocationRaw;
            [i: number]: ILocationRaw;
        };
        /**
         * Descriptions of areas in the map.
         */
        areas: {
            [i: string]: IAreaRaw;
            [i: number]: IAreaRaw;
        };
    }
    /**
     * A raw JSON-friendly description of a map area.
     */
    interface IAreaRaw {
        /**
         * Commands to place PreThings in the area.
         */
        creation: any[];
    }
    /**
     * A raw JSON-friendly description of a map location.
     */
    interface ILocationRaw {
        /**
         * The entrance method used to enter the location.
         */
        entry?: string;
        /**
         * Which area this location is a part of.
         */
        area?: number | string;
    }
    /**
     * A Map parsed from its raw JSON-friendly description.
     */
    interface IMap {
        /**
         * Whether the Map has had its areas and locations set.
         */
        initialized: boolean;
        /**
         * A listing of areas in the Map, keyed by name.
         */
        areas: {
            [i: string]: IArea;
            [i: number]: IArea;
        };
        /**
         * A listing of locations in the Map, keyed by name.
         */
        locations: any;
    }
    /**
     * An Area parsed from a raw JSON-friendly Map description.
     */
    interface IArea {
        /**
         * The user-friendly label for this Area.
         */
        name: string;
        /**
         * The Map this Area is a part of.
         */
        map: IMap;
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
        boundaries: IBoundaries;
        /**
         * Optional listing of Things to provide to place at the end of the Area.
         */
        afters?: (string | IPreThingSettings)[];
        /**
         * Optional listing of Things to provide to stretch across the Area.
         */
        stretches?: (string | IPreThingSettings)[];
    }
    /**
     * A bounding box around an area.
     */
    interface IBoundaries {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }
    /**
     * A Location parsed from a raw JSON-friendly Map description.
     */
    interface ILocation {
        /**
         * The user-friendly label for this Location.
         */
        name: string;
        /**
         * The Area this Location is a part of.
         */
        area: IArea;
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
     * Parsed PreThings from an Area's creation's command analysis.
     */
    interface IPreThingsRawContainer {
        [i: string]: IPreThing[];
    }
    /**
     * A collection of PreThings sorted in all four directions.
     */
    interface IPreThingsContainer {
        /**
         * PreThings sorted in increasing horizontal order.
         */
        xInc: IPreThing[];
        /**
         * PreThings sorted in decreasing horizontal order.
         */
        xDec: IPreThing[];
        /**
         * PreThings sorted in increasing vertical order.
         */
        yInc: IPreThing[];
        /**
         * PreThings sorted in decreasing vertical order.
         */
        yDec: IPreThing[];
        /**
         * Adds a PreThing to each sorted collection.
         *
         * @param prething   A Prething to add.
         */
        push(prething: IPreThing): void;
    }
    /**
     * A collection of PreThing containers, keyed by group name.
     */
    interface IPreThingsContainers {
        [i: string]: IPreThingsContainer;
    }
    /**
     * Containers that may be passed into analysis Functions.
     */
    type IAnalysisContainer = IPreThingsContainers | IPreThingsRawContainer;
    /**
     * A Function used to enter a Map Location.
     *
     * @param scope   The container scope causing the entrance.
     * @param location   The Location within an Area being entered.
     */
    interface IEntrance {
        (scope: any, location: ILocation): void;
    }
    /**
     * A Function to automate placing other PreThings or macros in an Area.
     *
     * @param reference   The JSON-friendly reference causing the macro.
     * @param prethings   The container of PreThings this is adding to.
     * @param area   The container Area containing the PreThings.
     * @param map   The container Map containing the Area.
     * @param scope   The container scope running the macro.
     * @returns A single PreThing or macro descriptor, or Array thereof.
     */
    interface IMacro {
        (reference: any, prethings: IPreThingsContainers, area: IArea | IAreaRaw, map: IMap | IAreaRaw, scope: any): IPreThing | IPreThing[] | any;
    }
    /**
     * Settings to initialize a new IMapsCreatr.
     */
    interface IMapsCreatrSettings {
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
     * Storage container and lazy loader for GameStartr maps.
     */
    interface IMapsCreatr {
        /**
         * @returns The internal ObjectMakr.
         */
        getObjectMaker(): ObjectMakr.IObjectMakr;
        /**
         * @returns The allowed group types.
         */
        getGroupTypes(): string[];
        /**
         * @returns The allowed macro Functions.
         */
        getMacros(): {
            [i: string]: IMacro;
        };
        /**
         * @returns The scope to give as a last parameter to macros.
         */
        getScope(): any;
        /**
         * @returns Whether Locations must have an entrance Function.
         */
        getRequireEntrance(): boolean;
        /**
         * @returns The Object storing raw maps, keyed by name.
         */
        getMapsRaw(): {
            [i: string]: IMapRaw;
        };
        /**
         * @returns The Object storing maps, keyed by name.
         */
        getMaps(): {
            [i: string]: IMap;
        };
        /**
         * @param name   A key to find the map under.
         * @returns The raw map keyed by the given name.
         */
        getMapRaw(name: string): IMapRaw;
        /**
         * Getter for a map under the maps container. If the map has not yet been
         * initialized that is done here as lazy loading.
         *
         * @param name   A key to find the map under.
         * @returns The parsed map keyed by the given name.
         */
        getMap(name: string): IMap;
        /**
         * Creates and stores a set of new maps based on the key/value pairs in a
         * given Object. These will be stored as maps by their string keys via
         * this.storeMap.
         *
         * @param maps   Raw maps keyed by their storage key.
         */
        storeMaps(maps: {
            [i: string]: IMapRaw;
        }): void;
        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         *
         * @param name   A name under which the map should be stored.
         * @param mapRaw   A raw map to be stored.
         * @returns A Map object created by the internal ObjectMakr using the raw map.
         */
        storeMap(name: string, mapRaw: IMapRaw): IMap;
        /**
         * Given a Area, this processes and returns the PreThings that are to
         * inhabit the Area per its creation instructions.
         *
         * @returns A container with the parsed PreThings.
         */
        getPreThings(area: IArea): IPreThingsContainers;
        /**
         * PreThing switcher: Given a JSON representation of a PreThing, this
         * determines what to do with it. It may be a location setter (to switch the
         * x- and y- location offset), a macro (to repeat some number of actions),
         * or a raw PreThing.
         *
         * @param reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param {Area} area   The Area to be populated.
         * @param {Map} map   The Map containing the Area.
         * @returns The results of analyzePreMacro or analyzePreThing.
         */
        analyzePreSwitch(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        /**
         * PreThing case: Macro instruction. This calls the macro on the same input,
         * captures the output, and recursively repeats the analyzePreSwitch driver
         * function on the output(s).
         *
         * @param {Object} reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param {Area} area   The Area to be populated.
         * @param {Map} map   The Map containing the Area.
         */
        analyzePreMacro(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any[] | any;
        /**
         * Macro case: PreThing instruction. This creates a PreThing from the
         * given reference and adds it to its respective group in PreThings (based
         * on the PreThing's [keyGroupType] variable).
         *
         * @param reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param area   The Area to be populated by these PreThings.
         * @param map   The Map containing the Area.
         */
        analyzePreThing(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
    }
    /**
     * Settings to initialize a new IPreThing.
     */
    interface IPreThingSettings {
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
     * A position holder around an in-game Thing.
     */
    interface IPreThing {
        /**
         * The in-game Thing.
         */
        thing: IThing;
        /**
         * What type the Thing is.
         */
        title: any;
        /**
         * The raw JSON-friendly settings that created this.
         */
        reference: IPreThingSettings;
        /**
         * Whether the Thing has been placed in the container Map.
         */
        spawned: boolean;
        /**
         * The top edge of the Thing's bounding box.
         */
        top: number;
        /**
         * The right edge of the Thing's bounding box.
         */
        right: number;
        /**
         * The bottom edge of the Thing's bounding box.
         */
        bottom: number;
        /**
         * The left edge of the Thing's bounding box.
         */
        left: number;
        /**
         * What part of the in-game container group to move this to, if needed.
         */
        position?: string;
    }
    /**
     * An in-game object created from an IPreThing.
     */
    interface IThing {
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
         * Where this is an entrance to, if anywhere.
         */
        entrance?: string;
        /**
         * Which type of Thing thisis.
         */
        groupType: string;
        /**
         * Whether this should skip stretching the boundaries of an area
         */
        noBoundaryStretch?: boolean;
    }
    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    class MapsCreatr implements IMapsCreatr {
        /**
         * ObjectMakr factory used to create Maps, Areas, Locations, and Things.
         */
        private ObjectMaker;
        /**
         * Raw map objects passed to this.createMap, keyed by name.
         */
        private mapsRaw;
        /**
         * Map objects created by this.createMap, keyed by name.
         */
        private maps;
        /**
         * The possible group types processed PreThings may be placed in.
         */
        private groupTypes;
        /**
         * Macro functions to create PreThings, keyed by String alias.
         */
        private macros;
        /**
         * Allowed entrance Functions, keyed by string alias.
         */
        private entrances;
        /**
         * Whether an entrance is required on all Locations.
         */
        private requireEntrance;
        /**
         * An optional scope to pass to macros as an argument after maps, instead
         * of this MapsCreatr.
         */
        private scope;
        /**
         * Initializes a new instance of the MapsCreatr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IMapsCreatrSettings);
        /**
         * @returns The internal ObjectMakr.
         */
        getObjectMaker(): ObjectMakr.IObjectMakr;
        /**
         * @returns The allowed group types.
         */
        getGroupTypes(): string[];
        /**
         * @returns The allowed macro Functions.
         */
        getMacros(): {
            [i: string]: IMacro;
        };
        /**
         * @returns The scope to give as a last parameter to macros.
         */
        getScope(): any;
        /**
         * @returns Whether Locations must have an entrance Function.
         */
        getRequireEntrance(): boolean;
        /**
         * @returns The Object storing raw maps, keyed by name.
         */
        getMapsRaw(): {
            [i: string]: IMapRaw;
        };
        /**
         * @returns The Object storing maps, keyed by name.
         */
        getMaps(): {
            [i: string]: IMap;
        };
        /**
         * @param name   A key to find the map under.
         * @returns The raw map keyed by the given name.
         */
        getMapRaw(name: string): IMapRaw;
        /**
         * Getter for a map under the maps container. If the map has not yet been
         * initialized that is done here as lazy loading.
         *
         * @param name   A key to find the map under.
         * @returns The parsed map keyed by the given name.
         */
        getMap(name: string): IMap;
        /**
         * Creates and stores a set of new maps based on the key/value pairs in a
         * given Object. These will be stored as maps by their string keys via
         * this.storeMap.
         *
         * @param maps   Raw maps keyed by their storage key.
         */
        storeMaps(maps: {
            [i: string]: IMapRaw;
        }): void;
        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         *
         * @param name   A name under which the map should be stored.
         * @param mapRaw   A raw map to be stored.
         * @returns A Map object created by the internal ObjectMakr using the raw map.
         */
        storeMap(name: string, mapRaw: IMapRaw): IMap;
        /**
         * Given a Area, this processes and returns the PreThings that are to
         * inhabit the Area per its creation instructions.
         *
         * @returns A container with the parsed PreThings.
         */
        getPreThings(area: IArea): IPreThingsContainers;
        /**
         * PreThing switcher: Given a JSON representation of a PreThing, this
         * determines what to do with it. It may be a location setter (to switch the
         * x- and y- location offset), a macro (to repeat some number of actions),
         * or a raw PreThing.
         *
         * @param reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param area   The Area to be populated.
         * @param map   The Map containing the Area.
         * @returns The results of analyzePreMacro or analyzePreThing.
         */
        analyzePreSwitch(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        /**
         * PreThing case: Macro instruction. This calls the macro on the same input,
         * captures the output, and recursively repeats the analyzePreSwitch driver
         * function on the output(s).
         *
         * @param reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param area   The Area to be populated.
         * @param map   The Map containing the Area.
         */
        analyzePreMacro(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any[] | any;
        /**
         * Macro case: PreThing instruction. This creates a PreThing from the
         * given reference and adds it to its respective group in PreThings (based
         * on the PreThing's [keyGroupType] variable).
         *
         * @param reference   A JSON mapping of some number of PreThings.
         * @param preThings   The PreThing containers within the Area.
         * @param area   The Area to be populated by these PreThings.
         * @param map   The Map containing the Area.
         */
        analyzePreThing(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        /**
         * Parses the Areas and Locations in a map to make it ready for use.
         *
         * @param map   A map to be initialized.
         */
        private initializeMap(map);
        /**
         * Converts the raw area settings in a Map into Area objects.
         *
         * @param map   A map whose area settings should be parsed.
         */
        private setMapAreas(map);
        /**
         * Converts the raw location settings in a Map into Location objects.
         *
         * @param {Map} map
         */
        private setMapLocations(map);
        /**
         * "Stretches" an Area's boundaries based on a PreThing. For each direction,
         * if the PreThing has a more extreme version of it (higher top, etc.), the
         * boundary is updated.
         *
         * @param prething   The PreThing stretching the Area's boundaries.
         * @param area   An Area containing the PreThing.
         */
        private stretchAreaBoundaries(prething, area);
        /**
         * Adds a Thing to the specified collection in the Map's Area. If the collection
         * doesn't exist yet, it's created.
         *
         * @param thing   The thing that has specified a collection.
         * @param collectionName   The name of the collection.
         * @param collectionKey   The key under which the collection should store
         *                        the Thing.
         * @param area   The Area containing the collection.
         */
        private ensureThingCollection(thing, collectionName, collectionKey, area);
        /**
         * Creates an Object wrapper around a PreThings Object with versions of each
         * child PreThing[] sorted by xloc and yloc, in increasing and decreasing order.
         *
         * @param prethings   A raw container of PreThings.
         * @returns A PreThing wrapper with the keys "xInc", "xDec", "yInc", and "yDec".
         */
        private processPreThingsArrays(prethings);
        /**
         * Creates an Object pre-populated with one key for each of the Strings in
         * the input Array, each pointing to a new Array.
         *
         * @param array   An Array listing the keys to be made into an Object.
         * @returns An Object with the keys listed in the Array.
         */
        private createObjectFromStringArray(array);
        /**
         * Returns a shallow copy of an Array, in sorted order based on a given
         * sorter Function.
         *
         * @param array   An Array to be sorted.
         * @param sorter   A standard sorter Function.
         * @returns A copy of the original Array, sorted.
         */
        private getArraySorted(array, sorter?);
        /**
         * Adds an element into an Array using a binary search with a sorter Function.
         *
         * @param array   An Array to insert the element into.
         * @param element   An element to insert into the Array.
         * @param sorter   A standard sorter Function.
         */
        private addArraySorted(array, element, sorter);
        /**
         * Sorter for PreThings that results in increasing horizontal order.
         *
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsXInc(a, b);
        /**
         * Sorter for PreThings that results in decreasing horizontal order.
         *
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsXDec(a, b);
        /**
         * Sorter for PreThings that results in increasing vertical order.
         *
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsYInc(a, b);
        /**
         * Sorter for PreThings that results in decreasing vertical order.
         *
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsYDec(a, b);
    }
    /**
     * Basic storage container for a single Thing to be stored in an Area.
     */
    class PreThing implements IPreThing {
        /**
         * The contained Thing to be placed during gameplay.
         */
        thing: IThing;
        /**
         * A copy of the Thing's title.
         */
        title: any;
        /**
         * The creation command used to create the Thing.
         */
        reference: any;
        /**
         * Whether this PreThing has already spawned (initially false).
         */
        spawned: boolean;
        /**
         * The top edge of the Thing's bounding box.
         */
        top: number;
        /**
         * The right edge of the Thing's bounding box.
         */
        right: number;
        /**
         * The bottom edge of the Thing's bounding box.
         */
        bottom: number;
        /**
         * The left edge of the Thing's bounding box.
         */
        left: number;
        /**
         * An optional modifier instruction for group placement, from reference.
         */
        position: string;
        /**
         * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
         * @param {IPreThingSettings} reference   The creation Object instruction
         *                                        used to create the Thing.
         */
        constructor(thing: IThing, reference: IPreThingSettings, ObjectMaker: ObjectMakr.IObjectMakr);
    }
}
declare var module: any;
