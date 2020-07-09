import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";

/**	
 * Visually flips Things.	
 */
export class Flipping extends Section<FullScreenPokemon> {
    /**	
     * Marks a Thing as being flipped horizontally by setting its .flipHoriz	
     * attribute to true and giving it a "flipped" class.	
     *	
     * @param thing	
     */
    public flipHoriz(thing: IThing): void {
        thing.flipHoriz = true;
        this.game.graphics.classes.addClass(thing, "flipped");
    }

    /**	
     * Marks a Thing as being flipped vertically by setting its .flipVert	
     * attribute to true and giving it a "flipped" class.	
     *	
     * @param thing	
     */
    public flipVert(thing: IThing): void {
        thing.flipVert = true;
        this.game.graphics.classes.addClass(thing, "flip-vert");
    }

    /**	
     * Marks a Thing as not being flipped horizontally by setting its .flipHoriz	
     * attribute to false and giving it a "flipped" class.	
     *	
     * @param thing	
     */
    public unflipHoriz(thing: IThing): void {
        thing.flipHoriz = false;
        this.game.graphics.classes.removeClass(thing, "flipped");
    }

    /**	
     * Marks a Thing as not being flipped vertically by setting its .flipVert	
     * attribute to true and giving it a "flipped" class.	
     *	
     * @param thing	
     */
    public unflipVert(thing: IThing): void {
        thing.flipVert = false;
        this.game.graphics.classes.removeClass(thing, "flip-vert");
    }
}	