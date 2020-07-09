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
        const oak: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.oakPortrait, {
            opacity: 0,
        });

        settings.oak = oak;

        this.game.audioPlayer.play(this.game.audio.names.introduction, {
            alias: this.game.audio.aliases.theme,
            loop: true,
        });

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onIntroFadeIn, oak);

        this.game.maps.setMap("Blank", "White");
        this.game.menuGrapher.deleteActiveMenu();

        this.game.things.add(oak);
        this.game.physics.setMidX(oak, this.game.mapScreener.middleX | 0);
        this.game.physics.setMidY(oak, this.game.mapScreener.middleY | 0);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.animations.fading.animateFadeAttribute(
                    oak,
                    "opacity",
                    0.15,
                    1,
                    14,
                    this.game.scenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     */
    public FirstDialog(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!",
            ],
            this.game.scenePlayer.bindRoutine("FirstDialogFade"),
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     */
    public FirstDialogFade(): void {
        const blank: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.whiteSquare, {
            width: this.game.mapScreener.width,
            height: this.game.mapScreener.height,
            opacity: 0,
        });

        this.game.things.add(blank, 0, 0);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.15,
                    1,
                    7,
                    this.game.scenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     */
    public PokemonExpo(): void {
        const pokemon: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.nidorinoFront, {
            flipHoriz: true,
            opacity: 0.01,
        });

        this.game.groupHolder.callOnAll((thing: IThing): void => {
            this.game.death.kill(thing);
        });

        this.game.things.add(
            pokemon,
            (this.game.mapScreener.middleX + 96) | 0,
            0);

        this.game.physics.setMidY(pokemon, this.game.mapScreener.middleY);
        this.game.animations.fading.animateFadeAttribute(pokemon, "opacity", 0.15, 1, 3);

        this.game.animations.sliding.slideHorizontally(
            pokemon,
            -8,
            this.game.mapScreener.middleX | 0,
            1,
            this.game.scenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     */
    public PokemonExplanation(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession.",
            ],
            this.game.scenePlayer.bindRoutine("PlayerAppear"),
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerAppear(settings: any): void {
        const middleX: number = this.game.mapScreener.middleX | 0;
        const player: IPlayer = this.game.objectMaker.make<IPlayer>(this.game.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0.01,
        });

        settings.player = player;

        this.game.groupHolder.callOnAll((thing: IThing): void => {
            this.game.death.kill(thing);
        });

        this.game.things.add(player, this.game.mapScreener.middleX + 96, 0);
        this.game.physics.setMidY(player, this.game.mapScreener.middleY);
        this.game.animations.fading.animateFadeAttribute(player, "opacity", 0.15, 1, 3);

        this.game.animations.sliding.slideHorizontally(
            player,
            -8,
            middleX - player.width / 2,
            1,
            this.game.scenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     */
    public PlayerName(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?",
            ],
            this.game.scenePlayer.bindRoutine("PlayerSlide"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerSlide(settings: any): void {
        this.game.animations.sliding.slideHorizontally(
            settings.player,
            4,
            (this.game.mapScreener.middleX + 56) | 0,
            1,
            this.game.scenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     */
    public PlayerNameOptions(): void {
        const fromMenu: () => void = this.game.scenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.game.scenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.game.menuGrapher.createMenu("NameOptions");
        this.game.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.game.menus.keyboards.openKeyboardMenu({
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
        this.game.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromMenu(settings: any): void {
        settings.name = this.game.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.game.menuGrapher.deleteMenu("NameOptions");

        this.game.animations.sliding.slideHorizontally(
            settings.player,
            -4,
            this.game.mapScreener.middleX | 0,
            1,
            this.game.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.game.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.game.menuGrapher.deleteMenu("Keyboard");
        this.game.menuGrapher.deleteMenu("NameOptions");

        this.game.animations.sliding.slideHorizontally(
            settings.player,
            -4,
            this.game.mapScreener.middleX | 0,
            1,
            this.game.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerNameConfirm(settings: any): void {
        this.game.itemsHolder.setItem(this.game.storage.names.name, settings.name);

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split(""),
                ],
            ],
            this.game.scenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     */
    public PlayerNameComplete(): void {
        const blank: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.whiteSquare, {
            width: this.game.mapScreener.width,
            height: this.game.mapScreener.height,
            opacity: 0,
        });

        this.game.things.add(blank, 0, 0);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.game.scenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalAppear(settings: any): void {
        const rival: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.rivalPortrait, {
            opacity: 0,
        });

        settings.rival = rival;

        this.game.groupHolder.callOnAll((thing: IThing): void => {
            this.game.death.kill(thing);
        });

        this.game.things.add(rival, 0, 0);
        this.game.physics.setMidX(rival, this.game.mapScreener.middleX | 0);
        this.game.physics.setMidY(rival, this.game.mapScreener.middleY | 0);
        this.game.animations.fading.animateFadeAttribute(
            rival,
            "opacity",
            0.1,
            1,
            1,
            this.game.scenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     */
    public RivalName(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?",
            ],
            this.game.scenePlayer.bindRoutine("RivalSlide"),
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalSlide(settings: any): void {
        this.game.animations.sliding.slideHorizontally(
            settings.rival,
            4,
            (this.game.mapScreener.middleX + 56) | 0,
            1,
            this.game.scenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     */
    public RivalNameOptions(): void {
        const fromMenu: () => void = this.game.scenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.game.scenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.game.menuGrapher.createMenu("NameOptions");
        this.game.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.game.menus.keyboards.openKeyboardMenu({
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
        this.game.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromMenu(settings: any): void {
        settings.name = this.game.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.game.menuGrapher.deleteMenu("NameOptions");

        this.game.animations.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.game.mapScreener.middleX | 0,
            1,
            this.game.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameFromKeyboard(settings: any): void {
        settings.name = (this.game.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.game.menuGrapher.deleteMenu("Keyboard");
        this.game.menuGrapher.deleteMenu("NameOptions");

        this.game.animations.sliding.slideHorizontally(
            settings.rival,
            -4,
            this.game.mapScreener.middleX | 0,
            1,
            this.game.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalNameConfirm(settings: any): void {
        this.game.itemsHolder.setItem(this.game.storage.names.nameRival, settings.name);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!",
                ],
            ],
            this.game.scenePlayer.bindRoutine("RivalNameComplete"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    public RivalNameComplete(): void {
        const blank: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.whiteSquare, {
            width: this.game.mapScreener.width,
            height: this.game.mapScreener.height,
            opacity: 0,
        });

        this.game.things.add(blank, 0, 0);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.game.scenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public LastDialogAppear(settings: any): void {
        const portrait: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0,
        });

        settings.portrait = portrait;

        this.game.groupHolder.callOnAll((thing: IThing): void => {
            this.game.death.kill(thing);
        });

        this.game.things.add(portrait, 0, 0);
        this.game.physics.setMidX(portrait, this.game.mapScreener.middleX | 0);
        this.game.physics.setMidY(portrait, this.game.mapScreener.middleY | 0);

        this.game.animations.fading.animateFadeAttribute(
            portrait,
            "opacity",
            0.1,
            1,
            1,
            this.game.scenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     */
    public LastDialog(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!",
            ],
            this.game.scenePlayer.bindRoutine("ShrinkPlayer"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public ShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.playerSilhouetteLarge);
        const silhouetteSmall: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.playerSilhouetteSmall);
        const player: IPlayer = this.game.objectMaker.make<IPlayer>(this.game.things.names.player);
        const timeDelay = 49;

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.things.add(silhouetteLarge);
                this.game.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.game.death.kill(settings.portrait);
            },
            timeDelay);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.things.add(silhouetteSmall);
                this.game.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.game.death.kill(silhouetteLarge);
            },
            timeDelay * 2);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.things.add(player);
                this.game.physics.setMidObj(player, silhouetteSmall);
                this.game.death.kill(silhouetteSmall);
            },
            timeDelay * 3);

        this.game.timeHandler.addEvent(
            this.game.scenePlayer.bindRoutine("FadeOut"),
            timeDelay);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    public FadeOut(): void {
        const blank: IThing = this.game.objectMaker.make<IThing>(this.game.things.names.whiteSquare, {
            width: this.game.mapScreener.width,
            height: this.game.mapScreener.height,
            opacity: 0,
        });

        this.game.things.add(blank, 0, 0);

        this.game.timeHandler.addEvent(
            (): void => {
                this.game.animations.fading.animateFadeAttribute(
                    blank,
                    "opacity",
                    0.2,
                    1,
                    7,
                    this.game.scenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     */
    public Finish(): void {
        delete this.game.mapScreener.cutscene;

        this.game.menuGrapher.deleteActiveMenu();
        this.game.scenePlayer.stopCutscene();
        this.game.itemsHolder.setItem(this.game.storage.names.gameStarted, true);

        this.game.maps.setMap("Pallet Town", "Start Game");
    }
}
