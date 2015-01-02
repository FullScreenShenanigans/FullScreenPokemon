/**
 * MapScreenr.js
 * 
 * A simple container for Map attributes given by switching to an Area within 
 * that map. A bounding box of the current viewport is kept, along with any 
 * other information desired.
 * 
 * MapScreenr is the closest thing GameStartr projects have to a "global"
 * variable depository, where miscellaneous variables may be stored.
 * 
 * @example
 * // Creating and using a MapScreenr to emulate a simple screen.
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480
 * });
 * MapScreener.clearScreen();
 * 
 * // [0, 640, 480, 0]
 * console.log([
 *     MapScreener.top, MapScreener.right, MapScreener.bottom, MapScreener.left
 * ]);
 * 
 * @example
 * // Creating and using a MapScreenr to store screen information. 
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480,
 *     "variables": {
 *         "pixels": function () {
 *             return this.width * this.height;
 *         },
 *         "resolution": function () {
 *             return this.width / this.height;
 *         }
 *     }
 * });
 * MapScreener.clearScreen();
 * 
 * // 307200 "pixels at" 1.3333333333333333
 * console.log(MapScreener.pixels, "pixels at", MapScreener.resolution);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MapScreenr(settings) {
    "use strict";
    if (!this || this === window) {
        return new MapScreenr(settings);
    }
    var self = this,
        
        // A listing of variable Functions to be calculated on screen resets.
        variables,
        
        // Arguments to be passed into variable computation Functions.
        variableArgs;
    
    /**
     * Resets the MapScreenr. All members of the settings argument are copied
     * to the MapScreenr itself, though only width and height are required.
     * 
     * @param {Number} width   How wide the MapScreenr must be.
     * @param {Number} height   How high the MapScreenr must be.
     * @param {Object} [variables]   Functions representing variables that
     *                               should be re-computed on screen change,
     *                               keyed by what variable they return the 
     *                               value of.
     * @param {Array} [variableArgs]   Arguments to be passed to variables.
     */
    self.reset = function (settings) {
        for (var name in settings) {
            if (settings.hasOwnProperty(name)) {
                self[name] = settings[name];
            }
        }
        
        variables = settings.variables || {};
        variableArgs = settings.variableArgs || [];

        if (typeof self.width === "undefined") {
            throw new Error("MapScreenr needs to know its width.");
        }

        if (typeof self.height === "undefined") {
            throw new Error("MapScreenr needs to know its height.");
        }
    }
    
    
    /* State changes
    */
    
    /**
     * Completely clears the MapScreenr for use in a new Area. Positioning is
     * reset to (0,0) and user-configured variables are recalculated.
     */
    self.clearScreen = function () {
        self.left = 0;
        self.top = 0;
        self.right = self.width;
        self.bottom = self.height;
        
        setMiddleX();
        setMiddleY();
        
        self.setVariables();
    };
    
    /**
     * Computes middleX as the midpoint between left and right.
     */
    function setMiddleX() {
        self.middleX = (self.left + self.right) / 2;
    }
    
    /**
     * Computes middleY as the midpoint between top and bottom.
     */
    function setMiddleY() {
        self.middleY = (self.top + self.bottom) / 2;
    }
    
    /**
     * Runs all variable Functions with variableArgs to recalculate their 
     * values.
     */
    self.setVariables = function () {
        for (var i in variables) {
            self[i] = variables[i].apply(self, variableArgs);
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
    self.shift = function(dx, dy) {
        if (dx) {
            self.shiftX(dx);
        }
        
        if (dy) {
            self.shiftY(dy);
        }
    };
    
    /**
     * Shifts the MapScreenr horizontally by changing left and right by the dx.
     * 
     * @param {Number} dx
     */
    self.shiftX = function(dx) {
        self.left += dx;
        self.right += dx;
    };
    
    /**
     * Shifts the MapScreenr vertically by changing top and bottom by the dy.
     * 
     * @param {Number} dy
     */
    self.shiftY = function(dy) {
        self.top += dy;
        self.bottom += dy;
    };
    

    self.reset(settings || {});
}