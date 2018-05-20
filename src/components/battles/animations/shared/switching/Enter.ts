import { Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../../Battles";
import { IThing } from "../../../../Things";

/**
 * Entrance settings for animation positions and sprites.
 */
export interface IEnterSettings {
    /**
     * Which team this is for.
     */
    team: Team;

    /**
     * @param info   Info on the current battle.
     * @returns Where to slide a leader to on switching.
     */
    getLeaderSlideToGoal(battleInfo: IBattleInfo): number;

    /**
     * @param info   Info on the current battle.
     * @returns What sprite is to be used for the selected Pokemon.
     */
    getSelectedPokemonSprite(battleInfo: IBattleInfo): string;

    /**
     * @param info   Info on the current battle.
     * @returns Mid-left position for the smoke effect.
     */
    getSmokeLeft(battleInfo: IBattleInfo): number;

    /**
     * @param info   Info on the current battle.
     * @returns Mid-top position for the smoke effect.
     */
    getSmokeTop(battleInfo: IBattleInfo): number;
}

/**
 * Shared team entrance animations.
 */
export class Enter<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Entrance settings for animation positions and sprites.
     */
    private readonly settings: IEnterSettings;

    /**
     * Initializes a new instance of the Enter class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param settings   Entrance settings for animation positions and sprites.
     */
    public constructor(eightBitter: TEightBittr, settings: IEnterSettings) {
        super(eightBitter);

        this.settings = settings;
    }

    /**
     * Runs an entrance animation for the team's selected Pokemon.
     *
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

        battleInfo.teams[Team[this.settings.team]].leader
            ? this.runWithLeader(battleInfo, onComplete)
            : this.runWithoutLeader(battleInfo, onComplete);
    }

    /**
     * Runs a Pokemon entrance animation without a team leader.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithoutLeader(battleInfo: IBattleInfo, onComplete: () => void): void {
        this.eightBitter.battles.decorations.health.addPokemonHealth(
            battleInfo.teams[Team[this.settings.team]].selectedActor,
            this.settings.team);

        onComplete();
    }

    /**
     * Runs a Pokemon entrance animation with a team leader.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithLeader(battleInfo: IBattleInfo, onComplete: () => void): void {
        const thing: IThing = battleInfo.things[Team[this.settings.team]];
        const goal: number = this.settings.getLeaderSlideToGoal(battleInfo);
        const timeout = 24;

        this.eightBitter.animations.sliding.slideHorizontallyAndFadeOut(
            thing,
            goal,
            timeout,
            (): void => this.poofSmoke(battleInfo, onComplete));

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[Team[this.settings.team]].sendOut(
                battleInfo.teams[Team[this.settings.team]],
                battleInfo.teams[Team[this.settings.team]].selectedActor.title.join("")));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates a poof of smoke before the Pokemon appears.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private poofSmoke(battleInfo: IBattleInfo, onComplete: () => void): void {
        const left: number = this.settings.getSmokeLeft(battleInfo);
        const top: number = this.settings.getSmokeTop(battleInfo);

        this.eightBitter.actions.animateSmokeSmall(
            left,
            top,
            (): void => this.appear(battleInfo, onComplete));
    }

    /**
     * Visually shows the Pokemon.
     *
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private appear(battleInfo: IBattleInfo, onComplete: () => void): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");

        this.eightBitter.battles.decorations.health.addPokemonHealth(
            battleInfo.teams[Team[this.settings.team]].selectedActor,
            this.settings.team);

        this.eightBitter.battles.things.setThing(
            this.settings.team,
            this.settings.getSelectedPokemonSprite(battleInfo));

        onComplete();
    }
}
