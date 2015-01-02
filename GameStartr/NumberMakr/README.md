# NumberMakr

An updated version of the traditional MersenneTwister JavaScript class by 
Sean McCullough (2010), based on code by Takuji Nishimura and Makoto 
Matsumoto (1997 - 2002).

For the 2010 code, see https://gist.github.com/banksean/300494.


## Basic Architecture

#### Important APIs

* **random()** - Generates a random number in [0,1). This is equivalent to 
Math.random().

* **resetFromSeed(***`seedNew`***)** - Resets the NumberMakr using the given 
seed. Subsequent calls to random functions will then be deterministic based
on the seed.

#### Constructor Arguments

* **seed** *`Number/Array`* - A starting seed to initialize. This can be a 
Number or Array; the appropriate reset will be called.

* **stateLength** *`Number`* - How long the state vector will be.

* **statePeriod** *`Number`* - How long the state period will be.

* **matrixA** *`Number`* - A constant mask to generate the matrixAMagic Array
of [0, some number]

* **maskUpper** *`Number`* - An upper mask to binary-and on (the most
significant w-r bits).

* **maskLower** *`Number`* - A lower mask to binary-and on (the least
significant r bits).


## Sample Usage

1. Creating and using a NumberMaker as a substute for Math.random().

    ```javascript
    var NumberMaker = new NumberMakr();
    console.log(NumberMaker.random()); // some random Number in [0, 1)
    console.log(NumberMaker.random()); // some random Number in [0, 1)
    ```

2. Creating and using a NumberMaker with a seed.

    ```javascript
    var NumberMaker = new NumberMakr({
        "seed": 7777777
    });
    console.log(NumberMaker.random()); // 0.337172580184415
    console.log(NumberMaker.random()); // 0.4261356364004314
    ```