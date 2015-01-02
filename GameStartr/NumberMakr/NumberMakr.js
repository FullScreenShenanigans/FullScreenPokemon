/**
 * NumberMakr.js
 * 
 * An updated version of the traditional MersenneTwister JavaScript class by 
 * Sean McCullough (2010), based on code by Takuji Nishimura and Makoto 
 * Matsumoto (1997 - 2002).
 * 
 * For the 2010 code, see https://gist.github.com/banksean/300494.
 * 
 * @example
 * // Creating and using a NumberMaker as a substute for Math.random().
 * var NumberMaker = new NumberMakr();
 * console.log(NumberMaker.random()); // some random Number in [0, 1)
 * console.log(NumberMaker.random()); // some random Number in [0, 1)
 * 
 * @example
 * // Creating and using a NumberMaker with a seed.
 * var NumberMaker = new NumberMakr({
 *     "seed": 7777777
 * });
 * console.log(NumberMaker.random()); // 0.337172580184415
 * console.log(NumberMaker.random()); // 0.4261356364004314
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over each other's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var statePeriod = new MersenneTwister();
  var randomNumber = statePeriod.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var statePeriod = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/
/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(keyInitial, keyLength).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~statePeriod-mat/stateVector/emt.html
   email: statePeriod-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
function NumberMakr(settings) {
    "use strict";
    if (!this || this === window) {
        return new NumbrMakr(settings);
    }
    var self = this,
        
        // Number length of the state vector
        stateLength,
        
        // Number period
        statePeriod,
        
        // Constant vector a
        matrixA,

        // Constant magic array from matrixA
        matrixAMagic,
        
        // Most significant w-r bits
        maskUpper,
        
        // Least significant r bits
        maskLower,
        
        // Array for the state vector
        stateVector,
        
        // Number for place in state vector (if out of range, uninitialised)
        stateIndex,
        
        // The starting seed used to initialize. This may be a Number or Array.
        seed = 0;
    
    /**
     * Resets the NumberMakr.
     * 
     * @constructor
     * @param {Number/Array} [seed]   A starting seed used to initialize. This 
     *                                can be a Number or Array; the appropriate
     *                                resetFrom Function will be called.
     * @param {Number} [stateLength]   How long the state vector will be.
     * @param {Number} [statePeriod]   How long the state period will be.
     * @param {Number} [matrixA]   A constant mask to generate the matrixAMagic
     *                             Array of [0, some number]
     * @param {Number} [maskUpper]   An upper mask to binary-and on (the most 
     *                               significant w-r bits).
     * @param {Number} [maskLower]   A lower mask to binary-and on (the least
     *                               significant r bits).
     */
    self.reset = function (settings) {
        stateLength = settings.stateLength || 624;
        statePeriod = settings.statePeriod || 397;
        matrixA = settings.matrixA || 0x9908b0df;
        maskUpper = settings.maskUpper || 0x80000000;
        maskLower = settings.maskLower || 0x7fffffff;
        
        stateVector = new Array(stateLength);
        stateIndex = stateLength + 1;
        matrixAMagic = new Array(0x0, matrixA);
        
        self.resetFromSeed(settings.seed || new Date().getTime());
    };
    
    /**
     * 
     */
    self.getSeed = function () {
        return seed;
    };
    
    /**
     * Initializes state from a Number.
     * 
     * @param {Number} [seedNew]   Defaults to the previously set seed.
     */
    self.resetFromSeed = function (seedNew) {
        var s;
        
        if (typeof(seedNew) === "undefined") {
            seedNew = seed;
        }
        
        stateVector[0] = seedNew >>> 0;
        
        for (stateIndex = 1; stateIndex < stateLength; stateIndex += 1) {
            s = stateVector[stateIndex - 1] ^ (stateVector[stateIndex - 1] >>> 30);
            stateVector[stateIndex] = (
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) 
                    + (s & 0x0000ffff) * 1812433253
                ) + stateIndex
            ) >>> 0;
        }
        
        seed = seedNew;
    };
    
    /**
     * Initializes state from an Array.
     * 
     * @param {Number[]} keyInitial
     * @param {Number} [keyLength]   The length of keyInitial (defaults to the
     *                                actual keyInitial.length).
     * @remarks   There was a slight change for C++, 2004/2/26.
     */
    self.resetFromArray = function (keyInitial, keyLength) {
        var i = 1,
            j = 0, 
            k,
            s;
        
        self.resetFromSeed(19650218);
        
        if (typeof(keyLength) === "undefined") {
            keyLength = keyInitial.length;
        }
        k = stateLength > keyLength ? stateLength : keyLength;
        
        while(k > 0) {
            s = stateVector[i - 1] ^ (stateVector[i - 1] >>> 30);
            stateVector[i] = (this.stateVector[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1664525) << 16)
                    + ((s & 0x0000ffff) * 1664525)
                ) + keyInitial[j] + j
            ) >>> 0;
            
            i += 1;
            j += 1;
            
            if (i >= stateLength) {
                stateVector[0] = stateVector[stateLength - 1];
                i = 1;
            }
            
            if (j >= keyLength) {
                j = 0;
            }
        }
        
        for (k = stateLength - 1; k; k -= 1) {
            s = stateVector[i-1] ^ (stateVector[i-1] >>> 30);
            stateVector[i] = ((stateVector[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1566083941) << 16) 
                    + (s & 0x0000ffff) * 1566083941)
                ) - i
            ) >>> 0;
            
            i += 1;
            
            if (i >= stateLength) {
                stateVector[0] = stateVector[stateLength - 1];
                i = 1;
            }
        }
        
        stateVector[0] = 0x80000000;
        seed = keyInitial;
    };
    
    
    /* Random number generation
    */
    
    /**
     * @return {Number} Random Number in [0,0xffffffff].
     */
    self.randomInt32 = function () {
        var y, kk;
        
        if (stateIndex >= stateLength) {
            if (stateIndex === stateLength + 1) {
                self.resetFromSeed(5489);
            }
            
            for (kk = 0; kk < stateLength - statePeriod; kk += 1) {
                y = (stateVector[kk] & maskUpper)
                    | (stateVector[kk + 1] & maskLower);
                
                stateVector[kk] = stateVector[kk + statePeriod]
                    ^ (y >>> 1)
                    ^ matrixAMagic[y & 0x1];
            }
            
            for (; kk < stateLength - 1; kk += 1) {
                y = (stateVector[kk] & maskUpper)
                    | (stateVector[kk + 1] & maskLower);
                
                stateVector[kk] = stateVector[kk + (statePeriod - stateLength)]
                    ^ (y >>> 1) 
                    ^ matrixAMagic[y & 0x1];
            }
            
            y = (stateVector[stateLength - 1] & maskUpper) 
                | (stateVector[0] & maskLower);
            
            stateVector[stateLength - 1] = stateVector[statePeriod - 1]
                ^ (y >>> 1) ^ matrixAMagic[y & 0x1];
            
            stateIndex = 0;
        }
        
        y = stateVector[stateIndex];
        stateIndex += 1;
        
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };
    
    /**
     * @return {Number} Random number in [0,1).
     * @remarks Divided by 2^32.
     */
    self.random = function () {
        return self.randomInt32() * (1.0 / 4294967296.0); 
    };
    
    /**
     * @return {Number} Random Number in [0,0x7fffffff].
     */
    self.randomInt31 = function () {
        return self.randomInt32() >>> 1;
    };
    
    
    /* Real number generators (due to Isaku Wada, 2002/01/09)
    */
    
    /**
     * @return {Number} Random real Number in [0,1].
     * @remarks Divided by 2 ^ 32 - 1.
     */
    self.randomReal1 = function () {
        return self.randomInt32() * (1.0 / 4294967295.0); 
    };
    
    /**
     * @return {Number} Random real Number in (0,1).
     * @remarks Divided by 2 ^ 32.
     */
    self.randomReal3 = function () {
        return (self.randomInt32() + 0.5) * (1.0 / 4294967296.0); 
    };
    
    /**
     * @return {Number} Random real Number in [0,1) with 53-bit resolution.
     */
    self.randomReal53Bit = function () {
        var a = self.randomInt32() >>> 5,
            b = self.randomInt32() >>> 6; 
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0); 
    };
    
    
    /* Ranged Number generators
    */
    
    /**
     * @param {Number} max
     * @return {Number} Random Number in [0,max).
     */
    self.randomUnder = function (max) {
        return self.random() * max;
    };
    
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random Number in [min,max).
     */
    self.randomWithin = function (min, max) {
        return self.random(max - min) + min;
    };
    
    
    /* Ranged integer generators
    */
    
    /**
     * @param {Number} max
     * @return {Number} Random integer in [0,max).
     */
    self.randomInt = function (max) {
        return self.randomUnder(max) | 0;
    };
    
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random integer in [min,max).
     */
    self.randomIntWithin = function (min, max) {
        return (self.randomUnder(max - min) + min) | 0;
    };
    
    /**
     * @return {Boolean} Either 1 or 2, with 50% probability of each.
     */
    self.randomBoolean = function () {
        return self.randomInt(2) === 1;
    };
    
    
    self.reset(settings || {});
}