/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/PixelRendr.d.ts" />
declare namespace PixelDrawr {
    /**
     * Boundaries of a drawing area, commonly fulfilled by an IMapScreenr.
     */
    interface IBoundingBox {
        /**
         * The top boundary of the screen.
         */
        top: number;
        /**
         * The right boundary of the screen.
         */
        right: number;
        /**
         * The bottom boundary of the screen.
         */
        bottom: number;
        /**
         * The left boundary of the screen.
         */
        left: number;
        /**
         * The width of the screen.
         */
        width: number;
        /**
         * The height of the screen.
         */
        height: number;
    }
    /**
     * For Things with multiple sprites, the various sprite component canvases.
     */
    interface IThingCanvases {
        /**
         * What direction to draw in, as "vertical", "horizontal", or "corners".
         */
        direction: string;
        /**
         * Whether this is a multiple sprite (always true).
         */
        multiple: boolean;
        /**
         * A middle canvas to draw, if applicable.
         */
        middle?: IThingSubCanvas;
        /**
         * A middle canvas to draw, if applicable.
         */
        top?: IThingSubCanvas;
        /**
         * A right canvas to draw, if applicable.
         */
        right?: IThingSubCanvas;
        /**
         * A bottom canvas to draw, if applicable.
         */
        bottom?: IThingSubCanvas;
        /**
         * A left canvas to draw, if applicable.
         */
        left?: IThingSubCanvas;
        /**
         * A top-right canvas to draw, if applicable.
         */
        topRight?: IThingSubCanvas;
        /**
         * A bottom-right canvas to draw, if applicable.
         */
        bottomRight?: IThingSubCanvas;
        /**
         * A bottom-left canvas to draw, if applicable.
         */
        bottomLeft?: IThingSubCanvas;
        /**
         * A top-left canvas to draw, if applicable.
         */
        topLeft?: IThingSubCanvas;
    }
    /**
     * A simple summary of canvas information.
     */
    interface IThingSubCanvas {
        /**
         * A source or destination.
         */
        canvas: HTMLCanvasElement;
        /**
         * The 2D context of the canvas.
         */
        context: CanvasRenderingContext2D;
    }
    /**
     * Collected information about a sprite that must be drawn.
     */
    interface IThing extends IBoundingBox {
        /**
         * The sprite for this Thing to have drawn.
         */
        sprite: Uint8ClampedArray | PixelRendr.ISpriteMultiple;
        /**
         * The canvas upon which the Thing's sprite is to be drawn.
         */
        canvas: HTMLCanvasElement;
        /**
         * For Things with multiple sprites, the various sprite component canvases.
         */
        canvases?: IThingCanvases;
        /**
         * The rendering context used to draw the Thing's sprite on its canvas.
         */
        context: CanvasRenderingContext2D;
        /**
         * Whether this shouldn't be drawn (is completely hidden).
         */
        hidden: boolean;
        /**
         * How transparent this is, in [0, 1].
         */
        opacity: number;
        /**
         * How many sprites this has (1 for regular, 0 or >1 for multiple).
         */
        numSprites?: number;
        /**
         * Horizontal visual offset.
         */
        offsetX?: number;
        /**
         * Vertical visual offset.
         */
        offsetY?: number;
        /**
         * Whether the Thing's sprite should repeat across large canvases.
         */
        repeat?: boolean;
        /**
         * How much to expand the Thing's sprite size (by default, 1 for not at all).
         */
        scale?: number;
        /**
         * Width in game pixels, equal to width * unitsize.
         */
        unitwidth?: number;
        /**
         * Height in game pixels, equal to height * unitsize.
         */
        unitheight?: number;
        /**
         * How many pixels wide the output sprite should be.
         */
        spritewidth: number;
        /**
         * How many pixels high the output sprite should be.
         */
        spriteheight: number;
        /**
         * Sprite width in real-life pixels, equal to spritewidth * scale.
         */
        spritewidthpixels?: number;
        /**
         * Sprite height in real-life pixels, equal to spritewidth * scale.
         */
        spriteheightpixels?: number;
    }
    /**
     * Settings to initialize a new IPixelDrawr.
     */
    interface IPixelDrawrSettings {
        /**
         * The PixelRendr used for sprite lookups and generation.
         */
        PixelRender: PixelRendr.IPixelRendr;
        /**
         * The bounds of the screen for bounds checking (typically an IMapScreenr).
         */
        boundingBox: IBoundingBox;
        /**
         * A Function to create a canvas of a given width and height.
         */
        createCanvas: (width: number, height: number) => HTMLCanvasElement;
        /**
         * How much to scale canvases on creation (by default, 1 for not at all).
         */
        unitsize?: number;
        /**
         * Whether refills should skip redrawing the background each time.
         */
        noRefill?: boolean;
        /**
         * The maximum size of a SpriteMultiple to pre-render (by default, 0 for
         * never pre-rendering).
         */
        spriteCacheCutoff?: number;
        /**
         * The names of groups to refill (only used if using Quadrant refilling).
         */
        groupNames?: string[];
        /**
         * How often to draw frames (by default, 1 for every time).
         */
        framerateSkip?: number;
        /**
         * How to generat ekeys to retrieve sprites from the PixelRendr (by default,
         * Object.toString).
         */
        generateObjectKey?: (thing: IThing) => string;
        /**
         * An arbitrarily small minimum opacity for a Thing to be considered not
         * completely transparent (by default, .007).
         */
        epsilon?: number;
        /**
         * The attribute name for a Thing's width (by default, "width").
         */
        keyWidth?: string;
        /**
         * The attribute name for a Thing's height (by default, "height").
         */
        keyHeight?: string;
        /**
         * The attribute name for a Thing's top (by default, "top").
         */
        keyTop?: string;
        /**
         * The attribute name for a Thing's right (by default, "right").
         */
        keyRight?: string;
        /**
         * The attribute name for a Thing's bottom (by default, "bottom").
         */
        keyBottom?: string;
        /**
         * The attribute name for a Thing's left (by default, "left").
         */
        keyLeft?: string;
        /**
         * The attribute name for a Thing's horizontal offest (by default, ignored).
         */
        keyOffsetX?: string;
        /**
         * The attribute name for a Thing's vertical offset (by default, ignored).
         */
        keyOffsetY?: string;
    }
    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    interface IPixelDrawr {
        /**
         * @returns How often refill calls should be skipped.
         */
        getFramerateSkip(): number;
        /**
         * @returns The Arrays to be redrawn during refill calls.
         */
        getThingArray(): IThing[][];
        /**
         * @returns The canvas element each Thing is to drawn on.
         */
        getCanvas(): HTMLCanvasElement;
        /**
         * @returns The 2D canvas context associated with the canvas.
         */
        getContext(): CanvasRenderingContext2D;
        /**
         * @returns The canvas element used for the background.
         */
        getBackgroundCanvas(): HTMLCanvasElement;
        /**
         * @returns The 2D canvas context associated with the background canvas.
         */
        getBackgroundContext(): CanvasRenderingContext2D;
        /**
         * @returns Whether refills should skip redrawing the background each time.
         */
        getNoRefill(): boolean;
        /**
         * @returns The minimum opacity that will be drawn.
         */
        getEpsilon(): number;
        /**
         * @param framerateSkip   How often refill calls should be skipped.
         */
        setFramerateSkip(framerateSkip: number): void;
        /**
         * @param thingArrays   The Arrays to be redrawn during refill calls.
         */
        setThingArrays(thingArrays: IThing[][]): void;
        /**
         * Sets the currently drawn canvas and context, and recreates
         * drawThingOnContextBound.
         *
         * @param canvas   The new primary canvas to be used.
         */
        setCanvas(canvas: HTMLCanvasElement): void;
        /**
         * @param noRefill   Whether refills should now skip redrawing the
         *                   background each time.
         */
        setNoRefill(noRefill: boolean): void;
        /**
         * @param epsilon   The minimum opacity that will be drawn.
         */
        setEpsilon(epsilon: number): void;
        /**
         * Creates a new canvas the size of MapScreener and sets the background
         * canvas to it, then recreates backgroundContext.
         */
        resetBackground(): void;
        /**
         * Refills the background canvas with a new fillStyle.
         *
         * @param fillStyle   The new fillStyle for the background context.
         */
        setBackground(fillStyle: any): void;
        /**
         * Draws the background canvas onto the main canvas' context.
         */
        drawBackground(): void;
        /**
         * Goes through all the motions of finding and parsing a Thing's sprite.
         * This should be called whenever the sprite's appearance changes.
         *
         * @param thing   A Thing whose sprite must be updated.
         */
        setThingSprite(thing: IThing): void;
        /**
         * Called every upkeep to refill the entire main canvas. All Thing arrays
         * are made to call this.refillThingArray in order.
         */
        refillGlobalCanvas(): void;
        /**
         * Calls drawThingOnContext on each Thing in the Array.
         *
         * @param array   A listing of Things to be drawn onto the canvas.
         */
        refillThingArray(array: IThing[]): void;
        /**
         * General Function to draw a Thing onto a context. This will call
         * drawThingOnContext[Single/Multiple] with more arguments
         *
         * @param context   The context to have the Thing drawn on it.
         * @param thing   The Thing to be drawn onto the context.
         */
        drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void;
    }
    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    class PixelDrawr implements IPixelDrawr {
        /**
         * A PixelRendr used to obtain raw sprite data and canvases.
         */
        private PixelRender;
        /**
         * The bounds of the screen for bounds checking (often a MapScreenr).
         */
        private boundingBox;
        /**
         * The canvas element each Thing is to be drawn on.
         */
        private canvas;
        /**
         * The 2D canvas context associated with the canvas.
         */
        private context;
        /**
         * A separate canvas that keeps the background of the scene.
         */
        private backgroundCanvas;
        /**
         * The 2D canvas context associated with the background canvas.
         */
        private backgroundContext;
        /**
         * Arrays of Thing[]s that are to be drawn in each refill.
         */
        private thingArrays;
        /**
         * Utility Function to create a canvas.
         */
        private createCanvas;
        /**
         * How much to scale canvases on creation.
         */
        private unitsize;
        /**
         * Utility Function to generate a class key for a Thing.
         */
        private generateObjectKey;
        /**
         * The maximum size of a SpriteMultiple to pre-render.
         */
        private spriteCacheCutoff;
        /**
         * Whether refills should skip redrawing the background each time.
         */
        private noRefill;
        /**
         * For refillQuadrant, an Array of String names to refill (bottom-to-top).
         */
        private groupNames;
        /**
         * How often the screen redraws (1 for always, 2 for every other call, etc).
         */
        private framerateSkip;
        /**
         * How many frames have been drawn so far.
         */
        private framesDrawn;
        /**
         * An arbitrarily small minimum for opacity to be completely transparent.
         */
        private epsilon;
        /**
         * Initializes a new instance of the PixelDrawr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IPixelDrawrSettings);
        /**
         * @returns How often refill calls should be skipped.
         */
        getFramerateSkip(): number;
        /**
         * @returns The Arrays to be redrawn during refill calls.
         */
        getThingArray(): IThing[][];
        /**
         * @returns The canvas element each Thing is to drawn on.
         */
        getCanvas(): HTMLCanvasElement;
        /**
         * @returns The 2D canvas context associated with the canvas.
         */
        getContext(): CanvasRenderingContext2D;
        /**
         * @returns The canvas element used for the background.
         */
        getBackgroundCanvas(): HTMLCanvasElement;
        /**
         * @returns The 2D canvas context associated with the background canvas.
         */
        getBackgroundContext(): CanvasRenderingContext2D;
        /**
         * @returns Whether refills should skip redrawing the background each time.
         */
        getNoRefill(): boolean;
        /**
         * @returns The minimum opacity that will be drawn.
         */
        getEpsilon(): number;
        /**
         * @param framerateSkip   How often refill calls should be skipped.
         */
        setFramerateSkip(framerateSkip: number): void;
        /**
         * @param thingArrays   The Arrays to be redrawn during refill calls.
         */
        setThingArrays(thingArrays: IThing[][]): void;
        /**
         * Sets the currently drawn canvas and context, and recreates
         * drawThingOnContextBound.
         *
         * @param canvas   The new primary canvas to be used.
         */
        setCanvas(canvas: HTMLCanvasElement): void;
        /**
         * @param noRefill   Whether refills should now skip redrawing the
         *                   background each time.
         */
        setNoRefill(noRefill: boolean): void;
        /**
         * @param epsilon   The minimum opacity that will be drawn.
         */
        setEpsilon(epsilon: number): void;
        /**
         * Creates a new canvas the size of MapScreener and sets the background
         * canvas to it, then recreates backgroundContext.
         */
        resetBackground(): void;
        /**
         * Refills the background canvas with a new fillStyle.
         *
         * @param fillStyle   The new fillStyle for the background context.
         */
        setBackground(fillStyle: any): void;
        /**
         * Draws the background canvas onto the main canvas' context.
         */
        drawBackground(): void;
        /**
         * Goes through all the motions of finding and parsing a Thing's sprite.
         * This should be called whenever the sprite's appearance changes.
         *
         * @param thing   A Thing whose sprite must be updated.
         */
        setThingSprite(thing: IThing): void;
        /**
         * Called every upkeep to refill the entire main canvas. All Thing arrays
         * are made to call this.refillThingArray in order.
         */
        refillGlobalCanvas(): void;
        /**
         * Calls drawThingOnContext on each Thing in the Array.
         *
         * @param array   A listing of Things to be drawn onto the canvas.
         */
        refillThingArray(array: IThing[]): void;
        /**
         * General Function to draw a Thing onto a context. This will call
         * drawThingOnContext[Single/Multiple] with more arguments
         *
         * @param context   The context to have the Thing drawn on it.
         * @param thing   The Thing to be drawn onto the context.
         */
        drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void;
        /**
         * Simply draws a thing's sprite to its canvas by getting and setting
         * a canvas::imageData object via context.getImageData(...).
         *
         * @param thing   A Thing whose canvas must be updated.
         */
        private refillThingCanvasSingle(thing);
        /**
         * For SpriteMultiples, this copies the sprite information for each
         * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
         * rendered information onto the thing's canvas.
         *
         * @param thing   A Thing whose canvas and sprites must be updated.
         */
        private refillThingCanvasMultiple(thing);
        /**
         * Draws a Thing's single canvas onto a context, commonly called by
         * this.drawThingOnContext.
         *
         * @param context    The context being drawn on.
         * @param canvas   The Thing's canvas being drawn onto the context.
         * @param thing   The Thing whose canvas is being drawn.
         * @param left   The x-position to draw the Thing from.
         * @param top   The y-position to draw the Thing from.
         */
        private drawThingOnContextSingle(context, canvas, thing, left, top);
        /**
         * Draws a Thing's multiple canvases onto a context, typicall called by
         * drawThingOnContext. A variety of cases for canvases is allowed:
         * "vertical", "horizontal", and "corners".
         *
         * @param context    The context being drawn on.
         * @param canvases   The canvases being drawn onto the context.
         * @param thing   The Thing whose canvas is being drawn.
         * @param left   The x-position to draw the Thing from.
         * @param top   The y-position to draw the Thing from.
         */
        private drawThingOnContextMultiple(context, canvases, thing, left, top);
        /**
         * @param thing   Any Thing.
         * @returns The Thing's top position, accounting for vertical offset if needed.
         */
        private getTop(thing);
        /**
         * @param thing   Any Thing.
         * @returns The Thing's right position, accounting for horizontal offset if needed.
         */
        private getRight(thing);
        /**
         * @param thing   Any Thing.
         * @returns {Number} The Thing's bottom position, accounting for vertical
         *                  offset if needed.
         */
        private getBottom(thing);
        /**
         * @param thing   Any Thing.
         * @returns The Thing's left position, accounting for horizontal offset if needed.
         */
        private getLeft(thing);
        /**
         * Draws a source pattern onto a context. The pattern is clipped to the size
         * of MapScreener.
         *
         * @param context   The context the pattern will be drawn onto.
         * @param source   The image being repeated as a pattern. This can be a canvas,
         *                 an image, or similar.
         * @param left   The x-location to draw from.
         * @param top   The y-location to draw from.
         * @param width   How many pixels wide the drawing area should be.
         * @param left   How many pixels high the drawing area should be.
         * @param opacity   How transparent the drawing is, in [0,1].
         */
        private drawPatternOnContext(context, source, left, top, width, height, opacity);
    }
}
declare var module: any;
