/**
 * MapsHandlr.js
 * 
 * Map manipulator and spawner for GameStarter maps that is the front-end
 * counterpart to MapsCreatr.js. PreThing listings are loaded from Maps stored
 * in a MapsCreatr and added or removed from user input. Area properties are
 * given to a MapScreenr when a new Area is loaded.
 * 
 * Examples are not available for MapsHandlr, as the required code would be very
 * substantial. Instead see GameStartr.js and its map manipulation code.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MapsHandlr(settings) {
    "use strict";
    if (!this || this === window) {
        return new MapsCreatr(settings);
    }
    var self = this,
        
        // MapsCreatr container for Maps from which this obtains Thing settings.
        MapsCreator,
        
        // MapScreenr container for attributes copied from Areas.
        MapScreener,
        
        // An Array of strings representing the names of attributes to be copied
        // to the MapScreener during self.setLocation.
        screenAttributes,
        
        // The currently referenced Map from MapsCreator, set by self.setMap.
        mapCurrent, 
        
        // The currently referenced Area, set by self.setLocation.
        areaCurrent,
        
        // The currently referenced Location, set by self.setLocation.
        locationCurrent,
        
        // The name of the currently edited Map, set by self.setMap.
        mapName,
        
        // The current area's listing of PreThings that are to be added in order
        // during self.spawnMap.
        prethings,
        
        // When a prething is to be spawned, this Function should spawn it.
        onSpawn,
        
        // When a prething is to be unspawned, this Function should unspawn it.
        onUnspawn,
        
        // Optionally, an Array of Things to stretch across the map.
        stretches,
        
        // If stretches exists, the Function to call to add one to the map.
        stretchAdd,
        
        // Optionally, an Array of Things to place at the end of the map.
        afters,
        
        // If afters exists, the Function to call to add one to the map.
        afterAdd,
        
        // Directional equivalents for converting from directions to keys
        directionKeys = {
            "xInc": "left",
            "xDec": "right",
            "yInc": "top",
            "yDec": "bottom"
        },
        
        // Opposite directions for when finding descending order Arrays
        directionOpposites = {
            "xInc": "xDec",
            "xDec": "xInc",
            "yInc": "yDec",
            "yDec": "yInc"
        };
    
    /**
     * Resets the MapsHandlr.
     * 
     * @constructor
     * @param {MapsCreatr} MapsCreator   A MapsCreatr used to store and lazily
     *                                   initialize Maps.
     * @param {MapScreenr} MapScreener   A MapScreenr used to store attributes
     *                                   of areas.
     * @param {Function} [onSpawn]   A callback for when a PreThing should be 
     *                             spawned.
     * @param {Function} [onUnspawn]   A callack for when a PreThing should be
     *                                 un-spawned.
     * @param {String[]} [screenAttributes]   The property names to copy from 
     *                                        Areas to MapScreener (by default,
     *                                        none).
     * @param {Function} [afterAdd]   A callback for when an Area provides an
     *                                "afters" command to add PreThings to the
     *                                end of an Area.
     * @param {Function} [stretchAdd]   A callback for when an Area provides a
     *                                  "stretch" command, to add PreThings
     *                                  to stretch across an Area.
     */
    self.reset = function (settings) {
        // Maps themselves should have been created in the MapsCreator object
        if (!settings.MapsCreator) {
            throw new Error("No MapsCreator provided to MapsHandlr.");
        }
        MapsCreator = settings.MapsCreator;
        
        // Map/Area attributes will need to be stored in a MapScreenr object
        if (!settings.MapScreener) {
            throw new Error("No MapScreener provided to MapsHandlr.");
        }
        MapScreener = settings.MapScreener;

        onSpawn = settings.onSpawn;
        onUnspawn = settings.onUnspawn;
        
        screenAttributes = settings.screenAttributes || [];
        
        stretchAdd = settings.stretchAdd;
        afterAdd = settings.afterAdd;
    };
    
    
    /* Simple gets
    */
    
    /**
     * @return {MapsCreatr}   The internal MapsCreator.
     */
    self.getMapsCreator = function () {
        return MapsCreator;
    };
    
    /**
     * @return {MapScreenr}   The internal MapScreener.
     */
    self.getMapScreener = function () {
        return MapScreener;
    };
    
    /**
     * @return {String[]}   The attribute names to be copied to MapScreener.
     */
    self.getScreenAttributes = function () {
        return screenAttributes;
    };
    
    /**
     * @return {String}   The key by which the current Map is indexed.
     */
    self.getMapName = function () {
        return mapName;
    };
    
    /** 
     * Gets the map listed under the given name. If no name is provided, the
     * mapCurrent is returned instead.
     * 
     * @param {Mixed} [name]   An optional key to find the map under. This will
     *                         typically be a String.
     * @return {Map}
     */
    self.getMap = function (name) {
        if (typeof name !== "undefined") {
            return MapsCreator.getMap(name);
        } else {
            return mapCurrent;
        }
    };
    
    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     * 
     * @return {Object<Map>}   A listing of maps, keyed by their names.
     */
    self.getMaps = function () {
        return MapsCreator.getMaps();
    };
    
    /**
     * @return {Area} The current Area.
     */
    self.getArea = function () {
        return areaCurrent;
    };
    
    /**
     * @reutrn {Location} A Location within the current Map.
     */
    self.getLocation = function (location) {
        return areaCurrent.map.locations[location];
    }
    
    /**
     * Simple getter function for the internal prethings object. This will be
     * null before the first self.setMap.
     * 
     * return {Object} A listing of the current area's Prethings.
     */
    self.getPreThings = function () {
        return prethings;
    }
    
    
    /* Map / location setting
    */
    
    /**
     * Sets the currently manipulated Map in the handler to be the one under a
     * given name. Note that this will do very little unless a location is 
     * provided.
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @param {Mixed} [location]   An optional key for a location to immediately
     *                              start the map in (if not provided, ignored). 
     *                          
     */
    self.setMap = function (name, location) {
        // Get the newly current map from self.getMap normally
        mapCurrent = self.getMap(name);
        if (!mapCurrent) {
            throw new Error("Unknown Map in setMap: '" + name + "'.");
        }
        
        mapName = name;
        
        // Most of the work is done by setLocation (by default, the map's first)
        if (arguments.length > 1) {
            self.setLocation(location);
        }
        
        return mapCurrent;
    };
    
    /**
     * Goes to a particular location in the given map. Area attributes are 
     * copied to the MapScreener, PreThings are loaded, and stretches and afters
     * are checked.
     * 
     * @param {Mixed} name   The key of the Location to start in.
     */
    self.setLocation = function (name) {
        var location, attribute, len, i;

        // Query the location from the current map and ensure it exists
        location = mapCurrent.locations[name];
        if (!location) {
            throw new Error("Unknown location in setLocation: '" + name + "'.");
        }
        
        // Since the location is valid, mark it as current (with its area)
        locationCurrent = location;
        areaCurrent = location.area;
        
        // Copy all the settings from that area into the MapScreenr container
        for (i = 0, len = screenAttributes.length; i < len; i += 1) {
            attribute = screenAttributes[i];
            MapScreener[attribute] = areaCurrent[attribute];
        }
        
        // Reset the prethings object, enabling it to be used as a fresh start
        // for the new Area/Location placements
        prethings = MapsCreator.getPreThings(location.area);
        
        // Optional: set stretch commands
        if (areaCurrent.stretches) {
            setStretches(areaCurrent.stretches);
        } else {
            stretches = undefined;
        }
        
        // Optional: set after commands
        if (areaCurrent.afters) {
            setAfters(areaCurrent.afters);
        } else {
            afters = undefined;
        }
    };
    
    /**
     * Applies the stretchAdd Function to each given "stretch" command and 
     * stores the result in stretches. If none are provided, [] is given.
     * 
     * @param {Object[]} [stretchesRaw]
     */
    function setStretches(stretchesRaw) {
        if (stretchesRaw) {
            stretches = stretchesRaw.map(stretchAdd);
        } else {
            stretches = [];
        }
    }
    
    /**
     * Applies the afterAdd Function to each given "after" command and stores
     * the result in afters. If none are provided, [] is given.
     * 
     * @param {Object[]} [aftersRaw]
     */
    function setAfters(aftersRaw) {
        if (aftersRaw) {
            afters = aftersRaw.map(afterAdd);
        } else {
            afters = [];
        }
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
    self.spawnMap = function (direction, top, right, bottom, left) {
        applySpawnAction(onSpawn, true, direction, top, right, bottom, left);
    };
    
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
    self.unspawnMap = function (direction, top, right, bottom, left) {
        applySpawnAction(onUnspawn, false, direction, top, right, bottom, left);
    };
    
    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is used both to spawn
     * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
     * status is used as a filter: all PreThings that already have the status
     * (generally true or false as spawned or unspawned, respectively) will have
     * the callback called on them.
     *
     * @param {Function} [callback]   The callback to be run whenever a 
     *                                matching PreThing is found. If falsy, this
     *                                is ignored.
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
    function applySpawnAction(callback, status, direction, top, right, bottom, left) {
        var name, group, mid, start, end, i, prething;
        
        // For each group of PreThings currently able to spawn...
        for (name in prethings) {
            if (!prethings.hasOwnProperty(name)) {
                continue;
            }
            
            // Don't bother trying to spawn the group if it has no members
            group = prethings[name][direction];
            if (group.length === 0) {
                continue;
            }
            
            // Find the start and end points within the PreThings Array
            // Ex. if direction="xInc", go from .left >= left to .left <= right
            mid = (group.length / 2) | 0;
            start = findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
            end = findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);
            
            // Loop through all the directionally valid PreThings, spawning if 
            // they're within the bounding box
            for (i = start; i <= end; i += 1) {
                prething = group[i];
                
                // For example: if status is true (spawned), don't spawn again
                if (prething.spawned !== status) {
                    prething.spawned = status;
                    if (callback) {
                        callback(prething);
                    }
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
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    function findPreThingsSpawnStart(direction, group, i, top, right, bottom, left) {
        var directionKey = directionKeys[direction],
            directionEnd = getDirectionEnd(directionKey, top, right, bottom, left),
            i;
        
        for (i = 0; i < group.length; i += 1) {
            if (group[i][directionKey] >= directionEnd) {
                return i;
            }
        }
        
        return i;
    }
    
    // /**
     // * Finds the index from which PreThings should start having an action 
     // * applied to them in applySpawnAction. 
     // * 
     // * @param {String} direction   The direction by which to order PreThings: 
     // *                             "xInc", "xDec", "yInc", or "yDec".
     // * @param {Number} top   The upper-most bound to apply within.
     // * @param {Number} right   The right-most bound to apply within.
     // * @param {Number} bottom    The bottom-most bound to apply within.
     // * @param {Number} left    The left-most bound to apply within.
     // * @return {Number}
     // */
    // function findPreThingsSpawnStart(direction, group, i, top, right, bottom, left) {
        // var directionKey = directionKeys[direction],
            // directionEnd = getDirectionEnd(directionKey, top, right, bottom, left),
            // lower = 0,
            // upper = group.length - 1,
            // index;
        
        // while (lower !== upper) {
            // index = ((lower + upper) / 2) | 0;
            
            // if (group[index][directionKey] > directionEnd) {
                // upper = index;
            // } else {
                // lower = index + 1;
            // }
        // }
        
        // return lower;
    // }
    
    /**
     * Finds the index from which PreThings should stop having an action 
     * applied to them in applySpawnAction. This is less efficient than the 
     * unused version below, but is more reliable for slightly unsorted groups.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    function findPreThingsSpawnEnd(direction, group, i, top, right, bottom, left) {
        var directionKey = directionKeys[direction],
            directionKeyOpposite = directionKeys[directionOpposites[direction]],
            directionEnd = getDirectionEnd(directionKeyOpposite, top, right, bottom, left),
            i;
        
        for (i = group.length - 1; i >= 0; i -= 1) {
            if (group[i][directionKey] <= directionEnd) {
                return i;
            }
        }
        
        return i;
    }
    
    // /**
     // * Finds the index from which PreThings should stop having an action 
     // * applied to them in applySpawnAction. 
     // * 
     // * @param {String} direction   The direction by which to order PreThings: 
     // *                             "xInc", "xDec", "yInc", or "yDec".
     // * @param {Number} top   The upper-most bound to apply within.
     // * @param {Number} right   The right-most bound to apply within.
     // * @param {Number} bottom    The bottom-most bound to apply within.
     // * @param {Number} left    The left-most bound to apply within.
     // * @return {Number}
     // */
    // function findPreThingsSpawnEnd(direction, group, i, top, right, bottom, left) {
        // var directionKey = directionKeys[direction],
            // directionKeyOpposite = directionKeys[directionOpposites[direction]],
            // directionEnd = getDirectionEnd(directionKeyOpposite, top, right, bottom, left),
            // lower = 0,
            // upper = group.length - 1,
            // index;
        
        // while (lower !== upper) {
            // index = ((lower + upper) / 2) | 0;
            
            // if (group[index][directionKey] > directionEnd) {
                // upper = index;
            // } else {
                // lower = index + 1;
            // }
        // }
        
        // return lower;
    // }
    
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
    function getDirectionEnd(directionKey, top, right, bottom, left) {
        switch (directionKey) {
            case "top": 
                return top;
            case "right":
                return right;
            case "bottom":
                return bottom;
            case "left":
                return left;
        }
    }
    
    
    self.reset(settings || {});
}