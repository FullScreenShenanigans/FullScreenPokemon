declare module EightBittr {
    export interface IThing {
        EightBitter: IEightBittr;
        top: number;
        right: number;
        bottom: number;
        left: number;
        width: number;
        height: number;
        xvel: number;
        yvel: number;
    }

    export interface IEightBittrRequirementsListing {
        global?: {
            [i: string]: string;
        }
        self?: {
            [i: string]: string;
        }
    }

    export interface IEightBittrSettings {
        unitsize?: number;
        constantsSource?: any;
        constants?: string[];
        requirements?: any;
    }

    export interface IEightBittr {
        unitsize: number;
        checkRequirements(scope: any, requirements: any, name: string): void;
        reset(EightBitter: IEightBittr, resets: string[], customs?: any): void;
        resetTimed(EightBitter: IEightBittr, resets: string[], customs?: any): any[];
        get(name: any): Function;
        createCanvas(width: number, height: number, scaling?: number): HTMLCanvasElement;
        shiftVert(thing: IThing, dy: number): void;
        shiftHoriz(thing: IThing, dx: number): void;
        setTop(thing: IThing, top: number): void;
        setRight(thing: IThing, right: number): void;
        setBottom(thing: IThing, bottom: number): void;
        setLeft(thing: IThing, left: number): void;
        setMid(thing: IThing, x: number, y: number): void;
        setMidX(thing: IThing, x: number): void;
        setMidY(thing: IThing, y: number): void;
        getMidX(thing: IThing): number;
        getMidY(thing: IThing): number;
        setMidObj(thing: IThing, other: IThing): void;
        setMidXObj(thing: IThing, other: IThing): void;
        setMidYObj(thing: IThing, other: IThing): void;
        objectToLeft(thing: IThing, other: IThing): boolean;
        updateTop(thing: IThing, dy: number): void;
        updateRight(thing: IThing, dx: number): void;
        updateBottom(thing: IThing, dy: number): void;
        updateLeft(thing: IThing, dx: number): void;
        slideToX(thing: IThing, x: number, maxSpeed: number): void;
        slideToY(thing: IThing, y: number, maxSpeed: number): void;
        ensureCorrectCaller(current: any): IEightBittr;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        proliferateHard(recipient: any, donor: any, noOverride?: boolean): any;
        proliferateElement(recipient: HTMLElement, donor: any, noOverride?: boolean): HTMLElement;
        createElement(tag: string, ...args: any[]): HTMLElement;
        followPathHard(object: any, path: string[], num?: number): any;
        arraySwitch(thing: IThing, arrayOld: any[], arrayNew: any[]): void;
        arrayToBeginning(thing: IThing, array: any[]): void;
        arrayToEnd(thing: IThing, array: any[]): void;
        arrayToIndex(thing: IThing, array: any[], index: number): void;
    }
}

module EightBittr {
    "use strict";

    /**
     * An abstract class used exclusively as the parent of GameStartr. EightBittr
     * contains useful functions for manipulating Things that are independent of
     * the required GameStartr modules.
     */
    export class EightBittr implements IEightBittr {
        /**
         * How much to expand each pixel from raw sizing measurements to in-game.
         */
        public unitsize: number;

        /**
         * Any custom settings passed in during construction to be passed to
         * reset Functions.
         */
        protected customs: any;

        /**
         * A listing of the names of all member variables of this EightBittr
         * that should be pulled in from the setting's constantsSource.
         */
        protected constants: string[];

        /**
         * Variables that must exist, either listed under this EightBittr
         * (such as from a sub-class) or globally.
         */
        protected requirements: IEightBittrRequirementsListing;

