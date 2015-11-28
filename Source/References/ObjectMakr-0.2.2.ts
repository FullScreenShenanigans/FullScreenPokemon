declare module ObjectMakr {
    export interface IObjectMakrClassInheritance {
        [i: string]: string | IObjectMakrClassInheritance;
    }

    export interface IObjectMakrClassProperties {
        [i: string]: any;
    }

    export interface IObjectMakrSettings {
        inheritance: any;
        properties?: { [i: string]: any };
        doPropertiesFull?: boolean;
        indexMap?: any;
        onMake?: string;
    }

    export interface IObjectMakrClassFunction {
        new ();
    }

    export interface IObjectMakr {
        getInheritance(): any;
        getProperties(): any;
        getPropertiesOf(title: string): any;
        getFullProperties(): any;
        getFullPropertiesOf(title: string): any;
        getFunctions(): any;
        getFunction(name: string): Function;
        hasFunction(name: string): boolean;
        getIndexMap(): any;
        make(name: string, settings?: any): any;
    }
}


module ObjectMakr {
    "use strict";

    /**
     * An Abstract Factory for JavaScript classes that automates the process of 
     * setting constructors' prototypal inheritance. A sketch of class inheritance 
     * and a listing of properties for each class is taken in, and dynamically
     * accessible function constructors are made available.
     */
    export class ObjectMakr implements IObjectMakr {
        /**
         * The sketch of class inheritance, keyed by name.
         */
        private inheritance: IObjectMakrClassInheritance;

        /**
         * Type properties for each class.
         */
        private properties: IObjectMakrClassProperties;

        /**
         * The actual Functions for the classes to be made.
         */
        private functions: { [i: string]: IObjectMakrClassFunction; };

        /**
         * Whether a full property mapping should be made for each type.
         */
        private doPropertiesFull: boolean;

        /**
         * If doPropertiesFull is true, a version of properties that contains the
         * sum properties for each type (rather than missing inherited ones).
         */
        private propertiesFull: any;

        /**
         * Optionally, how properties can be mapped from an Object to keys.
         */
        private indexMap: any;

        /**
         * Optionally, a String index for each generated Object's Function to
         * be run when made.
         */
        private onMake: string;

        /**
         * @param {IObjectMakrSettings} settings
         */
        constructor(settings: IObjectMakrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to ObjectMakr.");
            }
            if (typeof settings.inheritance === "undefined") {
                throw new Error("No inheritance given to ObjectMakr.");
            }

            this.inheritance = settings.inheritance;
            this.properties = settings.properties || {};
            this.doPropertiesFull = settings.doPropertiesFull;
            this.indexMap = settings.indexMap;
            this.onMake = settings.onMake;

            this.functions = {};

            if (this.doPropertiesFull) {
                this.propertiesFull = {};
            }

            if (this.indexMap) {
                this.processProperties(this.properties);
            }

            this.processFunctions(this.inheritance, Object, "Object");
        }


        /* Simple gets
        */

        /**
         * @return {Object} The complete inheritance mapping Object.
         */
        getInheritance(): any {
            return this.inheritance;
        }

        /**
         * @return {Object} The complete properties mapping Object.
         */
        getProperties(): any {
            return this.properties;
        }

        /**
         * @return {Object} The properties Object for a particular class.
         */
        getPropertiesOf(title: string): any {
            return this.properties[title];
        }

        /**
         * @return {Object} The full properties Object, if doPropertiesFull is on.
         */
        getFullProperties(): any {
            return this.propertiesFull;
        }

        /**
         * @return {Object} The full properties Object for a particular class, if
         *                  doPropertiesFull is on.
         */
        getFullPropertiesOf(title: string): any {
            return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
        }

        /**
         * @return {Object} The full mapping of class constructors.
         */
        getFunctions(): any {
            return this.functions;
        }

        /**
         * @param {String} name   The name of a class to retrieve.
         * @return {Function}   The constructor for the given class.
         */
        getFunction(name: string): Function {
            return this.functions[name];
        }

        /**
         * @param {String} type   The name of a class to check for.
         * @return {Boolean} Whether that class exists.
         */
        hasFunction(name: string): boolean {
            return this.functions.hasOwnProperty(name);
        }

        /**
         * @return {Mixed} The optional mapping of indices.
         */
        getIndexMap(): any {
            return this.indexMap;
        }


        /* Core usage
        */

