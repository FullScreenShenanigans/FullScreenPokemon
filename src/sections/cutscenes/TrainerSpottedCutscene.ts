import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * TrainerSpotted cutscene routines.
 */
export class TrainerSpottedCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for when a trainer is encountered for battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        this.game.actions.walking.animateCharacterPreventWalking(this.game.players[0]);
        this.game.actions.animateExclamation(
            settings.triggerer,
            70,
            this.game.scenePlayer.bindRoutine("Approach"));
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
        const locationPlayer: number = (player as any)[this.game.constants.directionOpposites[directionName]];
        const distance: number = Math.abs(locationTriggerer - locationPlayer);
        const blocks: number = Math.max(0, distance / this.game.constants.blockSize);

        if (blocks) {
            this.game.actions.walking.startWalkingOnPath(
                triggerer,
                [
                    { blocks, direction },
                    this.game.scenePlayer.bindRoutine("Dialog"),
                ]);
        } else {
            this.game.scenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Dialog(settings: any): void {
        this.game.collisions.detectors.collideCharacterDialog(settings.player, settings.triggerer);
        this.game.mapScreener.blockInputs = false;
    }
}
