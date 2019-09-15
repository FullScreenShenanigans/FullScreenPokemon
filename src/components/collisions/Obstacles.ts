import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IGrass, IThing, IWaterEdge } from "../Things";

/**
 * Handlers for collisions with obstacle-like Things.
 */
export class Obstacles<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param thing   A Character within grass.
     * @param other   The specific Grass that thing is within.
     * @returns true, to allow for passing through.
     */
    public collideCharacterGrass = (thing: ICharacter, other: IGrass): true => {
        if (thing.grass || !this.eightBitter.physics.isThingWithinGrass(thing, other)) {
            return true;
        }

        this.eightBitter.actions.grass.enterGrassVisually(thing, other);

        return true;
    }

    /**
     * Collision callback for a Character and a Ledge. If possible, the Character
     * is animated to start hopping over the Ledge.
     *
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    public collideLedge = (thing: ICharacter, other: IThing): boolean => {
        if (thing.roaming === true) {
            return false;
        }

        if (thing.ledge || !thing.walking) {
            return true;
        }

        if (thing.direction !== other.direction) {
            return false;
        }

        // TODO: ensure this works for horizontal ledges (See issue #661)
        if (thing.top === other.bottom) {
            return false;
        }

        if (thing.direction % 2 === 0) {
            if (thing.left === other.right || thing.right === other.left) {
                return true;
            }
        } else {
            if (thing.top === other.bottom || thing.bottom === other.top) {
                return true;
            }
        }

        this.eightBitter.actions.ledges.startLedgeHop(thing, other);

        return true;
    }

    /**
     * Collision callback for a Character and a WaterEdge. If possible, the Character
     * is animated to move onto land.
     *
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     * @returns Whether the Character was able animate onto land.
     */
    public collideWaterEdge = (thing: ICharacter, other: IThing): boolean => {
        const edge = other as IWaterEdge;
        if (!thing.surfing || edge.exitDirection !== thing.direction) {
            return false;
        }

        this.eightBitter.actions.walking.startWalkingOnPath(thing, [{
            blocks: 2,
            direction: thing.direction,
        }]);
        thing.surfing = false;
        this.eightBitter.graphics.classes.removeClass(thing, "surfing");
        return true;
    }
}
