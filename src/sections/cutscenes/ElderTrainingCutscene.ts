import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * ElderTraining cutscene routines.
 */
export class ElderTrainingCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public StartBattle(settings: any): void {
        console.log("Should start battle with", settings);
        // this.game.mapScreener.blockInputs = true;
        // this.game.battles.startBattle({
        //     keptActors: this.game.graphics.collections.collectBattleKeptActors([settings.player, settings.triggerer]),
        //     battlers: {
        //         player: {
        //             name: "OLD MAN".split(""),
        //             sprite: "ElderBack",
        //             category: "Wild",
        //             actors: []
        //         },
        //         opponent: {
        //             name: "WEEDLE".split(""),
        //             sprite: "WeedleFront",
        //             category: "Wild",
        //             actors: [
        //                 this.game.equations.newPokemon("WEEDLE".split(""), 5)
        //             ]
        //         }
        //     },
        //     items: [{
        //         item: "Pokeball",
        //         amount: 50
        //     }],
        //     automaticMenus: true,
        //     onShowPlayerMenu: (): void => {
        //         const timeout: number = 70;

        //         this.game.timeHandler.addEvent(
        //             (): void => this.game.menuGrapher.registerDown(),
        //             timeout);
        //         this.game.timeHandler.addEvent(
        //             (): void => this.game.menuGrapher.registerA(),
        //             timeout * 2);
        //         this.game.timeHandler.addEvent(
        //             (): void => this.game.menuGrapher.registerA(),
        //             timeout * 3);
        //     }
        // } as BattleInfo);
    }
}
