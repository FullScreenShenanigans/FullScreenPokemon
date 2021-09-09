import { BattleOutcome, Queue } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo } from "../../Battles";
import { BattleOutcomeTextGenerator } from "../../constants/battles/Texts";

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
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        const queue: Queue = new Queue();
        const finalTextGenerator: BattleOutcomeTextGenerator | undefined =
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
     * Disposes of visual actors post-battle.
     *
     * @param battleInfo   Info on the ending battle.
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    private finalize(
        battleInfo: BattleInfo,
        outcome: BattleOutcome,
        onComplete: () => void
    ): void {
        this.game.menuGrapher.deleteMenu("Battle");
        this.game.menuGrapher.deleteMenu("GeneralText");

        for (const i in battleInfo.actors) {
            this.game.death.kill(battleInfo.actors[i]);
        }

        if (battleInfo.keptActors) {
            this.game.graphics.collections.moveActorsFromText(battleInfo.keptActors);
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
