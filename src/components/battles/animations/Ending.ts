import { component } from "babyioc";
import { BattleOutcome, Queue } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IBattleOutcomeTextGenerator } from "../../constants/battles/Texts";

/**
 * Animations for the ends of battles.
 */
export class Ending<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Runs ending battle animations.
     *
     * @param outcome   Descriptor of what finished the battle.
     * @param onBattleComplete   Callback for when the battle is done.
     */
    public run(outcome: BattleOutcome, onBattleComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

        const queue: Queue = new Queue();
        const finalTextGenerator: IBattleOutcomeTextGenerator | undefined = battleInfo.texts.outcomes[outcome];

        if (finalTextGenerator) {
            queue.add((onComplete: () => void): void => {
                this.eightBitter.menuGrapher.createMenu("GeneralText");
                this.eightBitter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    finalTextGenerator(outcome),
                    onComplete);
                this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.add((onComplete: () => void): void => {
            this.eightBitter.actions.animateFadeToColor({
                callback: onComplete,
                color: "Black",
            });
            this.eightBitter.mapScreener.blockInputs = false;
        });

        const afterBattle = battleInfo.texts.afterBattle;
        if (afterBattle !== undefined) {
            queue.add((onComplete: () => void): void => {
                this.eightBitter.menuGrapher.createMenu("GeneralText");
                this.eightBitter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    afterBattle(),
                    onComplete);
                this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.run((): void => this.finalize(battleInfo, outcome, onBattleComplete));

        if (this.eightBitter.battles.isPartyWiped()) {
            const { map, location } = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.lastPokecenter);
            this.eightBitter.battles.healParty();
            this.eightBitter.maps.setMap(map, location);
            this.eightBitter.mapScreener.blockInputs = false;
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
        this.eightBitter.menuGrapher.deleteMenu("Battle");
        this.eightBitter.menuGrapher.deleteMenu("GeneralText");

        for (const i in battleInfo.things) {
            this.eightBitter.physics.killNormal(battleInfo.things[i]);
        }

        if (battleInfo.keptThings) {
            this.eightBitter.graphics.moveThingsFromText(battleInfo.keptThings);
        }

        if (battleInfo.onComplete) {
            battleInfo.onComplete(outcome);
        }

        if (battleInfo.endingtheme !== undefined) {
            this.eightBitter.audioPlayer.play(battleInfo.endingtheme, {
                alias: this.eightBitter.audio.aliases.theme,
                loop: true,
            });
        }

        onComplete();
    }
}
