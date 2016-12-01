import { IModsModuleSettings } from "gamestartr/lib/IGameStartr";
import { IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import {
    IArea, IBattleInfo, IBattler, ICharacter, IEnemy, IGrass,
    IItemSchema, IMap, IPokemon, IWildPokemonSchema
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
                        const area: IArea = this.AreaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        this.storage.addStateHistory(area, "allowCycling", area.allowCycling);
                        area.allowCycling = true;
                        this.MapScreener.variables.allowCycling = true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const area: IArea = this.AreaSpawner.getArea() as IArea;
                        if (!area) {
                            return;
                        }

                        this.storage.popStateHistory(area, "allowCycling");

                        if (!area.allowCycling && this.player.cycling) {
                            this.cycling.stopCycling(this.player);
                        }
                        this.MapScreener.variables.allowCycling = area.allowCycling;
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
                    onModEnable: function (this: FullScreenPokemon): void {
                        const stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = 10;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = this.moduleSettings.objects.properties!["Player"].speed;
                    }
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        (this.GroupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.previousTitle = character.title;
                                character.title = (character as any).thing = "BugCatcher";
                                this.ThingHitter.cacheChecksForType(character.title, "Character");
                                this.graphics.setClass(character, character.className);
                            });
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        (this.GroupHolder.getGroup("Character") as ICharacter[])
                            .filter((character: ICharacter): boolean => !!character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.title = (character as any).thing = character.previousTitle!;
                                this.ThingHitter.cacheChecksForType(character.title, "Character");
                                this.graphics.setClass(character, character.className);
                            });
                    },
                    onBattleStart: function (this: FullScreenPokemon, _mod: IMod, _eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent!;

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
                        const partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = this.MathDecider.getConstant("statisticNames");

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].previousLevel = partyPokemon[i].level;
                            partyPokemon[i].level = 100;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (partyPokemon[i] as any)[statistics[j]] = (partyPokemon[i] as any)[statistics[j] + "Normal"] =
                                    this.MathDecider.compute("pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        const partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = this.MathDecider.getConstant("statisticNames");

                        for (const pokemon of partyPokemon) {
                            pokemon.level = pokemon.previousLevel!;
                            pokemon.previousLevel = undefined;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (pokemon as any)[statistics[j]] = (pokemon as any)[statistics[j] + "Normal"] =
                                    this.MathDecider.compute("pokemonStatistic", pokemon, statistics[j]);
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
                        this.ObjectMaker.getFunction("Solid").prototype.collide = (): boolean => true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = (): boolean => false;
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    onModEnable: function (this: FullScreenPokemon): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = true;
                    },
                    onModDisable: function (this: FullScreenPokemon): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = false;
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
                        const grass: IGrass | undefined = this.player.grass;
                        if (!grass) {
                            return;
                        }

                        const grassMap: IMap | undefined = this.AreaSpawner.getMap(grass.mapName) as IMap;
                        const grassArea: IArea | undefined = grassMap ? grassMap.areas[grass.areaName] as IArea : undefined;
                        const opponent: String = settings.battlers.opponent!.category;

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
                        const grassMap: IMap | undefined = this.player.grass && this.AreaSpawner.getMap(this.player.grass.mapName) as IMap;
                        const grassArea: IArea | undefined = grassMap && grassMap.areas[this.player.grass!.areaName] as IArea;

                        if (!this.BattleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
                            return;
                        }

                        for (let i: number = items.length - 1; i > -1; i -= 1) {
                            let currentItem: IItemSchema = this.MathDecider.getConstant("items")[items[i].item];
                            if (currentItem.category === "PokeBall") {
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
                        const partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty");
                        const pcPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInPC");

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
                        const opponent: IBattler = battleInfo.battlers.opponent!;
                        const player: IBattler = battleInfo.battlers.player!;
                        const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
                        const wildPokemonOptions: IWildPokemonSchema[] | undefined = (this.AreaSpawner.getArea() as IArea).wildPokemon.grass;
                        if (!wildPokemonOptions) {
                            return;
                        }

                        const statistics: string[] = this.MathDecider.getConstant("statisticNames");
                        const enemyPokemonAvg: number = isWildBattle ?
                            this.MathDecider.compute("averageLevelWildPokemon", wildPokemonOptions) :
                            this.MathDecider.compute("averageLevel", opponent.actors);
                        const playerPokemonAvg: number = this.MathDecider.compute("averageLevel", player.actors);

                        for (const actor of opponent.actors) {
                            actor.level += playerPokemonAvg - enemyPokemonAvg;

                            for (const statistic of statistics) {
                                (actor as any)[statistic] = (actor as any)[statistic + "Normal"] =
                                    this.MathDecider.compute("pokemonStatistic", actor, statistic);
                            }
                        }
                    }
                }
            }
        ]
    };
}
