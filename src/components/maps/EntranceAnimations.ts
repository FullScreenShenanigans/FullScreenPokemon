import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ILocation } from "../Maps";

/**
 * Map entrance animations.
 */
export class EntranceAnimations<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public readonly blank = (): void => {
        this.eightBitter.maps.addPlayer(0, 0);

        this.eightBitter.players[0].hidden = true;
    }

    /**
     * Standard Map entrance Function. Character is placed based on specified Location.
     *
     * @param location   Location within the Map being entered.
     */
    public readonly normal = (location: ILocation): void => {
        this.eightBitter.maps.addPlayer(location.xloc || 0, location.yloc || 0);

        this.eightBitter.actions.animateCharacterSetDirection(
            this.eightBitter.players[0],
            location.direction || Direction.Top);

        this.eightBitter.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.eightBitter.scenePlayer.startCutscene(location.cutscene, {
                player: this.eightBitter.players[0],
            });
        }

        if (location.routine && this.eightBitter.scenePlayer.getCutsceneName()) {
            this.eightBitter.scenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning
     * of play. Retrieves Character position from the previous save state.
     */
    public readonly resume = (): void => {
        const savedInfo: any = this.eightBitter.stateHolder.getChanges("player") || {};

        this.eightBitter.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);
        this.eightBitter.actions.animateCharacterSetDirection(this.eightBitter.players[0], savedInfo.direction || Direction.Top);
        this.eightBitter.scrolling.centerMapScreen();
    }
}
