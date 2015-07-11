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
// @echo '/// <reference path="EightBittr-0.2.0.ts" />'
// @echo '/// <reference path="GroupHoldr-0.2.1.ts" />'
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="MapScreenr-0.2.1.ts" />'
// @echo '/// <reference path="ObjectMakr-0.2.2.ts" />'
// @echo '/// <reference path="TimeHandlr-0.2.0.ts" />'
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/EightBittr-0.2.0.ts" />
/// <reference path="References/GroupHoldr-0.2.1.ts" />
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="References/MapScreenr-0.2.1.ts" />
/// <reference path="References/ObjectMakr-0.2.2.ts" />
/// <reference path="References/TimeHandlr-0.2.0.ts" />
/// <reference path="MenuGraphr.d.ts" />
// @endif
// @include ../Source/MenuGraphr.d.ts
var MenuGraphr;
(function (MenuGraphr_1) {
    /**
     *
     */
    var MenuGraphr = (function () {
        /**
         *
         */
        function MenuGraphr(settings) {
            this.GameStarter = settings.GameStarter;
            this.schemas = settings.schemas || {};
            this.aliases = settings.aliases || {};
            this.replacements = settings.replacements || {};
            this.replacerKey = settings.replacerKey || "%%%%%%%";
            this.replaceFromItemsHolder = settings.replaceFromItemsHolder;
            this.replacementStatistics = settings.replacementStatistics;
            this.menus = {};
        }
        /* Simple gets
        */
        /**
         *
         */
        MenuGraphr.prototype.getMenus = function () {
            return this.menus;
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenu = function (name) {
            return this.menus[name];
        };
        /**
         *
         */
        MenuGraphr.prototype.getExistingMenu = function (name) {
            if (!this.menus[name]) {
                throw new Error("'" + name + "' menu does not exist.");
            }
            return this.menus[name];
        };
        /**
         *
         */
        MenuGraphr.prototype.getAliases = function () {
            return this.aliases;
        };
        /**
         *
         */
        MenuGraphr.prototype.getReplacements = function () {
            return this.replacements;
        };
        /* Menu positioning
        */
        /**
         *
         */
        MenuGraphr.prototype.createMenu = function (name, attributes) {
            var schemaRaw = this.GameStarter.proliferate({}, this.schemas[name]), schema = this.GameStarter.proliferate(schemaRaw, attributes), menu = this.GameStarter.ObjectMaker.make("Menu", schema), container = schema.container
                ? this.menus[schema.container]
                : {
                    "top": 0,
                    "left": 0,
                    "right": this.GameStarter.MapScreener.width,
                    "bottom": this.GameStarter.MapScreener.height,
                    "width": Math.ceil(this.GameStarter.MapScreener.width / this.GameStarter.unitsize),
                    "height": Math.ceil(this.GameStarter.MapScreener.height / this.GameStarter.unitsize),
                    "EightBitter": this.GameStarter,
                    "GameStarter": this.GameStarter,
                    "children": []
                };
            this.deleteMenu(name);
            this.menus[name] = menu;
            menu.name = name;
            this.positionItem(menu, schema.size, schema.position, container);
            menu.children = [];
            menu.textAreaWidth = (menu.width - menu.textXOffset * 2) * this.GameStarter.unitsize;
            if (menu.childrenSchemas) {
                menu.childrenSchemas.forEach(this.createChild.bind(this, name));
            }
            if (container.children) {
                container.children.push(menu);
            }
            this.GameStarter.proliferate(menu, attributes);
            return menu;
        };
        /**
         *
         */
        MenuGraphr.prototype.createChild = function (name, schema) {
            switch (schema.type) {
                case "menu":
                    this.createMenu(schema.name, schema.attributes);
                    break;
                case "text":
                    this.createMenuWord(name, schema);
                    break;
                case "thing":
                    this.createMenuThing(name, schema);
                    break;
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuWord = function (name, schema) {
            var menu = this.getExistingMenu(name), container = this.GameStarter.ObjectMaker.make("Menu");
            this.positionItem(container, schema.size, schema.position, menu, true);
            menu.textX = container.left;
            this.addMenuWord(name, schema.words, 0, container.left, container.top);
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuThing = function (name, schema) {
            var menu = this.getExistingMenu(name), thing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);
            this.positionItem(thing, schema.size, schema.position, menu);
            this.GameStarter.GroupHolder.switchObjectGroup(thing, thing.groupType, "Text");
            menu.children.push(thing);
            return thing;
        };
        /**
         *
         */
        MenuGraphr.prototype.hideMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                menu.hidden = true;
                this.deleteMenuChildren(name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                this.deleteMenuChild(menu);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteActiveMenu = function () {
            if (this.activeMenu) {
                this.deleteMenu(this.activeMenu.name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteMenuChild = function (child) {
            if (this.activeMenu === child) {
                if (child.backMenu) {
                    this.setActiveMenu(child.backMenu);
                }
                else {
                    this.activeMenu = undefined;
                }
            }
            if (child.killOnB) {
                child.killOnB.forEach(this.deleteMenu.bind(this));
            }
            if (child.name) {
                delete this.menus[child.name];
            }
            this.GameStarter.killNormal(child);
            this.deleteMenuChildren(name);
            if (child.onMenuDelete) {
                child.onMenuDelete.call(this.GameStarter);
            }
            if (child.children) {
                child.children.forEach(this.deleteMenuChild.bind(this));
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteMenuChildren = function (name) {
            var menu = this.menus[name];
            if (menu && menu.children) {
                menu.children.forEach(this.deleteMenuChild.bind(this));
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.positionItem = function (item, size, position, container, skipAdd) {
            var offset, i;
            if (!position) {
                position = {};
                offset = {};
            }
            else {
                offset = position.offset || {};
            }
            if (!size) {
                size = {};
            }
            if (size.width) {
                this.GameStarter.setWidth(item, size.width);
            }
            else if (position.horizontal === "stretch") {
                this.GameStarter.setLeft(item, 0);
                this.GameStarter.setWidth(item, container.width - (offset.left || 0) - (offset.right || 0));
            }
            if (size.height) {
                this.GameStarter.setHeight(item, size.height);
            }
            else if (position.vertical === "stretch") {
                this.GameStarter.setTop(item, 0);
                this.GameStarter.setHeight(item, container.height - (offset.top || 0) - (offset.bottom || 0));
            }
            switch (position.horizontal) {
                case "center":
                    this.GameStarter.setMidXObj(item, container);
                    break;
                case "right":
                    this.GameStarter.setRight(item, container.right);
                    break;
                default:
                    this.GameStarter.setLeft(item, container.left);
                    break;
            }
            switch (position.vertical) {
                case "center":
                    this.GameStarter.setMidYObj(item, container);
                    break;
                case "bottom":
                    this.GameStarter.setBottom(item, container.bottom);
                    break;
                default:
                    this.GameStarter.setTop(item, container.top);
                    break;
            }
            if (offset.top) {
                this.GameStarter.shiftVert(item, position.offset.top * this.GameStarter.unitsize);
            }
            if (offset.left) {
                this.GameStarter.shiftHoriz(item, position.offset.left * this.GameStarter.unitsize);
            }
            if (!skipAdd) {
                this.GameStarter.addThing(item, item.left, item.top);
            }
        };
        /* Menu text
        */
        /**
         *
         */
        MenuGraphr.prototype.addMenuDialog = function (name, dialog, onCompletion) {
            if (!dialog) {
                dialog = [""];
            }
            else if (dialog.constructor === String) {
                dialog = [dialog];
            }
            else if (!(dialog instanceof Array)) {
                dialog = [String(dialog)];
            }
            this.addMenuText(name, dialog[0], function () {
                if (dialog.length === 1) {
                    if (this.menus[name].deleteOnFinish) {
                        this.deleteMenu(name);
                    }
                    if (onCompletion) {
                        return onCompletion();
                    }
                    return true;
                }
                this.deleteMenuChildren(name);
                this.addMenuDialog(name, dialog.slice(1), onCompletion);
                return false;
            }.bind(this));
        };
        /**
         *
         */
        MenuGraphr.prototype.addMenuText = function (name, words, onCompletion) {
            var menu = this.getExistingMenu(name), x = this.GameStarter.getMidX(menu), y = menu.top + menu.textYOffset * this.GameStarter.unitsize;
            switch (menu.textStartingX) {
                case "right":
                    x += menu.textAreaWidth / 2;
                    break;
                case "center":
                    break;
                default:
                    x -= menu.textAreaWidth / 2;
            }
            if (words.constructor === String) {
                words = words.split(/ /);
            }
            menu.callback = this.continueMenu.bind(this);
            menu.textX = x;
            this.addMenuWord(name, words, 0, x, y, onCompletion);
        };
        /**
         *
         *
         * @todo The calculation of whether a word can fit assumes equal width for
         *       all children, although apostrophes are tiny.
         */
        MenuGraphr.prototype.addMenuWord = function (name, words, i, x, y, onCompletion) {
            var menu = this.getExistingMenu(name), word = this.filterWord(words[i]), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), things = [], textWidth, textHeight, textPaddingX, textPaddingY, textSpeed, textWidthMultiplier, title, character, j;
            // First, filter for commands that affect the containing menu
            if (word.constructor === Object && word.command) {
                switch (word.command) {
                    case "attribute":
                        menu[word.attribute + "Old"] = menu[word.attribute];
                        menu[word.attribute] = word.value;
                        if (word.applyUnitsize) {
                            menu[word.attribute] *= this.GameStarter.unitsize;
                        }
                        break;
                    case "attributeReset":
                        menu[word.attribute] = menu[word.attribute + "Old"];
                        break;
                    case "position":
                        if (word.x) {
                            x += word.x;
                        }
                        if (word.y) {
                            y += word.y;
                        }
                        break;
                }
            }
            // Numerics require any commands that should have affected the window 
            // to have already been applied
            textSpeed = menu.textSpeed;
            textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize,
                textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize,
                textPaddingX = (menu.textPaddingX || textProperties.paddingX) * this.GameStarter.unitsize;
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
            textWidthMultiplier = menu.textWidthMultiplier || 1;
            if (word.constructor === Object && word.command) {
                title = this.filterWord(this.getCharacterEquivalent(word.word));
                switch (word.command) {
                    // Length may be a String (for its length) or a direct number
                    case "padLeft":
                        if (word.length.constructor === String) {
                            word = this.stringOf(" ", (this.filterWord(word.length).length
                                - title.length)) + this.filterWord(title);
                        }
                        else {
                            word = this.stringOf(" ", word.length - title.length) + title;
                        }
                        break;
                }
            }
            if ((word.constructor === String && word !== "\n")
                || word.constructor === Array) {
                for (j = 0; j < word.length; j += 1) {
                    if (word[j] !== " ") {
                        title = "Char" + this.getCharacterEquivalent(word[j]);
                        character = this.GameStarter.ObjectMaker.make(title);
                        character.paddingY = textPaddingY;
                        menu.children.push(character);
                        things.push(character);
                        if (textSpeed) {
                            this.GameStarter.TimeHandler.addEvent(this.GameStarter.addThing.bind(this.GameStarter), j * textSpeed, character, x, y);
                        }
                        else {
                            this.GameStarter.addThing(character, x, y);
                        }
                        x += textWidthMultiplier * (character.width * this.GameStarter.unitsize + textPaddingX);
                    }
                    else {
                        x += textWidth * textWidthMultiplier;
                    }
                }
            }
            if (i === words.length - 1) {
                menu.progress = {
                    "complete": true,
                    "onCompletion": onCompletion
                };
                if (menu.finishAutomatically) {
                    this.GameStarter.TimeHandler.addEvent(onCompletion, (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
                }
                return things;
            }
            if (!word.skipSpacing) {
                if (word === "\n"
                    || (x + ((this.filterWord(words[i + 1]).length + .5)
                        * textWidthMultiplier * textWidth
                        + menu.textXOffset * this.GameStarter.unitsize)
                        > this.GameStarter.getMidX(menu) + menu.textAreaWidth / 2)) {
                    x = menu.textX;
                    y += textPaddingY;
                }
                else {
                    x += textWidth * textWidthMultiplier;
                }
            }
            if (y >= menu.bottom - (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                menu.progress = {
                    "words": words,
                    "i": i + 1,
                    "x": x,
                    "y": y - (textPaddingY),
                    "onCompletion": onCompletion
                };
                return things;
            }
            if (textSpeed) {
                this.GameStarter.TimeHandler.addEvent(this.addMenuWord.bind(this), (j + 1) * textSpeed, name, words, i + 1, x, y, onCompletion);
            }
            else {
                this.addMenuWord(name, words, i + 1, x, y, onCompletion);
            }
            return things;
        };
        /**
         *
         */
        MenuGraphr.prototype.continueMenu = function (name) {
            var menu = this.getExistingMenu(name), children = menu.children, progress = menu.progress, character, i;
            if (!progress || progress.working) {
                return;
            }
            progress.working = true;
            if (progress.complete) {
                if (!progress.onCompletion || progress.onCompletion(this.GameStarter, menu)) {
                    this.deleteMenu(name);
                }
                return;
            }
            for (i = 0; i < children.length; i += 1) {
                character = children[i];
                this.GameStarter.TimeHandler.addEventInterval(this.scrollCharacterUp.bind(this), 1, character.paddingY / this.GameStarter.unitsize, character, menu, -1);
            }
            this.GameStarter.TimeHandler.addEvent(this.addMenuWord.bind(this), character.paddingY / this.GameStarter.unitsize + 1, name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
        };
        /* Lists
        */
        /**
         *
         */
        MenuGraphr.prototype.addMenuList = function (name, settings) {
            var menu = this.getExistingMenu(name), options = settings.options.constructor === Function
                ? settings.options()
                : settings.options, left = menu.left + menu.textXOffset * this.GameStarter.unitsize, top = menu.top + menu.textYOffset * this.GameStarter.unitsize, textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize, textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, arrowXOffset = (menu.arrowXOffset || 0) * this.GameStarter.unitsize, arrowYOffset = (menu.arrowYOffset || 0) * this.GameStarter.unitsize, selectedIndex = settings.selectedIndex || [0, 0], optionChildren = [], index = 0, y = top, option, optionChild, schema, title, character, column, x, i, j, k;
            menu.options = options;
            menu.optionChildren = optionChildren;
            menu.callback = this.selectMenuListOption.bind(this);
            menu.onActive = this.activateMenuList.bind(this);
            menu.onInactive = this.deactivateMenuList.bind(this);
            menu.grid = [];
            menu.grid[0] = column = [];
            menu.gridRows = 0;
            if (!options.length) {
                return;
            }
            for (i = 0; i < options.length; i += 1) {
                x = left;
                option = options[i];
                optionChild = {
                    "option": option,
                    "things": []
                };
                optionChildren.push(optionChild);
                option.x = x;
                option.y = y;
                column.push(option);
                option.column = column;
                option.index = index;
                option.columnNumber = menu.grid.length - 1;
                option.rowNumber = column.length - 1;
                menu.gridRows = Math.max(menu.gridRows, column.length);
                index += 1;
                if (option.things) {
                    for (j = 0; j < option.things.length; j += 1) {
                        schema = option.things[j];
                        character = this.createMenuThing(name, schema);
                        menu.children.push(character);
                        optionChild.things.push(character);
                        if (!schema.position || !schema.position.relative) {
                            this.GameStarter.shiftVert(character, y - menu.top);
                        }
                    }
                }
                if (option.textsFloating) {
                    for (j = 0; j < option.textsFloating.length; j += 1) {
                        schema = option.textsFloating[j];
                        optionChild.things = optionChild.things.concat(this.addMenuWord(name, [schema.text], 0, x + schema.x * this.GameStarter.unitsize, y + schema.y * this.GameStarter.unitsize));
                    }
                }
                option.schema = schema = this.filterWord(option.text);
                if (schema !== "\n") {
                    for (j = 0; j < schema.length; j += 1) {
                        if (schema[j].command) {
                            if (schema[j].x) {
                                x += schema[j].x * this.GameStarter.unitsize;
                            }
                            if (schema[j].y) {
                                y += schema[j].y * this.GameStarter.unitsize;
                            }
                        }
                        else if (schema[j] !== " ") {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
                            character = this.GameStarter.ObjectMaker.make(title);
                            menu.children.push(character);
                            optionChild.things.push(character);
                            this.GameStarter.addThing(character, x, y);
                            x += character.width * this.GameStarter.unitsize;
                        }
                        else {
                            x += textWidth;
                        }
                    }
                }
                y += textPaddingY;
                if (y > menu.bottom - textHeight + 1) {
                    y = top;
                    left += menu.textColumnWidth * this.GameStarter.unitsize;
                    column = [];
                    menu.grid.push(column);
                }
            }
            while (menu.grid[menu.grid.length - 1].length === 0) {
                menu.grid.pop();
            }
            menu.gridColumns = menu.grid.length;
            if (settings.bottom) {
                option = settings.bottom;
                option.schema = schema = this.filterWord(option.text);
                optionChild = {
                    "option": option,
                    "things": []
                };
                optionChildren.push(optionChild);
                x = menu.left + (menu.textXOffset + option.position.left) * this.GameStarter.unitsize;
                y = menu.top + (menu.textYOffset + option.position.top) * this.GameStarter.unitsize;
                option.x = x;
                option.y = y;
                // Copy & pasted from the above options loop
                // To do: make this into its own helper function?
                for (j = 0; j < schema.length; j += 1) {
                    if (schema[j].command) {
                        if (schema[j].x) {
                            x += schema[j].x * this.GameStarter.unitsize;
                        }
                        if (schema[j].y) {
                            y += schema[j].y * this.GameStarter.unitsize;
                        }
                    }
                    else if (schema[j] !== " ") {
                        option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
                        character = this.GameStarter.ObjectMaker.make(title);
                        menu.children.push(character);
                        optionChild.things.push(character);
                        this.GameStarter.addThing(character, x, y);
                        x += character.width * this.GameStarter.unitsize;
                    }
                    else {
                        x += textWidth;
                    }
                }
                menu.gridRows += 1;
                for (j = 0; j < menu.grid.length; j += 1) {
                    menu.grid[j].push(option);
                }
            }
            if (menu.scrollingItems) {
                menu.scrollingAmount = 0;
                menu.scrollingAmountReal = 0;
                for (i = menu.scrollingItems; i < menu.gridRows; i += 1) {
                    optionChild = optionChildren[i];
                    for (j = 0; j < optionChild.things.length; j += 1) {
                        optionChild.things[j].hidden = true;
                    }
                }
            }
            menu.selectedIndex = selectedIndex;
            menu.arrow = character = this.GameStarter.ObjectMaker.make("CharArrowRight");
            menu.children.push(character);
            character.hidden = (this.activeMenu !== menu);
            option = menu.grid[selectedIndex[0]][selectedIndex[1]];
            this.GameStarter.addThing(character);
            this.GameStarter.setRight(character, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(character, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        };
        /**
         *
         */
        MenuGraphr.prototype.activateMenuList = function (name) {
            if (this.menus[name] && this.menus[name].arrow) {
                this.menus[name].arrow.hidden = false;
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deactivateMenuList = function (name) {
            if (this.menus[name] && this.menus[name].arrow) {
                this.menus[name].arrow.hidden = true;
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenuSelectedIndex = function (name) {
            return this.menus[name].selectedIndex;
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenuSelectedOption = function (name) {
            var menu = this.menus[name];
            return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
        };
        /**
         *
         */
        MenuGraphr.prototype.shiftSelectedIndex = function (name, dx, dy) {
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = textProperties.width * this.GameStarter.unitsize, textHeight = textProperties.height * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, option, x, y;
            if (menu.scrollingItems) {
                x = menu.selectedIndex[0] + dx;
                y = menu.selectedIndex[1] + dy;
                x = Math.max(Math.min(menu.gridColumns - 1, x), 0);
                y = Math.max(Math.min(menu.gridRows - 1, y), 0);
            }
            else {
                x = (menu.selectedIndex[0] + dx) % menu.gridColumns;
                y = (menu.selectedIndex[1] + dy) % menu.gridRows;
                while (x < 0) {
                    x += menu.gridColumns;
                }
                while (y < 0) {
                    y += menu.gridRows;
                }
            }
            if (x === menu.selectedIndex[0] && y === menu.selectedIndex[1]) {
                return;
            }
            //y = Math.min(menu.grid[x].length - 1, y);
            menu.selectedIndex[0] = x;
            menu.selectedIndex[1] = y;
            option = this.getMenuSelectedOption(name);
            if (menu.scrollingItems) {
                this.adjustVerticalScrollingListThings(name, dy, textPaddingY);
            }
            this.GameStarter.setRight(menu.arrow, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(menu.arrow, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        };
        /**
         *
         */
        MenuGraphr.prototype.setSelectedIndex = function (name, x, y) {
            var menu = this.getExistingMenu(name), selectedIndex = menu.selectedIndex;
            this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
        };
        /**
         *
         */
        MenuGraphr.prototype.adjustVerticalScrollingListThings = function (name, dy, textPaddingY) {
            var menu = this.getExistingMenu(name), scrollingItems = menu.scrollingItems, scrollingOld = menu.scrollingAmount, offset = -dy * textPaddingY, scrollingNew, indexNew, option, optionChild, i, j;
            menu.scrollingAmount += dy;
            if (dy > 0) {
                if (scrollingOld < menu.scrollingItems - 2) {
                    return;
                }
            }
            else if (menu.scrollingAmount < menu.scrollingItems - 2) {
                return;
            }
            menu.scrollingAmountReal += dy;
            for (i = 0; i < menu.optionChildren.length; i += 1) {
                option = menu.options[i];
                optionChild = menu.optionChildren[i];
                option.y += offset;
                for (j = 0; j < optionChild.things.length; j += 1) {
                    this.GameStarter.shiftVert(optionChild.things[j], offset);
                    if (i < menu.scrollingAmountReal
                        || i >= menu.scrollingItems + menu.scrollingAmountReal) {
                        optionChild.things[j].hidden = true;
                    }
                    else {
                        optionChild.things[j].hidden = false;
                    }
                }
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.selectMenuListOption = function (name) {
            var menu = this.getExistingMenu(name), selected = this.getMenuSelectedOption(name);
            if (selected.callback) {
                selected.callback(name);
            }
        };
        /* Interactivity
        */
        /**
         *
         */
        MenuGraphr.prototype.setActiveMenu = function (name) {
            if (this.activeMenu && this.activeMenu.onInactive) {
                this.activeMenu.onInactive(this.activeMenu.name);
            }
            this.activeMenu = this.menus[name];
            if (this.activeMenu && this.activeMenu.onActive) {
                this.activeMenu.onActive(name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.getActiveMenu = function () {
            return this.activeMenu;
        };
        /**
         *
         */
        MenuGraphr.prototype.getActiveMenuName = function () {
            return this.activeMenu.name;
        };
        /**
         *
         */
        MenuGraphr.prototype.registerDirection = function (direction) {
            switch (direction) {
                case 0:
                    return this.registerUp();
                case 1:
                    return this.registerRight();
                case 2:
                    return this.registerDown();
                case 3:
                    return this.registerLeft();
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerLeft = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, -1, 0);
            }
            if (menu.onLeft) {
                menu.onLeft(this.GameStarter);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerRight = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 1, 0);
            }
            if (menu.onRight) {
                menu.onRight(this.GameStarter);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerUp = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, -1);
            }
            if (menu.onUp) {
                menu.onUp(this.GameStarter);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerDown = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, 1);
            }
            if (menu.onDown) {
                menu.onDown(this.GameStarter);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerA = function () {
            var menu = this.activeMenu;
            if (!menu || menu.ignoreA) {
                return;
            }
            if (menu.callback) {
                menu.callback(menu.name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerB = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.progress && !menu.ignoreProgressB) {
                return this.registerA();
            }
            if (menu.ignoreB) {
                return;
            }
            if (menu.onBPress) {
                menu.onBPress(menu.name);
                return;
            }
            if (menu.keepOnBack) {
                this.setActiveMenu(menu.backMenu);
            }
            else {
                this.deleteMenu(menu.name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.registerStart = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.startMenu) {
                this.setActiveMenu(menu.startMenu);
            }
        };
        /* Utilities
        */
        /**
         *
         */
        MenuGraphr.prototype.scrollCharacterUp = function (character, menu) {
            this.GameStarter.shiftVert(character, -this.GameStarter.unitsize);
            if (character.top < menu.top + (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.killNormal(character);
                return true;
            }
            return false;
        };
        /**
         *
         */
        MenuGraphr.prototype.getCharacterEquivalent = function (character) {
            if (this.aliases.hasOwnProperty(character)) {
                return this.aliases[character];
            }
            return character;
        };
        /**
         *
         */
        MenuGraphr.prototype.filterWord = function (word) {
            var start = 0, end, inside;
            if (word.constructor !== String) {
                return word;
            }
            while (true) {
                start = word.indexOf("%%%%%%%", start);
                end = word.indexOf("%%%%%%%", start + 1);
                if (start === -1 || end === -1) {
                    return word;
                }
                inside = word.substring(start + "%%%%%%%".length, end);
                word = word.substring(0, start) + this.getReplacement(inside) + word.substring(end + "%%%%%%%".length);
                start = end;
            }
            return word;
        };
        /**
         *
         */
        MenuGraphr.prototype.getReplacement = function (key) {
            var value = this.replacements[key];
            if (typeof value === "undefined") {
                return value;
            }
            // if (this.replacementStatistics && this.replacementStatistics[value]) {
            //     return this.replacements[value](this.GameStarter);
            // }
            if (this.replaceFromItemsHolder) {
                if (this.GameStarter.ItemsHolder.hasKey(value)) {
                    return this.GameStarter.ItemsHolder.getItem(value);
                }
            }
            return value;
        };
        /**
         *
         */
        MenuGraphr.prototype.getAliasOf = function (key, forced) {
            if (forced) {
                return this.aliases[key];
            }
            else {
                return typeof this.aliases[key] === "undefined" ? key : this.aliases[key];
            }
        };
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param {String} str The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         */
        MenuGraphr.prototype.stringOf = function (str, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times)).join(str);
        };
        return MenuGraphr;
    })();
    MenuGraphr_1.MenuGraphr = MenuGraphr;
})(MenuGraphr || (MenuGraphr = {}));
