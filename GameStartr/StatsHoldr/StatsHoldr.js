/**
 * StatsHoldr.js
 * 
 * A versatile container to store and manipulate values in localStorage, and
 * optionally keep an updated HTML container showing these values. Operations 
 * such as setting, increasing/decreasing, and default values are all abstracted
 * automatically. Values are stored in memory as well as in localStorage for
 * fast lookups.
 * Each StatsHoldr instance requires proliferate and createElement functions 
 * (such as those given by the EightBittr prototype).
 * 
 * @example
 * // Creating and using a StatsHoldr to store user statistics.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * console.log(StatsHolder.get("bestStage")); // "Middle"
 * console.log(StatsHolder.get("bestScore")); // "9001"
 * 
 * @example
 * // Creating and using a StatsHoldr to show user statistics in HTML elements.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "doMakeContainer": true,
 *     "containers": [
 *         ["table", {
 *             "id": "StatsOutside",
 *             "style": {
 *                 "textTransform": "uppercase"
 *             }
 *         }],
 *         ["tr", {
 *             "id": "StatsInside"
 *         }]
 *     ],
 *     "defaults": {
 *         "element": "td"
 *     },
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "hasElement": true,
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "hasElement": true,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * document.body.appendChild(StatsHolder.getContainer());
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function StatsHoldr(settings) {
    "use strict";
    if (!this || this === window) {
        return new StatsHoldr(settings);
    }
    var self = this,

        // The objects being stored, keyed as Object<Object>.
        values,

        // Default attributes for value, as Object<Object>.
        defaults,
        
        // A reference to localStorage or a replacement object.
        localStorage,

        // A prefix to store things under in localStorage.
        prefix,

        // A container element containing children for each value's element.
        container,

        // An Array of elements as createElement arguments, outside-to-inside.
        containers,
        
        // Any hard-coded changes to element content, such as "INF" for Infinity
        displayChanges,

        // An Array of objects to be passed to triggered events.
        callbackArgs,
        
        // Helper Function to copy Object attributes, such as from EightBittr.
        proliferate,
        
        // Helper Function to create an element, such as from EightBittr.
        createElement;
    
    /**
     * Resets the StatsHoldr.
     * 
     * @constructor
     * @param {String} prefix   A String prefix to prepend to key names in 
     *                          localStorage.
     * @param {Function} proliferate   A Function that takes in a recipient 
     *                                 Object and a donor Object, and copies
     *                                 attributes over. Generally given by
     *                                 EightBittr.prototype to minimize 
     *                                 duplicate code.
     * @param {Function} createElement   A Function to create an Element of a
     *                                   given String type and apply attributes
     *                                   from subsequent Objects. Generally 
     *                                   given by EightBittr.prototype to reduce
     *                                   duplicate code.
     * @param {Object} [values]   The keyed values to be stored, as well as all
     *                            associated information with them. The names of
     *                            values are keys in the values Object.
     * @param {Object} [localStorage]   A substitute for localStorage, generally
     *                                  used as a shim (defaults to window's 
     *                                  localStorage, or a new Object if that
     *                                  does not exist).
     * @param {Boolean} [doMakeContainer]   Whether an HTML container with 
     *                                      children for each value should be
     *                                      made (defaults to false).
     * @param {Object} [defaults]   Default attributes for each value.
     * @param {Array} [callbackArgs]   Arguments to pass via Function.apply to 
     *                                 triggered callbacks (defaults to []).
     */
    self.reset = function (settings) {
        prefix = settings.prefix;
        proliferate = settings.proliferate;
        createElement = settings.createElement;
        callbackArgs = settings.callbackArgs || [];
        localStorage = settings.localStorage || window.localStorage || {};
        
        defaults = settings.defaults || {};
        displayChanges = settings.displayChanges || {};

        values = {};
        if (settings.values) {
            for (var key in settings.values) {
                self.addStatistic(key, settings.values[key]);
            }
        }

        if (settings.doMakeContainer) {
            containers = settings.containers || [
                ["div", {
                    "className": prefix + "_container"
                }]
            ]
            container = makeContainer(settings.containers);
        }
    };
    
    
    /* Retrieval
     */
     
    /**
     * @return {String[]} The names of all value's keys.
     */
    self.getKeyNames = function () {
        return Object.keys(values);
    };

    /**
     * @param {String} key   The key for a known value.
     * @return {Mixed} The known value of a key, assuming that key exists.
     */
    self.get = function (key) {
        checkExistence(key);
        
        return values[key].value;
    }
    
    /**
     * @param {String} key   The key for a known value.
     * @return {Object} The settings for that particular key.
     */
    self.getObject = function (key) {
        return values[key];
    }
    
    
    /* Values
    */
    
    /**
     * Adds a new key & value pair to by linking to a newly created Value.
     * 
     * @param {String} key   The key to reference by new Value by.
     * @param {Object} settings   The settings for the new Value.
     * @return {Value} The newly created Value.
     */
    self.addStatistic = function (key, settings) {
        return values[key] = new Value(key, settings);
    };
    
    /**
     * Creates a new Value with the given key and settings. Defaults are given
     * to the value via proliferate before the settings.
     * 
     * @constructor
     * @param {String} key   The key to reference this new Value by.
     * @param {Object} settings   The settings for the new Value.
     * @param {Mixed} [value]   The actual value for this Value (defaults to
     *                          this.valueDefault).
     * @param {Mixed} [valueDefault]   A default value to use if no value is
     *                                 provided (by default, "").
     * @param {Boolean} [hasElement]   Whether an HTML element should be created
     *                                 and stored in the container (by default,
     *                                 false).
     * @param {String} [element]   The tag name for the HTML element, if 
     *                             hasElement is true (defaults to "div").
     * @param {Boolean} [storeLocally]   Whether to store this as a key/value
     *                                   pair in localStorage.
     * @param {Object} [triggers]   A mapping of any values that, if hit, should 
     *                              result in a mapped callback being called.
     * @param {Number} [modularity]   A Number value to call onModular when the
     *                                value is modular with, if a Number.
     * @param {Function} [onModular]   A callback to be colled when modularity
     *                                 is hit.
     * @param {Number} [digits]   The minimum number of digits to display for a
     *                            Number's HTML element (so 7 becomes "007" if
     *                            digits is 3).
     * @param {Number} [minimum]   A "minimum" value below which Number values
     *                             may not go.
     * @param {Function} [onMinimum]   A calback for when the Number value hits
     *                                 the minimum.
     * @param {Number} [maximum]   A "maximum" value below which Number values
     *                             may not go.   
     * @param {Function} [onMaximum]   A calback for when the Number value hits
     *                                 the maximum.
     * @remarks The actual Function arguments are key and settings; all 
     *          subsequent arguments are members of settings.
     */
    function Value(key, settings) {
        this.key = key;
        
        proliferate(this, defaults);
        proliferate(this, settings);

        if (!this.hasOwnProperty("value")) {
            this.value = this.valueDefault;
        }
        
        if (this.hasElement) {
            this.element = createElement(this.element || "div", {
                className: prefix + "_value " + key
            });
            this.element.appendChild(createElement("div", {
                "textContent": key
            }));
            this.element.appendChild(createElement("div", {
                "textContent": this.value
            }));
        }

        if (this.storeLocally) {
            // If there exists an old version of this property, get it 
            if (localStorage.hasOwnProperty([prefix + key])) {
                var reference = localStorage[prefix + key],
                    constructor;

                // If possible, use the same type as valueDefault
                // This ensure 7 doesn't get converted to "7" or vice-versa.
                if (this.hasOwnProperty("value")) {
                    if (this.value === null || this.value === undefined) {
                        constructor = false;
                    } else {
                        constructor = this.value.constructor;
                    }
                } else if (this.hasOwnProperty("valueDefault")) {
                    constructor = this.valueDefault.constructor;
                }
                
                this.value = constructor ? new constructor(reference).valueOf() : reference;
                
                // Remember: false will be stored as "false", which is truthy!
                if (this.value.constructor === Boolean) {
                    console.warn(
                        "Key '" + key + "' is a boolean instead of a Number, "
                        + "which will always save to true."
                    );
                }
            }
            // Otherwise save the new version to memory
            else {
                this.updateLocalStorage();
            }
        }
    }
    
    /**
     * General update Function to be run whenever the internal value is changed.
     * It runs all the trigger, modular, etc. checks, updates the HTML element
     * if there is one, and updates localStorage if needed.
     * 
     * @this {Value}
     */
    Value.prototype.update = function () {
        // Mins and maxes must be obeyed before any other considerations
        if (
            this.hasOwnProperty("minimum") 
            && Number(this.value) <= Number(this.minimum)
        ) {
            this.value = this.minimum;
            if (this.onMinimum) {
                this.onMinimum.apply(this, callbackArgs);
            }
        } else if (
            this.hasOwnProperty("maximum") 
            && Number(this.value) <= Number(this.maximum)
        ) {
            this.value = this.maximum;
            if (this.on_maximum) {
                this.on_maximum.apply(this, callbackArgs);
            }
        }
    
        if (this.modularity) {
            this.checkModularity();
        }
        
        if (this.triggers) {
            this.checkTriggers();
        }
        
        if (this.hasElement) {
            this.updateElement();
        }
        
        if (this.storeLocally) {
            this.updateLocalStorage();
        }
    };
    
    /**
     * Checks if the current value should trigger a callback, and if so calls 
     * it.
     * 
     * @this {Value}
     */
    Value.prototype.checkTriggers = function () {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value].apply(this, callbackArgs);
        }
    };
    
    /**
     * Checks if the current value is greater than the modularity (assuming
     * modular is a non-zero Numbers), and if so, continuously reduces value and 
     * calls this.onModular.
     * 
     * @this {Value}
     */
    Value.prototype.checkModularity = function () {
        if (this.value.constructor !== Number || !this.modularity) {
            return;
        }
        
        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.onModular) {
                this.onModular.apply(this, callbackArgs);
            }
        }
    };
    
    /**
     * Updates the Value's element's second child to be the Value's value.
     * 
     * @this {Value}
     */
    Value.prototype.updateElement = function () {
        if (displayChanges.hasOwnProperty(this.value)) {
            this.element.children[1].textContent = displayChanges[this.value];
        } else {
            this.element.children[1].textContent = this.value;
        }
    };
    
    /**
     * Stores a Value's value in localStorage under the prefix plus its key.
     * 
     * @this {Value}
     */
    Value.prototype.updateLocalStorage = function () {
        localStorage[prefix + this.key] = this.value;
    };


    /* Updating values
     */
    
    /**
     * Sets the value for the Value under the given key, then updates the Value
     * (including the Value's element and localStorage, if needed).
     * 
     * @param {String} key   The key of the Value.
     * @param {Mixed} value   The new value for the Value.
     */
    self.set = function (key, value) {
        checkExistence(key);
        
        values[key].value = value;
        values[key].update();
    }
    
    /**
     * Increases the value for the Value under the given key, via addition for
     * Numbers or concatenation for Strings.
     * 
     * @param {String} key   The key of the Value.
     * @param {Mixed} [amount]   The amount to increase by (by default, 1).
     */
    self.increase = function (key, amount) {
        checkExistence(key);
        
        values[key].value += arguments.length > 1 ? amount : 1;
        values[key].update();
    }
    
    /**
     * Increases the value for the Value under the given key, via addition for
     * Numbers or concatenation for Strings.
     * 
     * @param {String} key   The key of the Value.
     * @param {Mixed} [amount]   The amount to increase by (by default, 1).
     */
    self.decrease = function (key, value) {
        checkExistence(key);
        
        values[key].value -= arguments.length > 1 ? value : 1;
        values[key].update();
    }

    /**
     * Toggles whether a value is 1 or 0.
     * 
     * @param {String} key   The key of the Value.
     * @remarks Toggling requires the type to be a Boolean, since true becomes 
     *          "true" becomes NaN.
     */
    self.toggle = function (key) {
        checkExistence(key);
        values[key].value = values[key].value ? 0 : 1;
        values[key].update();
    }

    /**
     * Ensures a key exists in values, and throws an Error if it doesn't.
     * 
     * @param {String} key
     */
    function checkExistence(key) {
        if (!values.hasOwnProperty(key)) {
            throw new Error("Unknown key given to StatsHoldr: '" + key + "'.");
        }
    }
    

    /* HTML helpers
    */

    /**
     * @return {HTMLElement} The container Element, if it exists.
     */
    self.getContainer = function () {
        return container;
    };

    /**
     * Hides the container Element by setting its visibility to hidden.
     */
    self.hideContainer = function () {
        container.style.visibility = "hidden";
    };

    /**
     * Shows the container Element by setting its visibility to visible.
     */
    self.displayContainer = function () {
        container.style.visibility = "visible";
    };

    /**
     * Creates the container Element, which contains a child for each Value that
     * specifies hasElement to be true.
     * 
     * @param {Mixed[][]} containers   An Array representing the Element to be
     *                                 created and the children between it and 
     *                                 the contained Values. Each contained 
     *                                 Mixed[]  has a String tag name as its 
     *                                 first member, followed by any number of 
     *                                 Objects to apply via createElement.
     */
    function makeContainer(containers) {
        var output = createElement.apply(undefined, containers[0]),
            current = output,
            child, key, i;

        for (i = 1; i < containers.length; ++i) {
            child = createElement.apply(undefined, containers[i]);
            current.appendChild(child);
            current = child;
        }
        
        for (key in values) {
            if (values[key].hasElement) {
                child.appendChild(values[key].element);
            }
        }
        
        return output;
    }
    

    self.reset(settings || {});
}