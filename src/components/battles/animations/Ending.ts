import { component } from "babyioc";
import { BattleOutcome, Queue } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IBattleOutcomeTextGenerator } from "../../constants/battles/Texts";

/**
 * Animations for the ends of battles.
 */
export class Ending<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Runs ending battle animations.
     *
     * @param outcome   Descriptor of what finished the battle.
     * @param onBattleComplete   Callback for when the battle is done.
     */
    public run(outcome: BattleOutcome, onBattleComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        const queue: Queue = new Queue();
        const finalTextGenerator: IBattleOutcomeTextGenerator | undefined = battleInfo.texts.outcomes[outcome];

        if (finalTextGenerator) {
            queue.add((onComplete: () => void): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    finalTextGenerator(outcome),
                    onComplete);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.add((onComplete: () => void): void => {
            this.gameStarter.actions.animateFadeToColor({
                callback: onComplete,
                color: "Black",
            });
            this.gameStarter.mapScreener.blockInputs = false;
        });

        const afterBattle = battleInfo.texts.afterBattle;
        if (afterBattle !== undefined) {
            queue.add((onComplete: () => void): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    afterBattle(),
                    onComplete);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.run((): void => this.finalize(battleInfo, outcome, onBattleComplete));

        if (this.gameStarter.battles.isPartyWiped()) {
            this.gameStarter.battles.healParty();
            this.gameStarter.maps.setMap(this.gameStarter.itemsHolder.getItem("LastPokecenter"));
            this.gameStarter.mapScreener.blockInputs = false;
        }
    }

    /**
     * Disposes of visual things post-battle.
     *
     * @param battleInfo   Info on the ending battle.
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    private finalize(battleInfo: IBattleInfo, outcome: BattleOutcome, onComplete: () => void): void {
        this.gameStarter.menuGrapher.deleteMenu("Battle");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        if (battleInfo.playEnding) {
            this.gameStarter.audioPlayer.play(battleInfo.endingtheme, {
                alias: this.gameStarter.audio.aliases.theme,
                loop: true,
            });
        } else {
            this.gameStarter.audioPlayer.stopAll();
        }

        for (const i in battleInfo.things) {
            this.gameStarter.physics.killNormal(battleInfo.things[i]);
        }

        if (battleInfo.keptThings) {
            this.gameStarter.graphics.moveThingsFromText(battleInfo.keptThings);
        }

        if (battleInfo.onComplete) {
            battleInfo.onComplete(outcome);
        }

        onComplete();
    }
}
