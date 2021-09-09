import { member } from "babyioc";
import { SwitchAction, SwitchingAnimations, TeamAndAction, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { Shrinking } from "../../../animations/Shrinking";
import { BattleInfo } from "../../../Battles";

import { Enter, EnterSettings } from "./switching/Enter";

/**
 * Switching settings for animation positions and sprites.
 */
export interface SwitchingSettings {
    /**
     * Entrance settings for animation positions and sprites.
     */
    enter: EnterSettings;
}

/**
 * Shared animations for teams switching Pokemon.
 */
export class Switching extends Section<FullScreenPokemon> implements SwitchingAnimations {
    /**
     * Shrinks (and expands) Actors.
     */
    @member(Shrinking)
    public readonly shrinking: Shrinking;

    /**
     * Switching settings for animation positions and sprites.
     */
    private readonly settings: SwitchingSettings;

    /**
     * Initializes a new instance of the Switching class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Switching settings for animation positions and sprites.
     */
    public constructor(
        eightBitter: FullScreenPokemon | Section<FullScreenPokemon>,
        settings: SwitchingSettings
    ) {
        super(eightBitter);

        this.settings = settings;
    }

    /**
     * Animation for when a team's actor enters battle.
     *
     * @param onComplete   Callback for when this is done.
     */
    public enter(onComplete: () => void): void {
        new Enter(this.game, this.settings.enter).run(onComplete);
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
    public switch(teamAndAction: TeamAndAction<SwitchAction>, onComplete: () => void): void {
        this.game.menuGrapher.deleteMenu("Pokemon");
        this.switchOut((): void => {
            this.game.battleMover.switchSelectedActor(
                TeamId.player,
                teamAndAction.action.newActor
            );
            this.enter(onComplete);
        });
    }

    /**
     * Animation for switching out the current Pokemon.
     *
     * @param onComplete   Callback for when this is done.
     */
    private switchOut(onComplete: () => void): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams.player.retract(
                battleInfo.teams.player,
                battleInfo.teams.player.selectedActor.title.join("")
            ),
            (): void => {
                this.shrinking.contractDown(battleInfo.actors.player, onComplete);
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
