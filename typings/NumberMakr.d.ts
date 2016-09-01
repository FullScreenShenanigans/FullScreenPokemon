declare namespace NumberMakr {
    /**
     * Settings to initialize a new INumberMakr.
     */
    interface INumberMakrSettings {
        /**
         * A starting seed used to initialize. This can be a Number or Array; the
         * appropriate resetFrom Function will be called.
         */
        seed?: number | number[];
        /**
         * How long the state vector should be.
         */
        stateLength?: number;
        /**
         * How long the state period should be.
         */
        statePeriod?: number;
        /**
         * A constant mask to generate the matrixAMagic Array of [0, some number].
         */
        matrixA?: number;
        /**
         * An upper mask to binary-and on (the most significant w-r bits).
         */
        maskUpper?: number;
        /**
         * A lower mask to binary-and on (the least significant r bits).
         */
        maskLower?: number;
    }
    /**
     * A TypeScript Mersenne Twister implementation.
     */
    interface INumberMakr {
        /**
         * @returns The starting seed used to initialize.
         */
        getSeed(): number | number[];
        /**
         * @returns The length of the state vector.
         */
        getStateLength(): number;
        /**
         * @returns The length of the state vector.
         */
        getStatePeriod(): number;
        /**
         * @returns The length of the state vector.
         */
        getMatrixA(): number;
        /**
         * @returns The length of the state vector.
         */
        getMaskUpper(): number;
        /**
         * @returns The length of the state vector.
         */
        getMaskLower(): number;
        /**
         * Initializes state from a new seed.
         *
         * @param seedNew   A new seed to reset from.
         */
        resetFromSeed(seedNew?: number | number[]): void;
        /**
         * Initializes state from an Array.
         *
         * @param keyInitial   An initial state to reset from.
         * @param [keyLength]   The length of keyInitial (by default, keyInitial.length).
         * @remarks   There was a slight change for C++, 2004/2/26.
         */
        resetFromArray(keyInitial: number[], keyLength?: number): void;
        /**
         * @returns A random Number in [0,0xffffffff].
         */
        randomInt32(): number;
        /**
         * @returns A random number in [0,1).
         * @remarks Divided by 2^32.
         */
        random(): number;
        /**
         * @returns A random number in [0,0x7fffffff].
         */
        randomInt31(): number;
        /**
         * @returns A random real Number in [0,1].
         * @remarks Divided by 2 ^ 32 - 1.
         */
        randomReal1(): number;
        /**
         * @returns A random real Number in (0,1).
         * @remarks Divided by 2 ^ 32.
         */
        randomReal3(): number;
        /**
         * @returns A random real Number in [0,1) with 53-bit resolution.
         */
        randomReal53Bit(): number;
        /**
         * @param max   A maximum value to return under.
         * @returns A random number in [0,max).
         */
        randomUnder(max: number): number;
        /**
         * @param min   A minimum value to return.
         * @param max   A maximum value  to return under.
         * @returns A random number in [min,max).
         */
        randomWithin(min: number, max: number): number;
        /**
         * @param max   A maximum value to return under.
         * @returns a random integer in [0,max).
         */
        randomInt(max: number): number;
        /**
         * @param min   A minimum value to return.
         * @param max   A maximum value to return under.
         * @returns a random integer in [min,max).
         */
        randomIntWithin(min: number, max: number): number;
        /**
         * @returns Either true or false, with 50% probability each.
         */
        randomBoolean(): boolean;
        /**
         * @param probability   How likely the returned Boolean will be
         *                      true, in [0, 1]. If >= 1, always true.
         * @returns Either true or false, with the probability of true
         *          equal to the given probability.
         */
        randomBooleanProbability(probability: number): boolean;
        /**
         * @param numerator   The numerator of a fraction.
         * @param denominator   The denominator of a fraction.
         * @returns   Either true or false, with a probability equal to the
         *            given fraction.
         */
        randomBooleanFraction(numerator: number, denominator: number): boolean;
        /**
         * @param array   Any Array of values.
         * @returns A random index, from 0 to the given Array's length.
         */
        randomArrayIndex(array: any[]): number;
        /**
         * @param array   Any Array of values.
         * @returns A random element from within the given Array.
         */
        randomArrayMember(array: any[]): any;
    }
    /**
     * A TypeScript Mersenne Twister implementation.
     */
    class NumberMakr implements INumberMakr {
        /**
         * Length of the state vector.
         */
        private stateLength;
        /**
         * Period of the state vector.
         */
        private statePeriod;
        /**
         * Constant vector A.
         */
        private matrixA;
        /**
         * Constant magic Array from matrixA.
         */
        private matrixAMagic;
        /**
         * Most significant w-r bits.
         */
        private maskUpper;
        /**
         * Least significant r bits.
         */
        private maskLower;
        /**
         * Past states.
         */
        private stateVector;
        /**
         * Number for the place in stateVector (if out of range, state must be reset).
         */
        private stateIndex;
        /**
         * The starting seed used to initialize.
         */
        private seed;
        /**
         * Initializes a new instance of the NumberMakr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings?: INumberMakrSettings);
        /**
         * @returns The starting seed used to initialize.
         */
        getSeed(): number | number[];
        /**
         * @returns The length of the state vector.
         */
        getStateLength(): number;
        /**
         * @returns The length of the state vector.
         */
        getStatePeriod(): number;
        /**
         * @returns The length of the state vector.
         */
        getMatrixA(): number;
        /**
         * @returns The length of the state vector.
         */
        getMaskUpper(): number;
        /**
         * @returns The length of the state vector.
         */
        getMaskLower(): number;
        /**
         * Initializes state from a new seed.
         *
         * @param seedNew   A new seed to reset from.
         */
        resetFromSeed(seedNew: number | number[]): void;
        /**
         * Initializes state from an Array.
         *
         * @param keyInitial   An initial state to reset from.
         * @param [keyLength]   The length of keyInitial (by default, keyInitial.length).
         * @remarks   There was a slight change for C++, 2004/2/26.
         */
        resetFromArray(keyInitial: number[], keyLength?: number): void;
        /**
         * @returns A random Number in [0,0xffffffff].
         */
        randomInt32(): number;
        /**
         * @returns A random number in [0,1).
         * @remarks Divided by 2^32.
         */
        random(): number;
        /**
         * @returns A random number in [0,0x7fffffff].
         */
        randomInt31(): number;
        /**
         * @returns A random real Number in [0,1].
         * @remarks Divided by 2 ^ 32 - 1.
         */
        randomReal1(): number;
        /**
         * @returns A random real Number in (0,1).
         * @remarks Divided by 2 ^ 32.
         */
        randomReal3(): number;
        /**
         * @returns A random real Number in [0,1) with 53-bit resolution.
         */
        randomReal53Bit(): number;
        /**
         * @param max   A maximum value to return under.
         * @returns A random number in [0,max).
         */
        randomUnder(max: number): number;
        /**
         * @param min   A minimum value to return.
         * @param max   A maximum value  to return under.
         * @returns A random number in [min,max).
         */
        randomWithin(min: number, max: number): number;
        /**
         * @param max   A maximum value to return under.
         * @returns a random integer in [0,max).
         */
        randomInt(max: number): number;
        /**
         * @param min   A minimum value to return.
         * @param max   A maximum value to return under.
         * @returns a random integer in [min,max).
         */
        randomIntWithin(min: number, max: number): number;
        /**
         * @returns Either true or false, with 50% probability each.
         */
        randomBoolean(): boolean;
        /**
         * @param probability   How likely the returned Boolean will be
         *                      true, in [0, 1]. If >= 1, always true.
         * @returns Either true or false, with the probability of true
         *          equal to the given probability.
         */
        randomBooleanProbability(probability: number): boolean;
        /**
         * @param numerator   The numerator of a fraction.
         * @param denominator   The denominator of a fraction.
         * @returns   Either true or false, with a probability equal to the
         *            given fraction.
         */
        randomBooleanFraction(numerator: number, denominator: number): boolean;
        /**
         * @param array   Any Array of values.
         * @returns A random index, from 0 to the given Array's length.
         */
        randomArrayIndex(array: any[]): number;
        /**
         * @param array   Any Array of values.
         * @returns A random element from within the given Array.
         */
        randomArrayMember<T>(array: T[]): T;
    }
}
declare var module: any;
