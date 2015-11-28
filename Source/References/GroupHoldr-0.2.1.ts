declare module GroupHoldr {
    export interface IGroupHoldrGroups {
        [i: string]: { [i: string]: any } | any[];
    }

    export interface IGroupHoldrTypesListing {
        [i: string]: (...args: any[]) => void; // Array or Object
    }

    export interface IGroupHoldrTypeNamesListing {
        [i: string]: string;
    }

    export interface IGroupHoldrFunction { }

    export interface IGroupHoldrSetGroupFunction extends IGroupHoldrFunction {
        (value: any | any[]): void;
    }

    export interface IGroupHoldrGetGroupFunction extends IGroupHoldrFunction {
        (): any | any[];
    }

    export interface IGroupHoldrSetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }

    export interface IGroupHoldrGetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }

    export interface IGroupHoldrAddFunction extends IGroupHoldrFunction {
        (value: any, key?: string | number): void;
    }

    export interface IGroupHoldrObjectAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: string): void;
    }

    export interface IGroupHoldrArrayAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: number): void;
    }

    export interface IGroupHoldrDeleteFunction extends IGroupHoldrFunction {
        (arg1: any, arg2?: any): void;
    }

    export interface IGroupHoldrArrayDeleteFunction extends IGroupHoldrDeleteFunction {
        (value: any, index?: number): void;
    }

    export interface IGroupHoldrObjectDeleteFunction extends IGroupHoldrDeleteFunction {
        (key: string): void;
    }

    export interface IGroupHoldrFunctionGroup<T extends IGroupHoldrFunction> {
        [i: string]: T;
    }

    export interface IGroupHoldrFunctionGroups {
        "setGroup": IGroupHoldrFunctionGroup<IGroupHoldrSetGroupFunction>;
        "getGroup": IGroupHoldrFunctionGroup<IGroupHoldrGetGroupFunction>;
        "set": IGroupHoldrFunctionGroup<IGroupHoldrSetFunction>;
        "get": IGroupHoldrFunctionGroup<IGroupHoldrGetFunction>;
        "add": IGroupHoldrFunctionGroup<IGroupHoldrAddFunction>;
        "delete": IGroupHoldrFunctionGroup<IGroupHoldrDeleteFunction>;
    }

    export interface IGroupHoldrSettings {
        /**
         * The names of groups to be creaed.
         */
        groupNames: string[];

        /**
         * The mapping of group types. This can be a single String ("Array" or
         * "Object") to set each one, or an Object mapping each groupName to 
         * a different String (type).
         */
        groupTypes: string | {
            [i: string]: string;
        };
    }

    export interface IGroupHoldr {
        getFunctions(): IGroupHoldrFunctionGroups;
        getGroups(): IGroupHoldrGroups;
        getGroup(name: string): { [i: string]: any } | any[];
        getGroupNames(): string[];
        switchMemberGroup(value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void;
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        callAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        callOnAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        clearArrays(): void;
    }
}


module GroupHoldr {
    "use strict";

    /**
     * A general utility to keep Arrays and/or Objects by key names within a
     * container so they can be referenced automatically by those keys. Automation
     * is made easier by more abstraction, such as by automatically generated add,
     * remove, etc. methods.
     */
    export class GroupHoldr {
        /**
         * Mapping of Strings to groups, where groups are each either an Array
         * or an Object.
         */
        private groups: IGroupHoldrGroups;

        /**
         * Listing of "add", "del", "get", and "set" keys to a listing of the
         * appropriate Functions for each group (e.x. functions.add.MyGroup
         * is the adder for MyGroup).
         */
        private functions: IGroupHoldrFunctionGroups;

        /**
         * The names of all the groups.
         */
        private groupNames: string[];

        /**
         * What type each Group is: Array or Object.
         */
        private groupTypes: IGroupHoldrTypesListing;

        /**
         * The names of each group's type: "Array" or "Object".
         */
        private groupTypeNames: any;

