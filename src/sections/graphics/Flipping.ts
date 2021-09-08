import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Actor } from "../Actors";

/**
 * Visually flips Actors.
 */
export class Flipping extends Section<FullScreenPokemon> {
    /**
     * Marks An Actor as being flipped horizontally by setting its .flipHoriz
     * attribute to true and giving it a "flipped" class.
     *
     * @param actor
     */
    public flipHoriz(actor: Actor): void {
        actor.flipHoriz = true;
        this.game.graphics.classes.addClass(actor, "flipped");
    }

    /**
     * Marks An Actor as being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     *
     * @param actor
     */
    public flipVert(actor: Actor): void {
        actor.flipVert = true;
        this.game.graphics.classes.addClass(actor, "flip-vert");
    }

    /**
     * Marks An Actor as not being flipped horizontally by setting its .flipHoriz
     * attribute to false and giving it a "flipped" class.
     *
     * @param actor
     */
    public unflipHoriz(actor: Actor): void {
        actor.flipHoriz = false;
        this.game.graphics.classes.removeClass(actor, "flipped");
    }

    /**
     * Marks An Actor as not being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     *
     * @param actor
     */
    public unflipVert(actor: Actor): void {
        actor.flipVert = false;
        this.game.graphics.classes.removeClass(actor, "flip-vert");
    }
}
