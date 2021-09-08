import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Character, Actor } from "../Actors";

/**
 * Hops characters down ledges.
 */
export class Ledges extends Section<FullScreenPokemon> {
    /**
     * Starts a Character hopping over a ledge.
     *
     * @param actor   A Character hopping over a ledge.
     * @param other   The ledge the Character is hopping over.
     */
    public startLedgeHop(actor: Character, other: Actor): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(actor);

        actor.nocollide = true;
        actor.wantsToWalk = true;
        actor.ledge = other;

        this.addHopOffset(actor);
        this.addHopShadow(actor);

        this.game.timeHandler.addEvent((): void => this.endLedgeHop(actor), ticksPerBlock * 2);
    }

    /**
     * Finishes a Character hopping over a ledge.
     *
     * @param actor   A Character done hopping over a ledge.
     * @param other   The ledge the Character is done hopping over.
     */
    public endLedgeHop(actor: Character): void {
        this.game.death.kill(actor.shadow!);
        actor.nocollide = false;
        actor.wantsToWalk = false;
        actor.ledge = undefined;
        actor.shadow = undefined;
    }

    /**
     * Adds a visual "hop" to a hopping Character.
     *
     * @param actor   A Character hopping over a ledge.
     */
    protected addHopOffset(actor: Character): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(actor);
        let dy = -2;

        this.game.timeHandler.addEventInterval((): void => {
            dy *= -1;
        }, ticksPerBlock + 1);

        this.game.timeHandler.addEventInterval(
            (): void => {
                actor.offsetY += dy;
            },
            1,
            ticksPerBlock * 2
        );
    }

    /**
     * Adds a visual shadow to a hopping Character.
     *
     * @param actor   A Character hopping over a ledge.
     */
    protected addHopShadow(actor: Character): void {
        actor.shadow = this.game.actors.add(this.game.actors.names.shadow);

        this.game.timeHandler.addEventInterval(
            (): boolean => this.updateShadowPosition(actor),
            1,
            Infinity
        );
    }

    /**
     * Updates a hopping Character's shadow.
     *
     * @param actor   A Character hopping over a ledge.
     * @param other   The ledge the Character is hopping over.
     */
    protected updateShadowPosition(actor: Character): boolean {
        if (!actor.shadow) {
            return true;
        }

        this.game.physics.setMidXObj(actor.shadow, actor);
        this.game.physics.setBottom(actor.shadow, actor.bottom);
        return false;
    }
}
