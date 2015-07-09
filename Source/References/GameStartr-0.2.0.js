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
/// <reference path="ItemsHoldr-0.2.1.ts" />
var AudioPlayr;
(function (AudioPlayr_1) {
    "use strict";
    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     * Volume and mute status are stored locally using a ItemsHoldr.
     */
    var AudioPlayr = (function () {
        /**
         * @param {IAudioPlayrSettings} settings
         */
        function AudioPlayr(settings) {
            var volumeInitial;
            if (typeof settings.library === "undefined") {
                throw new Error("No library given to AudioPlayr.");
            }
            if (typeof settings.directory === "undefined") {
                throw new Error("No directory given to AudioPlayr.");
            }
            if (typeof settings.fileTypes === "undefined") {
                throw new Error("No fileTypes given to AudioPlayr.");
            }
            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHoldr given to AudioPlayr.");
            }
            this.ItemsHolder = settings.ItemsHolder;
            this.library = settings.library;
            this.directory = settings.directory;
            this.fileTypes = settings.fileTypes;
            this.getThemeDefault = settings.getThemeDefault || "Theme";
            this.getVolumeLocal = typeof settings.getVolumeLocal === "undefined"
                ? 1 : settings.getVolumeLocal;
            // Sounds should always start blank
            this.sounds = {};
            // Preload everything!
            this.libraryLoad();
            volumeInitial = this.ItemsHolder.getItem("volume");
            if (volumeInitial === undefined) {
                this.setVolume(1);
            }
            else {
                this.setVolume(this.ItemsHolder.getItem("volume"));
            }
            this.setMuted(this.ItemsHolder.getItem("muted") || false);
        }
        /* Simple getters
        */
        /**
         * @return {Object} The listing of <audio> Elements, keyed by name.
         */
        AudioPlayr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         * @return {String[]} The allowed filetypes for audio files.
         */
        AudioPlayr.prototype.getFileTypes = function () {
            return this.fileTypes;
        };
        /**
         * @return {Object} The currently playing <audio> Elements, keyed by name.
         */
        AudioPlayr.prototype.getSounds = function () {
            return this.sounds;
        };
        /**
         * @return {HTMLAudioElement} The current playing theme's <audio> Element.
         */
        AudioPlayr.prototype.getTheme = function () {
            return this.theme;
        };
        /**
         * @return {String} The directory under which all filetype directories are
         *                  to be located.
         */
        AudioPlayr.prototype.getDirectory = function () {
            return this.directory;
        };
        /* Playback modifiers
        */
        /**
         * @return {Number} The current volume, which is a Number in [0,1],
         *                  retrieved by the ItemsHoldr.
         */
        AudioPlayr.prototype.getVolume = function () {
            return Number(this.ItemsHolder.getItem("volume") || 0);
        };
        /**
         * Sets the current volume. If not muted, all sounds will have their volume
         * updated.
         *
         * @param {Number} volume   A Number in [0,1] to set as the current volume.
         */
        AudioPlayr.prototype.setVolume = function (volume) {
            var i;
            if (!this.getMuted()) {
                for (i in this.sounds) {
                    if (this.sounds.hasOwnProperty(i)) {
                        this.sounds[i].volume = Number(this.sounds[i].getAttribute("volumeReal")) * volume;
                    }
                }
            }
            this.ItemsHolder.setItem("volume", volume.toString());
        };
        /**
         * @return {Boolean} whether this is currently muted.
         */
        AudioPlayr.prototype.getMuted = function () {
            return Boolean(Number(this.ItemsHolder.getItem("muted")));
        };
        /**
         * Calls either setMutedOn or setMutedOff as is appropriate.
         *
         * @param {Boolean} muted   The new status for muted.
         */
        AudioPlayr.prototype.setMuted = function (muted) {
            this.getMuted() ? this.setMutedOn() : this.setMutedOff();
        };
        /**
         * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
         */
        AudioPlayr.prototype.toggleMuted = function () {
            this.setMuted(!this.getMuted());
        };
        /**
         * Sets volume to 0 in all currently playing sounds and stores the muted
         * status as on in the internal ItemsHoldr.
         */
        AudioPlayr.prototype.setMutedOn = function () {
            var i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.sounds[i].volume = 0;
                }
            }
            this.ItemsHolder.setItem("muted", "1");
        };
        /**
         * Sets sound volumes to their actual volumes and stores the muted status
         * as off in the internal ItemsHoldr.
         */
        AudioPlayr.prototype.setMutedOff = function () {
            var volume = this.getVolume(), sound, i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    sound = this.sounds[i];
                    sound.volume = Number(sound.getAttribute("volumeReal")) * volume;
                }
            }
            this.ItemsHolder.setItem("muted", "0");
        };
        /* Other modifiers
        */
        /**
         * @return {Mixed} The Function or Number used as the volume setter for
         *                 "local" sounds.
         */
        AudioPlayr.prototype.getGetVolumeLocal = function () {
            return this.getVolumeLocal;
        };
        /**
         * @param {Mixed} getVolumeLocal   A new Function or Number to use as the
         *                                 volume setter for "local" sounds.
         */
        AudioPlayr.prototype.setGetVolumeLocal = function (getVolumeLocalNew) {
            this.getVolumeLocal = getVolumeLocalNew;
        };
        /**
         * @return {Mixed} The Function or String used to get the default theme for
         *                 playTheme calls.
         */
        AudioPlayr.prototype.getGetThemeDefault = function () {
            return this.getThemeDefault;
        };
        /**
         * @param {Mixed} A new Function or String to use as the source for theme
         *                names in default playTheme calls.
         */
        AudioPlayr.prototype.setGetThemeDefault = function (getThemeDefaultNew) {
            this.getThemeDefault = getThemeDefaultNew;
        };
        /* Playback
        */
        /**
         * Plays the sound of the given name. Internally, this stops any previously
         * playing sound of that name and starts a new one, with volume set to the
         * current volume and muted status. If the name wasn't previously being
         * played (and therefore a new Element has been created), an event listener
         * is added to delete it from sounds after.
         *
         * @param {String} name   The name of the sound to play.
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        AudioPlayr.prototype.play = function (name) {
            var sound, used;
            // If the sound isn't yet being played, see if it's in the library
            if (!this.sounds.hasOwnProperty(name)) {
                // If the sound also isn't in the library, it's unknown
                if (!this.library.hasOwnProperty(name)) {
                    throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'.");
                }
                sound = this.sounds[name] = this.library[name];
            }
            else {
                sound = this.sounds[name];
            }
            this.soundStop(sound);
            if (this.getMuted()) {
                sound.volume = 0;
            }
            else {
                sound.setAttribute("volumeReal", "1");
                sound.volume = this.getVolume();
            }
            this.playSound(sound);
            used = Number(sound.getAttribute("used"));
            // If this is the song's first play, let it know how to stop
            if (!used) {
                sound.setAttribute("used", String(used + 1));
                sound.addEventListener("ended", this.soundFinish.bind(this, name));
            }
            sound.setAttribute("name", name);
            return sound;
        };
        /**
         * Pauses all currently playing sounds.
         */
        AudioPlayr.prototype.pauseAll = function () {
            var i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.pauseSound(this.sounds[i]);
                }
            }
        };
        /**
         * Un-pauses (resumes) all currently paused sounds.
         */
        AudioPlayr.prototype.resumeAll = function () {
            var i;
            for (i in this.sounds) {
                if (!this.sounds.hasOwnProperty(i)) {
                    continue;
                }
                this.playSound(this.sounds[i]);
            }
        };
        /**
         * Pauses the currently playing theme, if there is one.
         */
        AudioPlayr.prototype.pauseTheme = function () {
            if (this.theme) {
                this.pauseSound(this.theme);
            }
        };
        /**
         * Resumes the theme, if there is one and it's paused.
         */
        AudioPlayr.prototype.resumeTheme = function () {
            if (this.theme) {
                this.playSound(this.theme);
            }
        };
        /**
         * Stops all sounds and any theme, and removes all references to them.
         */
        AudioPlayr.prototype.clearAll = function () {
            this.pauseAll();
            this.clearTheme();
            this.sounds = {};
        };
        /**
         * Pauses and removes the theme, if there is one.
         */
        AudioPlayr.prototype.clearTheme = function () {
            if (!this.theme) {
                return;
            }
            this.pauseTheme();
            delete this.sounds[this.theme.getAttribute("name")];
            this.theme = undefined;
        };
        /**
         * "Local" version of play that changes the output sound's volume depending
         * on the result of a getVolumeLocal call. This defaults to 1, but may be
         * less. For example, in a video game, sounds further from the viewpoint
         * should have lessened volume.
         *
         * @param {String} name   The name of the sound to play.
         * @param {Mixed} [location]   An argument for getVolumeLocal, if that's a
         *                             Function.
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        AudioPlayr.prototype.playLocal = function (name, location) {
            if (location === void 0) { location = undefined; }
            var sound = this.play(name), volumeReal;
            switch (this.getVolumeLocal.constructor) {
                case Function:
                    volumeReal = this.getVolumeLocal(location);
                    break;
                case Number:
                    volumeReal = this.getVolumeLocal;
                    break;
                default:
                    volumeReal = Number(this.getVolumeLocal) || 1;
                    break;
            }
            sound.setAttribute("volumeReal", String(volumeReal));
            if (this.getMuted()) {
                sound.volume = 0;
            }
            else {
                sound.volume = volumeReal * this.getVolume();
            }
            return sound;
        };
        /**
         * Pauses any previously playing theme and starts playback of a new theme
         * sound. This is different from normal sounds in that it normally loops and
         * is controlled by pauseTheme and co. If loop is on and the sound wasn't
         * already playing, an event listener is added for when it ends.
         *
         * @param {String} [name]   The name of the sound to be used as the theme.
         *                          If not provided, getThemeDefault is used to
         *                          provide one.
         * @param {Boolean} [loop]   Whether the theme should always loop (by
         *                           default, true).
         * @return {HTMLAudioElement} The theme's <audio> element, now playing.
         */
        AudioPlayr.prototype.playTheme = function (name, loop) {
            if (name === void 0) { name = undefined; }
            if (loop === void 0) { loop = undefined; }
            this.pauseTheme();
            // Loop defaults to true
            loop = typeof loop !== "undefined" ? loop : true;
            // If name isn't given, use the default getter
            if (typeof (name) === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }
            // If a theme already exists, kill it
            if (typeof this.theme !== "undefined" && this.theme.hasAttribute("name")) {
                delete this.sounds[this.theme.getAttribute("name")];
            }
            this.theme = this.sounds[name] = this.play(name);
            this.theme.loop = loop;
            // If it's used (no repeat), add the event listener to resume theme
            if (this.theme.getAttribute("used") === "1") {
                this.theme.addEventListener("ended", this.playTheme.bind(this));
            }
            return this.theme;
        };
        /**
         * Wrapper around playTheme that plays a sound, then a theme. This is
         * implemented using an event listener on the sound's ending.
         *
         * @param {String} [prefix]    A prefix for the sound? Not sure...
         * @param {String} [name]   The name of the sound to be used as the theme.
         *                          If not provided, getThemeDefault is used to
         *                          provide one.
         * @param {Boolean} [loop]   Whether the theme should always loop (by
         *                           default, false).
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        AudioPlayr.prototype.playThemePrefixed = function (prefix, name, loop) {
            if (prefix === void 0) { prefix = undefined; }
            if (name === void 0) { name = undefined; }
            if (loop === void 0) { loop = undefined; }
            var sound = this.play(prefix);
            this.pauseTheme();
            // If name isn't given, use the default getter
            if (typeof (name) === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }
            this.addEventListener(prefix, "ended", this.playTheme.bind(this, prefix + " " + name, loop));
            return sound;
        };
        /* Public utilities
        */
        /**
         * Adds an event listener to a currently playing sound. The sound will keep
         * track of event listeners via an .addedEvents attribute, so they can be
         * cancelled later.
         *
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "ended".
         * @param {Function} callback   The Function to be called by the event.
         */
        AudioPlayr.prototype.addEventListener = function (name, event, callback) {
            var sound = this.library[name];
            if (!sound) {
                throw new Error("Unknown name given to addEventListener: '" + name + "'.");
            }
            if (!sound.addedEvents) {
                sound.addedEvents = {};
            }
            if (!sound.addedEvents[event]) {
                sound.addedEvents[event] = [callback];
            }
            else {
                sound.addedEvents[event].push(callback);
            }
            sound.addEventListener(event, callback);
        };
        /**
         * Clears all events added by this.addEventListener to a sound under a given
         * event.
         *
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "ended".
         */
        AudioPlayr.prototype.removeEventListeners = function (name, event) {
            var sound = this.library[name], events, i;
            if (!sound) {
                throw new Error("Unknown name given to removeEventListeners: '" + name + "'.");
            }
            if (!sound.addedEvents) {
                return;
            }
            events = sound.addedEvents[event];
            if (!events) {
                return;
            }
            for (i = 0; i < events.length; i += 1) {
                sound.removeEventListener(event, events[i]);
            }
            events.length = 0;
        };
        /**
         * Adds an event listener to a sound. If the sound doesn't exist or has
         * finished playing, it's called immediately.
         *
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "onended".
         * @param {Function} callback   The Function to be called by the event.
         */
        AudioPlayr.prototype.addEventImmediate = function (name, event, callback) {
            if (!this.sounds.hasOwnProperty(name) || this.sounds[name].paused) {
                callback();
                return;
            }
            this.sounds[name].addEventListener(event, callback);
        };
        /* Private utilities
        */
        /**
         * Called when a sound has completed to get it out of sounds.
         *
         * @param {String} name   The name of the sound that just finished.
         */
        AudioPlayr.prototype.soundFinish = function (name) {
            if (this.sounds.hasOwnProperty(name)) {
                delete this.sounds[name];
            }
        };
        /**
         * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
         * function, so this is the shim to do that.
         */
        AudioPlayr.prototype.soundStop = function (sound) {
            this.pauseSound(sound);
            if (sound.readyState) {
                sound.currentTime = 0;
            }
        };
        /* Private loading / resetting
        */
        /**
         * Loads every sound defined in the library via AJAX. Sounds are loaded
         * into <audio> elements via createAudio and stored in the library.
         */
        AudioPlayr.prototype.libraryLoad = function () {
            var section, name, sectionName, j;
            // For each given section (e.g. names, themes):
            for (sectionName in this.library) {
                if (!this.library.hasOwnProperty(sectionName)) {
                    continue;
                }
                section = this.library[sectionName];
                // For each thing in that section:
                for (j in section) {
                    if (!section.hasOwnProperty(j)) {
                        continue;
                    }
                    name = section[j];
                    // Create the sound and store it in the container
                    this.library[name] = this.createAudio(name, sectionName);
                }
            }
        };
        /**
         * Creates an audio element, gives it sources, and starts preloading.
         *
         * @param {String} name
         * @param {String} sectionName
         * @return {HTMLAudioElement}
         */
        AudioPlayr.prototype.createAudio = function (name, sectionName) {
            var sound = document.createElement("audio"), sourceType, child, i;
            // Create an audio source for each child
            for (i = 0; i < this.fileTypes.length; i += 1) {
                sourceType = this.fileTypes[i];
                child = document.createElement("source");
                child.type = "audio/" + sourceType;
                child.src = this.directory + "/" + sectionName + "/" + sourceType + "/" + name + "." + sourceType;
                sound.appendChild(child);
            }
            // This preloads the sound.
            sound.volume = 0;
            sound.setAttribute("volumeReal", "1");
            sound.setAttribute("used", "0");
            this.playSound(sound);
            return sound;
        };
        /**
         * Utility to try to play a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param {HTMLAudioElement} sound
         * @return {Boolean} Whether the sound was able to play.
         */
        AudioPlayr.prototype.playSound = function (sound) {
            if (sound && sound.play) {
                sound.play();
                return true;
            }
            return false;
        };
        /**
         * Utility to try to pause a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param {HTMLAudioElement} sound
         * @return {Boolean} Whether the sound was able to pause.
         */
        AudioPlayr.prototype.pauseSound = function (sound) {
            if (sound && sound.pause) {
                sound.pause();
                return true;
            }
            return false;
        };
        return AudioPlayr;
    })();
    AudioPlayr_1.AudioPlayr = AudioPlayr;
})(AudioPlayr || (AudioPlayr = {}));
var ChangeLinr;
(function (ChangeLinr_1) {
    "use strict";
    /**
     * A general utility for transforming raw input to processed output. This is
     * done by keeping an Array of transform Functions to process input on.
     * Outcomes for inputs are cached so repeat runs are O(1).
     */
    var ChangeLinr = (function () {
        /**
         * @param {IChangeLinrSettings} settings
         */
        function ChangeLinr(settings) {
            var i;
            if (typeof settings.pipeline === "undefined") {
                throw new Error("No pipeline given to ChangeLinr.");
            }
            this.pipeline = settings.pipeline || [];
            if (typeof settings.transforms === "undefined") {
                throw new Error("No transforms given to ChangeLinr.");
            }
            this.transforms = settings.transforms || {};
            this.doMakeCache = typeof settings.doMakeCache === "undefined"
                ? true : settings.doMakeCache;
            this.doUseCache = typeof settings.doUseCache === "undefined"
                ? true : settings.doUseCache;
            this.cache = {};
            this.cacheFull = {};
            // Ensure the pipeline is formatted correctly
            for (i = 0; i < this.pipeline.length; ++i) {
                // Don't allow null/false transforms
                if (!this.pipeline[i]) {
                    throw new Error("Pipe[" + i + "] is invalid.");
                }
                // Make sure each part of the pipeline exists
                if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                    if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                        throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                            + "not found in transforms.");
                    }
                }
                // Also make sure each part of the pipeline is a Function
                if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                    throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                        + "is not a valid Function from transforms.");
                }
                this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
            }
        }
        /* Simple gets
        */
        /**
         * @return {Mixed} The cached output of this.process and this.processFull.
         */
        ChangeLinr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @param {String} key   The key under which the output was processed
         * @return {Mixed} The cached output filed under the given key.
         */
        ChangeLinr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * @return {Object} A complete listing of the cached outputs from all
         *                  processed information, from each pipeline transform.
         */
        ChangeLinr.prototype.getCacheFull = function () {
            return this.cacheFull;
        };
        /**
         * @return {Boolean} Whether the cache object is being kept.
         */
        ChangeLinr.prototype.getDoMakeCache = function () {
            return this.doMakeCache;
        };
        /**
         * @return {Boolean} Whether previously cached output is being used in new
         *                   process requests.
         */
        ChangeLinr.prototype.getDoUseCache = function () {
            return this.doUseCache;
        };
        /* Core processing
        */
        /**
         * Applies a series of transforms to input data. If doMakeCache is on, the
         * outputs of this are stored in cache and cacheFull.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Mixed} The final output of the pipeline.
         */
        ChangeLinr.prototype.process = function (data, key, attributes) {
            if (key === void 0) { key = undefined; }
            if (attributes === void 0) { attributes = undefined; }
            var i;
            if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
                key = data;
            }
            // If this keyed input was already processed, get that
            if (this.doUseCache && this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Apply (and optionally cache) each transform in order
            for (i = 0; i < this.pipeline.length; ++i) {
                data = this.transforms[this.pipeline[i]](data, key, attributes, this);
                if (this.doMakeCache) {
                    this.cacheFull[this.pipeline[i]][key] = data;
                }
            }
            if (this.doMakeCache) {
                this.cache[key] = data;
            }
            return data;
        };
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Object} The complete output of the transforms.
         */
        ChangeLinr.prototype.processFull = function (raw, key, attributes) {
            if (attributes === void 0) { attributes = undefined; }
            var output = {}, i;
            this.process(raw, key, attributes);
            for (i = 0; i < this.pipeline.length; ++i) {
                output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
            }
            return output;
        };
        return ChangeLinr;
    })();
    ChangeLinr_1.ChangeLinr = ChangeLinr;
})(ChangeLinr || (ChangeLinr = {}));
var EightBittr;
(function (EightBittr_1) {
    "use strict";
    /**
     * An abstract class used exclusively as the parent of GameStartr. EightBittr
     * contains useful functions for manipulating Things that are independent of
     * the required GameStartr modules.
     */
    var EightBittr = (function () {
        /**
         * EightBittr constructor. Settings arguments are used to initialize
         * "constant" values and check for requirements.
         *
         * @constructor
         * @param {IEightBittrSettings} settings
         */
        function EightBittr(settings) {
            if (settings === void 0) { settings = {}; }
            var EightBitter = EightBittr.prototype.ensureCorrectCaller(this), constants = settings.constants, constantsSource = settings.constantsSource || EightBitter, requirements = settings.requirements, i;
            EightBitter.unitsize = settings.unitsize || 1;
            EightBitter.constants = constants;
            if (constants) {
                for (i = 0; i < constants.length; i += 1) {
                    EightBitter[constants[i]] = constantsSource[constants[i]];
                }
            }
            EightBitter.requirements = requirements;
            if (requirements) {
                if (requirements.global) {
                    if (typeof window !== "undefined") {
                        EightBitter.checkRequirements(window, requirements.global, "global");
                    }
                }
                if (requirements.self) {
                    EightBitter.checkRequirements(EightBitter, requirements.self, "self");
                }
            }
        }
        /* Resets
        */
        /**
         * Given an associate array of requirement names to the files that should
         * include them, this makes sure each of those requirements is a property of
         * the given Object.
         *
         * @param {Mixed} scope    Generally either the window (for global checks,
         *                         such as utility classes) or an EightBitter.
         * @param {Object} requirements   An associative array of properties to
         *                                check for under scope.
         * @param {String} name   The name referring to scope, printed out in an
         *                        Error if needed.
         */
        EightBittr.prototype.checkRequirements = function (scope, requirements, name) {
            var fails = [], requirement;
            // For each requirement in the given object, if it isn't visible as a
            // member of scope (evaluates to falsy), complain
            for (requirement in requirements) {
                if (requirements.hasOwnProperty(requirement) && !scope[requirement]) {
                    fails.push(requirement);
                }
            }
            // If there was at least one failure added to the fails array, throw
            // an error with each fail split by endlines
            if (fails.length) {
                throw new Error("Missing " + fails.length + " requirement(s) "
                    + "in " + name + ".\n"
                    + fails.map(function (requirement, i) {
                        return i + ". " + requirement + ": is the '"
                            + requirements[requirement] + "' file included?";
                    }).join("\n"));
            }
        };
        /**
         * Resets the EightBittr by calling all of the named reset member Functions
         * on itself.
         *
         * @param {EightBittr} EightBitter
         * @param {String[]} resets   The ordered Array of reset Functions to be
         *                            called.
         * @param {Object} [customs]   Additional arguments to pass to all reset
         *                             Functions.
         */
        EightBittr.prototype.reset = function (EightBitter, resets, customs) {
            if (customs === void 0) { customs = undefined; }
            var reset, i;
            EightBitter.customs = customs;
            for (i = 0; i < resets.length; i += 1) {
                reset = resets[i];
                if (!EightBitter[reset]) {
                    throw new Error(reset + " is missing on a resetting EightBittr.");
                }
                EightBitter[reset](EightBitter, customs);
            }
        };
        /**
         * Resets the EightBittr in a timed manner by calling all the named reset
         * member Functions on itself and adding the time (in milliseconds) along
         * along with the total process time to an Array, which is then returned.
         *
         * @param {EightBittr} EightBitter
         * @param {String[]} resets   The ordered Array of reset Functions to be
         *                            called.
         * @param {Object} [customs]   Additional arguments to pass to all reset
         *                             Functions.
         * @return {String[]}
         */
        EightBittr.prototype.resetTimed = function (EightBitter, resets, customs) {
            if (customs === void 0) { customs = undefined; }
            var timeStart = performance.now(), times = [], timeEach, i;
            for (i = 0; i < resets.length; i += 1) {
                timeEach = performance.now();
                EightBitter[resets[i]](EightBitter, customs);
                times.push({
                    "name": resets[i],
                    "time": performance.now() - timeEach
                });
            }
            times.push({
                "name": "resetTimed",
                "time": performance.now() - timeStart
            });
            return times;
        };
        /**
         * EightBittr.get is provided as a shortcut function to make binding member
         * functions, particularily those using "this.unitsize" (where this needs to
         * be an EightBitter, not an external calling object). At the very simplest,
         * this.get(func) acts as a shortcut to this.bind(this, func).
         * In addition, if the name is given as "a.b", EightBitter.followPath will
         * be used on "a.b".split('.') (so EightBitter.prototype[a][b] is returned).
         *
         * @this {EightBittr}
         * @param {Mixed} name   Either the Function itself, or a string of the path
         *                       to the Function (after ".prototype.").
         * @return {Function}   A function, bound to set "this" to the calling
         *                      EightBitter
         */
        EightBittr.prototype.get = function (name) {
            var EightBitter = EightBittr.prototype.ensureCorrectCaller.call(this), func;
            // If name is a string, turn it into a function path, and follow it
            if (name.constructor === String) {
                func = EightBitter.followPathHard(EightBitter, name.split("."), 0);
            }
            else if (name instanceof Array) {
                // If it's already a path (array), follow it
                func = EightBitter.followPathHard(EightBitter, name, 0);
            }
            else {
                // Otherwise func is just name
                func = name;
            }
            // Don't allow func to be undefined or some non-function object
            if (typeof (func) !== "function") {
                throw new Error(name + " is not defined in this EightBitter.");
            }
            // Bind the function to this
            return func.bind(EightBitter);
        };
        /* HTML Functions
        */
        /**
         * Creates and returns a new HTML <canvas> element, with an optional scaling
         * multiplier. Image smoothing is disabled.
         *
         * @param {Number} width   How wide the canvas should be.
         * @param {Number} height   How tall the canvas should be.
         * @param {Number} [scaling]   How much to scale the style of the canvas (by
         *                             default, 1 for not at all).
         * @return {HTMLCanvasElement}
         * @remarks TypeScript does not recognize imageSmoothingEnabled unless
         *          prefixed by "ms", so context is cast to any.
         */
        EightBittr.prototype.createCanvas = function (width, height, scaling) {
            if (scaling === void 0) { scaling = 1; }
            var canvas = document.createElement("canvas"), 
            // context: CanvasRenderingContext2D = canvas.getContext("2d");
            context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            scaling = scaling || 1;
            // Scaling 1 by default, but may be different (e.g. unitsize)
            canvas.style.width = (width * scaling) + "px";
            canvas.style.height = (height * scaling) + "px";
            // For speed's sake, disable image smoothing in all browsers
            if (typeof context.imageSmoothingEnabled !== "undefined") {
                context.imageSmoothingEnabled = false;
            }
            else if (typeof context.webkitImageSmoothingEnabled !== "undefined") {
                context.webkitImageSmoothingEnabled = false;
            }
            else if (typeof context.mozImageSmoothingEnabled !== "undefined") {
                context.mozImageSmoothingEnabled = false;
            }
            else if (typeof context.msImageSmoothingEnabled !== "undefined") {
                context.msImageSmoothingEnabled = false;
            }
            else if (typeof context.oImageSmoothingEnabled !== "undefined") {
                context.oImageSmoothingEnabled = false;
            }
            return canvas;
        };
        /* Physics functions
        */
        /**
         * Shifts a Thing vertically by changing its top and bottom attributes.
         *
         * @param {Thing} thing
         * @param {Number} dy
         */
        EightBittr.prototype.shiftVert = function (thing, dy) {
            thing.top += dy;
            thing.bottom += dy;
        };
        /**
         * Shifts a Thing horizontally by changing its top and bottom attributes.
         *
         * @param {Thing} thing
         * @param {Number} dy
         */
        EightBittr.prototype.shiftHoriz = function (thing, dx) {
            thing.left += dx;
            thing.right += dx;
        };
        /**
         * Sets the top of a Thing to a set number, changing the bottom based on its
         * height and the EightBittr's unisize.
         *
         * @param {Thing} thing
         * @param {Number} top
         */
        EightBittr.prototype.setTop = function (thing, top) {
            thing.top = top;
            thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
        };
        /**
         * Sets the right of a Thing to a set number, changing the left based on its
         * width and the EightBittr's unisize.
         *
         * @param {Thing} thing
         * @param {Number} right
         */
        EightBittr.prototype.setRight = function (thing, right) {
            thing.right = right;
            thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
        };
        /**
         * Sets the bottom of a Thing to a set number, changing the top based on its
         * height and the EightBittr's unisize.
         *
         * @param {Thing} thing
         * @param {Number} bottom
         */
        EightBittr.prototype.setBottom = function (thing, bottom) {
            thing.bottom = bottom;
            thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
        };
        /**
         * Sets the left of a Thing to a set number, changing the right based on its
         * width and the EightBittr's unisize.
         *
         * @param {Thing} thing
         * @param {Number} left
         */
        EightBittr.prototype.setLeft = function (thing, left) {
            thing.left = left;
            thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
        };
        /**
         * Shifts a Thing so that it is centered on the given x and y.
         *
         * @param {Thing} thing
         * @param {Number} x
         * @param {Number} y
         */
        EightBittr.prototype.setMid = function (thing, x, y) {
            thing.EightBitter.setMidX(thing, x);
            thing.EightBitter.setMidY(thing, y);
        };
        /**
         * Shifts a Thing so that it is horizontally centered on the given x.
         *
         * @param {Thing} thing
         * @param {Number} x
         */
        EightBittr.prototype.setMidX = function (thing, x) {
            thing.EightBitter.setLeft(thing, x + thing.width * thing.EightBitter.unitsize / 2);
        };
        /**
         * Shifts a Thing so that it is vertically centered on the given y.
         *
         * @param {Thing} thing
         * @param {Number} y
         */
        EightBittr.prototype.setMidY = function (thing, y) {
            thing.EightBitter.setTop(thing, y + thing.height * thing.EightBitter.unitsize / 2);
        };
        /**
         * @param {Thing} thing
         * @return {Number} The horizontal midpoint of the Thing.
         */
        EightBittr.prototype.getMidX = function (thing) {
            return thing.left + thing.width * thing.EightBitter.unitsize / 2;
        };
        /**
         * @param {Thing} thing
         * @return {Number} The vertical midpoint of the Thing.
         */
        EightBittr.prototype.getMidY = function (thing) {
            return thing.top + thing.height * thing.EightBitter.unitsize / 2;
        };
        /**
         * Shifts a Thing so that its midpoint is centered on the midpoint of the
         * other Thing.
         *
         * @param {Thing} thing   The Thing to be shifted.
         * @param {Thing} other   The Thing whose midpoint is referenced.
         */
        EightBittr.prototype.setMidObj = function (thing, other) {
            thing.EightBitter.setMidXObj(thing, other);
            thing.EightBitter.setMidYObj(thing, other);
        };
        /**
         * Shifts a Thing so that its horizontal midpoint is centered on the
         * midpoint of the other Thing.
         *
         * @param {Thing} thing   The Thing to be shifted.
         * @param {Thing} other   The Thing whose midpoint is referenced.
         */
        EightBittr.prototype.setMidXObj = function (thing, other) {
            thing.EightBitter.setLeft(thing, thing.EightBitter.getMidX(other)
                - (thing.width * thing.EightBitter.unitsize / 2));
        };
        /**
         * Shifts a Thing so that its vertical midpoint is centered on the
         * midpoint of the other Thing.
         *
         * @param {Thing} thing   The Thing to be shifted.
         * @param {Thing} other   The Thing whose midpoint is referenced.
         */
        EightBittr.prototype.setMidYObj = function (thing, other) {
            thing.EightBitter.setTop(thing, thing.EightBitter.getMidY(other)
                - (thing.height * thing.EightBitter.unitsize / 2));
        };
        /**
         * @param {Thing} thing
         * @param {Thing} other
         * @return {Boolean} Whether the first Thing's midpoint is to the left of
         *                   the other's.
         */
        EightBittr.prototype.objectToLeft = function (thing, other) {
            return (thing.EightBitter.getMidX(thing) < thing.EightBitter.getMidX(other));
        };
        /**
         * Shifts a Thing's top up, then sets the bottom (similar to a shiftVert and
         * a setTop combined).
         *
         * @param {Thing} thing
         * @param {Number} dy
         */
        EightBittr.prototype.updateTop = function (thing, dy) {
            // If a dy is provided, move the thing's top that much
            thing.top += dy || 0;
            // Make the thing's bottom dependent on the top
            thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
        };
        /**
         * Shifts a Thing's right, then sets the left (similar to a shiftHoriz and a
         * setRight combined).
         *
         * @param {Thing} thing
         * @param {Number} dx
         */
        EightBittr.prototype.updateRight = function (thing, dx) {
            // If a dx is provided, move the thing's right that much
            thing.right += dx || 0;
            // Make the thing's left dependent on the right
            thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
        };
        /**
         * Shifts a Thing's bottom down, then sets the bottom (similar to a
         * shiftVert and a setBottom combined).
         *
         * @param {Thing} thing
         * @param {Number} dy
         */
        EightBittr.prototype.updateBottom = function (thing, dy) {
            // If a dy is provided, move the thing's bottom that much
            thing.bottom += dy || 0;
            // Make the thing's top dependent on the top
            thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
        };
        /**
         * Shifts a Thing's left, then sets the right (similar to a shiftHoriz and a
         * setLeft combined).
         *
         * @param {Thing} thing
         * @param {Number} dy
         */
        EightBittr.prototype.updateLeft = function (thing, dx) {
            // If a dx is provided, move the thing's left that much
            thing.left += dx || 0;
            // Make the thing's right dependent on the left
            thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
        };
        /**
         * Shifts a Thing toward a target x, but limits the total distance allowed.
         * Distance is computed as from the Thing's horizontal midpoint.
         *
         * @param {Thing} thing
         * @param {Number} x
         * @param {Number} maxSpeed
         */
        EightBittr.prototype.slideToX = function (thing, x, maxSpeed) {
            var midx = thing.EightBitter.getMidX(thing);
            // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
            maxSpeed = maxSpeed || Infinity;
            // Thing to the left? Slide to the right.
            if (midx < x) {
                thing.EightBitter.shiftHoriz(thing, Math.min(maxSpeed, (x - midx)));
            }
            else {
                // Thing to the right? Slide to the left.
                thing.EightBitter.shiftHoriz(thing, Math.max(-maxSpeed, (x - midx)));
            }
        };
        /**
         * Shifts a Thing toward a target y, but limits the total distance allowed.
         * Distance is computed as from the Thing's vertical midpoint.
         *
         * @param {Thing} thing
         * @param {Number} y
         * @param {Number} maxSpeed
         */
        EightBittr.prototype.slideToY = function (thing, y, maxSpeed) {
            var midy = thing.EightBitter.getMidY(thing);
            // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
            maxSpeed = maxSpeed || Infinity;
            // Thing above? slide down.
            if (midy < y) {
                thing.EightBitter.shiftVert(thing, Math.min(maxSpeed, (y - midy)));
            }
            else {
                // Thing below? Slide up.
                thing.EightBitter.shiftVert(thing, Math.max(-maxSpeed, (y - midy)));
            }
        };
        /* EightBittr utilities
        */
        /**
         * Ensures the current object is an EightBittr by throwing an error if it
         * is not. This should be used for functions in any EightBittr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         *
         * @param {Mixed} current
         */
        EightBittr.prototype.ensureCorrectCaller = function (current) {
            if (!(current instanceof EightBittr)) {
                throw new Error("A function requires the caller ('this') to be the "
                    + "manipulated EightBittr object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        };
        /* General utilities
        */
        /**
         * "Proliferates" all properties of a donor onto a recipient by copying each
         * of them and recursing onto child Objects. This is a deep copy.
         *
         * @param {Mixed} recipient
         * @param {Mixed} donor
         * @param {Boolean} [noOverride]   Whether pre-existing properties of the
         *                                 recipient should be skipped (defaults to
         *                                 false).
         * @return {Mixed} recipient
         */
        EightBittr.prototype.proliferate = function (recipient, donor, noOverride) {
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
         * Identical to proliferate, but instead of checking whether the recipient
         * hasOwnProperty on properties, it just checks if they're truthy
         *
         * @param {Mixed} recipient
         * @param {Mixed} donor
         * @param {Boolean} [noOverride]   Whether pre-existing properties of the
         *                                 recipient should be skipped (defaults to
         *                                 false).
         * @return {Mixed} recipient
         * @remarks This may not be good with JSLint, but it works for prototypal
         *          inheritance, since hasOwnProperty only is for the current class
         */
        EightBittr.prototype.proliferateHard = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i;
            // For each attribute of the donor:
            for (i in donor) {
                if (donor.hasOwnProperty(i)) {
                    // If noOverride, don't override already existing properties
                    if (noOverride && recipient[i]) {
                        continue;
                    }
                    // If it's an object, recurse on a new version of it
                    setting = donor[i];
                    if (typeof setting === "object") {
                        if (!recipient[i]) {
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
        EightBittr.prototype.proliferateElement = function (recipient, donor, noOverride) {
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
                            // If it's null, don't do anything (like .textContent)
                            if (setting === null) {
                                recipient[i] = null;
                            }
                            else if (typeof setting === "object") {
                                // If it's an object, recurse on a new version of it
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
         * Creates and returns an HTMLElement of the specified type. Any additional
         * settings Objects may be given to be proliferated onto the Element via
         * proliferateElement.
         *
         * @param {String} type   The tag of the Element to be created.
         * @param {Object} [settings]   Additional settings for the Element, such as
         *                              className or style.
         * @return {HTMLElement}
         */
        EightBittr.prototype.createElement = function (tag) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var EightBitter = EightBittr.prototype.ensureCorrectCaller(this), element = document.createElement(tag || "div"), i;
            // For each provided object, add those settings to the element
            for (i = 1; i < arguments.length; i += 1) {
                EightBitter.proliferateElement(element, arguments[i]);
            }
            return element;
        };
        /**
         * Follows a path inside an Object recursively, based on a given path.
         *
         * @param {Mixed} object
         * @param {String[]} path   The ordered names of attributes to descend into.
         * @param {Number} [num]   The starting index in path (by default, 0).
         * @return {Mixed}
         * @remarks This may not be good with JSLint, but it works for prototypal
         *          inheritance, since hasOwnProperty only is for the current class
         */
        EightBittr.prototype.followPathHard = function (object, path, num) {
            if (num === void 0) { num = 0; }
            for (var i = num || 0; i < path.length; i += 1) {
                if (typeof object[path[i]] === "undefined") {
                    return undefined;
                }
                else {
                    object = object[path[i]];
                }
            }
            return object;
        };
        /**
         * Switches a Thing from one Array to Another using splice and push.
         *
         * @param {Thing} thing
         * @param {Array} arrayOld
         * @param {Array} arrayNew
         */
        EightBittr.prototype.arraySwitch = function (thing, arrayOld, arrayNew) {
            arrayOld.splice(arrayOld.indexOf(thing), 1);
            arrayNew.push(thing);
        };
        /**
         * Sets a Thing's position within an Array to the front by splicing and then
         * unshifting it.
         *
         * @param {Thing} thing
         * @param {Array} array
         */
        EightBittr.prototype.arrayToBeginning = function (thing, array) {
            array.splice(array.indexOf(thing), 1);
            array.unshift(thing);
        };
        /**
         * Sets a Thing's position within an Array to the front by splicing and then
         * pushing it.
         *
         * @param {Thing} thing
         * @param {Array} array
         */
        EightBittr.prototype.arrayToEnd = function (thing, array) {
            array.splice(array.indexOf(thing), 1);
            array.push(thing);
        };
        return EightBittr;
    })();
    EightBittr_1.EightBittr = EightBittr;
    ;
})(EightBittr || (EightBittr = {}));
var FPSAnalyzr;
(function (FPSAnalyzr_1) {
    "use strict";
    /**
     * A general utility for obtaining and analyzing framerate measurements. The
     * most recent measurements are kept up to a certain point (either an infinite
     * number or a set amount). Options for analyzing the data such as getting the
     * mean, median, extremes, etc. are available.
     */
    var FPSAnalyzr = (function () {
        /**
         * @param {IFPSAnalyzrSettings} [settings]
         */
        function FPSAnalyzr(settings) {
            if (settings === void 0) { settings = {}; }
            this.maxKept = settings.maxKept || 35;
            this.numRecorded = 0;
            this.ticker = -1;
            // If maxKept is a Number, make the measurements array that long
            // If it's infinite, make measurements an {} (infinite array)
            this.measurements = isFinite(this.maxKept) ? new Array(this.maxKept) : {};
            // Headless browsers like PhantomJS won't know performance, so Date.now
            // is used as a backup
            if (typeof settings.getTimestamp === "undefined") {
                if (typeof performance === "undefined") {
                    this.getTimestamp = function () {
                        return Date.now();
                    };
                }
                else {
                    this.getTimestamp = (performance.now
                        || performance.webkitNow
                        || performance.mozNow
                        || performance.msNow
                        || performance.oNow).bind(performance);
                }
            }
            else {
                this.getTimestamp = settings.getTimestamp;
            }
        }
        /* Public interface
        */
        /**
         * Standard public measurement function.
         * Marks the current timestamp as timeCurrent, and adds an FPS measurement
         * if there was a previous timeCurrent.
         *
         * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
         *                                     getTimestamp() is used instead.
         */
        FPSAnalyzr.prototype.measure = function (time) {
            if (time === void 0) { time = this.getTimestamp(); }
            if (this.timeCurrent) {
                this.addFPS(1000 / (time - this.timeCurrent));
            }
            this.timeCurrent = time;
        };
        /**
         * Adds an FPS measurement to measurements, and increments the associated
         * count variables.
         *
         * @param {Number} fps   An FPS calculated as the difference between two
         *                       timestamps.
         */
        FPSAnalyzr.prototype.addFPS = function (fps) {
            this.ticker = (this.ticker += 1) % this.maxKept;
            this.measurements[this.ticker] = fps;
            this.numRecorded += 1;
        };
        /* Gets
        */
        /**
         * @return {Number} The number of FPS measurements to keep.
         */
        FPSAnalyzr.prototype.getMaxKept = function () {
            return this.maxKept;
        };
        /**
         * @return {Number} The actual number of FPS measurements currently known.
         */
        FPSAnalyzr.prototype.getNumRecorded = function () {
            return this.numRecorded;
        };
        /**
         * @return {Number} The most recent performance.now timestamp.
         */
        FPSAnalyzr.prototype.getTimeCurrent = function () {
            return this.timeCurrent;
        };
        /**
         * @return {Number} The current position in measurements.
         */
        FPSAnalyzr.prototype.getTicker = function () {
            return this.ticker;
        };
        /**
         * Get function for a copy of the measurements listing (if the number of
         * measurements is less than the max, that size is used)
         *
         * @return {Object}   An object (normally an Array) of the most recent FPS
         *                    measurements
         */
        FPSAnalyzr.prototype.getMeasurements = function () {
            var fpsKeptReal = Math.min(this.maxKept, this.numRecorded), copy, i;
            if (isFinite(this.maxKept)) {
                copy = new Array(fpsKeptReal);
            }
            else {
                copy = {};
                copy.length = fpsKeptReal;
            }
            for (i = fpsKeptReal - 1; i >= 0; --i) {
                copy[i] = this.measurements[i];
            }
            return copy;
        };
        /**
         * Get function for a copy of the measurements listing, but with the FPS
         * measurements transformed back into time differences
         *
         * @return {Object}   An object (normally an Array) of the most recent FPS
         *                    time differences
         */
        FPSAnalyzr.prototype.getDifferences = function () {
            var copy = this.getMeasurements(), i;
            for (i = copy.length - 1; i >= 0; --i) {
                copy[i] = 1000 / copy[i];
            }
            return copy;
        };
        /**
         * @return {Number} The average recorded FPS measurement.
         */
        FPSAnalyzr.prototype.getAverage = function () {
            var total = 0, max = Math.min(this.maxKept, this.numRecorded), i;
            for (i = max - 1; i >= 0; --i) {
                total += this.measurements[i];
            }
            return total / max;
        };
        /**
         * @return {Number} The median recorded FPS measurement.
         * @remarks This is O(n*log(n)), where n is the size of the history,
         *          as it creates a copy of the history and sorts it.
         */
        FPSAnalyzr.prototype.getMedian = function () {
            var copy = this.getMeasurementsSorted(), fpsKeptReal = copy.length, fpsKeptHalf = Math.floor(fpsKeptReal / 2);
            if (copy.length % 2 === 0) {
                return copy[fpsKeptHalf];
            }
            else {
                return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
            }
        };
        /**
         * @return {Number[]} An Array containing the lowest and highest recorded
         *                    FPS measurements, in that order.
         */
        FPSAnalyzr.prototype.getExtremes = function () {
            var lowest = this.measurements[0], highest = lowest, max = Math.min(this.maxKept, this.numRecorded), fps, i;
            for (i = max - 1; i >= 0; --i) {
                fps = this.measurements[i];
                if (fps > highest) {
                    highest = fps;
                }
                else if (fps < lowest) {
                    lowest = fps;
                }
            }
            return [lowest, highest];
        };
        /**
         * @return {Number} The range of recorded FPS measurements
         */
        FPSAnalyzr.prototype.getRange = function () {
            var extremes = this.getExtremes();
            return extremes[1] - extremes[0];
        };
        /**
         *
         */
        FPSAnalyzr.prototype.getMeasurementsSorted = function () {
            var copy, i;
            if (this.measurements.constructor === Array) {
                copy = this.measurements.sort();
            }
            else {
                copy = [];
                for (i in this.measurements) {
                    if (this.measurements.hasOwnProperty(i)) {
                        if (this.measurements[i] === undefined) {
                            break;
                        }
                        copy[i] = this.measurements[i];
                    }
                }
                copy.sort();
            }
            if (this.numRecorded < this.maxKept) {
                copy.length = this.numRecorded;
            }
            return copy.sort();
        };
        return FPSAnalyzr;
    })();
    FPSAnalyzr_1.FPSAnalyzr = FPSAnalyzr;
})(FPSAnalyzr || (FPSAnalyzr = {}));
/// <reference path="FPSAnalyzr-0.2.1.ts" />
var GamesRunnr;
(function (GamesRunnr_1) {
    "use strict";
    /**
     * A class to continuously series of "game" Functions. Each game is run in a
     * set order and the group is run as a whole at a particular interval, with a
     * configurable speed. Playback can be triggered manually, or driven by a timer
     * with pause and play hooks. For automated playback, statistics are
     * available via an internal FPSAnalyzer.
     */
    var GamesRunnr = (function () {
        /**
         * @param {IGamesRunnrSettings} settings
         */
        function GamesRunnr(settings) {
            var i;
            if (typeof settings.games === "undefined") {
                throw new Error("No games given to GamesRunnr.");
            }
            this.games = settings.games;
            this.interval = settings.interval || 1000 / 60;
            this.speed = settings.speed || 1;
            this.onPause = settings.onPause;
            this.onPlay = settings.onPlay;
            this.callbackArguments = settings.callbackArguments || [this];
            this.adjustFramerate = settings.adjustFramerate;
            this.FPSAnalyzer = settings.FPSAnalyzer || new FPSAnalyzr.FPSAnalyzr(settings.FPSAnalyzerSettings);
            this.scope = settings.scope || this;
            this.paused = true;
            this.upkeepScheduler = settings.upkeepScheduler || function (handler, timeout) {
                return setTimeout(handler, timeout);
            };
            this.upkeepCanceller = settings.upkeepCanceller || function (handle) {
                clearTimeout(handle);
            };
            this.upkeepBound = this.upkeep.bind(this);
            for (i = 0; i < this.games.length; i += 1) {
                this.games[i] = this.games[i].bind(this.scope);
            }
            this.setIntervalReal();
        }
        /* Gets
        */
        /**
         * @return {FPSAnalyzer} The FPSAnalyzer used in the GamesRunnr.
         */
        GamesRunnr.prototype.getFPSAnalyzer = function () {
            return this.FPSAnalyzer;
        };
        /**
         * @return {Boolean} Whether this is paused.
         */
        GamesRunnr.prototype.getPaused = function () {
            return this.paused;
        };
        /**
         * @return {Function[]} The Array of game Functions.
         */
        GamesRunnr.prototype.getGames = function () {
            return this.games;
        };
        /**
         * @return {Number} The interval between upkeeps.
         */
        GamesRunnr.prototype.getInterval = function () {
            return this.interval;
        };
        /**
         * @return {Number} The speed multiplier being applied to the interval.
         */
        GamesRunnr.prototype.getSpeed = function () {
            return this.speed;
        };
        /**
         * @return {Function} The optional trigger to be called on pause.
         */
        GamesRunnr.prototype.getOnPause = function () {
            return this.onPause;
        };
        /**
         * @return {Function} The optional trigger to be called on play.
         */
        GamesRunnr.prototype.getOnPlay = function () {
            return this.onPlay;
        };
        /**
         * @return {Array} Arguments to be given to the optional trigger Functions.
         */
        GamesRunnr.prototype.getCallbackArguments = function () {
            return this.callbackArguments;
        };
        /**
         * @return {Function} Function used to schedule the next upkeep.
         */
        GamesRunnr.prototype.getUpkeepScheduler = function () {
            return this.upkeepScheduler;
        };
        /**
         * @return {Function} Function used to cancel the next upkeep.
         */
        GamesRunnr.prototype.getUpkeepCanceller = function () {
            return this.upkeepCanceller;
        };
        /* Runtime
        */
        /**
         * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
         * measurement and run every game once.
         */
        GamesRunnr.prototype.upkeep = function () {
            if (this.paused) {
                return;
            }
            // Prevents double upkeeping, in case a new upkeepNext was scheduled.
            this.upkeepCanceller(this.upkeepNext);
            if (this.adjustFramerate) {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal - (this.upkeepTimed() | 0));
            }
            else {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal);
                this.games.forEach(this.run);
            }
            if (this.FPSAnalyzer) {
                this.FPSAnalyzer.measure();
            }
        };
        /**
         * A utility for this.upkeep that calls the same games.forEach(run), timing
         * the total execution time.
         *
         * @return {Number} The total time spent, in milliseconds.
         */
        GamesRunnr.prototype.upkeepTimed = function () {
            if (!this.FPSAnalyzer) {
                throw new Error("An internal FPSAnalyzr is required for upkeepTimed.");
            }
            var now = this.FPSAnalyzer.getTimestamp();
            this.games.forEach(this.run);
            return this.FPSAnalyzer.getTimestamp() - now;
        };
        /**
         * Continues execution of this.upkeep by calling it. If an onPlay has been
         * defined, it's called before.
         */
        GamesRunnr.prototype.play = function () {
            if (!this.paused) {
                return;
            }
            this.paused = false;
            if (this.onPlay) {
                this.onPlay.apply(this, this.callbackArguments);
            }
            this.upkeep();
        };
        /**
         * Stops execution of this.upkeep, and cancels the next call. If an onPause
         * has been defined, it's called after.
         */
        GamesRunnr.prototype.pause = function () {
            if (this.paused) {
                return;
            }
            this.paused = true;
            if (this.onPause) {
                this.onPause.apply(this, this.callbackArguments);
            }
            this.upkeepCanceller(this.upkeepNext);
        };
        /**
         * Calls upkeep a <num or 1> number of times, immediately.
         *
         * @param {Number} [num]   How many times to upkeep, if not 1.
         */
        GamesRunnr.prototype.step = function (times) {
            if (times === void 0) { times = 1; }
            this.play();
            this.pause();
            if (times > 0) {
                this.step(times - 1);
            }
        };
        /**
         * Toggles whether this is paused, and calls the appropriate Function.
         */
        GamesRunnr.prototype.togglePause = function () {
            this.paused ? this.play() : this.pause();
        };
        /* Games manipulations
        */
        /**
         * Sets the interval between between upkeeps.
         *
         * @param {Number} The new time interval in milliseconds.
         */
        GamesRunnr.prototype.setInterval = function (interval) {
            var intervalReal = Number(interval);
            if (isNaN(intervalReal)) {
                throw new Error("Invalid interval given to setInterval: " + interval);
            }
            this.interval = intervalReal;
            this.setIntervalReal();
        };
        /**
         * Sets the speed multiplier for the interval.
         *
         * @param {Number} The new speed multiplier. 2 will cause interval to be
         *                 twice as fast, and 0.5 will be half as fast.
         */
        GamesRunnr.prototype.setSpeed = function (speed) {
            var speedReal = Number(speed);
            if (isNaN(speedReal)) {
                throw new Error("Invalid speed given to setSpeed: " + speed);
            }
            this.speed = speedReal;
            this.setIntervalReal();
        };
        /* Utilities
        */
        /**
         * Sets the intervalReal variable, which is interval * (inverse of speed).
         */
        GamesRunnr.prototype.setIntervalReal = function () {
            this.intervalReal = (1 / this.speed) * this.interval;
        };
        /**
         * Curry function to fun a given function. Used in games.forEach(game).
         *
         * @param {Function} game
         */
        GamesRunnr.prototype.run = function (game) {
            game();
        };
        return GamesRunnr;
    })();
    GamesRunnr_1.GamesRunnr = GamesRunnr;
})(GamesRunnr || (GamesRunnr = {}));
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
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
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
var InputWritr;
(function (InputWritr_1) {
    "use strict";
    /**
     * A general utility for automating interactions with user-called events linked
     * with callbacks. Pipe functions are available that take in user input, switch
     * on the event code, and call the appropriate callback. These Pipe functions
     * can be made during runtime; further utilities allow for saving and playback
     * of input histories in JSON format.
     */
    var InputWritr = (function () {
        /**
         * @param {IInputWritrSettings} settings
         */
        function InputWritr(settings) {
            if (!settings.triggers) {
                throw new Error("No triggers given to InputWritr.");
            }
            this.triggers = settings.triggers;
            // Headless browsers like PhantomJS might not contain the performance
            // class, so Date.now is used as a backup
            if (typeof settings.getTimestamp === "undefined") {
                if (typeof performance === "undefined") {
                    this.getTimestamp = function () {
                        return Date.now();
                    };
                }
                else {
                    this.getTimestamp = (performance.now
                        || performance.webkitNow
                        || performance.mozNow
                        || performance.msNow
                        || performance.oNow).bind(performance);
                }
            }
            else {
                this.getTimestamp = settings.getTimestamp;
            }
            this.eventInformation = settings.eventInformation;
            this.canTrigger = settings.hasOwnProperty("canTrigger")
                ? settings.canTrigger
                : function () {
                    return true;
                };
            this.isRecording = settings.hasOwnProperty("isRecording")
                ? settings.isRecording
                : function () {
                    return true;
                };
            this.history = {};
            this.histories = {
                "length": 0
            };
            this.aliases = {};
            this.addAliases(settings.aliases || {});
            this.keyAliasesToCodes = settings.keyAliasesToCodes || {
                "shift": 16,
                "ctrl": 17,
                "space": 32,
                "left": 37,
                "up": 38,
                "right": 39,
                "down": 40
            };
            this.keyCodesToAliases = settings.keyCodesToAliases || {
                "16": "shift",
                "17": "ctrl",
                "32": "space",
                "37": "left",
                "38": "up",
                "39": "right",
                "40": "down"
            };
        }
        /**
         * Clears the currently tracked inputs history and resets the starting time,
         * and (optionally) saves the current history.
         *
         * @param {Boolean} [keepHistory]   Whether the currently tracked history
         *                                  of inputs should be added to the master
         *                                  Array of histories (defaults to true).
         */
        InputWritr.prototype.restartHistory = function (keepHistory) {
            if (keepHistory === void 0) { keepHistory = true; }
            if (keepHistory) {
                this.saveHistory(this.history);
            }
            this.history = {};
            this.startingTime = this.getTimestamp();
        };
        /* Simple gets
        */
        /**
         * @return {Object} The stored mapping of aliases to values.
         */
        InputWritr.prototype.getAliases = function () {
            return this.aliases;
        };
        /**
         * @return {Object} The stored mapping of aliases to values, with values
         *                  mapped to their equivalent key Strings.
         */
        InputWritr.prototype.getAliasesAsKeyStrings = function () {
            var output = {}, alias;
            for (alias in this.aliases) {
                if (this.aliases.hasOwnProperty(alias)) {
                    output[alias] = this.getAliasAsKeyStrings(alias);
                }
            }
            return output;
        };
        /**
         * @param {Mixed} alias   An alias allowed to be passed in, typically a
         *                        character code.
         * @return {String[]}   The mapped key Strings corresponding to that alias,
         *                      typically the human-readable Strings representing
         *                      input names, such as "a" or "left".
         */
        InputWritr.prototype.getAliasAsKeyStrings = function (alias) {
            return this.aliases[alias].map(this.convertAliasToKeyString.bind(this));
        };
        /**
         * @param {Mixed} alias   The alias of an input, typically a character
         *                        code.
         * @return {String} The human-readable String representing the input name,
         *                  such as "a" or "left".
         */
        InputWritr.prototype.convertAliasToKeyString = function (alias) {
            if (alias.constructor === String) {
                return alias;
            }
            if (alias > 96 && alias < 105) {
                return String.fromCharCode(alias - 48);
            }
            if (alias > 64 && alias < 97) {
                return String.fromCharCode(alias);
            }
            return typeof this.keyCodesToAliases[alias] !== "undefined"
                ? this.keyCodesToAliases[alias] : "?";
        };
        /**
         * @param {Mixed} key   The number code of an input.
         * @return {Number} The machine-usable character code of the input.
         *
         */
        InputWritr.prototype.convertKeyStringToAlias = function (key) {
            if (key.constructor === Number) {
                return key;
            }
            if (key.length === 1) {
                return key.charCodeAt(0) - 32;
            }
            return typeof this.keyAliasesToCodes[key] !== "undefined" ? this.keyAliasesToCodes[key] : -1;
        };
        /**
         * Get function for a single history, either the current or a past one.
         *
         * @param {String} [name]   The identifier for the old history to return. If
         *                          none is provided, the current history is used.
         * @return {Object}   A history of inputs in JSON-friendly form.
         */
        InputWritr.prototype.getHistory = function (name) {
            if (name === void 0) { name = undefined; }
            return arguments.length ? this.histories[name] : history;
        };
        /**
         * @return {Object} All previously stored histories.
         */
        InputWritr.prototype.getHistories = function () {
            return this.histories;
        };
        /**
         * @return {Boolean} Whether this is currently allowing inputs.
         */
        InputWritr.prototype.getCanTrigger = function () {
            return this.canTrigger;
        };
        /**
         * @return {Boolean} Whether this is currently recording allowed inputs.
         */
        InputWritr.prototype.getIsRecording = function () {
            return this.isRecording;
        };
        /* Simple sets
        */
        /**
         * @param {Mixed} canTriggerNew   Whether this is now allowing inputs. This
         *                                may be either a Function (to be evaluated
         *                                on each input) or a general Boolean.
         */
        InputWritr.prototype.setCanTrigger = function (canTriggerNew) {
            if (canTriggerNew.constructor === Boolean) {
                this.canTrigger = function () {
                    return canTriggerNew;
                };
            }
            else {
                this.canTrigger = canTriggerNew;
            }
        };
        /**
         * @param {Boolean} isRecordingNew   Whether this is now recording allowed
         *                                   inputs.
         */
        InputWritr.prototype.setIsRecording = function (isRecordingNew) {
            if (isRecordingNew.constructor === Boolean) {
                this.isRecording = function () {
                    return isRecordingNew;
                };
            }
            else {
                this.isRecording = isRecordingNew;
            }
        };
        /**
         * @param {Mixed} eventInformationNew   A new first argument for event
         *                                      callbacks.
         */
        InputWritr.prototype.setEventInformation = function (eventInformationNew) {
            this.eventInformation = eventInformationNew;
        };
        /* Aliases
        */
        /**
         * Adds a list of values by which an event may be triggered.
         *
         * @param {String} name   The name of the event that is being given
         *                        aliases, such as "left".
         * @param {Array} values   An array of aliases by which the event will also
         *                         be callable.
         */
        InputWritr.prototype.addAliasValues = function (name, values) {
            var triggerName, triggerGroup, i;
            if (!this.aliases.hasOwnProperty(name)) {
                this.aliases[name] = values;
            }
            else {
                this.aliases[name].push.apply(this.aliases[name], values);
            }
            // triggerName = "onkeydown", "onkeyup", ...
            for (triggerName in this.triggers) {
                if (this.triggers.hasOwnProperty(triggerName)) {
                    // triggerGroup = { "left": function, ... }, ...
                    triggerGroup = this.triggers[triggerName];
                    if (triggerGroup.hasOwnProperty(name)) {
                        // values[i] = 37, 65, ...
                        for (i = 0; i < values.length; i += 1) {
                            triggerGroup[values[i]] = triggerGroup[name];
                        }
                    }
                }
            }
        };
        /**
         * Removes a list of values by which an event may be triggered.
         *
         * @param {String} name   The name of the event that is having aliases
         *                        removed, such as "left".
         * @param {Array} values   An array of aliases by which the event will no
         *                         longer be callable.
         */
        InputWritr.prototype.removeAliasValues = function (name, values) {
            var triggerName, triggerGroup, i;
            if (!this.aliases.hasOwnProperty(name)) {
                return;
            }
            for (i = 0; i < values.length; i += 1) {
                this.aliases[name].splice(this.aliases[name].indexOf(values[i], 1));
            }
            // triggerName = "onkeydown", "onkeyup", ...
            for (triggerName in this.triggers) {
                if (this.triggers.hasOwnProperty(triggerName)) {
                    // triggerGroup = { "left": function, ... }, ...
                    triggerGroup = this.triggers[triggerName];
                    if (triggerGroup.hasOwnProperty(name)) {
                        // values[i] = 37, 65, ...
                        for (i = 0; i < values.length; i += 1) {
                            if (triggerGroup.hasOwnProperty(values[i])) {
                                delete triggerGroup[values[i]];
                            }
                        }
                    }
                }
            }
        };
        /**
         * Shortcut to remove old alias values and add new ones in.
         *
         *
         * @param {String} name   The name of the event that is having aliases
         *                        added and removed, such as "left".
         * @param {Array} valuesOld   An array of aliases by which the event will no
         *                            longer be callable.
         * @param {Array} valuesNew   An array of aliases by which the event will
         *                            now be callable.
         */
        InputWritr.prototype.switchAliasValues = function (name, valuesOld, valuesNew) {
            this.removeAliasValues(name, valuesOld);
            this.addAliasValues(name, valuesNew);
        };
        /**
         * Adds a set of alises from an Object containing "name" => [values] pairs.
         *
         * @param {Object} aliasesRaw
         */
        InputWritr.prototype.addAliases = function (aliasesRaw) {
            var aliasName;
            for (aliasName in aliasesRaw) {
                if (aliasesRaw.hasOwnProperty(aliasName)) {
                    this.addAliasValues(aliasName, aliasesRaw[aliasName]);
                }
            }
        };
        /* Functions
        */
        /**
         * Adds a triggerable event by marking a new callback under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param {String} trigger   The name of the triggered event.
         * @param {Mixed} label   The code within the trigger to call within,
         *                        typically either a character code or an alias.
         * @param {Function} callback   The callback Function to be triggered.
         */
        InputWritr.prototype.addEvent = function (trigger, label, callback) {
            var i;
            if (!this.triggers.hasOwnProperty(trigger)) {
                throw new Error("Unknown trigger requested: '" + trigger + "'.");
            }
            this.triggers[trigger][label] = callback;
            if (this.aliases.hasOwnProperty(label)) {
                for (i = 0; i < this.aliases[label].length; i += 1) {
                    this.triggers[trigger][this.aliases[label][i]] = callback;
                }
            }
        };
        /**
         * Removes a triggerable event by deleting any callbacks under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param {String} trigger   The name of the triggered event.
         * @param {Mixed} label   The code within the trigger to call within,
         *                        typically either a character code or an alias.
         */
        InputWritr.prototype.removeEvent = function (trigger, label) {
            var i;
            if (!this.triggers.hasOwnProperty(trigger)) {
                throw new Error("Unknown trigger requested: '" + trigger + "'.");
            }
            delete this.triggers[trigger][label];
            if (this.aliases.hasOwnProperty(label)) {
                for (i = 0; i < this.aliases[label].length; i += 1) {
                    if (this.triggers[trigger][this.aliases[label][i]]) {
                        delete this.triggers[trigger][this.aliases[label][i]];
                    }
                }
            }
        };
        /**
         * Stores the current history in the histories listing. this.restartHistory
         * is typically called directly after.
         */
        InputWritr.prototype.saveHistory = function (name) {
            if (name === void 0) { name = undefined; }
            this.histories[this.histories.length] = history;
            this.histories.length += 1;
            if (arguments.length) {
                this.histories[name] = history;
            }
        };
        /**
         * Plays back the current history using this.playEvents.
         */
        InputWritr.prototype.playHistory = function () {
            this.playEvents(this.history);
        };
        /**
         * "Plays" back an Array of event information by simulating each keystroke
         * in a new call, timed by setTimeout.
         *
         * @param {Object} events   The events history to play back.
         * @remarks This will execute the same actions in the same order as before,
         *          but the arguments object may be different.
         */
        InputWritr.prototype.playEvents = function (events) {
            var timeouts = {}, time, call;
            for (time in events) {
                if (events.hasOwnProperty(time)) {
                    call = this.makeEventCall(events[time]);
                    timeouts[time] = setTimeout(call, (Number(time) - this.startingTime) | 0);
                }
            }
        };
        /**
         * Primary driver function to run an event. The event is chosen from the
         * triggers object, and called with eventInformation as the input.
         *
         * @param {Function, String} event   The event function (or string alias of
         *                                   it) that will be called.
         * @param {Mixed} [keyCode]   The alias of the event function under
         *                            triggers[event], if event is a String.
         * @param {Event} [sourceEvent]   The raw event that caused the calling Pipe
         *                                to be triggered, such as a MouseEvent.
         * @return {Mixed}
         */
        InputWritr.prototype.callEvent = function (event, keyCode, sourceEvent) {
            if (!this.canTrigger(event, keyCode)) {
                return;
            }
            if (!event) {
                throw new Error("Blank event given, ignoring it.");
            }
            if (event.constructor === String) {
                event = this.triggers[event][keyCode];
            }
            return event(this.eventInformation, sourceEvent);
        };
        /**
         * Creates and returns a function to run a trigger.
         *
         * @param {String} trigger   The label for the Array of functions that the
         *                           pipe function should choose from.
         * @param {String} codeLabel   A mapping String for the alias to get the
         *                             alias from the event.
         * @param {Boolean} [preventDefaults]   Whether the input to the pipe
         *                                       function will be an HTML-style
         *                                       event, where .preventDefault()
         *                                       should be clicked.
         * @return {Function}
         */
        InputWritr.prototype.makePipe = function (trigger, codeLabel, preventDefaults) {
            var functions = this.triggers[trigger], InputWriter = this;
            if (!functions) {
                throw new Error("No trigger of label '" + trigger + "' defined.");
            }
            return function Pipe(event) {
                var alias = event[codeLabel];
                // Typical usage means alias will be an event from a key/mouse input
                if (preventDefaults && event.preventDefault instanceof Function) {
                    event.preventDefault();
                }
                // If there's a function under that alias, run it
                if (functions.hasOwnProperty(alias)) {
                    if (InputWriter.isRecording()) {
                        InputWriter.history[InputWriter.getTimestamp() | 0] = [trigger, alias];
                    }
                    InputWriter.callEvent(functions[alias], alias, event);
                }
            };
        };
        /**
         * Curry utility to create a closure that runs call() when called.
         *
         * @param {Array} info   An array containing [alias, keyCode].
         * @return {Function} A closure Function that activates a trigger
         *                    when called.
         */
        InputWritr.prototype.makeEventCall = function (info) {
            return function () {
                this.callEvent(info[0], info[1]);
            };
        };
        return InputWritr;
    })();
    InputWritr_1.InputWritr = InputWritr;
})(InputWritr || (InputWritr = {}));
var ObjectMakr;
(function (ObjectMakr_1) {
    "use strict";
    /**
     * An Abstract Factory for JavaScript classes that automates the process of
     * setting constructors' prototypal inheritance. A sketch of class inheritance
     * and a listing of properties for each class is taken in, and dynamically
     * accessible function constructors are made available.
     */
    var ObjectMakr = (function () {
        /**
         * @param {IObjectMakrSettings} settings
         */
        function ObjectMakr(settings) {
            if (typeof settings.inheritance === "undefined") {
                throw new Error("No inheritance mapping given to ObjectMakr.");
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
        ObjectMakr.prototype.getInheritance = function () {
            return this.inheritance;
        };
        /**
         * @return {Object} The complete properties mapping Object.
         */
        ObjectMakr.prototype.getProperties = function () {
            return this.properties;
        };
        /**
         * @return {Object} The properties Object for a particular class.
         */
        ObjectMakr.prototype.getPropertiesOf = function (title) {
            return this.properties[title];
        };
        /**
         * @return {Object} The full properties Object, if doPropertiesFull is on.
         */
        ObjectMakr.prototype.getFullProperties = function () {
            return this.propertiesFull;
        };
        /**
         * @return {Object} The full properties Object for a particular class, if
         *                  doPropertiesFull is on.
         */
        ObjectMakr.prototype.getFullPropertiesOf = function (title) {
            return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
        };
        /**
         * @return {Object} The full mapping of class constructors.
         */
        ObjectMakr.prototype.getFunctions = function () {
            return this.functions;
        };
        /**
         * @param {String} name   The name of a class to retrieve.
         * @return {Function}   The constructor for the given class.
         */
        ObjectMakr.prototype.getFunction = function (name) {
            return this.functions[name];
        };
        /**
         * @param {String} type   The name of a class to check for.
         * @return {Boolean} Whether that class exists.
         */
        ObjectMakr.prototype.hasFunction = function (name) {
            return this.functions.hasOwnProperty(name);
        };
        /**
         * @return {Mixed} The optional mapping of indices.
         */
        ObjectMakr.prototype.getIndexMap = function () {
            return this.indexMap;
        };
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
        ObjectMakr.prototype.make = function (name, settings) {
            if (settings === void 0) { settings = undefined; }
            var output;
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
                    output[this.onMake](output, name, this.properties[name], this.propertiesFull[name]);
                }
                else {
                    output[this.onMake](output, name, this.properties[name], this.functions[name].prototype);
                }
            }
            return output;
        };
        /* Core parsing
        */
        /**
         * Parser that calls processPropertyArray on all properties given as arrays
         *
         * @param {Object} properties   The object of function properties
         * @remarks Only call this if indexMap is given as an array
         */
        ObjectMakr.prototype.processProperties = function (properties) {
            var name;
            // For each of the given properties:
            for (name in properties) {
                if (this.properties.hasOwnProperty(name)) {
                    // If it's an array, replace it with a mapped version
                    if (this.properties[name] instanceof Array) {
                        this.properties[name] = this.processPropertyArray(this.properties[name]);
                    }
                }
            }
        };
        /**
         * Creates an output properties object with the mapping shown in indexMap
         *
         * @param {Array} properties   An array with indiced versions of properties
         * @example indexMap = ["width", "height"];
         *          properties = [7, 14];
         *          output = processPropertyArray(properties);
         *          // output is now { "width": 7, "height": 14 }
         */
        ObjectMakr.prototype.processPropertyArray = function (properties) {
            var output = {}, i;
            // For each [i] in properties, set that property as under indexMap[i]
            for (i = properties.length - 1; i >= 0; --i) {
                output[this.indexMap[i]] = properties[i];
            }
            return output;
        };
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
        ObjectMakr.prototype.processFunctions = function (base, parent, parentName) {
            var name, ref;
            // For each name in the current object:
            for (name in base) {
                if (base.hasOwnProperty(name)) {
                    this.functions[name] = (new Function());
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
        };
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
        ObjectMakr.prototype.proliferate = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i;
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
                }
                else {
                    // Regular primitives are easy to copy otherwise
                    recipient[i] = setting;
                }
            }
            return recipient;
        };
        return ObjectMakr;
    })();
    ObjectMakr_1.ObjectMakr = ObjectMakr;
})(ObjectMakr || (ObjectMakr = {}));
/// <reference path="ObjectMakr-0.2.2.ts" />
var MapsCreatr;
(function (MapsCreatr_1) {
    "use strict";
    /**
     * Basic storage container for a single Thing to be stored in an Area's
     * PreThings member. A PreThing stores an actual Thing along with basic
     * sizing and positioning information, so that a MapsHandler may accurately
     * spawn or unspawn it as needed.
     */
    var PreThing = (function () {
        /**
         * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
         * @param {IPreThingSettings} reference   The creation Object instruction
         *                                        used to create the Thing.
         */
        function PreThing(thing, reference, ObjectMaker) {
            this.thing = thing;
            this.title = thing.title;
            this.reference = reference;
            this.spawned = false;
            this.left = reference.x || 0;
            this.top = reference.y || 0;
            this.right = this.left + (reference.width
                || ObjectMaker.getFullPropertiesOf(this.title).width);
            this.bottom = this.top + (reference.height
                || ObjectMaker.getFullPropertiesOf(this.title).height);
            if (reference.position) {
                this.position = reference.position;
            }
        }
        return PreThing;
    })();
    MapsCreatr_1.PreThing = PreThing;
    /**
     * Storage container and lazy loader for GameStarter maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved.
     * Areas contain a "creation" Object[] detailing the instructions on creating
     * that Area's "PreThing" objects, which store Things along with basic position
     * information.
     *
     * In short, a Map contains a set of Areas, each of which knows its size and the
     * steps to create its contents. Each Map also contains a set of Locations,
     * which are entry points into one Area each.
     *
     * See Schema.txt for the minimum recommended format for Maps, Locations,
     * Areas, and creation commands.
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var MapsCreatr = (function () {
        /**
         * @param {IMapsCreatrSettings} settings
         */
        function MapsCreatr(settings) {
            if (!settings) {
                throw new Error("No settings given to MapsCreatr.");
            }
            // Maps and Things are created using an ObjectMaker factory
            if (!settings.ObjectMaker) {
                throw new Error("No ObjectMakr given to MapsCreatr.");
            }
            this.ObjectMaker = settings.ObjectMaker;
            if (typeof this.ObjectMaker.getFullProperties() === "undefined") {
                throw new Error("MapsCreatr's ObjectMaker must store full properties.");
            }
            // At least one group type name should be defined for PreThing output
            if (!settings.groupTypes) {
                throw new Error("No groupTypes given to MapsCreatr.");
            }
            this.groupTypes = settings.groupTypes;
            this.keyGroupType = settings.keyGroupType || "groupType";
            this.keyEntrance = settings.keyEntrance || "entrance";
            this.macros = settings.macros || {};
            this.scope = settings.scope || this;
            this.entrances = settings.entrances;
            this.requireEntrance = settings.requireEntrance;
            this.maps = {};
            if (settings.maps) {
                this.storeMaps(settings.maps);
            }
        }
        /* Simple gets
        */
        /**
         * @return {ObjectMakr}   The internal ObjectMakr.
         */
        MapsCreatr.prototype.getObjectMaker = function () {
            return this.ObjectMaker;
        };
        /**
         * @return {String[]}   The allowed group types.
         */
        MapsCreatr.prototype.getGroupTypes = function () {
            return this.groupTypes;
        };
        /**
         * @return {String}   The key under which Things are to store their group.
         */
        MapsCreatr.prototype.getKeyGroupType = function () {
            return this.keyGroupType;
        };
        /**
         * @return {String}   The key under which Things declare themselves an entrance.
         */
        MapsCreatr.prototype.getKeyEntrance = function () {
            return this.keyEntrance;
        };
        /**
         * @return {Object}   The allowed macro Functions.
         */
        MapsCreatr.prototype.getMacros = function () {
            return this.macros;
        };
        /**
         * @return {Mixed}   The scope to give as a last parameter to macros.
         */
        MapsCreatr.prototype.getScope = function () {
            return this.scope;
        };
        /**
         * @return {Boolean} Whether Locations must have an entrance Function.
         */
        MapsCreatr.prototype.getRequireEntrance = function () {
            return this.requireEntrance;
        };
        /**
         * @return {Object}   The Object storing maps, keyed by name.
         */
        MapsCreatr.prototype.getMaps = function () {
            return this.maps;
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
        MapsCreatr.prototype.getMap = function (name) {
            var map = this.maps[name];
            if (!map) {
                throw new Error("No map found under: " + name);
            }
            if (!map.initialized) {
                // Set the one-to-many Map->Area relationships within the Map
                this.setMapAreas(map);
                // Set the one-to-many Area->Location relationships within the Map
                this.setMapLocations(map);
                map.initialized = true;
            }
            return map;
        };
        /**
         * Creates and stores a set of new maps based on the key/value pairs in a
         * given Object. These will be stored as maps by their string keys via
         * this.storeMap.
         *
         * @param {Object} maps   An Object containing a set of key/map pairs to
         *                       store as maps.
         * @return {Object}   The newly created maps object.
         */
        MapsCreatr.prototype.storeMaps = function (maps) {
            var i;
            for (i in maps) {
                if (maps.hasOwnProperty(i)) {
                    this.storeMap(i, maps[i]);
                }
            }
        };
        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         *
         * @param {Mixed} name   A name under which the map should be stored,
         *                       commonly a String or Array.
         * @param {Object} settings   An Object containing arguments to be sent to
         *                            the ObjectMakr being used as a Maps factory.
         * @return {Map}   The newly created Map.
         */
        MapsCreatr.prototype.storeMap = function (name, mapRaw) {
            if (!name) {
                throw new Error("Maps cannot be created with no name.");
            }
            var map = this.ObjectMaker.make("Map", mapRaw);
            if (!map.areas) {
                throw new Error("Maps cannot be used with no areas: " + name);
            }
            if (!map.locations) {
                throw new Error("Maps cannot be used with no locations: " + name);
            }
            this.maps[name] = map;
            return map;
        };
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
        MapsCreatr.prototype.getPreThings = function (area) {
            var map = area.map, creation = area.creation, prethings = this.fromKeys(this.groupTypes), i;
            area.collections = {};
            for (i = 0; i < creation.length; i += 1) {
                this.analyzePreSwitch(creation[i], prethings, area, map);
            }
            return this.processPreThingsArrays(prethings);
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
        MapsCreatr.prototype.analyzePreSwitch = function (reference, prethings, area, map) {
            // Case: macro (unless it's undefined)
            if (reference.macro) {
                return this.analyzePreMacro(reference, prethings, area, map);
            }
            else {
                // Case: default (a regular PreThing)
                return this.analyzePreThing(reference, prethings, area, map);
            }
        };
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
        MapsCreatr.prototype.analyzePreMacro = function (reference, prethings, area, map) {
            var macro = this.macros[reference.macro], outputs, i;
            if (!macro) {
                console.warn("A non-existent macro is referenced. It will be ignored:", macro, reference, prethings, area, map);
                return;
            }
            // Avoid modifying the original macro by creating a new object in its
            // place, while submissively proliferating any default macro settings
            outputs = macro(reference, prethings, area, map, this.scope);
            // If there is any output, recurse on all components of it, Array or not
            if (outputs) {
                if (outputs instanceof Array) {
                    for (i = 0; i < outputs.length; i += 1) {
                        this.analyzePreSwitch(outputs[i], prethings, area, map);
                    }
                }
                else {
                    this.analyzePreSwitch(outputs, prethings, area, map);
                }
            }
            return outputs;
        };
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
        MapsCreatr.prototype.analyzePreThing = function (reference, prethings, area, map) {
            var title = reference.thing, thing, prething;
            if (!this.ObjectMaker.hasFunction(title)) {
                console.warn("A non-existent Thing type is referenced. It will be ignored:", title, reference, prethings, area, map);
                return;
            }
            prething = new PreThing(this.ObjectMaker.make(title, reference), reference, this.ObjectMaker);
            thing = prething.thing;
            if (!prething.thing[this.keyGroupType]) {
                console.warn("A Thing does not contain a " + this.keyGroupType + ". It will be ignored:", prething, "\n", arguments);
                return;
            }
            if (this.groupTypes.indexOf(prething.thing[this.keyGroupType]) === -1) {
                console.warn("A Thing contains an unknown " + this.keyGroupType + ". It will be ignored:", thing[this.keyGroupType], prething, reference, prethings, area, map);
                return;
            }
            prethings[prething.thing[this.keyGroupType]].push(prething);
            if (!thing.noBoundaryStretch && area.boundaries) {
                this.stretchAreaBoundaries(prething, area);
            }
            // If a Thing is an entrance, then the location it is an entrance to 
            // must know it and its position. Note that this will have to be changed
            // for Pokemon/Zelda style games.
            if (thing[this.keyEntrance] !== undefined && typeof thing[this.keyEntrance] !== "object") {
                if (typeof map.locations[thing[this.keyEntrance]] !== "undefined") {
                    if (typeof map.locations[thing[this.keyEntrance]].xloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].xloc = prething.left;
                    }
                    if (typeof map.locations[thing[this.keyEntrance]].yloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].yloc = prething.top;
                    }
                    map.locations[thing[this.keyEntrance]].entrance = prething.thing;
                }
            }
            if (reference.collectionName && area.collections) {
                this.ensureThingCollection(prething, reference.collectionName, reference.collectionKey, area);
            }
            return prething;
        };
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
        MapsCreatr.prototype.setMapAreas = function (map) {
            var areasRaw = map.areas, locationsRaw = map.locations, 
            // The parsed containers should be the same types as the originals
            areasParsed = new areasRaw.constructor(), locationsParsed = new locationsRaw.constructor(), area, location, i;
            // Parse all the Area objects (works for both Arrays and Objects)
            for (i in areasRaw) {
                if (areasRaw.hasOwnProperty(i)) {
                    area = this.ObjectMaker.make("Area", areasRaw[i]);
                    areasParsed[i] = area;
                    area.map = map;
                    area.name = i;
                    area.boundaries = {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    };
                }
            }
            // Parse all the Location objects (works for both Arrays and Objects)
            for (i in locationsRaw) {
                if (locationsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locationsRaw[i]);
                    locationsParsed[i] = location;
                    location.entryRaw = locationsRaw[i].entry;
                    location.name = i;
                    location.area = locationsRaw[i].area || 0;
                    if (this.requireEntrance) {
                        if (!this.entrances.hasOwnProperty(location.entryRaw)) {
                            throw new Error("Location " + i + " has unknown entry string: " + location.entryRaw);
                        }
                    }
                    if (this.entrances && location.entryRaw) {
                        location.entry = this.entrances[location.entryRaw];
                    }
                    else if (location.entry && location.entry.constructor === String) {
                        location.entry = this.entrances[String(location.entry)];
                    }
                }
            }
            // Store the output object in the Map, and keep the raw settings for the
            // sake of debugging / user interest
            map.areas = areasParsed;
            map.locations = locationsParsed;
        };
        /**
         * Converts the raw location settings in a Map into Location objects.
         *
         * These locations typically have very little information, generally just a
         * container Area, x-location, y-location, and spawning function.
         *
         * @param {Map} map
         */
        MapsCreatr.prototype.setMapLocations = function (map) {
            var locsRaw = map.locations, 
            // The parsed container should be the same type as the original
            locsParsed = new locsRaw.constructor(), location, i;
            // Parse all the keys in locasRaw (works for both Arrays and Objects)
            for (i in locsRaw) {
                if (locsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locsRaw[i]);
                    locsParsed[i] = location;
                    // The area should be an object reference, under the Map's areas
                    location.area = map.areas[locsRaw[i].area || 0];
                    if (!locsParsed[i].area) {
                        throw new Error("Location " + i + " references an invalid area:" + locsRaw[i].area);
                    }
                }
            }
            // Store the output object in the Map, and keep the old settings for the
            // sake of debugging / user interest
            map.locations = locsParsed;
        };
        /**
         * "Stretches" an Area's boundaries based on a PreThing. For each direction,
         * if the PreThing has a more extreme version of it (higher top, etc.), the
         * boundary is updated.
         *
         * @param {PreThing} prething
         * @param {Area} area
         */
        MapsCreatr.prototype.stretchAreaBoundaries = function (prething, area) {
            var boundaries = area.boundaries;
            boundaries.top = Math.min(prething.top, boundaries.top);
            boundaries.right = Math.max(prething.right, boundaries.right);
            boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
            boundaries.left = Math.min(prething.left, boundaries.left);
        };
        /**
         * Adds a Thing to the specified collection in the Map's Area.
         *
         * @param {PreThing} prething
         * @param {String} collectionName
         * @param {String} collectionKey
         * @param {Area} area
         */
        MapsCreatr.prototype.ensureThingCollection = function (prething, collectionName, collectionKey, area) {
            var thing = prething.thing, collection = area.collections[collectionName];
            if (!collection) {
                collection = area.collections[collectionName] = {};
            }
            thing.collection = collection;
            collection[collectionKey] = thing;
        };
        /**
         * Creates an Object wrapper around a PreThings Object with versions of
         * each child PreThing[] sorted by xloc and yloc, in increasing and
         * decreasing order.
         *
         * @param {Object} prethings
         * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
         *                  "yInc", and "yDec".
         */
        MapsCreatr.prototype.processPreThingsArrays = function (prethings) {
            var scope = this, output = {}, i;
            for (i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    var children = prethings[i], array = {
                        "xInc": this.getArraySorted(children, this.sortPreThingsXInc),
                        "xDec": this.getArraySorted(children, this.sortPreThingsXDec),
                        "yInc": this.getArraySorted(children, this.sortPreThingsYInc),
                        "yDec": this.getArraySorted(children, this.sortPreThingsYDec)
                    };
                    // Adding in a "push" lambda allows MapsCreatr to interact with
                    // this using the same .push syntax as Arrays.
                    array.push = (function (prething) {
                        scope.addArraySorted(this.xInc, prething, scope.sortPreThingsXInc);
                        scope.addArraySorted(this.xDec, prething, scope.sortPreThingsXDec);
                        scope.addArraySorted(this.yInc, prething, scope.sortPreThingsYInc);
                        scope.addArraySorted(this.yDec, prething, scope.sortPreThingsYDec);
                    }).bind(array);
                    output[i] = array;
                }
            }
            return output;
        };
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
        MapsCreatr.prototype.fromKeys = function (arr) {
            var output = {}, i;
            for (i = 0; i < arr.length; i += 1) {
                output[arr[i]] = [];
            }
            return output;
        };
        /**
         * Returns a shallow copy of an Array, in sorted order based on a given
         * sorter Function.
         *
         * @param {Array} array
         * @param {Function} sorter
         * @
         */
        MapsCreatr.prototype.getArraySorted = function (array, sorter) {
            var copy = array.slice();
            copy.sort(sorter);
            return copy;
        };
        /**
         * Adds an element into an Array using a sorter Function.
         *
         * @param {Array} array
         * @param {Mixed} element
         * @param {Function} sorter   A Function that returns the difference between
         *                            two elements (for example, a Numbers sorter
         *                            given (a,b) would return a - b).
         */
        MapsCreatr.prototype.addArraySorted = function (array, element, sorter) {
            var lower = 0, upper = array.length, index;
            while (lower !== upper) {
                index = ((lower + upper) / 2) | 0;
                // Case: element is less than the index
                if (sorter(element, array[index]) < 0) {
                    upper = index;
                }
                else {
                    // Case: element is higher than the index
                    lower = index + 1;
                }
            }
            if (lower === upper) {
                array.splice(lower, 0, element);
                return;
            }
        };
        /**
         * Sorter for PreThings that results in increasing horizontal order.
         *
         * @param {PreThing} a
         * @param {PreThing} b
         */
        MapsCreatr.prototype.sortPreThingsXInc = function (a, b) {
            return a.left === b.left ? a.top - b.top : a.left - b.left;
        };
        /**
         * Sorter for PreThings that results in decreasing horizontal order.
         *
         * @param {PreThing} a
         * @param {PreThing} b
         */
        MapsCreatr.prototype.sortPreThingsXDec = function (a, b) {
            return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
        };
        /**
         * Sorter for PreThings that results in increasing vertical order.
         *
         * @param {PreThing} a
         * @param {PreThing} b
         */
        MapsCreatr.prototype.sortPreThingsYInc = function (a, b) {
            return a.top === b.top ? a.left - b.left : a.top - b.top;
        };
        /**
         * Sorter for PreThings that results in decreasing vertical order.
         *
         * @param {PreThing} a
         * @param {PreThing} b
         */
        MapsCreatr.prototype.sortPreThingsYDec = function (a, b) {
            return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
        };
        return MapsCreatr;
    })();
    MapsCreatr_1.MapsCreatr = MapsCreatr;
})(MapsCreatr || (MapsCreatr = {}));
var MapScreenr;
(function (MapScreenr_1) {
    "use strict";
    /**
     * A simple container for Map attributes given by switching to an Area within
     * that map. A bounding box of the current viewport is kept, along with any
     * other information desired.
     */
    var MapScreenr = (function () {
        /**
         * Resets the MapScreenr. All members of the settings argument are copied
         * to the MapScreenr itself, though only width and height are required.
         *
         * @param {IMapScreenrSettings} settings
         */
        function MapScreenr(settings) {
            var name;
            if (typeof settings.width === "undefined") {
                throw new Error("No width given to MapScreenr.");
            }
            if (typeof settings.height === "undefined") {
                throw new Error("No height given to MapScreenr.");
            }
            for (name in settings) {
                if (settings.hasOwnProperty(name)) {
                    this[name] = settings[name];
                }
            }
            this.variables = settings.variables || {};
            this.variableArgs = settings.variableArgs || [];
        }
        /* State changes
        */
        /**
         * Completely clears the MapScreenr for use in a new Area. Positioning is
         * reset to (0,0) and user-configured variables are recalculated.
         */
        MapScreenr.prototype.clearScreen = function () {
            this.left = 0;
            this.top = 0;
            this.right = this.width;
            this.bottom = this.height;
            this.setMiddleX();
            this.setMiddleY();
            this.setVariables();
        };
        /**
         * Computes middleX as the midpoint between left and right.
         */
        MapScreenr.prototype.setMiddleX = function () {
            this.middleX = (this.left + this.right) / 2;
        };
        /**
         * Computes middleY as the midpoint between top and bottom.
         */
        MapScreenr.prototype.setMiddleY = function () {
            this.middleY = (this.top + this.bottom) / 2;
        };
        /**
         * Runs all variable Functions with variableArgs to recalculate their
         * values.
         */
        MapScreenr.prototype.setVariables = function () {
            var i;
            for (i in this.variables) {
                if (this.variables.hasOwnProperty(i)) {
                    this[i] = this.variables[i].apply(this, this.variableArgs);
                }
            }
        };
        /* Element shifting
        */
        /**
         * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
         *
         * @param {Number} dx
         * @param {Number} dy
         */
        MapScreenr.prototype.shift = function (dx, dy) {
            if (dx) {
                this.shiftX(dx);
            }
            if (dy) {
                this.shiftY(dy);
            }
        };
        /**
         * Shifts the MapScreenr horizontally by changing left and right by the dx.
         *
         * @param {Number} dx
         */
        MapScreenr.prototype.shiftX = function (dx) {
            this.left += dx;
            this.right += dx;
        };
        /**
         * Shifts the MapScreenr vertically by changing top and bottom by the dy.
         *
         * @param {Number} dy
         */
        MapScreenr.prototype.shiftY = function (dy) {
            this.top += dy;
            this.bottom += dy;
        };
        return MapScreenr;
    })();
    MapScreenr_1.MapScreenr = MapScreenr;
})(MapScreenr || (MapScreenr = {}));
/// <reference path="MapsCreatr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
var MapsHandlr;
(function (MapsHandlr_1) {
    "use strict";
    /**
     * Map manipulator and spawner for GameStartr maps that is the front-end
     * counterpart to MapsCreatr. PreThing listings are loaded from Maps stored in a
     * MapsCreatr and added or removed from user input. Area properties are given to
     * a MapScreenr when a new Area is loaded.
     */
    var MapsHandlr = (function () {
        /**
         * @param {IMapsHandlrSettings} settings
         */
        function MapsHandlr(settings) {
            if (!settings) {
                throw new Error("No settings given to MapsHandlr.");
            }
            // Maps themselves should have been created in the MapsCreator object
            if (!settings.MapsCreator) {
                throw new Error("No MapsCreator provided to MapsHandlr.");
            }
            this.MapsCreator = settings.MapsCreator;
            // Map/Area attributes will need to be stored in a MapScreenr object
            if (!settings.MapScreener) {
                throw new Error("No MapScreener provided to MapsHandlr.");
            }
            this.MapScreener = settings.MapScreener;
            this.onSpawn = settings.onSpawn;
            this.onUnspawn = settings.onUnspawn;
            this.screenAttributes = settings.screenAttributes || [];
            this.stretchAdd = settings.stretchAdd;
            this.afterAdd = settings.afterAdd;
        }
        /* Simple gets
        */
        /**
         * @return {MapsCreatr}   The internal MapsCreator.
         */
        MapsHandlr.prototype.getMapsCreator = function () {
            return this.MapsCreator;
        };
        /**
         * @return {MapScreenr}   The internal MapScreener.
         */
        MapsHandlr.prototype.getMapScreener = function () {
            return this.MapScreener;
        };
        /**
         * @return {String[]}   The attribute names to be copied to MapScreener.
         */
        MapsHandlr.prototype.getScreenAttributes = function () {
            return this.screenAttributes;
        };
        /**
         * @return {String}   The key by which the current Map is indexed.
         */
        MapsHandlr.prototype.getMapName = function () {
            return this.mapName;
        };
        /**
         * Gets the map listed under the given name. If no name is provided, the
         * mapCurrent is returned instead.
         *
         * @param {String} [name]   An optional key to find the map under.
         * @return {Map}
         */
        MapsHandlr.prototype.getMap = function (name) {
            if (name === void 0) { name = undefined; }
            if (typeof name !== "undefined") {
                return this.MapsCreator.getMap(name);
            }
            else {
                return this.mapCurrent;
            }
        };
        /**
         * Simple getter pipe to the internal MapsCreator.getMaps() function.
         *
         * @return {Object<Map>}   A listing of maps, keyed by their names.
         */
        MapsHandlr.prototype.getMaps = function () {
            return this.MapsCreator.getMaps();
        };
        /**
         * @return {Area} The current Area.
         */
        MapsHandlr.prototype.getArea = function () {
            return this.areaCurrent;
        };
        /**
         * @return {String} The name of the current Area.
         */
        MapsHandlr.prototype.getAreaName = function () {
            return this.areaCurrent.name;
        };
        /**
         * @param {String} location   The key of the Location to return.
         * @return {Location} A Location within the current Map.
         */
        MapsHandlr.prototype.getLocation = function (location) {
            return this.areaCurrent.map.locations[location];
        };
        /**
         * Simple getter function for the internal prethings object. This will be
         * undefined before the first call to setMap.
         *
         * @return {Object} A listing of the current area's Prethings.
         */
        MapsHandlr.prototype.getPreThings = function () {
            return this.prethings;
        };
        /* Map / location setting
        */
        /**
         * Sets the currently manipulated Map in the handler to be the one under a
         * given name. Note that this will do very little unless a location is
         * provided.
         *
         * @param {String} name   A key to find the map under.
         * @param {Mixed} [location]   An optional key for a location to immediately
         *                              start the map in (if not provided, ignored).
         *
         */
        MapsHandlr.prototype.setMap = function (name, location) {
            if (location === void 0) { location = undefined; }
            // Get the newly current map from this.getMap normally
            this.mapCurrent = this.getMap(name);
            if (!this.mapCurrent) {
                throw new Error("Unknown Map in setMap: '" + name + "'.");
            }
            this.mapName = name;
            // Most of the work is done by setLocation (by default, the map's first)
            if (arguments.length > 1) {
                this.setLocation(location);
            }
            return this.mapCurrent;
        };
        /**
         * Goes to a particular location in the given map. Area attributes are
         * copied to the MapScreener, PreThings are loaded, and stretches and afters
         * are checked.
         *
         * @param {String} name   The key of the Location to start in.
         */
        MapsHandlr.prototype.setLocation = function (name) {
            var location, attribute, i;
            // Query the location from the current map and ensure it exists
            location = this.mapCurrent.locations[name];
            if (!location) {
                throw new Error("Unknown location in setLocation: '" + name + "'.");
            }
            // Since the location is valid, mark it as current (with its area)
            this.locationCurrent = location;
            this.areaCurrent = location.area;
            this.areaCurrent.boundaries = {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
            };
            // Copy all the settings from that area into the MapScreenr container
            for (i = 0; i < this.screenAttributes.length; i += 1) {
                attribute = this.screenAttributes[i];
                this.MapScreener[attribute] = this.areaCurrent[attribute];
            }
            // Reset the prethings object, enabling it to be used as a fresh start
            // for the new Area/Location placements
            this.prethings = this.MapsCreator.getPreThings(location.area);
            // Optional: set stretch commands
            if (this.areaCurrent.stretches) {
                this.setStretches(this.areaCurrent.stretches);
            }
            else {
                this.stretches = undefined;
            }
            // Optional: set after commands
            if (this.areaCurrent.afters) {
                this.setAfters(this.areaCurrent.afters);
            }
            else {
                this.afters = undefined;
            }
        };
        /**
         * Applies the stretchAdd Function to each given "stretch" command and
         * stores the commands in stretches.
         *
         * @param {Object[]} stretchesRaw
         */
        MapsHandlr.prototype.setStretches = function (stretchesRaw) {
            this.stretches = stretchesRaw;
            this.stretches.forEach(this.stretchAdd);
        };
        /**
         * Applies the afterAdd Function to each given "after" command and stores
         * the commands in afters.
         *
         * @param {Object[]} aftersRaw
         */
        MapsHandlr.prototype.setAfters = function (aftersRaw) {
            this.afters = aftersRaw;
            this.afters.forEach(this.afterAdd);
        };
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
        MapsHandlr.prototype.spawnMap = function (direction, top, right, bottom, left) {
            if (this.onSpawn) {
                this.applySpawnAction(this.onSpawn, true, direction, top, right, bottom, left);
            }
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
        MapsHandlr.prototype.unspawnMap = function (direction, top, right, bottom, left) {
            if (this.onUnspawn) {
                this.applySpawnAction(this.onUnspawn, false, direction, top, right, bottom, left);
            }
        };
        /**
         * Calls onUnspawn on every PreThing touched by the given bounding box,
         * determined in order of the given direction. This is used both to spawn
         * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
         * status is used as a filter: all PreThings that already have the status
         * (generally true or false as spawned or unspawned, respectively) will have
         * the callback called on them.
         *
         * @param {Function} callback   The callback to be run whenever a matching
         *                              matching PreThing is found.
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
        MapsHandlr.prototype.applySpawnAction = function (callback, status, direction, top, right, bottom, left) {
            var name, group, prething, mid, start, end, i;
            // For each group of PreThings currently able to spawn...
            for (name in this.prethings) {
                if (!this.prethings.hasOwnProperty(name)) {
                    continue;
                }
                // Don't bother trying to spawn the group if it has no members
                group = this.prethings[name][direction];
                if (group.length === 0) {
                    continue;
                }
                // Find the start and end points within the PreThings Array
                // Ex. if direction="xInc", go from .left >= left to .left <= right
                mid = (group.length / 2) | 0;
                start = this.findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
                end = this.findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);
                // Loop through all the directionally valid PreThings, spawning if 
                // they're within the bounding box
                for (i = start; i <= end; i += 1) {
                    prething = group[i];
                    // For example: if status is true (spawned), don't spawn again
                    if (prething.spawned !== status) {
                        prething.spawned = status;
                        callback(prething);
                    }
                }
            }
        };
        /**
         * Finds the index from which PreThings should stop having an action
         * applied to them in applySpawnAction. This is less efficient than the
         * unused version below, but is more reliable for slightly unsorted groups.
         *
         * @param {String} direction   The direction by which to order PreThings:
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {PreThing[]} group   The group to find a PreThing index within.
         * @param {Number} mid   The middle of the group. This is currently unused.
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @return {Number}
         */
        MapsHandlr.prototype.findPreThingsSpawnStart = function (direction, group, mid, top, right, bottom, left) {
            var directionKey = MapsHandlr.directionKeys[direction], directionEnd = this.getDirectionEnd(directionKey, top, right, bottom, left), i;
            for (i = 0; i < group.length; i += 1) {
                if (group[i][directionKey] >= directionEnd) {
                    return i;
                }
            }
            return i;
        };
        /**
         * Finds the index from which PreThings should stop having an action
         * applied to them in applySpawnAction. This is less efficient than the
         * unused version below, but is more reliable for slightly unsorted groups.
         *
         * @param {String} direction   The direction by which to order PreThings:
         *                             "xInc", "xDec", "yInc", or "yDec".
         * @param {PreThing[]} group   The group to find a PreThing index within.
         * @param {Number} mid   The middle of the group. This is currently unused.
         * @param {Number} top   The upper-most bound to apply within.
         * @param {Number} right   The right-most bound to apply within.
         * @param {Number} bottom    The bottom-most bound to apply within.
         * @param {Number} left    The left-most bound to apply within.
         * @return {Number}
         */
        MapsHandlr.prototype.findPreThingsSpawnEnd = function (direction, group, mid, top, right, bottom, left) {
            var directionKey = MapsHandlr.directionKeys[direction], directionKeyOpposite = MapsHandlr.directionKeys[MapsHandlr.directionOpposites[direction]], directionEnd = this.getDirectionEnd(directionKeyOpposite, top, right, bottom, left), i;
            for (i = group.length - 1; i >= 0; i -= 1) {
                if (group[i][directionKey] <= directionEnd) {
                    return i;
                }
            }
            return i;
        };
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
        MapsHandlr.prototype.getDirectionEnd = function (directionKey, top, right, bottom, left) {
            switch (directionKey) {
                case "top":
                    return top;
                case "right":
                    return right;
                case "bottom":
                    return bottom;
                case "left":
                    return left;
                default:
                    throw new Error("Unknown directionKey: " + directionKey);
            }
        };
        /**
         * Directional equivalents for converting from directions to keys.
         */
        MapsHandlr.directionKeys = {
            "xInc": "left",
            "xDec": "right",
            "yInc": "top",
            "yDec": "bottom"
        };
        /**
         * Opposite directions for when finding descending order Arrays.
         */
        MapsHandlr.directionOpposites = {
            "xInc": "xDec",
            "xDec": "xInc",
            "yInc": "yDec",
            "yDec": "yInc"
        };
        return MapsHandlr;
    })();
    MapsHandlr_1.MapsHandlr = MapsHandlr;
})(MapsHandlr || (MapsHandlr = {}));
var StringFilr;
(function (StringFilr_1) {
    "use strict";
    /**
     * A general utility for retrieving data from an Object based on nested class
     * names. You can think of the internal "library" Object as a tree structure,
     * such that you can pass in a listing (in any order) of the path to data for
     * retrieval.
     */
    var StringFilr = (function () {
        /**
         * @param {IStringFilrSettings} settings
         */
        function StringFilr(settings) {
            if (!settings) {
                throw new Error("No settings given to StringFilr.");
            }
            if (!settings.library) {
                throw new Error("No library given to StringFilr.");
            }
            this.library = settings.library;
            this.normal = settings.normal;
            this.requireNormalKey = settings.requireNormalKey;
            this.cache = {};
            if (this.requireNormalKey) {
                if (typeof this.normal === "undefined") {
                    throw new Error("StringFilr is given requireNormalKey, but no normal class.");
                }
                this.ensureLibraryNormal();
            }
        }
        /**
         * @return {Object} The base library of stored information.
         */
        StringFilr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         * @return {String} The optional normal class String.
         */
        StringFilr.prototype.getNormal = function () {
            return this.normal;
        };
        /**
         * @return {Object} The complete cache of cached output.
         */
        StringFilr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @return {Mixed} A cached value, if it exists/
         */
        StringFilr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * Completely clears the cache Object.
         */
        StringFilr.prototype.clearCache = function () {
            this.cache = {};
        };
        /**
         * Clears the cached entry for a key.
         *
         * @param {String} key
         */
        StringFilr.prototype.clearCached = function (key) {
            if (this.normal) {
                key = key.replace(this.normal, "");
            }
            delete this.cache[key];
        };
        /**
         * Retrieves the deepest matching data in the library for a key.
         *
         * @param {String} keyRaw
         * @return {Mixed}
         */
        StringFilr.prototype.get = function (keyRaw) {
            var key, result;
            if (this.normal) {
                key = keyRaw.replace(this.normal, "");
            }
            else {
                key = keyRaw;
            }
            // Quickly return a cached result if it exists
            if (this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Since no existed, it must be found deep within the library
            result = this.followClass(key.split(/\s+/g), this.library);
            this.cache[key] = this.cache[keyRaw] = result;
            return result;
        };
        /**
         * Utility helper to recursively check for tree branches in the library
         * that don't have a key equal to the normal. For each sub-directory that
         * is caught, the path to it is added to output.
         *
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @param {String} path   The current path within the library.
         * @param {String[]} output   An Array of the String paths to parts that
         *                           don't have a matching key.
         * @return {String[]} output
         */
        StringFilr.prototype.findLackingNormal = function (current, path, output) {
            var i;
            if (!current.hasOwnProperty(this.normal)) {
                output.push(path);
            }
            if (typeof current[i] === "object") {
                for (i in current) {
                    if (current.hasOwnProperty(i)) {
                        this.findLackingNormal(current[i], path + " " + i, output);
                    }
                }
            }
            return output;
        };
        /**
         * Utility function to follow a path into the library (this is the driver
         * for searching into the library). For each available key, if it matches
         * a key in current, it is removed from keys and recursion happens on the
         * sub-directory in current.
         *
         * @param {String[]} keys   The currently available keys to search within.
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @return {Mixed} The most deeply matched part of the library.
         */
        StringFilr.prototype.followClass = function (keys, current) {
            var key, i;
            // If keys runs out, we're done
            if (!keys || !keys.length) {
                return current;
            }
            // For each key in the current array...
            for (i = 0; i < keys.length; i += 1) {
                key = keys[i];
                // ...if it matches, recurse on the other keys
                if (current.hasOwnProperty(key)) {
                    keys.splice(i, 1);
                    return this.followClass(keys, current[key]);
                }
            }
            // If no key matched, try the normal (default)
            if (this.normal && current.hasOwnProperty(this.normal)) {
                return this.followClass(keys, current[this.normal]);
            }
            // Nothing matches anything; we're done.
            return current;
        };
        /**
         * Driver for this.findLackingNormal. If library directories are found to
         * not have a normal, it throws an error.
         */
        StringFilr.prototype.ensureLibraryNormal = function () {
            var caught = this.findLackingNormal(this.library, "base", []);
            if (caught.length) {
                throw new Error("Found " + caught.length + " library "
                    + "sub-directories missing the normal: "
                    + "\r\n  " + caught.join("\r\n  "));
            }
        };
        return StringFilr;
    })();
    StringFilr_1.StringFilr = StringFilr;
})(StringFilr || (StringFilr = {}));
/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="StringFilr-0.2.1.ts" />
var PixelRendr;
(function (PixelRendr_1) {
    "use strict";
    /**
     * A moderately unusual graphics module designed to compress images as
     * compressed text blobs and store the text blobs in a StringFilr. These tasks
     * are performed and cached quickly enough for use in real-time environments,
     * such as real-time video games.
     *
     * @todo
     * The first versions of this library were made many years ago by an
     * inexperienced author, and have undergone only moderate structural revisions
     * since. There are two key improvements that should happen:
     * 1. On reset, the source library should be mapped to a PartialRender class
     *    that stores loading status and required ("post") references, to enable
     *    lazy loading. See #71.
     * 2. Once lazy loading is implemented for significantly shorter startup times,
     *    an extra layer of compression should be added to compress the technically
     *    human-readable String sources to a binary-ish format. See #236.
     * 3. Rewrite the heck out of this piece of crap.
     */
    var PixelRendr = (function () {
        /**
         * @param {IPixelRendrSettings} settings
         */
        function PixelRendr(settings) {
            if (!settings) {
                throw new Error("No settings given to PixelRendr.");
            }
            if (!settings.paletteDefault) {
                throw new Error("No paletteDefault given to PixelRendr.");
            }
            this.paletteDefault = settings.paletteDefault;
            this.digitsizeDefault = this.getDigitSize(this.paletteDefault);
            this.digitsplit = new RegExp(".{1," + this.digitsizeDefault + "}", "g");
            this.library = {
                "raws": settings.library || {},
                "posts": []
            };
            this.filters = settings.filters || {};
            this.scale = settings.scale || 1;
            this.flipVert = settings.flipVert || "flip-vert";
            this.flipHoriz = settings.flipHoriz || "flip-horiz";
            this.spriteWidth = settings.spriteWidth || "spriteWidth";
            this.spriteHeight = settings.spriteHeight || "spriteHeight";
            this.Uint8ClampedArray = (settings.Uint8ClampedArray
                || window.Uint8ClampedArray
                || window.Uint8Array);
            // The first ChangeLinr does the raw processing of Strings to sprites
            // This is used to load & parse sprites into memory on startup
            this.ProcessorBase = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteUnravel": this.spriteUnravel.bind(this),
                    "spriteApplyFilter": this.spriteApplyFilter.bind(this),
                    "spriteExpand": this.spriteExpand.bind(this),
                    "spriteGetArray": this.spriteGetArray.bind(this)
                },
                "pipeline": [
                    "spriteUnravel",
                    "spriteApplyFilter",
                    "spriteExpand",
                    "spriteGetArray"
                ]
            });
            // The second ChangeLinr does row repeating and flipping
            // This is done on demand when given a sprite's settings Object
            this.ProcessorDims = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteRepeatRows": this.spriteRepeatRows.bind(this),
                    "spriteFlipDimensions": this.spriteFlipDimensions.bind(this)
                },
                "pipeline": [
                    "spriteRepeatRows",
                    "spriteFlipDimensions"
                ]
            });
            // As a utility, a processor is included to encode image data to sprites
            this.ProcessorEncode = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "imageGetData": this.imageGetData.bind(this),
                    "imageGetPixels": this.imageGetPixels.bind(this),
                    "imageMapPalette": this.imageMapPalette.bind(this),
                    "imageCombinePixels": this.imageCombinePixels.bind(this)
                },
                "pipeline": [
                    "imageGetData",
                    "imageGetPixels",
                    "imageMapPalette",
                    "imageCombinePixels"
                ],
                "doUseCache": false
            });
            this.library.sprites = this.libraryParse(this.library.raws, "");
            // Post commands are evaluated after the first processing run
            this.libraryPosts();
            // The BaseFiler provides a searchable 'view' on the library of sprites
            this.BaseFiler = new StringFilr.StringFilr({
                "library": this.library.sprites,
                "normal": "normal" // to do: put this somewhere more official?
            });
        }
        /* Simple gets
        */
        /**
         * @return {Object} The base container for storing sprite information.
         */
        PixelRendr.prototype.getBaseLibrary = function () {
            return this.BaseFiler.getLibrary();
        };
        /**
         * @return {StringFilr} The StringFilr interface on top of the base library.
         */
        PixelRendr.prototype.getBaseFiler = function () {
            return this.BaseFiler;
        };
        /**
         * @return {ChangeLinr} The processor that turns raw strings into partial
         * sprites.
         */
        PixelRendr.prototype.getProcessorBase = function () {
            return this.ProcessorBase;
        };
        /**
         * @return {ChangeLinr} The processor that turns partial sprites and repeats
         *                      rows.
         */
        PixelRendr.prototype.getProcessorDims = function () {
            return this.ProcessorDims;
        };
        /**
         * @return {ChangeLinr} The processor that takes real images and compresses
         *                      their data into sprite Strings.
         */
        PixelRendr.prototype.getProcessorEncode = function () {
            return this.ProcessorEncode;
        };
        /**
         * @param {String} key
         * @return {Mixed} Returns the base sprite for a key. This will either be a
         *                 Uint8ClampedArray if a sprite is found, or the deepest
         *                 Object in the library.
         */
        PixelRendr.prototype.getSpriteBase = function (key) {
            return this.BaseFiler.get(key);
        };
        /* External APIs
        */
        /**
         * Standard render function. Given a key, this finds the raw information via
         * BaseFiler and processes it using ProcessorDims. Attributes are needed so
         * the ProcessorDims can stretch it on width and height.
         *
         * @param {String} key   The general key for the sprite to be passed
         *                       directly to BaseFiler.get.
         * @param {Object} attributes   Additional attributes for the sprite; width
         *                              and height Numbers are required.
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.decode = function (key, attributes) {
            // BaseFiler stores the cache of the base sprites. Note that it doesn't
            // actually require the extra attributes
            var sprite = this.BaseFiler.get(key);
            if (!sprite) {
                throw new Error("No raw sprite found for " + key + ".");
            }
            // Multiple sprites have their sizings taken from attributes
            if (sprite.multiple) {
                if (!sprite.processed) {
                    this.processSpriteMultiple(sprite, key, attributes);
                }
            }
            else {
                // Single (actual) sprites process for size (row) scaling, and flipping
                if (!(sprite instanceof this.Uint8ClampedArray)) {
                    throw new Error("No single raw sprite found for: '" + key + "'");
                }
                sprite = this.ProcessorDims.process(sprite, key, attributes);
            }
            return sprite;
        };
        /**
         * Encodes an image into a sprite via ProcessorEncode.process.
         *
         * @param {HTMLImageElement} image
         * @param {Function} [callback]   An optional callback to call on the image
         *                                with source as an extra argument.
         * @param {Mixed} [source]   An optional extra argument for callback,
         *                           commonly provided by this.encodeUri as the
         *                           image source.
         */
        PixelRendr.prototype.encode = function (image, callback, source) {
            var result = this.ProcessorEncode.process(image);
            if (callback) {
                callback(result, image, source);
            }
            return result;
        };
        /**
         * Fetches an image from a source and encodes it into a sprite via
         * ProcessEncode.process. An HtmlImageElement is created and given an onload
         * of this.encode.
         *
         * @param {String} uri
         * @param {Function} callback   A callback for when this.encode finishes to
         *                              call on the results.
         */
        PixelRendr.prototype.encodeUri = function (uri, callback) {
            var image = document.createElement("img");
            image.onload = this.encode.bind(self, image, callback);
            image.src = uri;
        };
        /**
         * Miscellaneous utility to generate a complete palette from raw image pixel
         * data. Unique [r,g,b,a] values are found using tree-based caching, and
         * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
         * pixel has a=0, it's completely transparent and goes before anything else
         * in the palette. Grayscale colors come next in order of light to dark, and
         * general colors come next sorted by decreasing r, g, and b in order.
         *
         * @param {Uint8ClampedArray} data   The equivalent data from a context's
         *                                   getImageData(...).data.
         * @param {Boolean} [forceZeroColor]   Whether the palette should have a
         *                                     [0,0,0,0] color as the first element
         *                                     even if data does not contain it (by
         *                                     default, false).
         * @param {Boolean} [giveArrays]   Whether the resulting palettes should be
         *                                 converted to Arrays (by default, false).
         * @return {Uint8ClampedArray[]} A working palette that may be used in
         *                               sprite settings (Array[] if giveArrays is
         *                               true).
         */
        PixelRendr.prototype.generatePaletteFromRawData = function (data, forceZeroColor, giveArrays) {
            if (forceZeroColor === void 0) { forceZeroColor = false; }
            if (giveArrays === void 0) { giveArrays = false; }
            var tree = {}, colorsGeneral = [], colorsGrayscale = [], output, i;
            for (i = 0; i < data.length; i += 4) {
                if (data[i + 3] === 0) {
                    forceZeroColor = true;
                    continue;
                }
                if (tree[data[i]]
                    && tree[data[i]][data[i + 1]]
                    && tree[data[i]][data[i + 1]][data[i + 2]]
                    && tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    continue;
                }
                if (!tree[data[i]]) {
                    tree[data[i]] = {};
                }
                if (!tree[data[i]][data[i + 1]]) {
                    tree[data[i]][data[i + 1]] = {};
                }
                if (!tree[data[i]][data[i + 1]][data[i + 2]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]] = {};
                }
                if (!tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]] = true;
                    if (data[i] === data[i + 1] && data[i + 1] === data[i + 2]) {
                        colorsGrayscale.push(data.subarray(i, i + 4));
                    }
                    else {
                        colorsGeneral.push(data.subarray(i, i + 4));
                    }
                }
            }
            // It's safe to sort grayscale colors just on their first values, since
            // grayscale implies they're all the same.
            colorsGrayscale.sort(function (a, b) {
                return a[0] - b[0];
            });
            // For regular colors, sort by the first color that's not equal, so in 
            // order red, green, blue, alpha.
            colorsGeneral.sort(function (a, b) {
                for (i = 0; i < 4; i += 1) {
                    if (a[i] !== b[i]) {
                        return b[i] - a[i];
                    }
                }
            });
            if (forceZeroColor) {
                output = [new this.Uint8ClampedArray([0, 0, 0, 0])]
                    .concat(colorsGrayscale)
                    .concat(colorsGeneral);
            }
            else {
                output = colorsGrayscale.concat(colorsGeneral);
            }
            if (!giveArrays) {
                return output;
            }
            for (i = 0; i < output.length; i += 1) {
                output[i] = Array.prototype.slice.call(output[i]);
            }
            return output;
        };
        /**
         * Copies a stretch of members from one Uint8ClampedArray or number[] to
         * another. This is a useful utility Function for code that may use this
         * PixelRendr to draw its output sprites, such as PixelDrawr.
         *
         * @param {Uint8ClampedArray} source
         * @param {Uint8ClampedArray} destination
         * @param {Number} readloc   Where to start reading from in the source.
         * @param {Number} writeloc   Where to start writing to in the source.
         * @param {Number} writelength   How many members to copy over.
         * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
         * @see http://www.javascripture.com/Uint8ClampedArray
         */
        PixelRendr.prototype.memcpyU8 = function (source, destination, readloc, writeloc, writelength) {
            if (readloc === void 0) { readloc = 0; }
            if (writeloc === void 0) { writeloc = 0; }
            if (writelength === void 0) { writelength = Math.max(0, Math.min(source.length, destination.length)); }
            if (!source || !destination || readloc < 0 || writeloc < 0 || writelength <= 0) {
                return;
            }
            if (readloc >= source.length || writeloc >= destination.length) {
                // console.log("Alert: memcpyU8 requested out of bounds!");
                // console.log("source, destination, readloc, writeloc, writelength");
                // console.log(arguments);
                return;
            }
            // JIT compilcation help
            var lwritelength = writelength + 0, lwriteloc = writeloc + 0, lreadloc = readloc + 0;
            while (lwritelength--) {
                destination[lwriteloc++] = source[lreadloc++];
            }
        };
        /* Library parsing
         */
        /**
         * Recursive Function to go throw a library and parse it. A copy of the
         * structure is made where each result is either a parsed sprite, a
         * placeholder for a post command, or a recursively generated child Object.
         *
         * @param {Object} reference   The raw source structure to be parsed.
         * @param {String} path   The path to the current place within the library.
         * @return {Object} The parsed library Object.
         */
        PixelRendr.prototype.libraryParse = function (reference, path) {
            var setnew = {}, objref, i;
            // For each child of the current layer:
            for (i in reference) {
                if (!reference.hasOwnProperty(i)) {
                    continue;
                }
                objref = reference[i];
                switch (objref.constructor) {
                    // If it's a string, parse it
                    case String:
                        setnew[i] = this.ProcessorBase.process(objref, path + " " + i);
                        break;
                    // If it's an array, it should have a command such as 'same' to be post-processed
                    case Array:
                        this.library.posts.push({
                            caller: setnew,
                            name: i,
                            command: reference[i],
                            path: path + " " + i
                        });
                        break;
                    // If it's anything else, simply recurse
                    default:
                        setnew[i] = this.libraryParse(objref, path + " " + i);
                        break;
                }
            }
            return setnew;
        };
        /**
         * Driver to evaluate post-processing commands, such as copies and filters.
         * This is run after the main processing finishes. Each post command is
         * given to evaluatePost.
         */
        PixelRendr.prototype.libraryPosts = function () {
            var posts = this.library.posts, post, i;
            for (i = 0; i < posts.length; i += 1) {
                post = posts[i];
                post.caller[post.name] = this.evaluatePost(post.caller, post.command, post.path);
            }
        };
        /**
         * Evaluates a post command and returns the result to be used in the
         * library. It can be "same", "filter", or "vertical".
         *
         * @param {Object} caller   The place within the library store results in.
         * @param {Array} command   The command from the library, represented as
         *                          ["type", [info...]]
         * @param {String} path   The path to the caller.
         */
        PixelRendr.prototype.evaluatePost = function (caller, command, path) {
            var spriteRaw, filter;
            switch (command[0]) {
                // Same: just returns a reference to the target
                // ["same", ["container", "path", "to", "target"]]
                case "same":
                    spriteRaw = this.followPath(this.library.raws, command[1], 0);
                    if (spriteRaw.constructor === String) {
                        return this.ProcessorBase.process(spriteRaw, path);
                    }
                    else if (spriteRaw.constructor === Array) {
                        return this.evaluatePost(caller, spriteRaw, path);
                    }
                    return this.libraryParse(spriteRaw, path);
                // Filter: takes a reference to the target, and applies a filter to it
                // ["filter", ["container", "path", "to", "target"], filters.DoThisFilter]
                case "filter":
                    // Find the sprite this should be filtering from
                    spriteRaw = this.followPath(this.library.raws, command[1], 0);
                    filter = this.filters[command[2]];
                    if (!filter) {
                        console.warn("Invalid filter provided:", command[2], this.filters);
                        filter = {};
                    }
                    return this.evaluatePostFilter(spriteRaw, path, filter);
                // Multiple: uses more than one image, either vertically or horizontally
                // Not to be confused with having .repeat = true.
                // ["multiple", "vertical", {
                //    top: "...",       // (just once at the top)
                //    middle: "..."     // (repeated after top)
                //  }
                case "multiple":
                    return this.evaluatePostMultiple(path, command);
                // Commands not evaluated by the switch are unknown and bad
                default:
                    console.warn("Unknown post command: '" + command[0] + "'.", caller, command, path);
            }
        };
        /**
         * Driver function to recursively apply a filter on a sprite or Object.
         *
         * @param {Mixed} spriteRaw   What the filter is being applied on (either a
         *                            sprite, or a collection of sprites).
         * @param {String} path   The path to the spriteRaw in the library.
         * @param {Object} filter   The pre-determined filter to apply.
         */
        PixelRendr.prototype.evaluatePostFilter = function (spriteRaw, path, filter) {
            // If it's just a String, process the sprite normally
            if (spriteRaw.constructor === String) {
                return this.ProcessorBase.process(spriteRaw, path, {
                    filter: filter
                });
            }
            // If it's an Array, that's a post that hasn't yet been evaluated: evaluate it by the path
            if (spriteRaw instanceof Array) {
                return this.evaluatePostFilter(this.followPath(this.library.raws, spriteRaw[1], 0), spriteRaw[1].join(" "), filter);
            }
            // If it's a generic Object, go recursively on its children
            if (spriteRaw instanceof Object) {
                var output = {}, i;
                for (i in spriteRaw) {
                    if (spriteRaw.hasOwnProperty(i)) {
                        output[i] = this.evaluatePostFilter(spriteRaw[i], path + " " + i, filter);
                    }
                }
                return output;
            }
            // Anything else is a complaint
            console.warn("Invalid sprite provided for a post filter.", spriteRaw, path, filter);
        };
        /**
         * Creates a SpriteMultiple based on a library's command.
         *
         * @param {String} path   The path to the SpriteMultiple.
         * @param {Array} command   The instructions from the library, in the form
         *                          ["multiple", "{direction}", {Information}].
         */
        PixelRendr.prototype.evaluatePostMultiple = function (path, command) {
            var direction = command[1], sections = command[2], output = {
                "direction": direction,
                "multiple": true,
                "sprites": {},
                "processed": false,
                "topheight": sections.topheight | 0,
                "rightwidth": sections.rightwidth | 0,
                "bottomheight": sections.bottomheight | 0,
                "leftwidth": sections.leftwidth | 0,
                "middleStretch": sections.middleStretch || false
            }, i;
            for (i in sections) {
                if (sections.hasOwnProperty(i)) {
                    output.sprites[i] = this.ProcessorBase.process(sections[i], path + direction + i);
                }
            }
            return output;
        };
        /**
         * Processes each of the components in a SpriteMultiple. These are all
         * individually processed using the attributes by the dimensions processor.
         * Each sub-sprite will be processed as if it were in a sub-Object referred
         * to by the path (so if path is "foo bar", "foo bar middle" will be the
         * middle sprite's key).
         *
         * @param {SpriteMultiple} sprite
         * @param {String} key
         * @param {Object} attributes
         */
        PixelRendr.prototype.processSpriteMultiple = function (sprite, key, attributes) {
            var i;
            for (i in sprite.sprites) {
                if (sprite.sprites[i] instanceof this.Uint8ClampedArray) {
                    sprite.sprites[i] = this.ProcessorDims.process(sprite.sprites[i], key + " " + i, attributes);
                }
            }
            sprite.processed = true;
        };
        /* Core pipeline functions
        */
        /**
         * Given a compressed raw sprite data string, this 'unravels' it. This is
         * the first Function called in the base processor. It could output the
         * Uint8ClampedArray immediately if given the area - deliberately does not
         * to simplify sprite library storage.
         *
         * @param {String} colors   The raw sprite String, including commands like
         *                          "p" and "x".
         * @return {String} A version of the sprite with no fancy commands, just
         *                  the numbers.
         */
        PixelRendr.prototype.spriteUnravel = function (colors) {
            var paletteref = this.getPaletteReferenceStarting(this.paletteDefault), digitsize = this.digitsizeDefault, clength = colors.length, current, rep, nixloc, output = "", loc = 0;
            while (loc < clength) {
                switch (colors[loc]) {
                    // A loop, ordered as 'x char times ,'
                    case "x":
                        // Get the location of the ending comma
                        nixloc = colors.indexOf(",", ++loc);
                        // Get the color
                        current = this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        // Get the rep times
                        rep = Number(colors.slice(loc, nixloc));
                        // Add that int to output, rep many times
                        while (rep--) {
                            output += current;
                        }
                        loc = nixloc + 1;
                        break;
                    // A palette changer, in the form 'p[X,Y,Z...]' (or "p" for default)
                    case "p":
                        // If the next character is a "[", customize.
                        if (colors[++loc] === "[") {
                            nixloc = colors.indexOf("]");
                            // Isolate and split the new palette's numbers
                            paletteref = this.getPaletteReference(colors.slice(loc + 1, nixloc).split(","));
                            loc = nixloc + 1;
                            digitsize = 1;
                        }
                        else {
                            // Otherwise go back to default
                            paletteref = this.getPaletteReference(this.paletteDefault);
                            digitsize = this.digitsizeDefault;
                        }
                        break;
                    // A typical number
                    default:
                        output += this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        break;
                }
            }
            return output;
        };
        /**
         * Repeats each number in the given string a number of times equal to the
         * scale. This is the second Function called by the base processor.
         *
         * @param {String} colors
         * @return {String}
         */
        PixelRendr.prototype.spriteExpand = function (colors) {
            var output = "", clength = colors.length, i = 0, j, current;
            // For each number,
            while (i < clength) {
                current = colors.slice(i, i += this.digitsizeDefault);
                // Put it into output as many times as needed
                for (j = 0; j < this.scale; ++j) {
                    output += current;
                }
            }
            return output;
        };
        /**
         * Used during post-processing before spriteGetArray to filter colors. This
         * is the third Function used by the base processor, but it just returns the
         * original sprite if no filter should be applied from attributes.
         * Filters are applied here because the sprite is just the numbers repeated,
         * so it's easy to loop through and replace them.
         *
         * @param {String} colors
         * @param {String} key
         * @param {Object} attributes
         * @return {String}
         */
        PixelRendr.prototype.spriteApplyFilter = function (colors, key, attributes) {
            // If there isn't a filter (as is the normal), just return the sprite
            if (!attributes || !attributes.filter) {
                return colors;
            }
            var filter = attributes.filter, filterName = filter[0];
            if (!filterName) {
                return colors;
            }
            switch (filterName) {
                // Palette filters switch all instances of one color with another
                case "palette":
                    // Split the colors on on each digit
                    // ("...1234..." => [..., "12", "34", ...]
                    var split = colors.match(this.digitsplit), i;
                    // For each color filter to be applied, replace it
                    for (i in filter[1]) {
                        if (filter[1].hasOwnProperty(i)) {
                            this.arrayReplace(split, i, filter[1][i]);
                        }
                    }
                    return split.join("");
                default:
                    console.warn("Unknown filter: '" + filterName + "'.");
            }
            return colors;
        };
        /**
         * Converts an unraveled String of sprite numbers to the equivalent RGBA
         * Uint8ClampedArray. Each colors number will be represented by four numbers
         * in the output. This is the fourth Function called in the base processor.
         *
         * @param {String} colors
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteGetArray = function (colors) {
            var clength = colors.length, numcolors = clength / this.digitsizeDefault, split = colors.match(this.digitsplit), olength = numcolors * 4, output = new this.Uint8ClampedArray(olength), reference, i, j, k;
            // For each color,
            for (i = 0, j = 0; i < numcolors; ++i) {
                // Grab its RGBA ints
                reference = this.paletteDefault[Number(split[i])];
                // Place each in output
                for (k = 0; k < 4; ++k) {
                    output[j + k] = reference[k];
                }
                j += 4;
            }
            return output;
        };
        /**
         * Repeats each row of a sprite based on the container attributes to create
         * the actual sprite (before now, the sprite was 1 / scale as high as it
         * should have been). This is the first Function called in the dimensions
         * processor.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes   The container Object (commonly a Thing in
         *                              GameStarter), which must contain width and
         *                              height numbers.
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteRepeatRows = function (sprite, key, attributes) {
            var parsed = new this.Uint8ClampedArray(sprite.length * this.scale), rowsize = attributes[this.spriteWidth] * 4, heightscale = attributes[this.spriteHeight] * this.scale, readloc = 0, writeloc = 0, si, sj;
            // For each row:
            for (si = 0; si < heightscale; ++si) {
                // Add it to parsed x scale
                for (sj = 0; sj < this.scale; ++sj) {
                    this.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                    writeloc += rowsize;
                }
                readloc += rowsize;
            }
            return parsed;
        };
        /**
         * Optionally flips a sprite based on the flipVert and flipHoriz keys. This
         * is the second Function in the dimensions processor and the last step
         * before a sprite is deemed usable.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteFlipDimensions = function (sprite, key, attributes) {
            if (key.indexOf(this.flipHoriz) !== -1) {
                if (key.indexOf(this.flipVert) !== -1) {
                    return this.flipSpriteArrayBoth(sprite);
                }
                else {
                    return this.flipSpriteArrayHoriz(sprite, attributes);
                }
            }
            else if (key.indexOf(this.flipVert) !== -1) {
                return this.flipSpriteArrayVert(sprite, attributes);
            }
            return sprite;
        };
        /**
         * Flips a sprite horizontally by reversing the pixels within each row. Rows
         * are computing using the spriteWidth in attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayHoriz = function (sprite, attributes) {
            var length = sprite.length, width = attributes[this.spriteWidth] + 0, newsprite = new this.Uint8ClampedArray(length), rowsize = width * 4, newloc, oldloc, i, j, k;
            // For each row:
            for (i = 0; i < length; i += rowsize) {
                newloc = i;
                oldloc = i + rowsize - 4;
                // For each pixel:
                for (j = 0; j < rowsize; j += 4) {
                    // Copy it over
                    for (k = 0; k < 4; ++k) {
                        newsprite[newloc + k] = sprite[oldloc + k];
                    }
                    newloc += 4;
                    oldloc -= 4;
                }
            }
            return newsprite;
        };
        /**
         * Flips a sprite horizontally by reversing the order of the rows. Rows are
         * computing using the spriteWidth in attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayVert = function (sprite, attributes) {
            var length = sprite.length, width = attributes[this.spriteWidth] + 0, newsprite = new this.Uint8ClampedArray(length), rowsize = width * 4, newloc = 0, oldloc = length - rowsize, i, j;
            // For each row
            while (newloc < length) {
                // For each pixel in the rows
                for (i = 0; i < rowsize; i += 4) {
                    // For each rgba value
                    for (j = 0; j < 4; ++j) {
                        newsprite[newloc + i + j] = sprite[oldloc + i + j];
                    }
                }
                newloc += rowsize;
                oldloc -= rowsize;
            }
            return newsprite;
        };
        /**
         * Flips a sprite horizontally and vertically by reversing the order of the
         * pixels. This doesn't actually need attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayBoth = function (sprite) {
            var length = sprite.length, newsprite = new this.Uint8ClampedArray(length), oldloc = sprite.length - 4, newloc = 0, i;
            while (newloc < length) {
                for (i = 0; i < 4; ++i) {
                    newsprite[newloc + i] = sprite[oldloc + i];
                }
                newloc += 4;
                oldloc -= 4;
            }
            return newsprite;
        };
        /* Encoding pipeline functions
        */
        /**
         * Retrives the raw pixel data from an image element. It is copied onto a
         * canvas, which as its context return the .getImageDate().data results.
         * This is the first Fiunction used in the encoding processor.
         *
         * @param {HTMLImageElement} image
         */
        PixelRendr.prototype.imageGetData = function (image) {
            var canvas = document.createElement("canvas"), context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height).data;
        };
        /**
         * Determines which pixels occur in the data and at what frequency. This is
         * the second Function used in the encoding processor.
         *
         * @param {Uint8ClampedArray} data   The raw pixel data obtained from the
         *                                   imageData of a canvas.
         * @return {Array} [pixels, occurences], where pixels is an array of [rgba]
         *                 values and occurences is an Object mapping occurence
         *                 frequencies of palette colors in pisels.
         */
        PixelRendr.prototype.imageGetPixels = function (data) {
            var pixels = new Array(data.length / 4), occurences = {}, pixel, i, j;
            for (i = 0, j = 0; i < data.length; i += 4, j += 1) {
                pixel = this.getClosestInPalette(this.paletteDefault, data.subarray(i, i + 4));
                pixels[j] = pixel;
                if (occurences.hasOwnProperty(pixel)) {
                    occurences[pixel] += 1;
                }
                else {
                    occurences[pixel] = 1;
                }
            }
            return [pixels, occurences];
        };
        /**
         * Concretely defines the palette to be used for a new sprite. This is the
         * third Function used in the encoding processor, and creates a technically
         * usable (but uncompressed) sprite with information to compress it.
         *
         * @param {Array} information   [pixels, occurences], a result directly from
         *                              imageGetPixels.
         * @return {Array} [palette, numbers, digitsize], where palette is a
         *                 String[] of palette numbers, numbers is the actual sprite
         *                 data, and digitsize is the sprite's digit size.
         */
        PixelRendr.prototype.imageMapPalette = function (information) {
            var pixels = information[0], occurences = information[1], palette = Object.keys(occurences), digitsize = this.getDigitSize(palette), paletteIndices = this.getValueIndices(palette), numbers = pixels.map(this.getKeyValue.bind(this, paletteIndices));
            return [palette, numbers, digitsize];
        };
        /**
         * Compresses a nearly complete sprite from imageMapPalette into a
         * compressed, storage-ready String. This is the last Function in the
         * encoding processor.
         *
         * @param {Array} information   [palette, numbers, digitsize], a result
         *                              directly from imageMapPalette.
         * @return {String}
         */
        PixelRendr.prototype.imageCombinePixels = function (information) {
            var palette = information[0], numbers = information[1], digitsize = information[2], threshold = Math.max(3, Math.round(4 / digitsize)), output, current, digit, i = 0, j;
            output = "p[" + palette.map(this.makeSizedDigit.bind(this, digitsize)).join(",") + "]";
            while (i < numbers.length) {
                j = i + 1;
                current = numbers[i];
                digit = this.makeDigit(current, digitsize);
                while (current === numbers[j]) {
                    j += 1;
                }
                if (j - i > threshold) {
                    output += "x" + digit + String(j - i) + ",";
                    i = j;
                }
                else {
                    do {
                        output += digit;
                        i += 1;
                    } while (i < j);
                }
            }
            return output;
        };
        /* Misc. utility functions
        */
        /**
         * @param {Array} palette
         * @return {Number} What the digitsize for a sprite that uses the palette
         *                  should be (how many digits it would take to represent
         *                  any index of the palettte).
         */
        PixelRendr.prototype.getDigitSize = function (palette) {
            return Math.floor(Math.log(palette.length) / Math.LN10) + 1;
        };
        /**
         * Generates an actual palette Object for a given palette, using a digitsize
         * calculated from the palette.
         *
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        PixelRendr.prototype.getPaletteReference = function (palette) {
            var output = {}, digitsize = this.getDigitSize(palette), i;
            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, digitsize)] = this.makeDigit(palette[i], digitsize);
            }
            return output;
        };
        /**
         * Generates an actual palette Object for a given palette, using the default
         * digitsize.
         *
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        PixelRendr.prototype.getPaletteReferenceStarting = function (palette) {
            var output = {}, i;
            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, this.digitsizeDefault)] = this.makeDigit(i, this.digitsizeDefault);
            }
            return output;
        };
        /**
         * Finds which rgba value in a palette is closest to a given value. This is
         * useful for determining which color in a pre-existing palette matches up
         * with a raw image's pixel. This is determined by which palette color has
         * the lowest total difference in integer values between r, g, b, and a.
         *
         * @param {Array} palette   The palette of pre-existing colors.
         * @param {Array} rgba   The RGBA values being assigned a color, as Numbers
         *                       in [0, 255].
         * @return {Number} The closest matching color index.
         */
        PixelRendr.prototype.getClosestInPalette = function (palette, rgba) {
            var bestDifference = Infinity, difference, bestIndex, i;
            for (i = palette.length - 1; i >= 0; i -= 1) {
                difference = this.arrayDifference(palette[i], rgba);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestIndex = i;
                }
            }
            return bestIndex;
        };
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param {String} string   The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         * @return {String}
         */
        PixelRendr.prototype.stringOf = function (str, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
        };
        /**
         * Turns a Number into a String with a prefix added to pad it to a certain
         * number of digits.
         *
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @param {String} [prefix]   A prefix to repeat for padding (by default,
         *                            "0").
         * @return {String}
         * @example
         * makeDigit(7, 3); // '007'
         * makeDigit(7, 3, 1); // '117'
         */
        PixelRendr.prototype.makeDigit = function (num, size, prefix) {
            if (prefix === void 0) { prefix = "0"; }
            return this.stringOf(prefix, Math.max(0, size - String(num).length)) + num;
        };
        /**
         * Curry wrapper around makeDigit that reverses size and number argument
         * order. Useful for binding makeDigit.
         *
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @return {String}
         */
        PixelRendr.prototype.makeSizedDigit = function (size, num) {
            return this.makeDigit(num, size, "0");
        };
        /**
         * Replaces all instances of an element in an Array.
         *
         * @param {Array}
         * @param {Mixed} removed   The element to remove.
         * @param {Mixed} inserted   The element to insert.
         */
        PixelRendr.prototype.arrayReplace = function (array, removed, inserted) {
            for (var i = array.length - 1; i >= 0; i -= 1) {
                if (array[i] === removed) {
                    array[i] = inserted;
                }
            }
            return array;
        };
        /**
         * Computes the sum of the differences of elements between two Arrays of
         * equal length.
         *
         * @param {Array} a
         * @param {Array} b
         * @return {Number}
         */
        PixelRendr.prototype.arrayDifference = function (a, b) {
            var sum = 0, i;
            for (i = a.length - 1; i >= 0; i -= 1) {
                sum += Math.abs(a[i] - b[i]) | 0;
            }
            return sum;
        };
        /**
         * @param {Array}
         * @return {Object} An Object with an index equal to each element of the
         *                  Array.
         */
        PixelRendr.prototype.getValueIndices = function (array) {
            var output = {}, i;
            for (i = 0; i < array.length; i += 1) {
                output[array[i]] = i;
            }
            return output;
        };
        /**
         * Curry Function to retrieve a member of an Object. Useful for binding.
         *
         * @param {Object} object
         * @param {String} key
         * @return {Mixed}
         */
        PixelRendr.prototype.getKeyValue = function (object, key) {
            return object[key];
        };
        /**
         * Follows a path inside an Object recursively, based on a given path.
         *
         * @param {Mixed} object
         * @param {String[]} path   The ordered names of attributes to descend into.
         * @param {Number} num   The starting index in path.
         * @return {Mixed}
         */
        PixelRendr.prototype.followPath = function (obj, path, num) {
            if (num < path.length && obj.hasOwnProperty(path[num])) {
                return this.followPath(obj[path[num]], path, num + 1);
            }
            return obj;
        };
        return PixelRendr;
    })();
    PixelRendr_1.PixelRendr = PixelRendr;
})(PixelRendr || (PixelRendr = {}));
/// <reference path="ObjectMakr-0.2.2.ts" />
var QuadsKeepr;
(function (QuadsKeepr_1) {
    "use strict";
    /**
     * Quadrant-based collision detection. A grid structure of Quadrants is kept,
     * with Things placed within quadrants they intersect. Each Quadrant knows which
     * Things are in it, and each Thing knows its quadrants. Operations are
     * available to shift quadrants horizontally or vertically and add/remove rows
     * and columns.
     */
    var QuadsKeepr = (function () {
        /**
         * @param {IQuadsKeeprSettings} settings
         */
        function QuadsKeepr(settings) {
            if (!settings.ObjectMaker) {
                throw new Error("No ObjectMaker given to QuadsKeepr.");
            }
            this.ObjectMaker = settings.ObjectMaker;
            if (!settings.numRows) {
                throw new Error("No numRows given to QuadsKeepr.");
            }
            this.numRows = settings.numRows;
            if (!settings.numCols) {
                throw new Error("No numCols given to QuadsKeepr.");
            }
            this.numCols = settings.numCols;
            if (!settings.quadrantWidth) {
                throw new Error("No quadrantWidth given to QuadsKeepr.");
            }
            this.quadrantWidth = settings.quadrantWidth | 0;
            if (!settings.quadrantHeight) {
                throw new Error("No quadrantHeight given to QuadsKeepr.");
            }
            this.quadrantHeight = settings.quadrantHeight | 0;
            if (!settings.groupNames) {
                throw new Error("No groupNames given to QuadsKeepr.");
            }
            this.groupNames = settings.groupNames;
            this.onAdd = settings.onAdd;
            this.onRemove = settings.onRemove;
            this.startLeft = settings.startLeft | 0;
            this.startTop = settings.startTop | 0;
            this.keyTop = settings.keyTop || "top";
            this.keyLeft = settings.keyLeft || "left";
            this.keyBottom = settings.keyBottom || "bottom";
            this.keyRight = settings.keyRight || "right";
            this.keyNumQuads = settings.keyNumQuads || "numquads";
            this.keyQuadrants = settings.keyQuadrants || "quadrants";
            this.keyChanged = settings.keyChanged || "changed";
            this.keyToleranceX = settings.keyToleranceX || "tolx";
            this.keyToleranceY = settings.keyToleranceY || "toly";
            this.keyGroupName = settings.keyGroupName || "group";
            this.keyOffsetX = settings.keyOffsetX;
            this.keyOffsetY = settings.keyOffsetY;
        }
        /* Simple gets
        */
        /**
         * @return {Object} The listing of Quadrants grouped by row.
         */
        QuadsKeepr.prototype.getQuadrantRows = function () {
            return this.quadrantRows;
        };
        /**
         * @return {Object} The listing of Quadrants grouped by column.
         */
        QuadsKeepr.prototype.getQuadrantCols = function () {
            return this.quadrantCols;
        };
        /**
         * @return {Number} How many Quadrant rows there are.
         */
        QuadsKeepr.prototype.getNumRows = function () {
            return this.numRows;
        };
        /**
         * @return {Number} How many Quadrant columns there are.
         */
        QuadsKeepr.prototype.getNumCols = function () {
            return this.numCols;
        };
        /**
         * @return {Number} How wide each Quadrant is.
         */
        QuadsKeepr.prototype.getQuadrantWidth = function () {
            return this.quadrantWidth;
        };
        /**
         * @return {Number} How high each Quadrant is.
         */
        QuadsKeepr.prototype.getQuadrantHeight = function () {
            return this.quadrantHeight;
        };
        /* Quadrant updates
        */
        /**
         * Completely resets all Quadrants. The grid structure of rows and columns
         * is remade according to startLeft and startTop, and newly created
         * Quadrants pushed into it.
         */
        QuadsKeepr.prototype.resetQuadrants = function () {
            var left = this.startLeft, top = this.startTop, quadrant, i, j;
            this.top = this.startTop;
            this.right = this.startLeft + this.quadrantWidth * this.numCols;
            this.bottom = this.startTop + this.quadrantHeight * this.numRows;
            this.left = this.startLeft;
            this.quadrantRows = [];
            this.quadrantCols = [];
            this.offsetX = 0;
            this.offsetY = 0;
            for (i = 0; i < this.numRows; i += 1) {
                this.quadrantRows.push({
                    "left": this.startLeft,
                    "top": top,
                    "quadrants": []
                });
                top += this.quadrantHeight;
            }
            for (j = 0; j < this.numCols; j += 1) {
                this.quadrantCols.push({
                    "left": left,
                    "top": this.startTop,
                    "quadrants": []
                });
                left += this.quadrantWidth;
            }
            top = this.startTop;
            for (i = 0; i < this.numRows; i += 1) {
                left = this.startLeft;
                for (j = 0; j < this.numCols; j += 1) {
                    quadrant = this.createQuadrant(left, top);
                    this.quadrantRows[i].quadrants.push(quadrant);
                    this.quadrantCols[j].quadrants.push(quadrant);
                    left += this.quadrantWidth;
                }
                top += this.quadrantHeight;
            }
            if (this.onAdd) {
                this.onAdd("xInc", this.top, this.right, this.bottom, this.left);
            }
        };
        /**
         * Shifts each Quadrant horizontally and vertically, along with the row and
         * column containers. Offsets are adjusted to check for row or column
         * deletion and insertion.
         *
         * @param {Number} dx   How much to shfit horizontally (will be rounded).
         * @param {Number} dy   How much to shift vertically (will be rounded).
         */
        QuadsKeepr.prototype.shiftQuadrants = function (dx, dy) {
            if (dx === void 0) { dx = 0; }
            if (dy === void 0) { dy = 0; }
            var row, col;
            dx = dx | 0;
            dy = dy | 0;
            this.offsetX += dx;
            this.offsetY += dy;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
            this.left += dx;
            for (row = 0; row < this.numRows; row += 1) {
                this.quadrantRows[row].left += dx;
                this.quadrantRows[row].top += dy;
            }
            for (col = 0; col < this.numCols; col += 1) {
                this.quadrantCols[col].left += dx;
                this.quadrantCols[col].top += dy;
            }
            for (row = 0; row < this.numRows; row += 1) {
                for (col = 0; col < this.numCols; col += 1) {
                    this.shiftQuadrant(this.quadrantRows[row].quadrants[col], dx, dy);
                }
            }
            this.adjustOffsets();
        };
        /**
         * Adds a QuadrantRow to the end of the quadrantRows Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onAdd
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.pushQuadrantRow = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            var row = this.createQuadrantRow(this.left, this.bottom), i;
            this.numRows += 1;
            this.quadrantRows.push(row);
            for (i = 0; i < this.quadrantCols.length; i += 1) {
                this.quadrantCols[i].quadrants.push(row.quadrants[i]);
            }
            this.bottom += this.quadrantHeight;
            if (callUpdate && this.onAdd) {
                this.onAdd("yInc", this.bottom, this.right, this.bottom - this.quadrantHeight, this.left);
            }
            return row;
        };
        /**
         * Adds a QuadrantCol to the end of the quadrantCols Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onAdd
         *                                 trigger with the new col's bounding box.
         */
        QuadsKeepr.prototype.pushQuadrantCol = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            var col = this.createQuadrantCol(this.right, this.top), i;
            this.numCols += 1;
            this.quadrantCols.push(col);
            for (i = 0; i < this.quadrantRows.length; i += 1) {
                this.quadrantRows[i].quadrants.push(col.quadrants[i]);
            }
            this.right += this.quadrantWidth;
            if (callUpdate && this.onAdd) {
                this.onAdd("xInc", this.top, this.right - this.offsetY, this.bottom, this.right - this.quadrantWidth - this.offsetY);
            }
            return col;
        };
        /**
         * Removes the last QuadrantRow from the end of the quadrantRows Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onRemove
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.popQuadrantRow = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            for (var i = 0; i < this.quadrantCols.length; i += 1) {
                this.quadrantCols[i].quadrants.pop();
            }
            this.numRows -= 1;
            this.quadrantRows.pop();
            if (callUpdate && this.onRemove) {
                this.onRemove("yInc", this.bottom, this.right, this.bottom - this.quadrantHeight, this.left);
            }
            this.bottom -= this.quadrantHeight;
        };
        /**
         * Removes the last QuadrantCol from the end of the quadrantCols Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onRemove
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.popQuadrantCol = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            for (var i = 0; i < this.quadrantRows.length; i += 1) {
                this.quadrantRows[i].quadrants.pop();
            }
            this.numCols -= 1;
            this.quadrantCols.pop();
            if (callUpdate && this.onRemove) {
                this.onRemove("xDec", this.top, this.right - this.offsetY, this.bottom, this.right - this.quadrantWidth - this.offsetY);
            }
            this.right -= this.quadrantWidth;
        };
        /**
         * Adds a QuadrantRow to the beginning of the quadrantRows Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onAdd
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.unshiftQuadrantRow = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            var row = this.createQuadrantRow(this.left, this.top - this.quadrantHeight), i;
            this.numRows += 1;
            this.quadrantRows.unshift(row);
            for (i = 0; i < this.quadrantCols.length; i += 1) {
                this.quadrantCols[i].quadrants.unshift(row.quadrants[i]);
            }
            this.top -= this.quadrantHeight;
            if (callUpdate && this.onAdd) {
                this.onAdd("yInc", this.top, this.right, this.top + this.quadrantHeight, this.left);
            }
            return row;
        };
        /**
         * Adds a QuadrantCol to the beginning of the quadrantCols Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onAdd
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.unshiftQuadrantCol = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            var col = this.createQuadrantCol(this.left - this.quadrantWidth, this.top), i;
            this.numCols += 1;
            this.quadrantCols.unshift(col);
            for (i = 0; i < this.quadrantRows.length; i += 1) {
                this.quadrantRows[i].quadrants.unshift(col.quadrants[i]);
            }
            this.left -= this.quadrantWidth;
            if (callUpdate && this.onAdd) {
                this.onAdd("xInc", this.top, this.left, this.bottom, this.left + this.quadrantWidth);
            }
            return col;
        };
        /**
         * Removes a QuadrantRow from the beginning of the quadrantRows Array.
         *
         * @param {Boolean} [callUpdate]   Whether this should call the onAdd
         *                                 trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.shiftQuadrantRow = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            for (var i = 0; i < this.quadrantCols.length; i += 1) {
                this.quadrantCols[i].quadrants.shift();
            }
            this.numRows -= 1;
            this.quadrantRows.pop();
            if (callUpdate && this.onRemove) {
                this.onRemove("yInc", this.top, this.right, this.top + this.quadrantHeight, this.left);
            }
            this.top += this.quadrantHeight;
        };
        /**
         * Removes a QuadrantCol from the beginning of the quadrantCols Array.
         *
         * @param {Boolean} callUpdate   Whether this should call the onAdd
         *                               trigger with the new row's bounding box.
         */
        QuadsKeepr.prototype.shiftQuadrantCol = function (callUpdate) {
            if (callUpdate === void 0) { callUpdate = false; }
            for (var i = 0; i < this.quadrantRows.length; i += 1) {
                this.quadrantRows[i].quadrants.shift();
            }
            this.numCols -= 1;
            this.quadrantCols.pop();
            if (callUpdate && this.onRemove) {
                this.onRemove("xInc", this.top, this.left + this.quadrantWidth, this.bottom, this.left);
            }
            this.left += this.quadrantWidth;
        };
        /* Thing manipulations
        */
        /**
         * Determines the Quadrants for an entire Array of Things. This is done by
         * wiping each quadrant's memory of that Array's group type and determining
         * each Thing's quadrants.
         *
         * @param {String} group   The name of the group to have Quadrants determined.
         * @param {Thing[]} things   The listing of Things in that group.
         */
        QuadsKeepr.prototype.determineAllQuadrants = function (group, things) {
            var row, col;
            for (row = 0; row < this.numRows; row += 1) {
                for (col = 0; col < this.numCols; col += 1) {
                    this.quadrantRows[row].quadrants[col].numthings[group] = 0;
                }
            }
            things.forEach(this.determineThingQuadrants.bind(this));
        };
        /**
         * Determines the Quadrants for a single Thing. The starting row and column
         * indices are calculated so every Quadrant within them should contain the
         * Thing. In the process, its old Quadrants and new Quadrants are marked as
         * changed if it was.
         *
         * @param {Thing} thing
         */
        QuadsKeepr.prototype.determineThingQuadrants = function (thing) {
            var group = thing[this.keyGroupName], rowStart = this.findQuadrantRowStart(thing), colStart = this.findQuadrantColStart(thing), rowEnd = this.findQuadrantRowEnd(thing), colEnd = this.findQuadrantColEnd(thing), row, col;
            // Mark each of the Thing's Quadrants as changed
            // This is done first because the old Quadrants are changed
            if (thing[this.keyChanged]) {
                this.markThingQuadrantsChanged(thing);
            }
            // The Thing no longer has any Quadrants: rebuild them!
            thing[this.keyNumQuads] = 0;
            for (row = rowStart; row <= rowEnd; row += 1) {
                for (col = colStart; col <= colEnd; col += 1) {
                    this.setThingInQuadrant(thing, this.quadrantRows[row].quadrants[col], group);
                }
            }
            // The thing is no longer considered changed, since quadrants know it
            thing[this.keyChanged] = false;
        };
        /**
         * Sets a Thing to be inside a Quadrant. The two are marked so they can
         * recognize each other's existence later.
         *
         * @param {Thing} thing
         * @param {Quadrant} quadrant
         * @param {String} group   The grouping under which the Quadrant should
         *                         store the Thing.
         */
        QuadsKeepr.prototype.setThingInQuadrant = function (thing, quadrant, group) {
            // Mark the Quadrant in the Thing
            thing[this.keyQuadrants][thing[this.keyNumQuads]] = quadrant;
            thing[this.keyNumQuads] += 1;
            // Mark the Thing in the Quadrant
            quadrant.things[group][quadrant.numthings[group]] = thing;
            quadrant.numthings[group] += 1;
            // If necessary, mark the Quadrant as changed
            if (thing[this.keyChanged]) {
                quadrant.changed = true;
            }
        };
        /* Internal rearranging
        */
        /**
         * Adjusts the offset measurements by checking if rows or columns have gone
         * over the limit, which requires rows or columns be removed and new ones
         * added.
         */
        QuadsKeepr.prototype.adjustOffsets = function () {
            // Quadrant shift: add to the right
            while (-this.offsetX > this.quadrantWidth) {
                this.shiftQuadrantCol(true);
                this.pushQuadrantCol(true);
                this.offsetX += this.quadrantWidth;
            }
            // Quadrant shift: add to the left
            while (this.offsetX > this.quadrantWidth) {
                this.popQuadrantCol(true);
                this.unshiftQuadrantCol(true);
                this.offsetX -= this.quadrantWidth;
            }
            // Quadrant shift: add to the bottom
            while (-this.offsetY > this.quadrantHeight) {
                this.unshiftQuadrantRow(true);
                this.pushQuadrantRow(true);
                this.offsetY += this.quadrantHeight;
            }
            // Quadrant shift: add to the top
            while (this.offsetY > this.quadrantHeight) {
                this.popQuadrantRow(true);
                this.unshiftQuadrantRow(true);
                this.offsetY -= this.quadrantHeight;
            }
        };
        /**
         * Shifts a Quadrant horizontally and vertically.
         *
         * @param {Number} dx
         * @param {Number} dy
         */
        QuadsKeepr.prototype.shiftQuadrant = function (quadrant, dx, dy) {
            quadrant.top += dy;
            quadrant.right += dx;
            quadrant.bottom += dy;
            quadrant.left += dx;
            quadrant.changed = true;
        };
        /* Quadrant placements
        */
        /**
         * Creates a new Quadrant using the internal ObjectMaker. The Quadrant's
         * sizing and position are set, along with a canvas element for rendering.
         *
         * @param {Number} left   The horizontal displacement of the Quadrant.
         * @param {Number} top   The vertical displacement of the Quadrant.
         * @return {Quadrant}
         */
        QuadsKeepr.prototype.createQuadrant = function (left, top) {
            var quadrant = this.ObjectMaker.make("Quadrant"), i;
            quadrant.changed = true;
            quadrant.things = {};
            quadrant.numthings = {};
            for (i = 0; i < this.groupNames.length; i += 1) {
                quadrant.things[this.groupNames[i]] = [];
                quadrant.numthings[this.groupNames[i]] = 0;
            }
            quadrant.left = left;
            quadrant.top = top;
            quadrant.right = left + this.quadrantWidth;
            quadrant.bottom = top + this.quadrantHeight;
            quadrant.canvas = this.createCanvas(this.quadrantWidth, this.quadrantHeight);
            // A cast here is needed because older versions of TypeScript / tslint
            // may still see canvas.getContext("2d") as returning a WebGLRenderingContext
            quadrant.context = quadrant.canvas.getContext("2d");
            return quadrant;
        };
        /**
         * Creates a QuadrantRow, with length determined by numCols.
         *
         * @param {Number} left   The initial horizontal displacement of the col.
         * @param {Number} top   The vertical displacement of the col.
         * @return {QuadrantRow[]}
         */
        QuadsKeepr.prototype.createQuadrantRow = function (left, top) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            var row = {
                "left": left,
                "top": top,
                "quadrants": []
            }, i;
            for (i = 0; i < this.numCols; i += 1) {
                row.quadrants.push(this.createQuadrant(left, top));
                left += this.quadrantWidth;
            }
            return row;
        };
        /**
         * Creates a QuadrantCol, with length determined by numRow.
         *
         * @param {Number} left   The horizontal displacement of the col.
         * @param {Number} top   The initial vertical displacement of the col.
         * @return {QuadrantRow[]}
         */
        QuadsKeepr.prototype.createQuadrantCol = function (left, top) {
            var col = {
                "left": left,
                "top": top,
                "quadrants": []
            }, i;
            for (i = 0; i < this.numRows; i += 1) {
                col.quadrants.push(this.createQuadrant(left, top));
                top += this.quadrantHeight;
            }
            return col;
        };
        /* Position utilities
        */
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's top position, accounting for vertical
         *                  offset if needed.
         */
        QuadsKeepr.prototype.getTop = function (thing) {
            if (this.keyOffsetY) {
                return thing[this.keyTop] - Math.abs(thing[this.keyOffsetY]);
            }
            else {
                return thing[this.keyTop];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's right position, accounting for horizontal
         *                  offset if needed.
         */
        QuadsKeepr.prototype.getRight = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyRight] + Math.abs(thing[this.keyOffsetX]);
            }
            else {
                return thing[this.keyRight];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's bottom position, accounting for vertical
         *                  offset if needed.
         */
        QuadsKeepr.prototype.getBottom = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyBottom] + Math.abs(thing[this.keyOffsetY]);
            }
            else {
                return thing[this.keyBottom];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's left position, accounting for horizontal
         *                  offset if needed.
         */
        QuadsKeepr.prototype.getLeft = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyLeft] - Math.abs(thing[this.keyOffsetX]);
            }
            else {
                return thing[this.keyLeft];
            }
        };
        /**
         * Marks all Quadrants a Thing is contained within as changed.
         */
        QuadsKeepr.prototype.markThingQuadrantsChanged = function (thing) {
            for (var i = 0; i < thing[this.keyNumQuads]; i += 1) {
                thing[this.keyQuadrants][i].changed = true;
            }
        };
        /**
         * @param {Thing} thing
         * @param {Number} The index of the first row the Thing is inside.
         */
        QuadsKeepr.prototype.findQuadrantRowStart = function (thing) {
            return Math.max(Math.floor((this.getTop(thing) - this.top) / this.quadrantHeight), 0);
        };
        /**
         * @param {Thing} thing
         * @param {Number} The index of the last row the Thing is inside.
         */
        QuadsKeepr.prototype.findQuadrantRowEnd = function (thing) {
            return Math.min(Math.floor((this.getBottom(thing) - this.top) / this.quadrantHeight), this.numRows - 1);
        };
        /**
         * @param {Thing} thing
         * @param {Number} The index of the first column the Thing is inside.
         */
        QuadsKeepr.prototype.findQuadrantColStart = function (thing) {
            return Math.max(Math.floor((this.getLeft(thing) - this.left) / this.quadrantWidth), 0);
        };
        /**
         * @param {Thing} thing
         * @param {Number} The index of the last column the Thing is inside.
         */
        QuadsKeepr.prototype.findQuadrantColEnd = function (thing) {
            return Math.min(Math.floor((this.getRight(thing) - this.left) / this.quadrantWidth), this.numCols - 1);
        };
        /**
         * Creates a new canvas element of the given size.
         *
         * @param {Number} width   How wide the canvas should be.
         * @param {Number} height   How tall the canvas should be.
         * @return {HTMLCanvasElement}
         */
        QuadsKeepr.prototype.createCanvas = function (width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        return QuadsKeepr;
    })();
    QuadsKeepr_1.QuadsKeepr = QuadsKeepr;
})(QuadsKeepr || (QuadsKeepr = {}));
/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="PixelRendr-0.2.0.ts" />
/// <reference path="QuadsKeepr-0.2.1.ts" />
/// <reference path="StringFilr-0.2.1.ts" />
var PixelDrawr;
(function (PixelDrawr_1) {
    "use strict";
    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites to a
     * primary canvas. A PixelRendr keeps track of sprite sources, while a
     * MapScreenr maintains boundary information on the screen. Global screen
     * refills may be done by drawing every Thing in the thingArrays, or by
     * Quadrants as a form of dirty rectangles.
     */
    var PixelDrawr = (function () {
        /**
         * @param {IPixelDrawrSettings} settings
         */
        function PixelDrawr(settings) {
            this.PixelRender = settings.PixelRender;
            this.MapScreener = settings.MapScreener;
            this.createCanvas = settings.createCanvas;
            this.unitsize = settings.unitsize || 1;
            this.noRefill = settings.noRefill;
            this.spriteCacheCutoff = settings.spriteCacheCutoff || 0;
            this.groupNames = settings.groupNames;
            this.framerateSkip = settings.framerateSkip || 1;
            this.framesDrawn = 0;
            this.epsilon = settings.epsilon || .007;
            this.keyWidth = settings.keyWidth || "width";
            this.keyHeight = settings.keyHeight || "height";
            this.keyTop = settings.keyTop || "top";
            this.keyRight = settings.keyRight || "right";
            this.keyBottom = settings.keyBottom || "bottom";
            this.keyLeft = settings.keyLeft || "left";
            this.keyOffsetX = settings.keyOffsetX;
            this.keyOffsetY = settings.keyOffsetY;
            this.generateObjectKey = settings.generateObjectKey || function (thing) {
                return thing.toString();
            };
            this.resetBackground();
        }
        /* Simple gets
        */
        /**
         * @return {Number} How often refill calls should be skipped.
         */
        PixelDrawr.prototype.getFramerateSkip = function () {
            return this.framerateSkip;
        };
        /**
         * @return {Array[]} The Arrays to be redrawn during refill calls.
         */
        PixelDrawr.prototype.getThingArray = function () {
            return this.thingArrays;
        };
        /**
         * @return {HTMLCanvasElement} The canvas element each Thing is to drawn on.
         */
        PixelDrawr.prototype.getCanvas = function () {
            return this.canvas;
        };
        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the canvas.
         */
        PixelDrawr.prototype.getContext = function () {
            return this.context;
        };
        /**
         * @return {HTMLCanvasElement} The canvas element used for the background.
         */
        PixelDrawr.prototype.getBackgroundCanvas = function () {
            return this.backgroundCanvas;
        };
        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the background canvas.
         */
        PixelDrawr.prototype.getBackgroundContext = function () {
            return this.backgroundContext;
        };
        /**
         * @return {Boolean} Whether refills should skip redrawing the background
         *                   each time.
         */
        PixelDrawr.prototype.getNoRefill = function () {
            return this.noRefill;
        };
        /**
         * @return {Number} The minimum opacity that will be drawn.
         */
        PixelDrawr.prototype.getEpsilon = function () {
            return this.epsilon;
        };
        /* Simple sets
        */
        /**
         * @param {Number} framerateSkip   How often refill calls should be skipped.
         */
        PixelDrawr.prototype.setFramerateSkip = function (framerateSkip) {
            this.framerateSkip = framerateSkip;
        };
        /**
         * @param {Array[]} thingArrays   The Arrays to be redrawn during refill calls.
         */
        PixelDrawr.prototype.setThingArrays = function (thingArrays) {
            this.thingArrays = thingArrays;
        };
        /**
         * Sets the currently drawn canvas and context, and recreates
         * drawThingOnContextBound.
         *
         * @param {HTMLCanvasElement} canvas   The new primary canvas to be used.
         */
        PixelDrawr.prototype.setCanvas = function (canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
        };
        /**
         * @param {Boolean} noRefill   Whether refills should now skip redrawing the
         *                             background each time.
         */
        PixelDrawr.prototype.setNoRefill = function (noRefill) {
            this.noRefill = noRefill;
        };
        /**
         * @param {Number} The minimum opacity that will be drawn.
         */
        PixelDrawr.prototype.setEpsilon = function (epsilon) {
            this.epsilon = epsilon;
        };
        /* Background manipulations
        */
        /**
         * Creates a new canvas the size of MapScreener and sets the background
         * canvas to it, then recreates backgroundContext.
         */
        PixelDrawr.prototype.resetBackground = function () {
            this.backgroundCanvas = this.createCanvas(this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
            this.backgroundContext = this.backgroundCanvas.getContext("2d");
        };
        /**
         * Refills the background canvas with a new fillStyle.
         *
         * @param {Mixed} fillStyle   The new fillStyle for the background context.
         */
        PixelDrawr.prototype.setBackground = function (fillStyle) {
            this.backgroundContext.fillStyle = fillStyle;
            this.backgroundContext.fillRect(0, 0, this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
        };
        /**
         * Draws the background canvas onto the main canvas' context.
         */
        PixelDrawr.prototype.drawBackground = function () {
            this.context.drawImage(this.backgroundCanvas, 0, 0);
        };
        /* Core rendering
        */
        /**
         * Goes through all the motions of finding and parsing a Thing's sprite.
         * This should be called whenever the sprite's appearance changes.
         *
         * @param {Thing} thing   A Thing whose sprite must be updated.
         * @return {Self}
         */
        PixelDrawr.prototype.setThingSprite = function (thing) {
            // If it's set as hidden, don't bother updating it
            if (thing.hidden) {
                return;
            }
            // PixelRender does most of the work in fetching the rendered sprite
            thing.sprite = this.PixelRender.decode(this.generateObjectKey(thing), thing);
            // To do: remove dependency on .numSprites
            // For now, kit's used to know whether it's had its sprite set, but 
            // wouldn't physically having a .sprite do that?
            if (thing.sprite.multiple) {
                thing.numSprites = 0;
                this.refillThingCanvasMultiple(thing);
            }
            else {
                thing.numSprites = 1;
                this.refillThingCanvasSingle(thing);
            }
        };
        /**
         * Simply draws a thing's sprite to its canvas by getting and setting
         * a canvas::imageData object via context.getImageData(...).
         *
         * @param {Thing} thing   A Thing whose canvas must be updated.
         */
        PixelDrawr.prototype.refillThingCanvasSingle = function (thing) {
            // Don't draw small Things.
            if (thing[this.keyWidth] < 1 || thing[this.keyHeight] < 1) {
                return;
            }
            // Retrieve the imageData from the Thing's canvas & renderingContext
            var canvas = thing.canvas, context = thing.context, imageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);
            // Copy the thing's sprite to that imageData and into the contextz
            this.PixelRender.memcpyU8(thing.sprite, imageData.data);
            context.putImageData(imageData, 0, 0);
        };
        /**
         * For SpriteMultiples, this copies the sprite information for each
         * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
         * rendered information onto the thing's canvas.
         *
         * @param {Thing} thing   A Thing whose canvas and sprites must be updated.
         */
        PixelDrawr.prototype.refillThingCanvasMultiple = function (thing) {
            if (thing[this.keyWidth] < 1 || thing[this.keyHeight] < 1) {
                return;
            }
            var spritesRaw = thing.sprite, canvases = thing.canvases = {
                "direction": spritesRaw.direction,
                "multiple": true
            }, canvas, context, imageData, i;
            thing.numSprites = 1;
            for (i in spritesRaw.sprites) {
                if (!spritesRaw.sprites.hasOwnProperty(i)) {
                    continue;
                }
                // Make a new sprite for this individual component
                canvas = this.createCanvas(thing.spritewidth * this.unitsize, thing.spriteheight * this.unitsize);
                context = canvas.getContext("2d");
                // Copy over this sprite's information the same way as refillThingCanvas
                imageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);
                this.PixelRender.memcpyU8(spritesRaw.sprites[i], imageData.data);
                context.putImageData(imageData, 0, 0);
                // Record the canvas and context in thing.sprites
                canvases[i] = {
                    "canvas": canvas,
                    "context": context
                };
                thing.numSprites += 1;
            }
            // Only pre-render multiple sprites if they're below the cutoff
            if (thing[this.keyWidth] * thing[this.keyHeight] < this.spriteCacheCutoff) {
                thing.canvas[this.keyWidth] = thing[this.keyWidth] * this.unitsize;
                thing.canvas[this.keyHeight] = thing[this.keyHeight] * this.unitsize;
                this.drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
            }
            else {
                thing.canvas[this.keyWidth] = thing.canvas[this.keyHeight] = 0;
            }
        };
        /* Core drawing
        */
        /**
         * Called every upkeep to refill the entire main canvas. All Thing arrays
         * are made to call this.refillThingArray in order.
         */
        PixelDrawr.prototype.refillGlobalCanvas = function () {
            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }
            if (!this.noRefill) {
                this.drawBackground();
            }
            for (var i = 0; i < this.thingArrays.length; i += 1) {
                this.refillThingArray(this.thingArrays[i]);
            }
        };
        /**
         * Calls drawThingOnContext on each Thing in the Array.
         *
         * @param {Thing[]} array   A listing of Things to be drawn onto the canvas.
         */
        PixelDrawr.prototype.refillThingArray = function (array) {
            for (var i = 0; i < array.length; i += 1) {
                this.drawThingOnContext(this.context, array[i]);
            }
        };
        /**
         * Refills the main canvas by calling refillQuadrants on each Quadrant in
         * the groups.
         *
         * @param {QuadrantRow[]} groups   QuadrantRows (or QuadrantCols) to be
         *                                 redrawn to the canvas.
         */
        PixelDrawr.prototype.refillQuadrantGroups = function (groups) {
            var i;
            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }
            for (i = 0; i < groups.length; i += 1) {
                this.refillQuadrants(groups[i].quadrants);
            }
        };
        /**
         * Refills (part of) the main canvas by drawing each Quadrant's canvas onto
         * it.
         *
         * @param {Quadrant[]} quadrants   The Quadrants to have their canvases
         *                                 refilled.
         */
        PixelDrawr.prototype.refillQuadrants = function (quadrants) {
            var quadrant, i;
            for (i = 0; i < quadrants.length; i += 1) {
                quadrant = quadrants[i];
                if (quadrant.changed
                    && quadrant[this.keyTop] < this.MapScreener[this.keyHeight]
                    && quadrant[this.keyRight] > 0
                    && quadrant[this.keyBottom] > 0
                    && quadrant[this.keyLeft] < this.MapScreener[this.keyWidth]) {
                    this.refillQuadrant(quadrant);
                    this.context.drawImage(quadrant.canvas, quadrant[this.keyLeft], quadrant[this.keyTop]);
                }
            }
        };
        /**
         * Refills a Quadrants's canvas by resetting its background and drawing all
         * its Things onto it.
         *
         * @param {Quadrant} quadrant   A quadrant whose Things must be drawn onto
         *                              its canvas.
         */
        PixelDrawr.prototype.refillQuadrant = function (quadrant) {
            var group, i, j;
            // This may be what's causing such bad performance.
            if (!this.noRefill) {
                quadrant.context.drawImage(this.backgroundCanvas, quadrant[this.keyLeft], quadrant[this.keyTop], quadrant.canvas[this.keyWidth], quadrant.canvas[this.keyHeight], 0, 0, quadrant.canvas[this.keyWidth], quadrant.canvas[this.keyHeight]);
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = quadrant.things[this.groupNames[i]];
                for (j = 0; j < group.length; j += 1) {
                    this.drawThingOnQuadrant(group[j], quadrant);
                }
            }
            quadrant.changed = false;
        };
        /**
         * General Function to draw a Thing onto a context. This will call
         * drawThingOnContext[Single/Multiple] with more arguments
         *
         * @param {CanvasRenderingContext2D} context   The context to have the Thing
         *                                             drawn on it.
         * @param {Thing} thing   The Thing to be drawn onto the context.
         */
        PixelDrawr.prototype.drawThingOnContext = function (context, thing) {
            if (thing.hidden
                || thing.opacity < this.epsilon
                || thing[this.keyHeight] < 1
                || thing[this.keyWidth] < 1
                || this.getTop(thing) > this.MapScreener[this.keyHeight]
                || this.getRight(thing) < 0
                || this.getBottom(thing) < 0
                || this.getLeft(thing) > this.MapScreener[this.keyWidth]) {
                return;
            }
            // If Thing hasn't had a sprite yet (previously hidden), do that first
            if (typeof thing.numSprites === "undefined") {
                this.setThingSprite(thing);
            }
            // Whether or not the thing has a regular sprite or a SpriteMultiple, 
            // that sprite has already been drawn to the thing's canvas, unless it's
            // above the cutoff, in which case that logic happens now.
            if (thing.canvas[this.keyWidth] > 0) {
                this.drawThingOnContextSingle(context, thing.canvas, thing, this.getLeft(thing), this.getTop(thing));
            }
            else {
                this.drawThingOnContextMultiple(context, thing.canvases, thing, this.getLeft(thing), this.getTop(thing));
            }
        };
        /**
         * Draws a Thing onto a quadrant's canvas. This is a simple wrapper around
         * drawThingOnContextSingle/Multiple that also bounds checks.
         *
         * @param {Thing} thing
         * @param {Quadrant} quadrant
         */
        PixelDrawr.prototype.drawThingOnQuadrant = function (thing, quadrant) {
            if (thing.hidden
                || this.getTop(thing) > quadrant[this.keyBottom]
                || this.getRight(thing) < quadrant[this.keyLeft]
                || this.getBottom(thing) < quadrant[this.keyTop]
                || this.getLeft(thing) > quadrant[this.keyRight]
                || thing.opacity < this.epsilon) {
                return;
            }
            // If there's just one sprite, it's pretty simple
            if (thing.numSprites === 1) {
                return this.drawThingOnContextSingle(quadrant.context, thing.canvas, thing, this.getLeft(thing) - quadrant[this.keyLeft], this.getTop(thing) - quadrant[this.keyTop]);
            }
            else {
                // For multiple sprites, some calculations will be needed
                return this.drawThingOnContextMultiple(quadrant.context, thing.canvases, thing, this.getLeft(thing) - quadrant[this.keyLeft], this.getTop(thing) - quadrant[this.keyTop]);
            }
        };
        /**
         * Draws a Thing's single canvas onto a context, commonly called by
         * this.drawThingOnContext.
         *
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvas   The Thing's canvas being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        PixelDrawr.prototype.drawThingOnContextSingle = function (context, canvas, thing, left, top) {
            // If the sprite should repeat, use the pattern equivalent
            if (thing.repeat) {
                this.drawPatternOnContext(context, canvas, left, top, thing.unitwidth, thing.unitheight, thing.opacity || 1);
            }
            else if (thing.opacity !== 1) {
                // Opacities not equal to one must reset the context afterwards
                context.globalAlpha = thing.opacity;
                context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
                context.globalAlpha = 1;
            }
            else {
                context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
            }
        };
        /**
         * Draws a Thing's multiple canvases onto a context, typicall called by
         * drawThingOnContext. A variety of cases for canvases is allowed:
         * "vertical", "horizontal", and "corners".
         *
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvases   The canvases being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        PixelDrawr.prototype.drawThingOnContextMultiple = function (context, canvases, thing, left, top) {
            var sprite = thing.sprite, topreal = top, leftreal = left, rightreal = left + thing.unitwidth, bottomreal = top + thing.unitheight, widthreal = thing.unitwidth, heightreal = thing.unitheight, spritewidthpixels = thing.spritewidthpixels, spriteheightpixels = thing.spriteheightpixels, widthdrawn = Math.min(widthreal, spritewidthpixels), heightdrawn = Math.min(heightreal, spriteheightpixels), opacity = thing.opacity, diffhoriz, diffvert, canvasref;
            switch (canvases.direction) {
                // Vertical sprites may have 'top', 'bottom', 'middle'
                case "vertical":
                    // If there's a bottom, draw that and push up bottomreal
                    if ((canvasref = canvases[this.keyBottom])) {
                        diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, bottomreal - diffvert, widthreal, heightdrawn, opacity);
                        bottomreal -= diffvert;
                        heightreal -= diffvert;
                    }
                    // If there's a top, draw that and push down topreal
                    if ((canvasref = canvases[this.keyTop])) {
                        diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightdrawn, opacity);
                        topreal += diffvert;
                        heightreal -= diffvert;
                    }
                    break;
                // Horizontal sprites may have 'left', 'right', 'middle'
                case "horizontal":
                    // If there's a left, draw that and push forward leftreal
                    if ((canvasref = canvases[this.keyLeft])) {
                        diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthdrawn, heightreal, opacity);
                        leftreal += diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    // If there's a right, draw that and push back rightreal
                    if ((canvasref = canvases[this.keyRight])) {
                        diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal, opacity);
                        rightreal -= diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    break;
                // Corner (vertical + horizontal + corner) sprites must have corners
                // in 'topRight', 'bottomRight', 'bottomLeft', and 'topLeft'.
                case "corners":
                    // topLeft, left, bottomLeft
                    diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(context, canvases.topLeft.canvas, leftreal, topreal, widthdrawn, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases[this.keyLeft].canvas, leftreal, topreal + diffvert, widthdrawn, heightreal - diffvert * 2, opacity);
                    this.drawPatternOnContext(context, canvases.bottomLeft.canvas, leftreal, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                    leftreal += diffhoriz;
                    widthreal -= diffhoriz;
                    // top, topRight
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(context, canvases[this.keyTop].canvas, leftreal, topreal, widthreal - diffhoriz, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases.topRight.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightdrawn, opacity);
                    topreal += diffvert;
                    heightreal -= diffvert;
                    // right, bottomRight, bottom
                    diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                    this.drawPatternOnContext(context, canvases[this.keyRight].canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal - diffvert, opacity);
                    this.drawPatternOnContext(context, canvases.bottomRight.canvas, rightreal - diffhoriz, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases[this.keyBottom].canvas, leftreal, bottomreal - diffvert, widthreal - diffhoriz, heightdrawn, opacity);
                    rightreal -= diffhoriz;
                    widthreal -= diffhoriz;
                    bottomreal -= diffvert;
                    heightreal -= diffvert;
                    break;
            }
            // If there's still room, draw the actual canvas
            if ((canvasref = canvases.middle) && topreal < bottomreal && leftreal < rightreal) {
                if (sprite.middleStretch) {
                    context.globalAlpha = opacity;
                    context.drawImage(canvasref.canvas, leftreal, topreal, widthreal, heightreal);
                    context.globalAlpha = 1;
                }
                else {
                    this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightreal, opacity);
                }
            }
        };
        /* Position utilities (which should almost always be optimized)
        */
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's top position, accounting for vertical
         *                  offset if needed.
         */
        PixelDrawr.prototype.getTop = function (thing) {
            if (this.keyOffsetY) {
                return thing[this.keyTop] + thing[this.keyOffsetY];
            }
            else {
                return thing[this.keyTop];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's right position, accounting for horizontal
         *                  offset if needed.
         */
        PixelDrawr.prototype.getRight = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyRight] + thing[this.keyOffsetX];
            }
            else {
                return thing[this.keyRight];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's bottom position, accounting for vertical
         *                  offset if needed.
         */
        PixelDrawr.prototype.getBottom = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyBottom] + thing[this.keyOffsetY];
            }
            else {
                return thing[this.keyBottom];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's left position, accounting for horizontal
         *                  offset if needed.
         */
        PixelDrawr.prototype.getLeft = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyLeft] + thing[this.keyOffsetX];
            }
            else {
                return thing[this.keyLeft];
            }
        };
        /* Utilities
        */
        /**
         * Draws a source pattern onto a context. The pattern is clipped to the size
         * of MapScreener.
         *
         * @param {CanvasRenderingContext2D} context   The context the pattern will
         *                                             be drawn onto.
         * @param {Mixed} source   The image being repeated as a pattern. This can
         *                         be a canvas, an image, or similar.
         * @param {Number} left   The x-location to draw from.
         * @param {Number} top   The y-location to draw from.
         * @param {Number} width   How many pixels wide the drawing area should be.
         * @param {Number} left   How many pixels high the drawing area should be.
         * @param {Number} opacity   How transparent the drawing is, in [0,1].
         */
        PixelDrawr.prototype.drawPatternOnContext = function (context, source, left, top, width, height, opacity) {
            context.globalAlpha = opacity;
            context.translate(left, top);
            context.fillStyle = context.createPattern(source, "repeat");
            context.fillRect(0, 0, 
            // Math.max(width, left - MapScreener[keyRight]),
            // Math.max(height, top - MapScreener[keyBottom])
            width, height);
            context.translate(-left, -top);
            context.globalAlpha = 1;
        };
        return PixelDrawr;
    })();
    PixelDrawr_1.PixelDrawr = PixelDrawr;
})(PixelDrawr || (PixelDrawr = {}));
var TimeHandlr;
(function (TimeHandlr_1) {
    "use strict";
    /**
     * A timed events library intended to provide a flexible alternative to
     * setTimeout and setInterval that respects pauses and resumes. Events (which
     * are really Functions with arguments pre-set) are assigned integer timestamps,
     * and can be set to repeat a number of times determined by a number or callback
     * Function. Functionality to automatically "cycle" between certain classes of
     * an Object is also provided, similar to jQuery's class toggling.
     */
    var TimeHandlr = (function () {
        /**
         * @param {ITimeHandlrSettings} settings
         */
        function TimeHandlr(settings) {
            this.time = 0;
            this.events = {};
            this.timingDefault = settings.timingDefault || 1;
            this.keyCycles = settings.keyCycles || "cycles";
            this.keyClassName = settings.keyClassName || "className";
            this.keyOnClassCycleStart = settings.keyOnClassCycleStart || "onClassCycleStart";
            this.keyDoClassCycleStart = settings.keyDoClassCycleStart || "doClassCycleStart";
            this.keyCycleCheckValidity = settings.keyCycleCheckValidity;
            this.copyCycleSettings = typeof settings.copyCycleSettings === "undefined" ? true : settings.copyCycleSettings;
            this.classAdd = settings.classAdd || this.classAddGeneric;
            this.classRemove = settings.classRemove || this.classRemoveGeneric;
        }
        /* Simple gets
        */
        /**
         * @return {Number} The current time.
         */
        TimeHandlr.prototype.getTime = function () {
            return this.time;
        };
        /**
         * @return {Object} The catalog of events, keyed by their time triggers.
         */
        TimeHandlr.prototype.getEvents = function () {
            return this.events;
        };
        /* Event adding
        */
        /**
         * Adds an event in a manner similar to setTimeout, though any arguments
         * past the timeDelay will be passed to the event callback. The added event
         * is inserted into the events container and is set to only repeat once.
         *
         * @param {Function} callback   The callback to be run after some time.
         * @param {Number} [timeDelay]   How long from now to run the callback (by
         *                               default, 1).
         */
        TimeHandlr.prototype.addEvent = function (callback, timeDelay) {
            if (timeDelay === void 0) { timeDelay = 1; }
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var event;
            // Make sure callback is actually a function
            if (typeof callback !== "function") {
                throw new Error("Invalid event given to addEvent.");
            }
            timeDelay = timeDelay || 1;
            // Add the event to events, then return it
            event = this.createEvent(callback, this.time + timeDelay, timeDelay, args, 1);
            this.insertEvent(event, event.timeDelay);
            return event;
        };
        /**
         * Adds an event in a manner similar to setInterval, though any arguments
         * past the numRepeats will be passed to the event callback. The added event
         * is inserted into the events container and is set to repeat a numRepeat
         * amount of times, though if the callback returns true, it will stop.
         *
         * @param {Function} callback   The callback to be run some number of times.
         *                              If it returns true, repetition stops.
         * @param {Number} [timeDelay]   How long from now to run the callback, and
         *                               how many steps between each call (1 by
         *                               default).
         * @param {Number} [numRepeats]   How many times to run the event. Infinity
         *                                is an acceptable option (1 by default).
         */
        TimeHandlr.prototype.addEventInterval = function (callback, timeDelay, numRepeats) {
            if (timeDelay === void 0) { timeDelay = 1; }
            if (numRepeats === void 0) { numRepeats = 1; }
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var event, argsParsed;
            // Make sure callback is actually a function
            if (typeof callback !== "function") {
                throw new Error("Invalid event given to addEventInterval.");
            }
            timeDelay = timeDelay || 1;
            numRepeats = numRepeats || 1;
            // Arguments exclude callback, timeDelay, and numRepeats
            argsParsed = Array.prototype.slice.call(arguments, 3);
            // Add the event to events, then return it
            // It may need to have a reference to the event from the function
            event = this.createEvent(callback, this.time + timeDelay, timeDelay, argsParsed, numRepeats);
            callback.event = event;
            this.insertEvent(event, event.timeDelay);
            return event;
        };
        /**
         * Fancy wrapper around this.addEventInterval. It delays starting the event
         * until the current time is modular with the repeat delay, so that all
         * event intervals synched to the same period are in unison. This is useful
         * for things like sprite animations (like Mario blocks) that would look odd
         * when out of sync.
         *
         * @param {Function} callback   The callback to be run some number of times.
         *                              If it returns true, repetition stops.
         * @param {Number} [timeDelay]   How long from now to run the callback, and
         *                               how many steps between each call (1 by
         *                               default).
         * @param {Number} [numRepeats]   How many times to run the event. Infinity
         *                                is an acceptable option (1 by default).
         * @param {Mixed} thing   Some data container to be manipulated. Using the
         *                        block example, this would be the block itthis.
         * @param {Mixed} settings   A container for repetition settings. This
         *                           appears to only require a .length Number
         *                           attribute, to calculate the time until launch.
         *                           In the block example, this would be an Array
         *                           containing the ordered sprite names of the
         *                           block (dim, medium, etc.).
         *
         * @todo Rearrange this and setClassCycle to remove the "thing" argument.
         */
        TimeHandlr.prototype.addEventIntervalSynched = function (callback, timeDelay, numRepeats, thing, settings) {
            var calcTime = timeDelay * settings.length, entryTime = Math.ceil(this.time / calcTime) * calcTime, scope = this, args = Array.prototype.slice.call(arguments), adder = Function.apply.bind(this.addEventInterval, scope, args);
            timeDelay = timeDelay || 1;
            numRepeats = numRepeats || 1;
            // If there's no difference in times, you're good to go
            if (entryTime === this.time) {
                return adder();
            }
            // Otherwise it should be delayed until the time is right
            this.addEvent(adder, entryTime - this.time, scope, args, thing);
        };
        /* General event handling
        */
        /**
         * Meaty often-called function to increment time and handle all events at
         * the new time. For each event, its callback is run, and if that returned
         * true, or the event's .repeat Number runs out, the event stops repeating.
         */
        TimeHandlr.prototype.handleEvents = function () {
            var currentEvents, event, length, i;
            this.time += 1;
            currentEvents = this.events[this.time];
            // If there isn't anything to run, don't even bother
            if (!currentEvents) {
                return;
            }
            // For each event currently scheduled:
            for (i = 0, length = currentEvents.length; i < length; ++i) {
                event = currentEvents[i];
                // Call the function, using apply to pass in arguments dynamically
                // If running it returns true, it's done. Otherwise, check the 
                // event's .repeat to see if it should repeat.
                if (event.repeat > 0 && !event.callback.apply(this, event.args)) {
                    // It may have a count changer (typically keyCycles do that)
                    if (event.count_changer) {
                        event.count_changer(event);
                    }
                    // If repeat is a Function, running it determines whether to repeat
                    if (event.repeat.constructor === Function) {
                        // This is where the event's callback is actually run!
                        if (event.repeat.call(event)) {
                            event.count += event.timeRepeat;
                            this.insertEvent(event, event.timeDelay);
                        }
                    }
                    else {
                        // It's a Number: decrement it, and repeat if it's > 0.
                        event.repeat = event.repeat - 1;
                        if (event.repeat > 0) {
                            event.timeDelay += event.timeRepeat;
                            this.insertEvent(event, event.timeDelay);
                        }
                    }
                }
            }
            // Once all these events are done, ignore the memory
            delete this.events[this.time];
        };
        /**
         * Cancels an event by making its .repeat value 0.
         *
         * @param {Event} event   The event to cancel.
         */
        TimeHandlr.prototype.cancelEvent = function (event) {
            event.repeat = 0;
        };
        /**
         * Cancels all events by clearing the events Object.
         */
        TimeHandlr.prototype.cancelAllEvents = function () {
            this.events = {};
        };
        /**
         * Cancels the class cycle of a thing by finding the cycle under the thing's
         * keyCycles and making it appear to be empty.
         *
         * @param {Mixed} thing   The thing (any data structure) whose cycle is to
         *                        be cancelled.
         * @param {String} name   The name of the cycle to be cancelled.
         */
        TimeHandlr.prototype.cancelClassCycle = function (thing, name) {
            var cycle;
            if (!thing[this.keyCycles] || !thing[this.keyCycles][name]) {
                return;
            }
            cycle = thing[this.keyCycles][name];
            cycle.length = 1;
            cycle[0] = false;
            delete thing[this.keyCycles][name];
        };
        /**
         * Cancels all class keyCycles of a thing under the thing's sycles.
         *
         * @param {Mixed} thing   The thing (any data structure) whose keyCycles are to
         *                        be cancelled.
         */
        TimeHandlr.prototype.cancelAllCycles = function (thing) {
            var keyCycles = thing[this.keyCycles], cycle, name;
            for (name in keyCycles) {
                if (!keyCycles.hasOwnProperty(name)) {
                    continue;
                }
                cycle = keyCycles[name];
                cycle.length = 1;
                cycle[0] = false;
                delete keyCycles[name];
            }
        };
        /* Sprite keyCycles
        */
        /**
         * Adds a sprite cycle (settings) for a thing, to be referenced by the given
         * name in the thing's keyCycles Object. The sprite cycle switches the thing's
         * class using classAdd and classRemove (which can be given by the user in
         * reset, but default to internally defined Functions).
         *
         * @param {Mixed} thing   The object whose class is to be cycled.
         * @param {Mixed} settings   A container for repetition settings. This
         *                           appears to only require a .length Number
         *                           attribute, so Arrays are optimal. Generally,
         *                           this should be an Array containing the ordered
         *                           sprite names to cycle through on the thing.
         * @param {String} name   The name of the cycle, to be referenced in the
         *                        thing's keyCycles Object.
         * @param {Mixed} timing   The way to determine how often to do the cycle.
         *                         This is normally a Number, but can also be a
         *                         Function (for variable cycle speeds).
         */
        TimeHandlr.prototype.addClassCycle = function (thing, settings, name, timing) {
            var isTimingFunction = typeof timing === "function", cycle;
            // Make sure the object has a holder for keyCycles...
            if (!thing[this.keyCycles]) {
                thing[this.keyCycles] = {};
            }
            // ...and nothing previously existing for that name
            this.cancelClassCycle(thing, name);
            name = name || "0";
            // Set the cycle under thing[keyCycles][name]
            cycle = thing[this.keyCycles][name] = this.setClassCycle(thing, settings, isTimingFunction ? 0 : timing);
            // If there is a timing function, make it the count changer
            if (cycle.event && isTimingFunction) {
                cycle.event.count_changer = timing;
            }
            // Immediately run the first class cycle, then return
            this.cycleClass(thing, settings);
            return cycle;
        };
        /**
         * Adds a synched sprite cycle (settings) for a thing, to be referenced by
         * the given name in the thing's keyCycles Object, and in tune with all other
         * keyCycles of the same period. The sprite cycle switches the thing's class
         * using classAdd and classRemove (which can be given by the user in reset,
         * but default to internally defined Functions).
         *
         * @param {Mixed} thing   The object whose class is to be cycled.
         * @param {Mixed} settings   A container for repetition settings. This
         *                           appears to only require a .length Number
         *                           attribute, so Arrays are optimal. Generally,
         *                           this should be an Array containing the ordered
         *                           sprite names to cycle through on the thing.
         * @param {String} name   The name of the cycle, to be referenced in the
         *                        thing's keyCycles Object.
         * @param {Mixed} timing   The way to determine how often to do the cycle.
         *                         This is normally a Number, but can also be a
         *                         Function (for variable cycle speeds).
         */
        TimeHandlr.prototype.addClassCycleSynched = function (thing, settings, name, timing) {
            var cycle;
            // Make sure the object has a holder for keyCycles...
            if (!thing[this.keyCycles]) {
                thing[this.keyCycles] = {};
            }
            // ...and nothing previously existing for that name
            this.cancelClassCycle(thing, name);
            // Set the cycle under thing[keyCycles][name]
            name = name || "0";
            cycle = thing[this.keyCycles][name] = this.setClassCycle(thing, settings, timing, true);
            // Immediately run the first class cycle, then return
            this.cycleClass(thing, thing[this.keyCycles][name]);
            return cycle;
        };
        /**
         * Initialization utility for sprite keyCycles of things. The settings are
         * added at the right time (immediately if not synched, or on a delay if
         * synched).
         *
         * @param {Mixed} thing   The object whose class is to be cycled.
         * @param {Mixed} settings   A container for repetition settings. This
         *                           appears to only require a .length Number
         *                           attribute, so Arrays are optimal. Generally,
         *                           this should be an Array containing the ordered
         *                           sprite names to cycle through on the thing.
         * @param {Mixed} timing   The way to determine how often to do the cycle.
         *                         This is normally a Number, but can also be a
         *                         Function (for variable cycle speeds).
         * @param {Boolean} [synched]   Whether the cycle should be in time with all
         *                              other cycles of the same period, based on
         *                              modulo of current time (by default, false).
         */
        TimeHandlr.prototype.setClassCycle = function (thing, settings, timing, synched) {
            if (synched === void 0) { synched = false; }
            var scope = this, callback;
            // If required, make a copy of settings so if multiple objects are made
            // with the same settings, object, they don't override each other's
            // attributes: particularly settings.loc.
            if (this.copyCycleSettings) {
                settings = this.makeSettingsCopy(settings);
            }
            // Start off before the beginning of the cycle
            settings.loc = settings.oldclass = -1;
            callback = synched ? this.addEventIntervalSynched : this.addEventInterval;
            callback = callback.bind(scope);
            // Let the object know to start the cycle when needed
            thing[this.keyOnClassCycleStart] = function () {
                callback(scope.cycleClass, timing || scope.timingDefault, Infinity, thing, settings);
            };
            // If it should already start, do that
            if (thing[this.keyDoClassCycleStart]) {
                thing[this.keyOnClassCycleStart]();
            }
            return settings;
        };
        /**
         * Moves an object from its current class in the sprite cycle to the next.
         * If the next object is === false, or the repeat function returns false,
         * stop by returning true.
         *
         * @param {Mixed} thing   The object whose class is to be cycled.
         * @param {Mixed} settings   A container for repetition settings. This
         *                           appears to only require a .length Number
         *                           attribute, so Arrays are optimal. Generally,
         *                           this should be an Array containing the ordered
         *                           sprite names to cycle through on the thing.
         * @return {Boolean} Whether the class cycle should stop (normally false).
         */
        TimeHandlr.prototype.cycleClass = function (thing, settings) {
            var current, name;
            // If anything has been invalidated, return true to stop
            if (!thing || !settings || !settings.length || (this.keyCycleCheckValidity && !thing[this.keyCycleCheckValidity])) {
                return true;
            }
            // Get rid of the previous class, from settings (-1 by default)
            if (settings.oldclass !== -1 && settings.oldclass !== "") {
                this.classRemove(thing, settings.oldclass);
            }
            // Move to the next location in settings, as a circular list
            settings.loc = (settings.loc += 1) % settings.length;
            // Current is the sprite, bool, or function currently added and/or run
            current = settings[settings.loc];
            // If it isn't falsy, (run if needed and) set it as the next name
            if (current) {
                if (current.constructor === Function) {
                    name = current(thing, settings);
                }
                else {
                    name = current;
                }
                // If the next name is a string, set that as the old class, and add it
                if (typeof name === "string") {
                    settings.oldclass = name;
                    this.classAdd(thing, name);
                    return false;
                }
                else {
                    // For non-strings, return stop if the name evaluated to be false
                    return (name === false);
                }
            }
            else {
                // Since current was falsy, stop if it's explicitly === false 
                return (current === false);
            }
        };
        /* Utility functions
        */
        /**
         * Basic factory for Events.
         *
         * @constructor
         * @param {Function} callback   The callback to be run when time is equal to
         *                              this event's key in events.
         * @param {Number} timeDelay   The time at which to call this event.
         * @param {Number} timeRepeat   How long between calls (irrelevant if repeat
         *                              is 1, but useful for re-adding).
         * @param {Array} args   Arguments for the callback to be run with.
         * @param {Number} repeat   How many times this should repeat. Infinity is
         *                          an acceptable option.
         */
        TimeHandlr.prototype.createEvent = function (callback, timeDelay, timeRepeat, args, repeat) {
            return {
                "callback": callback,
                "timeDelay": timeDelay,
                "timeRepeat": timeRepeat,
                "args": args,
                "repeat": repeat,
                "count": 0
            };
        };
        /**
         * Quick handler to add an event to events at a particular time. If the time
         * doesn't have any events listed, a new Array is made to hold this event.
         *
         * @param {Event} event
         * @param {Number} time
         */
        TimeHandlr.prototype.insertEvent = function (event, time) {
            if (!this.events[time]) {
                this.events[time] = [event];
            }
            else {
                this.events[time].push(event);
            }
            return this.events[time];
        };
        /**
         * Creates a copy of an Object/Array. This is useful for passing settings
         * Objects by value instead of reference.
         *
         * @param {Mixed} original
         */
        TimeHandlr.prototype.makeSettingsCopy = function (original) {
            var output = new original.constructor(), i;
            for (i in original) {
                if (original.hasOwnProperty(i)) {
                    output[i] = original[i];
                }
            }
            return output;
        };
        /**
         * Default classAdd Function, modeled off HTML elements' classes.
         *
         * @param {Mixed} element   The element whose class is being modified.
         * @param {String} str   The String to be added to the thing's class.
         */
        TimeHandlr.prototype.classAddGeneric = function (element, str) {
            element[this.keyClassName] += " " + str;
        };
        /**
         * Default classRemove Function, modeled off HTML elements' classes.
         *
         * @param {Mixed} element   The element whose class is being modified.
         * @param {String} str   The String to be removed from the thing's class.
         */
        TimeHandlr.prototype.classRemoveGeneric = function (element, str) {
            element[this.keyClassName] = element[this.keyClassName].replace(str, "");
        };
        return TimeHandlr;
    })();
    TimeHandlr_1.TimeHandlr = TimeHandlr;
})(TimeHandlr || (TimeHandlr = {}));
/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="MapsCreatr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="MapsHandlr-0.2.0.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="PixelDrawr-0.2.0.ts" />
/// <reference path="PixelRendr-0.2.0.ts" />
/// <reference path="QuadsKeepr-0.2.1.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="StringFilr-0.2.1.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />
var LevelEditr;
(function (LevelEditr_1) {
    "use strict";
    /**
     * A level editor designed to work natively on top of an existing GameStartr
     * sub-class.
     */
    var LevelEditr = (function () {
        /**
         * @param {ILevelEditrSettings} settings
         */
        function LevelEditr(settings) {
            this.GameStarter = settings.GameStarter;
            this.prethings = settings.prethings;
            this.thingGroups = settings.thingGroups;
            this.thingKeys = settings.thingKeys;
            this.macros = settings.macros;
            this.beautifier = settings.beautifier;
            this.mapNameDefault = settings.mapNameDefault || "New Map";
            this.mapTimeDefault = settings.mapTimeDefault || Infinity;
            this.mapSettingDefault = settings.mapSettingDefault || "";
            this.mapEntryDefault = settings.mapEntryDefault || "";
            this.mapDefault = settings.mapDefault;
            this.blocksize = settings.blocksize || 1;
            this.keyUndefined = settings.keyUndefined || "-none-";
            this.currentPreThings = [];
            this.currentMode = "Build";
            this.currentClickMode = "Thing";
            this.canClick = true;
        }
        /* Simple gets
        */
        /**
         *
         */
        LevelEditr.prototype.getGameStarter = function () {
            return this.GameStarter;
        };
        /**
         *
         */
        LevelEditr.prototype.getOldInformation = function () {
            return this.oldInformation;
        };
        /**
         *
         */
        LevelEditr.prototype.getPreThings = function () {
            return this.prethings;
        };
        /**
         *
         */
        LevelEditr.prototype.getThingGroups = function () {
            return this.thingGroups;
        };
        /**
         *
         */
        LevelEditr.prototype.getThingKeys = function () {
            return this.thingKeys;
        };
        /**
         *
         */
        LevelEditr.prototype.getMacros = function () {
            return this.macros;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapNameDefault = function () {
            return this.mapNameDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapTimeDefault = function () {
            return this.mapTimeDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapEntryDefault = function () {
            return this.mapEntryDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapDefault = function () {
            return this.mapDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getDisplay = function () {
            return this.display;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentMode = function () {
            return this.currentMode;
        };
        /**
         *
         */
        LevelEditr.prototype.getBlockSize = function () {
            return this.blocksize;
        };
        /**
         *
         */
        LevelEditr.prototype.getBeautifier = function () {
            return this.beautifier;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentPreThings = function () {
            return this.currentPreThings;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentTitle = function () {
            return this.currentTitle;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentArgs = function () {
            return this.currentArgs;
        };
        /**
         *
         */
        LevelEditr.prototype.getPageStylesAdded = function () {
            return this.pageStylesAdded;
        };
        /**
         *
         */
        LevelEditr.prototype.getKeyUndefined = function () {
            return this.keyUndefined;
        };
        /**
         *
         */
        LevelEditr.prototype.getCanClick = function () {
            return this.canClick;
        };
        /* State resets
        */
        /**
         *
         */
        LevelEditr.prototype.enable = function () {
            this.oldInformation = {
                "map": this.GameStarter.MapsHandler.getMapName()
            };
            this.clearAllThings();
            this.resetDisplay();
            this.GameStarter.InputWriter.setCanTrigger(false);
            this.setCurrentMode("Build");
            this.setTextareaValue(this.stringifySmart(this.mapDefault), true);
            this.resetDisplayMap();
            this.disableThing(this.GameStarter.player);
            if (!this.pageStylesAdded) {
                this.GameStarter.addPageStyles(this.createPageStyles());
                this.pageStylesAdded = true;
            }
            this.GameStarter.container.insertBefore(this.display.container, this.GameStarter.container.children[0]);
        };
        /**
         *
         */
        LevelEditr.prototype.disable = function () {
            if (!this.display) {
                return;
            }
            this.GameStarter.container.removeChild(this.display.container);
            this.display = undefined;
            this.GameStarter.InputWriter.setCanTrigger(true);
            this.GameStarter.setMap(this.oldInformation.map);
        };
        /**
         *
         */
        LevelEditr.prototype.minimize = function () {
            this.display.minimizer.innerText = "+";
            this.display.minimizer.onclick = this.maximize.bind(this);
            this.display.container.className += " minimized";
        };
        /**
         *
         */
        LevelEditr.prototype.maximize = function () {
            this.display.minimizer.innerText = "-";
            this.display.minimizer.onclick = this.minimize.bind(this);
            if (this.display.container.className.indexOf("minimized") !== -1) {
                this.display.container.className = this.display.container.className.replace(/ minimized/g, "");
            }
        };
        /**
         *
         */
        LevelEditr.prototype.startBuilding = function () {
            this.beautifyTextareaValue();
            this.setDisplayMap(true);
            this.GameStarter.InputWriter.setCanTrigger(false);
            this.setCurrentMode("Build");
            this.maximize();
        };
        /**
         *
         */
        LevelEditr.prototype.startPlaying = function () {
            this.beautifyTextareaValue();
            this.setDisplayMap(false);
            this.GameStarter.InputWriter.setCanTrigger(true);
            this.setCurrentMode("Play");
            this.minimize();
        };
        /**
         *
         */
        LevelEditr.prototype.downloadCurrentJSON = function () {
            var link = this.downloadFile(this.getMapName() + ".json", this.display.stringer.textarea.value || "");
            window.open(link.href);
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentJSON = function (json) {
            this.startBuilding();
            this.setTextareaValue(json, true);
            this.getMapObjectAndTry();
        };
        /**
         *
         */
        LevelEditr.prototype.loadCurrentJSON = function () {
            this.display.inputDummy.click();
        };
        /* Interactivity
        */
        /**
         *
         */
        LevelEditr.prototype.handleUploadCompletion = function (event) {
            this.enable();
            this.setCurrentJSON(event.currentTarget.result);
            this.setSectionJSON();
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentMode = function (mode) {
            this.currentMode = mode;
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentClickMode = function (mode, event) {
            this.currentClickMode = mode;
            this.cancelEvent(event);
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentThing = function (title, args, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.currentTitle = title;
            this.currentArgs = args;
            this.currentPreThings = [
                {
                    "xloc": 0,
                    "yloc": 0,
                    "thing": this.GameStarter.ObjectMaker.make(this.currentTitle, this.GameStarter.proliferate({
                        "onThingMake": undefined,
                        "onThingAdd": undefined,
                        "onThingAdded": undefined,
                        "outerok": true
                    }, this.getNormalizedThingArguments(args)))
                }
            ];
            this.disableThing(this.currentPreThings[0].thing);
            this.GameStarter.addThing(this.currentPreThings[0].thing, x, y);
        };
        LevelEditr.prototype.setCurrentMacroThings = function () {
            var currentThing, i;
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                currentThing = this.currentPreThings[i];
                currentThing.thing.outerok = true;
                this.disableThing(currentThing.thing);
                this.GameStarter.addThing(currentThing.thing, currentThing.xloc || 0, currentThing.yloc || 0);
            }
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentArgs = function () {
            if (this.currentClickMode === "Thing") {
                this.setCurrentThing(this.currentTitle, this.generateCurrentArgs());
            }
            else {
                this.onMacroIconClick(this.currentTitle, undefined, this.generateCurrentArgs());
            }
        };
        /* Mouse events
        */
        /**
         *
         */
        LevelEditr.prototype.onMouseDownScroller = function (direction, event) {
            var target = event.target, scope = this;
            target.setAttribute("scrolling", "1");
            this.GameStarter.TimeHandler.addEventInterval(function () {
                if (target.getAttribute("scrolling") !== "1") {
                    return true;
                }
                if (direction < 0 && scope.GameStarter.MapScreener.left <= 0) {
                    (scope.display.scrollers.left).style.opacity = "0";
                    return;
                }
                scope.GameStarter.scrollWindow(direction);
                scope.display.scrollers.left.style.opacity = "1";
            }, 1, Infinity);
        };
        /**
         *
         */
        LevelEditr.prototype.onMouseUpScrolling = function (event) {
            event.target.setAttribute("scrolling", "0");
        };
        /**
         *
         */
        LevelEditr.prototype.onMouseMoveEditing = function (event) {
            var x = event.x || event.clientX || 0, y = event.y || event.clientY || 0, prething, i;
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                prething = this.currentPreThings[i];
                if (!prething.thing) {
                    continue;
                }
                this.GameStarter.setLeft(prething.thing, this.roundTo(x - this.GameStarter.container.offsetLeft, this.blocksize)
                    + (prething.left || 0) * this.GameStarter.unitsize);
                this.GameStarter.setTop(prething.thing, this.roundTo(y - this.GameStarter.container.offsetTop, this.blocksize)
                    - (prething.top || 0) * this.GameStarter.unitsize);
            }
        };
        /**
         * Temporarily disables this.canClick, so double clicking doesn't happen.
         */
        LevelEditr.prototype.afterClick = function () {
            this.canClick = false;
            setTimeout(function () {
                this.canClick = true;
            }, 70);
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingThing = function (event) {
            if (!this.canClick || this.currentMode !== "Build") {
                return;
            }
            var x = this.roundTo(event.x || event.clientX || 0, this.blocksize), y = this.roundTo(event.y || event.clientY || 0, this.blocksize);
            if (!this.currentPreThings.length || !this.addMapCreationThing(x, y)) {
                return;
            }
            this.onClickEditingGenericAdd(x, y, this.currentTitle, this.currentArgs);
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingMacro = function (event) {
            if (!this.canClick || this.currentMode !== "Build") {
                return;
            }
            var x = this.roundTo(event.x || event.clientX || 0, this.blocksize), y = this.roundTo(event.y || event.clientY || 0, this.blocksize), prething, i;
            if (!this.currentPreThings.length || !this.addMapCreationMacro(x, y)) {
                return;
            }
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                prething = this.currentPreThings[i];
                this.onClickEditingGenericAdd(x + (prething.left || 0) * this.GameStarter.unitsize, y - (prething.top || 0) * this.GameStarter.unitsize, prething.thing.title || prething.title, prething.reference);
            }
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingGenericAdd = function (x, y, title, args) {
            var thing = this.GameStarter.ObjectMaker.make(title, this.GameStarter.proliferate({
                "onThingMake": undefined,
                "onThingAdd": undefined,
                "onThingAdded": undefined,
                "movement": undefined
            }, this.getNormalizedThingArguments(args)));
            if (this.currentMode === "Build") {
                this.disableThing(thing, .7);
            }
            this.GameStarter.addThing(thing, this.roundTo(x - this.GameStarter.container.offsetLeft, this.blocksize), this.roundTo(y - this.GameStarter.container.offsetTop, this.blocksize));
        };
        /**
         *
         */
        LevelEditr.prototype.onThingIconClick = function (title, event) {
            var x = event.x || event.clientX || 0, y = event.y || event.clientY || 0, target = event.target.nodeName === "DIV"
                ? event.target : event.target.parentNode, scope = this;
            this.cancelEvent(event);
            this.killCurrentPreThings();
            setTimeout(function () {
                scope.setCurrentThing(title, scope.getCurrentArgs(), x, y);
            });
            this.setVisualOptions(target.getAttribute("name"), undefined, target.options);
        };
        /**
         *
         */
        LevelEditr.prototype.onMacroIconClick = function (title, description, options) {
            if (description) {
                this.setVisualOptions(title, description, options);
            }
            var map = this.getMapObject();
            if (!map) {
                return;
            }
            this.currentPreThings = [];
            this.GameStarter.MapsCreator.analyzePreMacro(this.GameStarter.proliferate({
                "macro": title
            }, this.generateCurrentArgs()), this.createPrethingsHolder(this.currentPreThings), this.getCurrentAreaObject(map), map);
            this.currentTitle = title;
            this.setCurrentMacroThings();
        };
        /**
         *
         */
        LevelEditr.prototype.createPrethingsHolder = function (prethings) {
            var output = {};
            this.thingGroups.forEach(function (group) {
                output[group] = prethings;
            });
            return output;
        };
        /**
         *
         */
        LevelEditr.prototype.generateCurrentArgs = function () {
            var args = {}, container = this.display.sections.ClickToPlace.VisualOptions, children = container.getElementsByClassName("VisualOptionsList"), child, labeler, valuer, value, i;
            if (children.length === 0) {
                return args;
            }
            children = children[0].childNodes;
            for (i = 0; i < children.length; i += 1) {
                child = children[i];
                labeler = child.querySelector(".VisualOptionLabel");
                valuer = child.querySelector(".VisualOptionValue");
                switch ((valuer.getAttribute("data:type") || valuer.type).toLowerCase()) {
                    case "boolean":
                        value = valuer.value === "true" ? true : false;
                        break;
                    case "number":
                        value = (Number(valuer.value) || 0) * (Number(valuer.getAttribute("data:mod")) || 1);
                        break;
                    default:
                        value = valuer.value;
                        break;
                }
                if (value !== this.keyUndefined) {
                    args[labeler.textContent] = value;
                }
            }
            return args;
        };
        /* Map manipulations
        */
        /**
         *
         */
        LevelEditr.prototype.setMapName = function () {
            var name = this.getMapName(), map = this.getMapObject();
            if (map && map.name !== name) {
                map.name = name;
                this.display.namer.value = name;
                this.setTextareaValue(this.stringifySmart(map), true);
                this.GameStarter.ItemsHolder.setItem("world", name);
            }
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setMapTime = function (fromGui) {
            var map = this.getMapObject(), time;
            if (!map) {
                return;
            }
            if (fromGui) {
                time = Number(this.display.sections.MapSettings.Time.value);
                map.time = time;
            }
            else {
                time = map.time;
                this.display.sections.MapSettings.Time.value = time.toString();
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.GameStarter.ItemsHolder.setItem("time", time);
            this.GameStarter.TimeHandler.cancelAllEvents();
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setMapSetting = function (fromGui) {
            var map = this.getMapObject(), area, setting;
            if (!map) {
                return;
            }
            area = this.getCurrentAreaObject(map);
            if (fromGui) {
                setting = this.display.sections.MapSettings.Setting.Primary.value;
                if (this.display.sections.MapSettings.Setting.Secondary.value) {
                    setting += " " + this.display.sections.MapSettings.Setting.Secondary.value;
                }
                if (this.display.sections.MapSettings.Setting.Tertiary.value) {
                    setting += " " + this.display.sections.MapSettings.Setting.Tertiary.value;
                }
                area.setting = setting;
            }
            else {
                setting = area.setting.split(" ");
                this.display.sections.MapSettings.Setting.Primary.value = setting[0];
                this.display.sections.MapSettings.Setting.Secondary.value = setting[1];
                this.display.sections.MapSettings.Setting.Tertiary.value = setting[2];
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.setLocationArea = function () {
            var map = this.getMapObject(), location;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            location.area = this.getCurrentArea();
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON
         *                             section (false).
         */
        LevelEditr.prototype.setMapEntry = function (fromGui) {
            var map = this.getMapObject(), location, entry;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            if (fromGui) {
                entry = this.display.sections.MapSettings.Entry.value;
                location.entry = entry;
            }
            else {
                console.warn("Was this code ever reached? area.location?");
                // entry = area.location;
                this.display.sections.MapSettings.Entry.value = entry;
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setCurrentLocation = function (fromGui) {
            var map = this.getMapObject(), location;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            if (fromGui) {
                this.display.sections.MapSettings.Area.value = location.area
                    ? location.area.toString() : "0";
            }
            else {
                console.warn("This code is never reached, right?");
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.addLocationToMap = function () {
            var name = this.display.sections.MapSettings.Location.options.length.toString(), map = this.getMapObject();
            if (!map) {
                return;
            }
            map.locations[name] = {
                "entry": this.mapEntryDefault
            };
            this.resetAllVisualOptionSelects("VisualOptionLocation", Object.keys(map.locations));
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.addAreaToMap = function () {
            var name = this.display.sections.MapSettings.Area.options.length.toString(), map = this.getMapObject();
            if (!map) {
                return;
            }
            map.areas[name] = {
                "setting": this.mapSettingDefault,
                "creation": []
            };
            this.resetAllVisualOptionSelects("VisualOptionArea", Object.keys(map.areas));
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.resetAllVisualOptionSelects = function (className, options) {
            var map = this.getMapObject(), elements = this.display.container.getElementsByClassName(className), attributes = {
                "children": options.map(function (option) {
                    return new Option(option, option);
                })
            }, element, value, i;
            if (!map) {
                return;
            }
            for (i = 0; i < elements.length; i += 1) {
                element = elements[i];
                value = element.value;
                element.textContent = "";
                this.GameStarter.proliferateElement(element, attributes);
                element.value = value;
            }
        };
        LevelEditr.prototype.getMapObject = function () {
            var map;
            try {
                map = this.parseSmart(this.display.stringer.textarea.value);
                this.display.stringer.messenger.textContent = "";
                this.display.namer.value = map.name || this.mapNameDefault;
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
            }
            return map;
        };
        LevelEditr.prototype.getMapObjectAndTry = function () {
            var mapName = this.getMapName() + "::Temporary", mapRaw = this.getMapObject();
            if (!mapRaw) {
                return false;
            }
            try {
                this.GameStarter.MapsCreator.storeMap(mapName, mapRaw);
                this.GameStarter.MapsCreator.getMap(mapName);
                this.setDisplayMap(true);
            }
            catch (error) {
                this.display.stringer.messenger.textContent = error.message;
                return false;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentArea = function () {
            return this.display.sections.MapSettings.Area.value;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentAreaObject = function (map) {
            if (map === void 0) { map = this.getMapObject(); }
            var area = map.locations[this.getCurrentLocation()].area;
            return map.areas[area ? area.toString() : "0"];
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentLocation = function () {
            return this.display.sections.MapSettings.Location.value;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentLocationObject = function (map) {
            return map.locations[this.getCurrentLocation()];
        };
        /**
         *
         */
        LevelEditr.prototype.addMapCreationThing = function (x, y) {
            var mapObject = this.getMapObject(), thingRaw = this.GameStarter.proliferate({
                "thing": this.currentTitle,
                "x": this.getNormalizedX(x) + (this.GameStarter.MapScreener.left / this.GameStarter.unitsize),
                "y": this.getNormalizedY(y)
            }, this.currentArgs);
            if (!mapObject) {
                return false;
            }
            mapObject.areas[this.getCurrentArea()].creation.push(thingRaw);
            this.setTextareaValue(this.stringifySmart(mapObject), true);
            return true;
        };
        LevelEditr.prototype.addMapCreationMacro = function (x, y) {
            var mapObject = this.getMapObject(), macroRaw = this.GameStarter.proliferate({
                "macro": this.currentTitle,
                "x": this.getNormalizedX(x) + (this.GameStarter.MapScreener.left / this.GameStarter.unitsize),
                "y": this.getNormalizedY(y)
            }, this.generateCurrentArgs());
            if (!mapObject) {
                return false;
            }
            mapObject.areas[this.getCurrentArea()].creation.push(macroRaw);
            this.setTextareaValue(this.stringifySmart(mapObject), true);
            return true;
        };
        /* HTML manipulations
        */
        LevelEditr.prototype.resetDisplay = function () {
            this.display = {
                "container": this.GameStarter.createElement("div", {
                    "className": "LevelEditor",
                    "onclick": this.cancelEvent.bind(this),
                    "ondragenter": this.handleDragEnter.bind(this),
                    "ondragover": this.handleDragOver.bind(this),
                    "ondrop": this.handleDragDrop.bind(this)
                }),
                "scrollers": {},
                "stringer": {},
                "sections": {
                    "ClickToPlace": {},
                    "MapSettings": {
                        "Setting": {}
                    },
                    "buttons": {
                        "ClickToPlace": {}
                    }
                }
            };
            this.resetDisplayScrollers();
            this.resetDisplayGui();
            this.resetDisplayHead();
            this.resetDisplaySectionChoosers();
            this.resetDisplayOptionsList();
            this.resetDisplayMapSettings();
        };
        LevelEditr.prototype.resetDisplayGui = function () {
            this.display.gui = this.GameStarter.createElement("div", {
                "className": "EditorGui",
                "onclick": this.afterClick.bind(this)
            });
            this.display.container.appendChild(this.display.gui);
        };
        LevelEditr.prototype.resetDisplayScrollers = function () {
            this.display.scrollers = {
                "left": this.GameStarter.createElement("div", {
                    "className": "EditorScroller EditorScrollerLeft",
                    "onmousedown": this.onMouseDownScroller.bind(this, -this.GameStarter.unitsize * 2),
                    "onmouseup": this.onMouseUpScrolling.bind(this),
                    "onmouseout": this.onMouseUpScrolling.bind(this),
                    "onclick": this.cancelEvent.bind(this),
                    "innerText": "<",
                    "style": {
                        "paddingTop": this.GameStarter.MapScreener.height / 2 - 35 + "px",
                        "fontSize": "70px",
                        "opacity": 0
                    }
                }),
                "right": this.GameStarter.createElement("div", {
                    "className": "EditorScroller EditorScrollerRight",
                    "onmousedown": this.onMouseDownScroller.bind(this, this.GameStarter.unitsize * 2),
                    "onmouseup": this.onMouseUpScrolling.bind(this),
                    "onmouseout": this.onMouseUpScrolling.bind(this),
                    "onclick": this.cancelEvent.bind(this),
                    "innerText": ">",
                    "style": {
                        "paddingTop": this.GameStarter.MapScreener.height / 2 - 35 + "px",
                        "fontSize": "70px"
                    }
                }),
                "container": this.GameStarter.createElement("div", {
                    "className": "EditorScrollers",
                    "onmousemove": this.onMouseMoveEditing.bind(this),
                    "onclick": this.onClickEditingThing.bind(this)
                })
            };
            this.display.scrollers.container.appendChild(this.display.scrollers.left);
            this.display.scrollers.container.appendChild(this.display.scrollers.right);
            this.display.container.appendChild(this.display.scrollers.container);
        };
        LevelEditr.prototype.resetDisplayHead = function () {
            this.display.minimizer = this.GameStarter.createElement("div", {
                "className": "EditorHeadButton EditorMinimizer",
                "onclick": this.minimize.bind(this),
                "textContent": "-"
            });
            this.display.head = this.GameStarter.createElement("div", {
                "className": "EditorHead",
                "children": [
                    this.GameStarter.createElement("div", {
                        "className": "EditorNameContainer",
                        "children": [
                            this.display.namer = this.GameStarter.createElement("input", {
                                "className": "EditorNameInput",
                                "type": "text",
                                "placeholder": this.mapNameDefault,
                                "value": this.mapNameDefault,
                                "onkeyup": this.setMapName.bind(this),
                                "onchange": this.setMapName.bind(this)
                            })
                        ]
                    }),
                    this.display.minimizer,
                    this.GameStarter.createElement("div", {
                        "className": "EditorHeadButton EditorCloser",
                        "textContent": "X",
                        "onclick": this.disable.bind(this)
                    })
                ]
            });
            this.display.gui.appendChild(this.display.head);
        };
        LevelEditr.prototype.resetDisplaySectionChoosers = function () {
            var sectionChoosers = this.GameStarter.createElement("div", {
                "className": "EditorSectionChoosers",
                "onclick": this.cancelEvent.bind(this),
                "children": [
                    this.display.sections.buttons.ClickToPlace.container = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "white"
                        },
                        "textContent": "Visual",
                        "onclick": this.setSectionClickToPlace.bind(this)
                    }),
                    this.display.sections.buttons.MapSettings = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "gray"
                        },
                        "textContent": "Map",
                        "onclick": this.setSectionMapSettings.bind(this)
                    }),
                    this.display.sections.buttons.JSON = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "gray"
                        },
                        "textContent": "JSON",
                        "onclick": this.setSectionJSON.bind(this)
                    })
                ]
            });
            this.display.gui.appendChild(sectionChoosers);
        };
        LevelEditr.prototype.resetDisplayOptionsList = function () {
            this.display.sections.ClickToPlace.container = this.GameStarter.createElement("div", {
                "className": "EditorOptionsList EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "block"
                }
            });
            this.resetDisplayOptionsListSubOptionsMenu();
            this.resetDisplayOptionsListSubOptions();
            this.display.gui.appendChild(this.display.sections.ClickToPlace.container);
        };
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsMenu = function () {
            var holder = this.GameStarter.createElement("div", {
                "className": "EditorSubOptionsListsMenu"
            });
            this.display.sections.buttons.ClickToPlace.Things = this.GameStarter.createElement("div", {
                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                "textContent": "Things",
                "onclick": this.setSectionClickToPlaceThings.bind(this),
                "style": {
                    "background": "#CCC"
                }
            });
            this.display.sections.buttons.ClickToPlace.Macros = this.GameStarter.createElement("div", {
                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                "textContent": "Macros",
                "onclick": this.setSectionClickToPlaceMacros.bind(this),
                "style": {
                    "background": "#777"
                }
            });
            holder.appendChild(this.display.sections.buttons.ClickToPlace.Things);
            holder.appendChild(this.display.sections.buttons.ClickToPlace.Macros);
            this.display.sections.ClickToPlace.container.appendChild(holder);
        };
        LevelEditr.prototype.resetDisplayMapSettings = function () {
            this.display.sections.MapSettings.container = this.GameStarter.createElement("div", {
                "className": "EditorMapSettings EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "none"
                },
                "children": [
                    this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption",
                        "textContent": "+ Add Area",
                        "onclick": this.addAreaToMap.bind(this)
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption",
                        "textContent": "+ Add Location",
                        "onclick": this.addLocationToMap.bind(this)
                    })
                ]
            });
            this.resetDisplayMapSettingsCurrent();
            this.resetDisplayMapSettingsMap();
            this.resetDisplayMapSettingsLocation();
            this.resetDisplayJSON();
            this.resetDisplayVisualContainers();
            this.resetDisplayButtons();
            this.display.gui.appendChild(this.display.sections.MapSettings.container);
        };
        LevelEditr.prototype.resetDisplayMapSettingsCurrent = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsSubGroup",
                "children": [
                    this.GameStarter.createElement("label", {
                        "textContent": "Current Location"
                    }),
                    this.display.sections.MapSettings.Location = this.createSelect(["0"], {
                        "className": "VisualOptionLocation",
                        "onchange": this.setCurrentLocation.bind(this, true)
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayMapSettingsMap = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsGroup",
                "children": [
                    this.GameStarter.createElement("h4", {
                        "textContent": "Map"
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "className": "EditorMapSettingsLabel",
                                "textContent": "Time"
                            }),
                            this.display.sections.MapSettings.Time = this.createSelect([
                                "100", "200", "300", "400", "500", "1000", "Infinity"
                            ], {
                                "value": this.mapTimeDefault.toString(),
                                "onchange": this.setMapTime.bind(this, true)
                            })
                        ]
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayMapSettingsLocation = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsGroup",
                "children": [
                    this.GameStarter.createElement("h4", {
                        "textContent": "Location"
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Area"
                            }),
                            this.display.sections.MapSettings.Area = this.createSelect(["0"], {
                                "className": "VisualOptionArea",
                                "onchange": this.setLocationArea.bind(this, true)
                            })
                        ]
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Setting"
                            }),
                            this.display.sections.MapSettings.Setting.Primary = this.createSelect([
                                "Overworld", "Underworld", "Underwater", "Castle"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            }),
                            this.display.sections.MapSettings.Setting.Secondary = this.createSelect([
                                "", "Night", "Underwater", "Alt"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            }),
                            this.display.sections.MapSettings.Setting.Tertiary = this.createSelect([
                                "", "Night", "Underwater", "Alt"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            })
                        ]
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Entrance"
                            }),
                            this.display.sections.MapSettings.Entry = this.createSelect([
                                "Plain", "Normal", "Castle", "PipeVertical", "PipeHorizontal"
                            ], {
                                "onchange": this.setMapEntry.bind(this, true)
                            })
                        ]
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayJSON = function () {
            this.display.sections.JSON = this.GameStarter.createElement("div", {
                "className": "EditorJSON EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "none"
                },
                "children": [
                    this.display.stringer.textarea = this.GameStarter.createElement("textarea", {
                        "className": "EditorJSONInput",
                        "spellcheck": false,
                        "onkeyup": this.getMapObjectAndTry.bind(this),
                        "onchange": this.getMapObjectAndTry.bind(this)
                    }),
                    this.display.stringer.messenger = this.GameStarter.createElement("div", {
                        "className": "EditorJSONInfo"
                    })
                ]
            });
            this.display.gui.appendChild(this.display.sections.JSON);
        };
        LevelEditr.prototype.resetDisplayVisualContainers = function () {
            this.display.sections.ClickToPlace.VisualSummary = this.GameStarter.createElement("div", {
                "className": "EditorVisualSummary",
                "onclick": this.cancelEvent.bind(this)
            });
            this.display.sections.ClickToPlace.VisualOptions = this.GameStarter.createElement("div", {
                "className": "EditorVisualOptions",
                "onclick": this.cancelEvent.bind(this),
                "textContent": "Click an icon to view options.",
                "style": {
                    "display": "block"
                }
            });
            this.display.gui.appendChild(this.display.sections.ClickToPlace.VisualSummary);
            this.display.gui.appendChild(this.display.sections.ClickToPlace.VisualOptions);
        };
        LevelEditr.prototype.resetDisplayButtons = function () {
            var scope = this;
            this.display.gui.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMenu",
                "onclick": this.cancelEvent.bind(this),
                "children": (function (actions) {
                    return Object.keys(actions).map(function (key) {
                        return scope.GameStarter.createElement("div", {
                            "className": "EditorMenuOption EditorMenuOptionFifth EditorMenuOption-" + key,
                            "textContent": key,
                            "onclick": actions[key][0].bind(scope),
                            "children": actions[key][1]
                        });
                    });
                })({
                    "Build": [this.startBuilding.bind(this)],
                    "Play": [this.startPlaying.bind(this)],
                    "Save": [this.downloadCurrentJSON.bind(this)],
                    "Load": [
                        this.loadCurrentJSON.bind(this),
                        this.display.inputDummy = this.GameStarter.createElement("input", {
                            "type": "file",
                            "style": {
                                "display": "none"
                            },
                            "onchange": this.handleUploadStart.bind(this)
                        })
                    ],
                    "Reset": [this.resetDisplayMap.bind(this)]
                })
            }));
        };
        /**
         * Adds the Things and Macros menus to the EditorOptionsList container in
         * the main GUI.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptions = function () {
            this.resetDisplayOptionsListSubOptionsThings();
            this.resetDisplayOptionsListSubOptionsMacros();
        };
        /**
         * Creates the menu of icons for Things, with a dropdown select to choose
         * the groupings being displayed. These icons, when clicked, trigger
         * this.onThingIconClick on the Thing's title.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsThings = function () {
            var scope = this, 
            // Without clicker, tslint complaints onThingIconClick isn't used...
            clicker = this.onThingIconClick;
            this.display.sections.ClickToPlace.Things = this.GameStarter.createElement("div", {
                "className": "EditorSectionSecondary EditorOptions EditorOptions-Things",
                "style": {
                    "display": "block"
                },
                "children": (function () {
                    var selectedIndex = 0, containers = Object.keys(scope.prethings).map(function (key) {
                        var children = Object.keys(scope.prethings[key]).map(function (title) {
                            var thing = scope.GameStarter.ObjectMaker.make(title), container = scope.GameStarter.createElement("div", {
                                "className": "EditorListOption",
                                "name": title,
                                "options": scope.prethings[key][title],
                                "children": [thing.canvas],
                                "onclick": clicker.bind(scope, title)
                            }), sizeMax = 70, widthThing = thing.width * scope.GameStarter.unitsize, heightThing = thing.height * scope.GameStarter.unitsize, widthDiff = (sizeMax - widthThing) / 2, heightDiff = (sizeMax - heightThing) / 2;
                            thing.canvas.style.top = heightDiff + "px";
                            thing.canvas.style.right = widthDiff + "px";
                            thing.canvas.style.bottom = heightDiff + "px";
                            thing.canvas.style.left = widthDiff + "px";
                            scope.GameStarter.PixelDrawer.setThingSprite(thing);
                            return container;
                        });
                        return scope.GameStarter.createElement("div", {
                            "className": "EditorOptionContainer",
                            "style": {
                                "display": "none"
                            },
                            "children": children
                        });
                    }), switcher = scope.createSelect(Object.keys(scope.prethings), {
                        "className": "EditorOptionContainerSwitchers",
                        "onchange": function () {
                            containers[selectedIndex + 1].style.display = "none";
                            containers[switcher.selectedIndex + 1].style.display = "block";
                            selectedIndex = switcher.selectedIndex;
                        }
                    });
                    containers[0].style.display = "block";
                    containers.unshift(switcher);
                    return containers;
                })()
            });
            this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Things);
        };
        /**
         * Creates the menu of (text) icons for Macros. When clicked, these trigger
         * this.onMacroIconClick on the macro's title, description, and options.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsMacros = function () {
            var scope = this;
            scope.display.sections.ClickToPlace.Macros = scope.GameStarter.createElement("div", {
                "className": "EditorSectionSecondary EditorOptions EditorOptions-Macros",
                "style": {
                    "display": "none"
                },
                "children": Object.keys(scope.macros).map(function (key) {
                    var macro = scope.macros[key];
                    return scope.GameStarter.createElement("div", {
                        "className": "EditorOptionContainer",
                        "children": [
                            scope.GameStarter.createElement("div", {
                                "className": "EditorOptionTitle EditorMenuOption",
                                "textContent": key,
                                "onclick": scope.onMacroIconClick.bind(scope, key, macro.description, macro.options)
                            })
                        ]
                    });
                })
            });
            this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Macros);
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlace = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.container.style.display = "block";
            this.display.sections.MapSettings.container.style.display = "none";
            this.display.sections.JSON.style.display = "none";
            this.display.sections.buttons.ClickToPlace.container.style.backgroundColor = "white";
            this.display.sections.buttons.MapSettings.style.background = "gray";
            this.display.sections.buttons.JSON.style.background = "gray";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionMapSettings = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "none";
            this.display.sections.ClickToPlace.container.style.display = "none";
            this.display.sections.MapSettings.container.style.display = "block";
            this.display.sections.JSON.style.display = "none";
            this.display.sections.buttons.ClickToPlace.container.style.background = "gray";
            this.display.sections.buttons.MapSettings.style.background = "white";
            this.display.sections.buttons.JSON.style.background = "gray";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionJSON = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "none";
            this.display.sections.ClickToPlace.container.style.display = "none";
            this.display.sections.MapSettings.container.style.display = "none";
            this.display.sections.JSON.style.display = "block";
            this.display.sections.buttons.ClickToPlace.container.style.background = "gray";
            this.display.sections.buttons.MapSettings.style.background = "gray";
            this.display.sections.buttons.JSON.style.background = "white";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlaceThings = function (event) {
            this.setCurrentClickMode("Thing", event);
            this.display.container.onclick = this.onClickEditingThing.bind(this);
            this.display.scrollers.container.onclick = this.onClickEditingThing.bind(this);
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.Things.style.display = "block";
            this.display.sections.ClickToPlace.Macros.style.display = "none";
            this.display.sections.buttons.ClickToPlace.Things.style.background = "#CCC";
            this.display.sections.buttons.ClickToPlace.Macros.style.background = "#777";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlaceMacros = function (event) {
            this.setCurrentClickMode("Macro", event);
            this.display.container.onclick = this.onClickEditingMacro.bind(this);
            this.display.scrollers.container.onclick = this.onClickEditingMacro.bind(this);
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.Things.style.display = "none";
            this.display.sections.ClickToPlace.Macros.style.display = "block";
            this.display.sections.buttons.ClickToPlace.Things.style.background = "#777";
            this.display.sections.buttons.ClickToPlace.Macros.style.background = "#CCC";
        };
        /**
         *
         */
        LevelEditr.prototype.setTextareaValue = function (value, doBeautify) {
            if (doBeautify === void 0) { doBeautify = false; }
            if (doBeautify) {
                this.display.stringer.textarea.value = this.beautifier(value);
            }
            else {
                this.display.stringer.textarea.value = value;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.beautifyTextareaValue = function () {
            this.display.stringer.textarea.value = this.beautifier(this.display.stringer.textarea.value);
        };
        /**
         *
         */
        LevelEditr.prototype.setVisualOptions = function (name, description, options) {
            var visual = this.display.sections.ClickToPlace.VisualOptions, 
            // Without clicker, tslint complains createVisualOption isn't being used...
            clicker = this.createVisualOption.bind(this), scope = this;
            visual.textContent = "";
            visual.appendChild(this.GameStarter.createElement("h3", {
                "className": "VisualOptionName",
                "textContent": name
            }));
            if (description) {
                visual.appendChild(this.GameStarter.createElement("div", {
                    "className": "VisualOptionDescription",
                    "textContent": description
                }));
            }
            if (options) {
                visual.appendChild(scope.GameStarter.createElement("div", {
                    "className": "VisualOptionsList",
                    "children": Object.keys(options).map(function (key) {
                        return scope.GameStarter.createElement("div", {
                            "className": "VisualOption",
                            "children": [
                                scope.GameStarter.createElement("div", {
                                    "className": "VisualOptionLabel",
                                    "textContent": key
                                }),
                                clicker(options[key])
                            ]
                        });
                    })
                }));
            }
            this.display.sections.ClickToPlace.VisualSummary.textContent = name;
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOption = function (optionRaw) {
            var option = this.createVisualOptionObject(optionRaw);
            switch (option.type) {
                case "Boolean":
                    return this.createVisualOptionBoolean();
                case "Number":
                    return this.createVisualOptionNumber(option);
                case "Select":
                    return this.createVisualOptionSelect(option);
                case "String":
                    return this.createVisualOptionString(option);
                case "Location":
                    return this.createVisualOptionLocation(option);
                case "Area":
                    return this.createVisualOptionArea(option);
                case "Everything":
                    return this.createVisualOptionEverything(option);
                default:
                    return this.createVisualOptionDefault(option);
            }
        };
        /**
         *
         */
        // mergin this into createVisualOption
        LevelEditr.prototype.createVisualOptionObject = function (optionRaw) {
            var option;
            // If the option isn't already an Object, make it one
            switch (optionRaw.constructor) {
                case Number:
                    option = {
                        "type": "Number",
                        "mod": optionRaw
                    };
                    break;
                case String:
                    option = {
                        "type": optionRaw
                    };
                    break;
                case Array:
                    option = {
                        "type": "Select",
                        "options": optionRaw
                    };
                    break;
                default:
                    option = optionRaw;
            }
            return option;
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionBoolean = function () {
            return this.createSelect([
                "false", "true"
            ], {
                "className": "VisualOptionValue",
                "data:type": "Boolean",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionNumber = function (option) {
            var scope = this;
            return this.GameStarter.createElement("div", {
                "className": "VisualOptionHolder",
                "children": (function () {
                    var modReal = option.mod || 1, input = scope.GameStarter.createElement("input", {
                        "type": "Number",
                        "data:type": "Number",
                        "value": (option.value === undefined) ? 1 : option.value
                    }, {
                        "className": "VisualOptionValue modReal" + modReal,
                        "onchange": scope.setCurrentArgs.bind(scope)
                    }), children = [input];
                    input.setAttribute("data:mod", modReal.toString());
                    if (option.Infinite) {
                        var valueOld = undefined, infinite = scope.createSelect([
                            "Number", "Infinite"
                        ], {
                            "className": "VisualOptionInfiniter",
                            "onchange": function () {
                                if (infinite.value === "Number") {
                                    input.type = "Number";
                                    input.disabled = false;
                                    input.value = valueOld;
                                    input.onchange(undefined);
                                }
                                else {
                                    input.type = "Text";
                                    input.disabled = true;
                                    valueOld = input.value;
                                    input.value = "Infinity";
                                    input.onchange(undefined);
                                }
                            }
                        });
                        if (option.value === Infinity) {
                            infinite.value = "Infinite";
                            infinite.onchange(undefined);
                        }
                        children.push(infinite);
                    }
                    if (modReal > 1) {
                        children.push(scope.GameStarter.createElement("div", {
                            "className": "VisualOptionRecommendation",
                            "textContent": "x" + option.mod
                        }));
                    }
                    return children;
                })()
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionSelect = function (option) {
            return this.createSelect(option.options, {
                "className": "VisualOptionValue",
                "data:type": "Boolean",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionString = function (option) {
            return this.createSelect(option.options, {
                "className": "VisualOptionValue",
                "data:type": "String",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionLocation = function (option) {
            var map = this.getMapObject(), locations;
            if (!map) {
                return this.GameStarter.createElement("div", {
                    "className": "VisualOptionValue VisualOptionLocation EditorComplaint",
                    "text": "Fix map compilation to get locations!"
                });
            }
            locations = Object.keys(map.locations);
            locations.unshift(this.keyUndefined);
            return this.createSelect(locations, {
                "className": "VisualOptionValue VisualOptionLocation",
                "data-type": "Number"
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionArea = function (option) {
            var map = this.getMapObject(), areas;
            if (!map) {
                return this.GameStarter.createElement("div", {
                    "className": "VisualOptionValue VisualOptionArea EditorComplaint",
                    "text": "Fix map compilation to get areas!"
                });
            }
            areas = Object.keys(map.areas);
            areas.unshift(this.keyUndefined);
            return this.createSelect(areas, {
                "className": "VisualOptionValue VisualOptionArea",
                "data-type": "Number",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionEverything = function (option) {
            return this.createSelect(this.thingKeys, {
                "className": "VisualOptionValue VisualOptionEverything",
                "data-type": "String",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionDefault = function (option) {
            return this.GameStarter.createElement("div", {
                "className": "EditorComplaint",
                "textContent": "Unknown type requested: " + option.type
            });
        };
        /**
         *
         */
        LevelEditr.prototype.resetDisplayMap = function () {
            this.setTextareaValue(this.stringifySmart(this.mapDefault), true);
            this.setDisplayMap(true);
            this.GameStarter.InputWriter.setCanTrigger(false);
        };
        /**
         *
         */
        LevelEditr.prototype.setDisplayMap = function (doDisableThings) {
            if (doDisableThings === void 0) { doDisableThings = false; }
            var value = this.display.stringer.textarea.value, mapName = this.getMapName(), testObject, map;
            try {
                testObject = this.parseSmart(value);
                this.setTextareaValue(this.display.stringer.textarea.value);
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
                return;
            }
            try {
                this.GameStarter.MapsCreator.storeMap(mapName, testObject);
                map = this.GameStarter.MapsCreator.getMap(mapName);
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
                return;
            }
            this.display.stringer.messenger.textContent = "";
            this.setTextareaValue(this.display.stringer.textarea.value);
            this.GameStarter.setMap(mapName, this.getCurrentLocation());
            if (doDisableThings) {
                this.disableAllThings();
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getMapName = function () {
            return this.display.namer.value || this.mapNameDefault;
        };
        /* Utility functions
        */
        /**
         *
         */
        LevelEditr.prototype.roundTo = function (num, rounding) {
            return Math.round(num / rounding) * rounding;
        };
        /**
         *
         */
        LevelEditr.prototype.stringifySmart = function (object) {
            if (object === void 0) { object = {}; }
            return JSON.stringify(object, this.jsonReplacerSmart);
        };
        /**
         *
         */
        LevelEditr.prototype.parseSmart = function (text) {
            return JSON.parse(text, this.jsonReplacerSmart);
        };
        /**
         *
         */
        LevelEditr.prototype.jsonReplacerSmart = function (key, value) {
            if (value !== value) {
                return "NaN";
            }
            else if (value === Infinity) {
                return "Infinity";
            }
            else if (value === -Infinity) {
                return "-Infinity";
            }
            else {
                return value;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.disableThing = function (thing, opacity) {
            if (opacity === void 0) { opacity = .49; }
            thing.movement = undefined;
            thing.onThingMake = undefined;
            thing.onThingAdd = undefined;
            thing.onThingAdded = undefined;
            thing.nofall = true;
            thing.nocollide = true;
            thing.xvel = 0;
            thing.yvel = 0;
            thing.opacity = typeof opacity;
        };
        /**
         *
         */
        LevelEditr.prototype.disableAllThings = function () {
            var scope = this, groups = this.GameStarter.GroupHolder.getGroups(), i;
            for (i in groups) {
                if (groups.hasOwnProperty(i)) {
                    groups[i].forEach(function (thing) {
                        scope.disableThing(thing);
                    });
                }
            }
            // Helps prevent triggers such as Bowser jumping
            this.GameStarter.player.dead = true;
            this.GameStarter.ItemsHolder.setItem("time", Infinity);
        };
        /**
         *
         */
        LevelEditr.prototype.clearAllThings = function () {
            var scope = this, groups = this.GameStarter.GroupHolder.getGroups(), i;
            for (i in groups) {
                if (groups.hasOwnProperty(i)) {
                    groups[i].forEach(function (thing) {
                        scope.GameStarter.killNormal(thing);
                    });
                }
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedX = function (raw) {
            return raw / this.GameStarter.unitsize;
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedY = function (raw) {
            return this.GameStarter.MapScreener.floor
                - (raw / this.GameStarter.unitsize)
                + this.GameStarter.unitsize * 3; // Why +3?
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedThingArguments = function (args) {
            var argsNormal = this.GameStarter.proliferate({}, args);
            if (argsNormal.height === Infinity) {
                argsNormal.height = this.GameStarter.MapScreener.height;
            }
            if (argsNormal.width === Infinity) {
                argsNormal.width = this.GameStarter.MapScreener.width;
            }
            return argsNormal;
        };
        /**
         *
         */
        LevelEditr.prototype.createSelect = function (options, attributes) {
            var select = this.GameStarter.createElement("select", attributes), i;
            for (i = 0; i < options.length; i += 1) {
                select.appendChild(this.GameStarter.createElement("option", {
                    "value": options[i],
                    "textContent": options[i]
                }));
            }
            if (typeof attributes.value !== "undefined") {
                select.value = attributes.value;
            }
            return select;
        };
        /**
         *
         */
        LevelEditr.prototype.downloadFile = function (name, content) {
            var link = this.GameStarter.createElement("a", {
                "download": name,
                "href": "data:text/json;charset=utf-8," + encodeURIComponent(content)
            });
            this.display.container.appendChild(link);
            link.click();
            this.display.container.removeChild(link);
            return link;
        };
        /**
         *
         */
        LevelEditr.prototype.killCurrentPreThings = function () {
            for (var i = 0; i < this.currentPreThings.length - 1; i += 1) {
                this.GameStarter.killNormal(this.currentPreThings[i].thing);
            }
        };
        /* File uploading
        */
        /**
         *
         */
        LevelEditr.prototype.handleUploadStart = function (event) {
            var file, reader;
            this.cancelEvent(event);
            if (event && event.dataTransfer) {
                file = event.dataTransfer.files[0];
            }
            else {
                file = this.display.inputDummy.files[0];
                reader = new FileReader();
            }
            if (!file) {
                return;
            }
            reader = new FileReader();
            reader.onloadend = this.handleUploadCompletion.bind(this);
            reader.readAsText(file);
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragEnter = function (event) {
            this.setSectionJSON();
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragOver = function (event) {
            this.cancelEvent(event);
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragDrop = function (event) {
            this.handleUploadStart(event);
        };
        /**
         *
         */
        LevelEditr.prototype.cancelEvent = function (event) {
            if (!event) {
                return;
            }
            if (typeof event.preventDefault === "function") {
                event.preventDefault();
            }
            if (typeof event.stopPropagation === "function") {
                event.stopPropagation();
            }
            event.cancelBubble = true;
        };
        /* Styles
         */
        /*
         *
         */
        LevelEditr.prototype.createPageStyles = function () {
            return {
                ".LevelEditor": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "left": "0"
                },
                ".LevelEditor h4": {
                    "margin": "14px 0 7px 0"
                },
                ".LevelEditor select, .LevelEditor input": {
                    "margin": "7px",
                    "padding": "3px 7px",
                    "font-size": "1.17em"
                },
                // EditorGUI & EditorScrollers
                ".LevelEditor .EditorGui": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "width": "50%",
                    "background": "rgba(0, 7, 14, .84)",
                    "overflow": "hidden",
                    "user-select": "none",
                    "box-sizing": "border-box",
                    "z-index": "70",
                    "transition": "117ms all"
                },
                // EditorMenuContainer & EditorScrollers
                ".LevelEditor .EditorMenuContainer": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "width": "50%",
                    "background": "rgba(0, 7, 14, .84)",
                    "overflow": "hidden",
                    "user-select": "none",
                    "box-sizing": "border-box",
                    "z-index": "70",
                    "transition": "117ms all"
                },
                ".LevelEditor .EditorScrollers": {
                    "position": "absolute",
                    "top": "0",
                    "right": "50%",
                    "bottom": "0",
                    "left": "0",
                    "transition": "117ms all"
                },
                ".EditorScroller": {
                    "position": "absolute",
                    "width": "70px",
                    "height": "101%",
                    "cursor": "pointer",
                    "box-sizing": "border-box",
                    "text-align": "center",
                    "transition": "280ms opacity"
                },
                ".EditorScrollerRight": {
                    "right": "0"
                },
                ".EditorScrollerLeft": {
                    "left": "0"
                },
                ".LevelEditor.minimized .EditorGui": {
                    "width": "117px"
                },
                ".LevelEditor.minimized .EditorMenuContainer": {
                    "width": "117px"
                },
                ".LevelEditor.minimized .EditorScrollers": {
                    "right": "117px",
                    "padding-right": "117px"
                },
                // EditorHead
                ".LevelEditor .EditorHead": {
                    "position": "relative",
                    "height": "35px"
                },
                ".LevelEditor .EditorHead .EditorNameContainer": {
                    "position": "absolute",
                    "top": "1px",
                    "right": "73px",
                    "left": "2px",
                    "height": "35px"
                },
                ".LevelEditor .EditorHead .EditorNameInput": {
                    "display": "block",
                    "margin": "0",
                    "padding": "3px 7px",
                    "width": "100%",
                    "background": "white",
                    "border": "1px solid black",
                    "font-size": "1.4em",
                    "box-sizing": "border-box"
                },
                ".LevelEditor .EditorHead .EditorHeadButton": {
                    "position": "absolute",
                    "top": "2px",
                    "width": "32px",
                    "height": "32px",
                    "background": "rgb(35,35,35)",
                    "border": "1px solid silver",
                    "box-sizing": "border-box",
                    "text-align": "center",
                    "padding-top": "7px",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorHead .EditorMinimizer": {
                    "right": "38px"
                },
                ".LevelEditor .EditorHead .EditorCloser": {
                    "right": "3px"
                },
                // EditorSectionChoosers
                ".LevelEditor .EditorSectionChooser": {
                    "width": "50%",
                    "box-sizing": "border-box",
                    "height": "35px",
                    "background": "white",
                    "border": "3px solid black",
                    "color": "black",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorSectionChooser.Inactive": {
                    "background": "gray"
                },
                ".LevelEditor.minimized .EditorSectionChoosers": {
                    "opacity": "0"
                },
                // EditorSectionMain
                ".LevelEditor .EditorSectionMain": {
                    "position": "absolute",
                    "top": "70px",
                    "right": "0",
                    "bottom": "49px",
                    "left": "0",
                    "overflow-y": "auto"
                },
                ".LevelEditor .EditorSectionSecondary": {
                    "position": "absolute",
                    "top": "35px",
                    "right": "248px",
                    "bottom": "0px",
                    "left": "0",
                    "overflow-y": "auto"
                },
                // EditorJSON
                ".LevelEditor .EditorJSON": {
                    "font-family": "Courier"
                },
                ".LevelEditor .EditorJSONInput": {
                    "display": "block",
                    "width": "100%",
                    "height": "84%",
                    "background": "rgba(0, 3, 7, .91)",
                    "color": "rgba(255, 245, 245, .91)",
                    "box-sizing": "border-box",
                    "overflow-y": "auto",
                    "resize": "none"
                },
                ".LevelEditor .EditorJSONInfo": {
                    "height": "1.75em",
                    "padding": "3px 7px"
                },
                ".LevelEditor.minimized .EditorJSON": {
                    "opacity": "0"
                },
                // EditorOptions
                ".LevelEditor .EditorOptions, .LevelEditor .EditorOptionContainer": {
                    "padding-left": "3px",
                    "clear": "both",
                    "min-width": "98px"
                },
                ".LevelEditor.minimized .EditorOptionsList": {
                    "opacity": "0"
                },
                ".LevelEditor .EditorListOption": {
                    "position": "relative",
                    "float": "left",
                    "margin": "0 7px 7px 0",
                    "width": "70px",
                    "height": "70px",
                    "background": "black",
                    "border": "white",
                    "overflow": "hidden",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorListOption canvas": {
                    "position": "absolute"
                },
                // EditorVisualOptions
                ".LevelEditor .EditorVisualSummary": {
                    "margin": "42px 7px",
                    "opacity": "0",
                    "transition": "117ms opacity"
                },
                ".LevelEditor.minimized .EditorVisualSummary": {
                    "opacity": "0"
                },
                ".LevelEditor .EditorVisualOptions": {
                    "position": "absolute",
                    "right": "21px",
                    "top": "119px",
                    "bottom": "42px",
                    "padding": "7px 11px",
                    "width": "210px",
                    "border": "1px solid silver",
                    "border-width": "1px 0 0 1px",
                    "overflow-x": "visible",
                    "overflow-y": "auto",
                    "opacity": "1",
                    "box-sizing": "border-box",
                    "transition": "117ms opacity"
                },
                ".LevelEditor.minimized .EditorVisualOptions": {
                    "left": "100%"
                },
                ".LevelEditor .EditorVisualOptions .VisualOption": {
                    "padding": "14px 0"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionName": {
                    "margin": "3px 0 7px 0"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionDescription": {
                    "padding-bottom": "14px"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionValue": {
                    "max-width": "117px"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionInfiniter, .LevelEditor .EditorVisualOptions .VisualOptionRecommendation": {
                    "display": "inline"
                },
                // EditorMenu
                ".LevelEditor .EditorMenu": {
                    "position": "absolute",
                    "right": "0",
                    "bottom": "0",
                    "left": "0"
                },
                ".LevelEditor .EditorMenuOption": {
                    "display": "inline-block",
                    "padding": "7px 14px",
                    "background": "white",
                    "border": "3px solid black",
                    "box-sizing": "border-box",
                    "color": "black",
                    "text-align": "center",
                    "overflow": "hidden",
                    "cursor": "pointer"
                },
                ".LevelEditor.minimized .EditorMenuOption:not(:first-of-type)": {
                    "display": "none"
                },
                ".LevelEditor.minimized .EditorMenuOption:first-of-type": {
                    "width": "auto"
                },
                ".LevelEditor .EditorMenuOption:hover": {
                    "opacity": ".91"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionHalf": {
                    "width": "50%"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionThird": {
                    "width": "33%"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionFifth": {
                    "width": "20%"
                },
                // EditorMapSettings
                ".LevelEditor .EditorMapSettingsGroup": {
                    "padding-left": "7px"
                },
                ".LevelEditor .EditorMapSettingsSubGroup": {
                    "padding-left": "14px"
                },
                ".LevelEditor.minimized .EditorMapSettings": {
                    "opacity": "0"
                }
            };
        };
        return LevelEditr;
    })();
    LevelEditr_1.LevelEditr = LevelEditr;
})(LevelEditr || (LevelEditr = {}));
var MathDecidr;
(function (MathDecidr_1) {
    "use strict";
    var MathDecidr = (function () {
        /**
         * @param {IMathDecidrSettings} settings
         */
        function MathDecidr(settings) {
            if (settings === void 0) { settings = {}; }
            var i;
            this.constants = settings.constants || {};
            this.equations = {};
            this.equationsRaw = settings.equations || {};
            if (this.equationsRaw) {
                for (i in this.equationsRaw) {
                    if (this.equationsRaw.hasOwnProperty(i)) {
                        this.addEquation(i, this.equationsRaw[i]);
                    }
                }
            }
        }
        /* Simple gets
        */
        /**
         * @return {Object} Useful constants the MathDecidr may use in equations.
         */
        MathDecidr.prototype.getConstants = function () {
            return this.constants;
        };
        /**
         * @param {String} name   The name of a constant to return.
         * @return {Mixed} The value for the requested constant.
         */
        MathDecidr.prototype.getConstant = function (name) {
            return this.constants[name];
        };
        /**
         * @return {Object} Stored equations with the internal members bound as
         *                  their arguments.
         */
        MathDecidr.prototype.getEquations = function () {
            return this.equations;
        };
        /**
         * @return {Object} The raw equations, unbound.
         */
        MathDecidr.prototype.getRawEquations = function () {
            return this.equationsRaw;
        };
        /**
         * @param {String} name
         * @return {Function} The equation under the given name.
         */
        MathDecidr.prototype.getEquation = function (name) {
            return this.equations[name];
        };
        /**
         * @param {String} name
         * @return {Function} The raw equation under the given name.
         */
        MathDecidr.prototype.getRawEquation = function (name) {
            return this.equationsRaw[name];
        };
        /* Simple additions
        */
        /**
         * Adds a constant of the given name and value.
         *
         * @param {String} name
         * @param {Mixed} value
         */
        MathDecidr.prototype.addConstant = function (name, value) {
            this.constants[name] = value;
        };
        /**
         * Adds an equation Function under the given name.
         *
         * @param {String} name
         * @param {Function} value
         */
        MathDecidr.prototype.addEquation = function (name, value) {
            this.equationsRaw[name] = value;
            this.equations[name] = value.bind(this, this.constants, this.equations);
        };
        /* Computations
        */
        /**
         * Runs a stored equation with any number of arguments, returning the result.
         *
         * @param {String} name   The name of the equation to run.
         * @param {Mixed} ...args   Any arguments to pass to the equation.
         */
        MathDecidr.prototype.compute = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.equations[name].apply(this, Array.prototype.slice.call(arguments, 1));
        };
        return MathDecidr;
    })();
    MathDecidr_1.MathDecidr = MathDecidr;
})(MathDecidr || (MathDecidr = {}));
/// <reference path="ItemsHoldr-0.2.1.ts" />
var ModAttachr;
(function (ModAttachr_1) {
    "use strict";
    /**
     * An addon for for extensible modding functionality. "Mods" register triggers
     * such as "onModEnable" or "onReset" that can be triggered.
     */
    var ModAttachr = (function () {
        /**
         * @param {IModAttachrSettings} [settings]
         */
        function ModAttachr(settings) {
            this.mods = {};
            this.events = {};
            if (!settings) {
                return;
            }
            this.scopeDefault = settings.scopeDefault;
            // If a ItemsHoldr is provided, use it
            if (settings.ItemsHoldr) {
                this.ItemsHolder = settings.ItemsHoldr;
            }
            else if (settings.storeLocally) {
                // If one isn't provided by storeLocally is still true, make one
                this.ItemsHolder = new ItemsHoldr.ItemsHoldr();
            }
            if (settings.mods) {
                this.addMods(settings.mods);
            }
        }
        /* Simple gets
        */
        /**
         * @return {Object} An Object keying each mod by their name.
         */
        ModAttachr.prototype.getMods = function () {
            return this.mods;
        };
        /**
         * @param {String} name   The name of the mod to return.
         * @return {Object} The mod keyed by the name.
         */
        ModAttachr.prototype.getMod = function (name) {
            return this.mods[name];
        };
        /**
         * @return {Object} An Object keying each event by their name.
         */
        ModAttachr.prototype.getEvents = function () {
            return this.events;
        };
        /**
         * @return {Object[]} The mods associated with a particular event.
         */
        ModAttachr.prototype.getEvent = function (name) {
            return this.events[name];
        };
        /**
         * @return {ItemsHoldr} The ItemsHoldr if storeLocally is true, or undefined
         *                      otherwise.
         */
        ModAttachr.prototype.getItemsHolder = function () {
            return this.ItemsHolder;
        };
        /* Alterations
        */
        /**
         * Adds a mod to the pool of mods, listing it under all the relevant events.
         * If the event is enabled, the "onModEnable" event for it is triggered.
         *
         * @param {Object} mod   A summary Object for a mod, containing at the very
         *                       least a name and Object of events.
         */
        ModAttachr.prototype.addMod = function (mod) {
            var modEvents = mod.events, name;
            for (name in modEvents) {
                if (!modEvents.hasOwnProperty(name)) {
                    continue;
                }
                if (!this.events.hasOwnProperty(name)) {
                    this.events[name] = [mod];
                }
                else {
                    this.events[name].push(mod);
                }
            }
            // Mod scope defaults to the ModAttacher's scopeDefault.
            mod.scope = mod.scope || this.scopeDefault;
            // Record the mod in the ModAttachr's mods listing.
            this.mods[mod.name] = mod;
            // If the mod is enabled, trigger its "onModEnable" event
            if (mod.enabled && mod.events.hasOwnProperty("onModEnable")) {
                this.fireModEvent("onModEnable", mod.name, arguments);
            }
            // If there's a ItemsHoldr, record the mod in it
            if (this.ItemsHolder) {
                this.ItemsHolder.addItem(mod.name, {
                    "valueDefault": 0,
                    "storeLocally": true
                });
                // If there was already a (true) value, immediately enable the mod
                if (this.ItemsHolder.getItem(mod.name)) {
                    this.enableMod(mod.name);
                }
            }
        };
        /**
         * Adds each mod in a given Array.
         *
         * @param {Array} mods
         */
        ModAttachr.prototype.addMods = function (mods) {
            for (var i = 0; i < mods.length; i += 1) {
                this.addMod(mods[i]);
            }
        };
        /**
         * Enables a mod of the given name, if it exists. The onModEnable event is
         * called for the mod.
         *
         * @param {String} name   The name of the mod to enable.
         */
        ModAttachr.prototype.enableMod = function (name) {
            var mod = this.mods[name], args;
            if (!mod) {
                throw new Error("No mod of name: '" + name + "'");
            }
            mod.enabled = true;
            args = Array.prototype.slice.call(arguments);
            args[0] = mod;
            if (this.ItemsHolder) {
                this.ItemsHolder.setItem(name, true);
            }
            if (mod.events.hasOwnProperty("onModEnable")) {
                return this.fireModEvent("onModEnable", mod.name, arguments);
            }
        };
        /**
         * Enables any number of mods, given as any number of Strings or Arrays of
         * Strings.
         *
         * @param {...String} names
         */
        ModAttachr.prototype.enableMods = function () {
            var names = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                names[_i - 0] = arguments[_i];
            }
            names.forEach(this.enableMod.bind(this));
        };
        /**
         * Disables a mod of the given name, if it exists. The onModDisable event is
         * called for the mod.
         *
         * @param {String} name   The name of the mod to disable.
         */
        ModAttachr.prototype.disableMod = function (name) {
            var mod = this.mods[name], args;
            if (!this.mods[name]) {
                throw new Error("No mod of name: '" + name + "'");
            }
            this.mods[name].enabled = false;
            args = Array.prototype.slice.call(arguments);
            args[0] = mod;
            if (this.ItemsHolder) {
                this.ItemsHolder.setItem(name, false);
            }
            if (mod.events.hasOwnProperty("onModDisable")) {
                return this.fireModEvent("onModDisable", mod.name, args);
            }
        };
        /**
         * Disables any number of mods, given as any number of Strings or Arrays of
         * Strings.
         *
         * @param {...String} names
         */
        ModAttachr.prototype.disableMods = function () {
            var names = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                names[_i - 0] = arguments[_i];
            }
            names.forEach(this.disableMod.bind(this));
        };
        /**
         * Toggles a mod via enableMod/disableMod of the given name, if it exists.
         *
         * @param {String} name   The name of the mod to toggle.
         */
        ModAttachr.prototype.toggleMod = function (name) {
            var mod = this.mods[name];
            if (!mod) {
                throw new Error("No mod found under " + name);
            }
            if (mod.enabled) {
                return this.disableMod(name);
            }
            else {
                return this.enableMod(name);
            }
        };
        /**
         * Toggles any number of mods, given as any number of Strings or Arrays of
         * Strings.
         *
         * @param {...String} names
         */
        ModAttachr.prototype.toggleMods = function () {
            var names = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                names[_i - 0] = arguments[_i];
            }
            names.forEach(this.toggleMod.bind(this));
        };
        /* Actions
        */
        /**
         * Fires an event, which calls all functions listed undder mods for that
         * event. Any number of arguments may be given.
         *
         * @param {String} event   The name of the event to fire.
         */
        ModAttachr.prototype.fireEvent = function (event) {
            var extraArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                extraArgs[_i - 1] = arguments[_i];
            }
            var fires = this.events[event], args = Array.prototype.splice.call(arguments, 0), mod, i;
            // If no triggers were defined for this event, that's ok: just stop.
            if (!fires) {
                return;
            }
            for (i = 0; i < fires.length; i += 1) {
                mod = fires[i];
                args[0] = mod;
                if (mod.enabled) {
                    mod.events[event].apply(mod.scope, args);
                }
            }
        };
        /**
         * Fires an event specifically for one mod, rather than all mods containing
         * that event.
         *
         * @param {String} eventName   The name of the event to fire.
         * @param {String} modName   The name of the mod to fire the event.
         */
        ModAttachr.prototype.fireModEvent = function (eventName, modName) {
            var extraArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                extraArgs[_i - 2] = arguments[_i];
            }
            var mod = this.mods[modName], args = Array.prototype.slice.call(arguments, 2), fires;
            if (!mod) {
                throw new Error("Unknown mod requested: '" + modName + "'");
            }
            args[0] = mod;
            fires = mod.events[eventName];
            if (!fires) {
                throw new Error("Mod does not contain event: '" + eventName + "'");
            }
            return fires.apply(mod.scope, args);
        };
        return ModAttachr;
    })();
    ModAttachr_1.ModAttachr = ModAttachr;
})(ModAttachr || (ModAttachr = {}));
var NumberMakr;
(function (NumberMakr_1) {
    "use strict";
    /**
     * An updated version of the traditional MersenneTwister JavaScript class by
     * Sean McCullough (2010), based on code by Takuji Nishimura and Makoto
     * Matsumoto (1997 - 2002).
     *
     * For the 2010 code, see https://gist.github.com/banksean/300494.
     */
    /*
      I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
      so it's better encapsulated. Now you can have multiple random number generators
      and they won't stomp all over each other's state.
      
      If you want to use this as a substitute for Math.random(), use the random()
      method like so:
      
      var statePeriod = new MersenneTwister();
      var randomNumber = statePeriod.random();
      
      You can also call the other genrand_{foo}() methods on the instance.
    
      If you want to use a specific seed in order to get a repeatable random
      sequence, pass an integer into the constructor:
    
      var statePeriod = new MersenneTwister(123);
    
      and that will always produce the same random sequence.
    
      Sean McCullough (banksean@gmail.com)
    */
    /*
       A C-program for MT19937, with initialization improved 2002/1/26.
       Coded by Takuji Nishimura and Makoto Matsumoto.
     
       Before using, initialize the state by using init_genrand(seed)
       or init_by_array(keyInitial, keyLength).
     
       Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
       All rights reserved.
     
       Redistribution and use in source and binary forms, with or without
       modification, are permitted provided that the following conditions
       are met:
     
         1. Redistributions of source code must retain the above copyright
            notice, this list of conditions and the following disclaimer.
     
         2. Redistributions in binary form must reproduce the above copyright
            notice, this list of conditions and the following disclaimer in the
            documentation and/or other materials provided with the distribution.
     
         3. The names of its contributors may not be used to endorse or promote
            products derived from this software without specific prior written
            permission.
     
       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
       A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER
       OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
       EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
       PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
       PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
       LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
       NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
       SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     
       Any feedback is very welcome.
       http://www.math.sci.hiroshima-u.ac.jp/~statePeriod-mat/stateVector/emt.html
       email: statePeriod-mat @ math.sci.hiroshima-u.ac.jp (remove space)
    */
    var NumberMakr = (function () {
        /**
         * Resets the NumberMakr.
         *
         * @constructor
         * @param {Number/Array} [seed]   A starting seed used to initialize. This
         *                                can be a Number or Array; the appropriate
         *                                resetFrom Function will be called.
         * @param {Number} [stateLength]   How long the state vector will be.
         * @param {Number} [statePeriod]   How long the state period will be.
         * @param {Number} [matrixA]   A constant mask to generate the matrixAMagic
         *                             Array of [0, some number]
         * @param {Number} [maskUpper]   An upper mask to binary-and on (the most
         *                               significant w-r bits).
         * @param {Number} [maskLower]   A lower mask to binary-and on (the least
         *                               significant r bits).
         */
        function NumberMakr(settings) {
            if (settings === void 0) { settings = {}; }
            this.stateLength = settings.stateLength || 624;
            this.statePeriod = settings.statePeriod || 397;
            this.matrixA = settings.matrixA || 0x9908b0df;
            this.maskUpper = settings.maskUpper || 0x80000000;
            this.maskLower = settings.maskLower || 0x7fffffff;
            this.stateVector = new Array(this.stateLength);
            this.stateIndex = this.stateLength + 1;
            this.matrixAMagic = new Array(0x0, this.matrixA);
            this.resetFromSeed(settings.seed || new Date().getTime());
        }
        /* Simple gets
        */
        /**
         * @return {Mixed} The starting seed used to initialize.
         */
        NumberMakr.prototype.getSeed = function () {
            return this.seed;
        };
        /**
         * @return {Number} THe length of the state vector.
         */
        NumberMakr.prototype.getStateLength = function () {
            return this.stateLength;
        };
        /**
         * @return {Number} THe length of the state vector.
         */
        NumberMakr.prototype.getStatePeriod = function () {
            return this.statePeriod;
        };
        /**
         * @return {Number} THe length of the state vector.
         */
        NumberMakr.prototype.getMatrixA = function () {
            return this.matrixA;
        };
        /**
         * @return {Number} THe length of the state vector.
         */
        NumberMakr.prototype.getMaskUpper = function () {
            return this.maskUpper;
        };
        /**
         * @return {Number} THe length of the state vector.
         */
        NumberMakr.prototype.getMaskLower = function () {
            return this.maskLower;
        };
        /* Resets
        */
        /**
         * Initializes state from a Number.
         *
         * @param {Number} [seedNew]   Defaults to the previously set seed.
         */
        NumberMakr.prototype.resetFromSeed = function (seedNew) {
            if (seedNew === void 0) { seedNew = 0; }
            var s;
            this.stateVector[0] = seedNew >>> 0;
            for (this.stateIndex = 1; this.stateIndex < this.stateLength; this.stateIndex += 1) {
                s = this.stateVector[this.stateIndex - 1] ^ (this.stateVector[this.stateIndex - 1] >>> 30);
                this.stateVector[this.stateIndex] = ((((((s & 0xffff0000) >>> 16) * 1812433253) << 16)
                    + (s & 0x0000ffff) * 1812433253) + this.stateIndex) >>> 0;
            }
            this.seed = seedNew;
        };
        /**
         * Initializes state from an Array.
         *
         * @param {Number[]} keyInitial
         * @param {Number} [keyLength]   The length of keyInitial (defaults to the
         *                                actual keyInitial.length).
         * @remarks   There was a slight change for C++, 2004/2/26.
         */
        NumberMakr.prototype.resetFromArray = function (keyInitial, keyLength) {
            if (keyLength === void 0) { keyLength = keyInitial.length; }
            var i = 1, j = 0, k, s;
            this.resetFromSeed(19650218);
            if (typeof (keyLength) === "undefined") {
                keyLength = keyInitial.length;
            }
            k = this.stateLength > keyLength ? this.stateLength : keyLength;
            while (k > 0) {
                s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = (this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16)
                    + ((s & 0x0000ffff) * 1664525)) + keyInitial[j] + j) >>> 0;
                i += 1;
                j += 1;
                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }
                if (j >= keyLength) {
                    j = 0;
                }
            }
            for (k = this.stateLength - 1; k; k -= 1) {
                s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = ((this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16)
                    + (s & 0x0000ffff) * 1566083941)) - i) >>> 0;
                i += 1;
                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }
            }
            this.stateVector[0] = 0x80000000;
            this.seed = keyInitial;
        };
        /* Random number generation
        */
        /**
         * @return {Number} Random Number in [0,0xffffffff].
         */
        NumberMakr.prototype.randomInt32 = function () {
            var y, kk;
            if (this.stateIndex >= this.stateLength) {
                if (this.stateIndex === this.stateLength + 1) {
                    this.resetFromSeed(5489);
                }
                for (kk = 0; kk < this.stateLength - this.statePeriod; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                        | (this.stateVector[kk + 1] & this.maskLower);
                    this.stateVector[kk] = this.stateVector[kk + this.statePeriod]
                        ^ (y >>> 1)
                        ^ this.matrixAMagic[y & 0x1];
                }
                for (; kk < this.stateLength - 1; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                        | (this.stateVector[kk + 1] & this.maskLower);
                    this.stateVector[kk] = this.stateVector[kk + (this.statePeriod - this.stateLength)]
                        ^ (y >>> 1)
                        ^ this.matrixAMagic[y & 0x1];
                }
                y = (this.stateVector[this.stateLength - 1] & this.maskUpper)
                    | (this.stateVector[0] & this.maskLower);
                this.stateVector[this.stateLength - 1] = this.stateVector[this.statePeriod - 1]
                    ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];
                this.stateIndex = 0;
            }
            y = this.stateVector[this.stateIndex];
            this.stateIndex += 1;
            y ^= (y >>> 11);
            y ^= (y << 7) & 0x9d2c5680;
            y ^= (y << 15) & 0xefc60000;
            y ^= (y >>> 18);
            return y >>> 0;
        };
        /**
         * @return {Number} Random number in [0,1).
         * @remarks Divided by 2^32.
         */
        NumberMakr.prototype.random = function () {
            return this.randomInt32() * (1.0 / 4294967296.0);
        };
        /**
         * @return {Number} Random Number in [0,0x7fffffff].
         */
        NumberMakr.prototype.randomInt31 = function () {
            return this.randomInt32() >>> 1;
        };
        /* Real number generators (due to Isaku Wada, 2002/01/09)
        */
        /**
         * @return {Number} Random real Number in [0,1].
         * @remarks Divided by 2 ^ 32 - 1.
         */
        NumberMakr.prototype.randomReal1 = function () {
            return this.randomInt32() * (1.0 / 4294967295.0);
        };
        /**
         * @return {Number} Random real Number in (0,1).
         * @remarks Divided by 2 ^ 32.
         */
        NumberMakr.prototype.randomReal3 = function () {
            return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
        };
        /**
         * @return {Number} Random real Number in [0,1) with 53-bit resolution.
         */
        NumberMakr.prototype.randomReal53Bit = function () {
            var a = this.randomInt32() >>> 5, b = this.randomInt32() >>> 6;
            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        };
        /* Ranged Number generators
        */
        /**
         * @param {Number} max
         * @return {Number} Random Number in [0,max).
         */
        NumberMakr.prototype.randomUnder = function (max) {
            return this.random() * max;
        };
        /**
         * @param {Number} min
         * @param {Number} max
         * @return {Number} Random Number in [min,max).
         */
        NumberMakr.prototype.randomWithin = function (min, max) {
            return this.randomUnder(max - min) + min;
        };
        /* Ranged integer generators
        */
        /**
         * @param {Number} max
         * @return {Number} Random integer in [0,max).
         */
        NumberMakr.prototype.randomInt = function (max) {
            return this.randomUnder(max) | 0;
        };
        /**
         * @param {Number} min
         * @param {Number} max
         * @return {Number} Random integer in [min,max).
         */
        NumberMakr.prototype.randomIntWithin = function (min, max) {
            return (this.randomUnder(max - min) + min) | 0;
        };
        /**
         * @return {Boolean} Either true or false, with 50% probability of each.
         */
        NumberMakr.prototype.randomBoolean = function () {
            return this.randomInt(2) === 1;
        };
        /**
         * @param {Number} probability   How likely the returned Boolean will be
         *                               true, in [0, 1]. Greater than 1 is counted
         *                               as 1.
         *
         * @return {Boolean} Either true or false, with the probability of true
         *                   equal to the given probability.
         */
        NumberMakr.prototype.randomBooleanProbability = function (probability) {
            return this.random() < probability;
        };
        /**
         * @param {Number} numerator   The numerator of a fraction.
         * @param {Number} denominator   The denominator of a fraction.
         * @return {Boolean} Either true or false, with a probability equal to the
         *                   given fraction.
         */
        NumberMakr.prototype.randomBooleanFraction = function (numerator, denominator) {
            return this.random() <= (numerator / denominator);
        };
        /**
         * @param {Array} array
         * @return {Number} A random index, from 0 to the given Array's length
         */
        NumberMakr.prototype.randomArrayIndex = function (array) {
            return this.randomIntWithin(0, array.length);
        };
        /**
         * @param {Array} array
         * @return {Mixed} A random element from within the given Array.
         */
        NumberMakr.prototype.randomArrayMember = function (array) {
            return array[this.randomArrayIndex(array)];
        };
        return NumberMakr;
    })();
    NumberMakr_1.NumberMakr = NumberMakr;
})(NumberMakr || (NumberMakr = {}));
var ScenePlayr;
(function (ScenePlayr_1) {
    "use strict";
    var ScenePlayr = (function () {
        /**
         * @param {IScenePlayrSettings} [settings]
         */
        function ScenePlayr(settings) {
            if (settings === void 0) { settings = {}; }
            this.cutscenes = settings.cutscenes || {};
            this.cutsceneArguments = settings.cutsceneArguments || [];
        }
        /* Simple gets
        */
        /**
         * @return {Object} The complete listing of cutscenes that may be played.
         */
        ScenePlayr.prototype.getCutscenes = function () {
            return this.cutscenes;
        };
        /**
         * @return {Object} The currently playing cutscene.
         */
        ScenePlayr.prototype.getCutscene = function () {
            return this.cutscene;
        };
        /**
         * @return {Object} The cutscene referred to by the given name.
         */
        ScenePlayr.prototype.getOtherCutscene = function (name) {
            return this.cutscenes[name];
        };
        /**
         * @return {Function} The currently playing routine.
         */
        ScenePlayr.prototype.getRoutine = function () {
            return this.routine;
        };
        /**
         * @return {Function} The routine within the current cutscene referred to
         *                    by the given name.
         */
        ScenePlayr.prototype.getOtherRoutine = function (name) {
            return this.cutscene.routines[name];
        };
        /**
         * @return {String} The name of the currently playing cutscene.
         */
        ScenePlayr.prototype.getCutsceneName = function () {
            return this.cutsceneName;
        };
        /**
         * @return {Object} The settings used by the current cutscene.
         */
        ScenePlayr.prototype.getCutsceneSettings = function () {
            return this.cutsceneSettings;
        };
        /* Playback
        */
        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Object} [settings]   Additional settings to be kept as a
         *                              persistent Object throughout the cutscene.
         */
        ScenePlayr.prototype.startCutscene = function (name, settings) {
            if (settings === void 0) { settings = {}; }
            if (!name) {
                throw new Error("No name given to ScenePlayr.playScene.");
            }
            if (this.cutsceneName) {
                this.stopCutscene();
            }
            this.cutscene = this.cutscenes[name];
            this.cutsceneName = name;
            this.cutsceneSettings = settings || {};
            this.cutsceneSettings.cutscene = this.cutscene;
            this.cutsceneSettings.cutsceneName = name;
            this.cutsceneArguments.unshift(this.cutsceneSettings);
            if (this.cutscene.firstRoutine) {
                this.playRoutine(this.cutscene.firstRoutine);
            }
        };
        /**
         * Returns this.startCutscene bound to the given name and settings.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Additional settings to be kept as a
         *                            persistent Object throughout the cutscene.
         */
        ScenePlayr.prototype.bindCutscene = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.startCutscene.bind(self, name, args);
        };
        /**
         * Stops the currently playing cutscene, clearing the internal data.
         */
        ScenePlayr.prototype.stopCutscene = function () {
            this.cutscene = undefined;
            this.cutsceneName = undefined;
            this.cutsceneSettings = undefined;
            this.routine = undefined;
            this.cutsceneArguments.shift();
        };
        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         *
         * @param {String} name   The name of the routine to play.
         * @param {Array} ...args   Any additional arguments to pass to the routine.
         */
        ScenePlayr.prototype.playRoutine = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.cutscene) {
                throw new Error("No cutscene is currently playing.");
            }
            if (!this.cutscene.routines[name]) {
                throw new Error("The " + this.cutsceneName + " cutscene does not contain a " + name + " routine.");
            }
            this.routine = this.cutscene.routines[name];
            this.cutsceneSettings.routine = this.routine;
            this.cutsceneSettings.routineName = name;
            this.cutsceneSettings.routineArguments = args;
            this.routine.apply(this, this.cutsceneArguments);
        };
        /**
         *
         * Returns this.startCutscene bound to the given name and arguments.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Any additional arguments to pass to the routine.
         */
        ScenePlayr.prototype.bindRoutine = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.playRoutine.bind(this, name, args);
        };
        return ScenePlayr;
    })();
    ScenePlayr_1.ScenePlayr = ScenePlayr;
})(ScenePlayr || (ScenePlayr = {}));
/// <reference path="QuadsKeepr-0.2.1.ts" />
var ThingHittr;
(function (ThingHittr_1) {
    "use strict";
    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     * Things contained in the GroupHoldr's groups have automated collision checking
     * against configurable sets of other groups, along with performance
     * optimizations to help reduce over-reoptimization of Functions.
     */
    var ThingHittr = (function () {
        /**
         * @param {IThingHittrSettings} settings
         */
        function ThingHittr(settings) {
            this.globalCheckGenerators = settings.globalCheckGenerators;
            this.hitCheckGenerators = settings.hitCheckGenerators;
            this.hitFunctionGenerators = settings.hitFunctionGenerators;
            this.groupNames = settings.groupNames;
            this.keyNumQuads = settings.keyNumQuads || "numquads";
            this.keyQuadrants = settings.keyQuadrants || "quadrants";
            this.keyGroupName = settings.keyGroupName || "group";
            this.hitChecks = {};
            this.globalChecks = {};
            this.hitFunctions = {};
            this.cachedGroupNames = {};
            this.cachedTypeNames = {};
            this.checkHitsOf = {};
        }
        /* Runtime preparation
        */
        /**
         * Caches the hit checks for a group name. The global check for that group
         * is cached on the name for later use.
         *
         * @param {String} groupName   The name of the container group.
         */
        ThingHittr.prototype.cacheHitCheckGroup = function (groupName) {
            if (this.cachedGroupNames[groupName]) {
                return;
            }
            this.cachedGroupNames[groupName] = true;
            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[groupName] = this.cacheGlobalCheck(groupName);
            }
        };
        /**
         * Caches the hit checks for a specific type within a group, which involves
         * caching the group's global checker, the hit checkers for each of the
         * type's allowed collision groups, and the hit callbacks for each of those
         * groups.
         * The result is that you can call this.checkHitsOf[typeName] later on, and
         * expect it to work as anything in groupName.
         *
         * @param {String} typeName   The type of the Things to cache for.
         * @param {String} groupName   The name of the container group.
         */
        ThingHittr.prototype.cacheHitCheckType = function (typeName, groupName) {
            if (this.cachedTypeNames[typeName]) {
                return;
            }
            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[typeName] = this.cacheGlobalCheck(groupName);
            }
            if (typeof this.hitCheckGenerators[groupName] !== "undefined") {
                this.hitChecks[typeName] = this.cacheFunctionGroup(this.hitCheckGenerators[groupName]);
            }
            if (typeof this.hitFunctionGenerators[groupName] !== "undefined") {
                this.hitFunctions[typeName] = this.cacheFunctionGroup(this.hitFunctionGenerators[groupName]);
            }
            this.cachedTypeNames[typeName] = true;
            this.checkHitsOf[typeName] = this.generateHitsCheck(typeName).bind(this);
        };
        /**
         * Function generator for a checkHitsOf tailored to a specific Thing type.
         *
         * @param {String} typeName   The type of the Things to generate for.
         * @return {Function}
         */
        ThingHittr.prototype.generateHitsCheck = function (typeName) {
            /**
             * Collision detection Function for a Thing. For each Quadrant the Thing
             * is in, for all groups within that Function that the Thing's type is
             * allowed to collide with, it is checked for collision with the Things
             * in that group. For each Thing it does collide with, the appropriate
             * hit Function is called.
             *
             * @param {Thing} thing
             */
            return function checkHitsOf(thing) {
                var others, other, hitCheck, i, j, k;
                // Don't do anything if the thing shouldn't be checking
                if (typeof this.globalChecks[this.typeName] !== "undefined" && !this.globalChecks[this.typeName](thing)) {
                    return;
                }
                // For each quadrant this is in, look at that quadrant's groups
                for (i = 0; i < thing[this.keyNumQuads]; i += 1) {
                    for (j = 0; j < this.groupNames.length; j += 1) {
                        hitCheck = this.hitChecks[typeName][this.groupNames[j]];
                        // If no hit check exists for this combo, don't bother
                        if (!hitCheck) {
                            continue;
                        }
                        others = thing[this.keyQuadrants][i].things[this.groupNames[j]];
                        // For each other Thing in this group that should be checked...
                        for (k = 0; k < others.length; k += 1) {
                            other = others[k];
                            // If they are the same, breaking prevents double hits
                            if (thing === other) {
                                break;
                            }
                            // Do nothing if these two shouldn't be colliding
                            if (typeof this.globalChecks[other[this.keyGroupName]] !== "undefined"
                                && !this.globalChecks[other[this.keyGroupName]](other)) {
                                continue;
                            }
                            // If they do hit, call the corresponding hitFunction
                            if (hitCheck(thing, other)) {
                                this.hitFunctions[typeName][other[this.keyGroupName]](thing, other);
                            }
                        }
                    }
                }
            };
        };
        /**
         * Manually checks whether two Things are touching.
         *
         * @param {Thing} thing
         * @param {Thing} other
         * @param {String} thingType   The individual type of thing.
         * @param {Thing} otherGroup   The individual group of other.
         * @return {Boolean} The result of the hit function defined for thing's
         *                   type and other's group, which should be whether they're
         *                   touching.
         */
        ThingHittr.prototype.checkHit = function (thing, other, thingType, otherGroup) {
            var checks = this.hitChecks[thingType], check;
            if (!checks) {
                throw new Error("No hit checks defined for " + thingType + ".");
            }
            check = checks[otherGroup];
            if (!check) {
                throw new Error("No hit check defined for " + thingType + " and " + otherGroup + ".");
            }
            return check(thing, other);
        };
        /**
         * Caches a global check for a group by returning a result Function from the
         * global check generator.
         *
         * @param {String} groupName
         * @return {Function}
         */
        ThingHittr.prototype.cacheGlobalCheck = function (groupName) {
            return this.globalCheckGenerators[groupName]();
        };
        /**
         * Creates a set of cached Objects for when a group of Functions must be
         * generated, rather than a single one.
         *
         * @param {Object<Function>} functions   The container for the Functions
         *                                       to be cached.
         * @return {Object<Function>}
         */
        ThingHittr.prototype.cacheFunctionGroup = function (functions) {
            var output = {}, i;
            for (i in functions) {
                if (functions.hasOwnProperty(i)) {
                    output[i] = functions[i]();
                }
            }
            return output;
        };
        return ThingHittr;
    })();
    ThingHittr_1.ThingHittr = ThingHittr;
})(ThingHittr || (ThingHittr = {}));
/// <reference path="InputWritr-0.2.0.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TouchPassr;
(function (TouchPassr_1) {
    "use strict";
    /**
     * Abstract class for on-screen controls. Element creation for .element
     * and .elementInner within the constrained position is provided.
     */
    var Control = (function () {
        /**
         * Resets the control by setting member variables and calling resetElement.
         *
         * @param {InputWritr} InputWriter
         * @param {Object} schema
         */
        function Control(InputWriter, schema, styles) {
            this.InputWriter = InputWriter;
            this.schema = schema;
            this.resetElement(styles);
        }
        /**
         * @return {HTMLElement} The outer container element.
         */
        Control.prototype.getElement = function () {
            return this.element;
        };
        /**
         * @return {HTMLElement} The inner container element.
         */
        Control.prototype.getElementInner = function () {
            return this.elementInner;
        };
        /**
         * Creates and returns an HTMLElement of the specified type. Any additional
         * settings Objects may be given to be proliferated onto the Element via
         * proliferateElement.
         *
         * @param {String} type   The tag of the Element to be created.
         * @param {Object} [settings]   Additional settings for the Element, such as
         *                              className or style.
         * @return {HTMLElement}
         */
        Control.prototype.createElement = function (tag) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var element = document.createElement(tag || "div"), i;
            // For each provided object, add those settings to the element
            for (i = 1; i < arguments.length; i += 1) {
                this.proliferateElement(element, arguments[i]);
            }
            return element;
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
        Control.prototype.proliferateElement = function (recipient, donor, noOverride) {
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
                            this.proliferateElement(recipient[i], setting);
                            break;
                        // By default, use the normal proliferate logic
                        default:
                            // If it's null, don't do anything (like .textContent)
                            if (setting === null) {
                                recipient[i] = null;
                            }
                            else if (typeof setting === "object") {
                                // If it's an object, recurse on a new version of it
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferateElement(recipient[i], setting, noOverride);
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
         * Resets the container elements. In any inherited resetElement, this should
         * still be called, as it implements the schema's position.
         *
         * @param {Object} styles   Container styles for the contained elements.
         */
        Control.prototype.resetElement = function (styles, customType) {
            var position = this.schema.position, offset = position.offset;
            this.element = this.createElement("div", {
                "className": "control",
                "style": {
                    "position": "absolute",
                    "width": 0,
                    "height": 0,
                    "boxSizing": "border-box",
                    "opacity": ".84"
                }
            });
            this.elementInner = this.createElement("div", {
                "className": "control-inner",
                "textContent": this.schema.label,
                "style": {
                    "position": "absolute",
                    "boxSizing": "border-box",
                    "textAlign": "center"
                }
            });
            this.element.appendChild(this.elementInner);
            if (position.horizontal === "left") {
                this.element.style.left = "0";
            }
            else if (position.horizontal === "right") {
                this.element.style.right = "0";
            }
            else if (position.horizontal === "center") {
                this.element.style.left = "50%";
            }
            if (position.vertical === "top") {
                this.element.style.top = "0";
            }
            else if (position.vertical === "bottom") {
                this.element.style.bottom = "0";
            }
            else if (position.vertical === "center") {
                this.element.style.top = "50%";
            }
            this.passElementStyles(styles.global);
            this.passElementStyles(styles[customType]);
            this.passElementStyles(this.schema.styles);
            if (offset.left) {
                this.elementInner.style.marginLeft = this.createPixelMeasurement(offset.left);
            }
            if (offset.top) {
                this.elementInner.style.marginTop = this.createPixelMeasurement(offset.top);
            }
            // elementInner's center-based positioning must wait until its total width is done setting
            setTimeout(function () {
                if (position.horizontal === "center") {
                    this.elementInner.style.left = Math.round(this.elementInner.offsetWidth / -2) + "px";
                }
                if (position.vertical === "center") {
                    this.elementInner.style.top = Math.round(this.elementInner.offsetHeight / -2) + "px";
                }
            }.bind(this));
        };
        /**
         * Converts a String or Number into a CSS-ready String measurement.
         *
         * @param {Mixed} raw   A raw measurement, such as "7" or "7px" or "7em".
         * @return {String} The raw measurement as a CSS measurement.
         */
        Control.prototype.createPixelMeasurement = function (raw) {
            if (!raw) {
                return "0";
            }
            if (typeof raw === "number" || raw.constructor === Number) {
                return raw + "px";
            }
            return raw;
        };
        /**
         * Passes a style schema to .element and .elementInner.
         *
         * @param {Object} styles   A container for styles to apply.
         */
        Control.prototype.passElementStyles = function (styles) {
            if (!styles) {
                return;
            }
            if (styles.element) {
                this.proliferateElement(this.element, styles.element);
            }
            if (styles.elementInner) {
                this.proliferateElement(this.elementInner, styles.elementInner);
            }
        };
        /**
         * Sets the rotation of an HTML element via CSS.
         *
         * @param {HTMLElement} element
         * @param {Number} rotation
         */
        Control.prototype.setRotation = function (element, rotation) {
            element.style.transform = "rotate(" + rotation + "deg)";
        };
        /**
         * Finds the position offset of an element relative to the page, factoring in
         * its parent elements' offsets recursively.
         *
         * @param {HTMLElement} element
         * @return {Number[]} The left and top offset of the element, in px.
         */
        Control.prototype.getOffsets = function (element) {
            var output;
            if (element.offsetParent && element !== element.offsetParent) {
                output = this.getOffsets(element.offsetParent);
                output[0] += element.offsetLeft;
                output[1] += element.offsetTop;
            }
            else {
                output = [element.offsetLeft, element.offsetTop];
            }
            return output;
        };
        return Control;
    })();
    TouchPassr_1.Control = Control;
    /**
     * Simple button control. It activates its triggers when the users presses
     * it or releases it, and contains a simple label.
     */
    var ButtonControl = (function (_super) {
        __extends(ButtonControl, _super);
        function ButtonControl() {
            _super.apply(this, arguments);
        }
        /**
         * Resets the elements by adding listeners for mouse and touch
         * activation and deactivation events.
         *
         * @param {Object} styles   Container styles for the contained elements.
         */
        ButtonControl.prototype.resetElement = function (styles) {
            var onActivated = this.onEvent.bind(this, "activated"), onDeactivated = this.onEvent.bind(this, "deactivated");
            _super.prototype.resetElement.call(this, styles, "Button");
            this.element.addEventListener("mousedown", onActivated);
            this.element.addEventListener("touchstart", onActivated);
            this.element.addEventListener("mouseup", onDeactivated);
            this.element.addEventListener("touchend", onDeactivated);
        };
        /**
         * Reation callback for a triggered event.
         *
         * @param {String} which   The pipe being activated, such as
         *                         "activated" or "deactivated".
         * @param {Event} event
         */
        ButtonControl.prototype.onEvent = function (which, event) {
            var events = this.schema.pipes[which], i, j;
            if (!events) {
                return;
            }
            for (i in events) {
                if (!events.hasOwnProperty(i)) {
                    continue;
                }
                for (j = 0; j < events[i].length; j += 1) {
                    this.InputWriter.callEvent(i, events[i][j], event);
                }
            }
        };
        return ButtonControl;
    })(Control);
    TouchPassr_1.ButtonControl = ButtonControl;
    /**
     * Joystick control. An inner circle can be dragged to one of a number
     * of directions to trigger pipes on and off.
     */
    var JoystickControl = (function (_super) {
        __extends(JoystickControl, _super);
        function JoystickControl() {
            _super.apply(this, arguments);
        }
        /**
         * Resets the element by creating a tick for each direction, along with
         * the multiple circular elements with their triggers.
         *
         * @param {Object} styles   Container styles for the contained elements.
         */
        JoystickControl.prototype.resetElement = function (styles) {
            _super.prototype.resetElement.call(this, styles, "Joystick");
            var directions = this.schema.directions, element, degrees, sin, cos, dx, dy, i;
            this.proliferateElement(this.elementInner, {
                "style": {
                    "border-radius": "100%"
                }
            });
            // The visible circle is what is actually visible to the user
            this.elementCircle = this.createElement("div", {
                "className": "control-inner control-joystick-circle",
                "style": {
                    "position": "absolute",
                    "background": "red",
                    "borderRadius": "100%"
                }
            });
            this.proliferateElement(this.elementCircle, styles.Joystick.circle);
            // Each direction creates a "tick" element, like on a clock
            for (i = 0; i < directions.length; i += 1) {
                degrees = directions[i].degrees;
                // sin and cos are an amount / 1 the tick is offset from the center
                sin = Math.sin(degrees * Math.PI / 180);
                cos = Math.cos(degrees * Math.PI / 180);
                // dx and dy are measured as percent from the center, based on sin & cos
                dx = cos * 50 + 50;
                dy = sin * 50 + 50;
                element = this.createElement("div", {
                    "className": "control-joystick-tick",
                    "style": {
                        "position": "absolute",
                        "left": dx + "%",
                        "top": dy + "%",
                        "marginLeft": (-cos * 5 - 5) + "px",
                        "marginTop": (-sin * 2 - 1) + "px"
                    }
                });
                this.proliferateElement(element, styles.Joystick.tick);
                this.setRotation(element, degrees);
                this.elementCircle.appendChild(element);
            }
            // In addition to the ticks, a drag element shows current direction
            this.elementDragLine = this.createElement("div", {
                "className": "control-joystick-drag-line",
                "style": {
                    "position": "absolute",
                    "opacity": "0",
                    "top": ".77cm",
                    "left": ".77cm"
                }
            });
            this.proliferateElement(this.elementDragLine, styles.Joystick.dragLine);
            this.elementCircle.appendChild(this.elementDragLine);
            // A shadow-like circle supports the drag effect
            this.elementDragShadow = this.createElement("div", {
                "className": "control-joystick-drag-shadow",
                "style": {
                    "position": "absolute",
                    "opacity": "1",
                    "top": "14%",
                    "right": "14%",
                    "bottom": "14%",
                    "left": "14%",
                    "marginLeft": "0",
                    "marginTop": "0",
                    "borderRadius": "100%"
                }
            });
            this.proliferateElement(this.elementDragShadow, styles.Joystick.dragShadow);
            this.elementCircle.appendChild(this.elementDragShadow);
            this.elementInner.appendChild(this.elementCircle);
            this.elementInner.addEventListener("click", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("touchmove", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("mousemove", this.triggerDragger.bind(this));
            this.elementInner.addEventListener("mouseover", this.positionDraggerEnable.bind(this));
            this.elementInner.addEventListener("touchstart", this.positionDraggerEnable.bind(this));
            this.elementInner.addEventListener("mouseout", this.positionDraggerDisable.bind(this));
            this.elementInner.addEventListener("touchend", this.positionDraggerDisable.bind(this));
        };
        /**
         * Enables dragging, showing the elementDragLine.
         */
        JoystickControl.prototype.positionDraggerEnable = function () {
            this.dragEnabled = true;
            this.elementDragLine.style.opacity = "1";
        };
        /**
         * Disables dragging, hiding the drag line and re-centering the
         * inner circle shadow.
         */
        JoystickControl.prototype.positionDraggerDisable = function () {
            this.dragEnabled = false;
            this.elementDragLine.style.opacity = "0";
            this.elementDragShadow.style.top = "14%";
            this.elementDragShadow.style.right = "14%";
            this.elementDragShadow.style.bottom = "14%";
            this.elementDragShadow.style.left = "14%";
            if (this.currentDirection) {
                if (this.currentDirection.pipes && this.currentDirection.pipes.deactivated) {
                    this.onEvent(this.currentDirection.pipes.deactivated, event);
                }
                this.currentDirection = undefined;
            }
        };
        /**
         * Triggers a movement point for the joystick, and snaps the stick to
         * the nearest direction (based on the angle from the center to the point).
         *
         * @param {Event} event
         */
        JoystickControl.prototype.triggerDragger = function (event) {
            event.preventDefault();
            if (!this.dragEnabled) {
                return;
            }
            var coordinates = this.getEventCoordinates(event), x = coordinates[0], y = coordinates[1], offsets = this.getOffsets(this.elementInner), midX = offsets[0] + this.elementInner.offsetWidth / 2, midY = offsets[1] + this.elementInner.offsetHeight / 2, dxRaw = (x - midX) | 0, dyRaw = (midY - y) | 0, thetaRaw = this.getThetaRaw(dxRaw, dyRaw), directionNumber = this.findClosestDirection(thetaRaw), direction = this.schema.directions[directionNumber], theta = direction.degrees, components = this.getThetaComponents(theta), dx = components[0], dy = -components[1];
            this.proliferateElement(this.elementDragLine, {
                "style": {
                    "marginLeft": ((dx * 77) | 0) + "%",
                    "marginTop": ((dy * 77) | 0) + "%"
                }
            });
            this.proliferateElement(this.elementDragShadow, {
                "style": {
                    "top": ((14 + dy * 10) | 0) + "%",
                    "right": ((14 - dx * 10) | 0) + "%",
                    "bottom": ((14 - dy * 10) | 0) + "%",
                    "left": ((14 + dx * 10) | 0) + "%"
                }
            });
            // Ensure theta is above 0, and offset it by 90 for visual rotation
            theta = (theta + 450) % 360;
            this.setRotation(this.elementDragLine, theta);
            this.positionDraggerEnable();
            this.setCurrentDirection(direction, event);
        };
        /**
         * Finds the raw coordinates of an event, whether it's a drag (touch)
         * or mouse event.
         *
         * @return {Number[]} The x- and y- coordinates of the event.
         */
        JoystickControl.prototype.getEventCoordinates = function (event) {
            if (event.type === "touchmove") {
                // TypeScript 1.5 doesn't seem to have TouchEvent yet.
                var touch = event.touches[0];
                return [touch.pageX, touch.pageY];
            }
            return [event.x, event.y];
        };
        /**
         * Finds the angle from a joystick center to an x and y. This assumes
         * straight up is 0, to the right is 90, down is 180, and left is 270.
         *
         * @return {Number} The degrees to the given point.
         */
        JoystickControl.prototype.getThetaRaw = function (dxRaw, dyRaw) {
            // Based on the quadrant, theta changes...
            if (dxRaw > 0) {
                if (dyRaw > 0) {
                    // Quadrant I
                    return Math.atan(dxRaw / dyRaw) * 180 / Math.PI;
                }
                else {
                    // Quadrant II
                    return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 90;
                }
            }
            else {
                if (dyRaw < 0) {
                    // Quadrant III
                    return Math.atan(dxRaw / dyRaw) * 180 / Math.PI + 180;
                }
                else {
                    // Quadrant IV
                    return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 270;
                }
            }
        };
        /**
         * Converts an angle to its relative dx and dy coordinates.
         *
         * @param {Number} thetaRaw
         * @return {Number[]} The x- and y- parts of an angle.
         */
        JoystickControl.prototype.getThetaComponents = function (thetaRaw) {
            var theta = thetaRaw * Math.PI / 180;
            return [Math.sin(theta), Math.cos(theta)];
        };
        /**
         * Finds the index of the closest direction to an angle.
         *
         * @param {Number} degrees
         * @return {Number}
         */
        JoystickControl.prototype.findClosestDirection = function (degrees) {
            var directions = this.schema.directions, difference = Math.abs(directions[0].degrees - degrees), smallestDegrees = directions[0].degrees, smallestDegreesRecord = 0, record = 0, differenceTest, i;
            // Find the direction with the smallest difference in degrees
            for (i = 1; i < directions.length; i += 1) {
                differenceTest = Math.abs(directions[i].degrees - degrees);
                if (differenceTest < difference) {
                    difference = differenceTest;
                    record = i;
                }
                if (directions[i].degrees < smallestDegrees) {
                    smallestDegrees = directions[i].degrees;
                    smallestDegreesRecord = i;
                }
            }
            // 359 is closer to 360 than 0, so pretend the smallest is above 360
            differenceTest = Math.abs(smallestDegrees + 360 - degrees);
            if (differenceTest < difference) {
                difference = differenceTest;
                record = smallestDegreesRecord;
            }
            return record;
        };
        /**
         * Sets the current direction of the joystick, calling the relevant
         * InputWriter pipes if necessary.
         *
         * @param {Object} direction
         * @param {Event} [event]
         */
        JoystickControl.prototype.setCurrentDirection = function (direction, event) {
            if (this.currentDirection === direction) {
                return;
            }
            if (this.currentDirection && this.currentDirection.pipes) {
                if (this.currentDirection.pipes.deactivated) {
                    this.onEvent(this.currentDirection.pipes.deactivated, event);
                }
            }
            if (direction.pipes && direction.pipes.activated) {
                this.onEvent(direction.pipes.activated, event);
            }
            this.currentDirection = direction;
        };
        /**
         * Trigger for calling pipes when a new direction is set. All children
         * of the pipe has each of its keys triggered.
         *
         * @param {Object} pipes
         * @param {Event} [event]
         */
        JoystickControl.prototype.onEvent = function (pipes, event) {
            var i, j;
            for (i in pipes) {
                if (!pipes.hasOwnProperty(i)) {
                    continue;
                }
                for (j = 0; j < pipes[i].length; j += 1) {
                    this.InputWriter.callEvent(i, pipes[i][j], event);
                }
            }
        };
        return JoystickControl;
    })(Control);
    TouchPassr_1.JoystickControl = JoystickControl;
    /**
     *
     */
    var TouchPassr = (function () {
        /**
         * @param {ITouchPassrSettings} settings
         */
        function TouchPassr(settings) {
            this.InputWriter = settings.InputWriter;
            this.styles = settings.styles || {};
            this.resetContainer(settings.container);
            this.controls = {};
            if (settings.controls) {
                this.addControls(settings.controls);
            }
            if (typeof settings.enabled === "undefined") {
                this.enabled = true;
            }
            else {
                this.enabled = settings.enabled;
            }
            this.enabled ? this.enable() : this.disable();
        }
        /* Simple gets
        */
        /**
         * @return {InputWritr} The InputWritr for controls to pipe event triggers to.
         */
        TouchPassr.prototype.getInputWriter = function () {
            return this.InputWriter;
        };
        /**
         * @return {Boolean} Whether this is currently enabled and visually on the screen.
         */
        TouchPassr.prototype.getEnabled = function () {
            return this.enabled;
        };
        /**
         * @return {Object} The root container for styles to be added to control elements.
         */
        TouchPassr.prototype.getStyles = function () {
            return this.styles;
        };
        /**
         * @return {Object} The container for generated controls, keyed by their name.
         */
        TouchPassr.prototype.getControls = function () {
            return this.controls;
        };
        /**
         * @return {HTMLElement} The HTMLElement all controls are placed within.
         */
        TouchPassr.prototype.getContainer = function () {
            return this.container;
        };
        /**
         * @return {HTMLElement} The HTMLElement containing the controls container.
         */
        TouchPassr.prototype.getParentContainer = function () {
            return this.parentContainer;
        };
        /* Core functionality
        */
        /**
         * Enables the TouchPassr by showing the container.
         */
        TouchPassr.prototype.enable = function () {
            this.enabled = true;
            this.container.style.display = "block";
        };
        /**
         * Disables the TouchPassr by hiding the container.
         */
        TouchPassr.prototype.disable = function () {
            this.enabled = false;
            this.container.style.display = "none";
        };
        /**
         * Sets the parent container surrounding the controls container.
         *
         * @param {HTMLElement} parentElement
         */
        TouchPassr.prototype.setParentContainer = function (parentElement) {
            this.parentContainer = parentElement;
            this.parentContainer.appendChild(this.container);
        };
        /**
         * Adds any number of controls to the internal listing and HTML container.
         *
         * @param {Object} schemas   Schemas for new controls to be made, keyed by name.
         */
        TouchPassr.prototype.addControls = function (schemas) {
            var i;
            for (i in schemas) {
                if (schemas.hasOwnProperty(i)) {
                    this.addControl(schemas[i]);
                }
            }
        };
        /**
         * Adds a control to the internal listing and HTML container.
         *
         * @param {Object} schema   The schema for the new control to be made.
         */
        TouchPassr.prototype.addControl = function (schema) {
            var control;
            switch (schema.control) {
                case "Button":
                    control = new ButtonControl(this.InputWriter, schema, this.styles);
                    break;
                case "Joystick":
                    control = new JoystickControl(this.InputWriter, schema, this.styles);
                    break;
                default:
                    break;
            }
            this.controls[schema.name] = control;
            this.container.appendChild(control.getElement());
        };
        /* HTML manipulations
        */
        /**
         * Resets the base controls container. If a parent element is provided,
         * the container is added to it.
         *
         * @param {HTMLElement} [parentContainer]   A container element, such as
         *                                          from GameStartr.
         */
        TouchPassr.prototype.resetContainer = function (parentContainer) {
            this.container = Control.prototype.createElement("div", {
                "className": "touch-passer-container",
                "style": {
                    "position": "absolute",
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                }
            });
            if (parentContainer) {
                this.setParentContainer(parentContainer);
            }
        };
        return TouchPassr;
    })();
    TouchPassr_1.TouchPassr = TouchPassr;
})(TouchPassr || (TouchPassr = {}));
/// <reference path="GamesRunnr-0.2.0.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="LevelEditr-0.2.0.ts" />
var UserWrappr;
(function (UserWrappr_1) {
    "use strict";
    /**
     * A user interface manager made to work on top of GameStartr implementations
     * and provide a configurable HTML display of options.
     */
    var UserWrappr = (function () {
        /**
         * @param {IUserWrapprSettings} settings
         */
        function UserWrappr(settings) {
            /**
             * The document element that will contain the game.
             */
            this.documentElement = document.documentElement;
            /**
             * A browser-dependent method for request to enter full screen mode.
             */
            this.requestFullScreen = (this.documentElement.requestFullScreen
                || this.documentElement.webkitRequestFullScreen
                || this.documentElement.mozRequestFullScreen
                || this.documentElement.msRequestFullscreen
                || function () {
                    console.warn("Not able to request full screen...");
                }).bind(this.documentElement);
            /**
             * A browser-dependent method for request to exit full screen mode.
             */
            this.cancelFullScreen = (this.documentElement.cancelFullScreen
                || this.documentElement.webkitCancelFullScreen
                || this.documentElement.mozCancelFullScreen
                || this.documentElement.msCancelFullScreen
                || function () {
                    console.warn("Not able to cancel full screen...");
                }).bind(document);
            this.customs = settings.customs || {};
            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.settings = settings;
            this.helpSettings = this.settings.helpSettings;
            this.globalName = settings.globalName;
            this.importSizes(settings.sizes);
            this.gameNameAlias = this.helpSettings.globalNameAlias || "{%%%%GAME%%%%}";
            this.gameElementSelector = settings.gameElementSelector || "#game";
            this.gameControlsSelector = settings.gameControlsSelector || "#controls";
            this.log = settings.log || console.log.bind(console);
            this.isFullScreen = false;
            this.setCurrentSize(this.sizes[settings.sizeDefault]);
            this.allPossibleKeys = settings.allPossibleKeys || [
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "up", "right", "down", "left", "space", "shift", "ctrl"
            ];
            // Size information is also passed to modules via this.customs
            this.GameStartrConstructor.prototype.proliferate(this.customs, this.currentSize, true);
            this.resetGameStarter(settings, this.customs);
        }
        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         *
         * @param {IUserWrapprSettings} settings
         * @param {IGameStartrCustoms} customs
         */
        UserWrappr.prototype.resetGameStarter = function (settings, customs) {
            if (customs === void 0) { customs = {}; }
            this.loadGameStarter(this.fixCustoms(customs || {}));
            window[settings.globalName || "GameStarter"] = this.GameStarter;
            this.GameStarter.UserWrapper = this;
            this.loadGenerators();
            this.loadControls(settings.schemas);
            if (settings.styleSheet) {
                this.GameStarter.addPageStyles(settings.styleSheet);
            }
            this.resetPageVisibilityHandlers();
            this.GameStarter.gameStart();
        };
        /* Simple gets
        */
        /**
         * @return {IGameStartrConstructor} The GameStartr implementation this
         *                                  is wrapping around.
         */
        UserWrappr.prototype.getGameStartrConstructor = function () {
            return this.GameStartrConstructor;
        };
        /**
         * @return {GameStartr} The GameStartr instance created by GameStartrConstructor
         *                      and stored under window.
         */
        UserWrappr.prototype.getGameStarter = function () {
            return this.GameStarter;
        };
        /**
         * @return {ItemsHoldr} The ItemsHoldr used to store UI settings.
         */
        UserWrappr.prototype.getItemsHolder = function () {
            return this.ItemsHolder;
        };
        /**
         * @return {Object} The settings used to construct this UserWrappr.
         */
        UserWrappr.prototype.getSettings = function () {
            return this.settings;
        };
        /**
         * @return {Object} The customs used to construct the GameStartr.
         */
        UserWrappr.prototype.getCustoms = function () {
            return this.customs;
        };
        /**
         * @return {Object} The help settings from settings.helpSettings.
         */
        UserWrappr.prototype.getHelpSettings = function () {
            return this.helpSettings;
        };
        /**
         * @return {String} What the global object is called, such as "window".
         */
        UserWrappr.prototype.getGlobalName = function () {
            return this.globalName;
        };
        /**
         * @return {String} What to replace with the name of the game in help
         *                  text settings.
         */
        UserWrappr.prototype.getGameNameAlias = function () {
            return this.gameNameAlias;
        };
        /**
         * @return {String} All the keys the user is allowed to pick from.
         */
        UserWrappr.prototype.getAllPossibleKeys = function () {
            return this.allPossibleKeys;
        };
        /**
         * @return {Object} The allowed sizes for the game.
         */
        UserWrappr.prototype.getSizes = function () {
            return this.sizes;
        };
        /**
         * @return {Object} The currently selected size for the game.
         */
        UserWrappr.prototype.getCurrentSize = function () {
            return this.currentSize;
        };
        /**
         * @return {Boolean} Whether the game is currently in full screen mode.
         */
        UserWrappr.prototype.getIsFullScreen = function () {
            return this.isFullScreen;
        };
        /**
         * @return {Boolean} Whether the page is currently known to be hidden.
         */
        UserWrappr.prototype.getIsPageHidden = function () {
            return this.isPageHidden;
        };
        /**
         * @return {Function} A utility Function to log messages, commonly console.log.
         */
        UserWrappr.prototype.getLog = function () {
            return this.log;
        };
        /**
         * @return {Object} Generators used to generate HTML controls for the user.
         */
        UserWrappr.prototype.getGenerators = function () {
            return this.generators;
        };
        /**
         * @return {HTMLHtmlElement} The document element that contains the game.
         */
        UserWrappr.prototype.getDocumentElement = function () {
            return this.documentElement;
        };
        /**
         * @return {Function} The method to request to enter full screen mode.
         */
        UserWrappr.prototype.getRequestFullScreen = function () {
            return this.requestFullScreen;
        };
        /**
         * @return {Function} The method to request to exit full screen mode.
         */
        UserWrappr.prototype.getCancelFullScreen = function () {
            return this.cancelFullScreen;
        };
        /* Externally allowed sets
        */
        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         *
         * @param {Mixed} The size to set, as a String to retrieve the size from
         *                known info, or a container of settings.
         */
        UserWrappr.prototype.setCurrentSize = function (size) {
            if (typeof size === "string" || size.constructor === String) {
                if (!this.sizes.hasOwnProperty(size)) {
                    throw new Error("Size " + size + " does not exist on the UserWrappr.");
                }
                size = this.sizes[size];
            }
            this.customs = this.fixCustoms(this.customs);
            if (size.full) {
                this.requestFullScreen();
                this.isFullScreen = true;
            }
            else if (this.isFullScreen) {
                this.cancelFullScreen();
                this.isFullScreen = false;
            }
            this.currentSize = size;
            if (this.GameStarter) {
                this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
                this.resetGameStarter(this.settings, this.customs);
            }
        };
        /* Help dialog
        */
        /**
         * Displays the root help menu dialog, which contains all the openings
         * for each help settings opening.
         */
        UserWrappr.prototype.displayHelpMenu = function () {
            this.helpSettings.openings.forEach(this.logHelpText.bind(this));
        };
        /**
         * Displays the texts of each help settings options, all surrounded by
         * instructions on how to focus on a group.
         */
        UserWrappr.prototype.displayHelpOptions = function () {
            this.logHelpText("To focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`");
            Object.keys(this.helpSettings.options).forEach(this.displayHelpGroupSummary.bind(this));
            this.logHelpText("\nTo focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`");
        };
        /**
         * Displays the summary for a help group of the given optionName.
         *
         * @param {String} optionName   The help group to display the summary of.
         */
        UserWrappr.prototype.displayHelpGroupSummary = function (optionName) {
            var actions = this.helpSettings.options[optionName], action, maxTitleLength = 0, i;
            this.log("\n" + optionName);
            for (i = 0; i < actions.length; i += 1) {
                maxTitleLength = Math.max(maxTitleLength, this.filterHelpText(actions[i].title).length);
            }
            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                this.log(this.padTextRight(this.filterHelpText(action.title), maxTitleLength) + " ... " + action.description);
            }
        };
        /**
         * Displays the full information on a help group of the given optionName.
         *
         * @param {String} optionName   The help group to display the information of.
         */
        UserWrappr.prototype.displayHelpOption = function (optionName) {
            var actions = this.helpSettings.options[optionName], action, example, maxExampleLength, i, j;
            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                maxExampleLength = 0;
                this.logHelpText(action.title + " -- " + action.description);
                if (action.usage) {
                    this.logHelpText(action.usage);
                }
                if (action.examples) {
                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        maxExampleLength = Math.max(maxExampleLength, this.filterHelpText("    " + example.code).length);
                    }
                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        this.logHelpText(this.padTextRight(this.filterHelpText("    " + example.code), maxExampleLength)
                            + "  // " + example.comment);
                    }
                }
                this.log("\n");
            }
        };
        /**
         * Logs a bit of help text, filtered by this.filterHelpText.
         *
         * @param {String} text   The text to be filtered and logged.
         */
        UserWrappr.prototype.logHelpText = function (text) {
            this.log(this.filterHelpText(text));
        };
        /**
         * @param {String} text
         * @return {String} The text, with gamenameAlias replaced by globalName.
         */
        UserWrappr.prototype.filterHelpText = function (text) {
            return text.replace(new RegExp(this.gameNameAlias, "g"), this.globalName);
        };
        /**
         * Ensures a bit of text is of least a certain length.
         *
         * @param {String} text   The text to pad.
         * @param {Number} length   How wide the text must be, at minimum.
         * @return {String} The text with spaces padded to the right.
         */
        UserWrappr.prototype.padTextRight = function (text, length) {
            var diff = 1 + length - text.length;
            if (diff <= 0) {
                return text;
            }
            return text + Array.call(Array, diff).join(" ");
        };
        /* Settings parsing
        */
        /**
         * Sets the internal this.sizes as a copy of the given sizes, but with
         * names as members of every size summary.
         *
         * @param {Object} sizes   The listing of preset sizes to go by.
         */
        UserWrappr.prototype.importSizes = function (sizes) {
            var i;
            this.sizes = this.GameStartrConstructor.prototype.proliferate({}, sizes);
            for (i in this.sizes) {
                if (this.sizes.hasOwnProperty(i)) {
                    this.sizes[i].name = this.sizes[i].name || i;
                }
            }
        };
        /**
         *
         */
        UserWrappr.prototype.fixCustoms = function (customsRaw) {
            var customs = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);
            this.GameStartrConstructor.prototype.proliferate(customs, this.currentSize);
            if (!isFinite(customs.width)) {
                customs.width = document.body.clientWidth;
            }
            if (!isFinite(customs.height)) {
                if (customs.full) {
                    customs.height = screen.height;
                }
                else if (this.isFullScreen) {
                    // Guess for browser window...
                    // @todo Actually compute this!
                    customs.height = window.innerHeight - 140;
                }
                else {
                    customs.height = window.innerHeight;
                }
                // 49px from header, 35px from menus
                customs.height -= 84;
            }
            return customs;
        };
        /* Page visibility
        */
        /**
         * Adds a "visibilitychange" handler to the document bound to
         * this.handleVisibilityChange.
         */
        UserWrappr.prototype.resetPageVisibilityHandlers = function () {
            document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        };
        /**
         * Handles a visibility change event by calling either this.onPageHidden
         * or this.onPageVisible.
         *
         * @param {Event} event
         */
        UserWrappr.prototype.handleVisibilityChange = function (event) {
            switch (document.visibilityState) {
                case "hidden":
                    this.onPageHidden();
                    return;
                case "visible":
                    this.onPageVisible();
                    return;
                default:
                    return;
            }
        };
        /**
         * Reacts to the page becoming hidden by pausing the GameStartr.
         */
        UserWrappr.prototype.onPageHidden = function () {
            if (!this.GameStarter.GamesRunner.getPaused()) {
                this.isPageHidden = true;
                this.GameStarter.GamesRunner.pause();
            }
        };
        /**
         * Reacts to the page becoming visible by unpausing the GameStartr.
         */
        UserWrappr.prototype.onPageVisible = function () {
            if (this.isPageHidden) {
                this.isPageHidden = false;
                this.GameStarter.GamesRunner.play();
            }
        };
        /* Control section loaders
        */
        /**
         * Loads the internal GameStarter, resetting it with the given customs
         * and attaching handlers to document.body and the holder elements.
         *
         * @param {Object} customs   Custom arguments to pass to this.GameStarter.
         */
        UserWrappr.prototype.loadGameStarter = function (customs) {
            var section = document.querySelector(this.gameElementSelector);
            if (this.GameStarter) {
                this.GameStarter.GamesRunner.pause();
            }
            this.GameStarter = new this.GameStartrConstructor(customs);
            section.textContent = "";
            section.appendChild(this.GameStarter.container);
            this.GameStarter.proliferate(document.body, {
                "onkeydown": this.GameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
                "onkeyup": this.GameStarter.InputWriter.makePipe("onkeyup", "keyCode")
            });
            this.GameStarter.proliferate(section, {
                "onmousedown": this.GameStarter.InputWriter.makePipe("onmousedown", "which"),
                "oncontextmenu": this.GameStarter.InputWriter.makePipe("oncontextmenu", null, true)
            });
        };
        /**
         * Loads the internal OptionsGenerator instances under this.generators.
         */
        UserWrappr.prototype.loadGenerators = function () {
            this.generators = {
                OptionsButtons: new UISchemas.OptionsButtonsGenerator(this),
                OptionsTable: new UISchemas.OptionsTableGenerator(this),
                LevelEditor: new UISchemas.LevelEditorGenerator(this),
                MapsGrid: new UISchemas.MapsGridGenerator(this)
            };
        };
        /**
         * Loads the externally facing UI controls and the internal ItemsHolder,
         * appending the controls to the controls HTML element.
         *
         * @param {Object[]} schemas   The schemas each a UI control to be made.
         */
        UserWrappr.prototype.loadControls = function (schemas) {
            var section = document.querySelector(this.gameControlsSelector), length = schemas.length, i;
            this.ItemsHolder = new ItemsHoldr.ItemsHoldr({
                "prefix": this.globalName + "::UserWrapper::ItemsHolder"
            });
            section.textContent = "";
            section.className = "length-" + length;
            for (i = 0; i < length; i += 1) {
                section.appendChild(this.loadControlDiv(schemas[i]));
            }
        };
        /**
         * Creates an individual UI control element based on a UI schema.
         *
         * @param {Object} schema
         * @return {HTMLDivElement}
         */
        UserWrappr.prototype.loadControlDiv = function (schema) {
            var control = document.createElement("div"), heading = document.createElement("h4"), inner = document.createElement("div");
            control.className = "control";
            control.id = "control-" + schema.title;
            heading.textContent = schema.title;
            inner.className = "control-inner";
            inner.appendChild(this.generators[schema.generator].generate(schema));
            control.appendChild(heading);
            control.appendChild(inner);
            // Touch events often propogate to children before the control div has
            // been fully extended. Setting the "active" attribute fixes that.
            control.onmouseover = setTimeout.bind(undefined, function () {
                control.setAttribute("active", "on");
            }, 35);
            control.onmouseout = function () {
                control.setAttribute("active", "off");
            };
            return control;
        };
        return UserWrappr;
    })();
    UserWrappr_1.UserWrappr = UserWrappr;
    var UISchemas;
    (function (UISchemas) {
        /**
         * Base class for options generators. These all store a UserWrapper and
         * its GameStartr, along with a generate Function
         */
        var AbstractOptionsGenerator = (function () {
            /**
             * @param {UserWrappr} UserWrappr
             */
            function AbstractOptionsGenerator(UserWrapper) {
                this.UserWrapper = UserWrapper;
                this.GameStarter = this.UserWrapper.getGameStarter();
            }
            /**
             * Generates a control element based on the provided schema.
             */
            AbstractOptionsGenerator.prototype.generate = function (schema) {
                throw new Error("AbstractOptionsGenerator is abstract. Subclass it.");
            };
            /**
             * Recursively searches for an element with the "control" class
             * that's a parent of the given element.
             *
             * @param {HTMLElement} element
             * @return {HTMLElement}
             */
            AbstractOptionsGenerator.prototype.getParentControlDiv = function (element) {
                if (element.className === "control") {
                    return element;
                }
                else if (!element.parentNode) {
                    return undefined;
                }
                return this.getParentControlDiv(element.parentElement);
            };
            /**
             * Ensures a child's required local storage value is being stored,
             * and adds it to the internal GameStarter.ItemsHolder if not. If it
             * is, and the child's value isn't equal to it, the value is set.
             *
             * @param {Mixed} childRaw   An input or select element, or an Array
             *                           thereof.
             * @param {Object} details   Details containing the title of the item
             *                           and the source Function to get its value.
             * @param {Object} schema   The container schema this child is within.
             */
            AbstractOptionsGenerator.prototype.ensureLocalStorageValue = function (childRaw, details, schema) {
                if (childRaw.constructor === Array) {
                    this.ensureLocalStorageValues(childRaw, details, schema);
                    return;
                }
                var child = childRaw, key = schema.title + "::" + details.title, valueDefault = details.source.call(this, this.GameStarter).toString(), value;
                child.setAttribute("localStorageKey", key);
                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": valueDefault
                });
                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;
                    if (child.setValue) {
                        child.setValue(value);
                    }
                    else if (child.onchange) {
                        child.onchange(undefined);
                    }
                    else if (child.onclick) {
                        child.onclick(undefined);
                    }
                }
            };
            /**
             * The equivalent of ensureLocalStorageValue for an entire set of
             * elements, running the equivalent logic on all of them.
             *
             * @param {Mixed} childRaw   An Array of input or select elements.
             * @param {Object} details   Details containing the title of the item
             *                           and the source Function to get its value.
             * @param {Object} schema   The container schema this child is within.
             */
            AbstractOptionsGenerator.prototype.ensureLocalStorageValues = function (children, details, schema) {
                var keyGeneral = schema.title + "::" + details.title, values = details.source.call(this, this.GameStarter), key, value, child, i;
                for (i = 0; i < children.length; i += 1) {
                    key = keyGeneral + "::" + i;
                    child = children[i];
                    child.setAttribute("localStorageKey", key);
                    this.GameStarter.ItemsHolder.addItem(key, {
                        "storeLocally": true,
                        "valueDefault": values[i]
                    });
                    value = this.GameStarter.ItemsHolder.getItem(key);
                    if (value !== "" && value !== child.value) {
                        child.value = value;
                        if (child.onchange) {
                            child.onchange(undefined);
                        }
                        else if (child.onclick) {
                            child.onclick(undefined);
                        }
                    }
                }
            };
            /**
             * Stores an element's value in the internal GameStarter.ItemsHolder,
             * if it has the "localStorageKey" attribute.
             *
             * @param {HTMLElement} child   An element with a value to store.
             * @param {Mixed} value   What value is to be stored under the key.
             */
            AbstractOptionsGenerator.prototype.storeLocalStorageValue = function (child, value) {
                var key = child.getAttribute("localStorageKey");
                if (key) {
                    this.GameStarter.ItemsHolder.setItem(key, value);
                }
            };
            return AbstractOptionsGenerator;
        })();
        UISchemas.AbstractOptionsGenerator = AbstractOptionsGenerator;
        /**
         * A buttons generator for an options section that contains any number
         * of general buttons.
         */
        var OptionsButtonsGenerator = (function (_super) {
            __extends(OptionsButtonsGenerator, _super);
            function OptionsButtonsGenerator() {
                _super.apply(this, arguments);
            }
            OptionsButtonsGenerator.prototype.generate = function (schema) {
                var output = document.createElement("div"), options = schema.options instanceof Function
                    ? schema.options.call(self, this.GameStarter)
                    : schema.options, optionKeys = Object.keys(options), keyActive = schema.keyActive || "active", classNameStart = "select-option options-button-option", scope = this, option, element, i;
                output.className = "select-options select-options-buttons";
                for (i = 0; i < optionKeys.length; i += 1) {
                    option = options[optionKeys[i]];
                    element = document.createElement("div");
                    element.className = classNameStart;
                    element.textContent = optionKeys[i];
                    element.onclick = function (schema, element) {
                        if (scope.getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        schema.callback.call(scope, scope.GameStarter, schema, element);
                        if (element.getAttribute("option-enabled") === "true") {
                            element.setAttribute("option-enabled", "false");
                            element.className = classNameStart + " option-disabled";
                        }
                        else {
                            element.setAttribute("option-enabled", "true");
                            element.className = classNameStart + " option-enabled";
                        }
                    }.bind(undefined, schema, element);
                    if (option[keyActive]) {
                        element.className += " option-enabled";
                        element.setAttribute("option-enabled", "true");
                    }
                    else if (schema.assumeInactive) {
                        element.className += " option-disabled";
                        element.setAttribute("option-enabled", "false");
                    }
                    else {
                        element.setAttribute("option-enabled", "true");
                    }
                    output.appendChild(element);
                }
                return output;
            };
            return OptionsButtonsGenerator;
        })(AbstractOptionsGenerator);
        UISchemas.OptionsButtonsGenerator = OptionsButtonsGenerator;
        /**
         * An options generator for a table of options,.
         */
        var OptionsTableGenerator = (function (_super) {
            __extends(OptionsTableGenerator, _super);
            function OptionsTableGenerator() {
                _super.apply(this, arguments);
                this.optionTypes = {
                    "Boolean": this.setBooleanInput,
                    "Keys": this.setKeyInput,
                    "Number": this.setNumberInput,
                    "Select": this.setSelectInput,
                    "ScreenSize": this.setScreenSizeInput
                };
            }
            OptionsTableGenerator.prototype.generate = function (schema) {
                var output = document.createElement("div"), table = document.createElement("table"), option, action, row, label, input, child, i;
                output.className = "select-options select-options-table";
                if (schema.options) {
                    for (i = 0; i < schema.options.length; i += 1) {
                        row = document.createElement("tr");
                        label = document.createElement("td");
                        input = document.createElement("td");
                        option = schema.options[i];
                        label.className = "options-label-" + option.type;
                        label.textContent = option.title;
                        input.className = "options-cell-" + option.type;
                        row.appendChild(label);
                        row.appendChild(input);
                        child = this.optionTypes[schema.options[i].type].call(this, input, option, schema);
                        if (option.storeLocally) {
                            this.ensureLocalStorageValue(child, option, schema);
                        }
                        table.appendChild(row);
                    }
                }
                output.appendChild(table);
                if (schema.actions) {
                    for (i = 0; i < schema.actions.length; i += 1) {
                        row = document.createElement("div");
                        action = schema.actions[i];
                        row.className = "select-option options-button-option";
                        row.textContent = action.title;
                        row.onclick = action.action.bind(this, this.GameStarter);
                        output.appendChild(row);
                    }
                }
                return output;
            };
            OptionsTableGenerator.prototype.setBooleanInput = function (input, details, schema) {
                var status = details.source.call(this, this.GameStarter), statusClass = status ? "enabled" : "disabled", scope = this;
                input.className = "select-option options-button-option option-" + statusClass;
                input.textContent = status ? "on" : "off";
                input.onclick = function () {
                    input.setValue(input.textContent === "off");
                };
                input.setValue = function (newStatus) {
                    if (newStatus.constructor === String) {
                        if (newStatus === "false" || newStatus === "off") {
                            newStatus = false;
                        }
                        else if (newStatus === "true" || newStatus === "on") {
                            newStatus = true;
                        }
                    }
                    if (newStatus) {
                        details.enable.call(scope, scope.GameStarter);
                        input.textContent = "on";
                        input.className = input.className.replace("disabled", "enabled");
                    }
                    else {
                        details.disable.call(scope, scope.GameStarter);
                        input.textContent = "off";
                        input.className = input.className.replace("enabled", "disabled");
                    }
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(input, newStatus.toString());
                    }
                };
                return input;
            };
            OptionsTableGenerator.prototype.setKeyInput = function (input, details, schema) {
                var values = details.source.call(this, this.GameStarter), children = [], child, scope = this, i, j;
                for (i = 0; i < values.length; i += 1) {
                    child = document.createElement("select");
                    child.className = "options-key-option";
                    for (j = 0; j < this.UserWrapper.getAllPossibleKeys().length; j += 1) {
                        child.appendChild(new Option(this.UserWrapper.getAllPossibleKeys()[j]));
                    }
                    child.value = child.valueOld = values[i].toLowerCase();
                    child.onchange = (function (child) {
                        details.callback.call(scope, scope.GameStarter, child.valueOld, child.value);
                        if (details.storeLocally) {
                            scope.storeLocalStorageValue(child, child.value);
                        }
                    }).bind(undefined, child);
                    children.push(child);
                    input.appendChild(child);
                }
                return children;
            };
            OptionsTableGenerator.prototype.setNumberInput = function (input, details, schema) {
                var child = document.createElement("input"), scope = this;
                child.type = "number";
                child.value = Number(details.source.call(scope, scope.GameStarter)).toString();
                child.min = (details.minimum || 0).toString();
                child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();
                child.onchange = child.oninput = function () {
                    if (child.checkValidity()) {
                        details.update.call(scope, scope.GameStarter, child.value);
                    }
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };
                input.appendChild(child);
                return child;
            };
            OptionsTableGenerator.prototype.setSelectInput = function (input, details, schema) {
                var child = document.createElement("select"), options = details.options(this.GameStarter), scope = this, i;
                for (i = 0; i < options.length; i += 1) {
                    child.appendChild(new Option(options[i]));
                }
                child.value = details.source.call(scope, scope.GameStarter);
                child.onchange = function () {
                    details.update.call(scope, scope.GameStarter, child.value);
                    child.blur();
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };
                input.appendChild(child);
                return child;
            };
            OptionsTableGenerator.prototype.setScreenSizeInput = function (input, details, schema) {
                var scope = this, child;
                details.options = function () {
                    return Object.keys(scope.UserWrapper.getSizes());
                };
                details.source = function () {
                    return scope.UserWrapper.getCurrentSize().name;
                };
                details.update = function (GameStarter, value) {
                    if (value === scope.UserWrapper.getCurrentSize()) {
                        return undefined;
                    }
                    scope.UserWrapper.setCurrentSize(value);
                };
                child = scope.setSelectInput(input, details, schema);
                return child;
            };
            return OptionsTableGenerator;
        })(AbstractOptionsGenerator);
        UISchemas.OptionsTableGenerator = OptionsTableGenerator;
        /**
         * Options generator for a LevelEditr dialog.
         */
        var LevelEditorGenerator = (function (_super) {
            __extends(LevelEditorGenerator, _super);
            function LevelEditorGenerator() {
                _super.apply(this, arguments);
            }
            LevelEditorGenerator.prototype.generate = function (schema) {
                var output = document.createElement("div"), title = document.createElement("div"), button = document.createElement("div"), between = document.createElement("div"), uploader = this.createUploaderDiv(), scope = this;
                output.className = "select-options select-options-level-editor";
                title.className = "select-option-title";
                title.textContent = "Create your own custom levels:";
                button.className = "select-option select-option-large options-button-option";
                button.innerHTML = "Start the <br /> Level Editor!";
                button.onclick = function () {
                    scope.GameStarter.LevelEditor.enable();
                };
                between.className = "select-option-title";
                between.innerHTML = "<em>- or -</em><br />";
                output.appendChild(title);
                output.appendChild(button);
                output.appendChild(between);
                output.appendChild(uploader);
                return output;
            };
            LevelEditorGenerator.prototype.createUploaderDiv = function () {
                var uploader = document.createElement("div"), input = document.createElement("input");
                uploader.className = "select-option select-option-large options-button-option";
                uploader.textContent = "Click to upload and continue your editor files!";
                uploader.setAttribute("textOld", uploader.textContent);
                input.type = "file";
                input.className = "select-upload-input";
                input.onchange = this.handleFileDrop.bind(this, input, uploader);
                uploader.ondragenter = this.handleFileDragEnter.bind(this, uploader);
                uploader.ondragover = this.handleFileDragOver.bind(this, uploader);
                uploader.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, uploader);
                uploader.ondrop = this.handleFileDrop.bind(this, input, uploader);
                uploader.onclick = input.click.bind(input);
                uploader.appendChild(input);
                return uploader;
            };
            LevelEditorGenerator.prototype.handleFileDragEnter = function (uploader, event) {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "copy";
                }
                uploader.className += " hovering";
            };
            LevelEditorGenerator.prototype.handleFileDragOver = function (uploader, event) {
                event.preventDefault();
                return false;
            };
            LevelEditorGenerator.prototype.handleFileDragLeave = function (element, event) {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "none";
                }
                element.className = element.className.replace(" hovering", "");
            };
            LevelEditorGenerator.prototype.handleFileDrop = function (input, uploader, event) {
                var files = input.files || event.dataTransfer.files, file = files[0], reader = new FileReader();
                this.handleFileDragLeave(input, event);
                event.preventDefault();
                event.stopPropagation();
                reader.onprogress = this.handleFileUploadProgress.bind(this, file, uploader);
                reader.onloadend = this.handleFileUploadCompletion.bind(this, file, uploader);
                reader.readAsText(file);
            };
            LevelEditorGenerator.prototype.handleFileUploadProgress = function (file, uploader, event) {
                var percent;
                if (!event.lengthComputable) {
                    return;
                }
                percent = Math.round((event.loaded / event.total) * 100);
                if (percent > 100) {
                    percent = 100;
                }
                uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
            };
            LevelEditorGenerator.prototype.handleFileUploadCompletion = function (file, uploader, event) {
                this.GameStarter.LevelEditor.handleUploadCompletion(event);
                uploader.innerText = uploader.getAttribute("textOld");
            };
            return LevelEditorGenerator;
        })(AbstractOptionsGenerator);
        UISchemas.LevelEditorGenerator = LevelEditorGenerator;
        /**
         * Options generator for a grid of maps, along with other options.
         */
        var MapsGridGenerator = (function (_super) {
            __extends(MapsGridGenerator, _super);
            function MapsGridGenerator() {
                _super.apply(this, arguments);
            }
            MapsGridGenerator.prototype.generate = function (schema) {
                var output = document.createElement("div");
                output.className = "select-options select-options-maps-grid";
                if (schema.rangeX && schema.rangeY) {
                    output.appendChild(this.generateRangedTable(schema));
                }
                if (schema.extras) {
                    this.appendExtras(output, schema);
                }
                return output;
            };
            MapsGridGenerator.prototype.generateRangedTable = function (schema) {
                var scope = this, table = document.createElement("table"), rangeX = schema.rangeX, rangeY = schema.rangeY, row, cell, i, j;
                for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                    row = document.createElement("tr");
                    row.className = "maps-grid-row";
                    for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                        cell = document.createElement("td");
                        cell.className = "select-option maps-grid-option maps-grid-option-range";
                        cell.textContent = i + "-" + j;
                        cell.onclick = (function (callback) {
                            if (scope.getParentControlDiv(cell).getAttribute("active") === "on") {
                                callback();
                            }
                        }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, cell));
                        row.appendChild(cell);
                    }
                    table.appendChild(row);
                }
                return table;
            };
            MapsGridGenerator.prototype.appendExtras = function (output, schema) {
                var element, extra, i, j;
                for (i in schema.extras) {
                    if (!schema.extras.hasOwnProperty(i)) {
                        continue;
                    }
                    extra = schema.extras[i];
                    element = document.createElement("div");
                    element.className = "select-option maps-grid-option maps-grid-option-extra";
                    element.textContent = extra.title;
                    element.setAttribute("value", extra.title);
                    element.onclick = extra.callback.bind(this, this.GameStarter, schema, element);
                    output.appendChild(element);
                    if (extra.extraElements) {
                        for (j = 0; j < extra.extraElements.length; j += 1) {
                            output.appendChild(this.GameStarter.createElement.apply(this.GameStarter, extra.extraElements[j]));
                        }
                    }
                }
            };
            return MapsGridGenerator;
        })(AbstractOptionsGenerator);
        UISchemas.MapsGridGenerator = MapsGridGenerator;
    })(UISchemas = UserWrappr_1.UISchemas || (UserWrappr_1.UISchemas = {}));
})(UserWrappr || (UserWrappr = {}));
var WorldSeedr;
(function (WorldSeedr_1) {
    "use strict";
    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on a preset position and probability schema. Each
     * "possibility" in the schema contains a width, height, and instructions on
     * what type of contents it contains, which are either a preset listing or
     * a randomization of other possibilities of certain probabilities. Additional
     * functionality is provided to stagger layout of children, such as spacing
     * between possibilities.
     */
    var WorldSeedr = (function () {
        /**
         * @param {IWorldSeedrSettings} settings
         */
        function WorldSeedr(settings) {
            /**
             * A constant listing of direction opposites, like top-bottom.
             */
            this.directionOpposites = {
                "top": "bottom",
                "right": "left",
                "bottom": "top",
                "left": "right"
            };
            /**
             * A constant listing of what direction the sides of areas correspond to.
             */
            this.directionSizing = {
                "top": "height",
                "right": "width",
                "bottom": "height",
                "left": "width"
            };
            /**
             * A constant Array of direction names.
             */
            this.directionNames = ["top", "right", "bottom", "left"];
            /**
             * A constant Array of the dimension descriptors.
             */
            this.sizingNames = ["width", "height"];
            if (typeof settings.possibilities === "undefined") {
                throw new Error("No possibilities given to WorldSeedr.");
            }
            this.possibilities = settings.possibilities;
            this.random = settings.random || Math.random.bind(Math);
            this.onPlacement = settings.onPlacement || console.log.bind(console, "Got:");
            this.clearGeneratedCommands();
        }
        /* Simple gets & sets
        */
        /**
         * @return {Object} The listing of possibilities that may be generated.
         */
        WorldSeedr.prototype.getPossibilities = function () {
            return this.possibilities;
        };
        /**
         * @param {Object} possibilitiesNew   A new Object to list possibilities
         *                                    that may be generated.
         */
        WorldSeedr.prototype.setPossibilities = function (possibilities) {
            this.possibilities = possibilities;
        };
        /**
         * @return {Function} The Function callback for generated possibilities of
         *                    type "known" to be called in runGeneratedCommands.
         */
        WorldSeedr.prototype.getOnPlacement = function () {
            return this.onPlacement;
        };
        /**
         * @param {Function} onPlacementNew   A new Function to be used as the
         *                                    onPlacement callback.
         */
        WorldSeedr.prototype.setOnPlacement = function (onPlacement) {
            this.onPlacement = onPlacement;
        };
        /* Generated commands
        */
        /**
         * Resets the generatedCommands Array so runGeneratedCommands can start.
         */
        WorldSeedr.prototype.clearGeneratedCommands = function () {
            this.generatedCommands = [];
        };
        /**
         * Runs the onPlacement callback on the generatedCommands Array.
         */
        WorldSeedr.prototype.runGeneratedCommands = function () {
            this.onPlacement(this.generatedCommands);
        };
        /* Hardcore generation functions
        */
        /**
         * Generates a collection of randomly chosen possibilities based on the
         * given schema mapping. These does not recursively parse the output; do
         * do that, use generateFull.
         *
         * @param {String} name   The name of the possibility schema to start from.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generate = function (name, command) {
            var schema = this.possibilities[name];
            if (!schema) {
                throw new Error("No possibility exists under '" + name + "'");
            }
            if (!schema.contents) {
                throw new Error("Possibility '" + name + "' has no possibile outcomes.");
            }
            return this.generateChildren(schema, this.objectCopy(command));
        };
        /**
         * Recursively generates a schema. The schema's title and itself are given
         * to this.generate; all outputs of type "Known" are added to the
         * generatedCommands Array, while everything else is recursed upon.
         *
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateFull = function (schema) {
            var generated = this.generate(schema.title, schema), child, i;
            if (!generated || !generated.children) {
                return;
            }
            for (i = 0; i < generated.children.length; i += 1) {
                child = generated.children[i];
                switch (child.type) {
                    case "Known":
                        this.generatedCommands.push(child);
                        break;
                    case "Random":
                        this.generateFull(child);
                        break;
                }
            }
        };
        /**
         * Generates the children for a given schema, position, and direction. This
         * is the real hardcore function called by this.generate, which calls the
         * differnt subroutines based on whether the contents are in "Certain" or
         * "Random" mode.
         *
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} [direction]   A string direction to check the position
         *                               by ("top", "right", "bottom", or "left")
         *                               as a default if contents.direction isn't
         *                               provided.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildren = function (schema, position, direction) {
            if (direction === void 0) { direction = undefined; }
            var contents = schema.contents, spacing = contents.spacing || 0, objectMerged = this.objectMerge(schema, position), children;
            direction = contents.direction || direction;
            switch (contents.mode) {
                case "Random":
                    children = this.generateChildrenRandom(contents, objectMerged, direction, spacing);
                    break;
                case "Certain":
                    children = this.generateChildrenCertain(contents, objectMerged, direction, spacing);
                    break;
                case "Repeat":
                    children = this.generateChildrenRepeat(contents, objectMerged, direction, spacing);
                    break;
                case "Multiple":
                    children = this.generateChildrenMultiple(contents, objectMerged, direction, spacing);
                    break;
            }
            return this.wrapChoicePositionExtremes(children);
        };
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas.
         *
         * @param {Object} contents   The known possibilities to choose between.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Number} spacing   How much space there should be between each
         *                           child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenCertain = function (contents, position, direction, spacing) {
            var scope = this;
            return contents.children.map(function (choice) {
                if (choice.type === "Final") {
                    return scope.parseChoiceFinal(contents, choice, position, direction);
                }
                var output = scope.parseChoice(choice, position, direction);
                if (output) {
                    if (output.type !== "Known") {
                        output.contents = scope.generate(output.title, position);
                    }
                    scope.shrinkPositionByChild(position, output, direction, spacing);
                }
                return output;
            }).filter(function (child) {
                return child !== undefined;
            });
        };
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas, repeated until there is no space left.
         *
         * @param {Object} contents   The known possibilities to choose between.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Number} spacing   How much space there should be between each
         *                           child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenRepeat = function (contents, position, direction, spacing) {
            var choices = contents.children, children = [], choice, child, i = 0;
            // Continuously loops through the choices and adds them to the output
            // children, so long as there's still room for them
            while (this.positionIsNotEmpty(position, direction)) {
                choice = choices[i];
                if (choice.type === "Final") {
                    child = this.parseChoiceFinal(contents, choice, position, direction);
                }
                else {
                    child = this.parseChoice(choice, position, direction);
                    if (child) {
                        if (child.type !== "Known") {
                            child.contents = this.generate(child.title, position);
                        }
                    }
                }
                if (child && this.choiceFitsPosition(child, position)) {
                    this.shrinkPositionByChild(position, child, direction, spacing);
                    children.push(child);
                }
                else {
                    break;
                }
                i += 1;
                if (i >= choices.length) {
                    i = 0;
                }
            }
            return children;
        };
        /**
         * Generates a schema's children that are known to be randomly chosen from a
         * list of possibilities until there is no more room.
         *
         * @param {Object} contents   The Array of known possibilities, with
         *                            probability percentages.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Number} spacing   How much space there should be between each
         *                           child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenRandom = function (contents, position, direction, spacing) {
            var children = [], child;
            // Continuously add random choices to the output children as long as 
            // there's room in the position's bounding box
            while (this.positionIsNotEmpty(position, direction)) {
                child = this.generateChild(contents, position, direction);
                if (!child) {
                    break;
                }
                this.shrinkPositionByChild(position, child, direction, spacing);
                children.push(child);
                if (contents.limit && children.length > contents.limit) {
                    return;
                }
            }
            return children;
        };
        /**
         * Generates a schema's children that are all to be placed within the same
         * position. If a direction is provided, each subsequent one is shifted in
         * that direction by spacing.
         *
         * @param {Object} contents   The Array of known possibilities, with
         *                            probability percentages.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} [direction]   A string direction to check the position by:
         *                               "top", "right", "bottom", or "left".
         * @param {Number} [spacing]   How much space there should be between each
         *                             child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenMultiple = function (contents, position, direction, spacing) {
            var scope = this;
            return contents.children.map(function (choice) {
                var output = scope.parseChoice(choice, scope.objectCopy(position), direction);
                if (direction) {
                    scope.movePositionBySpacing(position, direction, spacing);
                }
                return output;
            });
        };
        /* Choice parsing
        */
        /**
         * Shortcut function to choose a choice from an allowed set of choices, and
         * parse it for positioning and sub-choices.
         *
         * @param {Object} contents   An Array of choice Objects, each of which must
         *                            have a .percentage.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @return {Object}   An Object containing the bounding box position of a
         *                    parsed child, with the basic schema (.title) info
         *                    added as well as any optional .arguments.
         */
        WorldSeedr.prototype.generateChild = function (contents, position, direction) {
            var choice = this.chooseAmongPosition(contents.children, position);
            if (!choice) {
                return undefined;
            }
            return this.parseChoice(choice, position, direction);
        };
        /**
         * Creates a parsed version of a choice given the position and direction.
         * This is the function that parses and manipulates the positioning of the
         * new choice.
         *
         * @param {Object} choice   The simple definition of the Object chosen from
         *                          a choices array. It should have at least .title,
         *                          and optionally .sizing or .arguments.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to shrink the position by:
         *                             "top", "right", "bottom", or "left".
         * @return {Object}   An Object containing the bounding box position of a
         *                    parsed child, with the basic schema (.title) info
         *                    added as well as any optional .arguments.
         */
        WorldSeedr.prototype.parseChoice = function (choice, position, direction) {
            var title = choice.title, schema = this.possibilities[title], output = {
                "title": title,
                "type": choice.type,
                "arguments": choice.arguments instanceof Array
                    ? (this.chooseAmong(choice.arguments)).values
                    : choice.arguments,
                "width": undefined,
                "height": undefined,
                "top": undefined,
                "right": undefined,
                "bottom": undefined,
                "left": undefined
            };
            this.ensureSizingOnChoice(output, choice, schema);
            this.ensureDirectionBoundsOnChoice(output, position);
            output[direction] = output[this.directionOpposites[direction]] + output[this.directionSizing[direction]];
            switch (schema.contents.snap) {
                case "top":
                    output.bottom = output.top - output.height;
                    break;
                case "right":
                    output.left = output.right - output.width;
                    break;
                case "bottom":
                    output.top = output.bottom + output.height;
                    break;
                case "left":
                    output.right = output.left + output.width;
                    break;
            }
            if (choice.stretch) {
                if (!output.arguments) {
                    output.arguments = {};
                }
                if (choice.stretch.width) {
                    output.left = position.left;
                    output.right = position.right;
                    output.width = output.right - output.left;
                    output.arguments.width = output.width;
                }
                if (choice.stretch.height) {
                    output.top = position.top;
                    output.bottom = position.bottom;
                    output.height = output.top - output.bottom;
                    output.arguments.height = output.height;
                }
            }
            this.copySchemaArguments(schema, choice, output);
            return output;
        };
        /**
         * should conform to parent (contents) via cannonsmall.snap=bottom
         */
        WorldSeedr.prototype.parseChoiceFinal = function (parent, choice, position, direction) {
            var schema = this.possibilities[choice.source], output = {
                "type": "Known",
                "title": choice.title,
                "arguments": choice.arguments,
                "width": schema.width,
                "height": schema.height,
                "top": position.top,
                "right": position.right,
                "bottom": position.bottom,
                "left": position.left
            };
            this.copySchemaArguments(schema, choice, output);
            return output;
        };
        /* Randomization utilities
        */
        /**
         * From an Array of potential choice objects, returns one chosen at random.
         *
         * @param {Array} choice   An Array of objects with .width and .height.
         * @return {Object}
         */
        WorldSeedr.prototype.chooseAmong = function (choices) {
            if (!choices.length) {
                return undefined;
            }
            if (choices.length === 1) {
                return choices[0];
            }
            var choice = this.randomPercentage(), sum = 0, i;
            for (i = 0; i < choices.length; i += 1) {
                sum += choices[i].percent;
                if (sum >= choice) {
                    return choices[i];
                }
            }
        };
        /**
         * From an Array of potential choice objects, filtered to only include those
         * within a certain size, returns one chosen at random.
         *
         * @param {Array} choice   An Array of objects with .width and .height.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @return {Object}
         * @remarks Functions that use this will have to react to nothing being
         *          chosen. For example, if only 50 percentage is accumulated
         *          among fitting ones but 75 is randomly chosen, something should
         *          still be returned.
         */
        WorldSeedr.prototype.chooseAmongPosition = function (choices, position) {
            var width = position.right - position.left, height = position.top - position.bottom, scope = this;
            return this.chooseAmong(choices.filter(function (choice) {
                return scope.choiceFits(scope.possibilities[choice.title], width, height);
            }));
        };
        /**
         * Checks whether a choice can fit within a width and height.
         *
         * @param {Object} choice   An Object that contains .width and .height.
         * @param {Number} width
         * @param {Number} height
         * @return {Boolean} Whether the choice fits within the position.
         */
        WorldSeedr.prototype.choiceFits = function (choice, width, height) {
            return choice.width <= width && choice.height <= height;
        };
        /**
         * Checks whether a choice can fit within a position.
         *
         * @param {Object} choice   An Object that contains .width and .height.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @return {Boolean} The boolean equivalent of the choice fits
         *                   within the position.
         * @remarks When calling multiple times on a position (such as in
         *          chooseAmongPosition), it's more efficient to store the width
         *          and height separately and just use doesChoiceFit.
         */
        WorldSeedr.prototype.choiceFitsPosition = function (choice, position) {
            return this.choiceFits(choice, position.right - position.left, position.top - position.bottom);
        };
        /**
         * @return {Number} A number in [1, 100] at random.
         */
        WorldSeedr.prototype.randomPercentage = function () {
            return Math.floor(this.random() * 100) + 1;
        };
        /**
         * @return {Number} A number in [min, max] at random.
         */
        WorldSeedr.prototype.randomBetween = function (min, max) {
            return Math.floor(this.random() * (1 + max - min)) + min;
        };
        /* Position manipulation utilities
        */
        /**
         * Creates and returns a copy of a position (really just a shallow copy).
         *
         * @param {Object} original
         * @return {Object}
         */
        WorldSeedr.prototype.objectCopy = function (original) {
            var output = {}, i;
            for (i in original) {
                if (original.hasOwnProperty(i)) {
                    output[i] = original[i];
                }
            }
            return output;
        };
        /**
         * Creates a new position with all required attributes taking from the
         * primary source or secondary source, in that order.
         *
         * @param {Object} primary
         * @param {Object} secondary
         * @return {Object}
         */
        WorldSeedr.prototype.objectMerge = function (primary, secondary) {
            var output = this.objectCopy(primary), i;
            for (i in secondary) {
                if (secondary.hasOwnProperty(i) && !output.hasOwnProperty(i)) {
                    output[i] = secondary[i];
                }
            }
            return output;
        };
        /**
         * Checks and returns whether a position has open room in a particular
         * direction (horizontally for left/right and vertically for top/bottom).
         *
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to check the position in:
         *                             "top", "right", "bottom", or "left".
         */
        WorldSeedr.prototype.positionIsNotEmpty = function (position, direction) {
            if (direction === "right" || direction === "left") {
                return position.left < position.right;
            }
            else {
                return position.top > position.bottom;
            }
        };
        /**
         * Shrinks a position by the size of a child, in a particular direction.
         *
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {Object} child   An Object that contains .left, .right, .top, and
         *                         .bottom.
         * @param {String} direction   A string direction to shrink the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Mixed} [spacing]   How much space there should be between each
         *                            child (by default, 0).
         */
        WorldSeedr.prototype.shrinkPositionByChild = function (position, child, direction, spacing) {
            switch (direction) {
                case "top":
                    position.bottom = child.top + this.parseSpacing(spacing);
                    break;
                case "right":
                    position.left = child.right + this.parseSpacing(spacing);
                    break;
                case "bottom":
                    position.top = child.bottom - this.parseSpacing(spacing);
                    break;
                case "left":
                    position.right = child.left - this.parseSpacing(spacing);
                    break;
            }
        };
        /**
         * Moves a position by its parsed spacing. This is only useful for content
         * of type "Multiple", which are allowed to move themselves via spacing
         * between placements.
         *
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to shrink the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Mixed} [spacing]   How much space there should be between each
         *                            child (by default, 0).
         */
        WorldSeedr.prototype.movePositionBySpacing = function (position, direction, spacing) {
            if (spacing === void 0) { spacing = 0; }
            var space = this.parseSpacing(spacing);
            switch (direction) {
                case "top":
                    position.top += space;
                    position.bottom += space;
                    break;
                case "right":
                    position.left += space;
                    position.right += space;
                    break;
                case "bottom":
                    position.top -= space;
                    position.bottom -= space;
                    break;
                case "left":
                    position.left -= space;
                    position.right -= space;
                    break;
            }
        };
        /**
         * Recursively parses a spacing parameter to eventually return a Number,
         * which will likely be random.
         *
         * @param {Mixed} spacing   This may be a Number (returned directly), an
         *                          Object[] containing choices for chooseAmong, a
         *                          Number[] containing minimum and maximum values,
         *                          or an Object containing "min", "max", and
         *                          "units" to round to.
         * @return {Number}
         */
        WorldSeedr.prototype.parseSpacing = function (spacing) {
            if (!spacing) {
                return 0;
            }
            switch (spacing.constructor) {
                case Array:
                    // Case: [min, max]
                    if (spacing[0].constructor === Number) {
                        return this.parseSpacingObject(this.randomBetween(spacing[0], spacing[1]));
                    }
                    // Case: IPossibilitySpacingOption[]
                    return this.parseSpacingObject(this.chooseAmong(spacing).value);
                case Object:
                    // Case: IPossibilitySpacing
                    return this.parseSpacingObject(spacing);
                default:
                    // Case: Number
                    return spacing;
            }
        };
        /**
         * Helper to parse a spacing Object. The minimum and maximum ("min" and
         * "max", respectively) are the range, and an optional "units" parameter
         * is what Number it should round to.
         *
         * @param {Object} spacing
         * @return {Number}
         */
        WorldSeedr.prototype.parseSpacingObject = function (spacing) {
            if (spacing.constructor === Number) {
                return spacing;
            }
            var min = spacing.min, max = spacing.max, units = spacing.units || 1;
            return this.randomBetween(min / units, max / units) * units;
        };
        /**
         * Generates the bounding box position Object (think rectangle) for a set of
         * children. The top, right, etc. member variables become the most extreme
         * out of all the possibilities.
         *
         * @param {Object} children   An Array of Objects with .top, .right,
         *                            .bottom, and .left.
         * @return {Object}   An Object with .top, .right, .bottom, and .left.
         */
        WorldSeedr.prototype.wrapChoicePositionExtremes = function (children) {
            var position, child, i;
            if (!children || !children.length) {
                return undefined;
            }
            child = children[0];
            position = {
                "title": undefined,
                "top": child.top,
                "right": child.right,
                "bottom": child.bottom,
                "left": child.left,
                "width": undefined,
                "height": undefined,
                "children": children
            };
            if (children.length === 1) {
                return position;
            }
            for (i = 1; i < children.length; i += 1) {
                child = children[i];
                if (!Object.keys(child).length) {
                    return position;
                }
                position.top = Math.max(position.top, child.top);
                position.right = Math.max(position.right, child.right);
                position.bottom = Math.min(position.bottom, child.bottom);
                position.left = Math.min(position.left, child.left);
            }
            position.width = position.right - position.left;
            position.height = position.top - position.bottom;
            return position;
        };
        /**
         * Copies settings from a parsed choice to its arguments. What settings to
         * copy over are determined by the schema's content's argumentMap attribute.
         *
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         * @param {Object} choice   The simple definition of the Object chosen from
         *                          a choices array.
         * @param {Object} output   The Object (likely a parsed possibility content)
         *                          having its arguments modified.
         */
        WorldSeedr.prototype.copySchemaArguments = function (schema, choice, output) {
            var map = schema.contents.argumentMap, i;
            if (!map) {
                return;
            }
            if (!output.arguments) {
                output.arguments = {};
            }
            for (i in map) {
                if (map.hasOwnProperty(i)) {
                    output.arguments[map[i]] = choice[i];
                }
            }
        };
        /**
         * Ensures an output from parseChoice contains all the necessary size
         * measurements, as listed in this.sizingNames.
         *
         * @param {Object} output   The Object (likely a parsed possibility content)
         *                          having its arguments modified.
         * @param {Object} choice   The simple definition of the Object chosen from
         *                          a choices array.
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         */
        WorldSeedr.prototype.ensureSizingOnChoice = function (output, choice, schema) {
            var name, i;
            for (i in this.sizingNames) {
                if (!this.sizingNames.hasOwnProperty(i)) {
                    continue;
                }
                name = this.sizingNames[i];
                output[name] = (choice.sizing && typeof choice.sizing[name] !== "undefined")
                    ? choice.sizing[name]
                    : schema[name];
            }
        };
        /**
         * Ensures an output from parseChoice contains all the necessary position
         * bounding box measurements, as listed in this.directionNames.
         *
         * @param {Object} output   The Object (likely a parsed possibility content)
         *                          having its arguments modified.
         *                          chosen possibility.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         */
        WorldSeedr.prototype.ensureDirectionBoundsOnChoice = function (output, position) {
            for (var i in this.directionNames) {
                if (this.directionNames.hasOwnProperty(i)) {
                    output[this.directionNames[i]] = position[this.directionNames[i]];
                }
            }
        };
        return WorldSeedr;
    })();
    WorldSeedr_1.WorldSeedr = WorldSeedr;
})(WorldSeedr || (WorldSeedr = {}));
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy       !jslint_happy
            ---------------------------------
            function ()        function ()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if (true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/
(function () {
    var acorn = {};
    (function (exports) {
        // This section of code is taken from acorn.
        //
        // Acorn was written by Marijn Haverbeke and released under an MIT
        // license. The Unicode regexps (for identifiers and whitespace) were
        // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
        //
        // Git repositories for Acorn are available at
        //
        //     http://marijnhaverbeke.nl/git/acorn
        //     https://github.com/marijnh/acorn.git
        // ## Character categories
        // Big ugly regular expressions that match characters in the
        // whitespace, identifier, and identifier-start categories. These
        // are only applied when a character is found to actually have a
        // code point above 128.
        var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
        var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
        var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
        var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
        var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
        // Whether a single character denotes a newline.
        var newline = /[\n\r\u2028\u2029]/;
        // Matches a whole line break (where CRLF is considered a single
        // line break). Used to count lines.
        var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;
        // Test whether a given character code starts an identifier.
        var isIdentifierStart = exports.isIdentifierStart = function (code) {
            if (code < 65)
                return code === 36;
            if (code < 91)
                return true;
            if (code < 97)
                return code === 95;
            if (code < 123)
                return true;
            return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
        };
        // Test whether a given character is part of an identifier.
        var isIdentifierChar = exports.isIdentifierChar = function (code) {
            if (code < 48)
                return code === 36;
            if (code < 58)
                return true;
            if (code < 65)
                return false;
            if (code < 91)
                return true;
            if (code < 97)
                return code === 95;
            if (code < 123)
                return true;
            return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
        };
    })(acorn);
    function js_beautify(js_source_text, options) {
        "use strict";
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }
    function Beautifier(js_source_text, options) {
        "use strict";
        var input, output_lines;
        var token_text, token_type, last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var whitespace, wordchar, punct, parser_pos, line_starters, reserved_words, digits;
        var prefix;
        var input_wanted_newline;
        var output_space_before_token;
        var input_length, n_newlines, whitespace_before_token;
        var handlers, MODE, opt;
        var preindent_string = '';
        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');
        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');
        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,yield'.split(',');
        reserved_words = line_starters.concat(['do', 'in', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof']);
        MODE = {
            BlockStatement: 'BlockStatement',
            Statement: 'Statement',
            ObjectLiteral: 'ObjectLiteral',
            ArrayLiteral: 'ArrayLiteral',
            ForInitializer: 'ForInitializer',
            Conditional: 'Conditional',
            Expression: 'Expression' //'(EXPRESSION)'
        };
        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_RESERVED': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TKInLINE_COMMENT': handleInline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown
        };
        function create_flags(flags_base, mode) {
            var nextIndent_level = 0;
            if (flags_base) {
                nextIndent_level = flags_base.indentation_level;
                if (!justAdded_newline() &&
                    flags_base.lineIndent_level > nextIndent_level) {
                    nextIndent_level = flags_base.lineIndent_level;
                }
            }
            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '',
                last_word: flags_base ? flags_base.last_word : '',
                declaration_statement: false,
                declaration_assignment: false,
                in_html_comment: false,
                multiline_frame: false,
                if_block: false,
                else_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false,
                in_case: false,
                case_body: false,
                indentation_level: nextIndent_level,
                lineIndent_level: flags_base ? flags_base.lineIndent_level : nextIndent_level,
                start_lineIndex: output_lines.length,
                had_comment: false,
                ternary_depth: 0
            };
            return next_flags;
        }
        // Using object instead of string to allow for later expansion of info about each line
        function createOutput_line() {
            return {
                text: []
            };
        }
        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};
        // compatibility
        if (options.spaceAfter_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.spaceAfter_anon_function;
        }
        if (options.braces_on_own_line !== undefined) {
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");
        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }
        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.spaceIn_paren = (options.spaceIn_paren === undefined) ? false : options.spaceIn_paren;
        opt.spaceIn_empty_paren = (options.spaceIn_empty_paren === undefined) ? false : options.spaceIn_empty_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.keep_arrayIndentation = (options.keep_arrayIndentation === undefined) ? false : options.keep_arrayIndentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;
        if (options.indent_with_tabs) {
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }
        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }
        while (js_source_text && (js_source_text.charAt(0) === ' ' || js_source_text.charAt(0) === '\t')) {
            preindent_string += js_source_text.charAt(0);
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;
        // cache the source's length.
        input_length = js_source_text.length;
        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output_lines = [createOutput_line()];
        output_space_before_token = false;
        whitespace_before_token = [];
        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);
        parser_pos = 0;
        this.beautify = function () {
            /*jshint onevar:true */
            var t, i, keep_whitespace, sweet_code;
            while (true) {
                t = get_next_token();
                token_text = t[0];
                token_type = t[1];
                if (token_type === 'TK_EOF') {
                    // Unwind any open statements
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    break;
                }
                keep_whitespace = opt.keep_arrayIndentation && is_array(flags.mode);
                input_wanted_newline = n_newlines > 0;
                if (keep_whitespace) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i > 0);
                    }
                }
                else {
                    if (opt.max_preserve_newlines && n_newlines > opt.max_preserve_newlines) {
                        n_newlines = opt.max_preserve_newlines;
                    }
                    if (opt.preserve_newlines) {
                        if (n_newlines > 1) {
                            print_newline();
                            for (i = 1; i < n_newlines; i += 1) {
                                print_newline(true);
                            }
                        }
                    }
                }
                handlers[token_type]();
                // The cleanest handling of inline comments is to treat them as though they aren't there.
                // Just continue formatting and the behavior should be logical.
                // Also ignore unknown tokens.  Again, this should result in better behavior.
                if (token_type !== 'TKInLINE_COMMENT' && token_type !== 'TK_COMMENT' &&
                    token_type !== 'TK_BLOCK_COMMENT' && token_type !== 'TK_UNKNOWN') {
                    last_last_text = flags.last_text;
                    last_type = token_type;
                    flags.last_text = token_text;
                }
                flags.had_comment = (token_type === 'TKInLINE_COMMENT' || token_type === 'TK_COMMENT'
                    || token_type === 'TK_BLOCK_COMMENT');
            }
            sweet_code = output_lines[0].text.join('');
            for (var lineIndex = 1; lineIndex < output_lines.length; lineIndex++) {
                sweet_code += '\n' + output_lines[lineIndex].text.join('');
            }
            sweet_code = sweet_code.replace(/[\r\n ]+$/, '');
            return sweet_code;
        };
        function trimOutput(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;
            if (output_lines.length) {
                trimOutput_line(output_lines[output_lines.length - 1]);
                while (eat_newlines && output_lines.length > 1 &&
                    output_lines[output_lines.length - 1].text.length === 0) {
                    output_lines.pop();
                    trimOutput_line(output_lines[output_lines.length - 1]);
                }
            }
        }
        function trimOutput_line(line) {
            while (line.text.length &&
                (line.text[line.text.length - 1] === ' ' ||
                    line.text[line.text.length - 1] === indent_string ||
                    line.text[line.text.length - 1] === preindent_string)) {
                line.text.pop();
            }
        }
        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }
        // we could use just string.split, but
        // IE doesn't like returning empty strings
        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);
            s = s.replace(/\x0d/g, '');
            var out = [], idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }
        function justAdded_newline() {
            var line = output_lines[output_lines.length - 1];
            return line.text.length === 0;
        }
        function justAdded_blankline() {
            if (justAdded_newline()) {
                if (output_lines.length === 1) {
                    return true; // start of the file and newline = blank
                }
                var line = output_lines[output_lines.length - 2];
                return line.text.length === 0;
            }
            return false;
        }
        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;
            if (opt.wrap_line_length && !force_linewrap) {
                var line = output_lines[output_lines.length - 1];
                var proposed_line_length = 0;
                // never wrap the first token of a line.
                if (line.text.length > 0) {
                    proposed_line_length = line.text.join('').length + token_text.length +
                        (output_space_before_token ? 1 : 0);
                    if (proposed_line_length >= opt.wrap_line_length) {
                        force_linewrap = true;
                    }
                }
            }
            if (((opt.preserve_newlines && input_wanted_newline) || force_linewrap) && !justAdded_newline()) {
                print_newline(false, true);
            }
        }
        function print_newline(force_newline, preserve_statement_flags) {
            output_space_before_token = false;
            if (!preserve_statement_flags) {
                if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }
            if (output_lines.length === 1 && justAdded_newline()) {
                return; // no newline on start of file
            }
            if (force_newline || !justAdded_newline()) {
                flags.multiline_frame = true;
                output_lines.push(createOutput_line());
            }
        }
        function print_token_lineIndentation() {
            if (justAdded_newline()) {
                var line = output_lines[output_lines.length - 1];
                if (opt.keep_arrayIndentation && is_array(flags.mode) && input_wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    line.text.push('');
                    for (var i = 0; i < whitespace_before_token.length; i += 1) {
                        line.text.push(whitespace_before_token[i]);
                    }
                }
                else {
                    if (preindent_string) {
                        line.text.push(preindent_string);
                    }
                    printIndent_string(flags.indentation_level);
                }
            }
        }
        function printIndent_string(level) {
            // Never indent your first output indent at the start of the file
            if (output_lines.length > 1) {
                var line = output_lines[output_lines.length - 1];
                flags.lineIndent_level = level;
                for (var i = 0; i < level; i += 1) {
                    line.text.push(indent_string);
                }
            }
        }
        function print_token_space_before() {
            var line = output_lines[output_lines.length - 1];
            if (output_space_before_token && line.text.length) {
                var lastOutput = line.text[line.text.length - 1];
                if (lastOutput !== ' ' && lastOutput !== indent_string) {
                    line.text.push(' ');
                }
            }
        }
        function print_token(printable_token) {
            printable_token = printable_token || token_text;
            print_token_lineIndentation();
            print_token_space_before();
            output_space_before_token = false;
            output_lines[output_lines.length - 1].text.push(printable_token);
        }
        function indent() {
            flags.indentation_level += 1;
        }
        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }
        function remove_redundantIndentation(frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.
            if (frame.multiline_frame)
                return;
            // remove one indent from each line inside this section
            var index = frame.start_lineIndex;
            var spliceIndex = 0;
            var line;
            while (index < output_lines.length) {
                line = output_lines[index];
                index++;
                // skip empty lines
                if (line.text.length === 0) {
                    continue;
                }
                // skip the preindent string if present
                if (preindent_string && line.text[0] === preindent_string) {
                    spliceIndex = 1;
                }
                else {
                    spliceIndex = 0;
                }
                // remove one indent, if present
                if (line.text[spliceIndex] === indent_string) {
                    line.text.splice(spliceIndex, 1);
                }
            }
        }
        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            }
            else {
                previous_flags = create_flags(null, mode);
            }
            flags = create_flags(previous_flags, mode);
        }
        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }
        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }
        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
                if (previous_flags.mode === MODE.Statement) {
                    remove_redundantIndentation(previous_flags);
                }
            }
        }
        function start_of_object_property() {
            return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && flags.last_text === ':' &&
                flags.ternary_depth === 0;
        }
        function start_of_statement() {
            if ((last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') ||
                (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
                (last_type === 'TK_RESERVED' && flags.last_text === 'return' && !input_wanted_newline) ||
                (last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(token_type === 'TK_RESERVED' && token_text === 'if')) ||
                (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
                (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement
                    && !flags.in_case
                    && !(token_text === '--' || token_text === '++')
                    && token_type !== 'TK_WORD' && token_type !== 'TK_RESERVED') ||
                (flags.mode === MODE.ObjectLiteral && flags.last_text === ':' && flags.ternary_depth === 0)) {
                set_mode(MODE.Statement);
                indent();
                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') {
                    flags.declaration_statement = true;
                }
                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if (c) d(); else e(); else f();
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline(token_type === 'TK_RESERVED' && in_array(token_text, ['do', 'for', 'if', 'while']));
                }
                return true;
            }
            return false;
        }
        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }
        function each_line_matchesIndent(lines, indent) {
            var i = 0, len = lines.length, line;
            for (; i < len; i++) {
                line = lines[i];
                // allow empty lines to pass through
                if (line && line.indexOf(indent) !== 0) {
                    return false;
                }
            }
            return true;
        }
        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }
        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }
        function unescape_string(s) {
            var esc = false, out = '', pos = 0, s_hex = '', escaped = 0, c;
            while (esc || pos < s.length) {
                c = s.charAt(pos);
                pos++;
                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    }
                    else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    }
                    else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }
                    escaped = parseInt(s_hex, 16);
                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        }
                        else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    }
                    else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    }
                    else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    }
                    else {
                        out += String.fromCharCode(escaped);
                    }
                }
                else if (c === '\\') {
                    esc = true;
                }
                else {
                    out += c;
                }
            }
            return out;
        }
        function is_next(find) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c !== find) {
                local_pos++;
                if (local_pos >= input_length) {
                    return false;
                }
                c = input.charAt(local_pos);
            }
            return c === find;
        }
        function get_next_token() {
            var i, resulting_string;
            n_newlines = 0;
            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }
            input_wanted_newline = false;
            whitespace_before_token = [];
            var c = input.charAt(parser_pos);
            parser_pos += 1;
            while (in_array(c, whitespace)) {
                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                }
                else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    }
                    else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }
                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }
                c = input.charAt(parser_pos);
                parser_pos += 1;
            }
            // NOTE: because beautifier doesn't fully parse, it doesn't use acorn.isIdentifierStart.
            // It just treats all identifiers and numbers and such the same.
            if (acorn.isIdentifierChar(input.charCodeAt(parser_pos - 1))) {
                if (parser_pos < input_length) {
                    while (acorn.isIdentifierChar(input.charCodeAt(parser_pos))) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }
                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {
                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;
                    var t = get_next_token();
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }
                if (!(last_type === 'TK_DOT' ||
                    (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['set', 'get'])))
                    && in_array(c, reserved_words)) {
                    if (c === 'in') {
                        return [c, 'TK_OPERATOR'];
                    }
                    return [c, 'TK_RESERVED'];
                }
                return [c, 'TK_WORD'];
            }
            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }
            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }
            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }
            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }
            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }
            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TKInLINE_COMMENT'];
                    }
                    else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }
            }
            if (c === '`' || c === "'" || c === '"' ||
                ((c === '/') ||
                    (opt.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ((last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) ||
                    (last_type === 'TK_END_EXPR' && in_array(previous_flags.mode, [MODE.Conditional, MODE.ForInitializer])) ||
                    (in_array(last_type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ])))) {
                var sep = c, esc = false, has_char_escapes = false;
                resulting_string = c;
                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                }
                                else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            }
                            else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    }
                    else if (opt.e4x && sep === '<') {
                        //
                        // handle e4x xml literals
                        //
                        var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                        var xmlStr = input.slice(parser_pos - 1);
                        var match = xmlRegExp.exec(xmlStr);
                        if (match && match.index === 0) {
                            var rootTag = match[2];
                            var depth = 0;
                            while (match) {
                                var isEndTag = !!match[1];
                                var tagName = match[2];
                                var isSingletonTag = (!!match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                                if (tagName === rootTag && !isSingletonTag) {
                                    if (isEndTag) {
                                        --depth;
                                    }
                                    else {
                                        ++depth;
                                    }
                                }
                                if (depth <= 0) {
                                    break;
                                }
                                match = xmlRegExp.exec(xmlStr);
                            }
                            var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                            parser_pos += xmlLength - 1;
                            return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                        }
                    }
                    else {
                        //
                        // handle string
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (esc) {
                                if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                    has_char_escapes = true;
                                }
                                esc = false;
                            }
                            else {
                                esc = input.charAt(parser_pos) === '\\';
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    }
                }
                parser_pos += 1;
                resulting_string += sep;
                if (has_char_escapes && opt.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }
                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }
            if (c === '#') {
                if (output_lines.length === 1 && output_lines[0].text.length === 0 &&
                    input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }
                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/SharpVariablesIn_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                    }
                    else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    }
                    else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }
            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }
            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }
            if (c === '.') {
                return [c, 'TK_DOT'];
            }
            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }
                if (c === ',') {
                    return [c, 'TK_COMMA'];
                }
                else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                }
                else {
                    return [c, 'TK_OPERATOR'];
                }
            }
            return [c, 'TK_UNKNOWN'];
        }
        function handle_start_expr() {
            if (start_of_statement()) {
            }
            var next_mode = MODE.Expression;
            if (token_text === '[') {
                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, line_starters)) {
                        output_space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.spaceIn_paren) {
                        output_space_before_token = true;
                    }
                    return;
                }
                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_arrayIndentation) {
                            print_newline();
                        }
                    }
                }
            }
            else {
                if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                }
                else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                }
                else {
                }
            }
            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            }
            else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(input_wanted_newline);
            }
            else if (!(last_type === 'TK_RESERVED' && token_text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output_space_before_token = true;
            }
            else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                // function () vs function ()
                if (opt.jslint_happy) {
                    output_space_before_token = true;
                }
            }
            else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, line_starters) || flags.last_text === 'catch')) {
                if (opt.space_before_conditional) {
                    output_space_before_token = true;
                }
            }
            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (token_text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }
            set_mode(next_mode);
            print_token();
            if (opt.spaceIn_paren) {
                output_space_before_token = true;
            }
            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }
        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline(token_text === ']' && is_array(flags.mode) && !opt.keep_arrayIndentation);
            }
            if (opt.spaceIn_paren) {
                if (last_type === 'TK_START_EXPR' && !opt.spaceIn_empty_paren) {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    trimOutput();
                    output_space_before_token = false;
                }
                else {
                    output_space_before_token = true;
                }
            }
            if (token_text === ']' && opt.keep_arrayIndentation) {
                print_token();
                restore_mode();
            }
            else {
                restore_mode();
                print_token();
            }
            remove_redundantIndentation(previous_flags);
            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;
            }
        }
        function handle_start_block() {
            set_mode(MODE.BlockStatement);
            var empty_braces = is_next('}');
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';
            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output_space_before_token = true;
                }
                else {
                    print_newline(false, true);
                }
            }
            else {
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    }
                    else {
                        output_space_before_token = true;
                    }
                }
                else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output_space_before_token = true;
                        }
                        else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }
        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';
            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            }
            else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_arrayIndentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_arrayIndentation = false;
                        print_newline();
                        opt.keep_arrayIndentation = true;
                    }
                    else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }
        function handle_word() {
            if (start_of_statement()) {
            }
            else if (input_wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {
                print_newline();
            }
            if (flags.do_block && !flags.do_while) {
                if (token_type === 'TK_RESERVED' && token_text === 'while') {
                    // do {} ## while ()
                    output_space_before_token = true;
                    print_token();
                    output_space_before_token = true;
                    flags.do_while = true;
                    return;
                }
                else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }
            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (!flags.else_block && (token_type === 'TK_RESERVED' && token_text === 'else')) {
                    flags.else_block = true;
                }
                else {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                    flags.else_block = false;
                }
            }
            if (token_type === 'TK_RESERVED' && (token_text === 'case' || (token_text === 'default' && flags.in_case_statement))) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }
            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                if (in_array(flags.last_text, ['}', ';']) || (justAdded_newline() && !in_array(flags.last_text, ['[', '{', ':', '=', ',']))) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    if (!justAdded_blankline() && !flags.had_comment) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return'])) {
                        output_space_before_token = true;
                    }
                    else {
                        print_newline();
                    }
                }
                else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output_space_before_token = true;
                }
                else if (is_expression(flags.mode)) {
                }
                else {
                    print_newline();
                }
            }
            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }
            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                print_token();
                flags.last_word = token_text;
                return;
            }
            prefix = 'NONE';
            if (last_type === 'TK_END_BLOCK') {
                if (!(token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally']))) {
                    prefix = 'NEWLINE';
                }
                else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    }
                    else {
                        prefix = 'SPACE';
                        output_space_before_token = true;
                    }
                }
            }
            else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            }
            else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            }
            else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            }
            else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                prefix = 'SPACE';
            }
            else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            }
            else if (last_type === 'TK_END_EXPR') {
                output_space_before_token = true;
                prefix = 'NEWLINE';
            }
            if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else') {
                    prefix = 'SPACE';
                }
                else {
                    prefix = 'NEWLINE';
                }
            }
            if (token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                }
                else {
                    trimOutput(true);
                    var line = output_lines[output_lines.length - 1];
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.text[line.text.length - 1] !== '}') {
                        print_newline();
                    }
                    output_space_before_token = true;
                }
            }
            else if (prefix === 'NEWLINE') {
                if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output_space_before_token = true;
                }
                else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || !(token_type === 'TK_RESERVED' && in_array(token_text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_type === 'TK_RESERVED' && token_text === 'if' && flags.last_word === 'else' && flags.last_text !== '{') {
                            // no newline for } else if {
                            output_space_before_token = true;
                        }
                        else {
                            print_newline();
                        }
                    }
                }
                else if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                    print_newline();
                }
            }
            else if (is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            }
            else if (prefix === 'SPACE') {
                output_space_before_token = true;
            }
            print_token();
            flags.last_word = token_text;
            if (token_type === 'TK_RESERVED' && token_text === 'do') {
                flags.do_block = true;
            }
            if (token_type === 'TK_RESERVED' && token_text === 'if') {
                flags.if_block = true;
            }
        }
        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output_space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
            if (flags.mode === MODE.ObjectLiteral) {
                // if we're in OBJECT mode and see a semicolon, its invalid syntax
                // recover back to treating this as a BLOCK
                flags.mode = MODE.BlockStatement;
            }
        }
        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output_space_before_token = true;
            }
            else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                output_space_before_token = true;
            }
            else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }
            else {
                print_newline();
            }
            print_token();
        }
        function handle_equals() {
            if (start_of_statement()) {
            }
            if (flags.declaration_statement) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.declaration_assignment = true;
            }
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }
        function handle_comma() {
            if (flags.declaration_statement) {
                if (is_expression(flags.parent.mode)) {
                    // do not break on comma, for (var a = 1, b = 2)
                    flags.declaration_assignment = false;
                }
                print_token();
                if (flags.declaration_assignment) {
                    flags.declaration_assignment = false;
                    print_newline(false, true);
                }
                else {
                    output_space_before_token = true;
                }
                return;
            }
            print_token();
            if (flags.mode === MODE.ObjectLiteral ||
                (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
                if (flags.mode === MODE.Statement) {
                    restore_mode();
                }
                print_newline();
            }
            else {
                // EXPR or DO_BLOCK
                output_space_before_token = true;
            }
        }
        function handle_operator() {
            // Check if this is a BlockStatement that should be treated as a ObjectLiteral
            if (token_text === ':' && flags.mode === MODE.BlockStatement &&
                last_last_text === '{' &&
                (last_type === 'TK_WORD' || last_type === 'TK_RESERVED')) {
                flags.mode = MODE.ObjectLiteral;
            }
            if (start_of_statement()) {
            }
            var space_before = true;
            var spaceAfter = true;
            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output_space_before_token = true;
                print_token();
                return;
            }
            // hack for actionscript's import .*;
            if (token_text === '*' && last_type === 'TK_DOT' && !last_last_text.match(/^\d+$/)) {
                print_token();
                return;
            }
            if (token_text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }
            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }
            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (input_wanted_newline && (token_text === '--' || token_text === '++')) {
                print_newline(false, true);
            }
            // Allow line wrapping between operators
            if (last_type === 'TK_OPERATOR') {
                allow_wrap_or_preserved_newline();
            }
            if (in_array(token_text, ['--', '++', '!', '~']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases
                space_before = false;
                spaceAfter = false;
                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }
                if (last_type === 'TK_RESERVED' || last_type === 'TK_END_EXPR') {
                    space_before = true;
                }
                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            }
            else if (token_text === ':') {
                if (flags.ternary_depth === 0) {
                    if (flags.mode === MODE.BlockStatement) {
                        flags.mode = MODE.ObjectLiteral;
                    }
                    space_before = false;
                }
                else {
                    flags.ternary_depth -= 1;
                }
            }
            else if (token_text === '?') {
                flags.ternary_depth += 1;
            }
            else if (token_text === '*' && last_type === 'TK_RESERVED' && flags.last_text === 'function') {
                space_before = false;
                spaceAfter = false;
            }
            output_space_before_token = output_space_before_token || space_before;
            print_token();
            output_space_before_token = spaceAfter;
        }
        function handle_block_comment() {
            var lines = split_newlines(token_text);
            var j; // iterator for this case
            var javadoc = false;
            var starless = false;
            var lastIndent = whitespace_before_token.join('');
            var lastIndentLength = lastIndent.length;
            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
                else if (each_line_matchesIndent(lines.slice(1), lastIndent)) {
                    starless = true;
                }
            }
            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                }
                else if (starless && lines[j].length > lastIndentLength) {
                    // starless: re-indent non-empty content, avoiding trim
                    print_token(lines[j].substring(lastIndentLength));
                }
                else {
                    // normal comments output raw
                    output_lines[output_lines.length - 1].text.push(lines[j]);
                }
            }
            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }
        function handleInline_comment() {
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }
        function handle_comment() {
            if (input_wanted_newline) {
                print_newline(false, true);
            }
            else {
                trimOutput(true);
            }
            output_space_before_token = true;
            print_token();
            print_newline(false, true);
        }
        function handle_dot() {
            if (start_of_statement()) {
            }
            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                output_space_before_token = true;
            }
            else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }
            print_token();
        }
        function handle_unknown() {
            print_token();
            if (token_text[token_text.length - 1] === '\n') {
                print_newline();
            }
        }
    }
    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define([], function () {
            return { js_beautify: js_beautify };
        });
    }
    else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    }
    else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    }
    else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }
}());
// @echo '/// <reference path="AudioPlayr-0.2.1.ts" />'
// @echo '/// <reference path="ChangeLinr-0.2.0.ts" />'
// @echo '/// <reference path="EightBittr-0.2.0.ts" />'
// @echo '/// <reference path="FPSAnalyzr-0.2.1.ts" />'
// @echo '/// <reference path="GamesRunnr-0.2.0.ts" />'
// @echo '/// <reference path="GroupHoldr-0.2.1.ts" />'
// @echo '/// <reference path="InputWritr-0.2.0.ts" />'
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="LevelEditr-0.2.0.ts" />'
// @echo '/// <reference path="MapsCreatr-0.2.1.ts" />'
// @echo '/// <reference path="MapScreenr-0.2.1.ts" />'
// @echo '/// <reference path="MapsHandlr-0.2.0.ts" />'
// @echo '/// <reference path="MathDecidr-0.2.0.ts" />'
// @echo '/// <reference path="ModAttachr-0.2.2.ts" />'
// @echo '/// <reference path="NumberMakr-0.2.2.ts" />'
// @echo '/// <reference path="ObjectMakr-0.2.2.ts" />'
// @echo '/// <reference path="PixelDrawr-0.2.0.ts" />'
// @echo '/// <reference path="PixelRendr-0.2.0.ts" />'
// @echo '/// <reference path="QuadsKeepr-0.2.1.ts" />'
// @echo '/// <reference path="ScenePlayr-0.2.0.ts" />'
// @echo '/// <reference path="StringFilr-0.2.1.ts" />'
// @echo '/// <reference path="ThingHittr-0.2.0.ts" />'
// @echo '/// <reference path="TimeHandlr-0.2.0.ts" />'
// @echo '/// <reference path="TouchPassr-0.2.0.ts" />'
// @echo '/// <reference path="UserWrappr-0.2.0.ts" />'
// @echo '/// <reference path="WorldSeedr-0.2.0.ts" />'
// @echo '/// <reference path="js_beautify.ts" />'
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/AudioPlayr-0.2.1.ts" />
/// <reference path="References/ChangeLinr-0.2.0.ts" />
/// <reference path="References/EightBittr-0.2.0.ts" />
/// <reference path="References/FPSAnalyzr-0.2.1.ts" />
/// <reference path="References/GamesRunnr-0.2.0.ts" />
/// <reference path="References/GroupHoldr-0.2.1.ts" />
/// <reference path="References/InputWritr-0.2.0.ts" />
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="References/LevelEditr-0.2.0.ts" />
/// <reference path="References/MapsCreatr-0.2.1.ts" />
/// <reference path="References/MapScreenr-0.2.1.ts" />
/// <reference path="References/MapsHandlr-0.2.0.ts" />
/// <reference path="References/MathDecidr-0.2.0.ts" />
/// <reference path="References/ModAttachr-0.2.2.ts" />
/// <reference path="References/NumberMakr-0.2.2.ts" />
/// <reference path="References/ObjectMakr-0.2.2.ts" />
/// <reference path="References/PixelDrawr-0.2.0.ts" />
/// <reference path="References/PixelRendr-0.2.0.ts" />
/// <reference path="References/QuadsKeepr-0.2.1.ts" />
/// <reference path="References/ScenePlayr-0.2.0.ts" />
/// <reference path="References/StringFilr-0.2.1.ts" />
/// <reference path="References/ThingHittr-0.2.0.ts" />
/// <reference path="References/TimeHandlr-0.2.0.ts" />
/// <reference path="References/TouchPassr-0.2.0.ts" />
/// <reference path="References/UserWrappr-0.2.0.ts" />
/// <reference path="References/WorldSeedr-0.2.0.ts" />
/// <reference path="References/js_beautify.ts" />
/// <reference path="GameStartr.d.ts" />
// @endif
// @include ../Source/GameStartr.d.ts
var GameStartr;
(function (GameStartr_1) {
    "use strict";
    var GameStartr = (function (_super) {
        __extends(GameStartr, _super);
        /**
         * @param {IGameStartrSettings} [customs]
         */
        function GameStartr(customs) {
            if (customs === void 0) { customs = {}; }
            _super.call(this, {
                "customs": customs,
                "constantsSource": customs.constantsSource,
                "constants": customs.constants,
                "requirements": {
                    "global": {
                        "AudioPlayr": "References/AudioPlayr/AudioPlayr.ts",
                        "ChangeLinr": "References/ChangeLinr/ChangeLinr.ts",
                        "FPSAnalyzr": "References/FPSAnalyzr/FPSAnalyzr.ts",
                        "GamesRunnr": "References/GamesRunnr/GamesRunnr.ts",
                        "GroupHoldr": "References/GroupHoldr/GroupHoldr.ts",
                        "InputWritr": "References/InputWritr/InputWritr.ts",
                        "LevelEditr": "References/LevelEditr/LevelEditr.ts",
                        "NumberMakr": "References/NumberMakr/NumberMakr.ts",
                        "MapScreenr": "References/MapScreenr/MapScreenr.ts",
                        "MapsHandlr": "References/MapsHandlr/MapsHandlr.ts",
                        "MathDecidr": "References/MathDecidr/MathDecidr.ts",
                        "ModAttachr": "References/ModAttachr/ModAttachr.ts",
                        "ObjectMakr": "References/ObjectMakr/ObjectMakr.ts",
                        "PixelDrawr": "References/PixelDrawr/PixelDrawr.ts",
                        "PixelRendr": "References/PixelRendr/PixelRendr.ts",
                        "ScenePlayr": "References/ScenePlayr/ScenePlayr.ts",
                        "QuadsKeepr": "References/QuadsKeepr/QuadsKeepr.ts",
                        "ItemsHoldr": "References/ItemsHoldr/ItemsHoldr.ts",
                        "StringFilr": "References/StringFilr/StringFilr.ts",
                        "ThingHittr": "References/ThingHittr/ThingHittr.ts",
                        "TimeHandlr": "References/TimeHandlr/TimeHandlr.ts"
                    }
                }
            });
            /**
             * Default list of reset Functions to call during this.reset or this.resetTimed, in order.
             */
            this.resets = [
                "resetObjectMaker",
                "resetPixelRender",
                "resetTimeHandler",
                "resetItemsHolder",
                "resetAudioPlayer",
                "resetQuadsKeeper",
                "resetGamesRunner",
                "resetGroupHolder",
                "resetThingHitter",
                "resetMapScreener",
                "resetPixelDrawer",
                "resetNumberMaker",
                "resetMapsCreator",
                "resetMapsHandler",
                "resetInputWriter",
                "resetTouchPasser",
                "resetLevelEditor",
                "resetWorldSeeder",
                "resetScenePlayer",
                "resetMathDecider",
                "resetModAttacher",
                "startModAttacher",
                "resetContainer"
            ];
            if (customs.extraResets) {
                this.resets.push.apply(this.resets, customs.extraResets);
            }
        }
        /* Resets
        */
        /**
         * Resets the GameStartr by calling the parent EightBittr.prototype.reset.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         */
        GameStartr.prototype.reset = function (GameStarter, customs) {
            _super.prototype.reset.call(this, GameStarter, GameStarter.resets, customs);
        };
        /**
         * Resets the EightBittr and records the time by calling the parent
         * EightBittr.prototype.resetTimed.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @return {Array} How long each reset Function took followed by the entire
         *                 operation, in milliseconds.
         */
        GameStartr.prototype.resetTimed = function (GameStarter, customs) {
            return _super.prototype.resetTimed.call(this, GameStarter, GameStarter.resets, customs);
        };
        /**
         * Sets this.ObjectMaker.
         *
         * Because many Thing functions require access to other FSM modules, each is
         * given a reference to this container FSM via properties.thing.GameStarter.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): objects.js (settings/objects.js)
         */
        GameStartr.prototype.resetObjectMaker = function (GameStarter, customs) {
            GameStarter.ObjectMaker = new ObjectMakr.ObjectMakr(GameStarter.proliferate({
                "properties": {
                    "Quadrant": {
                        "EightBitter": GameStarter,
                        "GameStarter": GameStarter
                    },
                    "Thing": {
                        "EightBitter": GameStarter,
                        "GameStarter": GameStarter
                    }
                }
            }, GameStarter.settings.objects));
        };
        /**
         * Sets this.QuadsKeeper.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): quadrants.js (settings/quadrants.js)
         */
        GameStartr.prototype.resetQuadsKeeper = function (GameStarter, customs) {
            var quadrantWidth = customs.width / (GameStarter.settings.quadrants.numCols - 3), quadrantHeight = customs.height / (GameStarter.settings.quadrants.numRows - 2);
            GameStarter.QuadsKeeper = new QuadsKeepr.QuadsKeepr(GameStarter.proliferate({
                "ObjectMaker": GameStarter.ObjectMaker,
                "createCanvas": GameStarter.createCanvas,
                "quadrantWidth": quadrantWidth,
                "quadrantHeight": quadrantHeight,
                "startLeft": -quadrantWidth,
                "startHeight": -quadrantHeight,
                "onAdd": GameStarter.onAreaSpawn.bind(GameStarter, GameStarter),
                "onRemove": GameStarter.onAreaUnspawn.bind(GameStarter, GameStarter)
            }, GameStarter.settings.quadrants));
        };
        /**
         * Sets this.PixelRender.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): sprites.js (settings/sprites.js)
         */
        GameStartr.prototype.resetPixelRender = function (GameStarter, customs) {
            GameStarter.PixelRender = new PixelRendr.PixelRendr(GameStarter.proliferate({
                "scale": GameStarter.scale,
                "QuadsKeeper": GameStarter.QuadsKeeper,
                "unitsize": GameStarter.unitsize
            }, GameStarter.settings.sprites));
        };
        /**
         * Sets this.PixelDrawer.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): renderer.js (settings/renderer.js)
         */
        GameStartr.prototype.resetPixelDrawer = function (GameStarter, customs) {
            GameStarter.PixelDrawer = new PixelDrawr.PixelDrawr(GameStarter.proliferate({
                "PixelRender": GameStarter.PixelRender,
                "MapScreener": GameStarter.MapScreener,
                "createCanvas": GameStarter.createCanvas,
                "unitsize": GameStarter.unitsize,
                "generateObjectKey": GameStarter.generateObjectKey
            }, GameStarter.settings.renderer));
        };
        /**
         * Sets EightBitter.TimeHandler.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): events.js (settings/events.js)
         */
        GameStartr.prototype.resetTimeHandler = function (GameStarter, customs) {
            GameStarter.TimeHandler = new TimeHandlr.TimeHandlr(GameStarter.proliferate({
                "classAdd": GameStarter.addClass,
                "classRemove": GameStarter.removeClass
            }, GameStarter.settings.events));
        };
        /**
         * Sets this.AudioPlayer.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): audio.js (settings/audio.js)
         */
        GameStartr.prototype.resetAudioPlayer = function (GameStarter, customs) {
            GameStarter.AudioPlayer = new AudioPlayr.AudioPlayr(GameStarter.proliferate({
                "ItemsHolder": GameStarter.ItemsHolder
            }, GameStarter.settings.audio));
        };
        /**
         * Sets this.GamesRunner.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): runner.js (settings/runner.js)
         */
        GameStartr.prototype.resetGamesRunner = function (GameStarter, customs) {
            GameStarter.GamesRunner = new GamesRunnr.GamesRunnr(GameStarter.proliferate({
                "adjustFramerate": true,
                "interval": 1000 / 60,
                "scope": GameStarter,
                "onPlay": GameStarter.onGamePlay.bind(GameStarter, GameStarter),
                "onPause": GameStarter.onGamePause.bind(GameStarter, GameStarter),
                "FPSAnalyzer": new FPSAnalyzr.FPSAnalyzr()
            }, GameStarter.settings.runner));
        };
        /**
         * Sets this.ItemsHolder.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): statistics.js (settings/statistics.js)
         */
        GameStartr.prototype.resetItemsHolder = function (GameStarter, customs) {
            GameStarter.ItemsHolder = new ItemsHoldr.ItemsHoldr(GameStarter.proliferate({
                "callbackArgs": [GameStarter]
            }, GameStarter.settings.statistics));
        };
        /**
         * Sets this.GroupHolder.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): groups.js (settings/groups.js)
         */
        GameStartr.prototype.resetGroupHolder = function (GameStarter, customs) {
            GameStarter.GroupHolder = new GroupHoldr.GroupHoldr(GameStarter.settings.groups);
        };
        /**
         * Sets this.ThingHitter.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): collisions.js (settings/collisions.js)
         */
        GameStartr.prototype.resetThingHitter = function (GameStarter, customs) {
            GameStarter.ThingHitter = new ThingHittr.ThingHittr(GameStarter.proliferate({
                "scope": GameStarter
            }, GameStarter.settings.collisions));
        };
        /**
         * Sets this.MapScreener.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        GameStartr.prototype.resetMapScreener = function (GameStarter, customs) {
            GameStarter.MapScreener = new MapScreenr.MapScreenr({
                "EightBitter": GameStarter,
                "unitsize": GameStarter.unitsize,
                "width": customs.width,
                "height": customs.height,
                "variableArgs": [GameStarter],
                "variables": GameStarter.settings.maps.screenVariables
            });
        };
        /**
         * Sets this.NumberMaker.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         */
        GameStartr.prototype.resetNumberMaker = function (GameStarter, customs) {
            GameStarter.NumberMaker = new NumberMakr.NumberMakr();
        };
        /**
         * Sets this.MapCreator.
         *
         * @param {GameStartr} GameStarter
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        GameStartr.prototype.resetMapsCreator = function (GameStarter, customs) {
            GameStarter.MapsCreator = new MapsCreatr.MapsCreatr({
                "ObjectMaker": GameStarter.ObjectMaker,
                "groupTypes": GameStarter.settings.maps.groupTypes,
                "macros": GameStarter.settings.maps.macros,
                "entrances": GameStarter.settings.maps.entrances,
                "maps": GameStarter.settings.maps.library,
                "scope": GameStarter
            });
        };
        /**
         * Sets this.MapsHandler.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        GameStartr.prototype.resetMapsHandler = function (GameStarter, customs) {
            GameStarter.MapsHandler = new MapsHandlr.MapsHandlr({
                "MapsCreator": GameStarter.MapsCreator,
                "MapScreener": GameStarter.MapScreener,
                "screenAttributes": GameStarter.settings.maps.screenAttributes,
                "onSpawn": GameStarter.settings.maps.onSpawn,
                "onUnspawn": GameStarter.settings.maps.onUnspawn
            });
        };
        /**
         * Sets this.InputWriter.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): input.js (settings/input.js)
         */
        GameStartr.prototype.resetInputWriter = function (GameStarter, customs) {
            GameStarter.InputWriter = new InputWritr.InputWritr(GameStarter.proliferate({
                "canTrigger": GameStarter.canInputsTrigger.bind(GameStarter, GameStarter)
            }, GameStarter.settings.input.InputWritrArgs));
        };
        /**
         * Sets this.InputWriter.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): touch.js (settings/touch.js)
         */
        GameStartr.prototype.resetTouchPasser = function (GameStarter, customs) {
            GameStarter.TouchPasser = new TouchPassr.TouchPassr(GameStarter.proliferate({
                "InputWriter": GameStarter.InputWriter
            }, GameStarter.settings.touch));
        };
        /**
         * Sets this.LevelEditor.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): editor.js (settings/editor.js)
         */
        GameStartr.prototype.resetLevelEditor = function (GameStarter, customs) {
            GameStarter.LevelEditor = new LevelEditr.LevelEditr(GameStarter.proliferate({
                "GameStarter": GameStarter,
                "beautifier": js_beautify
            }, GameStarter.settings.editor));
        };
        /**
         * Sets this.WorldSeeder.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): generator.js (settings/generator.js)
         */
        GameStartr.prototype.resetWorldSeeder = function (GameStarter, customs) {
            GameStarter.WorldSeeder = new WorldSeedr.WorldSeedr(GameStarter.proliferate({
                "random": GameStarter.NumberMaker.random.bind(GameStarter.NumberMaker),
                "onPlacement": GameStarter.mapPlaceRandomCommands.bind(GameStarter, GameStarter)
            }, GameStarter.settings.generator));
        };
        /**
         * Sets this.ScenePlayer.
         *
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): scenes.js (settings/scenes.js)
         */
        GameStartr.prototype.resetScenePlayer = function (GameStarter, customs) {
            GameStarter.ScenePlayer = new ScenePlayr.ScenePlayr(GameStarter.settings.generator);
        };
        /**
         * Sets this.MathDecider.
         *
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): math.js (settings/math.js)
         */
        GameStartr.prototype.resetMathDecider = function (GameStarter, customs) {
            GameStarter.MathDecider = new MathDecidr.MathDecidr(GameStarter.settings.math);
        };
        /**
         * Sets this.ModAttacher.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         * @remarks Requirement(s): mods.js (settings/mods.js)
         */
        GameStartr.prototype.resetModAttacher = function (GameStarter, customs) {
            GameStarter.ModAttacher = new ModAttachr.ModAttachr(GameStarter.proliferate({
                "scopeDefault": GameStarter,
                "ItemsHoldr": GameStarter.ItemsHolder
            }, GameStarter.settings.mods));
        };
        /**
         * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
         * is fired.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         */
        GameStartr.prototype.startModAttacher = function (GameStarter, customs) {
            var mods = customs.mods, i;
            if (mods) {
                for (i in mods) {
                    if (mods.hasOwnProperty(i) && mods[i]) {
                        GameStarter.ModAttacher.enableMod(i);
                    }
                }
            }
            GameStarter.ModAttacher.fireEvent("onReady", GameStarter, GameStarter);
        };
        /**
         * Resets the parent HTML container. Width and height are set by customs,
         * and canvas, ItemsHolder, and TouchPassr container elements are added.
         *
         * @param {GameStartr} GameStarter
         * @param {Object} customs
         */
        GameStartr.prototype.resetContainer = function (GameStarter, customs) {
            GameStarter.container = GameStarter.createElement("div", {
                "className": "EightBitter",
                "style": GameStarter.proliferate({
                    "position": "relative",
                    "width": customs.width + "px",
                    "height": customs.height + "px"
                }, customs.style)
            });
            GameStarter.canvas = GameStarter.createCanvas(customs.width, customs.height);
            GameStarter.PixelDrawer.setCanvas(GameStarter.canvas);
            GameStarter.container.appendChild(GameStarter.canvas);
            GameStarter.TouchPasser.setParentContainer(GameStarter.container);
        };
        /* Global manipulations
        */
        /**
         * Scrolls the game window by shifting all Things and checking for quadrant
         * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
         *
         * @this {EightBittr}
         * @param {Number} dx   How far to scroll horizontally.
         * @param {Number} [dy]   How far to scroll vertically.
         */
        GameStartr.prototype.scrollWindow = function (dx, dy) {
            var GameStarter = GameStartr.prototype.ensureCorrectCaller(this);
            dx = dx | 0;
            dy = dy | 0;
            if (!dx && !dy) {
                return;
            }
            GameStarter.MapScreener.shift(dx, dy);
            GameStarter.shiftAll(-dx, -dy);
            GameStarter.QuadsKeeper.shiftQuadrants(-dx, -dy);
        };
        /**
         * Scrolls everything but a single Thing.
         *
         *
         * @this {EightBittr}
         * @param {Thing} thing
         * @param {Number} dx   How far to scroll horizontally.
         * @param {Number} [dy]   How far to scroll vertically.
         */
        GameStartr.prototype.scrollThing = function (thing, dx, dy) {
            var saveleft = thing.left, savetop = thing.top;
            thing.GameStarter.scrollWindow(dx, dy);
            thing.GameStarter.setLeft(thing, saveleft);
            thing.GameStarter.setTop(thing, savetop);
        };
        /**
         * Spawns all Things within a given area that should be there.
         *
         * @param {GameStartr} GameStarter
         * @param {String} direction
         * @param {Number} top
         * @param {Number} right
         * @param {Number} bottom
         * @param {Number} left
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        GameStartr.prototype.onAreaSpawn = function (GameStarter, direction, top, right, bottom, left) {
            GameStarter.MapsHandler.spawnMap(direction, (top + GameStarter.MapScreener.top) / GameStarter.unitsize, (right + GameStarter.MapScreener.left) / GameStarter.unitsize, (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize, (left + GameStarter.MapScreener.left) / GameStarter.unitsize);
        };
        /**
         * "Unspawns" all Things within a given area that should be gone by marking
         * their PreThings as not in game.
         *
         * @param {GameStartr} GameStarter
         * @param {String} direction
         * @param {Number} top
         * @param {Number} right
         * @param {Number} bottom
         * @param {Number} left
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        GameStartr.prototype.onAreaUnspawn = function (GameStarter, direction, top, right, bottom, left) {
            GameStarter.MapsHandler.unspawnMap(direction, (top + GameStarter.MapScreener.top) / GameStarter.unitsize, (right + GameStarter.MapScreener.left) / GameStarter.unitsize, (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize, (left + GameStarter.MapScreener.left) / GameStarter.unitsize);
        };
        /**
         * Adds a new Thing to the game at a given position, relative to the top
         * left corner of the screen.
         *
         * @param {Mixed} thingRaw   What type of Thing to add. This may be a String of
         *                           the class title, an Array containing the String
         *                           and an Object of settings, or an actual Thing.
         * @param {Number} [left]   Defaults to 0.
         * @param {Number} [top]   Defaults to 0.
         */
        GameStartr.prototype.addThing = function (thingRaw, left, top) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            var thing;
            if (typeof thingRaw === "string" || thingRaw instanceof String) {
                thing = this.ObjectMaker.make(thingRaw);
            }
            else if (thingRaw.constructor === Array) {
                thing = this.ObjectMaker.make.apply(this.ObjectMaker, thingRaw);
            }
            else {
                thing = thingRaw;
            }
            if (arguments.length > 2) {
                thing.GameStarter.setLeft(thing, left);
                thing.GameStarter.setTop(thing, top);
            }
            else if (arguments.length > 1) {
                thing.GameStarter.setLeft(thing, left);
            }
            thing.GameStarter.updateSize(thing);
            thing.GameStarter.GroupHolder.getFunctions().add[thing.groupType](thing);
            thing.placed = true;
            // This will typically be a TimeHandler.cycleClass call
            if (thing.onThingAdd) {
                thing.onThingAdd(thing);
            }
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            // This will typically be a spawn* call
            if (thing.onThingAdded) {
                thing.onThingAdded(thing);
            }
            thing.GameStarter.ModAttacher.fireEvent("onAddThing", thing, left, top);
            return thing;
        };
        /**
         * Processes a Thing so that it is ready to be placed in gameplay. There are
         * a lot of steps here: width and height must be set with defaults and given
         * to spritewidth and spriteheight, a quadrants Array must be given, the
         * sprite must be set, attributes and onThingMake called upon, and initial
         * class cycles and flipping set.
         *
         * @param {Thing} thing
         * @param {String} title   What type Thing this is (the name of the class).
         * @param {Object} [settings]   Additional settings to be given to the
         *                              Thing.
         * @param {Object} defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        GameStartr.prototype.thingProcess = function (thing, title, settings, defaults) {
            var maxQuads = 4, num, cycle;
            // If the Thing doesn't specify its own title, use the type by default
            thing.title = thing.title || title;
            // If a width/height is provided but no spritewidth/height,
            // use the default spritewidth/height
            if (thing.width && !thing.spritewidth) {
                thing.spritewidth = defaults.spritewidth || defaults.width;
            }
            if (thing.height && !thing.spriteheight) {
                thing.spriteheight = defaults.spriteheight || defaults.height;
            }
            // Each thing has at least 4 maximum quadrants for the QuadsKeepr
            num = Math.floor(thing.width * (thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantWidth()));
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            num = Math.floor(thing.height * thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantHeight());
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            thing.maxquads = maxQuads;
            thing.quadrants = new Array(maxQuads);
            // Basic sprite information
            thing.spritewidth = thing.spritewidth || thing.width;
            thing.spriteheight = thing.spriteheight || thing.height;
            // Sprite sizing
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;
            // Canvas, context, imageData
            thing.canvas = thing.GameStarter.createCanvas(thing.spritewidthpixels, thing.spriteheightpixels);
            thing.context = thing.canvas.getContext("2d");
            thing.imageData = thing.context.getImageData(0, 0, thing.spritewidthpixels, thing.spriteheightpixels);
            if (thing.opacity !== 1) {
                thing.GameStarter.setOpacity(thing, thing.opacity);
            }
            // Attributes, such as Koopa.smart
            if (thing.attributes) {
                thing.GameStarter.thingProcessAttributes(thing, thing.attributes);
            }
            // Important custom functions
            if (thing.onThingMake) {
                thing.onThingMake(thing, settings);
            }
            // Initial class / sprite setting
            thing.GameStarter.setSize(thing, thing.width, thing.height);
            thing.GameStarter.setClassInitial(thing, thing.name || thing.title);
            // Sprite cycles
            if (thing.spriteCycle) {
                cycle = thing.spriteCycle;
                thing.GameStarter.TimeHandler.addClassCycle(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }
            if (cycle = thing.spriteCycleSynched) {
                thing.GameStarter.TimeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }
            // flipHoriz and flipVert initially 
            if (thing.flipHoriz) {
                thing.GameStarter.flipHoriz(thing);
            }
            if (thing.flipVert) {
                thing.GameStarter.flipVert(thing);
            }
            // Mods!
            thing.GameStarter.ModAttacher.fireEvent("onThingMake", thing.GameStarter, thing, title, settings, defaults);
        };
        /**
         * Processes additional Thing attributes. For each attribute the Thing's
         * class says it may have, if it has it, the attribute's key is appeneded to
         * the Thing's name and the attribute value proliferated onto the Thing.
         *
         * @param {Thing} thing
         * @param {Object} attributes
         */
        GameStartr.prototype.thingProcessAttributes = function (thing, attributes) {
            var attribute;
            // For each listing in the attributes...
            for (attribute in attributes) {
                // If the thing has that attribute as true:
                if (thing[attribute]) {
                    // Add the extra options
                    thing.GameStarter.proliferate(thing, attributes[attribute]);
                    // Also add a marking to the name, which will go into the className
                    if (thing.name) {
                        thing.name += " " + attribute;
                    }
                    else {
                        thing.name = thing.title + " " + attribute;
                    }
                }
            }
        };
        /**
         * Runs through commands generated by a WorldSeedr and evaluates all of
         * to create PreThings via MapsCreator.analyzePreSwitch.
         *
         * @param {GameStartr} GameStarter
         * @param {Object[]} generatedCommands   The commands generated by a
         *                                       WorldSeedr.generateFull call.
         */
        GameStartr.prototype.mapPlaceRandomCommands = function (GameStarter, generatedCommands) {
            var MapsCreator = GameStarter.MapsCreator, MapsHandler = GameStarter.MapsHandler, prethings = MapsHandler.getPreThings(), area = MapsHandler.getArea(), map = MapsHandler.getMap(), command, output, i;
            for (i = 0; i < generatedCommands.length; i += 1) {
                command = generatedCommands[i];
                output = {
                    "thing": command.title,
                    "x": command.left,
                    "y": command.top
                };
                if (command.arguments) {
                    GameStarter.proliferateHard(output, command.arguments, true);
                }
                MapsCreator.analyzePreSwitch(output, prethings, area, map);
            }
        };
        /**
         * Triggered Function for when the game is unpaused. Music resumes, and
         * the mod event is fired.
         *
         * @param {GameStartr} GameStartr
         */
        GameStartr.prototype.onGamePlay = function (GameStarter) {
            GameStarter.AudioPlayer.resumeAll();
            GameStarter.ModAttacher.fireEvent("onGamePlay");
        };
        /**
         * Triggered Function for when the game is paused. Music stops, and the
         * mod event is fired.
         *
         * @param {GameStartr} GameStartr
         */
        GameStartr.prototype.onGamePause = function (GameStarter) {
            GameStarter.AudioPlayer.pauseAll();
            GameStarter.ModAttacher.fireEvent("onGamePause");
        };
        /**
         * Checks whether inputs can be fired, which by default is always true.
         *
         * @param {GameStartr} GameStartr
         */
        GameStartr.prototype.canInputsTrigger = function (GameStarter) {
            return true;
        };
        /**
         * Generic Function to start the game. Nothing actually happens here.
         */
        GameStartr.prototype.gameStart = function () {
            this.ModAttacher.fireEvent("onGameStart");
        };
        /* Physics & similar
        */
        /**
         * Generically kills a Thing by setting its alive to false, hidden to true,
         * and clearing its movement.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.killNormal = function (thing) {
            if (!thing) {
                return;
            }
            thing.alive = false;
            thing.hidden = true;
            thing.movement = undefined;
        };
        /**
         * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
         * to redraw the Thing and its quadrant.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.markChanged = function (thing) {
            thing.changed = true;
        };
        /**
         * Shifts a Thing vertically using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} dy
         * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
         *                                 changed (by default, false).
         */
        GameStartr.prototype.shiftVert = function (thing, dy, notChanged) {
            EightBittr.EightBittr.prototype.shiftVert(thing, dy);
            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Shifts a Thing horizontally using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} dx
         * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
         *                                 changed (by default, false).
         */
        GameStartr.prototype.shiftHoriz = function (thing, dx, notChanged) {
            EightBittr.EightBittr.prototype.shiftHoriz(thing, dx);
            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Sets a Thing's top using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} top
         */
        GameStartr.prototype.setTop = function (thing, top) {
            EightBittr.EightBittr.prototype.setTop(thing, top);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Sets a Thing's right using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} right
         */
        GameStartr.prototype.setRight = function (thing, right) {
            EightBittr.EightBittr.prototype.setRight(thing, right);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} bottom
         */
        GameStartr.prototype.setBottom = function (thing, bottom) {
            EightBittr.EightBittr.prototype.setBottom(thing, bottom);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Sets a Thing's left using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} left
         */
        GameStartr.prototype.setLeft = function (thing, left) {
            EightBittr.EightBittr.prototype.setLeft(thing, left);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Shifts a thing both horizontally and vertically. If the Thing marks
         * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
         * proportion of movement is respected (.5 = half, etc.).
         *
         * @param {Thing} thing
         * @param {Number} dx
         * @param {Number} dy
         * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
         *                                 changed (by default, false).
         */
        GameStartr.prototype.shiftBoth = function (thing, dx, dy, notChanged) {
            dx = dx || 0;
            dy = dy || 0;
            if (!thing.noshiftx) {
                if (thing.parallaxHoriz) {
                    thing.GameStarter.shiftHoriz(thing, thing.parallaxHoriz * dx, notChanged);
                }
                else {
                    thing.GameStarter.shiftHoriz(thing, dx, notChanged);
                }
            }
            if (!thing.noshifty) {
                if (thing.parallaxVert) {
                    thing.GameStarter.shiftVert(thing, thing.parallaxVert * dy, notChanged);
                }
                else {
                    thing.GameStarter.shiftVert(thing, dy, notChanged);
                }
            }
        };
        /**
         * Calls shiftBoth on all members of an Array.
         *
         * @param {Number} dx
         * @param {Number} dy
         * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
         *                                 changed (by default, false).
         */
        GameStartr.prototype.shiftThings = function (things, dx, dy, notChanged) {
            for (var i = things.length - 1; i >= 0; i -= 1) {
                things[i].GameStarter.shiftBoth(things[i], dx, dy, notChanged);
            }
        };
        /**
         * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
         *
         * @this {EightBittr}
         * @param {Number} dx
         * @param {Number} dy
         */
        GameStartr.prototype.shiftAll = function (dx, dy) {
            var GameStarter = GameStartr.prototype.ensureCorrectCaller(this);
            GameStarter.GroupHolder.callAll(GameStarter, GameStarter.shiftThings, dx, dy, true);
        };
        /**
         * Sets the width and unitwidth of a Thing, and optionally updates the
         * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} width
         * @param {Boolean} [updateSprite]   Whether to update the Thing's
         *                                   spritewidth and spritewidthpixels (by
         *                                   default, false).
         * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
         *                                 (by default, false).
         */
        GameStartr.prototype.setWidth = function (thing, width, updateSprite, updateSize) {
            thing.width = width;
            thing.unitwidth = width * thing.GameStarter.unitsize;
            if (updateSprite) {
                thing.spritewidth = width;
                thing.spritewidthpixels = width * thing.GameStarter.unitsize;
            }
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Sets the height and unitheight of a Thing, and optionally updates the
         * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param {Thing} thing
         * @param {Number} height
         * @param {Boolean} [updateSprite]   Whether to update the Thing's
         *                                   spriteheight and spriteheightpixels (by
         *                                   default, false).
         * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
         *                                 (by default, false).
         */
        GameStartr.prototype.setHeight = function (thing, height, updateSprite, updateSize) {
            thing.height = height;
            thing.unitheight = height * thing.GameStarter.unitsize;
            if (updateSprite) {
                thing.spriteheight = height;
                thing.spriteheightpixels = height * thing.GameStarter.unitsize;
            }
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Utility to call both setWidth and setHeight on a Thing.
         *
         * @param {Thing} thing
         * @param {Number} width
         * @param {Number} height
         * @param {Boolean} [updateSprite]   Whether to update the Thing's
         *                                   spritewidth, spriteheight,
         *                                   spritewidthpixels, and
         *                                   spritspriteheightpixels (by default,
         *                                   false).
         * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
         *                                 (by default, false).
         */
        GameStartr.prototype.setSize = function (thing, width, height, updateSprite, updateSize) {
            thing.GameStarter.setWidth(thing, width, updateSprite, updateSize);
            thing.GameStarter.setHeight(thing, height, updateSprite, updateSize);
        };
        /**
         * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
         * shiftHoriz and shiftVert.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.updatePosition = function (thing) {
            thing.GameStarter.shiftHoriz(thing, thing.xvel);
            thing.GameStarter.shiftVert(thing, thing.yvel);
        };
        /**
         * Completely updates the size measurements of a Thing. That means the
         * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
         * spriteheightpixels attributes. The Thing's sprite is then updated by the
         * PixelDrawer, and its appearance is marked as changed.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.updateSize = function (thing) {
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;
            thing.canvas.width = thing.spritewidthpixels;
            thing.canvas.height = thing.spriteheightpixels;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Reduces a Thing's width by pushing back its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param {Thing} thing
         * @param {Number} dx
         * @param {Boolean} [updateSize]   Whether to also call updateSize on the
         *                                 Thing (by default, false).
         */
        GameStartr.prototype.reduceWidth = function (thing, dx, updateSize) {
            thing.right -= dx;
            thing.width -= dx / thing.GameStarter.unitsize;
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            else {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param {Thing} thing
         * @param {Number} dy
         * @param {Boolean} [updateSize]   Whether to also call updateSize on the
         *                                 Thing (by default, false).
         */
        GameStartr.prototype.reduceHeight = function (thing, dy, updateSize) {
            thing.top += dy;
            thing.height -= dy / thing.GameStarter.unitsize;
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            else {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param {Thing} thing
         * @param {Number} dy
         * @param {Boolean} [updateSize]   Whether to also call updateSize on the
         *                                 Thing (by default, false).
         */
        GameStartr.prototype.increaseHeight = function (thing, dy, updateSize) {
            thing.top -= dy;
            thing.height += dy / thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            else {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Increases a Thing's width by pushing forward its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param {Thing} thing
         * @param {Number} dx
         * @param {Boolean} [updateSize]   Whether to also call updateSize on the
         *                                 Thing (by default, false).
         */
        GameStartr.prototype.increaseWidth = function (thing, dx, updateSize) {
            thing.right += dx;
            thing.width += dx / thing.GameStarter.unitsize;
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;
            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }
            else {
                thing.GameStarter.markChanged(thing);
            }
        };
        /**
         * Completely pauses a Thing by setting its velocities to zero and disabling
         * it from falling, colliding, or moving. Its old attributes for those are
         * saved so thingResumeVelocity may restore them.
         *
         * @param {Thing} thing
         * @param {Boolean} [keepMovement]   Whether to keep movement instead of
         *                                   wiping it (by default, false).
         */
        GameStartr.prototype.thingPauseVelocity = function (thing, keepMovement) {
            thing.xvelOld = thing.xvel || 0;
            thing.yvelOld = thing.yvel || 0;
            thing.nofallOld = thing.nofall || false;
            thing.nocollideOld = thing.nocollide || false;
            thing.movementOld = thing.movement || thing.movementOld;
            thing.nofall = thing.nocollide = true;
            thing.xvel = thing.yvel = 0;
            if (!keepMovement) {
                thing.movement = undefined;
            }
        };
        /**
         * Resumes a Thing's velocity and movements after they were paused by
         * thingPauseVelocity.
         *
         * @param {Thing} thing
         * @param {Boolean} [noVelocity]   Whether to skip restoring the Thing's
         *                                 velocity (by default, false).
         */
        GameStartr.prototype.thingResumeVelocity = function (thing, noVelocity) {
            if (!noVelocity) {
                thing.xvel = thing.xvelOld || 0;
                thing.yvel = thing.yvelOld || 0;
            }
            thing.movement = thing.movementOld || thing.movement;
            thing.nofall = thing.nofallOld || false;
            thing.nocollide = thing.nocollideOld || false;
        };
        /* Appearance utilities
        */
        /**
         * Generates a key for a Thing based off the current area and the Thing's
         * basic attributes. This key should be used for PixelRender.get calls, to
         * cache the Thing's sprite.
         *
         * @param {Thing} thing
         * @return {String} A key that to identify the Thing's sprite.
         */
        GameStartr.prototype.generateObjectKey = function (thing) {
            return thing.GameStarter.MapsHandler.getArea().setting
                + " " + thing.groupType + " "
                + thing.title + " " + thing.className;
        };
        /**
         * Sets the class of a Thing, sets the new sprite for it, and marks it as
         * having changed appearance. The class is stored in the Thing's internal
         * .className attribute.
         *
         * @param {Thing} thing
         * @param {String} className   The new internal .className for the Thing.
         */
        GameStartr.prototype.setClass = function (thing, className) {
            thing.className = className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * A version of setClass to be used before the Thing's sprite attributes
         * have been set. This just sets the internal .className.
         *
         * @param {Thing} thing
         * @param {String} className   The new internal .className for the Thing.
         */
        GameStartr.prototype.setClassInitial = function (thing, className) {
            thing.className = className;
        };
        /**
         * Adds a string to a Thing's class after a ' ', updates the Thing's
         * sprite, and marks it as having changed appearance.
         *
         * @param {Thing} thing
         * @param {String} className
         */
        GameStartr.prototype.addClass = function (thing, className) {
            thing.className += " " + className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        };
        /**
         * Adds multiple strings to a Thing's class after a " ", updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.addClasses = function (thing) {
            var classes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classes[_i - 1] = arguments[_i];
            }
            var adder, i, j;
            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];
                if (adder.constructor === String || typeof adder === "string") {
                    adder = adder.split(" ");
                }
                for (j = adder.length - 1; j >= 0; j -= 1) {
                    thing.GameStarter.addClass(thing, adder[j]);
                }
            }
        };
        /**
         * Removes a string from a Thing's class, updates the Thing's sprite, and
         * marks it as having changed appearance.
         *
         * @param {Thing} thing
         * @param {String} className
         */
        GameStartr.prototype.removeClass = function (thing, className) {
            if (!className) {
                return;
            }
            if (className.indexOf(" ") !== -1) {
                thing.GameStarter.removeClasses(thing, className);
            }
            thing.className = thing.className.replace(new RegExp(" " + className, "gm"), "");
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
        };
        /**
         * Removes multiple strings from a Thing's class, updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param {Thing} thing
         */
        GameStartr.prototype.removeClasses = function (thing) {
            var classes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classes[_i - 1] = arguments[_i];
            }
            var adder, i, j;
            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];
                if (adder.constructor === String || typeof adder === "string") {
                    adder = adder.split(" ");
                }
                for (j = adder.length - 1; j >= 0; --j) {
                    thing.GameStarter.removeClass(thing, adder[j]);
                }
            }
        };
        /**
         * @param {Thing} thing
         * @param {String} className
         * @return {Boolean} Whether the Thing's class contains the String.
         */
        GameStartr.prototype.hasClass = function (thing, className) {
            return thing.className.indexOf(className) !== -1;
        };
        /**
         * Removes the first class from a Thing and adds the second. All typical
         * sprite updates are called.
         *
         * @param {Thing} thing
         * @param {String} classNameOut
         * @param {String} classNameIn
         */
        GameStartr.prototype.switchClass = function (thing, classNameOut, classNameIn) {
            thing.GameStarter.removeClass(thing, classNameOut);
            thing.GameStarter.addClass(thing, classNameIn);
        };
        /**
         * Marks a Thing as being flipped horizontally by setting its .flipHoriz
         * attribute to true and giving it a "flipped" class.
         *
         * @param {Thing}
         */
        GameStartr.prototype.flipHoriz = function (thing) {
            thing.flipHoriz = true;
            thing.GameStarter.addClass(thing, "flipped");
        };
        /**
         * Marks a Thing as being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param {Thing}
         */
        GameStartr.prototype.flipVert = function (thing) {
            thing.flipVert = true;
            thing.GameStarter.addClass(thing, "flip-vert");
        };
        /**
         * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
         * attribute to false and giving it a "flipped" class.
         *
         * @param {Thing}
         */
        GameStartr.prototype.unflipHoriz = function (thing) {
            thing.flipHoriz = false;
            thing.GameStarter.removeClass(thing, "flipped");
        };
        /**
         * Marks a Thing as not being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param {Thing}
         */
        GameStartr.prototype.unflipVert = function (thing) {
            thing.flipVert = false;
            thing.GameStarter.removeClass(thing, "flip-vert");
        };
        /**
         * Sets the opacity of the Thing and marks its appearance as changed.
         *
         * @param {Thing} thing
         * @param {Number} opacity   A number in [0,1].
         */
        GameStartr.prototype.setOpacity = function (thing, opacity) {
            thing.opacity = opacity;
            thing.GameStarter.markChanged(thing);
        };
        /* Miscellaneous utilities
        */
        /**
         * Ensures the current object is a GameStartr by throwing an error if it
         * is not. This should be used for functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         *
         * @param {Mixed} current
         */
        GameStartr.prototype.ensureCorrectCaller = function (current) {
            if (!(current instanceof GameStartr)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated GameStartr object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        };
        /**
         * Removes a Thing from an Array using Array.splice. If the thing has an
         * onDelete, that is called.
         *
         * @param {Thing} thing
         * @param {Array} array
         * @param {Number} [location]   The index of the Thing in the Array, for
         *                              speed's sake (by default, it is found
         *                              using Array.indexOf).
         */
        GameStartr.prototype.arrayDeleteThing = function (thing, array, location) {
            if (location === void 0) { location = array.indexOf(thing); }
            if (location === -1) {
                return;
            }
            array.splice(location, 1);
            if (typeof (thing.onDelete) === "function") {
                thing.onDelete(thing);
            }
        };
        /**
         * Takes a snapshot of the current screen canvas by simulating a click event
         * on a dummy link.
         *
         * @param {String} name   A name for the image to be saved as.
         * @param {String} [format]   A format for the image to be saved as (by
         *                            default, "png").
         * @remarks For security concerns, browsers won't allow this unless it's
         *          called within a callback of a genuine user-triggered event.
         */
        GameStartr.prototype.takeScreenshot = function (name, format) {
            if (format === void 0) { format = "image/png"; }
            var GameStarter = GameStartr.prototype.ensureCorrectCaller(this), link = GameStarter.createElement("a", {
                "download": name + "." + format.split("/")[1],
                "href": GameStarter.canvas.toDataURL(format).replace(format, "image/octet-stream")
            });
            link.click();
        };
        /**
         *
         */
        GameStartr.prototype.addPageStyles = function (styles) {
            var GameStarter = GameStartr.prototype.ensureCorrectCaller(this), sheet = GameStarter.createElement("style", {
                "type": "text/css"
            }), compiled = "", i, j;
            for (i in styles) {
                if (!styles.hasOwnProperty(i)) {
                    continue;
                }
                compiled += i + " { \r\n";
                for (j in styles[i]) {
                    if (styles[i].hasOwnProperty(j)) {
                        compiled += "  " + j + ": " + styles[i][j] + ";\r\n";
                    }
                }
                compiled += "}\r\n";
            }
            if (sheet.styleSheet) {
                sheet.style.cssText = compiled;
            }
            else {
                sheet.appendChild(document.createTextNode(compiled));
            }
            document.querySelector("head").appendChild(sheet);
        };
        return GameStartr;
    })(EightBittr.EightBittr);
    GameStartr_1.GameStartr = GameStartr;
})(GameStartr || (GameStartr = {}));
