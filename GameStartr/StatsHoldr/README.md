# StatsHoldr

A versatile container to store and manipulate values in localStorage, and
optionally keep an updated HTML container showing these values. Operations such
as setting, increasing/decreasing, and default values are all abstracted
automatically. Values are stored in memory as well as in localStorage for fast
lookups.

Each StatsHoldr instance requires proliferate and createElement 
functions (such as those given by the EightBittr prototype).


## Basic Architecture

#### Important APIs

* **get(***`key`***)** - Retrieves the value under the given key. 

* **set(***`key`, `value`***)** - Sets the value under the given key. If the key 
was specified as stored ocally, localStorage is updated.

* **getContainer()** - Retrieves the HTML element with children for each stored
value that was specified as keeping an element.

#### Important Member Variables

* **values** *`Object<String, Object>`* - The objects being stored, keyed as
Object<String, Object>.

* **localStorage** *`Object`* - A reference to localStorage or, if provided or
needed, a replacement object.

* **container** *`HTMLEement`* - An HTML element with children for each stored
value that was specified as keeping an element.

#### Constructor Arguments

* **prefix** *`String`* - A string prefix to prepend to key names in 
localStorage.

* **proliferate** *`Function`* - A Function that takes in a recipient Object and 
a donor Object, and copies attributes over. Generally given by 
EightBittr.prototype to minimize duplicate code.

* **createElement** *`Function`* - A Function to create an Element of a given
String type and apply attributes from subsequent Objects. Generally given by
EightBittr.prototype to reduce duplicate code.

* **values** *`Object`* - The keyed values to be stored, as well as all 
associated information with them. The names of values are keys in the values 
Object.

* **[localStorage]** *`Object`* - A substitute for localStorage, generally used 
as a shim (defaults to window's localStorage, or a new Object if that does not 
exist).

* **[doMakeContainer]** *`Boolean`* - Whether an HTML container with children
for each value should be made (defaults to false).

* **[defaults]** *`Object`* - Default attributes for each value.

* **[separator]** *`String`* - A String to place between keys and values in the
HTML container (defaults to "").

* **[callbackArgs]** *`Array`* - Arguments to pass via Function.apply to 
triggered callbacks (defaults to []).


## Sample Usage

1. Creating and using a StatsHoldr to store user statistics.

    ```javascript
    var StatsHolder = new StatsHoldr({
        "prefix": "MyStatsHoldr",
        "values": {
            "bestStage": {
                "valueDefault": "Beginning",
                "storeLocally": true
            },
            "bestScore": {
                "valueDefault": 0,
                "storeLocally": true
            }
        },
        "proliferate": EightBittr.prototype.proliferate,
        "createElement": EightBittr.prototype.createElement
    });
    StatsHolder.set("bestStage", "Middle");
    StatsHolder.set("bestScore", 9001);
    console.log(StatsHolder.get("bestStage")); // "Middle"
    console.log(StatsHolder.get("bestScore")); // "9001"
    ```

2. Creating and using a StatsHoldr to show user statistics in HTML elements.

    ```javascript
    var StatsHolder = new StatsHoldr({
        "prefix": "MyStatsHoldr",
        "doMakeContainer": true,
        "containers": [
            ["table", {
                "id": "StatsOutside",
                "style": {
                    "textTransform": "uppercase"
                }
            }],
            ["tr", {
                "id": "StatsInside"
            }]
        ],
        "defaults": {
            "element": "td"
        },
        "separator": "<br />",
        "values": {
            "bestStage": {
                "valueDefault": "Beginning",
                "hasElement": true,
                "storeLocally": true
            },
            "bestScore": {
                "valueDefault": 0,
                "hasElement": true,
                "storeLocally": true
            }
        },
        "proliferate": EightBittr.prototype.proliferate,
        "createElement": EightBittr.prototype.createElement
    });
    document.body.appendChild(StatsHolder.getContainer());
    StatsHolder.set("bestStage", "Middle");
    StatsHolder.set("bestScore", 9001);
    ```