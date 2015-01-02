/**
 * MapsCreatr.js
 * 
 * Storage container and lazy loader for GameStarter maps that is the back-end
 * counterpart to MapsHandlr.js. Maps are created with their custom Location and
 * Area members, which are initialized the first time the map is retrieved. 
 * Areas contain a "creation" Object[] detailing the instructions on creating 
 * that Area's "PreThing" objects, which store Things along with basic position
 * information. 
 * 
 * In short, a Map contains a set of Areas, each of which knows its size and the
 * steps to create its contents. Each Map also contains a set of Locations, 
 * which are entry points into one Area each. 
 * 
 * See Schema.json for the minimum recommended format for Maps, Locations, 
 * Areas, and creation commands.
 *
 * @example
 * // Creating and using a MapsCreatr to store a very simple Map.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "thing": "SomeThing", "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap");
 * 
 * // Map { locations: Array[1], areas: Array[1], areasRaw: Array[1], ... }
 * console.log(map);
 * 
 * // Area { creation: Array[1], map: Map, name: "0", boundaries: Object, ... }
 * console.log(map.areas[0]);
 * 
 * // Object { thing: "SomeThing", x: 3, y: 4 }
 * console.log(map.areas[0].creation[0]);
 * 
 * @example
 * // Creating and using a MapsCreatr to store a simple Map with a macro and 
 * // look at what will be created when it's used.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "macros": {
 *             "Fill": function (reference) {
 *                 var output = [],
 *                     thing = reference.thing,
 *                     between = reference.between || 10,
 *                     times = reference.times || 1,
 *                     x = reference.x || 0,
 *                     y = reference.y || 0;
 *                 
 *                 while (times > 0) {
 *                     output.push({
 *                         "thing": reference.thing,
 *                         "x": x,
 *                         "y": y
 *                     });
 *                     x += between;
 *                     times -= 1;
 *                 }
 *                 
 *                 return output;
 *             }
 *         },
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "macro": "Fill", "thing": "SomeThing", "times": 7, "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap"),
 *     prethings = MapsCreator.getPreThings(map.areas[0]);
 * 
 * // Object {Thing: Object}
 * console.log(prethings);
 * 
 * // Object { xInc: Array[7], xDec: Array[7], yInc: Array[7], yDec: ... }
 * console.log(prethings.Thing);
 * 
 * // [PreThing, PreThing, PreThing, PreThing, PreThing, PreThing, PreThing]
 * console.log(prethings.Thing.xInc);
 * 
 * // PreThing { thing: SomeThing, title: "SomeThing", reference: Object, ... }
 * console.log(prethings.Thing.xInc[0]);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MapsCreatr(settings) {
    "use strict";
    if (!this || this === window) {
        return new MapsCreatr(settings);
    }
    var self = this,

        // ObjectMakr factory used to create Maps, Areas, Locations, and Things.
        ObjectMaker,

        // Associative array storing Map objects created by self.createMap.
        maps,

        // An Array of Strings that represents all the possible group types.
        // processed PreThings may be placed in
        groupTypes,

        // Associative array storing macro functions, keyed by string alias.
        macros,

        // What key to check for group type under a Thing.
        keyGroupType,

        // What key to check for if a PreThing's Thing is a Location's entrance.
        keyEntrance,

        // Associative array storing entrance functions, keyed by string alias.
        entrances,

        // Whether an entrance is required on all Locations.
        requireEntrance,

        // An optional scope to pass to macros as an argument after maps.
        scope,

        // Scratch xloc and yloc to be used for location offsets with PreThings.
        xloc,
        yloc;

    /**
     * Resets the MapsCreatr.
     * 
     * @constructor
     * @param {ObjectMakr} ObjectMaker   An ObectMaker used to create Things.
     *                                   Note that it must store full properties
     *                                   of Things, for quick size lookups.
     * @param {String[]} groupTypes   The names of groups Things may be in.
     * @param {String} [keyGroupType]   The key for Things to determine what
     *                                  group they belong to (by default, 
     *                                  "groupType").
     * @param {String} [keyEntrance]   The key for Things to determine what, if
     *                                 any, Location they open up to (by 
     *                                 default, "entrance").
     * @param {Object} [macros]   An optional listing of macros that can be used
     *                            to automate common operations.
     * @param {Mixed} [scope]   A scope to give as a last parameter to macro
     *                          Functions (by default, self).
     * @param {Object} [entrances]   Optional entrance Functions to use as the
     *                               openings in Locations.
     * @param {Boolean} [requireEntrance]   Whether Locations must have an
     *                                      entrance Function defined by "entry"
     *                                      (by default, false).
     * @param {Object} [maps]   Any maps that should immediately be stored via
     *                          a storeMaps call, keyed by name.
     */
    self.reset = function (settings) {
        // Maps and Things are created using an ObjectMaker factory
        if (!settings.ObjectMaker) {
            throw new Error("No ObjectMaker provided to MapsCreatr.");
        }
        ObjectMaker = settings.ObjectMaker;

        if (typeof ObjectMaker.getFullProperties() === "undefined") {
            throw new Error("MapsCreatr's ObjectMaker must store full properties.");
        }

        // At least one group type name should be defined for PreThing output
        if (!settings.groupTypes) {
            throw new Error("No groupTypes provided to MapsCreatr.");
        }
        groupTypes = settings.groupTypes;

        keyGroupType = settings.keyGroupType || "groupType";
        keyEntrance = settings.keyEntrance || "entrance";

        macros = settings.macros || {};
        scope = settings.scope || self;

        entrances = settings.entrances;
        requireEntrance = settings.requireEntrance;

        maps = {};
        if (settings.maps) {
            self.storeMaps(settings.maps);
        }
    };


    /* Simple gets
    */

    /**
     * @return {ObjectMakr}   The internal ObjectMakr.
     */
    self.getObjectMaker = function () {
        return ObjectMaker;
    };

    /**
     * @return {Object}   The Object storing maps, keyed by name.
     */
    self.getMaps = function () {
        return maps;
    };

    /**
     * Simple getter for a map under the maps container. If the map has not been
     * initialized (had its areas and locations set), that is done here as lazy
     * loading.
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @return {Map}
     */
    self.getMap = function (name) {
        var map = maps[name];
        if (!map) {
            throw new Error("No map found under: " + name);
        }

        if (!map.initialized) {
            // Set the one-to-many Map->Area relationships within the Map
            setMapAreas(map);

            // Set the one-to-many Area->Location relationships within the Map
            setMapLocations(map);

            map.initialized = true;
        }

        return map;
    };

    /**
     * Creates and stores a set of new maps based on the key/value pairs in a 
     * given Object. These will be stored as maps by their string keys via 
     * self.storeMap.
     * 
     * @param {Object} settings   An Object containing a set of key/map pairs to
     *                            store as maps.
     * @return {Object}   The newly created maps object.
     */
    self.storeMaps = function (maps) {
        for (var i in maps) {
            if (maps.hasOwnProperty(i)) {
                self.storeMap(i, maps[i]);
            }
        }
    };

    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object. The actual loading of
     * Areas and Locations is deferred to self.getMap.
     * 
     * @param {Mixed} name   A name under which the map should be stored, 
     *                       commonly a String or Array.
     * @param {Object} settings   An Object containing arguments to be sent to
     *                            the ObjectMakr being used as a maps factory.
     * @return {Map}   The newly created map.
     */
    self.storeMap = function (name, settings) {
        var map = ObjectMaker.make("Map", settings);

        if (!name) {
            throw new Error("Maps cannot be created with no name.");
        }

        if (!map.areas) {
            throw new Error("Maps cannot be used with no areas: " + name);
        }

        if (!map.locations) {
            throw new Error("Maps cannot be used with no locations: " + name);
        }

        maps[name] = map;
        return map;
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
    function setMapAreas(map) {
        var areasRaw = map.areas,
            locationsRaw = map.locations,
            // The parsed containers should be the same types as the originals
            areasParsed = new areasRaw.constructor(),
            locationsParsed = new locationsRaw.constructor(),
            obj, i;

        // Parse all the Area objects (works for both Arrays and Objects)
        for (i in areasRaw) {
            if (areasRaw.hasOwnProperty(i)) {
                obj = areasParsed[i] = ObjectMaker.make("Area", areasRaw[i]);
                obj.map = map;
                obj.name = i;
            }
            obj.boundaries = {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
            };
        }

        // Parse all the Location objects (works for both Arrays and Objects)
        for (i in locationsRaw) {
            if (locationsRaw.hasOwnProperty(i)) {
                obj = locationsParsed[i] = ObjectMaker.make("Location", locationsRaw[i]);

                obj.entryRaw = obj.entry;
                obj.name = i;
                obj.area = locationsRaw[i].area || 0;

                if (requireEntrance) {
                    if (!entrances.hasOwnProperty(obj.entry)) {
                        throw new Error("Location " + i + " has unknown entry string: " + obj.entry);
                    }
                }

                if (entrances && obj.entry) {
                    obj.entry = entrances[obj.entry];
                }
            }
        }

        // Store the output object in the Map, and keep the raw settings for the
        // sake of debugging / user interest
        map.areas = areasParsed;
        map.areasRaw = areasRaw;
        map.locations = locationsParsed;
        map.locationsRaw = locationsRaw;
    }

    /**
     * Converts the raw location settings in a Map into Location objects.
     * 
     * These locations typically have very little information, generally just a
     * container Area, x-location, y-location, and spawning function.
     * 
     * @param {Map} map
     */
    function setMapLocations(map) {
        var locsRaw = map.locations,
            // The parsed container should be the same type as the original
            locsParsed = new locsRaw.constructor(),
            location, i;

        // Parse all the keys in locasRaw (works for both Arrays and Objects)
        for (i in locsRaw) {
            if (locsRaw.hasOwnProperty(i)) {
                locsParsed[i] = ObjectMaker.make("Location", locsRaw[i]);

                // The area should be an object reference, under the Map's areas
                locsParsed[i].area = map.areas[locsParsed[i].area || 0];
                if (!locsParsed[i].area) {
                    throw new Error(
                        "Location " + i
                        + " references an invalid area: "
                        + locsRaw[i].area
                    );
                }
            }
        }

        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.locations = locsParsed;
        map.locationsRaw = locsRaw;
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
    self.getPreThings = function (area) {
        var map = area.map,
            creation = area.creation,
            prethings = fromKeys(groupTypes),
            i, len;

        xloc = 0;
        yloc = 0;

        area.collections = {};

        for (i = 0, len = creation.length; i < len; i += 1) {
            self.analyzePreSwitch(creation[i], prethings, area, map);
        }

        return processPreThingsArrays(prethings);
    };

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
    self.analyzePreSwitch = function (reference, prethings, area, map) {
        // Case: macro (unless it's undefined)
        if (reference.macro) {
            self.analyzePreMacro(reference, prethings, area, map);
        }
            // Case: default (a regular PreThing)
        else {
            self.analyzePreThing(reference, prethings, area, map);
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
    self.analyzePreMacro = function (reference, prethings, area, map) {
        var macro = macros[reference.macro],
            outputs, len, i;

        if (!macro) {
            console.warn(
                "A non-existent macro is referenced. It will be ignored:",
                macro, reference, prethings, area, map
            );
            return;
        }

        // Avoid modifying the original macro by creating a new object in its
        // place, while submissively proliferating any default macro settings
        outputs = macro(reference, prethings, area, map, scope);

        // If there is any output, recurse on all components of it, Array or not
        if (outputs) {
            if (outputs instanceof Array) {
                for (i = 0, len = outputs.length; i < len; i += 1) {
                    self.analyzePreSwitch(outputs[i], prethings, area, map);
                }
            } else {
                self.analyzePreSwitch(outputs, prethings, area, map);
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
    self.analyzePreThing = function (reference, prethings, area, map, scope) {
        var thing = reference.thing,
            prething;

        if (!ObjectMaker.hasFunction(thing)) {
            console.warn("A non-existent Thing type is referenced. It will be "
                    + "ignored: " + thing, reference, prethings, area, map);
            return;
        }

        prething = new PreThing(ObjectMaker.make(thing, reference), reference);
        thing = prething.thing;

        if (!prething.thing[keyGroupType]) {
            console.warn("A Thing does not contain a " + keyGroupType + ". "
                    + "It will be ignored: ",
                    prething, "\n", arguments);
            return;
        }

        if (groupTypes.indexOf(prething.thing[keyGroupType]) === -1) {
            console.warn("A Thing contains an unknown " + keyGroupType
                    + ". It will be ignored: " + thing[keyGroupType],
                    prething, reference, prethings, area, map);
            return;
        }

        prethings[prething.thing[keyGroupType]].push(prething);
        if (!thing.noBoundaryStretch && area.boundaries) {
            stretchAreaBoundaries(prething, area);
        }

        // If a Thing is an entrance, then the location it is an entrance to 
        // must know it and its position. Note that this will have to be changed
        // for Pokemon/Zelda style games.
        if (thing[keyEntrance] !== undefined && typeof thing[keyEntrance] !== "object") {
            if (typeof map.locations[thing[keyEntrance]].xloc === "undefined") {
                map.locations[thing[keyEntrance]].xloc = prething.left;
            }
            map.locations[thing[keyEntrance]].entrance = prething.thing;
        }

        if (reference.collectionName && area.collections) {
            ensureThingCollection(
                prething,
                reference.collectionName,
                reference.collectionKey,
                area
            );
        }

        return prething;
    }

    /**
     * "Stretches" an Area's boundaries based on a PreThing. For each direction,
     * if the PreThing has a more extreme version of it (higher top, etc.), the
     * boundary is updated.
     * 
     * @param {PreThing} prething
     * @param {Area} area
     */
    function stretchAreaBoundaries(prething, area) {
        var boundaries = area.boundaries;

        boundaries.top = Math.min(prething.top, boundaries.top);
        boundaries.right = Math.max(prething.right, boundaries.right);
        boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
        boundaries.left = Math.min(prething.left, boundaries.left);
    }

    /**
     * Basic storage container for a single Thing to be stored in an Area's
     * PreThings member. A PreThing stores an actual Thing along with basic
     * sizing and positioning information, so that a MapsHandler may accurately
     * spawn or unspawn it as needed.
     * 
     * @constructor
     * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
     * @param {Object} reference   The creation Object used to generate the
     *                             Thing. It stores the following arguments.
     * @param {Number} [x/left]   The horizontal starting location of the Thing
     *                            (by default, 0).
     * @param {Number} [y/top]   The vertical starting location of the Thing
     *                            (by default, 0).
     * @param {Number} [width]   How wide the Thing is (by default, the Thing's
     *                           prototype's width from ObjectMaker).
     * @param {Number} [height]   How tall the Thing is (by default, the Thing's
     *                            prototype's height from ObjectMaker).    
     * @param {String} [position]   An immediate modifier instruction for where
     *                              the Thing should be in its GroupHoldr group
     *                              (either "beginning" or "end" if given).
     */
    function PreThing(thing, reference) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;

        this.left = (reference.x || reference.left) || 0;
        this.top = (reference.y || reference.top) || 0;

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

    /**
     * Adds a Thing to the specified collection in the Map's Area.
     * 
     * @param {PreThing} prething
     * @param {String} collectionName
     */
    function ensureThingCollection(prething, collectionName, collectionKey, area) {
        var thing = prething.thing,
            collection = area.collections[collectionName];

        if (!collection) {
            collection = area.collections[collectionName] = {};
        }

        thing.collection = collection;
        collection[collectionKey] = thing;
    }

    /**
     * Creates an Object wrapper around a PreThings Object with versions of
     * each child PreThing[]sorted by xloc and yloc, in increasing and 
     * decreasing order.
     * 
     * @param {Object} prethings
     * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
     *                  "yInc", and "yDec".
     */
    function processPreThingsArrays(prethings) {
        var output = {},
            children, i;

        for (i in prethings) {
            if (prethings.hasOwnProperty(i)) {
                children = prethings[i];
                output[i] = {
                    "xInc": getArraySorted(children, sortPreThingsXInc),
                    "xDec": getArraySorted(children, sortPreThingsXDec),
                    "yInc": getArraySorted(children, sortPreThingsYInc),
                    "yDec": getArraySorted(children, sortPreThingsYDec)
                };

                // Adding in a "push" lambda allows MapsCreatr to interact with
                // this using the same .push syntax as Arrays.
                output[i].push = (function (prethings, prething) {
                    addArraySorted(prethings["xInc"], prething, sortPreThingsXInc);
                    addArraySorted(prethings["xDec"], prething, sortPreThingsXDec);
                    addArraySorted(prethings["yInc"], prething, sortPreThingsYInc);
                    addArraySorted(prethings["yDec"], prething, sortPreThingsYDec);
                }).bind(undefined, output[i]);
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
    function fromKeys(arr) {
        var output = {},
            i;
        for (i = arr.length - 1; i >= 0; i -= 1) {
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
    function getArraySorted(array, sorter) {
        array = array.slice();
        array.sort(sorter);
        return array;
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
    function addArraySorted(array, element, sorter) {
        var lower = 0,
            upper = array.length,
            index;

        while (lower !== upper) {
            index = ((lower + upper) / 2) | 0;

            // Case: element is less than the index
            if (sorter(element, array[index]) < 0) {
                upper = index;
            }
                // Case: element is higher than the index
            else {
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
    function sortPreThingsXInc(a, b) {
        return a.left === b.left ? a.top - b.top : a.left - b.left;
    }

    /**
     * Sorter for PreThings that results in decreasing horizontal order.
     * 
     * @param {PreThing} a
     * @param {PreThing} b
     */
    function sortPreThingsXDec(a, b) {
        return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
    }

    /**
     * Sorter for PreThings that results in increasing vertical order.
     * 
     * @param {PreThing} a
     * @param {PreThing} b
     */
    function sortPreThingsYInc(a, b) {
        return a.top === b.top ? a.left - b.left : a.top - b.top;
    }

    /**
     * Sorter for PreThings that results in decreasing vertical order.
     * 
     * @param {PreThing} a
     * @param {PreThing} b
     */
    function sortPreThingsYDec(a, b) {
        return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
    }


    self.reset(settings || {});
}