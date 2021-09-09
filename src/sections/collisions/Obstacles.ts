import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Character, Grass, Actor, WaterEdge } from "../Actors";

/**
 * Handlers for collisions with obstacle-like Actors.
 */
export class Obstacles extends Section<FullScreenPokemon> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param actor   A Character within grass.
     * @param other   The specific Grass that actor is within.
     * @returns true, to allow for passing through.
     */
    public collideCharacterGrass = (actor: Character, other: Grass): true => {
        if (actor.grass || !this.game.physics.isActorWActorrass(actor, other)) {
            return true;
        }

        this.game.actions.grass.enterGrassVisually(actor, other);

        return true;
    };

    /**
     * Collision callback for a Character and a Ledge. If possible, the Character
     * is animated to start hopping over the Ledge.
     *
     * @param actor   A Character walking to other.
     * @param other   A Ledge walked to by actor.
     */
    public collideLedge = (actor: Character, other: Actor): boolean => {
        if (actor.roaming === true) {
            return false;
        }

        if (actor.ledge || !actor.walking) {
            return true;
        }

        if (actor.direction !== other.direction) {
            return false;
        }

        // TODO: ensure this works for horizontal ledges (See issue #661)
        if (actor.top === other.bottom) {
            return false;
        }

        if (actor.direction % 2 === 0) {
            if (actor.left === other.right || actor.right === other.left) {
                return true;
            }
        } else {
            if (actor.top === other.bottom || actor.bottom === other.top) {
                return true;
            }
        }

        this.game.actions.ledges.startLedgeHop(actor, other);

        return true;
    };

    /**
     * Collision callback for a Character and a WaterEdge. If possible, the Character
     * is animated to move onto land.
     *
     * @param actor   A Character walking to other.
     * @param other   A Ledge walked to by actor.
     * @returns Whether the Character was able animate onto land.
     */
    public collideWaterEdge = (actor: Character, other: Actor): boolean => {
        const edge = other as WaterEdge;
        if (!actor.surfing || edge.exitDirection !== actor.direction) {
            return false;
        }

        this.game.actions.walking.startWalkingOnPath(actor, [
            {
                blocks: 2,
                direction: actor.direction,
            },
        ]);
        actor.surfing = false;
        this.game.graphics.classes.removeClass(actor, "surfing");
        return true;
    };
}
