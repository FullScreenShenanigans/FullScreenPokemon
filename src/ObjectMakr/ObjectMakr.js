/**
 * ObjectMakr.js
 * 
 * An Abstract Factory for JavaScript classes that automates the process of 
 * setting constructors' prototypal inheritance. A sketch of class inheritance 
 * and a listing of properties for each class is taken in, and dynamically
 * accessible function constructors are made available.
 * 
 * @example
 * // Creating and using an ObjectMakr to generate a shape class hierarchy.
 * var ObjectMaker = new ObjectMakr({
 *     "inheritance": {
 *         "Circle": {},
 *         "Rectangle": {
 *             "Square": {}
 *     },
 *     "properties": {
 *         "Circle": {
 *             "perimeter": "2 * pi * radius",
 *             "area": "pi * radius ^ 2"
 *         },
 *         "Rectangle": {
 *             "perimeter": "2 * length + 2 * width",
 *             "area": "length * width"
 *         },
 *         "Square": {
 *             "perimeter": "4 * width",
 *             "area": "width ^ 2"
 *         }
 *     }
 * });
 * console.log(ObjectMaker.make("Square")); // Square {constructor: function... 
 * console.log(ObjectMaker.make("Square").area); // "width ^ 2
 * console.log(ObjectMaker.getFunction("Square")); // function Square() {}
 * 
 * @example
 * // Creating and using an ObjectMakr to generate a shape class hierarchy using 
 * // an index mapping.
 * var ObjectMaker = new ObjectMakr({
 *     "indexMap": ["perimeter", "area"],
 *     "inheritance": {
 *         "Circle": {},
 *         "Rectangle": {
 *             "Square": {}
 *     },
 *     "properties": {
 *         "Circle": ["2 * pi * radius", "pi * radius ^ 2"],
 *         "Rectangle": ["2 * length + 2 * width", "area": "length * width"],
 *         "Square": ["perimeter": "4 * width", "area": "width ^ 2"]
 *     }
 * });
 * console.log(ObjectMaker.make("Square")); // Square {constructor: function... 
 * console.log(ObjectMaker.make("Square").area); // "width ^ 2
 * console.log(ObjectMaker.getFunction("Square")); // function Square() {}
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ObjectMakr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ObjectMakr(settings);
    }
    var self = this,

        // The sketch of classes inheritance, keyed by name.
        inheritance,

        // An associative array of type properties, as "name" => {properties}.
        properties,

        // Stored keys for the functions to be made.
        functions,
        
        // Whether a full property mapping should be made for each type
        doPropertiesFull,
        
        // If doPropertiesFull, a version of properties that contains the sum
        // properties for each type (rather than missing inherited attributes).
        propertiesFull,

        // Optionally, how properties can be mapped from an array to an object.
        indexMap,

        // Optionally, an index of a function to be run when an object is made.
        onMake;

    /**
     * 
     */
    self.reset = function (settings) {
        inheritance = settings.inheritance;
        properties = settings.properties || {};
        indexMap = settings.indexMap;
        onMake = settings.onMake;
        doPropertiesFull = settings.doPropertiesFull;
        
        if (!inheritance) {
            throw new Error("No inheritance mapping given to ObjectMakr.");
        }

        functions = {};
        
        if (doPropertiesFull) {
            propertiesFull = {};
        }

        if (indexMap) {
            processProperties(properties);
        }

        processFunctions(inheritance, Object);
    };
    
    
    /* Simple gets
    */
    

    /**
     * @return {Object} The complete inheritance mapping Object.
     */
    self.getInheritance = function () {
        return inheritance;
    };

    /**
     * @return {Object} The complete properties mapping Object.
     */
    self.getProperties = function () {
        return properties;
    };

    /**
     * @return {Object} The properties Object for a particular class.
     */
    self.getPropertiesOf = function (title) {
        return properties[title];
    };

    /**
     * @return {Object} The full properties Object, if doPropertiesFull is on.
     */
    self.getFullProperties = function () {
        return propertiesFull;
    };
    
    /**
     * @return {Object} The full properties Object for a particular class, if
     *                  doPropertiesFull is on.
     */
    self.getFullPropertiesOf = function (title) {
        return doPropertiesFull ? propertiesFull[title] : undefined;
    };
    
    /**
     * @return {Object} The full mapping of class constructors.
     */
    self.getFunctions = function () {
        return functions;
    };

    /**
     * @param {String} type   The name of a class to retrieve.
     * @return {Function}   The constructor for the given class.
     */
    self.getFunction = function (type) {
        return functions[type];
    };

    /**
     * @param {String} type   The name of a class to check for.
     * @return {Boolean} Whether that class exists.
     */
    self.hasFunction = function (type) {
        return functions.hasOwnProperty(type);
    };


    /* Core usage
    */

    /**
     * Creates a new instance of the given type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     *
     * @param {String} type   The type for which a new object of is being made.
     * @param {Objetct} [settings]   Additional attributes to add to the newly
     *                               created Object.
     * @return {Mixed}
     */
    self.make = function (type, settings) {
        var output;

        // Make sure the type actually exists in functions
        if (!functions.hasOwnProperty(type)) {
            throw new Error("Unknown type given to ObjectMakr: " + type);
        }
        
        // Create the new object, copying any given settings
        output = new functions[type]();
        if (settings) {
            proliferate(output, settings);
        }

        // onMake triggers are handled respecting doPropertiesFull.
        if (onMake && output[onMake]) {
            if (doPropertiesFull) {
                output[onMake](
                    output, type, properties[type], propertiesFull[type]
                );
            } else {
                output[onMake](
                    output, type, properties[type], functions[type].prototype
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
    function processProperties(properties) {
        var name, property;

        // For each of the given properties:
        for (name in properties) {
            if (properties.hasOwnProperty(name)) {
                // If it's an array, replace it with a mapped version
                if (properties[name] instanceof Array) {
                    properties[name] = processPropertyArray(properties[name]);
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
    function processPropertyArray(properties) {
        var output = {},
            i;

        // For each [i] in properties, set that property as under indexMap[i]
        for (i = properties.length - 1; i >= 0; --i) {
            output[indexMap[i]] = properties[i];
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
     * @remarks This uses eval which is evil and almost never a good idea, but
     *          here it's the only way to make functions with dynamic names.
     */
    function processFunctions(base, parent, parentName) {
        var name, ref;

        // For each name in the current object:
        for (name in base) {
            if (base.hasOwnProperty(name)) {
                // Clean the name, so the user can't mess anything up
                name = cleanFunctionName(name);

                // Eval is evil, you should *almost* never use it!
                // cleanFunctionName(name) ensures this is "safe", though slow.
                eval("functions[name] = function " + name + "() {};");

                // This sets the function as inheriting from the parent
                functions[name].prototype = new parent();
                functions[name].prototype.constructor = functions[name];

                // Add each property from properties to the function prototype
                for (ref in properties[name]) {
                    if (properties[name].hasOwnProperty(ref)) {
                        functions[name].prototype[ref] = properties[name][ref];
                    }
                }
                
                // If the entire property tree is being mapped, copy everything
                // from both this and its parent to its equivalent
                if (doPropertiesFull) {
                    propertiesFull[name] = {};
                    
                    if (parentName) {
                        for (ref in propertiesFull[parentName]) {
                            if (propertiesFull[parentName].hasOwnProperty(ref)) {
                                propertiesFull[name][ref] 
                                    = propertiesFull[parentName][ref];
                            }
                        }
                    }
                    
                    for (ref in properties[name]) {
                        if (properties[name].hasOwnProperty(ref)) {
                            propertiesFull[name][ref] = properties[name][ref];
                        }
                    }
                }

                processFunctions(base[name], functions[name], name);
            }
        }
    }


    /* Utilities
    */

    /**
     * Takes a desired function name, and strips any unsafe characters from it.
     * Allowed chars are the RegExp \w filter, so A-Z, a-z, 0-9, and _. 
     *
     * @param {String} str   A potentially unsafe function name to be made safe.
     * @return {String} A generally safer version of the function name.
     * @remarks The goal of this function is to make names safe for eval (yes,
     *          eval), not to allow full semantic compatibility (some improper
     *          names, like those starting with numbers, are not filtered out). 
     */
    function cleanFunctionName(str) {
        return str.replace(/[^\w]/g, '');
    }

    /**
     * Proliferates all members of the donor to the recipient recursively. This
     * is therefore a deep copy.
     * 
     * @param {Object} recipient   An object receiving the donor's members.
     * @param {Object} donor   An object whose members are copied to recipient.
     * @param {Boolean} noOverride   If recipient properties may be overriden.
     */
    function proliferate(recipient, donor, noOverride) {
        var setting, i;
        // For each attribute of the donor
        for (i in donor) {
            // If noOverride is specified, don't override if it already exists
            if (noOverride && recipient.hasOwnProperty(i)) continue;

            // If it's an object, recurse on a new version of it
            setting = donor[i];
            if (typeof setting === "object") {
                if (!recipient.hasOwnProperty(i)) {
                    recipient[i] = new setting.constructor();
                }
                proliferate(recipient[i], setting, noOverride);
            }
            // Regular primitives are easy to copy otherwise
            else {
                recipient[i] = setting;
            }
        }
        return recipient;
    }
    

    self.reset(settings || {});
}