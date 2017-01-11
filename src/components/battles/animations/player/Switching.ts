import { ISwitchAction } from "battlemovr/lib/Actions";
import { ISwitchingAnimations } from "battlemovr/lib/Animations";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { Enter } from "./switching/Enter";

/**
 * Player switching animations used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISwitchingAnimations {
    /**
     * Animation for when the player's actor enters battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public enter(onComplete: () => void): void {
        new Enter(this.gameStarter).run(onComplete);
    }

    /**
     * Animation for when the player's actor exits battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public exit(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the player's actor gets knocked out.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public knockout(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for the player switching Pokemon.
     * 
     * @param action   Switching action being performed.
     * @param onComplete   Callback for when this is done.
     */
    public switch(action: ISwitchAction, onComplete: () => void): void {
        this.gameStarter.menuGrapher.deleteMenu("Pokemon");
        this.switchOut((): void => {
            this.gameStarter.battleMover.switchSelectedActor(Team.player, action.newActor);
            this.enter(onComplete);
        });
    }

    /**
     * Animation for switching out the current Pokemon.
     * 
     * @param onComplete   Callback for when this is done.
     */
    private switchOut(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.texts.teams.player.retract[1],
                    battleInfo.teams.player.selectedActor.nickname,
                    battleInfo.texts.teams.player.retract[2]
                ]
            ],
            (): void => {
                this.gameStarter.actions.shrinking.contractDown(
                    battleInfo.things.player,
                    onComplete);
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
