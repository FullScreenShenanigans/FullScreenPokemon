/// <reference path="FPSAnalyzr-0.2.1.ts" />

declare module GamesRunnr {
    export interface IGamesRunnrSettings {
        // The Array of Functions to run on each upkeep.
        games: any[];

        // How often, in milliseconds, to call upkeep when playing (defaults to
        // 1000 / 60).
        interval?: number;

        // A multiplier for interval that can be set independently.
        speed?: number;

        // Whether scheduling timeouts should adjust to elapsed upkeep time.
        adjustFramerate?: boolean;

        // A callback to run when upkeep is paused.
        onPause?: (...args: any[]) => void;

        // A callback to run when upkeep is played.
        onPlay?: (...args: any[]) => void;

        // Arguments to be passed to onPause and onPlay (by default, [this])
        callbackArguments?: any[];

        // A Function to replace setTimeout.
        /**
         * A Function to replace setTimeout as the upkeepScheduler.
         */
        upkeepScheduler?: (callback: Function, timeout: number) => number;

        /**
         * A Function to replace clearTimeout as the upkeepCanceller.
         */
        upkeepCanceller?: (handle: number) => void;

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

    export interface IGamesRunnr {
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr;
        getPaused(): boolean;
        getGames(): any[];
        getInterval(): number;
        getSpeed(): number;
        getOnPause(): any;
        getOnPlay(): any;
        getCallbackArguments(): any[];
        getUpkeepScheduler(): (callback: Function, timeout: number) => number;
        getUpkeepCanceller(): (handle: number) => void;
        upkeep(): void;
        upkeepTimed(): number;
        play(): void;
        pause(): void;
        step(times?: number): void;
        togglePause(): void;
        setInterval(interval: number): void;
        setSpeed(speed: number): void;
    }
}


module GamesRunnr {
    "use strict";

    /**
     * A class to continuously series of "game" Functions. Each game is run in a 
     * set order and the group is run as a whole at a particular interval, with a
     * configurable speed. Playback can be triggered manually, or driven by a timer
     * with pause and play hooks. For automated playback, statistics are 
     * available via an internal FPSAnalyzer.
     */
    export class GamesRunnr implements IGamesRunnr {
        /**
         * Functions to be run, in order, on each upkeep.
         */
        private games: any[];

        /**
         * Optional trigger Function for this.pause.
         */
        private onPause: (...args: any[]) => void;

        /**
         * Optional trigger Function for this.play.
         */
        private onPlay: (...args: any[]) => void;

        /**
         * Arguments to be passed to the optional trigger Functions.
         */
        private callbackArguments: any[];

        /**
         * Reference to the next upkeep, such as setTimeout's returned int.
         */
        private upkeepNext: number;

        /**
         * Function used to schedule the next upkeep, such as setTimeout.
         */
        private upkeepScheduler: (callback: Function, timeout: number) => number;

        /**
         * Function used to cancel the next upkeep, such as clearTimeout
         */
        private upkeepCanceller: (handle: number) => void;

        /**
         * this.upkeep bound to this GamesRunnr, for use in upkeepScheduler.
         */
        private upkeepBound: any;

        /**
         * Whether the game is currently paused.
         */
        private paused: boolean;

        /**
         * The amount of time, in milliseconds, between each upkeep.
         */
        private interval: number;

        /**
         * The playback rate multiplier (defaults to 1, for no change).
         */
        private speed: number;

        /**
         * The actual speed, as (1 / speed) * interval.
         */
        private intervalReal: number;

        /**
         * An internal FPSAnalyzr object that measures on each upkeep.
         */
        private FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;

        /**
         * An object to set as the scope for games, if not this GamesRunnr.
         */
        private scope: any;

        /**
         * Whether scheduling timeouts should adjust to elapsed upkeep time.
         */
        private adjustFramerate: boolean;

        /**
         * @param {IGamesRunnrSettings} settings
         */
        constructor(settings: IGamesRunnrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given GamesRunnr.");
            }
            if (typeof settings.games === "undefined") {
                throw new Error("No games given to GamesRunnr.");
            }

            var i: number;

            this.games = settings.games;
            this.interval = settings.interval || 1000 / 60;
            this.speed = settings.speed || 1;
            this.onPause = settings.onPause;
            this.onPlay = settings.onPlay;
            this.callbackArguments = settings.callbackArguments || [this];
            this.adjustFramerate = settings.adjustFramerate;
            this.FPSAnalyzer = settings.FPSAnalyzer || new FPSAnalyzr.FPSAnalyzr(settings.FPSAnalyzerSettings);

            this.scope = settings.scope || this;
            this.paused = true;

            this.upkeepScheduler = settings.upkeepScheduler || function (handler: any, timeout: number): number {
                return setTimeout(handler, timeout);
            };
            this.upkeepCanceller = settings.upkeepCanceller || function (handle: number): void {
                clearTimeout(handle);
            };

            this.upkeepBound = this.upkeep.bind(this);

            for (i = 0; i < this.games.length; i += 1) {
                this.games[i] = this.games[i].bind(this.scope);
            }

