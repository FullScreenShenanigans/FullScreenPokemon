import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Character, Grass as GrassActor, Actor } from "../Actors";

/**
 * Visual and battle updates for walking in tall grass.
 */
export class Grass extends Section<FullScreenPokemon> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param actor   A Character in grass.
     * @param other   Grass that actor is in.
     */
    public enterGrassVisually(actor: Character, other: GrassActor): void {
        actor.grass = other;

        this.game.saves.addStateHistory(actor, "height", actor.height);

        actor.shadow = this.game.objectMaker.make<Actor>(actor.title, {
            nocollide: true,
            id: actor.id + " shadow",
        });

        if (actor.shadow.className !== actor.className) {
            this.game.graphics.classes.setClass(actor.shadow, actor.className);
        }

        this.game.actors.add(actor.shadow, actor.left, actor.top);
        this.game.groupHolder.switchGroup(actor.shadow, actor.shadow.groupType, "Terrain");
    }

    /**
     * Maintenance for a Character visually in grass.
     *
     * @param actor   A Character in grass.
     * @param other   Grass that actor is in.
     */
    public maintainGrassVisuals(actor: Character, other: GrassActor): void {
        // If actor is no longer in grass, delete the shadow and stop
        if (!this.game.physics.isActorWActorrass(actor, other)) {
            this.exitGrassVisually(actor);
            return;
        }

        // Keep the shadow in sync with actor in position and visuals.
        this.game.physics.setLeft(actor.shadow!, actor.left);
        this.game.physics.setTop(actor.shadow!, actor.top);

        if (actor.shadow!.className !== actor.className) {
            this.game.graphics.classes.setClass(actor.shadow!, actor.className);
        }
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param actor   Character no longer in grass.
     */
    public exitGrassVisually(actor: Character): void {
        this.game.death.kill(actor.shadow!);
        this.game.saves.popStateHistory(actor, "height");

        actor.shadow = undefined;
        actor.grass = undefined;
    }
}
