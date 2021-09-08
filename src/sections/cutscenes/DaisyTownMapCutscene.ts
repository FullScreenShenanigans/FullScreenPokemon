import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Character, Actor } from "../Actors";

/**
 * DaisyTownMap cutscene routines.
 */
export class DaisyTownMapCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for Daisy giving the player a Town Map.
     */
    public Greeting(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Grandpa asked you to run an errand? Here, this will help you!"],
            this.game.scenePlayer.bindRoutine("ReceiveMap")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map.
     *
     * @param settings   Settings used for the cutscene.
     */
    public ReceiveMap(settings: any): void {
        const book: Actor = this.game.utilities.getExistingActorById("Book");
        const daisy: Character = settings.triggerer;

        this.game.death.kill(book);
        this.game.stateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.game.stateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = ["Use the TOWN MAP to find out where you are."];
        this.game.stateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"],
            (): void => {
                this.game.scenePlayer.stopCutscene();
                this.game.menuGrapher.deleteMenu("GeneralText");
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }
}
