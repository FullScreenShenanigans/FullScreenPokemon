import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * ElderTraining cutscene functions used by FullScreenPokemon instances.
 */
export class ElderTrainingCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public StartBattle(settings: any): void {
        console.log("Should start battle with", settings);
        // this.gameStarter.mapScreener.blockInputs = true;
        // this.gameStarter.battles.startBattle({
        //     keptThings: this.gameStarter.graphics.collectBattleKeptThings([settings.player, settings.triggerer]),
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
        //                 this.gameStarter.equations.newPokemon("WEEDLE".split(""), 5)
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

        //         this.gameStarter.timeHandler.addEvent(
        //             (): void => this.gameStarter.menuGrapher.registerDown(),
        //             timeout);
        //         this.gameStarter.timeHandler.addEvent(
        //             (): void => this.gameStarter.menuGrapher.registerA(),
        //             timeout * 2);
        //         this.gameStarter.timeHandler.addEvent(
        //             (): void => this.gameStarter.menuGrapher.registerA(),
        //             timeout * 3);
        //     }
        // } as IBattleInfo);
    }
}
