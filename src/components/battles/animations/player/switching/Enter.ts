import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";


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
        const playerX: number = this.gameStarter.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width / 2;
        const timeout: number = 24;

        this.gameStarter.actions.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    player,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", this.generateDialog(battleInfo));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            (): void => this.poofSmoke(battleInfo, onComplete),
            timeout);
    }

    /**
     * Generates the entrance dialog.
     * 
     * @param battleInfo   Info on the current battle.
     * @returns Text for the entrance dialog.
     */
    private generateDialog(battleInfo: IBattleInfo): IMenuDialogRaw {
        const dialog: IMenuDialogRaw = [
            battleInfo.texts.teams.player.sendOut[1],
            battleInfo.teams.player.selectedActor.nickname,
            battleInfo.texts.teams.player.sendOut[2]
        ];

        dialog.unshift(battleInfo.texts.teams.player.sendOut[0]);

        return [dialog];
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
