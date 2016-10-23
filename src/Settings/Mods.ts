/// <reference path="../../typings/GameStartr.d.ts" />
/// <reference path="../../typings/ModAttachr.d.ts" />

import {
    IArea, IBattleInfo, IBattler, ICharacter, IEnemy, IGrass,
    IItemSchema, IMap, IPokemon, IWildPokemonSchema
} from "../IFullScreenPokemon";

const onModEnableKey: string = "onModEnable";

export function GenerateModsSettings(): GameStartr.IModAttachrCustoms {
    "use strict";

    return {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        this.addStateHistory(area, "allowCycling", area.allowCycling);
                        area.allowCycling = true;
                        this.MapScreener.variables.allowCycling = true;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        this.popStateHistory(area, "allowCycling");

                        if (!area.allowCycling && this.player.cycling) {
                            this.stopCycling(this.player);
                        }
                        this.MapScreener.variables.allowCycling = area.allowCycling;
                    },
                    onSetLocation: function (mod: ModAttachr.IMod): void {
                        mod.events[onModEnableKey].call(this, mod);
                    }
                }
            },
            {
                name: "Speedrunner",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = 10;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = this.settings.objects.properties.Player.speed;
                    }
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        this.GroupHolder.groups.Character
                            .filter(function (character: ICharacter): boolean {
                                return character.trainer;
                            })
                            .forEach(function (character: IEnemy): void {
                                character.previousTitle = character.title;
                                character.title = (character as any).thing = "BugCatcher";
                                this.ThingHitter.cacheChecksForType(character, "Character");
                                this.setClass(character, character.className);
                            });
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        this.GroupHolder.groups.Character
                            .filter(function (character: ICharacter): boolean {
                                return character.trainer;
                            })
                            .forEach(function (character: IEnemy): void {
                                character.title = (character as any).thing = character.previousTitle;
                                this.ThingHitter.cacheChecksForType(character, "Character");
                                this.setClass(character, character.className);
                            });
                    },
                    onBattleStart: function (mod: ModAttachr.IMod, eventName: string, battleInfo: IBattleInfo): void {
                        let opponent: IBattler = battleInfo.battlers.opponent;

                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "YOUNGSTER JOEY".split("");

                        for (let i: number = 0; i < opponent.actors.length; i += 1) {
                            opponent.actors[i].title = opponent.actors[i].nickname = "RATTATA".split("");
                        }
                    },
                    onSetLocation: function (mod: ModAttachr.IMod): void {
                        mod.events[onModEnableKey].call(this, mod);
                    }
                }
            },
            {
                name: "Level 100",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
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
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        const partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty");
                        const statistics: string[] = this.MathDecider.getConstant("statisticNames");

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].level = partyPokemon[i].previousLevel;
                            partyPokemon[i].previousLevel = undefined;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                (partyPokemon[i] as any)[statistics[j]] = (partyPokemon[i] as any)[statistics[j] + "Normal"] =
                                    this.MathDecider.compute("pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    }
                }
            },
            {
                name: "Walk Through Walls",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = function (): boolean {
                            return true;
                        };
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = function (): boolean {
                            return false;
                        };
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = true;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = false;
                    }
                }
            },
            {
                name: "Nuzlocke Challenge",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        return;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        return;
                    },
                    /**
                     * Sets the area's pokemonEncountered property to true if the encounter was with a wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param settings   The battle information.
                     */
                    onBattleComplete: function (mod: ModAttachr.IMod, eventName: string, settings: IBattleInfo): void {
                        const grass: IGrass = this.player.grass;
                        const grassMap: IMap = grass ? this.AreaSpawner.getMap(grass.mapName) as IMap : undefined;
                        const grassArea: IArea = grassMap ? grassMap.areas[grass.areaName] as IArea : undefined;
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
                    onOpenItemsMenu: function (mod: ModAttachr.IMod, eventName: string, items: any[]): void {
                        const grassMap: IMap = this.player.grass && this.AreaSpawner.getMap(this.player.grass.mapName) as IMap;
                        const grassArea: IArea = grassMap && grassMap.areas[this.player.grass.areaName] as IArea;

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
                        mod: ModAttachr.IMod,
                        eventName: string,
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
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        this.battles.checkPlayerGrassBattle = function (): boolean {
                            return false;
                        };
                    },
                    /**
                     * Allows the Player to encounter wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        delete this.battles.checkPlayerGrassBattle;
                    }
                }
            },
            {
                name: "Repeat Trainers",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        return;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        return;
                    },
                    onDialogFinish: function (mod: ModAttachr.IMod, eventName: string, other: IEnemy): void {
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
                    onModEnable: function (mod: ModAttachr.IMod): void {
                        return;
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
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
                    onBattleReady: function (mod: ModAttachr.IModAttachr, eventName: string, battleInfo: IBattleInfo): void {
                        const opponent: IBattler = battleInfo.battlers.opponent;
                        const player: IBattler = battleInfo.battlers.player;
                        const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
                        const wildPokemonOptions: IWildPokemonSchema[] = this.AreaSpawner.getArea().wildPokemon.grass;
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
            },
            {
                name: "Mobile PokeCenter",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IMod, eventName: string, args: any[]): void {
                        const party: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty");
                        const onChange: (enabled: boolean) => void = args[1][0];

                        for (const pokemon of party) {
                            this.battles.healPokemon(pokemon);
                        }

                        this.MenuGrapher.createMenu("GeneralText", {
                            deleteOnFinish: true,
                            onMenuDelete: () => onChange(false)
                        });
                        this.MenuGrapher.addMenuDialog(
                            "GeneralText",
                            [
                                "Your party has been fully healed!"
                            ]
                        );
                        this.MenuGrapher.setActiveMenu("GeneralText");
                        this.ModAttacher.toggleMod("Mobile PokeCenter");
                    },
                    onModDisable: function (mod: ModAttachr.IMod): void {
                        return;
                    }
                }
            }
        ]
    };
}
