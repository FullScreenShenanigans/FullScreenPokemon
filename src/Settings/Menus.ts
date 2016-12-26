import {
    IListMenuSchema, IMenuChildSchema, IMenuThingSchema, IMenuWordPadLeftCommand
} from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IDialog, IMenuBase, IMenuSchema, IMenusModuleSettings, IPokedexInformation, IPokedexListing } from "../IFullScreenPokemon";

/* tslint:disable object-literal-key-quotes */

export function GenerateMenusSettings(): IMenusModuleSettings {
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
            "PLAYER": function (this: FullScreenPokemon): string[] {
                return this.itemsHolder.getItem("name");
            },
            "RIVAL": function (this: FullScreenPokemon): string[] {
                return this.itemsHolder.getItem("nameRival");
            },
            "POKE": "POK�".split(""),
            "POKEMON": "POK�MON".split(""),
            "POKEDEX": "POK�DEX".split(""),
            "POKEDEX.SEEN": function (this: FullScreenPokemon): string[] {
                return this.utilities.makeDigit(
                    this.saves.getPokedexListingsOrdered()
                        .filter((listing: IPokedexInformation): boolean => !!(listing && listing.seen))
                        .length,
                    3,
                    "\t")
                    .split("");
            },
            "POKEDEX.OWN": function (this: FullScreenPokemon): string[] {
                return this.utilities.makeDigit(
                    this.saves.getPokedexListingsOrdered()
                        .filter((listing: IPokedexInformation): boolean => !!(listing && listing.caught))
                        .length,
                    3,
                    "\t")
                    .split("");
            },
            "BADGES.LENGTH": function (this: FullScreenPokemon): string[] {
                const badges: { [i: string]: boolean } = this.itemsHolder.getItem("badges");
                let total: number = 0;

                for (const i in badges) {
                    if (badges.hasOwnProperty(i)) {
                        total += Number(badges[i]);
                    }
                }

                return total.toString().split("");
            },
            "POKEDEX.LENGTH": function (this: FullScreenPokemon): string[] {
                const pokedex: IPokedexListing[] = this.itemsHolder.getItem("Pokedex");
                if (!pokedex || !pokedex.length) {
                    return ["0"];
                }

                return pokedex
                    .map(function (listing: IPokedexListing): number {
                        return Number(listing.seen);
                    })
                    .reduce(function (a: number, b: number): number {
                        return a + b;
                    })
                    .toString()
                    .split("");
            },
            "TIME": function (this: FullScreenPokemon): string[] {
                const ticksRecorded: number = this.itemsHolder.getItem("time");
                const ticksUnrecorded: number = this.gamesRunner.getFPSAnalyzer().getNumRecorded() - this.ticksElapsed;
                const ticksTotal: number = Math.floor(ticksRecorded + ticksUnrecorded);
                const secondsTotal: number = Math.floor(ticksTotal / ((this.moduleSettings.runner || {}).interval) || 0);
                let hours: string = Math.floor(secondsTotal / 3600).toString();
                let minutes: string = Math.floor((secondsTotal - Number(hours)) / 60).toString();

                if (hours.length < 2) {
                    hours = " " + hours;
                } else if (hours.length > 2) {
                    hours = "99";
                }

                if (minutes.length < 2) {
                    minutes = "0" + minutes;
                } else if (minutes.length > 2) {
                    minutes = "99";
                }

                return (hours + ":" + minutes).split("");
            },
            "MONEY": function (this: FullScreenPokemon): string[] {
                return this.itemsHolder.getItem("money").toString().split("");
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
                    "width": 60,
                    "height": 40
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
                "textXOffset": 8,
                "ignoreB": true
            } as IListMenuSchema,
            "GeneralText": {
                "size": {
                    "height": 24,
                    "width": 80
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "top": 36
                    }
                },
                "ignoreB": true,
                "textPaddingRight": 3
            },
            "Pause": {
                "size": {
                    "width": 40,
                    "height": 56
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 60
                    }
                },
                "onMenuDelete": function (this: FullScreenPokemon): void {
                    this.menus.closePauseMenu();
                },
                "saveIndex": true,
                "textXOffset": 8,
                "textYOffset": 8,
                "textPaddingY": 7.75
            } as IListMenuSchema,
            "Pokedex": {
                "size": {
                    "width": 88
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "stretch",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "LineDecoratorVertical",
                        "position": {
                            "vertical": "stretch",
                            "offset": {
                                "left": 60,
                                "top": 3,
                                "bottom": 3
                            }
                        }
                    } as IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "LineSeparatorHorizontal",
                        "size": {
                            "width": 21.5
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "left": -3,
                                "top": 35
                            }
                        }
                    } as IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["CONTENTS"],
                        "position": {
                            "offset": {
                                "left": 7,
                                "top": 7
                            }
                        }
                    } as IMenuChildSchema,
                    {
                        "type": "menu",
                        "name": "PokedexNumbers"
                    } as IMenuChildSchema],
                "backMenu": "Pause",
                "ignoreProgressB": true,
                "scrollingItemsComputed": true,
                "singleColumnList": true,
                "textSpeed": 0,
                "textXOffset": 7,
                "textYOffset": 11
            } as IListMenuSchema,
            "PokedexNumbers": {
                "size": {
                    "width": 16,
                    "height": 20
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -4,
                        "top": 12
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["SEEN \r\n %%%%%%%POKEDEX.SEEN%%%%%%%"],
                        "position": {
                            "vertical": "top"
                        }
                    } as IMenuChildSchema,
                    {
                        "type": "text",
                        "words": ["OWN \r\n %%%%%%%POKEDEX.OWN%%%%%%%"],
                        "position": {
                            "offset": {
                                "top": 12
                            }
                        }
                    } as IMenuChildSchema],
                "container": "Pokedex",
                "hidden": true,
                "textSpeed": 0,
                "textPaddingY": 4
            } as any,
            "PokedexOptions": {
                "size": {
                    "width": 21.5,
                    "height": 37
                },
                "position": {
                    "horizontal": "right",
                    "offset": {
                        "left": -3,
                        "top": 38
                    }
                },
                "container": "Pokedex",
                "backMenu": "Pokedex",
                "keepOnBack": true,
                "hidden": true,
                "arrowXOffset": 1,
                "textSpeed": 0,
                "textXOffset": 4,
                "textYOffset": 5
            } as IListMenuSchema,
            "PokedexListing": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokedexListingSprite"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingName"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingLabel"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeight"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingWeight"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingNumber"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingInfo"
                    } as IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalLeft",
                        "position": {
                            "offset": {
                                "top": 36.5,
                                "left": 2
                            }
                        },
                        "size": {
                            "width": 38
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "LineDecoratorHorizontalRight",
                        "position": {
                            "offset": {
                                "top": 36.5,
                                "left": 38
                            }
                        },
                        "size": {
                            "width": 40
                        }
                    }],
                "lined": true
            } as IMenuBase,
            "PokedexListingSprite": {
                "position": {
                    "offset": {
                        "left": 8,
                        "top": 12
                    }
                },
                "size": {
                    "width": 20,
                    "height": 20
                },
                "hidden": true,
                "container": "PokedexListing"
            } as IMenuSchema,
            "PokedexListingName": {
                "position": {
                    "offset": {
                        "left": 32,
                        "top": 7.5
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
                        "left": 32,
                        "top": 15.5
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
                        "left": 36,
                        "top": 23.5
                    }
                },
                "size": {
                    "height": 10,
                    "width": 40
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["HT"]
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeightFeet"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokedexListingHeightInches"
                    } as IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "CharFeet",
                        "position": {
                            "offset": {
                                "left": 20,
                                "top": .5
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "CharInches",
                        "position": {
                            "offset": {
                                "left": 32,
                                "top": .5
                            }
                        }
                    }],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingHeightFeet": {
                "size": {
                    "height": 10,
                    "width": 20
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 16.5,
                "textYOffset": 0,
                "textPaddingX": -8
            } as IMenuSchema,
            "PokedexListingHeightInches": {
                "size": {
                    "height": 10,
                    "width": 20
                },
                "container": "PokedexListingHeight",
                "hidden": true,
                "textXOffset": 28,
                "textYOffset": 0,
                "textPaddingX": -8
            } as IMenuSchema,
            "PokedexListingWeight": {
                "position": {
                    "offset": {
                        "left": 36,
                        "top": 31.5
                    }
                },
                "size": {
                    "height": 10,
                    "width": 40
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
                                "left": 32
                            }
                        }
                    } as IDialog & IMenuChildSchema],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 16,
                "textYOffset": 0
            } as IMenuSchema,
            "PokedexListingNumber": {
                "size": {
                    "width": 20,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 8,
                        "top": 32
                    }
                },
                "childrenSchemas": [{
                    "type": "text",
                    "words": [["No", "."]]
                } as IDialog & IMenuChildSchema],
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": -.5
            } as IMenuSchema,
            "PokedexListingInfo": {
                "position": {
                    "vertical": "bottom",
                    "horizontal": "center",
                    "offset": {
                        "top": -4
                    }
                },
                "size": {
                    "width": 76,
                    "height": 32
                },
                "container": "PokedexListing",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 2
            } as IMenuSchema,
            "Pokemon": {
                "size": {
                    "width": 88,
                    "height": 75
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [{
                    "type": "menu",
                    "name": "PokemonDialog"
                } as IMenuChildSchema],
                "backMenu": "Pause",
                "arrowXOffset": 8,
                "arrowYOffset": 3,
                "ignoreProgressB": true,
                "saveIndex": true,
                "textSpeed": 0,
                "textXOffset": 15.75,
                "textYOffset": 4
            } as IListMenuSchema,
            "PokemonDialog": {
                "size": {
                    "height": 24
                },
                "position": {
                    "horizontal": "stretch",
                    "vertical": "bottom"
                },
                "childrenSchemas": [{
                    "type": "text",
                    "words": [
                        "Choose a %%%%%%%POKEMON%%%%%%%"
                    ],
                    "position": {
                        "offset": {
                            "left": 4,
                            "top": 7.5
                        }
                    }
                } as IDialog & IMenuChildSchema],
                "container": "Pokemon",
                "textSpeed": 0
            },
            "PokemonMenuContext": {
                "size": {
                    "width": 36,
                    "height": 28
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom"
                },
                "container": "PokemonDialog",
                "textXOffset": 8,
                "textYOffset": 4
            },
            "PokemonMenuStats": {
                "size": {
                    "width": 88,
                    "height": 75
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PokemonMenuStatsTitle"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsLevel"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHPBar"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsHP"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsNumber"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsStatus"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsType1"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsID"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsOT"
                    } as IMenuChildSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 1,
                            "height": 26.5
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 4,
                                "left": -5
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 43.5,
                            "height": 1
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 30,
                                "left": -5.5
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 29,
                                "left": -49
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 1,
                            "height": 34
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 36,
                                "left": -5
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 25,
                            "height": 1
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 69.5,
                                "left": -5.5
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "args": {
                            "flipHoriz": true
                        },
                        "position": {
                            "horizontal": "right",
                            "offset": {
                                "top": 68.5,
                                "left": -30.5
                            }
                        }
                    } as IMenuThingSchema]
            },
            "PokemonMenuStatsTitle": {
                "size": {
                    "width": 44,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "top": 4,
                        "left": 39
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
                    "width": 36,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 61,
                        "top": 8
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [["Level"]],
                    "position": {
                        "offset": {
                            "top": 1.5
                        }
                    }
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsHPBar": {
                "position": {
                    "offset": {
                        "left": 48,
                        "top": 14
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 1
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 8
                            }
                        }
                    }],
                "container": "PokemonMenuStats",
                "hidden": true
            } as IMenuSchema,
            "PokemonMenuStatsHP": {
                "size": {
                    "width": 24,
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 59,
                        "top": 16
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
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 6,
                        "top": 26
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 8,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [[["No"], "."]]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsStatus": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 39,
                        "top": 24
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textXOffset": 28,
                "textYOffset": 0,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["STATUS/"]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsType1": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 35.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["TYPE1/"]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsType2": {
                "size": {
                    "width": 40,
                    "height": 8
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 43.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["TYPE2/"]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsID": {
                "size": {
                    "width": 72,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 51.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": [[["ID"], ["No"], "/"]]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsOT": {
                "size": {
                    "width": 72,
                    "height": 16
                },
                "position": {
                    "offset": {
                        "left": 43,
                        "top": 59.5
                    }
                },
                "container": "PokemonMenuStats",
                "hidden": true,
                "textYOffset": 4,
                "textSpeed": 0,
                "childrenSchemas": [{
                    "type": "text",
                    "words": ["OT/"]
                } as IMenuChildSchema]
            } as IMenuSchema,
            "PokemonMenuStatsExperience": {
                "size": {
                    "width": 43,
                    "height": 20
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "top",
                    "offset": {
                        "top": 9,
                        "left": -6
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["EXP POINTS"],
                        "position": {
                            "offset": {
                                "top": 3
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": ["LEVEL UP"],
                        "position": {
                            "offset": {
                                "top": 11
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceFrom"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PokemonMenuStatsExperienceNext"
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [["To"]],
                        "position": {
                            "offset": {
                                "top": 16,
                                "left": 20.5
                            }
                        }
                    } as IMenuChildSchema],
                "container": "PokemonMenuStats",
                "plain": true,
                "textXOffset": 0,
                "textYOffset": 7,
                "textSpeed": 0
            } as IMenuBase,
            "PokemonMenuStatsExperienceFrom": {
                "size": {
                    "width": 15
                },
                "position": {
                    "offset": {
                        "top": 15,
                        "left": 8
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
                        "top": 15,
                        "left": 28
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [["Level"]],
                        "position": {
                            "offset": {
                                "top": 1.5
                            }
                        }
                    } as IMenuChildSchema],
                "container": "PokemonMenuStatsExperience",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": 4,
                "textYOffset": 0
            } as IMenuSchema,
            "PokemonMenuStatsMoves": {
                "size": {
                    "width": 88,
                    "height": 43
                },
                "position": {
                    "vertical": "bottom"
                },
                "container": "PokemonMenuStats",
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "Items": {
                "size": {
                    "width": 64,
                    "height": 44
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 48,
                        "top": 8
                    }
                },
                "backMenu": "Pause",
                "ignoreProgressB": true,
                "saveIndex": true,
                "scrollingItemsComputed": true,
                "textXOffset": 8
            } as IListMenuSchema,
            "Item": {
                "size": {
                    "width": 28,
                    "height": 20
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 66,
                        "top": 40
                    }
                },
                "backMenu": "Items",
                "ignoreProgressB": true,
                "textXOffset": 8,
                "textYOffset": 4
            },
            "Player": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "PlayerTop"
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "DirtWhite",
                        "position": {
                            "horizontal": "stretch",
                            "vertical": "center"
                        }
                    } as IMenuThingSchema, {
                        "type": "text",
                        "words": ["BADGES"],
                        "position": {
                            "offset": {
                                "left": 28,
                                "top": 35.5
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 24.5,
                                "top": 37
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [["Circle"]],
                        "position": {
                            "offset": {
                                "left": 52.5,
                                "top": 37
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "PlayerBottom"
                    } as IMenuChildSchema],
                "backMenu": "Pause",
                "dirty": true,
                "ignoreProgressB": true,
                "textSpeed": 0
            } as IMenuBase,
            "PlayerTop": {
                "size": {
                    "width": 77,
                    "height": 29
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 1.5
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
                                "left": 6.5,
                                "top": 6
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "PlayerPortrait",
                        "position": {
                            "horizontal": "right",
                            "vertical": "top",
                            "offset": {
                                "left": -4.5,
                                "top": 3.5
                            }
                        }
                    } as IMenuThingSchema],
                "light": true,
                "container": "Player",
                "textSpeed": 0
            } as IMenuBase,
            "PlayerBottom": {
                "size": {
                    "width": 69,
                    "height": 29
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 41.5
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
                                "left": 2.5,
                                "top": 3
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "BrockPortrait",
                        "position": {
                            "offset": {
                                "left": 6.5,
                                "top": 6.5
                            }
                        }
                    } as IMenuThingSchema, {
                        "type": "thing",
                        "thing": "MistyPortrait",
                        "position": {
                            "offset": {
                                "left": 22.5,
                                "top": 6.5
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "LtSurgePortrait",
                        "position": {
                            "offset": {
                                "left": 38.5,
                                "top": 6.5
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "ErikaPortrait",
                        "position": {
                            "offset": {
                                "left": 54.5,
                                "top": 6.5
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "KogaPortrait",
                        "position": {
                            "offset": {
                                "left": 6.5,
                                "top": 18
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "SabrinaPortrait",
                        "position": {
                            "offset": {
                                "left": 22.5,
                                "top": 18
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "BlainePortrait",
                        "position": {
                            "offset": {
                                "left": 38.5,
                                "top": 18
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "thing",
                        "thing": "GiovanniPortrait",
                        "position": {
                            "offset": {
                                "left": 54.5,
                                "top": 18
                            }
                        }
                    }],
                "light": true,
                "container": "Player",
                "textSpeed": 0,
                "textPaddingX": 8.5,
                "textPaddingY": 12
            } as IMenuBase,
            "Save": {
                "size": {
                    "width": 64,
                    "height": 40
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "left": 8
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [
                            "PLAYER",
                            "\n",
                            "BADGES",
                            "\n",
                            "%%%%%%%POKEDEX%%%%%%%",
                            "\n",
                            "TIME"
                        ],
                        "position": {
                            "offset": {
                                "left": 4,
                                "top": 7
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%PLAYER%%%%%%%",
                                "alignRight": true
                            } as IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%BADGES.LENGTH%%%%%%%",
                                "alignRight": true
                            } as IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%POKEDEX.LENGTH%%%%%%%",
                                "alignRight": true
                            } as IMenuWordPadLeftCommand,
                            {
                                "command": "padLeft",
                                "length": 15,
                                "word": "%%%%%%%TIME%%%%%%%",
                                "alignRight": true
                            } as IMenuWordPadLeftCommand],
                        "position": {
                            "offset": {
                                "top": 7
                            }
                        }
                    } as IMenuChildSchema],
                "textSpeed": 0
            },
            "Yes/No": {
                "size": {
                    "width": 24,
                    "height": 20
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -28,
                        "top": 14
                    }
                },
                "arrowXOffset": 1,
                "textXOffset": 8,
                "textYOffset": 3.5
            } as IMenuSchema,
            "Heal/Cancel": {
                "size": {
                    "width": 36,
                    "height": 24
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 22,
                        "top": 14
                    }
                },
                "arrowXOffset": 1,
                "textXOffset": 8
            } as IMenuSchema,
            "Buy/Sell": {
                "size": {
                    "width": 44,
                    "height": 28
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -18,
                        "top": -10
                    }
                },
                "textXOffset": 8,
                "textYOffset": 4
            },
            "Money": {
                "size": {
                    "width": 36,
                    "height": 12
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 22,
                        "top": -18
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "WhiteSquare",
                        "size": {
                            "width": 20,
                            "height": 3.5
                        },
                        "position": {
                            "vertical": "top",
                            "horizontal": "right",
                            "offset": {
                                "left": -8
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "text",
                        "words": ["MONEY"],
                        "position": {
                            "offset": {
                                "left": 8,
                                "top": -.25
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [{
                            "command": "padLeft",
                            "length": "%%%%%%%MONEY%%%%%%%",
                            "word": "$"
                        }],
                        "position": {
                            "offset": {
                                "top": 4
                            }
                        }
                    } as IMenuChildSchema, {
                        "type": "text",
                        "words": [{
                            "command": "padLeft",
                            "length": 8,
                            "word": "%%%%%%%MONEY%%%%%%%"
                        }],
                        "position": {
                            "offset": {
                                "top": 4
                            }
                        }
                    } as IMenuChildSchema],
                "textSpeed": 0
            },
            "ShopItems": {
                "size": {
                    "width": 64,
                    "height": 44
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": 8,
                        "top": 6
                    }
                },
                "textXOffset": 8,
                "scrollingItems": 4
            } as IListMenuSchema,
            "ShopItemsAmount": {
                "size": {
                    "width": 52,
                    "height": 12
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "top": -4
                    }
                },
                "container": "ShopItems",
                "backMenu": "ShopItems",
                "textSpeed": 0
            },
            "Town Map": {
                "size": {
                    "width": 88,
                    "height": 81
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -4
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "Town Map Inside"
                    } as IMenuChildSchema],
                "ignoreProgressB": true,
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 3.5
            },
            "Town Map Inside": {
                "size": {
                    "width": 80,
                    "height": 68
                },
                "position": {
                    "horizontal": "center",
                    "offset": {
                        "top": 8
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "TownMapNoWater"
                    } as IMenuThingSchema],
                "container": "Town Map",
                "watery": true
            } as IMenuBase,
            "Battle": {
                "size": {
                    "width": 80,
                    "height": 48
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "childrenSchemas": [{
                    "type": "menu",
                    "name": "GeneralText"
                } as IMenuChildSchema],
                "hidden": true
            } as IMenuSchema,
            "BattlePlayerHealth": {
                "size": {
                    "width": 38.5,
                    "height": 6.5
                },
                "position": {
                    "vertical": "bottom",
                    "horizontal": "right",
                    "offset": {
                        "top": -1.5,
                        "left": -5.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "position": {
                            "horizontal": "right"
                        },
                        "args": {
                            "height": 5.75
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 37.5
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": .5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowHorizontal",
                        "position": {
                            "vertical": "bottom"
                        },
                        "args": {
                            "flipHoriz": true
                        }
                    }],
                "container": "Battle",
                "hidden": true,
                "textXOffset": 8.5,
                "textYOffset": .5,
                "textPaddingX": .5,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthTitle": {
                "size": {
                    "width": 38
                },
                "position": {
                    "offset": {
                        "top": -12.5,
                        "left": 4
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
                        "top": -8.5,
                        "left": 20
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "top": 1.5,
                                "left": .5
                            }
                        }
                    } as IMenuThingSchema],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthAmount": {
                "size": {
                    "height": 4
                },
                "position": {
                    "offset": {
                        "left": 4,
                        "top": -3
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 1
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 8
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 24,
                            "id": "HPBarFillPlayer"
                        },
                        "position": {
                            "offset": {
                                "left": 8.5,
                                "top": .5
                            }
                        }
                    }],
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textSpeed": 0
            } as IMenuSchema,
            "BattlePlayerHealthNumbers": {
                "size": {
                    "width": 36,
                    "height": 10
                },
                "position": {
                    "offset": {
                        "top": -1,
                        "left": 4
                    }
                },
                "container": "BattlePlayerHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealth": {
                "size": {
                    "width": 38.5,
                    "height": 6.5
                },
                "position": {
                    "offset": {
                        "top": 8,
                        "left": 5.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "height": 5.75
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "BlackSquare",
                        "args": {
                            "width": 34
                        },
                        "position": {
                            "vertical": "bottom",
                            "offset": {
                                "left": .5
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
                "textXOffset": 7,
                "textYOffset": .5,
                "textPaddingX": .5,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealthTitle": {
                "position": {
                    "offset": {
                        "top": -8.5,
                        "left": -1.5
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
                        "top": -4.5,
                        "left": 10.5
                    }
                },
                "childrenSchemas": [{
                    "type": "thing",
                    "thing": "CharLevel",
                    "position": {
                        "offset": {
                            "top": 1.5,
                            "left": .5
                        }
                    }
                } as IMenuChildSchema],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "textXOffset": 4,
                "textYOffset": 0,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleOpponentHealthAmount": {
                "position": {
                    "offset": {
                        "left": 3,
                        "top": 1
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharHP"
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 7
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "LightGraySquare",
                        "args": {
                            "width": 24,
                            "id": "HPBarFillOpponent"
                        },
                        "position": {
                            "offset": {
                                "left": 7.5,
                                "top": .5
                            }
                        }
                    }],
                "container": "BattleOpponentHealth",
                "hidden": true,
                "height": 4,
                "textSpeed": 0
            } as IMenuSchema,
            "BattleDisplayInitial": {
                "size": {
                    "width": 72
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
                    "width": 48,
                    "height": 24
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
                "textXOffset": 8,
                "textColumnWidth": 24
            } as IListMenuSchema,
            "BattleDisplayPlayer": {
                "size": {
                    "width": 45,
                    "height": 21
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "left": 8.5
                    }
                },
                "childrenSchemas": [
                    {
                        "type": "thing",
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "left": 21,
                                "top": 6
                            }
                        }
                    } as IMenuThingSchema,
                    {
                        "type": "thing",
                        "thing": "HPBar",
                        "args": {
                            "width": 25
                        },
                        "position": {
                            "offset": {
                                "left": 12,
                                "top": 10
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 5,
                                "top": 10
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "CharSlash",
                        "position": {
                            "offset": {
                                "left": 20.5,
                                "top": 12.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "HalfArrowLeft",
                        "position": {
                            "offset": {
                                "left": .5,
                                "top": 17.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "width": 34
                        },
                        "position": {
                            "offset": {
                                "left": 4.5,
                                "top": 18.5
                            }
                        }
                    }, {
                        "type": "thing",
                        "thing": "Line",
                        "args": {
                            "height": 10
                        },
                        "position": {
                            "offset": {
                                "left": 38,
                                "top": 9
                            }
                        }
                    }],
                "container": "Battle",
                "hidden": true
            } as IMenuSchema,
            "BattleDisplayOpponent": {
                "size": {
                    "width": 41,
                    "height": 15
                },
                "position": {
                    "offset": {
                        "left": 3
                    }
                },
                // "childrenSchemas": [{

                // }],
                "container": "Battle",
                "plain": true,
                "textSpeed": 0,
                "textXOffset": 1,
                "textYOffset": -.5
            } as IMenuBase,
            "BattleFightList": {
                "size": {
                    "width": 64
                },
                "position": {
                    "horizontal": "right",
                    "vertical": "stretch"
                },
                "container": "GeneralText",
                "backMenu": "BattleOptions",
                "saveIndex": true,
                "textXOffset": 8,
                "textYOffset": 3.5,
                "textPaddingY": 4,
                "arrowXOffset": 1
            } as IListMenuSchema,
            "LevelUpStats": {
                "size": {
                    "width": 48,
                    "height": 40
                },
                "textSpeed": 0,
                "textXOffset": 8,
                "textYOffset": 4,
                "textPaddingY": 4
            },
            "NameOptions": {
                "size": {
                    "width": 44,
                    "height": 48
                },
                "position": {
                    "horizontal": "center",
                    "vertical": "center",
                    "offset": {
                        "left": -18
                    }
                },
                "ignoreB": true,
                "textXOffset": 8
            },
            "Keyboard": {
                "size": {
                    "width": 80,
                    "height": 72
                },
                "position": {
                    "vertical": "center",
                    "horizontal": "center"
                },
                "childrenSchemas": [
                    {
                        "type": "menu",
                        "name": "KeyboardKeys"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "KeyboardTitle"
                    } as IMenuChildSchema, {
                        "type": "menu",
                        "name": "KeyboardResult"
                    } as IMenuChildSchema],
                "plain": true
            } as IMenuBase,
            "KeyboardKeys": {
                "size": {
                    "width": 80,
                    "height": 44
                },
                "position": {
                    "offset": {
                        "top": 16
                    }
                },
                "container": "Keyboard",
                "textColumnWidth": 8,
                "textXOffset": 8,
                "textYOffset": 3.5
            } as IListMenuSchema,
            "KeyboardResult": {
                "size": {
                    "height": 8,
                    "width": 32
                },
                "position": {
                    "offset": {
                        "left": 39,
                        "top": 10.5
                    }
                },
                "container": "Keyboard",
                "hidden": true,
                "textSpeed": 0,
                "textXOffset": .5,
                "textYOffset": 0
            } as IMenuSchema,
            "KeyboardTitle": {
                "size": {
                    "height": 8
                },
                "position": {
                    "horizontal": "stretch",
                    "offset": {
                        "top": -4,
                        "left": -4
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
