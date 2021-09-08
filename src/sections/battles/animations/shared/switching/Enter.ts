import { TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { BattleInfo } from "../../../../Battles";
import { Actor } from "../../../../Actors";

/**
 * Entrance settings for animation positions and sprites.
 */
export interface EnterSettings {
    /**
     * Which team this is for.
     */
    team: TeamId;

    /**
     * @param info   Info on the current battle.
     * @returns Where to slide a leader to on switching.
     */
    getLeaderSlideToGoal(battleInfo: BattleInfo): number;

    /**
     * @param info   Info on the current battle.
     * @returns What sprite is to be used for the selected Pokemon.
     */
    getSelectedPokemonSprite(battleInfo: BattleInfo): string;

    /**
     * @param info   Info on the current battle.
     * @returns Mid-left position for the smoke effect.
     */
    getSmokeLeft(battleInfo: BattleInfo): number;

    /**
     * @param info   Info on the current battle.
     * @returns Mid-top position for the smoke effect.
     */
    getSmokeTop(battleInfo: BattleInfo): number;
}

/**
 * Shared team entrance animations.
 */
export class Enter extends Section<FullScreenPokemon> {
    /**
     * Entrance settings for animation positions and sprites.
     */
    private readonly settings: EnterSettings;

    /**
     * Initializes a new instance of the Enter class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Entrance settings for animation positions and sprites.
     */
    public constructor(eightBitter: FullScreenPokemon, settings: EnterSettings) {
        super(eightBitter);

        this.settings = settings;
    }

    /**
     * Runs an entrance animation for the team's selected Pokemon.
     *
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        battleInfo.teams[TeamId[this.settings.team]].leader
            ? this.runWithLeader(battleInfo, onComplete)
            : this.runWithoutLeader(battleInfo, onComplete);
    }

    /**
     * Runs a Pokemon entrance animation without a team leader.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithoutLeader(battleInfo: BattleInfo, onComplete: () => void): void {
        this.game.battles.decorations.health.addPokemonHealth(
            battleInfo.teams[TeamId[this.settings.team]].selectedActor,
            this.settings.team
        );

        onComplete();
    }

    /**
     * Runs a Pokemon entrance animation with a team leader.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithLeader(battleInfo: BattleInfo, onComplete: () => void): void {
        const actor: Actor = battleInfo.actors[TeamId[this.settings.team]];
        const goal: number = this.settings.getLeaderSlideToGoal(battleInfo);
        const timeout = 24;

        this.game.animations.sliding.slideHorizontallyAndFadeOut(actor, goal, timeout, (): void =>
            this.poofSmoke(battleInfo, onComplete)
        );

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[TeamId[this.settings.team]].sendOut(
                battleInfo.teams[TeamId[this.settings.team]],
                battleInfo.teams[TeamId[this.settings.team]].selectedActor.title.join("")
            )
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates a poof of smoke before the Pokemon appears.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private poofSmoke(battleInfo: BattleInfo, onComplete: () => void): void {
        const left: number = this.settings.getSmokeLeft(battleInfo);
        const top: number = this.settings.getSmokeTop(battleInfo);

        this.game.actions.animateSmokeSmall(left, top, (): void =>
            this.appear(battleInfo, onComplete)
        );
    }

    /**
     * Visually shows the Pokemon.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private appear(battleInfo: BattleInfo, onComplete: () => void): void {
        this.game.menuGrapher.createMenu("GeneralText");

        this.game.battles.decorations.health.addPokemonHealth(
            battleInfo.teams[TeamId[this.settings.team]].selectedActor,
            this.settings.team
        );

        this.game.battles.actors.setActor(
            this.settings.team,
            this.settings.getSelectedPokemonSprite(battleInfo)
        );

        onComplete();
    }
}
