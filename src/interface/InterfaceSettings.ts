import { GameWindow } from "eightbittr";
import { Pipe } from "inputwritr";
import {
    AbsoluteSizeSchema,
    BooleanSchema,
    MultSelectSchema,
    RelativeSizeSchema,
    UserWrapprSettings,
    OptionType,
    UserWrappr,
} from "userwrappr";

import { ModComponentClass, Mods } from "../sections/Mods";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Global scope around a game, such as a DOM window.
 */
export interface WrappingGameWindow extends GameWindow {
    /**
     * Game instance, once this has created it.
     */
    FSP?: FullScreenPokemon;
}

export interface InterfaceSettingOverrides {
    createGame?(size: AbsoluteSizeSchema): FullScreenPokemon;
    gameWindow?: WrappingGameWindow;
}

/**
 * Sizes the game is allowed to be, keyed by friendly name.
 */
export interface GameSizes {
    [i: string]: RelativeSizeSchema;
}

/**
 * Friendly name of the default game size.
 */
const defaultSize = "Large";

/**
 * Sizes the game is allowed to be, keyed by friendly name.
 */
const sizes: GameSizes = {
    GameBoy: {
        width: 320,
        height: 288,
    },
    NES: {
        width: 512,
        height: 464,
    },
    [defaultSize]: {
        width: "100%",
        height: "100%",
    },
};

/**
 * Keys that may be mapped to game inputs.
 */
const keys: string[] = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "up",
    "right",
    "down",
    "left",
    "backspace",
    "ctrl",
    "enter",
    "escape",
    "shift",
    "space",
];

/**
 * Creates settings for an IUserWrappr that will create and wrap a FullScreenPokemon instance.
 *
 * @param gameWindow   Global scope around the game interface, if not the global window.
 */
