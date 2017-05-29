import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { IPlayer, IThing } from "../Things";

/**
 * Intro cutscene functions used by FullScreenPokemon instances.
 */
export class IntroCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public FadeIn(settings: any): void {
        const oak: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.OakPortrait, {
            opacity: 0
        });

        settings.oak = oak;

        console.warn("Cannot find Introduction audio theme!");
        // this.gameStarter.audioPlayer.playTheme("Introduction");
        this.gameStarter.modAttacher.fireEvent("onIntroFadeIn", oak);

        this.gameStarter.maps.setMap("Blank", "White");
        this.gameStarter.menuGrapher.deleteActiveMenu();

        this.gameStarter.things.add(oak);
        this.gameStarter.physics.setMidX(oak, this.gameStarter.mapScreener.middleX | 0);
        this.gameStarter.physics.setMidY(oak, this.gameStarter.mapScreener.middleY | 0);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    oak,
                    "opacity",
                    .15,
                    1,
                    14,
                    this.gameStarter.scenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     */
    public FirstDialog(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("FirstDialogFade")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     */
    public FirstDialogFade(): void {
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.WhiteSquare, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 0
        });

        this.gameStarter.things.add(blank, 0, 0);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                blank,
                "opacity",
                .15,
                1,
                7,
                this.gameStarter.scenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     */
    public PokemonExpo(): void {
        const pokemon: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.NIDORINOFront, {
            flipHoriz: true,
            opacity: .01
        });

        this.gameStarter.groupHolder.applyOnAll(this.gameStarter.physics, this.gameStarter.physics.killNormal);

        this.gameStarter.things.add(
            pokemon,
            (this.gameStarter.mapScreener.middleX + 96) | 0,
            0);

        this.gameStarter.physics.setMidY(pokemon, this.gameStarter.mapScreener.middleY);
        this.gameStarter.actions.animateFadeAttribute(pokemon, "opacity", .15, 1, 3);

        this.gameStarter.actions.sliding.slideHorizontally(
            pokemon,
            -8,
            this.gameStarter.mapScreener.middleX | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     */
    public PokemonExplanation(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            this.gameStarter.scenePlayer.bindRoutine("PlayerAppear")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerAppear(settings: any): void {
        const middleX: number = this.gameStarter.mapScreener.middleX | 0;
        const player: IPlayer = this.gameStarter.objectMaker.make<IPlayer>(this.gameStarter.things.names.PlayerPortrait, {
            flipHoriz: true,
            opacity: .01
        });

        settings.player = player;

        this.gameStarter.groupHolder.applyOnAll(this.gameStarter.physics, this.gameStarter.physics.killNormal);

        this.gameStarter.things.add(player, this.gameStarter.mapScreener.middleX + 96, 0);
        this.gameStarter.physics.setMidY(player, this.gameStarter.mapScreener.middleY);
        this.gameStarter.actions.animateFadeAttribute(player, "opacity", .15, 1, 3);

        this.gameStarter.actions.sliding.slideHorizontally(
            player,
            -8,
            middleX - player.width / 2,
            1,
            this.gameStarter.scenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     */
    public PlayerName(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("PlayerSlide"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerSlide(settings: any): void {
        this.gameStarter.actions.sliding.slideHorizontally(
            settings.player,
            4,
            (this.gameStarter.mapScreener.middleX + 56) | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     */
    public PlayerNameOptions(): void {
        const fromMenu: () => void = this.gameStarter.scenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.gameStarter.scenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.gameStarter.menuGrapher.createMenu("NameOptions");
        this.gameStarter.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.gameStarter.menus.keyboards.openKeyboardMenu({
                        title: "YOUR NAME?",
                        callback: fromKeyboard
                    })
                }, {
                    text: "BLUE".split(""),
                    callback: fromMenu
                }, {
                    text: "GARY".split(""),
                    callback: fromMenu
                }, {
                    text: "JOHN".split(""),
                    callback: fromMenu
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromMenu(settings: any): void {
        settings.name = this.gameStarter.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.gameStarter.menuGrapher.deleteMenu("NameOptions");

        this.gameStarter.actions.sliding.slideHorizontally(
            settings.player,
            -4,
            this.gameStarter.mapScreener.middleX | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.gameStarter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.gameStarter.menuGrapher.deleteMenu("Keyboard");
        this.gameStarter.menuGrapher.deleteMenu("NameOptions");

        this.gameStarter.actions.sliding.slideHorizontally(
            settings.player,
            -4,
            this.gameStarter.mapScreener.middleX | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameConfirm(settings: any): void {
        this.gameStarter.itemsHolder.setItem("name", settings.name);

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     */
    public PlayerNameComplete(): void {
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.WhiteSquare, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 0
        });

        this.gameStarter.things.add(blank, 0, 0);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.gameStarter.scenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAppear(settings: any): void {
        const rival: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.RivalPortrait, {
            opacity: 0
        });

        settings.rival = rival;

        this.gameStarter.groupHolder.applyOnAll(this.gameStarter.physics, this.gameStarter.physics.killNormal);

        this.gameStarter.things.add(rival, 0, 0);
        this.gameStarter.physics.setMidX(rival, this.gameStarter.mapScreener.middleX | 0);
        this.gameStarter.physics.setMidY(rival, this.gameStarter.mapScreener.middleY | 0);
        this.gameStarter.actions.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            this.gameStarter.scenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     */
    public RivalName(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("RivalSlide")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalSlide(settings: any): void {
        this.gameStarter.actions.sliding.slideHorizontally(
            settings.rival,
            4,
            (this.gameStarter.mapScreener.middleX + 56) | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     */
    public RivalNameOptions(): void {
        const fromMenu: () => void = this.gameStarter.scenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.gameStarter.scenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.gameStarter.menuGrapher.createMenu("NameOptions");
        this.gameStarter.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.gameStarter.menus.keyboards.openKeyboardMenu({
                        title: "RIVAL's NAME?",
                        callback: fromKeyboard
                    })
                }, {
                    text: "RED".split(""),
                    callback: fromMenu
                }, {
                    text: "ASH".split(""),
                    callback: fromMenu
                }, {
                    text: "JACK".split(""),
                    callback: fromMenu
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromMenu(settings: any): void {
        settings.name = this.gameStarter.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.gameStarter.menuGrapher.deleteMenu("NameOptions");

        this.gameStarter.actions.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.gameStarter.mapScreener.middleX | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromKeyboard(settings: any): void {
        settings.name = (this.gameStarter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.gameStarter.menuGrapher.deleteMenu("Keyboard");
        this.gameStarter.menuGrapher.deleteMenu("NameOptions");

        this.gameStarter.actions.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.gameStarter.mapScreener.middleX | 0,
            1,
            this.gameStarter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameConfirm(settings: any): void {
        this.gameStarter.itemsHolder.setItem("nameRival", settings.name);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("RivalNameComplete"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    public RivalNameComplete(): void {
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.WhiteSquare, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 0
        });

        this.gameStarter.things.add(blank, 0, 0);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.gameStarter.scenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public LastDialogAppear(settings: any): void {
        const portrait: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.PlayerPortrait, {
            flipHoriz: true,
            opacity: 0
        });

        settings.portrait = portrait;

        this.gameStarter.groupHolder.applyOnAll(this.gameStarter.physics, this.gameStarter.physics.killNormal);

        this.gameStarter.things.add(portrait, 0, 0);
        this.gameStarter.physics.setMidX(portrait, this.gameStarter.mapScreener.middleX | 0);
        this.gameStarter.physics.setMidY(portrait, this.gameStarter.mapScreener.middleY | 0);

        this.gameStarter.actions.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            this.gameStarter.scenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     */
    public LastDialog(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("ShrinkPlayer"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public ShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.PlayerSilhouetteLarge);
        const silhouetteSmall: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.PlayerSilhouetteSmall);
        const player: IPlayer = this.gameStarter.objectMaker.make<IPlayer>(this.gameStarter.things.names.Player);
        const timeDelay: number = 49;

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(silhouetteLarge);
                this.gameStarter.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.gameStarter.physics.killNormal(settings.portrait);
            },
            timeDelay);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(silhouetteSmall);
                this.gameStarter.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.gameStarter.physics.killNormal(silhouetteLarge);
            },
            timeDelay * 2);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(player);
                this.gameStarter.physics.setMidObj(player, silhouetteSmall);
                this.gameStarter.physics.killNormal(silhouetteSmall);
            },
            timeDelay * 3);

        this.gameStarter.timeHandler.addEvent(
            this.gameStarter.scenePlayer.bindRoutine("FadeOut"),
            timeDelay);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    public FadeOut(): void {
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(this.gameStarter.things.names.WhiteSquare, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 0
        });

        this.gameStarter.things.add(blank, 0, 0);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.gameStarter.scenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     */
    public Finish(): void {
        delete this.gameStarter.mapScreener.cutscene;

        this.gameStarter.menuGrapher.deleteActiveMenu();
        this.gameStarter.scenePlayer.stopCutscene();
        this.gameStarter.itemsHolder.setItem("gameStarted", true);

        this.gameStarter.maps.setMap("Pallet Town", "Start Game");
    }
}
