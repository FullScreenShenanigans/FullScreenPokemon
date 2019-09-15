import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * ElderTraining cutscene routines.
 */
export class ElderTrainingCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public StartBattle(settings: any): void {
        console.log("Should start battle with", settings);
        // this.eightBitter.mapScreener.blockInputs = true;
        // this.eightBitter.battles.startBattle({
        //     keptThings: this.eightBitter.graphics.collections.collectBattleKeptThings([settings.player, settings.triggerer]),
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
        //                 this.eightBitter.equations.newPokemon("WEEDLE".split(""), 5)
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

        //         this.eightBitter.timeHandler.addEvent(
        //             (): void => this.eightBitter.menuGrapher.registerDown(),
        //             timeout);
        //         this.eightBitter.timeHandler.addEvent(
        //             (): void => this.eightBitter.menuGrapher.registerA(),
        //             timeout * 2);
        //         this.eightBitter.timeHandler.addEvent(
        //             (): void => this.eightBitter.menuGrapher.registerA(),
        //             timeout * 3);
        //     }
        // } as IBattleInfo);
    }
}
