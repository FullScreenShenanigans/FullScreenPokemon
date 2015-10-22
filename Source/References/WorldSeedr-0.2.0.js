var WorldSeedr;
(function (WorldSeedr_1) {
    "use strict";
    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on a preset position and probability schema. Each
     * "possibility" in the schema contains a width, height, and instructions on
     * what type of contents it contains, which are either a preset listing or
     * a randomization of other possibilities of certain probabilities. Additional
     * functionality is provided to stagger layout of children, such as spacing
     * between possibilities.
     */
    var WorldSeedr = (function () {
        /**
         * @param {IWorldSeedrSettings} settings
         */
        function WorldSeedr(settings) {
            /**
             * A constant listing of direction opposites, like top-bottom.
             */
            this.directionOpposites = {
                "top": "bottom",
                "right": "left",
                "bottom": "top",
                "left": "right"
            };
            /**
             * A constant listing of what direction the sides of areas correspond to.
             */
            this.directionSizing = {
                "top": "height",
                "right": "width",
                "bottom": "height",
                "left": "width"
            };
            /**
             * A constant Array of direction names.
             */
            this.directionNames = ["top", "right", "bottom", "left"];
            /**
             * A constant Array of the dimension descriptors.
             */
            this.sizingNames = ["width", "height"];
            if (typeof settings.possibilities === "undefined") {
                throw new Error("No possibilities given to WorldSeedr.");
            }
            this.possibilities = settings.possibilities;
            this.random = settings.random || Math.random.bind(Math);
            this.onPlacement = settings.onPlacement || console.log.bind(console, "Got:");
            this.clearGeneratedCommands();
        }
        /* Simple gets & sets
        */
        /**
         * @return {Object} The listing of possibilities that may be generated.
         */
        WorldSeedr.prototype.getPossibilities = function () {
            return this.possibilities;
        };
        /**
         * @param {Object} possibilitiesNew   A new Object to list possibilities
         *                                    that may be generated.
         */
        WorldSeedr.prototype.setPossibilities = function (possibilities) {
            this.possibilities = possibilities;
        };
        /**
         * @return {Function} The Function callback for generated possibilities of
         *                    type "known" to be called in runGeneratedCommands.
         */
        WorldSeedr.prototype.getOnPlacement = function () {
            return this.onPlacement;
        };
        /**
         * @param {Function} onPlacementNew   A new Function to be used as the
         *                                    onPlacement callback.
         */
        WorldSeedr.prototype.setOnPlacement = function (onPlacement) {
            this.onPlacement = onPlacement;
        };
        /* Generated commands
        */
        /**
         * Resets the generatedCommands Array so runGeneratedCommands can start.
         */
        WorldSeedr.prototype.clearGeneratedCommands = function () {
            this.generatedCommands = [];
        };
        /**
         * Runs the onPlacement callback on the generatedCommands Array.
         */
        WorldSeedr.prototype.runGeneratedCommands = function () {
            this.onPlacement(this.generatedCommands);
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
        WorldSeedr.prototype.generate = function (name, command) {
            var schema = this.possibilities[name];
            if (!schema) {
                throw new Error("No possibility exists under '" + name + "'");
            }
            if (!schema.contents) {
                throw new Error("Possibility '" + name + "' has no possibile outcomes.");
            }
            return this.generateChildren(schema, this.objectCopy(command));
        };
        /**
         * Recursively generates a schema. The schema's title and itself are given
         * to this.generate; all outputs of type "Known" are added to the
         * generatedCommands Array, while everything else is recursed upon.
         *
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateFull = function (schema) {
            var generated = this.generate(schema.title, schema), child, i;
            if (!generated || !generated.children) {
                return;
            }
            for (i = 0; i < generated.children.length; i += 1) {
                child = generated.children[i];
                switch (child.type) {
                    case "Known":
                        this.generatedCommands.push(child);
                        break;
                    case "Random":
                        this.generateFull(child);
                        break;
                    default:
                        throw new Error("Unknown child type: " + child.type);
                }
            }
        };
        /**
         * Generates the children for a given schema, position, and direction. This
         * is the real hardcore function called by this.generate, which calls the
         * differnt subroutines based on whether the contents are in "Certain" or
         * "Random" mode.
         *
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} [direction]   A string direction to check the position
         *                               by ("top", "right", "bottom", or "left")
         *                               as a default if contents.direction isn't
         *                               provided.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildren = function (schema, position, direction) {
            if (direction === void 0) { direction = undefined; }
            var contents = schema.contents, spacing = contents.spacing || 0, objectMerged = this.objectMerge(schema, position), children;
            direction = contents.direction || direction;
            switch (contents.mode) {
                case "Random":
                    children = this.generateChildrenRandom(contents, objectMerged, direction, spacing);
                    break;
                case "Certain":
                    children = this.generateChildrenCertain(contents, objectMerged, direction, spacing);
                    break;
                case "Repeat":
                    children = this.generateChildrenRepeat(contents, objectMerged, direction, spacing);
                    break;
                case "Multiple":
                    children = this.generateChildrenMultiple(contents, objectMerged, direction, spacing);
                    break;
                default:
                    throw new Error("Unknown contents mode: " + contents.mode);
            }
            return this.wrapChoicePositionExtremes(children);
        };
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas.
         *
         * @param {Object} contents   The known possibilities to choose between.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Number} spacing   How much space there should be between each
         *                           child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenCertain = function (contents, position, direction, spacing) {
            var scope = this;
            return contents.children.map(function (choice) {
                if (choice.type === "Final") {
                    return scope.parseChoiceFinal(contents, choice, position, direction);
                }
                var output = scope.parseChoice(choice, position, direction);
                if (output) {
                    if (output.type !== "Known") {
                        output.contents = scope.generate(output.title, position);
                    }
                    scope.shrinkPositionByChild(position, output, direction, spacing);
                }
                return output;
            }).filter(function (child) {
                return child !== undefined;
            });
        };
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas, repeated until there is no space left.
         *
         * @param {Object} contents   The known possibilities to choose between.
         * @param {Object} position   The bounding box for where the children may
         *                            be generated.
         * @param {String} direction   A string direction to check the position by:
         *                             "top", "right", "bottom", or "left".
         * @param {Number} spacing   How much space there should be between each
         *                           child.
         * @return {Object}   An Object containing a position within the given
         *                    position and some number of children.
         */
        WorldSeedr.prototype.generateChildrenRepeat = function (contents, position, direction, spacing) {
            var choices = contents.children, children = [], choice, child, i = 0;
            // Continuously loops through the choices and adds them to the output
            // children, so long as there's still room for them
            while (this.positionIsNotEmpty(position, direction)) {
                choice = choices[i];
                if (choice.type === "Final") {
                    child = this.parseChoiceFinal(contents, choice, position, direction);
                }
                else {
                    child = this.parseChoice(choice, position, direction);
                    if (child) {
                        if (child.type !== "Known") {
                            child.contents = this.generate(child.title, position);
                        }
                    }
                }
                if (child && this.choiceFitsPosition(child, position)) {
                    this.shrinkPositionByChild(position, child, direction, spacing);
                    children.push(child);
                }
                else {
                    break;
                }
                i += 1;
                if (i >= choices.length) {
                    i = 0;
                }
            }
            return children;
        };
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
        WorldSeedr.prototype.generateChildrenRandom = function (contents, position, direction, spacing) {
            var children = [], child;
            // Continuously add random choices to the output children as long as 
            // there's room in the position's bounding box
            while (this.positionIsNotEmpty(position, direction)) {
                child = this.generateChild(contents, position, direction);
                if (!child) {
                    break;
                }
                this.shrinkPositionByChild(position, child, direction, spacing);
                children.push(child);
                if (contents.limit && children.length > contents.limit) {
                    return;
                }
            }
            return children;
        };
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
        WorldSeedr.prototype.generateChildrenMultiple = function (contents, position, direction, spacing) {
            var scope = this;
            return contents.children.map(function (choice) {
                var output = scope.parseChoice(choice, scope.objectCopy(position), direction);
                if (direction) {
                    scope.movePositionBySpacing(position, direction, spacing);
                }
                return output;
            });
        };
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
        WorldSeedr.prototype.generateChild = function (contents, position, direction) {
            var choice = this.chooseAmongPosition(contents.children, position);
            if (!choice) {
                return undefined;
            }
            return this.parseChoice(choice, position, direction);
        };
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
        WorldSeedr.prototype.parseChoice = function (choice, position, direction) {
            var title = choice.title, schema = this.possibilities[title], output = {
                "title": title,
                "type": choice.type,
                "arguments": choice.arguments instanceof Array
                    ? (this.chooseAmong(choice.arguments)).values
                    : choice.arguments,
                "width": undefined,
                "height": undefined,
                "top": undefined,
                "right": undefined,
                "bottom": undefined,
                "left": undefined
            };
            this.ensureSizingOnChoice(output, choice, schema);
            this.ensureDirectionBoundsOnChoice(output, position);
            output[direction] = output[this.directionOpposites[direction]] + output[this.directionSizing[direction]];
            switch (schema.contents.snap) {
                case "top":
                    output.bottom = output.top - output.height;
                    break;
                case "right":
                    output.left = output.right - output.width;
                    break;
                case "bottom":
                    output.top = output.bottom + output.height;
                    break;
                case "left":
                    output.right = output.left + output.width;
                    break;
                default:
                    break;
            }
            if (choice.stretch) {
                if (!output.arguments) {
                    output.arguments = {};
                }
                if (choice.stretch.width) {
                    output.left = position.left;
                    output.right = position.right;
                    output.width = output.right - output.left;
                    output.arguments.width = output.width;
                }
                if (choice.stretch.height) {
                    output.top = position.top;
                    output.bottom = position.bottom;
                    output.height = output.top - output.bottom;
                    output.arguments.height = output.height;
                }
            }
            this.copySchemaArguments(schema, choice, output);
            return output;
        };
        /**
         * should conform to parent (contents) via cannonsmall.snap=bottom
         */
        WorldSeedr.prototype.parseChoiceFinal = function (parent, choice, position, direction) {
            var schema = this.possibilities[choice.source], output = {
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
            this.copySchemaArguments(schema, choice, output);
            return output;
        };
        /* Randomization utilities
        */
        /**
         * From an Array of potential choice objects, returns one chosen at random.
         *
         * @param {Array} choice   An Array of objects with .width and .height.
         * @return {Object}
         */
        WorldSeedr.prototype.chooseAmong = function (choices) {
            if (!choices.length) {
                return undefined;
            }
            if (choices.length === 1) {
                return choices[0];
            }
            var choice = this.randomPercentage(), sum = 0, i;
            for (i = 0; i < choices.length; i += 1) {
                sum += choices[i].percent;
                if (sum >= choice) {
                    return choices[i];
                }
            }
        };
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
        WorldSeedr.prototype.chooseAmongPosition = function (choices, position) {
            var width = position.right - position.left, height = position.top - position.bottom, scope = this;
            return this.chooseAmong(choices.filter(function (choice) {
                return scope.choiceFits(scope.possibilities[choice.title], width, height);
            }));
        };
        /**
         * Checks whether a choice can fit within a width and height.
         *
         * @param {Object} choice   An Object that contains .width and .height.
         * @param {Number} width
         * @param {Number} height
         * @return {Boolean} Whether the choice fits within the position.
         */
        WorldSeedr.prototype.choiceFits = function (choice, width, height) {
            return choice.width <= width && choice.height <= height;
        };
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
        WorldSeedr.prototype.choiceFitsPosition = function (choice, position) {
            return this.choiceFits(choice, position.right - position.left, position.top - position.bottom);
        };
        /**
         * @return {Number} A number in [1, 100] at random.
         */
        WorldSeedr.prototype.randomPercentage = function () {
            return Math.floor(this.random() * 100) + 1;
        };
        /**
         * @return {Number} A number in [min, max] at random.
         */
        WorldSeedr.prototype.randomBetween = function (min, max) {
            return Math.floor(this.random() * (1 + max - min)) + min;
        };
        /* Position manipulation utilities
        */
        /**
         * Creates and returns a copy of a position (really just a shallow copy).
         *
         * @param {Object} original
         * @return {Object}
         */
        WorldSeedr.prototype.objectCopy = function (original) {
            var output = {}, i;
            for (i in original) {
                if (original.hasOwnProperty(i)) {
                    output[i] = original[i];
                }
            }
            return output;
        };
        /**
         * Creates a new position with all required attributes taking from the
         * primary source or secondary source, in that order.
         *
         * @param {Object} primary
         * @param {Object} secondary
         * @return {Object}
         */
        WorldSeedr.prototype.objectMerge = function (primary, secondary) {
            var output = this.objectCopy(primary), i;
            for (i in secondary) {
                if (secondary.hasOwnProperty(i) && !output.hasOwnProperty(i)) {
                    output[i] = secondary[i];
                }
            }
            return output;
        };
        /**
         * Checks and returns whether a position has open room in a particular
         * direction (horizontally for left/right and vertically for top/bottom).
         *
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         * @param {String} direction   A string direction to check the position in:
         *                             "top", "right", "bottom", or "left".
         */
        WorldSeedr.prototype.positionIsNotEmpty = function (position, direction) {
            if (direction === "right" || direction === "left") {
                return position.left < position.right;
            }
            else {
                return position.top > position.bottom;
            }
        };
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
        WorldSeedr.prototype.shrinkPositionByChild = function (position, child, direction, spacing) {
            switch (direction) {
                case "top":
                    position.bottom = child.top + this.parseSpacing(spacing);
                    break;
                case "right":
                    position.left = child.right + this.parseSpacing(spacing);
                    break;
                case "bottom":
                    position.top = child.bottom - this.parseSpacing(spacing);
                    break;
                case "left":
                    position.right = child.left - this.parseSpacing(spacing);
                    break;
                default:
                    break;
            }
        };
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
        WorldSeedr.prototype.movePositionBySpacing = function (position, direction, spacing) {
            if (spacing === void 0) { spacing = 0; }
            var space = this.parseSpacing(spacing);
            switch (direction) {
                case "top":
                    position.top += space;
                    position.bottom += space;
                    break;
                case "right":
                    position.left += space;
                    position.right += space;
                    break;
                case "bottom":
                    position.top -= space;
                    position.bottom -= space;
                    break;
                case "left":
                    position.left -= space;
                    position.right -= space;
                    break;
                default:
                    throw new Error("Unknown direction: " + direction);
            }
        };
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
        WorldSeedr.prototype.parseSpacing = function (spacing) {
            if (!spacing) {
                return 0;
            }
            switch (spacing.constructor) {
                case Array:
                    // Case: [min, max]
                    if (spacing[0].constructor === Number) {
                        return this.parseSpacingObject(this.randomBetween(spacing[0], spacing[1]));
                    }
                    // Case: IPossibilitySpacingOption[]
                    return this.parseSpacingObject(this.chooseAmong(spacing).value);
                case Object:
                    // Case: IPossibilitySpacing
                    return this.parseSpacingObject(spacing);
                default:
                    // Case: Number
                    return spacing;
            }
        };
        /**
         * Helper to parse a spacing Object. The minimum and maximum ("min" and
         * "max", respectively) are the range, and an optional "units" parameter
         * is what Number it should round to.
         *
         * @param {Object} spacing
         * @return {Number}
         */
        WorldSeedr.prototype.parseSpacingObject = function (spacing) {
            if (spacing.constructor === Number) {
                return spacing;
            }
            var min = spacing.min, max = spacing.max, units = spacing.units || 1;
            return this.randomBetween(min / units, max / units) * units;
        };
        /**
         * Generates the bounding box position Object (think rectangle) for a set of
         * children. The top, right, etc. member variables become the most extreme
         * out of all the possibilities.
         *
         * @param {Object} children   An Array of Objects with .top, .right,
         *                            .bottom, and .left.
         * @return {Object}   An Object with .top, .right, .bottom, and .left.
         */
        WorldSeedr.prototype.wrapChoicePositionExtremes = function (children) {
            var position, child, i;
            if (!children || !children.length) {
                return undefined;
            }
            child = children[0];
            position = {
                "title": undefined,
                "top": child.top,
                "right": child.right,
                "bottom": child.bottom,
                "left": child.left,
                "width": undefined,
                "height": undefined,
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
                position.top = Math.max(position.top, child.top);
                position.right = Math.max(position.right, child.right);
                position.bottom = Math.min(position.bottom, child.bottom);
                position.left = Math.min(position.left, child.left);
            }
            position.width = position.right - position.left;
            position.height = position.top - position.bottom;
            return position;
        };
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
        WorldSeedr.prototype.copySchemaArguments = function (schema, choice, output) {
            var map = schema.contents.argumentMap, i;
            if (!map) {
                return;
            }
            if (!output.arguments) {
                output.arguments = {};
            }
            for (i in map) {
                if (map.hasOwnProperty(i)) {
                    output.arguments[map[i]] = choice[i];
                }
            }
        };
        /**
         * Ensures an output from parseChoice contains all the necessary size
         * measurements, as listed in this.sizingNames.
         *
         * @param {Object} output   The Object (likely a parsed possibility content)
         *                          having its arguments modified.
         * @param {Object} choice   The simple definition of the Object chosen from
         *                          a choices array.
         * @param {Object} schema   A simple Object with basic information on the
         *                          chosen possibility.
         */
        WorldSeedr.prototype.ensureSizingOnChoice = function (output, choice, schema) {
            var name, i;
            for (i in this.sizingNames) {
                if (!this.sizingNames.hasOwnProperty(i)) {
                    continue;
                }
                name = this.sizingNames[i];
                output[name] = (choice.sizing && typeof choice.sizing[name] !== "undefined")
                    ? choice.sizing[name]
                    : schema[name];
            }
        };
        /**
         * Ensures an output from parseChoice contains all the necessary position
         * bounding box measurements, as listed in this.directionNames.
         *
         * @param {Object} output   The Object (likely a parsed possibility content)
         *                          having its arguments modified.
         *                          chosen possibility.
         * @param {Object} position   An Object that contains .left, .right, .top,
         *                            and .bottom.
         */
        WorldSeedr.prototype.ensureDirectionBoundsOnChoice = function (output, position) {
            var i;
            for (i in this.directionNames) {
                if (this.directionNames.hasOwnProperty(i)) {
                    output[this.directionNames[i]] = position[this.directionNames[i]];
                }
            }
        };
        return WorldSeedr;
    })();
    WorldSeedr_1.WorldSeedr = WorldSeedr;
})(WorldSeedr || (WorldSeedr = {}));
