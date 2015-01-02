# ObjectMakr

An Abstract Factory for JavaScript classes that automates the process of setting
constructors' prototypal inheritance. A sketch of class inheritance and a 
listing of properties for each class is taken in, and dynamically accessible
function constructors are made available.


## Basic Architecture

#### Important APIs

* **make(***`type`[, `settings`]***)** - Creates a new instance of the given type 
and returns it. If desired, any settings are applied to it.

* **getFunction(***`type`***)** - Returns the constructor of the given class.

* **getFunctions() - Returns the constructor of the given class.

#### Important Member Variables

* **inheritance** *`Object<String, Object>`* - The sketch of class inheritance,
as a tree structure.

* **properties** *`Object<String, Object>`* - The mapping of properties, where
each class may store attributes under its keyed name.

* **functions** *`Object<String, Function>`* - The auto-generated function 
constructors, keyed by their names.

#### Constructor Arguments

* **inheritance** *`Object<String, Object>`*

* **properties** *`Object<String, Object>`*

* **[doPropertiesFull]** *`Boolean`* - Whether a full property mapping (that is,
one including all properties of parent classes) should be made for each class
(defaults to false).

* **[indexMap]** *`Object`* - Alternative aliases for properties that can be
used as shorthand shortcuts under properties.


## Sample Usage

1. Creating and using an ObjectMakr to generate a shape class hierarchy.

    ```javascript
    var ObjectMaker = new ObjectMakr({
        "inheritance": {
            "Circle": {},
            "Rectangle": {
                "Square": {}
        },
        "properties": {
            "Circle": {
                "perimeter": "2 * pi * radius",
                "area": "pi * radius ^ 2"
            },
            "Rectangle": {
                "perimeter": "2 * length + 2 * width",
                "area": "length * width"
            },
            "Square": {
                "perimeter": "4 * width",
                "area": "width ^ 2"
            }
        }
    });
    console.log(ObjectMaker.make("Square")); // Square {constructor: function... 
    console.log(ObjectMaker.make("Square").area); // "width ^ 2
    console.log(ObjectMaker.getFunction("Square")); // function Square() {}
    ```

2. Creating and using an ObjectMakr to generate a shape class hierarchy using an
   index mapping.

   ```javascript
    var ObjectMaker = new ObjectMakr({
        "indexMap": ["perimeter", "area"],
        "inheritance": {
            "Circle": {},
            "Rectangle": {
                "Square": {}
        },
        "properties": {
            "Circle": ["2 * pi * radius", "pi * radius ^ 2"],
            "Rectangle": ["2 * length + 2 * width", "area": "length * width"],
            "Square": ["perimeter": "4 * width", "area": "width ^ 2"]
        }
    });
    console.log(ObjectMaker.make("Square")); // Square {constructor: function... 
    console.log(ObjectMaker.make("Square").area); // "width ^ 2"
    console.log(ObjectMaker.getFunction("Square")); // function Square() {}
    ```