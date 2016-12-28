import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Scrollability } from "./Scrolling";
import { ICharacter, IGrass, IPlayer, IThing } from "./Things";

/**
 * Maintenance functions used by FullScreenPokemon instances.
 */
export class Maintenance<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Generic maintenance Function for a group of Things. For each Thing, if
     * it isn't alive, it's removed from the group.
     * 
     * @param things   A group of Things to maintain.
     */
    public maintainGeneric(things: IThing[]): void {
        for (let i: number = 0; i < things.length; i += 1) {
            if (!things[i].alive) {
                this.gameStarter.utilities.arrayDeleteThing(things[i], things, i);
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
            this.gameStarter.physics.shiftCharacter(character);

            if (character.wantsToWalk && !character.walking && !this.gameStarter.menuGrapher.getActiveMenu()) {
                this.gameStarter.actions.walking.startWalking(character, character.nextDirection!);
            }

            if (character.grass) {
                this.maintainCharacterGrass(character, character.grass);
            }

            if (!character.alive && !character.outerOk) {
                this.gameStarter.utilities.arrayDeleteThing(character, characters, i);
                i -= 1;
                continue;
            }

            for (let j: number = 0; j < 4; j += 1) {
                character.bordering[j] = undefined;
            }

            this.gameStarter.quadsKeeper.determineThingQuadrants(character);
            this.gameStarter.thingHitter.checkHitsForThing(character as any);
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
        if (!this.gameStarter.physics.isThingWithinGrass(thing, other)) {
            this.gameStarter.physics.killNormal(thing.shadow!);
            thing.canvas.height = thing.height * 4;
            this.gameStarter.pixelDrawer.setThingSprite(thing);

            delete thing.shadow;
            delete thing.grass;
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.gameStarter.physics.setLeft(thing.shadow!, thing.left);
        this.gameStarter.physics.setTop(thing.shadow!, thing.top);

        if (thing.shadow!.className !== thing.className) {
            this.gameStarter.graphics.setClass(thing.shadow!, thing.className);
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

        switch (this.gameStarter.mapScreener.variables.scrollability) {
            case Scrollability.Horizontal:
                this.gameStarter.scrolling.scrollWindow(this.gameStarter.scrolling.getHorizontalScrollAmount());
                return;

            case Scrollability.Vertical:
                this.gameStarter.scrolling.scrollWindow(0, this.gameStarter.scrolling.getVerticalScrollAmount());
                return;

            case Scrollability.Both:
                this.gameStarter.scrolling.scrollWindow(
                    this.gameStarter.scrolling.getHorizontalScrollAmount(),
                    this.gameStarter.scrolling.getVerticalScrollAmount());
                return;

            default:
                return;
        }
    }
}
