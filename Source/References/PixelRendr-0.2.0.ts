/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="StringFilr-0.2.1.ts" />

declare module PixelRendr {
    /**
     * A typed array of 8-bit unsigned integer values. The contents are initialized 
     * to 0. If the requested number of bytes could not be allocated an exception is
     * raised.
     * 
     * @remarks This is kept here as a stand-in for the full Uint8ClampedArray, since
     *          TypeScript doesn't always recognize it.
     */
    interface Uint8ClampedArray extends ArrayBufferView {
        [index: number]: number;

        /**
          * The size in bytes of each element in the array. 
          */
        BYTES_PER_ELEMENT: number;

        /**
          * The length of the array.
          */
        length: number;

        /**
          * Gets the element at the specified index.
          * 
          * @param {Number} index The index at which to get the element of the array.
          */
        get(index: number): number;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Number} index   The index of the location to set.
          * @param {Number} value   The value to set.
          */
        set(index: number, value: number): void;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Uint8ClampedArray} array   A typed or untyped array of values 
          *                                    to set.
          * @param {Number} [offset]   The index in the current array at which the 
          *                            values are to be written.
          */
        set(array: Uint8ClampedArray, offset?: number): void;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Number[]} array   A typed or untyped array of values to set.
          * @param {Number} [offset]   The index in the current array at which the 
          *                            values are to be written.
          */
        set(array: number[], offset?: number): void;

        /**
          * Gets a new Uint8ClampedArray view of the ArrayBuffer Object store for 
          * this array, specifying the first and last members of the subarray. 
          * 
          * @param {Number} begin   The index of the beginning of the array.
          * @param {Number} end   The index of the end of the array.
          */
        subarray(begin: number, end?: number): Uint8ClampedArray;
    }

    export interface ILibrary {
        raws: any;
        sprites?: IRenderLibrary;
    }

    export interface IRender {
        source: string | any[];
        sprites: IRenderSprites;
        filter: IFilterAttributes;
        containers: IRenderContainerListing[];
    }

    export interface IRenderLibrary {
        [i: string]: IRenderLibrary | IRender;
    }

    export interface IRenderSprites {
        [i: string]: Uint8ClampedArray | ISpriteMultiple;
    }

    export interface IRenderContainerListing {
        container: IRenderLibrary;
        key: string;
    }

    export interface IGeneralSpriteGenerator {
        (render: IRender, key: string, attributes: ISpriteAttributes): Uint8ClampedArray | ISpriteMultiple;
    }

    export interface IPixelRendrEncodeCallback {
        (result: string, image: HTMLImageElement, source: any): any;
    }

    export interface IClampedArraysContainer {
        [i: string]: Uint8ClampedArray;
    }

    export interface ISpriteAttributes {
        filter?: IFilter;
        [i: string]: number | IFilter;
    }

    export interface IFilter {
        0: string;
        1: {
            [i: string]: string;
        }
    }

    export interface IFilterContainer {
        [i: string]: IFilter;
    }

    export interface IFilterAttributes {
        filter: IFilter;
    }
    
    export interface ISpriteMultiple {
        sprites: IClampedArraysContainer;
        direction: string;
        topheight: number;
        rightwidth: number;
        bottomheight: number;
        leftwidth: number;
        middleStretch: boolean;
    }

    export interface IPixelRendrSettings {
        /**
         * The palette of colors to use for sprites. This should be a number[][]
         * of RGBA values.
         */
        paletteDefault: number[][];

        /**
         * A nested library of sprites to process.
         */
        library?: any;

        /**
         * Filters that may be used by sprites in the library.
         */
        filters?: IFilterContainer;

        /**
         * An amount to expand sprites by when processing (by default, 1 for not at
         * all).
         */
        scale?: number;

        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * vertically (by default, "flip-vert").
         */
        flipVert?: string;

        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * horizontally (by default, "flip-vert").
         */
        flipHoriz?: string;

        /**
         * What key in attributions should contain sprite widths (by default, 
         * "spriteWidth").
         */
        spriteWidth?: string;

        /**
         *  What key in attributions should contain sprite heights (by default, 
         * "spriteHeight").
         */
        spriteHeight?: string;

        /**
         * A replacement for window.Uint8ClampedArray, if desired.
         */
        Uint8ClampedArray?: any;
    }

    export interface IPixelRendr {
        getBaseLibrary(): any;
        getBaseFiler(): StringFilr.IStringFilr;
        getProcessorBase(): ChangeLinr.IChangeLinr;
        getProcessorDims(): ChangeLinr.IChangeLinr;
        getProcessorEncode(): ChangeLinr.IChangeLinr;
        getSpriteBase(key: string): void;
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        encode(image: HTMLImageElement, callback: IPixelRendrEncodeCallback, source: any): string;
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        memcpyU8(
            source: Uint8ClampedArray | number[],
            destination: Uint8ClampedArray | number[],
            readloc?: number,
            writeloc?: number,
            writelength?: number);
    }
}

/**
 * 
 */
module PixelRendr {
    "use strict";

    /**
     * Summary container for a single PixelRendr sprite source. The original source
     * is stored, along with any generated outputs, information on its container,
     * and any filter.
     */
    export class Render implements IRender {
        /**
         * The original command to create this Render, which is either a plain
         * String source or an Array representing a command.
         */
        source: string | any[];

        /**
         * Output sprites generated by the source, keyed by the calling key.
         */
        sprites: IRenderSprites;

        /**
         * An optional filter to change colors by, if source is a "filter" command.
         */
        filter: IFilterAttributes;

        /**
         * Any containers storing this Render, including the key under which it's stored.
         */
        containers: IRenderContainerListing[];

        /**
         * Resets the Render. No sprite computation is done here, so sprites is
         * initialized to an empty container.
         */
        constructor(source: string | any[], filter?: IFilterAttributes) {
            this.source = source;
            this.filter = filter;
            this.sprites = {};
            this.containers = [];
        }
    }

