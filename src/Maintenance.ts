import { Component } from "eightbittr/lib/Component";

import { Scrollability } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IGrass, IPlayer, IThing } from "./IFullScreenPokemon";

/**
 * Maintenance functions used by FullScreenPokemon instances.
 */
export class Maintenance<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
    /**
     * Generic maintenance Function for a group of Things. For each Thing, if
     * it isn't alive, it's removed from the group.
     * 
     * @param things   A group of Things to maintain.
     */
    public maintainGeneric(things: IThing[]): void {
        for (let i: number = 0; i < things.length; i += 1) {
            if (!things[i].alive) {
                this.eightBitter.utilities.arrayDeleteThing(things[i], things, i);
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
    public maintainCharacters(characters: ICharacter[]): void {
        for (let i: number = 0; i < characters.length; i += 1) {
            const character: ICharacter = characters[i];
            this.eightBitter.physics.shiftCharacter(character);

            if (character.shouldWalk && !this.eightBitter.MenuGrapher.getActiveMenu()) {
                character.onWalkingStart.call(this, character, character.direction);
                character.shouldWalk = false;
            }

            if (character.grass) {
                this.maintainCharacterGrass(character, character.grass);
            }

            if (!character.alive && !character.outerOk) {
                this.eightBitter.utilities.arrayDeleteThing(character, characters, i);
                i -= 1;
                continue;
            }

            for (let j: number = 0; j < 4; j += 1) {
                character.bordering[j] = undefined;
            }

            this.eightBitter.quadsKeeper.determineThingQuadrants(character);
            this.eightBitter.thingHitter.checkHitsForThing(character as any);
        }
    }

    /**
     * Maintenance for a Character visually in grass. The shadow is updated to
     * move or be deleted as needed.
     * 
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public maintainCharacterGrass(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.eightBitter.physics.isThingWithinGrass(thing, other)) {
            this.eightBitter.physics.killNormal(thing.shadow!);
            thing.canvas.height = thing.height * this.eightBitter.unitsize;
            this.eightBitter.pixelDrawer.setThingSprite(thing);

            delete thing.shadow;
            delete thing.grass;
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.eightBitter.physics.setLeft(thing.shadow!, thing.left);
        this.eightBitter.physics.setTop(thing.shadow!, thing.top);

        if (thing.shadow!.className !== thing.className) {
            this.eightBitter.graphics.setClass(thing.shadow!, thing.className);
        }
    }

    /**
     * Maintenance for a Player. The screen is scrolled according to the global
     * MapScreener.scrollability.
     * 
     * @param player   An in-game Player Thing.
     */
    public maintainPlayer(player: IPlayer): void {
        if (!player || !player.alive) {
            return;
        }

        switch (this.eightBitter.MapScreener.variables.scrollability) {
            case Scrollability.Horizontal:
                this.eightBitter.scrolling.scrollWindow(this.eightBitter.scrolling.getHorizontalScrollAmount());
                return;

            case Scrollability.Vertical:
                this.eightBitter.scrolling.scrollWindow(0, this.eightBitter.scrolling.getVerticalScrollAmount());
                return;

            case Scrollability.Both:
                this.eightBitter.scrolling.scrollWindow(
                    this.eightBitter.scrolling.getHorizontalScrollAmount(),
                    this.eightBitter.scrolling.getVerticalScrollAmount());
                return;

            default:
                return;
        }
    }
}
