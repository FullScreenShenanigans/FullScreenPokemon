declare namespace GroupHoldr {
    /**
     * A general storage abstraction for keyed containers of items.
     */
    class GroupHoldr implements IGroupHoldr {
        /**
         * Stored object groups, keyed by name.
         */
        private groups;
        /**
         * Mapping of "add", "delete", "get", and "set" keys to a listing of the
         * appropriate Functions for each group.
         */
        private functions;
        /**
         * Names of the stored object groups.
         */
        private groupNames;
        /**
         * Types for each stored object group, as Array or Object.
         */
        private groupTypes;
        /**
         * The names of each group's type, as "Array" or "Object".
         */
        private groupTypeNames;
        /**
         * Initializes a new instance of the GroupHoldr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IGroupHoldrSettings);
        /**
         * @returns The mapping of operation types to each group's Functions.
         */
        getFunctions(): IFunctionGroups;
        /**
         * @returns The stored object groups, keyed by name.
         */
        getGroups(): IGroups<any>;
        /**
         * @param name   The name of the group to retrieve.
         * @returns The group stored under the given name.
         */
        getGroup(name: string): {
            [i: string]: any;
        } | any[];
        /**
         * @returns Names of the stored object groups.
         */
        getGroupNames(): string[];
        /**
         * Switches an object from one group to another.
         *
         * @param value   The value being moved from one group to another.
         * @param groupNameOld   The name of the group to move out of.
         * @param groupNameNew   The name of the group to move into.
         * @param [keyOld]   What key the value used to be under (required if
         *                   the old group is an Object).
         * @param [keyNew]   Optionally, what key the value will now be under
         *                   (required if the new group is an Object).
         */
        switchMemberGroup(value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void;
        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed in an array after scope and func, as in
         * Function.apply's standard.
         *
         * @param scope   An optional scope to call this from (if falsy, defaults
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed in an array after scope and func, as in Function.apply's standard.
         *
         * @param scope   An optional scope to call this from (if falsy, defaults
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed after scope and func natively, as in
         * Function.call's standard.
         *
         * @param scope   An optional scope to call this from (if falsy,
         *                defaults to this).
         * @param func   A Function to apply to each group.
         */
        callAll(scope: any, func: (...args: any[]) => any): void;
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed after scope and func natively, as in Function.call's standard.
         *
         * @param scope   An optional scope to call this from (if falsy,
         *                defaults to this).
         * @param func   A Function to apply to each group member.
         */
        callOnAll(scope: any, func: (...args: any[]) => any): void;
        /**
         * Clears each Array by setting its length to 0.
         */
        clearArrays(): void;
        /**
         * Meaty function to reset, given an Array of names and an object of
         * types. Any pre-existing Functions are cleared, and new ones are added
         * as member objects and to this.functions.
         *
         * @param names   An array of names of groupings to be made
         * @param types   An mapping of the function types of
         *                the names given in names. This may also be taken
         *                in as a String, to be converted to an Object.
         */
        private setGroupNames(names, types);
        /**
         * Removes any pre-existing "set", "get", etc. functions.
         */
        private clearFunctions();
        /**
         * Resets groups to an empty Object, and fills it with a new groupType for
         * each name in groupNames.
         */
        private setGroups();
        /**
         * Calls the Function creators for each name in groupNames.
         */
        private createFunctions();
        /**
         * Creates a setGroup Function under this and functions.setGroup.
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionSetGroup(name);
        /**
         * Creates a getGroup Function under this and functions.getGroup.
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionGetGroup(name);
        /**
         * Creates a set Function under this and functions.set.
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionSet(name);
        /**
         * Creates a get<type> function under this and functions.get
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionGet(name);
        /**
         * Creates an add function under this and functions.add.
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionAdd(name);
        /**
         * Creates a delete function under this and functions.delete.
         *
         * @param name   The name of the group, from groupNames.
         */
        private createFunctionDelete(name);
        /**
         * Returns the name of a type specified by a string ("Array" or "Object").
         *
         * @param str   The name of the type. If falsy, defaults to Array
         * @returns The proper name of the type.
         */
        private getTypeName(str);
        /**
         * Returns function specified by a string (Array or Object).
         *
         * @param str   The name of the type. If falsy, defaults to Array
         * @returns The class Function of the type.
         */
        private getTypeFunction(str);
    }
    /**
     * An Object group containing objects of type T.
     *
     * @param T   The type of values contained within the group.
     */
    interface IDictionary<T> {
        [i: string]: T;
    }
    /**
     * Stored object groups, keyed by name.
     */
    interface IGroups<T> {
        [i: string]: IDictionary<T> | T[];
    }
    /**
     * Types for stored object groups, as Array or Object.
     */
    interface ITypesListing {
        [i: string]: {
            new (): any[] | Object;
        };
    }
    /**
     * Abstract parent interface of all group Functions.
     */
    interface IGroupHoldrFunction extends Function {
    }
    /**
     * Stores the given group internally.
     *
     * @param value   The new group to store.
     */
    interface IGroupHoldrSetGroupFunction<T> extends IGroupHoldrFunction {
        (value: IDictionary<T> | T[]): void;
    }
    /**
     * @returns One of the stored groups.
     */
    interface IGroupHoldrGetGroupFunction<T> extends IGroupHoldrFunction {
        (): IDictionary<T> | T[];
    }
    /**
     * Sets a value in a group.
     *
     * @param key   The key to store the value under.
     * @param [value]   The value to store in the group.
     */
    interface IGroupHoldrSetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }
    /**
     * Retrieves a value from a group.
     *
     * @param key   The key the value is stored under.
     */
    interface IGroupHoldrGetFunction extends IGroupHoldrFunction {
        (key: string | number): void;
    }
    /**
     * Adds a value to a group.
     *
     * @param value   The value to store in the group.
     * @param [key]   The key to store the value under.
     * @remarks If the group is an Array, not providing a key will use Array::push.
     */
    interface IGroupHoldrAddFunction extends IGroupHoldrFunction {
        (value: any, key?: string | number): void;
    }
    /**
     * Adds a value to an Array group.
     *
     * @param value   The value to store in the group.
     * @param [key]   The index to store the value under.
     */
    interface IGroupHoldrArrayAddFunction extends IGroupHoldrAddFunction {
        (value: any, key?: number): void;
    }
    /**
     * Adds a value to an Object group.
     *
     * @param value   The value to store in the group.
     * @param key   The key to store the value under.
     */
    interface IGroupHoldrObjectAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: string): void;
    }
    /**
     * Deletes a value from a group.
     *
     * @param [arg1]   Either the value (Arrays) or the key (Objects).
     * @param [arg2]   Optionally, for Array groups, the value's index.
     */
    interface IGroupHoldrDeleteFunction extends IGroupHoldrFunction {
        (arg1?: any, arg2?: any): void;
    }
    /**
     * Deletes a value from an Array group.
     *
     * @param [value]   The value to delete, if index is not provided.
     * @param [index]   The index of the value, to bypass Array::indexOf.
     */
    interface IGroupHoldrArrayDeleteFunction extends IGroupHoldrDeleteFunction {
        (value?: any, index?: number): void;
    }
    /**
     * Deletes a value from an Object group.
     *
     * @param key   The key of the value to delete.
     */
    interface IGroupHoldrObjectDeleteFunction extends IGroupHoldrDeleteFunction {
        (key: string): void;
    }
    /**
     * Storage for Function groups of a single group, keyed by their operation.
     */
    interface IGroupHoldrFunctionGroup<T extends IGroupHoldrFunction> {
        [i: string]: T;
    }
    /**
     * Storage for Function groups, keyed by their operation.
     */
    interface IFunctionGroups {
        /**
         * Setter Functions for each group, keyed by their group name.
         */
        setGroup: IGroupHoldrFunctionGroup<IGroupHoldrSetGroupFunction<any>>;
        /**
         * Getter Functions for each group, keyed by their group name.
         */
        getGroup: IGroupHoldrFunctionGroup<IGroupHoldrGetGroupFunction<any>>;
        /**
         * Value setter Functions for each group, keyed by their group name.
         */
        set: IGroupHoldrFunctionGroup<IGroupHoldrSetFunction>;
        /**
         * Value getter Functions for each group, keyed by their group name.
         */
        get: IGroupHoldrFunctionGroup<IGroupHoldrGetFunction>;
        /**
         * Value adder Functions for each group, keyed by their group name.
         */
        add: IGroupHoldrFunctionGroup<IGroupHoldrAddFunction>;
        /**
         * Valuer deleter Functions for each group, keyed by their group name.
         */
        delete: IGroupHoldrFunctionGroup<IGroupHoldrDeleteFunction>;
    }
    /**
     * Settings to initialize a new IGroupHoldr.
     */
    interface IGroupHoldrSettings {
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
    /**
     * A general storage abstraction for keyed containers of items.
     */
    interface IGroupHoldr {
        /**
         * @returns The mapping of operation types to each group's Functions.
         */
        getFunctions(): IFunctionGroups;
        /**
         * @returns The stored object groups, keyed by name.
         */
        getGroups(): IGroups<any>;
        /**
         * @param name   The name of the group to retrieve.
         * @returns The group stored under the given name.
         */
        getGroup(name: string): {
            [i: string]: any;
        } | any[];
        /**
         * @returns Names of the stored object groups.
         */
        getGroupNames(): string[];
        /**
         * Switches an object from one group to another.
         *
         * @param value   The value being moved from one group to another.
         * @param groupNameOld   The name of the group to move out of.
         * @param groupNameNew   The name of the group to move into.
         * @param [keyOld]   What key the value used to be under (required if
         *                   the old group is an Object).
         * @param [keyNew]   Optionally, what key the value will now be under
         *                   (required if the new group is an Object).
         */
        switchMemberGroup(value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void;
        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed in an array after scope and func, as in
         * Function.apply's standard.
         *
         * @param scope   An optional scope to call this from (if falsy, defaults
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed in an array after scope and func, as in Function.apply's standard.
         *
         * @param scope   An optional scope to call this from (if falsy, defaults
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed after scope and func natively, as in
         * Function.call's standard.
         *
         * @param scope   An optional scope to call this from (if falsy,
         *                defaults to this).
         * @param func   A Function to apply to each group.
         */
        callAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed after scope and func natively, as in Function.call's standard.
         *
         * @param scope   An optional scope to call this from (if falsy,
         *                defaults to this).
         * @param func   A Function to apply to each group member.
         */
        callOnAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        /**
         * Clears each Array by setting its length to 0.
         */
        clearArrays(): void;
    }
}
declare var module: any;
