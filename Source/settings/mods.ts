module FullScreenPokemon {
    "use strict";

    FullScreenPokemon.settings.mods = {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        (<any>area).allowCyclingOld = area.allowCycling;
                        area.allowCycling = true;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        area.allowCycling = (<any>area).allowCyclingOld;
                        delete (<any>area).allowCyclingOld;

                        if (!area.allowCycling && this.player.cycling) {
                            this.stopCycling(this.player);
                        }
                    },
                    onSetLocation: function (mod: ModAttachr.IModAttachrMod): void {
                        mod.events.onModEnable.call(this, mod);
                    }
                }
            },
            {
                name: "Speedrunner",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = 10;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = this.settings.objects.properties.Player.speed;
                    }
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.GroupHolder.groups.Character
                            .filter((character: ICharacter): boolean => character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.previousTitle = character.title;
                                character.title = (<any>character).thing = "BugCatcher";
                                this.ThingHitter.cacheChecksForType(character, "Character");
                                this.setClass(character, character.className);
                            });
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.GroupHolder.groups.Character
                            .filter((character: ICharacter): boolean => character.trainer)
                            .forEach((character: IEnemy): void => {
                                character.title = (<any>character).thing = character.previousTitle;
                                this.ThingHitter.cacheChecksForType(character, "Character");
                                this.setClass(character, character.className);
                            });
                    },
                    onBattleStart: function (mod: ModAttachr.IModAttachrMod, eventName: string, battleInfo: IBattleInfo): void {
                        let opponent: IBattleThingInfo = battleInfo.opponent;

                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "YOUNGSTER JOEY".split("");

                        for (let i: number = 0; i < opponent.actors.length; i += 1) {
                            opponent.actors[i].title = opponent.actors[i].nickname = "RATTATA".split("");
                        }
                    },
                    onSetLocation: function (mod: ModAttachr.IModAttachrMod): void {
                        mod.events.onModEnable.call(this, mod);
                    }
                }
            },
            {
                name: "Level 100",
                enabled: false,
                events: {
                    "onModEnable": function (mod: ModAttachr.IModAttachrMod): void {
                        let partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty"),
                            statistics: string[] = this.MathDecider.getConstant("statisticNames");

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].previousLevel = partyPokemon[i].level;
                            partyPokemon[i].level = 100;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                partyPokemon[i][statistics[j]] = this.MathDecider.compute(
                                    "pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    },
                    "onModDisable": function (mod: ModAttachr.IModAttachrMod): void {
                        let partyPokemon: IPokemon[] = this.ItemsHolder.getItem("PokemonInParty"),
                            statistics: string[] = this.MathDecider.getConstant("statisticNames");

                        for (let i: number = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].level = partyPokemon[i].previousLevel;
                            partyPokemon[i].previousLevel = undefined;
                            for (let j: number = 0; j < statistics.length; j += 1) {
                                partyPokemon[i][statistics[j]] = this.MathDecider.compute(
                                    "pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    }
                }
            },
            {
                name: "Walk Through Walls",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = (): boolean => true;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = (): boolean => false;
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    "onModEnable": function (mod: ModAttachr.IModAttachrMod): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = true;
                    },
                    "onModDisable": function (mod: ModAttachr.IModAttachrMod): void {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = false;
                    }
                }
            },
            {
                name: "Nuzlocke Challenge",
                enabled: false,
                events: {
                    "onModEnable": function (mod: ModAttachr.IModAttachrMod): void {
                        return;
                    },
                    "onModDisable": function (mod: ModAttachr.IModAttachrMod): void {
                        return;
                    },
                    /**
                     * Sets the area's pokemonEncountered property to true if the encounter was with a wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param settings   The battle information.
                     */
                    "onBattleComplete": function (mod: ModAttachr.IModAttachrMod, eventName: string, settings: IBattleInfo): void {
                        let grass: IGrass = this.player.grass,
                            grassMap: IMap = grass ? <IMap>this.AreaSpawner.getMap(grass.mapName) : undefined,
                            grassArea: IArea = grassMap ? <IArea>grassMap.areas[grass.areaName] : undefined,
                            opponent: String = settings.opponent.category;

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
                    "onOpenItemsMenu": function (mod: ModAttachr.IModAttachrMod, eventName: string, items: any[]): void {
                        let grassMap: IMap = this.player.grass && <IMap>this.AreaSpawner.getMap(this.player.grass.mapName),
                            grassArea: IArea = grassMap && <IArea>grassMap.areas[this.player.grass.areaName];

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
                    "onFaint": function (
                        mod: ModAttachr.IModAttachrMod,
                        eventName: string,
                        thing: BattleMovr.IActor,
                        actors: IPokemon[]): void {
                        let partyPokemon: BattleMovr.IActor[] = this.ItemsHolder.getItem("PokemonInParty"),
                            pcPokemon: BattleMovr.IActor[] = this.ItemsHolder.getItem("PokemonInPC");

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
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.checkPlayerGrassBattle = (): boolean => false;
                    },
                    /**
                     * Allows the Player to encounter wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        this.checkPlayerGrassBattle = FullScreenPokemon.prototype.checkPlayerGrassBattle;
                    }
                }
            },
            {
                name: "Repeat Trainers",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        return;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        return;
                    },
                    onDialogFinish: function (mod: ModAttachr.IModAttachrMod, eventName: string, other: IEnemy): void {
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
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        return;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
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
                        let opponent: IBattleThingInfo = battleInfo.opponent,
                            player: IBattleThingInfo = battleInfo.player,
                            statistics: string[] = this.MathDecider.getConstant("statisticNames"),
                            enemyPokemonAvg: number = this.MathDecider.compute("averageLevel", opponent.actors),
                            playerPokemonAvg: number = this.MathDecider.compute("averageLevel", player.actors);

                        for (let i: number = 0; i < opponent.actors.length; i += 1) {
                            opponent.actors[i].level += playerPokemonAvg - enemyPokemonAvg;

                            for (let j: number = 0; j < statistics.length; j += 1) {
                                opponent.actors[i][statistics[j]] = this.MathDecider.compute(
                                    "pokemonStatistic", opponent.actors[i], statistics[j]);
                            }
                        }
                    }
                }
            }]
    };
}
