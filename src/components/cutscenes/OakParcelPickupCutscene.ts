import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";

/**
 * OakParcelPickup cutscene functions used by FullScreenPokemon instances.
 */
export class OakParcelPickupCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.triggerer.alive = false;
        this.gameStarter.stateHolder.addChange(settings.triggerer.id, "alive", false);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("WalkToCounter"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToCounter(settings: any): void {
        this.gameStarter.actions.walking.startWalkingOnPath(
            settings.player,
            [
                {
                    blocks: 2,
                    direction: Direction.Top
                },
                {
                    blocks: 1,
                    direction: Direction.Left
                },
                this.gameStarter.scenePlayer.bindRoutine("CounterDialog")
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     */
    public CounterDialog(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.scenePlayer.stopCutscene();
                this.gameStarter.mapScreener.blockInputs = false;
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.stateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery");
    }
}
