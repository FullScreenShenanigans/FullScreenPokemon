# MapsCreatr.js

Storage container and lazy loader for GameStarter maps that is the back-end
counterpart to MapsHandlr.js. Maps are created with their custom Location and
Area members, which are initialized the first time the map is retrieved. 
Areas contain a "creation" Object[] detailing the instructions on creating 
that Area's "PreThing" objects, which store Things along with basic position
information. 

In short, a Map contains a set of Areas, each of which knows its size and the
steps to create its contents. Each Map also contains a set of Locations, 
which are entry points into one Area each. 

See Schema.json for the minimum and recommended format for Maps, Locations,
Areas, and creation commands.


## Basic Architecture

#### Important APIs

* **storeMap(***`name`, `settings`***)** - Creates and stores a new Map, though
the actual loading of Areas and Locations is deferred to getMap.

* **getMap(***`name`***)** - Retrieves the Map of the given name. If the map has
not been retrieved before, the internal one-to-many Map->Area and Area->Location
relationships are set.

* **getPreThings(***`location`***)** - Processes and returns the PreThings that
are to inhabit the Area per its creation instructions. These will be stored in 
an Object with a sub-Object for each groupType, each of which will have a sorted
Array for each direction: "xInc", "xDec", "yInc", and "yDec".

#### Important Member Variables

* **ObjectMaker** *`ObjectMakr`* - An ObjectMakr factory used to create Maps,
Areas, Locations, and Things.

* **maps** *`Object<Map>`* - A listing of all stored maps, keyed by name.

* **groupTypes** *`String[]`* - The names of GroupHoldr groups PreThings may be
in, which will become sub-Object keys in getPreThings.

* **macros** *`Object<Function>`* - Shortcut macros that are allowed as creation
arguments to automated commonly repeated tasks.

#### Constructor Arguments

* **ObjectMaker** *`ObjectMakr`*

* **groupTypes** *`String[]`*

* **[keyGroupType]** *`String`* - The key for Things to determine what group
they belong to (by default, "groupType").

* **[keyEntrance]** *`String`* - The key for Things to determine what, if any,
Location they open up to (by default, "entrance").

* **[macros]** *`Object`* - An optional listing of macros that can be used to
to automate common operations.

* **[scope]** *`Mixed`* - A scope to give as a last parameter to macro Functions
Functions (by default, self).

* **[entrances]** *`Object`* -  Optional entrance Functions to use as the 
openings in Locations.

* **[requireEntrance]** *`Boolean`* - Whether Locations must have an entrance
Function defined by "entry" (by default, false).

* **[maps]** *`Object`* - Any maps that should immediately be stored via a
storeMaps call, keyed by name.


## Sample Usage

1.  Creating and using a MapsCreatr to store a very simple Map.

    ```javascript
    var MapsCreator = new MapsCreatr({
            "ObjectMaker": new ObjectMakr({
                "doPropertiesFull": true,
                "inheritance": {
                    "Map": {},
                    "Area": {},
                    "Location": {},
                    "Thing": {
                        "SomeThing": {}
                    }
                },
                "properties": {
                    "SomeThing": {
                        "title": "SomeThing",
                        "groupType": "Thing",
                        "width": 7,
                        "height": 7
                    }
                }
            }),
            "groupTypes": ["Thing"],
            "maps": {
                "MyFirstMap": {
                    "locations": [
                        { "area": 0 }
                    ],
                    "areas": [{
                        "creation": [
                            { "location": 0 },
                            { "thing": "SomeThing", "x": 3, "y": 4 }
                        ]
                    }]
                }
            }
        }),
        map = MapsCreator.getMap("MyFirstMap");

    // Map { locations: Array[1], areas: Array[1], areasRaw: Array[1], ... }
    console.log(map);

    // Area { creation: Array[1], map: Map, name: "0", boundaries: Object, ... }
    console.log(map.areas[0]);

    // Object { thing: "SomeThing", x: 3, y: 4 }
    console.log(map.areas[0].creation[0]);
    ```

2. Creating and using a MapsCreatr to store a simple Map with a macro and look
   look at what will be created when it's used.
   
   ```javascript
    var MapsCreator = new MapsCreatr({
            "ObjectMaker": new ObjectMakr({
                "doPropertiesFull": true,
                "inheritance": {
                    "Map": {},
                    "Area": {},
                    "Location": {},
                    "Thing": {
                        "SomeThing": {}
                    }
                },
                "properties": {
                    "SomeThing": {
                        "title": "SomeThing",
                        "groupType": "Thing",
                        "width": 7,
                        "height": 7
                    }
                }
            }),
            "groupTypes": ["Thing"],
            "macros": {
                "Fill": function (reference) {
                    var output = [],
                        thing = reference.thing,
                        between = reference.between || 10,
                        times = reference.times || 1,
                        x = reference.x || 0,
                        y = reference.y || 0;
                    
                    while (times > 0) {
                        output.push({
                            "thing": reference.thing,
                            "x": x,
                            "y": y
                        });
                        x += between;
                        times -= 1;
                    }
                    
                    return output;
                }
            },
            "maps": {
                "MySecondMap": {
                    "locations": [
                        { "area": 0 }
                    ],
                    "areas": [{
                        "creation": [
                            { "location": 0 },
                            { "macro": "Fill", "thing": "SomeThing", "times": 7, "x": 3, "y": 4 }
                        ]
                    }]
                }
            }
        }),
        map = MapsCreator.getMap("MySecondMap"),
        prethings = MapsCreator.getPreThings(map.areas[0]);

    // Object {Thing: Object}
    console.log(prethings);

    // Object { xInc: Array[7], xDec: Array[7], yInc: Array[7], yDec: ... }
    console.log(prethings.Thing);

    // [PreThing, PreThing, PreThing, PreThing, PreThing, PreThing, PreThing]
    console.log(prethings.Thing.xInc);

    // PreThing { thing: SomeThing, title: "SomeThing", reference: Object, ... }
    console.log(prethings.Thing.xInc[0]);
    ```