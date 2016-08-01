declare namespace MapScreenr {
    /**
     * Functions to compute new variable values, keyed by their variable's names.
     */
    interface IVariableFunctions {
        [i: string]: Function;
    }
    /**
     * Settings to initialize a new instance of the MapScreenr class.
     */
    interface IMapScreenrSettings {
        /**
         * How wide the MapScreenr should be.
         */
        width: number;
        /**
         * How tall the MapScreenr should be.
         */
        height: number;
        /**
         * A mapping of Functions to generate member variables that should be
         * recomputed on screen change, keyed by variable name.
         */
        variableFunctions?: IVariableFunctions;
        /**
         * Arguments to be passed to variable Functions.
         */
        variableArgs?: any[];
        /**
         * Assorted known variables, keyed by name.
         */
        variables: {
            [i: string]: any;
        };
    }
    /**
     * A flexible container for map attributes and viewport.
     */
    interface IMapScreenr {
        /**
         * Top border measurement of the bounding box.
         */
        top: number;
        /**
         * Right border measurement of the bounding box.
         */
        right: number;
        /**
         * Bottom border measurement of the bounding box.
         */
        bottom: number;
        /**
         * Left border measurement of the bounding box.
         */
        left: number;
        /**
         * Constant horizontal midpoint of the bounding box, equal to (left + right) / 2.
         */
        middleX: number;
        /**
         * Constant vertical midpoint of the bounding box, equal to (top + bottom) / 2.
         */
        middleY: number;
        /**
         * Constant width of the bounding box.
         */
        width: number;
        /**
         * Constant height of the bounding box.
         */
        height: number;
        /**
         * Completely clears the MapScreenr for use in a new Area. Positioning is
         * reset to (0,0) and user-configured variables are recalculated.
         */
        clearScreen(): void;
        /**
         * Computes middleX as the midpoint between left and right.
         */
        setMiddleX(): void;
        /**
         * Computes middleY as the midpoint between top and bottom.
         */
        setMiddleY(): void;
        /**
         * Recalculates all variables by passing variableArgs to their Functions.
         */
        setVariables(): void;
        /**
         * Recalculates a variable by passing variableArgs to its Function.
         *
         * @param name   The name of the variable to recalculate.
         * @param value   A new value for the variable instead of its Function's result.
         * @returns The new value of the variable.
         */
        setVariable(name: string, value?: any): any;
        /**
         * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
         *
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        shift(dx: number, dy: number): void;
        /**
         * Shifts the MapScreenr horizontally by changing left and right by the dx.
         *
         * @param dx   How far to scroll horizontally.
         */
        shiftX(dx: number): void;
        /**
         * Shifts the MapScreenr vertically by changing top and bottom by the dy.
         *
         * @param dy   How far to scroll vertically.
         */
        shiftY(dy: number): void;
        /**
         * A listing of variable Functions to be calculated on screen resets.
         */
        variableFunctions: IVariableFunctions;
        /**
         * Arguments to be passed into variable computation Functions.
         */
        variableArgs: any[];
        /**
         * Known variables, keyed by name.
         */
        variables: {
            [i: string]: any;
        };
    }
    /**
     * A flexible container for map attributes and viewport.
     */
    class MapScreenr implements IMapScreenr {
        /**
         * A listing of variable Functions to be calculated on screen resets.
         */
        variableFunctions: IVariableFunctions;
        /**
         * Arguments to be passed into variable computation Functions.
         */
        variableArgs: any[];
        /**
         * Top border measurement of the bounding box.
         */
        top: number;
        /**
         * Right border measurement of the bounding box.
         */
        right: number;
        /**
         * Bottom border measurement of the bounding box.
         */
        bottom: number;
        /**
         * Left border measurement of the bounding box.
         */
        left: number;
        /**
         * Constant horizontal midpoint of the bounding box, equal to (left + right) / 2.
         */
        middleX: number;
        /**
         * Constant vertical midpoint of the bounding box, equal to (top + bottom) / 2.
         */
        middleY: number;
        /**
         * Constant width of the bounding box.
         */
        width: number;
        /**
         * Constant height of the bounding box.
         */
        height: number;
        /**
         * Assorted known variables, keyed by name.
         */
        variables: {
            [i: string]: any;
        };
        /**
         * Resets the MapScreenr. All members of the settings argument are copied
         * to the MapScreenr itself, though only width and height are required.
         *
         * @param {IMapScreenrSettings} settings
         */
        constructor(settings: IMapScreenrSettings);
        /**
         * Completely clears the MapScreenr for use in a new Area. Positioning is
         * reset to (0,0) and user-configured variables are recalculated.
         */
        clearScreen(): void;
        /**
         * Computes middleX as the midpoint between left and right.
         */
        setMiddleX(): void;
        /**
         * Computes middleY as the midpoint between top and bottom.
         */
        setMiddleY(): void;
        /**
         * Recalculates all variables by passing variableArgs to their Functions.
         */
        setVariables(): void;
        /**
         * Recalculates a variable by passing variableArgs to its Function.
         *
         * @param name   The name of the variable to recalculate.
         * @param value   A new value for the variable instead of its Function's result.
         * @returns The new value of the variable.
         */
        setVariable(name: string, value?: any): any;
        /**
         * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
         *
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        shift(dx: number, dy: number): void;
        /**
         * Shifts the MapScreenr horizontally by changing left and right by the dx.
         *
         * @param dx   How far to scroll horizontally.
         */
        shiftX(dx: number): void;
        /**
         * Shifts the MapScreenr vertically by changing top and bottom by the dy.
         *
         * @param dy   How far to scroll vertically.
         */
        shiftY(dy: number): void;
        /**
         * Known variables, keyed by name.
         */
        [i: string]: any;
    }
}
declare var module: any;
