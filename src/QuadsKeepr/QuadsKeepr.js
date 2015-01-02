/**
 * QuadsKeepr.js
 * 
 * Quadrant-based collision detection. A grid structure of quadrants is kept 
 * with Things placed within quadrants they intersect. Each Quadrant knows which
 * Things are in it, and each Thing knows its quadrants. Operations are 
 * available to shift quadrants horizontally or vertically and add/remove rows
 * and columns.
 * 
 * @example
 * // Creating and using a QuadsKeepr to store a Thing's location.
 * var QuadsKeeper = new QuadsKeepr({
 *         "ObjectMaker": new ObjectMakr({
 *             "inheritance": {
 *                 "Quadrant": {}
 *             }
 *         }),
 *         "createCanvas": function (width, height) {
 *             var canvas = document.createElement("canvas");
 *             canvas.width = width;
 *             canvas.height = height;
 *             return canvas;
 *         },
 *         "numRows": 7,
 *         "numCols": 3,
 *         "quadrantWidth": 200,
 *         "quadrantHeight": 100,
 *         "groupNames": ["Thing"]
 *     }),
 *     thing = {
 *         "top": 210,
 *         "right": 490,
 *         "bottom": 350,
 *         "left": 280,
 *         "width": 210,
 *         "height": 140,
 *         "group": "Thing",
 *         "quadrants": [],
 *         "tolx": 0,
 *         "toly": 0
 *     };
 * 
 * QuadsKeeper.resetQuadrants();
 * QuadsKeeper.determineThingQuadrants(thing);
 * 
 * // 4
 * console.log(thing.numquads);
 * 
 * // [Quadrant, Quadrant, Quadrant, Quadrant]
 * console.log(thing.quadrants);
 * 
 * // [200, 200]
 * console.log([thing.quadrants[0].left, thing.quadrants[0].top]);
 * 
 * @example
 * // Creating and using a QuadsKeepr to add and remove rows.
 * var QuadsKeeper = new QuadsKeepr({
 *         "ObjectMaker": new ObjectMakr({
 *             "inheritance": {
 *                 "Quadrant": {}
 *             }
 *         }),
 *         "createCanvas": function (width, height) {
 *             var canvas = document.createElement("canvas");
 *             canvas.width = width;
 *             canvas.height = height;
 *             return canvas;
 *         },
 *         "numRows": 7,
 *         "numCols": 3,
 *         "quadrantWidth": 200,
 *         "quadrantHeight": 100,
 *         "groupNames": ["Thing"],
 *         "onAdd": console.log.bind(console, "Adding:"),
 *         "onRemove": console.log.bind(console, "Removing:")
 *     }),
 *     thing = {
 *         "top": 210,
 *         "right": 490,
 *         "bottom": 350,
 *         "left": 280,
 *         "width": 210,
 *         "height": 140,
 *         "group": "Thing",
 *         "quadrants": [],
 *         "tolx": 0,
 *         "toly": 0
 *     };
 * 
 * // Adding: xInc 0 600 700 0
 * QuadsKeeper.resetQuadrants();
 * 
 * // Removing: yInc 0 600 100 0
 * QuadsKeeper.shiftQuadrantRow(true);
 * 
 * // Adding: yInc 800 600 700 0
 * QuadsKeeper.pushQuadrantRow(true);
 * 
 * // Removing: xInc 100 200 800 0
 * QuadsKeeper.shiftQuadrantCol(true);
 *  
 * // Adding: xInc 100 800 800 600
 * QuadsKeeper.pushQuadrantCol(true);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function QuadsKeepr(settings) {
    "use strict";
    if (!this || this === window) {
        return new QuadsKeepr(settings);
    }
    var self = this,
        
        // The ObjectMakr factory used to create Quadrant objects.
        ObjectMaker,
        
        // Function used to create a canvas of a given width and height.
        createCanvas,
        
        // How many rows and columns of Quadrants there should be initially.
        numRows,
        numCols,
        
        // Scrolling offsets during gameplay (initially 0).
        offsetX,
        offsetY,
        
        // Starting coordinates for rows & columns.
        startLeft,
        startTop,
        
        // A QuadrantRow[] that holds each QuadrantRow in order.
        quadrantRows,
        
        // A QuadrantCol[] that holds each QuadrantCol in order.
        quadrantCols,
        
        // How wide Quadrants should be.
        quadrantWidth,
        
        // How tall Quadrants should be.
        quadrantHeight,

        // Names under which external Things should store Quadrant information
        thingTop,
        thingRight,
        thingBottom,
        thingLeft,
        thingNumQuads,
        thingQuadrants,
        thingChanged,
        thingToleranceX,
        thingToleranceY,
        thingGroupName,
        
        // An Array of string names a Thing may be placed into 
        groupNames,

        // Callback for when Quadrants are added or removed, respectively
        onAdd,
        onRemove;

    /**
     * Resets the QuadsKeepr.
     * 
     * @param {ObjectMakr} ObjectMaker   An ObjectMakr used to create Quadrants.
     * @param {Function} createCanvas   A Function that creates HTML5 canvas
     *                                  elements of given sizes.    
     * @param {Number} numRows   How many QuadrantRows to keep at a time.
     * @param {Number} numCols   How many QuadrantCols to keep at a time.
     * @param {Number} quadrantWidth   How wide each Quadrant should be.
     * @param {Number} quadrantHeight   How high each Quadrant should be.
     * @param {String[]} groupNames   The names of groups Things may be in.
     * @param {Function} [onAdd]   A callback for when Quadrants are added,
     *                             called on the newly contained area.
     * @param {Function} [onRemove]   A callback for when Quadrants are removed,
     *                             called on the formerly contained area.
     * @param {Number} [startLeft]   A Number to use as the initial horizontal
     *                               edge (rounded; by default, 0).
     * @param {Number} [startTop]   A Number to use as the initial vertical
     *                               edge (rounded; by default, 0).
     * @param {String} [thingTop]   The key under which Things store their top
     *                               (by default, "top").
     * @param {String} [thingRight]   The key under which Things store their 
     *                                right (by default, "right").
     * @param {String} [thingBottom]   The key under which Things store their
     *                                 bottom (by default, "bottom").
     * @param {String} [thingLeft]   The key under which Things store their left
     *                               (by default, "left").
     * @param {String} [thingNumQuads]   The key under which Things store their
     *                                   number of quadrants (by default, 
     *                                   "numquads").
     * @param {String} [thingChanged]   The key under which Things store whether
     *                                  they've changed visually (by default,
     *                                  "changed").
     * @param {String} [thingToleranceX]   The key under which Things store 
     *                                     horizontal tolerance (by default,
     *                                     "tolx").
     * @param {String} [thingToleranceY]   The key under which Things store 
     *                                     vertical tolerance (by default,
     *                                     "toly").
     * @param {String} [thingGroupName]   The key under which Things store which
     *                                    group they fall under (by default,
     *                                    "group").
     */
    self.reset = function (settings) {
        ObjectMaker = settings.ObjectMaker;
        if (!ObjectMaker) {
            throw new Error("No ObjectMakr given to QuadsKeepr.");
        }
        
        createCanvas = settings.createCanvas;
        if (!createCanvas) {
            throw new Error("No createCanvas given to QuadsKeepr.");
        }
        
        numRows = settings.numRows;
        if (!numRows) {
            throw new Error("No numRows given to QuadsKeepr.");
        }
        
        numCols = settings.numCols;
        if (!numCols) {
            throw new Error("No numCols given to QuadsKeepr.");
        }
        
        quadrantWidth = settings.quadrantWidth | 0;
        if (!quadrantWidth) {
            throw new Error("No quadrantWidth given to QuadsKeepr.");
        }
        
        quadrantHeight = settings.quadrantHeight | 0;
        if (!quadrantHeight) {
            throw new Error("No quadrantHeight given to QuadsKeepr.");
        }
        
        groupNames = settings.groupNames;
        if (!groupNames) {
            throw new Error("No groupNames given to QuadsKeepr.");
        }

        onAdd = settings.onAdd;
        onRemove = settings.onRemove;
        
        startLeft = settings.startLeft | 0;
        startTop = settings.startTop | 0;
        
        thingTop = settings.thingTop || "top";
        thingLeft = settings.thingLeft || "left";
        thingBottom = settings.thingBottom || "bottom";
        thingRight = settings.thingRight || "right";
        thingNumQuads = settings.thingNumQuads || "numquads";
        thingQuadrants = settings.thingQuadrants || "quadrants";
        thingChanged = settings.thingChanged || "changed";
        thingToleranceX = settings.thingToleranceX || "tolx";
        thingToleranceY = settings.thingToleranceY || "toly";
        thingGroupName = settings.thingGroupName || "group";
    };
    
    
    /* Simple gets
    */
    
    /**
     * @return {Object} The listing of Quadrants grouped by row.
     */
    self.getQuadrantRows = function () {
        return quadrantRows;
    };
    
    /**
     * @return {Object} The listing of Quadrants grouped by column.
     */
    self.getQuadrantCols = function () {
        return quadrantCols;
    };
    
    /**
     * @return {Number} How many Quadrant rows there are.
     */
    self.getNumRows = function () {
        return numRows;
    };
    
    /**
     * @return {Number} How many Quadrant columns there are.
     */
    self.getNumCols = function () {
        return numCols;
    };
    
    /**
     * @return {Number} How wide each Quadrant is.
     */
    self.getQuadrantWidth = function () {
        return quadrantWidth;
    };
    
    /**
     * @return {Number} How high each Quadrant is.
     */
    self.getQuadrantHeight = function () {
        return quadrantHeight;
    };
    
    
    /* Quadrant updates
    */
    
    /**
     * Shifts each Quadrant horizontally and vertically, along with the row and
     * column containers. Offsets are adjusted to check for row or column 
     * deletion and insertion.
     * 
     * @param {Number} dx
     * @param {Number} dy
     */
    self.shiftQuadrants = function (dx, dy) {
        var row, col;
        
        dx = dx | 0;
        dy = dy | 0;
        
        offsetX += dx;
        offsetY += dy;
        
        self.top += dy;
        self.right += dx;
        self.bottom += dy;
        self.left += dx;
        
        for (row = 0; row < numRows; row += 1) {
            quadrantRows[row].left += dx;
            quadrantRows[row].top += dy;
        }
        
        for (col = 0; col< numCols; col += 1) {
            quadrantCols[col].left += dx;
            quadrantCols[col].top += dy;
        }
        
        for (row = 0; row < numRows; row += 1) {
            for (col = 0; col < numCols; col += 1) {
                shiftQuadrant(quadrantRows[row].quadrants[col], dx, dy);
            }
        }
        
        adjustOffsets();
    }
    
    /** 
     * Adjusts the offset measurements by checking if rows or columns have gone
     * over the limit, which requires rows or columns be removed and new ones
     * added.
     */
    function adjustOffsets() {
        // Quadrant shift: add to the right
        while(-offsetX > quadrantWidth) {
            self.shiftQuadrantCol(true);
            self.pushQuadrantCol(true);
            offsetX += quadrantWidth;
        }
        
        // Quadrant shift: add to the left
        while(offsetX > quadrantWidth) {
            self.popQuadrantCol(true);
            self.unshiftQuadrantCol(true);
            offsetX -= quadrantWidth;
        }
        
        // Quadrant shift: add to the bottom
        while(-offsetY > quadrantHeight) {
            self.unshiftQuadrantRow(true);
            self.pushQuadrantRow(true);
            offsetY += quadrantHeight;
        }
        
        // Quadrant shift: add to the top
        while(offsetY > quadrantHeight) {
            self.popQuadrantRow(true);
            self.unshiftQuadrantRow(true);
            offsetY -= quadrantHeight;
        }
    };
    
    /**
     * Shifts a Quadrant horizontally and vertically.
     * 
     * @param {Number} dx
     * @param {Number} dy
     */
    function shiftQuadrant(quadrant, dx, dy) {
        quadrant.top += dy;
        quadrant.right += dx;
        quadrant.bottom += dy;
        quadrant.left += dx;
        quadrant.changed = true;
    }
    
    
    /* Quadrant placements
    */
    
    /**
     * Completely resets all Quadrants. The grid structure of rows and columns
     * is remade according to startLeft and startTop, and newly created 
     * Quadrants pushed into it. 
     */
    self.resetQuadrants = function () {
        var left = startLeft,
            top = startTop,
            quadrant,
            i, j;
        
        self.top = startTop;
        self.right = startLeft + quadrantWidth * numCols;
        self.bottom = startTop + quadrantHeight * numRows;
        self.left = startLeft;
        
        quadrantRows = [];
        quadrantCols = [];
        
        offsetX = 0;
        offsetY = 0;
        
        for (i = 0; i < numRows; i += 1) {
            quadrantRows.push(new QuadrantRow(startLeft, top));
            top += quadrantHeight;
        }
        
        for (j = 0; j < numCols; j += 1) {
            quadrantCols.push(new QuadrantCol(left, startTop));
            left += quadrantWidth;
        }
        
        top = startTop;
        for (i = 0; i < numRows; i += 1) {
            left = startLeft;
            for (j = 0; j < numCols; j += 1) {
                quadrant = createQuadrant(left, top);
                quadrantRows[i].quadrants.push(quadrant);
                quadrantCols[j].quadrants.push(quadrant);
                left += quadrantWidth;
            }
            top += quadrantHeight;
        }
        
        if (onAdd) {
            onAdd("xInc", self.top, self.right, self.bottom, self.left);
        }
    };
    
    /**
     * Creates a new Quadrant using the internal ObjectMaker. The Quadrant's
     * sizing and position are set, along with a canvas element for rendering.
     * 
     * @param {Number} left   The horizontal displacement of the Quadrant.
     * @param {Number} top   The vertical displacement of the Quadrant.
     * @return {Quadrant}
     */
    function createQuadrant(left, top) {
        var quadrant = ObjectMaker.make("Quadrant"),
            canvas = createCanvas(quadrantWidth, quadrantHeight),
            i;
        
        quadrant.changed = true;
        quadrant.things = {};
        quadrant.numthings = {};
        
        for (i = 0; i < groupNames.length; i += 1) {
            quadrant.things[groupNames[i]] = [];
            quadrant.numthings[groupNames[i]] = 0;
        }
        
        quadrant.left = left;
        quadrant.top = top;
        quadrant.right = left + quadrantWidth;
        quadrant.bottom = top + quadrantHeight;
        
        quadrant.canvas = canvas;
        quadrant.context = canvas.getContext("2d");
        
        return quadrant;
    }
    
    /**
     * Storage container for a row of Quadrants. It keeps an x/y coordinate and
     * a Quadrant[].
     * 
     * @constructor
     * @this {QuadrantRow}
     * @param {Number} left
     * @param {Number} top
     */
    function QuadrantRow(left, top) {
        this.left = left || 0;
        this.top = top || 0;
        this.quadrants = [];
    }
    
    /**
     * Storage container for a column of Quadrants. It keeps an x/y coordinate 
     * and a Quadrant[].
     * 
     * @constructor
     * @this {QuadrantCol}
     * @param {Number} left
     * @param {Number} top
     */
    function QuadrantCol(left, top) {
        this.left = left || 0;
        this.top = top || 0;
        this.quadrants = [];
    }
    
    /**
     * Creates a QuadrantRow, with length determined by numCols.
     * 
     * @param {Number} left   The initial horizontal displacement of the col.
     * @param {Number} top   The vertical displacement of the col.
     * @return {QuadrantRow[]}
     */
    function createQuadrantRow(left, top) {
        var row = new QuadrantRow(left, top),
            i;
        
        for (i = 0; i < numCols; i += 1) {
            row.quadrants.push(createQuadrant(left, top));
            left += quadrantWidth;
        }
        
        return row;
    };
    
    /**
     * Creates a QuadrantCol, with length determined by numRow.
     * 
     * @param {Number} left   The horizontal displacement of the col.
     * @param {Number} top   The initial vertical displacement of the col.
     * @return {QuadrantRow[]}
     */
    function createQuadrantCol(left, top) {
        var col = new QuadrantCol(left, top),
            i;
        
        for (i = 0; i < numRows; i += 1) {
            col.quadrants.push(createQuadrant(left, top));
            top += quadrantHeight;
        }
        
        return col;
    };
    
    /**
     * Adds a QuadrantRow to the end of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.pushQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.bottom),
            i;
        
        numRows += 1;
        quadrantRows.push(row);
        
        for (i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.push(row.quadrants[i]);
        }
        
        self.bottom += quadrantHeight;
        
        if (callUpdate && onAdd) {
            onAdd(
                "yInc",
                self.bottom, 
                self.right, 
                self.bottom - quadrantHeight, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a QuadrantCol to the end of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new col's bounding box.
     */
    self.pushQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.right, self.top),
            i;
        
        numCols += 1;
        quadrantCols.push(col);
    
        for (i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.push(col.quadrants[i]);
        }
        
        self.right += quadrantWidth;
        
        if (callUpdate && onAdd) {
            onAdd(
                "xInc", 
                self.top,
                self.right - offsetY, 
                self.bottom, 
                self.right - quadrantWidth - offsetY
            );
        }
        
        return col;
    };
    
    /**
     * Removes the last QuadrantRow from the end of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantRow = function (callUpdate) {
        for (var i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.pop();
        }
        
        numRows -= 1;
        quadrantRows.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "yInc",
                self.bottom, 
                self.right, 
                self.bottom - quadrantHeight, 
                self.left
            );
        }
        
        self.bottom -= quadrantHeight;
    };
    
    /**
     * Removes the last QuadrantCol from the end of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantCol = function (callUpdate) {
        for (var i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.pop();
        }
        
        numCols -= 1;
        quadrantCols.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "xDec", 
                self.top,
                self.right - offsetY, 
                self.bottom, 
                self.right - quadrantWidth - offsetY
            );
        }
        
        self.right -= quadrantWidth;
    };
    
    /**
     * Adds a QuadrantRow to the beginning of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.top - quadrantHeight),
            i;
        
        numRows += 1;
        quadrantRows.unshift(row);
        
        for (i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.unshift(row.quadrants[i]);
        }
        
        self.top -= quadrantHeight;
        
        if (callUpdate && onAdd) {
            onAdd(
                "yInc",
                self.top,
                self.right, 
                self.top + quadrantHeight, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a QuadrantCol to the beginning of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.left - quadrantWidth, self.top),
            i;
        
        numCols += 1;
        quadrantCols.unshift(col);
        
        for (i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.unshift(col.quadrants[i]);
        }
        
        self.left -= quadrantWidth;
        
        if (callUpdate && onAdd) {
            onAdd(
                "xInc",
                self.top,
                self.left,
                self.bottom, 
                self.left + quadrantWidth
            );
        }
        
        return col;
    };
    
    /**
     * Removes a QuadrantRow from the beginning of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantRow = function (callUpdate) {
        for (var i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.shift();
        }
        
        numRows -= 1;
        quadrantRows.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "yInc",
                self.top,
                self.right, 
                self.top + quadrantHeight, 
                self.left
            );
        }
        
        self.top += quadrantHeight;
    };
    
    /**
     * Removes a QuadrantCol from the beginning of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantCol = function (callUpdate) {
        for (var i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.shift();
        }
        
        numCols -= 1;
        quadrantCols.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "xInc",
                self.top,
                self.left + quadrantWidth,
                self.bottom,
                self.left
            );
        }
        
        self.left += quadrantWidth;
    };
    
    
    /* Thing manipulations
    */
    
    /**
     * Determines the Quadrants for an entire Array of Things. This is done by
     * wiping each quadrant's memory of that Array's group type and determining
     * each Thing's quadrants.
     * 
     * @param {String} groupName
     * @param {Thing[]} things
     */
    self.determineAllQuadrants = function (group, things) {
        var row, col, k;
        
        for (row = 0; row < numRows; row += 1) {
            for (col = 0; col < numCols; col += 1) {
                quadrantRows[row].quadrants[col].numthings[group] = 0;
            }
        }
        
        things.forEach(self.determineThingQuadrants);
    };
    
    /**
     * Determines the Quadrants for a single Thing. The starting row and column
     * indices are calculated so every Quadrant within them should contain the
     * Thing. In the process, its old Quadrants and new Quadrants are marked as 
     * changed if it was.
     * 
     * @param {Thing} thing
     */
    self.determineThingQuadrants = function (thing) {
        var group = thing[thingGroupName],
            rowStart = findQuadrantRowStart(thing),
            colStart = findQuadrantColStart(thing),
            rowEnd = findQuadrantRowEnd(thing),
            colEnd = findQuadrantColEnd(thing),
            row, col;
        
        // Mark each of the Thing's Quadrants as changed
        // This is done first because the old Quadrants are changed
        if (thing[thingChanged]) {
            markThingQuadrantsChanged(thing);
        }
        
        // The Thing no longer has any Quadrants: rebuild them!
        thing[thingNumQuads] = 0;
        
        for (row = rowStart; row <= rowEnd; row += 1) {
            for (col = colStart; col <= colEnd; col += 1) {
                self.setThingInQuadrant(
                    thing, quadrantRows[row].quadrants[col], group
                );
            }
        }
        
        // The thing is no longer considered changed, since quadrants know it
        thing[thingChanged] = false;
    };
    
    /**
     * Sets a Thing to be inside a Quadrant. The two are marked so they can
     * recognize each other's existence later.
     * 
     * @param {Thing} thing
     * @param {Quadrant} quadrant
     * @param {String} group   The grouping under which the Quadrant should
     * store the Thing.
     */
    self.setThingInQuadrant = function (thing, quadrant, group) {
        // Mark the Quadrant in the Thing
        thing[thingQuadrants][thing[thingNumQuads]] = quadrant;
        thing[thingNumQuads] += 1;
        
        // Mark the Thing in the Quadrant
        quadrant.things[group][quadrant.numthings[group]] = thing;
        quadrant.numthings[group] += 1;
        
        // If necessary, mark the Quadrant as changed
        if (thing[thingChanged]) {
            quadrant.changed = true;
        }
    }
    
    /** 
     * Marks all Quadrants a Thing is contained within as changed.
     */
    function markThingQuadrantsChanged(thing) {
        for (var i = 0; i < thing[thingNumQuads]; i += 1) {
            thing[thingQuadrants][i].changed = true;
        }
    }
    
    /**
     * @param {Thing} thing
     * @param {Number} The index of the first row the Thing is inside.
     */
    function findQuadrantRowStart(thing) {
        return Math.max(Math.floor((thing.top - self.top) / quadrantHeight), 0);
    }
    
    /**
     * @param {Thing} thing
     * @param {Number} The index of the last row the Thing is inside.
     */
    function findQuadrantRowEnd(thing) {
        return Math.min(
            Math.floor((thing.bottom - self.top) / quadrantHeight), numRows - 1
        );
    }
    
    /**
     * @param {Thing} thing
     * @param {Number} The index of the first column the Thing is inside.
     */
    function findQuadrantColStart(thing) {
        return Math.max(
            Math.floor((thing.left - self.left) / quadrantWidth), 0
        );
    }
    
    /**
     * @param {Thing} thing
     * @param {Number} The index of the last column the Thing is inside.
     */
    function findQuadrantColEnd(thing) {
        return Math.min(
            Math.floor((thing.right - self.left) / quadrantWidth), numCols - 1
        );
    }
    
    
    self.reset(settings || {});
}