        /**
         * EightBittr constructor. Settings arguments are used to initialize 
         * "constant" values and check for requirements.
         * 
         * @constructor
         * @param {IEightBittrSettings} settings
         */
        constructor(settings: IEightBittrSettings = {}) {
            var EightBitter: EightBittr = EightBittr.prototype.ensureCorrectCaller(this),
                constants: any = settings.constants,
                constantsSource: any = settings.constantsSource || EightBitter,
                requirements: any = settings.requirements,
                i: number;

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
                        // } else if (typeof global !== "undefined") {
                        //     EightBitter.checkRequirements(global, requirements.global, "global");
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
        checkRequirements(scope: any, requirements: any, name: string): void {
            var fails: string[] = [],
                requirement: any;

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
                throw new Error(
                    "Missing " + fails.length + " requirement(s) "
                    + "in " + name + ".\n"
                    + fails.map(function (requirement: string, i: number): string {
                        return i + ". " + requirement + ": is the '"
                            + requirements[requirement] + "' file included?";
                    }).join("\n")
                    );
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
        reset(EightBitter: EightBittr, resets: string[], customs: any = undefined): void {
            var reset: string,
                i: number;

            EightBitter.customs = customs;

            for (i = 0; i < resets.length; i += 1) {
                reset = resets[i];

                if (!EightBitter[reset]) {
                    throw new Error(reset + " is missing on a resetting EightBittr.");
                }

                EightBitter[reset](EightBitter, customs);
            }
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
        resetTimed(EightBitter: EightBittr, resets: string[], customs: any = undefined): any[] {
            var timeStart: number = performance.now(),
                times: any[] = [],
                timeEach: number,
                i: number;

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
         * @param {Mixed} name   Either the Function itself, or a string of the path
         *                       to the Function (after ".prototype.").
         * @return {Function}   A function, bound to set "this" to the calling
         *                      EightBitter
         */
        get(name: any): Function {
            var EightBitter: EightBittr = EightBittr.prototype.ensureCorrectCaller.call(this),
                func: Function;

            // If name is a string, turn it into a function path, and follow it
            if (name.constructor === String) {
                func = EightBitter.followPathHard(EightBitter, name.split("."), 0);
            } else if (name instanceof Array) {
                // If it's already a path (array), follow it
                func = EightBitter.followPathHard(EightBitter, name, 0);
            } else {
                // Otherwise func is just name
                func = name;
            }

            // Don't allow func to be undefined or some non-function object
            if (typeof (func) !== "function") {
                throw new Error(name + " is not defined in this EightBitter.");
            }

            // Bind the function to this
            return func.bind(EightBitter);
        }

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
        createCanvas(width: number, height: number, scaling: number = 1): HTMLCanvasElement {
            var canvas: HTMLCanvasElement = document.createElement("canvas"),
                // context: CanvasRenderingContext2D = canvas.getContext("2d");
                context: any = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            scaling = scaling || 1;

            // Scaling 1 by default, but may be different (e.g. unitsize)
            canvas.style.width = (width * scaling) + "px";
            canvas.style.height = (height * scaling) + "px";

            // For speed's sake, disable image smoothing in all browsers
            if (typeof context.imageSmoothingEnabled !== "undefined") {
                context.imageSmoothingEnabled = false;
            } else if (typeof context.webkitImageSmoothingEnabled !== "undefined") {
                context.webkitImageSmoothingEnabled = false;
            } else if (typeof context.mozImageSmoothingEnabled !== "undefined") {
                context.mozImageSmoothingEnabled = false;
            } else if (typeof context.msImageSmoothingEnabled !== "undefined") {
                context.msImageSmoothingEnabled = false;
            } else if (typeof context.oImageSmoothingEnabled !== "undefined") {
                context.oImageSmoothingEnabled = false;
            }

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
        shiftVert(thing: IThing, dy: number): void {
            thing.top += dy;
            thing.bottom += dy;
        }

        /**
         * Shifts a Thing horizontally by changing its top and bottom attributes.
         * 
         * @param {Thing} thing
         * @param {Number} dy
         */
        shiftHoriz(thing: IThing, dx: number): void {
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
        setTop(thing: IThing, top: number): void {
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
        setRight(thing: IThing, right: number): void {
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
        setBottom(thing: IThing, bottom: number): void {
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
        setLeft(thing: IThing, left: number): void {
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
        setMid(thing: IThing, x: number, y: number): void {
            thing.EightBitter.setMidX(thing, x);
            thing.EightBitter.setMidY(thing, y);
        }

        /**
         * Shifts a Thing so that it is horizontally centered on the given x.
         * 
         * @param {Thing} thing
         * @param {Number} x
         */
        setMidX(thing: IThing, x: number): void {
            thing.EightBitter.setLeft(
                thing,
                x - thing.width * thing.EightBitter.unitsize / 2);
        }

        /**
         * Shifts a Thing so that it is vertically centered on the given y.
         * 
         * @param {Thing} thing
         * @param {Number} y
         */
        setMidY(thing: IThing, y: number): void {
            thing.EightBitter.setTop(
                thing,
                y - thing.height * thing.EightBitter.unitsize / 2);
        }

        /**
         * @param {Thing} thing
         * @return {Number} The horizontal midpoint of the Thing.
         */
        getMidX(thing: IThing): number {
            return thing.left + thing.width * thing.EightBitter.unitsize / 2;
        }

        /**
         * @param {Thing} thing
         * @return {Number} The vertical midpoint of the Thing.
         */
        getMidY(thing: IThing): number {
            return thing.top + thing.height * thing.EightBitter.unitsize / 2;
        }

        /**
         * Shifts a Thing so that its midpoint is centered on the midpoint of the
         * other Thing.
         * 
         * @param {Thing} thing   The Thing to be shifted.
         * @param {Thing} other   The Thing whose midpoint is referenced.
         */
        setMidObj(thing: IThing, other: IThing): void {
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
        setMidXObj(thing: IThing, other: IThing): void {
            thing.EightBitter.setMidX(thing, thing.EightBitter.getMidX(other));
        }

        /**
         * Shifts a Thing so that its vertical midpoint is centered on the 
         * midpoint of the other Thing.
         * 
         * @param {Thing} thing   The Thing to be shifted.
         * @param {Thing} other   The Thing whose midpoint is referenced.
         */
        setMidYObj(thing: IThing, other: IThing): void {
            thing.EightBitter.setMidY(thing, thing.EightBitter.getMidY(other));
        }

        /**
         * @param {Thing} thing
         * @param {Thing} other
         * @return {Boolean} Whether the first Thing's midpoint is to the left of
         *                   the other's.
         */
        objectToLeft(thing: IThing, other: IThing): boolean {
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
        updateTop(thing: IThing, dy: number): void {
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
        updateRight(thing: IThing, dx: number): void {
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
        updateBottom(thing: IThing, dy: number): void {
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
        updateLeft(thing: IThing, dx: number): void {
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
        slideToX(thing: IThing, x: number, maxSpeed: number): void {
            var midx: number = thing.EightBitter.getMidX(thing);

            // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
            maxSpeed = maxSpeed || Infinity;

            // Thing to the left? Slide to the right.
            if (midx < x) {
                thing.EightBitter.shiftHoriz(thing, Math.min(maxSpeed, x - midx));
            } else {
                // Thing to the right? Slide to the left.
                thing.EightBitter.shiftHoriz(thing, Math.max(-maxSpeed, x - midx));
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
        slideToY(thing: IThing, y: number, maxSpeed: number): void {
            var midy: number = thing.EightBitter.getMidY(thing);

            // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
            maxSpeed = maxSpeed || Infinity;

            // Thing above? slide down.
            if (midy < y) {
                thing.EightBitter.shiftVert(thing, Math.min(maxSpeed, y - midy));
            } else {
                // Thing below? Slide up.
                thing.EightBitter.shiftVert(thing, Math.max(-maxSpeed, y - midy));
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
        ensureCorrectCaller(current: any): EightBittr {
            if (!(current instanceof EightBittr)) {
                throw new Error("A function requires the caller ('this') to be the "
                    + "manipulated EightBittr object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
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
         * @return {Mixed} recipient
         */
        proliferate(recipient: any, donor: any, noOverride: boolean = false): any {
            var setting: any,
                i: string;

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
                    } else {
                        // Regular primitives are easy to copy otherwise
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
         * @return {Mixed} recipient
         * @remarks This may not be good with JSLint, but it works for prototypal
         *          inheritance, since hasOwnProperty only is for the current class
         */
        proliferateHard(recipient: any, donor: any, noOverride: boolean = false): any {
            var setting: any,
                i: string;

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
                    } else {
                        // Regular primitives are easy to copy otherwise
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
         * @param {HTMLElement} recipient
         * @param {Any} donor
         * @param {Boolean} [noOverride]
         * @return {HTMLElement}
         */
        proliferateElement(recipient: HTMLElement, donor: any, noOverride: boolean = false): HTMLElement {
            var setting: any,
                i: string,
                j: number;

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
                            } else if (typeof setting === "object") {
                                // If it's an object, recurse on a new version of it
                                if (!recipient.hasOwnProperty(i)) {
                                    recipient[i] = new setting.constructor();
                                }
                                this.proliferate(recipient[i], setting, noOverride);
                            } else {
                                // Regular primitives are easy to copy otherwise
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
        createElement(tag: string, ...args: any[]): HTMLElement {
            var EightBitter: EightBittr = EightBittr.prototype.ensureCorrectCaller(this),
                element: any = document.createElement(tag || "div"),
                i: number;

            // For each provided object, add those settings to the element
            for (i = 1; i < arguments.length; i += 1) {
                EightBitter.proliferateElement(element, arguments[i]);
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
        followPathHard(object: any, path: string[], num: number = 0): any {
            for (var i: number = num || 0; i < path.length; i += 1) {
                if (typeof object[path[i]] === "undefined") {
                    return undefined;
                } else {
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
        arraySwitch(thing: IThing, arrayOld: any[], arrayNew: any[]): void {
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
        arrayToBeginning(thing: IThing, array: any[]): void {
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
        arrayToEnd(thing: IThing, array: any[]): void {
            array.splice(array.indexOf(thing), 1);
            array.push(thing);
        }

        /**
         * Sets a Thing's position within an Array to a specific index by splicing 
         * it out, then back in.
         * 
         * @param {Thing} thing
         * @param {Array} array
         * @param {Number} index
         */
        arrayToIndex(thing: IThing, array: any[], index: number): void {
            array.splice(array.indexOf(thing), 1);
            array.splice(index, 0, thing);
        }
    };
}
