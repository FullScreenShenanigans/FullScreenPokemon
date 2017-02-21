import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalLeaves cutscene functions used by FullScreenPokemon instances.
 */
export class OakIntroRivalLeavesCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for showing the lab after the battle ends.
     */
    public AfterBattle(): void {
        this.gameStarter.mapScreener.blockInputs = true;

        for (const pokemon of this.gameStarter.itemsHolder.getItem("PokemonInParty")) {
            this.gameStarter.battles.healPokemon(pokemon);
        }

        this.gameStarter.timeHandler.addEvent(this.gameStarter.scenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     */
    public Complaint(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteActiveMenu();
                this.gameStarter.timeHandler.addEvent(this.gameStarter.scenePlayer.bindRoutine("Goodbye"), 21);
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     */
    public Goodbye(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("Walking"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     */
    public Walking(): void {
        const oak: ICharacter = this.gameStarter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.gameStarter.utilities.getThingById("Rival") as ICharacter;
        const isRight: boolean = Math.abs(oak.left - rival.left) < 4;
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 1,
                direction: isRight ? Direction.Left : Direction.Right
            },
            {
                blocks: 6,
                direction: Direction.Bottom
            },
            (): void => {
                this.gameStarter.physics.killNormal(rival);
                this.gameStarter.stateHolder.addChange(rival.id, "alive", false);
                this.gameStarter.menuGrapher.deleteActiveMenu();

                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.menus.displayMessage(
                            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!");
                        this.gameStarter.mapScreener.blockInputs = false;
                    },
                    10);
            }
        ];

        rival.nocollide = true;
        this.gameStarter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.gameStarter.scenePlayer.stopCutscene();
    }
}