        /**
         * Creates a new instance of the given type and returns it.
         * If desired, any settings are applied to it (deep copy using proliferate).
         * @param {String} type   The type for which a new object of is being made.
         * @param {Objetct} [settings]   Additional attributes to add to the newly
         *                               created Object.
         * @return {Mixed}
         */
        make(name: string, settings: any = undefined): any {
            var output: any;

            // Make sure the type actually exists in functions
            if (!this.functions.hasOwnProperty(name)) {
                throw new Error("Unknown type given to ObjectMakr: " + name);
            }

            // Create the new object, copying any given settings
            output = new this.functions[name]();
            if (settings) {
                this.proliferate(output, settings);
            }

            // onMake triggers are handled respecting doPropertiesFull.
            if (this.onMake && output[this.onMake]) {
                if (this.doPropertiesFull) {
                    output[this.onMake](
                        output, name, this.properties[name], this.propertiesFull[name]
                    );
                } else {
                    output[this.onMake](
                        output, name, this.properties[name], this.functions[name].prototype
                    );
                }
            }

            return output;
        }


        /* Core parsing
        */

        /**
         * Parser that calls processPropertyArray on all properties given as arrays
         * 
         * @param {Object} properties   The object of function properties
         * @remarks Only call this if indexMap is given as an array
         */
        private processProperties(properties: any): void {
            var name: string;

            // For each of the given properties:
            for (name in properties) {
                if (this.properties.hasOwnProperty(name)) {
                    // If it's an array, replace it with a mapped version
                    if (this.properties[name] instanceof Array) {
                        this.properties[name] = this.processPropertyArray(this.properties[name]);
                    }
                }
            }
        }

        /**
         * Creates an output properties object with the mapping shown in indexMap
         * 
         * @param {Array} properties   An array with indiced versions of properties
         * @example indexMap = ["width", "height"];
         *          properties = [7, 14];
         *          output = processPropertyArray(properties);
         *          // output is now { "width": 7, "height": 14 }
         */
        private processPropertyArray(properties: any[]): any {
            var output: any = {},
                i: number;

            // For each [i] in properties, set that property as under indexMap[i]
            for (i = properties.length - 1; i >= 0; --i) {
                output[this.indexMap[i]] = properties[i];
            }

            return output;
        }

        /**
         * Recursive parser to generate each function, starting from the base.
         * 
         * @param {Object} base   An object whose keys are the names of functions to
         *                        made, and whose values are objects whose keys are
         *                        for children that inherit from these functions
         * @param {Function} parent   The parent function of the functions about to
         *                            be made
         * @param {String} parentName   The name of the parent Function to be
         *                              inherited from.
         * @remarks This may use eval, which is evil and almost never a good idea, 
         *          but here it's the only way to make functions with dynamic names.
         */
        private processFunctions(base: any, parent: any, parentName: string): void {
            var name: string,
                ref: string;

            // For each name in the current object:
            for (name in base) {
                if (base.hasOwnProperty(name)) {
                    this.functions[name] = <IObjectMakrClassFunction>(new Function());

                    // This sets the function as inheriting from the parent
                    this.functions[name].prototype = new parent();
                    this.functions[name].prototype.constructor = this.functions[name];

                    // Add each property from properties to the function prototype
                    for (ref in this.properties[name]) {
                        if (this.properties[name].hasOwnProperty(ref)) {
                            this.functions[name].prototype[ref] = this.properties[name][ref];
                        }
                    }

                    // If the entire property tree is being mapped, copy everything
                    // from both this and its parent to its equivalent
                    if (this.doPropertiesFull) {
                        this.propertiesFull[name] = {};

                        if (parentName) {
                            for (ref in this.propertiesFull[parentName]) {
                                if (this.propertiesFull[parentName].hasOwnProperty(ref)) {
                                    this.propertiesFull[name][ref]
                                    = this.propertiesFull[parentName][ref];
                                }
                            }
                        }

                        for (ref in this.properties[name]) {
                            if (this.properties[name].hasOwnProperty(ref)) {
                                this.propertiesFull[name][ref] = this.properties[name][ref];
                            }
                        }
                    }

                    this.processFunctions(base[name], this.functions[name], name);
                }
            }
        }


        /* Utilities
        */

        /**
         * Proliferates all members of the donor to the recipient recursively, as
         * a deep copy.
         * 
         * @param {Object} recipient   An object receiving the donor's members.
         * @param {Object} donor   An object whose members are copied to recipient.
         * @param {Boolean} [noOverride]   If recipient properties may be overriden
         *                                 (by default, false).
         */
        private proliferate(recipient: any, donor: any, noOverride: boolean = false): void {
            var setting: any,
                i: string;

            // For each attribute of the donor
            for (i in donor) {
                // If noOverride is specified, don't override if it already exists
                if (noOverride && recipient.hasOwnProperty(i)) {
                    continue;
                }

                // If it's an object, recurse on a new version of it
                setting = donor[i];
                if (typeof setting === "object") {
                    if (!recipient.hasOwnProperty(i)) {
                        recipient[i] = new setting.constructor();
                    }
                    this.proliferate(recipient[i], setting, noOverride);
                } else {
                    // Regular primitives are easy to copy otherwise
                    recipient[i] = setting;
                }
            }
            return recipient;
        }
    }
}
