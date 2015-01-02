# QuadsKeepr.js

Quadrant-based collision detection. A grid structure of quadrants is kept 
with Things placed within Quadrants they intersect. Each Quadrant knows which
Things are in it, and each Thing knows its quadrants. Operations are 
available to shift quadrants horizontally or vertically and add/remove rows
and columns.


## Basic Architecture

#### Important APIs

* **resetQuadrants()** - Completely resets all Quadrants. The grid structure of 
rows and columns is remade according to startLeft and startTop, and newly 
created Quadrants pushed into it. 

* **shiftQuadrants(***`dx`, `dy`***)** - Shifts each Quadrant horizontally and
vertically, along with the row and column containers. Offsets are adjusted to
check for row or column deletion and insertion.

#### Important Member Variables

* **ObjectMaker** *`ObjectMakr`* - An ObjectMakr factory used to create Quadrant
objects.

* **quadrantRows** *`QuadrantRow[]`* - A QuadrantRow[] that holds each 
QuadrantRow in order (each of which holds a Quadrant[]).

* **quadrantCols** *`QuadrantCol[]`* - A QuadrantCol[] that holds each 
QuadrantCol in order (each of which holds a Quadrant[]).

#### Constructor Arguments

* **ObjectMaker** *`ObjectMakr`*

* **numRows** *`Number`* - How many rows of Quadrants there should be initially.

* **numCols** *`Number`* - How many columns of Quadrants there should be 
initially.

* **quadrantWidth** *`Number`* - How wide each Quadrant should be.

* **quadrantHeight** *`Number`* - How high each Quadrants hould be.

* **createCanvas** *`Function`* - A function to create HTML5 canvas elements
for the Quadrants.

* **groupNames** *`String[]`* - The names of groups Things may be in.

* **[onAdd]** *`Function`* - A callback for when Quadrants are added, called on
called on the newly contained area.

* **[onRemove]** *`Function`* - A callback for when Quadrants are removed, 
called on the formerly contained area.

* **[startLeft]** *`Number`* - A Number to use as the initial horizontal edge
(rounded; by default. 0).

* **[startTop]** *`Number`* - A Number to use as the initial vertical edge
(rounded; by default, 0).

* **[thingTop]** *`String`* - The key under which Things store their top
(by default, "top").

* **[thingRight]** *`String`* - The key under which Things store their 
right (by default, "right").

* **[thingBottom]** *`String`* - The key under which Things store their
bottom (by default, "bottom").

* **[thingLeft]** *`String`* - The key under which Things store their left
(by default, "left").

* **[thingNumQuads]** *`String`* - The key under which Things store their
number of quadrants (by default, "numquads").

* **[thingChanged]** *`String`* -  The key under which Things store whether
they've changed visually (by default, "changed").

* **[thingToleranceX]** *`String`* - The key under which Things store 
horizontal tolerance (by default, "tolx").

* **[thingToleranceY]** *`String`* - The key under which Things store 
vertical tolerance (by default, "toly").

* **[thingGroupName]** *`String`* - The key under which Things store which
group they fall under (by default, "group").


## Sample Usage

1. Creating and using a QuadsKeepr to store a Thing's location.

    ```javascript
    var QuadsKeeper = new QuadsKeepr({
            "ObjectMaker": new ObjectMakr({
                "inheritance": {
                    "Quadrant": {}
                }
            }),
            "createCanvas": function (width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                return canvas;
            },
            "numRows": 7,
            "numCols": 3,
            "quadrantWidth": 200,
            "quadrantHeight": 100,
            "groupNames": ["Thing"]
        }),
        thing = {
            "top": 210,
            "right": 490,
            "bottom": 350,
            "left": 280,
            "width": 210,
            "height": 140,
            "group": "Thing",
            "quadrants": [],
            "tolx": 0,
            "toly": 0
        };

    QuadsKeeper.resetQuadrants();
    QuadsKeeper.determineThingQuadrants(thing);

    // 4
    console.log(thing.numquads);

    // [Quadrant, Quadrant, Quadrant, Quadrant]
    console.log(thing.quadrants);

    // [200, 200]
    console.log([thing.quadrants[0].left, thing.quadrants[0].top]);
    ```
    
2. Creating and using a QuadsKeepr to add and remove rows and columns.
    
    ```javascript
    var QuadsKeeper = new QuadsKeepr({
            "ObjectMaker": new ObjectMakr({
                "inheritance": {
                    "Quadrant": {}
                }
            }),
            "createCanvas": function (width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                return canvas;
            },
            "numRows": 7,
            "numCols": 3,
            "quadrantWidth": 200,
            "quadrantHeight": 100,
            "groupNames": ["Thing"],
            "onAdd": console.log.bind(console, "Adding:"),
            "onRemove": console.log.bind(console, "Removing:")
        }),
        thing = {
            "top": 210,
            "right": 490,
            "bottom": 350,
            "left": 280,
            "width": 210,
            "height": 140,
            "group": "Thing",
            "quadrants": [],
            "tolx": 0,
            "toly": 0
        };

    // Adding: xInc 0 600 700 0
    QuadsKeeper.resetQuadrants();

    // Removing: yInc 0 600 100 0
    QuadsKeeper.shiftQuadrantRow(true);

    // Adding: yInc 800 600 700 0
    QuadsKeeper.pushQuadrantRow(true);

    // Removing: xInc 100 200 800 0
    QuadsKeeper.shiftQuadrantCol(true);

    // Adding: xInc 100 800 800 600
    QuadsKeeper.pushQuadrantCol(true);
    ```