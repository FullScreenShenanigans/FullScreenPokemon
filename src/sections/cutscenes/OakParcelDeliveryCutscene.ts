import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { Character, Actor } from "../Actors";

/**
 * OakParcelDelivery cutscene routines.
 */
export class OakParcelDeliveryCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.rival = this.game.utilities.getExistingActorById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: Oh, %%%%%%%PLAYER%%%%%%%!",
                "How is my old %%%%%%%POKEMON%%%%%%%?",
                "Well, it seems to like you a lot.",
                "You must be talented as a %%%%%%%POKEMON%%%%%%% trainer!",
                "What? You have someactor for me?",
                "%%%%%%%PLAYER%%%%%%% delivered OAK's PARCEL.",
                "Ah! This is the custom %%%%%%%POKE%%%%%%% BALL I ordered! Thank you!",
            ],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("RivalInterrupts"),
                    14
                );
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");

        this.game.stateHolder.addChangeToCollection(
            "Viridian City::PokeMart",
            "CashierDetector",
            "dialog",
            false
        );

        this.game.stateHolder.addChangeToCollection(
            "Viridian City::Land",
            "CrankyGrandpa",
            "alive",
            false
        );
        this.game.stateHolder.addChangeToCollection(
            "Viridian City::Land",
            "CrankyGrandpaBlocker",
            "alive",
            false
        );
        this.game.stateHolder.addChangeToCollection(
            "Viridian City::Land",
            "CrankyGranddaughter",
            "alive",
            false
        );

        this.game.stateHolder.addChangeToCollection(
            "Viridian City::Land",
            "HappyGrandpa",
            "alive",
            true
        );
        this.game.stateHolder.addChangeToCollection(
            "Viridian City::Land",
            "HappyGranddaughter",
            "alive",
            true
        );
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     */
    public RivalInterrupts(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["%%%%%%%RIVAL%%%%%%%: Gramps!"],
            this.game.scenePlayer.bindRoutine("RivalWalksUp")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksUp(settings: any): void {
        const doormat = this.game.utilities.getExistingActorById("DoormatLeft");
        const rival = this.game.actors.add<Character>(
            this.game.actors.names.rival,
            doormat.left,
            doormat.top
        );

        settings.rival = rival;

        this.game.menuGrapher.deleteMenu("GeneralText");

        this.game.actions.walking.startWalkingOnPath(rival, [
            {
                blocks: 8,
                direction: Direction.Top,
            },
            this.game.scenePlayer.bindRoutine("RivalInquires"),
        ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     */
    public RivalInquires(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["%%%%%%%RIVAL%%%%%%%: What did you call me for?"],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("OakRequests"),
                    14
                );
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting someactor of the player and rival.
     */
    public OakRequests(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Oak: Oh right! I have a request of you two."],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("OakDescribesPokedex"),
                    14
                );
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex.
     */
    public OakDescribesPokedex(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!",
            ],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("OakGivesPokedex"),
                    14
                );
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     */
    public OakGivesPokedex(): void {
        const bookLeft: Actor = this.game.utilities.getExistingActorById("BookLeft");
        const bookRight: Actor = this.game.utilities.getExistingActorById("BookRight");

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!",
            ],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("OakDescribesGoal"),
                    14
                );

                this.game.death.kill(bookLeft);
                this.game.death.kill(bookRight);

                this.game.stateHolder.addChange(bookLeft.id, "alive", false);
                this.game.stateHolder.addChange(bookRight.id, "alive", false);

                this.game.itemsHolder.setItem(this.game.storage.names.hasPokedex, true);
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     */
    public OakDescribesGoal(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!",
            ],
            (): void => {
                this.game.timeHandler.addEvent(
                    this.game.scenePlayer.bindRoutine("RivalAccepts"),
                    14
                );
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAccepts(settings: any): void {
        this.game.actions.animateCharacterSetDirection(settings.rival, 1);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!",
            ],
            (): void => {
                this.game.scenePlayer.stopCutscene();
                this.game.menuGrapher.deleteMenu("GeneralText");
                this.game.mapScreener.blockInputs = true;

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                this.game.actions.walking.startWalkingOnPath(settings.rival, [
                    {
                        blocks: 8,
                        direction: Direction.Bottom,
                    },
                    (): void => {
                        this.game.death.kill(settings.rival);
                        this.game.mapScreener.blockInputs = false;
                    },
                ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!",
                ];

                this.game.stateHolder.addChange(settings.oak.id, "dialog", settings.oak.dialog);
                this.game.stateHolder.addChange(settings.oak.id, "cutscene", undefined);
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
