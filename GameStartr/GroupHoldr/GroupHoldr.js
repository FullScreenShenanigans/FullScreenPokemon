/**
 * GroupHoldr.js
 * 
 * A general utility to keep Arrays and/or Objects by key names within a
 * container so they can be referenced automatically by those keys. Automation
 * is made easier by more abstraction, such as by automatically generated add,
 * remove, etc. methods.
 * 
 * @example
 * // Creating and using a GroupHoldr to store populations of locations.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Country", "State"],
 *     "groupTypes": "Object"
 * });
 * 
 * GroupHolder.addCountry("United States", 316130000);
 * GroupHolder.addCountry("Canada", 35160000);
 * GroupHolder.addState("New York", 19650000);
 * 
 * console.log(GroupHolder.getCountry("United States")); // 316,130,000
 * 
 * @example
 * // Creating and using a GroupHoldr to hold people by their age group.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Child", "Adult"],
 *     "groupTypes": "Array"
 * });
 * 
 * GroupHolder.addChild("Alex");
 * GroupHolder.addChild("Bob");
 * GroupHolder.getGroup("Adult").push("Carol");
 * GroupHolder.getGroups().Adult.push("Devin");
 * 
 * console.log(GroupHolder.getAdultGroup()); // ["Carol", "Devin"]
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function GroupHoldr(settings) {
    "use strict";
    if (!this || this === window) {
        return new GroupHoldr(settings);
    }
    var self = this,
        
        // Associative array of strings to groups, where groups are each some
        // sort of array (either typical or associative).
        groups,
        
        // Associative array containing "add", "del", "get", and "set" keys to
        // those appropriate functions (e.x. functions.add.MyGroup is the same
        // as self.addMyGroup).
        functions,
        
        // Array of string names, each of which is tied to a group.
        groupNames,
        
        // Associative array keying each group to the function it uses: Array
        // for regular arrays, and Object for associative arrays.
        groupTypes,
        
        // Associative array keying each group to the string name of the
        // function it uses: "Array" for regular arrays, and "Object" for
        // associative arrays.
        groupTypeNames;
    
    /**
     * Resets the GroupHoldr.
     * 
     * @constructor
     * @param {String[]} groupNames   An Array of Strings to be used for the 
     *                                group names.
     * @param {Mixed} groupTypes   The types of groups. This can either be a 
     *                             String ("Array" or "Object") to set each one,
     *                             or an Object mapping each groupName to a
     *                             different one.
     */
    self.reset = function (settings) {
        if (typeof settings.groupNames === "undefined") {
            throw new Error("No groupNames Array provided to GroupHoldr.");
        }
        if (settings.groupNames.constructor !== Array) {
            throw new Error("A GroupHoldr's groupNames must be an Array.");
        }
        if (typeof settings.groupTypes === "undefined") {
            throw new Error("No groupTypes provided to GroupHoldr.");
        }
        
        // These functions containers are filled in setGroupNames 
        functions = {
            "setGroup": {},
            "getGroup": {},
            "set": {},
            "get": {},
            "add": {},
            "del": {}
        };
        setGroupNames(settings.groupNames, settings.groupTypes);
    };
    
    
    /* Simple gets
    */
    
    /**
     * @return {Object} The Object with Object<Function>s for each action
     *                  available on groups.
     */
    self.getFunctions = function () {
        return functions;
    };
    
    /**
     * @return {Object} The Object storing each of the internal groups.
     */
    self.getGroups = function () {
        return groups;
    };
    
    /**
     * @param {String} name
     * @return {Object} The group of the given name.
     */
    self.getGroup = function (name) {
        return groups[name];
    };
    
    /**
     * @return {String[]} An Array containing each of the group names.
     */
    self.getGroupNames = function () {
        return groupNames;
    };
    
    
    /* Core logic
    */
    
    /** 
     * Meaty function to reset, given an array of names an object of types
     * Any pre-existing functions are cleared, and new ones are added as
     * member objects and to {functions}.
     * 
     * @param {String[]} names   An array of names of groupings to be made
     * @param {Object} types   An associative array of the function types of
     *                         the names given in names. This may also be taken
     *                         in as a string, to be converted to an Object.
     */
    function setGroupNames(names, types) {
        if (!(names instanceof Array)) {
            throw new Error("groupNames is not an Array");
        }
        
        // If there already were group names, clear them
        if (groupNames) {
            clearFunctions();
        }
        
        // Reset the group types and type names, to be filled next
        groupTypes = {}
        groupTypeNames = {};
        
        // Set the new groupNames, as ucFirst
        groupNames = names.map(ucFirst);
        groupNames.sort();
        
        // If groupTypes is an object, set custom group types for everything
        if (typeof(types) == "object") {
            groupNames.forEach(function (name) {
                groupTypes[name] = getTypeFunction(types[name]);
                groupTypeNames[name] = getTypeName(types[name]);
            });
        }
        // Otherwise assume everything uses the same one, such as from a String
        else {
            var typeFunc = getTypeFunction(types),
                typeName = getTypeName(types);
            groupNames.forEach(function (name) {
                groupTypes[name] = typeFunc;
                groupTypeNames[name] = typeName;
            });
        }
        
        // Create the containers, and set the modifying functions
        setGroups();
        setFunctions();
    }
    
    /**
     * Removes any pre-existing "set", "get", etc. functions.
     */
    function clearFunctions() {
        groupNames.forEach(function (name) {
            // Delete member variable functions
            delete self["set" + name + "Group"];
            delete self["get" + name + "Group"];
            delete self["set" + name];
            delete self["get" + name];
            delete self["add" + name];
            delete self["del" + name];
            
            // Delete functions under .functions by making each type a new {}
            functions.setGroup = {};
            functions.getGroup = {};
            functions.set = {};
            functions.get = {};
            functions.add = {};
            functions.del = {};
        });
    }
    
    /**
     * Resets groups to an empty object, and fills it with a new groupType for
     * each name in groupNames
     */
    function setGroups() {
        groups = {};
        groupNames.forEach(function (name) {
            groups[name] = new groupTypes[name]();
        });
    }
    
    /**
     * Calls the function setters for each name in groupNames
     * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
     */
    function setFunctions() {
        groupNames.forEach(function (name) {
            createFunctionSetGroup(name);
            createFunctionGetGroup(name);
            createFunctionSet(name);
            createFunctionGet(name);
            createFunctionAdd(name);
            createFunctionDel(name);
        });
    }
    
    
    /* Function generators
    */
    
    /**
     * Creates a getGroup function under self and functions.getGroup.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    function createFunctionGetGroup(name) {
        /**
         * @param {String} key   The String key that references the group.
         * @return {Mixed}   The group referenced by the given key.
         */
        functions.getGroup[name] = self["get" + name + "Group"] = function () {
            return groups[name];
        };
    }
    
    /**
     * Creates a setGroup function under self and functions.setGroup.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    function createFunctionSetGroup(name) {
        /**
         * Sets the value of the group referenced by the name.
         * 
         * @param {Mixed} value   The new value for the group, which should be 
         *                        the same type as the group (Array or Object).
         */
        
        functions.setGroup[name] = self["set" + name + "Group"] = function (value) {
            ensureCorrectgroupType(value, name);
            groups[name] = value;
        };
    }
    
    /**
     * Creates a get function under self and functions.get.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    function createFunctionGet(name) {
        /**
         * @param {Mixed} key   The key referencing the value to obtain. This 
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @return {Mixed} The corresponding value in the group.
         */
        functions.get[name] = self["get" + name] = function (key) {
            return groups[name][key];
        };
    }
    
    /**
     * Creates a set function under self and functions.set.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    function createFunctionSet(name) {
        /**
         * Sets a value contained within the group.
         * 
         * @param {Mixed} key   The key referencing the value to obtain. This 
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @param {Mixed} value
         */
        functions.set[name] = self["set" + name] = function (key, value) {
            groups[name][key] = value;
        };
    }
    
    /**
     * Creates a get<type> function under self and functions.get
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    function createFunctionGet(name) {
        /**
         * Gets the value within a group referenced by the given key.
         * 
         * @param {Mixed} key   The key referencing the value to obtain. This 
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @return {Mixed} value
         */
        functions.get[name] = self["get" + name] = function (key) {
            return groups[name][key];
        };
    }
    
    /**
     * Creates an add function under self and functions.add.
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    function createFunctionAdd(name) {
        var group = groups[name];
        if (groupTypes[name] == Object) {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param {String} key   The String key to reference the value to be
             *                       added.
             * @param value
             */
            functions.add[name] = self["add" + name] = function (key, value) {
                group[key] = value;
            };
        }
        else {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param {Number} key   The String key to reference the value to be
             *                       added.
             * @param value
             */
            functions.add[name] = self["add" + name] = function (value) {
                group.push(value);
                return self;
            };
        }
    }
    
    /**
     * Creates a del (delete) function under self and functions.del.
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    function createFunctionDel(name) {
        var group = groups[name];
        if (groupTypes[name] == Object) {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param {String} key   The String key to reference the value to be
             *                       deleted.
             */
            functions.del[name] = self["del" + name] = function (key) {
                delete group[key];
            };
        }
        else {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param {Number} key   The String key to reference the value to be
             *                       deleted.
             */
            functions.del[name] = self["del" + name] = function (key) {
                group = group.splice(group.indexOf(key), 1);
            };
        }
    }
    
    
    /* Group/ordering manipulators
    */
    
    /**
     * Deletes a given object from a group by calling Array.splice on
     * the result of Array.indexOf
     * 
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Number} object   The object to be deleted from the group.
     */
    self.deleteObject = function (groupName, object) {
        groups[groupName].splice(groups[groupName].indexOf(object), 1);
    };
    
    /**
     * Deletes a given index from a group by calling Array.splice. 
     * 
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Number} index   The index to be deleted from the group.
     * @param {Number} [max]   How many elements to delete after that index (if
     *                         falsy, just the first 1).
     */
    self.deleteIndex = function (groupName, index, max) {
        groups[groupName].splice(index, max || 1);
    };
    
    /**
     * Switches an object from groupOld to groupNew by removing it from the
     * old group and adding it to the new. If the new group uses an associative
     * array, a key should be passed in (which defaults to undefined).
     * 
     * @param {Mixed} object   The object to be moved from one group to another.
     * @param {String} groupOld   The string name of the object's old group.
     * @param {String} groupNew   The string name of the object's new group.
     * @param {String} [keyNew]   A key for the object to be placed in the new
     *                             group, required only if the group contains an
     *                             associative array.
     */
    self.switchObjectGroup = function (object, groupOld, groupNew, keyNew) {
        self.deleteObject(groupOld, object);
        functions.add[groupNew](object, keyNew);
    };
    
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed in an array after scope and func, as in
     * Function.apply's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the 
     *                         function after each group.
     */
    self.applyAll = function (scope, func, args) {
        var i;
        
        if (!args) {
            args = [ undefined ];
        } else {
            args.unshift(undefined);
        }
       
        if (!scope) {
            scope = self;
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = groups[groupNames[i]];
            func.apply(scope, args);
        }
    };
    
    /**
     * Calls a function for each member of each group. Extra arguments may be 
     * passed in an array after scope and func, as in Function.apply's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the 
     *                         function after each group.
     */
    self.applyOnAll = function (scope, func, args) {
        var group, i, j;
        
        if (!args) {
            args = [ undefined ];
        } else {
            args.unshift(undefined);
        }
       
        if (!scope) {
            scope = self;
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            group = groups[groupNames[i]];
            for (j in group) {
                args[0] = group[j];
                func.apply(scope, args);
            }
        }
    };
    
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed after scope and func natively, as in 
     * Function.call's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group.
     */
    self.callAll = function (scope, func) {
        var args = Array.prototype.slice.call(arguments, 1),
            i;
        
        if (!scope) {
            scope = self;
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = groups[groupNames[i]];
            func.apply(scope, args);
        }
    };
    
    /**
     * Calls a function for each member of each group. Extra arguments may be
     * passed after scope and func natively, as in Function.call's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group member.
     */
    self.callOnAll = function (scope, func) {
        var args = Array.prototype.slice.call(arguments, 1),
            group, i, j;
        
        if (!scope) {
            scope = self;
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            group = groups[groupNames[i]];
            for (j in group) {
                args[0] = group[j];
                func.apply(scope, args);
            }
        }
    };
    
    /**
     * Clears each Array by setting its length to 0.
     */
    self.clearArrays = function () {
        var group, name, i;
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            group = groups[groupNames[i]];
            
            if (group instanceof Array) {
                group.length = 0;
            }
        }
    }
    
    
    /* Utilities
    */
    
    /**
     * Returns the name of a type specified by a string ("Array" or "Object").
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {String}
     * @remarks The type is determined by the str[0]; if it exists and is 'o',
     *          the outcome is "Object", otherwise it's "Array".
     */
    function getTypeName(str) {
        if (str && str.charAt && str.charAt(0).toLowerCase() == 'o') {
            return "Object";
        }
        return "Array";
    }
    
    /**
     * Returns function specified by a string (Array or Object).
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {Function}
     * @remarks The type is determined by the str[0]; if it exists and is 'o',
     *          the outcome is Object, otherwise it's Array.
     */
    function getTypeFunction(str) {
        if (str && str.charAt && str.charAt(0).toLowerCase() == 'o') {
            return Object;
        }
        return Array;
    }
    
    /**
     * 
     */
    function ensureCorrectgroupType(value, name) {
        if (groupTypes.constructor === String) {
            return value === groupTypes;
        }
        
        return groupTypes[name] === value.constructor;
    }
    
    /**
     * Uppercases the first character in a string.
     * 
     * @param {String} str
     * @return {String}
     */
    function ucFirst(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    
    self.reset(settings || {});
}