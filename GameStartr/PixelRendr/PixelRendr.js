/**
 * PixelRendr.js
 * 
 * A moderately inefficient graphics module designed to compress images as 
 * compressed text blobs, store the text blobs in a folder-like system, and 
 * later load those images via cached class-based lookups. 
 * These tasks are to be performed and cached quickly enough for use in 
 * real-time environments, such as video games.
 * 
 * Summary
 * 
 * At its core, PixelRendr.js is a library. It takes in sprites and string keys
 * to store them under, and offers a fast lookup API. The internal folder
 * structure storing images is at its core a tree, where strings are nodes 
 * similar to CSS classNames. See StringFilr.js for more information on storage,
 * and ChangeLinr.js for the processing framework.
 * 
 * Generating Sprites
 * 
 * The most straightforward way is to use the encodeUri API. Rendering is done
 * by loading an image onto an HTML <img> element, so a browser is required; any
 * image format supported by that browser may be provided.
 * 
 *     MyPixelRender.encodeURI("http://my.image.url.gif", function (results) {
 *         console.log(results);
 *     });
 * 
 * Sprites Format
 * 
 * To start, each PixelRendr keeps a global "palette" as an Array[]:
 *     
 *     [
 *         [0, 0, 0, 0],         // transparent
 *         [255, 255, 255, 255], // white
 *         [0, 0, 0, 255],       // black
 *         // ... and so on
 *     ]
 * 
 * Ignoring compression, sprites are stored as a Number[]. For example:
 * 
 *     "00000001112"
 *     
 * Using the above palette, this represents transparent pixels, three white
 * pixels, and a black pixel. Most images are much larger and more complex than
 * this, so a couple of compression techniques are applied:
 * 
 * 1. Palette Mapping
 * 
 * It is necessary to have a consistent number of digits in images, as 010 could
 * be [0, 1, 0], [0, 10], or etc. So, for palettes with more than ten colors, 
 * [1, 14, 1] would use ["01", "14", "01"]:
 * 
 *     "011401011401011401011401011401011401011401"
 * 
 * We can avoid this wasted character space by instructing a sprite to only use
 * a subset of the pre-defined palette:
 * 
 *     "p[1,14]010010010010010010010"
 * 
 * The 'p[0,14]' tells the renderer that this sprite only uses colors 0 and 14,
 * so the number 0 should refer to palette number 1, and the number 1 should 
 * refer to palette number 14.
 * 
 * 2. Character Repetition
 * 
 * Take the following wasteful sprite:
 * 
 *     "p[0]0000000000000000000000000000000000000000000000000"
 * 
 * We know the 0 should be printed 35 times, so the following notation is used 
 * to indicate "Print ('x') 0 35 times (','))":
 * 
 *     "p[0]x035,"
 * 
 * 3. Filters
 * 
 * Many sprites are different versions of other sprites, often simply identical
 * or miscolored (the only two commands supported so far). So, a library may
 * declare the following filter:
 * 
 *     "Sample": [ "palette", { "00": "03" } ]
 * 
 * ...along with a couple of sprites:
 * 
 *     "foo": "p[0,7,14]000111222000111222000111222"
 * 
 *     "bar": [ "filter", ["foo"], "Sample"]
 * 
 * The "bar" sprite will be a filtered version of foo, using the Sample filter. 
 * The Sample filter instructs the sprite to replace all instances of "00" with 
 * "03", so "bar" will be equivalent to:
 *
 *    "bar": "p[3,7,14]000111222000111222000111222"
 *
 * Another instruction you may use is "same", which is equivalent to directly 
 * copying a sprite with no changes:
 * 
 *    "baz": [ "same", ["bar"] ]
 * 
 * 4. "Multiple" sprites
 * 
 * Sprites are oftentimes of variable height. Pipes in Mario, for example, have
 * a top opening and a shaft of potentially infinite height. Rather than use two
 * objects to represent the two parts, sprites may be directed to have one 
 * sub-sprite for the top/bottom or left/right, with a single sub-sprite filling
 * in the middle. Pipes, then, would use a top and middle.
 * 
 *     [ "multiple", "vertical", {
 *         "top": "{upper image data}",
 *         "bottom": "{repeated image data}"
 *     } ]
 * 
 * @example
 * // Creating and using a PixelRendr to create a simple black square.
 * var PixelRender = new PixelRendr({
 *         "paletteDefault": [
 *             [0, 0, 0, 255] // black
 *         ],
 *         "library": {
 *             "BlackSquare": "x064,"
 *         }
 *     }),
 *     sizing = {
 *         "spriteWidth": 8,
 *         "spriteHeight": 8
 *     },
 *     sprite = PixelRender.decode("BlackSquare", sizing),
 *     canvas = document.createElement("canvas"),
 *     context = canvas.getContext("2d"),
 *     imageData;
 * 
 * canvas.width = sizing.spriteWidth;
 * canvas.height = sizing.spriteHeight;
 * 
 * imageData = context.getImageData(0, 0, canvas.width, canvas.height);
 * PixelRender.memcpyU8(sprite, imageData.data);
 * context.putImageData(imageData, 0, 0);
 * 
 * @example
 * // Creating and using a PixelRendr to create a simple white square, using the
 * // simple black square as reference for a filter.
 * var PixelRender = new PixelRendr({
 *         "paletteDefault": [
 *             [0, 0, 0, 255],      // black
 *             [255, 255, 255, 255] // white
 *         ],
 *         "library": {
 *             "BlackSquare": "x064,",
 *             "WhiteSquare": ["filter", ["BlackSquare"], "Invert"]
 *         },
 *         "filters": {
 *             "Invert": ["palette", {
 *                 "0": 1,
 *                 "1": 0
 *             }]
 *         }
 *     }),
 *     sizing = {
 *         "spriteWidth": 8,
 *         "spriteHeight": 8
 *     },
 *     sprite = PixelRender.decode("WhiteSquare", sizing),
 *     canvas = document.createElement("canvas"),
 *     context = canvas.getContext("2d"),
 *     imageData;
 * 
 * canvas.width = sizing.spriteWidth;
 * canvas.height = sizing.spriteHeight;
 * 
 * imageData = context.getImageData(0, 0, canvas.width, canvas.height);
 * PixelRender.memcpyU8(sprite, imageData.data);
 * context.putImageData(imageData, 0, 0);
 * 
 * @todo
 * The first versions of this library were made many years ago by an 
 * inexperienced author, and have undergone only moderate structural revisions
 * since. There are two key improvements that will happen by the end of 2015:
 * 1. On reset, the source library should be mapped to a PartialRender class 
 *    that stores loading status and required ("post") references, to enable
 *    lazy loading. See #71.
 * 2. Once lazy loading is implemented for significantly shorter startup times,
 *    an extra layer of compression should be added to compress the technically
 *    human-readable String sources to a binary-ish format. See #236.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function PixelRendr(settings) {
    "use strict";
    if (!this || this === window) {
        return new PixelRendr(settings);
    }
    var self = this,

        // Container to store the processed, ready-to-display sprites coming out
        // of ProcessorDims
        cache,

        // The base container for storing sprite information. With the addition
        // of lazyloading, library.sprites is initially populated with 
        // placeholder objects containing spriteRaw (raw sprite data), path, and
        // loaded (false).
        library,

        // A StringFilr interface on top of the base library.
        BaseFiler,

        // Applies processing Functions to turn raw Strings into partial 
        // sprites, used during reset calls.
        ProcessorBase,

        // Takes partial sprites and repeats rows, then checks for dimension
        // flipping, used during on-demand retrievals.
        ProcessorDims,

        // Reverse of ProcessorBase: takes real images and compresses their data
        // into sprites.
        ProcessorEncode,

        // The default Array[] used for palettes in sprites.
        paletteDefault,

        // The default digit size (how many characters per number).
        digitsizeDefault,

        // Utility RegExp to split Strings on every #digitsize characters.
        digitsplit,

        // How much to "scale" each sprite by (repeat the pixels this much).
        scale,

        // String keys to know whether to flip a processed sprite based on
        // supplied attributes, vertically or horizontally.
        flipVert,
        flipHoriz,

        // String keys for canvas creation & sizing from attributes.
        spriteWidth,
        spriteHeight,

        // Filters for processing sprites.
        filters,

        // Compatability shim to represent Uint8ClampedArray or a substitute.
        Uint8ClampedArray;

    /**
     * Resets the PixelRendr.
     * 
     * @constructor
     * @param {Array[]} paletteDefault   The palette of colors to use for 
     *                                   sprites. This should be an Array of
     *                                   Number[4]s representing rgba values.
     * @param {Object} [library]   A library of sprites to process.
     *
     * @param {Object} [filters]   Filters that may be used by sprites in the
     *                             library.    
     * @param {Number} [scale]   An amount to expand sprites by when processing
     *                           (by default, 1 for not at all).    
     * @param {String} [flipVert]   What sub-class in decode keys should 
     *                              indicate a sprite is to be flipped 
     *                              vertically (by default, "flip-vert").
     * @param {String} [flipHoriz]   What sub-class in decode keys should 
     *                              indicate a sprite is to be flipped 
     *                              horizontally (by default, "flip-horiz").
     * @param {String} [spriteWidth]   What key in attributes should contain
     *                                 sprite widths (by default, 
     *                                 "spriteWidth").
     * @param {String} [spriteHeight]   What key in attributes should contain
     *                                 sprite heights (by default, 
     *                                 "spriteHeight").
     * @param {Function} [Uint8ClampedArray]    What internal storage container
     *                                          should be used for pixel data
     *                                          (by default, Uint8ClampedArray).
     */
    self.reset = function (settings) {
        if (!settings.paletteDefault) {
            throw new Error("No paletteDefault given to PixelRendr.");
        }
        paletteDefault = settings.paletteDefault;

        digitsizeDefault = getDigitSize(paletteDefault);
        digitsplit = new RegExp('.{1,' + digitsizeDefault + '}', 'g');

        cache = {};

        library = {
            "raws": settings.library || {},
            "posts": [],
        };

        filters = settings.filters || {};

        scale = settings.scale || 1;

        flipVert = settings.flipVert || "flip-vert";
        flipHoriz = settings.flipHoriz || "flip-horiz";

        spriteWidth = settings.spriteWidth || "spriteWidth";
        spriteHeight = settings.spriteHeight || "spriteHeight";

        Uint8ClampedArray = (
            settings.Uint8ClampedArray
            || window.Uint8ClampedArray
            || window.Uint8Array
            || Array
        );

        // The first ChangeLinr does the raw processing of Strings to sprites
        // This is used to load & parse sprites into memory on startup
        ProcessorBase = new ChangeLinr({
            "transforms": {
                "spriteUnravel": spriteUnravel,
                "spriteApplyFilter": spriteApplyFilter,
                "spriteExpand": spriteExpand,
                "spriteGetArray": spriteGetArray
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
        ProcessorDims = new ChangeLinr({
            "transforms": {
                "spriteRepeatRows": spriteRepeatRows,
                "spriteFlipDimensions": spriteFlipDimensions
            },
            "pipeline": [
                "spriteRepeatRows",
                "spriteFlipDimensions"
            ]
        });

        // As a utility, a processor is included to encode image data to sprites
        ProcessorEncode = new ChangeLinr({
            "transforms": {
                "imageGetData": imageGetData,
                "imageGetPixels": imageGetPixels,
                "imageMapPalette": imageMapPalette,
                "imageCombinePixels": imageCombinePixels
            },
            "pipeline": [
                "imageGetData",
                "imageGetPixels",
                "imageMapPalette",
                "imageCombinePixels"
            ],
            "doUseCache": false
        });

        library.sprites = libraryParse(library.raws, '');


        // Post commands are evaluated after the first processing run
        libraryPosts();

        // The BaseFiler provides a searchable 'view' on the library of sprites
        BaseFiler = new StringFilr({
            "library": library.sprites,
            "normal": "normal", // to do: put this somewhere more official?
        });
    };


    /* Simple gets
    */

    /**
     * @return {Object} The base container for storing sprite information.
     */
    self.getBaseLibrary = function () {
        return BaseFiler.getLibrary();
    };

    /**
     * @return {StringFilr} The StringFilr interface on top of the base library.
     */
    self.getBaseFiler = function () {
        return BaseFiler;
    };

    /**
     * @return {ChangeLinr} The processor that turns raw strings into partial
     * sprites.
     */
    self.getProcessorBase = function () {
        return ProcessorBase;
    };

    /**
     * @return {ChangeLinr} The processor that turns partial sprites and repeats
     *                      rows.
     */
    self.getProcessorDims = function () {
        return ProcessorDims;
    };

    /**
     * @return {ChangeLinr} The processor that takes real images and compresses
     *                      their data into sprite Strings.
     */
    self.getProcessorEncode = function () {
        return ProcessorEncode;
    };


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
    self.decode = function (key, attributes) {
        // BaseFiler stores the cache of the base sprites. Note that it doesn't
        // actually require the extra attributes
        var sprite = BaseFiler.get(key);

        if (!sprite) {
            throw new Error("No raw sprite found for " + key + ".");
        }

        // If the sprite has already been loaded, it exists in the cache
        if (cache.hasOwnProperty(key)) {
            return cache[key];
        }

        // Multiple sprites have their sizings taken from attributes
        if (sprite.multiple) {
            if (!sprite.processed) {
                processSpriteMultiple(sprite, key, attributes);
            }
        }
        // Single (actual) sprites process for size (row) scaling, and flipping
        else {
            sprite = ProcessorBase.process(sprite.spriteRaw, sprite.path);
            sprite = cache[key] = ProcessorDims.process(sprite, key, attributes);
        }

        return sprite;
    };

    /**
     * Encodes an image into a sprite via ProcessorEncode.process.
     * 
     * @param {HTMLImageElement} image
     * @param {Function} [callback]   An optional callback to call on the image
     *                                with source as an extra argument.
     * @param {Mixed} [source]   An optional extra argument for callback,
     *                           commonly provided by self.encodeUri as the 
     *                           image source.
     */
    self.encode = function (image, callback, source) {
        var result = ProcessorEncode.process(image);

        if (callback) {
            callback(result, image, source);
        }

        return result;
    };

    /**
     * Fetches an image from a source and encodes it into a sprite via 
     * ProcessEncode.process. An HtmlImageElement is created and given an onload
     * of self.encode.
     * 
     * @param {String} uri
     * @param {Function} callback   A callback for when self.encode finishes to
     *                              call on the results.
     */
    self.encodeUri = function (uri, callback) {
        var image = document.createElement("img");
        image.onload = self.encode.bind(self, image, callback);
        image.src = uri;
    };

    /**
     * @param {String} key
     * @return {Mixed} Returns the base sprite for a key. This will either be a
     *                 Uint8ClampedArray if a sprite is found, or the deepest
     *                 Object in the library.
     */
    self.getSpriteBase = function (key) {
        return BaseFiler.get(key);
    };


    /* Library parsing
     */

    /**
     * Recursive Function to go throw a library and parse it. A copy of the
     * structure is made where each result is either a parsed sprite, a
     * placeholder for a post command, or a recursively generated child Object.
     * 
     * @param {Object} reference   The raw source structure to be parsed.
     * @param {String} path   The path to the current place within the library.
     * @return {Object} The parsed library Object.
     */
    function libraryParse(reference, path) {
        var setnew = {},
            objref, objnew,
            i;

        // For each child of the current layer:
        for (i in reference) {
            objref = reference[i];
            switch (objref.constructor) {
                // If it's a string, parse it
                case String:
                    //setnew[i] = ProcessorBase.process(objref, path + ' ' + i);
                    setnew[i] = {
                        "spriteRaw": objref,
                        "path": path + ' ' + i
                    }
                    break;
                // If it's an array, it should have a command such as 'same' to
                // be post-processed
                case Array:
                    //console.log(i, reference[i], path);
                    library.posts.push({
                        caller: setnew,
                        name: i,
                        command: reference[i],
                        path: path + ' ' + i
                    });
                    break;
                    // If it's an object, simply recurse
                case Object:
                    setnew[i] = libraryParse(objref, path + ' ' + i);
                    break;
            }
        }

        return setnew;
    }

    /**
     * Driver to evaluate post-processing commands, such as copies and filters.
     * This is run after the main processing finishes. Each post command is 
     * given to evaluatePost.
     */
    function libraryPosts() {
        var posts = library.posts,
            post, i;
        for (i = 0; i < posts.length; i += 1) {
            post = posts[i];
            post.caller[post.name] = evaluatePost(
                post.caller, post.command, post.path
            );
        }
    }

    /**
     * Evaluates a post command and returns the result to be used in the 
     * library. It can be "same", "filter", or "vertical".
     * 
     * @param {Object} caller   The place within the library store results in.
     * @param {Array} command   The command from the library, represented as
     *                          ["type", [info...]]
     * @param {String} path   The path to the caller.
     */
    function evaluatePost(caller, command, path) {
        switch (command[0]) {
            // Same: just returns a reference to the target
            // ["same", ["container", "path", "to", "target"]]
            case "same":
                var spriteRaw = followPath(library.raws, command[1], 0);
                switch (spriteRaw.constructor) {
                    case String:
                        //return ProcessorBase.process(spriteRaw, path);
                        return {
                            "spriteRaw": spriteRaw,
                            "path": path
                        }
                    case Array:
                        return evaluatePost(caller, spriteRaw, path);
                    default:
                        return libraryParse(spriteRaw, path);
                }

            // Filter: takes a reference to the target, and applies a filter to it
            // ["filter", ["container", "path", "to", "target"], filters.DoThisFilter]
            // TODO @todo lazy load these too, once some are added in
            case "filter":
                // Find the sprite this should be filtering from
                var spriteRaw = followPath(library.raws, command[1], 0),
                    filter = filters[command[2]];
                if (!filter) {
                    console.log("Invalid filter provided:", command[2], filters);
                    // return spriteRaw;
                    filter = {};
                }
                return evaluatePostFilter(spriteRaw, path, filter);

                // Multiple: uses more than one image, vertically or horizontally
                // Not to be confused with having .repeat = true.
                // ["multiple", "vertical", {
                //    top: "...",       // (just once at the top)
                //    middle: "..."     // (repeated after top)
                //  }
            case "multiple":
                return evaluatePostMultiple(path, command);
        }

        // Commands not evaluated by the switch are unknown and bad
        console.warn("Unknown post command: '" + command[0] + "'.", caller, command, path);
    }

    /**
     * Driver function to recursively apply a filter on a sprite or Object.
     * 
     * @param {Mixed} spriteRaw   What the filter is being applied on (either a
     *                            sprite, or a collection of sprites).    
     * @param {String} path   The path to the spriteRaw in the library.
     * @param {Object} filter   The pre-determined filter to apply.
     */
    function evaluatePostFilter(spriteRaw, path, filter) {
        // If it's just a String, process the sprite normally
        if (spriteRaw.constructor === String) {
            return ProcessorBase.process(spriteRaw, path, {
                filter: filter
            });
        }

        // If it's an Array, that's a post that hasn't yet been evaluated.
        // Evaluate it by the path
        if (spriteRaw instanceof Array) {
            return evaluatePostFilter(followPath(library.raws, spriteRaw[1], 0), spriteRaw[1].join(' '), filter);
        }

        // If it's a generic Object, go recursively on its children
        if (spriteRaw instanceof Object) {
            var output = {},
                i;
            for (i in spriteRaw) {
                output[i] = evaluatePostFilter(spriteRaw[i], path + ' ' + i, filter);
            }
            return output;
        }

        // Anything else is a complaint
        console.warn("Invalid sprite provided for a post filter.", spriteRaw, path, filter);
    }

    /**
     * Creates a SpriteMultiple based on a library's command.
     * 
     * @param {String} path   The path to the SpriteMultiple.
     * @param {Array} command   The instructions from the library, in the form 
     *                          ["multiple", "{direction}", {Information}].
     */
    function evaluatePostMultiple(path, command) {
        var direction = command[1],
            dir_path = ' ' + direction + ' ',
            sections = command[2],
            output = new self.SpriteMultiple(command[1], direction),
            i;

        for (i in sections) {
            output.sprites[i] = ProcessorBase.process(
                sections[i],
                path + direction + i
            );
        }

        output.topheight = sections.topheight | 0;
        output.rightwidth = sections.rightwidth | 0;
        output.bottomheight = sections.bottomheight | 0;
        output.leftwidth = sections.leftwidth | 0;

        output.middleStretch = sections.middleStretch || false;

        return output;
    }


    /**
     * A container around multiple Sprites to be used in conjunction.
     * 
     * @constructor
     * @this {SpriteMultiple}
     * @param {String} direction   What direction of SpriteMultiple (either
     *                             "horizontal", "vertical", or "corners").
     */
    self.SpriteMultiple = function SpriteMultiple(direction) {
        this.direction = direction;
        this.multiple = true;
        this.sprites = {};
        this.decoded = false;
    }

    /**
     * Processes each of the components in a SpriteMultiple. These are all 
     * individually processed using the attributes by the dimensions processor.
     * Each sub-sprite will be processed as if it were in a sub-Object referred
     * to by the path (so if path is "foo bar", "foo bar middle" will be the
     * middle sprite's key).
     * 
     * @param {SpriteMultiple} sprite
     * @param {String} key
     * @param {Object} attributes
     */
    function processSpriteMultiple(sprite, key, attributes) {
        for (var i in sprite.sprites) {
            if (sprite.sprites[i] instanceof Uint8ClampedArray) {
                sprite.sprites[i] = ProcessorDims.process(
                    sprite.sprites[i],
                    key + ' ' + i,
                    attributes
                );
            }
        }

        sprite.processed = true;
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
     *                          'p' and 'x'.
     * @return {String} A version of the sprite with no fancy commands, just
     *                  the numbers.
     */
    function spriteUnravel(colors) {
        var paletteref = getPaletteReferenceStarting(paletteDefault),
            digitsize = digitsizeDefault,
            clength = colors.length,
            current, rep, nixloc, newp, i, len,
            output = "",
            loc = 0;

        while (loc < clength) {
            switch (colors[loc]) {
                // A loop, ordered as 'x char times ,'
                case 'x':
                    // Get the location of the ending comma
                    nixloc = colors.indexOf(",", ++loc);
                    // Get the color
                    current = makeDigit(
                        paletteref[colors.slice(loc, loc += digitsize)],
                        digitsizeDefault
                    );
                    // Get the rep times
                    rep = Number(colors.slice(loc, nixloc));
                    // Add that int to output, rep many times
                    while (rep--) {
                        output += current;
                    }
                    loc = nixloc + 1;
                    break;

                // A palette changer, in the form 'p[X,Y,Z,...]' (or 'p' for default)
                case 'p':
                    // If the next character is a '[', customize.
                    if (colors[++loc] == '[') {
                        nixloc = colors.indexOf(']');
                        // Isolate and split the new palette's numbers
                        paletteref = getPaletteReference(colors.slice(loc + 1, nixloc).split(","));
                        loc = nixloc + 1;
                        digitsize = 1;
                    }
                    // Otherwise go back to default
                    else {
                        paletteref = getPaletteReference(paletteDefault);
                        digitsize = digitsizeDefault;
                    }
                    break;

                // A typical number
                default:
                    output += makeDigit(paletteref[colors.slice(loc, loc += digitsize)], digitsizeDefault);
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
    function spriteExpand(colors) {
        var output = "",
            clength = colors.length,
            current, i = 0,
            j;

        // For each number,
        while (i < clength) {
            current = colors.slice(i, i += digitsizeDefault);
            // Put it into output as many times as needed
            for (j = 0; j < scale; ++j) {
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
    function spriteApplyFilter(colors, key, attributes) {
        // If there isn't a filter (as is the normal), just return the sprite
        if (!attributes || !attributes.filter) {
            return colors;
        }

        var filter = attributes.filter,
            filterName = filter[0];

        if (!filterName) {
            return colors;
        }

        switch (filterName) {
            // Palette filters switch all instances of one color with another
            case "palette":
                // Split the colors on on each digit
                // ('...1234...' => [...,'12','34,...]
                var split = colors.match(digitsplit),
                    i;
                // For each color filter to be applied, replace it
                for (i in filter[1]) {
                    arrayReplace(split, i, filter[1][i]);
                }
                return split.join('');
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
    function spriteGetArray(colors) {
        var clength = colors.length,
            numcolors = clength / digitsizeDefault,
            split = colors.match(digitsplit),
            olength = numcolors * 4,
            output = new Uint8ClampedArray(olength),
            reference, i, j, k;

        // For each color,
        for (i = 0, j = 0; i < numcolors; ++i) {
            // Grab its RGBA ints
            reference = paletteDefault[Number(split[i])];
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
    function spriteRepeatRows(sprite, key, attributes) {
        var parsed = new Uint8ClampedArray(sprite.length * scale),
            rowsize = attributes[spriteWidth] * 4,
            heightscale = attributes[spriteHeight] * scale,
            readloc = 0,
            writeloc = 0,
            si, sj;

        // For each row:
        for (si = 0; si < heightscale; ++si) {
            // Add it to parsed x scale
            for (sj = 0; sj < scale; ++sj) {
                self.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
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
    function spriteFlipDimensions(sprite, key, attributes) {
        if (key.indexOf(flipHoriz) !== -1) {
            if (key.indexOf(flipVert) !== -1) {
                return flipSpriteArrayBoth(sprite, attributes);
            }
            return flipSpriteArrayHoriz(sprite, attributes);
        }

        if (key.indexOf(flipVert) !== -1) {
            return flipSpriteArrayVert(sprite, attributes);
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
    function flipSpriteArrayHoriz(sprite, attributes) {
        var length = sprite.length,
            width = attributes[spriteWidth],
            newsprite = new Uint8ClampedArray(length),
            rowsize = width * 4,
            newloc, oldloc,
            i, j, k;

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
    function flipSpriteArrayVert(sprite, attributes) {
        var length = sprite.length,
            width = attributes[spriteWidth],
            newsprite = new Uint8ClampedArray(length),
            rowsize = width * 4,
            newloc = 0,
            oldloc = length - rowsize,
            i, j, k;

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
    function flipSpriteArrayBoth(sprite) {
        var length = sprite.length,
            newsprite = new Uint8ClampedArray(length),
            oldloc = sprite.length - 4,
            newloc = 0,
            i;

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
    function imageGetData(image) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");

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
    function imageGetPixels(data) {
        var pixels = new Array(data.length / 4),
            occurences = {},
            pixel,
            i, j;

        for (i = 0, j = 0; i < data.length; i += 4, j += 1) {
            pixel = getClosestInPalette(paletteDefault, data.subarray(i, i + 4));
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
    function imageMapPalette(information) {
        var pixels = information[0],
            occurences = information[1],
            palette = Object.keys(occurences),
            digitsize = getDigitSize(palette),
            paletteIndices = getValueIndices(palette),
            numbers = pixels.map(getKeyValue.bind(undefined, paletteIndices));

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
    function imageCombinePixels(information) {
        var palette = information[0],
            numbers = information[1],
            digitsize = information[2],
            threshold = Math.max(3, Math.round(4 / digitsize)),
            output,
            current,
            digit,
            i = 0,
            j;

        output = "p["
            + palette.map(makeSizedDigit.bind(undefined, digitsize)).join(',')
            + "]";

        while (i < numbers.length) {
            j = i + 1;
            current = numbers[i];
            digit = makeDigit(current, digitsize);

            while (current == numbers[j]) {
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
    function getDigitSize(palette) {
        return Number(String(palette.length).length);
    }

    /**
     * Generates an actual palette Object for a given palette, using a digitsize
     * calculated from the palette.
     * 
     * @param {Array} palette
     * @return {Object} The actual palette Object for the given palette, with
     *                  an index for every palette member.
     */
    function getPaletteReference(palette) {
        var output = {},
            digitsize = getDigitSize(palette),
            i;

        for (i = 0; i < palette.length; i += 1) {
            output[makeDigit(i, digitsize)] = makeDigit(palette[i], digitsize);
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
    function getPaletteReferenceStarting(palette) {
        var output = {},
            i;

        for (i = 0; i < palette.length; i += 1) {
            output[makeDigit(i, digitsizeDefault)] = makeDigit(i, digitsizeDefault)
        }

        return output;
    }

    /**
     * Finds which rgba value in a palette is closest to a given value. This is
     * useful for determining which color in a pre-existing palette matches up
     * with a raw image's pixel. This is determined by which palette color has
     * the lowest total difference in integer values between r, g, b, and a.
     * 
     * @param {Array[]} palette   The palette of pre-existing colors.
     * @param {Array} rgba   The RGBA values being assigned a color, as Numbers
     *                       in [0, 255].    
     */
    function getClosestInPalette(palette, rgba) {
        var difference,
            bestDifference = Infinity,
            bestIndex,
            i;

        for (i = palette.length - 1; i >= 0; i -= 1) {
            difference = arrayDifference(palette[i], rgba);
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
     */
    function stringOf(string, times) {
        return (times === 0) ? '' : new Array(1 + (times || 1)).join(string);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     * 
     * @param {Number} number   The original Number being padded.
     * @param {Number} size   How many digits the output must contain.
     * @param {String} [prefix]   A prefix to repeat for padding (by default,
     *                            '0').
     * @return {String}
     * @example 
     * makeDigit(7, 3); // '007'
     * makeDigit(7, 3, 1); // '117'
     */
    function makeDigit(number, size, prefix) {
        return stringOf(
            prefix || '0',
            Math.max(0, size - String(number).length)
        ) + number;
    }

    /**
     * Curry wrapper around makeDigit that reverses size and number argument 
     * order. Useful for binding makeDigit.
     * 
     * @param {Number} number   The original Number being padded.
     * @param {Number} size   How many digits the output must contain.
     * @return {String}
     */
    function makeSizedDigit(size, num) {
        return makeDigit(num, size, '0');
    }

    /**
     * Replaces all instances of an element in an Array.
     * 
     * @param {Array}
     * @param {Mixed} removed   The element to remove.
     * @param {Mixed} inserted   The element to insert.
     */
    function arrayReplace(array, removed, inserted) {
        for (var i = array.length - 1; i >= 0; i -= 1) {
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
    function arrayDifference(a, b) {
        var sum = 0,
            i;

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
    function getValueIndices(array) {
        var output = {},
            i;

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
    function getKeyValue(object, key) {
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
    function followPath(obj, path, num) {
        if (path.hasOwnProperty(num) && obj.hasOwnProperty(path[num])) {
            return followPath(obj[path[num]], path, num + 1);
        }
        return obj;
    }

    /**
     * Copies a stretch of members from one Uint8ClampedArray to another.
     * 
     * @param {Uint8ClampedArray} source
     * @param {Uint8ClampedArray} destination
     * @param {Number} readloc   Where to start reading from in the source.
     * @param {Number} writeloc   Where to start writing to in the source.
     * @param {Number} writelength   How many members to copy over.
     * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
     * @see http://www.javascripture.com/Uint8ClampedArray
     */
    self.memcpyU8 = function (source, destination, readloc, writeloc, writelength) {
        if (!source || !destination || readloc < 0 || writeloc < 0 || writelength <= 0) {
            return;
        }
        if (readloc >= source.length || writeloc >= destination.length) {
            // console.log("Alert: memcpyU8 requested out of bounds!");
            // console.log("source, destination, readloc, writeloc, writelength");
            // console.log(arguments);
            return;
        }

        if (readloc == null) {
            readloc = 0;
        }
        if (writeloc == null) {
            writeloc = 0;
        }
        if (writelength == null) {
            writelength = Math.max(0, Math.min(source.length, destination.length));
        }

        // JIT compilcation help
        var lwritelength = writelength + 0,
            lwriteloc = writeloc + 0,
            lreadloc = readloc + 0;

        while (lwritelength--) {
            destination[lwriteloc++] = source[lreadloc++];
        }
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
     * @param {Boolean} [giveArrays]   Whether the resulting palettes should be
     *                                 converted to Arrays (by default, false).
     * @param {Boolean} [forceZeroColor]   Whether the palette should have a
     *                                     [0,0,0,0] color as the first element
     *                                     even if data does not contain it (by
     *                                     default, false).
     * @return {Uint8ClampedArray[]} A working palette that may be used in 
     *                               sprite settings (Array[] if giveArrays is
     *                               true).
     */
    self.generatePaletteFromRawData = function (data, forceZeroColor, giveArrays) {
        var tree = {},
            colorsGeneral = [],
            colorsGrayscale = [],
            output, i;

        for (i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) {
                forceZeroColor = true;
                continue;
            }

            if (
                tree[data[i]]
                && tree[data[i]][data[i + 1]]
                && tree[data[i]][data[i + 1]][data[i + 2]]
                && tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]
            ) {
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

        colorsGrayscale.sort(function (a, b) {
            return a[0] - b[0];
        });
        console.log(colorsGrayscale.map(function (x) {
            return Array.prototype.slice.call(x).join(", ");
        }).join("\n"));

        colorsGeneral.sort(function (a, b) {
            for (i = 0; i < 4; i += 1) {
                if (a[i] !== b[i]) {
                    return b[i] - a[i];
                }
            }
        });

        if (forceZeroColor) {
            output = [[0, 0, 0, 0]].concat(colorsGrayscale).concat(colorsGeneral);
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
    };


    self.reset(settings || {});
}