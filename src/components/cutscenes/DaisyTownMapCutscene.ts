import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IThing } from "../Things";

/**
 * DaisyTownMap cutscene functions used by FullScreenPokemon instances.
 */
export class DaisyTownMapCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for Daisy giving the player a Town Map.
     */
    public Greeting(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("ReceiveMap"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public ReceiveMap(settings: any): void {
        const book: IThing = this.gameStarter.utilities.getThingById("Book");
        const daisy: ICharacter = settings.triggerer;

        this.gameStarter.physics.killNormal(book);
        this.gameStarter.stateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.gameStarter.stateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        this.gameStarter.stateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            (): void => {
                this.gameStarter.scenePlayer.stopCutscene();
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }
}
