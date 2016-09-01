declare namespace WorldSeedr {
    /**
     * A random number generator that returns a decimal within [min,max).
     *
     * @param min   A minimum value for output.
     * @param min   A maximum value for output to be under.
     * @returns A random decimal within [min,max).
     */
    interface IRandomBetweenGenerator {
        (min: number, max: number): number;
    }
    /**
     * From an Array of potential choice Objects, returns one chosen at random.
     *
     * @param choice   An Array of objects with .percent.
     * @returns One of the choice Objects, chosen at random.
     */
    interface IOptionChooser<T extends IPercentageOption> {
        (choices: T[]): T;
    }
    /**
     * Utility to generate distances based on possibility schemas.
     */
    interface ISpacingCalculator {
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   Any sort of description for a unit of distance.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromSpacing(spacing: Spacing): number;
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   A description of a range of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibility(spacing: IPossibilitySpacing): number;
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   Descriptions of ranges of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number;
    }
    /**
     * A general listing of possibilities, keyed by title.
     */
    interface IPossibilityContainer {
        [i: string]: IPossibility;
    }
    /**
     * Description of what can a title may represent, and its size.
     */
    interface IPossibility {
        /**
         * How much horizontal space to reserve for the contents.
         */
        width: number;
        /**
         * How much vertical space to reserve for the contents.
         */
        height: number;
        /**
         * The possible contents to be placed.
         */
        contents: IPossibilityContents;
    }
    /**
     * Possible contents of a possibility, primarily its position
     * within the possibility and what it may contain.
     */
    interface IPossibilityContents {
        /**
         * What direction placement of children should move toward.
         */
        direction: string;
        /**
         * The method of child generation, from "Random", "Certain",
         * "Repeat", or "Multiple".
         */
        mode: string;
        /**
         * What part of the bounding possibility's position box the
         * children should snap their positions to.
         */
        snap: string;
        /**
         * The potential children of this possibility.
         */
        children: IPossibilityChild[];
        /**
         * A description of how much space should be between children.
         */
        spacing?: Spacing;
        /**
         * An optional limit to the number of children to place.
         */
        limit?: number;
    }
    /**
     * Anything that may be chosen from an Array based on its probability.
     */
    interface IPercentageOption {
        /**
         * How likely this option is to be chosen, out of 100.
         */
        percent: number;
    }
    /**
     * An option for an IPossibility that describes a recursion
     * to another possibility or a final object to be placed.
     */
    interface IPossibilityChild extends IPercentageOption {
        /**
         * The identifier of the child, either as a possibility or
         * known object value.
         */
        title: string;
        /**
         * What type of output or possibilities the child contains,
         * as "Known", "Random", or "Final".
         */
        type: string;
        /**
         * Information to pass to generate the child's output.
         */
        arguments?: IArgumentPossibility[] | any;
        /**
         * For type=Final, the possibility with output information.
         */
        source?: string;
        /**
         * How wide and/or tall this should be limited to.
         */
        sizing?: {
            /**
             * How wide this this should be limited to.
             */
            width?: number;
            /**
             * How tall this should be limited to.
             */
            height?: number;
        };
        /**
         * A larger size to stretch the child's output to.
         */
        stretch?: {
            /**
             * A larger width to stretch the child's output to.
             */
            width?: number;
            /**
             * A larger height to stretch the child's output to.
             */
            height?: number;
        };
    }
    /**
     * A description of a range of possibilities for spacing.
     */
    interface IPossibilitySpacing {
        /**
         * A minimum amount for the spacing.
         */
        min: number;
        /**
         * A maximum amount for the spacing.
         */
        max: number;
        /**
         * A Number unit to round to.
         */
        units?: number;
    }
    /**
     * An option for a spacing range description.
     */
    interface IPossibilitySpacingOption extends IPercentageOption {
        /**
         * The description of a range of possibilities for spacing.
         */
        value: IPossibilitySpacing;
    }
    /**
     * An option for arguments to add to a choice.
     */
    interface IArgumentPossibility extends IPercentageOption {
        /**
         * An Object containing values to add to a choice.
         */
        values: IArgumentMap;
    }
    /**
     * An Object containing values to add to a choice.
     */
    interface IArgumentMap {
        [i: string]: any;
        width?: any;
        height?: any;
    }
    /**
     * A mapping of directions to equivalent keys, such as opposites.
     */
    interface IDirectionsMap {
        /**
         * The equivalent key for the "top" direction.
         */
        top: string;
        /**
         * The equivalent key for the "right" direction.
         */
        right: string;
        /**
         * The equivalent key for the "bottom" direction.
         */
        bottom: string;
        /**
         * The equivalent key for the "left" direction.
         */
        left: string;
    }
    /**
     * Specifications for a bounding box size and position.
     */
    interface IPosition {
        /**
         * How wide the bounding box is, as right - left.
         */
        width: number;
        /**
         * How tall the bounding box is, as top - bottom.
         */
        height: number;
        /**
         * The top border of the bounding box.
         */
        top: number;
        /**
         * The right border of the bounding box.
         */
        right: number;
        /**
         * The bottom border of the bounding box.
         */
        bottom: number;
        /**
         * The left border of the bounding box.
         */
        left: number;
    }
    /**
     * A command for placing a possibility.
     */
    interface ICommand extends IPosition {
        /**
         * The identifier of the possibility.
         */
        title: string;
        /**
         * Arguments to pass to the output of the possibility.
         */
        arguments?: IArgumentMap;
    }
    /**
     * A final choice for a possibility's output.
     */
    interface IChoice extends ICommand {
        /**
         * What type of output this is, as "Known" or "Random".
         */
        type?: string;
        /**
         * The actual choice contents.
         */
        contents?: IChoice;
        /**
         * Potential children to place in the contents.
         */
        children?: IChoice[];
    }
    /**
     * A random number generator that returns a decimal within [0,1).
     *
     * @returns A random decimal within [0,1).
     */
    interface IRandomNumberGenerator {
        (): number;
    }
    /**
     * A general description of possibilities for spacing, as a Number,
     * list of Numbers, possibility, or some combination thereof.
     */
    type Spacing = number | number[] | IPossibilitySpacing | IPossibilitySpacingOption[];
    /**
     * Callback for runGeneratedCommands to place "known" children.
     *
     * @param commands   A set of generated commands to be placed.
     */
    interface IOnPlacement {
        (commands: ICommand[]): void;
    }
    /**
     * Settings to initialize a new IWorldSeedr.
     */
    interface IWorldSeedrSettings {
        /**
         * A listing of possibility schemas, keyed by title.
         */
        possibilities: IPossibilityContainer;
        /**
         * Function used to generate a random number, if not Math.random.
         */
        random?: IRandomNumberGenerator;
        /**
         * Function called in this.generateFull to place a child.
         */
        onPlacement?: IOnPlacement;
    }
    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on position and probability schemas.
     */
    interface IWorldSeedr {
        /**
         * @returns The listing of possibilities that may be generated.
         */
        getPossibilities(): IPossibilityContainer;
        /**
         * @param possibilitiesNew   A new Object to list possibilities
         *                           that may be generated.
         */
        setPossibilities(possibilities: IPossibilityContainer): void;
        /**
         * @returns Callback for runGeneratedCommands to place "known" children.
         */
        getOnPlacement(): (commands: ICommand[]) => void;
        /**
         * @param onPlacementNew   A new Function to be used as onPlacement.
         */
        setOnPlacement(onPlacement: (commands: ICommand[]) => void): void;
        /**
         * Resets the generatedCommands Array so runGeneratedCommands can start.
         */
        clearGeneratedCommands(): void;
        /**
         * Runs the onPlacement callback on the generatedCommands Array.
         */
        runGeneratedCommands(): void;
        /**
         * Generates a collection of randomly chosen possibilities based on the
         * given schema mapping. These does not recursively parse the output; do
         * do that, use generateFull.
         *
         * @param name   The name of the possibility schema to start from.
         * @param position   An Object that contains .left, .right, .top,
         *                   and .bottom.
         * @returns An Object containing a position within the given
         *          position and some number of children.
         */
        generate(name: string, command: IPosition | ICommand): IChoice;
        /**
         * Recursively generates a schema. The schema's title and itself are given
         * to this.generate; all outputs of type "Known" are added to the
         * generatedCommands Array, while everything else is recursed upon.
         *
         * @param schema   A simple Object with basic information on the
         *                 chosen possibility.
         * @returns An Object containing a position within the given
         *          position and some number of children.
         */
        generateFull(schema: ICommand): void;
    }
    /**
     * Utility to generate distances based on possibility schemas.
     */
    class SpacingCalculator implements ISpacingCalculator {
        /**
         * @returns A number in [min, max] at random.
         */
        randomBetween: IRandomBetweenGenerator;
        /**
         * From an Array of potential choice Objects, returns one chosen at random.
         */
        chooseAmong: IOptionChooser<IPossibilitySpacingOption>;
        /**
         * Initializes a new instance of the SpacingCalculator class.
         *
         * @param randomBetween
         * @param chooseAmong
         */
        constructor(randomBetween: IRandomNumberGenerator, chooseAmong: IOptionChooser<IPossibilitySpacingOption>);
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   Any sort of description for a unit of distance.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromSpacing(spacing: Spacing): number;
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   A description of a range of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibility(spacing: IPossibilitySpacing): number;
        /**
         * Computes a distance from any description of distance possibilities.
         *
         * @param spacing   Descriptions of ranges of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number;
    }
    /**
     * Automates random, recursive generation of possibilities from JSON schemas.
     */
    class WorldSeedr implements IWorldSeedr {
        /**
         * A listing of possibility schemas, keyed by title.
         */
        private possibilities;
        /**
         * Function used to generate a random number
         */
        private random;
        /**
         * Function called in generateFull to place a command.
         */
        private onPlacement;
        /**
         * Scratch Array of PreThings to be added to during generation.
         */
        private generatedCommands;
        /**
         * Utility to generate spacing distances based on possibility schemas.
         */
        private spacingCalculator;
        /**
         * Initializes a new instance of the WorldSeedr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IWorldSeedrSettings);
        /**
         * @returns The listing of possibilities that may be generated.
         */
        getPossibilities(): IPossibilityContainer;
        /**
         * @param possibilitiesNew   A new Object to list possibilities
         *                           that may be generated.
         */
        setPossibilities(possibilities: IPossibilityContainer): void;
        /**
         * @returns Callback for runGeneratedCommands to place "known" children.
         */
        getOnPlacement(): IOnPlacement;
        /**
         * @param onPlacementNew   A new Function to be used as onPlacement.
         */
        setOnPlacement(onPlacement: IOnPlacement): void;
        /**
         * Resets the generatedCommands Array so runGeneratedCommands can start.
         */
        clearGeneratedCommands(): void;
        /**
         * Runs the onPlacement callback on the generatedCommands Array.
         */
        runGeneratedCommands(): void;
        /**
         * Generates a collection of randomly chosen possibilities based on the
         * given schema mapping. These does not recursively parse the output; do
         * do that, use generateFull.
         *
         * @param name   The name of the possibility schema to start from.
         * @param position   An Object that contains .left, .right, .top,
         *                   and .bottom.
         * @returns An Object containing a position within the given
         *          position and some number of children.
         */
        generate(name: string, command: IPosition | ICommand): IChoice;
        /**
         * Recursively generates a schema. The schema's title and itself are given
         * to this.generate; all outputs of type "Known" are added to the
         * generatedCommands Array, while everything else is recursed upon.
         *
         * @param schema   A simple Object with basic information on the
         *                 chosen possibility.
         * @returns An Object containing a position within the given
         *          position and some number of children.
         */
        generateFull(schema: ICommand): void;
        /**
         * Generates the children for a given schema, position, and direction. This
         * is the real hardcore function called by this.generate, which calls the
         * differnt subroutines based on whether the contents are in "Certain" or
         * "Random" mode.
         *
         * @param schema   A simple Object with basic information on the
         *                 chosen possibility.
         * @param position   The bounding box for where the children may
         *                   be generated.
         * @param direction   A String direction to check the position
         *                    by ("top", "right", "bottom", or "left")
         *                    as a default if contents.direction isn't
         *                    provided.
         * @returns An Object containing a position within the given
         *          position and some number of children.
         */
        private generateChildren(schema, position, direction?);
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas.
         *
         * @param contents   The known possibilities to choose between.
         * @param position   The bounding box for where the children may be
         *                   generated.
         * @param direction   A String direction to check the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child.
         * @returns An Object containing a position within the given position
         *          and some number of children.
         */
        private generateCertain(contents, position, direction, spacing);
        /**
         * Generates a schema's children that are known to follow a set listing of
         * sub-schemas, repeated until there is no space left.
         *
         * @param contents   The known possibilities to choose between.
         * @param position   The bounding box for where the children may be
         *                   generated.
         * @param direction   A String direction to check the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child.
         * @returns An Object containing a position within the given position
         *          and some number of children.
         */
        private generateRepeat(contents, position, direction, spacing);
        /**
         * Generates a schema's children that are known to be randomly chosen from a
         * list of possibilities until there is no more room.
         *
         * @param contents   The Array of known possibilities, with probability
         *                   percentages.
         * @param position   An Object that contains .left, .right, .top,
         *                   and .bottom.
         * @param direction   A String direction to check the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child.
         * @returns An Object containing a position within the given position
         *          and some number of children.
         */
        private generateRandom(contents, position, direction, spacing);
        /**
         * Generates a schema's children that are all to be placed within the same
         * position. If a direction is provided, each subsequent one is shifted in
         * that direction by spacing.
         *
         * @param contents   The Array of known possibilities, with probability
         *                   percentages.
         * @param position   An Object that contains .left, .right, .top,
         *                   and .bottom.
         * @param direction   A String direction to check the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child.
         * @returns An Object containing a position within the given position
         *          and some number of children.
         */
        private generateMultiple(contents, position, direction, spacing);
        /**
         * Shortcut function to choose a choice from an allowed set of choices, and
         * parse it for positioning and sub-choices.
         *
         * @param contents   Choice Objects, each of which must have a .percentage.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to check the position by:
         *                    "top", "right", "bottom", or "left".
         * @returns An Object containing the bounding box position of a parsed child,
         *          with the basic schema (.title) info added as well as any optional
         *          .arguments.
         */
        private generateChild(contents, position, direction);
        /**
         * Creates a parsed version of a choice given the position and direction.
         * This is the function that parses and manipulates the positioning of the
         * new choice.
         *
         * @param choice   The simple definition of the Object chosen from a choices
         *                 Array. It should have at least .title,
         *                          and optionally .sizing or .arguments.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to shrink the position by: "top",
         *                    "right", "bottom", or "left".
         * @returns An Object containing the bounding box position of a parsed child,
         *          with the basic schema (.title) info added as well as any optional
         *          .arguments.
         */
        private parseChoice(choice, position, direction);
        /**
         * Parses a "Final" choice as a simple IChoice of type Known.
         *
         * @param choice   The simple definition of the Object chosen from a choices
         *                 Array. It should have at least .title,
         *                          and optionally .sizing or .arguments.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to shrink the position by: "top",
         *                    "right", "bottom", or "left".
         * @returns A Known choice with title, arguments, and position information.
         * @todo Investigate whether this is necessary (#7).
         */
        private parseChoiceFinal(choice, position, direction);
        /**
         * From an Array of potential choice Objects, returns one chosen at random.
         *
         * @param choice   An Array of objects with .percent.
         * @returns One of the choice Objects, chosen at random.
         */
        private chooseAmong<T>(choices);
        /**
         * From an Array of potential choice Objects, filtered to only include those
         * within a certain size, returns one chosen at random.
         *
         * @param choice   An Array of objects with .width and .height.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @returns A random choice Object that can fit within the position's size.
         * @remarks Functions that use this will have to react to nothing being
         *          chosen. For example, if only 50 percentage is accumulated
         *          among fitting ones but 75 is randomly chosen, something should
         *          still be returned.
         */
        private chooseAmongPosition(choices, position);
        /**
         * Checks whether a choice can fit within a width and height.
         *
         * @param choice   An Object that contains .width and .height.
         * @param width   A maximum width for the choice.
         * @param height   A maximum height for the choice.
         * @returns Whether the choice fits within the dimensions.
         */
        private choiceFitsSize(choice, width, height);
        /**
         * Checks whether a choice can fit within a position.
         *
         * @param choice   An Object that contains .width and .height.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @returns Whether the choice fits within the position.
         * @remarks When calling multiple times on a position (such as in
         *          chooseAmongPosition), it's more efficient to store the width
         *          and height separately and just use doesChoiceFit.
         */
        private choiceFitsPosition(choice, position);
        /**
         * Checks and returns whether a position has open room in a particular
         * direction (horizontally for left/right and vertically for top/bottom).
         *
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to check the position in:
         *                    "top", "right", "bottom", or "left".
         */
        private positionIsNotEmpty(position, direction);
        /**
         * Shrinks a position by the size of a child, in a particular direction.
         *
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param child   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to shrink the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child
         *                  (by default, 0).
         */
        private shrinkPositionByChild(position, child, direction, spacing?);
        /**
         * Moves a position by its parsed spacing. This is only useful for content
         * of type "Multiple", which are allowed to move themselves via spacing
         * between placements.
         *
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         * @param direction   A String direction to shrink the position by:
         *                    "top", "right", "bottom", or "left".
         * @param spacing   How much space there should be between each child
         *                  (by default, 0).
         */
        private movePositionBySpacing(position, direction, spacing?);
        /**
         * Generates the bounding box position Object (think rectangle) for a set of
         * children. The top, right, etc. member variables become the most extreme
         * out of all the possibilities.
         *
         * @param children   An Array of Objects with .top, .right, .bottom, and .left.
         * @returns An Object with .top, .right, .bottom, and .left.
         */
        private wrapChoicePositionExtremes(children);
        /**
         * Ensures an output from parseChoice contains all the necessary size
         * measurements, as listed in this.sizingNames.
         *
         * @param output   The Object (likely a parsed possibility content)
         *                 having its arguments modified.
         * @param choice   The definition of the Object chosen from a choices Array.
         * @param schema   An Object with basic information on the chosen possibility.
         */
        private ensureSizingOnChoice(output, choice, schema);
        /**
         * Ensures an output from parseChoice contains all the necessary position
         * bounding box measurements, as listed in this.directionNames.
         *
         * @param output   The Object (likely a parsed possibility content)
         *                 having its arguments modified.
         *                          chosen possibility.
         * @param position   An Object that contains .left, .right, .top, and .bottom.
         */
        private ensureDirectionBoundsOnChoice(output, position);
        /**
         * @returns A number in [1, 100] at random.
         */
        private randomPercentage();
        /**
         * @returns A number in [min, max] at random.
         */
        private randomBetween(min, max);
        /**
         * Creates and returns a copy of an Object, as a shallow copy.
         *
         * @param original   An Object to copy.
         * @returns A shallow copy of the original.
         */
        private objectCopy(original);
        /**
         * Creates a new object with all required attributes taking from the
         * primary source or secondary source, in that order of precedence.
         *
         * @param primary   A primary source for the output.
         * @param secondary   A secondary source for the output.
         * @returns A new Object with properties from primary and secondary.
         */
        private objectMerge(primary, secondary);
    }
}
declare var module: any;
