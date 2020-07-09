import { IThingMaintainer, Maintenance as EightBittrMaintenance } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Scrollability } from "./Scrolling";
import { ICharacter, IPlayer } from "./Things";

/**
 * Maintains Things during FrameTickr frames.
 */
export class Maintenance<TEightBittr extends FullScreenPokemon> extends EightBittrMaintenance<TEightBittr> {
    /**
     * Maintenance for all active Characters. Walking, grass maintenance, alive
     * checking, and quadrant maintenance are performed.
     *
     * @param characters   The Characters group of Things.
     */
    public readonly maintainCharacter = (character: ICharacter): void => {
        this.game.physics.shiftCharacter(character);

        if (character.wantsToWalk && !character.walking && !this.game.menuGrapher.getActiveMenu()) {
            this.game.actions.walking.startWalking(
                character,
                character.nextDirection === undefined
                    ? character.direction
                    : character.nextDirection);
        }

        if (character.grass) {
            this.game.actions.grass.maintainGrassVisuals(character, character.grass);
        }

        for (let j = 0; j < 4; j += 1) {
            character.bordering[j] = undefined;
        }
    }

    /**
     * Maintenance for a Player. The screen is scrolled according to the global
     * MapScreener.scrollability.
     *
     * @param player   An in-game Player Thing.
     */
    public readonly maintainPlayer = (player: IPlayer): void => {
        if (!player || player.removed) {
            return;
        }

        switch (this.game.mapScreener.variables.scrollability) {
            case Scrollability.Horizontal:
                this.game.scrolling.scrollWindow(this.game.scrolling.getHorizontalScrollAmount());
                return;

            case Scrollability.Vertical:
                this.game.scrolling.scrollWindow(0, this.game.scrolling.getVerticalScrollAmount());
                return;

            case Scrollability.Both:
                this.game.scrolling.scrollWindow(
                    this.game.scrolling.getHorizontalScrollAmount(),
                    this.game.scrolling.getVerticalScrollAmount());
                return;

            default:
                return;
        }
    }

    /**
     * Group type names along with their tick maintenance functions.
     */
    public readonly maintainers: [string, IThingMaintainer][] = [
        ["Character", this.maintainCharacter],
    ];
}
