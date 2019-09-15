import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * TrainerSpotted cutscene routines.
 */
export class TrainerSpottedCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for when a trainer is encountered for battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        this.eightBitter.actions.walking.animateCharacterPreventWalking(this.eightBitter.players[0]);
        this.eightBitter.actions.animateExclamation(
            settings.triggerer,
            70,
            this.eightBitter.scenePlayer.bindRoutine("Approach"));
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
        const locationPlayer: number = (player as any)[this.eightBitter.constants.directionOpposites[directionName]];
        const distance: number = Math.abs(locationTriggerer - locationPlayer);
        const blocks: number = Math.max(0, distance / this.eightBitter.constants.blockSize);

        if (blocks) {
            this.eightBitter.actions.walking.startWalkingOnPath(
                triggerer,
                [
                    { blocks, direction },
                    this.eightBitter.scenePlayer.bindRoutine("Dialog"),
                ]);
        } else {
            this.eightBitter.scenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Dialog(settings: any): void {
        this.eightBitter.collisions.detectors.collideCharacterDialog(settings.player, settings.triggerer);
        this.eightBitter.mapScreener.blockInputs = false;
    }
}
