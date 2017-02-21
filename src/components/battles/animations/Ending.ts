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
     * @param onComplete   Callback for when it's safe to dispose of battle info.
     */
    public run(outcome: BattleOutcome, onComplete?: () => void): void {
        console.log("Battle outcome", outcome);
        this.gameStarter.actions.animateFadeToColor({
            callback: (): void => this.resetThings(onComplete),
            color: "Black"
        });
    }

    /**
     * Disposes of visual things and signals that the battle is over.
     * 
     * @param onComplete   Callback for when it's safe to dispose of battle info.
     */
    private resetThings(onComplete?: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.menuGrapher.deleteMenu("Battle");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        for (const i in battleInfo.things) {
            this.gameStarter.physics.killNormal(battleInfo.things[i]);
        }

        if (battleInfo.keptThings) {
            this.gameStarter.graphics.moveThingsFromText(battleInfo.keptThings);
        }

        if (onComplete) {
            onComplete();
        }
    }
}
