import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * RivalRoute22Leaves cutscene functions used by FullScreenPokemon instances.
 */
export class RivalRoute22LeavesCutscene<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Cutscene for setting up rival walking away cutscene.
     */
    public AfterBattle(): void {
        if (!this.gameStarter.battles.isPartyWiped()) {
            this.gameStarter.mapScreener.blockInputs = true;
            this.gameStarter.timeHandler.addEvent(this.gameStarter.scenePlayer.bindRoutine("Walking"), 49);
        }
    }

    /**
     * Cutscene for the rival leaving after being defeated.
     */
    public Walking(): void {
        const rival: ICharacter = this.gameStarter.utilities.getExistingThingById("Rival") as ICharacter;
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
                this.gameStarter.physics.killNormal(rival);
                this.gameStarter.stateHolder.addChange(rival.id, "alive", false);
                this.gameStarter.mapScreener.blockInputs = false;
            },
        ];

        rival.nocollide = true;
        this.gameStarter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.gameStarter.scenePlayer.stopCutscene();
    }
}