export const createUserWrapprSettings = ({
    createGame = (size: AbsoluteSizeSchema) => new FullScreenPokemon(size),
    gameWindow = window,
}: InterfaceSettingOverrides = {}): UserWrapprSettings => {
    /**
     * Game instance, once this has created it.
     */
    let game: FullScreenPokemon;

    /**
     * IUserWrappr instance this is creating interfaces for.
     */
    let userWrapper: UserWrappr;

    return {
        createContents: (size: AbsoluteSizeSchema, newUserWrapper: UserWrappr) => {
            gameWindow.FSP = game = createGame(size);
            userWrapper = newUserWrapper;

            game.inputs.initializeGlobalPipes(gameWindow);
            game.gameplay.startOptions();

            return game.container;
        },
        defaultSize: sizes[defaultSize],
        menus: [
            {
                options: [
                    {
                        getInitialValue: (): boolean =>
                            game.itemsHolder.getItem(game.storage.names.autoSave),
                        saveValue: (autoSave: boolean): void => {
                            game.itemsHolder.setAutoSave(autoSave);
                            game.itemsHolder.setItem(game.storage.names.autoSave, autoSave);

                            if (autoSave) {
                                game.itemsHolder.saveAll();
                            } else {
                                game.itemsHolder.saveItem("autoSave");
                            }
                        },
                        title: "Auto Save",
                        type: OptionType.Boolean,
                    },
                    {
                        getInitialValue: (): boolean => game.audioPlayer.getMuted(),
                        saveValue: (value: boolean): void => {
                            game.audioPlayer.setMuted(value);
                        },
                        title: "Mute",
                        type: OptionType.Boolean,
                    },
                    {
                        action: (): void => {
                            game.utilities.takeScreenshot(`FullScreenPokemon ${Date.now()}`);
                        },
                        title: "Screenshot",
                        type: OptionType.Action,
                    },
                    {
                        getInitialValue: (): string => "1x",
                        options: [".25x", ".5x", "1x", "2x", "5x", "10x", "20x"],
                        saveValue: (value: string): void => {
                            const multiplier = parseFloat(value.replace("x", ""));
                            game.frameTicker.setInterval(1000 / 60 / multiplier);
                            game.pixelDrawer.setFramerateSkip(multiplier);
                        },
                        title: "Speed",
                        type: OptionType.Select,
                    },
                    ((): BooleanSchema => {
                        let deviceMotionPipe: Pipe | undefined;

                        return {
                            getInitialValue: () => false,
                            saveValue: (value: boolean): void => {
                                if (value) {
                                    deviceMotionPipe = game.inputWriter.makePipe(
                                        "ondevicemotion",
                                        "type"
                                    );
                                    gameWindow.addEventListener("devicemotion", deviceMotionPipe);
                                } else if (deviceMotionPipe !== undefined) {
                                    gameWindow.removeEventListener(
                                        "devicemotion",
                                        deviceMotionPipe
                                    );
                                    deviceMotionPipe = undefined;
                                }
                            },
                            title: "Tilt Controls",
                            type: OptionType.Boolean,
                        };
                    })(),
                    {
                        getInitialValue: () => defaultSize,
                        options: Object.keys(sizes),
                        saveValue: async (value: string): Promise<void> => {
                            await userWrapper.resetSize(sizes[value]);
                        },
                        title: "View Mode",
                        type: OptionType.Select,
                    },
                    {
                        getInitialValue: (): number =>
                            Math.round(game.audioPlayer.getVolume() * 100),
                        maximum: 100,
                        minimum: 0,
                        saveValue: (value: number): void => {
                            game.audioPlayer.setVolume(value / 100);
                        },
                        title: "Volume",
                        type: OptionType.Number,
                    },
                ],
                title: "Options",
            },
            {
                options: ((controls: string[]): MultSelectSchema[] =>
                    controls.map(
                        (control: string): MultSelectSchema => ({
                            getInitialValue: (): string[] =>
                                game.inputWriter.aliasConverter
                                    .getAliasAsKeyStrings(control)
                                    .map((text: string): string => text.toLowerCase()),
                            options: keys,
                            saveValue: (newValue: string[], oldValue: string[]): void => {
                                game.inputWriter.switchAliasValues(control, oldValue, newValue);
                            },
                            selections: 2,
                            title: control,
                            type: OptionType.MultiSelect,
                        })
                    ))(["a", "b", "left", "right", "up", "down", "pause"]),
                title: "Controls",
            },
            {
                options: Mods.modClasses.map(
                    (modClass: ModComponentClass): BooleanSchema => ({
                        getInitialValue: (): boolean =>
                            !!game.mods.modsByName[modClass.modName].enabled,
                        saveValue: (value: boolean): void => {
                            value
                                ? game.modAttacher.enableMod(modClass.modName)
                                : game.modAttacher.disableMod(modClass.modName);
                        },
                        title: modClass.modName,
                        type: OptionType.Boolean,
                    })
                ),
                title: "Mods!",
            },
        ],
        styles: {
            input: {
                fontFamily: "Press Start",
                minWidth: "117px",
                padding: "3px",
            },
            inputButton: {
                background: "#ffcc33",
                cursor: "pointer",
                fontFamily: "Press Start",
                padding: "7px 3px",
            },
            inputButtonAction: {
                padding: "11px 3px",
                width: "100%",
            },
            inputButtonBoolean: {
                padding: "7px 21px",
            },
            inputButtonOff: {
                background: "#ccaa33",
            },
            inputSelect: {
                minWidth: "35px",
                padding: "3px 0",
            },
            option: {
                alignItems: "center",
                margin: "auto",
                padding: "7px 0",
                maxWidth: "calc(100% - 14px)",
            },
            options: {
                left: "4px",
                right: "4px",
                width: "auto",
                padding: "4px 3px 7px 3px",
                boxShadow: ["0 3px 7px black inset", "0 0 0 4px #99ccff", "0 0 14px black"].join(
                    ", "
                ),
                background: "#005599",
            },
            optionsList: {
                marginBottom: "7px",
            },
            menu: {
                maxWidth: "385px",
                minWidth: "280px",
                padding: "7px",
            },
            menusInnerArea: {
                background: "black",
                color: "white",
                fontFamily: "Press Start",
                transition: "700ms color",
            },
            menusInnerAreaFake: {
                color: "grey",
            },
        },
    };
};
