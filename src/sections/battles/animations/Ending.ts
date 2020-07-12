import { BattleOutcome, Queue } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IBattleOutcomeTextGenerator } from "../../constants/battles/Texts";

/**
 * Animations for the ends of battles.
 */
export class Ending extends Section<FullScreenPokemon> {
    /**
     * Runs ending battle animations.
     *
     * @param outcome   Descriptor of what finished the battle.
     * @param onBattleComplete   Callback for when the battle is done.
     */
    public run(outcome: BattleOutcome, onBattleComplete: () => void): void {
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;

        const queue: Queue = new Queue();
        const finalTextGenerator: IBattleOutcomeTextGenerator | undefined =
            battleInfo.texts.outcomes[outcome];

        if (finalTextGenerator) {
            queue.add((onComplete: () => void): void => {
                this.game.menuGrapher.createMenu("GeneralText");
                this.game.menuGrapher.addMenuDialog(
                    "GeneralText",
                    finalTextGenerator(outcome),
                    onComplete
                );
                this.game.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.add((onComplete: () => void): void => {
            this.game.animations.fading.animateFadeToColor({
                callback: onComplete,
                color: "Black",
            });
            this.game.mapScreener.blockInputs = false;
        });

        const afterBattle = battleInfo.texts.afterBattle;
        if (afterBattle !== undefined) {
            queue.add((onComplete: () => void): void => {
                this.game.menuGrapher.createMenu("GeneralText");
                this.game.menuGrapher.addMenuDialog("GeneralText", afterBattle(), onComplete);
                this.game.menuGrapher.setActiveMenu("GeneralText");
            });
        }

        queue.run((): void => this.finalize(battleInfo, outcome, onBattleComplete));

        if (this.game.battles.isPartyWiped()) {
            const { map, location } = this.game.itemsHolder.getItem(
                this.game.storage.names.lastPokecenter
            );
            this.game.battles.healParty();
            this.game.maps.setMap(map, location);
            this.game.mapScreener.blockInputs = false;
        }
    }

    /**
     * Disposes of visual things post-battle.
     *
     * @param battleInfo   Info on the ending battle.
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    private finalize(
        battleInfo: IBattleInfo,
        outcome: BattleOutcome,
        onComplete: () => void
    ): void {
        this.game.menuGrapher.deleteMenu("Battle");
        this.game.menuGrapher.deleteMenu("GeneralText");

        for (const i in battleInfo.things) {
            this.game.death.kill(battleInfo.things[i]);
        }

        if (battleInfo.keptThings) {
            this.game.graphics.collections.moveThingsFromText(battleInfo.keptThings);
        }

        if (battleInfo.onComplete) {
            battleInfo.onComplete(outcome);
        }

        if (battleInfo.endingtheme !== undefined) {
            this.game.audioPlayer.play(battleInfo.endingtheme, {
                alias: this.game.audio.aliases.theme,
                loop: true,
            });
        }

        onComplete();
    }
}
