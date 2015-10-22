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
