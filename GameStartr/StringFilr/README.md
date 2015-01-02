# StringFilr

A general utility for retrieving data from an Object based on nested class 
names. You can think of the internal "library" Object as a tree structure,
such that you can pass in a listing (in any order) of the path to data for 
retrieval.


## Basic Architecture

#### Important APIs

* **get(***`key`***)** - Retrieves the deepest matching data in the library for
the key. 

#### Important Member Variables

* **library** *`Object<String, Mixed>`* - The stored library of data, set up 
as a tree structure.

* **cache** *`Object<String, Mixed>`* - Cached results from get calls.

* **normal** *`String`* - An optional string to be used as a default key to 
recurse on during searches if no provided keys matched.

* **requireNormalKey** *`Boolean`* - Whether the library should be checked at
the beginning to ensure there are no directories that don't have the normal
as a key.

#### Constructor Arguments

* **library** *`Object`*

* **[normal]** *`String`*

* **[requireNormalKey]** *`Boolean`*


## Sample Usage

1. Creating and using a StringFilr to store simple measurements.

    ```javascript
    var StringFiler = new StringFilr({
        "library": {
            "cup": "8oz",
            "gallon": "128oz",
            "half": {
                "cup": "4oz",
                "gallon": "64oz",
            }
        }
    });
    console.log(StringFiler.get("cup")); // "8oz"
    console.log(StringFiler.get("half cup")); // "4oz"
    ```

2. Creating and using a StringFilr to store order-sensitive information.

    ```javascript
    var StringFiler = new StringFilr({
        "library": {
            "milk": {
                "chocolate": "A lighter chocolate"
            },
            "chocolate": {
                "milk": "Milk mixed with syrup" 
            }
        }
    });
    console.log(StringFiler.get("milk chocolate")); // "A lighter chocolate"
    console.log(StringFiler.get("chocolate milk")); // "Milk mixed with syrup"
    ```

3. Creating and using a StringFilr to store a few people's measurements.

    ```javascript
    var StringFiler = new StringFilr({
        "normal": "color",
        "library": {
            "my": {
                "color": {
                    "eye": "blue-green",
                    "hair": "dirty blonde"
                },
                "major": "Computer Science"
            },
            "Mariah's": {
                "color": {
                    "eye": "brown",
                    "hair": "blonde"
                },
                "major": "Biomedical Engineering"
            },
            "Brandon's": {
                "color": {
                    "eye": "black",
                    "hair": "black"
                },
                "major": "Computer Science"
            }
        }
    });
    console.log(StringFiler.get("my major")); // "Computer Science"
    console.log(StringFiler.get("Mariah's eye color")); // "brown"
    console.log(StringFiler.get("Brandon's hair")); // "black"
    ```