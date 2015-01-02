# PixelDrawr

A front-end to PixelRendr to automate drawing mass amounts of sprites to a
primary canvas. A PixelRendr keeps track of sprite sources, while a
MapScreenr maintains boundary information on the screen. Global screen 
refills may be done by drawing every Thing in the thingArrays, or by 
Quadrants as a form of dirty rectangles.

Examples are not available for MapsHandlr, as the required code would be very
substantial. Instead see GameStartr.js and its rendering code.


## Basic Architecture

#### Important APIs

* **setThingSprite(***`thing`***)** - Goes through all the motions of finding
and parsing a Thing's sprite.

* **refillGlobalCanvas()** - Refills the entire main canvas. All Thing arrays
are made to call refillThingArray in order.

* **refillThingArray(***`array`***)** - Draws every Thing in the array on the
main context.

* **refillQuadrantGroups(***`groups`***) - Refills the main canvas by calling
refillQuadrants on each Quadrant in the groups.

* **refillQuadrant(***`quadrant`***) - Refills a Quadrant's canvas by resetting
its background and drawing all its Things onto it.

* **drawThingOnContext(***`context`, `thing`***) - General function to draw a
Thing onto a context.

* **drawThingOnQuadrant(***`thing`, `quadrant`***) - General function to draw a
Thing onto a Quadrant.

#### Important Member Variables

* **PixelRender** *`PixelRendr`* - A PixelRender used to obtain raw sprite data
and canvases.

* **MapScreener** *`MapScreenr`* - A MapScreenr to be used for bounds checking.

* **canvas** *`HTMLCanvasElement`* - The canvas element each Thing is to be 
drawn on.

#### Constructor Arguments

* **PixelRender** *`PixelRendr`*

* **MapScreener** *`MapScreenr`*

* **createCanvas** *`Function`* - A Function to create a canvas of a given size.

* **[unitsize]** *`Number`* - How much to scale canvases on creation (by 
default, 1 for not at all).

* **[noRefill]** *`Boolean`* - Whether refills should skip redrawing the 
background each time (by default, false).

* **[spriteCacheCutoff]** *`Number`* - The maximum size of a SpriteMultiple
SpriteMultiple to pre-render (by default, 0 for never pre-render).

* **[groupNames]** *`String[]`* - The names of groups to refill (only required
required if using Quadrant refilling).

* **[framerateSkip]** *`Number`* - How often to draw frames (by default, 1 for
every time).

* **[generateObjectKey]** *`Function`* - How to generate keys to retrieve
sprites from PixelRender (by default, Object.toString).