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
