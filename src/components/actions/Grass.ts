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
        if (thing.grass) {
            if (thing.grass === other) {
                return;
            }

            this.exitGrassVisually(thing);
        }

        thing.grass = other;
        thing.drawHeight = 16;

        this.eightBitter.pixelRender.resetRender(this.eightBitter.graphics.generateThingKey(thing));

        thing.shadow = this.eightBitter.things.add([thing.title, {
            id: thing.id + " shadow",
            nocollide: true,
        }]);
        this.eightBitter.groupHolder.switchGroup(
            thing.shadow,
            thing.shadow.groupType,
            this.eightBitter.groups.names.terrain,
        );
        this.positionGrassShadow(thing.shadow, thing);
    }

    /**
     * Maintenance for a Character visually in grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public maintainGrassVisuals(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.eightBitter.physics.isThingMidpointWithinOther(thing, other)) {
            this.exitGrassVisually(thing);
            return;
        }

        this.positionGrassShadow(thing.shadow!, thing);
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param thing   Character no longer in grass.
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.eightBitter.death.killNormal(thing.shadow!);

        thing.drawHeight = undefined;
        thing.grass = undefined;
        thing.shadow = undefined;
    }

    private positionGrassShadow(shadow: IThing, thing: ICharacter): void {
        this.eightBitter.graphics.classes.setClass(shadow, thing.className);
        this.eightBitter.physics.setLeft(shadow, thing.left);
        this.eightBitter.physics.setTop(shadow, thing.top);
    }
}
