/**
 * PixelDrawr.js
 * 
 * A front-end to PixelRendr to automate drawing mass amounts of sprites to a
 * primary canvas. A PixelRendr keeps track of sprite sources, while a
 * MapScreenr maintains boundary information on the screen. Global screen 
 * refills may be done by drawing every Thing in the thingArrays, or by 
 * Quadrants as a form of dirty rectangles.
 * 
 * Examples are not available for MapsHandlr, as the required code would be very
 * substantial. Instead see GameStartr.js and its rendering code.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function PixelDrawr(settings) {
    "use strict";
    if (this === window) {
        return new PixelDrawr(settings);
    }
    var self = this,
        
        // A PixelRender used to obtain raw sprite data and canvases.
        PixelRender,
        
        // A MapScreenr variable to be used for checking.
        MapScreener,
        
        // The canvas element each Thing is to be drawn on.
        canvas,
        
        // The 2D canvas context associated with the canvas.
        context,
        
        // A separate canvas that keeps the background of the scene.
        backgroundCanvas,
        
        // The 2D canvas context associated with the background canvas.
        backgroundContext,
        
        // Arrays of Thing[]s that are to be drawn in each refill.
        thingArrays,
        
        // Utility Function to create a canvas.
        createCanvas,
        
        // How much to scale canvases on creation.
        unitsize,
        
        // A utility function to generate a class key to get an object sprite
        generateObjectKey,
        
        // The maximum size of a SpriteMultiple to pre-render.
        spriteCacheCutoff,
        
        // Whether refills should skip redrawing the background each time.
        noRefill,
        
        // For refillQuadrant, an Array of string names to refill (bottom-to-top)
        groupNames,
        
        // How often the screen redraws. 1 is always, 2 is every other call, etc.
        framerateSkip,
        
        // How many frames have been drawn so far
        framesDrawn;
    
    /**
     * Resets the PixelDrawr.
     * 
     * @constructor
     * @param {PixelRendr} PixelRender   The PixelRendr used for sprite lookups.
     * @param {MapScreenr} MapScreener   The mapScreener used for screen 
     *                                   boundary information.
     * @param {Function} createCanvas   A Function to create a canvas of a given
     *                                  size.
     * @param {Number} [unitsize]   How much to scale canvases on creation (by
     *                              default, 1 for not at all).
     * @param {Boolean} [noRefill]   Whether refills should skip redrawing the 
     *                               background each time (by default, false).
     * @param {Number} [spriteCacheCutoff]   The maximum size of a 
     *                                       SpriteMultiple to pre-render (by
     *                                       default, 0 for never pre-render).
     * @param {String[]} [groupNames]   The names of groups to refill (only
     *                                  required if using Quadrant refilling).
     * @param {Number} [framerateSkip]   How often to draw frames (by default,
     *                                   1 for every time).
     * @param {Function} [generateObjectKey]   How to generate keys to retrieve
     *                                         sprites from PixelRender (by 
     *                                         default, Object.toString).
     */
    self.reset = function (settings) {
        PixelRender = settings.PixelRender;
        MapScreener = settings.MapScreener;
        createCanvas = settings.createCanvas;
        unitsize = settings.unitsize || 1;
        noRefill = settings.noRefill;
        spriteCacheCutoff = settings.spriteCacheCutoff || 0;
        groupNames = settings.groupNames;
        framerateSkip = settings.framerateSkip || 1;
        framesDrawn = 0;

        generateObjectKey = settings.generateObjectKey || function (object) {
            return object.toString();
        };

        self.resetBackground();
    };

    
    /* Simple gets
    */

    /**
     * @return {Number} How often refill calls should be skipped.
     */
    self.getFramerateSkip = function () {
        return framerateSkip;
    };

    /**
     * @return {Array[]} The Arrays to be redrawn during refill calls.
     */
    self.getThingArrays = function () {
        return thingArrays;
    };

    /**
     * @return {HTMLCanvasElement} The canvas element each Thing is to drawn on.
     */
    self.getCanvas = function () {
        return canvas;
    };

    /**
     * The 2D canvas context associated with the canvas.
     */
    self.getContext = function () {
        return context;
    };


    /**
     * Whether refills should skip redrawing the background each time.
     */
    self.getNoRefill = function () {
        return noRefill;
    };
    
    

    /* Simple sets
    */
    
    /**
     * @param {Number} skip   How often refill calls should be skipped.
     */
    self.setFramerateSkip = function (skip) {
        framerateSkip = skip;
    };
    
    /**
     * @param {Array[]} arrays   The Arrays to be redrawn during refill calls.
     */
    self.setThingArrays = function (arrays) {
        thingArrays = arrays;
    };
    
    /**
     * Sets the currently drawn canvas and context, and recreates 
     * drawThingOnContextBound.
     * 
     * @param {HTMLCanvasElement} canvasNew
     */
    self.setCanvas = function (canvasNew) {
        canvas = canvasNew;
        context = canvas.getContext("2d");
        self.drawThingOnContextBound = self.drawThingOnContext.bind(self, context);
    };
    
    /**
     * @param {Boolean} enabled   Whether refills should now skip redrawing the 
     *                            background each time. 
     */
    self.setNoRefill = function (enabled) {
        noRefill = enabled;
    };
    
    
    /* Background manipulations
    */
    
    /**
     * Creates a new canvas the size of MapScreener and sets the background
     * canvas to it, then recreates backgroundContext.
     */
    self.resetBackground = function () {
        backgroundCanvas = createCanvas(MapScreener.width, MapScreener.height);
        backgroundContext = backgroundCanvas.getContext("2d");
    };
    
    /**
     * Refills the background canvas with a new fillStyle.
     * 
     * @param {Mixed} fillStyle   The new fillStyle for the background context.
     */
    self.setBackground = function (fillStyle) {
        backgroundContext.fillStyle = fillStyle;
        backgroundContext.fillRect(0, 0, MapScreener.width, MapScreener.height);
    };
    
    /**
     * Draws the background canvas onto the main canvas' context.
     */
    function drawBackground() {
        context.drawImage(backgroundCanvas, 0, 0);
    }
    
    
    /* Core rendering
    */
    
    /**
     * Goes through all the motions of finding and parsing a Thing's sprite.
     * This should be called whenever the sprite's appearance changes.
     * 
     * @param {Thing} thing   A Thing whose sprite must be updated.
     * @return {Self}
     */
    self.setThingSprite = function (thing) {
        // If it's set as hidden, don't bother updating it
        if (thing.hidden) {
            return;
        }
        
        // PixelRender does most of the work in fetching the rendered sprite
        thing.sprite = PixelRender.decode(generateObjectKey(thing), thing);
        
        // To do: remove dependency on .numSprites and spriteType
        if (thing.sprite.multiple) {
            thing.spriteType = thing.sprite.type;
            refillThingCanvasMultiple(thing, thing.sprite);
        }
        else {
            thing.numSprites = 1;
            thing.spriteType = "normal";
            refillThingCanvasSingle(thing, thing.sprite);
        }
        
        return self;
    }
    
    /**
     * Simply draws a thing's sprite to its canvas by getting and setting
     * a canvas::imageData object via context.getImageData(...).
     * 
     * @param {Thing} thing   A Thing whose canvas must be updated.
     */
    function refillThingCanvasSingle(thing) {
        if (thing.width < 1 || thing.height < 1) {
            return;
        }
        
        var canvas = thing.canvas,
            context = thing.context,
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        PixelRender.memcpyU8(thing.sprite, imageData.data);
        context.putImageData(imageData, 0, 0);
    }
    
    /**
     * For SpriteMultiples, this copies the sprite information for each 
     * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
     * rendered information onto the thing's canvas.
     * 
     * @param {Thing} thing   A Thing whose canvas and sprites must be updated.
     */
    function refillThingCanvasMultiple(thing) {
        if (thing.width < 1 || thing.height < 1) {
            return;
        }
        
        var spritesRaw = thing.sprite,
            canvases = thing.canvases = {
                "direction": spritesRaw.direction,
                "multiple": true 
            },
            canvas, context, imageData, i;

        thing.numSprites = 1;

        for (i in spritesRaw.sprites) {
            // Make a new sprite for this individual component
            canvas = createCanvas(thing.spritewidth * unitsize, thing.spriteheight * unitsize);
            context = canvas.getContext("2d");

            // Copy over this sprite's information the same way as refillThingCanvas
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            PixelRender.memcpyU8(spritesRaw.sprites[i], imageData.data);
            context.putImageData(imageData, 0, 0);

            // Record the canvas and context in thing.sprites
            canvases[i] = {
                "canvas": canvas,
                "context": context
            }
            thing.numSprites += 1;
        }
        
        if (thing.width * thing.height < spriteCacheCutoff) {
            thing.canvas.width = thing.width * unitsize;
            thing.canvas.height = thing.height * unitsize;
            drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
        } else {
            thing.canvas.width = thing.canvas.height = 0;
        }
    }
    
    
    /* Core drawing
    */
    
    /**
     * Called every upkeep to refill the entire main canvas. All Thing arrays
     * are made to call self.refillThingArray in order.
     */
    self.refillGlobalCanvas = function () {
        framesDrawn += 1;
        if (framesDrawn % framerateSkip !== 0) {
            return;
        }
        
        if (!noRefill) {
            drawBackground();
        }
        
        thingArrays.forEach(self.refillThingArray);
    };
    
    /**
     * Calls drawThingOnContext on each Thing in the Array.
     * 
     * @param {Thing[]} array   A listing of Things to be drawn onto the canvas.
     */
    self.refillThingArray = function (array) {
        array.forEach(self.drawThingOnContextBound);
    };
    
    /**
     * Refills the main canvas by calling refillQuadrants on each Quadrant in
     * the groups.
     * 
     * @param {QuadrantRow[]} groups   QuadrantRows (or QuadrantCols) to be
     *                                 redrawn to the canvas.
     */
    self.refillQuadrantGroups = function (groups) {
        var i;
        
        framesDrawn += 1;
        if (framesDrawn % framerateSkip !== 0) {
            return;
        }
        
        for (i = 0; i < groups.length; i += 1) {
            self.refillQuadrants(groups[i].quadrants);
        }
    };
    
    /**
     * Refills (part of) the main canvas by drawing each Quadrant's canvas onto 
     * it.
     * 
     * @param {Quadrant[]} quadrants   
     */
    self.refillQuadrants = function (quadrants) {
        var quadrant, i;
        
        for (i = 0; i < quadrants.length; i += 1) {
            quadrant = quadrants[i];
            if (
                quadrant.changed
                && quadrant.top < MapScreener.height
                && quadrant.right > 0
                && quadrant.bottom > 0
                && quadrant.left < MapScreener.width
            ) {
                self.refillQuadrant(quadrant);
                context.drawImage(
                    quadrant.canvas,
                    quadrant.left,
                    quadrant.top
                );
            }
        }
    };
    
    // var letters = '0123456789ABCDEF'.split('');
    // function getRandomColor() {
        // var color = '#';
        // for (var i = 0; i < 6; i++ ) {
            // color += letters[Math.floor(Math.random() * 16)];
        // }
        // return color;
    // }
    
    /**
     * Refills a Quadrants's canvas by resetting its background and drawing all
     * its Things onto it.
     * 
     * @param {Quadrant} quadrant   A quadrant whose Things must be drawn onto
     *                              its canvas.
     */
    self.refillQuadrant = function (quadrant) {
        var group, i, j;
        
        // quadrant.context.fillStyle = getRandomColor();
        // quadrant.context.fillRect(0, 0, quadrant.canvas.width, quadrant.canvas.height);
        
        // This may be what's causing such bad performance.
        if (!noRefill) {
            quadrant.context.drawImage(
                backgroundCanvas,
                quadrant.left,
                quadrant.top,
                quadrant.canvas.width,
                quadrant.canvas.height,
                0,
                0,
                quadrant.canvas.width,
                quadrant.canvas.height
            );
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            group = quadrant.things[groupNames[i]];
            
            for (j = 0; j < group.length; j += 1) {
                self.drawThingOnQuadrant(group[j], quadrant);
            }
        }
        
        quadrant.changed = false;
    };
    
    /**
     * General Function to draw a Thing onto a context. This will call
     * drawThingOnContext[Single/Multiple] with more arguments
     * 
     * @param {CanvasRenderingContext2D} context   The context to have the Thing
     *                                             drawn on it.
     * @param {Thing} thing   The Thing to be drawn onto the context.
     */
    self.drawThingOnContext = function (context, thing) {
        if (
            thing.hidden
            || thing.height < 1
            || thing.width < 1
            // || thing.top > MapScreener.height
            // || thing.right < 0
            // || thing.bottom < 0
            // || thing.left > MapScreener.width
        ) {
            return;
        }
        
        // If Thing hasn't had a sprite yet (previously hidden), do that first
        if (typeof thing.numSprites === "undefined") {
            self.setThingSprite(thing);
        }
        
        // Whether or not the thing has a regular sprite or a SpriteMultiple, 
        // that sprite has already been drawn to the thing's canvas, unless it's
        // above the cutoff, in which case that logic happens now.
        if (thing.canvas.width > 0) {
            drawThingOnContextSingle(context, thing.canvas, thing, thing.left, thing.top);
        } else {
            drawThingOnContextMultiple(context, thing.canvases, thing, thing.left, thing.top);
        }
    }
    
    /**
     * Draws a Thing onto a quadrant's canvas. This is a simple wrapper around
     * drawThingOnContextSingle/Multiple that also bounds checks.
     * 
     * @param {Thing} thing
     * @param {Quadrant} quadrant
     */
    self.drawThingOnQuadrant = function (thing, quadrant) {
        if (
            thing.hidden
            || thing.top > quadrant.bottom
            || thing.right < quadrant.left
            || thing.bottom < quadrant.top
            || thing.left > quadrant.right
        ) {
            return;
        }
        
        // If there's just one sprite, it's pretty simple
        if (thing.numSprites === 1) {
            return drawThingOnContextSingle(quadrant.context, thing.canvas, thing, thing.left - quadrant.left, thing.top - quadrant.top);
        }
        // For multiple sprites, some calculations will be needed
        else {
            return drawThingOnContextMultiple(quadrant.context, thing.canvases, thing, thing.left - quadrant.left, thing.top - quadrant.top);
        }
    };
    
    /**
     * Draws a Thing's single canvas onto a context, commonly called by
     * self.drawThingOnContext.
     * 
     * @param {CanvasRenderingContext2D} context    The context being drawn on.
     * @param {Canvas} canvas   The Thing's canvas being drawn onto the context.
     * @param {Thing} thing   The Thing whose canvas is being drawn.
     * @param {Number} left   The x-position to draw the Thing from.
     * @param {Number} top   The y-position to draw the Thing from.
     */
    function drawThingOnContextSingle(context, canvas, thing, left, top) {
        // If the sprite should repeat, use the pattern equivalent
        if (thing.repeat) {
            drawPatternOnCanvas(context, canvas, left, top, thing.unitwidth, thing.unitheight, thing.opacity || 1);
        }
        // Opacities not equal to one must reset the context afterwards
        else if (thing.opacity !== 1) {
            context.globalAlpha = thing.opacity;
            context.drawImage(canvas, left, top);
            context.globalAlpha = 1;
        } else {
            context.drawImage(canvas, left, top);
        }
    }
    
    /**
     * Draws a Thing's multiple canvases onto a context, typicall called by
     * drawThingOnContext. A variety of cases for canvases is allowed:
     * "vertical", "horizontal", and "corners".
     * 
     * @param {CanvasRenderingContext2D} context    The context being drawn on.
     * @param {Canvas} canvases   The canvases being drawn onto the context.
     * @param {Thing} thing   The Thing whose canvas is being drawn.
     * @param {Number} left   The x-position to draw the Thing from.
     * @param {Number} top   The y-position to draw the Thing from.
     */
    function drawThingOnContextMultiple(context, canvases, thing, left, top) {
        var sprite = thing.sprite,
            topreal = top,
            leftreal = left,
            rightreal = left + thing.unitwidth,
            bottomreal = top + thing.unitheight,
            widthreal = thing.unitwidth,
            heightreal = thing.unitheight,
            spritewidthpixels = thing.spritewidthpixels,
            spriteheightpixels = thing.spriteheightpixels,
            widthdrawn = Math.min(widthreal, spritewidthpixels),
            heightdrawn = Math.min(heightreal, spriteheightpixels),
            opacity = thing.opacity,
            diffhoriz, diffvert, canvasref;
        
        switch (canvases.direction) {
            // Vertical sprites may have 'top', 'bottom', 'middle'
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if ((canvasref = canvases.bottom)) {
                    diffvert = sprite.bottomheight ? sprite.bottomheight * unitsize : spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, bottomreal - diffvert, widthreal, heightdrawn, opacity);
                    bottomreal -= diffvert;
                    heightreal -= diffvert;
                }
                // If there's a top, draw that and push down topreal
                if ((canvasref = canvases.top)) {
                    diffvert = sprite.topheight ? sprite.topheight * unitsize : spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthreal, heightdrawn, opacity);
                    topreal += diffvert;
                    heightreal -= diffvert;
                }
            break;
            // Horizontal sprites may have 'left', 'right', 'middle'
            case "horizontal":
                // If there's a left, draw that and push forward leftreal
                if ((canvasref = canvases.left)) {
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * unitsize : spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthdrawn, heightreal, opacity);
                    leftreal += diffhoriz;
                    widthreal -= diffhoriz;
                }
                // If there's a right, draw that and push back rightreal
                if ((canvasref = canvases.right)) {
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * unitsize : spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal, opacity);
                    rightreal -= diffhoriz;
                    widthreal -= diffhoriz;
                }
            break;
            // Corner (vertical + horizontal + corner) sprites must have corners
            // in 'topRight', 'bottomRight', 'bottomLeft', and 'topLeft'.
            case "corners":
                // topLeft, left, bottomLeft
                diffvert = sprite.topheight ? sprite.topheight * unitsize : spriteheightpixels;
                diffhoriz = sprite.leftwidth ? sprite.leftwidth * unitsize : spritewidthpixels;
                drawPatternOnCanvas(context, canvases.topLeft.canvas, leftreal, topreal, widthdrawn, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.left.canvas, leftreal, topreal + diffvert, widthdrawn, heightreal - diffvert * 2, opacity);
                drawPatternOnCanvas(context, canvases.bottomLeft.canvas, leftreal, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                leftreal += diffhoriz;
                widthreal -= diffhoriz;
                
                // top, topRight
                diffhoriz = sprite.rightwidth ? sprite.rightwidth * unitsize : spritewidthpixels;
                drawPatternOnCanvas(context, canvases.top.canvas, leftreal, topreal, widthreal - diffhoriz, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.topRight.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightdrawn, opacity);
                topreal += diffvert;
                heightreal -= diffvert;
                
                // right, bottomLeft, bottom
                diffvert = sprite.bottomheight ? sprite.bottomheight * unitsize : spriteheightpixels;
                drawPatternOnCanvas(context, canvases.right.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal - diffvert, opacity);
                drawPatternOnCanvas(context, canvases.bottomRight.canvas, rightreal - diffhoriz, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.bottom.canvas, leftreal, bottomreal - diffvert, widthreal - diffhoriz, heightdrawn, opacity);
                rightreal -= diffhoriz;
                widthreal -= diffhoriz;
                bottomreal -= diffvert;
                heightreal -= diffvert;
            break;
        }
        
        // If there's still room, draw the actual canvas
        if ((canvasref = canvases.middle) && topreal < bottomreal && leftreal < rightreal) {
            if (sprite.middleStretch) {
                context.globalAlpha = opacity;
                context.drawImage(canvasref.canvas, leftreal, topreal, widthreal, heightreal);
                context.globalAlpha = 1;
            } else {
                drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthreal, heightreal, opacity);
            }
        }
    }
    
    
    /* Utilities
    */
    
    /**
     * Draws a source pattern onto a context. The pattern is clipped to the size
     * of MapScreener.
     * 
     * @param {CanvasRenderingContext2D} context   The context the pattern will
     *                                             be drawn onto.
     * @param {Mixed} source   The image being repeated as a pattern. This can
     *                         be a canvas, an image, or similar.
     * @param {Number} left   The x-location to draw from.
     * @param {Number} top   The y-location to draw from.
     * @param {Number} width   How many pixels wide the drawing area should be.
     * @param {Number} left   How many pixels high the drawing area should be.
     * @param {Number} opacity   How transparent the drawing is, in [0,1].
     * @todo Sprites should store patterns so createPattern isn't repeated.
     */
    function drawPatternOnCanvas(context, source, left, top, width, height, opacity) {
        context.globalAlpha = opacity;
        context.translate(left, top);
        context.fillStyle = context.createPattern(source, "repeat");
        context.fillRect(
            0, 0, 
            Math.min(width, MapScreener.right - left), 
            Math.min(height, MapScreener.bottom - top)
        );
        context.translate(-left, -top);
        context.globalAlpha = 1;
    }
    
    
    self.reset(settings || {});
}