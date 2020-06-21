import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { IPlayer, IThing } from "../Things";

/**
 * Cutscene for the beginning of the game introduction.
 */
export class IntroCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Starts the beginning of the game introduction.
     */
    public readonly start = () => {
        this.eightBitter.maps.setMap("Blank", "White");
        this.eightBitter.menuGrapher.deleteActiveMenu();

        this.eightBitter.audioPlayer.play(this.eightBitter.audio.names.introduction, {
            alias: this.eightBitter.audio.aliases.theme,
            loop: true,
        });

        const oakShady = this.eightBitter.objectMaker.make<IThing>(
            this.eightBitter.things.names.oakPortrait,
            { opacity: 0, },
        );

        this.eightBitter.graphics.classes.addClass(oakShady, "shady");
        this.eightBitter.things.add(oakShady);
        this.eightBitter.physics.setMidX(oakShady, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(oakShady, this.eightBitter.mapScreener.middleY | 0);

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onIntroFadeIn, oakShady);

        this.eightBitter.timeHandler.addEvent(
            () => {
                this.eightBitter.animations.fading.animateFadeAttribute(
                    oakShady,
                    "opacity",
                    0.25,
                    1,
                    14,
                    () => this.fadeInNonShady(oakShady),
                );
            },
            32);
    }

    /**
     * Fades the grayscale Oak on top of the black-and-white ("shady") Oak.
     *
     * @param oakShady Black-and-white Oak visualized on the screen.
     */
    private fadeInNonShady(oakShady: IThing) {
        const oak = this.eightBitter.objectMaker.make<IThing>(
            this.eightBitter.things.names.oakPortrait,
            { opacity: 0, },
        );

        this.eightBitter.things.add(oak, oakShady.left, oakShady.top);

        this.eightBitter.animations.fading.animateFadeAttribute(
            oak,
            "opacity",
            0.25,
            1,
            14,
            () => {
                this.eightBitter.death.killNormal(oakShady);

                this.eightBitter.timeHandler.addEvent(
                    () => {
                        this.firstDialog();
                    },
                    32);
            },
        );
    }

    /**
     * Adds Oak's first bit of dialog to the screen.
     */
    private firstDialog(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %POKEMON%!",
                "My name is OAK! People call me the %POKEMON% PROF!",
            ],
            () => this.firstDialogFade(),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Fades Oak out after his first dialog.
     */
    private firstDialogFade(): void {
        const blank = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
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
                    () => this.pokemonExpo(),
                );
            },
            35);
    }

    /**
     * Fades in the Nidorino Pokemon onto the screen.
     */
    private pokemonExpo(): void {
        const pokemon = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.nidorinoFront, {
            flipHoriz: true,
            opacity: 0.01,
        });

        this.eightBitter.death.killAll();

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
            () => this.pokemonExplanation(),
        );
    }

    /**
     * Adds a dialog explaining how Pokemon work.
     */
    private pokemonExplanation(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %POKEMON%!",
                "For some people, %POKEMON% are pets. Others use them for fights.",
                "Myself...",
                "I study %POKEMON% as a profession.",
            ],
            () => this.playerAppear(),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Fades in the first Player visualization onto the screen.
     */
    private playerAppear(): void {
        const middleX: number = this.eightBitter.mapScreener.middleX | 0;
        const player = this.eightBitter.objectMaker.make<IPlayer>(this.eightBitter.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0.01,
        });

        this.eightBitter.death.killAll();

        this.eightBitter.things.add(player, this.eightBitter.mapScreener.middleX + 96, 0);
        this.eightBitter.physics.setMidY(player, this.eightBitter.mapScreener.middleY);
        this.eightBitter.animations.fading.animateFadeAttribute(player, "opacity", 0.15, 1, 3);

        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            -8,
            middleX - player.width / 2,
            1,
            () => this.playerName(),
        );
    }

    /**
     * Asks the player to enter their name.
     */
    private playerName(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?",
            ],
            () => this.playerSlide(),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Slides the player over to show name options.
     */
    private playerSlide(): void {
        const player = this.eightBitter.groupHolder.getThing<IThing>("player")!;
        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            4,
            (this.eightBitter.mapScreener.middleX + 56) | 0,
            1,
            () => this.playerNameOptions(),
        );
    }

    /**
     * Creates the player name options menu.
     */
    private playerNameOptions(): void {
        const fromMenu = () => this.playerNameFromMenu();
        const fromKeyboard = () => this.playerNameFromKeyboard();

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
     * Handles the player selecting a prefabricated menu option.
     */
    private playerNameFromMenu(): void {
        const name = this.eightBitter.menuGrapher.getMenuSelectedOption("NameOptions").text as string[];
        const player = this.eightBitter.groupHolder.getThing<IThing>("player")!;

        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            () => this.playerNameConfirm(name),
        );
    }

    /**
     * Handles the player having entered their own name from the keyboard.
     */
    private playerNameFromKeyboard(): void {
        const name = (this.eightBitter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;
        const player = this.eightBitter.groupHolder.getThing<IThing>("player")!;

        this.eightBitter.menuGrapher.deleteMenu("Keyboard");
        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            () => this.playerNameConfirm(name),
        );
    }

    /**
     * Confirms the name chosen for the player.
     *
     * @param name   Name chosen for the player.
     */
    private playerNameConfirm(name: string[]): void {
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.name, name);

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    name,
                    "!".split(""),
                ],
            ],
            () => this.playerNameComplete(),
        );
    }

    /**
     * Fades the player out from the screen after choosing a name.
     */
    private playerNameComplete(): void {
        const blank = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
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
                    () => this.rivalAppear(),
                );
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    private rivalAppear(): void {
        const rival = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.rivalPortrait, {
            opacity: 0,
        });

        this.eightBitter.death.killAll();

        this.eightBitter.things.add(rival, 0, 0);
        this.eightBitter.physics.setMidX(rival, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(rival, this.eightBitter.mapScreener.middleY | 0);
        this.eightBitter.animations.fading.animateFadeAttribute(
            rival,
            "opacity",
            0.1,
            1,
            1,
            () => this.rivalName(rival),
        );
    }

    /**
     * Cutscene introducing the rival.
     *
     * @param rival   Rival Thing visualized on the screen.
     */
    private rivalName(rival: IThing): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?",
            ],
            () => this.rivalSlide(rival),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param rival   Rival Thing visualized on the screen.
     */
    private rivalSlide(rival: IThing): void {
        this.eightBitter.animations.sliding.slideHorizontally(
            rival,
            4,
            (this.eightBitter.mapScreener.middleX + 56) | 0,
            1,
            () => this.rivalNameOptions(rival),
        );
    }

    /**
     * Cutscene for showing the rival naming option menu.
     *
     * @param rival   Rival Thing visualized on the screen.
     */
    private rivalNameOptions(rival: IThing): void {
        const fromMenu = () => this.rivalNameFromMenu(rival);
        const fromKeyboard = () => this.rivalNameFromKeyboard(rival);

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
     * @param rival   Rival Thing visualized on the screen.
     */
    private rivalNameFromMenu(rival: IThing): void {
        const name = this.eightBitter.menuGrapher.getMenuSelectedOption("NameOptions").text as string[];

        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            rival,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            () => this.rivalNameConfirm(name),
        );
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param rival   Rival Thing visualized on the screen.
     */
    private rivalNameFromKeyboard(rival: IThing): void {
        const name = (this.eightBitter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.eightBitter.menuGrapher.deleteMenu("Keyboard");
        this.eightBitter.menuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.sliding.slideHorizontally(
            rival,
            -4,
            this.eightBitter.mapScreener.middleX | 0,
            1,
            () => this.rivalNameConfirm(name),
        );
    }

    /**
     * Confirms the name chosen for the rival.
     *
     * @param name   Name chosen for the rival.
     */
    private rivalNameConfirm(name: string[]): void {
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.nameRival, name);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", name, "!",
                ],
            ],
            () => this.rivalNameComplete(),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    private rivalNameComplete(): void {
        const blank = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
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
                    () => this.lastDialogAppear(),
                );
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     */
    private lastDialogAppear(): void {
        const portrait = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerPortrait, {
            flipHoriz: true,
            opacity: 0,
        });

        this.eightBitter.death.killAll();

        this.eightBitter.things.add(portrait, 0, 0);
        this.eightBitter.physics.setMidX(portrait, this.eightBitter.mapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(portrait, this.eightBitter.mapScreener.middleY | 0);

        this.eightBitter.animations.fading.animateFadeAttribute(
            portrait,
            "opacity",
            0.1,
            1,
            1,
            () => this.lastDialog(portrait),
        );
    }

    /**
     * Cutscene for the last part of the introduction.
     *
     * @param portrait   Portrait of the player visualized on the screen.
     */
    private lastDialog(portrait: IThing): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%PLAYER%!",
                "Your very own %POKEMON% legend is about to unfold!",
                "A world of dreams and adventures with %POKEMON% awaits! Let's go!",
            ],
            () => this.shrinkPlayer(portrait),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param portrait   Portrait of the player visualized on the screen.
     */
    private shrinkPlayer(portrait: IThing): void {
        const silhouetteLarge = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerSilhouetteLarge);
        const silhouetteSmall = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.playerSilhouetteSmall);
        const player = this.eightBitter.objectMaker.make<IPlayer>(this.eightBitter.things.names.player);
        const timeDelay = 49;

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(silhouetteLarge);
                this.eightBitter.physics.setMidObj(silhouetteLarge, portrait);
                this.eightBitter.death.killNormal(portrait);
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
            () => this.fadeOut(),
            timeDelay);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    private fadeOut(): void {
        const blank = this.eightBitter.objectMaker.make<IThing>(this.eightBitter.things.names.whiteSquare, {
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
                    () => this.finish(),
                );
            },
            35);
    }

    /**
     * Cutscene showing the player in theirbedroom.
     */
    private finish(): void {
        delete this.eightBitter.mapScreener.cutscene;

        this.eightBitter.menuGrapher.deleteActiveMenu();
        this.eightBitter.scenePlayer.stopCutscene();
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.gameStarted, true);

        this.eightBitter.maps.setMap("Pallet Town", "Start Game");
    }
}
