/// <reference path="DeviceLayr-0.2.0.ts" />
/// <reference path="GamesRunnr-0.2.0.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="LevelEditr-0.2.0.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to UserWrappr.");
            }
            if (typeof settings.GameStartrConstructor === "undefined") {
                throw new Error("No GameStartrConstructor given to UserWrappr.");
            }
            if (typeof settings.helpSettings === "undefined") {
                throw new Error("No helpSettings given to UserWrappr.");
            }
            if (typeof settings.globalName === "undefined") {
                throw new Error("No globalName given to UserWrappr.");
            }
            if (typeof settings.sizes === "undefined") {
                throw new Error("No sizes given to UserWrappr.");
            }
            if (typeof settings.sizeDefault === "undefined") {
                throw new Error("No sizeDefault given to UserWrappr.");
            }
            if (typeof settings.schemas === "undefined") {
                throw new Error("No schemas given to UserWrappr.");
            }
            this.settings = settings;
            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.globalName = settings.globalName;
            this.helpSettings = this.settings.helpSettings;
            this.customs = settings.customs || {};
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
            this.startCheckingDevices();
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
        /**
         * @return {Number} The identifier for the device input checking interval.
         */
        UserWrappr.prototype.getDeviceChecker = function () {
            return this.deviceChecker;
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
        /* Devices
        */
        /**
         * Starts the checkDevices loop to scan for gamepad status changes.
         */
        UserWrappr.prototype.startCheckingDevices = function () {
            this.checkDevices();
        };
        /**
         * Calls the DeviceLayer to check for gamepad triggers, after scheduling
         * another checkDevices call via setTimeout.
         */
        UserWrappr.prototype.checkDevices = function () {
            this.deviceChecker = setTimeout(this.checkDevices.bind(this), this.GameStarter.GamesRunner.getPaused()
                ? 117
                : this.GameStarter.GamesRunner.getInterval() / this.GameStarter.GamesRunner.getSpeed());
            this.GameStarter.DeviceLayer.checkNavigatorGamepads();
            this.GameStarter.DeviceLayer.activateAllGamepadTriggers();
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
                // 49px from header, 77px from menus
                customs.height -= 126;
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
                    return element;
                }
                return this.getParentControlDiv(element.parentElement);
            };
            /**
             *
             */
            AbstractOptionsGenerator.prototype.ensureLocalStorageButtonValue = function (child, details, schema) {
                var key = schema.title + "::" + details.title, valueDefault = details.source.call(this, this.GameStarter).toString(), value;
                child.setAttribute("localStorageKey", key);
                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": valueDefault
                });
                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value.toString().toLowerCase() === "true") {
                    details[schema.keyActive || "active"] = true;
                    schema.callback.call(this, this.GameStarter, schema, child);
                }
            };
            /**
             * Ensures an input's required local storage value is being stored,
             * and adds it to the internal GameStarter.ItemsHolder if not. If it
             * is, and the child's value isn't equal to it, the value is set.
             *
             * @param {Mixed} childRaw   An input or select element, or an Array
             *                           thereof.
             * @param {Object} details   Details containing the title of the item
             *                           and the source Function to get its value.
             * @param {Object} schema   The container schema this child is within.
             */
            AbstractOptionsGenerator.prototype.ensureLocalStorageInputValue = function (childRaw, details, schema) {
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
                    this.GameStarter.ItemsHolder.saveItem(key);
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
                    }.bind(this, schema, element);
                    this.ensureLocalStorageButtonValue(element, option, schema);
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
                            this.ensureLocalStorageInputValue(child, option, schema);
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
                var values = details.source.call(this, this.GameStarter), possibleKeys = this.UserWrapper.getAllPossibleKeys(), children = [], child, scope = this, valueLower, i, j;
                for (i = 0; i < values.length; i += 1) {
                    valueLower = values[i].toLowerCase();
                    child = document.createElement("select");
                    child.className = "options-key-option";
                    child.value = child.valueOld = valueLower;
                    for (j = 0; j < possibleKeys.length; j += 1) {
                        child.appendChild(new Option(possibleKeys[j]));
                        // Setting child.value won't work in IE or Edge...
                        if (possibleKeys[j] === valueLower) {
                            child.selectedIndex = j;
                        }
                    }
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
                var output = document.createElement("div"), starter = document.createElement("div"), betweenOne = document.createElement("div"), betweenTwo = document.createElement("div"), uploader = this.createUploaderDiv(), mapper = this.createMapSelectorDiv(schema), scope = this;
                output.className = "select-options select-options-level-editor";
                starter.className = "select-option select-option-large options-button-option";
                starter.innerHTML = "Start the <br /> Level Editor!";
                starter.onclick = function () {
                    scope.GameStarter.LevelEditor.enable();
                };
                betweenOne.className = betweenTwo.className = "select-option-title";
                betweenOne.innerHTML = betweenTwo.innerHTML = "<em>- or -</em><br />";
                output.appendChild(starter);
                output.appendChild(betweenOne);
                output.appendChild(uploader);
                output.appendChild(betweenTwo);
                output.appendChild(mapper);
                return output;
            };
            LevelEditorGenerator.prototype.createUploaderDiv = function () {
                var uploader = document.createElement("div"), input = document.createElement("input");
                uploader.className = "select-option select-option-large options-button-option";
                uploader.innerHTML = "Continue an<br />editor file!";
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
            LevelEditorGenerator.prototype.createMapSelectorDiv = function (schema) {
                var expanded = true, generatorName = "MapsGrid", container = this.GameStarter.createElement("div", {
                    "className": "select-options-group select-options-editor-maps-selector"
                }), toggler = this.GameStarter.createElement("div", {
                    "className": "select-option select-option-large options-button-option"
                }), mapsOut = this.GameStarter.createElement("div", {
                    "className": "select-options-holder select-options-editor-maps-holder"
                }), mapsIn = this.UserWrapper.getGenerators()[generatorName].generate(this.GameStarter.proliferate({
                    "callback": schema.callback
                }, schema.maps));
                toggler.onclick = function (event) {
                    expanded = !expanded;
                    if (expanded) {
                        toggler.textContent = "(cancel)";
                        mapsOut.style.position = "";
                        mapsIn.style.height = "";
                    }
                    else {
                        toggler.innerHTML = "Edit a <br />built-in map!";
                        mapsOut.style.position = "absolute";
                        mapsIn.style.height = "0";
                    }
                    if (!container.parentElement) {
                        return;
                    }
                    [].slice.call(container.parentElement.children)
                        .forEach(function (element) {
                        if (element !== container) {
                            element.style.display = (expanded ? "none" : "block");
                        }
                    });
                };
                toggler.onclick(null);
                mapsOut.appendChild(mapsIn);
                container.appendChild(toggler);
                container.appendChild(mapsOut);
                return container;
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
