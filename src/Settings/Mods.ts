import { IModsModuleSettings } from "gamestartr/lib/IGameStartr";
import { IMod } from "modattachr/lib/IModAttachr";

import { IItemSchema } from "../components/constants/Items";
import { FullScreenPokemon } from "../FullScreenPokemon";
import {
    IArea, IBattleInfo, IBattler, ICharacter, IEnemy, IGrass,
    IMap, IPokemon, IWildPokemonSchema
} from "../IFullScreenPokemon";

const onModEnableKey: string = "onModEnable";

export function GenerateModsSettings(): IModsModuleSettings {
    "use strict";

    return {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        const area: IArea = this.areaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        this.saves.addStateHistory(area, "allowCycling", area.allowCycling);
                        area.allowCycling = true;
                        this.mapScreener.variables.allowCycling = true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const area: IArea = this.areaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        this.saves.popStateHistory(area, "allowCycling");

                        if (!area.allowCycling && this.players[0].cycling) {
                            this.cycling.stopCycling(this.players[0]);
                        }
                        this.mapScreener.variables.allowCycling = area.allowCycling;
                    },
                    onSetLocation: function (this: FullScreenPokemon, mod: IMod): void {
                        mod.events[onModEnableKey].call(this, mod);
                    }
                }
            },
            {
                name: "Speedrunner",
                enabled: false,
                events: {
                    /* tslint:disable no-string-literal */
                    onModEnable: function (this: FullScreenPokemon): void {
                        const stats: any = this.objectMaker.getFunction("Player").prototype;
                        this.players[0].speed = stats.speed = 10;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const stats: any = this.objectMaker.getFunction("Player").prototype;
                        this.players[0].speed = stats.speed = this.moduleSettings.objects!.properties!["Player"].speed;
                    }
                    /* tslint:enable no-string-literal */
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        (this.groupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.previousTitle = character.title;
                                character.title = (character as any).thing = "BugCatcher";
                                this.thingHitter.cacheChecksForType(character.title, "Character");
                                this.graphics.setClass(character, character.className);
                            });
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        (this.groupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.title = (character as any).thing = character.previousTitle!;
                                this.thingHitter.cacheChecksForType(character.title, "Character");
                                this.graphics.setClass(character, character.className);
                            });
                    },
                    onBattleStart: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent;

                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "YOUNGSTER JOEY".split("");

                        for (const actor of opponent.actors) {
                            actor.title = actor.nickname = "RATTATA".split("");
                        }
                    },
                    onSetLocation: function (this: FullScreenPokemon, mod: IMod): void {
                        mod.events[onModEnableKey].call(this, mod);
                    }
                }
            },
            {
                name: "Level 100",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        const partyPokemon: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = this.constants.pokemon.statisticNames;

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].previousLevel = partyPokemon[i].level;
                            partyPokemon[i].level = 100;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (partyPokemon[i] as any)[statistics[j]] = (partyPokemon[i] as any)[statistics[j] + "Normal"] =
                                    this.equations.pokemonStatistic(partyPokemon[i], statistics[j]);
                            }
                        }
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const partyPokemon: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = this.constants.pokemon.statisticNames;

                        for (const pokemon of partyPokemon) {
                            pokemon.level = pokemon.previousLevel!;
                            pokemon.previousLevel = undefined;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (pokemon as any)[statistics[j]] = (pokemon as any)[statistics[j] + "Normal"] =
                                    this.equations.pokemonStatistic(pokemon, statistics[j]);
                            }
                        }
                    }
                }
            },
            {
                name: "Walk Through Walls",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        this.objectMaker.getFunction("Solid").prototype.collide = (): boolean => true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        this.objectMaker.getFunction("Solid").prototype.collide = (): boolean => false;
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        this.objectMaker.getFunction("SightDetector").prototype.nocollide = true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        this.objectMaker.getFunction("SightDetector").prototype.nocollide = false;
                    }
                }
            },
            {
                name: "Nuzlocke Challenge",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        return;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        return;
                    },
                    /**
                     * Sets the area's pokemonEncountered property to true if the encounter was with a wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param settings   The battle information.
                     */
                    onBattleComplete: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, settings: IBattleInfo): void {
                        const grass: IGrass | undefined = this.players[0].grass;
                        if (!grass) {
                            return;
                        }

                        const grassMap: IMap | undefined = this.areaSpawner.getMap(grass.mapName) as IMap;
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
                    onOpenItemsMenu: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, items: any[]): void {
                        const grassMap: IMap | undefined = (
                            this.players[0].grass && this.areaSpawner.getMap(this.players[0].grass!.mapName) as IMap);
                        const grassArea: IArea | undefined = grassMap && grassMap.areas[this.players[0].grass!.areaName] as IArea;

                        if (!this.battleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
                            return;
                        }

                        for (let i: number = items.length - 1; i > -1; i -= 1) {
                            const currentItem: IItemSchema = this.constants.items.byName[items[i].item];

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
                    onFaint: function (
                        this: FullScreenPokemon,
                        _mod: IMod,
                        _eventName: string,
                        thing: IPokemon,
                        actors: IPokemon[]): void {
                        const partyPokemon: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");
                        const pcPokemon: IPokemon[] = this.itemsHolder.getItem("PokemonInPC");

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
                    onModEnable: function (this: FullScreenPokemon): void {
                        this.battles.checkPlayerGrassBattle = (): boolean => false;
                    },
                    /**
                     * Allows the Player to encounter wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModDisable: function (this: FullScreenPokemon): void {
                        delete this.battles.checkPlayerGrassBattle;
                    }
                }
            },
            {
                name: "Repeat Trainers",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        return;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        return;
                    },
                    onDialogFinish: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, other: IEnemy): void {
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
                    onModEnable: function (this: FullScreenPokemon): void {
                        return;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
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
                    onBattleReady: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent;
                        const player: IBattler = battleInfo.battlers.player!;
                        const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
                        const wildPokemonOptions: IWildPokemonSchema[] | undefined = (this.areaSpawner.getArea() as IArea)
                            .wildPokemon.grass;
                        if (!wildPokemonOptions) {
                            return;
                        }

                        const statistics: string[] = this.constants.pokemon.statisticNames;
                        const enemyPokemonAvg: number = isWildBattle ?
                            this.equations.averageLevelWildPokemon(wildPokemonOptions) :
                            this.equations.averageLevel(opponent.actors);
                        const playerPokemonAvg: number = this.equations.averageLevel(player.actors);

                        for (const actor of opponent.actors) {
                            actor.level += playerPokemonAvg - enemyPokemonAvg;

                            for (const statistic of statistics) {
                                (actor as any)[statistic] = (actor as any)[statistic + "Normal"] =
                                    this.equations.pokemonStatistic(actor, statistic);
                            }
                        }
                    }
                }
            }
        ]
    };
}
