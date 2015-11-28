declare module MapScreenr {
    export interface IMapScreenrSettings {
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
        variables?: any;

        /**
         * Arguments to be passed to variable Functions.
         */
        variableArgs?: any[];

        /**
         * Any other arguments of any type may be added to the MapScreenr.
         */
        [i: string]: any;
    }

    export interface IMapScreenr {
        variables: any;
        variableArgs: any[];
        top: number;
        right: number;
        bottom: number;
        left: number;
        middleX: number;
        middleY: number;
        width: number;
        height: number;
        clearScreen(): void;
        setMiddleX(): void;
        setMiddleY(): void;
        setVariables(): void;
        shift(dx: number, dy: number): void;
        shiftX(dx: number): void;
        shiftY(dy: number): void;
    }
}


module MapScreenr {
    "use strict";

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with any 
     * other information desired.
     */
    export class MapScreenr implements IMapScreenr {
        /**
         * A listing of variable Functions to be calculated on screen resets.
         */
        public variables: { [i: string]: Function };

        /**
         * Arguments to be passed into variable computation Functions.
         */
        public variableArgs: any[];

        /**
         * Top of the MapScreenr's bounding box.
         */
        public top: number;

        /**
         * Right of the MapScreenr's bounding box.
         */
        public right: number;

        /**
         * Bottom of the MapScreenr's bounding box.
         */
        public bottom: number;

        /**
         * Left of the MapScreenr's bounding box.
         */
        public left: number;

        /**
         * Horizontal midpoint of the MapScreenr's bounding box.
         */
        public middleX: number;

        /**
         * Vertical midpoint of the MapScreenr's bounding box.
         */
        public middleY: number;

        /**
         * Width of the MapScreenr's bounding box.
         */
        public width: number;

        /**
         * Height of the MapScreenr's bounding box.
         */
        public height: number;

        /**
         * Resets the MapScreenr. All members of the settings argument are copied
         * to the MapScreenr itself, though only width and height are required.
         * 
         * @param {IMapScreenrSettings} settings
         */
        constructor(settings: IMapScreenrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to MapScreenr.");
            }
            if (typeof settings.width === "undefined") {
                throw new Error("No width given to MapScreenr.");
            }
            if (typeof settings.height === "undefined") {
                throw new Error("No height given to MapScreenr.");
            }

            var name: string;

            for (name in settings) {
                if (settings.hasOwnProperty(name)) {
                    (<any>this)[name] = settings[name];
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
        clearScreen(): void {
            this.left = 0;
            this.top = 0;
            this.right = this.width;
            this.bottom = this.height;

            this.setMiddleX();
            this.setMiddleY();

            this.setVariables();
        }

        /**
         * Computes middleX as the midpoint between left and right.
         */
        setMiddleX(): void {
            this.middleX = (this.left + this.right) / 2;
        }

        /**
         * Computes middleY as the midpoint between top and bottom.
         */
        setMiddleY(): void {
            this.middleY = (this.top + this.bottom) / 2;
        }

        /**
         * Runs all variable Functions with variableArgs to recalculate their 
         * values.
         */
        setVariables(): void {
            var i: string;

            for (i in this.variables) {
                if (this.variables.hasOwnProperty(i)) {
                    this[i] = this.variables[i].apply(this, this.variableArgs);
                }
            }
        }


        /* Element shifting
        */

        /**
         * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
         * 
         * @param {Number} dx
         * @param {Number} dy
         */
        shift(dx: number, dy: number): void {
            if (dx) {
                this.shiftX(dx);
            }

            if (dy) {
                this.shiftY(dy);
            }
        }

        /**
         * Shifts the MapScreenr horizontally by changing left and right by the dx.
         * 
         * @param {Number} dx
         */
        shiftX(dx: number): void {
            this.left += dx;
            this.right += dx;
        }

        /**
         * Shifts the MapScreenr vertically by changing top and bottom by the dy.
         * 
         * @param {Number} dy
         */
        shiftY(dy: number): void {
            this.top += dy;
            this.bottom += dy;
        }
    }
}
