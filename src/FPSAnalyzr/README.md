# FPSAnalyzr

A general utility for obtaining and analyzing framerate measurements. The most
recent measurements are kept up to a certain point (either an infinite number
or a set amount). Options for analyzing the data such as getting the mean,
mean, median, extremes, etc. are available.


## Basic Architecture

#### Important APIs

* **measure(***`[time]`***)** - Marks the current time and, if not the first
measurement, adds an FPS measurement.

* **addFPS(***`fps`***)** - Adds the FPS measurement.

#### Important Member Variables

* **maxKept** *`Number`* - The number of measurements to keep (this may also be
Infinity).

* **measurements** *`Array/Object`* - The storage container for keeping
measurements. If maxKept is a Number, this is an Array; if maxKept is Infinity,
this is an Object.

* **ticker** *`Number`* - A modular ticker that increases every time an FPS
measurement is added, modulo maxKept. When measurements is an Array this 
determines which position to add new measurements.

#### Constructor Arguments

* **[maxKept]** *`Number`* - The number of measurements to keep (either a `Number` or `Infinity`).

* **[getTimestamp]** *`Function`* - A Function to get an accurate timestamp. Defaults to `performance.now`.


## Sample Usage

1.  Creating and using an FPSAnalyzr to measure setInterval accuracy.

    ```javascript
    var FPSAnalyzer = new FPSAnalyzr();
    setInterval(FPSAnalyzer.measure.bind(FPSAnalyzer), 1000 / 30);
    setTimeout(
        function () {
            console.log("Average FPS:", FPSAnalyzer.getAverage());
        },
        7000
    );
    ```

2. Creating and using an FPSAnalyzr to look at the 10 most recent FPS
   measurements and get the best & worst amounts.

    ```javascript
    var target = 1000 / 30,
        numKept = 10,
        FPSAnalyzer = new FPSAnalyzr({
            "maxKept": numKept
        }),
        i;

    for (i = 0; i < numKept; i += 1) {
        setTimeout(FPSAnalyzer.measure.bind(FPSAnalyzer), i * target);
    }

    setTimeout(
        function () {
            console.log("Measurements:", FPSAnalyzer.getMeasurements());
            console.log("Extremes:", FPSAnalyzer.getExtremes());
            console.log("Range:", FPSAnalyzer.getRange());
        },
        numKept * i * target
    );
    ```