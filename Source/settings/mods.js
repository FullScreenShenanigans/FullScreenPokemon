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
            },
            {
                name: "Nuzlocke Challenge",
                enabled: false,
                events: {
                    "onModEnable": function (mod) {
                        return;
                    },
                    "onModDisable": function (mod) {
                        return;
                    },
                    /**
                     * Sets the area's pokemonEncountered property to true if the encounter was with a wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     * @param eventName   The name of the event that was fired.
                     * @param settings   The battle information.
                     */
                    "onBattleComplete": function (mod, eventName, settings) {
                        var grass = this.player.grass, grassMap = grass ? this.AreaSpawner.getMap(grass.mapName) : undefined, grassArea = grassMap ? grassMap.areas[grass.areaName] : undefined, opponent = settings.opponent.category;
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
                    "onOpenItemsMenu": function (mod, eventName, items) {
                        var grassMap = this.player.grass && this.AreaSpawner.getMap(this.player.grass.mapName), grassArea = grassMap && grassMap.areas[this.player.grass.areaName];
                        if (!this.BattleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
                            return;
                        }
                        for (var i = items.length - 1; i > -1; i -= 1) {
                            var currentItem = this.MathDecider.getConstant("items")[items[i].item];
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
                    "onFaint": function (mod, eventName, thing, actors) {
                        var partyPokemon = this.ItemsHolder.getItem("PokemonInParty"), pcPokemon = this.ItemsHolder.getItem("PokemonInPC");
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
                    onModEnable: function (mod) {
                        this.checkPlayerGrassBattle = function () { return false; };
                    },
                    /**
                     * Allows the Player to encounter wild Pokemon.
                     *
                     * @param mod   The triggered mod.
                     */
                    onModDisable: function (mod) {
                        this.checkPlayerGrassBattle = FullScreenPokemon.FullScreenPokemon.prototype.checkPlayerGrassBattle;
                    }
                }
            },
            {
                name: "Repeat Trainers",
                enabled: false,
                events: {
                    onModEnable: function (mod) {
                        return;
                    },
                    onModDisable: function (mod) {
                        return;
                    },
                    onDialogFinish: function (mod, eventName, other) {
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
                    onModEnable: function (mod) {
                        return;
                    },
                    onModDisable: function (mod) {
                        return;
                    },
                    onBattleStart: function (mod, eventName, battleInfo) {
                        var opponent = battleInfo.opponent, player = battleInfo.player, statistics = this.MathDecider.getConstant("statisticNames"), enemyPokemonAvg = this.MathDecider.compute("averageLevels", opponent.actors), playerPokemonAvg = this.MathDecider.compute("averageLevels", player.actors);
                        for (var i = 0; i < opponent.actors.length; i += 1) {
                            var difference = opponent.actors[i].level - enemyPokemonAvg;
                            opponent.actors[i].level = playerPokemonAvg + difference;
                            for (var j = 0; j < statistics.length; j += 1) {
                                opponent.actors[i][statistics[j]] = this.MathDecider.compute("pokemonStatistic", opponent.actors[i], statistics[j]);
                            }
                        }
                    }
                }
            }]
    };
})(FullScreenPokemon || (FullScreenPokemon = {}));
