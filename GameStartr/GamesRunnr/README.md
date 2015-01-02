# GamesRunnr

A class to continuously series of "game" Functions. Each game is run in a set
order and the group is run as a whole at a particular interval, with a
configurable speed. Playback can be triggered manually, or driven by a timer
with play and pause hooks. For automated playback, statistics are available 
via an internal FPSAnalyzer.


## Basic Architecture

#### Important APIs

* **upkeep()** - The core "upkeep" function that runs each game in order.

* **play()** - Starts automatic playback of the games.

* **pause()** - Pauses automatic playback of the games.

* **step(***`[num]`***)** - Runs upkeep a 'num' number of times (defaults to 1).

#### Important Member Variables

* **games** *`Array<Function>`* - The ordered list of games to be run.

* **interval** *`Number`* - How often to call upkeep, in milliseconds.

* **speed** *`Number`* - A speed multiplier for interval. 1 by default.

* **FPSAnalyzer** *`FPSAnalyzr`* - An FPSAnalyzr object that measures on each 
upkeep.

#### Constructor Arguments

* **games** *`Function[]`*

* **interval** *`Number`*

* **speed** *`Number`*

* **upkeepScheduler** *`Function`* - A Function to replace setTimeout.

* **upkeepCanceller** *`Function`* - A Function to replace clearTimeout.

* **[FPSAnalyzer]** *`FPSAnalyzr`* - An externally declared FPSAnalyzer (if not
provided, a new one is made with default everything).

* **[adjustFramerate]** *`Boolean`* - Whether scheduling timeouts should adjust
to elapsed upkeep time (by default, false).

* **[onPause]** *`Function`* - An optional callback to run when upkeep is 
paused.

* **[onPlay]** *`Function`* - An optional callback to run when upkeep is played.

* **[scope]** *`Mixed`* - A scope for games to be run on (defaults to the 
window).


## Sample usage

1. Creating and using a GamesRunnr to print the screen size every second.

    ```javascript
    var GamesRunner = new GamesRunnr({
        "interval": 1000,
        "games": [
            function () {
                console.log("Screen size: " + innerWidth + "x" + innerHeight);
            }
        ]
    });
    GamesRunner.play();
    ```

2.  Creating and using a GamesRunnr to remove the first member of an Array and
output the remaining members every second until only one is left.

    ```javascript
    var numbers = ['a', 'b', 'c', 'd'],
        GamesRunner = new GamesRunnr({
            "interval": 1000,
            "games": [
                numbers.pop.bind(numbers),
                console.log.bind(console, numbers),
                function () {
                    if (numbers.length === 1) {
                        GamesRunner.pause();
                        console.log("All done!");
                    }
                }
            ]
            
        });
    GamesRunner.play();
    // After 1 second:  ['a', 'b', 'c']
    // After 2 seconds: ['a', 'b']
    // After 3 seconds: ['a']
    //                  "All done!"
    ```