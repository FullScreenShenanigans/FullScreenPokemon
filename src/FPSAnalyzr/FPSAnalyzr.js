/**
 * FPSAnalyzr.js
 * 
 * A general utility for obtaining and analyzing framerate measurements. The 
 * most recent measurements are kept up to a certain point (either an infinite
 * number or a set amount). Options for analyzing the data such as getting the
 * mean, median, extremes, etc. are available.
 * 
 * @example
 * // Creating and using an FPSAnalyzr to measure setInterval accuracy.
 * var FPSAnalyzer = new FPSAnalyzr();
 * setInterval(FPSAnalyzer.measure.bind(FPSAnalyzer), 1000 / 30);
 * setTimeout(
 *     function () {
 *         console.log("Average FPS:", FPSAnalyzer.getAverage());
 *     },
 *     7000
 * );
 * 
 * @example
 * // Creating and using an FPSAnalyzr to look at the 10 most recent FPS
 * // measurements and get the best & worst amounts.
 * var target = 1000 / 30,
 *     numKept = 10,
 *     FPSAnalyzer = new FPSAnalyzr({
 *         "maxKept": numKept
 *     }),
 *     i;
 * 
 * for (i = 0; i < numKept; i += 1) {
 *     setTimeout(FPSAnalyzer.measure.bind(FPSAnalyzer), i * target);
 * }
 * 
 * setTimeout(
 *     function () {
 *         console.log("Measurements:", FPSAnalyzer.getMeasurements());
 *         console.log("Extremes:", FPSAnalyzer.getExtremes());
 *         console.log("Range:", FPSAnalyzer.getRange());
 *     },
 *     numKept * i * target
 * );
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function FPSAnalyzr(settings) {
    "use strict";
    if (!this || this === window) {
        return new FPSAnalyzr(settings);
    }
    var self = this,
        
        // The number of FPS measurements to keep
        maxKept,
        
        // A recent history of FPS measurements (normally an Array)
        // These are stored as changes in millisecond timestamps
        measurements,
        
        // The actual number of FPS measurements currently known
        numRecorded,
        
        // The current position in the measurements Array
        ticker,
        
        // The most recent performance.now timestamp
        timeCurrent,
        
        // A system-dependant performance.now function
        getTimestamp;
    
    /**
     * Resets the FPSAnalyzr.
     * 
     * @constructor
     * @param {Number} [maxKept]   The maximum number of FPS measurements to
     *                             keep. This defaults to 35, and can be a
     *                             Number or Infinity otherwise.
     * @param [Function} getTimestamp   A function used to get an accurate
     *                                  timestamp. By default this is 
     *                                  performance.now.
     */
    self.reset = function (settings) {
        maxKept = settings.maxKept || 35;
        numRecorded = 0;
        ticker = -1;
        
        // If maxKept is a Number, make the measurements array that long
        // If it's infinite, make measurements an {} (infinite array)
        measurements = isFinite(maxKept) ? new Array(maxKept) : {};
        
        // Unlike InputWritr, getTimestamp won't use Date.now()
        if (typeof settings.getTimestamp === "undefined") {
            getTimestamp = (
                performance.now
                || performance.webkitNow
                || performance.mozNow
                || performance.msNow
                || performance.oNow
            ).bind(performance);
        } else {
            getTimestamp = settings.getTimestamp;
        }
    };
    
    
    /* Public interface
    */
    
    /**
     * Standard public measurement function.
     * Marks the current timestamp as timeCurrent, and adds an FPS measurement
     * if there was a previous timeCurrent.
     * 
     * @alias self.measure
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     getTimestamp() is used instead.
     */
    self.measure = function (time) {
        var timeNew = time || getTimestamp(),
            fpsNew;
        
        if (timeCurrent) {
            self.addFPS(1000 / (timeNew - timeCurrent));
        }
        
        timeCurrent = timeNew;
    }
    
    /**
     * Adds an FPS measurement to measurements, and increments the associated
     * count variables.
     * 
     * @param {Number} fps   An FPS calculated as the difference between two
     *                       timestamps.
     */
    self.addFPS = function(fps) {
        ticker = (ticker += 1) % maxKept;
        measurements[ticker] = fps;
        numRecorded += 1;
    };
    
    /**
     * Returns the result of a call to the internal system-dependant 
     * performance.now.
     * 
     * @return {Number}
     */
    self.getTimestamp = function () {
        return getTimestamp();
    };
    
    
    /* Gets
    */
    
    /**
     * Get function for numRecorded
     * 
     * @return {Number}
     */
    self.getNumRecorded = function () {
        return numRecorded;
    };
    
    /**
     * Get function for a copy of the measurements listing (if the number of
     * measurements is less than the max, that size is used)
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    measurements
     */
    self.getMeasurements = function () {
        var fpsKeptReal = Math.min(maxKept, numRecorded),
            copy, i;
        if (isFinite(maxKept)) {
            copy = new Array(fpsKeptReal);
        } else {
            copy = {};
            copy.length = fpsKeptReal;
        }
        
        for (i = fpsKeptReal - 1; i >= 0; --i) {
            copy[i] = measurements[i];
        }
        
        return copy;
    }
    
    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    time differences
     */
    self.getDifferences = function () {
        var copy = self.getMeasurements(),
            i;
        
        for (i = copy.length - 1; i >= 0; --i) {
            copy[i] = 1000 / copy[i];
        }
        
        return copy;
    }
    
    /**
     * @return {Number} The average recorded FPS measurement.
     */
    self.getAverage = function () {
        var total = 0,
            max = Math.min(maxKept, numRecorded),
            i;
        
        for (i = max - 1; i >= 0; --i) {
            total += measurements[i];
        }
        
        return total / max;
    }
    
    /**
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     * @return {Number} The median recorded FPS measurement.
     */
    self.getMedian = function () {
        var copy = self.getMeasurements().sort(),
            fpsKeptReal = copy.length,
            fpsKeptHalf = Math.floor(fpsKeptReal / 2),
            i;
         
        if (copy.length % 2 == 0) {
            return copy[fpsKeptHalf];
        } else {
            return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
        }
    }
    
    /**
     * @return {Number[]} An Array containing the lowest and highest recorded
     *                    FPS measurements, in that order.
     */
    self.getExtremes = function () {
        var lowest = measurements[0],
            highest = lowest,
            max = Math.min(maxKept, numRecorded),
            fps,
            i;
        
        for (i = max - 1; i >= 0; --i) {
            fps = measurements[i];
            if (fps > highest) highest = fps;
            else if (fps < lowest) lowest = fps;
        }
        
        return [lowest, highest];
    }
    
    /**
     * @return {Number} The range of recorded FPS measurements
     */
    self.getRange = function () {
        var extremes = self.getExtremes();
        return extremes[1] - extremes[0];
    }
    
    
    self.reset(settings || {});
}