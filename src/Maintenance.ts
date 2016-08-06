/// <reference path="../typings/EightBittr.d.ts" />

import { Scrollability } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IGrass, IPlayer, IThing } from "./IFullScreenPokemon";

/**
 * Maintenance functions used by FullScreenPokemon instances.
 */
export class Maintenance<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Generic maintenance Function for a group of Things. For each Thing, if
     * it isn't alive, it's removed from the group.
     * 
     * @param things   A group of Things to maintain.
     */
    maintainGeneric(things: IThing[]): void {
        for (let i: number = 0; i < things.length; i += 1) {
            if (!things[i].alive) {
                this.EightBitter.utilities.arrayDeleteThing(things[i], things, i);
                i -= 1;
            }
        }
    }

    /**
     * Maintenance for all active Characters. Walking, grass maintenance, alive
     * checking, and quadrant maintenance are performed. 
     * 
     * @param characters   The Characters group of Things.
     */
    maintainCharacters(characters: ICharacter[]): void {
        for (let i: number = 0; i < characters.length; i += 1) {
            const character: ICharacter = characters[i];
            this.EightBitter.physics.shiftCharacter(character);

            if (character.shouldWalk && !this.EightBitter.MenuGrapher.getActiveMenu()) {
                character.onWalkingStart(character, character.direction);
                character.shouldWalk = false;
            }

            if (character.grass) {
                this.maintainCharacterGrass(character, character.grass);
            }

            if (!character.alive && !character.outerOk) {
                this.EightBitter.utilities.arrayDeleteThing(character, characters, i);
                i -= 1;
                continue;
            }

            for (let j: number = 0; j < 4; j += 1) {
                character.bordering[j] = undefined;
            }

            this.EightBitter.QuadsKeeper.determineThingQuadrants(character);
            this.EightBitter.ThingHitter.checkHitsForThing(character as any);
        }
    }

    /**
     * Maintenance for a Character visually in grass. The shadow is updated to
     * move or be deleted as needed.
     * 
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    maintainCharacterGrass(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.EightBitter.physics.isThingWithinGrass(thing, other)) {
            this.EightBitter.physics.killNormal(thing.shadow);
            thing.canvas.height = thing.height * this.EightBitter.unitsize;
            this.EightBitter.PixelDrawer.setThingSprite(thing);

            delete thing.shadow;
            delete thing.grass;
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.EightBitter.physics.setLeft(thing.shadow, thing.left);
        this.EightBitter.physics.setTop(thing.shadow, thing.top);

        if (thing.shadow.className !== thing.className) {
            this.EightBitter.graphics.setClass(thing.shadow, thing.className);
        }
    }

    /**
     * Maintenance for a Player. The screen is scrolled according to the global
     * MapScreener.scrollability.
     * 
     * @param player   An in-game Player Thing.
     */
    maintainPlayer(player: IPlayer): void {
        if (!player || !player.alive) {
            return;
        }

        switch (this.EightBitter.MapScreener.scrollability) {
            case Scrollability.Horizontal:
                this.EightBitter.scrolling.scrollWindow(this.EightBitter.scrolling.getHorizontalScrollAmount());
                return;

            case Scrollability.Vertical:
                this.EightBitter.scrolling.scrollWindow(0, this.EightBitter.scrolling.getVerticalScrollAmount());
                return;

            case Scrollability.Both:
                this.EightBitter.scrolling.scrollWindow(
                    this.EightBitter.scrolling.getHorizontalScrollAmount(),
                    this.EightBitter.scrolling.getVerticalScrollAmount());
                return;

            default:
                return;
        }
    }
}
