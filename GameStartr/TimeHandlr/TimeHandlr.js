/**
 * TimeHandlr.js
 * 
 * A timed events library intended to provide a flexible alternative to 
 * setTimeout and setInterval that respects pauses and resumes. Events (which 
 * are really Functions with arguments pre-set) are assigned integer timestamps,
 * and can be set to repeat a number of times determined by a number or callback
 * Function. Functionality to automatically "cycle" between certain classes of
 * an Object is also provided, similar to jQuery's class toggling.
 * 
 * @example
 * // Using a TimeHandler to simulate setTimeout (albeit slowly).
 * var TimeHandler = new TimeHandlr();
 * TimeHandler.addEvent(console.log.bind(console), 500, "Hello world!");
 * setInterval(TimeHandler.handleEvents);
 * 
 * @example
 * // Using a TimeHandler to simulate setInterval (albeit slowly) seven times.
 * var TimeHandler = new TimeHandlr();
 * TimeHandler.addEventInterval(
 *     console.log.bind(console), 500, 7, "Hello world!"
 * );
 * setInterval(TimeHandler.handleEvents);
 * 
 * @example
 * // Using a TimeHandler to continuously toggle an element's class between
 * // "active" and "hidden" every second.
 * var TimeHandler = new TimeHandlr();
 * TimeHandler.addClassCycle(
 *     document.getElementById("test"),
 *     [ "active", "hidden" ],
 *     "toggling",
 *     1
 * );
 * setInterval(TimeHandler.handleEvents, 1000);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function TimeHandlr(settings) {
    "use strict";
    if (!this || this === window) {
        return new TimeHandlr(settings);
    }
    var self = this,

        // The current (most recently reached) game time
        time,

        // An int->event hash table of events to be run
        events,

        // Default time separations
        timingDefault,

        // Default attribute names, so they can be overridden
        keyCycles,
        keyClassName,
        keyOnSpriteCycleStart,
        keyDoSpriteCycleStart,
        keyCycleCheckValidity,

        // Whether a copy of settings should be made in setSpriteCycle
        copyCycleSettings,

        // Function handlers
        addClass,
        removeClass;
    
    /**
     * 
     */
    self.reset = function (settings) {
        time = 0;
        events = {};

        timingDefault = settings.timingDefault || 7;

        keyCycles = settings.keyCycles || "cycles";
        keyClassName = settings.keyClassName || "className";
        keyOnSpriteCycleStart = settings.keyOnSpriteCycleStart || "onSpriteCycleStart";
        keyDoSpriteCycleStart = settings.keyDoSpriteCycleStart || "doSpriteCycleStart";
        keyCycleCheckValidity = settings.keyCycleCheckValidity;
        
        copyCycleSettings = typeof settings.copyCycleSettings === "undefined"
            ? true : settings.copyCycleSettings;

        addClass = settings.classAdd || addClassGeneric;
        removeClass = settings.classRemove || removeClassGeneric;
    }

    
    /* Simple gets
    */
     
    /**
     * @return {Number} The current time.
     */
    self.getTime = function () {
        return time;
    };
    
    /**
     * @return {Object} The catalog of events, keyed by their time triggers.
     */
    self.getEvents = function () {
        return events;
    };

    
    /* Event adding
    */
    
    /**
     * Basic container for events information. These are stored in the events
     * Object, keyed by time.
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
    function Event(callback, timeDelay, timeRepeat, args, repeat) {
        this.callback = callback;
        this.timeDelay = timeDelay;
        this.timeRepeat = timeRepeat;
        this.args = args;
        this.repeat = repeat;
    }

    /**
     * Adds an event in a manner similar to setTimeout, though any arguments 
     * past the timeDelay will be passed to the event callback. The added event
     * is inserted into the events container and is set to only repeat once.
     * 
     * @param {Function} callback   The callback to be run after some time.
     * @param {Number} [timeDelay]   How long from now to run the callback, (1
     *                               by default).
     * @example
     * // Scheduling a console log 7 steps in the future two different ways.
     * TimeHandler.addEvent(console.log.bind(console, "Hello"), 7);
     * TimeHandler.addEvent(console.log.bind(console), 7, "world!");
     */
    self.addEvent = function (callback, timeDelay) {
        var event, args;
        
        // Make sure callback is actually a function
        if (typeof callback !== "function") {
            throw new Error("Invalid event given to addEvent.");
        }
        
        timeDelay = timeDelay || 1;

        // Arguments exclude callback and timeDelay
        args = Array.prototype.slice.call(arguments, 2);

        // Add the event to events, then return it
        event = new Event(callback, time + timeDelay, timeDelay, args, 1);
        insertEvent(event, event.timeDelay);
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
     * @example 
     * // Scheduling console logs 1ms apart 7 times, two different ways.
     * TimeHandler.addEventInterval(console.log.bind(console, "Hello"), 1, 7);
     * TimeHandler.addEventInterval(console.log.bind(console), 1, 7, "world!");
     */
    self.addEventInterval = function (callback, timeDelay, numRepeats) {
        var event, args;
        
        // Make sure callback is actually a function
        if (typeof callback !== "function") {
            throw new Error("Invalid event given to addEventInterval.");
        }
        
        timeDelay = timeDelay || 1;
        numRepeats = numRepeats || 1;

        // Arguments exclude callback, timeDelay, and numRepeats
        args = Array.prototype.slice.call(arguments, 3);

        // Add the event to events, then return it
        // It may need to have a reference to the event from the function
        event = new Event(callback, time + timeDelay, timeDelay, args, numRepeats);
        callback.event = event;
        insertEvent(event, event.timeDelay);
        return event;
    };
    
    /**
     * Fancy wrapper around self.addEventInterval. It delays starting the event
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
     *                        block example, this would be the block itself.
     * @param {Mixed} settings   A container for repetition settings. This
     *                           appears to only require a .length Number
     *                           attribute, to calculate the time until launch.
     *                           In the block example, this would be an Array
     *                           containing the ordered sprite names of the 
     *                           block (dim, medium, etc.).
     * @example
     * // Adding a synched sprite cycle for a Mario-style block.
     * TimeHandler.addEventIntervalSynched(
     *     function (thing, sprites) {
     *         console.log("Should be", sprites[thing.spriteNum]);
     *         thing.spriteNum = (thing.spriteNum += 1) % sprites.length;
     *     },
     *     7,
     *     Infinity,
     *     { "thing": "Block", "spriteNum": 0 },
     *     [ "dim", "medium", "high", "high", "medium", "dim" ]
     * );
     * 
     * @todo Rearrange this and setSpriteCycle to remove the "thing" argument.
     */
    self.addEventIntervalSynched = function (callback, timeDelay, numRepeats, thing, settings) {
        var calctime = timeDelay * settings.length,
            entryTime = Math.ceil(time / calctime) * calctime,
            scope = self,
            args = arguments,
            adder = Function.apply.bind(self.addEventInterval, scope, args);
        
        timeDelay = timeDelay || 1;
        numRepeats = numRepeats || 1;
        
        // If there's no difference in times, you're good to go
        if (entryTime === time) {
            return adder();
        }
        // Otherwise it should be delayed until the time is right
       self.addEvent(adder, entryTime - time, scope, arguments, thing);
    };

    
    /* General event handling
    */

    /**
     * Meaty often-called function to increment time and handle all events at
     * the new time. For each event, its callback is run, and if that returned
     * true, or the event's .repeat Number runs out, the event stops repeating.
     */
    self.handleEvents = function () {
        var currentEvents, event, length, i;
        
        time += 1;
        currentEvents = events[time];
        
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

                // If repeat is a function, running it determines whether to repeat
                if (event.repeat instanceof Function) {
                    // This is where the event's callback is actually run!
                    if (event.repeat.call(event)) {
                        event.count += event.timeRepeat;
                        insertEvent(event, event.timeDelay);
                    }
                }
                // It's a Number: decrement it, and repeat if it's > 0.
                else {
                    event.repeat -= 1;
                    if (event.repeat > 0) {
                        event.timeDelay += event.timeRepeat;
                        insertEvent(event, event.timeDelay);
                    }
                }
            }
        }

        // Once all these events are done, ignore the memory
        delete events[time];
    };

    /**
     * Cancels an event by making its .repeat value 0.
     * 
     * @param {Event} event   The event to cancel.
     */
    self.cancelEvent = function (event) {
        event.repeat = 0;
    };

    /**
     * Cancels all events by clearing the events Object.
     */
    self.cancelAllEvents = function () {
        events = {};
    };

    /**
     * Cancels the class cycle of a thing by finding the cycle under the thing's
     * keyCycles and making it appear to be empty.
     * 
     * @param {Mixed} thing   The thing (any data structure) whose cycle is to 
     *                        be cancelled.
     * @param {String} name   The name of the cycle to be cancelled.
     */
    self.cancelClassCycle = function (thing, name) {
        var cycle;
        
        if (!thing[keyCycles] || !thing[keyCycles][name]) {
            return;
        }
        
        cycle = thing[keyCycles][name];
        cycle.length = 1;
        cycle[0] = false;
        
        delete thing[keyCycles][name];
    };

    /**
     * Cancels all class keyCycles of a thing under the thing's sycles.
     * 
     * @param {Mixed} thing   The thing (any data structure) whose keyCycles are to 
     *                        be cancelled.
     */
    self.cancelAllCycles = function (thing) {
        var keyCycles = thing[keyCycles],
            name, cycle;
        
        for (name in keyCycles) {
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
     * class using addClass and removeClass (which can be given by the user in
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
     * @example
     * // Adding a sprite cycle for a Mario-style block.
     * TimeHandler.addClassCycle(
     *     { "thing": "Block", "spriteNum": 0 },
     *     [ "dim", "medium", "high", "high", "medium", "dim" ],
     *     "glowing",
     *     7
     * );
     */
    self.addClassCycle = function (thing, settings, name, timing) {
        var isTimingFunction = typeof timing === "function",
            cycle;
        
        // Make sure the object has a holder for keyCycles...
        if (!thing[keyCycles]) {
            thing[keyCycles] = {};
        }
        // ...and nothing previously existing for that name
        self.cancelClassCycle(thing, name);

        name = name || 0;

        // Set the cycle under thing[keyCycles][name]
        cycle = thing[keyCycles][name] = setSpriteCycle(
            thing, settings, isTimingFunction ? 0 : timing
        );

        // If there is a timing function, make it the count changer
        if (cycle.event && isTimingFunction) {
            cycle.event.count_changer = timing;
        }

        // Immediately run the first class cycle, then return
        cycleClass(thing, settings);
        return cycle;
    };

    /**
     * Adds a synched sprite cycle (settings) for a thing, to be referenced by
     * the given name in the thing's keyCycles Object, and in tune with all other
     * keyCycles of the same period. The sprite cycle switches the thing's class 
     * using addClass and removeClass (which can be given by the user in reset,
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
     * @example
     * // Adding a sprite cycle for a Mario-style block.
     * TimeHandler.addClassCycleSynched(
     *     { "thing": "Block", "spriteNum": 0 },
     *     [ "dim", "medium", "high", "high", "medium", "dim" ],
     *     "glowing",
     *     7
     * );
     */
    self.addClassCycleSynched = function (thing, settings, name, timing) {
        var cycle;
        
        // Make sure the object has a holder for keyCycles...
        if (!thing[keyCycles]) {
            thing[keyCycles] = {};
        }
        // ...and nothing previously existing for that name
        self.cancelClassCycle(thing, name);

        // Set the cycle under thing[keyCycles][name]
        name = name || 0;
        cycle = thing[keyCycles][name] = setSpriteCycle(thing, settings, timing, true);

        // Immediately run the first class cycle, then return
        cycleClass(thing, thing[keyCycles][name]);
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
     * @param {Boolean} [synched]   Whether the 
     */
    function setSpriteCycle(thing, settings, timing, synched) {
        var callback;
        
        // If required, make a copy of settings so if multiple objects are made
        // with the same settings, object, they don't override each other's
        // attributes: particularly settings.loc.
        if (copyCycleSettings) {
            settings = makeSettingsCopy(settings);
        }

        // Start off before the beginning of the cycle
        settings.loc = settings.oldclass = -1;

        // Let the object know to start the cycle when needed
        callback = synched ? self.addEventIntervalSynched : self.addEventInterval;
        thing[keyOnSpriteCycleStart] = function () {
            callback(cycleClass, timing || timingDefault, Infinity, thing, settings);
        };

        // If it should already start, do that
        if (thing[keyDoSpriteCycleStart]) {
            thing[keyOnSpriteCycleStart]();
        }

        return settings;
    }

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
    function cycleClass(thing, settings) {
        var current, name;
        
        // If anything has been invalidated, return true to stop
        if (
            !thing || !settings || !settings.length
            || (keyCycleCheckValidity && !thing[keyCycleCheckValidity])
        ) {
            return true;
        }

        // Get rid of the previous class, from settings (-1 by default)
        if (settings.oldclass !== -1 && settings.oldclass !== "") {
            removeClass(thing, settings.oldclass);
        }

        // Move to the next location in settings, as a circular list
        settings.loc = (settings.loc += 1) % settings.length;

        // Current is the sprite, bool, or function currently added and/or run
        current = settings[settings.loc];
        
        // If it isn't falsy, (run if needed and) set it as the next name
        if (current) {
            name = current instanceof Function ? current(thing, settings) : current;

            // If the next name is a string, set that as the old class, and add it
            if (typeof name === "string") {
                settings.oldclass = name;
                addClass(thing, name);
                return false;
            }
            // For non-strings, return stop if the name evaluated to be false
            else {
                return (name === false);
            }
        }
        // Since current was falsy, stop if it's explicitly === false 
        else {
            return (current === false);
        }
    }
    

    /* Utility functions
    */

    // Quick handler to add an event at a particular time
    // An array must exist so multiple events can be at the same time
    
    /**
     * Quick handler to add an event to events at a particular time. 
     * 
     * @param {Event} event
     * @param {Number} time
     */
    function insertEvent(event, time) {
        if (!events[time]) {
            events[time] = [event];
        } else {
            events[time].push(event);
        }
        return events[time];
    }

    /**
     * Creates a copy of an Object/Array. This is useful for passing settings
     * Objects by value instead of reference.
     * 
     * @param {Mixed} original
     */
    function makeSettingsCopy(original) {
        var output = new original.constructor(),
            i;
        
        for (i in original) {
            if (original.hasOwnProperty(i)) {
                output[i] = original[i];
            }
        }
        
        return output;
    }

    /**
     * Default addClass Function, made to work on HTML elements.
     * 
     * @param {Mixed} element   The element whose class is being modified.
     * @param {String} string   The string to be added to the element's class.
     */
    function addClassGeneric(element, string) {
        element[keyClassName] += ' ' + string;
    }

    /**
     * Default removeClass Function, made to work on HTML elements.
     * 
     * @param {Mixed} element   The element whose class is being modified.
     * @param {String} string   The string to be removed from the element's 
     *                          class.
     */
    function removeClassGeneric(element, string) {
        element[keyClassName] = element[keyClassName].replace(string, '');
    }

    
    self.reset(settings || {});
}