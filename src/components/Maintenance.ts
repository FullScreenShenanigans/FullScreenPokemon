import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Scrollability } from "./Scrolling";
import { ICharacter, IPlayer, IThing } from "./Things";

/**
 * Maintains Things during FrameTickr frames.
 */
export class Maintenance<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Generic maintenance Function for a group of Things. For each Thing, if
     * it isn't alive, it's removed from the group.
     *
     * @param things   A group of Things to maintain.
     */
    public maintainGeneric(things: IThing[]): void {
        for (let i = 0; i < things.length; i += 1) {
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
        for (let i = 0; i < characters.length; i += 1) {
            const character: ICharacter = characters[i];
            this.eightBitter.physics.shiftCharacter(character);

            if (character.wantsToWalk && !character.walking && !this.eightBitter.menuGrapher.getActiveMenu()) {
                this.eightBitter.actions.walking.startWalking(
                    character,
                    character.nextDirection === undefined
                        ? character.direction
                        : character.nextDirection);
            }

            if (character.grass) {
                this.eightBitter.actions.grass.maintainGrassVisuals(character, character.grass);
            }

            if (!character.alive && !character.outerOk) {
                this.eightBitter.utilities.arrayDeleteThing(character, characters, i);
                i -= 1;
                continue;
            }

            for (let j = 0; j < 4; j += 1) {
                character.bordering[j] = undefined;
            }

            this.eightBitter.quadsKeeper.determineThingQuadrants(character);
            this.eightBitter.thingHitter.checkHitsForThing(character as any);
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

        switch (this.eightBitter.mapScreener.variables.scrollability) {
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
