import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * RivalRoute22Leaves cutscene routines.
 */
export class RivalRoute22LeavesCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for setting up rival walking away cutscene.
     */
    public AfterBattle(): void {
        if (!this.eightBitter.battles.isPartyWiped()) {
            this.eightBitter.mapScreener.blockInputs = true;
            this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("Walking"), 49);
        }
    }

    /**
     * Cutscene for the rival leaving after being defeated.
     */
    public Walking(): void {
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 1,
                direction: Direction.Top,
            },
            {
                blocks: 3,
                direction: Direction.Right,
            },
            {
                blocks: 8,
                direction: Direction.Bottom,
            },
            {
                blocks: 6,
                direction: Direction.Right,
            },
            {
                blocks: 3,
                direction: Direction.Top,
            },
            {
                blocks: 19,
                direction: Direction.Right,
            },
            {
                blocks: 1,
                direction: Direction.Top,
            },
            {
                blocks: 5,
                direction: Direction.Right,
            },
            (): void => {
                this.eightBitter.death.killNormal(rival);
                this.eightBitter.stateHolder.addChange(rival.id, "alive", false);
                this.eightBitter.mapScreener.blockInputs = false;
            },
        ];

        rival.nocollide = true;
        this.eightBitter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.eightBitter.scenePlayer.stopCutscene();
    }
}
