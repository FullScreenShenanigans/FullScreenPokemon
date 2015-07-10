var ItemsHoldr;
(function (ItemsHoldr_1) {
    "use strict";
    var ItemValue = (function () {
        /**
         * Creates a new ItemValue with the given key and settings. Defaults are given
         * to the value via proliferate before the settings.
         *
         * @constructor
         * @param {ItemsHoldr} ItemsHolder   The container for this value.
         * @param {String} key   The key to reference this new ItemValue by.
         * @param {IItemValueSettings} settings   Any optional custom settings.
         */
        function ItemValue(ItemsHolder, key, settings) {
            if (settings === void 0) { settings = {}; }
            this.ItemsHolder = ItemsHolder;
            ItemsHolder.proliferate(this, ItemsHolder.getDefaults());
            ItemsHolder.proliferate(this, settings);
            this.key = key;
            if (!this.hasOwnProperty("value")) {
                this.value = this.valueDefault;
            }
            if (this.hasElement) {
                this.element = ItemsHolder.createElement(this.elementTag || "div", {
                    className: ItemsHolder.getPrefix() + "_value " + key
                });
                this.element.appendChild(ItemsHolder.createElement("div", {
                    "textContent": key
                }));
                this.element.appendChild(ItemsHolder.createElement("div", {
                    "textContent": this.value
                }));
            }
            if (this.storeLocally) {
                // If there exists an old version of this property, get it 
                if (ItemsHolder.getLocalStorage().hasOwnProperty(ItemsHolder.getPrefix() + key)) {
                    this.value = this.retrieveLocalStorage();
                }
                else {
                    // Otherwise save the new version to memory
                    this.updateLocalStorage();
                }
            }
        }
        /**
         * General update Function to be run whenever the internal value is changed.
         * It runs all the trigger, modular, etc. checks, updates the HTML element
         * if there is one, and updates localStorage if needed.
         */
        ItemValue.prototype.update = function () {
            // Mins and maxes must be obeyed before any other considerations
            if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
                this.value = this.minimum;
                if (this.onMinimum) {
                    this.onMinimum.apply(this, this.ItemsHolder.getCallbackArgs());
                }
            }
            else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
                this.value = this.maximum;
                if (this.onMaximum) {
                    this.onMaximum.apply(this, this.ItemsHolder.getCallbackArgs());
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
         * @this {ItemValue}
         */
        ItemValue.prototype.checkTriggers = function () {
            if (this.triggers.hasOwnProperty(this.value)) {
                this.triggers[this.value].apply(this, this.ItemsHolder.getCallbackArgs());
            }
        };
        /**
         * Checks if the current value is greater than the modularity (assuming
         * modular is a non-zero Numbers), and if so, continuously reduces value and
         * calls this.onModular.
         *
         * @this {ItemValue}
         */
        ItemValue.prototype.checkModularity = function () {
            if (this.value.constructor !== Number || !this.modularity) {
                return;
            }
            while (this.value >= this.modularity) {
                this.value = Math.max(0, this.value - this.modularity);
                if (this.onModular) {
                    this.onModular.apply(this, this.ItemsHolder.getCallbackArgs());
                }
            }
        };
        /**
         * Updates the ItemValue's element's second child to be the ItemValue's value.
         *
         * @this {ItemValue}
         */
        ItemValue.prototype.updateElement = function () {
            if (this.ItemsHolder.hasDisplayChange(this.value)) {
                this.element.children[1].textContent = this.ItemsHolder.getDisplayChange(this.value);
            }
            else {
                this.element.children[1].textContent = this.value;
            }
        };
        /**
         * Retrieves a ItemValue's value from localStorage, making sure not to try to
         * JSON.parse an undefined or null value.
         *
         * @return {Mixed}
         */
        ItemValue.prototype.retrieveLocalStorage = function () {
            var value = localStorage.getItem(this.ItemsHolder.getPrefix() + this.key);
            switch (value) {
                case "undefined":
                    return undefined;
                case "null":
                    return null;
            }
            if (value.constructor !== String) {
                return value;
            }
            return JSON.parse(value);
        };
        /**
         * Stores a ItemValue's value in localStorage under the prefix plus its key.
         *
         * @param {Boolean} [overrideAutoSave]   Whether the policy on saving should
         *                                       be ignored (so saving happens
         *                                       regardless). By default, false.
         */
        ItemValue.prototype.updateLocalStorage = function (overrideAutoSave) {
            if (overrideAutoSave === void 0) { overrideAutoSave = false; }
            if (this.ItemsHolder.getAutoSave() || overrideAutoSave) {
                this.ItemsHolder.getLocalStorage()[this.ItemsHolder.getPrefix() + this.key] = JSON.stringify(this.value);
            }
        };
        return ItemValue;
    })();
    ItemsHoldr_1.ItemValue = ItemValue;
    /**
     * A versatile container to store and manipulate values in localStorage, and
     * optionally keep an updated HTML container showing these values. Operations
     * such as setting, increasing/decreasing, and default values are all abstracted
     * automatically. ItemValues are stored in memory as well as in localStorage for
     * fast lookups.
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var ItemsHoldr = (function () {
        /**
         * @param {IItemsHoldrSettings} [settings]
         */
        function ItemsHoldr(settings) {
            if (settings === void 0) { settings = {}; }
            var key;
            this.prefix = settings.prefix || "";
            this.autoSave = settings.autoSave;
            this.callbackArgs = settings.callbackArgs || [];
            this.allowNewItems = settings.allowNewItems === undefined ? true : settings.allowNewItems;
            if (settings.localStorage) {
                this.localStorage = settings.localStorage;
            }
            else if (typeof localStorage === "undefined") {
                this.localStorage = this.createPlaceholderStorage();
            }
            else {
                this.localStorage = localStorage;
            }
            this.defaults = settings.defaults || {};
            this.displayChanges = settings.displayChanges || {};
            this.items = {};
            if (settings.values) {
                this.itemKeys = Object.keys(settings.values);
                for (key in settings.values) {
                    if (settings.values.hasOwnProperty(key)) {
                        this.addItem(key, settings.values[key]);
                    }
                }
            }
            else {
                this.itemKeys = [];
            }
            if (settings.doMakeContainer) {
                this.containersArguments = settings.containersArguments || [
                    ["div", {
                            "className": this.prefix + "_container"
                        }]
                ];
                this.container = this.makeContainer(settings.containersArguments);
            }
        }
        /* Simple gets
        */
        /**
         *
         */
        ItemsHoldr.prototype.key = function (index) {
            return this.itemKeys[index];
        };
        /**
         * @return {Mixed} The values contained within, keyed by their keys.
         */
        ItemsHoldr.prototype.getValues = function () {
            return this.items;
        };
        /**
         * @return {Mixed} Default attributes for values.
         */
        ItemsHoldr.prototype.getDefaults = function () {
            return this.defaults;
        };
        /**
         * @return {Mixed} A reference to localStorage or a replacment object.
         */
        ItemsHoldr.prototype.getLocalStorage = function () {
            return this.localStorage;
        };
        /**
         * @return {Boolean} Whether this should save changes to localStorage
         *                   automatically.
         */
        ItemsHoldr.prototype.getAutoSave = function () {
            return this.autoSave;
        };
        /**
         * @return {String} The prefix to store thigns under in localStorage.
         */
        ItemsHoldr.prototype.getPrefix = function () {
            return this.prefix;
        };
        /**
         * @return {HTMLElement} The container HTML element, if it exists.
         */
        ItemsHoldr.prototype.getContainer = function () {
            return this.container;
        };
        /**
         * @return {Mixed[][]} The createElement arguments for the HTML container
         *                     elements, outside-to-inside.
         */
        ItemsHoldr.prototype.getContainersArguments = function () {
            return this.containersArguments;
        };
        /**
         * @return {Mixed} Any hard-coded changes to element content.
         */
        ItemsHoldr.prototype.getDisplayChanges = function () {
            return this.displayChanges;
        };
        /**
         * @return {Mixed[]} Arguments to be passed to triggered events.
         */
        ItemsHoldr.prototype.getCallbackArgs = function () {
            return this.callbackArgs;
        };
        /* Retrieval
        */
        /**
         * @return {String[]} The names of all value's keys.
         */
        ItemsHoldr.prototype.getKeys = function () {
            return Object.keys(this.items);
        };
        /**
         * @param {String} key   The key for a known value.
         * @return {Mixed} The known value of a key, assuming that key exists.
         */
        ItemsHoldr.prototype.getItem = function (key) {
            this.checkExistence(key);
            return this.items[key].value;
        };
        /**
         * @param {String} key   The key for a known value.
         * @return {Object} The settings for that particular key.
         */
        ItemsHoldr.prototype.getObject = function (key) {
            return this.items[key];
        };
        /**
         * @param {String} key   The key for a potentially known value.
         * @return {Boolean} Whether there is a value under that key.
         */
        ItemsHoldr.prototype.hasKey = function (key) {
            return this.items.hasOwnProperty(key);
        };
        /**
         * @return {Object} A mapping of key names to the actual values of all
         *                  objects being stored.
         */
        ItemsHoldr.prototype.exportItems = function () {
            var output = {}, i;
            for (i in this.items) {
                if (this.items.hasOwnProperty(i)) {
                    output[i] = this.items[i].value;
                }
            }
            return output;
        };
        /* ItemValues
        */
        /**
         * Adds a new key & value pair to by linking to a newly created ItemValue.
         *
         * @param {String} key   The key to reference by new ItemValue by.
         * @param {Object} settings   The settings for the new ItemValue.
         * @return {ItemValue} The newly created ItemValue.
         */
        ItemsHoldr.prototype.addItem = function (key, settings) {
            if (settings === void 0) { settings = {}; }
            this.items[key] = new ItemValue(this, key, settings);
            this.itemKeys.push(key);
            return this.items[key];
        };
        /* Updating values
        */
        /**
         * Clears a value from the listing, and removes its element from the
         * container (if they both exist).
         *
         * @param {String} key   The key of the element to remove.
         */
        ItemsHoldr.prototype.removeItem = function (key) {
            if (!this.items.hasOwnProperty(key)) {
                return;
            }
            if (this.container && this.items[key].hasElement) {
                this.container.removeChild(this.items[key].element);
            }
            this.itemKeys.splice(this.itemKeys.indexOf(key), 1);
            delete this.items[key];
        };
        /**
         * Completely clears all values from the ItemsHoldr, removing their
         * elements from the container (if they both exist) as well.
         */
        ItemsHoldr.prototype.clear = function () {
            var i;
            if (this.container) {
                for (i in this.items) {
                    if (this.items[i].hasElement) {
                        this.container.removeChild(this.items[i].element);
                    }
                }
            }
            this.items = {};
            this.itemKeys = [];
        };
        /**
         * Sets the value for the ItemValue under the given key, then updates the ItemValue
         * (including the ItemValue's element and localStorage, if needed).
         *
         * @param {String} key   The key of the ItemValue.
         * @param {Mixed} value   The new value for the ItemValue.
         */
        ItemsHoldr.prototype.setItem = function (key, value) {
            this.checkExistence(key);
            this.items[key].value = value;
            this.items[key].update();
        };
        /**
         * Increases the value for the ItemValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         *
         * @param {String} key   The key of the ItemValue.
         * @param {Mixed} [amount]   The amount to increase by (by default, 1).
         */
        ItemsHoldr.prototype.increase = function (key, amount) {
            if (amount === void 0) { amount = 1; }
            this.checkExistence(key);
            this.items[key].value += arguments.length > 1 ? amount : 1;
            this.items[key].update();
        };
        /**
         * Increases the value for the ItemValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         *
         * @param {String} key   The key of the ItemValue.
         * @param {Number} [amount]   The amount to increase by (by default, 1).
         */
        ItemsHoldr.prototype.decrease = function (key, amount) {
            if (amount === void 0) { amount = 1; }
            this.checkExistence(key);
            this.items[key].value -= amount;
            this.items[key].update();
        };
        /**
         * Toggles whether a value is 1 or 0.
         *
         * @param {String} key   The key of the ItemValue.
         */
        ItemsHoldr.prototype.toggle = function (key) {
            this.checkExistence(key);
            this.items[key].value = this.items[key].value ? 0 : 1;
            this.items[key].update();
        };
        /**
         * Ensures a key exists in values. If it doesn't, and new values are
         * allowed, it creates it; otherwise, it throws an Error.
         *
         * @param {String} key
         */
        ItemsHoldr.prototype.checkExistence = function (key) {
            if (!this.items.hasOwnProperty(key)) {
                if (this.allowNewItems) {
                    this.addItem(key);
                }
                else {
                    throw new Error("Unknown key given to ItemsHoldr: '" + key + "'.");
                }
            }
        };
        /**
         * Manually saves all values to localStorage, ignoring the autoSave flag.
         */
        ItemsHoldr.prototype.saveAll = function () {
            var key;
            for (key in this.items) {
                if (this.items.hasOwnProperty(key)) {
                    this.items[key].updateLocalStorage(true);
                }
            }
        };
        /* HTML helpers
        */
        /**
         * Hides the container Element by setting its visibility to hidden.
         */
        ItemsHoldr.prototype.hideContainer = function () {
            this.container.style.visibility = "hidden";
        };
        /**
         * Shows the container Element by setting its visibility to visible.
         */
        ItemsHoldr.prototype.displayContainer = function () {
            this.container.style.visibility = "visible";
        };
        /**
         * Creates the container Element, which contains a child for each ItemValue that
         * specifies hasElement to be true.
         *
         * @param {Mixed[][]} containers   An Array representing the Element to be
         *                                 created and the children between it and
         *                                 the contained ItemValues. Each contained
         *                                 Mixed[]  has a String tag name as its
         *                                 first member, followed by any number of
         *                                 Objects to apply via createElement.
         * @return {HTMLElement}
         */
        ItemsHoldr.prototype.makeContainer = function (containers) {
            var output = this.createElement.apply(this, containers[0]), current = output, child, key, i;
            for (i = 1; i < containers.length; ++i) {
                child = this.createElement.apply(this, containers[i]);
                current.appendChild(child);
                current = child;
            }
            for (key in this.items) {
                if (this.items[key].hasElement) {
                    child.appendChild(this.items[key].element);
                }
            }
            return output;
        };
        /**
         * @return {Boolean} Whether displayChanges has an entry for a particular
         *                   value.
         */
        ItemsHoldr.prototype.hasDisplayChange = function (value) {
            return this.displayChanges.hasOwnProperty(value);
        };
        /**
         * @return {String} The displayChanges entry for a particular value.
         */
        ItemsHoldr.prototype.getDisplayChange = function (value) {
            return this.displayChanges[value];
        };
        /* Utilities
        */
        /**
         * Creates a new HTMLElement of the given type. For each Object given as
         * arguments after, each member is proliferated onto the element.
         *
         * @param {String} [tag]   The type of the HTMLElement (by default, "div").
         * @param {...args} [any[]]   Any number of Objects to be proliferated
         *                             onto the new HTMLElement.
         * @return {HTMLElement}
         */
        ItemsHoldr.prototype.createElement = function (tag) {
            if (tag === void 0) { tag = "div"; }
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var element = document.createElement(tag), i;
            // For each provided object, add those settings to the element
            for (i = 0; i < args.length; i += 1) {
                this.proliferateElement(element, args[i]);
            }
            return element;
        };
        /**
         * Proliferates all members of the donor to the recipient recursively, as
         * a deep copy.
         *
         * @param {Object} recipient   An object receiving the donor's members.
         * @param {Object} donor   An object whose members are copied to recipient.
         * @param {Boolean} [noOverride]   If recipient properties may be overriden
         *                                 (by default, false).
         */
        ItemsHoldr.prototype.proliferate = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i;
            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
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
                    }
                    else {
                        // Regular primitives are easy to copy otherwise
                        recipient[i] = setting;
                    }
                }
            }
            return recipient;
        };
        /**
         * Identical to proliferate, but tailored for HTML elements because many
         * element attributes don't play nicely with JavaScript Array standards.
         * Looking at you, HTMLCollection!
         *
         * @param {HTMLElement} recipient
         * @param {Any} donor
         * @param {Boolean} [noOverride]
         * @return {HTMLElement}
         */
        ItemsHoldr.prototype.proliferateElement = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i, j;
            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient.hasOwnProperty(i)) {
                        continue;
                    }
                    setting = donor[i];
                    // Special cases for HTML elements
                    switch (i) {
                        // Children: just append all of them directly
                        case "children":
                            if (typeof (setting) !== "undefined") {
                                for (j = 0; j < setting.length; j += 1) {
                                    recipient.appendChild(setting[j]);
                                }
                            }
                            break;
                        // Style: proliferate (instead of making a new Object)
                        case "style":
                            this.proliferate(recipient[i], setting);
                            break;
                        // By default, use the normal proliferate logic
                        default:
                            // If it's an object, recurse on a new version of it
                            if (typeof setting === "object") {
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferate(recipient[i], setting, noOverride);
                            }
                            else {
                                // Regular primitives are easy to copy otherwise
                                recipient[i] = setting;
                            }
                            break;
                    }
                }
            }
            return recipient;
        };
        /**
         * Creates an Object that can be used to create a new LocalStorage
         * replacement, if the JavaScript environment doesn't have one.
         *
         * @return {Object}
         */
        ItemsHoldr.prototype.createPlaceholderStorage = function () {
            var i, output = {
                "keys": [],
                "getItem": function (key) {
                    return this.localStorage[key];
                },
                "setItem": function (key, value) {
                    this.localStorage[key] = value;
                },
                "clear": function () {
                    for (i in this) {
                        if (this.hasOwnProperty(i)) {
                            delete this[i];
                        }
                    }
                },
                "removeItem": function (key) {
                    delete this[key];
                },
                "key": function (index) {
                    return this.keys[index];
                }
            };
            Object.defineProperties(output, {
                "length": {
                    "get": function () {
                        return output.keys.length;
                    }
                },
                "remainingSpace": {
                    "get": function () {
                        return 9001; // Is there a way to calculate this?
                    }
                }
            });
            return output;
        };
        return ItemsHoldr;
    })();
    ItemsHoldr_1.ItemsHoldr = ItemsHoldr;
})(ItemsHoldr || (ItemsHoldr = {}));
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="GBSEmulatr.d.ts" />
// @endif
// @include ../Source/GBSEmulatr.d.ts
// Explanations by Joe!
// library - store a listing of GBS files. Looks like we'll need at least 2. One for the themes, one for 
//           various pokemon sounds and other misc sound effects.
//           In audio.js the gbs data will be stored as a base64 encoded string. Later on, however, we'll
//           decode that and ascii-fy each character to play nicely with the player. 
//           then, GBSEmulatr can interpret 
//                   play("ThemeViridianCity") 
//           as something like
//                   play_music_data(decodedPayload, 10);
//           which our music player understands!
//           Of course, since there will be multiple sound files, we'll need....
// directory - our master lookup table, keyed by song/theme name. Each key will look like (at least, probably
//           going to have to add more stuff later)
//           "Theme_00_Name" : {
//                               "gbsSource" : "blue"
//                               "trackNum"  : 0
//                               }
//           Unfortunately, to save space, I don't think the theme names are included in the .gbs file, so
//           I'll scrape them from somewhere online and include them in audio.js.
var GBSEmulatr;
(function (GBSEmulatr_1) {
    "use strict";
    /**
     * An audio library to automate loading and controlled playback of Gameboy audio
     * tracks via the ASM module.
     *
     * @author "Joe Pringle" <explodingp@gmail.com>
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var GBSEmulatr = (function () {
        /**
         * @param {IGBSEmulatrSettings} settings
         */
        function GBSEmulatr(settings) {
            if (typeof settings.ItemsHolder === "undefined") {
                console.error("No ItemsHolder given to GBSEmulatr.");
            }
            if (typeof settings.Module === "undefined") {
                console.error("No Module given to GBSEmulatr.");
            }
            if (typeof settings.library === "undefined") {
                console.error("No library given to GBSEmulatr.");
            }
            this.ItemsHolder = settings.ItemsHolder;
            this.Module = settings.Module;
            this.library = settings.library;
            this.context = settings.context || new AudioContext();
            // Initially, the directory is empty, and nothing is playing.
            this.directory = {};
            // Decode and ascii-fy all "gbs" library entries.
            this.decodeAll();
        }
        /* Simple gets
        */
        /**
         *
         */
        GBSEmulatr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getDirectory = function () {
            return this.directory;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getTheme = function () {
            return this.theme;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getThemeNode = function () {
            return this.themeNode;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getContext = function () {
            return this.context;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getItemsHolder = function () {
            return this.ItemsHolder;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getModule = function () {
            return this.Module;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getBufferSize = function () {
            return GBSEmulatr.bufferSize;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getInt16Max = function () {
            return GBSEmulatr.int16Max;
        };
        /**
         *
         */
        GBSEmulatr.prototype.getVolume = function () {
            return this.ItemsHolder.getItem("volume");
        };
        /**
         *
         */
        GBSEmulatr.prototype.getMuted = function () {
            return this.ItemsHolder.getItem("muted");
        };
        /* Audio functionality
        */
        /**
         *
         */
        GBSEmulatr.prototype.stop = function () {
            if (!this.themeNode) {
                return;
            }
            this.themeNode.disconnect();
            this.themeNode = undefined;
            this.theme = undefined;
        };
        /**
         *
         */
        GBSEmulatr.prototype.clearAll = function () {
            console.error("Not implemented.");
        };
        /**
         *
         */
        GBSEmulatr.prototype.setMutedOn = function () {
            console.error("Not implemented.");
        };
        /**
         *
         */
        GBSEmulatr.prototype.setMutedOff = function () {
            console.error("Not implemented.");
        };
        /**
         *
         */
        GBSEmulatr.prototype.toggleMuted = function () {
            console.error("Not implemented.");
        };
        /**
         * Plays a sound or theme, keyed by track name.
         *
         * @example GBSEmulator.play("openingTheme");
         */
        GBSEmulatr.prototype.play = function (track) {
            if (this.themeNode) {
                this.stop();
            }
            var folder = this.directory[track].gbsSource, payload = this.library[folder].gbsDecoded, subtune = this.directory[track].trackNum, 
            // Required for libgme.js
            ref = this.Module.allocate(1, "i32", this.Module.ALLOC_STATIC), emu;
            if (this.Module.ccall("gme_open_data", "number", ["array", "number", "number", "number"], [payload, payload.length, ref, this.context.sampleRate])) {
                console.error("Could not call gme_open_data.");
            }
            // Determine the type of emulator to use to play this payload.
            emu = this.Module.getValue(ref, "i32");
            if (this.Module.ccall("gme_start_track", "number", ["number", "number"], [emu, subtune])) {
                console.error("Could not call gme_start_track.");
            }
            // Actually play the track.
            this.theme = track;
            this.themeNode = this.playSong(emu);
        };
        /* Internal playing
        */
        /**
         * Private function that ACTUALLY plays the song, in user's current context.
         */
        GBSEmulatr.prototype.playSong = function (emu) {
            var node = this.context.createScriptProcessor(GBSEmulatr.bufferSize, 2, 2);
            node.onaudioprocess = this.onNodeAudioProcess.bind(this, node, emu);
            node.connect(this.context.destination);
            return node;
        };
        GBSEmulatr.prototype.onNodeAudioProcess = function (node, emu, event) {
            var buffer = this.Module.allocate(GBSEmulatr.bufferSize * 2, "i32", this.Module.ALLOC_STATIC), channels, error, temp, i, n;
            if (this.Module.ccall("gme_track_ended", "number", ["number"], [emu]) === 1) {
                // Can put any 'end-of-song' event handlers here, once GBSEmulatr is more fleshed out.
                node.disconnect();
                this.theme = null;
                return;
            }
            channels = [
                event.outputBuffer.getChannelData(0),
                event.outputBuffer.getChannelData(1)
            ];
            error = this.Module.ccall("gme_play", "number", ["number", "number", "number"], [emu, GBSEmulatr.bufferSize * 2, buffer]);
            if (error) {
                console.error("Could not call gme_play.");
            }
            for (i = 0; i < GBSEmulatr.bufferSize; i += 1) {
                for (n = 0; n < event.outputBuffer.numberOfChannels; n++) {
                    temp = (buffer
                        + (i * event.outputBuffer.numberOfChannels * 2)
                        + (n * 4));
                    channels[n][i] = this.Module.getValue(temp, "i32") / GBSEmulatr.int16Max;
                }
            }
        };
        /* Base loading
        */
        /**
         * Decodes all "gbs" entries in a library. Each entry is replaced with an
         * array of Integers 0-255 representing the decoded ASCII contents. Those
         * are referenced by track name in the main GBSEmulatr directory.
         */
        GBSEmulatr.prototype.decodeAll = function () {
            var tracks, i, j;
            for (i in this.library) {
                if (!this.library.hasOwnProperty(i)) {
                    continue;
                }
                this.library[i].gbsDecoded = atob(this.library[i].gbs)
                    .split("")
                    .map(this.getFirstCharacterCode);
                tracks = this.library[i].tracks;
                for (j in tracks) {
                    if (tracks.hasOwnProperty(j)) {
                        this.directory[j] = {
                            "gbsSource": i,
                            "trackNum": tracks[j]
                        };
                    }
                }
            }
        };
        /**
         * Helper utility to return a String's first character's code.
         */
        GBSEmulatr.prototype.getFirstCharacterCode = function (str) {
            return str.charCodeAt(0);
        };
        /**
         * General buffer size for audio node buffers.
         */
        GBSEmulatr.bufferSize = 1024 * 16;
        /**
         * Maximum value for an integer, used in channel i32 ccals.
         */
        GBSEmulatr.int16Max = Math.pow(2, 32) - 1;
        return GBSEmulatr;
    })();
    GBSEmulatr_1.GBSEmulatr = GBSEmulatr;
})(GBSEmulatr || (GBSEmulatr = {}));
