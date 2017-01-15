import { ISwitchAction } from "battlemovr/lib/Actions";
import { ISwitchingAnimations } from "battlemovr/lib/Animations";
import { ITeamAndAction, Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { Enter, IEnterSettings } from "./switching/Enter";

/**
 * Switching settings for animation positions and sprites.
 */
export interface ISwitchingSettings {
    /**
     * Entrance settings for animation positions and sprites.
     */
    enter: IEnterSettings;
}

/**
 * Player switching animations used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISwitchingAnimations {
    /**
     * Switching settings for animation positions and sprites.
     */
    private readonly settings: ISwitchingSettings;

    /**
     * Initializes a new instance of the Switching class.
     * 
     * @param gameStarter   FullScreenPokemon instance this is used for.
     * @param settings   Switching settings for animation positions and sprites.
     */
    public constructor(gameStarter: TGameStartr, settings: ISwitchingSettings) {
        super(gameStarter);

        this.settings = settings;
    }

    /**
     * Animation for when the player's actor enters battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public enter(onComplete: () => void): void {
        new Enter(this.gameStarter, this.settings.enter).run(onComplete);
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
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when this is done.
     */
    public switch(teamAndAction: ITeamAndAction<ISwitchAction>, onComplete: () => void): void {
        this.gameStarter.menuGrapher.deleteMenu("Pokemon");
        this.switchOut((): void => {
            this.gameStarter.battleMover.switchSelectedActor(Team.player, teamAndAction.action.newActor);
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
            battleInfo.texts.teams.player.retract(
                battleInfo.teams.player,
                battleInfo.teams.player.selectedActor.title.join("")),
            (): void => {
                this.gameStarter.actions.shrinking.contractDown(
                    battleInfo.things.player,
                    onComplete);
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
