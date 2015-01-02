# WorldSeedr.js

A randomization utility to automate random, recursive generation of
possibilities based on a preset position and probability schema. Each
"possibility" in the schema contains a width, height, and instructions on what
type of contents it contains, which are either a preset listing or a
randomization of other possibilities of certain probabilities. Additional
functionality is provided to stagger layout of children, such as spacing between
possibilities. 

See Schema.json for a listing of allowed possibility properties.


## Basic Architecture

#### Important APIs

* **generate(***`name`, `position`***)** - Generates a collection of randomly 
chosen possibilities based on the given schema mapping. These will fit within 
the given position, which should container a top, right, bottom, and left.

* **generateFull(***`schema`***)** - Recursively calls generateFull on a schema
and its generated children to continuously add to generatedCommands. This uses
`generate` as a utility.

* **runGeneratedCommands()** - Calls the onPlacement callback on 
runGeneratedCommands. 

* **clearGeneratedCommands()** - Clears runGeneratedCommands so generateFull
can start with a clean slate.

#### Important Member Variables

* **possibilities** *`Object`* A very large listing of possibilities, keyed by 
title.

* **random** *`Function`* - A Function that may replace Math.random internally.

* **onPlacement** *`Function`* - A callback to run on all generated commands in
runGeneratedCommands.

* **generatedCommands** *`Object[]`* - Generated outputs by generateFull. This
isn't cleared except when the user asks via clearGeneratedCommands.

#### Constructor Arguments

* **possibilities** *`Object`*

* **[random]** *`Function`*

* **[onPlacement]** *`Function`*


## Sample Usage

1. Creating and using a WorldSeedr to generate a simple square.

    ```javascript
    var WorldSeeder = new WorldSeedr({
            "possibilities": {
                "Square": {
                    "width": 8,
                    "height": 8,
                    "contents": {
                        "mode": "Certain",
                        "children": [{
                            "type": "Known",
                            "title": "Square"
                        }]
                    }
                }
            }
        }),
        generated = WorldSeeder.generate("Square", {
            "top": 8,
            "right": 8,
            "bottom": 0,
            "left": 0
        });

    // Object {top: 8, right: 8, bottom: 0, left: 0, children: Array[1]}
    console.log(generated);

    // Object {title: "Square", type: "Known", arguments: undefined, width: 8...}
    console.log(generated.children[0]);
    ```

2. Creating and using a WorldSeedr to generate a square snapped to to the top of 
a tall area.

    ```javascript
    var WorldSeeder = new WorldSeedr({
            "possibilities": {
                "Square": {
                    "width": 8,
                    "height": 8,
                    "contents": {
                        "mode": "Certain",
                        "snap": "top",
                        "children": [{
                            "type": "Known",
                            "title": "Square"
                        }]
                    }
                }
            }
        }),
        generated = WorldSeeder.generate("Square", {
            "top": 16,
            "right": 8,
            "bottom": 0,
            "left": 0
        }),
        square = generated.children[0];

    // Square is located at: {16, 8, 8, 0}
    console.log("Square is located at: {" + [
        square.top, square.right, square.bottom, square.left
    ].join(", ") + "}");
    ```

3. Creating and using a WorldSeedr to generate random shapes of random colors
sporadically within a wide area.

    ```javascript
    var WorldSeeder = new WorldSeedr({
            "possibilities": {
                "Shapes": {
                    "width": 40,
                    "height": 8,
                    "contents": {
                        "mode": "Random",
                        "direction": "right",
                        "spacing": {
                            "min": 0,
                            "max": 4,
                            "units": 2
                        },
                        "children": [{
                            "percent": 35,
                            "title": "Square",
                            "arguments": [{
                                "percent": 50,
                                "values": {
                                    "color": "Red"
                                }
                            }, {
                                "percent": 50,
                                "values": {
                                    "color": "Purple"
                                }
                            }]
                        }, {
                            "percent": 35,
                            "title": "Circle",
                            "arguments": [{
                                "percent": 50,
                                "values": {
                                    "color": "Orange"
                                }
                            }, {
                                "percent": 50,
                                "values": {
                                    "color": "Blue"
                                }
                            }]
                        }, {
                            "percent": 30,
                            "title": "Triangle",
                            "arguments": [{
                                "percent": 50,
                                "values": {
                                    "color": "Yellow"
                                }
                            }, {
                                "percent": 50,
                                "values": {
                                    "color": "Green"
                                }
                            }]
                        }]
                    }
                },
                "Square": {
                    "width": 8,
                    "height": 8,
                    "contents": {
                        "mode": "Certain",
                        "children": [{
                            "type": "Known",
                            "title": "Square",
                            "arguments": {
                                "red": "blue"
                            }
                        }]
                    }
                },
                "Circle": {
                    "width": 8,
                    "height": 8,
                    "contents": {
                        "mode": "Certain",
                        "children": [{
                            "type": "Known",
                            "title": "Circle"
                        }]
                    }
                },
                "Triangle": {
                    "width": 8,
                    "height": 8,
                    "contents": {
                        "mode": "Certain",
                        "children": [{
                            "type": "Known",
                            "title": "Triangle"
                        }]
                    }
                }
            }
        }),
        generated = WorldSeeder.generate("Shapes", {
            "top": 8,
            "right": 40,
            "bottom": 0,
            "left": 0
        }),
        output = [];

    generated.children.forEach(function (child) {
        output.push(
            child.arguments.color + " " + child.title + " at " + child.left
        );
    });

    // One possibility:
    // [
    //     "Yellow Triangle at 0", 
    //     "Yellow Triangle at 8", 
    //     "Purple Square at 18", 
    //     "Orange Circle at 26"
    // ]
    // Another possibility:
    // [
    //     "Green Triangle at 0",
    //     "Yellow Triangle at 8",
    //     "Red Square at 20", 
    //     "Orange Circle at 30"
    // ]
    console.log(output);
    ```