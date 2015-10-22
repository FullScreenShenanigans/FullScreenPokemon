var GroupHoldr;
(function (GroupHoldr_1) {
    "use strict";
    /**
     * A general utility to keep Arrays and/or Objects by key names within a
     * container so they can be referenced automatically by those keys. Automation
     * is made easier by more abstraction, such as by automatically generated add,
     * remove, etc. methods.
     */
    var GroupHoldr = (function () {
        /**
         * @param {IGroupHoldrSettings} settings
         */
        function GroupHoldr(settings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings given to GroupHoldr.");
            }
            if (typeof settings.groupNames === "undefined") {
                throw new Error("No groupNames given to GroupHoldr.");
            }
            if (typeof settings.groupTypes === "undefined") {
                throw new Error("No groupTypes given to GroupHoldr.");
            }
            // These functions containers are filled in setGroupNames 
            this.functions = {
                "setGroup": {},
                "getGroup": {},
                "set": {},
                "get": {},
                "add": {},
                "delete": {}
            };
            this.setGroupNames(settings.groupNames, settings.groupTypes);
        }
        /* Simple gets
        */
        /**
         * @return {Object} The Object with Object<Function>s for each action
         *                  available on groups.
         */
        GroupHoldr.prototype.getFunctions = function () {
            return this.functions;
        };
        /**
         * @return {Object} The Object storing each of the internal groups.
         */
        GroupHoldr.prototype.getGroups = function () {
            return this.groups;
        };
        /**
         * @param {String} name
         * @return {Mixed} The group of the given name.
         */
        GroupHoldr.prototype.getGroup = function (name) {
            return this.groups[name];
        };
        /**
         * @return {String[]} An Array containing each of the group names.
         */
        GroupHoldr.prototype.getGroupNames = function () {
            return this.groupNames;
        };
        /* Group/ordering manipulators
        */
        /**
         * Deletes a given object from a group by calling Array.splice on
         * the result of Array.indexOf
         *
         * @param {String} groupName   The string name of the group to delete an
         *                              object from.
         * @param {Mixed} value   The object to be deleted from the group.
         */
        GroupHoldr.prototype.deleteObject = function (groupName, value) {
            var group = this.groups[groupName];
            group.splice(group.indexOf(value), 1);
        };
        /**
         * Deletes a given index from a group by calling Array.splice.
         *
         * @param {String} groupName   The string name of the group to delete an
         *                              object from.
         * @param {Number} index   The index to be deleted from the group.
         * @param {Number} [max]   How many elements to delete after that index (by
         *                         default or if falsy, just the first 1).
         */
        GroupHoldr.prototype.deleteIndex = function (groupName, index, max) {
            if (max === void 0) { max = 1; }
            var group = this.groups[groupName];
            group.splice(index, max);
        };
        /**
         * Switches an object from groupOld to groupNew by removing it from the
         * old group and adding it to the new. If the new group uses an associative
         * array, a key should be passed in (which defaults to undefined).
         *
         * @param {Mixed} value   The value to be moved from one group to another.
         * @param {String} groupOld   The string name of the value's old group.
         * @param {String} groupNew   The string name of the value's new group.
         * @param {String} [keyNew]   A key for the value to be placed in the new
         *                           group, required only if the group contains an
         *                           associative array.
         */
        GroupHoldr.prototype.switchObjectGroup = function (value, groupOld, groupNew, keyNew) {
            if (keyNew === void 0) { keyNew = undefined; }
            this.deleteObject(groupOld, value);
            this.functions.add[groupNew](value, keyNew);
        };
        /**
         * Calls a function for each group, with that group as the first argument.
         * Extra arguments may be passed in an array after scope and func, as in
         * Function.apply's standard.
         *
         * @param {Mixed} scope   An optional scope to call this from (if falsy,
         *                        defaults to this).
         * @param {Function} func   A function to apply to each group.
         * @param {Array} [args]   An optional array of arguments to pass to the
         *                         function after each group.
         */
        GroupHoldr.prototype.applyAll = function (scope, func, args) {
            if (args === void 0) { args = undefined; }
            var i;
            if (!args) {
                args = [undefined];
            }
            else {
                args.unshift(undefined);
            }
            if (!scope) {
                scope = this;
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                args[0] = this.groups[this.groupNames[i]];
                func.apply(scope, args);
            }
            args.shift();
        };
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed in an array after scope and func, as in Function.apply's standard.
         *
         * @param {Mixed} scope   An optional scope to call this from (if falsy,
         *                        defaults to this).
         * @param {Function} func   A function to apply to each group.
         * @param {Array} [args]   An optional array of arguments to pass to the
         *                         function after each group.
         */
        GroupHoldr.prototype.applyOnAll = function (scope, func, args) {
            if (args === void 0) { args = undefined; }
            var group, i, j;
            if (!args) {
                args = [undefined];
            }
            else {
                args.unshift(undefined);
            }
            if (!scope) {
                scope = this;
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = this.groups[this.groupNames[i]];
                if (group instanceof Array) {
                    for (j = 0; j < group.length; j += 1) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
                else {
                    for (j in group) {
                        if (group.hasOwnProperty(j)) {
                            args[0] = group[j];
                            func.apply(scope, args);
                        }
                    }
                }
            }
        };
        /**
         * Calls a function for each group, with that group as the first argument.
         * Extra arguments may be passed after scope and func natively, as in
         * Function.call's standard.
         *
         * @param {Mixed} [scope]   An optional scope to call this from (if falsy,
         *                          defaults to this).
         * @param {Function} func   A function to apply to each group.
         */
        GroupHoldr.prototype.callAll = function (scope, func) {
            var args = Array.prototype.slice.call(arguments, 1), i;
            if (!scope) {
                scope = this;
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                args[0] = this.groups[this.groupNames[i]];
                func.apply(scope, args);
            }
        };
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed after scope and func natively, as in Function.call's standard.
         *
         * @param {Mixed} [scope]   An optional scope to call this from (if falsy,
         *                          defaults to this).
         * @param {Function} func   A function to apply to each group member.
         */
        GroupHoldr.prototype.callOnAll = function (scope, func) {
            var args = Array.prototype.slice.call(arguments, 1), group, i, j;
            if (!scope) {
                scope = this;
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = this.groups[this.groupNames[i]];
                if (group instanceof Array) {
                    for (j = 0; j < group.length; j += 1) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
                else {
                    for (j in group) {
                        if (group.hasOwnProperty(j)) {
                            args[0] = group[j];
                            func.apply(scope, args);
                        }
                    }
                }
            }
        };
        /**
         * Clears each Array by setting its length to 0.
         */
        GroupHoldr.prototype.clearArrays = function () {
            var group, i;
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = this.groups[this.groupNames[i]];
                if (group instanceof Array) {
                    group.length = 0;
                }
            }
        };
        /* Core setup logic
        */
        /**
         * Meaty function to reset, given an array of names an object of types
         * Any pre-existing functions are cleared, and new ones are added as
         * member objects and to {functions}.
         *
         * @param {String[]} names   An array of names of groupings to be made
         * @param {Mixed} types   An associative array of the function types of
         *                        the names given in names. This may also be taken
         *                        in as a String, to be converted to an Object.
         */
        GroupHoldr.prototype.setGroupNames = function (names, types) {
            var scope = this, typeFunc, typeName;
            if (!(names instanceof Array)) {
                throw new Error("groupNames is not an Array");
            }
            // If there already were group names, clear them
            if (this.groupNames) {
                this.clearFunctions();
            }
            // Reset the group types and type names, to be filled next
            this.groupNames = names;
            this.groupTypes = {};
            this.groupTypeNames = {};
            // If groupTypes is an object, set custom group types for everything
            if (types.constructor === Object) {
                this.groupNames.forEach(function (name) {
                    scope.groupTypes[name] = scope.getTypeFunction(types[name]);
                    scope.groupTypeNames[name] = scope.getTypeName(types[name]);
                });
            }
            else {
                // Otherwise assume everything uses the same one, such as from a String
                typeFunc = this.getTypeFunction(types);
                typeName = this.getTypeName(types);
                this.groupNames.forEach(function (name) {
                    scope.groupTypes[name] = typeFunc;
                    scope.groupTypeNames[name] = typeName;
                });
            }
            // Create the containers, and set the modifying functions
            this.setGroups();
            this.setFunctions();
        };
        /**
         * Removes any pre-existing "set", "get", etc. functions.
         */
        GroupHoldr.prototype.clearFunctions = function () {
            this.groupNames.forEach(function (name) {
                // Delete member variable functions
                delete this["set" + name + "Group"];
                delete this["get" + name + "Group"];
                delete this["set" + name];
                delete this["get" + name];
                delete this["add" + name];
                delete this["delete" + name];
                // Delete functions under .functions by making each type a new {}
                this.functions.setGroup = {};
                this.functions.getGroup = {};
                this.functions.set = {};
                this.functions.get = {};
                this.functions.add = {};
                this.functions.delete = {};
            });
        };
        /**
         * Resets groups to an empty object, and fills it with a new groupType for
         * each name in groupNames
         */
        GroupHoldr.prototype.setGroups = function () {
            var scope = this;
            this.groups = {};
            this.groupNames.forEach(function (name) {
                scope.groups[name] = new scope.groupTypes[name]();
            });
        };
        /**
         * Calls the function setters for each name in groupNames
         * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
         */
        GroupHoldr.prototype.setFunctions = function () {
            var groupName, i;
            for (i = 0; i < this.groupNames.length; i += 1) {
                groupName = this.groupNames[i];
                this.createFunctionSetGroup(groupName);
                this.createFunctionGetGroup(groupName);
                this.createFunctionSet(groupName);
                this.createFunctionGet(groupName);
                this.createFunctionAdd(groupName);
                this.createFunctionDelete(groupName);
            }
        };
        /* Function generators
        */
        /**
         * Creates a setGroup function under this and functions.setGroup.
         *
         * @param {String} name   The name of the group, from groupNames.
         */
        GroupHoldr.prototype.createFunctionSetGroup = function (name) {
            var scope = this;
            /**
             * Sets the value of the group referenced by the name.
             *
             * @param {Mixed} value   The new value for the group, which should be
             *                        the same type as the group (Array or Object).
             */
            this.functions.setGroup[name] = this["set" + name + "Group"] = function (value) {
                scope.groups[name] = value;
            };
        };
        /**
         * Creates a getGroup function under this and functions.getGroup.
         *
         * @param {String} name   The name of the group, from groupNames.
         */
        GroupHoldr.prototype.createFunctionGetGroup = function (name) {
            var scope = this;
            /**
             * @param {String} key   The String key that references the group.
             * @return {Mixed}   The group referenced by the given key.
             */
            this.functions.getGroup[name] = this["get" + name + "Group"] = function () {
                return scope.groups[name];
            };
        };
        /**
         * Creates a set function under this and functions.set.
         *
         * @param {String} name   The name of the group, from groupNames.
         */
        GroupHoldr.prototype.createFunctionSet = function (name) {
            /**
             * Sets a value contained within the group.
             *
             * @param {Mixed} key   The key referencing the value to obtain. This
             *                      should be a Number if the group is an Array, or
             *                      a String if the group is an Object.
             * @param {Mixed} value
             */
            this.functions.set[name] = this["set" + name] = function (key, value) {
                if (value === void 0) { value = undefined; }
                this.groups[name][key] = value;
            };
        };
        /**
         * Creates a get<type> function under this and functions.get
         *
         * @param {String} name   The name of the group, from groupNames
         */
        GroupHoldr.prototype.createFunctionGet = function (name) {
            /**
             * Gets the value within a group referenced by the given key.
             *
             * @param {Mixed} key   The key referencing the value to obtain. This
             *                      should be a Number if the group is an Array, or
             *                      a String if the group is an Object.
             * @return {Mixed} value
             */
            this.functions.get[name] = this["get" + name] = function (key) {
                return this.groups[name][key];
            };
        };
        /**
         * Creates an add function under this and functions.add.
         *
         * @param {String} name   The name of the group, from groupNames
         */
        GroupHoldr.prototype.createFunctionAdd = function (name) {
            var group = this.groups[name];
            if (this.groupTypes[name] === Object) {
                /**
                 * Adds a value to the group, referenced by the given key.
                 *
                 * @param {String} key   The String key to reference the value to be
                 *                       added.
                 * @param value
                 */
                this.functions.add[name] = this["add" + name] = function (value, key) {
                    group[key] = value;
                };
            }
            else {
                /**
                 * Adds a value to the group, referenced by the given key.
                 *
                 * @param {String} value
                 */
                this.functions.add[name] = this["add" + name] = function (value, key) {
                    if (key !== undefined) {
                        group[key] = value;
                    }
                    else {
                        group.push(value);
                    }
                };
            }
        };
        /**
         * Creates a del (delete) function under this and functions.delete.
         *
         * @param {String} name   The name of the group, from groupNames
         */
        GroupHoldr.prototype.createFunctionDelete = function (name) {
            var group = this.groups[name];
            if (this.groupTypes[name] === Object) {
                /**
                 * Deletes a value from the group, referenced by the given key.
                 *
                 * @param {String} key   The String key to reference the value to be
                 *                       deleted.
                 */
                this.functions.delete[name] = this["delete" + name] = function (key) {
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
                this.functions.delete[name] = this["delete" + name] = function (key) {
                    group.splice(group.indexOf(key), 1);
                };
            }
        };
        /* Utilities
        */
        /**
         * Returns the name of a type specified by a string ("Array" or "Object").
         *
         * @param {String} str   The name of the type. If falsy, defaults to Array
         * @return {String}
         * @remarks The type is determined by the str[0]; if it exists and is "o",
         *          the outcome is "Object", otherwise it's "Array".
         */
        GroupHoldr.prototype.getTypeName = function (str) {
            if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
                return "Object";
            }
            return "Array";
        };
        /**
         * Returns function specified by a string (Array or Object).
         *
         * @param {String} str   The name of the type. If falsy, defaults to Array
         * @return {Function}
         * @remarks The type is determined by the str[0]; if it exists and is "o",
         *          the outcome is Object, otherwise it's Array.
         */
        GroupHoldr.prototype.getTypeFunction = function (str) {
            if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
                return Object;
            }
            return Array;
        };
        return GroupHoldr;
    })();
    GroupHoldr_1.GroupHoldr = GroupHoldr;
})(GroupHoldr || (GroupHoldr = {}));