    /**
     * Container for a "multiple" sprite, which is a sprite that contains separate
     * Uint8ClampedArray pieces of data for different sections (such as top, middle, etc.)
     */
    export class SpriteMultiple implements ISpriteMultiple {
        /**
         * Storage for each internal Uint8ClampedArray sprite, keyed by container.
         */
        sprites: IClampedArraysContainer;

        /**
         * The direction of sprite, such as "horizontal".
         */
        direction: string;

        /**
         * How many pixels tall the top section is, if it exists.
         */
        topheight: number;

        /**
         * How many pixels wide the right section is, if it exists.
         */
        rightwidth: number;

        /**
         * How many pixels tall the bottom section is, if it exists.
         */
        bottomheight: number;

        /**
         * How many pixels wide the left section is, if it exists.
         */
        leftwidth: number;

        /**
         * Whether the middle section should be stretched to fill the remaining
         * space instead of filling as a pattern.
         */
        middleStretch: boolean;

        /**
         * Stores an already-computed container of sprites, and sets the direction
         * sizes and middleStretch accordingly.
         */
        constructor(sprites: IClampedArraysContainer, render: Render) {
            var sources: any = render.source[2];

            this.sprites = sprites;
            this.direction = render.source[1];

            if (this.direction === "vertical" || this.direction === "corners") {
                this.topheight = sources.topheight | 0;
                this.bottomheight = sources.bottomheight | 0;
            }

            if (this.direction === "horizontal" || this.direction === "corners") {
                this.rightwidth = sources.rightwidth | 0;
                this.leftwidth = sources.leftwidth | 0;
            }

            this.middleStretch = sources.middleStretch || false;
        }
    }

    /**
     * A moderately unusual graphics module designed to compress images as
     * compressed text blobs and store the text blobs in a StringFilr. These tasks 
     * are performed and cached quickly enough for use in real-time environments, 
     * such as real-time video games.
     */
    export class PixelRendr implements IPixelRendr {
        /**
         * The base container for storing sprite information.
         */
        private library: ILibrary;

        /**
         * A StringFilr interface on top of the base library.
         */
        private BaseFiler: StringFilr.StringFilr;

        /**
         * Applies processing Functions to turn raw Strings into partial sprites,
         * used during reset calls.
         */
        private ProcessorBase: ChangeLinr.ChangeLinr;

        /**
         * Takes partial sprites and repeats rows, then checks for dimension
         * flipping, used during on-demand retrievals.
         */
        private ProcessorDims: ChangeLinr.ChangeLinr;

        /**
         * Reverse of ProcessorBase: takes real images and compresses their data
         * into sprites.
         */
        private ProcessorEncode: ChangeLinr.ChangeLinr;

        /**
         * The default number[][] (rgba[]) used for palettes in sprites.
         */
        private paletteDefault: number[][];

        /**
         * The default digit size (how many characters per number).
         */
        private digitsizeDefault: number;

        /**
         * Utility RegExp to split Strings on every #digitsize characters.
         */
        private digitsplit: RegExp;

        /**
         * How much to "scale" each sprite by (repeat the pixels this much).
         */
        private scale: number;

        /**
         * String key to know whether to flip a processed sprite vertically,
         * based on supplied attributes.
         */
        private flipVert: string;

        /**
         * String key to know whether to flip a processed sprite horizontally,
         * based on supplied attributes.
         */
        private flipHoriz: string;

        /**
         * String key to obtain sprite width from supplied attributes.
         */
        private spriteWidth: string;

        /**
         * String key to obtain sprite height from supplied attributes.
         */
        private spriteHeight: string;

        /**
         * Filters for processing sprites.
         */
        private filters: IFilterContainer;

        /**
         * Generators used to generate Renders from sprite commands.
         */
        private commandGenerators: {
            [i: string]: IGeneralSpriteGenerator;
        };

        /**
         * A reference for window.Uint8ClampedArray, or replacements such as
         * Uint8Array if needed.
         */
        private Uint8ClampedArray: any;

