FullScreenPokemon.prototype.settings.math = {
    "equations": {
        "proliferate": EightBittr.prototype.proliferate,
        "newPokemon": function (NumberMaker, constants, equations, title, level, moves, iv, ev) {
            var statisticNames = constants.statisticNames,
                pokemon = {
                    "title": title,
                    "nickname": title.toUpperCase(),
                    "level": level,
                    "moves": moves || this.compute("newPokemonMoves", title, level),
                    "types": constants.pokemon[title].types,
                    "status": "",
                    "IV": iv || this.compute("newPokemonIVs"),
                    "EV": ev || this.compute("newPokemonEVs"),
                    "experience": this.compute("newPokemonExperience", title, level)
                },
                i;

            for (i = 0; i < statisticNames.length; i += 1) {
                pokemon[statisticNames[i]] = this.compute(
                    "pokemonStatistic", pokemon, statisticNames[i]
                );
                pokemon[statisticNames[i] + "Normal"] = pokemon[statisticNames[i]];
            }

            return pokemon;
        },
        // http://bulbapedia.bulbagarden.net/wiki/XXXXXXX_(Pok%C3%A9mon)/Generation_I_learnset
        "newPokemonMoves": function (NumberMaker, constants, equations, title, level) {
            var possibilities = constants.pokemon[title].moves.natural,
                output = [],
                move, moveInfo, newMove, end, i, j;

            for (end = 0; end < possibilities.length; end += 1) {
                if (possibilities[end].level > level) {
                    break;
                }
            }

            for (i = Math.max(end - 4, 0) ; i < end; i += 1) {
                move = possibilities[i];
                moveInfo = constants.moves[move.Move];
                newMove = {
                    "title": move.Move,
                    "remaining": moveInfo.PP
                };

                output.push(newMove);
            }

            return output;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Individual_values
        "newPokemonIVs": function (NumberMaker, constants, equations) {
            var attack = NumberMaker.randomIntWithin(0, 15),
                defense = NumberMaker.randomIntWithin(0, 15),
                speed = NumberMaker.randomIntWithin(0, 15),
                special = NumberMaker.randomIntWithin(0, 15),
                output = {
                    "Attack": attack,
                    "Defense": defense,
                    "Speed": speed,
                    "Special": special
                };

            output["HP"] = (
                8 * (attack % 2)
                + 4 * (defense % 2)
                + 2 * (speed % 2)
                + (special % 2)
            );

            return output;
        },
        "newPokemonEVs": function (NumberMaker, constants, equations) {
            return {
                "Attack": 0,
                "Defense": 0,
                "Speed": 0,
                "Special": 0
            }
        },
        "newPokemonExperience": function (NumberMaker, constants, equations, title, level) {
            var current = this.compute("experienceStarting", title, level),
                next = this.compute("experienceStarting", title, level + 1);

            return {
                "current": current,
                "next": next,
                "remaining": next - current
            };
        },
        // http://bulbapedia.bulbagarden.net/wiki/Individual_values
        // Note: the page mentions rounding errors... 
        "pokemonStatistic": function (NumberMaker, constants, equations, pokemon, statistic) {
            var topExtra = 0,
                added = 5,
                base = constants.pokemon[pokemon.title][statistic],
                iv = pokemon.IV[statistic] || 0,
                ev = pokemon.EV[statistic] || 0,
                level = pokemon.level,
                numerator;

            if (statistic === "HP") {
                topExtra = 50;
                added = 10;
            }

            numerator = (iv + base + (Math.sqrt(ev) / 8) + topExtra) * level;

            return (numerator / 50 + added) | 0;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Tall_grass
        "doesGrassEncounterHappen": function (NumberMaker, constants, equations, grass) {
            return NumberMaker.randomBooleanFraction(grass.rarity, 187.5);
        },
        // http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
        "canCatchPokemon": function (NumberMaker, constants, equations, pokemon, ball) {
            var n, m, f;

            // 1. If a Master Ball is used, the Pokemon is caught.
            if (ball.type === "Master") {
                return true;
            }

            // 2. Generate a random number, N, depending on the type of ball used.
            n = NumberMaker.randomInt(ball.probabilityMax);

            // 3. The Pokemon is caught if...
            if (pokemon.status) {
                // ... it is asleep or frozen and N is less than 25.
                if (n < 25) {
                    if (constants.statuses.probability25[pokemon.status]) {
                        return true;
                    }
                }
                    // ... it is paralyzed, burned, or poisoned and N is less than 12.
                else if (n < 12) {
                    if (constants.statuses.probability12[pokemon.status]) {
                        return true;
                    }
                }
            }

            // 4. Otherwise, if N minus the status value is greater than the Pokemon's catch rate, the Pokemon breaks free.
            if (n - constants.statuses.levels[pokemon.status] > pokemon.catchRate) {
                return false;
            }

            // 5. If not, generate a random value, M, between 0 and 255.
            m = NumberMaker.randomInt(255);

            // 6. Calculate f.
            f = Math.max(
                Math.min(
                    (pokemon.hpNormal * 255 * 4) | 0 / (pokemon.hpCurrent * ball.rate) | 0,
                    255
                ),
                1
            );

            // 7. If f is greater than or equal to M, the Pokemon is caught. Otherwise, the Pokemon breaks free.
            return f > m;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Escape#Generation_I_and_II
        "canEscapePokemon": function (NumberMaker, constants, equations, pokemon, enemy, battleInfo) {
            var a = pokemon.speed,
                b = (enemy.speed / 4) % 256,
                c = battleInfo.currentEscapeAttempts,
                f = NumberMaker.randomBooleanProbability((a * 32) / b + 30 * c);

            if (f > 255 || b === 0) {
                return true;
            }

            return NumberMaker.randomInt(256) < f;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
        "numBallShakes": function (NumberMaker, constants, equations, pokemon, ball) {
            // 1. Calculate d.
            var d = pokemon.rate * 100 / ball.rate,
                f, x;

            // 2. If d is greater than or equal to 256, the ball shakes three times before the Pokemon breaks free.
            if (d >= 256) {
                return 3;
            }

            // 3. If not, calculate x = d * f / 255 + s, where s is 10 if the Pokemon is asleep or frozen or 5 if it is paralyzed, poisoned, or burned.
            f = Math.max(
                Math.min(
                    (pokemon.hpNormal * 255 * 4) | 0 / (pokemon.hpCurrent * ball.rate) | 0,
                    255
                ),
                1
            );
            x = d * f / 255 + constants.statuses.shaking[pokemon.status];

            // 4. If... 
            // x < 10: the Ball misses the Pokemon completely.
            if (x < 10) {
                return 0;
            }
                // x < 30: the Ball shakes once before the Pokemon breaks free.
            else if (x < 30) {
                return 1;
            }
                // x < 70: the Ball shakes twice before the Pokemon breaks free.
            else if (x < 70) {
                return 2;
            }
                // Otherwise, the Ball shakes three times before the Pokemon breaks free.
            else {
                return 3;
            }
        },
        // http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
        // TO DO: Also filter for moves with > 0 remaining remaining...
        "opponentMove": function (NumberMaker, constants, equations, player, opponent) {
            var possibilities = opponent.selectedActor.moves.map(function (move) {
                    return {
                        "move": move.title,
                        "priority": 10
                    };
                }),
                move, lowest, i;

            // Wild Pokemon just choose randomly
            if (opponent.category === "Wild") {
                return NumberMaker.randomArrayMember(possibilities).move;
            }

            // Modification 1: Do not use a move that only statuses (e.g. Thunder Wave) if the player's pokémon already has a status.
            if (player.selectedActor.status && !opponent.dumb) {
                for (i = 0; i < possibilities.length; i += 1) {
                    if (equations.moveOnlyStatuses(possibilities[i].move)) {
                        possibilities[i].priority += 5;
                    }
                }
            }

            // Modification 2: On the second turn the pokémon is out, prefer a move with one of the following effects...
            if (
                equations.opponentMatchesTypes(
                    opponent,
                    constants.battleModifications["Turn 2"]
                )
            ) {
                for (i = 0; i < possibilities.length; i += 1) {
                    equations.applyMoveEffectPrority(
                        possibilities[i],
                        constants.battleModifications["Turn 2"],
                        player.selectedActor,
                        1
                    );
                }
            }

            // Modification 3 (Good AI): Prefer a move that is super effective. Do not use moves that are not very effective as long as there is an alternative.
            if (
                equations.opponentMatchesTypes(
                    opponent,
                    constants.battleModifications["Good AI"]
                )
            ) {
                for (i = 0; i < possibilities.length; i += 1) {
                    equations.applyMoveEffectPrority(
                        possibilities[i],
                        constants.battleModifications["Good AI"],
                        player.selectedActor,
                        1
                    );
                }
            }

            // The AI uses rejection sampling on the four moves with ratio 63:64:63:66, with only the moves that are most favored after applying the modifications being acceptable.
            lowest = possibilities[0].priority;
            if (possibilities.length > 1) {
                for (i = 1; i < possibilities.length; i += 1) {
                    if (possibilities[i].priority < lowest) {
                        lowest = possibilities[i].priority;
                    }
                }
                possibilities = possibilities.filter(function (possibility) {
                    return possibility.priority === lowest;
                });
            }

            return NumberMaker.randomArrayMember(possibilities).move;
        },
        "opponentMatchesTypes": function (NumberMaker, constants, equations, opponent, types) {
            for (var i = 0; i < types.length; i += 1) {
                if (opponent[types[i]]) {
                    return true;
                }
            }

            return false;
        },
        "moveOnlyStatuses": function (NumberMaker, constants, equations, move) {
            return move.Damage === "Non-Damaging" && move.Effect === "Status";
        },
        "applyMoveEffectPrority": function (NumberMaker, constants, equations, possibility, modifications, target, amount) {
            var preferences = modifications.preferences,
                move = constants.moves[possibility.move],
                preference, i;

            for (i = 0; i < preferences.length; i += 1) {
                preference = preferences[i];

                switch (preference[0]) {
                    // ["Move", String]
                    // Favorable match
                    case "Move":
                        if (possibility.move === preference[1]) {
                            possibility.priority -= amount;
                            return;
                        }

                        // ["Raise", String, Number]
                        // Favorable match
                    case "Raise":
                        if (
                            move.Effect === "Raise"
                            && move.Raise === preference[1]
                            && move.Amount === preference[2]
                        ) {
                            possibility.priority -= amount;
                            return;
                        }

                        // ["Lower", String, Number]
                        // Favorable match
                    case "Lower":
                        if (
                            move.Effect === "Lower"
                            && move.Lower === preference[1]
                            && move.Amount === preference[2]
                        ) {
                            possibility.priority -= amount;
                            return;
                        }

                        // ["Super", String, String]
                        // Favorable match
                    case "Super":
                        if (
                            move.Damage !== "Non-Damaging"
                            && move.Type === preference[0]
                            && target.types.indexOf(preference[1] !== -1)
                        ) {
                            possibility.priority -= amount;
                            return;
                        }

                        // ["Weak", String, String]
                        // Unfavorable match
                    case "Weak":
                        if (
                            move.Damage !== "Non-Damaging"
                            && move.Type === preference[0]
                            && target.types.indexOf(preference[1] !== -1)
                        ) {
                            possibility.priority += amount;
                            return;
                        }
                }
            }
        },
        // http://bulbapedia.bulbagarden.net/wiki/Priority
        // TO DO: Account for items, switching, etc.
        // TO DO: Factor in spec differences from paralyze, etc.
        "playerMovesFirst": function (NumberMaker, constants, equations, player, choicePlayer, opponent, choiceOpponent) {
            var movePlayer = constants.moves[choicePlayer],
                moveOpponent = constants.moves[choiceOpponent];

            if (movePlayer.Priority === moveOpponent.Priority) {
                return player.selectedActor.Speed > opponent.selectedActor.Speed;
            }

            return movePlayer.Priority > moveOpponent.Priority;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
        // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
        // TO DO: Factor in spec differences from burns, etc.
        "damage": function (NumberMaker, constants, equations, move, attacker, defender) {
            var critical = this.compute("criticalHit", move, attacker),
                level = attacker.level * critical,
                attack = attacker.Attack,
                defense = defender.Defense,
                base = constants.moves[move].Power,
                modifier = this.compute("damageModifier", move, critical, attacker, defender);

            return Math.round(
                Math.max(
                    ((((2 * level + 10) / 250) * (attack / defense) * base + 2) | 0) * modifier,
                    1
                )
            );
        },
        // http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
        // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
        "damageModifier": function (NumberMaker, constants, equations, move, critical, attacker, defender) {
            var stab = attacker.types.indexOf(move.Type) !== -1 ? 1.5 : 1,
                type = this.compute("typeEffectiveness", move, defender);

            return stab * type * NumberMaker.randomWithin(.85, 1);
        },
        // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
        "criticalHit": function (NumberMaker, constants, equations, move, attacker) {
            var moveInfo = constants.moves[move],
                baseSpeed = constants.pokemon[attacker.title].Speed,
                denominator = 512;

            // Moves with a high critical-hit ratio, such as Slash, are eight times more likely to land a critical hit, resulting in a probability of BaseSpeed / 64.
            if (moveInfo.CriticalRaised) {
                denominator /= 8;
            }

            // "Focus Energy and Dire Hit were intended to increase the critical hit rate, ..."
            // In FullScreenPokemon, they work as intended! Fans who prefer the
            // original behavior are free to fork the repo. As the original
            // behavior is a glitch (and conflicts with creators' intentions),
            // it is not duplicated here.
            if (attacker.CriticalHitProbability) {
                denominator /= 4;
            }

            // As with move accuracy in the handheld games, if the probability of landing a critical hit would be 100%, it instead becomes 255/256 or about 99.6%.
            return NumberMaker.randomBooleanProbability(
                Math.max(baseSpeed / denominator, 255 / 256)
            ) | 0;
        },
        // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
        "typeEffectiveness": function (NumberMaker, constants, equations, move, defender) {
            var defenderTypes = constants.pokemon[defender.title].types,
                moveType = constants.moves[move].Type,
                moveIndex = constants.types.indices[constants.moves[move].Type],
                total = 1,
                i;

            for (i = 0; i < defenderTypes.length; i += 1) {
                total *= constants.types.table[moveIndex][constants.types.indices[defenderTypes[i]]];
            }

            return total;
        },
        // http://m.bulbapedia.bulbagarden.net/wiki/Experience#Relation_to_level
        // Wild Pokémon of any level will always have the base amount of experience required to reach that level when caught, as will Pokémon hatched from Eggs.
        "experienceStarting": function (NumberMaker, constants, equations, title, level) {
            var reference = constants.pokemon[title];

            // TODO: remove defaulting to mediumFast
            switch (reference.experienceType || "mediumFast") {
                case "fast":
                    return (4 * Math.pow(level, 3)) / 5;
                case "mediumFast":
                    return Math.pow(level, 3);
                case "mediumSlow":
                    return (
                        (6 / 5) * Math.pow(level, 3)
                        - (15 * Math.pow(level, 2))
                        + (100 * level)
                        - 140
                    );
                case "slow":
                    return (5 * Math.pow(level, 3)) / 4;
            }
        },
        // http://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
        "experienceGained": function (NumberMaker, constants, equations, player, opponent) {
            var a, b, lf, s, t;

            // a is equal to 1 if the fainted Pokemon is wild, or 1.5 if the fainted Pokemon is owned by a Trainer
            a = opponent.category === "Trainer" ? 1.5 : 1;

            // b is the base experience yield of the fainted Pokemon's species
            b = 64; // (Bulbasaur) TO DO: add this in

            // lf is the level of the fainted Pokemon
            lf = opponent.selectedActor.level;

            // s is equal to (in Gen I), if Exp. All is not in the player's Bag...
            // TO DO: Account for modifies like Exp. All
            s = 1;

            // t is equal to 1 if the winning Pokemon's curent owner is its OT, or 1.5 if the Pokemon was gained in a domestic trade
            if (player.selectedActor.traded) {
                t = 1.5;
            } else {
                t = 1;
            }

            return (((a * t * b * lf) | 0) / ((7 * s) | 0)) | 0;
        },
        "widthHealthBar": function (NumberMaker, constants, equations, widthFullBar, hp, hpNormal) {
            return (widthFullBar - 1) * hp / hpNormal;
        },
    },
    "constants": {
        "statuses": {
            "names": ["Sleep", "Freeze", "Paralyze", "Burn", "Poison"],
            "probability25": {
                "Sleep": true,
                "Freeze": true
            },
            "probability12": {
                "Paralyze": true,
                "Burn": true,
                "Poison": true
            },
            // where to get?
            "levels": {
                "Normal": -1,
                "Sleep": -1,
                "Freeze": -1,
                "Paralyze": -1,
                "Burn": -1,
                "Poison": -1
            },
            "shaking": {
                "Normal": 0,
                "Sleep": 10,
                "Freeze": 10,
                "Paralyze": 5,
                "Burn": 5,
                "Poison": 5
            }
        },
        /**
         * Run on http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
         * 
         * console.clear();
         * 
         * var table = $($("table")[2]),
         *     names = table.find("tr:nth-of-type(2) a")
         *         .toArray()
         *         .map(function (a) {
         *             return a.getAttribute("title"); 
         *         }),
         *     chart = table.find("tr:nth-of-type(2) ~ tr"),
         *     table = [],
         *     indices = {},
         *     values = {
         *         "0×": 0.0,
         *         "½×": .5,
         *         "1×": 1.0,
         *         "2×": 2.0
         *     },
         *     output = { 
         *         "names": names, 
         *         "table": table
         *     },
         *     row, i, j;
         * 
         * for (i = 0; i < names.length; i += 1) {
         *     indices[names[i]] = i;
         * }
         * 
         * for (i = 0; i < chart.length - 1; i += 1) {
         *     row = chart[i];
         *     table.push([]);
         *     for (j = 0; j < row.cells.length - 1; j += 1) {
         *         table[i].push(values[row.cells[j + 1].innerText])
         *     }
         * }
         * 
         * table[0].shift();
         * 
         * JSON.stringify(output);
         */
        "types": {
            "names": ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"],
            "indices": {
                "Normal": 0,
                "Fighting": 1,
                "Flying": 2,
                "Poison": 3,
                "Ground": 4,
                "Rock": 5,
                "Bug": 6,
                "Ghost": 7,
                "Fire": 8,
                "Water": 9,
                "Grass": 10,
                "Electric": 11,
                "Psychic": 12,
                "Ice": 13,
                "Dragon": 14
            },
            "table": [
                [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
                [2.0, 1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0],
                [1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 0.0, 2.0, 1.0, 2.0, 0.5, 1.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0],
                [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0],
                [1.0, 0.5, 0.5, 2.0, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0],
                [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 0.5, 0.5, 2.0, 1.0, 1.0, 2.0, 0.5],
                [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5],
                [1.0, 1.0, 0.5, 0.5, 2.0, 2.0, 0.5, 1.0, 0.5, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5],
                [1.0, 1.0, 2.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 0.5],
                [1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0],
                [1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 2.0],
                [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0]
            ]
        },
        /**
         * Run on http://www.smogon.com/dex/rb/pokemon/
         * 
         * var output = {};
         * 
         * Array.prototype.slice.call(document.querySelectorAll("tr")).forEach(function (row) {
         *     output[row.children[0].innerText.trim()] = {
         *         "types": row.children[1].innerText
         *             .split(/\s+/g)
         *             .filter(function (str) { 
         *                 return str; 
         *             })
         *             .map(function (str) { 
         *                 return str.trim();
         *             }),
         *         "HP": Number(row.children[5].innerText.split(/\s+/g)[1]),
         *         "Attack": Number(row.children[6].innerText.split(/\s+/g)[1]),
         *         "Defense": Number(row.children[7].innerText.split(/\s+/g)[1]),
         *         "Special": Number(row.children[8].innerText.split(/\s+/g)[1]),
         *         "Speed": Number(row.children[10].innerText.split(/\s+/g)[1]),
         *     };
         * });
         * 
         * JSON.stringify(output);
         */
        "pokemon": {
            "Abra": {
                "label": "Psi",
                "sprite": "Water",
                "info": [
                    "Using its ability to read minds, it will identify impending danger and TELEPORT to safety."
                ],
                "evolvesInto": "Kadabra",
                "evolvesVia": "Level 16",
                "number": 63,
                "height": ["2", "11"],
                "weight": 43,
                "types": ["Psychic"],
                "HP": 25,
                "Attack": 20,
                "Defense": 15,
                "Special": 105,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Teleport",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Aerodactyl": {
                "label": "Fossil",
                "sprite": "Water",
                "info": [
                    "A ferocious, prehistoric %%%%%%%POKEMON%%%%%%% that goes for the enemy's throat with its serrated saw-like fangs."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 142,
                "height": ["5", "11"],
                "weight": 130.1,
                "types": ["Rock", "Flying"],
                "HP": 80,
                "Attack": 105,
                "Defense": 65,
                "Special": 60,
                "Speed": 130,
                "moves": {
                    "natural": [{
                        "Move": "Agility",
                        "level": 1
                    }, {
                        "Move": "Wing Attack",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 33
                    }, {
                        "Move": "Bite",
                        "level": 38
                    }, {
                        "Move": "Take Down",
                        "level": 45
                    }, {
                        "Move": "Hyper Beam",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Alakazam": {
                "label": "Psi",
                "sprite": "Water",
                "info": [
                    "Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5,000."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 65,
                "height": ["4", "11"],
                "weight": 105.8,
                "types": ["Psychic"],
                "HP": 55,
                "Attack": 50,
                "Defense": 45,
                "Special": 135,
                "Speed": 120,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Teleport",
                        "level": 1
                    }, {
                        "Move": "Confusion",
                        "level": 16
                    }, {
                        "Move": "Disable",
                        "level": 20
                    }, {
                        "Move": "Psybeam",
                        "level": 27
                    }, {
                        "Move": "Recover",
                        "level": 31
                    }, {
                        "Move": "Psychic",
                        "level": 38
                    }, {
                        "Move": "Reflect",
                        "level": 42
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Arbok": {
                "label": "Cobra",
                "sprite": "Water",
                "info": [
                    "It is rumored that the ferocious warning markings on its belly differ from area to area."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 24,
                "height": ["11", "6"],
                "weight": 143.3,
                "types": ["Poison"],
                "HP": 60,
                "Attack": 85,
                "Defense": 69,
                "Special": 65,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Poison Sting",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Poison Sting",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 17
                    }, {
                        "Move": "Glare",
                        "level": 27
                    }, {
                        "Move": "Screech",
                        "level": 36
                    }, {
                        "Move": "Acid",
                        "level": 47
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Arcanine": {
                "label": "Legendary",
                "sprite": "Water",
                "info": [
                    "A %%%%%%%POKEMON%%%%%%% that has been admired since the past for its beauty. It runs agilely as if on wings."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 59,
                "height": ["6", "3"],
                "weight": 341.7,
                "types": ["Fire"],
                "HP": 90,
                "Attack": 110,
                "Defense": 80,
                "Special": 100,
                "Speed": 95,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Roar",
                        "level": 1
                    }, {
                        "Move": "Take Down",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Articuno": {
                "label": "Freeze",
                "sprite": "Water",
                "info": [
                    "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear to doomed people who are lost in icy mountains."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 144,
                "height": ["5", "7"],
                "weight": 122.1,
                "types": ["Ice", "Flying"],
                "HP": 90,
                "Attack": 85,
                "Defense": 100,
                "Special": 95,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Ice Beam",
                        "level": 1
                    }, {
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Blizzard",
                        "level": 51
                    }, {
                        "Move": "Agility",
                        "level": 55
                    }, {
                        "Move": "Mist",
                        "level": 60
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Beedrill": {
                "label": "Poison Bee",
                "sprite": "Water",
                "info": [
                    "Flies at high speed and attacks using its large venomous stingers on its forelegs and tail."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 15,
                "height": ["3", "3"],
                "weight": 65,
                "types": ["Bug", "Poison"],
                "HP": 65,
                "Attack": 90,
                "Defense": 40,
                "Special": 45,
                "Speed": 75,
                "moves": {
                    "natural": [{
                        "Move": "Fury Attack",
                        "level": 1
                    }, {
                        "Move": "Fury Attack",
                        "level": 12
                    }, {
                        "Move": "Focus Energy",
                        "level": 16
                    }, {
                        "Move": "Twineedle",
                        "level": 20
                    }, {
                        "Move": "Rage",
                        "level": 25
                    }, {
                        "Move": "Pin Missile",
                        "level": 30
                    }, {
                        "Move": "Agility",
                        "level": 35
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Cut",
                        "level": 1
                    }]
                }
            }, "Bellsprout": {
                "label": "Flower",
                "sprite": "Water",
                "info": [
                    "A carnivorous %%%%%%%POKEMON%%%%%%% that traps and eats bugs. It uses its root feet to soak up needed moisture."
                ],
                "evolvesInto": "Weepinbell",
                "evolvesVia": "Level 21",
                "number": 69,
                "height": ["2", "4"],
                "weight": 8.8,
                "types": ["Grass", "Poison"],
                "HP": 50,
                "Attack": 75,
                "Defense": 35,
                "Special": 70,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Growth",
                        "level": 1
                    }, {
                        "Move": "Vine Whip",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Sleep Powder",
                        "level": 18
                    }, {
                        "Move": "Stun Spore",
                        "level": 21
                    }, {
                        "Move": "Acid",
                        "level": 26
                    }, {
                        "Move": "Razor Leaf",
                        "level": 33
                    }, {
                        "Move": "Slam",
                        "level": 42
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Blastoise": {
                "label": "Shellfish",
                "sprite": "Water",
                "info": [
                    "A brutal %%%%%%%POKEMON%%%%%%% with pressurized water jets on its shell. They are used for high speed tackles."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 9,
                "height": ["5", "3"],
                "weight": 188.5,
                "types": ["Water"],
                "HP": 79,
                "Attack": 83,
                "Defense": 100,
                "Special": 85,
                "Speed": 78,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Bubble",
                        "level": 8
                    }, {
                        "Move": "Water Gun",
                        "level": 15
                    }, {
                        "Move": "Bite",
                        "level": 24
                    }, {
                        "Move": "Withdraw",
                        "level": 31
                    }, {
                        "Move": "Skull Bash",
                        "level": 42
                    }, {
                        "Move": "Hydro Pump",
                        "level": 52
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Bulbasaur": {
                "label": "Seed",
                "sprite": "Water",
                "info": [
                    "A strange seed was planted on its back at birth. The plant sprouts and grows with this %%%%%%%POKEMON%%%%%%%."
                ],
                "evolvesInto": "Ivysaur",
                "evolvesVia": "Level 16",
                "number": 1,
                "height": ["2", "4"],
                "weight": 15.2,
                "types": ["Grass", "Poison"],
                "HP": 45,
                "Attack": 49,
                "Defense": 49,
                "Special": 65,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Leech Seed",
                        "level": 7
                    }, {
                        "Move": "Vine Whip",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 20
                    }, {
                        "Move": "Razor Leaf",
                        "level": 27
                    }, {
                        "Move": "Growth",
                        "level": 34
                    }, {
                        "Move": "Sleep Powder",
                        "level": 41
                    }, {
                        "Move": "Solar Beam",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Butterfree": {
                "label": "Butterfly",
                "sprite": "Water",
                "info": [
                    "In battle, it flaps its wings at high speed to release highly toxic dust into the air."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 12,
                "height": ["3", "7"],
                "weight": 70.5,
                "types": ["Bug", "Flying"],
                "HP": 60,
                "Attack": 45,
                "Defense": 50,
                "Special": 90,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Confusion",
                        "level": 12
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Stun Spore",
                        "level": 16
                    }, {
                        "Move": "Sleep Powder",
                        "level": 17
                    }, {
                        "Move": "Supersonic",
                        "level": 21
                    }, {
                        "Move": "Whirlwind",
                        "level": 26
                    }, {
                        "Move": "Psybeam",
                        "level": 32
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Caterpie": {
                "label": "Worm",
                "sprite": "Water",
                "info": [
                    "Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls."
                ],
                "evolvesInto": "Metapod",
                "evolvesVia": "Level 7",
                "number": 10,
                "height": ["1", "0"],
                "weight": 6.4,
                "types": ["Bug"],
                "HP": 45,
                "Attack": 30,
                "Defense": 35,
                "Special": 20,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "String Shot",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": []
                }
            }, "Chansey": {
                "label": "Egg",
                "sprite": "Water",
                "info": [
                    "A rare and elusive %%%%%%%POKEMON%%%%%%% that is said to bring happiness to those who manage to get it."
                ],
                "evolvesInto": "Blissey",
                "evolvesVia": "Happiness",
                "number": 113,
                "height": ["3", "7"],
                "weight": 76.3,
                "types": ["Normal"],
                "HP": 250,
                "Attack": 5,
                "Defense": 5,
                "Special": 35,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Double Slap",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Sing",
                        "level": 24
                    }, {
                        "Move": "Growl",
                        "level": 30
                    }, {
                        "Move": "Minimize",
                        "level": 38
                    }, {
                        "Move": "Defense Curl",
                        "level": 44
                    }, {
                        "Move": "Light Screen",
                        "level": 48
                    }, {
                        "Move": "Double-Edge",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Egg Bomb",
                        "level": 37
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Soft-Boiled",
                        "level": 41
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Charizard": {
                "label": "Flame",
                "sprite": "Water",
                "info": [
                    "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 6,
                "height": ["5", "7"],
                "weight": 199.5,
                "types": ["Fire", "Flying"],
                "HP": 78,
                "Attack": 84,
                "Defense": 78,
                "Special": 109,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Ember",
                        "level": 9
                    }, {
                        "Move": "Leer",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 36
                    }, {
                        "Move": "Flamethrower",
                        "level": 46
                    }, {
                        "Move": "Fire Spin",
                        "level": 55
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Charmander": {
                "label": "Lizard",
                "sprite": "Water",
                "info": [
                    "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail."
                ],
                "evolvesInto": "Charmeleon",
                "evolvesVia": "Level 16",
                "number": 4,
                "height": ["2", "0"],
                "weight": 18.7,
                "types": ["Fire"],
                "HP": 39,
                "Attack": 52,
                "Defense": 43,
                "Special": 60,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Ember",
                        "level": 9
                    }, {
                        "Move": "Leer",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 22
                    }, {
                        "Move": "Slash",
                        "level": 30
                    }, {
                        "Move": "Flamethrower",
                        "level": 38
                    }, {
                        "Move": "Fire Spin",
                        "level": 46
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Charmeleon": {
                "label": "Flame",
                "sprite": "Water",
                "info": [
                    "When it swings its burning tail, it elevates the temperature to unbearably high levels."
                ],
                "evolvesInto": "Charizard",
                "evolvesVia": "Level 36",
                "number": 5,
                "height": ["3", "7"],
                "weight": 41.9,
                "types": ["Fire"],
                "HP": 58,
                "Attack": 64,
                "Defense": 58,
                "Special": 80,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Ember",
                        "level": 9
                    }, {
                        "Move": "Leer",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 33
                    }, {
                        "Move": "Flamethrower",
                        "level": 42
                    }, {
                        "Move": "Fire Spin",
                        "level": 56
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Clefable": {
                "label": "Fairy",
                "sprite": "Water",
                "info": [
                    "A timid fairy %%%%%%%POKEMON%%%%%%% that is rarely seen. It will run and hide the moment it senses people."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 36,
                "height": ["4", "3"],
                "weight": 88.2,
                "types": ["Fairy"],
                "HP": 95,
                "Attack": 70,
                "Defense": 73,
                "Special": 95,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Double Slap",
                        "level": 1
                    }, {
                        "Move": "Metronome",
                        "level": 1
                    }, {
                        "Move": "Minimize",
                        "level": 1
                    }, {
                        "Move": "Sing",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }]
                }
            }, "Clefairy": {
                "label": "Fairy",
                "sprite": "Water",
                "info": [
                    "Its magical and cute appeal has many admirers. It is rare and found only in certain areas."
                ],
                "evolvesInto": "Clefable",
                "evolvesVia": "use Moon Stone",
                "number": 35,
                "height": ["2", "0"],
                "weight": 16.5,
                "types": ["Fairy"],
                "HP": 70,
                "Attack": 45,
                "Defense": 48,
                "Special": 60,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Sing",
                        "level": 13
                    }, {
                        "Move": "Double Slap",
                        "level": 18
                    }, {
                        "Move": "Minimize",
                        "level": 24
                    }, {
                        "Move": "Metronome",
                        "level": 31
                    }, {
                        "Move": "Defense Curl",
                        "level": 39
                    }, {
                        "Move": "Light Screen",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Cloyster": {
                "label": "Bivalve",
                "sprite": "Water",
                "info": [
                    "When attacked, it launches its horns in quick volleys. Its innards have never been seen."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 91,
                "height": ["4", "11"],
                "weight": 292.1,
                "types": ["Water", "Ice"],
                "HP": 50,
                "Attack": 95,
                "Defense": 180,
                "Special": 85,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Aurora Beam",
                        "level": 1
                    }, {
                        "Move": "Clamp",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 1
                    }, {
                        "Move": "Withdraw",
                        "level": 1
                    }, {
                        "Move": "Spike Cannon",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }]
                }
            }, "Cubone": {
                "label": "Lonely",
                "sprite": "Water",
                "info": [
                    "Because it never removes its skull helmet, no one has ever seen this %%%%%%%POKEMON%%%%%%%'s real face."
                ],
                "evolvesInto": "Marowak",
                "evolvesVia": "Level 28",
                "number": 104,
                "height": ["1", "4"],
                "weight": 14.3,
                "types": ["Ground"],
                "HP": 50,
                "Attack": 50,
                "Defense": 95,
                "Special": 40,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Bone Club",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 25
                    }, {
                        "Move": "Focus Energy",
                        "level": 31
                    }, {
                        "Move": "Thrash",
                        "level": 38
                    }, {
                        "Move": "Bonemerang",
                        "level": 43
                    }, {
                        "Move": "Rage",
                        "level": 46
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Dewgong": {
                "label": "Sea Lion",
                "sprite": "Water",
                "info": [
                    "Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 87,
                "height": ["5", "7"],
                "weight": 264.6,
                "types": ["Water", "Ice"],
                "HP": 90,
                "Attack": 70,
                "Defense": 80,
                "Special": 70,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Aurora Beam",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Headbutt",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 30
                    }, {
                        "Move": "Aurora Beam",
                        "level": 35
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Take Down",
                        "level": 50
                    }, {
                        "Move": "Ice Beam",
                        "level": 56
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Diglett": {
                "label": "Mole",
                "sprite": "Water",
                "info": [
                    "Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground."
                ],
                "evolvesInto": "Dugtrio",
                "evolvesVia": "Level 26",
                "number": 50,
                "height": ["0", "8"],
                "weight": 1.8,
                "types": ["Ground"],
                "HP": 10,
                "Attack": 55,
                "Defense": 25,
                "Special": 35,
                "Speed": 95,
                "moves": {
                    "natural": [{
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 15
                    }, {
                        "Move": "Dig",
                        "level": 19
                    }, {
                        "Move": "Sand Attack",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 31
                    }, {
                        "Move": "Earthquake",
                        "level": 40
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 15
                    }, {
                        "Move": "Dig",
                        "level": 19
                    }, {
                        "Move": "Sand Attack",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 31
                    }, {
                        "Move": "Earthquake",
                        "level": 40
                    }]
                }
            }, "Ditto": {
                "label": "Transform",
                "sprite": "Water",
                "info": [
                    "Capable of copying an enemy's genetic code to instantly transform itself into a duplicate of the enemy."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 132,
                "height": ["1", "0"],
                "weight": 8.8,
                "types": ["Normal"],
                "HP": 48,
                "Attack": 48,
                "Defense": 48,
                "Special": 48,
                "Speed": 48,
                "moves": {
                    "natural": [{
                        "Move": "Transform",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": []
                }
            }, "Dodrio": {
                "label": "Triple Bird",
                "sprite": "Water",
                "info": [
                    "Uses its three brains to execute complex plans. While two heads sleep, one head stays awake."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 85,
                "height": ["5", "11"],
                "weight": 187.8,
                "types": ["Normal", "Flying"],
                "HP": 60,
                "Attack": 110,
                "Defense": 70,
                "Special": 60,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Fury Attack",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 20
                    }, {
                        "Move": "Fury Attack",
                        "level": 24
                    }, {
                        "Move": "Drill Peck",
                        "level": 30
                    }, {
                        "Move": "Rage",
                        "level": 39
                    }, {
                        "Move": "Tri Attack",
                        "level": 45
                    }, {
                        "Move": "Agility",
                        "level": 51
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Doduo": {
                "label": "Twin Bird",
                "sprite": "Water",
                "info": [
                    "A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints."
                ],
                "evolvesInto": "Dodrio",
                "evolvesVia": "Level 31",
                "number": 84,
                "height": ["4", "7"],
                "weight": 86.4,
                "types": ["Normal", "Flying"],
                "HP": 35,
                "Attack": 85,
                "Defense": 45,
                "Special": 35,
                "Speed": 75,
                "moves": {
                    "natural": [{
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 20
                    }, {
                        "Move": "Fury Attack",
                        "level": 24
                    }, {
                        "Move": "Drill Peck",
                        "level": 30
                    }, {
                        "Move": "Rage",
                        "level": 36
                    }, {
                        "Move": "Tri Attack",
                        "level": 40
                    }, {
                        "Move": "Agility",
                        "level": 44
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Dragonair": {
                "label": "Dragon",
                "sprite": "Water",
                "info": [
                    "A mystical %%%%%%%POKEMON%%%%%%% that exudes a gentle aura. Has the ability to change climate conditions."
                ],
                "evolvesInto": "Dragonite",
                "evolvesVia": "Level 55",
                "number": 148,
                "height": ["13", "1"],
                "weight": 36.4,
                "types": ["Dragon"],
                "HP": 61,
                "Attack": 84,
                "Defense": 65,
                "Special": 70,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 10
                    }, {
                        "Move": "Agility",
                        "level": 20
                    }, {
                        "Move": "Slam",
                        "level": 35
                    }, {
                        "Move": "Dragon Rage",
                        "level": 45
                    }, {
                        "Move": "Hyper Beam",
                        "level": 55
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Dragonite": {
                "label": "Dragon",
                "sprite": "Water",
                "info": [
                    "An extremely rarely seen marine %%%%%%%POKEMON%%%%%%%. Its intelligence is said to match that of humans."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 149,
                "height": ["7", "3"],
                "weight": 463,
                "types": ["Dragon", "Flying"],
                "HP": 91,
                "Attack": 134,
                "Defense": 95,
                "Special": 100,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Agility",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 10
                    }, {
                        "Move": "Agility",
                        "level": 20
                    }, {
                        "Move": "Slam",
                        "level": 35
                    }, {
                        "Move": "Dragon Rage",
                        "level": 45
                    }, {
                        "Move": "Hyper Beam",
                        "level": 60
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Dratini": {
                "label": "Dragon",
                "sprite": "Water",
                "info": [
                    "Long considered a mythical %%%%%%%POKEMON%%%%%%% until recently when a small colony was found living underwater."
                ],
                "evolvesInto": "Dragonair",
                "evolvesVia": "Level 30",
                "number": 147,
                "height": ["5", "11"],
                "weight": 7.3,
                "types": ["Dragon"],
                "HP": 41,
                "Attack": 64,
                "Defense": 45,
                "Special": 50,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 10
                    }, {
                        "Move": "Agility",
                        "level": 20
                    }, {
                        "Move": "Slam",
                        "level": 30
                    }, {
                        "Move": "Dragon Rage",
                        "level": 40
                    }, {
                        "Move": "Hyper Beam",
                        "level": 50
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Drowzee": {
                "label": "Hypnosis",
                "sprite": "Water",
                "info": [
                    "Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams."
                ],
                "evolvesInto": "Hypno",
                "evolvesVia": "Level 26",
                "number": 96,
                "height": ["3", "3"],
                "weight": 71.4,
                "types": ["Psychic"],
                "HP": 60,
                "Attack": 48,
                "Defense": 45,
                "Special": 43,
                "Speed": 42,
                "moves": {
                    "natural": [{
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 12
                    }, {
                        "Move": "Confusion",
                        "level": 17
                    }, {
                        "Move": "Headbutt",
                        "level": 24
                    }, {
                        "Move": "Poison Gas",
                        "level": 29
                    }, {
                        "Move": "Psychic",
                        "level": 32
                    }, {
                        "Move": "Meditate",
                        "level": 37
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Dream Eater",
                        "level": 42
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Dugtrio": {
                "label": "Mole",
                "sprite": "Water",
                "info": [
                    "A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 51,
                "height": ["2", "4"],
                "weight": 73.4,
                "types": ["Ground"],
                "HP": 35,
                "Attack": 80,
                "Defense": 50,
                "Special": 50,
                "Speed": 120,
                "moves": {
                    "natural": [{
                        "Move": "Dig",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 15
                    }, {
                        "Move": "Dig",
                        "level": 19
                    }, {
                        "Move": "Sand Attack",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 35
                    }, {
                        "Move": "Earthquake",
                        "level": 47
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Dig",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 15
                    }, {
                        "Move": "Dig",
                        "level": 19
                    }, {
                        "Move": "Sand Attack",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 35
                    }, {
                        "Move": "Earthquake",
                        "level": 47
                    }]
                }
            }, "Eevee": {
                "label": "Evolution",
                "sprite": "Water",
                "info": [
                    "Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs."
                ],
                "evolvesInto": "Espeon",
                "evolvesVia": "↗",
                "number": 133,
                "height": ["1", "0"],
                "weight": 14.3,
                "types": ["Normal"],
                "HP": 55,
                "Attack": 55,
                "Defense": 50,
                "Special": 45,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 27
                    }, {
                        "Move": "Tail Whip",
                        "level": 31
                    }, {
                        "Move": "Bite",
                        "level": 37
                    }, {
                        "Move": "Take Down",
                        "level": 45
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 8
                    }, {
                        "Move": "Growl",
                        "level": 16
                    }, {
                        "Move": "Quick Attack",
                        "level": 23
                    }, {
                        "Move": "Bite",
                        "level": 30
                    }, {
                        "Move": "Focus Energy",
                        "level": 36
                    }, {
                        "Move": "Take Down",
                        "level": 42
                    }]
                }
            }, "Ekans": {
                "label": "Snake",
                "sprite": "Water",
                "info": [
                    "Moves silently and stealthily. Eats the eggs of birds, such as PIDGEY and SPEAROW, whole."
                ],
                "evolvesInto": "Arbok",
                "evolvesVia": "Level 22",
                "number": 23,
                "height": ["6", "7"],
                "weight": 15.2,
                "types": ["Poison"],
                "HP": 35,
                "Attack": 60,
                "Defense": 44,
                "Special": 40,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Poison Sting",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 17
                    }, {
                        "Move": "Glare",
                        "level": 24
                    }, {
                        "Move": "Screech",
                        "level": 31
                    }, {
                        "Move": "Acid",
                        "level": 38
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Electabuzz": {
                "label": "Electric",
                "sprite": "Water",
                "info": [
                    "Normally found near power plants, they can wander away and cause major blackouts in cities."
                ],
                "evolvesInto": "Electivire",
                "evolvesVia": "trade holdingElectrizer",
                "number": 125,
                "height": ["3", "7"],
                "weight": 66.1,
                "types": ["Electric"],
                "HP": 65,
                "Attack": 83,
                "Defense": 57,
                "Special": 95,
                "Speed": 105,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 34
                    }, {
                        "Move": "Screech",
                        "level": 37
                    }, {
                        "Move": "Thunder Punch",
                        "level": 42
                    }, {
                        "Move": "Light Screen",
                        "level": 49
                    }, {
                        "Move": "Thunder",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Electrode": {
                "label": "Ball",
                "sprite": "Water",
                "info": [
                    "It stores electric energy under very high pressure. It often explodes with little or no provocation."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 101,
                "height": ["3", "11"],
                "weight": 146.8,
                "types": ["Electric"],
                "HP": 60,
                "Attack": 50,
                "Defense": 70,
                "Special": 80,
                "Speed": 140,
                "moves": {
                    "natural": [{
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Sonic Boom",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sonic Boom",
                        "level": 17
                    }, {
                        "Move": "Self-Destruct",
                        "level": 22
                    }, {
                        "Move": "Light Screen",
                        "level": 29
                    }, {
                        "Move": "Swift",
                        "level": 40
                    }, {
                        "Move": "Explosion",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Exeggcute": {
                "label": "Egg",
                "sprite": "Water",
                "info": [
                    "Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms."
                ],
                "evolvesInto": "Exeggutor",
                "evolvesVia": "use Leaf Stone",
                "number": 102,
                "height": ["1", "4"],
                "weight": 5.5,
                "types": ["Grass", "Psychic"],
                "HP": 60,
                "Attack": 40,
                "Defense": 80,
                "Special": 60,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Barrage",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Reflect",
                        "level": 25
                    }, {
                        "Move": "Leech Seed",
                        "level": 28
                    }, {
                        "Move": "Stun Spore",
                        "level": 32
                    }, {
                        "Move": "Poison Powder",
                        "level": 37
                    }, {
                        "Move": "Solar Beam",
                        "level": 42
                    }, {
                        "Move": "Sleep Powder",
                        "level": 48
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Barrage",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Reflect",
                        "level": 25
                    }, {
                        "Move": "Leech Seed",
                        "level": 28
                    }, {
                        "Move": "Stun Spore",
                        "level": 32
                    }, {
                        "Move": "Poison Powder",
                        "level": 37
                    }, {
                        "Move": "Solar Beam",
                        "level": 42
                    }, {
                        "Move": "Sleep Powder",
                        "level": 48
                    }]
                }
            }, "Exeggutor": {
                "label": "Coconut",
                "sprite": "Water",
                "info": [
                    "Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 103,
                "height": ["6", "7"],
                "weight": 264.6,
                "types": ["Grass", "Psychic"],
                "HP": 95,
                "Attack": 95,
                "Defense": 85,
                "Special": 125,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Barrage",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 28
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Strength",
                        "level": 4
                    }]
                }
            }, "Farfetchd": {
                "label": "Wild Duck",
                "sprite": "Water",
                "info": [
                    "The sprig of green onions it holds is its weapon. It is used much like a metal sword."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 83,
                "height": ["2", "7"],
                "weight": 33.1,
                "types": ["Normal", "Flying"],
                "HP": 52,
                "Attack": 65,
                "Defense": 55,
                "Special": 58,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 7
                    }, {
                        "Move": "Fury Attack",
                        "level": 15
                    }, {
                        "Move": "Swords Dance",
                        "level": 23
                    }, {
                        "Move": "Agility",
                        "level": 31
                    }, {
                        "Move": "Slash",
                        "level": 39
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Fearow": {
                "label": "Beak",
                "sprite": "Water",
                "info": [
                    "With its huge and magnificent wings, it can keep aloft without ever having to land for rest."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 22,
                "height": ["3", "11"],
                "weight": 83.8,
                "types": ["Normal", "Flying"],
                "HP": 65,
                "Attack": 90,
                "Defense": 65,
                "Special": 61,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 9
                    }, {
                        "Move": "Fury Attack",
                        "level": 15
                    }, {
                        "Move": "Mirror Move",
                        "level": 25
                    }, {
                        "Move": "Drill Peck",
                        "level": 34
                    }, {
                        "Move": "Agility",
                        "level": 43
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Flareon": {
                "label": "Flame",
                "sprite": "Water",
                "info": [
                    "When storing thermal energy in its body, its temperature could soar to over 1600 degrees."
                ],
                "evolvesInto": "Sylveon",
                "evolvesVia": "use Fire Stone",
                "number": 136,
                "height": ["2", "11"],
                "weight": 55.1,
                "types": ["Fire"],
                "HP": 65,
                "Attack": 130,
                "Defense": 60,
                "Special": 95,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 27
                    }, {
                        "Move": "Ember",
                        "level": 31
                    }, {
                        "Move": "Tail Whip",
                        "level": 37
                    }, {
                        "Move": "Bite",
                        "level": 40
                    }, {
                        "Move": "Leer",
                        "level": 42
                    }, {
                        "Move": "Fire Spin",
                        "level": 44
                    }, {
                        "Move": "Rage",
                        "level": 48
                    }, {
                        "Move": "Flamethrower",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Gastly": {
                "label": "Gas",
                "sprite": "Water",
                "info": [
                    "Almost invisible, this gaseous %%%%%%%POKEMON%%%%%%% cloaks the target and puts it to sleep without notice."
                ],
                "evolvesInto": "Haunter",
                "evolvesVia": "Level 25",
                "number": 92,
                "height": ["4", "3"],
                "weight": 0.2,
                "types": ["Ghost", "Poison"],
                "HP": 30,
                "Attack": 35,
                "Defense": 30,
                "Special": 100,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Confuse Ray",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 1
                    }, {
                        "Move": "Night Shade",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 27
                    }, {
                        "Move": "Dream Eater",
                        "level": 35
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Confuse Ray",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 1
                    }, {
                        "Move": "Night Shade",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 27
                    }, {
                        "Move": "Dream Eater",
                        "level": 35
                    }]
                }
            }, "Gengar": {
                "label": "Shadow",
                "sprite": "Water",
                "info": [
                    "Under a full moon, this %%%%%%%POKEMON%%%%%%% likes to mimic the shadows of people and laugh at their fright."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 94,
                "height": ["4", "11"],
                "weight": 89.3,
                "types": ["Ghost", "Poison"],
                "HP": 60,
                "Attack": 65,
                "Defense": 60,
                "Special": 130,
                "Speed": 110,
                "moves": {
                    "natural": [{
                        "Move": "Confuse Ray",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 1
                    }, {
                        "Move": "Night Shade",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 29
                    }, {
                        "Move": "Dream Eater",
                        "level": 38
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Dream Eater",
                        "level": 42
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Geodude": {
                "label": "Rock",
                "sprite": "Water",
                "info": [
                    "Found in fields and mountains. Mistaking them for boulders, people often step or trip on them."
                ],
                "evolvesInto": "Graveler",
                "evolvesVia": "Level 25",
                "number": 74,
                "height": ["1", "4"],
                "weight": 44.1,
                "types": ["Rock", "Ground"],
                "HP": 40,
                "Attack": 80,
                "Defense": 100,
                "Special": 30,
                "Speed": 20,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Defense Curl",
                        "level": 11
                    }, {
                        "Move": "Rock Throw",
                        "level": 16
                    }, {
                        "Move": "Self-Destruct",
                        "level": 21
                    }, {
                        "Move": "Harden",
                        "level": 26
                    }, {
                        "Move": "Earthquake",
                        "level": 31
                    }, {
                        "Move": "Explosion",
                        "level": 36
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Gloom": {
                "label": "Weed",
                "sprite": "Water",
                "info": [
                    "The fluid that oozes from its mouth isn't drool. It is a nectar that is used to attract prey."
                ],
                "evolvesInto": "Vileplume",
                "evolvesVia": "↗",
                "number": 44,
                "height": ["2", "7"],
                "weight": 19,
                "types": ["Grass", "Poison"],
                "HP": 60,
                "Attack": 65,
                "Defense": 70,
                "Special": 85,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Absorb",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Stun Spore",
                        "level": 17
                    }, {
                        "Move": "Sleep Powder",
                        "level": 19
                    }, {
                        "Move": "Acid",
                        "level": 28
                    }, {
                        "Move": "Petal Dance",
                        "level": 38
                    }, {
                        "Move": "Solar Beam",
                        "level": 52
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Golbat": {
                "label": "Bat",
                "sprite": "Water",
                "info": [
                    "Once it strikes, it will not stop draining energy from the victim even if it gets too heavy to fly."
                ],
                "evolvesInto": "Crobat",
                "evolvesVia": "Happiness",
                "number": 42,
                "height": ["5", "3"],
                "weight": 121.3,
                "types": ["Poison", "Flying"],
                "HP": 75,
                "Attack": 80,
                "Defense": 70,
                "Special": 65,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 15
                    }, {
                        "Move": "Confuse Ray",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 32
                    }, {
                        "Move": "Haze",
                        "level": 43
                    }],
                    "hm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 15
                    }, {
                        "Move": "Confuse Ray",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 32
                    }, {
                        "Move": "Haze",
                        "level": 43
                    }]
                }
            }, "Goldeen": {
                "label": "Goldfish",
                "sprite": "Water",
                "info": [
                    "Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen."
                ],
                "evolvesInto": "Seaking",
                "evolvesVia": "Level 33",
                "number": 118,
                "height": ["2", "0"],
                "weight": 33.1,
                "types": ["Water"],
                "HP": 45,
                "Attack": 67,
                "Defense": 60,
                "Special": 35,
                "Speed": 63,
                "moves": {
                    "natural": [{
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 19
                    }, {
                        "Move": "Horn Attack",
                        "level": 24
                    }, {
                        "Move": "Fury Attack",
                        "level": 30
                    }, {
                        "Move": "Waterfall",
                        "level": 37
                    }, {
                        "Move": "Horn Drill",
                        "level": 45
                    }, {
                        "Move": "Agility",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Golduck": {
                "label": "Duck",
                "sprite": "Water",
                "info": [
                    "Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 55,
                "height": ["5", "7"],
                "weight": 168.9,
                "types": ["Water"],
                "HP": 80,
                "Attack": 82,
                "Defense": 78,
                "Special": 95,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 28
                    }, {
                        "Move": "Disable",
                        "level": 31
                    }, {
                        "Move": "Confusion",
                        "level": 39
                    }, {
                        "Move": "Fury Swipes",
                        "level": 48
                    }, {
                        "Move": "Hydro Pump",
                        "level": 59
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Golem": {
                "label": "Megaton",
                "sprite": "Water",
                "info": [
                    "Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 76,
                "height": ["4", "7"],
                "weight": 661.4,
                "types": ["Rock", "Ground"],
                "HP": 80,
                "Attack": 120,
                "Defense": 130,
                "Special": 55,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Defense Curl",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Defense Curl",
                        "level": 11
                    }, {
                        "Move": "Rock Throw",
                        "level": 16
                    }, {
                        "Move": "Self-Destruct",
                        "level": 21
                    }, {
                        "Move": "Harden",
                        "level": 29
                    }, {
                        "Move": "Earthquake",
                        "level": 36
                    }, {
                        "Move": "Explosion",
                        "level": 43
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Graveler": {
                "label": "Rock",
                "sprite": "Water",
                "info": [
                    "Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction."
                ],
                "evolvesInto": "Golem",
                "evolvesVia": "Trade",
                "number": 75,
                "height": ["3", "3"],
                "weight": 231.5,
                "types": ["Rock", "Ground"],
                "HP": 55,
                "Attack": 95,
                "Defense": 115,
                "Special": 45,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Defense Curl",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Defense Curl",
                        "level": 11
                    }, {
                        "Move": "Rock Throw",
                        "level": 16
                    }, {
                        "Move": "Self-Destruct",
                        "level": 21
                    }, {
                        "Move": "Harden",
                        "level": 29
                    }, {
                        "Move": "Earthquake",
                        "level": 36
                    }, {
                        "Move": "Explosion",
                        "level": 43
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Grimer": {
                "label": "Sludge",
                "sprite": "Water",
                "info": [
                    "Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories."
                ],
                "evolvesInto": "Muk",
                "evolvesVia": "Level 38",
                "number": 88,
                "height": ["2", "11"],
                "weight": 66.1,
                "types": ["Poison"],
                "HP": 80,
                "Attack": 80,
                "Defense": 50,
                "Special": 40,
                "Speed": 25,
                "moves": {
                    "natural": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 30
                    }, {
                        "Move": "Minimize",
                        "level": 33
                    }, {
                        "Move": "Sludge",
                        "level": 37
                    }, {
                        "Move": "Harden",
                        "level": 42
                    }, {
                        "Move": "Screech",
                        "level": 48
                    }, {
                        "Move": "Acid Armor",
                        "level": 55
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 30
                    }, {
                        "Move": "Minimize",
                        "level": 33
                    }, {
                        "Move": "Sludge",
                        "level": 37
                    }, {
                        "Move": "Harden",
                        "level": 42
                    }, {
                        "Move": "Screech",
                        "level": 48
                    }, {
                        "Move": "Acid Armor",
                        "level": 55
                    }]
                }
            }, "Growlithe": {
                "label": "Puppy",
                "sprite": "Water",
                "info": [
                    "Very protective of its territory. It will bark and bite to repel intruders from its space."
                ],
                "evolvesInto": "Arcanine",
                "evolvesVia": "use Fire Stone",
                "number": 58,
                "height": ["2", "4"],
                "weight": 41.9,
                "types": ["Fire"],
                "HP": 55,
                "Attack": 70,
                "Defense": 45,
                "Special": 70,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Roar",
                        "level": 1
                    }, {
                        "Move": "Ember",
                        "level": 18
                    }, {
                        "Move": "Leer",
                        "level": 23
                    }, {
                        "Move": "Take Down",
                        "level": 30
                    }, {
                        "Move": "Agility",
                        "level": 39
                    }, {
                        "Move": "Flamethrower",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Roar",
                        "level": 1
                    }, {
                        "Move": "Ember",
                        "level": 18
                    }, {
                        "Move": "Leer",
                        "level": 23
                    }, {
                        "Move": "Take Down",
                        "level": 30
                    }, {
                        "Move": "Agility",
                        "level": 39
                    }, {
                        "Move": "Flamethrower",
                        "level": 50
                    }]
                }
            }, "Gyarados": {
                "label": "Atrocious",
                "sprite": "Water",
                "info": [
                    "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 130,
                "height": ["21", "4"],
                "weight": 518.1,
                "types": ["Water", "Flying"],
                "HP": 95,
                "Attack": 125,
                "Defense": 79,
                "Special": 60,
                "Speed": 81,
                "moves": {
                    "natural": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Dragon Rage",
                        "level": 1
                    }, {
                        "Move": "Hydro Pump",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 20
                    }, {
                        "Move": "Dragon Rage",
                        "level": 25
                    }, {
                        "Move": "Leer",
                        "level": 32
                    }, {
                        "Move": "Hydro Pump",
                        "level": 41
                    }, {
                        "Move": "Hyper Beam",
                        "level": 52
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }]
                }
            }, "Haunter": {
                "label": "Gas",
                "sprite": "Water",
                "info": [
                    "Because of its ability to slip through block walls, it is said to be from another dimension."
                ],
                "evolvesInto": "Gengar",
                "evolvesVia": "Trade",
                "number": 93,
                "height": ["5", "3"],
                "weight": 0.2,
                "types": ["Ghost", "Poison"],
                "HP": 45,
                "Attack": 50,
                "Defense": 45,
                "Special": 115,
                "Speed": 95,
                "moves": {
                    "natural": [{
                        "Move": "Confuse Ray",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 1
                    }, {
                        "Move": "Night Shade",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 29
                    }, {
                        "Move": "Dream Eater",
                        "level": 38
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Confuse Ray",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 1
                    }, {
                        "Move": "Night Shade",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 29
                    }, {
                        "Move": "Dream Eater",
                        "level": 38
                    }]
                }
            }, "Hitmonchan": {
                "label": "Punching",
                "sprite": "Water",
                "info": [
                    "While apparently doing nothing, it fires punches in lightning fast volleys that are impossible to see."
                ],
                "evolvesInto": "Hitmontop",
                "evolvesVia": "Level 20,Attack = Defense",
                "number": 107,
                "height": ["4", "7"],
                "weight": 110.7,
                "types": ["Fighting"],
                "HP": 50,
                "Attack": 105,
                "Defense": 79,
                "Special": 35,
                "Speed": 76,
                "moves": {
                    "natural": [{
                        "Move": "Agility",
                        "level": 1
                    }, {
                        "Move": "Comet Punch",
                        "level": 1
                    }, {
                        "Move": "Fire Punch",
                        "level": 33
                    }, {
                        "Move": "Ice Punch",
                        "level": 38
                    }, {
                        "Move": "Thunder Punch",
                        "level": 43
                    }, {
                        "Move": "Mega Punch",
                        "level": 48
                    }, {
                        "Move": "Counter",
                        "level": 53
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Hitmonlee": {
                "label": "Kicking",
                "sprite": "Water",
                "info": [
                    "When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides."
                ],
                "evolvesInto": "Hitmonchan",
                "evolvesVia": "Level 20,Attack < Defense",
                "number": 106,
                "height": ["4", "11"],
                "weight": 109.8,
                "types": ["Fighting"],
                "HP": 50,
                "Attack": 120,
                "Defense": 53,
                "Special": 35,
                "Speed": 87,
                "moves": {
                    "natural": [{
                        "Move": "Double Kick",
                        "level": 1
                    }, {
                        "Move": "Meditate",
                        "level": 1
                    }, {
                        "Move": "Rolling Kick",
                        "level": 33
                    }, {
                        "Move": "Jump Kick",
                        "level": 38
                    }, {
                        "Move": "Focus Energy",
                        "level": 43
                    }, {
                        "Move": "High Jump Kick",
                        "level": 48
                    }, {
                        "Move": "Mega Kick",
                        "level": 53
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Horsea": {
                "label": "Dragon",
                "sprite": "Water",
                "info": [
                    "Known to shoot down flying bugs with precision blasts of ink from the surface of the water."
                ],
                "evolvesInto": "Seadra",
                "evolvesVia": "Level 32",
                "number": 116,
                "height": ["1", "4"],
                "weight": 17.6,
                "types": ["Water"],
                "HP": 30,
                "Attack": 40,
                "Defense": 70,
                "Special": 70,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Smokescreen",
                        "level": 19
                    }, {
                        "Move": "Leer",
                        "level": 24
                    }, {
                        "Move": "Water Gun",
                        "level": 30
                    }, {
                        "Move": "Agility",
                        "level": 37
                    }, {
                        "Move": "Hydro Pump",
                        "level": 45
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Hypno": {
                "label": "Hypnosis",
                "sprite": "Water",
                "info": [
                    "When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 97,
                "height": ["5", "3"],
                "weight": 166.7,
                "types": ["Psychic"],
                "HP": 85,
                "Attack": 73,
                "Defense": 70,
                "Special": 73,
                "Speed": 67,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 12
                    }, {
                        "Move": "Confusion",
                        "level": 17
                    }, {
                        "Move": "Headbutt",
                        "level": 24
                    }, {
                        "Move": "Poison Gas",
                        "level": 33
                    }, {
                        "Move": "Psychic",
                        "level": 37
                    }, {
                        "Move": "Meditate",
                        "level": 43
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Dream Eater",
                        "level": 42
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Ivysaur": {
                "label": "Seed",
                "sprite": "Water",
                "info": [
                    "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."
                ],
                "evolvesInto": "Venusaur",
                "evolvesVia": "Level 32",
                "number": 2,
                "height": ["3", "3"],
                "weight": 28.7,
                "types": ["Grass", "Poison"],
                "HP": 60,
                "Attack": 62,
                "Defense": 63,
                "Special": 80,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leech Seed",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Leech Seed",
                        "level": 7
                    }, {
                        "Move": "Vine Whip",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 22
                    }, {
                        "Move": "Razor Leaf",
                        "level": 30
                    }, {
                        "Move": "Growth",
                        "level": 38
                    }, {
                        "Move": "Sleep Powder",
                        "level": 46
                    }, {
                        "Move": "Solar Beam",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Jigglypuff": {
                "label": "Balloon",
                "sprite": "Water",
                "info": [
                    "When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep."
                ],
                "evolvesInto": "Wigglytuff",
                "evolvesVia": "use Moon Stone",
                "number": 39,
                "height": ["1", "8"],
                "weight": 12.1,
                "types": ["Normal", "Fairy"],
                "HP": 115,
                "Attack": 45,
                "Defense": 20,
                "Special": 45,
                "Speed": 20,
                "moves": {
                    "natural": [{
                        "Move": "Sing",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 9
                    }, {
                        "Move": "Disable",
                        "level": 14
                    }, {
                        "Move": "Defense Curl",
                        "level": 19
                    }, {
                        "Move": "Double Slap",
                        "level": 24
                    }, {
                        "Move": "Rest",
                        "level": 29
                    }, {
                        "Move": "Body Slam",
                        "level": 34
                    }, {
                        "Move": "Double-Edge",
                        "level": 39
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Jolteon": {
                "label": "Lightning",
                "sprite": "Water",
                "info": [
                    "It accumulates negative ions in the atmosphere to blast out 10000-volt lightning bolts."
                ],
                "evolvesInto": "Flareon",
                "evolvesVia": "use Thunderstone",
                "number": 135,
                "height": ["2", "7"],
                "weight": 54,
                "types": ["Electric"],
                "HP": 65,
                "Attack": 65,
                "Defense": 60,
                "Special": 110,
                "Speed": 130,
                "moves": {
                    "natural": [{
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 27
                    }, {
                        "Move": "Thunder Shock",
                        "level": 31
                    }, {
                        "Move": "Tail Whip",
                        "level": 37
                    }, {
                        "Move": "Thunder Wave",
                        "level": 40
                    }, {
                        "Move": "Double Kick",
                        "level": 42
                    }, {
                        "Move": "Agility",
                        "level": 44
                    }, {
                        "Move": "Pin Missile",
                        "level": 48
                    }, {
                        "Move": "Thunder",
                        "level": 54
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Flash",
                        "level": 5
                    }]
                }
            }, "Jynx": {
                "label": "Human Shape",
                "sprite": "Water",
                "info": [
                    "It seductively wiggles its hips as it walks. It can cause people to dance in unison with it."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 124,
                "height": ["4", "7"],
                "weight": 89.5,
                "types": ["Ice", "Psychic"],
                "HP": 65,
                "Attack": 50,
                "Defense": 35,
                "Special": 115,
                "Speed": 95,
                "moves": {
                    "natural": [{
                        "Move": "Lovely Kiss",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 18
                    }, {
                        "Move": "Double Slap",
                        "level": 23
                    }, {
                        "Move": "Ice Punch",
                        "level": 31
                    }, {
                        "Move": "Body Slam",
                        "level": 39
                    }, {
                        "Move": "Thrash",
                        "level": 47
                    }, {
                        "Move": "Blizzard",
                        "level": 58
                    }],
                    "hm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Lovely Kiss",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Lick",
                        "level": 18
                    }, {
                        "Move": "Double Slap",
                        "level": 23
                    }, {
                        "Move": "Ice Punch",
                        "level": 31
                    }, {
                        "Move": "Body Slam",
                        "level": 39
                    }, {
                        "Move": "Thrash",
                        "level": 47
                    }, {
                        "Move": "Blizzard",
                        "level": 58
                    }]
                }
            }, "Kabuto": {
                "label": "Shellfish",
                "sprite": "Water",
                "info": [
                    "A %%%%%%%POKEMON%%%%%%% that was resurrected from a fossil found in what was once the ocean floor eons ago."
                ],
                "evolvesInto": "Kabutops",
                "evolvesVia": "Level 40",
                "number": 140,
                "height": ["1", "8"],
                "weight": 25.4,
                "types": ["Rock", "Water"],
                "HP": 30,
                "Attack": 80,
                "Defense": 90,
                "Special": 55,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Harden",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Absorb",
                        "level": 34
                    }, {
                        "Move": "Slash",
                        "level": 39
                    }, {
                        "Move": "Leer",
                        "level": 44
                    }, {
                        "Move": "Hydro Pump",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Kabutops": {
                "label": "Shellfish",
                "sprite": "Water",
                "info": [
                    "Its sleek shape is perfect for swimming. It slashes prey with its claws and drains the body fluids."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 141,
                "height": ["4", "3"],
                "weight": 89.3,
                "types": ["Rock", "Water"],
                "HP": 60,
                "Attack": 115,
                "Defense": 105,
                "Special": 65,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Absorb",
                        "level": 1
                    }, {
                        "Move": "Harden",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Absorb",
                        "level": 34
                    }, {
                        "Move": "Slash",
                        "level": 39
                    }, {
                        "Move": "Leer",
                        "level": 46
                    }, {
                        "Move": "Hydro Pump",
                        "level": 53
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Kadabra": {
                "label": "Psi",
                "sprite": "Water",
                "info": [
                    "It emits special alpha waves from its body that induce headaches just by being close by."
                ],
                "evolvesInto": "Alakazam",
                "evolvesVia": "Trade",
                "number": 64,
                "height": ["4", "3"],
                "weight": 124.6,
                "types": ["Psychic"],
                "HP": 40,
                "Attack": 35,
                "Defense": 30,
                "Special": 120,
                "Speed": 105,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Teleport",
                        "level": 1
                    }, {
                        "Move": "Confusion",
                        "level": 16
                    }, {
                        "Move": "Disable",
                        "level": 20
                    }, {
                        "Move": "Psybeam",
                        "level": 27
                    }, {
                        "Move": "Recover",
                        "level": 31
                    }, {
                        "Move": "Psychic",
                        "level": 38
                    }, {
                        "Move": "Reflect",
                        "level": 42
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Kakuna": {
                "label": "Cocoon",
                "sprite": "Water",
                "info": [
                    "Almost incapable of moving, this %%%%%%%POKEMON%%%%%%% can only harden its shell to protect itself from predators."
                ],
                "evolvesInto": "Beedrill",
                "evolvesVia": "Level 10",
                "number": 14,
                "height": ["2", "0"],
                "weight": 22,
                "types": ["Bug", "Poison"],
                "HP": 45,
                "Attack": 25,
                "Defense": 50,
                "Special": 25,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Harden",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Harden",
                        "level": 1
                    }]
                }
            }, "Kangaskhan": {
                "label": "Parent",
                "sprite": "Water",
                "info": [
                    "The infant rarely ventures out of its mother's protective pouch until it is 3 years old."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 115,
                "height": ["7", "3"],
                "weight": 176.4,
                "types": ["Normal"],
                "HP": 105,
                "Attack": 95,
                "Defense": 80,
                "Special": 40,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Comet Punch",
                        "level": 1
                    }, {
                        "Move": "Rage",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 26
                    }, {
                        "Move": "Tail Whip",
                        "level": 31
                    }, {
                        "Move": "Mega Punch",
                        "level": 36
                    }, {
                        "Move": "Leer",
                        "level": 41
                    }, {
                        "Move": "Dizzy Punch",
                        "level": 46
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Kingler": {
                "label": "Pincer",
                "sprite": "Water",
                "info": [
                    "The large pincer has 10000 hp of crushing power. However, its huge size makes it unwieldy to use."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 99,
                "height": ["4", "3"],
                "weight": 132.3,
                "types": ["Water"],
                "HP": 55,
                "Attack": 130,
                "Defense": 115,
                "Special": 50,
                "Speed": 75,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Vice Grip",
                        "level": 1
                    }, {
                        "Move": "Vice Grip",
                        "level": 20
                    }, {
                        "Move": "Guillotine",
                        "level": 25
                    }, {
                        "Move": "Stomp",
                        "level": 34
                    }, {
                        "Move": "Crabhammer",
                        "level": 42
                    }, {
                        "Move": "Harden",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Koffing": {
                "label": "Poison Gas",
                "sprite": "Water",
                "info": [
                    "Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning."
                ],
                "evolvesInto": "Weezing",
                "evolvesVia": "Level 35",
                "number": 109,
                "height": ["2", "0"],
                "weight": 2.2,
                "types": ["Poison"],
                "HP": 40,
                "Attack": 65,
                "Defense": 95,
                "Special": 60,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Smog",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sludge",
                        "level": 32
                    }, {
                        "Move": "Smokescreen",
                        "level": 37
                    }, {
                        "Move": "Self-Destruct",
                        "level": 40
                    }, {
                        "Move": "Haze",
                        "level": 45
                    }, {
                        "Move": "Explosion",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Smog",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sludge",
                        "level": 32
                    }, {
                        "Move": "Smokescreen",
                        "level": 37
                    }, {
                        "Move": "Self-Destruct",
                        "level": 40
                    }, {
                        "Move": "Haze",
                        "level": 45
                    }, {
                        "Move": "Explosion",
                        "level": 48
                    }]
                }
            }, "Krabby": {
                "label": "River Crab",
                "sprite": "Water",
                "info": [
                    "Its pincers are not only powerful weapons, they are used for balance when walking sideways."
                ],
                "evolvesInto": "Kingler",
                "evolvesVia": "Level 28",
                "number": 98,
                "height": ["1", "4"],
                "weight": 14.3,
                "types": ["Water"],
                "HP": 30,
                "Attack": 105,
                "Defense": 90,
                "Special": 25,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Vice Grip",
                        "level": 20
                    }, {
                        "Move": "Guillotine",
                        "level": 25
                    }, {
                        "Move": "Stomp",
                        "level": 30
                    }, {
                        "Move": "Crabhammer",
                        "level": 35
                    }, {
                        "Move": "Harden",
                        "level": 40
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Lapras": {
                "label": "Transport",
                "sprite": "Water",
                "info": [
                    "A %%%%%%%POKEMON%%%%%%% that has been overhunted almost to extinction. It can ferry people across the water."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 131,
                "height": ["8", "2"],
                "weight": 485,
                "types": ["Water", "Ice"],
                "HP": 130,
                "Attack": 85,
                "Defense": 80,
                "Special": 85,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Sing",
                        "level": 16
                    }, {
                        "Move": "Mist",
                        "level": 20
                    }, {
                        "Move": "Body Slam",
                        "level": 25
                    }, {
                        "Move": "Confuse Ray",
                        "level": 31
                    }, {
                        "Move": "Ice Beam",
                        "level": 38
                    }, {
                        "Move": "Hydro Pump",
                        "level": 46
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Lickitung": {
                "label": "Licking",
                "sprite": "Water",
                "info": [
                    "Its tongue can be extended like a chameleon's. It leaves a tingling sensation when it licks enemies."
                ],
                "evolvesInto": "Lickilicky",
                "evolvesVia": "after Rolloutlearned",
                "number": 108,
                "height": ["3", "11"],
                "weight": 144.4,
                "types": ["Normal"],
                "HP": 90,
                "Attack": 55,
                "Defense": 75,
                "Special": 60,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Supersonic",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 7
                    }, {
                        "Move": "Disable",
                        "level": 15
                    }, {
                        "Move": "Defense Curl",
                        "level": 23
                    }, {
                        "Move": "Slam",
                        "level": 31
                    }, {
                        "Move": "Screech",
                        "level": 39
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Machamp": {
                "label": "Superpower",
                "sprite": "Water",
                "info": [
                    "Using its heavy muscles, it throws powerful punches that can send the victim clear over the horizon."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 68,
                "height": ["5", "3"],
                "weight": 286.6,
                "types": ["Fighting"],
                "HP": 90,
                "Attack": 130,
                "Defense": 80,
                "Special": 65,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Karate Chop",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Low Kick",
                        "level": 1
                    }, {
                        "Move": "Low Kick",
                        "level": 20
                    }, {
                        "Move": "Leer",
                        "level": 25
                    }, {
                        "Move": "Focus Energy",
                        "level": 36
                    }, {
                        "Move": "Seismic Toss",
                        "level": 44
                    }, {
                        "Move": "Submission",
                        "level": 52
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Machoke": {
                "label": "Superpower",
                "sprite": "Water",
                "info": [
                    "Its muscular body is so powerful, it must wear a power save belt to be able to regulate its motions."
                ],
                "evolvesInto": "Machamp",
                "evolvesVia": "Trade",
                "number": 67,
                "height": ["4", "11"],
                "weight": 155.4,
                "types": ["Fighting"],
                "HP": 80,
                "Attack": 100,
                "Defense": 70,
                "Special": 50,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Karate Chop",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Low Kick",
                        "level": 1
                    }, {
                        "Move": "Low Kick",
                        "level": 20
                    }, {
                        "Move": "Leer",
                        "level": 25
                    }, {
                        "Move": "Focus Energy",
                        "level": 36
                    }, {
                        "Move": "Seismic Toss",
                        "level": 44
                    }, {
                        "Move": "Submission",
                        "level": 52
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Machop": {
                "label": "Superpower",
                "sprite": "Water",
                "info": [
                    "Loves to build its muscles. It trains in all styles of martial arts to become even stronger."
                ],
                "evolvesInto": "Machoke",
                "evolvesVia": "Level 28",
                "number": 66,
                "height": ["2", "7"],
                "weight": 43,
                "types": ["Fighting"],
                "HP": 70,
                "Attack": 80,
                "Defense": 50,
                "Special": 35,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Karate Chop",
                        "level": 1
                    }, {
                        "Move": "Low Kick",
                        "level": 20
                    }, {
                        "Move": "Leer",
                        "level": 25
                    }, {
                        "Move": "Focus Energy",
                        "level": 32
                    }, {
                        "Move": "Seismic Toss",
                        "level": 39
                    }, {
                        "Move": "Submission",
                        "level": 46
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Magikarp": {
                "label": "Fish",
                "sprite": "Water",
                "info": [
                    "In the distant past, it was somewhat stronger than the horribly weak descendants that exist today."
                ],
                "evolvesInto": "Gyarados",
                "evolvesVia": "Level 20",
                "number": 129,
                "height": ["2", "11"],
                "weight": 22,
                "types": ["Water"],
                "HP": 20,
                "Attack": 10,
                "Defense": 55,
                "Special": 15,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Splash",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 15
                    }],
                    "hm": [],
                    "tm": []
                }
            }, "Magmar": {
                "label": "Spitfire",
                "sprite": "Water",
                "info": [
                    "Its body always burns with an orange glow that enables it to hide perfectly among flames."
                ],
                "evolvesInto": "Magmortar",
                "evolvesVia": "trade holdingMagmarizer",
                "number": 126,
                "height": ["4", "3"],
                "weight": 98.1,
                "types": ["Fire"],
                "HP": 65,
                "Attack": 95,
                "Defense": 57,
                "Special": 100,
                "Speed": 93,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 36
                    }, {
                        "Move": "Confuse Ray",
                        "level": 39
                    }, {
                        "Move": "Fire Punch",
                        "level": 43
                    }, {
                        "Move": "Smokescreen",
                        "level": 48
                    }, {
                        "Move": "Smog",
                        "level": 52
                    }, {
                        "Move": "Flamethrower",
                        "level": 55
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Magnemite": {
                "label": "Magnet",
                "sprite": "Water",
                "info": [
                    "Uses anti-gravity to stay suspended. Appears without warning and uses THUNDER WAVE and similar moves."
                ],
                "evolvesInto": "Magneton",
                "evolvesVia": "Level 30",
                "number": 81,
                "height": ["1", "0"],
                "weight": 13.2,
                "types": ["Electric", "Steel"],
                "HP": 25,
                "Attack": 35,
                "Defense": 70,
                "Special": 95,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sonic Boom",
                        "level": 21
                    }, {
                        "Move": "Thunder Shock",
                        "level": 25
                    }, {
                        "Move": "Supersonic",
                        "level": 29
                    }, {
                        "Move": "Thunder Wave",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 41
                    }, {
                        "Move": "Screech",
                        "level": 47
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Magneton": {
                "label": "Magnet",
                "sprite": "Water",
                "info": [
                    "Formed by several MAGNEMITEs linked together. They frequently appear when sunspots flare up."
                ],
                "evolvesInto": "Magnezone",
                "evolvesVia": "in a Magnetic Field area",
                "number": 82,
                "height": ["3", "3"],
                "weight": 132.3,
                "types": ["Electric", "Steel"],
                "HP": 50,
                "Attack": 60,
                "Defense": 95,
                "Special": 120,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Sonic Boom",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 1
                    }, {
                        "Move": "Sonic Boom",
                        "level": 21
                    }, {
                        "Move": "Thunder Shock",
                        "level": 25
                    }, {
                        "Move": "Supersonic",
                        "level": 29
                    }, {
                        "Move": "Thunder Wave",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 46
                    }, {
                        "Move": "Screech",
                        "level": 54
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Mankey": {
                "label": "Pig Monkey",
                "sprite": "Water",
                "info": [
                    "Extremely quick to anger. It could be docile one moment then thrashing away the next instant."
                ],
                "evolvesInto": "Primeape",
                "evolvesVia": "Level 28",
                "number": 56,
                "height": ["1", "8"],
                "weight": 61.7,
                "types": ["Fighting"],
                "HP": 40,
                "Attack": 80,
                "Defense": 35,
                "Special": 35,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Karate Chop",
                        "level": 15
                    }, {
                        "Move": "Fury Swipes",
                        "level": 21
                    }, {
                        "Move": "Focus Energy",
                        "level": 27
                    }, {
                        "Move": "Seismic Toss",
                        "level": 33
                    }, {
                        "Move": "Thrash",
                        "level": 39
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Marowak": {
                "label": "Bone Keeper",
                "sprite": "Water",
                "info": [
                    "The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 105,
                "height": ["3", "3"],
                "weight": 99.2,
                "types": ["Ground"],
                "HP": 60,
                "Attack": 80,
                "Defense": 110,
                "Special": 50,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Bone Club",
                        "level": 1
                    }, {
                        "Move": "Focus Energy",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 25
                    }, {
                        "Move": "Focus Energy",
                        "level": 33
                    }, {
                        "Move": "Thrash",
                        "level": 41
                    }, {
                        "Move": "Bonemerang",
                        "level": 48
                    }, {
                        "Move": "Rage",
                        "level": 55
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Meowth": {
                "label": "Scratch Cat",
                "sprite": "Water",
                "info": [
                    "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change."
                ],
                "evolvesInto": "Persian",
                "evolvesVia": "Level 28",
                "number": 52,
                "height": ["1", "4"],
                "weight": 9.3,
                "types": ["Normal"],
                "HP": 40,
                "Attack": 45,
                "Defense": 35,
                "Special": 40,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 12
                    }, {
                        "Move": "Pay Day",
                        "level": 17
                    }, {
                        "Move": "Screech",
                        "level": 24
                    }, {
                        "Move": "Fury Swipes",
                        "level": 33
                    }, {
                        "Move": "Slash",
                        "level": 44
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 12
                    }, {
                        "Move": "Pay Day",
                        "level": 17
                    }, {
                        "Move": "Screech",
                        "level": 24
                    }, {
                        "Move": "Fury Swipes",
                        "level": 33
                    }, {
                        "Move": "Slash",
                        "level": 44
                    }]
                }
            }, "Metapod": {
                "label": "Cocoon",
                "sprite": "Water",
                "info": [
                    "This %%%%%%%POKEMON%%%%%%% is vulnerable to attack while its shell is soft, exposing its weak and tender body."
                ],
                "evolvesInto": "Butterfree",
                "evolvesVia": "Level 10",
                "number": 11,
                "height": ["2", "4"],
                "weight": 21.8,
                "types": ["Bug"],
                "HP": 50,
                "Attack": 20,
                "Defense": 55,
                "Special": 25,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Harden",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Harden",
                        "level": 1
                    }, {
                        "Move": "Harden",
                        "level": 7
                    }]
                }
            }, "Mew": {
                "label": "New Species",
                "sprite": "Water",
                "info": [
                    "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 151,
                "height": ["1", "4"],
                "weight": 8.8,
                "types": ["Psychic"],
                "HP": 100,
                "Attack": 100,
                "Defense": 100,
                "Special": 100,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Transform",
                        "level": 10
                    }, {
                        "Move": "Mega Punch",
                        "level": 20
                    }, {
                        "Move": "Metronome",
                        "level": 30
                    }, {
                        "Move": "Psychic",
                        "level": 40
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Fly",
                        "level": 2
                    }, {
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Dragon Rage",
                        "level": 23
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Egg Bomb",
                        "level": 37
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Soft-Boiled",
                        "level": 41
                    }, {
                        "Move": "Dream Eater",
                        "level": 42
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Mewtwo": {
                "label": "Genetic",
                "sprite": "Water",
                "info": [
                    "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 150,
                "height": ["6", "7"],
                "weight": 269,
                "types": ["Psychic"],
                "HP": 106,
                "Attack": 110,
                "Defense": 90,
                "Special": 154,
                "Speed": 130,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Psychic",
                        "level": 1
                    }, {
                        "Move": "Swift",
                        "level": 1
                    }, {
                        "Move": "Barrier",
                        "level": 63
                    }, {
                        "Move": "Psychic",
                        "level": 66
                    }, {
                        "Move": "Recover",
                        "level": 70
                    }, {
                        "Move": "Mist",
                        "level": 75
                    }, {
                        "Move": "Amnesia",
                        "level": 81
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Moltres": {
                "label": "Flame",
                "sprite": "Water",
                "info": [
                    "Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 146,
                "height": ["6", "7"],
                "weight": 132.3,
                "types": ["Fire", "Flying"],
                "HP": 90,
                "Attack": 100,
                "Defense": 90,
                "Special": 125,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Fire Spin",
                        "level": 1
                    }, {
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 51
                    }, {
                        "Move": "Agility",
                        "level": 55
                    }, {
                        "Move": "Sky Attack",
                        "level": 60
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Mr-mime": {
                "label": "Barrier",
                "sprite": "Water",
                "info": [
                    "If interrupted while it is miming, it will slap around the offender with its broad hands."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 122,
                "height": ["4", "3"],
                "weight": 120.2,
                "types": ["Psychic", "Fairy"],
                "HP": 40,
                "Attack": 45,
                "Defense": 65,
                "Special": 100,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Barrier",
                        "level": 1
                    }, {
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Confusion",
                        "level": 15
                    }, {
                        "Move": "Light Screen",
                        "level": 23
                    }, {
                        "Move": "Double Slap",
                        "level": 31
                    }, {
                        "Move": "Meditate",
                        "level": 39
                    }, {
                        "Move": "Substitute",
                        "level": 47
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Muk": {
                "label": "Sludge",
                "sprite": "Water",
                "info": [
                    "Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 89,
                "height": ["3", "11"],
                "weight": 66.1,
                "types": ["Poison"],
                "HP": 105,
                "Attack": 105,
                "Defense": 75,
                "Special": 65,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 30
                    }, {
                        "Move": "Minimize",
                        "level": 33
                    }, {
                        "Move": "Sludge",
                        "level": 37
                    }, {
                        "Move": "Harden",
                        "level": 45
                    }, {
                        "Move": "Screech",
                        "level": 53
                    }, {
                        "Move": "Acid Armor",
                        "level": 60
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 1
                    }, {
                        "Move": "Pound",
                        "level": 1
                    }, {
                        "Move": "Poison Gas",
                        "level": 30
                    }, {
                        "Move": "Minimize",
                        "level": 33
                    }, {
                        "Move": "Sludge",
                        "level": 37
                    }, {
                        "Move": "Harden",
                        "level": 45
                    }, {
                        "Move": "Screech",
                        "level": 53
                    }, {
                        "Move": "Acid Armor",
                        "level": 60
                    }]
                }
            }, "Nidoking": {
                "label": "Drill",
                "sprite": "Water",
                "info": [
                    "It uses its powerful tail in battle to smash, constrict, then break the prey's bones."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 34,
                "height": ["4", "7"],
                "weight": 136.7,
                "types": ["Poison", "Ground"],
                "HP": 81,
                "Attack": 102,
                "Defense": 77,
                "Special": 85,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Poison Sting",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Thrash",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 8
                    }, {
                        "Move": "Poison Sting",
                        "level": 14
                    }, {
                        "Move": "Thrash",
                        "level": 23
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }]
                }
            }, "Nidoqueen": {
                "label": "Drill",
                "sprite": "Water",
                "info": [
                    "Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 31,
                "height": ["4", "3"],
                "weight": 132.3,
                "types": ["Poison", "Ground"],
                "HP": 90,
                "Attack": 92,
                "Defense": 87,
                "Special": 75,
                "Speed": 76,
                "moves": {
                    "natural": [{
                        "Move": "Body Slam",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 8
                    }, {
                        "Move": "Poison Sting",
                        "level": 14
                    }, {
                        "Move": "Body Slam",
                        "level": 23
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }]
                }
            }, "Nidoran-f": {
                "label": "Poison Pin",
                "sprite": "Water",
                "info": [
                    "Although small, its venomous barbs render this %%%%%%%POKEMON%%%%%%% dangerous. The female has smaller horns."
                ],
                "evolvesInto": "Nidorina",
                "evolvesVia": "Level 16",
                "number": 29,
                "height": ["1", "4"],
                "weight": 15.4,
                "types": ["Poison"],
                "HP": 55,
                "Attack": 47,
                "Defense": 52,
                "Special": 40,
                "Speed": 41,
                "moves": {
                    "natural": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Nidoran-m": {
                "label": "Poison Pin",
                "sprite": "Water",
                "info": [
                    "Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom."
                ],
                "evolvesInto": "Nidorino",
                "evolvesVia": "Level 16",
                "number": 32,
                "height": ["1", "8"],
                "weight": 19.8,
                "types": ["Poison"],
                "HP": 46,
                "Attack": 57,
                "Defense": 40,
                "Special": 40,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Nidorina": {
                "label": "Poison Pin",
                "sprite": "Water",
                "info": [
                    "The female's horn develops slowly. Prefers physical attacks such as clawing and biting."
                ],
                "evolvesInto": "Nidoqueen",
                "evolvesVia": "use Moon Stone",
                "number": 30,
                "height": ["2", "7"],
                "weight": 44.1,
                "types": ["Poison"],
                "HP": 70,
                "Attack": 62,
                "Defense": 67,
                "Special": 55,
                "Speed": 56,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 8
                    }, {
                        "Move": "Poison Sting",
                        "level": 14
                    }, {
                        "Move": "Tail Whip",
                        "level": 23
                    }, {
                        "Move": "Bite",
                        "level": 32
                    }, {
                        "Move": "Fury Swipes",
                        "level": 41
                    }, {
                        "Move": "Double Kick",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 8
                    }, {
                        "Move": "Double Kick",
                        "level": 12
                    }, {
                        "Move": "Poison Sting",
                        "level": 19
                    }, {
                        "Move": "Tail Whip",
                        "level": 27
                    }, {
                        "Move": "Bite",
                        "level": 36
                    }, {
                        "Move": "Fury Swipes",
                        "level": 46
                    }]
                }
            }, "Nidorino": {
                "label": "Poison Pin",
                "sprite": "Water",
                "info": [
                    "An aggressive %%%%%%%POKEMON%%%%%%% that is quick to attack. The horn on its head secretes a powerful venom."
                ],
                "evolvesInto": "Nidoking",
                "evolvesVia": "use Moon Stone",
                "number": 33,
                "height": ["2", "11"],
                "weight": 43,
                "types": ["Poison"],
                "HP": 61,
                "Attack": 72,
                "Defense": 57,
                "Special": 55,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 8
                    }, {
                        "Move": "Poison Sting",
                        "level": 14
                    }, {
                        "Move": "Focus Energy",
                        "level": 23
                    }, {
                        "Move": "Fury Attack",
                        "level": 32
                    }, {
                        "Move": "Horn Drill",
                        "level": 41
                    }, {
                        "Move": "Double Kick",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 8
                    }, {
                        "Move": "Double Kick",
                        "level": 12
                    }, {
                        "Move": "Poison Sting",
                        "level": 19
                    }, {
                        "Move": "Focus Energy",
                        "level": 27
                    }, {
                        "Move": "Fury Attack",
                        "level": 36
                    }, {
                        "Move": "Horn Drill",
                        "level": 46
                    }]
                }
            }, "Ninetales": {
                "label": "Fox",
                "sprite": "Water",
                "info": [
                    "Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 38,
                "height": ["3", "7"],
                "weight": 43.9,
                "types": ["Fire"],
                "HP": 73,
                "Attack": 76,
                "Defense": 75,
                "Special": 81,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Roar",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Oddish": {
                "label": "Weed",
                "sprite": "Water",
                "info": [
                    "During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds."
                ],
                "evolvesInto": "Gloom",
                "evolvesVia": "Level 21",
                "number": 43,
                "height": ["1", "8"],
                "weight": 11.9,
                "types": ["Grass", "Poison"],
                "HP": 45,
                "Attack": 50,
                "Defense": 55,
                "Special": 75,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Absorb",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Stun Spore",
                        "level": 17
                    }, {
                        "Move": "Sleep Powder",
                        "level": 19
                    }, {
                        "Move": "Acid",
                        "level": 24
                    }, {
                        "Move": "Petal Dance",
                        "level": 33
                    }, {
                        "Move": "Solar Beam",
                        "level": 46
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Omanyte": {
                "label": "Spiral",
                "sprite": "Water",
                "info": [
                    "Although long extinct, in rare cases, it can be genetically resurrected from fossils."
                ],
                "evolvesInto": "Omastar",
                "evolvesVia": "Level 40",
                "number": 138,
                "height": ["1", "4"],
                "weight": 16.5,
                "types": ["Rock", "Water"],
                "HP": 35,
                "Attack": 40,
                "Defense": 100,
                "Special": 90,
                "Speed": 35,
                "moves": {
                    "natural": [{
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Withdraw",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 34
                    }, {
                        "Move": "Leer",
                        "level": 39
                    }, {
                        "Move": "Spike Cannon",
                        "level": 46
                    }, {
                        "Move": "Hydro Pump",
                        "level": 53
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Omastar": {
                "label": "Spiral",
                "sprite": "Water",
                "info": [
                    "A prehistoric %%%%%%%POKEMON%%%%%%% that died out when its heavy shell made it impossible to catch prey."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 139,
                "height": ["3", "3"],
                "weight": 77.2,
                "types": ["Rock", "Water"],
                "HP": 70,
                "Attack": 60,
                "Defense": 125,
                "Special": 115,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Withdraw",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 34
                    }, {
                        "Move": "Leer",
                        "level": 39
                    }, {
                        "Move": "Spike Cannon",
                        "level": 44
                    }, {
                        "Move": "Hydro Pump",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Onix": {
                "label": "Rock Snake",
                "sprite": "Water",
                "info": [
                    "As it grows, the stone portions of its body harden to become similar to a diamond, but colored black."
                ],
                "evolvesInto": "Steelix",
                "evolvesVia": "trade holdingMetal Coat",
                "number": 95,
                "height": ["28", "10"],
                "weight": 463,
                "types": ["Rock", "Ground"],
                "HP": 35,
                "Attack": 45,
                "Defense": 160,
                "Special": 30,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Bind",
                        "level": 15
                    }, {
                        "Move": "Rock Throw",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 25
                    }, {
                        "Move": "Slam",
                        "level": 33
                    }, {
                        "Move": "Harden",
                        "level": 43
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Paras": {
                "label": "Mushroom",
                "sprite": "Water",
                "info": [
                    "Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host."
                ],
                "evolvesInto": "Parasect",
                "evolvesVia": "Level 24",
                "number": 46,
                "height": ["1", "0"],
                "weight": 11.9,
                "types": ["Bug", "Grass"],
                "HP": 35,
                "Attack": 70,
                "Defense": 55,
                "Special": 45,
                "Speed": 25,
                "moves": {
                    "natural": [{
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 13
                    }, {
                        "Move": "Leech Life",
                        "level": 20
                    }, {
                        "Move": "Spore",
                        "level": 27
                    }, {
                        "Move": "Slash",
                        "level": 34
                    }, {
                        "Move": "Growth",
                        "level": 41
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Parasect": {
                "label": "Mushroom",
                "sprite": "Water",
                "info": [
                    "A host-parasite pair in which the parasite mushroom has taken over the host bug. Prefers damp places."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 47,
                "height": ["3", "3"],
                "weight": 65,
                "types": ["Bug", "Grass"],
                "HP": 60,
                "Attack": 95,
                "Defense": 80,
                "Special": 60,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 13
                    }, {
                        "Move": "Leech Life",
                        "level": 20
                    }, {
                        "Move": "Spore",
                        "level": 30
                    }, {
                        "Move": "Slash",
                        "level": 39
                    }, {
                        "Move": "Growth",
                        "level": 48
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Persian": {
                "label": "Classy Cat",
                "sprite": "Water",
                "info": [
                    "Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 53,
                "height": ["3", "3"],
                "weight": 70.5,
                "types": ["Normal"],
                "HP": 65,
                "Attack": 70,
                "Defense": 60,
                "Special": 65,
                "Speed": 115,
                "moves": {
                    "natural": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 12
                    }, {
                        "Move": "Pay Day",
                        "level": 17
                    }, {
                        "Move": "Screech",
                        "level": 24
                    }, {
                        "Move": "Fury Swipes",
                        "level": 37
                    }, {
                        "Move": "Slash",
                        "level": 51
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Bite",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Bite",
                        "level": 12
                    }, {
                        "Move": "Pay Day",
                        "level": 17
                    }, {
                        "Move": "Screech",
                        "level": 24
                    }, {
                        "Move": "Fury Swipes",
                        "level": 37
                    }, {
                        "Move": "Slash",
                        "level": 51
                    }]
                }
            }, "Pidgeot": {
                "label": "Bird",
                "sprite": "Water",
                "info": [
                    "When hunting, it skims the surface of water at high speed to pick off unwary prey such as MAGIKARP."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 18,
                "height": ["4", "11"],
                "weight": 87.1,
                "types": ["Normal", "Flying"],
                "HP": 83,
                "Attack": 80,
                "Defense": 75,
                "Special": 70,
                "Speed": 101,
                "moves": {
                    "natural": [{
                        "Move": "Gust",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 5
                    }, {
                        "Move": "Quick Attack",
                        "level": 12
                    }, {
                        "Move": "Whirlwind",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 31
                    }, {
                        "Move": "Agility",
                        "level": 44
                    }, {
                        "Move": "Mirror Move",
                        "level": 54
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Pidgeotto": {
                "label": "Bird",
                "sprite": "Water",
                "info": [
                    "Very protective of its sprawling territorial area, this %%%%%%%POKEMON%%%%%%% will fiercely peck at any intruder."
                ],
                "evolvesInto": "Pidgeot",
                "evolvesVia": "Level 36",
                "number": 17,
                "height": ["3", "7"],
                "weight": 66.1,
                "types": ["Normal", "Flying"],
                "HP": 63,
                "Attack": 60,
                "Defense": 55,
                "Special": 50,
                "Speed": 71,
                "moves": {
                    "natural": [{
                        "Move": "Gust",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 5
                    }, {
                        "Move": "Quick Attack",
                        "level": 12
                    }, {
                        "Move": "Whirlwind",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 31
                    }, {
                        "Move": "Agility",
                        "level": 40
                    }, {
                        "Move": "Mirror Move",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Pidgey": {
                "label": "Tiny Bird",
                "sprite": "Water",
                "info": [
                    "A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand."
                ],
                "evolvesInto": "Pidgeotto",
                "evolvesVia": "Level 18",
                "number": 16,
                "height": ["1", "0"],
                "weight": 4,
                "types": ["Normal", "Flying"],
                "HP": 40,
                "Attack": 45,
                "Defense": 40,
                "Special": 35,
                "Speed": 56,
                "moves": {
                    "natural": [{
                        "Move": "Gust",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 5
                    }, {
                        "Move": "Quick Attack",
                        "level": 12
                    }, {
                        "Move": "Whirlwind",
                        "level": 19
                    }, {
                        "Move": "Wing Attack",
                        "level": 28
                    }, {
                        "Move": "Agility",
                        "level": 36
                    }, {
                        "Move": "Mirror Move",
                        "level": 44
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Pikachu": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "When several of these %%%%%%%POKEMON%%%%%%% gather, their electricity could build and cause lightning storms."
                ],
                "evolvesInto": "Raichu",
                "evolvesVia": "use Thunderstone",
                "number": 25,
                "height": ["1", "4"],
                "weight": 13.2,
                "types": ["Electric"],
                "HP": 35,
                "Attack": 55,
                "Defense": 40,
                "Special": 50,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 9
                    }, {
                        "Move": "Quick Attack",
                        "level": 16
                    }, {
                        "Move": "Swift",
                        "level": 26
                    }, {
                        "Move": "Agility",
                        "level": 33
                    }, {
                        "Move": "Thunder",
                        "level": 43
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Pinsir": {
                "label": "Stag Beetle",
                "sprite": "Water",
                "info": [
                    "If it fails to crush the victim in its pincers, it will swing it around and toss it hard."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 127,
                "height": ["4", "11"],
                "weight": 121.3,
                "types": ["Bug"],
                "HP": 65,
                "Attack": 125,
                "Defense": 100,
                "Special": 55,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Vice Grip",
                        "level": 1
                    }, {
                        "Move": "Seismic Toss",
                        "level": 25
                    }, {
                        "Move": "Guillotine",
                        "level": 30
                    }, {
                        "Move": "Focus Energy",
                        "level": 36
                    }, {
                        "Move": "Harden",
                        "level": 43
                    }, {
                        "Move": "Slash",
                        "level": 49
                    }, {
                        "Move": "Swords Dance",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Poliwag": {
                "label": "Tadpole",
                "sprite": "Water",
                "info": [
                    "Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand."
                ],
                "evolvesInto": "Poliwhirl",
                "evolvesVia": "Level 25",
                "number": 60,
                "height": ["2", "0"],
                "weight": 27.3,
                "types": ["Water"],
                "HP": 40,
                "Attack": 50,
                "Defense": 40,
                "Special": 40,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 16
                    }, {
                        "Move": "Water Gun",
                        "level": 19
                    }, {
                        "Move": "Double Slap",
                        "level": 25
                    }, {
                        "Move": "Body Slam",
                        "level": 31
                    }, {
                        "Move": "Amnesia",
                        "level": 38
                    }, {
                        "Move": "Hydro Pump",
                        "level": 45
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Poliwhirl": {
                "label": "Tadpole",
                "sprite": "Water",
                "info": [
                    "Capable of living in or out of water. When out of water, it sweats to keep its body slimy."
                ],
                "evolvesInto": "Poliwrath",
                "evolvesVia": "↗",
                "number": 61,
                "height": ["3", "3"],
                "weight": 44.1,
                "types": ["Water"],
                "HP": 65,
                "Attack": 65,
                "Defense": 65,
                "Special": 50,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 16
                    }, {
                        "Move": "Water Gun",
                        "level": 19
                    }, {
                        "Move": "Double Slap",
                        "level": 26
                    }, {
                        "Move": "Body Slam",
                        "level": 33
                    }, {
                        "Move": "Amnesia",
                        "level": 41
                    }, {
                        "Move": "Hydro Pump",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Poliwrath": {
                "label": "Tadpole",
                "sprite": "Water",
                "info": [
                    "An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers."
                ],
                "evolvesInto": "Politoed",
                "evolvesVia": "trade holdingKing's Rock",
                "number": 62,
                "height": ["4", "3"],
                "weight": 119,
                "types": ["Water", "Fighting"],
                "HP": 90,
                "Attack": 95,
                "Defense": 95,
                "Special": 70,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Body Slam",
                        "level": 1
                    }, {
                        "Move": "Double Slap",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Hypnosis",
                        "level": 16
                    }, {
                        "Move": "Water Gun",
                        "level": 19
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }]
                }
            }, "Ponyta": {
                "label": "Fire Horse",
                "sprite": "Water",
                "info": [
                    "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time."
                ],
                "evolvesInto": "Rapidash",
                "evolvesVia": "Level 40",
                "number": 77,
                "height": ["3", "3"],
                "weight": 66.1,
                "types": ["Fire"],
                "HP": 50,
                "Attack": 85,
                "Defense": 55,
                "Special": 65,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 30
                    }, {
                        "Move": "Stomp",
                        "level": 32
                    }, {
                        "Move": "Growl",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 39
                    }, {
                        "Move": "Take Down",
                        "level": 43
                    }, {
                        "Move": "Agility",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 30
                    }, {
                        "Move": "Stomp",
                        "level": 32
                    }, {
                        "Move": "Growl",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 39
                    }, {
                        "Move": "Take Down",
                        "level": 43
                    }, {
                        "Move": "Agility",
                        "level": 48
                    }]
                }
            }, "Porygon": {
                "label": "Virtual",
                "sprite": "Water",
                "info": [
                    "A %%%%%%%POKEMON%%%%%%% that consists entirely of programming code. Capable of moving freely in cyberspace."
                ],
                "evolvesInto": "Porygon2",
                "evolvesVia": "trade holdingUp-Grade",
                "number": 137,
                "height": ["2", "7"],
                "weight": 80.5,
                "types": ["Normal"],
                "HP": 65,
                "Attack": 60,
                "Defense": 70,
                "Special": 85,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Conversion",
                        "level": 1
                    }, {
                        "Move": "Sharpen",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Psybeam",
                        "level": 23
                    }, {
                        "Move": "Recover",
                        "level": 28
                    }, {
                        "Move": "Agility",
                        "level": 35
                    }, {
                        "Move": "Tri Attack",
                        "level": 42
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Primeape": {
                "label": "Pig Monkey",
                "sprite": "Water",
                "info": [
                    "Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 57,
                "height": ["3", "3"],
                "weight": 70.5,
                "types": ["Fighting"],
                "HP": 65,
                "Attack": 105,
                "Defense": 60,
                "Special": 60,
                "Speed": 95,
                "moves": {
                    "natural": [{
                        "Move": "Fury Swipes",
                        "level": 1
                    }, {
                        "Move": "Karate Chop",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Karate Chop",
                        "level": 15
                    }, {
                        "Move": "Fury Swipes",
                        "level": 21
                    }, {
                        "Move": "Focus Energy",
                        "level": 27
                    }, {
                        "Move": "Seismic Toss",
                        "level": 37
                    }, {
                        "Move": "Thrash",
                        "level": 46
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Psyduck": {
                "label": "Duck",
                "sprite": "Water",
                "info": [
                    "While lulling its enemies with its vacant look, this wily %%%%%%%POKEMON%%%%%%% will use psychokinetic powers."
                ],
                "evolvesInto": "Golduck",
                "evolvesVia": "Level 33",
                "number": 54,
                "height": ["2", "7"],
                "weight": 43.2,
                "types": ["Water"],
                "HP": 50,
                "Attack": 52,
                "Defense": 48,
                "Special": 65,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 28
                    }, {
                        "Move": "Disable",
                        "level": 31
                    }, {
                        "Move": "Confusion",
                        "level": 36
                    }, {
                        "Move": "Fury Swipes",
                        "level": 43
                    }, {
                        "Move": "Hydro Pump",
                        "level": 52
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Raichu": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "Its long tail serves as a ground to protect itself from its own high voltage power."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 26,
                "height": ["2", "7"],
                "weight": 66.1,
                "types": ["Electric"],
                "HP": 60,
                "Attack": 90,
                "Defense": 55,
                "Special": 90,
                "Speed": 110,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 1
                    }, {
                        "Move": "Thunder Wave",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Flash",
                        "level": 5
                    }]
                }
            }, "Rapidash": {
                "label": "Fire Horse",
                "sprite": "Water",
                "info": [
                    "Very competitive, this %%%%%%%POKEMON%%%%%%% will chase anything that moves fast in the hopes of racing it."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 78,
                "height": ["5", "7"],
                "weight": 209.4,
                "types": ["Fire"],
                "HP": 65,
                "Attack": 100,
                "Defense": 70,
                "Special": 80,
                "Speed": 105,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 30
                    }, {
                        "Move": "Stomp",
                        "level": 32
                    }, {
                        "Move": "Growl",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 39
                    }, {
                        "Move": "Take Down",
                        "level": 47
                    }, {
                        "Move": "Agility",
                        "level": 55
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 30
                    }, {
                        "Move": "Stomp",
                        "level": 32
                    }, {
                        "Move": "Growl",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 39
                    }, {
                        "Move": "Take Down",
                        "level": 47
                    }, {
                        "Move": "Agility",
                        "level": 55
                    }]
                }
            }, "Raticate": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "It uses its whiskers to maintain its balance. It apparently slows down if they are cut off."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 20,
                "height": ["2", "4"],
                "weight": 40.8,
                "types": ["Normal"],
                "HP": 55,
                "Attack": 81,
                "Defense": 60,
                "Special": 50,
                "Speed": 97,
                "moves": {
                    "natural": [{
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 7
                    }, {
                        "Move": "Hyper Fang",
                        "level": 14
                    }, {
                        "Move": "Focus Energy",
                        "level": 27
                    }, {
                        "Move": "Super Fang",
                        "level": 41
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 7
                    }, {
                        "Move": "Hyper Fang",
                        "level": 14
                    }, {
                        "Move": "Focus Energy",
                        "level": 27
                    }, {
                        "Move": "Super Fang",
                        "level": 41
                    }]
                }
            }, "Rattata": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "Bites anything when it attacks. Small and very quick, it is a common sight in many places."
                ],
                "evolvesInto": "Raticate",
                "evolvesVia": "Level 20",
                "number": 19,
                "height": ["1", "0"],
                "weight": 7.7,
                "types": ["Normal"],
                "HP": 30,
                "Attack": 56,
                "Defense": 35,
                "Special": 25,
                "Speed": 72,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 7
                    }, {
                        "Move": "Hyper Fang",
                        "level": 14
                    }, {
                        "Move": "Focus Energy",
                        "level": 23
                    }, {
                        "Move": "Super Fang",
                        "level": 34
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 7
                    }, {
                        "Move": "Hyper Fang",
                        "level": 14
                    }, {
                        "Move": "Focus Energy",
                        "level": 23
                    }, {
                        "Move": "Super Fang",
                        "level": 34
                    }]
                }
            }, "Rhydon": {
                "label": "Drill",
                "sprite": "Water",
                "info": [
                    "Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees."
                ],
                "evolvesInto": "Rhyperior",
                "evolvesVia": "trade holdingProtector",
                "number": 112,
                "height": ["6", "3"],
                "weight": 264.6,
                "types": ["Ground", "Rock"],
                "HP": 105,
                "Attack": 130,
                "Defense": 120,
                "Special": 45,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Fury Attack",
                        "level": 1
                    }, {
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 30
                    }, {
                        "Move": "Tail Whip",
                        "level": 35
                    }, {
                        "Move": "Fury Attack",
                        "level": 40
                    }, {
                        "Move": "Horn Drill",
                        "level": 48
                    }, {
                        "Move": "Leer",
                        "level": 55
                    }, {
                        "Move": "Take Down",
                        "level": 64
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Rhyhorn": {
                "label": "Spikes",
                "sprite": "Water",
                "info": [
                    "Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying."
                ],
                "evolvesInto": "Rhydon",
                "evolvesVia": "Level 42",
                "number": 111,
                "height": ["3", "3"],
                "weight": 253.5,
                "types": ["Ground", "Rock"],
                "HP": 80,
                "Attack": 85,
                "Defense": 95,
                "Special": 30,
                "Speed": 25,
                "moves": {
                    "natural": [{
                        "Move": "Horn Attack",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 30
                    }, {
                        "Move": "Tail Whip",
                        "level": 35
                    }, {
                        "Move": "Fury Attack",
                        "level": 40
                    }, {
                        "Move": "Horn Drill",
                        "level": 45
                    }, {
                        "Move": "Leer",
                        "level": 50
                    }, {
                        "Move": "Take Down",
                        "level": 55
                    }],
                    "hm": [{
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Sandshrew": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "Burrows deep underground in arid locations far from water. It only emerges to hunt for food."
                ],
                "evolvesInto": "Sandslash",
                "evolvesVia": "Level 22",
                "number": 27,
                "height": ["2", "0"],
                "weight": 26.5,
                "types": ["Ground"],
                "HP": 50,
                "Attack": 75,
                "Defense": 85,
                "Special": 20,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 10
                    }, {
                        "Move": "Slash",
                        "level": 17
                    }, {
                        "Move": "Poison Sting",
                        "level": 24
                    }, {
                        "Move": "Swift",
                        "level": 31
                    }, {
                        "Move": "Fury Swipes",
                        "level": 38
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Sandslash": {
                "label": "Mouse",
                "sprite": "Water",
                "info": [
                    "Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 28,
                "height": ["3", "3"],
                "weight": 65,
                "types": ["Ground"],
                "HP": 75,
                "Attack": 100,
                "Defense": 110,
                "Special": 45,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Scratch",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 10
                    }, {
                        "Move": "Slash",
                        "level": 17
                    }, {
                        "Move": "Poison Sting",
                        "level": 27
                    }, {
                        "Move": "Swift",
                        "level": 36
                    }, {
                        "Move": "Fury Swipes",
                        "level": 47
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Scyther": {
                "label": "Mantis",
                "sprite": "Water",
                "info": [
                    "With ninja-like agility and speed, it can create the illusion that there is more than one."
                ],
                "evolvesInto": "Scizor",
                "evolvesVia": "trade holdingMetal Coat",
                "number": 123,
                "height": ["4", "11"],
                "weight": 123.5,
                "types": ["Bug", "Flying"],
                "HP": 70,
                "Attack": 110,
                "Defense": 80,
                "Special": 55,
                "Speed": 105,
                "moves": {
                    "natural": [{
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 17
                    }, {
                        "Move": "Focus Energy",
                        "level": 20
                    }, {
                        "Move": "Double Team",
                        "level": 24
                    }, {
                        "Move": "Slash",
                        "level": 29
                    }, {
                        "Move": "Swords Dance",
                        "level": 35
                    }, {
                        "Move": "Agility",
                        "level": 42
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Seadra": {
                "label": "Dragon",
                "sprite": "Water",
                "info": [
                    "Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail."
                ],
                "evolvesInto": "Kingdra",
                "evolvesVia": "trade holdingDragon Scale",
                "number": 117,
                "height": ["3", "11"],
                "weight": 55.1,
                "types": ["Water"],
                "HP": 55,
                "Attack": 65,
                "Defense": 95,
                "Special": 95,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Smokescreen",
                        "level": 1
                    }, {
                        "Move": "Smokescreen",
                        "level": 19
                    }, {
                        "Move": "Leer",
                        "level": 24
                    }, {
                        "Move": "Water Gun",
                        "level": 30
                    }, {
                        "Move": "Agility",
                        "level": 41
                    }, {
                        "Move": "Hydro Pump",
                        "level": 52
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Seaking": {
                "label": "Goldfish",
                "sprite": "Water",
                "info": [
                    "In the autumn spawning season, they can be seen swimming powerfully up rivers and creeks."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 119,
                "height": ["4", "3"],
                "weight": 86,
                "types": ["Water"],
                "HP": 80,
                "Attack": 92,
                "Defense": 65,
                "Special": 65,
                "Speed": 68,
                "moves": {
                    "natural": [{
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 19
                    }, {
                        "Move": "Horn Attack",
                        "level": 24
                    }, {
                        "Move": "Fury Attack",
                        "level": 30
                    }, {
                        "Move": "Waterfall",
                        "level": 39
                    }, {
                        "Move": "Horn Drill",
                        "level": 48
                    }, {
                        "Move": "Agility",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Seel": {
                "label": "Sea Lion",
                "sprite": "Water",
                "info": [
                    "The protruding horn on its head is very hard. It is used for bashing through thick ice."
                ],
                "evolvesInto": "Dewgong",
                "evolvesVia": "Level 34",
                "number": 86,
                "height": ["3", "7"],
                "weight": 198.4,
                "types": ["Water"],
                "HP": 65,
                "Attack": 45,
                "Defense": 55,
                "Special": 45,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Headbutt",
                        "level": 1
                    }, {
                        "Move": "Growl",
                        "level": 30
                    }, {
                        "Move": "Aurora Beam",
                        "level": 35
                    }, {
                        "Move": "Rest",
                        "level": 40
                    }, {
                        "Move": "Take Down",
                        "level": 45
                    }, {
                        "Move": "Ice Beam",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Shellder": {
                "label": "Bivalve",
                "sprite": "Water",
                "info": [
                    "Its hard shell repels any kind of attack. It is vulnerable only when its shell is open."
                ],
                "evolvesInto": "Cloyster",
                "evolvesVia": "use Water Stone",
                "number": 90,
                "height": ["1", "0"],
                "weight": 8.8,
                "types": ["Water"],
                "HP": 30,
                "Attack": 65,
                "Defense": 100,
                "Special": 45,
                "Speed": 40,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Withdraw",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 18
                    }, {
                        "Move": "Clamp",
                        "level": 23
                    }, {
                        "Move": "Aurora Beam",
                        "level": 30
                    }, {
                        "Move": "Leer",
                        "level": 39
                    }, {
                        "Move": "Ice Beam",
                        "level": 50
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Slowbro": {
                "label": "Hermit Crab",
                "sprite": "Water",
                "info": [
                    "The SHELLDER that is latched onto SLOWPOKE's tail is said to feed on the host's left over scraps."
                ],
                "evolvesInto": "Slowking",
                "evolvesVia": "trade holdingKing's Rock",
                "number": 80,
                "height": ["5", "3"],
                "weight": 173.1,
                "types": ["Water", "Psychic"],
                "HP": 95,
                "Attack": 75,
                "Defense": 110,
                "Special": 100,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Headbutt",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 18
                    }, {
                        "Move": "Headbutt",
                        "level": 22
                    }, {
                        "Move": "Growl",
                        "level": 27
                    }, {
                        "Move": "Water Gun",
                        "level": 33
                    }, {
                        "Move": "Withdraw",
                        "level": 37
                    }, {
                        "Move": "Amnesia",
                        "level": 44
                    }, {
                        "Move": "Psychic",
                        "level": 55
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Slowpoke": {
                "label": "Dopey",
                "sprite": "Water",
                "info": [
                    "Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack."
                ],
                "evolvesInto": "Slowbro",
                "evolvesVia": "↗",
                "number": 79,
                "height": ["3", "11"],
                "weight": 79.4,
                "types": ["Water", "Psychic"],
                "HP": 90,
                "Attack": 65,
                "Defense": 65,
                "Special": 40,
                "Speed": 15,
                "moves": {
                    "natural": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 18
                    }, {
                        "Move": "Headbutt",
                        "level": 22
                    }, {
                        "Move": "Growl",
                        "level": 27
                    }, {
                        "Move": "Water Gun",
                        "level": 33
                    }, {
                        "Move": "Amnesia",
                        "level": 40
                    }, {
                        "Move": "Psychic",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Snorlax": {
                "label": "Sleeping",
                "sprite": "Water",
                "info": [
                    "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 143,
                "height": ["6", "11"],
                "weight": 1014.1,
                "types": ["Normal"],
                "HP": 160,
                "Attack": 110,
                "Defense": 65,
                "Special": 65,
                "Speed": 30,
                "moves": {
                    "natural": [{
                        "Move": "Amnesia",
                        "level": 1
                    }, {
                        "Move": "Headbutt",
                        "level": 1
                    }, {
                        "Move": "Rest",
                        "level": 1
                    }, {
                        "Move": "Body Slam",
                        "level": 35
                    }, {
                        "Move": "Harden",
                        "level": 41
                    }, {
                        "Move": "Double-Edge",
                        "level": 48
                    }, {
                        "Move": "Hyper Beam",
                        "level": 56
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Strength",
                        "level": 4
                    }],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Pay Day",
                        "level": 16
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Metronome",
                        "level": 35
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Rock Slide",
                        "level": 48
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Spearow": {
                "label": "Tiny Bird",
                "sprite": "Water",
                "info": [
                    "Eats bugs in grassy areas. It has to flap its short wings at high speed to stay airborne."
                ],
                "evolvesInto": "Fearow",
                "evolvesVia": "Level 20",
                "number": 21,
                "height": ["1", "0"],
                "weight": 4.4,
                "types": ["Normal", "Flying"],
                "HP": 40,
                "Attack": 60,
                "Defense": 30,
                "Special": 31,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Peck",
                        "level": 1
                    }, {
                        "Move": "Leer",
                        "level": 9
                    }, {
                        "Move": "Fury Attack",
                        "level": 15
                    }, {
                        "Move": "Mirror Move",
                        "level": 22
                    }, {
                        "Move": "Drill Peck",
                        "level": 29
                    }, {
                        "Move": "Agility",
                        "level": 36
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Squirtle": {
                "label": "TinyTurtle",
                "sprite": "Water",
                "info": [
                    "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth."
                ],
                "evolvesInto": "Wartortle",
                "evolvesVia": "Level 16",
                "number": 7,
                "height": ["1", "8"],
                "weight": 19.8,
                "types": ["Water"],
                "HP": 44,
                "Attack": 48,
                "Defense": 65,
                "Special": 50,
                "Speed": 43,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Bubble",
                        "level": 8
                    }, {
                        "Move": "Water Gun",
                        "level": 15
                    }, {
                        "Move": "Bite",
                        "level": 22
                    }, {
                        "Move": "Withdraw",
                        "level": 28
                    }, {
                        "Move": "Skull Bash",
                        "level": 35
                    }, {
                        "Move": "Hydro Pump",
                        "level": 42
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Starmie": {
                "label": "Mysterious",
                "sprite": "Water",
                "info": [
                    "Its central core glows with the seven colors of the rainbow. Some people value the core as a gem."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 121,
                "height": ["3", "7"],
                "weight": 176.4,
                "types": ["Water", "Psychic"],
                "HP": 60,
                "Attack": 75,
                "Defense": 85,
                "Special": 100,
                "Speed": 115,
                "moves": {
                    "natural": [{
                        "Move": "Harden",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }]
                }
            }, "Staryu": {
                "label": "Star Shape",
                "sprite": "Water",
                "info": [
                    "An enigmatic %%%%%%%POKEMON%%%%%%% that can effortlessly regenerate any appendage it loses in battle."
                ],
                "evolvesInto": "Starmie",
                "evolvesVia": "use Water Stone",
                "number": 120,
                "height": ["2", "7"],
                "weight": 76.1,
                "types": ["Water"],
                "HP": 30,
                "Attack": 45,
                "Defense": 55,
                "Special": 70,
                "Speed": 85,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 17
                    }, {
                        "Move": "Harden",
                        "level": 22
                    }, {
                        "Move": "Recover",
                        "level": 27
                    }, {
                        "Move": "Swift",
                        "level": 32
                    }, {
                        "Move": "Minimize",
                        "level": 37
                    }, {
                        "Move": "Light Screen",
                        "level": 42
                    }, {
                        "Move": "Hydro Pump",
                        "level": 47
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Tri Attack",
                        "level": 49
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Tangela": {
                "label": "Vine",
                "sprite": "Water",
                "info": [
                    "The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks."
                ],
                "evolvesInto": "Tangrowth",
                "evolvesVia": "after AncientPowerlearned",
                "number": 114,
                "height": ["3", "3"],
                "weight": 77.2,
                "types": ["Grass"],
                "HP": 65,
                "Attack": 55,
                "Defense": 115,
                "Special": 100,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Bind",
                        "level": 1
                    }, {
                        "Move": "Constrict",
                        "level": 1
                    }, {
                        "Move": "Absorb",
                        "level": 29
                    }, {
                        "Move": "Poison Powder",
                        "level": 32
                    }, {
                        "Move": "Stun Spore",
                        "level": 36
                    }, {
                        "Move": "Sleep Powder",
                        "level": 39
                    }, {
                        "Move": "Slam",
                        "level": 45
                    }, {
                        "Move": "Growth",
                        "level": 49
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Tauros": {
                "label": "Wild Bull",
                "sprite": "Water",
                "info": [
                    "When it targets an enemy, it charges furiously while whipping its body with its long tails."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 128,
                "height": ["4", "7"],
                "weight": 194.9,
                "types": ["Normal"],
                "HP": 75,
                "Attack": 100,
                "Defense": 95,
                "Special": 40,
                "Speed": 110,
                "moves": {
                    "natural": [{
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Stomp",
                        "level": 21
                    }, {
                        "Move": "Tail Whip",
                        "level": 28
                    }, {
                        "Move": "Leer",
                        "level": 35
                    }, {
                        "Move": "Rage",
                        "level": 44
                    }, {
                        "Move": "Take Down",
                        "level": 51
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Horn Drill",
                        "level": 7
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Earthquake",
                        "level": 26
                    }, {
                        "Move": "Fissure",
                        "level": 27
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Tentacool": {
                "label": "Jellyfish",
                "sprite": "Water",
                "info": [
                    "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid."
                ],
                "evolvesInto": "Tentacruel",
                "evolvesVia": "Level 30",
                "number": 72,
                "height": ["2", "11"],
                "weight": 100.3,
                "types": ["Water", "Poison"],
                "HP": 40,
                "Attack": 40,
                "Defense": 35,
                "Special": 50,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Acid",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 7
                    }, {
                        "Move": "Wrap",
                        "level": 13
                    }, {
                        "Move": "Poison Sting",
                        "level": 18
                    }, {
                        "Move": "Water Gun",
                        "level": 22
                    }, {
                        "Move": "Constrict",
                        "level": 27
                    }, {
                        "Move": "Barrier",
                        "level": 33
                    }, {
                        "Move": "Screech",
                        "level": 40
                    }, {
                        "Move": "Hydro Pump",
                        "level": 48
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Tentacruel": {
                "label": "Jellyfish",
                "sprite": "Water",
                "info": [
                    "The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 73,
                "height": ["5", "3"],
                "weight": 121.3,
                "types": ["Water", "Poison"],
                "HP": 80,
                "Attack": 70,
                "Defense": 65,
                "Special": 80,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Acid",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 7
                    }, {
                        "Move": "Wrap",
                        "level": 13
                    }, {
                        "Move": "Poison Sting",
                        "level": 18
                    }, {
                        "Move": "Water Gun",
                        "level": 22
                    }, {
                        "Move": "Constrict",
                        "level": 27
                    }, {
                        "Move": "Barrier",
                        "level": 35
                    }, {
                        "Move": "Screech",
                        "level": 43
                    }, {
                        "Move": "Hydro Pump",
                        "level": 50
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }, {
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Vaporeon": {
                "label": "Bubble Jet",
                "sprite": "Water",
                "info": [
                    "Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid's."
                ],
                "evolvesInto": "Jolteon",
                "evolvesVia": "↖",
                "number": 134,
                "height": ["3", "3"],
                "weight": 63.9,
                "types": ["Water"],
                "HP": 130,
                "Attack": 65,
                "Defense": 60,
                "Special": 110,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Quick Attack",
                        "level": 1
                    }, {
                        "Move": "Sand Attack",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Water Gun",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 27
                    }, {
                        "Move": "Water Gun",
                        "level": 31
                    }, {
                        "Move": "Tail Whip",
                        "level": 37
                    }, {
                        "Move": "Bite",
                        "level": 40
                    }, {
                        "Move": "Acid Armor",
                        "level": 42
                    }, {
                        "Move": "Haze",
                        "level": 44
                    }, {
                        "Move": "Mist",
                        "level": 48
                    }, {
                        "Move": "Hydro Pump",
                        "level": 54
                    }],
                    "hm": [{
                        "Move": "Surf",
                        "level": 3
                    }],
                    "tm": [{
                        "Move": "Surf",
                        "level": 3
                    }]
                }
            }, "Venomoth": {
                "label": "Poison Moth",
                "sprite": "Water",
                "info": [
                    "The dust-like scales covering its wings are color coded to indicate the kinds of poison it has."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 49,
                "height": ["4", "11"],
                "weight": 27.6,
                "types": ["Bug", "Poison"],
                "HP": 70,
                "Attack": 65,
                "Defense": 60,
                "Special": 90,
                "Speed": 90,
                "moves": {
                    "natural": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 24
                    }, {
                        "Move": "Leech Life",
                        "level": 27
                    }, {
                        "Move": "Stun Spore",
                        "level": 30
                    }, {
                        "Move": "Psybeam",
                        "level": 38
                    }, {
                        "Move": "Sleep Powder",
                        "level": 43
                    }, {
                        "Move": "Psychic",
                        "level": 50
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Confusion",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 22
                    }, {
                        "Move": "Leech Life",
                        "level": 27
                    }, {
                        "Move": "Stun Spore",
                        "level": 30
                    }, {
                        "Move": "Psybeam",
                        "level": 38
                    }, {
                        "Move": "Sleep Powder",
                        "level": 43
                    }, {
                        "Move": "Psychic",
                        "level": 50
                    }]
                }
            }, "Venonat": {
                "label": "Insect",
                "sprite": "Water",
                "info": [
                    "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night."
                ],
                "evolvesInto": "Venomoth",
                "evolvesVia": "Level 31",
                "number": 48,
                "height": ["3", "3"],
                "weight": 66.1,
                "types": ["Bug", "Poison"],
                "HP": 60,
                "Attack": 55,
                "Defense": 50,
                "Special": 40,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 24
                    }, {
                        "Move": "Leech Life",
                        "level": 27
                    }, {
                        "Move": "Stun Spore",
                        "level": 30
                    }, {
                        "Move": "Psybeam",
                        "level": 35
                    }, {
                        "Move": "Sleep Powder",
                        "level": 38
                    }, {
                        "Move": "Psychic",
                        "level": 43
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Psychic",
                        "level": 29
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Psywave",
                        "level": 46
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 11
                    }, {
                        "Move": "Confusion",
                        "level": 19
                    }, {
                        "Move": "Poison Powder",
                        "level": 22
                    }, {
                        "Move": "Leech Life",
                        "level": 27
                    }, {
                        "Move": "Stun Spore",
                        "level": 30
                    }, {
                        "Move": "Psybeam",
                        "level": 35
                    }, {
                        "Move": "Sleep Powder",
                        "level": 38
                    }, {
                        "Move": "Psychic",
                        "level": 43
                    }]
                }
            }, "Venusaur": {
                "label": "Seed",
                "sprite": "Water",
                "info": [
                    "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 3,
                "height": ["6", "7"],
                "weight": 220.5,
                "types": ["Grass", "Poison"],
                "HP": 80,
                "Attack": 82,
                "Defense": 83,
                "Special": 100,
                "Speed": 80,
                "moves": {
                    "natural": [{
                        "Move": "Growl",
                        "level": 1
                    }, {
                        "Move": "Leech Seed",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Vine Whip",
                        "level": 1
                    }, {
                        "Move": "Leech Seed",
                        "level": 7
                    }, {
                        "Move": "Vine Whip",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 22
                    }, {
                        "Move": "Razor Leaf",
                        "level": 30
                    }, {
                        "Move": "Growth",
                        "level": 43
                    }, {
                        "Move": "Sleep Powder",
                        "level": 55
                    }, {
                        "Move": "Solar Beam",
                        "level": 65
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Victreebel": {
                "label": "Flycatcher",
                "sprite": "Water",
                "info": [
                    "Said to live in huge colonies deep in jungles, although no one has ever returned from there."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 71,
                "height": ["5", "7"],
                "weight": 34.2,
                "types": ["Grass", "Poison"],
                "HP": 80,
                "Attack": 105,
                "Defense": 65,
                "Special": 100,
                "Speed": 70,
                "moves": {
                    "natural": [{
                        "Move": "Acid",
                        "level": 1
                    }, {
                        "Move": "Razor Leaf",
                        "level": 1
                    }, {
                        "Move": "Sleep Powder",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Sleep Powder",
                        "level": 18
                    }],
                    "hm": [{
                        "Move": "Cut",
                        "level": 1
                    }],
                    "tm": [{
                        "Move": "Cut",
                        "level": 1
                    }]
                }
            }, "Vileplume": {
                "label": "Flower",
                "sprite": "Water",
                "info": [
                    "The larger its petals, the more toxic pollen it contains. Its big head is heavy and hard to hold up."
                ],
                "evolvesInto": "Bellossom",
                "evolvesVia": "use Sun Stone",
                "number": 45,
                "height": ["3", "11"],
                "weight": 41,
                "types": ["Grass", "Poison"],
                "HP": 75,
                "Attack": 80,
                "Defense": 85,
                "Special": 110,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Acid",
                        "level": 1
                    }, {
                        "Move": "Petal Dance",
                        "level": 1
                    }, {
                        "Move": "Sleep Powder",
                        "level": 1
                    }, {
                        "Move": "Stun Spore",
                        "level": 1
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Stun Spore",
                        "level": 17
                    }, {
                        "Move": "Sleep Powder",
                        "level": 19
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Cut",
                        "level": 1
                    }]
                }
            }, "Voltorb": {
                "label": "Ball",
                "sprite": "Water",
                "info": [
                    "Usually found in power plants. Easily mistaken for a POKÃ© BALL, they have zapped many people."
                ],
                "evolvesInto": "Electrode",
                "evolvesVia": "Level 30",
                "number": 100,
                "height": ["1", "8"],
                "weight": 22.9,
                "types": ["Electric"],
                "HP": 40,
                "Attack": 30,
                "Defense": 50,
                "Special": 55,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Screech",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sonic Boom",
                        "level": 17
                    }, {
                        "Move": "Self-Destruct",
                        "level": 22
                    }, {
                        "Move": "Light Screen",
                        "level": 29
                    }, {
                        "Move": "Swift",
                        "level": 36
                    }, {
                        "Move": "Explosion",
                        "level": 43
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Teleport",
                        "level": 30
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Vulpix": {
                "label": "Fox",
                "sprite": "Water",
                "info": [
                    "At the time of birth, it has just one tail. The tail splits from its tip as it grows older."
                ],
                "evolvesInto": "Ninetales",
                "evolvesVia": "use Fire Stone",
                "number": 37,
                "height": ["2", "0"],
                "weight": 21.8,
                "types": ["Fire"],
                "HP": 38,
                "Attack": 41,
                "Defense": 40,
                "Special": 50,
                "Speed": 65,
                "moves": {
                    "natural": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 16
                    }, {
                        "Move": "Roar",
                        "level": 21
                    }, {
                        "Move": "Confuse Ray",
                        "level": 28
                    }, {
                        "Move": "Flamethrower",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 42
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Ember",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Quick Attack",
                        "level": 16
                    }, {
                        "Move": "Roar",
                        "level": 21
                    }, {
                        "Move": "Confuse Ray",
                        "level": 28
                    }, {
                        "Move": "Flamethrower",
                        "level": 35
                    }, {
                        "Move": "Fire Spin",
                        "level": 42
                    }]
                }
            }, "Wartortle": {
                "label": "Turtle",
                "sprite": "Water",
                "info": [
                    "Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance."
                ],
                "evolvesInto": "Blastoise",
                "evolvesVia": "Level 36",
                "number": 8,
                "height": ["3", "3"],
                "weight": 49.6,
                "types": ["Water"],
                "HP": 59,
                "Attack": 63,
                "Defense": 80,
                "Special": 65,
                "Speed": 58,
                "moves": {
                    "natural": [{
                        "Move": "Bubble",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Tail Whip",
                        "level": 1
                    }, {
                        "Move": "Bubble",
                        "level": 8
                    }, {
                        "Move": "Water Gun",
                        "level": 15
                    }, {
                        "Move": "Bite",
                        "level": 24
                    }, {
                        "Move": "Withdraw",
                        "level": 31
                    }, {
                        "Move": "Skull Bash",
                        "level": 39
                    }, {
                        "Move": "Hydro Pump",
                        "level": 47
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Mega Punch",
                        "level": 1
                    }, {
                        "Move": "Mega Kick",
                        "level": 5
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Body Slam",
                        "level": 8
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Bubble Beam",
                        "level": 11
                    }, {
                        "Move": "Water Gun",
                        "level": 12
                    }, {
                        "Move": "Ice Beam",
                        "level": 13
                    }, {
                        "Move": "Blizzard",
                        "level": 14
                    }, {
                        "Move": "Submission",
                        "level": 17
                    }, {
                        "Move": "Counter",
                        "level": 18
                    }, {
                        "Move": "Seismic Toss",
                        "level": 19
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Dig",
                        "level": 28
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Skull Bash",
                        "level": 40
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Weedle": {
                "label": "Hairy Bug",
                "sprite": "Water",
                "info": [
                    "Often found in forests, eating leaves. It has a sharp venomous stinger on its head."
                ],
                "evolvesInto": "Kakuna",
                "evolvesVia": "Level 7",
                "number": 13,
                "height": ["1", "0"],
                "weight": 7.1,
                "types": ["Bug", "Poison"],
                "HP": 40,
                "Attack": 35,
                "Defense": 30,
                "Special": 20,
                "Speed": 50,
                "moves": {
                    "natural": [{
                        "Move": "Poison Sting",
                        "level": 1
                    }, {
                        "Move": "String Shot",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": []
                }
            }, "Weepinbell": {
                "label": "Flycatcher",
                "sprite": "Water",
                "info": [
                    "It spits out POISONPOWDER to immobilize the enemy and then finishes it with a spray of ACID."
                ],
                "evolvesInto": "Victreebel",
                "evolvesVia": "use Leaf Stone",
                "number": 70,
                "height": ["3", "3"],
                "weight": 14.1,
                "types": ["Grass", "Poison"],
                "HP": 65,
                "Attack": 90,
                "Defense": 50,
                "Special": 85,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Growth",
                        "level": 1
                    }, {
                        "Move": "Vine Whip",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 1
                    }, {
                        "Move": "Wrap",
                        "level": 13
                    }, {
                        "Move": "Poison Powder",
                        "level": 15
                    }, {
                        "Move": "Sleep Powder",
                        "level": 18
                    }, {
                        "Move": "Stun Spore",
                        "level": 23
                    }, {
                        "Move": "Acid",
                        "level": 29
                    }, {
                        "Move": "Razor Leaf",
                        "level": 38
                    }, {
                        "Move": "Slam",
                        "level": 49
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Swords Dance",
                        "level": 3
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Mega Drain",
                        "level": 21
                    }, {
                        "Move": "Solar Beam",
                        "level": 22
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Weezing": {
                "label": "Poison Gas",
                "sprite": "Water",
                "info": [
                    "Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 110,
                "height": ["3", "11"],
                "weight": 20.9,
                "types": ["Poison"],
                "HP": 65,
                "Attack": 90,
                "Defense": 120,
                "Special": 85,
                "Speed": 60,
                "moves": {
                    "natural": [{
                        "Move": "Sludge",
                        "level": 1
                    }, {
                        "Move": "Smog",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sludge",
                        "level": 32
                    }, {
                        "Move": "Smokescreen",
                        "level": 39
                    }, {
                        "Move": "Self-Destruct",
                        "level": 43
                    }, {
                        "Move": "Haze",
                        "level": 49
                    }, {
                        "Move": "Explosion",
                        "level": 53
                    }],
                    "hm": [{
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Self-Destruct",
                        "level": 36
                    }, {
                        "Move": "Fire Blast",
                        "level": 38
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Explosion",
                        "level": 47
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }],
                    "tm": [{
                        "Move": "Sludge",
                        "level": 1
                    }, {
                        "Move": "Smog",
                        "level": 1
                    }, {
                        "Move": "Tackle",
                        "level": 1
                    }, {
                        "Move": "Sludge",
                        "level": 32
                    }, {
                        "Move": "Smokescreen",
                        "level": 39
                    }, {
                        "Move": "Self-Destruct",
                        "level": 43
                    }, {
                        "Move": "Haze",
                        "level": 49
                    }, {
                        "Move": "Explosion",
                        "level": 53
                    }]
                }
            }, "Wigglytuff": {
                "label": "Balloon",
                "sprite": "Water",
                "info": [
                    "The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 40,
                "height": ["3", "3"],
                "weight": 26.5,
                "types": ["Normal", "Fairy"],
                "HP": 140,
                "Attack": 70,
                "Defense": 45,
                "Special": 85,
                "Speed": 45,
                "moves": {
                    "natural": [{
                        "Move": "Defense Curl",
                        "level": 1
                    }, {
                        "Move": "Disable",
                        "level": 1
                    }, {
                        "Move": "Double Slap",
                        "level": 1
                    }, {
                        "Move": "Sing",
                        "level": 1
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Strength",
                        "level": 4
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }]
                }
            }, "Zapdos": {
                "label": "Electric",
                "sprite": "Water",
                "info": [
                    "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear from clouds while dropping enormous lightning bolts."
                ],
                "evolvesInto": "Undefined",
                "evolvesVia": "Undefined",
                "number": 145,
                "height": ["5", "3"],
                "weight": 116,
                "types": ["Electric", "Flying"],
                "HP": 90,
                "Attack": 90,
                "Defense": 85,
                "Special": 125,
                "Speed": 100,
                "moves": {
                    "natural": [{
                        "Move": "Drill Peck",
                        "level": 1
                    }, {
                        "Move": "Thunder Shock",
                        "level": 1
                    }, {
                        "Move": "Thunder",
                        "level": 51
                    }, {
                        "Move": "Agility",
                        "level": 55
                    }, {
                        "Move": "Light Screen",
                        "level": 60
                    }],
                    "hm": [{
                        "Move": "Fly",
                        "level": 2
                    }, {
                        "Move": "Flash",
                        "level": 5
                    }],
                    "tm": [{
                        "Move": "Razor Wind",
                        "level": 2
                    }, {
                        "Move": "Whirlwind",
                        "level": 4
                    }, {
                        "Move": "Toxic",
                        "level": 6
                    }, {
                        "Move": "Take Down",
                        "level": 9
                    }, {
                        "Move": "Double-Edge",
                        "level": 10
                    }, {
                        "Move": "Hyper Beam",
                        "level": 15
                    }, {
                        "Move": "Rage",
                        "level": 20
                    }, {
                        "Move": "Thunderbolt",
                        "level": 24
                    }, {
                        "Move": "Thunder",
                        "level": 25
                    }, {
                        "Move": "Mimic",
                        "level": 31
                    }, {
                        "Move": "Double Team",
                        "level": 32
                    }, {
                        "Move": "Reflect",
                        "level": 33
                    }, {
                        "Move": "Bide",
                        "level": 34
                    }, {
                        "Move": "Swift",
                        "level": 39
                    }, {
                        "Move": "Sky Attack",
                        "level": 43
                    }, {
                        "Move": "Rest",
                        "level": 44
                    }, {
                        "Move": "Thunder Wave",
                        "level": 45
                    }, {
                        "Move": "Substitute",
                        "level": 50
                    }]
                }
            }, "Zubat": {
                "label": "Bat",
                "sprite": "Water",
                "info": [
                    "Forms colonies in perpetually dark places. Uses ultrasonic waves to identify and approach targets."
                ],
                "evolvesInto": "Golbat",
                "evolvesVia": "Level 22",
                "number": 41,
                "height": ["2", "7"],
                "weight": 16.5,
                "types": ["Poison", "Flying"],
                "HP": 40,
                "Attack": 45,
                "Defense": 35,
                "Special": 30,
                "Speed": 55,
                "moves": {
                    "natural": [{
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 15
                    }, {
                        "Move": "Confuse Ray",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 28
                    }, {
                        "Move": "Haze",
                        "level": 36
                    }],
                    "hm": [],
                    "tm": [{
                        "Move": "Leech Life",
                        "level": 1
                    }, {
                        "Move": "Supersonic",
                        "level": 10
                    }, {
                        "Move": "Bite",
                        "level": 15
                    }, {
                        "Move": "Confuse Ray",
                        "level": 21
                    }, {
                        "Move": "Wing Attack",
                        "level": 28
                    }, {
                        "Move": "Haze",
                        "level": 36
                    }]
                }
            }
        },
        /**
         * Run on http://www.smogon.com/dex/rb/moves/
         * NOTE: Effects added in manually
         * * Swords Dance, Sleep Powder
         * 
         * var output = {};
         * 
         * function tryNumber(string) {
         *     return isNaN(Number(string)) ? string : Number(string);
         * }
         * 
         * Array.prototype.slice.call(document.querySelectorAll("tr")).map(function (row) {
         *     output[row.children[0].innerText.trim()] = {
         *         "Type": row.children[1].innerText.trim(),
         *         "Damage": tryNumber(row.children[2].children[0].className.replace("damage-category-block ", "")),
         *         "Power": tryNumber(row.children[3].innerText.split(/\s+/g)[1]),
         *         "Accuracy": tryNumber(row.children[4].innerText.split(/\s+/g)[1]),
         *         "PP": tryNumber(row.children[5].innerText.split(/\s+/g)[1]),
         *         "Description": row.children[6].innerText
         *     };
         * });
         * 
         * JSON.stringify(output);
         */
        "moves": {
            "Absorb": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Leeches 50% of the damage dealt."
            },
            "Acid": {
                "Type": "Poison",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "10% chance to lower the target's Defense by one stage."
            },
            "Acid Armor": {
                "Type": "Poison",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "Boosts the user's Defense by two stages."
            },
            "Agility": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Boosts the user's Speed by two stages. Negates the Speed drop of paralysis."
            },
            "Amnesia": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "Boosts the user's Special by two stages."
            },
            "Aurora Beam": {
                "Type": "Ice",
                "Damage": "Special",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "10% chance to lower the user's Attack by one stage."
            },
            "Barrage": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "Hits two to five times."
            },
            "Barrier": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Boosts the user's Defense by two stages."
            },
            "Bide": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Charges for two to three turns; returns double the damage received in those turns."
            },
            "Bind": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "75%",
                "PP": 20,
                "Description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
            },
            "Bite": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 60,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "10% chance of causing the target to flinch."
            },
            "Blizzard": {
                "Type": "Ice",
                "Damage": "Special",
                "Power": 120,
                "Accuracy": "90%",
                "PP": 5,
                "Description": "10% chance to freeze the target."
            },
            "Body Slam": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 85,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "30% chance to paralyze the target."
            },
            "Bone Club": {
                "Type": "Ground",
                "Damage": "Physical",
                "Power": 65,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "10% chance of causing the target to flinch."
            },
            "Bonemerang": {
                "Type": "Ground",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "90%",
                "PP": 10,
                "Description": "Hits twice."
            },
            "Bubble": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "10% chance to lower the target's Speed by one stage."
            },
            "Bubble Beam": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "10% chance to lower the target's Speed by one stage."
            },
            "Clamp": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 35,
                "Accuracy": "75%",
                "PP": 10,
                "Description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
            },
            "Comet Punch": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 18,
                "Accuracy": "85%",
                "PP": 15,
                "Description": "Hits two to five times."
            },
            "Confuse Ray": {
                "Type": "Ghost",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 10,
                "Description": "Confuses the target."
            },
            "Confusion": {
                "Type": "Psychic",
                "Damage": "Special",
                "Power": 50,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "10% chance to confuse the target."
            },
            "Constrict": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 10,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "10% chance to lower the target Speed by one stage."
            },
            "Conversion": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Changes the user into the opponent's type."
            },
            "Counter": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "If hit by a Normal- or Fighting-type attack, deals double the damage taken."
            },
            "Crabhammer": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 90,
                "Accuracy": "85%",
                "PP": 10,
                "Description": "High critical hit rate."
            },
            "Cut": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "95%",
                "PP": 30,
                "Description": "No additional effect."
            },
            "Defense Curl": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "Boosts the user's Defense by one stage."
            },
            "Dig": {
                "Type": "Ground",
                "Damage": "Physical",
                "Power": 100,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "User is made invulnerable for one turn, then hits the next turn."
            },
            "Disable": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "55%",
                "PP": 20,
                "Description": "Randomly disables a foe's move for 0-6 turns."
            },
            "Dizzy Punch": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 70,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Double Kick": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 30,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "Hits twice."
            },
            "Double Slap": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "85%",
                "PP": 10,
                "Description": "Hits two to five times."
            },
            "Double Team": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 15,
                "Description": "Boosts the user's evasion by one stage."
            },
            "Double-Edge": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 100,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Has 1/4 recoil."
            },
            "Dragon Rage": {
                "Type": "Dragon",
                "Damage": "Special",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 10,
                "Description": "Always does 40 HP damage."
            },
            "Dream Eater": {
                "Type": "Psychic",
                "Damage": "Special",
                "Power": 100,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Leeches 50% of the damage dealt. Only works if the target is asleep."
            },
            "Drill Peck": {
                "Type": "Flying",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "No additional effect."
            },
            "Earthquake": {
                "Type": "Ground",
                "Damage": "Physical",
                "Power": 100,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Egg Bomb": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 100,
                "Accuracy": "75%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Ember": {
                "Type": "Fire",
                "Damage": "Special",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "10% chance to burn the target."
            },
            "Explosion": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 170,
                "Accuracy": "100%",
                "PP": 5,
                "Description": "Faints the user."
            },
            "Fire Blast": {
                "Type": "Fire",
                "Damage": "Special",
                "Power": 120,
                "Accuracy": "85%",
                "PP": 5,
                "Description": "30% chance to burn the target."
            },
            "Fire Punch": {
                "Type": "Fire",
                "Damage": "Special",
                "Power": 75,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "10% chance to burn the target."
            },
            "Fire Spin": {
                "Type": "Fire",
                "Damage": "Special",
                "Power": 15,
                "Accuracy": "70%",
                "PP": 15,
                "Description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
            },
            "Fissure": {
                "Type": "Ground",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "30%",
                "PP": 5,
                "Description": "OHKOes the target."
            },
            "Flamethrower": {
                "Type": "Fire",
                "Damage": "Special",
                "Power": 95,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "10% chance to burn the target."
            },
            "Flash": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "70%",
                "PP": 20,
                "Description": "Lowers the target's accuracy by one stage."
            },
            "Fly": {
                "Type": "Flying",
                "Damage": "Physical",
                "Power": 70,
                "Accuracy": "95%",
                "PP": 15,
                "Description": "User is made invulnerable for one turn, then hits the next turn."
            },
            "Focus Energy": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Reduces the user's critical hit rate."
            },
            "Fury Attack": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "Hits two to five times."
            },
            "Fury Swipes": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 18,
                "Accuracy": "80%",
                "PP": 15,
                "Description": "Hits two to five times."
            },
            "Glare": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "75%",
                "PP": 30,
                "Description": "Paralyzes the target."
            },
            "Growl": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 40,
                "Description": "Lowers the target's Attack by one stage."
            },
            "Growth": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "Boosts Special one stage."
            },
            "Guillotine": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "30%",
                "PP": 5,
                "Description": "OHKOes the target."
            },
            "Gust": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Harden": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Boosts the user's Defense by one stage."
            },
            "Haze": {
                "Type": "Ice",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Eliminates all stat changes."
            },
            "Headbutt": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 70,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "30% chance of causing the target to flinch."
            },
            "High Jump Kick": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 85,
                "Accuracy": "90%",
                "PP": 20,
                "Description": "User takes 1 HP recoil if attack misses or fails."
            },
            "Horn Attack": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "No additional effect."
            },
            "Horn Drill": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "30%",
                "PP": 5,
                "Description": "OHKOes the target."
            },
            "Hydro Pump": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 120,
                "Accuracy": "80%",
                "PP": 5,
                "Description": "No additional effect."
            },
            "Hyper Beam": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 150,
                "Accuracy": "90%",
                "PP": 5,
                "Description": "User cannot move next turn, unless opponent or Substitute was KOed."
            },
            "Hyper Fang": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "90%",
                "PP": 15,
                "Description": "10% chance of causing the target to flinch."
            },
            "Hypnosis": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "60%",
                "PP": 20,
                "Description": "Puts the foe to sleep."
            },
            "Ice Beam": {
                "Type": "Ice",
                "Damage": "Special",
                "Power": 95,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "10% chance to freeze."
            },
            "Ice Punch": {
                "Type": "Ice",
                "Damage": "Special",
                "Power": 75,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "10% chance to freeze."
            },
            "Jump Kick": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 70,
                "Accuracy": "95%",
                "PP": 25,
                "Description": "User takes 1 HP recoil if attack misses."
            },
            "Karate Chop": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "High critical hit rate."
            },
            "Kinesis": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "80%",
                "PP": 15,
                "Description": "Lowers the target's accuracy by one stage."
            },
            "Leech Life": {
                "Type": "Bug",
                "Damage": "Physical",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Leeches 50% of the damage dealt."
            },
            "Leech Seed": {
                "Type": "Grass",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "90%",
                "PP": 10,
                "Description": "Leeches 1/16 of the target's HP each turn."
            },
            "Leer": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 30,
                "Description": "Lowers the target's Defense by one stage."
            },
            "Lick": {
                "Type": "Ghost",
                "Damage": "Physical",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "30% chance to paralyze the target."
            },
            "Light Screen": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Halves Special damage done to user."
            },
            "Lovely Kiss": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "75%",
                "PP": 10,
                "Description": "Puts the target to sleep."
            },
            "Low Kick": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "90%",
                "PP": 20,
                "Description": "30% chance of causing the target to flinch foe."
            },
            "Meditate": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "Boosts the user's Attack by one stage."
            },
            "Mega Drain": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "Leeches 50% of the damage dealt."
            },
            "Mega Kick": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 120,
                "Accuracy": "75%",
                "PP": 5,
                "Description": "No additional effect."
            },
            "Mega Punch": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "No additional effect."
            },
            "Metronome": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Uses a random move."
            },
            "Mimic": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Copies a random move the foe knows."
            },
            "Minimize": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "Boosts the user's evasion by one stage."
            },
            "Mirror Move": {
                "Type": "Flying",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "Use the move the foe just used."
            },
            "Mist": {
                "Type": "Ice",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Prevents moves that only lower stats from working for 5 turns."
            },
            "Night Shade": {
                "Type": "Ghost",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Deals damage equal to the user's level."
            },
            "Pay Day": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "No competitive effect."
            },
            "Peck": {
                "Type": "Flying",
                "Damage": "Physical",
                "Power": 35,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Petal Dance": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 70,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Repeats for two to three turns. Confuses the user at the end."
            },
            "Pin Missile": {
                "Type": "Bug",
                "Damage": "Physical",
                "Power": 14,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "Hits two to five times."
            },
            "Poison Gas": {
                "Type": "Poison",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "55%",
                "PP": 40,
                "Description": "Poisons the target."
            },
            "Poison Powder": {
                "Type": "Poison",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "75%",
                "PP": 35,
                "Description": "Poisons the target."
            },
            "Poison Sting": {
                "Type": "Poison",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "20% chance to poison the target."
            },
            "Pound": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Psybeam": {
                "Type": "Psychic",
                "Damage": "Special",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "10% chance to confuse the target."
            },
            "Psychic": {
                "Type": "Psychic",
                "Damage": "Special",
                "Power": 90,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "30% chance to lower the target's Special by one stage."
            },
            "Psywave": {
                "Type": "Psychic",
                "Damage": "Special",
                "Power": "-",
                "Accuracy": "80%",
                "PP": 15,
                "Description": "Does random damage equal to .5x-1.5x the user's level."
            },
            "Quick Attack": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "Priority +1.",
                "Priority": 1,
            },
            "Rage": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Boosts Attack by one stage if hit, but can only use Rage after that."
            },
            "Razor Leaf": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 55,
                "Accuracy": "95%",
                "PP": 25,
                "Description": "High critical hit rate."
            },
            "Razor Wind": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "75%",
                "PP": 10,
                "Description": "Charges first turn; attacks on the second."
            },
            "Recover": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "Heals 50% of the user's max HP."
            },
            "Reflect": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "Lowers the physical damage done to user."
            },
            "Rest": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "The user goes to sleep for two turns, restoring all HP."
            },
            "Roar": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Has no effect."
            },
            "Rock Slide": {
                "Type": "Rock",
                "Damage": "Physical",
                "Power": 75,
                "Accuracy": "90%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Rock Throw": {
                "Type": "Rock",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "90%",
                "PP": 15,
                "Description": "No additional effect."
            },
            "Rolling Kick": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 60,
                "Accuracy": "85%",
                "PP": 15,
                "Description": "30% chance of causing the target to flinch."
            },
            "Sand Attack": {
                "Type": "Ground",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Lowers the target's accuracy by one stage."
            },
            "Scratch": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Screech": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "85%",
                "PP": 40,
                "Description": "Lowers the target's Defense by two stages."
            },
            "Seismic Toss": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Deals damage equal to the user's level."
            },
            "Self-Destruct": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 130,
                "Accuracy": "100%",
                "PP": 5,
                "Description": "Faints the user."
            },
            "Sharpen": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Boosts the user's Attack by one stage."
            },
            "Sing": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "55%",
                "PP": 15,
                "Description": "Puts the target to sleep."
            },
            "Skull Bash": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 100,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Charges turn one; attacks turn two."
            },
            "Sky Attack": {
                "Type": "Flying",
                "Damage": "Physical",
                "Power": 140,
                "Accuracy": "90%",
                "PP": 5,
                "Description": "Hits the turn after being used."
            },
            "Slam": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "75%",
                "PP": 20,
                "Description": "No additional effect."
            },
            "Slash": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 70,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "High critical hit rate."
            },
            "Sleep Powder": {
                "Type": "Grass",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "75%",
                "PP": 15,
                "Status": "Sleep",
                "Description": "Puts the target to sleep."
            },
            "Sludge": {
                "Type": "Poison",
                "Damage": "Physical",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "29.7% chance to poison the target."
            },
            "Smog": {
                "Type": "Poison",
                "Damage": "Physical",
                "Power": 20,
                "Accuracy": "70%",
                "PP": 20,
                "Description": "40% chance to poison the target."
            },
            "Smokescreen": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Lowers the target's accuracy by one stage."
            },
            "Soft-Boiled": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Heals 50% of the user's max HP."
            },
            "Solar Beam": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 120,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "Charges turn 1; attacks turn 2."
            },
            "Sonic Boom": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "90%",
                "PP": 20,
                "Description": "Does 20 damage. Ghosts take regular damage."
            },
            "Spike Cannon": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 20,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Hits two to five times."
            },
            "Splash": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "No effect whatsoever."
            },
            "Spore": {
                "Type": "Grass",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 15,
                "Description": "Puts the target to sleep."
            },
            "Stomp": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 65,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "30% chance of causing the target to flinch."
            },
            "Strength": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "No additional effect."
            },
            "String Shot": {
                "Type": "Bug",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "95%",
                "PP": 40,
                "Description": "Lowers the target's Speed by one stage."
            },
            "Struggle": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 50,
                "Accuracy": "-",
                "PP": 10,
                "Description": "Has 1/2 recoil. Ghost-types take damage."
            },
            "Stun Spore": {
                "Type": "Grass",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "75%",
                "PP": 30,
                "Description": "Paralyzes the target."
            },
            "Submission": {
                "Type": "Fighting",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "80%",
                "PP": 25,
                "Description": "Has 1/4 recoil."
            },
            "Substitute": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Takes 1/4 the user's max HP to create a Substitute that takes damage for the user."
            },
            "Super Fang": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": "-",
                "Accuracy": "90%",
                "PP": 10,
                "Description": "Deals damage equal to half the target's current HP."
            },
            "Supersonic": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "55%",
                "PP": 20,
                "Description": "Confuses the target."
            },
            "Surf": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 95,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "No additional effect."
            },
            "Swift": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 60,
                "Accuracy": "-",
                "PP": 20,
                "Description": "Always hits."
            },
            "Swords Dance": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 30,
                "Description": "Boosts the user's Attack by two stages.",
                "Effect": "Raise",
                "Raise": "Attack",
                "Amount": 1
            },
            "Tackle": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 35,
                "Accuracy": "95%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Tail Whip": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 30,
                "Description": "Lowers the Defense of all opposing adjacent Pokemon by one stage."
            },
            "Take Down": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 90,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "Has 1/4 recoil."
            },
            "Teleport": {
                "Type": "Psychic",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 20,
                "Description": "No competitive effect."
            },
            "Thrash": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 90,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Repeats for three to four turns. Confuses the user at the end."
            },
            "Thunder": {
                "Type": "Electric",
                "Damage": "Special",
                "Power": 120,
                "Accuracy": "70%",
                "PP": 10,
                "Description": "10% chance to paralyze the target."
            },
            "Thunder Punch": {
                "Type": "Electric",
                "Damage": "Special",
                "Power": 75,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "10% chance to paralyze the target."
            },
            "Thunder Shock": {
                "Type": "Electric",
                "Damage": "Special",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "10% chance to paralyze the target."
            },
            "Thunder Wave": {
                "Type": "Electric",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Paralyzes the target."
            },
            "Thunderbolt": {
                "Type": "Electric",
                "Damage": "Special",
                "Power": 95,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "10% chance to paralyze the target."
            },
            "Toxic": {
                "Type": "Poison",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "85%",
                "PP": 10,
                "Description": "Badly poisons the target."
            },
            "Transform": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 10,
                "Description": "Transforms the user into the target, copying its type, stats, stat changes, moves, and ability."
            },
            "Tri Attack": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 80,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Twineedle": {
                "Type": "Bug",
                "Damage": "Physical",
                "Power": 25,
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Hits twice. Each hit has a 20% chance to poison the target."
            },
            "Vice Grip": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 55,
                "Accuracy": "100%",
                "PP": 30,
                "Description": "No additional effect."
            },
            "Vine Whip": {
                "Type": "Grass",
                "Damage": "Special",
                "Power": 35,
                "Accuracy": "100%",
                "PP": 10,
                "Description": "No additional effect."
            },
            "Water Gun": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 40,
                "Accuracy": "100%",
                "PP": 25,
                "Description": "No additional effect."
            },
            "Waterfall": {
                "Type": "Water",
                "Damage": "Special",
                "Power": 80,
                "Accuracy": "100%",
                "PP": 15,
                "Description": "No additional effect."
            },
            "Whirlwind": {
                "Type": "Normal",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "100%",
                "PP": 20,
                "Description": "Has no effect."
            },
            "Wing Attack": {
                "Type": "Flying",
                "Damage": "Physical",
                "Power": 35,
                "Accuracy": "100%",
                "PP": 35,
                "Description": "No additional effect."
            },
            "Withdraw": {
                "Type": "Water",
                "Damage": "Non-Damaging",
                "Power": "-",
                "Accuracy": "-",
                "PP": 40,
                "Description": "Boosts the user's Defense by one stage."
            },
            "Wrap": {
                "Type": "Normal",
                "Damage": "Physical",
                "Power": 15,
                "Accuracy": "85%",
                "PP": 20,
                "Description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
            }
        },
        "battleModifications": {
            "Turn 2": {
                "opponentType": [
                    "Pokemaniac",
                    "Super Nerd",
                    "Juggler",
                    "Psychic",
                    "Chief",
                    "Scientist",
                    "Gentleman",
                    "Lorelei"
                ],
                "preferences": [
                    ["Raise", "Attack", 1],
                    ["Raise", "Defense", 1],
                    ["Raise", "Special", 1],
                    ["Raise", "Evasion", 1],
                    ["Move", "Pay Day"],
                    ["Move", "Swift"],
                    ["Lower", "Attack", 1],
                    ["Lower", "Defense", 1],
                    ["Lower", "Accuracy", 1],
                    ["Move", "Conversion"],
                    ["Move", "Haze"],
                    ["Raise", "Attack", 2],
                    ["Raise", "Defense", 2],
                    ["Raise", "Speed", 2],
                    ["Raise", "Special", 2],
                    ["Effect", "Heal"],
                    ["Lower", "Defense", 2],
                    ["Move", "Light Screen"],
                    ["Move", "Reflect"]
                ]
            },
            "Good AI": {
                // http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
                "opponentType": [
                    "smart",
                    "Sailor",
                    "Pokemaniac",
                    "Burglar",
                    "Fisher",
                    "Swimmer",
                    "Beauty",
                    "Rocker",
                    "Professor Oak",
                    "Giovanni",
                    "CooltrainerM",
                    "CooltrainerF",
                    "Misty",
                    "Surge",
                    "Erika",
                    "Koga",
                    "Blaine",
                    "Sabrina",
                    "Rival2",
                    "Rival3",
                    "Lorelei",
                    "Lance"
                ],
                /*
                 * Run on http://www.smogon.com/dex/rb/pokemon/
                 * 
                 * $($("ul")[3]).find("li")
                 *    .toArray()
                 *    .map(function (element) {
                 *        return element.innerText.split(" ");
                 *    })
                 *    .map(function (texts) {
                 *        if (texts[1] === "<") {
                 *            return "[\"" + ["Weak", texts[0], texts[2]].join("\", \"") + "\"]";
                 *        } else {
                 *            return "[\"" + ["Super", texts[0], texts[2]].join(", ") + "\"]";
                 *        }
                 *    })
                 *    .join(",\r\n                ");
                 */
                "preferences": [
                    ["Super", "Water, Fire"],
                    ["Super", "Fire, Grass"],
                    ["Super", "Fire, Ice"],
                    ["Super", "Grass, Water"],
                    ["Super", "Electric, Water"],
                    ["Super", "Water, Rock"],
                    ["Weak", "Ground", "Flying"],
                    ["Weak", "Water", "Water"],
                    ["Weak", "Fire", "Fire"],
                    ["Weak", "Electric", "Electric"],
                    ["Weak", "Ice", "Ice"],
                    ["Weak", "Grass", "Grass"],
                    ["Weak", "Psychic", "Psychic"],
                    ["Weak", "Fire", "Water"],
                    ["Weak", "Grass", "Fire"],
                    ["Weak", "Water", "Grass"],
                    ["Weak", "Normal", "Rock"],
                    ["Weak", "Normal", "Ghost"],
                    ["Super", "Ghost, Ghost"],
                    ["Super", "Fire, Bug"],
                    ["Weak", "Fire", "Rock"],
                    ["Super", "Water, Ground"],
                    ["Weak", "Electric", "Ground"],
                    ["Super", "Electric, Flying"],
                    ["Super", "Grass, Ground"],
                    ["Weak", "Grass", "Bug"],
                    ["Weak", "Grass", "Poison"],
                    ["Super", "Grass, Rock"],
                    ["Weak", "Grass", "Flying"],
                    ["Weak", "Ice", "Water"],
                    ["Super", "Ice, Grass"],
                    ["Super", "Ice, Ground"],
                    ["Super", "Ice, Flying"],
                    ["Super", "Fighting, Normal"],
                    ["Weak", "Fighting", "Poison"],
                    ["Weak", "Fighting", "Flying"],
                    ["Weak", "Fighting", "Psychic"],
                    ["Weak", "Fighting", "Bug"],
                    ["Super", "Fighting, Rock"],
                    ["Super", "Fighting, Ice"],
                    ["Weak", "Fighting", "Ghost"],
                    ["Super", "Poison, Grass"],
                    ["Weak", "Poison", "Poison"],
                    ["Weak", "Poison", "Ground"],
                    ["Super", "Poison, Bug"],
                    ["Weak", "Poison", "Rock"],
                    ["Weak", "Poison", "Ghost"],
                    ["Super", "Ground, Fire"],
                    ["Super", "Ground, Electric"],
                    ["Weak", "Ground", "Grass"],
                    ["Weak", "Ground", "Bug"],
                    ["Super", "Ground, Rock"],
                    ["Super", "Ground, Poison"],
                    ["Weak", "Flying", "Electric"],
                    ["Super", "Flying, Fighting"],
                    ["Super", "Flying, Bug"],
                    ["Super", "Flying, Grass"],
                    ["Weak", "Flying", "Rock"],
                    ["Super", "Psychic, Fighting"],
                    ["Super", "Psychic, Poison"],
                    ["Weak", "Bug", "Fire"],
                    ["Super", "Bug, Grass"],
                    ["Weak", "Bug", "Fighting"],
                    ["Weak", "Bug", "Flying"],
                    ["Super", "Bug, Psychic"],
                    ["Weak", "Bug", "Ghost"],
                    ["Super", "Bug, Poison"],
                    ["Super", "Rock, Fire"],
                    ["Weak", "Rock", "Fighting"],
                    ["Weak", "Rock", "Ground"],
                    ["Super", "Rock, Flying"],
                    ["Super", "Rock, Bug"],
                    ["Super", "Rock, Ice"],
                    ["Weak", "Ghost", "Normal"],
                    ["Weak", "Ghost", "Psychic"],
                    ["Weak", "Fire", "Dragon"],
                    ["Weak", "Water", "Dragon"],
                    ["Weak", "Electric", "Dragon"],
                    ["Weak", "Grass", "Dragon"],
                    ["Super", "Ice, Dragon"],
                    ["Super", "Dragon, Dragon"]
                ]
            }
        },
        "items": {
            "Antidote": {
                "price": 100,
                "effect": "Cures Poison",
                "category": "Main"
            },
            "Awakening": {
                "price": 250,
                "effect": "Cures Sleep",
                "category": "Main"
            },
            "Burn Heal": {
                "price": 250,
                "effect": "Cures Burn",
                "category": "Main"
            },
            "Calcium": {
                "price": 9800,
                "effect": "Raises Special Attack",
                "category": "Main"
            },
            "Carbos": {
                "price": 9800,
                "effect": "Raises Speed",
                "category": "Main"
            },
            "Dire Hit": {
                "price": 650,
                "effect": "Raises chances of a Critical Hit in battle",
                "category": "Main"
            },
            "Elixir": {
                "effect": "Restores 10PP to each move",
                "category": "Main"
            },
            "Escape Rope": {
                "price": 550,
                "effect": "Escape from the current cave",
                "category": "Main"
            },
            "Ether": {
                "effect": "Restores 10PP of one move",
                "category": "Main"
            },
            "Fire Stone": {
                "price": 2100,
                "effect": "Evolves Eevee, Growlithe and Vulpix",
                "category": "Main"
            },
            "Fresh Water": {
                "price": 200,
                "effect": "Recovers 50HP",
                "category": "Main"
            },
            "Full Heal": {
                "price": 600,
                "effect": "Cures all status ailments",
                "category": "Main"
            },
            "Full Restore": {
                "price": 3000,
                "effect": "Restores all HP and cures all status ailments",
                "category": "Main"
            },
            "Guard Spec": {
                "price": 700,
                "effect": "Prevents stat reduction in a battle",
                "category": "Main"
            },
            "HP Up": {
                "price": 9800,
                "effect": "Raises max HP",
                "category": "Main"
            },
            "Hyper Potion": {
                "price": 1200,
                "effect": "Restores 200HP",
                "category": "Main"
            },
            "Ice Heal": {
                "price": 250,
                "effect": "Cures Freeze",
                "category": "Main"
            },
            "Iron": {
                "price": 9800,
                "effect": "Raises Defense",
                "category": "Main"
            },
            "Leaf Stone": {
                "effect": "Evolves Exeggcute, Gloom, and Weepinbell",
                "category": "Main"
            },
            "Lemonade": {
                "price": 350,
                "effect": "Restores 80HP",
                "category": "Main"
            },
            "Max Elixir": {
                "effect": "Restores all PP to all moves",
                "category": "Main"
            },
            "Max Ether": {
                "effect": "Restores all PP to one move",
                "category": "Main"
            },
            "Max Potion": {
                "price": 2500,
                "effect": "Restores all HP",
                "category": "Main"
            },
            "Max Repel": {
                "price": 700,
                "effect": "Repels weaker Pokemon for 250 steps",
                "category": "Main"
            },
            "Max Revive": {
                "effect": "Revives a fainted Pokemon to max HP",
                "category": "Main"
            },
            "Moon Stone": {
                "effect": "Evolves Clefairy, Jigglypuff, Nidorina and Nidorino",
                "category": "Main"
            },
            "Nugget": {
                "effect": "Sell for money",
                "category": "Main"
            },
            "Paralyz Heal": {
                "price": 200,
                "effect": "Cures Paralysis",
                "category": "Main"
            },
            "Poke Doll": {
                "price": 1000,
                "effect": "Trade for TM31 in Saffron, Allows escape from battle",
                "category": "Main"
            },
            "Potion": {
                "price": 300,
                "effect": "Restores 20HP",
                "category": "Main"
            },
            "PP Up": {
                "effect": "Increases the max PP of a move",
                "category": "Main"
            },
            "Protein": {
                "price": 9800,
                "effect": "Raises Attack",
                "category": "Main"
            },
            "Rare Candy": {
                "effect": "Raises a Pokemon's level by one",
                "category": "Main"
            },
            "Repel": {
                "price": 350,
                "effect": "Repels weaker Pokemon for 100 steps",
                "category": "Main"
            },
            "Revive": {
                "price": 1500,
                "effect": "Recovers a fainted Pokemon to half max HP",
                "category": "Main"
            },
            "Soda Pop": {
                "price": 300,
                "effect": "Recovers 80HP",
                "category": "Main"
            },
            "Super Potion": {
                "price": 700,
                "effect": "Restores 50HP",
                "category": "Main"
            },
            "Super Repel": {
                "price": 500,
                "effect": "Repels weaker Pokemon for 200 steps",
                "category": "Main"
            },
            "Thunderstone": {
                "price": 2100,
                "effect": "Evolves Eevee and Pikachu",
                "category": "Main"
            },
            "Water Stone": {
                "price": 2100,
                "effect": "Evolves Eevee, Poliwag, Shellder and Staryu",
                "category": "Main"
            },
            "X Accuracy": {
                "price": 950,
                "effect": "Raises accuracy in a battle",
                "category": "Main"
            },
            "X Attack": {
                "price": 500,
                "effect": "Raises attack in a battle",
                "category": "Main"
            },
            "X Defend": {
                "price": 550,
                "effect": "Raises defense in a battle",
                "category": "Main"
            },
            "X Special": {
                "price": 350,
                "effect": "Raises special in a battle",
                "category": "Main"
            },
            "X Speed": {
                "price": 350,
                "effect": "Raises speed in a battle",
                "category": "Main"
            },
            "Pokeball": {
                "price": 200,
                "effect": "Catches Pokemon",
                "category": "PokeBall"
            },
            "Great Ball": {
                "price": 600,
                "effect": "Greater chance of catching Pokemon than a Pokeball",
                "category": "PokeBall"
            },
            "Ultra Ball": {
                "price": 1200,
                "effect": "Greater chance of catching Pokemon than a Great Ball",
                "category": "PokeBall"
            },
            "Master Ball": {
                "effect": "Always catches Pokemon",
                "category": "PokeBall"
            },
            "Safari Ball": {
                "effect": "A special ball for use in the Safari Zone",
                "category": "PokeBall"
            },
            "Bicycle": {
                "effect": "Allows travel at double speed",
                "category": "Key"
            },
            "Bike Voucher": {
                "effect": "Redeem at Cerulean Bike Shop for a free Bicycle",
                "category": "Key"
            },
            "Card Key": {
                "effect": "Unlocks doors in the Silph Co. building",
                "category": "Key"
            },
            "Coin Case": {
                "effect": "Holds 9999 Casino coins for use at Celadon Casino",
                "category": "Key"
            },
            "Dome Fossil": {
                "effect": "Used to clone Kabuto at the Cinnabar Island Laboratory",
                "category": "Key"
            },
            "EXP. All": {
                "effect": "Divides EXP from battle between all party members",
                "category": "Key"
            },
            "Gold Teeth": {
                "effect": "Return to Safari Zone Warden and receive HM04",
                "category": "Key"
            },
            "Good Rod": {
                "effect": "Fish for medium-levelled water Pokemon",
                "category": "Key"
            },
            "Helix Fossil": {
                "effect": "Used to clone Omanyte at the Cinnabar Island Laboratory",
                "category": "Key"
            },
            "Itemfinder": {
                "effect": "Detects hidden items in close proximity",
                "category": "Key"
            },
            "Lift Key": {
                "effect": "Unlocks the elevator in the Team Rocket Hideout, Celadon City",
                "category": "Key"
            },
            "Oak's Parcel": {
                "effect": "Deliver to Prof. Oak in Pallet Town and receive a Pokedex",
                "category": "Key"
            },
            "Old Amber": {
                "effect": "Used to clone Aerodactyl at the Cinnabar Island Laboratoy",
                "category": "Key"
            },
            "Old Rod": {
                "effect": "Fish for low-levelled water Pokemon",
                "category": "Key"
            },
            "Pokeflute": {
                "effect": "Awakens sleeping Pokemon",
                "category": "Key"
            },
            "Pokedex": {
                "effect": "Records all information about Pokemon seen and caught",
                "category": "Key"
            },
            "S.S. Ticket": {
                "effect": "Use to board the S.S. Anne in Vermilion City",
                "category": "Key"
            },
            "Secret Key": {
                "effect": "Unlocks Blaine's Gym on Cinnabar Island",
                "category": "Key"
            },
            "Silph Scope": {
                "effect": "Allows Ghosts to be detected in the Pokemon Tower, Lavendar Town",
                "category": "Key"
            },
            "Super Rod": {
                "effect": "Fish for high-levelled water Pokemon",
                "category": "Key"
            },
            "Town Map": {
                "effect": "Shows your position in the Pokemon World",
                "category": "Key"
            }
        }
    }
};