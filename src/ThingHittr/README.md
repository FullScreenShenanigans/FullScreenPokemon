# ThingHittr

A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
Things contained in the GroupHoldr's groups have automated collision checking
against configurable sets of other groups, along with performance oprimizations
to help reduce over-reoptimization of Functions.


## Basic Architecture

#### Important APIs

* **cacheHitCheckGroup()** - Caches the hit checks for a group name. The global
check for that group is cached on the name for later use.

* **cacheHitCheckType(***`typeName`, `groupName`***)** - Caches the hit checks 
for a specific type within a group, which involves caching the group's global 
checker, the hit checkers for each of the type's allowed collision groups, and 
the hit callbacks for each of those groups. The result is that you can call 
self.checkHitsOf[typeName] later  on, and expect it to work as anything in 
groupName.

* **generateHitsCheck(***`typeName`***)** - Function generator for a checkHitsOf
tailored to a specific Thing type.

* **self.checkHitsOf[***`typeName`***]** - Collision detection Function for a
Thing. For each Quadrant the Thing is in, for all groups within that Function 
that the Thing's type is allowed to collide with, it is checked for collision 
with the Things in that group. For each Thing it does collide with, the 
appropriate hit Function is called.

#### Important Member Variables

* **globalChecks** *`Object<String, Function>`* - Check functions for Things
within groups to see if they're able to collide in the first place.

* **hitChecks** *`Object<String, Object<String, Function>>`* - Collision
detection Functions to check two Things for collision.

* **hitFunctions** *`Object<String, Object<String, Function>>`* - Hit function
callbacks for when two Things do collide.

#### Constructor Arguments

* **globalCheckGenerators** *`Object<String, Function>`* - Generators for
the cached globalChecks.

* **hitCheckGenerators** *`Object<String, Object<String, Function>>`* - 
Generators for the cached hitChecks.

* **hitFunctions** *`Object<String, Object<String, Function>>`* - Generators
for the cached hitFunctions.


## Sample Usage

1. Creating and using a ThingHitter to find families with the same name.

    ```javascript
    var ThingHitter = new ThingHittr({
            "globalCheckGenerators": {},
            "groupNames": ["Family"],
            "hitCheckGenerators": {
                "Family": {
                    "Family": function () {
                        return function (a, b) {
                            for (var i = 0; i < a.name.length; i += 1) {
                                if (b.name.indexOf(a.name[i]) !== -1) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                }
            },
            "hitFunctionGenerators": {
                "Family": {
                    "Family": function () {
                        return function (a, b) {
                            console.log(a.name + " found!");
                        }
                    }
                }
            }
        }),
        quadrants = [{ 
            "things": {
                "Family": null
            }
        }],
        families = [{
            "groupType": "Family",
            "name": "Smith",
            "numquads": 1,
            "quadrants": [
                quadrants[0]
            ]
        }, {
            "groupType": "Family",
            "name": "Jones",
            "numquads": 1,
            "quadrants": [
                quadrants[0]
            ]
        }, {
            "groupType": "Family",
            "name": "Smith",
            "numquads": 1,
            "quadrants": [
                quadrants[0]
            ]
        }];

    quadrants[0].things.Family = families;

    ThingHitter.cacheHitCheckType("Object", "Family")

    families.forEach(ThingHitter.checkHitsOf.Object);
    ```

