/**
 * WorldSeedr.js
 * 
 * A randomization utility to automate random, recursive generation of 
 * possibilities based on a preset position and probability schema. Each 
 * "possibility" in the schema contains a width, height, and instructions on
 * what type of contents it contains, which are either a preset listing or
 * a randomization of other possibilities of certain probabilities. Additional
 * functionality is provided to stagger layout of children, such as spacing
 * between possibilities.
 * 
 * See Schema.json for a listing of allowed possibility properties.
 * 
 * @example
 * // Creating and using a WorldSeedr to generate a simple square.
 * var WorldSeeder = new WorldSeedr({
 *         "possibilities": {
 *             "Square": {
 *                 "width": 8,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Certain",
 *                     "children": [{
 *                         "type": "Known",
 *                         "title": "Square"
 *                     }]
 *                 }
 *             }
 *         }
 *     }),
 *     generated = WorldSeeder.generate("Square", {
 *         "top": 8,
 *         "right": 8,
 *         "bottom": 0,
 *         "left": 0
 *     });
 * 
 * // Object {top: 8, right: 8, bottom: 0, left: 0, children: Array[1]}
 * console.log(generated);
 * 
 * // Object {title: "Square", type: "Known", arguments: undefined, width: 8...}
 * console.log(generated.children[0]);
 * 
 * @example
 * // Creating and using a WorldSeedr to generate a square snapped to to the top
 * // of a tall area.
 * var WorldSeeder = new WorldSeedr({
 *         "possibilities": {
 *             "Square": {
 *                 "width": 8,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Certain",
 *                     "snap": "top",
 *                     "children": [{
 *                         "type": "Known",
 *                         "title": "Square"
 *                     }]
 *                 }
 *             }
 *         }
 *     }),
 *     generated = WorldSeeder.generate("Square", {
 *         "top": 16,
 *         "right": 8,
 *         "bottom": 0,
 *         "left": 0
 *     }),
 *     square = generated.children[0];
 * 
 * // Square is located at: {16, 8, 8, 0}
 * console.log("Square is located at: {" + [
 *     square.top, square.right, square.bottom, square.left
 * ].join(", ") + "}");
 * 
 * @example
 * // Creating and using a WorldSeedr to generate random shapes of random colors
 * // sporadically within a wide area.
 * 
 * var WorldSeeder = new WorldSeedr({
 *         "possibilities": {
 *             "Shapes": {
 *                 "width": 40,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Random",
 *                     "direction": "right",
 *                     "spacing": {
 *                         "min": 0,
 *                         "max": 4,
 *                         "units": 2
 *                     },
 *                     "children": [{
 *                         "percent": 35,
 *                         "title": "Square",
 *                         "arguments": [{
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Red"
 *                             }
 *                         }, {
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Purple"
 *                             }
 *                         }]
 *                     }, {
 *                         "percent": 35,
 *                         "title": "Circle",
 *                         "arguments": [{
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Orange"
 *                             }
 *                         }, {
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Blue"
 *                             }
 *                         }]
 *                     }, {
 *                         "percent": 30,
 *                         "title": "Triangle",
 *                         "arguments": [{
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Yellow"
 *                             }
 *                         }, {
 *                             "percent": 50,
 *                             "values": {
 *                                 "color": "Green"
 *                             }
 *                         }]
 *                     }]
 *                 }
 *             },
 *             "Square": {
 *                 "width": 8,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Certain",
 *                     "children": [{
 *                         "type": "Known",
 *                         "title": "Square",
 *                         "arguments": {
 *                             "red": "blue"
 *                         }
 *                     }]
 *                 }
 *             },
 *             "Circle": {
 *                 "width": 8,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Certain",
 *                     "children": [{
 *                         "type": "Known",
 *                         "title": "Circle"
 *                     }]
 *                 }
 *             },
 *             "Triangle": {
 *                 "width": 8,
 *                 "height": 8,
 *                 "contents": {
 *                     "mode": "Certain",
 *                     "children": [{
 *                         "type": "Known",
 *                         "title": "Triangle"
 *                     }]
 *                 }
 *             }
 *         }
 *     }),
 *     generated = WorldSeeder.generate("Shapes", {
 *         "top": 8,
 *         "right": 40,
 *         "bottom": 0,
 *         "left": 0
 *     }),
 *     output = [];
 * 
 * generated.children.forEach(function (child) {
 *     output.push(
 *         child.arguments.color + " " + child.title + " at " + child.left
 *     );
 * });
 * 
 * // One possibility:
 * // [
 * //     "Yellow Triangle at 0", 
 * //     "Yellow Triangle at 8", 
 * //     "Purple Square at 18", 
 * //     "Orange Circle at 26"
 * // ]
 * // Another possibility:
 * // [
 * //     "Green Triangle at 0",
 * //     "Yellow Triangle at 8",
 * //     "Red Square at 20", 
 * //     "Orange Circle at 30"
 * // ]
 * console.log(output);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com
 */
