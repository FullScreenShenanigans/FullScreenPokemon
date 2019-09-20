import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IThing } from "../Things";

/**
 * OakParcelDelivery cutscene routines.
 */
export class OakParcelDeliveryCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Greeting(settings: any): void {
        settings.rival = this.eightBitter.utilities.getExistingThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: Oh, %PLAYER%!",
                "How is my old %POKEMON%?",
                "Well, it seems to like you a lot.",
                "You must be talented as a %POKEMON% trainer!",
                "What? You have something for me?",
                "%PLAYER% delivered OAK's PARCEL.",
                "Ah! This is the custom %POKE% BALL I ordered! Thank you!",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("RivalInterrupts"),
                    14);
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        this.eightBitter.stateHolder.addChangeToCollection(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     */
    public RivalInterrupts(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%RIVAL%: Gramps!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalWalksUp"),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksUp(settings: any): void {
        const doormat: IThing = this.eightBitter.utilities.getExistingThingById("DoormatLeft");
        const rival: ICharacter = this.eightBitter.things.add(this.eightBitter.things.names.rival, doormat.left, doormat.top) as ICharacter;

        rival.alive = true;
        settings.rival = rival;

        this.eightBitter.menuGrapher.deleteMenu("GeneralText");

        this.eightBitter.actions.walking.startWalkingOnPath(
            rival,
            [
                {
                    blocks: 8,
                    direction: Direction.Top,
                },
                this.eightBitter.scenePlayer.bindRoutine("RivalInquires"),
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     */
    public RivalInquires(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%RIVAL%: What did you call me for?",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakRequests"),
                    14);
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     */
    public OakRequests(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two.",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakDescribesPokedex"),
                    14);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex.
     */
    public OakDescribesPokedex(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %POKEDEX%!",
                "It automatically records data on %POKEMON% you've seen or caught!",
                "It's a hi-tech encyclopedia!",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakGivesPokedex"),
                    14);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     */
    public OakGivesPokedex(): void {
        const bookLeft: IThing = this.eightBitter.utilities.getExistingThingById("BookLeft");
        const bookRight: IThing = this.eightBitter.utilities.getExistingThingById("BookRight");

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %PLAYER% and %RIVAL%! Take these with you!",
                "%PLAYER% got %POKEDEX% from OAK!",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakDescribesGoal"),
                    14);

                this.eightBitter.death.killNormal(bookLeft);
                this.eightBitter.death.killNormal(bookRight);

                this.eightBitter.stateHolder.addChange(bookLeft.id, "alive", false);
                this.eightBitter.stateHolder.addChange(bookRight.id, "alive", false);

                this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.hasPokedex, true);
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     */
    public OakDescribesGoal(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %POKEMON% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %POKEMON% history!",
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("RivalAccepts"),
                    14);
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAccepts(settings: any): void {
        this.eightBitter.actions.animateCharacterSetDirection(settings.rival, 1);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%RIVAL%: Alright Gramps! Leave it all to me!",
                "%PLAYER%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %PLAYER%! Hahaha!",
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
                this.eightBitter.mapScreener.blockInputs = true;

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                this.eightBitter.actions.walking.startWalkingOnPath(
                    settings.rival,
                    [
                        {
                            blocks: 8,
                            direction: Direction.Bottom,
                        },
                        (): void => {
                            this.eightBitter.death.killNormal(settings.rival);
                            this.eightBitter.mapScreener.blockInputs = false;
                        },
                    ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%POKEMON% around the world wait for you, %PLAYER%!",
                ];

                this.eightBitter.stateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog,
                );
                this.eightBitter.stateHolder.addChange(
                    settings.oak.id, "cutscene", undefined,
                );
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
