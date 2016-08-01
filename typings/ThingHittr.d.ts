declare namespace ThingHittr {
    /**
     * Any bounding box that can be within quadrant(s).
     */
    interface IThing {
        /**
         * Which group of Things this belongs to.
         */
        groupType: string;
        /**
         * How many quadrants this is a member of.
         */
        numQuadrants: number;
        /**
         * Quadrants this may be a member of.
         */
        quadrants: IQuadrant[];
        /**
         * What type this is within its group.
         */
        type: string;
    }
    /**
     * A container for groups of Things near each other.
     */
    interface IQuadrant {
        /**
         * Things contained within, by groupType.
         */
        things: {
            [i: string]: IThing[];
        };
    }
    /**
     * For group names, the names of other groups they are allowed to hit.
     */
    interface IGroupHitList {
        [i: string]: string[];
    }
    /**
     * Determines whether a Thing may all have hits checked.
     *
     * @returns Whether the Thing may all have hits checked.
     */
    interface IGlobalCheck {
        (thing: IThing): boolean;
    }
    /**
     * Checks all possible hits for a single Thing, calling the respective hit
     * Function when any are found.
     *
     * @param thing   A Thing whose hits are to be checked.
     */
    interface IHitsCheck {
        (thing: IThing): void;
    }
    /**
     * Determines whether a Thing collides with another Thing.
     *
     * @param thing   A Thing to check collision with.
     * @param other   A Thing to check collision with.
     * @returns Whether the two Things have collided.
     */
    interface IHitCheck {
        (thing: IThing, other: IThing): boolean;
    }
    /**
     * Callback for when a Thing collides with another Thing.
     *
     * @param thing   A Thing that has collided with another Thing.
     * @param other   A Thing that has collided with another Thing.
     *
     */
    interface IHitCallback {
        (thing: IThing, other: IThing): void;
    }
    /**
     * A generic Thing Function.
     */
    type IThingFunction = IGlobalCheck | IHitsCheck | IHitCheck | IHitCallback;
    /**
     * Generators for Thing Functions.
     */
    interface IThingFunctionGenerator<T extends IThingFunction> {
        (): T;
    }
    /**
     * A container of generators for Thing Functions.
     */
    interface IThingFunctionGeneratorContainer<T extends IThingFunction> {
        [i: string]: IThingFunctionGenerator<T>;
    }
    /**
     * A group of containers of generators for Thing Functions.
     */
    interface IThingFunctionGeneratorContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionGeneratorContainer<T>;
    }
    /**
     * A container of Thing Function generators.
     */
    interface IThingFunctionContainer<T extends IThingFunction> {
        [i: string]: T;
    }
    /**
     * A group of containers of functions for Things.
     */
    interface IThingFunctionContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionContainer<T>;
    }
    /**
     * Settings to initialize a new IThingHittr.
     */
    interface IThingHittrSettings {
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
        /**
         * The key under which Things store which type they fall under (by default, "type").
         */
        keyTypeName?: string;
        /**
         * The Function generators used globalChecks.
         */
        globalCheckGenerators: IThingFunctionGeneratorContainer<IGlobalCheck>;
        /**
         * The Function generators used for hitChecks.
         */
        hitCheckGenerators: IThingFunctionGeneratorContainerGroup<IHitCheck>;
        /**
         * The Function generators used for hitCallbacks.
         */
        hitCallbackGenerators: IThingFunctionGeneratorContainerGroup<IHitCallback>;
    }
    /**
     * A Thing collision detection automator that unifies GroupHoldr and
     * Functions for checking whether a Thing may collide, checking whether it collides
     * with another Thing, and reacting to a collision are generated and cached for
     * each Thing type, based on the overarching Thing groups.
     */
    interface IThingHittr {
        /**
         * Caches global and hits checks for the given type if they do not yet exist.
         *
         * @param typeName   The type to cache hits for.
         * @param groupName   The general group the type fall sunder.
         */
        cacheChecksForType(typeName: string, groupName: string): void;
        /**
         * Checks all hits for a Thing using its generated hits check.
         *
         * @param thing   The Thing to have hits checked.
         */
        checkHitsForThing(thing: IThing): void;
        /**
         * Checks whether two Things are hitting.
         *
         * @param thing   The primary Thing that may be hitting other.
         * @param other   The secondary Thing that may be being hit by thing.
         * @returns Whether the two Things are hitting.
         */
        checkHitForThings(thing: IThing, other: IThing): boolean;
        /**
         * Reacts to two Things hitting.
         *
         * @param thing   The primary Thing that is hitting other.
         * @param other   The secondary Thing that is being hit by thing.
         */
        runHitCallbackForThings(thing: IThing, other: IThing): void;
    }
    /**
     * Automation for physics collisions and reactions.
     */
    class ThingHittr implements IThingHittr {
        /**
         * For each group name, the names of other groups it is allowed to hit.
         */
        private groupHitLists;
        /**
         * Function generators for globalChecks.
         */
        private globalCheckGenerators;
        /**
         * Function generators for hitChecks.
         */
        private hitCheckGenerators;
        /**
         * Function generators for HitCallbacks.
         */
        private hitCallbackGenerators;
        /**
         * Check Functions for Things within groups to see if they're able to
         * collide in the first place.
         */
        private generatedGlobalChecks;
        /**
         * Collision detection Functions to check two Things for collision.
         */
        private generatedHitChecks;
        /**
         * Hit Function callbacks for when two Things do collide.
         */
        private generatedHitCallbacks;
        /**
         * Hits checkers for when a Thing should have its hits detected.
         */
        private generatedHitsChecks;
        /**
         * Initializes a new instance of the ThingHittr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IThingHittrSettings);
        /**
         * Caches global and hits checks for the given type if they do not yet exist
         * and have their generators defined
         *
         * @param typeName   The type to cache hits for.
         * @param groupName   The general group the type fall sunder.
         */
        cacheChecksForType(typeName: string, groupName: string): void;
        /**
         * Checks all hits for a Thing using its generated hits check.
         *
         * @param thing   The Thing to have hits checked.
         */
        checkHitsForThing(thing: IThing): void;
        /**
         * Checks whether two Things are hitting.
         *
         * @param thing   The primary Thing that may be hitting other.
         * @param other   The secondary Thing that may be being hit by thing.
         * @returns Whether the two Things are hitting.
         */
        checkHitForThings(thing: IThing, other: IThing): boolean;
        /**
         * Reacts to two Things hitting.
         *
         * @param thing   The primary Thing that is hitting other.
         * @param other   The secondary Thing that is being hit by thing.
         */
        runHitCallbackForThings(thing: IThing, other: IThing): void;
        /**
         * Function generator for a hits check for a specific Thing type.
         *
         * @param typeName   The type of the Things to generate for.
         * @returns A Function that can check all hits for a Thing of the given type.
         */
        private generateHitsCheck(typeName);
        /**
         * Runs the Function in the group that maps to the two Things' types. If it doesn't
         * yet exist, it is created.
         *
         * @param group   The group of Functions to use.
         * @param thing   The primary Thing reacting to other.
         * @param other   The secondary Thing that thing is reacting to.
         * @returns The result of the ThingFunction from the group.
         */
        private runThingsFunctionSafely(group, thing, other, generators);
        /**
         * Generates the list of group names each group is allowd to hit.
         *
         * @param group   A summary of group containers.
         */
        private generateGroupHitLists(group);
    }
}
declare var module: any;
