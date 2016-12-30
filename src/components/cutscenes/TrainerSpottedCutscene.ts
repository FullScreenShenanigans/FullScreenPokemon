import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * TrainerSpotted cutscene functions used by FullScreenPokemon instances.
 */
export class TrainerSpottedCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for when a trainer is encountered for battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        this.gameStarter.actions.walking.animateCharacterPreventWalking(this.gameStarter.players[0]);
        this.gameStarter.actions.animateExclamation(
            settings.triggerer,
            70,
            this.gameStarter.scenePlayer.bindRoutine("Approach"));
    }

    /**
     * Cutscene for when a trainer approaches the player after being encountered. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public Approach(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const direction: Direction = triggerer.direction;
        const directionName: string = Direction[direction].toLowerCase();
        const locationTriggerer: number = (triggerer as any)[directionName];
        const locationPlayer: number = (player as any)[this.gameStarter.constants.directionOpposites[directionName]];
        const distance: number = Math.abs(locationTriggerer - locationPlayer);
        const blocks: number = Math.max(0, distance / this.gameStarter.constants.blockSize);

        if (blocks) {
            this.gameStarter.actions.walking.startWalkingOnPath(
                triggerer,
                [
                    { blocks, direction },
                    this.gameStarter.scenePlayer.bindRoutine("Dialog")
                ]);
        } else {
            this.gameStarter.scenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Dialog(settings: any): void {
        this.gameStarter.collisions.collideCharacterDialog(settings.player, settings.triggerer);
        this.gameStarter.mapScreener.blockInputs = false;
    }
}
