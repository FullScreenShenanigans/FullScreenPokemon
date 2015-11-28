declare module MathDecidr {
    export interface IEquation {
        (constants: any, equations: IEquationContainer, ...args: any[]): any;
    }

    export interface IEquationContainer {
        [i: string]: IEquation;
    }

    export interface IMathDecidrSettings {
        constants?: any;
        equations?: {
            [i: string]: IEquation;
        };
    }

    export interface IMathDecidr {
        getConstants(): any;
        getConstant(name: string): any;
        getEquations(): IEquationContainer;
        getRawEquations(): IEquationContainer;
        getEquation(name: string): IEquation;
        getRawEquation(name: string): IEquation;
        addConstant(name: string, value: any): void;
        addEquation(name: string, value: IEquation): void;
        compute(name: string, ...args: any[]): any;
    }
}


module MathDecidr {
    "use strict";

    export class MathDecidr implements IMathDecidr {
        /**
         * Useful constants the MathDecidr may use in equations.
         */
        private constants: any;

        /**
         * Stored equations users and other equations may access, with the internal
         * members bound as their arguments.
         */
        private equations: IEquationContainer;

        /**
         * The raw equations, unbound.
         */
        private equationsRaw: IEquationContainer;

        /**
         * @param {IMathDecidrSettings} settings
         */
        constructor(settings: IMathDecidrSettings = {}) {
            var i: string;

            this.constants = settings.constants || {};
            this.equations = {};
            this.equationsRaw = settings.equations || {};

            if (this.equationsRaw) {
                for (i in this.equationsRaw) {
                    if (this.equationsRaw.hasOwnProperty(i)) {
                        this.addEquation(i, this.equationsRaw[i]);
                    }
                }
            }
        }


        /* Simple gets
        */

        /**
         * @return {Object} Useful constants the MathDecidr may use in equations.
         */
        getConstants(): any {
            return this.constants;
        }

        /**
         * @param {String} name   The name of a constant to return.
         * @return {Mixed} The value for the requested constant.
         */
        getConstant(name: string): any {
            return this.constants[name];
        }

        /**
         * @return {Object} Stored equations with the internal members bound as 
         *                  their arguments.
         */
        getEquations(): IEquationContainer {
            return this.equations;
        }

        /**
         * @return {Object} The raw equations, unbound.
         */
        getRawEquations(): IEquationContainer {
            return this.equationsRaw;
        }

        /**
         * @param {String} name
         * @return {Function} The equation under the given name.
         */
        getEquation(name: string): IEquation {
            return this.equations[name];
        }

        /**
         * @param {String} name
         * @return {Function} The raw equation under the given name.
         */
        getRawEquation(name: string): IEquation {
            return this.equationsRaw[name];
        }


        /* Simple additions
        */

        /**
         * Adds a constant of the given name and value.
         * 
         * @param {String} name
         * @param {Mixed} value
         */
        addConstant(name: string, value: any): void {
            this.constants[name] = value;
        }

        /**
         * Adds an equation Function under the given name.
         * 
         * @param {String} name
         * @param {Function} value
         */
        addEquation(name: string, value: IEquation): void {
            this.equationsRaw[name] = value;
            this.equations[name] = value.bind(this, this.constants, this.equations);
        }


        /* Computations
        */

        /**
         * Runs a stored equation with any number of arguments, returning the result.
         * 
         * @param {String} name   The name of the equation to run.
         * @param {Mixed} ...args   Any arguments to pass to the equation.
         */
        compute(name: string, ...args: any[]): any {
            return this.equations[name].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
}
