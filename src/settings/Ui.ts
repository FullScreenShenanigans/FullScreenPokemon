import * as igamestartr from "gamestartr/lib/IGameStartr";
import { IPipe } from "inputwritr/lib/IInputWritr";
import { IMod, IMods } from "modattachr/lib/IModAttachr";
import * as ibuttonsgenerator from "userwrappr/lib/Generators/ButtonsGenerator";
import * as itablegenerator from "userwrappr/lib/Generators/TableGenerator";
import * as iuserwrappr from "userwrappr/lib/IUserWrappr";
import * as iuserwrapprschemas from "userwrappr/lib/UISchemas";
import { ISchema } from "userwrappr/lib/UISchemas";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding the UI, particularly for an IUserWrappr.
 */
export interface IUserWrapprSettings extends igamestartr.IModuleSettingsObject {
    /**
     * Schemas for each UI control to be made.
     */
    schemas?: iuserwrapprschemas.ISchema[];

    /**
     * Allowed sizes for the game.
     */
    sizes?: iuserwrappr.ISizeSummaries;

    /**
     * The default starting size.
     */
    sizeDefault: string;
}

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns UI settings for the FullScreenPokemon instance.
 */
export function GenerateUISettings(fsp: FullScreenPokemon): IUserWrapprSettings {
    "use strict";

    return {
        globalName: "fsp",
        sizeDefault: "Wide",
        sizes: {
            GameBoy: {
                width: 320,
                height: 288
            },
            NES: {
                width: 512,
                height: 464
            },
            Wide: {
                width: Infinity,
                height: 580
            },
            Large: {
                width: Infinity,
                height: Infinity
            },
            "Full!": {
                width: Infinity,
                height: Infinity,
                full: true
            }
        },
        schemas: [
            {
                title: "Options",
                generator: "OptionsTable",
                options: [
                    {
                        title: "Volume",
                        type: "Number",
                        minimum: 0,
                        maximum: 100,
                        source: (): number => {
                            return Math.round(fsp.audioPlayer.getVolume() * 100);
                        },
                        update: (value: number): void => {
                            fsp.audioPlayer.setVolume(value / 100);
                        }
                    },
                    {
                        title: "Mute",
                        type: "Boolean",
                        source: (): boolean => {
                            return fsp.audioPlayer.getMuted();
                        },
                        enable: (): void => {
                            fsp.audioPlayer.setMutedOn();
                        },
                        disable: (): void => {
                            fsp.audioPlayer.setMutedOff();
                        }
                    } as itablegenerator.IOptionsTableBooleanOption,
                    {
                        title: "Speed",
                        type: "Select",
                        options: (): string[] => [".25x", ".5x", "1x", "2x", "5x", "10x"],
                        source: (): string => "1x",
                        update: (value: string): void => {
                            fsp.gamesRunner.setSpeed(parseFloat(value.replace("x", "")));
                        },
                        storeLocally: true
                    } as itablegenerator.IOptionsTableSelectOption,
                    {
                        title: "View Mode",
                        type: "ScreenSize"
                    } as itablegenerator.IOptionsTableScreenSizeOption,
                    {
                        title: "Framerate",
                        type: "Select",
                        options: (): string[] => ["60fps", "30fps"],
                        source: (): string => {
                            return (1 / fsp.pixelDrawer.getFramerateSkip() * 60) + "fps";
                        },
                        update: (value: string): void => {
                            const numeric: number = parseInt(value.replace("fps", ""), 10);
                            fsp.pixelDrawer.setFramerateSkip(1 / numeric * 60);
                        },
                        storeLocally: true
                    } as itablegenerator.IOptionsTableSelectOption,
                    ((): itablegenerator.IOptionsTableBooleanOption => {
                        let deviceMotionPipe: IPipe;

                        return {
                            title: "Tilt Controls",
                            type: "Boolean",
                            storeLocally: true,
                            source: (): boolean => {
                                return false;
                            },
                            enable: (): void => {
                                deviceMotionPipe = fsp.inputWriter.makePipe("ondevicemotion", "type");
                                window.addEventListener("devicemotion", deviceMotionPipe);
                            },
                            disable: (): void => {
                                window.removeEventListener("devicemotion", deviceMotionPipe);
                            }
                        };
                    })()
                ],
                actions: [
                    {
                        title: "Screenshot",
                        action: (): void => {
                            fsp.utilities.takeScreenshot(`FullScreenPokemon ${Date.now()}`);
                        }
                    }
                ]
            } as itablegenerator.IOptionsTableSchema,
            {
                title: "Controls",
                generator: "OptionsTable",
                options: ((controls: string[]): ibuttonsgenerator.IOptionsButtonSchema[] => {
                    return controls.map((title: string): ibuttonsgenerator.IOptionsButtonSchema => {
                        return {
                            title: title[0].toUpperCase() + title.substr(1),
                            type: "Keys",
                            storeLocally: true,
                            source: (): string[] => {
                                return fsp.inputWriter.aliasConverter
                                    .getAliasAsKeyStrings(title)
                                    .map((text: string): string => text.toLowerCase());
                            },
                            callback: (valueOld: string, valueNew: string): void => {
                                fsp.inputWriter.switchAliasValues(
                                    title,
                                    [fsp.inputWriter.aliasConverter.convertKeyStringToAlias(valueOld)],
                                    [fsp.inputWriter.aliasConverter.convertKeyStringToAlias(valueNew)]);
                            }
                        };
                    });
                })(["a", "b", "left", "right", "up", "down", "pause"])
            },
            {
                title: "Mods!",
                generator: "OptionsButtons",
                keyActive: "enabled",
                assumeInactive: true,
                options: (): ibuttonsgenerator.IOptionsButtonSchema[] => {
                    const mods: IMods = fsp.modAttacher.mods;
                    const output: ibuttonsgenerator.IOptionsButtonSchema[] = [];

                    for (const i in mods) {
                        if (!mods.hasOwnProperty(i)) {
                            continue;
                        }

                        output.push({
                            title: mods[i].name,
                            source: (): boolean => !!mods[i].enabled,
                            storeLocally: true,
                            type: "text"
                        });
                    }

                    return output;
                },
                callback: (_schema: ISchema, button: HTMLElement): void => {
                    const name: string = button.textContent!;
                    const key: string = button.getAttribute("localStorageKey")!;
                    const mod: IMod = fsp.modAttacher.mods[name];

                    fsp.modAttacher.toggleMod(name);
                    fsp.itemsHolder.setItem(key, mod.enabled);
                    fsp.itemsHolder.saveItem(key);
                }
            } as ibuttonsgenerator.IOptionsButtonsSchema
        ]
    };
}
