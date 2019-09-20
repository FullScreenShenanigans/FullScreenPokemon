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

        thing.shadow = this.eightBitter.objectMaker.make<IThing>(
            this.eightBitter.things.names.grassOverlay,
        );

        this.eightBitter.things.add(thing.shadow, thing.left, thing.top);
        this.eightBitter.groupHolder.switchGroup(
            thing.shadow,
            thing.shadow.groupType,
            this.eightBitter.groups.names.character,
        );
        this.positionGrassShadow(thing.shadow, thing, other);
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

        this.positionGrassShadow(thing.shadow!, thing, other);
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param thing   Character no longer in grass.
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.eightBitter.death.killNormal(thing.shadow!);

        thing.shadow = undefined;
        thing.grass = undefined;
    }

    private positionGrassShadow(shadow: IThing, thing: ICharacter, other: IGrass): void {
        const midpoint = this.eightBitter.physics.getMidY(thing) - 8;
        const adjustedDifference = midpoint - other.top;
        const roundedDifference = ((adjustedDifference / 16) | 0) * 16;

        this.eightBitter.physics.setLeft(shadow, thing.left);
        this.eightBitter.physics.setTop(shadow, other.top + roundedDifference);
    }
}
