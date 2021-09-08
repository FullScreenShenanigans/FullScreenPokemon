import { ActorMaintainer, Maintenance as EightBittrMaintenance } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Scrollability } from "./Scrolling";
import { Character, Player } from "./Actors";

/**
 * Maintains Actors during FrameTickr frames.
 */
export class Maintenance<Game extends FullScreenPokemon> extends EightBittrMaintenance<Game> {
    /**
     * Maintenance for all active Characters. Walking, grass maintenance, alive
     * checking, and quadrant maintenance are performed.
     *
     * @param characters   The Characters group of Actors.
     */
    public readonly maintainCharacter = (character: Character): void => {
        this.game.physics.shiftCharacter(character);

        if (
            character.wantsToWalk &&
            !character.walking &&
            !this.game.menuGrapher.getActiveMenu()
        ) {
            this.game.actions.walking.startWalking(
                character,
                character.nextDirection === undefined
                    ? character.direction
                    : character.nextDirection
            );
        }

        if (character.grass) {
            this.game.actions.grass.maintainGrassVisuals(character, character.grass);
        }

        for (let j = 0; j < 4; j += 1) {
            character.bordering[j] = undefined;
        }
    };

    /**
     * Maintenance for a Player. The screen is scrolled according to the global
     * MapScreener.scrollability.
     *
     * @param player   An in-game Player Actor.
     */
    public readonly maintainPlayer = (player: Player): void => {
        if (!player || player.removed) {
            return;
        }

        switch (this.game.mapScreener.variables.scrollability) {
            case Scrollability.Horizontal:
                this.game.scrolling.scrollWindow(this.game.scrolling.getHorizontalScrollAmount());
                return;

            case Scrollability.Vertical:
                this.game.scrolling.scrollWindow(
                    0,
                    this.game.scrolling.getVerticalScrollAmount()
                );
                return;

            case Scrollability.Both:
                this.game.scrolling.scrollWindow(
                    this.game.scrolling.getHorizontalScrollAmount(),
                    this.game.scrolling.getVerticalScrollAmount()
                );
                return;
        }
    };

    /**
     * Group type names along with their tick maintenance functions.
     */
    public readonly maintainers: [string, ActorMaintainer][] = [
        ["Character", this.maintainCharacter],
    ];
}
