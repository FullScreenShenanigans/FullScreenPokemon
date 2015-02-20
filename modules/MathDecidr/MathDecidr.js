/**
 * MathDecidr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MathDecidr(settings) {
    "use strict";
    if (this === window) {
        return new MathDecidr(settings);
    }
    var self = this,

        NumberMaker,

        constants,
        
        equations,
            
        rawEquations;

    /**
     * 
     */
    self.reset = function (settings) {
        var i;

        NumberMaker = settings.NumberMaker || new NumberMakr();

        constants = settings.constants || {};
        equations = {};
        rawEquations = settings.equations;

        if (rawEquations) {
            for (i in rawEquations) {
                self.setEquation(i, rawEquations[i]);
            }
        }
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getConstants = function () {
        return constants;
    };

    /**
     * 
     */
    self.getConstant = function (name) {
        return constants[name];
    };

    /**
     * 
     */
    self.getRawEquations = function () {
        return rawEquations;
    };

    /**
     * 
     */
    self.getEquations = function () {
        return equations;
    };

    /**
     * 
     */
    self.getEquation = function (name) {
        return equations[name];
    };


    /* Simple additions
    */

    /**
     * 
     */
    self.setConstant = function (name, value) {
        constants[name] = value;
    };

    /**
     * 
     */
    self.setEquation = function (name, value) {
        equations[name] = value.bind(self, NumberMaker, constants, equations);
    };

    /* Computations
    */

    /**
     * 
     */
    self.compute = function (name) {
        return equations[name].apply(self, Array.prototype.slice.call(arguments, 1));
    };

    /**
     * 
     */
    self.ensureArgumentsDefined = function (names, settings) {
        for (var i = 0; i < names.length; i += 1) {
            if (typeof settings.arguments[i] === "undefined") {
                throw new Error(i + "is undefined in equation arguments.");
            }
        }
    };

    /**
     * 
     */
    self.ensureArgumentsPropreties = function (names, settings) {
        for (var i = 0; i < names.length; i += 1) {
            if (!settings.hasOwnProperty(i)) {
                throw new Error(i + "is not an arguments property in equation.");
            }
        }
    };


    self.reset(settings || {});
};