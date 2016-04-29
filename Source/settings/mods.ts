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
                        let characters: any = this.GroupHolder.groups.Character;

                        for (let i: number = 0; i < characters.length; i += 1) {
                            if (characters[i].trainer) {
                                characters[i].previousTitle = characters[i].title;
                                characters[i].title = characters[i].thing = "BugCatcher";
                                this.ThingHitter.cacheChecksForType(characters[i].title, "Character");
                                this.setClass(characters[i], characters[i].className);
                            }
                        }
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        let characters: any = this.GroupHolder.groups.Character;

                        for (let i: number = 0; i < characters.length; i += 1) {
                            if (characters[i].trainer) {
                                characters[i].title = characters[i].thing = characters[i].previousTitle;
                                this.ThingHitter.cacheChecksForType(characters[i].title, "Character");
                                this.setClass(characters[i], characters[i].className);
                            }
                        }
                    },
                    onBattleStart: function (mod: ModAttachr.IModAttachrMod, eventName: string, battleInfo: IBattleInfo): void {
                        let opponent: IBattleThingInfo = battleInfo.opponent;

                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "Youngster Joey".split("");

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
            }]
    };
}
