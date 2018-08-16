import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IGrass, IThing } from "../Things";

/**
 * Visual and battle updates for walking in tall grass.
 */
export class Grass<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public enterGrassVisually(thing: ICharacter, other: IGrass): void {
        thing.grass = other;

        this.eightBitter.saves.addStateHistory(thing, "height", thing.height);

        thing.shadow = this.eightBitter.objectMaker.make<IThing>(thing.title, {
            nocollide: true,
            id: thing.id + " shadow",
        });

        if (thing.shadow.className !== thing.className) {
            this.eightBitter.graphics.setClass(thing.shadow, thing.className);
        }

        this.eightBitter.things.add(thing.shadow, thing.left, thing.top);
        this.eightBitter.groupHolder.switchGroup(thing.shadow, thing.shadow.groupType, "Terrain");
    }

    /**
     * Maintenance for a Character visually in grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public maintainGrassVisuals(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.eightBitter.physics.isThingWithinGrass(thing, other)) {
            this.exitGrassVisually(thing);
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.eightBitter.physics.setLeft(thing.shadow!, thing.left);
        this.eightBitter.physics.setTop(thing.shadow!, thing.top);

        if (thing.shadow!.className !== thing.className) {
            this.eightBitter.graphics.setClass(thing.shadow!, thing.className);
        }
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param thing   Character no longer in grass.
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.eightBitter.death.killNormal(thing.shadow!);
        this.eightBitter.saves.popStateHistory(thing, "height");

        thing.shadow = undefined;
        thing.grass = undefined;
    }
}