        /**
         * @param {IGroupHoldrSettings} settings
         */
        constructor(settings: IGroupHoldrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to GroupHoldr.");
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
        getFunctions(): IGroupHoldrFunctionGroups {
            return this.functions;
        }

        /**
         * @return {Object} The Object storing each of the internal groups.
         */
        getGroups(): IGroupHoldrGroups {
            return this.groups;
        }

        /**
         * @param {String} name
         * @return {Mixed} The group of the given name.
         */
        getGroup(name: string): { [i: string]: any } | any[] {
            return this.groups[name];
        }

        /**
         * @return {String[]} An Array containing each of the group names.
         */
        getGroupNames(): string[] {
            return this.groupNames;
        }


        /* Group/ordering manipulators
        */

        /**
         * Switches a value from one group to another, regardless of group types.
         * 
         * @param {Mixed} value   The value being moved from one group to another.
         * @param {String} groupNameOld   The name of the group to move out of.
         * @param {String} groupNameNew   The name of the group to move into.
         * @param {Mixed} [keyOld]   What key the value used to be under (required if
         *                           the old group is an Object).
         * @param {Mixed} [keyNew]   Optionally, what key the value will now be under
         *                           (required if the new group is an Object).
         */
        switchMemberGroup(
            value: any,
            groupNameOld: string,
            groupNameNew: string,
            keyOld?: string | number,
            keyNew?: string | number): void {
            var groupOld: any = this.groups[groupNameOld];

            if (groupOld.constructor === Array) {
                this.functions.delete[groupNameOld](value, keyOld);
            } else {
                this.functions.delete[groupNameOld](keyOld);
            }

            this.functions.add[groupNameNew](value, keyNew);
        }

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
        applyAll(scope: any, func: (...args: any[]) => any, args: any[] = undefined): void {
            var i: number;

            if (!args) {
                args = [undefined];
            } else {
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
        }

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
        applyOnAll(scope: any, func: (...args: any[]) => any, args: any[] = undefined): void {
            var group: any,
                i: number,
                j: any;

            if (!args) {
                args = [undefined];
            } else {
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
                } else {
                    for (j in group) {
                        if (group.hasOwnProperty(j)) {
                            args[0] = group[j];
                            func.apply(scope, args);
                        }
                    }
                }
            }
        }

        /**
         * Calls a function for each group, with that group as the first argument.
         * Extra arguments may be passed after scope and func natively, as in 
         * Function.call's standard.
         * 
         * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
         *                          defaults to this).
         * @param {Function} func   A function to apply to each group.
         */
        callAll(scope: any, func: (...args: any[]) => any): void {
            var args: any[] = Array.prototype.slice.call(arguments, 1),
                i: number;

            if (!scope) {
                scope = this;
            }

            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                args[0] = this.groups[this.groupNames[i]];
                func.apply(scope, args);
            }
        }

        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed after scope and func natively, as in Function.call's standard.
         * 
         * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
         *                          defaults to this).
         * @param {Function} func   A function to apply to each group member.
         */
        callOnAll(scope: any, func: (...args: any[]) => any): void {
            var args: any[] = Array.prototype.slice.call(arguments, 1),
                group: any,
                i: number,
                j: any;

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
                } else {
                    for (j in group) {
                        if (group.hasOwnProperty(j)) {
                            args[0] = group[j];
                            func.apply(scope, args);
                        }
                    }
                }
            }
        }

        /**
         * Clears each Array by setting its length to 0.
         */
        clearArrays(): void {
            var group: any,
                i: number;

            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = this.groups[this.groupNames[i]];

                if (group instanceof Array) {
                    group.length = 0;
                }
            }
        }


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
        private setGroupNames(names: string[], types: string | any): void {
            var scope: GroupHoldr = this,
                typeFunc: any,
                typeName: any;

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
                this.groupNames.forEach(function (name: string): void {
                    scope.groupTypes[name] = scope.getTypeFunction(types[name]);
                    scope.groupTypeNames[name] = scope.getTypeName(types[name]);
                });
            } else {
                // Otherwise assume everything uses the same one, such as from a String
                typeFunc = this.getTypeFunction(types);
                typeName = this.getTypeName(types);

                this.groupNames.forEach(function (name: string): void {
                    scope.groupTypes[name] = typeFunc;
                    scope.groupTypeNames[name] = typeName;
                });
            }

            // Create the containers, and set the modifying functions
            this.setGroups();
            this.setFunctions();
        }

        /**
         * Removes any pre-existing "set", "get", etc. functions.
         */
        private clearFunctions(): void {
            this.groupNames.forEach(function (name: string): void {
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
        }

        /**
         * Resets groups to an empty object, and fills it with a new groupType for
         * each name in groupNames
         */
        private setGroups(): void {
            var scope: GroupHoldr = this;

            this.groups = {};
            this.groupNames.forEach(function (name: string): void {
                scope.groups[name] = new scope.groupTypes[name]();
            });
        }

        /**
         * Calls the function setters for each name in groupNames
         * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
         */
        private setFunctions(): void {
            var groupName: string,
                i: number;

            for (i = 0; i < this.groupNames.length; i += 1) {
                groupName = this.groupNames[i];

                this.createFunctionSetGroup(groupName);
                this.createFunctionGetGroup(groupName);
                this.createFunctionSet(groupName);
                this.createFunctionGet(groupName);
                this.createFunctionAdd(groupName);
                this.createFunctionDelete(groupName);
            }
        }


        /* Function generators
        */

        /**
         * Creates a setGroup function under this and functions.setGroup.
         * 
         * @param {String} name   The name of the group, from groupNames.
         */
        private createFunctionSetGroup(name: string): void {
            var scope: GroupHoldr = this;

            /**
             * Sets the value of the group referenced by the name.
             * 
             * @param {Mixed} value   The new value for the group, which should be 
             *                        the same type as the group (Array or Object).
             */
            this.functions.setGroup[name] = (<any>this)["set" + name + "Group"] = function (value: any | any[]): void {
                scope.groups[name] = value;
            };
        }

        /**
         * Creates a getGroup function under this and functions.getGroup.
         * 
         * @param {String} name   The name of the group, from groupNames.
         */
        private createFunctionGetGroup(name: string): void {
            var scope: GroupHoldr = this;

            /**
             * @param {String} key   The String key that references the group.
             * @return {Mixed}   The group referenced by the given key.
             */
            this.functions.getGroup[name] = (<any>this)["get" + name + "Group"] = function (): any | any[] {
                return scope.groups[name];
            };
        }

        /**
         * Creates a set function under this and functions.set.
         * 
         * @param {String} name   The name of the group, from groupNames.
         */
        private createFunctionSet(name: string): void {
            /**
             * Sets a value contained within the group.
             * 
             * @param {Mixed} key   The key referencing the value to obtain. This 
             *                      should be a Number if the group is an Array, or
             *                      a String if the group is an Object.
             * @param {Mixed} value
             */
            this.functions.set[name] = (<any>this)["set" + name] = function (key: string | number, value: any = undefined): void {
                this.groups[name][<string>key] = value;
            };
        }

        /**
         * Creates a get<type> function under this and functions.get
         * 
         * @param {String} name   The name of the group, from groupNames
         */
        private createFunctionGet(name: string): void {
            /**
             * Gets the value within a group referenced by the given key.
             * 
             * @param {Mixed} key   The key referencing the value to obtain. This 
             *                      should be a Number if the group is an Array, or
             *                      a String if the group is an Object.
             * @return {Mixed} value
             */
            this.functions.get[<string>name] = this["get" + name] = function (key: string | number): void {
                return this.groups[name][<string>key];
            };
        }

        /**
         * Creates an add function under this and functions.add.
         * 
         * @param {String} name   The name of the group, from groupNames
         */
        private createFunctionAdd(name: string): void {
            var group: any = this.groups[name];

            if (this.groupTypes[name] === Object) {
                /**
                 * Adds a value to the group, referenced by the given key.
                 * 
                 * @param {String} key   The String key to reference the value to be
                 *                       added.
                 * @param value
                 */
                this.functions.add[name] = this["add" + name] = function (value: any, key: string): void {
                    group[key] = value;
                };
            } else {
                /**
                 * Adds a value to the group, referenced by the given key.
                 * 
                 * @param {String} value
                 */
                this.functions.add[name] = this["add" + name] = function (value: any, key?: number): void {
                    if (key !== undefined) {
                        group[key] = value;
                    } else {
                        group.push(value);
                    }
                };
            }
        }

        /**
         * Creates a del (delete) function under this and functions.delete.
         * 
         * @param {String} name   The name of the group, from groupNames
         */
        private createFunctionDelete(name: string): void {
            var group: any = this.groups[name];

            if (this.groupTypes[name] === Object) {
                /**
                 * Deletes a value from the group, referenced by the given key.
                 * 
                 * @param {String} key   The String key to reference the value to be
                 *                       deleted.
                 */
                this.functions.delete[name] = this["delete" + name] = function (key: string): void {
                    delete group[key];
                };
            } else {
                /**
                 * Deletes a value from the group, referenced by the given key.
                 * 
                 * @param {Mixed} value The value to be deleted.
                 */
                this.functions.delete[name] = this["delete" + name] = function (value: any, index: number = group.indexOf(value)): void {
                    if (index !== -1) {
                        group.splice(index, 1);
                    }
                };
            }
        }


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
        private getTypeName(str: string): string {
            if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
                return "Object";
            }
            return "Array";
        }

        /**
         * Returns function specified by a string (Array or Object).
         * 
         * @param {String} str   The name of the type. If falsy, defaults to Array
         * @return {Function}
         * @remarks The type is determined by the str[0]; if it exists and is "o",
         *          the outcome is Object, otherwise it's Array.
         */
        private getTypeFunction(str: string): any {
            if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
                return Object;
            }
            return Array;
        }
    }
}
