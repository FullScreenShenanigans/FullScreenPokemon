import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ILocation } from "../Maps";

/**
 * Map entrance animations.
 */
export class Entrances<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public blank = (): void => {
        this.gameStarter.maps.addPlayer(0, 0);

        this.gameStarter.players[0].hidden = true;
    }

    /**
     * Standard Map entrance Function. Character is placed based on specified Location.
     *
     * @param location   Location within the Map being entered.
     */
    public normal = (location: ILocation): void => {
        this.gameStarter.maps.addPlayer(location.xloc || 0, location.yloc || 0);

        this.gameStarter.actions.animateCharacterSetDirection(
            this.gameStarter.players[0],
            location.direction || Direction.Top);

        this.gameStarter.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.gameStarter.scenePlayer.startCutscene(location.cutscene, {
                player: this.gameStarter.players[0],
            });
        }

        if (location.routine && this.gameStarter.scenePlayer.getCutsceneName()) {
            this.gameStarter.scenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning
     * of play. Retrieves Character position from the previous save state.
     */
    public resume = (): void => {
        const savedInfo: any = this.gameStarter.stateHolder.getChanges("player") || {};

        this.gameStarter.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);
        this.gameStarter.actions.animateCharacterSetDirection(this.gameStarter.players[0], savedInfo.direction || Direction.Top);
        this.gameStarter.scrolling.centerMapScreen();
    }
}
