import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IThing } from "../Things";

/**
 * OakParcelDelivery cutscene functions used by FullScreenPokemon instances.
 */
export class OakParcelDeliveryCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.rival = this.gameStarter.utilities.getThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: Oh, %%%%%%%PLAYER%%%%%%%!",
                "How is my old %%%%%%%POKEMON%%%%%%%?",
                "Well, it seems to like you a lot.",
                "You must be talented as a %%%%%%%POKEMON%%%%%%% trainer!",
                "What? You have something for me?",
                "%%%%%%%PLAYER%%%%%%% delivered OAK's PARCEL.",
                "Ah! This is the custom %%%%%%%POKE%%%%%%% BALL I ordered! Thank you!"
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("RivalInterrupts"),
                    14);
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        this.gameStarter.stateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     */
    public RivalInterrupts(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("RivalWalksUp")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksUp(settings: any): void {
        const doormat: IThing = this.gameStarter.utilities.getThingById("DoormatLeft");
        const rival: ICharacter = this.gameStarter.things.add(this.gameStarter.things.names.Rival, doormat.left, doormat.top) as ICharacter;

        rival.alive = true;
        settings.rival = rival;

        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        this.gameStarter.actions.walking.startWalkingOnPath(
            rival,
            [
                {
                    blocks: 8,
                    direction: Direction.Top
                },
                this.gameStarter.scenePlayer.bindRoutine("RivalInquires")
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     */
    public RivalInquires(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("OakRequests"),
                    14);
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     */
    public OakRequests(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("OakDescribesPokedex"),
                    14);
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex.
     */
    public OakDescribesPokedex(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("OakGivesPokedex"),
                    14);
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     */
    public OakGivesPokedex(): void {
        const bookLeft: IThing = this.gameStarter.utilities.getThingById("BookLeft");
        const bookRight: IThing = this.gameStarter.utilities.getThingById("BookRight");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("OakDescribesGoal"),
                    14);

                this.gameStarter.physics.killNormal(bookLeft);
                this.gameStarter.physics.killNormal(bookRight);

                this.gameStarter.stateHolder.addChange(bookLeft.id, "alive", false);
                this.gameStarter.stateHolder.addChange(bookRight.id, "alive", false);

                this.gameStarter.itemsHolder.setItem("hasPokedex", true);
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     */
    public OakDescribesGoal(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
            ],
            (): void => {
                this.gameStarter.timeHandler.addEvent(
                    this.gameStarter.scenePlayer.bindRoutine("RivalAccepts"),
                    14);
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAccepts(settings: any): void {
        this.gameStarter.actions.animateCharacterSetDirection(settings.rival, 1);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            (): void => {
                this.gameStarter.scenePlayer.stopCutscene();
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.mapScreener.blockInputs = true;

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                this.gameStarter.actions.walking.startWalkingOnPath(
                    settings.rival,
                    [
                        {
                            blocks: 8,
                            direction: Direction.Bottom
                        },
                        (): void => {
                            this.gameStarter.physics.killNormal(settings.rival);
                            this.gameStarter.mapScreener.blockInputs = false;
                        }
                    ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];

                this.gameStarter.stateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                this.gameStarter.stateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
