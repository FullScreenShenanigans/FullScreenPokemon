FullScreenPokemon.prototype.settings.math = {
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
        }
    },
    "equations": {
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
                    (pokemon.hpMax * 255 * 4) | 0 / (pokemon.hpCurrent * ball.rate) | 0,
                    255
                ),
                1
            );

            // 7. If f is greater than or equal to M, the Pokemon is caught. Otherwise, the Pokemon breaks free.
            return f > m;
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
                    (pokemon.hpMax * 255 * 4) | 0 / (pokemon.hpCurrent * ball.rate) | 0,
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
        }
    }
};