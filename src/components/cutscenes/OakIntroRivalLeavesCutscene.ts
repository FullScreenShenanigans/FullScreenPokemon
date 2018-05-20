import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalLeaves cutscene routines.
 */
export class OakIntroRivalLeavesCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for showing the lab after the battle ends.
     */
    public AfterBattle(): void {
        this.eightBitter.mapScreener.blockInputs = true;

        for (const pokemon of this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokemonInParty)) {
            this.eightBitter.battles.healPokemon(pokemon);
        }

        this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     */
    public Complaint(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!",
            ],
            (): void => {
                this.eightBitter.menuGrapher.deleteActiveMenu();
                this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("Goodbye"), 21);
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     */
    public Goodbye(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("Walking"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     */
    public Walking(): void {
        const oak: ICharacter = this.eightBitter.utilities.getExistingThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        const isRight: boolean = Math.abs(oak.left - rival.left) < 4;
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 1,
                direction: isRight ? Direction.Left : Direction.Right,
            },
            {
                blocks: 6,
                direction: Direction.Bottom,
            },
            (): void => {
                this.eightBitter.death.killNormal(rival);
                this.eightBitter.stateHolder.addChange(rival.id, "alive", false);
                this.eightBitter.menuGrapher.deleteActiveMenu();

                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.menus.displayMessage(
                            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!");
                        this.eightBitter.mapScreener.blockInputs = false;
                    },
                    10);
            },
        ];

        rival.nocollide = true;
        this.eightBitter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.eightBitter.scenePlayer.stopCutscene();
    }
}
