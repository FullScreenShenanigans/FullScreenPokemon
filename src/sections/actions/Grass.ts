import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IGrass, IThing } from "../Things";

/**
 * Visual and battle updates for walking in tall grass.
 */
export class Grass extends Section<FullScreenPokemon> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public enterGrassVisually(thing: ICharacter, other: IGrass): void {
        thing.grass = other;

        this.game.saves.addStateHistory(thing, "height", thing.height);

        thing.shadow = this.game.objectMaker.make<IThing>(thing.title, {
            nocollide: true,
            id: thing.id + " shadow",
        });

        if (thing.shadow.className !== thing.className) {
            this.game.graphics.classes.setClass(thing.shadow, thing.className);
        }

        this.game.things.add(thing.shadow, thing.left, thing.top);
        this.game.groupHolder.switchGroup(thing.shadow, thing.shadow.groupType, "Terrain");
    }

    /**
     * Maintenance for a Character visually in grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public maintainGrassVisuals(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.game.physics.isThingWithinGrass(thing, other)) {
            this.exitGrassVisually(thing);
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.game.physics.setLeft(thing.shadow!, thing.left);
        this.game.physics.setTop(thing.shadow!, thing.top);

        if (thing.shadow!.className !== thing.className) {
            this.game.graphics.classes.setClass(thing.shadow!, thing.className);
        }
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param thing   Character no longer in grass.
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.game.death.kill(thing.shadow!);
        this.game.saves.popStateHistory(thing, "height");

        thing.shadow = undefined;
        thing.grass = undefined;
    }
}
