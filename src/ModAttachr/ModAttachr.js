/**
 * ModAttachr.js
 * 
 * An addon for for extensible modding functionality. "Mods" register triggers
 * such as "onModEnable" or "onReset" that can be triggered.
 * 
 * @example
 * // Creating and using a ModAttachr to log event activity.
 * var ModAttacher = new ModAttachr({
 *     "mods": [{
 *         "name": "Testing Mod",
 *         "description": "A mod used for testing a ModAttachr.",
 *         "author": {
 *             "name": "Josh Goldberg",
 *             "email": "josh@fullscreenmario.com"
 *         },
 *         "enabled": false,
 *         "events": {
 *             "onModEnable": function () {
 *                 console.log("I am enabled!");
 *             },
 *             "onModDisable": function () {
 *                 console.log("I am disabled...");
 *             },
 *             "log": function () {
 *                 console.log("You have logged me.");
 *             }
 *         }
 *     }]
 * });
 * ModAttacher.enableMod("Testing Mod"); // log: "I am enabled!"
 * ModAttacher.fireEvent("log"); // log: "You have logged me."
 * ModAttacher.disableMod("Testing Mod"); // log: "I am disabled..."
 * 
 * // Creating and using a ModAttachr to log event activity, with timestamps
 * // and numbered logs.
 * var ModAttacher = new ModAttachr({
 *     "mods": [{
 *         "name": "Testing Mod",
 *         "description": "A mod used for testing a ModAttachr.",
 *         "author": {
 *             "name": "Josh Goldberg",
 *             "email": "josh@fullscreenmario.com"
 *         },
 *         "enabled": false,
 *         "events": {
 *             "onModEnable": function () {
 *                 console.log("I am enabled!");
 *             },
 *             "onModDisable": function () {
 *                 console.log("I am disabled...");
 *             },
 *             "log": function (mod) {
 *                 var numLog = (mod.settings.numLogs += 1);
 *                 console.log("Log " + numLog + ": " + Date());
 *             }
 *         },
 *         "settings": {
 *             "numLogs": 0
 *         }
 *     }]
 * });
 * ModAttacher.enableMod("Testing Mod"); // log: "I am enabled!"
 * ModAttacher.fireEvent("log"); // log: "Log 1: Sat Dec 13 2014 21:00:14 ..."
 * ModAttacher.fireEvent("log"); // log: "Log 2: Sat Dec 13 2014 21:00:14 ..."
 * ModAttacher.disableMod("Testing Mod"); // log: "I am disabled..."
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ModAttachr(settings) {
    "use strict";
    if (this === window) {
        return new ModAttachr(settings);
    }
    var self = this,
        
        // An Object of the mods with a listing for each event
        // by event names (e.g. "onReset" => [{Mod1}, {Mod2}]
        events,
        
        // An Object of information on each mod, keyed by mod names
        // (e.g. { "MyMod": { "Name": "Mymod", "enabled": 1, ...} ...})
        mods,
        
        // A new StatsHolder object to be created to store whether each
        // mod is stored locally (optional)
        StatsHolder,
        
        // A default scope to apply mod events from (optional)
        scopeDefault;
    
    /**
     * Resets the ModAttachr.
     * 
     * @constructor
     * @param {Object[]} mods   Objects representing the new mods to be added.
     * @param {Boolean} storeLocally   Whether this should store which mods have
     *                                 been enabled in local storage via a 
     *                                 StatsHoldr (by default, false).
     * @param {Mixed} scopeDefault   An optional default scope to use for each
     *                               mod, if one isn't provided by the mod.
     */
    self.reset = function (settings) {
        mods = {};
        events = {};
        scopeDefault = settings.scopeDefault;
        
        if (settings.storeLocally) {
            StatsHolder = new settings.StatsHoldr({
                "prefix": settings.prefix,
                "proliferate": settings.proliferate,
                "createElement": settings.createElement
            });
        }
        
        if (settings.mods) {
            self.addMods(settings.mods);
        }
        
    };
    
    
    /* Simple gets 
    */
    
    /**
     * @return {Object} An Object keying each mod by their name.
     */
    self.getMods = function () {
        return mods;
    };
    
    /**
     * @return {Object} An Object keying each event by their name.
     */
    self.getEvents = function () {
        return events;
    };
    
    /**
     * @return {StatsHoldr} The StatsHoldr if storeLocally is true, or undefined
     *                      otherwise.
     */
    self.getStatsHolder = function () {
        return StatsHolder;
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
    self.addMod = function (mod) {
        var mod_events = mod.events,
            event, i;
        
        for (i in mod_events) {
            if (mod_events.hasOwnProperty(i)) {
                event = mod_events[i];
                
                if (!events.hasOwnProperty(i)) {
                    events[i] = [mod];
                } else {
                    events[i].push(mod);
                }
            }
        }
        
        mod.scope = mod.scope || scopeDefault;
        
        mods[mod.name] = mod;
        if (mod.enabled && mod.events["onModEnable"]) {
            self.fireModEvent("onModEnable", mod.name, arguments);
        }
        
        if (StatsHolder) {
            StatsHolder.addStatistic(mod.name, {
                "valueDefault": 0,
                "storeLocally": true
            });
            
            if (StatsHolder.get(mod.name)) {
                self.enableMod(mod.name);
            }
        }
    };
    
    /**
     * Adds each mod in a given Array.
     * 
     * @param {Array} mods
     */
    self.addMods = function (mods) {
        for (var i = 0; i < mods.length; i += 1) {
            self.addMod(mods[i]);
        }
    };
    
    /**
     * Enables a mod of the given name, if it exists. The onModEnable event is
     * called for the mod.
     * 
     * @param {String} name   The name of the mod to enable.
     */
    self.enableMod = function (name) {
        var mod = mods[name],
            args;
        
        if (!mod) {
            throw new Error("No mod of name: '" + name + "'");
        }
        
        mod.enabled = true;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;
        
        if (mod.events["onModEnable"]) {
            self.fireModEvent("onModEnable", mod.name, arguments);
        }
        
        if (StatsHolder) {
            StatsHolder.set(name, 1);
        }
    };
    
    /**
     * Enables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.enableMods = function () {
        for (var i = 0; i < arguments.length; i += 1) {
            if (arguments[i] instanceof Array) {
                self.enableMods(arguments[i]);
            } else {
                self.enableMod(arguments[i]);
            }
        }
    };
    
    /**
     * Disables a mod of the given name, if it exists. The onModDisable event is
     * called for the mod.
     * 
     * @param {String} name   The name of the mod to disable.
     */
    self.disableMod = function (name) {
        var mod = mods[name],
            args;
        
        if (!mods[name]) {
            throw new Error("No mod of name: '" + name + "'");
        }
        
        mods[name].enabled = false;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;
        
        if (mod.events["onModDisable"]) {
            self.fireModEvent("onModDisable", mod.name, args);
        }
        
        if (StatsHolder) {
            StatsHolder.set(name, 0);
        }
    };
    
    /**
     * Disables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.disableMods = function () {
        for (var i = 0; i < arguments.length; i += 1) {
            if (arguments[i] instanceof Array) {
                self.disableMods(arguments[i]);
            } else {
                self.disableMod(arguments[i]);
            }
        }
    };
    
    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param {String} name   The name of the mod to toggle.
     */
    self.toggleMod = function (name) {
        var mod = mods[name];
        
        if (!mod) {
            throw new Error("No mod found under " + name);
        }
        
        if (mod.enabled) {
            self.disableMod(name);
        } else {
            self.enableMod(name);
        }
    };
    
    /**
     * Toggles any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.toggleMods = function () {
        for (var i = 0; i < arguments.length; i += 1) {
            if (arguments[i] instanceof Array) {
                self.toggleMods(arguments[i]);
            } else {
                self.toggleMod(arguments[i]);
            }
        }
    };
    
    
    /* Actions
    */
    
    /**
     * Fires an event, which calls all functions listed undder mods for that 
     * event. Any number of arguments may be given.
     * 
     * @param {String} event   The name of the event to fire.
     */
    self.fireEvent = function (event) {
        var fires = events[event],
            args = Array.prototype.splice.call(arguments, 0),
            mod, i;
        
        if (!fires) {
            // console.warn("Unknown event name triggered: '" + name + "'");
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
    self.fireModEvent = function (eventName, modName) {
        var mod = mods[modName],
            args = Array.prototype.slice.call(arguments, 2),
            fires;
        
        if (!mod) {
            throw new Error("Unknown mod requested: '" + modName + "'");
        }
        
        args[0] = mod;
        fires = mod.events[eventName];
        
        if (!fires) {
            throw new Error("Mod does not contain event: '" + eventName + "'");
        }
        
        fires.apply(mod.scope, args);
    }
    
    
    self.reset(settings || {});
}