function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // A very large listing of possibilities, keyed by title
        possibilities,
        
        // Function used to generate a random number
        random,
        
        // Function called in self.generateFull to place a child
        onPlacement,
        
        // A constant listing of direction opposites, like top-bottom
        directionOpposites = {
            "top": "bottom",
            "right": "left",
            "bottom": "top",
            "left": "right"
        },
        
        // A constant listing of what direction the sides of areas correspond to
        directionSizing = {
            "top": "height",
            "right": "width",
            "bottom": "height",
            "left": "width"
        },
        
        // A constant Array of direction names
        directionNames = Object.keys(directionOpposites),
        
        // A constant Array of the dimension descriptors
        sizingNames = ["width", "height"],
        
        // Scratch Array of prethings to be added to during generation
        generatedCommands;
    
    /**
     * Resets the WorldSeedr.
     * 
     * @constructor
     * @param {Object} possibilities   The entire listing of possibilities that
     *                                 may be generated.
     * @param {Function} [random]   A Function to generate a random number in
     *                              [0,1) (by default, Math.random).
     * @param {Function} [onPlacement]   A Function callback for generated
     *                                   possibilities of type "known" to be
     *                                   called in runGeneratedCommands (by 
     *                                   default, console.log).
     */
    self.reset = function (settings) {
        if (typeof settings.possibilities === "undefined") {
            throw new Error("No possibilities given to WorldSeedr.");
        }
        
        possibilities = settings.possibilities;
        random = settings.random || Math.random.bind(Math);
        onPlacement = settings.onPlacement || console.log.bind(console, "Got:");
        
        self.clearGeneratedCommands();
    };
    
    
    /* Simple gets & sets
    */
    
    /**
     * @return {Object} The listing of possibilities that may be generated.
     */
    self.getPossibilities = function () {
        return possibilities;
    };
    
    /**
     * @param {Object} possibilitiesNew   A new Object to list possibilities
     *                                    that may be generated.
     */
    self.setPossibilities = function (possibilitiesNew) {
        possibilities = possibilitiesNew;
    };
    
    /**
     * @return {Function} The Function callback for generated possibilities of
     *                    type "known" to be called in runGeneratedCommands.
     */
    self.getOnPlacement = function () {
        return onPlacement;
    };
    
    /**
     * @param {Function} onPlacementNew   A new Function to be used as the
     *                                    onPlacement callback.
     */
    self.setOnPlacement = function (onPlacementNew) {
        onPlacement = onPlacementNew;
    };
    
    
    /* Generated commands
    */
    
    /**
     * Resets the generatedCommands Array so runGeneratedCommands can start.    
     */
    self.clearGeneratedCommands = function () {
        generatedCommands = [];
    };
    
    /**
     * Runs the onPlacement callback on the generatedCommands Array.
     */
    self.runGeneratedCommands = function () {
        onPlacement(generatedCommands);
    };
    
    
    /* Hardcore generation functions
    */
    
    /**
     * Generates a collection of randomly chosen possibilities based on the 
     * given schema mapping. These does not recursively parse the output; do
     * do that, use generateFull.
     * 
     * @param {String} name   The name of the possibility schema to start from.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    self.generate = function (name, position) {
        var schema = possibilities[name];
        
        if (!schema) {
            throw new Error("No possibility exists under '" + name + "'");
        }
        
        if (!schema.contents) {
            throw new Error("'" + name + "' has no possibile outcomes.");
        }
        
        return generateChildren(schema, positionCopy(position));
    };
    
    /**
     * Recursively generates a schema. The schema's title and itself are given 
     * to self.generate; all outputs of type "Known" are added to the 
     * generatedCommands Array, while everything else is recursed upon.
     * 
     * @param {Object} schema   A simple Object with basic information on the
     *                          chosen possibility.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children. 
     */
    self.generateFull = function (schema) {
        var generated = self.generate(schema.title, schema),
            child, contents, i;
        
        for (i in generated.children) {
            child = generated.children[i];
                    
            switch (child.type) {
                case "Known":
                    generatedCommands.push(child);
                    break;
                case "Random":
                    self.generateFull(child);
                    break;
            }
        }
        
        return generatedCommands;
    };
    
    /**
     * Generates the children for a given schema, position, and direction. This
     * is the real hardcore function called by self.generate, which calls the
     * differnt subroutines based on whether the contents are in "Certain" or
     * "Random" mode.
     * 
     * @param {Object} schema   A simple Object with basic information on the
     *                          chosen possibility.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} [direction]   A string direction to check the position 
     *                               by ("top", "right", "bottom", or "left")
     *                               as a default if contents.direction isn't
     *                               provided.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateChildren(schema, position, direction) {
        var contents = schema.contents,
            spacing = contents.spacing || 0,
            positionMerged = positionMerge(schema, position),
            children, 
            child;
        
        direction = contents.direction || direction;
        
        switch (contents.mode) {
            case "Random":
                children = generateChildrenRandom(contents, positionMerged, direction, spacing);
                break;
            case "Certain":
                children = generateChildrenCertain(contents, positionMerged, direction, spacing);
                break;
            case "Repeat":
                children = generateChildrenRepeat(contents, positionMerged, direction, spacing);
                break;
            case "Multiple":
                children = generateChildrenMultiple(contents, positionMerged, direction, spacing);
                break;
        }
        
        return getPositionExtremes(children);
    }
    
    /**
     * Generates a schema's children that are known to follow a set listing of
     * sub-schemas.
     * 
     * @param {Object} contents   The Array of known possibilities, in order.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} spacing   How much space there should be between each
     *                           child.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateChildrenCertain(contents, position, direction, spacing) {
        var child;
        
        return contents.children.map(function (choice) {
            if (choice.type === "Final") {
                return parseChoiceFinal(contents, choice, position, direction);
            }
            
            child = parseChoice(choice, position, direction);
            if (child) {
                if (child.type !== "Known") {
                    child.contents = self.generate(child.title, position);
                }
                shrinkPositionByChild(position, child, direction, spacing);
            }
            return child;
        }).filter(function (child) {
            return child;
        });
    }
    
    
    /**
     * Generates a schema's children that are known to follow a set listing of
     * sub-schemas, repeated until there is no space left.
     * 
     * @param {Object} contents   The Array of known possibilities, in order.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} spacing   How much space there should be between each
     *                           child.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateChildrenRepeat(contents, position, direction, spacing) {
        var choices = contents.children,
            positionOld = positionCopy(position),
            children = [],
            choice, child, 
            i = 0;
        
        while(positionIsNotEmpty(position, direction)) {
            choice = choices[i];
            
            if (choice.type === "Final") {
                child = parseChoiceFinal(contents, choice, position, direction);
            } else {
                child = parseChoice(choice, position, direction);
                
                if (child) {
                    if (child.type !== "Known") {
                        child.contents = self.generate(child.title, position);
                    }
                }
            }
            
            if (child && doesChoiceFitPosition(child, position)) {
                shrinkPositionByChild(position, child, direction, spacing);
                children.push(child);
            } else {
                break;
            }
            
            i += 1;
            if (i >= choices.length) {
                i = 0;
            }
        }
        
        return children;
    }
    
    /**
     * Generates a schema's children that are known to be randomly chosen from a
     * list of possibilities until there is no more room.
     * 
     * @param {Object} contents   The Array of known possibilities, with 
     *                            probability percentages.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} spacing   How much space there should be between each 
     *                           child.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateChildrenRandom(contents, position, direction, spacing) {
        var children = [],
            child;
        
        while(positionIsNotEmpty(position, direction)) {
            child = generateChild(contents, position, direction);
            if (!child) {
                break;
            }
            
            shrinkPositionByChild(position, child, direction, spacing);
            children.push(child);
            
            if (contents.limit && children.length > contents.limit) {
                return;
            }
        }
        
        return children;
    }
    
    /**
     * Generates a schema's children that are all to be placed within the same
     * position. If a direction is provided, each subsequent one is shifted in
     * that direction by spacing.
     * 
     * @param {Object} contents   The Array of known possibilities, with 
     *                            probability percentages.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} [direction]   A string direction to check the position by:
     *                               "top", "right", "bottom", or "left".
     * @param {Number} [spacing]   How much space there should be between each 
     *                             child.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateChildrenMultiple(contents, position, direction, spacing) {
        return contents.children.map(function (choice) {
            var output = parseChoice(choice, positionCopy(position), direction);
            
            if (direction) {
                movePositionBySpacing(position, direction, spacing);
            }
            
            return output;
        });
    }
    
    
    /* Choice parsing
    */
    
    /**
     * Shortcut function to choose a choice from an allowed set of choices, and
     * parse it for positioning and sub-choices.
     * 
     * @param {Object} contents   An Array of choice Objects, each of which must
     *                            have a .percentage.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @return {Object}   An Object containing the bounding box position of a
     *                    parsed child, with the basic schema (.title) info 
     *                    added as well as any optional .arguments.
     */
    function generateChild(contents, position, direction) {
        var choice = chooseAmongPosition(contents.children, position);
        
        if (!choice) {
            return undefined;
        }
        
        return parseChoice(choice, position, direction);
    }
    
    /**
     * Creates a parsed version of a choice given the position and direction.
     * This is the function that parses and manipulates the positioning of the
     * new choice.
     * 
     * @param {Object} choice   The simple definition of the Object chosen from
     *                          a choices array. It should have at least .title,
     *                          and optionally .sizing or .arguments.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     * @return {Object}   An Object containing the bounding box position of a
     *                    parsed child, with the basic schema (.title) info 
     *                    added as well as any optional .arguments.
     */
    function parseChoice(choice, position, direction) {
        var title = choice.title,
            schema = possibilities[title],
            sizing = choice["sizing"],
            stretch = choice["stretch"],
            output = {
                "title": title,
                "type": choice.type,
                "arguments": choice["arguments"] instanceof Array
                    ? chooseAmong(choice["arguments"]).values
                    : choice["arguments"],
            },
            name, i;
        
        for (i in sizingNames) {
            name = sizingNames[i];
            
            output[name] = (sizing && typeof sizing[name] !== "undefined")
                ? sizing[name]
                : schema[name];
        }
        
        for (i in directionNames) {
            name = directionNames[i];
            output[name] = position[name];
        }
        output[direction] = output[directionOpposites[direction]]
            + output[directionSizing[direction]];
        
        switch (schema.contents.snap) {
            case "top":
                output["bottom"] = output["top"] - output["height"];
                break;
            case "right":
                output["left"] = output["right"] - output["width"];
                break;
            case "bottom":
                output["top"] = output["bottom"] + output["height"];
                break;
            case "left":
                output["right"] = output["left"] + output["width"];
                break;
        }
        
        if (stretch) {
            if (stretch.width) {
                output.left = position.left;
                output.right = position.right;
                output.width = output.right - output.left;
                if (!output.arguments) {
                    output.arguments = {
                        "width": output.width
                    };
                } else {
                    output.arguments.width = output.width;
                }
            }
            if (stretch.height) {
                output.top = position.top;
                output.bottom = position.bottom;
                output.height = output.top - output.bottom;
                if (!output.arguments) {
                    output.arguments = {
                        "height": output.height
                    };
                } else {
                    output.arguments.height = output.height;
                }
            }
        }
        
        copySchemaArguments(schema, choice, output);
        
        return output;
    }
    
    /**
     * should conform to parent (contents) via cannonsmall.snap=bottom
     */
    function parseChoiceFinal(parent, choice, position, direction) {
        var schema = possibilities[choice.source],
            output = {
                "type": "Known",
                "title": choice.title,
                "arguments": choice.arguments,
                "width": schema.width,
                "height": schema.height,
                "top": position.top,
                "right": position.right,
                "bottom": position.bottom,
                "left": position.left
            };
        
        copySchemaArguments(schema, choice, output);
        
        return output;
    }
    
    
    /* Randomization utilities
    */
    
    /**
     * From an Array of potential choice objects, returns one chosen at random.
     * 
     * @param {Array} choice   An Array of objects with .width and .height.
     * @return {Object}
     */
    function chooseAmong(choices) {
        if (!choices.length) {
            return undefined;
        }
        if (choices.length === 1) {
            return choices[0];
        }
        
        var choice = randomPercentage(),
            sum = 0,
            i;
        
        for (i = 0; i < choices.length; i += 1) {
            sum += choices[i].percent;
            if (sum >= choice) {
                return choices[i];
            }
        }
    }
    
    /**
     * From an Array of potential choice objects, filtered to only include those
     * within a certain size, returns one chosen at random.
     *
     * @param {Array} choice   An Array of objects with .width and .height.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Object}
     * @remarks Functions that use this will have to react to nothing being 
     *          chosen. For example, if only 50 percentage is accumulated 
     *          among fitting ones but 75 is randomly chosen, something should
     *          still be returned.
     */
    function chooseAmongPosition(choices, position) {
        var width = position.right - position.left,
            height = position.top - position.bottom;
        
        return chooseAmong(choices.filter(function (choice) {
            return doesChoiceFit(possibilities[choice.title], width, height);
        }));
    }
    
    /**
     * Checks whether a choice can fit within a width and height.
     * 
     * @param {Object} choice   An Object that contains .width and .height.
     * @param {Number} width
     * @param {Number} height
     * @return {Boolean} Whether the choice fits within the position.
     */
    function doesChoiceFit(choice, width, height) {
        return choice.width <= width && choice.height <= height;
    }
    
    /**
     * Checks whether a choice can fit within a position.
     * 
     * @param {Object} choice   An Object that contains .width and .height.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Boolean} The boolean equivalent of the choice fits
     *                   within the position.
     * @remarks When calling multiple times on a position (such as in 
     *          chooseAmongPosition), it's more efficient to store the width
     *          and height separately and just use doesChoiceFit.                
     */
     function doesChoiceFitPosition(choice, position) {
        return doesChoiceFit(
            choice,
            position.right - position.left, 
            position.top - position.bottom
        );
     }
    
    /**
     * @return {Number} A number in [1, 100] at random.
     */
    function randomPercentage() {
        return Math.floor(random() * 100) + 1;
    }
    
    /**
     * @return {Number} A number in [min, max] at random.
     */
    function randomBetween(min, max) {
        return Math.floor(random() * (1 + max - min)) + min;
    }
    
    
    /* Position manipulation utilities
    */
    
    /**
     * Creates and returns a copy of a position (really just a shallow copy).
     * 
     * @param {Object} position
     * @return {Object}
     */
    function positionCopy(position) {
        var output = {},
            i;
        
        for (i in position) {
            if (position.hasOwnProperty(i)) {
                output[i] = position[i];
            }
        }
        
        return output;
    }
    
    /**
     * Creates a new position with all required attributes taking from the 
     * primary source or secondary source, in that order.
     * 
     * @param {Object} primary
     * @param {Object} secondary
     * @return {Object}
     */
    function positionMerge(primary, secondary) {
        var output = positionCopy(primary),
            i;
        
        for (i in secondary) {
            if (!output.hasOwnProperty(i)) {
                output[i] = secondary[i];
            }
        }
        
        return output;
    }
    
    /**
     * Checks and returns whether a position has open room in a particular
     * direction (horizontally for left/right and vertically for top/bottom).
     * 
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position in:
     *                             "top", "right", "bottom", or "left".
     */
    function positionIsNotEmpty(position, direction) {
        if (direction === "right" || direction === "left") {
            return position.left < position.right;
        } else {
            return position.top > position.bottom;
        }
    }
    
    /**
     * Shrinks a position by the size of a child, in a particular direction.
     * 
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {Object} child   An Object that contains .left, .right, .top, and
     *                         .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Mixed} [spacing]   How much space there should be between each
     *                            child (by default, 0).
     */
    function shrinkPositionByChild(position, child, direction, spacing) {
        switch (direction) {
            case "top":
                position.bottom = child.top + parseSpacing(spacing);
                return;
            case "right":
                position.left = child.right + parseSpacing(spacing);
                return;
            case "bottom":
                position.top = child.bottom - parseSpacing(spacing);
                return;
            case "left":
                position.right = child.left - parseSpacing(spacing);
                return;
        }
    }
    
    /**
     * Moves a position by its parsed spacing. This is only useful for content
     * of type "Multiple", which are allowed to move themselves via spacing 
     * between placements.
     *
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Mixed} [spacing]   How much space there should be between each
     *                            child (by default, 0).
     */
    function movePositionBySpacing(position, direction, spacing) {
        var space = parseSpacing(spacing);
        
        switch (direction) {
            case "top":
                position.top += space;
                position.bottom += space;
                return;
            case "right":
                position.left += space;
                position.right += space;
                return;
            case "bottom":
                position.top -= space;
                position.bottom -= space;
                return;
            case "left":
                position.left -= space;
                position.right -= space;
                return;
        }
    }
    
    /**
     * Recursively parses a spacing parameter to eventually return a Number, 
     * which will likely be random.
     * 
     * @param {Mixed} spacing   This may be a Number (returned directly), an
     *                          Object[] containing choices for chooseAmong, a
     *                          Number[] containing minimum and maximum values,
     *                          or an Object containing "min", "max", and 
     *                          "units" to round to.
     * @return {Number}
     */
    function parseSpacing(spacing) {
        if (!spacing) {
            return 0;
        }
        
        switch (spacing.constructor) {
            case Array:
                if (spacing[0].constructor === Number) {
                    return parseSpacingObject(
                        randomBetween(spacing[0], spacing[1])
                    );
                } else {
                    return parseSpacingObject(
                        chooseAmong(spacing).value
                    );
                }
            case Object:
                return parseSpacingObject(spacing);
            default:
                return spacing;
        }
    }
    
    /**
     * Helper to parse a spacing Object. The minimum and maximum ("min" and 
     * "max", respectively) are the range, and an optional "units" parameter
     * is what Number it should round to.
     * 
     * @param {Object} spacing
     * @return {Number}
     */
    function parseSpacingObject(spacing) {
        if (spacing.constructor === Number) {
            return spacing;
        }
        
        var min = spacing.min,
            max = spacing.max,
            units = spacing.units || 1;
        
        return randomBetween(min / units, max / units) * units;
    }
    
    /**
     * Generates the bounding box position Object (think rectangle) for a set of
     * children. The top, right, etc. member variables become the most extreme
     * out of all the possibilities.
     * 
     * @param {Object} children   An Array of objects with .top, .right,
     *                            .bottom, and .left.
     * @return {Object}   An Object with .top, .right, .bottom, and .left.
     */
    function getPositionExtremes(children) {
        var position, child, i;
        
        if (!children || !children.length) {
            return {};
        }
        
        child = children[0];
        position = {
            "top": child.top,
            "right": child.right,
            "bottom": child.bottom,
            "left": child.left,
            "children": children
        };
        
        if (children.length === 1) {
            return position;
        }
        
        for (i = 1; i < children.length; i += 1) {
            child = children[i];
            
            if (!Object.keys(child).length) {
                return position;
            }
            
            position["top"] = Math.max(position["top"], child["top"]);
            position["right"] = Math.max(position["right"], child["right"]);
            position["bottom"] = Math.min(position["bottom"], child["bottom"]);
            position["left"] = Math.min(position["left"], child["left"]);
        }
        
        return position;
    }
    
    /**
     * Copies settings from a parsed choice to its arguments. What settings to
     * copy over are determined by the schema's content's argumentMap attribute.
     * 
     * @param {Object} schema   A simple Object with basic information on the
     *                          chosen possibility.
     * @param {Object} choice   The simple definition of the Object chosen from
     *                          a choices array.
     * @param {Object} output   The Object (likely a parsed possibility content)
     *                          having its arguments modified.    
     */
    function copySchemaArguments(schema, choice, output) {
        var map = schema.contents.argumentMap,
            i;
        
        if (!map) {
            return;
        }
        
        if (!output.arguments) {
            output.arguments = {};
        }
        
        for (i in map) {
            output.arguments[map[i]] = choice[i];
        }
    }
    
    
    self.reset(settings || {});
}