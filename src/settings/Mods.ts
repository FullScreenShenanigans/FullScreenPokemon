import { IModsModuleSettings } from "gamestartr/lib/IGameStartr";
import { IMod } from "modattachr/lib/IModAttachr";

import { IBattleInfo, IBattler, IPokemon } from "../components/Battles";
import { IItemSchema } from "../components/constants/Items";
import { IArea, IMap, IWildPokemonSchema } from "../components/Maps";
import { ICharacter, IEnemy, IGrass, } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

const onModEnableKey: string = "onModEnable";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Mod settings for the FullScreenPokemon instance.
 */
export function GenerateModsSettings(fsp: FullScreenPokemon): IModsModuleSettings {
    "use strict";

    return {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        const area: IArea = fsp.areaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        fsp.saves.addStateHistory(area, "allowCycling", area.allowCycling);
                        area.allowCycling = true;
                        fsp.mapScreener.variables.allowCycling = true;
                    },
                    onModDisable: (): void => {
                        const area: IArea = fsp.areaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        fsp.saves.popStateHistory(area, "allowCycling");

                        if (!area.allowCycling && fsp.players[0].cycling) {
                            fsp.cycling.stopCycling(fsp.players[0]);
                        }
                        fsp.mapScreener.variables.allowCycling = area.allowCycling;
                    },
                    onSetLocation: function (mod: IMod): void {
                        mod.events[onModEnableKey](mod);
                    }
                }
            },
            {
                name: "Speedrunner",
                enabled: false,
                events: {
                    /* tslint:disable no-string-literal */
                    onModEnable: (): void => {
                        const stats: any = fsp.objectMaker.getClass("Player").prototype;
                        fsp.players[0].speed = stats.speed = 10;
                    },
                    onModDisable: (): void => {
                        const stats: any = fsp.objectMaker.getClass("Player").prototype;
                        fsp.players[0].speed = stats.speed = fsp.moduleSettings.objects!.properties!["Player"].speed;
                    }
                    /* tslint:enable no-string-literal */
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        (fsp.groupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.previousTitle = character.title;
                                character.title = (character as any).thing = "BugCatcher";
                                fsp.thingHitter.cacheChecksForType(character.title, "Character");
                                fsp.graphics.setClass(character, character.className);
                            });
                    },
                    onModDisable: (): void => {
                        (fsp.groupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.title = (character as any).thing = character.previousTitle!;
                                fsp.thingHitter.cacheChecksForType(character.title, "Character");
                                fsp.graphics.setClass(character, character.className);
                            });
                    },
                    onBattleStart: function (_mod: IMod, _eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent;

                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "YOUNGSTER JOEY".split("");

                        for (const actor of opponent.actors) {
                            actor.title = actor.nickname = "RATTATA".split("");
                        }
                    },
                    onSetLocation: function (mod: IMod): void {
                        mod.events[onModEnableKey](mod);
                    }
                }
            },
            {
                name: "Level 100",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        const partyPokemon: IPokemon[] = fsp.itemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = fsp.constants.pokemon.statisticNames;

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].previousLevel = partyPokemon[i].level;
                            partyPokemon[i].level = 100;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (partyPokemon[i] as any)[statistics[j]] = (partyPokemon[i] as any)[statistics[j] + "Normal"] =
                                    fsp.equations.pokemonStatistic(partyPokemon[i], statistics[j]);
                            }
                        }
                    },
                    onModDisable: (): void => {
                        const partyPokemon: IPokemon[] = fsp.itemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = fsp.constants.pokemon.statisticNames;

                        for (const pokemon of partyPokemon) {
                            pokemon.level = pokemon.previousLevel!;
                            pokemon.previousLevel = undefined;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (pokemon as any)[statistics[j]] = (pokemon as any)[statistics[j] + "Normal"] =
                                    fsp.equations.pokemonStatistic(pokemon, statistics[j]);
                            }
                        }
                    }
                }
            },
            {
                name: "Walk Through Walls",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        fsp.objectMaker.getClass("Solid").prototype.collide = (): boolean => true;
                    },
                    onModDisable: (): void => {
                        fsp.objectMaker.getClass("Solid").prototype.collide = (): boolean => false;
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        fsp.objectMaker.getClass("SightDetector").prototype.nocollide = true;
                    },
                    onModDisable: (): void => {
                        fsp.objectMaker.getClass("SightDetector").prototype.nocollide = false;
                    }
                }
            },
            {
                name: "Nuzlocke Challenge",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        return;
                    },
                    onModDisable: (): void => {
                        return;
                    },
                    /**
                     * Sets the area's pokemonEncountered property to true if the encounter was with a wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param settings   The battle information.
                     */
                    onBattleComplete: function (_mod: IMod, _eventName: string, settings: IBattleInfo): void {
                        const grass: IGrass | undefined = fsp.players[0].grass;
                        if (!grass) {
                            return;
                        }

                        const grassMap: IMap | undefined = fsp.areaSpawner.getMap(grass.mapName) as IMap;
                        const grassArea: IArea | undefined = grassMap ? grassMap.areas[grass.areaName] as IArea : undefined;
                        const opponent: String = settings.battlers.opponent.category;

                        if (!grassArea || opponent !== "Wild") {
                            return;
                        }

                        grassArea.pokemonEncountered = true;
                    },
                    /**
                     * Hides all types of PokeBalls from the items menu in battle.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param items   The Player's items.
                     */
                    onOpenItemsMenu: function (_mod: IMod, _eventName: string, items: any[]): void {
                        const grassMap: IMap | undefined = (
                            fsp.players[0].grass && fsp.areaSpawner.getMap(fsp.players[0].grass!.mapName) as IMap);
                        const grassArea: IArea | undefined = grassMap && grassMap.areas[fsp.players[0].grass!.areaName] as IArea;

                        if (!fsp.battleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
                            return;
                        }

                        for (let i: number = items.length - 1; i > -1; i -= 1) {
                            const currentItem: IItemSchema = fsp.constants.items.byName[items[i].item];

                            if (currentItem.category === "Pokeball") {
                                items.splice(i, 1);
                            }
                        }
                    },
                    /**
                     * Removes the fainted Pokemon from the Player's party and adds it to the PC.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param thing   The fainted Pokemon.
                     * @param actors   The Player's party Pokemon.
                     */
                    onFaint: function (_mod: IMod, _eventName: string, thing: IPokemon, actors: IPokemon[]): void {
                        const partyPokemon: IPokemon[] = fsp.itemsHolder.getItem("PokemonInParty");
                        const pcPokemon: IPokemon[] = fsp.itemsHolder.getItem("PokemonInPC");

                        actors.splice(actors.indexOf(thing), 1);
                        partyPokemon.splice(partyPokemon.indexOf(thing), 1);
                        pcPokemon.push(thing);
                    }
                }
            },
            {
                name: "Infinite Repel",
                enabled: false,
                events: {
                    /**
                     * Prevents the Player from encountering any wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModEnable: (): void => {
                        fsp.actions.grass.checkPlayerGrassBattle = (): boolean => false;
                    },
                    /**
                     * Allows the Player to encounter wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModDisable: (): void => {
                        delete fsp.actions.grass.checkPlayerGrassBattle;
                    }
                }
            },
            {
                name: "Repeat Trainers",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        return;
                    },
                    onModDisable: (): void => {
                        return;
                    },
                    onDialogFinish: function (_mod: IMod, _eventName: string, other: IEnemy): void {
                        if (other.trainer) {
                            other.alreadyBattled = false;
                        }
                    }
                }
            },
            {
                name: "Scaling Levels",
                enabled: false,
                events: {
                    onModEnable: (): void => {
                        return;
                    },
                    onModDisable: (): void => {
                        return;
                    },
                    /**
                     * Right before the battle starts, scales the enemy Pokemon
                     * to be around the same level as those in the player's party.
                     * 
                     * @param mod   The mod being fired.
                     * @param eventName   The name of the mod event being fired.
                     * @param battleInfo   Settings for the current battle.
                     */
                    onBattleReady: function (_mod: IMod, _eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent;
                        const player: IBattler = battleInfo.battlers.player!;
                        const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
                        const wildPokemonOptions: IWildPokemonSchema[] | undefined = (fsp.areaSpawner.getArea() as IArea)
                            .wildPokemon.grass;
                        if (!wildPokemonOptions) {
                            return;
                        }

                        const statistics: string[] = fsp.constants.pokemon.statisticNames;
                        const enemyPokemonAvg: number = isWildBattle ?
                            fsp.equations.averageLevelWildPokemon(wildPokemonOptions) :
                            fsp.equations.averageLevel(opponent.actors);
                        const playerPokemonAvg: number = fsp.equations.averageLevel(player.actors);

                        for (const actor of opponent.actors) {
                            actor.level += playerPokemonAvg - enemyPokemonAvg;

                            for (const statistic of statistics) {
                                (actor as any)[statistic] = (actor as any)[statistic + "Normal"] =
                                    fsp.equations.pokemonStatistic(actor, statistic);
                            }
                        }
                    }
                }
            }
        ]
    };
}
