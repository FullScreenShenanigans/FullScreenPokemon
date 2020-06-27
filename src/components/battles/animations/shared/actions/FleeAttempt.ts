import { BattleOutcome } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../../Battles";

/**
 * Logic for whether the player may flee a battle.
 */
export class FleeAttempt extends Section<FullScreenPokemon> {
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
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.flee.success(),
            (): void => this.eightBitter.battleMover.stopBattle(BattleOutcome.playerFled));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Handler for the player failing to flee.
     *
     * @param onComplete   Callback for when this is done.
     */
    public fail(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.flee.fail(),
            onComplete);
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * @returns Whether the player may flee.
     */
    private canEscape(): boolean {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        const playerPokemon: IPokemon = battleInfo.teams.player.selectedActor;
        const opponentPokemon: IPokemon = battleInfo.teams.player.selectedActor;
        const a: number = playerPokemon.statistics.speed.current;
        const b: number = (opponentPokemon.statistics.speed.normal / 4) % 256;
        const f: number = (a * 32) / b + battleInfo.fleeAttempts * 30;

        battleInfo.fleeAttempts += 1;

        if (f > 255 || b === 0) {
            return true;
        }

        return this.eightBitter.numberMaker.randomInt(256) < f;
    }
}
