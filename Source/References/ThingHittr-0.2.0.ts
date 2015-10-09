/// <reference path="QuadsKeepr-0.2.1.ts" />

declare module ThingHittr {
    // Determines whether a group of Things may all have hits checked.
    export interface IThingGroupCheck {
        (): boolean;
    }

    /**
     * Checks all possible hits for a single Thing, calling the respective hit 
     * Function when any are found.
     */
    export interface IThingHitsCheck {
        (thing: QuadsKeepr.IThing): void;
    }

    /** 
     * Determines whether a Thing collides with another Thing.
     */
    export interface IThingHitCheck {
        (thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): boolean;
    }

    /**
     * Callback for when a Thing collides with another Thing.
     */
    export interface IThingHitFunction {
        (thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): void;
    }

    /**
     * Generator Function to create IThingGroupCheck Functions.
     */
    export interface IThingGroupCheckGenerator {
        (): IThingGroupCheck;
    }

    /**
     * Generator Function to create IThingHitCheck Functions.
     */
    export interface IThingHitsCheckGenerator {
        (): IThingHitsCheck;
    }

    /**
     * Generator Function to create IThingHitCheck Functions.
     */
    export interface IThingHitCheckGenerator {
        (): IThingHitCheck;
    }

    /**
     * Generator Function to generate IThingHitFunction Functions.
     */
    export interface IThingHitFunctionGenerator {
        (): IThingHitFunction;
    }

    /**
     * Container to hold IThingGroupCheck Functions, keyed by their respective group.
     */
    export interface IThingGroupCheckContainer {
        [i: string]: IThingGroupCheck;
    }

    /**
     * Container to hold IThingHitsCheck Functions, keyed by their respective type.
     */
    export interface IThingHitsCheckContainer {
        [i: string]: IThingHitsCheck;
    }

    type IThingHitContainer = IThingHitCheckContainer | IThingHitFunctionContainer;

    /**
     * Container to hold IThingHitCheck Functions, keyed by their respective group.
     */
    export interface IThingHitCheckContainer {
        [i: string]: IThingHitCheck;
    }

    /**
     * Container to hold IThingHitFunction groups, keyed by their respective types.
     */
    export interface IThingHitFunctionContainer {
        [i: string]: IThingHitFunction;
    }

    /**
     * Container to hold IThingHitCheckContainer containers, keyed by their 
     * respective types.
     */
    export interface IThingHitCheckGroupContainer {
        [i: string]: IThingHitCheckContainer;
    }

    /**
     * Container to hold IThingHitFunctionContainer containers, keyed by their 
     * respective groups.
     */
    export interface IThingHitFunctionGroupContainer {
        [i: string]: IThingHitFunctionContainer;
    }

    /**
     * Container to hold IThingGroupCheckGenerator Functions, keyed by their
     * respective groups.
     */
    export interface IThingGroupCheckGeneratorContainer {
        [i: string]: IThingGroupCheckGenerator;
    }

    /**
     * Container to hold IThingHitCheckGenerator Functions, keyed by their 
     * respective groups.
     */
    export interface IThingHitCheckGeneratorContainer {
        [i: string]: IThingHitCheckGenerator;
    }

    /**
     * Container to hold IThingHitFunctionGenerator Functions, keyed by their
     * respective types.
     */
    export interface IThingHitFunctionGeneratorContainer {
        [i: string]: IThingHitFunctionGenerator;
    }

    /**
     * Container to hold IThingHitCheckGeneratorContainer containers, keyed by their
     * respective groups.
     */
    export interface IThingHitCheckGeneratorGroupContainer {
        [i: string]: IThingHitCheckGeneratorContainer;
    }

    /**
     * Container to hold IThingHitFunctionGeneratorContainer containers, keyed by
     * their respective groups.
     */
    export interface IThingHitFunctionGeneratorGroupContainer {
        [i: string]: IThingHitFunctionGeneratorContainer;
    }

    /**
     * Cache lookup for whether a Thing has had its hit checks generated.
     */
    export interface IThingGeneratedListing {
        [i: string]: boolean;
    }

    interface IThingHittrSettings {
        /**
         * The Function generators used for each group to test if a contained
         * Thing may collide, keyed by group name.
         */
        globalCheckGenerators: IThingGroupCheckGeneratorContainer;

        /**
         * The Function generators used for hitChecks, as an Object with sub-Objects
         * for each group, which have sub-Objects for each group they may collide 
         * with.
         */
        hitCheckGenerators: IThingHitCheckGeneratorGroupContainer;

        /**
         * The Function generators used for collisions, as an Object with 
         * sub- Objects for each group, which have sub- Objects for each group they
         * they may collide with.
         */
        hitFunctionGenerators: IThingHitFunctionGeneratorGroupContainer;

        /**
         * The listing of the names of groups that may collide with each other.
         */
        groupNames: string[];

        /**
         * The key under which Things store their number of quadrants (by default, "numquads").
         */
        keyNumQuads?: string;

        /**
         * The key under which Things store their quadrants (by default, "quadrants").
         */
        keyQuadrants?: string;

        /**
         * The key under which Things store which group they fall under (by default, "group").
         */
        keyGroupName?: string;
    }

    export interface IThingHittr {
        checkHitsOf: IThingHitsCheckContainer;
        cacheHitCheckGroup(groupName: string): void;
        cacheHitCheckType(typeName: string, groupName: string): void;
        generateHitsCheck(typeName: string): IThingHitsCheck;
        checkHit(thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing, thingType: string, otherGroup: string): boolean;
    }
}


