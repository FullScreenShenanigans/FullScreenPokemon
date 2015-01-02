# PixelRendr.js

A moderately inefficient graphics module designed to compress images as compressed text blobs, store the text blobs in a folder-like system, and later load those images via cached class-based lookups. These tasks are to be performed and cached quickly enough for use in real-time environments, such as video games.

## Summary

At its core, PixelRendr.js is a library. It takes in sprites and string keys to store them under, and offers a fast lookup API. The internal folder structure storing images is at its core a tree, where strings are nodes similar to CSS classNames. See StringFilr.js for more information on storage, and ChangeLinr.js for the processing framework.

#### Generating Sprites

The most straightforward way is to use the encodeUri API. Rendering is done by loading an image onto an HTML <img> element, so a browser is required; any image format supported by that browser may be provided.

```javascript
MyPixelRender.encodeURI("http://my.image.url.gif", function (results) {
    console.log(results);
});
```

#### Sprites Format

To start, each PixelRendr keeps a global "palette" as an Array[]:
    
```javascript
[
    [0, 0, 0, 0],         // transparent
    [255, 255, 255, 255], // white
    [0, 0, 0, 255],       // black
    // ... and so on
]
````

Ignoring compression, sprites are stored as a Number[]. For example:

```javascript
"00000001112"
```
    
Using the above palette, this represents transparent pixels, three white pixels, and a black pixel. Most images are much larger and more complex than this, so a couple of compression techniques are applied:

1. **Palette Mapping**

    It is necessary to have a consistent number of digits in images, as 010 could be [0, 1, 0], [0, 10], or etc. So, for palettes with more than ten colors, [1, 14, 1] would use ["01", "14", "01"]:

    ```javascript
    "011401011401011401011401011401011401011401"
    ```

    We can avoid this wasted character space by instructing a sprite to only use a subset of the pre-defined palette:

    ```javascript
    "p[1,14]010010010010010010010"
    ```

    The 'p[0,14]' tells the renderer that this sprite only uses colors 0 and 14, so the number 0 should refer to palette number 1, and the number 1 should refer to palette number 14.

2. **Character Repetition**

    Take the following wasteful sprite:

    ```javascript
    "p[0]0000000000000000000000000000000000000000000000000"
    ```

    We know the 0 should be printed 35 times, so the following notation is used to indicate "Print ('x') 0 35 times (','))":

    ```javascript
    "p[0]x035,"
    ```

3. **Filters**

    Many sprites are different versions of other sprites, often simply identical or miscolored (the only two commands supported so far). So, a library may declare the following filter:

    ```javascript
    "Sample": [ "palette", { "00": "03" } ]
    ```

    ...along with a couple of sprites:

    ```javascript
    "foo": "p[0,7,14]000111222000111222000111222",
    "bar": [ "filter", ["foo"], "Sample"]
    ```

    The "bar" sprite will be a filtered version of foo, using the Sample filter. The Sample filter instructs the sprite to replace all instances of "00" with "03", so "bar" will be equivalent to:
 
   ```javascript
   "bar": "p[3,7,14]000111222000111222000111222"
   ```
 
    Another instruction you may use is "same", which is equivalent to directly copying a sprite with no changes:

    ```javascript
    "baz": [ "same", ["bar"] ]
    ```

4. **"Multiple" sprites**

    Sprites are oftentimes of variable height. Pipes in Mario, for example, have a top opening and a shaft of potentially infinite height. Rather than use two objects to represent the two parts, sprites may be directed to have one sub-sprite for the top/bottom or left/right, with a single sub-sprite filling in the middle. Pipes, then, would use a top and middle.

    ```javascript
    [ "multiple", "vertical", {
        "top": "{upper image data}",
        "bottom": "{repeated image data}"
    } ]
    ```

#### Important Member Variables

* **BaseFiler** *`StringFilr`* - A queryable interface on top of the base 
library.

* **ProcessorBase**  *`ChangeLinr`* - Applies processing functions to turn
raw strings into partial sprites.

* **ProcessorDims** *`ChangeLinr`* - Takes partial sprites and repeats rows,
then checks for dimension flipping.

* **ProcesserEncode** *`CHangeLinr`* - Reverse of ProcessorBase: takes real
images and compresses their data into sprites.

#### Constructor Arguments

* **paletteDefault** *`Array[]`* - The palette of colors to use for sprites.
sprites. This should be an Array of Number[4]s representing rgba values.

* **[library]** *`Object`* - A library of sprites to process.

* **[filters]** *`Object`* - Filters that may be used by sprites in the library.

* **[scale]** *`Number`* - An amount to expand sprites by when processing (by
default, 1 for not at all).

* **[flipVert]** *`String`* - What sub-class in decode keys should indicate a
sprite is to be flipped  ertically (by default, "flip-vert").

* **[flipHoriz]** *`String`* - What sub-class in decode keys should indicate a
sprite is to be flipped horizontally (by default, "flip-horiz").

* **[spriteWidth]** *`String`* - What key in attributes should contain sprite
widths (by default, "spriteWidth").

* **[spriteHeight]** *`String`* - What key in attributes should contain sprite
heights (by default, "spriteHeight").

* **[Uint8ClampedArray]** *`Function`* - What internal storage container should
be used for pixel data (by default, Uint8ClampedArray).

## Sample Usage

1. Creating and using a PixelRendr to create a simple black square.

    ```javascript
    var PixelRender = new PixelRendr({
            "paletteDefault": [
                [0, 0, 0, 255] // black
            ],
            "library": {
                "BlackSquare": "x064,"
            }
        }),
        sizing = {
            "spriteWidth": 8,
            "spriteHeight": 8
        },
        sprite = PixelRender.decode("BlackSquare", sizing),
        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        imageData;

    canvas.width = sizing.spriteWidth;
    canvas.height = sizing.spriteHeight;

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    PixelRender.memcpyU8(sprite, imageData.data);
    context.putImageData(imageData, 0, 0);
    ```
    
2. Creating and using a PixelRendr to create a simple white square, using the
   simple black square as reference for a filter.
   
   ```javascript
   var PixelRender = new PixelRendr({
            "paletteDefault": [
                [0, 0, 0, 255],      // black
                [255, 255, 255, 255] // white
            ],
            "library": {
                "BlackSquare": "x064,",
                "WhiteSquare": ["filter", ["BlackSquare"], "Invert"]
            },
            "filters": {
                "Invert": ["palette", {
                    "0": 1,
                    "1": 0
                }]
            }
        }),
        sizing = {
            "spriteWidth": 8,
            "spriteHeight": 8
        },
        sprite = PixelRender.decode("WhiteSquare", sizing),
        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        imageData;

    canvas.width = sizing.spriteWidth;
    canvas.height = sizing.spriteHeight;

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    PixelRender.memcpyU8(sprite, imageData.data);
    context.putImageData(imageData, 0, 0);
    ```