        /**
         * @param {IPixelRendrSettings} settings
         */
        constructor(settings: IPixelRendrSettings) {
            if (!settings) {
                throw new Error("No settings given to PixelRendr.");
            }
            if (!settings.paletteDefault) {
                throw new Error("No paletteDefault given to PixelRendr.");
            }

            this.paletteDefault = settings.paletteDefault;

            this.digitsizeDefault = this.getDigitSizeFromArray(this.paletteDefault);
            this.digitsplit = new RegExp(".{1," + this.digitsizeDefault + "}", "g");

            this.library = {
                "raws": settings.library || {}
            };

            this.filters = settings.filters || {};
            this.scale = settings.scale || 1;

            this.flipVert = settings.flipVert || "flip-vert";
            this.flipHoriz = settings.flipHoriz || "flip-horiz";

            this.spriteWidth = settings.spriteWidth || "spriteWidth";
            this.spriteHeight = settings.spriteHeight || "spriteHeight";

            this.Uint8ClampedArray = (settings.Uint8ClampedArray
                || (<any>window).Uint8ClampedArray
                || (<any>window).Uint8Array);

            // The first ChangeLinr does the raw processing of Strings to sprites
            // This is used to load & parse sprites into memory on startup
            this.ProcessorBase = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteUnravel": this.spriteUnravel.bind(this),
                    "spriteApplyFilter": this.spriteApplyFilter.bind(this),
                    "spriteExpand": this.spriteExpand.bind(this),
                    "spriteGetArray": this.spriteGetArray.bind(this)
                },
                "pipeline": [
                    "spriteUnravel",
                    "spriteApplyFilter",
                    "spriteExpand",
                    "spriteGetArray"
                ]
            });

            // The second ChangeLinr does row repeating and flipping
            // This is done on demand when given a sprite's settings Object
            this.ProcessorDims = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteRepeatRows": this.spriteRepeatRows.bind(this),
                    "spriteFlipDimensions": this.spriteFlipDimensions.bind(this)
                },
                "pipeline": [
                    "spriteRepeatRows",
                    "spriteFlipDimensions"
                ]
            });

            // As a utility, a processor is included to encode image data to sprites
            this.ProcessorEncode = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "imageGetData": this.imageGetData.bind(this),
                    "imageGetPixels": this.imageGetPixels.bind(this),
                    "imageMapPalette": this.imageMapPalette.bind(this),
                    "imageCombinePixels": this.imageCombinePixels.bind(this)
                },
                "pipeline": [
                    "imageGetData",
                    "imageGetPixels",
                    "imageMapPalette",
                    "imageCombinePixels"
                ],
                "doUseCache": false
            });

            this.library.sprites = this.libraryParse(this.library.raws);

            // The BaseFiler provides a searchable 'view' on the library of sprites
            this.BaseFiler = new StringFilr.StringFilr({
                "library": this.library.sprites,
                "normal": "normal" // to do: put this somewhere more official?
            });

            this.commandGenerators = {
                "multiple": this.generateSpriteCommandMultipleFromRender.bind(this),
                "same": this.generateSpriteCommandSameFromRender.bind(this),
                "filter": this.generateSpriteCommandFilterFromRender.bind(this)
            };
        }


        /* Simple gets
        */

        /**
         * @return {Object} The base container for storing sprite information.
         */
        getBaseLibrary(): any {
            return this.BaseFiler.getLibrary();
        }

        /**
         * @return {StringFilr} The StringFilr interface on top of the base library.
         */
        getBaseFiler(): StringFilr.StringFilr {
            return this.BaseFiler;
        }

        /**
         * @return {ChangeLinr} The processor that turns raw strings into partial
         * sprites.
         */
        getProcessorBase(): ChangeLinr.ChangeLinr {
            return this.ProcessorBase;
        }

        /**
         * @return {ChangeLinr} The processor that turns partial sprites and repeats
         *                      rows.
         */
        getProcessorDims(): ChangeLinr.ChangeLinr {
            return this.ProcessorDims;
        }

        /**
         * @return {ChangeLinr} The processor that takes real images and compresses
         *                      their data into sprite Strings.
         */
        getProcessorEncode(): ChangeLinr.ChangeLinr {
            return this.ProcessorEncode;
        }

        /**
         * @param {String} key
         * @return {Mixed} Returns the base sprite for a key. This will either be a
         *                 Uint8ClampedArrayor SpriteMultiple if a sprite is found, 
         *                 or the deepest matching Object in the library.
         */
        getSpriteBase(key: string): void {
            return this.BaseFiler.get(key);
        }


        /* External APIs
        */

        /**
         * Standard render function. Given a key, this finds the raw information via
         * BaseFiler and processes it using ProcessorDims. Attributes are needed so
         * the ProcessorDims can stretch it on width and height.
         * 
         * @param {String} key   The general key for the sprite to be passed 
         *                       directly to BaseFiler.get.
         * @param {Object} attributes   Additional attributes for the sprite; width
         *                              and height Numbers are required.
         * @return {Uint8ClampedArray} 
         */
        decode(key: string, attributes: ISpriteAttributes): Uint8ClampedArray | SpriteMultiple {
            var render: Render = this.BaseFiler.get(key),
                sprite: Uint8ClampedArray | SpriteMultiple;

            if (!render) {
                throw new Error("No sprite found for " + key + ".");
            }

            // If the render doesn't have a listing for this key, create one
            if (!render.sprites.hasOwnProperty(key)) {
                this.generateRenderSprite(render, key, attributes);
            }

            sprite = render.sprites[key];

            if (!sprite || ((<any>sprite.constructor) === this.Uint8ClampedArray && (<Uint8ClampedArray>sprite).length === 0)) {
                throw new Error("Could not generate sprite for " + key + ".");
            }

            return sprite;
        }

        /**
         * Encodes an image into a sprite via ProcessorEncode.process.
         * 
         * @param {HTMLImageElement} image
         * @param {Function} [callback]   An optional callback to call on the image
         *                                with source as an extra argument.
         * @param {Mixed} [source]   An optional extra argument for callback,
         *                           commonly provided by this.encodeUri as the 
         *                           image source.
         */
        encode(image: HTMLImageElement, callback: IPixelRendrEncodeCallback, source: any): string {
            var result: string = this.ProcessorEncode.process(image);

            if (callback) {
                callback(result, image, source);
            }

            return result;
        }

        /**
         * Fetches an image from a source and encodes it into a sprite via 
         * ProcessEncode.process. An HtmlImageElement is created and given an onload
         * of this.encode.
         * 
         * @param {String} uri
         * @param {Function} callback   A callback for when this.encode finishes to
         *                              call on the results.
         */
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void {
            var image: HTMLImageElement = document.createElement("img");
            image.onload = this.encode.bind(this, image, callback);
            image.src = uri;
        }

        /**
         * Miscellaneous utility to generate a complete palette from raw image pixel
         * data. Unique [r,g,b,a] values are found using tree-based caching, and
         * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
         * pixel has a=0, it's completely transparent and goes before anything else
         * in the palette. Grayscale colors come next in order of light to dark, and
         * general colors come next sorted by decreasing r, g, and b in order.
         * 
         * @param {Uint8ClampedArray} data   The equivalent data from a context's
         *                                   getImageData(...).data.
         * @param {Boolean} [forceZeroColor]   Whether the palette should have a
         *                                     [0,0,0,0] color as the first element
         *                                     even if data does not contain it (by
         *                                     default, false).
         * @param {Boolean} [giveArrays]   Whether the resulting palettes should be
         *                                 converted to Arrays (by default, false).
         * @return {Uint8ClampedArray[]} A working palette that may be used in 
         *                               sprite settings (Array[] if giveArrays is
         *                               true).
         */
        generatePaletteFromRawData(
            data: Uint8ClampedArray,
            forceZeroColor: boolean = false,
            giveArrays: boolean = false): Uint8ClampedArray[] {
            var tree: any = {},
                colorsGeneral: Uint8ClampedArray[] = [],
                colorsGrayscale: Uint8ClampedArray[] = [],
                output: Uint8ClampedArray[],
                i: number;

            for (i = 0; i < data.length; i += 4) {
                if (data[i + 3] === 0) {
                    forceZeroColor = true;
                    continue;
                }

                if (
                    tree[data[i]]
                    && tree[data[i]][data[i + 1]]
                    && tree[data[i]][data[i + 1]][data[i + 2]]
                    && tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    continue;
                }

                if (!tree[data[i]]) {
                    tree[data[i]] = {};
                }

                if (!tree[data[i]][data[i + 1]]) {
                    tree[data[i]][data[i + 1]] = {};
                }

                if (!tree[data[i]][data[i + 1]][data[i + 2]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]] = {};
                }

                if (!tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]] = true;

                    if (data[i] === data[i + 1] && data[i + 1] === data[i + 2]) {
                        colorsGrayscale.push(data.subarray(i, i + 4));
                    } else {
                        colorsGeneral.push(data.subarray(i, i + 4));
                    }
                }
            }

            // It's safe to sort grayscale colors just on their first values, since
            // grayscale implies they're all the same.
            colorsGrayscale.sort(function (a: Uint8ClampedArray, b: Uint8ClampedArray): number {
                return a[0] - b[0];
            });

            // For regular colors, sort by the first color that's not equal, so in 
            // order red, green, blue, alpha.
            colorsGeneral.sort(function (a: Uint8ClampedArray, b: Uint8ClampedArray): number {
                for (i = 0; i < 4; i += 1) {
                    if (a[i] !== b[i]) {
                        return b[i] - a[i];
                    }
                }
            });

            if (forceZeroColor) {
                output = [new this.Uint8ClampedArray([0, 0, 0, 0])]
                    .concat(colorsGrayscale)
                    .concat(colorsGeneral);
            } else {
                output = colorsGrayscale.concat(colorsGeneral);
            }

            if (!giveArrays) {
                return output;
            }

            for (i = 0; i < output.length; i += 1) {
                output[i] = Array.prototype.slice.call(output[i]);
            }

            return output;
        }

        /**
         * Copies a stretch of members from one Uint8ClampedArray or number[] to
         * another. This is a useful utility Function for code that may use this 
         * PixelRendr to draw its output sprites, such as PixelDrawr.
         * 
         * @param {Uint8ClampedArray} source
         * @param {Uint8ClampedArray} destination
         * @param {Number} readloc   Where to start reading from in the source.
         * @param {Number} writeloc   Where to start writing to in the source.
         * @param {Number} writelength   How many members to copy over.
         * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
         * @see http://www.javascripture.com/Uint8ClampedArray
         */
        memcpyU8(
            source: Uint8ClampedArray | number[],
            destination: Uint8ClampedArray | number[],
            readloc: number = 0,
            writeloc: number = 0,
            writelength: number = Math.max(0, Math.min(source.length, destination.length))): void {
            // JIT compilation help
            var lwritelength: number = writelength + 0,
                lwriteloc: number = writeloc + 0,
                lreadloc: number = readloc + 0;

            while (lwritelength--) {
                destination[lwriteloc++] = source[lreadloc++];
            }
        }


        /* Library parsing
         */

        /**
         * Recursively travels through a library, turning all raw String sprites
         * and any[] commands into Renders.
         * 
         * @param {Object} reference   The raw source structure to be parsed.
         * @param {String} path   The path to the current place within the library.
         * @return {Object} The parsed library Object.
         */
        private libraryParse(reference: any): IRenderLibrary {
            var setNew: IRenderLibrary = {},
                source: any,
                i: string;

            // For each child of the current layer:
            for (i in reference) {
                if (!reference.hasOwnProperty(i)) {
                    continue;
                }

                source = reference[i];

                switch (source.constructor) {
                    case String:
                        // Strings directly become IRenders
                        setNew[i] = new Render(source);
                        break;

                    case Array:
                        // Arrays contain a String filter, a String[] source, and any
                        // number of following arguments
                        setNew[i] = new Render(source, source[1]);
                        break;

                    default:
                        // If it's anything else, simply recurse
                        setNew[i] = this.libraryParse(source);
                        break;
                }

                // If a Render was created, mark setNew as a container
                if (setNew[i].constructor === Render) {
                    (<Render>setNew[i]).containers.push({
                        "container": setNew,
                        "key": i
                    });
                }
            }

            return setNew;
        }

        /**
         * Generates a sprite for a Render based on its internal source and an 
         * externally given String key and attributes Object. The sprite is stored
         * in the Render's sprites container under that key.
         * 
         * @param {Render} render   A render whose sprite is being generated.
         * @param {String} key   The key under which the sprite is stored.
         * @param {Object} attributes   Any additional information to pass to the
         *                              sprite generation process.
         */
        private generateRenderSprite(render: Render, key: string, attributes: ISpriteAttributes): void {
            var sprite: Uint8ClampedArray | SpriteMultiple;

            if (render.source.constructor === String) {
                sprite = this.generateSpriteSingleFromRender(render, key, attributes);
            } else {
                sprite = this.commandGenerators[render.source[0]](render, key, attributes);
            }

            render.sprites[key] = sprite;
        }

        /**
         * Generates the pixel data for a single sprite.
         * 
         * @param {Render} render   A render whose sprite is being generated.
         * @param {String} key   The key under which the sprite is stored.
         * @param {Object} attributes   Any additional information to pass to the
         *                              sprite generation process.
         * @return {Mixed} The output sprite; either a Uint8ClampedArray or SpriteMultiple.
         */
        private generateSpriteSingleFromRender(render: Render, key: string, attributes: ISpriteAttributes): Uint8ClampedArray {
            var base: Uint8ClampedArray = this.ProcessorBase.process(render.source, key, render.filter),
                sprite: Uint8ClampedArray = this.ProcessorDims.process(base, key, attributes);

            return sprite;
        }

        /**
         * Generates the pixel data for a SpriteMultiple to be generated by creating
         * a container in a new SpriteMultiple and filing it with processed single 
         * sprites.
         * 
         * @param {Render} render   A render whose sprite is being generated.
         * @param {String} key   The key under which the sprite is stored.
         * @param {Object} attributes   Any additional information to pass to the
         *                              sprite generation process.
         * @return {Mixed} The output sprite; either a Uint8ClampedArray or SpriteMultiple.
         */
        private generateSpriteCommandMultipleFromRender(render: Render, key: string, attributes: ISpriteAttributes): SpriteMultiple {
            var sources: any = render.source[2],
                sprites: IClampedArraysContainer = {},
                sprite: Uint8ClampedArray,
                path: string,
                output: SpriteMultiple = new SpriteMultiple(sprites, render),
                i: string;

            for (i in sources) {
                if (sources.hasOwnProperty(i)) {
                    path = key + " " + i;
                    sprite = this.ProcessorBase.process(sources[i], path, render.filter);
                    sprites[i] = this.ProcessorDims.process(sprite, path, attributes);
                }
            }

            return output;
        }

        /**
         * Generates the output of a "same" command. The referenced Render or
         * directory are found, assigned to the old Render's directory, and
         * this.decode is used to find the output.
         * 
         * @param {Render} render   A render whose sprite is being generated.
         * @param {String} key   The key under which the sprite is stored.
         * @param {Object} attributes   Any additional information to pass to the
         *                              sprite generation process.
         * @return {Mixed} The output sprite; either a Uint8ClampedArray or SpriteMultiple.
         */
        private generateSpriteCommandSameFromRender(
            render: Render,
            key: string,
            attributes: ISpriteAttributes): Uint8ClampedArray | SpriteMultiple {
            var replacement: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0);
            // The (now temporary) Render's containers are given the Render or directory
            // referenced by the source path
            this.replaceRenderInContainers(render, replacement);

            // BaseFiler will need to remember the new entry for the key,
            // so the cache is cleared and decode restarted
            this.BaseFiler.clearCached(key);
            return this.decode(key, attributes);
        }

        /**
         * Generates the output of a "filter" command. The referenced Render or
         * directory are found, converted into a filtered Render or directory, and
         * this.decode is used to find the output.
         * 
         * @param {Render} render   A render whose sprite is being generated.
         * @param {String} key   The key under which the sprite is stored.
         * @param {Object} attributes   Any additional information to pass to the
         *                              sprite generation process.
         * @return {Mixed} The output sprite; either a Uint8ClampedArray or SpriteMultiple.
         */
        private generateSpriteCommandFilterFromRender(
            render: Render,
            key: string,
            attributes: ISpriteAttributes): Uint8ClampedArray | SpriteMultiple {
            var filter: IFilter = this.filters[render.source[2]],
                found: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0),
                filtered: Render | IRenderLibrary;

            if (!filter) {
                console.warn("Invalid filter provided: " + render.source[2]);
            }

            // If found is a Render, create a new one as a filtered copy
            if (found.constructor === Render) {

                filtered = new Render(
                    (<Render>found).source,
                    {
                        "filter": filter
                    });

                this.generateRenderSprite(<Render>filtered, key, attributes);
            } else {
                // Otherwise it's an IRenderLibrary; go through that recursively
                filtered = this.generateRendersFromFilter(<IRenderLibrary>found, filter);
            }

            // The (now unused) render gives the filtered Render or directory to its containers
            this.replaceRenderInContainers(render, filtered);

            if (filtered.constructor === Render) {
                return (<Render>filtered).sprites[key];
            } else {
                this.BaseFiler.clearCached(key);
                return this.decode(key, attributes);
            }
        }

        /**
         * Recursively generates a directory of Renders from a filter. This is
         * similar to this.libraryParse, though the filter is added and references
         * aren't.
         * 
         * @param {Object} directory   The current directory of Renders to create
         *                             filtered versions of.
         * @param {Array} filter   The filter being applied.
         * @return {Object} An output directory containing Renders with the filter.
         */
        private generateRendersFromFilter(directory: IRenderLibrary, filter: IFilter): IRenderLibrary {
            var output: IRenderLibrary = {},
                child: Render | IRenderLibrary,
                i: string;

            for (i in directory) {
                if (!directory.hasOwnProperty(i)) {
                    continue;
                }

                child = directory[i];

                if (child.constructor === Render) {
                    output[i] = new Render(
                        (<Render>child).source,
                        {
                            "filter": filter
                        });
                } else {
                    output[i] = this.generateRendersFromFilter(<IRenderLibrary>child, filter);
                }
            }

            return output;
        }

        /**
         * Switches all of a given Render's containers to point to a replacement instead.
         * 
         * @param {Render} render
         * @param {Mixed} replacement
         */
        private replaceRenderInContainers(render: Render, replacement: Render | IRenderLibrary): void {
            var listing: IRenderContainerListing,
                i: number;

            for (i = 0; i < render.containers.length; i += 1) {
                listing = render.containers[i];

                listing.container[listing.key] = replacement;

                if (replacement.constructor === Render) {
                    (<Render>replacement).containers.push(listing);
                }
            }
        }


        /* Core pipeline functions
        */

        /**
         * Given a compressed raw sprite data string, this 'unravels' it. This is 
         * the first Function called in the base processor. It could output the
         * Uint8ClampedArray immediately if given the area - deliberately does not
         * to simplify sprite library storage.
         * 
         * @param {String} colors   The raw sprite String, including commands like
         *                          "p" and "x".
         * @return {String} A version of the sprite with no fancy commands, just
         *                  the numbers.
         */
        private spriteUnravel(colors: string): string {
            var paletteref: any = this.getPaletteReferenceStarting(this.paletteDefault),
                digitsize: number = this.digitsizeDefault,
                clength: number = colors.length,
                current: string,
                rep: number,
                nixloc: number,
                output: string = "",
                loc: number = 0;

            while (loc < clength) {
                switch (colors[loc]) {
                    // A loop, ordered as 'x char times ,'
                    case "x":
                        // Get the location of the ending comma
                        nixloc = colors.indexOf(",", ++loc);
                        // Get the color
                        current = this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        // Get the rep times
                        rep = Number(colors.slice(loc, nixloc));
                        // Add that int to output, rep many times
                        while (rep--) {
                            output += current;
                        }
                        loc = nixloc + 1;
                        break;

                    // A palette changer, in the form 'p[X,Y,Z...]' (or "p" for default)
                    case "p":
                        // If the next character is a "[", customize.
                        if (colors[++loc] === "[") {
                            nixloc = colors.indexOf("]");
                            // Isolate and split the new palette's numbers
                            paletteref = this.getPaletteReference(colors.slice(loc + 1, nixloc).split(","));
                            loc = nixloc + 1;
                            digitsize = this.getDigitSizeFromObject(paletteref);
                        } else {
                            // Otherwise go back to default
                            paletteref = this.getPaletteReference(this.paletteDefault);
                            digitsize = this.digitsizeDefault;
                        }
                        break;

                    // A typical number
                    default:
                        output += this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        break;
                }
            }

            return output;
        }

        /**
         * Repeats each number in the given string a number of times equal to the 
         * scale. This is the second Function called by the base processor.
         * 
         * @param {String} colors
         * @return {String}
         */
        private spriteExpand(colors: string): string {
            var output: string = "",
                clength: number = colors.length,
                i: number = 0,
                j: number,
                current: string;

            // For each number,
            while (i < clength) {
                current = colors.slice(i, i += this.digitsizeDefault);

                // Put it into output as many times as needed
                for (j = 0; j < this.scale; ++j) {
                    output += current;
                }
            }
            return output;
        }

        /**
         * Used during post-processing before spriteGetArray to filter colors. This
         * is the third Function used by the base processor, but it just returns the
         * original sprite if no filter should be applied from attributes.
         * Filters are applied here because the sprite is just the numbers repeated,
         * so it's easy to loop through and replace them.
         * 
         * @param {String} colors
         * @param {String} key
         * @param {Object} attributes
         * @return {String} 
         */
        private spriteApplyFilter(colors: string, key: string, attributes: ISpriteAttributes): string {
            // If there isn't a filter (as is the norm), just return the sprite
            if (!attributes || !attributes.filter) {
                return colors;
            }

            var filter: IFilter = attributes.filter,
                filterName: string = filter[0];

            if (!filterName) {
                return colors;
            }

            switch (filterName) {
                // Palette filters switch all instances of one color with another
                case "palette":
                    // Split the colors on on each digit
                    // ("...1234..." => [..., "12", "34", ...]
                    var split: string[] = colors.match(this.digitsplit),
                        i: string;

                    // For each color filter to be applied, replace it
                    for (i in filter[1]) {
                        if (filter[1].hasOwnProperty(i)) {
                            this.arrayReplace(split, i, filter[1][i]);
                        }
                    }

                    return split.join("");

                default:
                    console.warn("Unknown filter: '" + filterName + "'.");
            }

            return colors;
        }

        /**
         * Converts an unraveled String of sprite numbers to the equivalent RGBA
         * Uint8ClampedArray. Each colors number will be represented by four numbers
         * in the output. This is the fourth Function called in the base processor.
         * 
         * @param {String} colors
         * @return {Uint8ClampedArray}
         */
        private spriteGetArray(colors: string): Uint8ClampedArray {
            var clength: number = colors.length,
                numcolors: number = clength / this.digitsizeDefault,
                split: string[] = colors.match(this.digitsplit),
                olength: number = numcolors * 4,
                output: Uint8ClampedArray = new this.Uint8ClampedArray(olength),
                reference: number[],
                i: number,
                j: number,
                k: number;

            // For each color,
            for (i = 0, j = 0; i < numcolors; ++i) {
                // Grab its RGBA ints
                reference = this.paletteDefault[Number(split[i])];
                // Place each in output
                for (k = 0; k < 4; ++k) {
                    output[j + k] = reference[k];
                }
                j += 4;
            }

            return output;
        }

        /**
         * Repeats each row of a sprite based on the container attributes to create
         * the actual sprite (before now, the sprite was 1 / scale as high as it
         * should have been). This is the first Function called in the dimensions
         * processor.
         * 
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes   The container Object (commonly a Thing in
         *                              GameStarter), which must contain width and
         *                              height numbers.
         * @return {Uint8ClampedArray}
         */
        private spriteRepeatRows(sprite: Uint8ClampedArray, key: string, attributes: ISpriteAttributes): Uint8ClampedArray {
            var parsed: Uint8ClampedArray = new this.Uint8ClampedArray(sprite.length * this.scale),
                rowsize: number = <number>attributes[this.spriteWidth] * 4,
                height: number = <number>attributes[this.spriteHeight] / this.scale,
                readloc: number = 0,
                writeloc: number = 0,
                i: number,
                j: number;

            // For each row:
            for (i = 0; i < height; ++i) {
                // Add it to parsed x scale
                for (j = 0; j < this.scale; ++j) {
                    this.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                    writeloc += rowsize;
                }
                readloc += rowsize;
            }

            return parsed;
        }

        /**
         * Optionally flips a sprite based on the flipVert and flipHoriz keys. This
         * is the second Function in the dimensions processor and the last step
         * before a sprite is deemed usable.
         * 
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        private spriteFlipDimensions(sprite: Uint8ClampedArray, key: string, attributes: ISpriteAttributes): Uint8ClampedArray {
            if (key.indexOf(this.flipHoriz) !== -1) {
                if (key.indexOf(this.flipVert) !== -1) {
                    return this.flipSpriteArrayBoth(sprite);
                } else {
                    return this.flipSpriteArrayHoriz(sprite, attributes);
                }
            } else if (key.indexOf(this.flipVert) !== -1) {
                return this.flipSpriteArrayVert(sprite, attributes);
            }

            return sprite;
        }

        /**
         * Flips a sprite horizontally by reversing the pixels within each row. Rows
         * are computing using the spriteWidth in attributes.
         * 
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        private flipSpriteArrayHoriz(sprite: Uint8ClampedArray, attributes: ISpriteAttributes): Uint8ClampedArray {
            var length: number = sprite.length + 0,
                width: number = <number>attributes[this.spriteWidth] + 0,
                newsprite: Uint8ClampedArray = new this.Uint8ClampedArray(length),
                rowsize: number = width * 4,
                newloc: number,
                oldloc: number,
                i: number,
                j: number,
                k: number;

            // For each row:
            for (i = 0; i < length; i += rowsize) {
                newloc = i;
                oldloc = i + rowsize - 4;
                // For each pixel:
                for (j = 0; j < rowsize; j += 4) {
                    // Copy it over
                    for (k = 0; k < 4; ++k) {
                        newsprite[newloc + k] = sprite[oldloc + k];
                    }
                    newloc += 4;
                    oldloc -= 4;
                }
            }

            return newsprite;
        }

        /**
         * Flips a sprite horizontally by reversing the order of the rows. Rows are
         * computing using the spriteWidth in attributes.
         * 
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        private flipSpriteArrayVert(sprite: Uint8ClampedArray, attributes: ISpriteAttributes): Uint8ClampedArray {
            var length: number = sprite.length,
                width: number = <number>attributes[this.spriteWidth] + 0,
                newsprite: Uint8ClampedArray = new this.Uint8ClampedArray(length),
                rowsize: number = width * 4,
                newloc: number = 0,
                oldloc: number = length - rowsize,
                i: number,
                j: number;

            // For each row
            while (newloc < length) {
                // For each pixel in the rows
                for (i = 0; i < rowsize; i += 4) {
                    // For each rgba value
                    for (j = 0; j < 4; ++j) {
                        newsprite[newloc + i + j] = sprite[oldloc + i + j];
                    }
                }
                newloc += rowsize;
                oldloc -= rowsize;
            }

            return newsprite;
        }

        /**
         * Flips a sprite horizontally and vertically by reversing the order of the
         * pixels. This doesn't actually need attributes.
         * 
         * @param {Uint8ClampedArray} sprite
         * @return {Uint8ClampedArray}
         */
        private flipSpriteArrayBoth(sprite: Uint8ClampedArray): Uint8ClampedArray {
            var length: number = sprite.length,
                newsprite: Uint8ClampedArray = new this.Uint8ClampedArray(length),
                oldloc: number = sprite.length - 4,
                newloc: number = 0,
                i: number;

            while (newloc < length) {
                for (i = 0; i < 4; ++i) {
                    newsprite[newloc + i] = sprite[oldloc + i];
                }
                newloc += 4;
                oldloc -= 4;
            }

            return newsprite;
        }


        /* Encoding pipeline functions
        */

        /**
         * Retrives the raw pixel data from an image element. It is copied onto a 
         * canvas, which as its context return the .getImageDate().data results.
         * This is the first Fiunction used in the encoding processor.
         * 
         * @param {HTMLImageElement} image
         */
        private imageGetData(image: HTMLImageElement): number[] {
            var canvas: HTMLCanvasElement = document.createElement("canvas"),
                context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;

            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height).data;
        }

        /**
         * Determines which pixels occur in the data and at what frequency. This is
         * the second Function used in the encoding processor.
         * 
         * @param {Uint8ClampedArray} data   The raw pixel data obtained from the 
         *                                   imageData of a canvas.
         * @return {Array} [pixels, occurences], where pixels is an array of [rgba]
         *                 values and occurences is an Object mapping occurence
         *                 frequencies of palette colors in pisels.
         */
        private imageGetPixels(data: Uint8ClampedArray): [number[], any] {
            var pixels: number[] = new Array(data.length / 4),
                occurences: any = {},
                pixel: number,
                i: number,
                j: number;

            for (i = 0, j = 0; i < data.length; i += 4, j += 1) {
                pixel = this.getClosestInPalette(this.paletteDefault, data.subarray(i, i + 4));
                pixels[j] = pixel;

                if (occurences.hasOwnProperty(pixel)) {
                    occurences[pixel] += 1;
                } else {
                    occurences[pixel] = 1;
                }
            }

            return [pixels, occurences];
        }

        /**
         * Concretely defines the palette to be used for a new sprite. This is the
         * third Function used in the encoding processor, and creates a technically
         * usable (but uncompressed) sprite with information to compress it.
         * 
         * @param {Array} information   [pixels, occurences], a result directly from
         *                              imageGetPixels.    
         * @return {Array} [palette, numbers, digitsize], where palette is a 
         *                 String[] of palette numbers, numbers is the actual sprite
         *                 data, and digitsize is the sprite's digit size.
         */
        private imageMapPalette(information: [number[], any]): [string[], number[], number] {
            var pixels: number[] = information[0],
                occurences: any = information[1],
                palette: string[] = Object.keys(occurences),
                digitsize: number = this.getDigitSizeFromArray(palette),
                paletteIndices: any = this.getValueIndices(palette),
                numbers: number[] = <number[]>pixels.map(this.getKeyValue.bind(this, paletteIndices));

            return [palette, numbers, digitsize];
        }

        /**
         * Compresses a nearly complete sprite from imageMapPalette into a 
         * compressed, storage-ready String. This is the last Function in the 
         * encoding processor.
         * 
         * @param {Array} information   [palette, numbers, digitsize], a result
         *                              directly from imageMapPalette.
         * @return {String}
         */
        private imageCombinePixels(information: [string[], number[], number]): string {
            var palette: string[] = information[0],
                numbers: number[] = information[1],
                digitsize: number = information[2],
                threshold: number = Math.max(3, Math.round(4 / digitsize)),
                output: string,
                current: number,
                digit: string,
                i: number = 0,
                j: number;

            output = "p[" + palette.map(this.makeSizedDigit.bind(this, digitsize)).join(",") + "]";

            while (i < numbers.length) {
                j = i + 1;
                current = numbers[i];
                digit = this.makeDigit(current, digitsize);

                while (current === numbers[j]) {
                    j += 1;
                }

                if (j - i > threshold) {
                    output += "x" + digit + String(j - i) + ",";
                    i = j;
                } else {
                    do {
                        output += digit;
                        i += 1;
                    }
                    while (i < j);
                }
            }

            return output;
        }


        /* Misc. utility functions
        */

        /**
         * @param {Array} palette
         * @return {Number} What the digitsize for a sprite that uses the palette
         *                  should be (how many digits it would take to represent
         *                  any index of the palettte).
         */
        private getDigitSizeFromArray(palette: any[]): number {
            var digitsize: number = 0,
                i: number;

            for (i = palette.length; i >= 1; i /= 10) {
                digitsize += 1;
            }

            return digitsize;
        }

        /**
         * @param {Object} palette
         * @return {Number} What the digitsize for a sprite that uses the palette
         *                  should be (how many digits it would take to represent
         *                  any index of the palettte).
         */
        private getDigitSizeFromObject(palette: any): number {
            var digitsize: number = 0,
                i: number;

            for (i = Object.keys(palette).length; i >= 1; i /= 10) {
                digitsize += 1;
            }

            return digitsize;
        }

        /**
         * Generates an actual palette Object for a given palette, using a digitsize
         * calculated from the palette.
         * 
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        private getPaletteReference(palette: any[]): any {
            var output: any = {},
                digitsize: number = this.getDigitSizeFromArray(palette),
                i: number;

            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, digitsize)] = this.makeDigit(palette[i], digitsize);
            }

            return output;
        }

        /**
         * Generates an actual palette Object for a given palette, using the default
         * digitsize.
         * 
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        private getPaletteReferenceStarting(palette: number[][]): any {
            var output: any = {},
                i: number;

            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, this.digitsizeDefault)] = this.makeDigit(i, this.digitsizeDefault);
            }

            return output;
        }

        /**
         * Finds which rgba value in a palette is closest to a given value. This is
         * useful for determining which color in a pre-existing palette matches up
         * with a raw image's pixel. This is determined by which palette color has
         * the lowest total difference in integer values between r, g, b, and a.
         * 
         * @param {Array} palette   The palette of pre-existing colors.
         * @param {Array} rgba   The RGBA values being assigned a color, as Numbers
         *                       in [0, 255].    
         * @return {Number} The closest matching color index.
         */
        private getClosestInPalette(palette: number[][], rgba: number[] | Uint8ClampedArray): number {
            var bestDifference: number = Infinity,
                difference: number,
                bestIndex: number,
                i: number;

            for (i = palette.length - 1; i >= 0; i -= 1) {
                difference = this.arrayDifference(palette[i], rgba);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestIndex = i;
                }
            }

            return bestIndex;
        }

        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         * 
         * @param {String} string   The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         * @return {String}
         */
        private stringOf(str: string, times: number = 1): string {
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
        }

        /**
         * Turns a Number into a String with a prefix added to pad it to a certain
         * number of digits.
         * 
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @param {String} [prefix]   A prefix to repeat for padding (by default,
         *                            "0").
         * @return {String}
         * @example 
         * makeDigit(7, 3); // '007'
         * makeDigit(7, 3, 1); // '117'
         */
        private makeDigit(num: number | string, size: number, prefix: string = "0"): string {
            return this.stringOf(prefix, Math.max(0, size - String(num).length)) + num;
        }

        /**
         * Curry wrapper around makeDigit that reverses size and number argument 
         * order. Useful for binding makeDigit.
         * 
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @return {String}
         */
        private makeSizedDigit(size: number, num: number): string {
            return this.makeDigit(num, size, "0");
        }

        /**
         * Replaces all instances of an element in an Array.
         * 
         * @param {Array}
         * @param {Mixed} removed   The element to remove.
         * @param {Mixed} inserted   The element to insert.
         */
        private arrayReplace(array: any[], removed: any, inserted: any): any[] {
            for (var i: number = array.length - 1; i >= 0; i -= 1) {
                if (array[i] === removed) {
                    array[i] = inserted;
                }
            }

            return array;
        }

        /**
         * Computes the sum of the differences of elements between two Arrays of
         * equal length.
         * 
         * @param {Array} a
         * @param {Array} b
         * @return {Number}
         */
        private arrayDifference(a: number[] | Uint8ClampedArray, b: number[] | Uint8ClampedArray): number {
            var sum: number = 0,
                i: number;

            for (i = a.length - 1; i >= 0; i -= 1) {
                sum += Math.abs(a[i] - b[i]) | 0;
            }

            return sum;
        }

        /**
         * @param {Array}
         * @return {Object} An Object with an index equal to each element of the 
         *                  Array.
         */
        private getValueIndices(array: any[]): any {
            var output: any = {},
                i: number;

            for (i = 0; i < array.length; i += 1) {
                output[array[i]] = i;
            }

            return output;
        }

        /**
         * Curry Function to retrieve a member of an Object. Useful for binding.
         * 
         * @param {Object} object
         * @param {String} key
         * @return {Mixed}
         */
        private getKeyValue(object: any, key: string): any {
            return object[key];
        }

        /**
         * Follows a path inside an Object recursively, based on a given path.
         * 
         * @param {Mixed} object
         * @param {String[]} path   The ordered names of attributes to descend into.
         * @param {Number} num   The starting index in path.
         * @return {Mixed}
         */
        private followPath(obj: any, path: string[], num: number): any {
            if (num < path.length && obj.hasOwnProperty(path[num])) {
                return this.followPath(obj[path[num]], path, num + 1);
            }

            return obj;
        }
    }
}
