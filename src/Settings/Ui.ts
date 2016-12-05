import { IPipe } from "inputwritr/lib/IInputWritr";
import { IMod, IMods } from "modattachr/lib/IModAttachr";
import { IOptionsButtonSchema, IOptionsButtonsSchema } from "userwrappr/lib/Generators/ButtonsGenerator";
import {
    IOptionsTableBooleanOption, IOptionsTableSchema, IOptionsTableScreenSizeOption, IOptionsTableSelectOption
} from "userwrappr/lib/Generators/TableGenerator";
import { ISchema } from "userwrappr/lib/UISchemas";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IUserWrapprSettings } from "../IFullScreenPokemon";

export function GenerateUISettings(): IUserWrapprSettings {
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
                        source: (fsp: FullScreenPokemon): number => {
                            return Math.round(fsp.audioPlayer.getVolume() * 100);
                        },
                        update: (fsp: FullScreenPokemon, value: number): void => {
                            fsp.audioPlayer.setVolume(value / 100);
                        }
                    },
                    {
                        title: "Mute",
                        type: "Boolean",
                        source: (fsp: FullScreenPokemon): boolean => {
                            return fsp.audioPlayer.getMuted();
                        },
                        enable: (fsp: FullScreenPokemon): void => {
                            fsp.audioPlayer.setMutedOn();
                        },
                        disable: (fsp: FullScreenPokemon): void => {
                            fsp.audioPlayer.setMutedOff();
                        }
                    } as IOptionsTableBooleanOption,
                    {
                        title: "Speed",
                        type: "Select",
                        options: (): string[] => [".25x", ".5x", "1x", "2x", "5x"],
                        source: (): string => "1x",
                        update: (fsp: FullScreenPokemon, value: string): void => {
                            fsp.gamesRunner.setSpeed(Number(value.replace("x", "")));
                        },
                        storeLocally: true
                    } as IOptionsTableSelectOption,
                    {
                        title: "View Mode",
                        type: "ScreenSize"
                    } as IOptionsTableScreenSizeOption,
                    {
                        title: "Framerate",
                        type: "Select",
                        options: (): string[] => ["60fps", "30fps"],
                        source: (fsp: FullScreenPokemon): string => {
                            return (1 / fsp.pixelDrawer.getFramerateSkip() * 60) + "fps";
                        },
                        update: (fsp: FullScreenPokemon, value: string): void => {
                            const numeric: number = parseInt(value.replace("fps", ""), 10);
                            fsp.pixelDrawer.setFramerateSkip(1 / numeric * 60);
                        },
                        storeLocally: true
                    } as IOptionsTableSelectOption,
                    ((): IOptionsTableBooleanOption => {
                        let deviceMotionPipe: IPipe;

                        return {
                            title: "Tilt Controls",
                            type: "Boolean",
                            storeLocally: true,
                            source: (): boolean => {
                                return false;
                            },
                            enable: (fsp: FullScreenPokemon): void => {
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
                        action: (fsp: FullScreenPokemon): void => {
                            fsp.utilities.takeScreenshot(`FullScreenPokemon ${Date.now()}`);
                        }
                    }
                ]
            } as IOptionsTableSchema,
            {
                title: "Controls",
                generator: "OptionsTable",
                options: ((controls: string[]): IOptionsButtonSchema[] => {
                    return controls.map((title: string): IOptionsButtonSchema => {
                        return {
                            title: title[0].toUpperCase() + title.substr(1),
                            type: "Keys",
                            storeLocally: true,
                            source: (fsp: FullScreenPokemon): string[] => {
                                return fsp.inputWriter
                                    .getAliasAsKeyStrings(title)
                                    .map((text: string): string => text.toLowerCase());
                            },
                            callback: (fsp: FullScreenPokemon, valueOld: string, valueNew: string): void => {
                                fsp.inputWriter.switchAliasValues(
                                    title,
                                    [fsp.inputWriter.convertKeyStringToAlias(valueOld)],
                                    [fsp.inputWriter.convertKeyStringToAlias(valueNew)]
                                );
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
                options: (fsp: FullScreenPokemon): IOptionsButtonSchema[] => {
                    const mods: IMods = fsp.modAttacher.getMods();
                    const output: IOptionsButtonSchema[] = [];

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
                callback: (fsp: FullScreenPokemon, _schema: ISchema, button: HTMLElement): void => {
                    const name: string = button.textContent!;
                    const key: string = button.getAttribute("localStorageKey")!;
                    const mod: IMod = fsp.modAttacher.getMod(name);

                    fsp.modAttacher.toggleMod(name);
                    fsp.itemsHolder.setItem(key, mod.enabled);
                    fsp.itemsHolder.saveItem(key);
                }
            } as IOptionsButtonsSchema
        ]
    };
}
