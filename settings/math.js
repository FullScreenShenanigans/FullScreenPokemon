FullScreenPokemon.prototype.settings.math = {
    "equations": {
        "proliferate": EightBittr.prototype.proliferate,
        "newPokemon": function (NumberMaker, constants, equations, title, level, moves, iv, ev) {
            var statisticNames = constants.statisticNames,
                pokemon = {
                    "title": title,
                    "nickname": title,
                    "level": level,
                    "moves": moves || this.compute("newPokemonMoves", title, level),
                    "types": constants.pokemon[title].types,
                    "IV": iv || this.compute("newPokemonIVs"),
                    "EV": ev || this.compute("newPokemonEVs"),
                    "experience": this.compute("experienceStarting", title, level)
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
            return true;
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
                "types": ["Psychic"],
                "HP": 25,
                "Attack": 20,
                "Defense": 15,
                "Special": 105,
                "Speed": 90
            },
            "Aerodactyl": {
                "types": ["Flying", "Rock"],
                "HP": 80,
                "Attack": 105,
                "Defense": 65,
                "Special": 60,
                "Speed": 130
            },
            "Alakazam": {
                "types": ["Psychic"],
                "HP": 55,
                "Attack": 50,
                "Defense": 45,
                "Special": 135,
                "Speed": 120
            },
            "Arbok": {
                "types": ["Poison"],
                "HP": 60,
                "Attack": 85,
                "Defense": 69,
                "Special": 65,
                "Speed": 80
            },
            "Arcanine": {
                "types": ["Fire"],
                "HP": 90,
                "Attack": 110,
                "Defense": 80,
                "Special": 80,
                "Speed": 95
            },
            "Articuno": {
                "types": ["Flying", "Ice"],
                "HP": 90,
                "Attack": 85,
                "Defense": 100,
                "Special": 125,
                "Speed": 85
            },
            "Beedrill": {
                "types": ["Bug", "Poison"],
                "HP": 65,
                "Attack": 80,
                "Defense": 40,
                "Special": 45,
                "Speed": 75
            },
            "Bellsprout": {
                "types": ["Grass", "Poison"],
                "HP": 50,
                "Attack": 75,
                "Defense": 35,
                "Special": 70,
                "Speed": 40
            },
            "Blastoise": {
                "types": ["Water"],
                "HP": 79,
                "Attack": 83,
                "Defense": 100,
                "Special": 85,
                "Speed": 78
            },
            "Bulbasaur": {
                "types": ["Grass", "Poison"],
                "HP": 45,
                "Attack": 49,
                "Defense": 49,
                "Special": 65,
                "Speed": 45,
                "moves": {
                    "natural": [
                        {
                            "level": 0,
                            "Move": "Tackle"
                        }, {
                            "level": 0,
                            "Move": "Growl"
                        }, {
                            "level": 7,
                            "Move": "Leech Seed"
                        }, {
                            "level": 13,
                            "Move": "Vine Whip"
                        }, {
                            "level": 20,
                            "Move": "PoisonPowder"
                        }, {
                            "level": 27,
                            "Move": "Razor Leaf"
                        }, {
                            "level": 34,
                            "Move": "Grown"
                        }, {
                            "level": 41,
                            "Move": "Sleep Powder"
                        }, {
                            "level": 48,
                            "Move": "SolarBeam"
                        }
                    ]
                }
            },
            "Butterfree": {
                "types": ["Bug", "Flying"],
                "HP": 60,
                "Attack": 45,
                "Defense": 50,
                "Special": 80,
                "Speed": 70
            },
            "Caterpie": {
                "types": ["Bug"],
                "HP": 45,
                "Attack": 30,
                "Defense": 35,
                "Special": 20,
                "Speed": 45
            },
            "Chansey": {
                "types": ["Normal"],
                "HP": 250,
                "Attack": 5,
                "Defense": 5,
                "Special": 105,
                "Speed": 50
            },
            "Charizard": {
                "types": ["Fire", "Flying"],
                "HP": 78,
                "Attack": 84,
                "Defense": 78,
                "Special": 85,
                "Speed": 100
            },
            "Charmander": {
                "types": ["Fire"],
                "HP": 39,
                "Attack": 52,
                "Defense": 43,
                "Special": 50,
                "Speed": 65
            },
            "Charmeleon": {
                "types": ["Fire"],
                "HP": 58,
                "Attack": 64,
                "Defense": 58,
                "Special": 65,
                "Speed": 80
            },
            "Clefable": {
                "types": ["Normal"],
                "HP": 95,
                "Attack": 70,
                "Defense": 73,
                "Special": 85,
                "Speed": 60
            },
            "Clefairy": {
                "types": ["Normal"],
                "HP": 70,
                "Attack": 45,
                "Defense": 48,
                "Special": 60,
                "Speed": 35
            },
            "Cloyster": {
                "types": ["Ice", "Water"],
                "HP": 50,
                "Attack": 95,
                "Defense": 180,
                "Special": 85,
                "Speed": 70
            },
            "Cubone": {
                "types": ["Ground"],
                "HP": 50,
                "Attack": 50,
                "Defense": 95,
                "Special": 40,
                "Speed": 35
            },
            "Dewgong": {
                "types": ["Ice", "Water"],
                "HP": 90,
                "Attack": 70,
                "Defense": 80,
                "Special": 95,
                "Speed": 70
            },
            "Diglett": {
                "types": ["Ground"],
                "HP": 10,
                "Attack": 55,
                "Defense": 25,
                "Special": 45,
                "Speed": 95
            },
            "Ditto": {
                "types": ["Normal"],
                "HP": 48,
                "Attack": 48,
                "Defense": 48,
                "Special": 48,
                "Speed": 48
            },
            "Dodrio": {
                "types": ["Flying", "Normal"],
                "HP": 60,
                "Attack": 110,
                "Defense": 70,
                "Special": 60,
                "Speed": 100
            },
            "Doduo": {
                "types": ["Flying", "Normal"],
                "HP": 35,
                "Attack": 85,
                "Defense": 45,
                "Special": 35,
                "Speed": 75
            },
            "Dragonair": {
                "types": ["Dragon"],
                "HP": 61,
                "Attack": 84,
                "Defense": 65,
                "Special": 70,
                "Speed": 70
            },
            "Dragonite": {
                "types": ["Dragon", "Flying"],
                "HP": 91,
                "Attack": 134,
                "Defense": 95,
                "Special": 100,
                "Speed": 80
            },
            "Dratini": {
                "types": ["Dragon"],
                "HP": 41,
                "Attack": 64,
                "Defense": 45,
                "Special": 50,
                "Speed": 50
            },
            "Drowzee": {
                "types": ["Psychic"],
                "HP": 60,
                "Attack": 48,
                "Defense": 45,
                "Special": 90,
                "Speed": 42
            },
            "Dugtrio": {
                "types": ["Ground"],
                "HP": 35,
                "Attack": 80,
                "Defense": 50,
                "Special": 70,
                "Speed": 120
            },
            "Eevee": {
                "types": ["Normal"],
                "HP": 55,
                "Attack": 55,
                "Defense": 50,
                "Special": 65,
                "Speed": 55
            },
            "Ekans": {
                "types": ["Poison"],
                "HP": 35,
                "Attack": 60,
                "Defense": 44,
                "Special": 40,
                "Speed": 55
            },
            "Electabuzz": {
                "types": ["Electric"],
                "HP": 65,
                "Attack": 83,
                "Defense": 57,
                "Special": 85,
                "Speed": 105
            },
            "Electrode": {
                "types": ["Electric"],
                "HP": 60,
                "Attack": 50,
                "Defense": 70,
                "Special": 80,
                "Speed": 140
            },
            "Exeggcute": {
                "types": ["Grass", "Psychic"],
                "HP": 60,
                "Attack": 40,
                "Defense": 80,
                "Special": 60,
                "Speed": 40
            },
            "Exeggutor": {
                "types": ["Grass", "Psychic"],
                "HP": 95,
                "Attack": 95,
                "Defense": 85,
                "Special": 125,
                "Speed": 55
            },
            "Farfetch'd": {
                "types": ["Flying", "Normal"],
                "HP": 52,
                "Attack": 65,
                "Defense": 55,
                "Special": 58,
                "Speed": 60
            },
            "Fearow": {
                "types": ["Flying", "Normal"],
                "HP": 65,
                "Attack": 90,
                "Defense": 65,
                "Special": 61,
                "Speed": 100
            },
            "Flareon": {
                "types": ["Fire"],
                "HP": 65,
                "Attack": 130,
                "Defense": 60,
                "Special": 110,
                "Speed": 65
            },
            "Gastly": {
                "types": ["Ghost", "Poison"],
                "HP": 30,
                "Attack": 35,
                "Defense": 30,
                "Special": 100,
                "Speed": 80
            },
            "Gengar": {
                "types": ["Ghost", "Poison"],
                "HP": 60,
                "Attack": 65,
                "Defense": 60,
                "Special": 130,
                "Speed": 110
            },
            "Geodude": {
                "types": ["Ground", "Rock"],
                "HP": 40,
                "Attack": 80,
                "Defense": 100,
                "Special": 30,
                "Speed": 20
            },
            "Gloom": {
                "types": ["Grass", "Poison"],
                "HP": 60,
                "Attack": 65,
                "Defense": 70,
                "Special": 85,
                "Speed": 40
            },
            "Golbat": {
                "types": ["Flying", "Poison"],
                "HP": 75,
                "Attack": 80,
                "Defense": 70,
                "Special": 75,
                "Speed": 90
            },
            "Goldeen": {
                "types": ["Water"],
                "HP": 45,
                "Attack": 67,
                "Defense": 60,
                "Special": 50,
                "Speed": 63
            },
            "Golduck": {
                "types": ["Water"],
                "HP": 80,
                "Attack": 82,
                "Defense": 78,
                "Special": 80,
                "Speed": 85
            },
            "Golem": {
                "types": ["Ground", "Rock"],
                "HP": 80,
                "Attack": 110,
                "Defense": 130,
                "Special": 55,
                "Speed": 45
            },
            "Graveler": {
                "types": ["Ground", "Rock"],
                "HP": 55,
                "Attack": 95,
                "Defense": 115,
                "Special": 45,
                "Speed": 35
            },
            "Grimer": {
                "types": ["Poison"],
                "HP": 80,
                "Attack": 80,
                "Defense": 50,
                "Special": 40,
                "Speed": 25
            },
            "Growlithe": {
                "types": ["Fire"],
                "HP": 55,
                "Attack": 70,
                "Defense": 45,
                "Special": 50,
                "Speed": 60
            },
            "Gyarados": {
                "types": ["Flying", "Water"],
                "HP": 95,
                "Attack": 125,
                "Defense": 79,
                "Special": 100,
                "Speed": 81
            },
            "Haunter": {
                "types": ["Ghost", "Poison"],
                "HP": 45,
                "Attack": 50,
                "Defense": 45,
                "Special": 115,
                "Speed": 95
            },
            "Hitmonchan": {
                "types": ["Fighting"],
                "HP": 50,
                "Attack": 105,
                "Defense": 79,
                "Special": 35,
                "Speed": 76
            },
            "Hitmonlee": {
                "types": ["Fighting"],
                "HP": 50,
                "Attack": 120,
                "Defense": 53,
                "Special": 35,
                "Speed": 87
            },
            "Horsea": {
                "types": ["Water"],
                "HP": 30,
                "Attack": 40,
                "Defense": 70,
                "Special": 70,
                "Speed": 60
            },
            "Hypno": {
                "types": ["Psychic"],
                "HP": 85,
                "Attack": 73,
                "Defense": 70,
                "Special": 115,
                "Speed": 67
            },
            "Ivysaur": {
                "types": ["Grass", "Poison"],
                "HP": 60,
                "Attack": 62,
                "Defense": 63,
                "Special": 80,
                "Speed": 60
            },
            "Jigglypuff": {
                "types": ["Normal"],
                "HP": 115,
                "Attack": 45,
                "Defense": 20,
                "Special": 25,
                "Speed": 20
            },
            "Jolteon": {
                "types": ["Electric"],
                "HP": 65,
                "Attack": 65,
                "Defense": 60,
                "Special": 110,
                "Speed": 130
            },
            "Jynx": {
                "types": ["Ice", "Psychic"],
                "HP": 65,
                "Attack": 50,
                "Defense": 35,
                "Special": 95,
                "Speed": 95
            },
            "Kabuto": {
                "types": ["Rock", "Water"],
                "HP": 30,
                "Attack": 80,
                "Defense": 90,
                "Special": 45,
                "Speed": 55
            },
            "Kabutops": {
                "types": ["Rock", "Water"],
                "HP": 60,
                "Attack": 115,
                "Defense": 105,
                "Special": 70,
                "Speed": 80
            },
            "Kadabra": {
                "types": ["Psychic"],
                "HP": 40,
                "Attack": 35,
                "Defense": 30,
                "Special": 120,
                "Speed": 105
            },
            "Kakuna": {
                "types": ["Bug", "Poison"],
                "HP": 45,
                "Attack": 25,
                "Defense": 50,
                "Special": 25,
                "Speed": 35
            },
            "Kangaskhan": {
                "types": ["Normal"],
                "HP": 105,
                "Attack": 95,
                "Defense": 80,
                "Special": 40,
                "Speed": 90
            },
            "Kingler": {
                "types": ["Water"],
                "HP": 55,
                "Attack": 130,
                "Defense": 115,
                "Special": 50,
                "Speed": 75
            },
            "Koffing": {
                "types": ["Poison"],
                "HP": 40,
                "Attack": 65,
                "Defense": 95,
                "Special": 60,
                "Speed": 35
            },
            "Krabby": {
                "types": ["Water"],
                "HP": 30,
                "Attack": 105,
                "Defense": 90,
                "Special": 25,
                "Speed": 50
            },
            "Lapras": {
                "types": ["Ice", "Water"],
                "HP": 130,
                "Attack": 85,
                "Defense": 80,
                "Special": 95,
                "Speed": 60
            },
            "Lickitung": {
                "types": ["Normal"],
                "HP": 90,
                "Attack": 55,
                "Defense": 75,
                "Special": 60,
                "Speed": 30
            },
            "Machamp": {
                "types": ["Fighting"],
                "HP": 90,
                "Attack": 130,
                "Defense": 80,
                "Special": 65,
                "Speed": 55
            },
            "Machoke": {
                "types": ["Fighting"],
                "HP": 80,
                "Attack": 100,
                "Defense": 70,
                "Special": 50,
                "Speed": 45
            },
            "Machop": {
                "types": ["Fighting"],
                "HP": 70,
                "Attack": 80,
                "Defense": 50,
                "Special": 35,
                "Speed": 35
            },
            "Magikarp": {
                "types": ["Water"],
                "HP": 20,
                "Attack": 10,
                "Defense": 55,
                "Special": 20,
                "Speed": 80
            },
            "Magmar": {
                "types": ["Fire"],
                "HP": 65,
                "Attack": 95,
                "Defense": 57,
                "Special": 85,
                "Speed": 93
            },
            "Magnemite": {
                "types": ["Electric"],
                "HP": 25,
                "Attack": 35,
                "Defense": 70,
                "Special": 95,
                "Speed": 45
            },
            "Magneton": {
                "types": ["Electric"],
                "HP": 50,
                "Attack": 60,
                "Defense": 95,
                "Special": 120,
                "Speed": 70
            },
            "Mankey": {
                "types": ["Fighting"],
                "HP": 40,
                "Attack": 80,
                "Defense": 35,
                "Special": 35,
                "Speed": 70
            },
            "Marowak": {
                "types": ["Ground"],
                "HP": 60,
                "Attack": 80,
                "Defense": 110,
                "Special": 50,
                "Speed": 45
            },
            "Meowth": {
                "types": ["Normal"],
                "HP": 40,
                "Attack": 45,
                "Defense": 35,
                "Special": 40,
                "Speed": 90
            },
            "Metapod": {
                "types": ["Bug"],
                "HP": 50,
                "Attack": 20,
                "Defense": 55,
                "Special": 25,
                "Speed": 30
            },
            "Mew": {
                "types": ["Psychic"],
                "HP": 100,
                "Attack": 100,
                "Defense": 100,
                "Special": 100,
                "Speed": 100
            },
            "Mewtwo": {
                "types": ["Psychic"],
                "HP": 106,
                "Attack": 110,
                "Defense": 90,
                "Special": 154,
                "Speed": 130
            },
            "Moltres": {
                "types": ["Fire", "Flying"],
                "HP": 90,
                "Attack": 100,
                "Defense": 90,
                "Special": 125,
                "Speed": 90
            },
            "Mr. Mime": {
                "types": ["Psychic"],
                "HP": 40,
                "Attack": 45,
                "Defense": 65,
                "Special": 100,
                "Speed": 90
            },
            "Muk": {
                "types": ["Poison"],
                "HP": 105,
                "Attack": 105,
                "Defense": 75,
                "Special": 65,
                "Speed": 50
            },
            "Nidoking": {
                "types": ["Ground", "Poison"],
                "HP": 81,
                "Attack": 92,
                "Defense": 77,
                "Special": 75,
                "Speed": 85
            },
            "Nidoqueen": {
                "types": ["Ground", "Poison"],
                "HP": 90,
                "Attack": 82,
                "Defense": 87,
                "Special": 75,
                "Speed": 76
            },
            "Nidoran-F": {
                "types": ["Poison"],
                "HP": 55,
                "Attack": 47,
                "Defense": 52,
                "Special": 40,
                "Speed": 41
            },
            "Nidoran-M": {
                "types": ["Poison"],
                "HP": 46,
                "Attack": 57,
                "Defense": 40,
                "Special": 40,
                "Speed": 50
            },
            "Nidorina": {
                "types": ["Poison"],
                "HP": 70,
                "Attack": 62,
                "Defense": 67,
                "Special": 55,
                "Speed": 56
            },
            "Nidorino": {
                "types": ["Poison"],
                "HP": 61,
                "Attack": 72,
                "Defense": 57,
                "Special": 55,
                "Speed": 65
            },
            "Ninetales": {
                "types": ["Fire"],
                "HP": 73,
                "Attack": 76,
                "Defense": 75,
                "Special": 100,
                "Speed": 100
            },
            "Oddish": {
                "types": ["Grass", "Poison"],
                "HP": 45,
                "Attack": 50,
                "Defense": 55,
                "Special": 75,
                "Speed": 30
            },
            "Omanyte": {
                "types": ["Rock", "Water"],
                "HP": 35,
                "Attack": 40,
                "Defense": 100,
                "Special": 90,
                "Speed": 35
            },
            "Omastar": {
                "types": ["Rock", "Water"],
                "HP": 70,
                "Attack": 60,
                "Defense": 125,
                "Special": 115,
                "Speed": 55
            },
            "Onix": {
                "types": ["Ground", "Rock"],
                "HP": 35,
                "Attack": 45,
                "Defense": 160,
                "Special": 30,
                "Speed": 70
            },
            "Paras": {
                "types": ["Bug", "Grass"],
                "HP": 35,
                "Attack": 70,
                "Defense": 55,
                "Special": 55,
                "Speed": 25
            },
            "Parasect": {
                "types": ["Bug", "Grass"],
                "HP": 60,
                "Attack": 95,
                "Defense": 80,
                "Special": 80,
                "Speed": 30
            },
            "Persian": {
                "types": ["Normal"],
                "HP": 65,
                "Attack": 70,
                "Defense": 60,
                "Special": 65,
                "Speed": 115
            },
            "Pidgeot": {
                "types": ["Flying", "Normal"],
                "HP": 83,
                "Attack": 80,
                "Defense": 75,
                "Special": 70,
                "Speed": 91
            },
            "Pidgeotto": {
                "types": ["Flying", "Normal"],
                "HP": 63,
                "Attack": 60,
                "Defense": 55,
                "Special": 50,
                "Speed": 71
            },
            "Pidgey": {
                "types": ["Flying", "Normal"],
                "HP": 40,
                "Attack": 45,
                "Defense": 40,
                "Special": 35,
                "Speed": 56,
                "moves": {
                    "natural": [
                        {
                            "level": 0,
                            "Move": "Gust"
                        }, {
                            "level": 5,
                            "Move": "Sand Attack"
                        }, {
                            "level": 12,
                            "Move": "Quick Attack"
                        }, {
                            "level": 19,
                            "Move": "Whirlwind"
                        }, {
                            "level": 28,
                            "Move": "Wing Attack"
                        }, {
                            "level": 36,
                            "Move": "Agility"
                        }, {
                            "level": 44,
                            "Move": "Mirror Move"
                        }
                    ]
                }
            },
            "Pikachu": {
                "types": ["Electric"],
                "HP": 35,
                "Attack": 55,
                "Defense": 30,
                "Special": 50,
                "Speed": 90
            },
            "Pinsir": {
                "types": ["Bug"],
                "HP": 65,
                "Attack": 125,
                "Defense": 100,
                "Special": 55,
                "Speed": 85
            },
            "Poliwag": {
                "types": ["Water"],
                "HP": 40,
                "Attack": 50,
                "Defense": 40,
                "Special": 40,
                "Speed": 90
            },
            "Poliwhirl": {
                "types": ["Water"],
                "HP": 65,
                "Attack": 65,
                "Defense": 65,
                "Special": 50,
                "Speed": 90
            },
            "Poliwrath": {
                "types": ["Fighting", "Water"],
                "HP": 90,
                "Attack": 85,
                "Defense": 95,
                "Special": 70,
                "Speed": 70
            },
            "Ponyta": {
                "types": ["Fire"],
                "HP": 50,
                "Attack": 85,
                "Defense": 55,
                "Special": 65,
                "Speed": 90
            },
            "Porygon": {
                "types": ["Normal"],
                "HP": 65,
                "Attack": 60,
                "Defense": 70,
                "Special": 75,
                "Speed": 40
            },
            "Primeape": {
                "types": ["Fighting"],
                "HP": 65,
                "Attack": 105,
                "Defense": 60,
                "Special": 60,
                "Speed": 95
            },
            "Psyduck": {
                "types": ["Water"],
                "HP": 50,
                "Attack": 52,
                "Defense": 48,
                "Special": 50,
                "Speed": 55
            },
            "Raichu": {
                "types": ["Electric"],
                "HP": 60,
                "Attack": 90,
                "Defense": 55,
                "Special": 90,
                "Speed": 100
            },
            "Rapidash": {
                "types": ["Fire"],
                "HP": 65,
                "Attack": 100,
                "Defense": 70,
                "Special": 80,
                "Speed": 105
            },
            "Raticate": {
                "types": ["Normal"],
                "HP": 55,
                "Attack": 81,
                "Defense": 60,
                "Special": 50,
                "Speed": 97
            },
            "Rattata": {
                "types": ["Normal"],
                "HP": 30,
                "Attack": 56,
                "Defense": 35,
                "Special": 25,
                "Speed": 72,
                "moves": {
                    "natural": [
                        {
                            "level": 0,
                            "Move": "Tackle"
                        }, {
                            "level": 0,
                            "Move": "Tail Whip"
                        }, {
                            "level": 7,
                            "Move": "Quick Attack"
                        }, {
                            "level": 14,
                            "Move": "Hyper Fang"
                        }, {
                            "level": 23,
                            "Move": "Focus Energy"
                        }, {
                            "level": 34,
                            "Move": "Super Fang"
                        },
                    ]
                }
            },
            "Rhydon": {
                "types": ["Ground", "Rock"],
                "HP": 105,
                "Attack": 130,
                "Defense": 120,
                "Special": 45,
                "Speed": 40
            },
            "Rhyhorn": {
                "types": ["Ground", "Rock"],
                "HP": 80,
                "Attack": 85,
                "Defense": 95,
                "Special": 30,
                "Speed": 25
            },
            "Sandshrew": {
                "types": ["Ground"],
                "HP": 50,
                "Attack": 75,
                "Defense": 85,
                "Special": 30,
                "Speed": 40
            },
            "Sandslash": {
                "types": ["Ground"],
                "HP": 75,
                "Attack": 100,
                "Defense": 110,
                "Special": 55,
                "Speed": 65
            },
            "Scyther": {
                "types": ["Bug", "Flying"],
                "HP": 70,
                "Attack": 110,
                "Defense": 80,
                "Special": 55,
                "Speed": 105
            },
            "Seadra": {
                "types": ["Water"],
                "HP": 55,
                "Attack": 65,
                "Defense": 95,
                "Special": 95,
                "Speed": 85
            },
            "Seaking": {
                "types": ["Water"],
                "HP": 80,
                "Attack": 92,
                "Defense": 65,
                "Special": 80,
                "Speed": 68
            },
            "Seel": {
                "types": ["Water"],
                "HP": 65,
                "Attack": 45,
                "Defense": 55,
                "Special": 70,
                "Speed": 45
            },
            "Shellder": {
                "types": ["Water"],
                "HP": 30,
                "Attack": 65,
                "Defense": 100,
                "Special": 45,
                "Speed": 40
            },
            "Slowbro": {
                "types": ["Psychic", "Water"],
                "HP": 95,
                "Attack": 75,
                "Defense": 110,
                "Special": 80,
                "Speed": 30
            },
            "Slowpoke": {
                "types": ["Psychic", "Water"],
                "HP": 90,
                "Attack": 65,
                "Defense": 65,
                "Special": 40,
                "Speed": 15
            },
            "Snorlax": {
                "types": ["Normal"],
                "HP": 160,
                "Attack": 110,
                "Defense": 65,
                "Special": 65,
                "Speed": 30
            },
            "Spearow": {
                "types": ["Flying", "Normal"],
                "HP": 40,
                "Attack": 60,
                "Defense": 30,
                "Special": 31,
                "Speed": 70
            },
            "Squirtle": {
                "label": "TINYTURTLE",
                "sprite": "Water",
                "info": [
                    "After birth, its back swells and hardens into a",
                    "shell. Powerfully sprays foam out of its mouth."
                ],
                "number": 7,
                "height": ["1", "08"],
                "weight": "20.0",
                "types": ["Water"],
                "HP": 44,
                "Attack": 48,
                "Defense": 65,
                "Special": 50,
                "Speed": 43,
                "moves": {
                    "natural": [
                        {
                            "level": 0,
                            "Move": "Tackle"
                        }, {
                            "level": 0,
                            "Move": "Tail Whip"
                        }, {
                            "level": 8,
                            "Move": "Bubble"
                        }, {
                            "level": 15,
                            "Move": "Water Gun"
                        }, {
                            "level": 22,
                            "Move": "Bite"
                        }, {
                            "level": 28,
                            "Move": "Withdraw"
                        }, {
                            "level": 35,
                            "Move": "Skull Bash"
                        }, {
                            "level": 42,
                            "Move": "Hydro Pump"
                        }
                    ]
                }
            },
            "Starmie": {
                "types": ["Psychic", "Water"],
                "HP": 60,
                "Attack": 75,
                "Defense": 85,
                "Special": 100,
                "Speed": 115
            },
            "Staryu": {
                "types": ["Water"],
                "HP": 30,
                "Attack": 45,
                "Defense": 55,
                "Special": 70,
                "Speed": 85
            },
            "Tangela": {
                "types": ["Grass"],
                "HP": 65,
                "Attack": 55,
                "Defense": 115,
                "Special": 100,
                "Speed": 60
            },
            "Tauros": {
                "types": ["Normal"],
                "HP": 75,
                "Attack": 100,
                "Defense": 95,
                "Special": 70,
                "Speed": 110
            },
            "Tentacool": {
                "types": ["Poison", "Water"],
                "HP": 40,
                "Attack": 40,
                "Defense": 35,
                "Special": 100,
                "Speed": 70
            },
            "Tentacruel": {
                "types": ["Poison", "Water"],
                "HP": 80,
                "Attack": 70,
                "Defense": 65,
                "Special": 120,
                "Speed": 100
            },
            "Vaporeon": {
                "types": ["Water"],
                "HP": 130,
                "Attack": 65,
                "Defense": 60,
                "Special": 110,
                "Speed": 65
            },
            "Venomoth": {
                "types": ["Bug", "Poison"],
                "HP": 70,
                "Attack": 65,
                "Defense": 60,
                "Special": 90,
                "Speed": 90
            },
            "Venonat": {
                "types": ["Bug", "Poison"],
                "HP": 60,
                "Attack": 55,
                "Defense": 50,
                "Special": 40,
                "Speed": 45
            },
            "Venusaur": {
                "types": ["Grass", "Poison"],
                "HP": 80,
                "Attack": 82,
                "Defense": 83,
                "Special": 100,
                "Speed": 80
            },
            "Victreebel": {
                "types": ["Grass", "Poison"],
                "HP": 80,
                "Attack": 105,
                "Defense": 65,
                "Special": 100,
                "Speed": 70
            },
            "Vileplume": {
                "types": ["Grass", "Poison"],
                "HP": 75,
                "Attack": 80,
                "Defense": 85,
                "Special": 100,
                "Speed": 50
            },
            "Voltorb": {
                "types": ["Electric"],
                "HP": 40,
                "Attack": 30,
                "Defense": 50,
                "Special": 55,
                "Speed": 100
            },
            "Vulpix": {
                "types": ["Fire"],
                "HP": 38,
                "Attack": 41,
                "Defense": 40,
                "Special": 65,
                "Speed": 65
            },
            "Wartortle": {
                "types": ["Water"],
                "HP": 59,
                "Attack": 63,
                "Defense": 80,
                "Special": 65,
                "Speed": 58
            },
            "Weedle": {
                "types": ["Bug", "Poison"],
                "HP": 40,
                "Attack": 35,
                "Defense": 30,
                "Special": 20,
                "Speed": 50
            },
            "Weepinbell": {
                "types": ["Grass", "Poison"],
                "HP": 65,
                "Attack": 90,
                "Defense": 50,
                "Special": 85,
                "Speed": 55
            },
            "Weezing": {
                "types": ["Poison"],
                "HP": 65,
                "Attack": 90,
                "Defense": 120,
                "Special": 85,
                "Speed": 60
            },
            "Wigglytuff": {
                "types": ["Normal"],
                "HP": 140,
                "Attack": 70,
                "Defense": 45,
                "Special": 50,
                "Speed": 45
            },
            "Zapdos": {
                "types": ["Electric", "Flying"],
                "HP": 90,
                "Attack": 90,
                "Defense": 85,
                "Special": 125,
                "Speed": 100
            },
            "Zubat": {
                "types": ["Flying", "Poison"],
                "HP": 40,
                "Attack": 45,
                "Defense": 35,
                "Special": 40,
                "Speed": 55
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
                    ["effect", "Heal"],
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
        }
    }
};