import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * RivalRoute22Leaves cutscene routines.
 */
export class RivalRoute22LeavesCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for setting up rival walking away cutscene.
     */
    public AfterBattle(): void {
        if (!this.game.battles.isPartyWiped()) {
            this.game.mapScreener.blockInputs = true;
            this.game.timeHandler.addEvent(this.game.scenePlayer.bindRoutine("Walking"), 49);
        }
    }

    /**
     * Cutscene for the rival leaving after being defeated.
     */
    public Walking(): void {
        const rival: ICharacter = this.game.utilities.getExistingThingById("Rival");
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
                this.game.death.kill(rival);
                this.game.stateHolder.addChange(rival.id, "alive", false);
                this.game.mapScreener.blockInputs = false;
            },
        ];

        rival.nocollide = true;
        this.game.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.game.scenePlayer.stopCutscene();
    }
}
