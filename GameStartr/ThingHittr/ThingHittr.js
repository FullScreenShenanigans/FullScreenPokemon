/**
 * ThingHittr.js
 * 
 * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
 * Things contained in the GroupHoldr's groups have automated collision checking
 * against configurable sets of other groups, along with performance  
 * optimizations to help reduce over-reoptimization of Functions.
 * 
 * @example
 * // Creating and using a ThingHitter to find families with the same name.
 * var ThingHitter = new ThingHittr({
 *         "globalCheckGenerators": {},
 *         "groupNames": ["Family"],
 *         "hitCheckGenerators": {
 *             "Family": {
 *                 "Family": function () {
 *                     return function (a, b) {
 *                         for (var i = 0; i < a.name.length; i += 1) {
 *                             if (b.name.indexOf(a.name[i]) !== -1) {
 *                                 return true;
 *                             }
 *                         }
 *                         return false;
 *                     };
 *                 }
 *             }
 *         },
 *         "hitFunctionGenerators": {
 *             "Family": {
 *                 "Family": function () {
 *                     return function (a, b) {
 *                         console.log(a.name + " found!");
 *                     }
 *                 }
 *             }
 *         }
 *     }),
 *     quadrants = [{ 
 *         "things": {
 *             "Family": null
 *         }
 *     }],
 *     families = [{
 *         "groupType": "Family",
 *         "name": "Smith",
 *         "numquads": 1,
 *         "quadrants": [
 *             quadrants[0]
 *         ]
 *     }, {
 *         "groupType": "Family",
 *         "name": "Jones",
 *         "numquads": 1,
 *         "quadrants": [
 *             quadrants[0]
 *         ]
 *     }, {
 *         "groupType": "Family",
 *         "name": "Smith",
 *         "numquads": 1,
 *         "quadrants": [
 *             quadrants[0]
 *         ]
 *     }];
 * 
 * quadrants[0].things.Family = families;
 * 
 * ThingHitter.cacheHitCheckType("Object", "Family")
 * 
 * families.forEach(ThingHitter.checkHitsOf.Object);
 * 
 * @example
 * // Creating and using a ThingHitter to find animals with similar DNA to other
 * // animals in their quadrant. Note that some animals will have matches listed
 * // multiple times if they have multiple shared quadrants.
 * var checkGenesGenerator = function () {
 *         return function (a, b) {
 *             var total = 0,
 *                 length = Math.min(a.dna.length, b.dna.length);
 *             for (i = 0; i < length; i += 1) {
 *                 if (a.dna[i] === b.dna[i]) {
 *                     total += 1;
 *                 }
 *             }
 *             return total > 0;
 *         };
 *     },
 *     saySimilarGenerator = function () {
 *         return function (a, b) {
 *             console.log(a.thingType + " matches with " + b.thingType);
 *         }
 *     },
 *     ThingHitter = new ThingHittr({
 *         "globalCheckGenerators": {},
 *         "groupNames": ["Mammal", "Lizard", "Hybrid"],
 *         "hitCheckGenerators": {
 *             "Mammal": {
 *                 "Mammal": checkGenesGenerator,
 *                 "Hybrid": checkGenesGenerator
 *             },
 *             "Lizard": {
 *                 "Lizard": checkGenesGenerator,
 *                 "Hybrid": checkGenesGenerator
 *             },
 *             "Hybrid": {
 *                 "Mammal": checkGenesGenerator,
 *                 "Lizard": checkGenesGenerator,
 *                 "Hybrid": checkGenesGenerator
 *             }
 *         },
 *         "hitFunctionGenerators": {
 *             "Mammal": {
 *                 "Mammal": saySimilarGenerator,
 *                 "Hybrid": saySimilarGenerator
 *             },
 *             "Lizard": {
 *                 "Lizard": saySimilarGenerator,
 *                 "Hybrid": saySimilarGenerator
 *             },
 *             "Hybrid": {
 *                 "Mammal": saySimilarGenerator,
 *                 "Lizard": saySimilarGenerator,
 *                 "Hybrid": saySimilarGenerator
 *             }
 *         }
 *     }),
 *     createQuadrant = function () {
 *         return {
 *             "things": {
 *                 "Mammal": null,
 *                 "Lizard": null,
 *                 "Hybrid": null
 *             }
 *         };
 *     },
 *     quadrants = [
 *         createQuadrant(), createQuadrant(), createQuadrant()
 *     ],
 *     Animal = function Animal(thingType, groupType, dna) {
 *         this.thingType = thingType;
 *         this.groupType = groupType;
 *         this.dna = dna;
 *     },
 *     mammals = [
 *         new Animal("Cat", "Mammal", "AACCTTGGAA"),
 *         new Animal("Dog", "Mammal", "CCTTGGAACC"),
 *         new Animal("Rat", "Mammal", "AAGGTTCCAA")
 *     ],
 *     lizards = [
 *         new Animal("Snake", "Lizard", "AAACCCTTTGGGAA"),
 *         new Animal("Budgie", "Lizard", "CCCTTTGGGAAACC"),
 *         new Animal("Alligator", "Lizard", "AAAGGGTTTCCCAA")
 *     ],
 *     hybrids = [
 *         new Animal("Monstrosity", "Hybrid", "AACTCCCCCC")
 *     ],
 *     i;
 * 
 * for (i = 0; i < mammals.length; i += 1) {
 *     ThingHitter.cacheHitCheckType(mammals[i].thingType, "Mammal");
 * }
 * for (i = 0; i < lizards.length; i += 1) {
 *     ThingHitter.cacheHitCheckType(lizards[i].thingType, "Lizard");
 * }
 * for (i = 0; i < hybrids.length; i += 1) {
 *     ThingHitter.cacheHitCheckType(hybrids[i].thingType, "Hybrid");
 * }
 * 
 * // Cat is in 0 and 1, Dog is everywhere, and Rat is in 1 and 2
 * quadrants[0].things.Mammal = [ mammals[0], mammals[1] ];
 * quadrants[1].things.Mammal = [ mammals[0], mammals[1], mammals[2] ];
 * quadrants[2].things.Mammal = [ mammals[1], mammals[2] ];
 * mammals[0].numquads = 2;
 * mammals[0].quadrants = [ quadrants[0], quadrants[1] ];
 * mammals[1].numquads = 3;
 * mammals[1].quadrants = [ quadrants[0], quadrants[1], quadrants[2] ];
 * mammals[2].numquads = 2;
 * mammals[2].quadrants = [ quadrants[1], quadrants[2] ];
 * 
 * // Snake is in 0 and 1, Budgie is everywhere, and Alligator is in 1 and 2
 * quadrants[0].things.Lizard = [ lizards[0], lizards[1] ];
 * quadrants[1].things.Lizard = [ lizards[0], lizards[1], lizards[2] ];
 * quadrants[2].things.Lizard = [ lizards[1], lizards[2] ];
 * lizards[0].numquads = 2;
 * lizards[0].quadrants = [ quadrants[0], quadrants[1] ];
 * lizards[1].numquads = 3;
 * lizards[1].quadrants = [ quadrants[0], quadrants[1], quadrants[2] ];
 * lizards[2].numquads = 2;
 * lizards[2].quadrants = [ quadrants[1], quadrants[2] ];
 * 
 * // Monstrosity is everywhere!
 * quadrants[0].things.Hybrid = [ hybrids[0] ];
 * quadrants[1].things.Hybrid = [ hybrids[0] ];
 * quadrants[2].things.Hybrid = [ hybrids[0] ];
 * hybrids[0].numquads = 2;
 * hybrids[0].quadrants = [ hybrids[0] ];
 * 
 * for (i = 0; i < mammals.length; i += 1) {
 *     ThingHitter.checkHitsOf[mammals[i].thingType](mammals[i]);
 * }
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ThingHittr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ThingHittr(settings);
    }
    var self = this,
        
        // Names of groups to check collisions within.
        groupNames,
        
        // Check Functions for Things within groups to see if they're able to
        // collide in the first place.
        globalChecks,
        
        // Collision detection Functions to check two Things for collision.
        hitChecks,
        
        // Hit Function callbacks for when two Things do collide.
        hitFunctions,
        
        // Function generators for globalChecks.
        globalCheckGenerators,
        
        // Function generators for hitChecks.
        hitCheckGenerators,
        
        // Function generators for hitFunctions.
        hitFunctionGenerators,
        
        // A listing of which groupNames have had their hitCheck cached.
        cachedGroupNames,
        
        // A listing of which types have had their checkHitsOf cached.
        cachedTypeNames;
    
    /**
     * Resets the ThingHittr.
     * 
     * @constructor
     * @param {Object} globalCheckGenerators   The Function generators used for
     *                                         each group to test if a contained
     *                                         Thing may collide, keyed by
     *                                         group name.
     * @param {Object} hitCheckGenerators   The Function generators used for
     *                                      hitChecks, as an Object with 
     *                                      sub-Objects for each group, which
     *                                      have sub-Objects for each group they
     *                                      may collide with.
     * @param {Object} hitFunctionGenerators   The Function generators used for
     *                                         collisions, as an Object with
     *                                         sub-Objects for each group, which
     *                                         have sub-Objects for each group
     *                                         they may collide with.
     * @param {String[]} groupNames   The listing of groups that may collide
     *                                with each other.
     */
    self.reset = function(settings) {
        globalCheckGenerators = settings.globalCheckGenerators;
        hitCheckGenerators = settings.hitCheckGenerators;
        hitFunctionGenerators = settings.hitFunctionGenerators;
        
        groupNames = settings.groupNames;
        
        hitChecks = {};
        globalChecks = {};
        hitFunctions = {};
        
        cachedGroupNames = {};
        cachedTypeNames = {};
        
        self.checkHitsOf = {};
    };
    
    
    /* Runtime preparation
    */
    
    /**
     * Caches the hit checks for a group name. The global check for that group
     * is cached on the name for later use.
     * 
     * @param {String} groupName   The name of the container group.
     */
    self.cacheHitCheckGroup = function (groupName) {
        if (cachedGroupNames[groupName]) {
            return;
        }
        
        cachedGroupNames[groupName] = true;
        
        if (typeof globalCheckGenerators[groupName] !== "undefined") {
            globalChecks[groupName] = cacheGlobalCheck(groupName);
        }
    };
    
    /**
     * Caches the hit checks for a specific type within a group, which involves
     * caching the group's global checker, the hit checkers for each of the 
     * type's allowed collision groups, and the hit callbacks for each of those
     * groups. 
     * The result is that you can call self.checkHitsOf[typeName] later on, and
     * expect it to work as anything in groupName.
     * 
     * @param {String} typeName   The type of the Things to cache for.
     * @param {String} groupName   The name of the container group.
     */
    self.cacheHitCheckType = function (typeName, groupName) {
        if (cachedTypeNames[typeName]) {
            return;
        }
        
        if (typeof globalCheckGenerators[groupName] !== "undefined") {
            globalChecks[typeName] = cacheGlobalCheck(groupName);
        }
        
        if (typeof hitCheckGenerators[groupName] !== "undefined") {
            hitChecks[typeName] = cacheFunctionGroup(
                hitCheckGenerators[groupName]
            );
        }
        
        if (typeof hitFunctionGenerators[groupName] !== "undefined") {
            hitFunctions[typeName] = cacheFunctionGroup(
                hitFunctionGenerators[groupName]
            );
        }

        cachedTypeNames[typeName] = true;
        self.checkHitsOf[typeName] = self.generateHitsCheck(typeName);
    };
    
    /**
     * Function generator for a checkHitsOf tailored to a specific Thing type.
     * 
     * @param {String} typeName   The type of the Things to generate for.
     * @return {Function}
     */
    self.generateHitsCheck = function (typeName) {
        /**
         * Collision detection Function for a Thing. For each Quadrant the Thing
         * is in, for all groups within that Function that the Thing's type is 
         * allowed to collide with, it is checked for collision with the Things
         * in that group. For each Thing it does collide with, the appropriate
         * hit Function is called.
         * 
         * @param {Thing} thing
         */
        return function checkHitsOf(thing) {
            var others, other, hitCheck,
                i, j, k;
             
            // Don't do anything if the thing shouldn't be checking
            if (
                typeof globalChecks[typeName] !== "undefined"
                && !globalChecks[typeName](thing)
            ) {
                return;
            }
            
            // For each quadrant this is in, look at that quadrant's groups
            for (i = 0; i < thing.numquads; i += 1) {
                for (j = 0; j < groupNames.length; j += 1) {
                    others = thing.quadrants[i].things[groupNames[j]];
                    hitCheck = hitChecks[typeName][groupNames[j]];
                    
                    // If no hit check exists for this combo, don't bother
                    if (!hitCheck) {
                        continue;
                    }
                    
                    // For each 'other' in this group that should be checked...
                    for (k = 0; k < others.length; k += 1) {
                        other = others[k];
                        
                        // If they are the same, breaking prevents double hits
                        if (thing === other) { 
                            break;
                        }
                        
                        // Do nothing if these two shouldn't be colliding
                        if (
                            typeof globalChecks[other.groupType] !== "undefined"
                            && !globalChecks[other.groupType](other)
                        ) {
                            continue;
                        }
                        
                        // If they do hit, call the corresponding hitFunction
                        if (hitCheck(thing, other)) {
                            hitFunctions[typeName][other.groupType](
                                thing, other
                            );
                        }
                    }
                }
            }
        };
    };
    
    /**
     * Caches a global check for a group by returning a result Function from the 
     * global check generator.
     * 
     * @param {String} groupName
     * @return {Function}
     */
    function cacheGlobalCheck(groupName) {
        return globalCheckGenerators[groupName]();
    };
    
    /**
     * Creates a set of cached Objects for when a group of Functions must be
     * generated, rather than a single one.
     * 
     * @param {Object<Function>} functions   The container for the Functions
     *                                       to be cached.
     * @return {Object<Function>}
     */
    function cacheFunctionGroup(functions) {
        var output = {},
            i;
        
        for (i in functions) {
            output[i] = functions[i]();
        }
        
        return output;
    };
    
    
    self.reset(settings || {});
}