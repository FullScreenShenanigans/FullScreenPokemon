import * as igamestartr from "gamestartr/lib/IGameStartr";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";

import { IPokedexInformation, IPokedexListing } from "../components/constants/Pokemon";
import { IDialog, IMenuBase, IMenuSchema } from "../components/Menus";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Settings regarding a menu system, particularly for an IMenuGraphr.
 */
export interface IMenusModuleSettings extends igamestartr.IModuleSettingsObject {
    /**
     * Known menu schemas, keyed by name.
     */
    schemas: imenugraphr.IMenuSchemas;

    /**
     * Alternate titles for texts, such as " " to "space".
     */
    aliases: imenugraphr.IAliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    replacements: imenugraphr.IReplacements;
}

/* tslint:disable object-literal-key-quotes */

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Menu settings for the FullScreenPokemon instance.
 */
export function GenerateMenusSettings(fsp: FullScreenPokemon): IMenusModuleSettings {
    "use strict";

    return {
        "aliases": {
            " ": "Space",
            "(": "LeftParenthesis",
            ")": "RightParenthesis",
            ":": "Colon",
            ";": "Semicolon",
            "[": "LeftSquareBracket",
            "]": "RightSquareBracket",
            "-": "Hyphen",
            "MDash": "MDash",
            "_": "Underscore",
            "?": "QuestionMark",
            "!": "ExclamationMark",
            "/": "Slash",
            ".": "Period",
            ",": "Comma",
            "'": "Apostrophe",
            "�": "eFancy"
        },
        "replacements": {
            "PLAYER": (): string[] => {
                return fsp.itemsHolder.getItem("name");
            },
            "RIVAL": (): string[] => {
                return fsp.itemsHolder.getItem("nameRival");
            },
            "POKE": "POK�".split(""),
            "POKEMON": "POK�MON".split(""),
            "POKEDEX": "POK�DEX".split(""),
            "POKEDEX.SEEN": (): string[] => {
                return fsp.utilities.makeDigit(
                    fsp.saves.getPokedexListingsOrdered()
                        .filter((listing: IPokedexInformation): boolean => !!(listing && listing.seen))
                        .length,
                    12,
                    "\t")
                    .split("");
            },
            "POKEDEX.OWN": (): string[] => {
                return fsp.utilities.makeDigit(
                    fsp.saves.getPokedexListingsOrdered()
                        .filter((listing: IPokedexInformation): boolean => !!(listing && listing.caught))
                        .length,
                    12,
                    "\t")
                    .split("");
            },
            "BADGES.LENGTH": (): string[] => {
                const badges: { [i: string]: boolean } = fsp.itemsHolder.getItem("badges");
                let total: number = 0;

                for (const i in badges) {
                    if (badges.hasOwnProperty(i)) {
                        total += Number(badges[i]);
                    }
                }

                return total.toString().split("");
            },
            "POKEDEX.LENGTH": (): string[] => {
                const pokedex: IPokedexListing[] = fsp.itemsHolder.getItem("Pokedex");
                if (!pokedex || !pokedex.length) {
                    return ["0"];
                }

                return pokedex
                    .map((listing: IPokedexListing): number => {
                        return Number(listing.seen);
                    })
                    .reduce((a: number, b: number): number => {
                        return a + b;
                    })
                    .toString()
                    .split("");
            },
            "TIME": (): string[] => {
                const ticksRecorded: number = fsp.itemsHolder.getItem("time");
                const ticksUnrecorded: number = fsp.gamesRunner.fpsAnalyzer.getNumRecorded() - fsp.ticksElapsed;
                const ticksTotal: number = Math.floor(ticksRecorded + ticksUnrecorded);
                const secondsTotal: number = Math.floor(ticksTotal / ((fsp.moduleSettings.runner || {}).interval || 1) || 0);
                let hours: string = Math.floor(secondsTotal / 14400).toString();
                let minutes: string = Math.floor((secondsTotal - Number(hours)) / 240).toString();

                if (hours.length < 8) {
                    hours = " " + hours;
                } else if (hours.length > 8) {
                    hours = "99";
                }

                if (minutes.length < 8) {
                    minutes = "0" + minutes;
                } else if (minutes.length > 8) {
                    minutes = "99";
                }

                return (hours + ":" + minutes).split("");
            },
            "MONEY": (): string[] => {
                return fsp.itemsHolder.getItem("money").toString().split("");
            }
        },
        "replacementStatistics": {
            "PLAYER": true,
            "RIVAL": true,
            "TIME": true,
            "MONEY": true
        },
        "replaceFromitemsHolder": true,
        "sounds": {
            "menuSound": "Menu Bleep"
        },
        "schemas": {
            "StartOptions": {
                "size": {
                    "width": 240,
                    "height": 160
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "clearedIndicesOnDeletion": [
                    "Pause",
                    "Pokemon",
                    "Items"
                ],
                "textXOffset": 32,
                "ignoreB": true
            } as imenugraphr.IListMenuSchema,
            "GeneralText": {
                "size": {
                    "height": 96,
                    "width": 320
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "top": 144
                    }
                },
                "ignoreB": true,
                "textPaddingRight": 12
            },
            "Pause": {
                "size": {
                    "width": 160,
                    "height": 224
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 240
                    }
                },
                "onMenuDelete": (): void => {
                    fsp.menus.closePauseMenu();
                },
                "saveIndex": true,
                "textXOffset": 32,
                "textYOffset": 32,
                "textPaddingY": 31
            } as imenugraphr.IListMenuSchema,
            "Pokedex": {
                "size": {
                    "width": 352
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch",
                    "offset": {
                        "left": -16
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "LineDecoratorVertical",
                        "position": {
                            "vertical": "stretch",
                            "offset": {
                                "left": 240,
                                "top": 12,
                                "bottom": 12
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "LineSeparatorHorizontal",
                        "size": {
                            "width": 86
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "left": -12,
                                "top": 140
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["CONTENTS"],
                        "position": {
                            "offset": {
                                "left": 28,
                                "top": 28
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "menu",
                        "name": "PokedexNumbers"
                    } as imenugraphr.IMenuChildSchema],
                "backMenu": "Pause",
                "ignoreProgressB": true,
                "scrollingItemsComputed": true,
                "singleColumnList": true,
                "textSpeed": 0,
                "textXOffset": 28,
                "textYOffset": 44
            } as imenugraphr.IListMenuSchema,
            "PokedexNumbers": {
                "size": {
                    "width": 64,
                    "height": 80
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -16,
                        "top": 48
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["SEEN \r\n %%%%%%%POKEDEX.SEEN%%%%%%%"],
                        "position": {
                            "vertical": "top"
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["OWN \r\n %%%%%%%POKEDEX.OWN%%%%%%%"],
                        "position": {
                            "offset": {
                                "top": 48
                            }
                        }
                    } as imenugraphr.IMenuChildSchema],
                "container": "Pokedex",
                "hidden": true,
                "textSpeed": 0,
                "textPaddingY": 16
            } as any,
            "PokedexOptions": {
                "size": {
                    "width": 86,
                    "height": 148
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -12,
                        "top": 152
                    }
                },
                "container": "Pokedex",
                "backMenu": "Pokedex",
                "keepOnBack": true,
                "hidden": true,
                "arrowXOffset": 4,
                "textSpeed": 0,
                "textXOffset": 16,
                "textYOffset": 20
            } as imenugraphr.IListMenuSchema,
            "PokedexListing": {
                "size": {
                    "width": 320,
                    "height": 288
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokedexListingSprite"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingName"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingLabel"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeight"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingWeight"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingNumber"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingInfo"
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalLeft",
                        "position": {
                            "offset": {
                                "top": 146,
                                "left": 8
                            }
                        },
                        "size": {
                            "width": 152
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalRight",
                        "position": {
                            "offset": {
                                "top": 146,
                                "left": 152
                            }
                        },
                        "size": {
                            "width": 160
                        }
                    }],
                "lined": true
            } as IMenuBase,
            "PokedexListingSprite": {
                "position": {
                    "offset": {
                        "left": 32,
                        "top": 48
                    }
                },
                "size": {
                    "width": 80,
                    "height": 80
                },
                "hidden": true,
                "container": "PokedexListing"
            } as IMenuSchema,
            "PokedexListingName": {
                "position": {
                    "offset": {
                        "left": 128,
                        "top": 30
                    }
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingLabel": {
                "position": {
                    "offset": {
                        "left": 128,
                        "top": 62
                    }
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingHeight": {
                "position": {
                    "offset": {
                        "left": 144,
                        "top": 94
                    }
                },
                "size": {
                    "height": 40,
                    "width": 160
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["HT"]
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeightFeet"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeightInches"
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "CharFeet",
                        "position": {
                            "offset": {
                                "left": 80,
                                "top": 2
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "CharInches",
                        "position": {
                            "offset": {
                                "left": 128,
                                "top": 2
                            }
                        }
                    }],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 32,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingHeightFeet": {
                "size": {
                    "height": 40,
                    "width": 80
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 66,
                "textYOffset": 0,
                "textPaddingX": -32
            } as IMenuSchema,
            "PokedexListingHeightInches": {
                "size": {
                    "height": 40,
                    "width": 80
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 112,
                "textYOffset": 0,
                "textPaddingX": -32
            } as IMenuSchema,
            "PokedexListingWeight": {
                "position": {
                    "offset": {
                        "left": 144,
                        "top": 126
                    }
                },
                "size": {
                    "height": 40,
                    "width": 160
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["WT"]
                    }, {
                        "type": "text",
                        "words": ["lb"],
                        "position": {
                            "offset": {
                                "left": 128
                            }
                        }
                    } as IDialog & imenugraphr.IMenuChildSchema],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 64,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingNumber": {
                "size": {
                    "width": 80,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 32,
                        "top": 128
                    }
                },
                "childrenSchemas": [{
                    "type": "text",
                    "words": [["No", "."]]
                } as IDialog & imenugraphr.IMenuChildSchema],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 32,
                "textYOffset": -2
            } as IMenuSchema,
            "PokedexListingInfo": {
                "position": {
                    "vertical": "bottom",
                    "horizontal": "center",
                    "offset": {
                        "top": -16
                    }
                },
                "size": {
                    "width": 304,
                    "height": 128
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 8
            } as IMenuSchema,
            "Pokemon": {
                "size": {
                    height: 320,
                    width: 320
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": -16
                    }
                },
                "childrenSchemas": [{
                    "type": "menu",
                    "name": "PokemonDialog"
                } as imenugraphr.IMenuChildSchema],
                "backMenu": "Pause",
                "arrowXOffset": 32,
                "arrowYOffset": 20,
                "ignoreProgressB": true,
                "saveIndex": true,
                "textSpeed": 0,
                "textXOffset": 48,
                "textYOffset": 16,
                "plain": true
            } as imenugraphr.IListMenuSchema,
            "PokemonDialog": {
                "size": {
                    "height": 96
                },
                "position": {
                    "horizontal": "stretch",
                    "vertical": "bottom"
                },
                "childrenSchemas": [{
                    "type": "text",
                    "words": [
                        "Choose a %%%%%%%POKEMON%%%%%%%."
                    ],
                    "position": {
                        "offset": {
                            "left": 16,
                            "top": 30
                        }
                    }
                } as IDialog & imenugraphr.IMenuChildSchema],
                "container": "Pokemon",
                "textSpeed": 0
            },
            "PokemonMenuContext": {
                "size": {
                    "width": 144,
                    "height": 112
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom"
                },
                "container": "PokemonDialog",
                "textXOffset": 32,
                "textYOffset": 16
            },
            "PokemonMenuStats": {
                "size": {
                    "width": 352,
                    "height": 300
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokemonMenuStatsTitle"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsLevel"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHPBar"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHP"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsNumber"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsStatus"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsType1"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsID"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsOT"
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 4,
                            "height": 106
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 16,
                                "left": -20
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 174,
                            "height": 4
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 120,
                                "left": -22
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 116,
                                "left": -196
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 4,
                            "height": 136
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 144,
                                "left": -20
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 100,
                            "height": 4
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 278,
                                "left": -22
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 274,
                                "left": -122
                            }
                        }
                    } as imenugraphr.IMenuThingSchema]
            },
            "PokemonMenuStatsTitle": {
                "size": {
                    "width": 176,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "top": 16,
                        "left": 156
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "PokemonMenuStatsLevel": {
                "size": {
                    "width": 144,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 244,
                        "top": 32
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 16,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [["Level"]],
                    "position": {
                        "offset": {
                            "top": 6
                        }
                    }
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsHPBar": {
                "position": {
                    "offset": {
                        "left": 192,
                        "top": 56
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 4
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 100
                        },
                        "position": {
                            "offset": {
                                "left": 32
                            }
                        }
                    }],
                "container": "PokemonMenuStats",
                "hidden": true
            } as IMenuSchema,
            "PokemonMenuStatsHP": {
                "size": {
                    "width": 96,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 236,
                        "top": 64
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "PokemonMenuStatsNumber": {
                "size": {
                    "width": 160,
                    "height": 32
                },
                "position": {
                    "offset": {
                        "left": 24,
                        "top": 104
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 32,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [[["No"], "."]]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsStatus": {
                "size": {
                    "width": 160,
                    "height": 32
                },
                "position": {
                    "offset": {
                        "left": 156,
                        "top": 96
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 112,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["STATUS/"]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsType1": {
                "size": {
                    "width": 160,
                    "height": 32
                },
                "position": {
                    "offset": {
                        "left": 172,
                        "top": 142
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 16,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["TYPE4/"]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsType2": {
                "size": {
                    "width": 160,
                    "height": 32
                },
                "position": {
                    "offset": {
                        "left": 172,
                        "top": 174
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 16,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["TYPE8/"]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsID": {
                "size": {
                    "width": 288,
                    "height": 64
                },
                "position": {
                    "offset": {
                        "left": 172,
                        "top": 206
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 16,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [[["ID"], ["No"], "/"]]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsOT": {
                "size": {
                    "width": 288,
                    "height": 64
                },
                "position": {
                    "offset": {
                        "left": 172,
                        "top": 238
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 16,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["OT/"]
                } as imenugraphr.IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsExperience": {
                "size": {
                    "width": 172,
                    "height": 80
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "top",
                    "offset": {
                        "top": 36,
                        "left": -24
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["EXP POINTS"],
                        "position": {
                            "offset": {
                                "top": 12
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": ["LEVEL UP"],
                        "position": {
                            "offset": {
                                "top": 44
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceFrom"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceNext"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": [["To"]],
                        "position": {
                            "offset": {
                                "top": 64,
                                "left": 82
                            }
                        }
                    } as imenugraphr.IMenuChildSchema],
                "container": "PokemonMenuStats",
                "plain": true,
                "textXOffset": 0,
                "textYOffset": 28,
                "textSpeed": 0
            } as IMenuBase,
            "PokemonMenuStatsExperienceFrom": {
                "size": {
                    "width": 60
                },
                "position": {
                    "offset": {
                        "top": 60,
                        "left": 32
                    }
                },
                "container": "PokemonMenuStatsExperience",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 0,
                "textYOffset": 0
            } as IMenuSchema,
            "PokemonMenuStatsExperienceNext": {
                "position": {
                    "offset": {
                        "top": 60,
                        "left": 112
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [["Level"]],
                        "position": {
                            "offset": {
                                "top": 6
                            }
                        }
                    } as imenugraphr.IMenuChildSchema],
                "container": "PokemonMenuStatsExperience",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 16,
                "textYOffset": 0
            } as IMenuSchema,
            "PokemonMenuStatsMoves": {
                "size": {
                    "width": 352,
                    "height": 172
                },
                "position": {
                    "vertical": "bottom"
                },
                "container": "PokemonMenuStats",
                "textXOffset": 32,
                "textYOffset": 14
            },
            "Items": {
                "size": {
                    "width": 256,
                    "height": 176
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 192,
                        "top": 32
                    }
                },
                "backMenu": "Pause",
                "ignoreProgressB": true,
                "saveIndex": true,
                "scrollingItemsComputed": true,
                "textXOffset": 32
            } as imenugraphr.IListMenuSchema,
            "Item": {
                "size": {
                    "width": 112,
                    "height": 80
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 264,
                        "top": 160
                    }
                },
                "backMenu": "Items",
                "ignoreProgressB": true,
                "textXOffset": 32,
                "textYOffset": 16
            },
            "Player": {
                "size": {
                    "width": 320,
                    "height": 288
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PlayerTop"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "DirtWhite",
                        "position": {
                            "horizontal": "stretch",
                            "vertical": "center"
                        }
                    } as imenugraphr.IMenuThingSchema, {
                        "type": "text",
                        "words": ["BADGES"],
                        "position": {
                            "offset": {
                                "left": 112,
                                "top": 142
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 98,
                                "top": 148
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 210,
                                "top": 148
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "PlayerBottom"
                    } as imenugraphr.IMenuChildSchema],
                "backMenu": "Pause",
                "dirty": true,
                "ignoreProgressB": true,
                "textSpeed": 0
            } as IMenuBase,
            "PlayerTop": {
                "size": {
                    "width": 308,
                    "height": 116
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 6
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            "NAME/%%%%%%%PLAYER%%%%%%%",
                            "\n",
                            "MONEY/%%%%%%%MONEY%%%%%%%",
                            "\n",
                            "TIME/%%%%%%%TIME%%%%%%%",
                        ],
                        "position": {
                            "offset": {
                                "left": 26,
                                "top": 24
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "PlayerPortrait",
                        "position": {
                            "horizontal": "right",
                            "vertical": "top",
                            "offset": {
                                "left": -18,
                                "top": 14
                            }
                        }
                    } as imenugraphr.IMenuThingSchema],
                "light": true,
                "container": "Player",
                "textSpeed": 0
            } as IMenuBase,
            "PlayerBottom": {
                "size": {
                    "width": 276,
                    "height": 116
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 166
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            ["1Shadow"], " ", ["2Shadow"], " ", ["3Shadow"], " ", ["4Shadow"],
                            ["5Shadow"], " ", ["6Shadow"], " ", ["7Shadow"], " ", ["8Shadow"],
                        ],
                        "position": {
                            "offset": {
                                "left": 10,
                                "top": 12
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "BrockPortrait",
                        "position": {
                            "offset": {
                                "left": 26,
                                "top": 26
                            }
                        }
                    } as imenugraphr.IMenuThingSchema, {
                        "type": "thing",
                        "thing": "MistyPortrait",
                        "position": {
                            "offset": {
                                "left": 90,
                                "top": 26
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "LtSurgePortrait",
                        "position": {
                            "offset": {
                                "left": 154,
                                "top": 26
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "ErikaPortrait",
                        "position": {
                            "offset": {
                                "left": 218,
                                "top": 26
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "KogaPortrait",
                        "position": {
                            "offset": {
                                "left": 26,
                                "top": 72
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "SabrinaPortrait",
                        "position": {
                            "offset": {
                                "left": 90,
                                "top": 72
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "BlainePortrait",
                        "position": {
                            "offset": {
                                "left": 154,
                                "top": 72
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "thing",
                        "thing": "GiovanniPortrait",
                        "position": {
                            "offset": {
                                "left": 218,
                                "top": 72
                            }
                        }
                    }],
                "light": true,
                "container": "Player",
                "textSpeed": 0,
                "textPaddingX": 34,
                "textPaddingY": 48
            } as IMenuBase,
            "Save": {
                "size": {
                    "width": 256,
                    "height": 160
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 32
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["PLAYER"],
                        "position": {
                            "offset": {
                                "left": 16,
                                "top": 28
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["BADGES"],
                        "position": {
                            "offset": {
                                "left": 16,
                                "top": 60
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["%%%%%%%POKEDEX%%%%%%%"],
                        "position": {
                            "offset": {
                                "left": 16,
                                "top": 92
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["TIME"],
                        "position": {
                            "offset": {
                                "left": 16,
                                "top": 124
                            }
                        }
                    } as imenugraphr.IMenuChildSchema,
                    {
                        "type": "text",
                        "words": [
                            {
                                "command": "padLeft",
                                "length": 8,
                                "word": "%%%%%%%PLAYER%%%%%%%"
                            } as imenugraphr.IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 14,
                                "word": "%%%%%%%BADGES.LENGTH%%%%%%%",
                                "alignRight": true
                            } as imenugraphr.IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 14,
                                "word": "%%%%%%%POKEDEX.LENGTH%%%%%%%",
                                "alignRight": true
                            } as imenugraphr.IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 14,
                                "word": "%%%%%%%TIME%%%%%%%",
                                "alignRight": true
                            } as imenugraphr.IMenuWordPadLeftCommand],
                        "position": {
                            "offset": {
                                "top": 28
                            }
                        }
                    } as imenugraphr.IMenuChildSchema],
                "textSpeed": 0
            },
            "Yes/No": {
                "size": {
                    "width": 96,
                    "height": 80
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -112,
                        "top": 56
                    }
                },
                "arrowXOffset": 4,
                "textXOffset": 32,
                "textYOffset": 14
            } as IMenuSchema,
            "Heal/Cancel": {
                "size": {
                    "width": 144,
                    "height": 96
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 88,
                        "top": 56
                    }
                },
                "arrowXOffset": 4,
                "textXOffset": 32
            } as IMenuSchema,
            "Buy/Sell": {
                "size": {
                    "width": 176,
                    "height": 112
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -72,
                        "top": -40
                    }
                },
                "textXOffset": 32,
                "textYOffset": 16
            },
            "Money": {
                "size": {
                    "width": 144,
                    "height": 48
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 88,
                        "top": -72
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "WhiteSquare",
                        "size": {
                            "width": 80,
                            "height": 14
                        },
                        "position": {
                            "vertical": "top",
                            "horizontal": "right",
                            "offset": {
                                "left": -32
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "text",
                        "words": ["MONEY"],
                        "position": {
                            "offset": {
                                "left": 32,
                                "top": -1
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": [{
                            "command": "padLeft",
                            "length": "%%%%%%%MONEY%%%%%%%",
                            "word": "$"
                        }],
                        "position": {
                            "offset": {
                                "top": 16
                            }
                        }
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "text",
                        "words": [{
                            "command": "padLeft",
                            "length": 32,
                            "word": "%%%%%%%MONEY%%%%%%%"
                        }],
                        "position": {
                            "offset": {
                                "top": 16
                            }
                        }
                    } as imenugraphr.IMenuChildSchema],
                "textSpeed": 0
            },
            "ShopItems": {
                "size": {
                    "width": 256,
                    "height": 176
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 32,
                        "top": 24
                    }
                },
                "textXOffset": 32,
                "scrollingItems": 16
            } as imenugraphr.IListMenuSchema,
            "ShopItemsAmount": {
                "size": {
                    "width": 208,
                    "height": 48
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "top": -16
                    }
                },
                "container": "ShopItems",
                "backMenu": "ShopItems",
                "textSpeed": 0
            },
            "Town Map": {
                "size": {
                    "width": 352,
                    "height": 324
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -16
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "Town Map Inside"
                    } as imenugraphr.IMenuChildSchema],
                "ignoreProgressB": true,
                "textSpeed": 0,
                "textXOffset": 32,
                "textYOffset": 14
            },
            "Town Map Inside": {
                "size": {
                    "width": 320,
                    "height": 272
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 32
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "TownMapNoWater"
                    } as imenugraphr.IMenuThingSchema],
                "container": "Town Map",
                "watery": true
            } as IMenuBase,
            "Battle": {
                "size": {
                    "width": 320,
                    "height": 192
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [{
                    "type": "menu",
                    "name": "GeneralText"
                } as imenugraphr.IMenuChildSchema],
                "hidden": true
            } as IMenuSchema,
            "BattlePlayerHealth": {
                "size": {
                    "width": 154,
                    "height": 26
                },
                "position": {
                    "vertical": "bottom",
                    "horizontal": "right",
                    "offset": {
                        "top": -18,
                        "left": -22
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 8
                            },
                        },
                        "args": {
                            "height": 24
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 150
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": 2,
                                "top": 8
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "top": 8
                            }
                        },
                        "args": {
                            "flipHoriz": true
                        }
                    }],
                "container": "Battle",
                "hidden": true,
                "textXOffset": 34,
                "textYOffset": 2,
                "textPaddingX": 2,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerPokeballs": {
                "size": {
                    "width": 112,
                    "height": 20
                },
                "position": {
                    "offset": {
                        "left": 38,
                        "top": 10
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textPaddingX": 2,
                "textSpeed": 0,
                "textXOffset": 0,
                "textYOffset": 0
            } as IMenuSchema,
            "BattlePlayerHealthTitle": {
                "size": {
                    "width": 152
                },
                "position": {
                    "offset": {
                        "top": -40,
                        "left": 16
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthLevel": {
                "position": {
                    "offset": {
                        "top": -24,
                        "left": 80
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "top": 6,
                                "left": 2
                            }
                        }
                    } as imenugraphr.IMenuThingSchema],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 16,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthAmount": {
                "size": {
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 16,
                        "top": -4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 4
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 100
                        },
                        "position": {
                            "offset": {
                                "left": 32
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 96,
                            "id": "HPBarFillPlayer"
                        },
                        "position": {
                            "offset": {
                                "left": 34,
                                "top": 2
                            }
                        }
                    }],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthNumbers": {
                "size": {
                    "width": 256,
                    "height": 40
                },
                "position": {
                    "offset": {
                        "top": 6,
                        "left": 16
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 16,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealth": {
                "size": {
                    "width": 154,
                    "height": 26
                },
                "position": {
                    "offset": {
                        "top": 32,
                        "left": 22
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "height": 23
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 136
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": 2
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "position": {
                            "vertical": "bottom",
                            "horizontal": "right"
                        }
                    }],
                "container": "Battle",
                "hidden": true,
                "textXOffset": 28,
                "textYOffset": 2,
                "textPaddingX": 2,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentPokeballs": {
                "size": {
                    "width": 112,
                    "height": 20
                },
                "position": {
                    "offset": {
                        "left": 24,
                        "top": 2
                    }
                },
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textPaddingX": 2,
                "textSpeed": 0,
                "textXOffset": 0,
                "textYOffset": 0
            } as IMenuSchema,
            "BattleOpponentHealthTitle": {
                "position": {
                    "offset": {
                        "top": -34,
                        "left": -6
                    }
                },
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textXOffset": 0,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealthLevel": {
                "position": {
                    "offset": {
                        "top": -18,
                        "left": 42
                    }
                },
                "childrenSchemas": [{
                    "type": "thing",
                    "thing": "CharLevel",
                    "position": {
                        "offset": {
                            "top": 6,
                            "left": 2
                        }
                    }
                } as imenugraphr.IMenuChildSchema],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textXOffset": 16,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealthAmount": {
                "position": {
                    "offset": {
                        "left": 12,
                        "top": 4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP"
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 100
                        },
                        "position": {
                            "offset": {
                                "left": 28
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 96,
                            "id": "HPBarFillOpponent"
                        },
                        "position": {
                            "offset": {
                                "left": 30,
                                "top": 2
                            }
                        }
                    }],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "height": 16,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleDisplayInitial": {
                "size": {
                    "width": 288
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch"
                },
                "container": "Battle",
                "hidden": true
            } as IMenuSchema,
            "BattleOptions": {
                "size": {
                    "width": 192,
                    "height": 96
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom"
                },
                "clearedIndicesOnDeletion": [
                    "Pause",
                    "Pokemon",
                    "Items",
                    "BattleFightList"
                ],
                "container": "GeneralText",
                "ignoreB": true,
                "textXOffset": 32,
                "textColumnWidth": 96
            } as imenugraphr.IListMenuSchema,
            "BattleDisplayPlayer": {
                "size": {
                    "width": 180,
                    "height": 84
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "left": 34
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "left": 84,
                                "top": 24
                            }
                        }
                    } as imenugraphr.IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 100
                        },
                        "position": {
                            "offset": {
                                "left": 48,
                                "top": 40
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 20,
                                "top": 40
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharSlash",
                        "position": {
                            "offset": {
                                "left": 82,
                                "top": 50
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowLeft",
                        "position": {
                            "offset": {
                                "left": 2,
                                "top": 70
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "width": 136
                        },
                        "position": {
                            "offset": {
                                "left": 18,
                                "top": 74
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "height": 64
                        },
                        "position": {
                            "offset": {
                                "left": 152,
                                "top": 36
                            }
                        }
                    }],
                "container": "Battle",
                "hidden": true
            } as IMenuSchema,
            "BattleDisplayOpponent": {
                "size": {
                    "width": 164,
                    "height": 60
                },
                "position": {
                    "offset": {
                        "left": 12
                    }
                },
                // "childrenSchemas": [{

                // }],
                "container": "Battle",
                "plain": true,
                "textSpeed": 0,
                "textXOffset": 4,
                "textYOffset": -2
            } as IMenuBase,
            "BattleFightList": {
                "size": {
                    "width": 256
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "stretch"
                },
                "container": "GeneralText",
                "backMenu": "BattleOptions",
                "saveIndex": true,
                "textXOffset": 32,
                "textYOffset": 14,
                "textPaddingY": 16,
                "arrowXOffset": 4
            } as imenugraphr.IListMenuSchema,
            "LevelUpStats": {
                "size": {
                    "width": 192,
                    "height": 160
                },
                "textSpeed": 0,
                "textXOffset": 32,
                "textYOffset": 16,
                "textPaddingY": 16
            },
            "NameOptions": {
                "size": {
                    "width": 176,
                    "height": 192
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -72
                    }
                },
                "ignoreB": true,
                "textXOffset": 32
            },
            "Keyboard": {
                "size": {
                    "width": 320,
                    "height": 288
                },
                "position": {
                    "vertical": "center",
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "KeyboardKeys"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "KeyboardTitle"
                    } as imenugraphr.IMenuChildSchema, {
                        "type": "menu",
                        "name": "KeyboardResult"
                    } as imenugraphr.IMenuChildSchema],
                "plain": true
            } as IMenuBase,
            "KeyboardKeys": {
                "size": {
                    "width": 320,
                    "height": 176
                },
                "position": {
                    "offset": {
                        "top": 64
                    }
                },
                "container": "Keyboard",
                "textColumnWidth": 32,
                "textXOffset": 32,
                "textYOffset": 14
            } as imenugraphr.IListMenuSchema,
            "KeyboardResult": {
                "size": {
                    "height": 32,
                    "width": 128
                },
                "position": {
                    "offset": {
                        "left": 156,
                        "top": 42
                    }
                },
                "container": "Keyboard",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 2,
                "textYOffset": 0
            } as IMenuSchema,
            "KeyboardTitle": {
                "size": {
                    "height": 32
                },
                "position": {
                    "horizontal": "stretch",
                    "offset": {
                        "top": -16,
                        "left": -16
                    }
                },
                "container": "Keyboard",
                "hidden": true,
                "textSpeed": 0
            } as IMenuSchema
        }
    };
}

/* tslint:enable object-literal-key-quotes */
