import { BattleOutcome } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../../Battles";

/**
 * Player fleeing logic used by FullScreenPokemon instances.
 */
export class FleeAttempt<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Animates the player attempting to flee.
     * 
     * @param onComplete   Handler for when this is done.
     * @remarks onComplete won't be called if the battle is ended by fleeing successfully.
     * @see http://bulbapedia.bulbagarden.net/wiki/Escape#Generation_I_and_II
     */
    public attempt(onComplete: () => void): void {
        if (this.canEscape()) {
            this.succeed();
        } else {
            this.fail(onComplete);
        }
    }

    /**
     * Handler for the player successfully fleeing.
     */
    public succeed(): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.flee.success(),
            (): void => this.gameStarter.battleMover.stopBattle(BattleOutcome.playerFled));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Handler for the player failing to flee.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public fail(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.flee.fail(),
            onComplete);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * @returns Whether the player may flee.
     */
    private canEscape(): boolean {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const playerPokemon: IPokemon = battleInfo.teams.player.selectedActor;
        const opponentPokemon: IPokemon = battleInfo.teams.player.selectedActor;
        const a: number = playerPokemon.statistics.speed.current;
        const b: number = (opponentPokemon.statistics.speed.normal / 4) % 256;
        const f: number = (a * 32) / b + 30 * battleInfo.fleeAttempts;

        battleInfo.fleeAttempts += 1;

        if (f > 255 || b === 0) {
            return true;
        }

        return this.gameStarter.numberMaker.randomInt(256) < f;
    }
}
