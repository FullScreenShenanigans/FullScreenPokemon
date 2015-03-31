/**
 * InputWritr.js
 * 
 * A general utility for automating interactions with user-called events linked
 * with callbacks. Pipe functions are available that take in user input, switch 
 * on the event code, and call the appropriate callback. These Pipe functions 
 * can be made during runtime; further utilities allow for saving and playback 
 * of input histories in JSON format.
 * 
 * @example 
 * // Creating and using an InputWritr to log keystrokes on the 'a' key.
 * var InputWriter = new InputWritr({
 *     "triggers": {
 *         "onkeydown": {
 *             "65": function () {
 *                 console.log("Hello!");
 *             }
 *         }
 *     }
 * });
 * document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
 * 
 * @example
 * // Creating and using an InputWritr to simulate WASD arrow controls.
 * var InputWriter = new InputWritr({
 *     "triggers": {
 *         "aliases": {
 *             "up": [87, 38],    // w, up
 *             "right": [68, 39], // d, right
 *             "down": [83, 40],  // s, down
 *             "left": [65, 37],  // a, left
 *         },
 *         "onkeydown": {
 *             "up": console.log.bind(console, "up"),
 *             "right": console.log.bind(console, "right"),
 *             "down": console.log.bind(console, "down"),
 *             "left": console.log.bind(console, "left"),
 *         }
 *     }
 * });
 * document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function InputWritr(settings) {
    "use strict";
    if (!this || this === window) {
        return new InputWritr(settings);
    }
    var self = this,

        // A mapping of events to their key codes to their callbacks.
        triggers,

        // Known, allowed aliases for triggers.
        aliases,

        // An Array of every action that has happened, with a timestamp.
        history,
        
        // An Array of all histories, with indices set by self.saveHistory.
        histories,

        // For compatibility, a reference to performance.now() or an equivalent.
        getTimestamp,
        
        // A starting time used for calculating playback delays in playHistory.
        startingTime,

        // An object to be passed to event calls, commonly with key information.
        // (such as "Down" => 0 }
        eventInformation,
        
        // An optional boolean callback to disable or enable input triggers.
        canTrigger,

        // Whether to record events into the history
        isRecording,
        
        // A quick lookup table of key aliases to their character codes.
        keyAliasesToCodes,
        
        // A quick lookup table of character codes to their key aliases.
        keyCodesToAliases;

    /**
     * Resests the InputWritr.
     * 
     * @constructor
     * @param {Object} triggers   The mapping of events to their key codes to
     *                            their callbacks.
     * @param {Object} [aliases]   Known, allowed aliases for triggers.
     * @param {Function} [getTimestamp]   A Function to return the current time
     *                                    as a Number. If not provided, all 
     *                                    variations of performance.now are 
     *                                    tried; if they don't exist, 
     *                                    Date.getTime is used.
     * @param {Mixed} [eventInformation]   The first argument to be passed to
     *                                     event callbacks (defaults to 
     *                                     undefined).
     * @param {Boolean} [canTrigger]   Whether inputs are currently allowed to
     *                                 trigger (defaults to true).
     * @param {Boolean} [isRecording]   Whether triggered inputs are currently
     *                                  allowed to be written to history
     *                                  (defaults to true).
     */
    self.reset = function (settings) {
        triggers = settings.triggers;
        
        getTimestamp = (
            settings.getTimestamp
            || performance.now 
            || performance.webkitNow 
            || performance.mozNow 
            || performance.msNow 
            || performance.oNow 
            || function () {
                return new Date().getTime();
            }
        ).bind(performance);
        
        eventInformation = settings.eventInformation;
        
        canTrigger = settings.hasOwnProperty("canTrigger") 
            ? settings.canTrigger : true;
        isRecording = settings.hasOwnProperty("isRecording") 
            ? settings.isRecording : true;

        history = {};
        histories = [];
        aliases = {};
        
        self.addAliases(settings.aliases || {});
        
        keyAliasesToCodes = settings.keyAliasesToCodes || {
            "shift": 16,
            "ctrl": 17,
            "space": 32,
            "left": 37,
            "up": 38,
            "right": 39,
            "down": 40,
            "enter": 13,
            "back": 8
        };
        
        keyCodesToAliases = settings.keyCodesToAliases || {
            "16": "shift",
            "17": "ctrl",
            "32": "space",
            "37": "left",
            "38": "up",
            "39": "right",
            "40": "down",
            "13": "enter",
            "8": "back"
        };
    };

    /**
     * Clears the currently tracked inputs history and resets the starting time,
     * and (optionally) saves the current history.
     *
     * @param {Boolean} [keepHistory]   Whether the currently tracked history
     *                                   of inputs should be added to the master
     *                                   Array of histories (defaults to true).
     */
    self.restartHistory = function (keepHistory) {
        if (keepHistory) {
            histories.push(history);
        }
        history = {};
        startingTime = getTimestamp();
    };


    /* Simple gets
    */

    /** 
     * @return {Object} The stored mapping of aliases to values.
     */
    self.getAliases = function () {
        return aliases;
    };
    
    /**
     * @return {Object} The stored mapping of aliases to values, with values
     *                  mapped to their equivalent key Strings.
     */
    self.getAliasesAsKeyStrings = function () {
        var output = {},
            alias;
        
        for (alias in aliases) {
            output[alias] = self.getAliasAsKeyStrings(alias);
        }
        
        return output;
    };
    
    /**
     * @param {Number} alias An alias allowed to be passed in, typically a
     *                          character code.
     * @return {String[]}   The mapped key Strings corresponding to that alias,
     *                      typically the human-readable Strings representing 
     *                      input names, such as "a" or "left".
     */
    self.getAliasAsKeyStrings = function (alias) {
        return aliases[alias].map(self.convertAliasToKeyString);
    };
    
    /**
     * @param {Number} alias   The alias of an input, typically a character 
     *                          code.
     * @return {String} The human-readable String representing the input name,
     *                  such as "a" or "left".
     */
    self.convertAliasToKeyString = function (alias) {
        if (alias.constructor === String) {
            return alias;
        }
        
        if (alias > 96 && alias < 105) {
            return String.fromCharCode(alias - 48);
        }
        
        if (alias > 64 && alias < 97) {
            return String.fromCharCode(alias);
        }
        
        return typeof keyCodesToAliases[alias] !== "undefined"
            ? keyCodesToAliases[alias] : "?";
    };
    
    /**
     * @param {String} key   The number code of an input.
     * @return {Number} The machine-usable character code of the input.
     * 
     */
    self.convertKeyStringToAlias = function (key) {
        if (key.constructor === Number) {
            return key;
        }
        
        if (key.length === 1) {
            return key.charCodeAt(0) - 32;
        }
        
        return typeof keyAliasesToCodes[key] !== "undefined"
            ? keyAliasesToCodes[key] : -1;
    };
    
    /**
     * Get function for a single history, either the current or a past one.
     *
     * @param {String} [name]   The identifier for the old history to return. If
     *                          none is provided, the current history is used.
     * @return {Object}   A history of inputs in JSON-friendly form.
     */
    self.getHistory = function (name) {
        return arguments.length ? histories[name] : history;
    };

    /**
     * @return {Array} All previously stored histories.
     */
    self.getHistories = function () {
        return histories;
    };
    
    /**
     * @return {Boolean} Whether this is currently allowing inputs.
     */
    self.getCanTrigger = function () {
        return canTrigger;
    };

    /**
     * @return {Boolean} Whether this is currently recording allowed inputs.
     */
    self.getIsRecording = function () {
        return isRecording;
    };


    /* Simple sets
    */
     
    /**
     * @param {Mixed} canTriggerNew   Whether this is now allowing inputs. This 
     *                                may be either a Function (to be evaluated 
     *                                on each input) or a general Boolean.
     */
    self.setCanTrigger = function (canTriggerNew) {
        if (status.constructor === Boolean) {
            canTrigger = function () {
                return status;
            };
        } else {
            canTrigger = status;
        }
    };

    /**
     * @param {Boolean} isRecordingNew   Whether this is now recording allowed
     *                                   inputs.    
     */
    self.setIsRecording = function (isRecordingNew) {
        isRecording = isRecordingNew;
    };

    /**
     * @param {Mixed} eventInformationNew   A new first argument for event 
     *                                      callbacks.
     */
    self.setEventInformation = function (eventInformationNew) {
        eventInformation = eventInformationNew;
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
    self.addAliasValues = function (name, values) {
        var triggerName, triggerGroup, 
            i;
        
        if (!aliases.hasOwnProperty(name)) {
            aliases[name] = values;
        } else {
            aliases[name].push.apply(aliases[name], values);
        }
        
        // triggerName = "onkeydown", "onkeyup", ...
        for (triggerName in triggers) {
            if (triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = triggers[triggerName];
                
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
    self.removeAliasValues = function (name, values) {
        var triggerName, triggerGroup, 
            i;
        
        if (!aliases.hasOwnProperty(name)) {
            return;
        }
        
        for (i = 0; i < values.length; i += 1) {
            aliases[name].splice(aliases[name].indexOf(values[i], 1));
        }
        
        // triggerName = "onkeydown", "onkeyup", ...
        for (triggerName in triggers) {
            if (triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = triggers[triggerName];
                
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
    self.switchAliasValues = function (name, valuesOld, valuesNew) {
        self.removeAliasValues(name, valuesOld);
        self.addAliasValues(name, valuesNew);
    };
    
    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     * 
     * @param {Object} aliasesRaw
     */
    self.addAliases = function (aliasesRaw) {
        var aliasName;
        for (aliasName in aliasesRaw) {
            if (aliasesRaw.hasOwnProperty(aliasName)) {
                self.addAliasValues(aliasName, aliasesRaw[aliasName]);
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
    self.addEvent = function (trigger, label, callback) {
        if (!triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'.");
        }
        
        triggers[trigger][label] = callback;
        
        if (aliases.hasOwnProperty(label)) {
            for (var i = 0; i < aliases[label].length; i += 1) {
                triggers[trigger][aliases[i]] = callback;
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
    self.removeEvent = function (trigger, label) {
        if (!triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'.");
        }
        
        delete triggers[trigger][label];
        
        if (aliases.hasOwnProperty(label)) {
            for (var i = 0; i < aliases[label].length; i += 1) {
                if (triggers[trigger][aliases[i]]) {
                    delete triggers[trigger][aliases[i]];
                }
            }
        }
    };
    
    /**
     * Stores the current history in the histories Array. self.restartHistory is
     * typically called directly after.
     *
     * @param {String} [name]   An optional name to save the history as.
     * @remarks Histories are stored in an Array, so it's more performant to not
     *          provide a name if you do call this function often.
     */
    self.saveHistory = function (name) {
        histories.push(history);
        if (arguments.length) {
            histories[name] = history;
        }
    };
    
    /**
     * Plays back the current history using self.playEvents.
     */
    self.playHistory = function () {
        self.playEvents(history);
    };

    /**
     * "Plays" back an Array of event information by simulating each keystroke
     * in a new call, timed by setTimeout.
     *
     * @param {Object} events   The events history to play back.
     * @remarks This will execute the same actions in the same order as before,
     *          but the arguments object may be different.
     */
    self.playEvents = function (events) {
        var timeouts = {},
            time, call;

        for (time in events) {
            if (events.hasOwnProperty(time)) {
                call = makeEventCall(events[time]);
                timeouts[time] = setTimeout(call, (time - startingTime) | 0);
            }
        }
    };

    /**
     * Curry utility to create a closure that runs call() when called.
     *
     * @param {Array} info   An array containing [alias, keycode].
     */
    // Returns a closure function that actives a trigger when called
    function makeEventCall(info) {
        return function () {
            self.callEvent(info[0], info[1]);
        };
    }

    /**
     * Primary driver function to run an event. The event is chosen from the
     * triggers object, and called with eventInformation as the input.
     *
     * @param {Function, String} event   The event function (or string alias of
     *                                   it) that will be called.
     * @param {Number} [keycode]   The alias of the event function under
     *                             triggers[event], if event is a String.
     * @param {Event} [sourceEvent]   The raw event that caused the calling Pipe
     *                                to be triggered, such as a MouseEvent.
     * @return {Mixed}
     */
    self.callEvent = function (event, keycode, sourceEvent) {
        if (canTrigger.constructor === Boolean) {
            if (!canTrigger) {
                return;
            }
        } else if (canTrigger.constructor === Function) {
            if (!canTrigger(event, keycode)) {
                return;
            }
        }
        
        if (!event) {
            throw new Error("Blank event given, ignoring it.");
        }
        
        if (event.constructor === String) {
            event = triggers[event][keycode];
        }

        return event(eventInformation, sourceEvent);
    };

    /**
     * Creates and returns a function to run a trigger.
     *
     * @param {String} trigger   The label for the Array of functions that the
     *                           pipe function should choose from.
     * @param {String} [codeLabel]   An optional mapping String for the alias:
     *                                if provided, it changes the alias to a
     *                                listed alias keyed by codeLabel.
     * @param {Boolean} [preventDefaults]   Whether the input to the pipe
     *                                       function will be an HTML-style
     *                                       event, where .preventDefault()
     *                                       should be clicked.
     * @return {Function}
     * @example   Creating a function that calls an onKeyUp event, with a given
     *            input's keyCode being used as the codeLabel.
     *            InputWriter.makePipe("onkeyup", "keyCode");
     * @example   Creating a function that calls an onMouseDown event, and
     *            preventDefault of the argument.
     *            InputWriter.makePipe("onmousedown", null, true);
     */
    self.makePipe = function (trigger, codeLabel, preventDefaults) {
        if (!triggers.hasOwnProperty(trigger)) {
            throw new Error("No trigger of label '" + trigger + "' defined.");
            return;
        }

        var functions = triggers[trigger],
            useLabel = arguments.length >= 2;

        return function Pipe(alias) {
            // Typical usage means alias will be an event from a key/mouse input
            if (preventDefaults && alias.preventDefault instanceof Function) {
                alias.preventDefault();
            }

            // If a codeLabel is needed, replace the alias with it
            if (useLabel) {
                alias = alias[codeLabel];
            }

            // If there's a function under that alias, run it
            if (functions.hasOwnProperty(alias)) {
                if (isRecording) {
                    history[getTimestamp() | 0] = [trigger, alias];
                }
                
                self.callEvent(functions[alias], undefined, arguments[0]);
            }
        }
    };
    
    
    self.reset(settings || {});
}