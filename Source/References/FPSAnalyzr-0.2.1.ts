declare module FPSAnalyzr {
    export interface IFPSAnalyzrSettings {
        maxKept?: number;
        getTimestamp?: any;
    }

    export interface IFPSAnalyzr {
        getTimestamp: () => number;
        measure(time?: number): void;
        addFPS(fps: number): void;
        getMaxKept(): number;
        getNumRecorded(): number;
        getTimeCurrent(): number;
        getTicker(): number;
        getMeasurements(): any;
        getDifferences(): any;
        getAverage(): number;
        getMedian(): number;
        getExtremes(): number[];
        getRange(): number;
    }
}


module FPSAnalyzr {
    "use strict";

    /**
     * A general utility for obtaining and analyzing framerate measurements. The 
     * most recent measurements are kept up to a certain point (either an infinite
     * number or a set amount). Options for analyzing the data such as getting the
     * mean, median, extremes, etc. are available.
     */
    export class FPSAnalyzr implements IFPSAnalyzr {
        /**
         * Function to generate a current timestamp, commonly performance.now.
         */
        public getTimestamp: () => number;

        /**
         * How many FPS measurements to keep at any given time, at most.
         */
        private maxKept: number;

        /**
         * A recent history of FPS measurements (normally an Array). These are
         * stored as changes in millisecond timestamps.
         */
        private measurements: Array<number> | { [i: number]: number };

        /**
         * The actual number of FPS measurements currently known.
         */
        private numRecorded: number;

        /**
         * The current position in the internal measurements listing.
         */
        private ticker: number;

        /**
         * The most recent timestamp from getTimestamp.
         */
        private timeCurrent: number;

        /**
         * @param {IFPSAnalyzrSettings} [settings]
         */
        constructor(settings: IFPSAnalyzrSettings = {}) {
            this.maxKept = settings.maxKept || 35;
            this.numRecorded = 0;
            this.ticker = -1;

            // If maxKept is a Number, make the measurements array that long
            // If it's infinite, make measurements an {} (infinite array)
            this.measurements = isFinite(this.maxKept) ? new Array(this.maxKept) : {};

            // Headless browsers like PhantomJS won't know performance, so Date.now
            // is used as a backup
            if (typeof settings.getTimestamp === "undefined") {
                if (typeof performance === "undefined") {
                    this.getTimestamp = function (): number {
                        return Date.now();
                    };
                } else {
                    this.getTimestamp = (
                        performance.now
                        || (<any>performance).webkitNow
                        || (<any>performance).mozNow
                        || (<any>performance).msNow
                        || (<any>performance).oNow
                        ).bind(performance);
                }
            } else {
                this.getTimestamp = settings.getTimestamp;
            }
        }


        /* Public interface
        */

        /**
         * Standard public measurement function.
         * Marks the current timestamp as timeCurrent, and adds an FPS measurement
         * if there was a previous timeCurrent.
         * 
         * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
         *                                     getTimestamp() is used instead.
         */
        measure(time: number = this.getTimestamp()): void {
            if (this.timeCurrent) {
                this.addFPS(1000 / (time - this.timeCurrent));
            }

            this.timeCurrent = time;
        }

        /**
         * Adds an FPS measurement to measurements, and increments the associated
         * count variables.
         * 
         * @param {Number} fps   An FPS calculated as the difference between two
         *                       timestamps.
         */
        addFPS(fps: number): void {
            this.ticker = (this.ticker += 1) % this.maxKept;
            this.measurements[this.ticker] = fps;
            this.numRecorded += 1;
        }


        /* Gets
        */

        /**
         * @return {Number} The number of FPS measurements to keep.
         */
        getMaxKept(): number {
            return this.maxKept;
        }

        /**
         * @return {Number} The actual number of FPS measurements currently known.
         */
        getNumRecorded(): number {
            return this.numRecorded;
        }

        /**
         * @return {Number} The most recent performance.now timestamp.
         */
        getTimeCurrent(): number {
            return this.timeCurrent;
        }

        /**
         * @return {Number} The current position in measurements.
         */
        getTicker(): number {
            return this.ticker;
        }

        /**
         * Get function for a copy of the measurements listing (if the number of
         * measurements is less than the max, that size is used)
         * 
         * @return {Object}   An object (normally an Array) of the most recent FPS
         *                    measurements
         */
        getMeasurements(): Array<number> | { [i: number]: number } {
            var fpsKeptReal: number = Math.min(this.maxKept, this.numRecorded),
                copy: any,
                i: number;

            if (isFinite(this.maxKept)) {
                copy = new Array(fpsKeptReal);
            } else {
                copy = {};
                copy.length = fpsKeptReal;
            }

            for (i = fpsKeptReal - 1; i >= 0; --i) {
                copy[i] = this.measurements[i];
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
        getDifferences(): any {
            var copy: any = this.getMeasurements(),
                i: number;

            for (i = copy.length - 1; i >= 0; --i) {
                copy[i] = 1000 / copy[i];
            }

            return copy;
        }

        /**
         * @return {Number} The average recorded FPS measurement.
         */
        getAverage(): number {
            var total: number = 0,
                max: number = Math.min(this.maxKept, this.numRecorded),
                i: number;

            for (i = max - 1; i >= 0; --i) {
                total += this.measurements[i];
            }

            return total / max;
        }

        /**
         * @return {Number} The median recorded FPS measurement.
         * @remarks This is O(n*log(n)), where n is the size of the history,
         *          as it creates a copy of the history and sorts it.
         */
        getMedian(): number {
            var copy: any = this.getMeasurementsSorted(),
                fpsKeptReal: number = copy.length,
                fpsKeptHalf: number = Math.floor(fpsKeptReal / 2);

            if (copy.length % 2 === 0) {
                return copy[fpsKeptHalf];
            } else {
                return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
            }
        }

        /**
         * @return {Number[]} An Array containing the lowest and highest recorded
         *                    FPS measurements, in that order.
         */
        getExtremes(): number[] {
            var lowest: number = this.measurements[0],
                highest: number = lowest,
                max: number = Math.min(this.maxKept, this.numRecorded),
                fps: number,
                i: number;

            for (i = max - 1; i >= 0; --i) {
                fps = this.measurements[i];
                if (fps > highest) {
                    highest = fps;
                } else if (fps < lowest) {
                    lowest = fps;
                }
            }

            return [lowest, highest];
        }

        /**
         * @return {Number} The range of recorded FPS measurements
         */
        getRange(): number {
            var extremes: number[] = this.getExtremes();
            return extremes[1] - extremes[0];
        }

        /**
         * 
         */
        private getMeasurementsSorted(): number[] {
            var copy: number[],
                i: string;

            if (this.measurements.constructor === Array) {
                copy = (<number[]>this.measurements).sort();
            } else {
                copy = [];

                for (i in this.measurements) {
                    if (this.measurements.hasOwnProperty(i)) {
                        if (this.measurements[i] === undefined) {
                            break;
                        }
                        copy[i] = this.measurements[i];
                    }
                }

                copy.sort();
            }

            if (this.numRecorded < this.maxKept) {
                copy.length = this.numRecorded;
            }

            return copy.sort();
        }
    }
}
