import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../../Battles";
import { IMenu } from "../../../../Menus";
import { IThing } from "../../../../Things";

/**
 * Player actor entrance animations used by FullScreenPokemon instances.
 */
export class Enter<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Runs an entrance animation for the player's selected Pokemon.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        battleInfo.teams.player.leader
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
            battleInfo.teams.player.selectedActor,
            Team.player);

        onComplete();
    }

    /**
     * Runs a Pokemon entrance animation with a team leader.
     * 
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runWithLeader(battleInfo: IBattleInfo, onComplete: () => void): void {
        const player: IThing = battleInfo.things.player;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
        const playerGoal: number = menu.left - player.width / 2;
        const timeout: number = 24;

        this.gameStarter.actions.sliding.slideHorizontallyAndFadeOut(
            player,
            playerGoal,
            timeout,
            (): void => this.poofSmoke(battleInfo, onComplete));

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams.player.sendOut(
                battleInfo.teams.player,
                battleInfo.teams.player.selectedActor.title.join("")));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates a poof of smoke before the Pokemon appears.
     * 
     * @param battleInfo   Info on the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private poofSmoke(battleInfo: IBattleInfo, onComplete: () => void): void {
        const left: number = battleInfo.things.menu.left + 32;
        const top: number = battleInfo.things.menu.bottom - 32;

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
            battleInfo.teams.player.selectedActor,
            Team.player);

        this.gameStarter.battles.things.setPlayerThing(battleInfo.teams.player.selectedActor.title.join("") + "Back");

        onComplete();
    }
}
