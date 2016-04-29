var FullScreenPokemon;
(function (FullScreenPokemon) {
    "use strict";
    FullScreenPokemon.FullScreenPokemon.settings.mods = {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: function (mod) {
                        var area = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }
                        area.allowCyclingOld = area.allowCycling;
                        area.allowCycling = true;
                    },
                    onModDisable: function (mod) {
                        var area = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }
                        area.allowCycling = area.allowCyclingOld;
                        delete area.allowCyclingOld;
                        if (!area.allowCycling && this.player.cycling) {
                            this.stopCycling(this.player);
                        }
                    },
                    onSetLocation: function (mod) {
                        mod.events.onModEnable.call(this, mod);
                    }
                }
            },
            {
                name: "Speedrunner",
                enabled: false,
                events: {
                    onModEnable: function (mod) {
                        var stats = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = 10;
                    },
                    onModDisable: function (mod) {
                        var stats = this.ObjectMaker.getFunction("Player").prototype;
                        this.player.speed = stats.speed = this.settings.objects.properties.Player.speed;
                    }
                }
            },
            {
                name: "Joey's Rattata",
                enabled: false,
                events: {
                    onModEnable: function (mod) {
                        var characters = this.GroupHolder.groups.Character;
                        for (var i = 0; i < characters.length; i += 1) {
                            if (characters[i].trainer) {
                                characters[i].previousTitle = characters[i].title;
                                characters[i].title = characters[i].thing = "BugCatcher";
                                this.ThingHitter.cacheChecksForType(characters[i].title, "Character");
                                this.setClass(characters[i], characters[i].className);
                            }
                        }
                    },
                    onModDisable: function (mod) {
                        var characters = this.GroupHolder.groups.Character;
                        for (var i = 0; i < characters.length; i += 1) {
                            if (characters[i].trainer) {
                                characters[i].title = characters[i].thing = characters[i].previousTitle;
                                this.ThingHitter.cacheChecksForType(characters[i].title, "Character");
                                this.setClass(characters[i], characters[i].className);
                            }
                        }
                    },
                    onBattleStart: function (mod, eventName, battleInfo) {
                        var opponent = battleInfo.opponent;
                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "Youngster Joey".split("");
                        for (var i = 0; i < opponent.actors.length; i += 1) {
                            opponent.actors[i].title = opponent.actors[i].nickname = "RATTATA".split("");
                        }
                    },
                    onSetLocation: function (mod) {
                        mod.events.onModEnable.call(this, mod);
                    }
                }
            },
            {
                name: "Level 100",
                enabled: false,
                events: {
                    "onModEnable": function (mod) {
                        var partyPokemon = this.ItemsHolder.getItem("PokemonInParty"), statistics = this.MathDecider.getConstant("statisticNames");
                        for (var i = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].previousLevel = partyPokemon[i].level;
                            partyPokemon[i].level = 100;
                            for (var j = 0; j < statistics.length; j += 1) {
                                partyPokemon[i][statistics[j]] = this.MathDecider.compute("pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    },
                    "onModDisable": function (mod) {
                        var partyPokemon = this.ItemsHolder.getItem("PokemonInParty"), statistics = this.MathDecider.getConstant("statisticNames");
                        for (var i = 0; i < partyPokemon.length; i += 1) {
                            partyPokemon[i].level = partyPokemon[i].previousLevel;
                            partyPokemon[i].previousLevel = undefined;
                            for (var j = 0; j < statistics.length; j += 1) {
                                partyPokemon[i][statistics[j]] = this.MathDecider.compute("pokemonStatistic", partyPokemon[i], statistics[j]);
                            }
                        }
                    }
                }
            }]
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
