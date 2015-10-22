var MathDecidr;
(function (MathDecidr_1) {
    "use strict";
    var MathDecidr = (function () {
        /**
         * @param {IMathDecidrSettings} settings
         */
        function MathDecidr(settings) {
            if (settings === void 0) { settings = {}; }
            var i;
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
        MathDecidr.prototype.getConstants = function () {
            return this.constants;
        };
        /**
         * @param {String} name   The name of a constant to return.
         * @return {Mixed} The value for the requested constant.
         */
        MathDecidr.prototype.getConstant = function (name) {
            return this.constants[name];
        };
        /**
         * @return {Object} Stored equations with the internal members bound as
         *                  their arguments.
         */
        MathDecidr.prototype.getEquations = function () {
            return this.equations;
        };
        /**
         * @return {Object} The raw equations, unbound.
         */
        MathDecidr.prototype.getRawEquations = function () {
            return this.equationsRaw;
        };
        /**
         * @param {String} name
         * @return {Function} The equation under the given name.
         */
        MathDecidr.prototype.getEquation = function (name) {
            return this.equations[name];
        };
        /**
         * @param {String} name
         * @return {Function} The raw equation under the given name.
         */
        MathDecidr.prototype.getRawEquation = function (name) {
            return this.equationsRaw[name];
        };
        /* Simple additions
        */
        /**
         * Adds a constant of the given name and value.
         *
         * @param {String} name
         * @param {Mixed} value
         */
        MathDecidr.prototype.addConstant = function (name, value) {
            this.constants[name] = value;
        };
        /**
         * Adds an equation Function under the given name.
         *
         * @param {String} name
         * @param {Function} value
         */
        MathDecidr.prototype.addEquation = function (name, value) {
            this.equationsRaw[name] = value;
            this.equations[name] = value.bind(this, this.constants, this.equations);
        };
        /* Computations
        */
        /**
         * Runs a stored equation with any number of arguments, returning the result.
         *
         * @param {String} name   The name of the equation to run.
         * @param {Mixed} ...args   Any arguments to pass to the equation.
         */
        MathDecidr.prototype.compute = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.equations[name].apply(this, Array.prototype.slice.call(arguments, 1));
        };
        return MathDecidr;
    })();
    MathDecidr_1.MathDecidr = MathDecidr;
})(MathDecidr || (MathDecidr = {}));
