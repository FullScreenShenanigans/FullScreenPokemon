/// <reference path="QuadsKeepr-0.2.1.ts" />
var ThingHittr;
(function (ThingHittr_1) {
    "use strict";
    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     * Things contained in the GroupHoldr's groups have automated collision checking
     * against configurable sets of other groups, along with performance
     * optimizations to help reduce over-reoptimization of Functions.
     */
    var ThingHittr = (function () {
        /**
         * @param {IThingHittrSettings} settings
         */
        function ThingHittr(settings) {
            this.globalCheckGenerators = settings.globalCheckGenerators;
            this.hitCheckGenerators = settings.hitCheckGenerators;
            this.hitFunctionGenerators = settings.hitFunctionGenerators;
            this.groupNames = settings.groupNames;
            this.keyNumQuads = settings.keyNumQuads || "numquads";
            this.keyQuadrants = settings.keyQuadrants || "quadrants";
            this.keyGroupName = settings.keyGroupName || "group";
            this.hitChecks = {};
            this.globalChecks = {};
            this.hitFunctions = {};
            this.cachedGroupNames = {};
            this.cachedTypeNames = {};
            this.checkHitsOf = {};
        }
        /* Runtime preparation
        */
        /**
         * Caches the hit checks for a group name. The global check for that group
         * is cached on the name for later use.
         *
         * @param {String} groupName   The name of the container group.
         */
        ThingHittr.prototype.cacheHitCheckGroup = function (groupName) {
            if (this.cachedGroupNames[groupName]) {
                return;
            }
            this.cachedGroupNames[groupName] = true;
            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[groupName] = this.cacheGlobalCheck(groupName);
            }
        };
        /**
         * Caches the hit checks for a specific type within a group, which involves
         * caching the group's global checker, the hit checkers for each of the
         * type's allowed collision groups, and the hit callbacks for each of those
         * groups.
         * The result is that you can call this.checkHitsOf[typeName] later on, and
         * expect it to work as anything in groupName.
         *
         * @param {String} typeName   The type of the Things to cache for.
         * @param {String} groupName   The name of the container group.
         */
        ThingHittr.prototype.cacheHitCheckType = function (typeName, groupName) {
            if (this.cachedTypeNames[typeName]) {
                return;
            }
            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[typeName] = this.cacheGlobalCheck(groupName);
            }
            if (typeof this.hitCheckGenerators[groupName] !== "undefined") {
                this.hitChecks[typeName] = this.cacheFunctionGroup(this.hitCheckGenerators[groupName]);
            }
            if (typeof this.hitFunctionGenerators[groupName] !== "undefined") {
                this.hitFunctions[typeName] = this.cacheFunctionGroup(this.hitFunctionGenerators[groupName]);
            }
            this.cachedTypeNames[typeName] = true;
            this.checkHitsOf[typeName] = this.generateHitsCheck(typeName).bind(this);
        };
        /**
         * Function generator for a checkHitsOf tailored to a specific Thing type.
         *
         * @param {String} typeName   The type of the Things to generate for.
         * @return {Function}
         */
        ThingHittr.prototype.generateHitsCheck = function (typeName) {
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
                var others, other, hitCheck, i, j, k;
                // Don't do anything if the thing shouldn't be checking
                if (typeof this.globalChecks[this.typeName] !== "undefined" && !this.globalChecks[this.typeName](thing)) {
                    return;
                }
                // For each quadrant this is in, look at that quadrant's groups
                for (i = 0; i < thing[this.keyNumQuads]; i += 1) {
                    for (j = 0; j < this.groupNames.length; j += 1) {
                        hitCheck = this.hitChecks[typeName][this.groupNames[j]];
                        // If no hit check exists for this combo, don't bother
                        if (!hitCheck) {
                            continue;
                        }
                        others = thing[this.keyQuadrants][i].things[this.groupNames[j]];
                        // For each other Thing in this group that should be checked...
                        for (k = 0; k < others.length; k += 1) {
                            other = others[k];
                            // If they are the same, breaking prevents double hits
                            if (thing === other) {
                                break;
                            }
                            // Do nothing if these two shouldn't be colliding
                            if (typeof this.globalChecks[other[this.keyGroupName]] !== "undefined"
                                && !this.globalChecks[other[this.keyGroupName]](other)) {
                                continue;
                            }
                            // If they do hit, call the corresponding hitFunction
                            if (hitCheck(thing, other)) {
                                this.hitFunctions[typeName][other[this.keyGroupName]](thing, other);
                            }
                        }
                    }
                }
            };
        };
        /**
         * Manually checks whether two Things are touching.
         *
         * @param {Thing} thing
         * @param {Thing} other
         * @param {String} thingType   The individual type of thing.
         * @param {Thing} otherGroup   The individual group of other.
         * @return {Boolean} The result of the hit function defined for thing's
         *                   type and other's group, which should be whether they're
         *                   touching.
         */
        ThingHittr.prototype.checkHit = function (thing, other, thingType, otherGroup) {
            var checks = this.hitChecks[thingType], check;
            if (!checks) {
                throw new Error("No hit checks defined for " + thingType + ".");
            }
            check = checks[otherGroup];
            if (!check) {
                throw new Error("No hit check defined for " + thingType + " and " + otherGroup + ".");
            }
            return check(thing, other);
        };
        /**
         * Caches a global check for a group by returning a result Function from the
         * global check generator.
         *
         * @param {String} groupName
         * @return {Function}
         */
        ThingHittr.prototype.cacheGlobalCheck = function (groupName) {
            return this.globalCheckGenerators[groupName]();
        };
        /**
         * Creates a set of cached Objects for when a group of Functions must be
         * generated, rather than a single one.
         *
         * @param {Object<Function>} functions   The container for the Functions
         *                                       to be cached.
         * @return {Object<Function>}
         */
        ThingHittr.prototype.cacheFunctionGroup = function (functions) {
            var output = {}, i;
            for (i in functions) {
                if (functions.hasOwnProperty(i)) {
                    output[i] = functions[i]();
                }
            }
            return output;
        };
        return ThingHittr;
    })();
    ThingHittr_1.ThingHittr = ThingHittr;
})(ThingHittr || (ThingHittr = {}));
