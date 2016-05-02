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
                        var _this = this;
                        this.GroupHolder.groups.Character
                            .filter(function (character) { return character.trainer; })
                            .forEach(function (character) {
                            character.previousTitle = character.title;
                            character.title = character.thing = "BugCatcher";
                            _this.ThingHitter.cacheChecksForType(character, "Character");
                            _this.setClass(character, character.className);
                        });
                    },
                    onModDisable: function (mod) {
                        var _this = this;
                        this.GroupHolder.groups.Character
                            .filter(function (character) { return character.trainer; })
                            .forEach(function (character) {
                            character.title = character.thing = character.previousTitle;
                            _this.ThingHitter.cacheChecksForType(character, "Character");
                            _this.setClass(character, character.className);
                        });
                    },
                    onBattleStart: function (mod, eventName, battleInfo) {
                        var opponent = battleInfo.opponent;
                        opponent.sprite = "BugCatcherFront";
                        opponent.name = "YOUNGSTER JOEY".split("");
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
            },
            {
                name: "Walk Through Walls",
                enabled: false,
                events: {
                    onModEnable: function (mod) {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = function () { return true; };
                    },
                    onModDisable: function (mod) {
                        this.ObjectMaker.getFunction("Solid").prototype.collide = function () { return false; };
                    }
                }
            },
            {
                name: "Blind Trainers",
                enabled: false,
                events: {
                    "onModEnable": function (mod) {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = true;
                    },
                    "onModDisable": function (mod) {
                        this.ObjectMaker.getFunction("SightDetector").prototype.nocollide = false;
                    }
                }
            }]
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
