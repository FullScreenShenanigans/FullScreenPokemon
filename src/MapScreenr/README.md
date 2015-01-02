# MapScreenr.js

A simple container for Map attributes given by switching to an Area within 
that map. A bounding box of the current viewport is kept, along with any 
other information desired.

MapScreenr is the closest thing GameStartr projects have to a "global"
variable depository, where miscellaneous variables may be stored.


## Basic Architecture

#### Important APIs

* **clearScreen()** - Completely clears the MapScreenr for use in a new Area.
Positioning is reset to (0,0) and user-configured variables are recalculated.

* **resetVariables()** - Manually the user-configured variables.

* **shift(***`dx`, `dy`***)** - Shifts the MapScreenr horizontally and
vertically.

#### Important Member Variables

* **variables** *`Object<Function>`* - A listing of variable functions to be 
calculated on screen resets.

* **variableArgs** *`Array`* - Arguments top be passed into variable functions.

#### Constructor Arguments

* **width** *`Number`* - How wide the MapScreenr should be.

* **height** *`Number`* - How high the MapScreenr should be.

* **[variables]** *`Object<Function>`*

* **[variableArgs]** *`Array`*


## Sample Usage

1. Creating and using a MapScreenr to emulate a simple screen.

    ```javascript
    var MapScreener = new MapScreenr({
        "width": 640,
        "height": 480
    });
    MapScreener.clearScreen();

    // [0, 640, 480, 0]
    console.log([
        MapScreener.top, MapScreener.right, MapScreener.bottom, MapScreener.left
    ]);
    ```

2. Creating and using a MapScreenr to store screen information.

    ```javascript
    var MapScreener = new MapScreenr({
        "width": 640,
        "height": 480,
        "variables": {
            "pixels": function () {
                return this.width * this.height;
            },
            "resolution": function () {
                return this.width / this.height;
            }
        }
    });
    MapScreener.clearScreen();

    // 307200 pixels at 1.3333333333333333
    console.log(MapScreener.pixels + " pixels at " + MapScreener.resolution);
    ```