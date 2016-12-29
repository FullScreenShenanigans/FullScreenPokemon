import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Scrollability } from "./Scrolling";
import { ICharacter, IPlayer, IThing } from "./Things";

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
                this.gameStarter.actions.walking.startWalking(
                    character,
                    character.nextDirection === undefined
                        ? character.direction
                        : character.nextDirection);
            }

            if (character.grass) {
                this.gameStarter.actions.grass.maintainGrassVisuals(character, character.grass);
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
