/**
 * GamesRunnr.js
 * 
 * A class to continuously series of "game" Functions. Each game is run in a 
 * set order and the group is run as a whole at a particular interval, with a
 * configurable speed. Playback can be triggered manually, or driven by a timer
 * with pause and play hooks. For automated playback, statistics are 
 * available via an internal FPSAnalyzer.
 * 
 * @example
 * // Creating and using a GamesRunnr to print the screen size every second.
 * var GamesRunner = new GamesRunnr({
 *     "interval": 1000,
 *     "games": [
 *         function () {
 *             console.log("Screen size: " + innerWidth + "x" + innerHeight);
 *         }
 *     ]
 * });
 * GamesRunner.play();
 * 
 * @example
 * // Creating and using a GamesRunnr to remove the first member of an Array 
 * // and output the remaining members every second until only one is left.
 * var numbers = ['a', 'b', 'c', 'd'],
 *     GamesRunner = new GamesRunnr({
 *         "interval": 1000,
 *         "games": [
 *             numbers.pop.bind(numbers),
 *             console.log.bind(console, numbers),
 *             function () {
 *                 if (numbers.length === 1) {
 *                     GamesRunner.pause();
 *                     console.log("All done!");
 *                 }
 *             }
 *         ]
 *         
 *     });
 * GamesRunner.play();
 * // After 1 second:  ['a', 'b', 'c']
 * // After 2 seconds: ['a', 'b']
 * // After 3 seconds: ['a']
 * //                  "All done!"
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function GamesRunnr(settings) {
    "use strict";
    if (!this || this === window) {
        return new FPSAnalyzr(settings);
    }
    var self = this,
    
        // Array of functions to be run on each upkeep
        games,
        
        // Optional trigger functions triggered on...
        onPause,   // self.pause()
        onPlay, // self.play()
        
        // Reference to the next upkeep, such as setTimeout's returned int
        upkeepNext,
        
        // Function used to schedule the next upkeep, such as setTimeout
        upkeepScheduler,
        
        // Function used to cancel the next upkeep, such as clearTimeout
        upkeepCanceller,
        
        // Boolean: whether the game is paused
        paused,
        
        // Number: amount of time, in milliseconds, between each upkeep
        interval,
        
        // Playback rate (defaults to 1)
        speed,
        
        // The actual speed, as (1 / speed) * interval
        intervalReal,
        
        // An FPSAnalyzr object that measures on each upkeep
        FPSAnalyzer,
        
        // An object to set as the scope for games (if not self)
        scope,
        
        // Whether scheduling timeouts should adjust to elapsed upkeep time
        adjustFramerate;
    
    /**
     * Resets the GamesRunnr.
     * 
     * @constructor
     * @param {Function[]} games   The Array of Functions to run on each 
     *                             upkeep.
     * @param {Number} [interval]   How often, in milliseconds, to call upkeep
     *                              when playing (defaults to 1000 / 60).
     * @param {Number} [speed]   A multiplier for interval that can be set
     *                           independently.
     * @param {FPSAnalyzr} [FPSAnalyzer]   An FPSAnalyzer to provide statistics
     *                                     on automated playback. If not
     *                                     provided, a new one will be made.
     * @param {Function} [onPause]   A callback to run when upkeep is paused.
     * @param {Function} [onPlay]   A callback to run when upkeep is played.
     * @param {Function} [upkeepScheduler]   A Function to replace setTimeout.
     * @param {Function} [upkeepCanceller]   A Function to replace 
     *                                       clearTimeout.
     * @param {Mixed} scope   A scope for games to be run on (defaults to the 
     *                        window).
     */
    self.reset = function(settings) {
        var i;
        
        games = settings.games || [];
        interval = settings.interval || 1000 / 60;
        speed = settings.speed || 1;
        onPause = settings.onPause;
        onPlay = settings.onPlay;
        upkeepScheduler = settings.upkeepScheduler || window.setTimeout;
        upkeepCanceller = settings.upkeepCanceller || window.clearTimeout;
        FPSAnalyzer = settings.FPSAnalyzer || new FPSAnalyzr();
        adjustFramerate = settings.adjustFramerate;
        scope = settings.scope || window;
        paused = true;
        
        for (i = 0; i < games.length; i += 1) {
            games[i] = games[i].bind(scope);
        }
        
        setIntervalReal();
    };
    
    
    /* Gets
    */
    
    /** 
     * @return {FPSAnalyzer} The FPSAnalyzer used in the GamesRunnr.
     */
    self.getFPSAnalyzer = function () {
        return FPSAnalyzer;
    };
    
    /**
     * @return {Boolean} Whether this is paused.
     */
    self.getPaused = function () {
        return paused;
    };
    
    /**
     * @return {Function[]} The Array of game Functions.
     */
    self.getGames = function () {
        return games;
    };
    
    /**
     * @return {Number} The interval between upkeeps.
     */
    self.getInterval = function () {
        return interval;
    };
    
    /**
     * @return {Number} The speed multiplier being applied to the interval.
     */
    self.getSpeed = function () {
        return speed;
    };
    
    
    /* Runtime
    */
    
    /**
     * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
     * measurement and run every game once.
     */
    self.upkeep = function () {
        if (paused) {
            return;
        }
        
        // Prevents double upkeeping, in case a new upkeepNext was scheduled.
        upkeepCanceller(upkeepNext);
        
        if (adjustFramerate) {
            upkeepNext = upkeepScheduler(
                self.upkeep, intervalReal - (self.upkeepTimed() | 0)
            );
        } else {
            upkeepNext = upkeepScheduler(self.upkeep, intervalReal);
            games.forEach(run);
        }
        
        FPSAnalyzer.measure();
    };
    
    /**
     * A utility for self.upkeep that calls the same games.forEach(run), timing
     * the total execution time.
     * 
     * @return {Number} The total time spent, in milliseconds.
     */
    self.upkeepTimed = function () {
        var now = FPSAnalyzer.getTimestamp();
        games.forEach(run);
        return FPSAnalyzer.getTimestamp() - now;
    };
    
    
    /**
     * Continues execution of self.upkeep by calling it. If an onPlay has been
     * defined, it's called before.
     */
    self.play = function () {
        if (!paused) {
            return;
        }
        paused = false;
        
        if (onPlay) {
            onPlay(self);
        }
        
        self.upkeep();
    };
    
    /**
     * Stops execution of self.upkeep, and cancels the next call. If an onPause
     * has been defined, it's called after.
     */
    self.pause = function () {
        if (paused) {
            return;
        }
        paused = true;
        
        if (onPause) {
            onPause(self);
        }
        
        upkeepCanceller(self.upkeep);
    };
    
    /**
     * Calls upkeep a <num or 1> number of times, immediately.
     * 
     * @param {Number} [num]   How many times to upkeep, if not 1.
     */
    self.step = function(num) {
        self.play();
        self.pause();
        if (num > 0) {
            self.step(num - 1);
        }
    };
    
    /**
     * Toggles whether this is paused, and calls the appropriate Function.
     */
    self.togglePause = function () {
        paused ? self.play() : self.pause();
    };
    
    
    /* Games manipulations
    */
    
    /**
     * Sets the interval between between upkeeps.
     * 
     * @param {Number} The new time interval in milliseconds.
     */
    self.setInterval = function(num) {
        var realint = Number(num);
        
        if (isNaN(realint)) {
            throw new Error("Invalid Number given to setInterval:", num);
            return self;
        }
        
        interval = realint;
        setIntervalReal();
    };
    
    /**
     * Sets the speed multiplier for the interval.
     * 
     * @param {Number} The new speed multiplier. 2 will cause interval to be
     *                 twice as fast, and 0.5 will be half as fast.
     */
    self.setSpeed = function(num) {
        var numReal = Number(num);
        
        if (isNaN(numReal)) {
            throw new Error("Invalid Number given to setSpeed:", num);
            return self;
        }
        
        speed = numReal;
        setIntervalReal();
    };
    
    
    /* Utilities
    */
    
    /**
     * Sets the intervalReal variable, which is interval * (inverse of speed).
     */
    function setIntervalReal() {
        intervalReal = (1 / speed) * interval;
    }
    
    /**
     * Curry function to fun a given function. Used in games.forEach(game).
     * 
     * @param {Function} game
     */
    function run(game) {
        game();
    }
    
    
    self.reset(settings || {});
}