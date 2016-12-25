import { Things as GameStartrThings } from "gamestartr/lib/components/Things";

import { IThing } from "./IFullScreenPokemon";

/**
 * Thing manipulation functions used by FullScreenPokemon instances.
 */
export class Things extends GameStartrThings {
    /**
     * Slight addition to the parent thingProcess Function. The Thing's hit
     * check type is cached immediately, and a default id is assigned if an id
     * isn't already present.
     * 
     * @param thing   The Thing being processed.
     * @param title   What type Thing this is (the name of the class).
     * @param settings   Additional settings to be given to the Thing.
     * @param defaults   The default settings for the Thing's class.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    public process(thing: IThing, title: string, settings: any, defaults: any): void {
        super.process(thing, title, settings, defaults);

        // ThingHittr becomes very non-performant if functions aren't generated
        // for each Thing constructor (optimization does not respect prototypal 
        // inheritance, sadly).
        this.thingHitter.cacheChecksForType(thing.title, thing.groupType);

        thing.bordering = [undefined, undefined, undefined, undefined];

        if (typeof thing.id === "undefined") {
            thing.id = [
                this.areaSpawner.getMapName(),
                this.areaSpawner.getAreaName(),
                thing.title,
                (thing.name || "Anonymous")
            ].join("::");
        }
    }

    /**
     * Overriden Function to adds a new Thing to the game at a given position,
     * relative to the top left corner of the screen. The Thing is also 
     * added to the Thing groupHolder.group container.
     * 
     * @param thingRaw   What type of Thing to add. This may be a String of
     *                   the class title, an Array containing the String
     *                   and an Object of settings, or an actual Thing.
     * @param left   The horizontal point to place the Thing's left at (by
     *               default, 0).
     * @param top   The vertical point to place the Thing's top at (by default,
     *              0).
     * @param useSavedInfo   Whether an Area's saved info in StateHolder should be 
     *                       applied to the Thing's position (by default, false).
     */
    public add(thingRaw: string | IThing | [string, any], left: number = 0, top: number = 0, useSavedInfo?: boolean): IThing {
        const thing: IThing = super.add(thingRaw, left, top) as IThing;

        if (useSavedInfo) {
            this.applySavedPosition(thing);
        }

        if (thing.id) {
            this.stateHolder.applyChanges(thing.id, thing);
            (this.groupHolder.getGroup("Thing") as any)[thing.id] = thing;
        }

        if (typeof thing.direction !== "undefined") {
            this.animations.animateCharacterSetDirection(thing, thing.direction);
        }

        return thing;
    }

    /**
     * Applies a thing's stored xloc and yloc to its position.
     * 
     * @param thing   A Thing being placed in the game.
     */
    public applySavedPosition(thing: IThing): void {
        const savedInfo: any = this.stateHolder.getChanges(thing.id);
        if (!savedInfo) {
            return;
        }

        if (savedInfo.xloc) {
            this.physics.setLeft(
                thing,
                this.mapScreener.left + savedInfo.xloc * 4);
        }
        if (savedInfo.yloc) {
            this.physics.setTop(
                thing,
                this.mapScreener.top + savedInfo.yloc * 4);
        }
    }
}
