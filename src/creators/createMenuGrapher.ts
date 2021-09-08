import { ListMenuSchema, MenuChildSchema, MenuWordPadLeftCommand, MenuGraphr } from "menugraphr";

import { Pokedex, PokedexInformation } from "../sections/constants/Pokemon";
import { Dialog, MenuBase, MenuSchema } from "../sections/Menus";
import { FullScreenPokemon } from "../FullScreenPokemon";

export const createMenuGrapher = (game: FullScreenPokemon): MenuGraphr =>
    new MenuGraphr({
        aliases: {
            " ": "Space",
            "(": "LeftParenthesis",
            ")": "RightParenthesis",
            ":": "Colon",
            ";": "Semicolon",
            "[": "LeftSquareBracket",
            "]": "RightSquareBracket",
            "-": "Hyphen",
            MDash: "MDash",
            _: "Underscore",
            "?": "QuestionMark",
            "!": "ExclamationMark",
            "/": "Slash",
            ".": "Period",
            ",": "Comma",
            "'": "Apostrophe",
            "�": "eFancy",
        },
        game: game,
        replacements: {
            PLAYER: (): string[] => game.itemsHolder.getItem(game.storage.names.name),
            RIVAL: (): string[] => game.itemsHolder.getItem(game.storage.names.nameRival),
            POKE: "POK�".split(""),
            POKEMON: "POK�MON".split(""),
            POKEDEX: "POK�DEX".split(""),
            "POKEDEX.SEEN": (): string[] =>
                game.utilities
                    .makeDigit(
                        game.saves
                            .getPokedexListingsOrdered()
                            .filter(
                                (listing: PokedexInformation): boolean =>
                                    !!(listing && listing.seen)
                            ).length,
                        12,
                        "\t"
                    )
                    .split(""),
            "POKEDEX.OWN": (): string[] =>
                game.utilities
                    .makeDigit(
                        game.saves
                            .getPokedexListingsOrdered()
                            .filter(
                                (listing: PokedexInformation): boolean =>
                                    !!(listing && listing.caught)
                            ).length,
                        12,
                        "\t"
                    )
                    .split(""),
            "BADGES.LENGTH": (): string[] => {
                const badges: { [i: string]: boolean } = game.itemsHolder.getItem(
                    game.storage.names.badges
                );
                let total = 0;

                for (const i in badges) {
                    if ({}.hasOwnProperty.call(badges, i)) {
                        total += Number(badges[i]);
                    }
                }

                return total.toString().split("");
            },
            "POKEDEX.LENGTH": (): string[] => {
                const pokedex: Pokedex = game.itemsHolder.getItem(game.storage.names.pokedex);
                if (!pokedex) {
                    return ["0"];
                }

                return Object.keys(pokedex)
                    .filter((listing): boolean => !!pokedex[listing].seen)
                    .length.toString()
                    .split("");
            },
            TIME: (): string[] => {
                const ticksRecorded: number = game.itemsHolder.getItem(game.storage.names.time);
                const ticksUnrecorded: number =
                    game.fpsAnalyzer.getRecordedTicks() - game.ticksElapsed;
                const ticksTotal: number = Math.floor(ticksRecorded + ticksUnrecorded);
                const secondsTotal: number = Math.floor(
                    ticksTotal / ((game.settings.components.frameTicker || {}).interval || 1) || 0
                );
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
            MONEY: (): string[] =>
                game.itemsHolder.getItem(game.storage.names.money).toString().split(""),
        },
        sounds: {
            onInteraction: () => game.audioPlayer.play("Menu Bleep"),
        },
        schemas: {
            Computer: {
                keepOnBack: true,
                size: {
                    height: 160,
                    width: 280,
                },
            },
            StartOptions: {
                size: {
                    width: 240,
                    height: 160,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                },
                clearedIndicesOnDeletion: ["Pause", "Pokemon", "Items"],
                textXOffset: 32,
                ignoreB: true,
            } as ListMenuSchema,
            GeneralText: {
                size: {
                    height: 96,
                    width: 320,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        top: 144,
                    },
                },
                ignoreB: true,
                textPaddingRight: 12,
            },
            Pause: {
                size: {
                    width: 160,
                    height: 224,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        left: 240,
                    },
                },
                onMenuDelete: game.menus.pause.close,
                saveIndex: true,
                textXOffset: 32,
                textYOffset: 32,
                textPaddingY: 31,
            } as ListMenuSchema,
            Pokedex: {
                size: {
                    width: 352,
                },
                position: {
                    horizontal: "center",
                    vertical: "stretch",
                    offset: {
                        left: -16,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "LineDecoratorVertical",
                        position: {
                            vertical: "stretch",
                            offset: {
                                left: 240,
                                top: 12,
                                bottom: 12,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "LineSeparatorHorizontal",
                        size: {
                            width: 86,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                left: -12,
                                top: 140,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["CONTENTS"],
                        position: {
                            offset: {
                                left: 28,
                                top: 28,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexNumbers",
                    } as MenuChildSchema,
                ],
                backMenu: "Pause",
                ignoreProgressB: true,
                scrollingItemsComputed: true,
                singleColumnList: true,
                textSpeed: 0,
                textXOffset: 28,
                textYOffset: 44,
            } as ListMenuSchema,
            PokedexNumbers: {
                size: {
                    width: 64,
                    height: 80,
                },
                position: {
                    horizontal: "right",
                    offset: {
                        left: -16,
                        top: 48,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["SEEN \r\n %%%%%%%POKEDEX.SEEN%%%%%%%"],
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["OWN \r\n %%%%%%%POKEDEX.OWN%%%%%%%"],
                        position: {
                            offset: {
                                top: 48,
                            },
                        },
                    } as MenuChildSchema,
                ],
                container: "Pokedex",
                hidden: true,
                textSpeed: 0,
                textPaddingY: 16,
            } as any,
            PokedexOptions: {
                size: {
                    width: 86,
                    height: 148,
                },
                position: {
                    horizontal: "right",
                    offset: {
                        left: -12,
                        top: 152,
                    },
                },
                container: "Pokedex",
                backMenu: "Pokedex",
                keepOnBack: true,
                hidden: true,
                arrowXOffset: 4,
                textSpeed: 0,
                textXOffset: 16,
                textYOffset: 20,
            } as ListMenuSchema,
            PokedexListing: {
                size: {
                    width: 320,
                    height: 288,
                },
                position: {
                    horizontal: "center",
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "PokedexListingSprite",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingName",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingLabel",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingHeight",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingWeight",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingNumber",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingInfo",
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "LineDecoratorHorizontalLeft",
                        position: {
                            offset: {
                                top: 146,
                                left: 8,
                            },
                        },
                        size: {
                            width: 152,
                        },
                    },
                    {
                        type: "actor",
                        actor: "LineDecoratorHorizontalRight",
                        position: {
                            offset: {
                                top: 146,
                                left: 152,
                            },
                        },
                        size: {
                            width: 160,
                        },
                    },
                ],
                lined: true,
            } as MenuBase,
            PokedexListingSprite: {
                position: {
                    offset: {
                        left: 32,
                        top: 48,
                    },
                },
                size: {
                    width: 80,
                    height: 80,
                },
                hidden: true,
                container: "PokedexListing",
            } as MenuSchema,
            PokedexListingName: {
                position: {
                    offset: {
                        left: 128,
                        top: 30,
                    },
                },
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textYOffset: 0,
            } as MenuSchema,
            PokedexListingLabel: {
                position: {
                    offset: {
                        left: 128,
                        top: 62,
                    },
                },
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textYOffset: 0,
            } as MenuSchema,
            PokedexListingHeight: {
                position: {
                    offset: {
                        left: 144,
                        top: 94,
                    },
                },
                size: {
                    height: 40,
                    width: 160,
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["HT"],
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingHeightFeet",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokedexListingHeightInches",
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "CharFeet",
                        position: {
                            offset: {
                                left: 80,
                                top: 2,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "CharInches",
                        position: {
                            offset: {
                                left: 128,
                                top: 2,
                            },
                        },
                    },
                ],
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textXOffset: 32,
                textYOffset: 0,
            } as MenuSchema,
            PokedexListingHeightFeet: {
                size: {
                    height: 40,
                    width: 80,
                },
                container: "PokedexListingHeight",
                hidden: true,
                textXOffset: 66,
                textYOffset: 0,
                textPaddingX: -32,
            } as MenuSchema,
            PokedexListingHeightInches: {
                size: {
                    height: 40,
                    width: 80,
                },
                container: "PokedexListingHeight",
                hidden: true,
                textXOffset: 112,
                textYOffset: 0,
                textPaddingX: -32,
            } as MenuSchema,
            PokedexListingWeight: {
                position: {
                    offset: {
                        left: 144,
                        top: 126,
                    },
                },
                size: {
                    height: 40,
                    width: 160,
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["WT"],
                    },
                    {
                        type: "text",
                        words: ["lb"],
                        position: {
                            offset: {
                                left: 128,
                            },
                        },
                    } as Dialog & MenuChildSchema,
                ],
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textXOffset: 64,
                textYOffset: 0,
            } as MenuSchema,
            PokedexListingNumber: {
                size: {
                    width: 80,
                    height: 16,
                },
                position: {
                    offset: {
                        left: 32,
                        top: 128,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: [["No", "."]],
                    } as Dialog & MenuChildSchema,
                ],
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textXOffset: 32,
                textYOffset: -2,
            } as MenuSchema,
            PokedexListingInfo: {
                position: {
                    vertical: "bottom",
                    horizontal: "center",
                    offset: {
                        top: -16,
                    },
                },
                size: {
                    width: 304,
                    height: 128,
                },
                container: "PokedexListing",
                hidden: true,
                textSpeed: 0,
                textXOffset: 8,
            } as MenuSchema,
            Pokemon: {
                size: {
                    height: 320,
                    width: 320,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        left: -16,
                    },
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "PokemonDialog",
                    } as MenuChildSchema,
                ],
                backMenu: "Pause",
                arrowXOffset: 32,
                arrowYOffset: 20,
                ignoreProgressB: true,
                saveIndex: true,
                textSpeed: 0,
                textXOffset: 48,
                textYOffset: 16,
                plain: true,
            } as ListMenuSchema,
            PokemonDialog: {
                size: {
                    height: 96,
                },
                position: {
                    horizontal: "stretch",
                    vertical: "bottom",
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["Choose a %%%%%%%POKEMON%%%%%%%."],
                        position: {
                            offset: {
                                left: 16,
                                top: 30,
                            },
                        },
                    } as Dialog & MenuChildSchema,
                ],
                container: "Pokemon",
                textSpeed: 0,
            },
            PokemonMenuContext: {
                size: {
                    width: 144,
                    height: 112,
                },
                position: {
                    horizontal: "right",
                    vertical: "bottom",
                },
                container: "PokemonDialog",
                textXOffset: 32,
                textYOffset: 16,
            },
            PokemonMenuStats: {
                size: {
                    width: 352,
                    height: 300,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "PokemonMenuStatsTitle",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsLevel",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsHPBar",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsHP",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsNumber",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsStatus",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsType1",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsID",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsOT",
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 4,
                            height: 106,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 16,
                                left: -20,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 174,
                            height: 4,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 120,
                                left: -22,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HalfArrowHorizontal",
                        args: {
                            flipHoriz: true,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 116,
                                left: -196,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 4,
                            height: 136,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 144,
                                left: -20,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 100,
                            height: 4,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 278,
                                left: -22,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HalfArrowHorizontal",
                        args: {
                            flipHoriz: true,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 274,
                                left: -122,
                            },
                        },
                    },
                ],
            },
            PokemonMenuStatsTitle: {
                size: {
                    width: 176,
                    height: 16,
                },
                position: {
                    offset: {
                        top: 16,
                        left: 156,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textXOffset: 0,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            PokemonMenuStatsLevel: {
                size: {
                    width: 144,
                    height: 16,
                },
                position: {
                    offset: {
                        left: 244,
                        top: 32,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textXOffset: 16,
                textYOffset: 0,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: [["Level"]],
                        position: {
                            offset: {
                                top: 6,
                            },
                        },
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsHPBar: {
                position: {
                    offset: {
                        left: 192,
                        top: 56,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharHP",
                        position: {
                            offset: {
                                left: 4,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HPBar",
                        args: {
                            width: 100,
                        },
                        position: {
                            offset: {
                                left: 32,
                            },
                        },
                    },
                ],
                container: "PokemonMenuStats",
                hidden: true,
            } as MenuSchema,
            PokemonMenuStatsHP: {
                size: {
                    width: 96,
                    height: 16,
                },
                position: {
                    offset: {
                        left: 236,
                        top: 64,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textXOffset: 0,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            PokemonMenuStatsNumber: {
                size: {
                    width: 160,
                    height: 32,
                },
                position: {
                    offset: {
                        left: 24,
                        top: 104,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textXOffset: 32,
                textYOffset: 0,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: [[["No"], "."]],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsStatus: {
                size: {
                    width: 160,
                    height: 32,
                },
                position: {
                    offset: {
                        left: 156,
                        top: 96,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textXOffset: 112,
                textYOffset: 0,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["STATUS/"],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsType1: {
                size: {
                    width: 160,
                    height: 32,
                },
                position: {
                    offset: {
                        left: 172,
                        top: 142,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textYOffset: 16,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["TYPE4/"],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsType2: {
                size: {
                    width: 160,
                    height: 32,
                },
                position: {
                    offset: {
                        left: 172,
                        top: 174,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textYOffset: 16,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["TYPE8/"],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsID: {
                size: {
                    width: 288,
                    height: 64,
                },
                position: {
                    offset: {
                        left: 172,
                        top: 206,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textYOffset: 16,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: [[["ID"], ["No"], "/"]],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsOT: {
                size: {
                    width: 288,
                    height: 64,
                },
                position: {
                    offset: {
                        left: 172,
                        top: 238,
                    },
                },
                container: "PokemonMenuStats",
                hidden: true,
                textYOffset: 16,
                textSpeed: 0,
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["OT/"],
                    } as MenuChildSchema,
                ],
            } as MenuSchema,
            PokemonMenuStatsExperience: {
                size: {
                    width: 172,
                    height: 80,
                },
                position: {
                    horizontal: "right",
                    offset: {
                        top: 36,
                        left: -24,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["EXP POINTS"],
                        position: {
                            offset: {
                                top: 12,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["LEVEL UP"],
                        position: {
                            offset: {
                                top: 44,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsExperienceFrom",
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PokemonMenuStatsExperienceNext",
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [["To"]],
                        position: {
                            offset: {
                                top: 64,
                                left: 82,
                            },
                        },
                    } as MenuChildSchema,
                ],
                container: "PokemonMenuStats",
                plain: true,
                textXOffset: 0,
                textYOffset: 28,
                textSpeed: 0,
            } as MenuBase,
            PokemonMenuStatsExperienceFrom: {
                size: {
                    width: 60,
                },
                position: {
                    offset: {
                        top: 60,
                        left: 32,
                    },
                },
                container: "PokemonMenuStatsExperience",
                hidden: true,
                textSpeed: 0,
                textXOffset: 0,
                textYOffset: 0,
            } as MenuSchema,
            PokemonMenuStatsExperienceNext: {
                position: {
                    offset: {
                        top: 60,
                        left: 112,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: [["Level"]],
                        position: {
                            offset: {
                                top: 6,
                            },
                        },
                    } as MenuChildSchema,
                ],
                container: "PokemonMenuStatsExperience",
                hidden: true,
                textSpeed: 0,
                textXOffset: 16,
                textYOffset: 0,
            } as MenuSchema,
            PokemonMenuStatsMoves: {
                size: {
                    width: 352,
                    height: 172,
                },
                position: {
                    vertical: "bottom",
                },
                container: "PokemonMenuStats",
                textXOffset: 32,
                textYOffset: 14,
            },
            Items: {
                size: {
                    width: 256,
                    height: 176,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        left: 192,
                        top: 32,
                    },
                },
                backMenu: "Pause",
                ignoreProgressB: true,
                saveIndex: true,
                scrollingItemsComputed: true,
                textXOffset: 32,
            } as ListMenuSchema,
            Item: {
                size: {
                    width: 112,
                    height: 80,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        left: 264,
                        top: 160,
                    },
                },
                backMenu: "Items",
                ignoreProgressB: true,
                textXOffset: 32,
                textYOffset: 16,
            },
            Player: {
                size: {
                    width: 320,
                    height: 288,
                },
                position: {
                    horizontal: "center",
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "PlayerTop",
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "DirtWhite",
                        position: {
                            horizontal: "stretch",
                            vertical: "center",
                        },
                    },
                    {
                        type: "text",
                        words: ["BADGES"],
                        position: {
                            offset: {
                                left: 112,
                                top: 142,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [["Circle"]],
                        position: {
                            offset: {
                                left: 98,
                                top: 148,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [["Circle"]],
                        position: {
                            offset: {
                                left: 210,
                                top: 148,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "menu",
                        name: "PlayerBottom",
                    } as MenuChildSchema,
                ],
                backMenu: "Pause",
                dirty: true,
                ignoreProgressB: true,
                textSpeed: 0,
            } as MenuBase,
            PlayerTop: {
                size: {
                    width: 308,
                    height: 116,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        top: 6,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: [
                            "NAME/%%%%%%%PLAYER%%%%%%%",
                            "\n",
                            "MONEY/%%%%%%%MONEY%%%%%%%",
                            "\n",
                            "TIME/%%%%%%%TIME%%%%%%%",
                        ],
                        position: {
                            offset: {
                                left: 26,
                                top: 24,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "PlayerPortrait",
                        position: {
                            horizontal: "right",
                            offset: {
                                left: -18,
                                top: 14,
                            },
                        },
                    },
                ],
                light: true,
                container: "Player",
                textSpeed: 0,
            } as MenuBase,
            PlayerBottom: {
                size: {
                    width: 276,
                    height: 116,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        top: 166,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: [
                            ["1Shadow"],
                            " ",
                            ["2Shadow"],
                            " ",
                            ["3Shadow"],
                            " ",
                            ["4Shadow"],
                            ["5Shadow"],
                            " ",
                            ["6Shadow"],
                            " ",
                            ["7Shadow"],
                            " ",
                            ["8Shadow"],
                        ],
                        position: {
                            offset: {
                                left: 10,
                                top: 12,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "BrockPortrait",
                        position: {
                            offset: {
                                left: 26,
                                top: 26,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "MistyPortrait",
                        position: {
                            offset: {
                                left: 90,
                                top: 26,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "LtSurgePortrait",
                        position: {
                            offset: {
                                left: 154,
                                top: 26,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "ErikaPortrait",
                        position: {
                            offset: {
                                left: 218,
                                top: 26,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "KogaPortrait",
                        position: {
                            offset: {
                                left: 26,
                                top: 72,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "SabrinaPortrait",
                        position: {
                            offset: {
                                left: 90,
                                top: 72,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "BlainePortrait",
                        position: {
                            offset: {
                                left: 154,
                                top: 72,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "actor",
                        actor: "GiovanniPortrait",
                        position: {
                            offset: {
                                left: 218,
                                top: 72,
                            },
                        },
                    },
                ],
                light: true,
                container: "Player",
                textSpeed: 0,
                textPaddingX: 34,
                textPaddingY: 48,
            } as MenuBase,
            Save: {
                size: {
                    width: 256,
                    height: 160,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        left: 32,
                    },
                },
                childrenSchemas: [
                    {
                        type: "text",
                        words: ["PLAYER"],
                        position: {
                            offset: {
                                left: 16,
                                top: 28,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["BADGES"],
                        position: {
                            offset: {
                                left: 16,
                                top: 60,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["%%%%%%%POKEDEX%%%%%%%"],
                        position: {
                            offset: {
                                left: 16,
                                top: 92,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: ["TIME"],
                        position: {
                            offset: {
                                left: 16,
                                top: 124,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [
                            {
                                command: "padLeft",
                                length: 8,
                                word: "%%%%%%%PLAYER%%%%%%%",
                            } as MenuWordPadLeftCommand,
                            {
                                command: "padLeft",
                                length: 14,
                                word: "%%%%%%%BADGES.LENGTH%%%%%%%",
                                alignRight: true,
                            } as MenuWordPadLeftCommand,
                            {
                                command: "padLeft",
                                length: 14,
                                word: "%%%%%%%POKEDEX.LENGTH%%%%%%%",
                                alignRight: true,
                            } as MenuWordPadLeftCommand,
                            {
                                command: "padLeft",
                                length: 14,
                                word: "%%%%%%%TIME%%%%%%%",
                                alignRight: true,
                            } as MenuWordPadLeftCommand,
                        ],
                        position: {
                            offset: {
                                top: 28,
                            },
                        },
                    } as MenuChildSchema,
                ],
                textSpeed: 0,
            },
            "Yes/No": {
                size: {
                    width: 96,
                    height: 80,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: -112,
                        top: 56,
                    },
                },
                arrowXOffset: 4,
                textXOffset: 32,
                textYOffset: 14,
            } as MenuSchema,
            "Heal/Cancel": {
                size: {
                    width: 144,
                    height: 96,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: 88,
                        top: 56,
                    },
                },
                arrowXOffset: 4,
                textXOffset: 32,
            } as MenuSchema,
            "Buy/Sell": {
                size: {
                    width: 176,
                    height: 112,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: -72,
                        top: -40,
                    },
                },
                textXOffset: 32,
                textYOffset: 16,
            },
            Money: {
                size: {
                    width: 144,
                    height: 48,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: 88,
                        top: -72,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "WhiteSquare",
                        size: {
                            width: 80,
                            height: 14,
                        },
                        position: {
                            horizontal: "right",
                            offset: {
                                left: -32,
                            },
                        },
                    },
                    {
                        type: "text",
                        words: ["MONEY"],
                        position: {
                            offset: {
                                left: 32,
                                top: -1,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [
                            {
                                command: "padLeft",
                                length: "%%%%%%%MONEY%%%%%%%",
                                word: "$",
                            },
                        ],
                        position: {
                            offset: {
                                top: 16,
                            },
                        },
                    } as MenuChildSchema,
                    {
                        type: "text",
                        words: [
                            {
                                command: "padLeft",
                                length: 32,
                                word: "%%%%%%%MONEY%%%%%%%",
                            },
                        ],
                        position: {
                            offset: {
                                top: 16,
                            },
                        },
                    } as MenuChildSchema,
                ],
                textSpeed: 0,
            },
            ShopItems: {
                size: {
                    width: 256,
                    height: 176,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: 32,
                        top: 24,
                    },
                },
                textXOffset: 32,
                scrollingItems: 16,
            } as ListMenuSchema,
            ShopItemsAmount: {
                size: {
                    width: 208,
                    height: 48,
                },
                position: {
                    horizontal: "right",
                    vertical: "bottom",
                    offset: {
                        top: -16,
                    },
                },
                container: "ShopItems",
                backMenu: "ShopItems",
                textSpeed: 0,
            },
            "Town Map": {
                size: {
                    width: 352,
                    height: 324,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: -16,
                    },
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "Town Map Inside",
                    } as MenuChildSchema,
                ],
                ignoreProgressB: true,
                textSpeed: 0,
                textXOffset: 32,
                textYOffset: 14,
            },
            "Town Map Inside": {
                size: {
                    width: 320,
                    height: 272,
                },
                position: {
                    horizontal: "center",
                    offset: {
                        top: 32,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "TownMapNoWater",
                    },
                ],
                container: "Town Map",
                watery: true,
            } as MenuBase,
            Battle: {
                size: {
                    width: 320,
                    height: 192,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "GeneralText",
                    } as MenuChildSchema,
                ],
                hidden: true,
            } as MenuSchema,
            BattlePlayerHealth: {
                size: {
                    width: 154,
                    height: 26,
                },
                position: {
                    vertical: "bottom",
                    horizontal: "right",
                    offset: {
                        top: -18,
                        left: -22,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        position: {
                            horizontal: "right",
                            offset: {
                                top: 8,
                            },
                        },
                        args: {
                            height: 24,
                        },
                    },
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 150,
                        },
                        position: {
                            vertical: "bottom",
                            offset: {
                                left: 2,
                                top: 8,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HalfArrowHorizontal",
                        position: {
                            vertical: "bottom",
                            offset: {
                                top: 8,
                            },
                        },
                        args: {
                            flipHoriz: true,
                        },
                    },
                ],
                container: "Battle",
                hidden: true,
                textXOffset: 34,
                textYOffset: 2,
                textPaddingX: 2,
                textSpeed: 0,
            } as MenuSchema,
            BattlePlayerPokeballs: {
                size: {
                    width: 112,
                    height: 20,
                },
                position: {
                    offset: {
                        left: 38,
                        top: 10,
                    },
                },
                container: "BattlePlayerHealth",
                hidden: true,
                textPaddingX: 2,
                textSpeed: 0,
                textXOffset: 0,
                textYOffset: 0,
            } as MenuSchema,
            BattlePlayerHealthTitle: {
                size: {
                    width: 152,
                },
                position: {
                    offset: {
                        top: -40,
                        left: 16,
                    },
                },
                container: "BattlePlayerHealth",
                hidden: true,
                textXOffset: 0,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            BattlePlayerHealthLevel: {
                position: {
                    offset: {
                        top: -24,
                        left: 80,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharLevel",
                        position: {
                            offset: {
                                top: 6,
                                left: 2,
                            },
                        },
                    },
                ],
                container: "BattlePlayerHealth",
                hidden: true,
                textXOffset: 16,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            BattlePlayerHealthAmount: {
                size: {
                    height: 16,
                },
                position: {
                    offset: {
                        left: 16,
                        top: -4,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharHP",
                        position: {
                            offset: {
                                left: 4,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HPBar",
                        args: {
                            width: 100,
                        },
                        position: {
                            offset: {
                                left: 32,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "LightGraySquare",
                        args: {
                            width: 96,
                            id: "HPBarFillPlayer",
                        },
                        position: {
                            offset: {
                                left: 34,
                                top: 2,
                            },
                        },
                    },
                ],
                container: "BattlePlayerHealth",
                hidden: true,
                textSpeed: 0,
            } as MenuSchema,
            BattlePlayerHealthNumbers: {
                size: {
                    width: 256,
                    height: 40,
                },
                position: {
                    offset: {
                        top: 6,
                        left: 16,
                    },
                },
                container: "BattlePlayerHealth",
                hidden: true,
                textXOffset: 16,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            BattleOpponentHealth: {
                size: {
                    width: 154,
                    height: 26,
                },
                position: {
                    offset: {
                        top: 32,
                        left: 22,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            height: 23,
                        },
                    },
                    {
                        type: "actor",
                        actor: "BlackSquare",
                        args: {
                            width: 136,
                        },
                        position: {
                            vertical: "bottom",
                            offset: {
                                left: 2,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HalfArrowHorizontal",
                        position: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                    },
                ],
                container: "Battle",
                hidden: true,
                textXOffset: 28,
                textYOffset: 2,
                textPaddingX: 2,
                textSpeed: 0,
            } as MenuSchema,
            BattleOpponentPokeballs: {
                size: {
                    width: 112,
                    height: 20,
                },
                position: {
                    offset: {
                        left: 24,
                        top: 2,
                    },
                },
                container: "BattleOpponentHealth",
                hidden: true,
                textPaddingX: 2,
                textSpeed: 0,
                textXOffset: 0,
                textYOffset: 0,
            } as MenuSchema,
            BattleOpponentHealthTitle: {
                position: {
                    offset: {
                        top: -34,
                        left: -6,
                    },
                },
                container: "BattleOpponentHealth",
                hidden: true,
                textXOffset: 0,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            BattleOpponentHealthLevel: {
                position: {
                    offset: {
                        top: -18,
                        left: 42,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharLevel",
                        position: {
                            offset: {
                                top: 6,
                                left: 2,
                            },
                        },
                    } as MenuChildSchema,
                ],
                container: "BattleOpponentHealth",
                hidden: true,
                textXOffset: 16,
                textYOffset: 0,
                textSpeed: 0,
            } as MenuSchema,
            BattleOpponentHealthAmount: {
                position: {
                    offset: {
                        left: 12,
                        top: 4,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharHP",
                    },
                    {
                        type: "actor",
                        actor: "HPBar",
                        args: {
                            width: 100,
                        },
                        position: {
                            offset: {
                                left: 28,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "LightGraySquare",
                        args: {
                            width: 96,
                            id: "HPBarFillOpponent",
                        },
                        position: {
                            offset: {
                                left: 30,
                                top: 2,
                            },
                        },
                    },
                ],
                container: "BattleOpponentHealth",
                hidden: true,
                height: 16,
                textSpeed: 0,
            } as MenuSchema,
            BattleDisplayInitial: {
                size: {
                    width: 288,
                },
                position: {
                    horizontal: "center",
                    vertical: "stretch",
                },
                container: "Battle",
                hidden: true,
            } as MenuSchema,
            BattleOptions: {
                size: {
                    width: 192,
                    height: 96,
                },
                position: {
                    horizontal: "right",
                    vertical: "bottom",
                },
                clearedIndicesOnDeletion: ["Pause", "Pokemon", "Items", "BattleFightList"],
                container: "GeneralText",
                ignoreB: true,
                textXOffset: 32,
                textColumnWidth: 96,
            } as ListMenuSchema,
            BattleDisplayPlayer: {
                size: {
                    width: 180,
                    height: 84,
                },
                position: {
                    horizontal: "right",
                    vertical: "bottom",
                    offset: {
                        left: 34,
                    },
                },
                childrenSchemas: [
                    {
                        type: "actor",
                        actor: "CharLevel",
                        position: {
                            offset: {
                                left: 84,
                                top: 24,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HPBar",
                        args: {
                            width: 100,
                        },
                        position: {
                            offset: {
                                left: 48,
                                top: 40,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "CharHP",
                        position: {
                            offset: {
                                left: 20,
                                top: 40,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "CharSlash",
                        position: {
                            offset: {
                                left: 82,
                                top: 50,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "HalfArrowLeft",
                        position: {
                            offset: {
                                left: 2,
                                top: 70,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "Line",
                        args: {
                            width: 136,
                        },
                        position: {
                            offset: {
                                left: 18,
                                top: 74,
                            },
                        },
                    },
                    {
                        type: "actor",
                        actor: "Line",
                        args: {
                            height: 64,
                        },
                        position: {
                            offset: {
                                left: 152,
                                top: 36,
                            },
                        },
                    },
                ],
                container: "Battle",
                hidden: true,
            } as MenuSchema,
            BattleDisplayOpponent: {
                size: {
                    width: 164,
                    height: 60,
                },
                position: {
                    offset: {
                        left: 12,
                    },
                },
                // "childrenSchemas": [{

                // }],
                container: "Battle",
                plain: true,
                textSpeed: 0,
                textXOffset: 4,
                textYOffset: -2,
            } as MenuBase,
            BattleFightList: {
                size: {
                    width: 256,
                },
                position: {
                    horizontal: "right",
                    vertical: "stretch",
                },
                container: "GeneralText",
                backMenu: "BattleOptions",
                saveIndex: true,
                textXOffset: 32,
                textYOffset: 14,
                textPaddingY: 16,
                arrowXOffset: 4,
            } as ListMenuSchema,
            LevelUpStats: {
                size: {
                    width: 192,
                    height: 160,
                },
                textSpeed: 0,
                textXOffset: 32,
                textYOffset: 16,
                textPaddingY: 16,
            },
            NameOptions: {
                size: {
                    width: 176,
                    height: 192,
                },
                position: {
                    horizontal: "center",
                    vertical: "center",
                    offset: {
                        left: -72,
                    },
                },
                ignoreB: true,
                textXOffset: 32,
            },
            Keyboard: {
                size: {
                    width: 320,
                    height: 288,
                },
                position: {
                    vertical: "center",
                    horizontal: "center",
                },
                childrenSchemas: [
                    {
                        type: "menu",
                        name: "KeyboardKeys",
                    },
                    {
                        type: "menu",
                        name: "KeyboardTitle",
                    },
                    {
                        type: "menu",
                        name: "KeyboardResult",
                    },
                ],
                plain: true,
            } as MenuBase,
            KeyboardKeys: {
                size: {
                    width: 320,
                    height: 176,
                },
                position: {
                    offset: {
                        top: 64,
                    },
                },
                container: "Keyboard",
                textColumnWidth: 32,
                textXOffset: 32,
                textYOffset: 14,
            } as ListMenuSchema,
            KeyboardResult: {
                size: {
                    height: 32,
                    width: 128,
                },
                position: {
                    offset: {
                        left: 156,
                        top: 42,
                    },
                },
                container: "Keyboard",
                hidden: true,
                textSpeed: 0,
                textXOffset: 2,
                textYOffset: 0,
            } as MenuSchema,
            KeyboardTitle: {
                size: {
                    height: 32,
                },
                position: {
                    horizontal: "stretch",
                    offset: {
                        top: -16,
                        left: -16,
                    },
                },
                container: "Keyboard",
                hidden: true,
                textSpeed: 0,
            } as MenuSchema,
        },
    });
