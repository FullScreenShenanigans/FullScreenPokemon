import { BattleOutcome } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
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
        this.gameStarter.actions.animateFadeToColor({
            callback: (): void => this.completeBattle(outcome),
            color: "Black"
        });
    }

    /**
     * Disposes of visual things and signals that the battle is over.
     * 
     * @param outcome   Descriptor of what finished the battle.
     */
    private completeBattle(outcome: BattleOutcome): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

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
