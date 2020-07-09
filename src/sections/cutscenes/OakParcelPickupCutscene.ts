import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";

/**
 * OakParcelPickup cutscene routines.
 */
export class OakParcelPickupCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.triggerer.removed = true;
        this.game.stateHolder.addChange(settings.triggerer.id, "removed", true);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?",
            ],
            this.game.scenePlayer.bindRoutine("WalkToCounter"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToCounter(settings: any): void {
        this.game.actions.walking.startWalkingOnPath(
            settings.player,
            [
                {
                    blocks: 2,
                    direction: Direction.Top,
                },
                {
                    blocks: 1,
                    direction: Direction.Left,
                },
                this.game.scenePlayer.bindRoutine("CounterDialog"),
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     */
    public CounterDialog(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!",
            ],
            (): void => {
                this.game.menuGrapher.deleteMenu("GeneralText");
                this.game.scenePlayer.stopCutscene();
                this.game.mapScreener.blockInputs = false;
            });
        this.game.menuGrapher.setActiveMenu("GeneralText");

        this.game.stateHolder.addChangeToCollection(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery");
    }
}
