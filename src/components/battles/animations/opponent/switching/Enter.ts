import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../../Battles";
import { IMenu } from "../../../../Menus";
import { IThing } from "../../../../Things";

/**
 * Opponent actor entrance animations used by FullScreenPokemon instances.
 */
export class Enter<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Runs an entrance animation for the opponent's selected Pokemon.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        battleInfo.teams.opponent.leader
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
        this.gameStarter.battles.decorations.addPokemonHealth(
            battleInfo.teams.opponent.selectedActor,
            Team.opponent);

        onComplete();
    }

    /**
     * Runs a Pokemon entrance animation with a team leader.
     * 
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithLeader(battleInfo: IBattleInfo, onComplete: () => void): void {
        const opponent: IThing = battleInfo.things.opponent;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
        const goal: number = menu.right + opponent.width / 2;
        const timeout: number = 24;

        this.gameStarter.actions.sliding.slideHorizontallyAndFadeOut(
            opponent,
            goal,
            timeout,
            (): void => this.poofSmoke(battleInfo, onComplete));

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams.opponent.sendOut(
            battleInfo.teams.opponent,
            battleInfo.teams.opponent.selectedActor.title.join("")));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates a poof of smoke before the Pokemon appears.
     * 
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private poofSmoke(battleInfo: IBattleInfo, onComplete: () => void): void {
        const left: number = battleInfo.things.menu.right - 32;
        const top: number = battleInfo.things.menu.top + 32;

        this.gameStarter.actions.animateSmokeSmall(
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
        this.gameStarter.menuGrapher.createMenu("GeneralText");

        this.gameStarter.battles.decorations.addPokemonHealth(
            battleInfo.teams.opponent.selectedActor,
            Team.opponent);

        this.gameStarter.battles.things.setOpponentThing(battleInfo.teams.opponent.selectedActor.title.join("") + "Front");

        onComplete();
    }
}
