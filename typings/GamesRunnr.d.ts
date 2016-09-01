/// <reference path="../typings/FPSAnalyzr.d.ts" />
declare namespace GamesRunnr {
    /**
     * Runs a series of callbacks on a timed interval.
     */
    class GamesRunnr implements IGamesRunnr {
        /**
         * Functions to be run, in order, on each upkeep.
         */
        private games;
        /**
         * Optional trigger Function for this.close.
         */
        private onClose;
        /**
         * Optional trigger Function for this.pause.
         */
        private onPause;
        /**
         * Optional trigger Function for this.play.
         */
        private onPlay;
        /**
         * Arguments to be passed to the optional trigger Functions.
         */
        private callbackArguments;
        /**
         * Reference to the next upkeep, such as setTimeout's returned int.
         */
        private upkeepNext;
        /**
         * Function used to schedule the next upkeep, such as setTimeout.
         */
        private upkeepScheduler;
        /**
         * Function used to cancel the next upkeep, such as clearTimeout
         */
        private upkeepCanceller;
        /**
         * this.upkeep bound to this GamesRunnr, for use in upkeepScheduler.
         */
        private upkeepBound;
        /**
         * Whether the game is currently paused.
         */
        private paused;
        /**
         * The amount of time, in milliseconds, between each upkeep.
         */
        private interval;
        /**
         * The playback rate multiplier (defaults to 1, for no change).
         */
        private speed;
        /**
         * The actual speed, as (1 / speed) * interval.
         */
        private intervalReal;
        /**
         * An internal FPSAnalyzr object that measures on each upkeep.
         */
        private FPSAnalyzer;
        /**
         * An object to set as the scope for games, if not this GamesRunnr.
         */
        private scope;
        /**
         * Whether scheduling timeouts should adjust to elapsed upkeep time.
         */
        private adjustFramerate;
        /**
         * Initializes a new instance of the GamesRunnr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IGamesRunnrSettings);
        /**
         * @returns The FPSAnalyzer used in the GamesRunnr.
         */
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr;
        /**
         * @returns Whether this is paused.
         */
        getPaused(): boolean;
        /**
         * @returns The Array of game Functions.
         */
        getGames(): Function[];
        /**
         * @returns The interval between upkeeps.
         */
        getInterval(): number;
        /**
         * @returns The speed multiplier being applied to the interval.
         */
        getSpeed(): number;
        /**
         * @returns The optional trigger to be called on close.
         */
        getOnClose(): any;
        /**
         * @returns The optional trigger to be called on pause.
         */
        getOnPause(): any;
        /**
         * @returns The optional trigger to be called on play.
         */
        getOnPlay(): any;
        /**
         * @returns Arguments to be given to the optional trigger Functions.
         */
        getCallbackArguments(): any[];
        /**
         * @returns Function used to schedule the next upkeep.
         */
        getUpkeepScheduler(): IUpkeepScheduler;
        /**
         * @returns {Function} Function used to cancel the next upkeep.
         */
        getUpkeepCanceller(): (handle: number) => void;
        /**
         * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
         * measurement and run every game once.
         */
        upkeep(): void;
        /**
         * A utility for this.upkeep that calls the same games.forEach(run), timing
         * the total execution time.
         *
         * @returns The total time spent, in milliseconds.
         */
        upkeepTimed(): number;
        /**
         * Runs onClose.
         */
        close(): void;
        /**
         * Continues execution of this.upkeep by calling it. If an onPlay has been
         * defined, it's called before.
         */
        play(): void;
        /**
         * Stops execution of this.upkeep, and cancels the next call. If an onPause
         * has been defined, it's called after.
         */
        pause(): void;
        /**
         * Calls upkeep a <num or 1> number of times, immediately.
         *
         * @param [num]   How many times to upkeep (by default, 1).
         */
        step(times?: number): void;
        /**
         * Toggles whether this is paused, and calls the appropriate Function.
         */
        togglePause(): void;
        /**
         * Sets the interval between between upkeeps.
         *
         * @param interval   The new time interval in milliseconds.
         */
        setInterval(interval: number): void;
        /**
         * Sets the speed multiplier for the interval.
         *
         * @param speed   The new speed multiplier. 2 will cause interval to be
         *                twice as fast, and 0.5 will be half as fast.
         */
        setSpeed(speed: number): void;
        /**
         * Sets the intervalReal variable, which is interval * (inverse of speed).
         */
        private setIntervalReal();
        /**
         * Runs all games in this.games.
         */
        private runAllGames();
    }
    /**
     * A callback for when the game changes playing state (pause or play).
     */
    interface ITriggerCallback {
        (...args: any[]): void;
    }
    /**
     * A callback to schedule each upkeep.
     *
     * @param callback   The next upkeep to run.
     * @param timeout   How long to wait before calling the next upkeep.
     * @returns A unique identifier that can be passed to an upkeep cancellation.
     */
    interface IUpkeepScheduler {
        (callback: Function, timeout: number): number;
    }
    /**
     * A callback to disable an upkeep.
     *
     * @param handle   The unique identifier of the upkeep to cancel.
     */
    interface IUpkeepCanceller {
        (handle: number): void;
    }
    /**
     * Settings to initialize a new IGamesRunnr instance.
     */
    interface IGamesRunnrSettings {
        /**
         * The Array of Functions to run on each upkeep.
         */
        games: Function[];
        /**
         * How often, in milliseconds, to call upkeep (by default, 1000/60).
         */
        interval?: number;
        /**
         * A multiplier for interval that can be set independently.
         */
        speed?: number;
        /**
         * Whether scheduling timeouts should adjust to elapsed upkeep time.
         */
        adjustFramerate?: boolean;
        /**
         * A callback to run when upkeep is paused.
         */
        onPause?: ITriggerCallback;
        /**
         * A callback to run when play is closed.
         */
        onClose?: ITriggerCallback;
        /**
         * A callback to run when upkeep is played.
         */
        onPlay?: ITriggerCallback;
        /**
         * Arguments to be passed to onPause and onPlay (by default, [this]).
         */
        callbackArguments?: any[];
        /**
         * A Function to replace setTimeout as the upkeepScheduler.
         */
        upkeepScheduler?: IUpkeepScheduler;
        /**
         * A Function to replace clearTimeout as the upkeepCanceller.
         */
        upkeepCanceller?: IUpkeepCanceller;
        /**
         * A scope for games to be run on (defaults to the calling GamesRunnr).
         */
        scope?: any;
        /**
         * An FPSAnalyzr to provide statistics on automated playback. If not
         * provided, a new one will be made.
         */
        FPSAnalyzer?: FPSAnalyzr.IFPSAnalyzr;
        /**
         * Settings to create a new FPSAnalyzr, if one isn't provided.
         */
        FPSAnalyzerSettings?: FPSAnalyzr.IFPSAnalyzrSettings;
    }
    /**
     * A class to continuously series of "game" Functions. Each game is run in a
     * set order and the group is run as a whole at a particular interval, with a
     * configurable speed. Playback can be triggered manually, or driven by a timer
     * with pause and play hooks. For automated playback, statistics are
     * available via an internal FPSAnalyzer.
     */
    interface IGamesRunnr {
        /**
         * @returns The FPSAnalyzer used in the GamesRunnr.
         */
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr;
        /**
         * @returns Whether this is paused.
         */
        getPaused(): boolean;
        /**
         * @returns The Array of game Functions.
         */
        getGames(): any[];
        /**
         * @returns The interval between upkeeps.
         */
        getInterval(): number;
        /**
         * @returns The speed multiplier being applied to the interval.
         */
        getSpeed(): number;
        /**
         * @returns The optional trigger to be called on pause.
         */
        getOnPause(): any;
        /**
         * @returns The optional trigger to be called on play.
         */
        getOnPlay(): any;
        /**
         * @returns Arguments to be given to the optional trigger Functions.
         */
        getCallbackArguments(): any[];
        /**
         * @returns Function used to schedule the next upkeep.
         */
        getUpkeepScheduler(): IUpkeepScheduler;
        /**
         * @returns {Function} Function used to cancel the next upkeep.
         */
        getUpkeepCanceller(): IUpkeepCanceller;
        /**
         * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
         * measurement and run every game once.
         */
        upkeep(): void;
        /**
         * A utility for this.upkeep that calls the same games.forEach(run), timing
         * the total execution time.
         *
         * @returns The total time spent, in milliseconds.
         */
        upkeepTimed(): number;
        /**
         * Continues execution of this.upkeep by calling it. If an onPlay has been
         * defined, it's called before.
         */
        play(): void;
        /**
         * Stops execution of this.upkeep, and cancels the next call. If an onPause
         * has been defined, it's called after.
         */
        pause(): void;
        /**
         * Calls upkeep a <num or 1> number of times, immediately.
         *
         * @param [num]   How many times to upkeep (by default, 1).
         */
        step(times?: number): void;
        /**
         * Toggles whether this is paused, and calls the appropriate Function.
         */
        togglePause(): void;
        /**
         * Sets the interval between between upkeeps.
         *
         * @param interval   The new time interval in milliseconds.
         */
        setInterval(interval: number): void;
        /**
         * Sets the speed multiplier for the interval.
         *
         * @param speed   The new speed multiplier. 2 will cause interval to be
         *                twice as fast, and 0.5 will be half as fast.
         */
        setSpeed(speed: number): void;
    }
}
declare var module: any;
