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
     * 
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        const player: IThing = battleInfo.things.player;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
        const playerX: number = this.gameStarter.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width / 2;
        const textPlayerSendOut: [string, string] = battleInfo.texts.playerSendOut || ["", ""];
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
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textPlayerSendOut[0],
                    battleInfo.teams.player.selectedActor.nickname,
                    textPlayerSendOut[1]
                ]
            ]
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            (): void => this.poofSmoke(battleInfo, onComplete),
            timeout);
    }

    /**
     * 
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
     * 
     */
    private appear(battleInfo: IBattleInfo, onComplete: () => void): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");

        this.gameStarter.battles.things.setPlayer(battleInfo.teams.player.selectedActor.title.join("") + "Back");

        onComplete();
    }
}
