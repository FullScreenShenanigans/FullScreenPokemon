import { BattleOutcome } from "battlemovr/lib/Animations";
import { Queue } from "battlemovr/lib/animators/Queue";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IBattleOutcomeTextGenerator } from "../../constants/Battles/Texts";
import { Transitions } from "./Transitions";

/**
 * Battle end animations used by FullScreenPokemon instances.
 */
export class Ending<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Transition animations used by the FullScreenPokemon instance.
     */
    public readonly transitions: Transitions<TGameStartr> = new Transitions(this.gameStarter);

    /**
     * Runs ending battle animations.
     * 
     * @param outcome   Descriptor of what finished the battle.
     */
    public run(outcome: BattleOutcome): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        const queue: Queue = new Queue();
        const finalTextGenerator: IBattleOutcomeTextGenerator | undefined = battleInfo.texts.outcomes[outcome];

        if (finalTextGenerator) {
            queue.add((onComplete: () => void): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    finalTextGenerator(),
                    onComplete);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.add((onComplete: () => void): void => {
            this.gameStarter.actions.animateFadeToColor({
                callback: onComplete,
                color: "Black"
            });
        });

        if (battleInfo.texts.afterBattle) {
            queue.add((onComplete: () => void): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.texts.afterBattle!(),
                    onComplete);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.run((): void => this.finalize(battleInfo, outcome));
    }

    /**
     * Disposes of visual things post-battle.
     * 
     * @param battleInfo   Info on the ending battle.
     */
    private finalize(battleInfo: IBattleInfo, outcome: BattleOutcome): void {
        this.gameStarter.menuGrapher.deleteMenu("Battle");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        for (const i in battleInfo.things) {
            this.gameStarter.physics.killNormal(battleInfo.things[i]);
        }

        if (battleInfo.keptThings) {
            this.gameStarter.graphics.moveThingsFromText(battleInfo.keptThings);
        }

        if (battleInfo.onComplete) {
            battleInfo.onComplete(outcome);
        }
    }
}
