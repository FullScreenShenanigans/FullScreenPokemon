import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";

/**
 * OakParcelPickup cutscene routines.
 */
export class OakParcelPickupCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.triggerer.alive = false;
        this.eightBitter.stateHolder.addChange(settings.triggerer.id, "alive", false);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?",
            ],
            this.eightBitter.scenePlayer.bindRoutine("WalkToCounter"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToCounter(settings: any): void {
        this.eightBitter.actions.walking.startWalkingOnPath(
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
                this.eightBitter.scenePlayer.bindRoutine("CounterDialog"),
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     */
    public CounterDialog(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!",
            ],
            (): void => {
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.mapScreener.blockInputs = false;
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.stateHolder.addChangeToCollection(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery");
    }
}