2. Creating and using a ThingHitter to find animals with similar DNA to other
animals in their quadrant. Note that some animals will have matches listed
multiple times if they have multiple shared quadrants.

    ```javascript
    var checkGenesGenerator = function () {
            return function (a, b) {
                var total = 0,
                    length = Math.min(a.dna.length, b.dna.length);
                for (i = 0; i < length; i += 1) {
                    if (a.dna[i] === b.dna[i]) {
                        total += 1;
                    }
                }
                return total > 0;
            };
        },
        saySimilarGenerator = function () {
            return function (a, b) {
                console.log(a.thingType + " matches with " + b.thingType);
            }
        },
        ThingHitter = new ThingHittr({
            "globalCheckGenerators": {},
            "groupNames": ["Mammal", "Lizard", "Hybrid"],
            "hitCheckGenerators": {
                "Mammal": {
                    "Mammal": checkGenesGenerator,
                    "Hybrid": checkGenesGenerator
                },
                "Lizard": {
                    "Lizard": checkGenesGenerator,
                    "Hybrid": checkGenesGenerator
                },
                "Hybrid": {
                    "Mammal": checkGenesGenerator,
                    "Lizard": checkGenesGenerator,
                    "Hybrid": checkGenesGenerator
                }
            },
            "hitFunctionGenerators": {
                "Mammal": {
                    "Mammal": saySimilarGenerator,
                    "Hybrid": saySimilarGenerator
                },
                "Lizard": {
                    "Lizard": saySimilarGenerator,
                    "Hybrid": saySimilarGenerator
                },
                "Hybrid": {
                    "Mammal": saySimilarGenerator,
                    "Lizard": saySimilarGenerator,
                    "Hybrid": saySimilarGenerator
                }
            }
        }),
        createQuadrant = function () {
            return {
                "things": {
                    "Mammal": null,
                    "Lizard": null,
                    "Hybrid": null
                }
            };
        },
        quadrants = [
            createQuadrant(), createQuadrant(), createQuadrant()
        ],
        Animal = function Animal(thingType, groupType, dna) {
            this.thingType = thingType;
            this.groupType = groupType;
            this.dna = dna;
        },
        mammals = [
            new Animal("Cat", "Mammal", "AACCTTGGAA"),
            new Animal("Dog", "Mammal", "CCTTGGAACC"),
            new Animal("Rat", "Mammal", "AAGGTTCCAA")
        ],
        lizards = [
            new Animal("Snake", "Lizard", "AAACCCTTTGGGAA"),
            new Animal("Budgie", "Lizard", "CCCTTTGGGAAACC"),
            new Animal("Alligator", "Lizard", "AAAGGGTTTCCCAA")
        ],
        hybrids = [
            new Animal("Monstrosity", "Hybrid", "AACTCCCCCC")
        ],
        i;

    for (i = 0; i < mammals.length; i += 1) {
        ThingHitter.cacheHitCheckType(mammals[i].thingType, "Mammal");
    }
    for (i = 0; i < lizards.length; i += 1) {
        ThingHitter.cacheHitCheckType(lizards[i].thingType, "Lizard");
    }
    for (i = 0; i < hybrids.length; i += 1) {
        ThingHitter.cacheHitCheckType(hybrids[i].thingType, "Hybrid");
    }

    // Cat is in 0 and 1, Dog is everywhere, and Rat is in 1 and 2
    quadrants[0].things.Mammal = [ mammals[0], mammals[1] ];
    quadrants[1].things.Mammal = [ mammals[0], mammals[1], mammals[2] ];
    quadrants[2].things.Mammal = [ mammals[1], mammals[2] ];
    mammals[0].numquads = 2;
    mammals[0].quadrants = [ quadrants[0], quadrants[1] ];
    mammals[1].numquads = 3;
    mammals[1].quadrants = [ quadrants[0], quadrants[1], quadrants[2] ];
    mammals[2].numquads = 2;
    mammals[2].quadrants = [ quadrants[1], quadrants[2] ];

    // Snake is in 0 and 1, Budgie is everywhere, and Alligator is in 1 and 2
    quadrants[0].things.Lizard = [ lizards[0], lizards[1] ];
    quadrants[1].things.Lizard = [ lizards[0], lizards[1], lizards[2] ];
    quadrants[2].things.Lizard = [ lizards[1], lizards[2] ];
    lizards[0].numquads = 2;
    lizards[0].quadrants = [ quadrants[0], quadrants[1] ];
    lizards[1].numquads = 3;
    lizards[1].quadrants = [ quadrants[0], quadrants[1], quadrants[2] ];
    lizards[2].numquads = 2;
    lizards[2].quadrants = [ quadrants[1], quadrants[2] ];

    // Monstrosity is everywhere!
    quadrants[0].things.Hybrid = [ hybrids[0] ];
    quadrants[1].things.Hybrid = [ hybrids[0] ];
    quadrants[2].things.Hybrid = [ hybrids[0] ];
    hybrids[0].numquads = 2;
    hybrids[0].quadrants = [ hybrids[0] ];

    for (i = 0; i < mammals.length; i += 1) {
        ThingHitter.checkHitsOf[mammals[i].thingType](mammals[i]);
    }
    ```