module ThingHittr {
    "use strict";

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     * Things contained in the GroupHoldr's groups have automated collision checking
     * against configurable sets of other groups, along with performance  
     * optimizations to help reduce over-reoptimization of Functions.
     */
    export class ThingHittr implements IThingHittr {
        /**
         * Contains the Functions used to completely check the hits of a single Thing.
         */
        public checkHitsOf: IThingHitsCheckContainer;

        /**
         * Names of groups to check collisions within Quadrants.
         */
        private groupNames: string[];

        /**
         * Check Functions for Things within groups to see if they're able to
         * collide in the first place.
         */
        private globalChecks: IThingGroupCheckContainer;

        /**
         * Collision detection Functions to check two Things for collision.
         */
        private hitChecks: IThingHitCheckGroupContainer;

        /**
         * Hit Function callbacks for when two Things do collide.
         */
        private hitFunctions: IThingHitFunctionGroupContainer;

        /**
         * Function generators for globalChecks.
         */
        private globalCheckGenerators: IThingGroupCheckGeneratorContainer;

        /**
         * Function generators for hitChecks.
         */
        private hitCheckGenerators: IThingHitCheckGeneratorGroupContainer;

        /**
         * Function generators for hitFunctions.
         */
        private hitFunctionGenerators: IThingHitFunctionGeneratorGroupContainer;

        /**
         * A listing of which groupNames have had their hitCheck cached.
         */
        private cachedGroupNames: IThingGeneratedListing;

        /**
         * A listing of which types have had their checkHitsOf cached.
         */
        private cachedTypeNames: IThingGeneratedListing;

        /**
         * The key under which Things store their number of quadrants.
         */
        private keyNumQuads: string;

        /**
         * The key under which Things store their quadrants.
         */
        private keyQuadrants: string;

        /**
         * THe key under which Things store which group they fall under.
         */
        private keyGroupName: string;

        /**
         * @param {IThingHittrSettings} settings
         */
        constructor(settings: IThingHittrSettings) {
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
        cacheHitCheckGroup(groupName: string): void {
            if (this.cachedGroupNames[groupName]) {
                return;
            }

            this.cachedGroupNames[groupName] = true;

            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[groupName] = this.cacheGlobalCheck(groupName);
            }
        }

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
        cacheHitCheckType(typeName: string, groupName: string): void {
            if (this.cachedTypeNames[typeName]) {
                return;
            }

            if (typeof this.globalCheckGenerators[groupName] !== "undefined") {
                this.globalChecks[typeName] = this.cacheGlobalCheck(groupName);
            }

            if (typeof this.hitCheckGenerators[groupName] !== "undefined") {
                this.hitChecks[typeName] = <IThingHitCheckContainer>this.cacheFunctionGroup(this.hitCheckGenerators[groupName]);
            }

            if (typeof this.hitFunctionGenerators[groupName] !== "undefined") {
                this.hitFunctions[typeName] = <IThingHitFunctionContainer>this.cacheFunctionGroup(this.hitFunctionGenerators[groupName]);
            }

            this.cachedTypeNames[typeName] = true;
            this.checkHitsOf[typeName] = this.generateHitsCheck(typeName).bind(this);
        }

        /**
         * Function generator for a checkHitsOf tailored to a specific Thing type.
         * 
         * @param {String} typeName   The type of the Things to generate for.
         * @return {Function}
         */
        generateHitsCheck(typeName: string): IThingHitsCheck {
            /**
             * Collision detection Function for a Thing. For each Quadrant the Thing
             * is in, for all groups within that Function that the Thing's type is 
             * allowed to collide with, it is checked for collision with the Things
             * in that group. For each Thing it does collide with, the appropriate
             * hit Function is called.
             * 
             * @param {Thing} thing
             */
            return function checkHitsOf(thing: QuadsKeepr.IThing): void {
                var others: QuadsKeepr.IThing[],
                    other: QuadsKeepr.IThing,
                    hitCheck: IThingHitCheck,
                    i: number,
                    j: number,
                    k: number;

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
                            if (
                                typeof this.globalChecks[other[this.keyGroupName]] !== "undefined"
                                && !this.globalChecks[other[this.keyGroupName]](other)
                                ) {
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
        }


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
        checkHit(thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing, thingType: string, otherGroup: string): boolean {
            var checks: IThingHitCheckContainer = this.hitChecks[thingType],
                check: IThingHitCheck;

            if (!checks) {
                throw new Error("No hit checks defined for " + thingType + ".");
            }

            check = checks[otherGroup];

            if (!check) {
                throw new Error("No hit check defined for " + thingType + " and " + otherGroup + ".");
            }

            return check(thing, other);
        }

        /**
         * Caches a global check for a group by returning a result Function from the 
         * global check generator.
         * 
         * @param {String} groupName
         * @return {Function}
         */
        private cacheGlobalCheck(groupName: string): IThingGroupCheck {
            return this.globalCheckGenerators[groupName]();
        }

        /**
         * Creates a set of cached Objects for when a group of Functions must be
         * generated, rather than a single one.
         * 
         * @param {Object<Function>} functions   The container for the Functions
         *                                       to be cached.
         * @return {Object<Function>}
         */
        private cacheFunctionGroup(
            functions: IThingHitCheckGeneratorContainer | IThingHitFunctionGeneratorContainer): IThingHitContainer  {
            var output: IThingHitCheckContainer | IThingHitFunctionContainer = {},
                i: string;

            for (i in functions) {
                if (functions.hasOwnProperty(i)) {
                    output[i] = functions[i]();
                }
            }

            return output;
        }
    }
}
