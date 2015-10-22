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
