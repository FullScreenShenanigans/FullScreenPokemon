import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { IPlayer, IThing } from "../Things";

/**
 * Intro cutscene routines.
 */
export class IntroCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async FadeIn(settings: any): Promise<void> {
        const oak: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.oakPortrait, {
            opacity: 0,
        });

        settings.oak = oak;

        this.eightBitter.audioPlayer.play(this.eightBitter.audio.names.introduction, {
            alias: this.eightBitter.audio.aliases.theme,
            loop: true,
        });

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onIntroFadeIn, oak);

        this.eightBitter.maps.setMap("Blank", "White");
        this.eightBitter.menuGrapher.deleteActiveMenu();

        this.eightBitter.things.add(oak);
        this.eightBitter.physics.setMidX(oak, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(oak, this.eightBitter.mapScreener.middleY | 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    oak,
                    "opacity",
                    0.15,
                    1,
                    14,
                    this.eightBitter.scenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     */
    public FirstDialog(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("FirstDialogFade"),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     */
    public FirstDialogFade(): void {
        const blank: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
            width: this.eightBitter.mapScreener.width,
            height: this.eightBitter.mapScreener.height,
            opacity: 0,
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.15,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     */
    public PokemonExpo(): void {
        const pokemon: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.nidorinoFront, {
            flipHoriz: true,
            opacity: 0.01,
        });

        this.eightBitter.groupHolder.callOnAll((thing: IThing): void => {
            this.eightBitter.death.killNormal(thing);
        });

        this.eightBitter.things.add(
            pokemon,
            (this.eightBitter.mapScreener.middleX + 96) | 0,
            0);

        this.eightBitter.physics.setMidY(pokemon, this.eightBitter.mapScreener.middleY);
        this.eightBitter.animations.fading.animateFadeAttribute(pokemon, "opacity", 0.15, 1, 3);

        this.eightBitter.animations.sliding.slideHorizontally(
            pokemon,
            -8,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     */
    public PokemonExplanation(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession.",
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerAppear"),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerAppear(settings: any): void {
        const middleX: number = this.eightBitter.mapScreener.middleX | 0;
        const player: IPlayer = this.eightBitter.objectMaker.make<IPlayer>(this.eightBitter.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0.01,
        });

        settings.player = player;

        this.eightBitter.groupHolder.callOnAll((thing: IThing): void => {
            this.eightBitter.death.killNormal(thing);
        });

        this.eightBitter.things.add(player, this.eightBitter.mapScreener.middleX + 96, 0);
        this.eightBitter.physics.setMidY(player, this.eightBitter.mapScreener.middleY);
        this.eightBitter.animations.fading.animateFadeAttribute(player, "opacity", 0.15, 1, 3);

        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            -8,
            middleX - player.width / 2,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     */
    public PlayerName(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?",
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerSlide"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerSlide(settings: any): void {
        this.eightBitter.animations.sliding.slideHorizontally(
            settings.player,
            4,
            (this.eightBitter.mapScreener.middleX + 56) | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     */
    public PlayerNameOptions(): void {
        const fromMenu: () => void = this.eightBitter.scenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.eightBitter.scenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.eightBitter.menuGrapher.createMenu("NameOptions");
        this.eightBitter.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.eightBitter.menus.keyboards.openKeyboardMenu({
                        title: "YOUR NAME?",
                        callback: fromKeyboard,
                    }),
                },
                {
                    text: "BLUE".split(""),
                    callback: fromMenu,
                },
                {
                    text: "GARY".split(""),
                    callback: fromMenu,
                },
                {
                    text: "JOHN".split(""),
                    callback: fromMenu,
                }],
        });
        this.eightBitter.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromMenu(settings: any): void {
        settings.name = this.eightBitter.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            settings.player,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.eightBitter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.eightBitter.menuGrapher.deleteMenu("Keyboard");
        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            settings.player,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameConfirm(settings: any): void {
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.name, settings.name);

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split(""),
                ],
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     */
    public PlayerNameComplete(): void {
        const blank: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
            width: this.eightBitter.mapScreener.width,
            height: this.eightBitter.mapScreener.height,
            opacity: 0,
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAppear(settings: any): void {
        const rival: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.rivalPortrait, {
            opacity: 0,
        });

        settings.rival = rival;

        this.eightBitter.groupHolder.callOnAll((thing: IThing): void => {
            this.eightBitter.death.killNormal(thing);
        });

        this.eightBitter.things.add(rival, 0, 0);
        this.eightBitter.physics.setMidX(rival, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(rival, this.eightBitter.mapScreener.middleY | 0);
        this.eightBitter.animations.fading.animateFadeAttribute(
            rival,
            "opacity",
            0.1,
            1,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     */
    public RivalName(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?",
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalSlide"),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalSlide(settings: any): void {
        this.eightBitter.animations.sliding.slideHorizontally(
            settings.rival,
            4,
            (this.eightBitter.mapScreener.middleX + 56) | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     */
    public RivalNameOptions(): void {
        const fromMenu: () => void = this.eightBitter.scenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.eightBitter.scenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.eightBitter.menuGrapher.createMenu("NameOptions");
        this.eightBitter.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.eightBitter.menus.keyboards.openKeyboardMenu({
                        title: "RIVAL's NAME?",
                        callback: fromKeyboard,
                    }),
                },
                {
                    text: "RED".split(""),
                    callback: fromMenu,
                },
                {
                    text: "ASH".split(""),
                    callback: fromMenu,
                },
                {
                    text: "JACK".split(""),
                    callback: fromMenu,
                }],
        });
        this.eightBitter.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromMenu(settings: any): void {
        settings.name = this.eightBitter.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromKeyboard(settings: any): void {
        settings.name = (this.eightBitter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.eightBitter.menuGrapher.deleteMenu("Keyboard");
        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameConfirm(settings: any): void {
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.nameRival, settings.name);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!",
                ],
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalNameComplete"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    public RivalNameComplete(): void {
        const blank: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
            width: this.eightBitter.mapScreener.width,
            height: this.eightBitter.mapScreener.height,
            opacity: 0,
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public LastDialogAppear(settings: any): void {
        const portrait: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0,
        });

        settings.portrait = portrait;

        this.eightBitter.groupHolder.callOnAll((thing: IThing): void => {
            this.eightBitter.death.killNormal(thing);
        });

        this.eightBitter.things.add(portrait, 0, 0);
        this.eightBitter.physics.setMidX(portrait, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(portrait, this.eightBitter.mapScreener.middleY | 0);

        this.eightBitter.animations.fading.animateFadeAttribute(
            portrait,
            "opacity",
            0.1,
            1,
            1,
            this.eightBitter.scenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     */
    public LastDialog(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("ShrinkPlayer"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public ShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerSilhouetteLarge);
        const silhouetteSmall: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerSilhouetteSmall);
        const player: IPlayer = this.eightBitter.objectMaker.make<IPlayer>(this.eightBitter.things.names.player);
        const timeDelay = 49;

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(silhouetteLarge);
                this.eightBitter.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.eightBitter.death.killNormal(settings.portrait);
            },
            timeDelay);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(silhouetteSmall);
                this.eightBitter.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.eightBitter.death.killNormal(silhouetteLarge);
            },
            timeDelay * 2);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(player);
                this.eightBitter.physics.setMidObj(player, silhouetteSmall);
                this.eightBitter.death.killNormal(silhouetteSmall);
            },
            timeDelay * 3);

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine("FadeOut"),
            timeDelay);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    public FadeOut(): void {
        const blank: IThing = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
            width: this.eightBitter.mapScreener.width,
            height: this.eightBitter.mapScreener.height,
            opacity: 0,
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     */
    public Finish(): void {
        delete this.eightBitter.mapScreener.cutscene;

        this.eightBitter.menuGrapher.deleteActiveMenu();
        this.eightBitter.scenePlayer.stopCutscene();
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.gameStarted, true);

        this.eightBitter.maps.setMap("Pallet Town", "Start Game");
    }
}
