import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalLeaves cutscene routines.
 */
export class OakIntroRivalLeavesCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for showing the lab after the battle ends.
     */
    public AfterBattle(): void {
        this.game.mapScreener.blockInputs = true;

        for (const pokemon of this.game.itemsHolder.getItem(this.game.storage.names.pokemonInParty)) {
            this.game.battles.healPokemon(pokemon);
        }

        this.game.timeHandler.addEvent(this.game.scenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     */
    public Complaint(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!",
            ],
            (): void => {
                this.game.menuGrapher.deleteActiveMenu();
                this.game.timeHandler.addEvent(this.game.scenePlayer.bindRoutine("Goodbye"), 21);
            },
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     */
    public Goodbye(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!",
            ],
            this.game.scenePlayer.bindRoutine("Walking"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     */
    public Walking(): void {
        const oak: ICharacter = this.game.utilities.getExistingThingById("Oak") as ICharacter;
        const rival: ICharacter = this.game.utilities.getExistingThingById("Rival") as ICharacter;
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
                this.game.death.kill(rival);
                this.game.stateHolder.addChange(rival.id, "alive", false);
                this.game.menuGrapher.deleteActiveMenu();

                this.game.timeHandler.addEvent(
                    (): void => {
                        this.game.menus.displayMessage(
                            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!");
                        this.game.mapScreener.blockInputs = false;
                    },
                    10);
            },
        ];

        rival.nocollide = true;
        this.game.actions.walking.startWalkingOnPath(rival, walkingInstructions);
        this.game.scenePlayer.stopCutscene();
    }
}
