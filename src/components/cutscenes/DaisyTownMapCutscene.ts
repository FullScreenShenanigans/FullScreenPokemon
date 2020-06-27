import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter, IThing } from "../Things";

/**
 * DaisyTownMap cutscene routines.
 */
export class DaisyTownMapCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for Daisy giving the player a Town Map.
     */
    public Greeting(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("ReceiveMap"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map.
     *
     * @param settings   Settings used for the cutscene.
     */
    public ReceiveMap(settings: any): void {
        const book: IThing = this.eightBitter.utilities.getExistingThingById("Book");
        const daisy: ICharacter = settings.triggerer;

        this.eightBitter.death.killNormal(book);
        this.eightBitter.stateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.eightBitter.stateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are.",
        ];
        this.eightBitter.stateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!",
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }
}
