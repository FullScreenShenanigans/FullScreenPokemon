import { Component } from "eightbittr/lib/Component";
import { IPipe } from "inputwritr/lib/IInputWritr";
import { IMod } from "modattachr/lib/IModAttachr";
import {
    IAbsoluteSizeSchema, IBooleanSchema, IMultiSelectSchema, IRelativeSizeSchema, IUserWrapprSettings, OptionType
} from "userwrappr/lib/index";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Sizes the game is allowed to be, keyed by friendly name.
 */
export interface IGameSizes {
    [i: string]: IRelativeSizeSchema;
}

/**
 * Sets up the UserWrappr UI around an FullScreenPokemon instance.
 */
export class Interface<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Friendly name of the default game size.
     */
    public readonly defaultSize: string = "Large";

    /**
     * Sizes the game is allowed to be, keyed by friendly name.
     */
    public readonly sizes: IGameSizes = {
        GameBoy: {
            width: 320,
            height: 288
        },
        NES: {
            width: 512,
            height: 464
        },
        [this.defaultSize]: {
            width: "100%",
            height: "100%"
        },
        "Full!": {
            width: "100%",
            height: "100%"
        }
    };

    /**
     * Keys that may be mapped to game inputs.
     */
    public readonly keys: string[] = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "up", "right", "down", "left",
        "backspace", "ctrl", "enter", "escape", "shift", "space"
    ];

    /**
     * Whether InputWritr pipes have been initialized.
     */
    private initializedPipes: boolean = false;

    /**
     * Whether the page is known to be hidden.
     */
    private isPageHidden: boolean = false;

    /**
     * Creates settings for the game's IUserWrappr.
     *
     * @returns Settings for the game's IUserWrappr.
     */
    public generateUserWrapprSettings(): IUserWrapprSettings {
        return {
            defaultSize: this.sizes[this.defaultSize],
            createContents: (size: IAbsoluteSizeSchema) => {
                this.gameStarter.reset(size);

                if (!this.initializedPipes) {
                    this.initializePipes();
                    this.initializedPipes = true;
                }

                return this.gameStarter.container;
            },
            menus: [
                {
                    options: [
                        {
                            getInitialValue: (): number => Math.round(this.gameStarter.audioPlayer.getVolume() * 100),
                            maximum: 100,
                            minimum: 0,
                            saveValue: (value: number): void => {
                                this.gameStarter.audioPlayer.setVolume(value / 100);
                            },
                            title: "Volume",
                            type: OptionType.Number
                        },
                        {
                            getInitialValue: (): boolean => this.gameStarter.audioPlayer.getMuted(),
                            saveValue: (value: boolean): void => {
                                this.gameStarter.audioPlayer.setMuted(value);
                            },
                            title: "Mute",
                            type: OptionType.Boolean
                        },
                        {
                            getInitialValue: (): string => "1x",
                            options: [".25x", ".5x", "1x", "2x", "5x", "10x"],
                            saveValue: (value: string): void => {
                                this.gameStarter.gamesRunner.setSpeed(parseFloat(value.replace("x", "")));
                            },
                            title: "Speed",
                            type: OptionType.Select
                        },
                        {
                            getInitialValue: () => this.defaultSize,
                            options: Object.keys(this.sizes),
                            saveValue: (value: string): void => {
                                this.gameStarter.userWrapper.resetSize(this.sizes[value]);
                            },
                            title: "View Mode",
                            type: OptionType.Select
                        },
                        {
                            getInitialValue: () => (1 / this.gameStarter.pixelDrawer.getFramerateSkip() * 60) + "fps",
                            options: ["60fps", "30fps"],
                            saveValue: (value: string): void => {
                                const numeric: number = parseInt(value.replace("fps", ""), 10);
                                this.gameStarter.pixelDrawer.setFramerateSkip(1 / numeric * 60);
                            },
                            title: "Framerate",
                            type: OptionType.Select
                        },
                        ((): IBooleanSchema => {
                            let deviceMotionPipe: IPipe | undefined;

                            return {
                                getInitialValue: () => false,
                                saveValue: (value: boolean): void => {
                                    if (value === true) {
                                        deviceMotionPipe = this.gameStarter.inputWriter.makePipe("ondevicemotion", "type");
                                        window.addEventListener("devicemotion", deviceMotionPipe);
                                    } else if (deviceMotionPipe !== undefined) {
                                        window.removeEventListener("devicemotion", deviceMotionPipe);
                                        deviceMotionPipe = undefined;
                                    }
                                },
                                title: "Tilt Controls",
                                type: OptionType.Boolean,
                            };
                        })(),
                        {
                            action: (): void => {
                                this.gameStarter.utilities.takeScreenshot(`FullScreenPokemon ${Date.now()}`);
                            },
                            title: "Screenshot",
                            type: OptionType.Action
                        }
                    ],
                    title: "Options"
                },
                {
                    options: ((controls: string[]): IMultiSelectSchema[] =>
                        controls.map((control: string): IMultiSelectSchema => ({
                            getInitialValue: (): string[] =>
                                this.gameStarter.inputWriter.aliasConverter
                                    .getAliasAsKeyStrings(control)
                                    .map((text: string): string => text.toLowerCase()),
                            options: this.keys,
                            saveValue: (newValue: string[], oldValue: string[]): void => {
                                this.gameStarter.inputWriter.switchAliasValues(control, oldValue, newValue);
                            },
                            selections: 2,
                            title: control,
                            type: OptionType.MultiSelect
                        }))
                    )(["a", "b", "left", "right", "up", "down", "pause"]),
                    title: "Controls"
                },
                {
                    options: ((mods: IMod[]) =>
                        mods.map((mod: IMod): IBooleanSchema => ({
                            getInitialValue: (): boolean => !!mod.enabled,
                            saveValue: (value: boolean): void => {
                                value
                                    ? this.gameStarter.modAttacher.enableMod(mod.name)
                                    : this.gameStarter.modAttacher.disableMod(mod.name);
                            },
                            title: mod.name,
                            type: OptionType.Boolean
                        }))
                    )(this.gameStarter.mods.mods),
                    title: "Mods!"
                }
            ],
            styles: {
                input: {
                    fontFamily: "Press Start",
                    minWidth: "117px",
                    padding: "3px"
                },
                inputButton: {
                    background: "#ffcc33",
                    cursor: "pointer",
                    fontFamily: "Press Start",
                    padding: "7px 3px"
                },
                inputButtonAction: {
                    padding: "11px 3px",
                    width: "100%"
                },
                inputButtonBoolean: {
                    padding: "7px 21px"
                },
                inputButtonOff: {
                    background: "#ccaa33"
                },
                inputSelect: {
                    minWidth: "35px",
                    padding: "3px 0"
                },
                option: {
                    alignItems: "center",
                    padding: "7px 0",
                    maxWidth: "calc(100% - 14px)"
                },
                options: {
                    left: "4px",
                    right: "4px",
                    width: "auto",
                    padding: "4px 3px 7px 3px",
                    boxShadow: [
                        "0 3px 7px black inset",
                        "0 0 0 4px #99ccff",
                        "0 0 14px black",
                    ].join(", "),
                    background: "#005599"
                },
                optionsList: {
                    marginBottom: "7px"
                },
                menu: {
                    maxWidth: "385px",
                    minWidth: "280px",
                    padding: "7px"
                },
                menusInnerArea: {
                    background: "black",
                    color: "white",
                    fontFamily: "Press Start",
                    transition: "700ms color"
                },
                menusInnerAreaFake: {
                    color: "grey"
                },
            }
        };
    }

    /**
     * Reacts to the page becoming hidden by pausing the GameStartr.
     */
    private onPageHidden(): void {
        if (!this.gameStarter.gamesRunner.getPaused()) {
            this.isPageHidden = true;
            this.gameStarter.gamesRunner.pause();
        }
    }

    /**
     * Reacts to the page becoming visible by unpausing the GameStartr.
     */
    private onPageVisible(): void {
        if (this.isPageHidden) {
            this.isPageHidden = false;
            this.gameStarter.gamesRunner.play();
        }
    }

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    private initializePipes(): void {
        window.addEventListener(
            "keydown",
            this.gameStarter.inputWriter.makePipe("onkeydown", "keyCode"));

        window.addEventListener(
            "keyup",
            this.gameStarter.inputWriter.makePipe("onkeyup", "keyCode"));

        window.addEventListener(
            "mousedown",
            this.gameStarter.inputWriter.makePipe("onmousedown", "which"));

        window.addEventListener(
            "contextmenu",
            this.gameStarter.inputWriter.makePipe("oncontextmenu", "", true));

        document.addEventListener(
            "visibilitychange",
            (): void => this.handleVisibilityChange());
    }

    /**
     * Handles a visibility change event by pausing or playing if necessary.
     */
    private handleVisibilityChange(): void {
        switch (document.visibilityState) {
            case "hidden":
                this.onPageHidden();
                return;

            case "visible":
                this.onPageVisible();
                return;

            default:
                return;
        }
    }
}
