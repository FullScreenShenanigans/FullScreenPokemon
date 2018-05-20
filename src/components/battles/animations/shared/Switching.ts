import { component } from "babyioc";
import { ISwitchAction, ISwitchingAnimations, ITeamAndAction, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { Shrinking } from "../../../animations/Shrinking";
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
 * Shared animations for teams switching Pokemon.
 */
export class Switching<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> implements ISwitchingAnimations {
    /**
     * Shrinks (and expands) Things.
     */
    @component(Shrinking)
    public readonly shrinking: Shrinking<TEightBittr>;

    /**
     * Switching settings for animation positions and sprites.
     */
    private readonly settings: ISwitchingSettings;

    /**
     * Initializes a new instance of the Switching class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Switching settings for animation positions and sprites.
     */
    public constructor(eightBitter: TEightBittr | GeneralComponent<TEightBittr>, settings: ISwitchingSettings) {
        super(eightBitter);

        this.settings = settings;
    }

    /**
     * Animation for when a team's actor enters battle.
     *
     * @param onComplete   Callback for when this is done.
     */
    public enter(onComplete: () => void): void {
        new Enter(this.eightBitter, this.settings.enter).run(onComplete);
    }

    /**
     * Animation for when a team's actor exits battle.
     *
     * @param onComplete   Callback for when this is done.
     */
    public exit(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when a team's actor gets knocked out.
     *
     * @param onComplete   Callback for when this is done.
     */
    public knockout(onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for a team switching Pokemon.
     *
     * @param teamAndAction   Team and action being performed.
     * @param onComplete   Callback for when this is done.
     */
    public switch(teamAndAction: ITeamAndAction<ISwitchAction>, onComplete: () => void): void {
        this.eightBitter.menuGrapher.deleteMenu("Pokemon");
        this.switchOut((): void => {
            this.eightBitter.battleMover.switchSelectedActor(Team.player, teamAndAction.action.newActor);
            this.enter(onComplete);
        });
    }

    /**
     * Animation for switching out the current Pokemon.
     *
     * @param onComplete   Callback for when this is done.
     */
    private switchOut(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams.player.retract(
                battleInfo.teams.player,
                battleInfo.teams.player.selectedActor.title.join("")),
            (): void => {
                this.shrinking.contractDown(
                    battleInfo.things.player,
                    onComplete);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
