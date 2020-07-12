import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ILocation } from "../Maps";

/**
 * Map entrance animations.
 */
export class EntranceAnimations extends Section<FullScreenPokemon> {
    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public readonly blank = (): void => {
        this.game.maps.addPlayer(0, 0);

        this.game.players[0].hidden = true;
    };

    /**
     * Standard Map entrance Function. Character is placed based on specified Location.
     *
     * @param location   Location within the Map being entered.
     */
    public readonly normal = (location: ILocation): void => {
        this.game.maps.addPlayer(location.xloc || 0, location.yloc || 0);

        this.game.actions.animateCharacterSetDirection(
            this.game.players[0],
            location.direction || Direction.Top
        );

        this.game.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.game.scenePlayer.startCutscene(location.cutscene, {
                player: this.game.players[0],
            });
        }

        if (location.routine && this.game.scenePlayer.getCutsceneName()) {
            this.game.scenePlayer.playRoutine(location.routine);
        }
    };

    /**
     * Map entrace Function used when player is added to the Map at the beginning
     * of play. Retrieves Character position from the previous save state.
     */
    public readonly resume = (): void => {
        const savedInfo: any = this.game.stateHolder.getChanges("player") || {};

        this.game.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);
        this.game.actions.animateCharacterSetDirection(
            this.game.players[0],
            savedInfo.direction || Direction.Top
        );
        this.game.scrolling.centerMapScreen();
    };
}