            this.setIntervalReal();
        }


        /* Gets
        */

        /** 
         * @return {FPSAnalyzer} The FPSAnalyzer used in the GamesRunnr.
         */
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr {
            return this.FPSAnalyzer;
        }

        /**
         * @return {Boolean} Whether this is paused.
         */
        getPaused(): boolean {
            return this.paused;
        }

        /**
         * @return {Function[]} The Array of game Functions.
         */
        getGames(): any[] {
            return this.games;
        }

        /**
         * @return {Number} The interval between upkeeps.
         */
        getInterval(): number {
            return this.interval;
        }

        /**
         * @return {Number} The speed multiplier being applied to the interval.
         */
        getSpeed(): number {
            return this.speed;
        }

        /**
         * @return {Function} The optional trigger to be called on pause.
         */
        getOnPause(): any {
            return this.onPause;
        }

        /**
         * @return {Function} The optional trigger to be called on play.
         */
        getOnPlay(): any {
            return this.onPlay;
        }

        /**
         * @return {Array} Arguments to be given to the optional trigger Functions.
         */
        getCallbackArguments(): any[] {
            return this.callbackArguments;
        }

        /**
         * @return {Function} Function used to schedule the next upkeep.
         */
        getUpkeepScheduler(): (callback: Function, timeout: number) => number {
            return this.upkeepScheduler;
        }

        /**
         * @return {Function} Function used to cancel the next upkeep.
         */
        getUpkeepCanceller(): (handle: number) => void {
            return this.upkeepCanceller;
        }


        /* Runtime
        */

        /**
         * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
         * measurement and run every game once.
         */
        upkeep(): void {
            if (this.paused) {
                return;
            }

            // Prevents double upkeeping, in case a new upkeepNext was scheduled.
            this.upkeepCanceller(this.upkeepNext);

            if (this.adjustFramerate) {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal - (this.upkeepTimed() | 0));
            } else {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal);
                this.games.forEach(this.run);
            }

            if (this.FPSAnalyzer) {
                this.FPSAnalyzer.measure();
            }
        }

        /**
         * A utility for this.upkeep that calls the same games.forEach(run), timing
         * the total execution time.
         * 
         * @return {Number} The total time spent, in milliseconds.
         */
        upkeepTimed(): number {
            if (!this.FPSAnalyzer) {
                throw new Error("An internal FPSAnalyzr is required for upkeepTimed.");
            }

            var now: number = this.FPSAnalyzer.getTimestamp();
            this.games.forEach(this.run);
            return this.FPSAnalyzer.getTimestamp() - now;
        }

        /**
         * Continues execution of this.upkeep by calling it. If an onPlay has been
         * defined, it's called before.
         */
        play(): void {
            if (!this.paused) {
                return;
            }
            this.paused = false;

            if (this.onPlay) {
                this.onPlay.apply(this, this.callbackArguments);
            }

            this.upkeep();
        }

        /**
         * Stops execution of this.upkeep, and cancels the next call. If an onPause
         * has been defined, it's called after.
         */
        pause(): void {
            if (this.paused) {
                return;
            }
            this.paused = true;

            if (this.onPause) {
                this.onPause.apply(this, this.callbackArguments);
            }

            this.upkeepCanceller(this.upkeepNext);
        }

        /**
         * Calls upkeep a <num or 1> number of times, immediately.
         * 
         * @param {Number} [num]   How many times to upkeep, if not 1.
         */
        step(times: number = 1): void {
            this.play();
            this.pause();
            if (times > 0) {
                this.step(times - 1);
            }
        }

        /**
         * Toggles whether this is paused, and calls the appropriate Function.
         */
        togglePause(): void {
            this.paused ? this.play() : this.pause();
        }


        /* Games manipulations
        */

        /**
         * Sets the interval between between upkeeps.
         * 
         * @param {Number} The new time interval in milliseconds.
         */
        setInterval(interval: number): void {
            var intervalReal: number = Number(interval);

            if (isNaN(intervalReal)) {
                throw new Error("Invalid interval given to setInterval: " + interval);
            }

            this.interval = intervalReal;
            this.setIntervalReal();
        }

        /**
         * Sets the speed multiplier for the interval.
         * 
         * @param {Number} The new speed multiplier. 2 will cause interval to be
         *                 twice as fast, and 0.5 will be half as fast.
         */
        setSpeed(speed: number): void {
            var speedReal: number = Number(speed);

            if (isNaN(speedReal)) {
                throw new Error("Invalid speed given to setSpeed: " + speed);
            }

            this.speed = speedReal;
            this.setIntervalReal();
        }


        /* Utilities
        */

        /**
         * Sets the intervalReal variable, which is interval * (inverse of speed).
         */
        private setIntervalReal(): void {
            this.intervalReal = (1 / this.speed) * this.interval;
        }

        /**
         * Curry function to fun a given function. Used in games.forEach(game).
         * 
         * @param {Function} game
         */
        private run(game: Function): void {
            game();
        }
    }
}
