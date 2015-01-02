/**
 * EightBittr.js
 * 
 * An abstract class used exclusively as the parent of GameStartr. EightBittr
 * contains useful functions for manipulating Things that are independent of
 * the required GameStartr modules.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var EightBittr = (function () {
    "use strict";
    
    /**
     * EightBittr constructor. Settings arguments are used to initialize 
     * "constant" values and check for requirements.
     * 
     * @constructor
     * @param {Object} [settings]   An Object containing all other arguments.
     * @param {String[]} [constants]   The names of attributes that should exist 
     *                                 in both the EightBittr constructor and 
     *                                 child instances.
     * @param {Object} [requirements]   A mapping of required settings that must
     *                                  exist globally and/or locally.
     */
    function EightBittr(settings) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            constants, requirements, i;
        
        settings = settings || {};
        EightBitter.constructor = settings.constructor || EightBittr,
        
        // Constants, such as unitsize and scale, are always copied first
        constants = settings.constants;
        if (constants) {
            for (i = 0; i < constants.length; i += 1) {
                EightBitter[constants[i]] = EightBitter.constructor[constants[i]];
            }
        }
        
        requirements = settings.requirements;
        if (requirements) {
            if (requirements.global) {
                checkRequirements(window, requirements.global, "global");
            }
            if (requirements.self) {
                checkRequirements(EightBitter, requirements.self, "self");
            }
        }
    }
    
    /**
     * Given an associate array of requirement names to the files that should
     * include them, this makes sure each of those requirements is a property of
     * the given Object. 
     * 
     * @param {Mixed} self    Generally either the window (for global checks,
     *                         such as utility classes) or an EightBitter.    
     * @param {Object} requirements   An associative array of properties to 
     *                                check for under self.
     * @param {String} name   The name referring to self, printed out in an
     *                        Error if needed.
     */
    function checkRequirements(self, requirements, name) {
        var fails = [],
            requirement;
        
        // For each requirement in the given object, if it isn't visible as a
        // member of self (evaluates to falsy), complain
        for (requirement in requirements) {
            if (requirements.hasOwnProperty(requirement) && !self[requirement]) {
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
    }
    
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
    function reset(EightBitter, resets, customs) {
        var i;
        
        for (i = 0; i < resets.length; i += 1) {
            EightBitter[resets[i]](EightBitter, customs)
        }
        
        EightBitter.customs = customs;
    }
    
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
    function resetTimed(EightBitter, resets, customs) {
        var timeStart = performance.now(),
            times = [],
            timeEach, i;
        
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
    }
    
    /**
     * EightBittr.get is provided as a shortcut function to make binding member
     * functions, particularily those using "this.unitsize" (where this needs to
     * be an EightBitter, not an external calling object). At the very simplest,
     * this.get(func) acts as a shortcut to this.bind(this, func).
     * In addition, if the name is given as "a.b", EightBitter.followPath will
     * be used on "a.b".split('.') (so EightBitter.prototype[a][b] is returned).
     * 
     * @this {EightBittr}
     * @param {Mixed} name   Either the function itself, or a string of the path
     *                       to the function (after ".prototype.").
     * @return {Function}   A function, bound to set "this" to the calling
     *                      EightBitter
     */
    EightBittr.prototype.get = function(name) {
        var EightBitter = EightBittr.prototype.ensureCorrectCaller.call(this),
            func;
        
        // If name is a string, turn it into a function path, and follow it
        if (name.constructor === String) {
            func = followPathHard(EightBitter, name.split('.'), 0);
        }
        // If it's already a path (array), follow it
        else if (name instanceof Array) {
            func = followPathHard(EightBitter, name, 0);
        }
        // Otherwise func is just name
        else {
            func = name;
        }
        
        // Don't allow func to be undefined or some non-function object
        if (typeof(func) !== "function") {
            throw new Error(name + " is not defined in this EightBitter", self);
        }
        
        // Bind the function to this
        return func.bind(EightBitter);
    };
    
    
    /* HTML functions
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
     */
    function createCanvas(width, height, scaling) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        
        canvas.width = width;
        canvas.height = height;
        
        scaling = scaling || 1;
        
        // Scaling 1 by default, but may be different (e.g. unitsize)
        canvas.style.width = (width * scaling) + "px";
        canvas.style.height = (height * scaling) + "px";
        
        // For speed's sake, disable image smoothing in all browsers
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        
        return canvas;
    }
    

    /* Physics functions 
    */
    
    /**
     * Shifts a Thing vertically by changing its top and bottom attributes.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     */
    function shiftVert(thing, dy) {
        thing.top += dy;
        thing.bottom += dy;
    }
    
    /**
     * Shifts a Thing horizontally by changing its top and bottom attributes.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     */
    function shiftHoriz(thing, dx) {
        thing.left += dx;
        thing.right += dx;
    }
    
    /**
     * Sets the top of a Thing to a set number, changing the bottom based on its
     * height and the EightBittr's unisize.
     * 
     * @param {Thing} thing
     * @param {Number} top
     */
    function setTop(thing, top) {
        thing.top = top;
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * Sets the right of a Thing to a set number, changing the left based on its
     * width and the EightBittr's unisize.
     * 
     * @param {Thing} thing
     * @param {Number} right
     */
    function setRight(thing, right) {
        thing.right = right;
        thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * Sets the bottom of a Thing to a set number, changing the top based on its
     * height and the EightBittr's unisize.
     * 
     * @param {Thing} thing
     * @param {Number} bottom
     */
    function setBottom(thing, bottom) {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * Sets the left of a Thing to a set number, changing the right based on its
     * width and the EightBittr's unisize.
     * 
     * @param {Thing} thing
     * @param {Number} left
     */
    function setLeft(thing, left) {
        thing.left = left;
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * Shifts a Thing so that it is centered on the given x and y.
     * 
     * @param {Thing} thing
     * @param {Number} x
     * @param {Number} y
     */
    function setMid(thing, x, y) {
        thing.EightBitter.setMidX(thing, x);
        thing.EightBitter.setMidY(thing, y);
    }
    
    /**
     * Shifts a Thing so that it is horizontally centered on the given x.
     * 
     * @param {Thing} thing
     * @param {Number} x
     */
    function setMidX(thing, x) {
        thing.EightBitter.setLeft(
            thing, 
            x + thing.width * thing.EightBitter.unitsize / 2
        );
    }
    
    /**
     * Shifts a Thing so that it is vertically centered on the given y.
     * 
     * @param {Thing} thing
     * @param {Number} y
     */
    function setMidY(thing, y) {
        thing.EightBitter.setTop(
            thing,
            y + thing.height * thing.EightBitter.unitsize / 2
        );
    }
    
    /**
     * @param {Thing} thing
     * @return {Number} The horizontal midpoint of the Thing.
     */
    function getMidX(thing) {
        return thing.left + thing.width * thing.EightBitter.unitsize / 2;
    }
    
    /**
     * @param {Thing} thing
     * @return {Number} The vertical midpoint of the Thing.
     */
    function getMidY(thing) {
        return thing.top + thing.height * thing.EightBitter.unitsize / 2;
    }
    
    /**
     * Shifts a Thing so that its midpoint is centered on the midpoint of the
     * other Thing.
     * 
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    function setMidObj(thing, other) {
        thing.EightBitter.setMidXObj(thing, other);
        thing.EightBitter.setMidYObj(thing, other);
    }
    
    /**
     * Shifts a Thing so that its horizontal midpoint is centered on the 
     * midpoint of the other Thing.
     * 
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    function setMidXObj(thing, other) {
        thing.EightBitter.setLeft(
            thing, 
            thing.EightBitter.getMidX(other) 
                - (thing.width * thing.EightBitter.unitsize / 2)
        );
    }
    
    /**
     * Shifts a Thing so that its vertical midpoint is centered on the 
     * midpoint of the other Thing.
     * 
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    function setMidYObj(thing, other) {
        thing.EightBitter.setTop(
            thing, 
            thing.EightBitter.getMidY(other) 
                - (thing.height * thing.EightBitter.unitsize / 2)
            );
    }
    
    /**
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean} Whether the first Thing's midpoing is to the left of
     *                   the other's.
     */
    function objectToLeft(thing, other) {
        return (
            thing.EightBitter.getMidX(thing) < thing.EightBitter.getMidX(other)
        );
    }
    
    /**
     * Shifts a Thing's top up, then sets the bottom (similar to a shiftVert and
     * a setTop combined).
     * 
     * @param {Thing} thing
     * @param {Number} dy
     */
    function updateTop(thing, dy) {
        // If a dy is provided, move the thing's top that much
        thing.top += dy || 0;
        
        // Make the thing's bottom dependent on the top
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * Shifts a Thing's right, then sets the left (similar to a shiftHoriz and a
     * setRight combined).
     * 
     * @param {Thing} thing
     * @param {Number} dx
     */
    function updateRight(thing, dx) {
        // If a dx is provided, move the thing's right that much
        thing.right += dx || 0;
        
        // Make the thing's left dependent on the right
        thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * Shifts a Thing's bottom down, then sets the bottom (similar to a 
     * shiftVert and a setBottom combined).
     * 
     * @param {Thing} thing
     * @param {Number} dy
     */
    function updateBottom(thing, dy) {
        // If a dy is provided, move the thing's bottom that much
        thing.bottom += dy || 0;
        
        // Make the thing's top dependent on the top
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * Shifts a Thing's left, then sets the right (similar to a shiftHoriz and a
     * setLeft combined).
     * 
     * @param {Thing} thing
     * @param {Number} dy
     */
    function updateLeft(thing, dx) {
        // If a dx is provided, move the thing's left that much
        thing.left += dx || 0;
        
        // Make the thing's right dependent on the left
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * Shifts a Thing toward a target x, but limits the total distance allowed.
     * Distance is computed as from the Thing's horizontal midpoint.
     * 
     * @param {Thing} thing
     * @param {Number} x
     * @param {Number} maxSpeed
     */
    function slideToX(thing, x, maxSpeed) {
        var midx = thing.EightBitter.getMidX(thing);
        
        // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
        maxSpeed = maxSpeed || Infinity;
        
        // Thing to the left? Slide to the right.
        if (midx < x) {
            thing.EightBitter.shiftHoriz(thing, Math.min(maxSpeed, (x - midx)));
        }
        // Thing to the right? Slide to the left.
        else {
            thing.EightBitter.shiftHoriz(thing, Math.max(-maxSpeed, (x - midx)));
        }
    }
    
    /**
     * Shifts a Thing toward a target y, but limits the total distance allowed.
     * Distance is computed as from the Thing's vertical midpoint.
     * 
     * @param {Thing} thing
     * @param {Number} y
     * @param {Number} maxSpeed
     */
    function slideToY(thing, y, maxSpeed) {
        var midy = thing.EightBitter.getMidY(thing);
        
        // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
        maxSpeed = maxSpeed || Infinity;
        
        // Thing above? slide down.
        if (midy < y) {
            thing.EightBitter.shiftVert(thing, Math.min(maxSpeed, (y - midy)));
        }
        // Thing below? Slide up.
        else {
            thing.EightBitter.shiftVert(thing, Math.max(-maxSpeed, (y - midy)));
        }
    }
    
    
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
    function ensureCorrectCaller(current) {
        if (!current instanceof EightBittr) {
            throw new Error("A function requires the caller ('this') to be the "
                + "manipulated EightBittr object. Unfortunately, 'this' is a "
                + typeof(this) + ".");
        }
        return current;
    }
    
    
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
     */
    function proliferate(recipient, donor, noOverride) {
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
                    proliferate(recipient[i], setting, noOverride);
                }
                // Regular primitives are easy to copy otherwise
                else {
                    recipient[i] = setting;
                }
            }
        }
        return recipient;
    }
    
    /**
     * Identical to proliferate, but instead of checking whether the recipient
     * hasOwnProperty on properties, it just checks if they're truthy
     * 
     * @param {Mixed} recipient
     * @param {Mixed} donor
     * @param {Boolean} [noOverride]   Whether pre-existing properties of the
     *                                 recipient should be skipped (defaults to
     *                                 false).
     * @remarks This may not be good with JSLint, but it works for prototypal
     *          inheritance, since hasOwnProperty only is for the current class
     */
    function proliferateHard(recipient, donor, noOverride) {
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
                    proliferate(recipient[i], setting, noOverride);
                }
                // Regular primitives are easy to copy otherwise
                else {
                    recipient[i] = setting;
                }
            }
        }
        return recipient;
    }
    
    /**
     * Identical to proliferate, but tailored for HTML elements because many
     * element attributes don't play nicely with JavaScript Array standards. 
     * Looking at you, HTMLCollection!
     * 
     * @param {Element} recipient
     * @param {Any} donor
     * @param {Boolean} [noOverride]
     * @return {Element}
     */
    function proliferateElement(recipient, donor, noOverride) {
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
                        if (typeof(setting) !== "undefined") {
                            for (var j = 0; j < setting.length; j += 1) {
                                recipient.appendChild(setting[j]);
                            }
                        }
                        break;
                    
                    // By default, use the normal proliferate logic
                    default:
                        // If it's an object, recurse on a new version of it
                        if (typeof setting === "object") {
                            if (!recipient.hasOwnProperty(i)) {
                                recipient[i] = new setting.constructor();
                            }
                            proliferate(recipient[i], setting, noOverride);
                        }
                        // Regular primitives are easy to copy otherwise
                        else {
                            recipient[i] = setting;
                        }
                        break;
                }
            }
        }
        return recipient;
    }
    
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
    function createElement(type) {
        var element = document.createElement(type || "div"),
            i;
        
        // For each provided object, add those settings to the element
        for (i = 1; i < arguments.length; i += 1) {
            proliferateElement(element, arguments[i]);
        }
        
        return element;
    }
    
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
    function followPathHard(object, path, num) {
        for (var i = num || 0; i < path.length; i += 1) {
            if (typeof object[path[i]] === "undefined") {
                return undefined;
            }
            else {
                object = object[path[i]];
            }
        }
        return object;
    }
    
    /**
     * Switches a Thing from one Array to Another using splice and push.
     * 
     * @param {Thing} thing
     * @param {Array} arrayOld
     * @param {Array} arrayNew
     */
    function arraySwitch(thing, arrayOld, arrayNew) {
        arrayOld.splice(arrayOld.indexOf(thing), 1);
        arrayNew.push(thing);
    }
    
    /**
     * Sets a Thing's position within an Array to the front by splicing and then
     * unshifting it.
     * 
     * @param {Thing} thing
     * @param {Array} array
     */
    function arrayToBeginning(thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.unshift(thing);
    }
    
    /**
     * Sets a Thing's position within an Array to the front by splicing and then
     * pushing it.
     * 
     * @param {Thing} thing
     * @param {Array} array
     */
    function arrayToEnd(thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.push(thing);
    }
    
    
    proliferateHard(EightBittr.prototype, {
        // Setup
        "reset": reset,
        "resetTimed": resetTimed,
        // HTML
        "createCanvas": createCanvas,
        // Physics
        "shiftVert": shiftVert,
        "shiftHoriz": shiftHoriz,
        "setTop": setTop,
        "setRight": setRight,
        "setBottom": setBottom,
        "setLeft": setLeft,
        "setLeftOld": setLeft,
        "setMid": setMid,
        "setMidY": setMidY,
        "setMidX": setMidX,
        "getMidY": getMidY,
        "getMidX": getMidX,
        "setMidObj": setMidObj,
        "setMidXObj": setMidXObj,
        "setMidYObj": setMidYObj,
        "objectToLeft": objectToLeft,
        "updateTop": updateTop,
        "updateRight": updateRight,
        "updateBottom": updateBottom,
        "updateLeft": updateLeft,
        "slideToY": slideToY,
        "slideToX": slideToX,
        // EightBittr utilities
        "ensureCorrectCaller": ensureCorrectCaller,
        // General utilities
        "proliferate": proliferate,
        "proliferateHard": proliferateHard,
        "proliferateElement": proliferateElement,
        "createElement": createElement,
        "arraySwitch": arraySwitch,
        "arrayToBeginning": arrayToBeginning,
        "arrayToEnd": arrayToEnd
    });
    
    EightBittr.ensureCorrectCaller = ensureCorrectCaller;
    
    return EightBittr;
})();