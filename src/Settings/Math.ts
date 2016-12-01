/// <reference path="../../typings/GameStartr.d.ts" />

import { Animations } from "../Animations";
import { Unitsize } from "../Constants";
import { Cycling } from "../Cycling";
import { Fishing } from "../Fishing";
import {
    IBattleBall, IBattleInfo, IBattleModification, IBattler,
    ICharacter, IGrass, IHMMoveSchema,
    IMathConstants, IMathModuleSettings, IMathEquations, IMovePossibility,
    IMoveSchema, IPokemon, IPokemonListing, IPokemonMoveListing, IRod, IWildPokemonSchema
} from "../IFullScreenPokemon";

/* tslint:disable:max-line-length */
/* tslint:disable object-literal-key-quotes */

export function GenerateMathSettings(): IMathModuleSettings {
    "use strict";

    return {
        "equations": {
            "averageLevel": function (constants: IMathConstants, equations: IMathEquations, actors: IPokemon[]): number {
                let average: number = 0;

                for (let i: number = 0; i < actors.length; i += 1) {
                    average += actors[i].level;
                }

                return Math.round(average / actors.length);
            },
            "averageLevelWildPokemon": function (constants: IMathConstants, equations: IMathEquations, options: IWildPokemonSchema[]): number {
                let average: number = 0;

                for (const wildPokemon of options) {
                    if (wildPokemon.level) {
                        average += wildPokemon.level * wildPokemon.rate;
                        continue;
                    }
                    let levelAverage: number = 0;

                    for (const level of wildPokemon.levels) {
                        levelAverage += level * (1 / wildPokemon.levels.length);
                    }

                    average += levelAverage * wildPokemon.rate;
                }

                return Math.round(average);
            },
            "speedCycling": function (constants: IMathConstants, equations: IMathEquations, thing: ICharacter): number {
                return thing.speed * 2;
            },
            "speedWalking": function (constants: IMathConstants, equations: IMathEquations, thing: ICharacter): number {
                return Math.round(8 * Unitsize / thing.speed);
            },
            "newPokemon": function (constants: IMathConstants, equations: IMathEquations, title: string[], level?: number, moves?: BattleMovr.IMove[], iv?: number, ev?: number): IPokemon {
                const statisticNames: string[] = constants.statisticNames;
                const pokemon: any = {
                    "title": title,
                    "nickname": title,
                    "level": level || 1,
                    "moves": moves || this.compute("newPokemonMoves", title, level || 1),
                    "types": constants.pokemon[title.join("")].types,
                    "status": "",
                    "IV": iv || this.compute("newPokemonIVs"),
                    "EV": ev || this.compute("newPokemonEVs"),
                    "experience": this.compute("newPokemonExperience", title, level || 1)
                };

                for (const statistic of statisticNames) {
                    pokemon[statistic] = this.compute("pokemonStatistic", pokemon, statistic);
                    pokemon[statistic + "Normal"] = pokemon[statistic];
                }

                return pokemon;
            },
            // http://bulbapedia.bulbagarden.net/wiki/XXXXXXX_(Pok%C3%A9mon)/Generation_I_learnset
            "newPokemonMoves": function (constants: IMathConstants, equations: IMathEquations, title: string[], level: number): BattleMovr.IMove[] {
                const possibilities: IPokemonMoveListing[] = constants.pokemon[title.join("")].moves.natural;
                const output: BattleMovr.IMove[] = [];
                let move: IPokemonMoveListing;
                let newMove: BattleMovr.IMove;
                let end: number;

                for (end = 0; end < possibilities.length; end += 1) {
                    if (possibilities[end].level > level) {
                        break;
                    }
                }

                for (let i: number = Math.max(end - 4, 0); i < end; i += 1) {
                    move = possibilities[i];
                    newMove = {
                        title: move.move,
                        remaining: constants.moves[move.move].PP,
                        uses: constants.moves[move.move].PP
                    };

                    output.push(newMove);
                }

                return output;
            },
            // http://bulbapedia.bulbagarden.net/wiki/Individual_values
            "newPokemonIVs": function (constants: IMathConstants, equations: IMathEquations): { [i: string]: number } {
                const attack: number = constants.NumberMaker.randomIntWithin(0, 15);
                const defense: number = constants.NumberMaker.randomIntWithin(0, 15);
                const speed: number = constants.NumberMaker.randomIntWithin(0, 15);
                const special: number = constants.NumberMaker.randomIntWithin(0, 15);
                const output: any = {
                    "Attack": attack,
                    "Defense": defense,
                    "Speed": speed,
                    "Special": special
                };

                output.HP = (
                    8 * (attack % 2)
                    + 4 * (defense % 2)
                    + 2 * (speed % 2)
                    + (special % 2)
                );

                return output;
            },
            "newPokemonEVs": function (constants: IMathConstants, equations: IMathEquations): { [i: string]: number } {
                return {
                    "Attack": 0,
                    "Defense": 0,
                    "Speed": 0,
                    "Special": 0
                };
            },
            "newPokemonExperience": function (constants: IMathConstants, equations: IMathEquations, title: string[], level: number): BattleMovr.IActorExperience {
                return {
                    current: this.compute("experienceStarting", title, level),
                    next: this.compute("experienceStarting", title, level + 1)
                };
            },
            // http://bulbapedia.bulbagarden.net/wiki/Individual_values
            // Note: the page mentions rounding errors... 
            "pokemonStatistic": function (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, statistic: string): number {
                let topExtra: number = 0;
                let added: number = 5;
                let base: number = (constants.pokemon[pokemon.title.join("")] as any)[statistic];
                let iv: number = (pokemon.IV as any)[statistic] || 0;
                let ev: number = (pokemon.EV as any)[statistic] || 0;
                let level: number = pokemon.level;

                if (statistic === "HP") {
                    topExtra = 50;
                    added = 10;
                }

                let numerator: number = (iv + base + (Math.sqrt(ev) / 8) + topExtra) * level;

                return (numerator / 50 + added) | 0;
            },
            // http://bulbapedia.bulbagarden.net/wiki/Tall_grass
            "doesGrassEncounterHappen": function (constants: IMathConstants, equations: IMathEquations, grass: IGrass): boolean {
                return constants.NumberMaker.randomBooleanFraction(grass.rarity, 187.5);
            },
            // http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
            "canCatchPokemon": function (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall): boolean {
                // 1. If a Master Ball is used, the Pokemon is caught.
                if (ball.type === "Master") {
                    return true;
                }

                // 2. Generate a random number, N, depending on the type of ball used.
                let n: number = constants.NumberMaker.randomInt(ball.probabilityMax);

                // 3. The Pokemon is caught if...
                if (pokemon.status) { // ... it is asleep or frozen and N is less than 25.
                    if (n < 25) {
                        if (constants.statuses.probability25[pokemon.status]) {
                            return true;
                        }
                    } else if (n < 12) { // ... it is paralyzed, burned, or poisoned and N is less than 12.
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
                let m: number = constants.NumberMaker.randomInt(255);

                // 6. Calculate f.
                let f: number = Math.max(
                    Math.min(
                        (pokemon.HPNormal * 255 * 4) | 0 / (pokemon.HP * ball.rate) | 0,
                        255),
                    1);

                // 7. If f is greater than or equal to M, the Pokemon is caught. Otherwise, the Pokemon breaks free.
                return f > m;
            },
            // @todo Add functionality.
            "canLandFish": function (constants: IMathConstants, equations: IMathEquations): boolean {
                return true;
            },
            // http://bulbapedia.bulbagarden.net/wiki/Escape#Generation_I_and_II
            "canEscapePokemon": function (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, enemy: IPokemon, battleInfo: IBattleInfo): boolean {
                const a: number = pokemon.Speed;
                const b: number = (enemy.Speed / 4) % 256;
                const c: number = battleInfo.currentEscapeAttempts;
                const f: number = (a * 32) / b + 30 * c;

                if (f > 255 || b === 0) {
                    return true;
                }

                return constants.NumberMaker.randomInt(256) < f;
            },
            // http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
            "numBallShakes": function (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall): number {
                // 1. Calculate d.
                const d: number = pokemon.catchRate * 100 / ball.rate;

                // 2. If d is greater than or equal to 256, the ball shakes three times before the Pokemon breaks free.
                if (d >= 256) {
                    return 3;
                }

                // 3. If not, calculate x = d * f / 255 + s, where s is 10 if the Pokemon is asleep or frozen or 5 if it is paralyzed, poisoned, or burned.
                const f: number = Math.max(
                    Math.min(
                        (pokemon.HPNormal * 255 * 4) | 0 / (pokemon.HP * ball.rate) | 0,
                        255),
                    1);
                const x: number = d * f / 255 + constants.statuses.shaking[pokemon.status];

                // 4. If... 
                if (x < 10) { // x < 10: the Ball misses the Pokemon completely.
                    return 0;
                }

                // x < 30: the Ball shakes once before the Pokemon breaks free.
                if (x < 30) {
                    return 1;
                }

                // x < 70: the Ball shakes twice before the Pokemon breaks free.
                if (x < 70) {
                    return 2;
                }

                // Otherwise, the Ball shakes three times before the Pokemon breaks free.
                return 3;
            },
            // http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
            // TO DO: Also filter for moves with > 0 remaining remaining...
            "opponentMove": function (constants: IMathConstants, equations: IMathEquations, player: IBattler, opponent: IBattler): string {
                let possibilities: IMovePossibility[] = opponent.selectedActor.moves.map(
                    (move: BattleMovr.IMove): IMovePossibility => {
                        return {
                            "move": move.title,
                            "priority": 10
                        };
                    });

                // Wild Pokemon just choose randomly
                if (opponent.category === "Wild") {
                    return constants.NumberMaker.randomArrayMember(possibilities).move;
                }

                // Modification 1: Do not use a move that only statuses (e.g. Thunder Wave) if the player's pokémon already has a status.
                if (player.selectedActor.status && !opponent.dumb) {
                    for (const possibility of possibilities) {
                        if (this.compute("moveOnlyStatuses", possibility.move)) {
                            possibility.priority += 5;
                        }
                    }
                }

                // Modification 2: On the second turn the pokémon is out, prefer a move with one of the following effects...
                if (this.compute("pokemonMatchesTypes", opponent, constants.battleModifications["Turn 2"])) {
                    for (const possibility of possibilities) {
                        this.compute(
                            "applyMoveEffectPriority",
                            possibility,
                            constants.battleModifications["Turn 2"],
                            player.selectedActor,
                            1);
                    }
                }

                // Modification 3 (Good AI): Prefer a move that is super effective. Do not use moves that are not very effective as long as there is an alternative.
                if (this.compute("pokemonMatchesTypes", opponent, constants.battleModifications["Good AI"])) {
                    for (let i: number = 0; i < possibilities.length; i += 1) {
                        this.compute(
                            "applyMoveEffectPriority",
                            possibilities[i],
                            constants.battleModifications["Good AI"],
                            player.selectedActor,
                            1);
                    }
                }

                // The AI uses rejection sampling on the four moves with ratio 63:64:63:66, with only the moves that are most favored after applying the modifications being acceptable.
                let lowest: number = possibilities[0].priority;
                if (possibilities.length > 1) {
                    for (let i: number = 1; i < possibilities.length; i += 1) {
                        if (possibilities[i].priority < lowest) {
                            lowest = possibilities[i].priority;
                        }
                    }
                    possibilities = possibilities.filter(function (possibility: IMovePossibility): boolean {
                        return possibility.priority === lowest;
                    });
                }

                return constants.NumberMaker.randomArrayMember(possibilities).move;
            },
            "pokemonMatchesTypes": function (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, types: string[]): boolean {
                for (let i: number = 0; i < types.length; i += 1) {
                    if (pokemon.types.indexOf(types[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },
            "moveOnlyStatuses": function (constants: IMathConstants, equations: IMathEquations, move: IMoveSchema): boolean {
                return move.damage === "Non-Damaging" && move.effect === "Status";
            },
            "applyMoveEffectPriority": function (constants: IMathConstants, equations: IMathEquations, possibility: IMovePossibility, modification: IBattleModification, target: IPokemon, amount: number): void {
                const preferences: ([string, string, number] | [string, string])[] = modification.preferences;
                const move: IMoveSchema = constants.moves[possibility.move];

                for (let i: number = 0; i < preferences.length; i += 1) {
                    let preference: [string, string, number] | [string, string] = preferences[i];

                    switch (preference[0]) {
                        // ["Move", String]
                        // Favorable match
                        case "Move":
                            if (possibility.move === preference[1]) {
                                possibility.priority -= amount;
                                return;
                            }
                            break;

                        // ["Raise", String, Number]
                        // Favorable match
                        case "Raise":
                            if (
                                move.effect === "Raise"
                                && move.raise === preference[1]
                                && move.amount === preference[2]
                            ) {
                                possibility.priority -= amount;
                                return;
                            }
                            break;

                        // ["Lower", String, Number]
                        // Favorable match
                        case "Lower":
                            if (
                                move.effect === "Lower"
                                && move.lower === preference[1]
                                && move.amount === preference[2]
                            ) {
                                possibility.priority -= amount;
                                return;
                            }
                            break;

                        // ["Super", String, String]
                        // Favorable match
                        case "Super":
                            if (
                                move.damage !== "Non-Damaging"
                                && move.type === preference[0]
                                && target.types.indexOf(preference[1]) !== -1
                            ) {
                                possibility.priority -= amount;
                                return;
                            }
                            break;

                        // ["Weak", String, String]
                        // Unfavorable match
                        case "Weak":
                            if (
                                move.damage !== "Non-Damaging"
                                && move.type === preference[0]
                                && target.types.indexOf(preference[1]) !== -1
                            ) {
                                possibility.priority += amount;
                                return;
                            }
                            break;

                        // By default, do nothing
                        default:
                            break;
                    }
                }
            },
            // http://bulbapedia.bulbagarden.net/wiki/Priority
            // TO DO: Account for items, switching, etc.
            // TO DO: Factor in spec differences from paralyze, etc.
            "playerMovesFirst": function (constants: IMathConstants, equations: IMathEquations, player: IBattler, choicePlayer: string, opponent: IBattler, choiceOpponent: string): boolean {
                const movePlayer: IMoveSchema = constants.moves[choicePlayer];
                const moveOpponent: IMoveSchema = constants.moves[choiceOpponent];

                if (movePlayer.priority === moveOpponent.priority) {
                    return player.selectedActor.Speed > opponent.selectedActor.Speed;
                }

                return movePlayer.priority > moveOpponent.priority;
            },
            // http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
            // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
            // TO DO: Factor in spec differences from burns, etc.
            "damage": function (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon, defender: IPokemon): number {
                let base: string | number = constants.moves[move].power;

                // A base attack that's not numeric means no damage, no matter what
                if (!base || isNaN(base as number)) {
                    return 0;
                }

                // Don't bother calculating infinite damage: it's going to be infinite
                if (base === Infinity) {
                    return Infinity;
                }

                const critical: boolean = this.compute("criticalHit", move, attacker);
                const level: number = attacker.level * Number(critical);
                const attack: number = attacker.Attack;
                const defense: number = defender.Defense;
                const modifier: number = this.compute("damageModifier", move, critical, attacker, defender);

                return Math.round(
                    Math.max(
                        ((((2 * level + 10) / 250) * (attack / defense) * (base as number) + 2) | 0) * modifier,
                        1));
            },
            // http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
            // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
            "damageModifier": function (constants: IMathConstants, equations: IMathEquations, move: IMoveSchema, critical: boolean, attacker: IPokemon, defender: IPokemon): number {
                const stab: number = attacker.types.indexOf(move.type) !== -1 ? 1.5 : 1;
                const type: number = this.compute("typeEffectiveness", move, defender);

                return stab * type * constants.NumberMaker.randomWithin(.85, 1);
            },
            // http://bulbapedia.bulbagarden.net/wiki/Critical_hit
            "criticalHit": function (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon): boolean {
                const moveInfo: IMoveSchema = constants.moves[move];
                const baseSpeed: number = constants.pokemon[attacker.title.join("")].Speed;
                let denominator: number = 512;

                // Moves with a high critical-hit ratio, such as Slash, are eight times more likely to land a critical hit, resulting in a probability of BaseSpeed / 64.
                if (moveInfo.criticalRaised) {
                    denominator /= 8;
                }

                // "Focus Energy and Dire Hit were intended to increase the critical hit rate, ..."
                // In FullScreenPokemon, they work as intended! Fans who prefer the
                // original behavior are free to fork the repo. As the original
                // behavior is a glitch (and conflicts with creators' intentions),
                // it is not duplicated here.
                if (attacker.criticalHitProbability) {
                    denominator /= 4;
                }

                // As with move accuracy in the handheld games, if the probability of landing a critical hit would be 100%, it instead becomes 255/256 or about 99.6%.
                return constants.NumberMaker.randomBooleanProbability(Math.max(baseSpeed / denominator, 255 / 256));
            },
            // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
            "typeEffectiveness": function (constants: IMathConstants, equations: IMathEquations, move: string, defender: IPokemon): number {
                const defenderTypes: string[] = constants.pokemon[defender.title.join("")].types;
                const moveIndex: number = constants.types.indices[constants.moves[move].type];
                let total: number = 1;

                for (let i: number = 0; i < defenderTypes.length; i += 1) {
                    total *= constants.types.table[moveIndex][constants.types.indices[defenderTypes[i]]];
                }

                return total;
            },
            // http://m.bulbapedia.bulbagarden.net/wiki/Experience#Relation_to_level
            // Wild Pokémon of any level will always have the base amount of experience required to reach that level when caught, as will Pokémon hatched from Eggs.
            "experienceStarting": function (constants: IMathConstants, equations: IMathEquations, title: string[], level: number): number {
                let reference: IPokemonListing = constants.pokemon[title.join("")];

                // TODO: remove defaulting to mediumFast
                switch (reference.experienceType) {
                    case "fast":
                        return (4 * Math.pow(level, 3)) / 5;
                    case "mediumSlow":
                        return (
                            (6 / 5) * Math.pow(level, 3)
                            - (15 * Math.pow(level, 2))
                            + (100 * level)
                            - 140);
                    case "slow":
                        return (5 * Math.pow(level, 3)) / 4;
                    // case "mediumFast":
                    default:
                        return Math.pow(level, 3);
                }
            },
            // http://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
            "experienceGained": function (constants: IMathConstants, equations: IMathEquations, player: IBattler, opponent: IBattler): number {
                // a is equal to 1 if the fainted Pokemon is wild, or 1.5 if the fainted Pokemon is owned by a Trainer
                let a: number = opponent.category === "Trainer" ? 1.5 : 1;

                // b is the base experience yield of the fainted Pokemon's species
                let b: number = 64; // (Bulbasaur) TO DO: add this in

                // lf is the level of the fainted Pokemon
                let lf: number = opponent.selectedActor.level;

                // s is equal to (in Gen I), if Exp. All is not in the player's Bag...
                // TO DO: Account for modifies like Exp. All
                let s: number = 1;

                // t is equal to 1 if the winning Pokemon's curent owner is its OT, or 1.5 if the Pokemon was gained in a domestic trade
                let t: number = player.selectedActor.traded ? 1.5 : 1;

                return (((a * t * b * lf) | 0) / ((7 * s) | 0)) | 0;
            },
            "widthHealthBar": function (constants: IMathConstants, equations: IMathEquations, widthFullBar: number, hp: number, hpNormal: number): number {
                return (widthFullBar - 1) * hp / hpNormal;
            }
        },
        "constants": {
            "statisticNames": ["HP", "Attack", "Defense", "Speed", "Special"],
            "statisticNamesDisplayed": ["Attack", "Defense", "Speed", "Special"],
            "unitsize": Unitsize,
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
            "townMapLocations": {
                "Pallet Town": [18, 48],
                "Pewter City": [18, 16],
                "Serebii Islands": [18, 64],
                "Viridian City": [18, 36]
            },
            /**
             * @see http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
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
             * @see http://www.smogon.com/dex/rb/pokemon/
             */
            "pokemon": {
                "ABRA": {
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
                            "move": "Teleport",
                            "level": 1
                        }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "AERODACTYL": {
                    "label": "Fossil",
                    "sprite": "Water",
                    "info": [
                        "A ferocious, prehistoric %%%%%%%POKEMON%%%%%%% that goes for the enemy's throat with its serrated saw-like fangs."
                    ],
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
                            "move": "Agility",
                            "level": 1
                        }, {
                                "move": "Wing Attack",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 33
                            }, {
                                "move": "Bite",
                                "level": 38
                            }, {
                                "move": "Take Down",
                                "level": 45
                            }, {
                                "move": "Hyper Beam",
                                "level": 54
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [{
                            "move": "Razor Wind",
                            "level": 2
                        }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ALAKAZAM": {
                    "label": "Psi",
                    "sprite": "Water",
                    "info": [
                        "Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5,000."
                    ],
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Teleport",
                                "level": 1
                            }, {
                                "move": "Confusion",
                                "level": 16
                            }, {
                                "move": "Disable",
                                "level": 20
                            }, {
                                "move": "Psybeam",
                                "level": 27
                            }, {
                                "move": "Recover",
                                "level": 31
                            }, {
                                "move": "Psychic",
                                "level": 38
                            }, {
                                "move": "Reflect",
                                "level": 42
                            }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ARBOK": {
                    "label": "Cobra",
                    "sprite": "Water",
                    "info": [
                        "It is rumored that the ferocious warning markings on its belly differ from area to area."
                    ],
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Poison Sting",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Poison Sting",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 17
                            }, {
                                "move": "Glare",
                                "level": 27
                            }, {
                                "move": "Screech",
                                "level": 36
                            }, {
                                "move": "Acid",
                                "level": 47
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ARCANINE": {
                    "label": "Legendary",
                    "sprite": "Water",
                    "info": [
                        "A %%%%%%%POKEMON%%%%%%% that has been admired since the past for its beauty. It runs agilely as if on wings."
                    ],
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Roar",
                                "level": 1
                            }, {
                                "move": "Take Down",
                                "level": 1
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ARTICUNO": {
                    "label": "Freeze",
                    "sprite": "Water",
                    "info": [
                        "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear to doomed people who are lost in icy mountains."
                    ],
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
                        "natural": [
                            {
                                "move": "Ice Beam",
                                "level": 1
                            }, {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Blizzard",
                                "level": 51
                            }, {
                                "move": "Agility",
                                "level": 55
                            }, {
                                "move": "Mist",
                                "level": 60
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "BEEDRILL": {
                    "label": "Poison Bee",
                    "sprite": "Water",
                    "info": [
                        "Flies at high speed and attacks using its large venomous stingers on its forelegs and tail."
                    ],
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
                        "natural": [
                            {
                                "move": "Fury Attack",
                                "level": 1
                            }, {
                                "move": "Fury Attack",
                                "level": 12
                            }, {
                                "move": "Focus Energy",
                                "level": 16
                            }, {
                                "move": "Twineedle",
                                "level": 20
                            }, {
                                "move": "Rage",
                                "level": 25
                            }, {
                                "move": "Pin Missile",
                                "level": 30
                            }, {
                                "move": "Agility",
                                "level": 35
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [{
                            "move": "Cut",
                            "level": 1
                        }]
                    }
                },
                "BELLSPROUT": {
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
                        "natural": [
                            {
                                "move": "Growth",
                                "level": 1
                            }, {
                                "move": "Vine Whip",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Sleep Powder",
                                "level": 18
                            }, {
                                "move": "Stun Spore",
                                "level": 21
                            }, {
                                "move": "Acid",
                                "level": 26
                            }, {
                                "move": "Razor Leaf",
                                "level": 33
                            }, {
                                "move": "Slam",
                                "level": 42
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "BLASTOISE": {
                    "label": "Shellfish",
                    "sprite": "Water",
                    "info": [
                        "A brutal %%%%%%%POKEMON%%%%%%% with pressurized water jets on its shell. They are used for high speed tackles."
                    ],
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Bubble",
                                "level": 8
                            }, {
                                "move": "Water Gun",
                                "level": 15
                            }, {
                                "move": "Bite",
                                "level": 24
                            }, {
                                "move": "Withdraw",
                                "level": 31
                            }, {
                                "move": "Skull Bash",
                                "level": 42
                            }, {
                                "move": "Hydro Pump",
                                "level": 52
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "BULBASAUR": {
                    "label": "Seed",
                    "sprite": "Water",
                    "info": [
                        "A strange seed was planted on its back at birth.",
                        "The plant sprouts and grows with this %%%%%%%POKEMON%%%%%%%."
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Leech Seed",
                                "level": 7
                            }, {
                                "move": "Vine Whip",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 20
                            }, {
                                "move": "Razor Leaf",
                                "level": 27
                            }, {
                                "move": "Growth",
                                "level": 34
                            }, {
                                "move": "Sleep Powder",
                                "level": 41
                            }, {
                                "move": "Solar Beam",
                                "level": 48
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "BUTTERFREE": {
                    "label": "Butterfly",
                    "sprite": "Water",
                    "info": [
                        "In battle, it flaps its wings at high speed to release highly toxic dust into the air."
                    ],
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Confusion",
                                "level": 12
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Stun Spore",
                                "level": 16
                            }, {
                                "move": "Sleep Powder",
                                "level": 17
                            }, {
                                "move": "Supersonic",
                                "level": 21
                            }, {
                                "move": "Whirlwind",
                                "level": 26
                            }, {
                                "move": "Psybeam",
                                "level": 32
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CATERPIE": {
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
                            "move": "String Shot",
                            "level": 1
                        }, {
                                "move": "Tackle",
                                "level": 1
                            }],
                        "hm": [],
                        "tm": []
                    }
                },
                "CHANSEY": {
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
                        "natural": [
                            {
                                "move": "Double Slap",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Sing",
                                "level": 24
                            }, {
                                "move": "Growl",
                                "level": 30
                            }, {
                                "move": "Minimize",
                                "level": 38
                            }, {
                                "move": "Defense Curl",
                                "level": 44
                            }, {
                                "move": "Light Screen",
                                "level": 48
                            }, {
                                "move": "Double-Edge",
                                "level": 54
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Egg Bomb",
                                "level": 37
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Soft-Boiled",
                                "level": 41
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CHARIZARD": {
                    "label": "Flame",
                    "sprite": "Water",
                    "info": [
                        "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally."
                    ],
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Ember",
                                "level": 9
                            }, {
                                "move": "Leer",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 36
                            }, {
                                "move": "Flamethrower",
                                "level": 46
                            }, {
                                "move": "Fire Spin",
                                "level": 55
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CHARMANDER": {
                    "label": "Lizard",
                    "sprite": "Water",
                    "info": [
                        "Obviously prefers hot places.",
                        "When it rains, steam is said to spout from the tip of its tail."
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Ember",
                                "level": 9
                            }, {
                                "move": "Leer",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 22
                            }, {
                                "move": "Slash",
                                "level": 30
                            }, {
                                "move": "Flamethrower",
                                "level": 38
                            }, {
                                "move": "Fire Spin",
                                "level": 46
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CHARMELEON": {
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Ember",
                                "level": 9
                            }, {
                                "move": "Leer",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 33
                            }, {
                                "move": "Flamethrower",
                                "level": 42
                            }, {
                                "move": "Fire Spin",
                                "level": 56
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CLEFABLE": {
                    "label": "Fairy",
                    "sprite": "Water",
                    "info": [
                        "A timid fairy %%%%%%%POKEMON%%%%%%% that is rarely seen. It will run and hide the moment it senses people."
                    ],
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
                        "natural": [
                            {
                                "move": "Double Slap",
                                "level": 1
                            }, {
                                "move": "Metronome",
                                "level": 1
                            }, {
                                "move": "Minimize",
                                "level": 1
                            }, {
                                "move": "Sing",
                                "level": 1
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }]
                    }
                },
                "CLEFAIRY": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Sing",
                                "level": 13
                            }, {
                                "move": "Double Slap",
                                "level": 18
                            }, {
                                "move": "Minimize",
                                "level": 24
                            }, {
                                "move": "Metronome",
                                "level": 31
                            }, {
                                "move": "Defense Curl",
                                "level": 39
                            }, {
                                "move": "Light Screen",
                                "level": 48
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "CLOYSTER": {
                    "label": "Bivalve",
                    "sprite": "Water",
                    "info": [
                        "When attacked, it launches its horns in quick volleys. Its innards have never been seen."
                    ],
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
                        "natural": [
                            {
                                "move": "Aurora Beam",
                                "level": 1
                            }, {
                                "move": "Clamp",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 1
                            }, {
                                "move": "Withdraw",
                                "level": 1
                            }, {
                                "move": "Spike Cannon",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [{
                            "move": "Surf",
                            "level": 3
                        }]
                    }
                },
                "CUBONE": {
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
                        "natural": [
                            {
                                "move": "Bone Club",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 25
                            }, {
                                "move": "Focus Energy",
                                "level": 31
                            }, {
                                "move": "Thrash",
                                "level": 38
                            }, {
                                "move": "Bonemerang",
                                "level": 43
                            }, {
                                "move": "Rage",
                                "level": 46
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DEWGONG": {
                    "label": "Sea Lion",
                    "sprite": "Water",
                    "info": [
                        "Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters."
                    ],
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
                        "natural": [
                            {
                                "move": "Aurora Beam",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Headbutt",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 30
                            }, {
                                "move": "Aurora Beam",
                                "level": 35
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Take Down",
                                "level": 50
                            }, {
                                "move": "Ice Beam",
                                "level": 56
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DIGLETT": {
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
                        "natural": [
                            {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 15
                            }, {
                                "move": "Dig",
                                "level": 19
                            }, {
                                "move": "Sand Attack",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 31
                            }, {
                                "move": "Earthquake",
                                "level": 40
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 15
                            }, {
                                "move": "Dig",
                                "level": 19
                            }, {
                                "move": "Sand Attack",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 31
                            }, {
                                "move": "Earthquake",
                                "level": 40
                            }]
                    }
                },
                "DITTO": {
                    "label": "Transform",
                    "sprite": "Water",
                    "info": [
                        "Capable of copying an enemy's genetic code to instantly transform itself into a duplicate of the enemy."
                    ],
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
                            "move": "Transform",
                            "level": 1
                        }],
                        "hm": [],
                        "tm": []
                    }
                },
                "DODRIO": {
                    "label": "Triple Bird",
                    "sprite": "Water",
                    "info": [
                        "Uses its three brains to execute complex plans. While two heads sleep, one head stays awake."
                    ],
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
                        "natural": [
                            {
                                "move": "Fury Attack",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 20
                            }, {
                                "move": "Fury Attack",
                                "level": 24
                            }, {
                                "move": "Drill Peck",
                                "level": 30
                            }, {
                                "move": "Rage",
                                "level": 39
                            }, {
                                "move": "Tri Attack",
                                "level": 45
                            }, {
                                "move": "Agility",
                                "level": 51
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DODUO": {
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
                        "natural": [
                            {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 20
                            }, {
                                "move": "Fury Attack",
                                "level": 24
                            }, {
                                "move": "Drill Peck",
                                "level": 30
                            }, {
                                "move": "Rage",
                                "level": 36
                            }, {
                                "move": "Tri Attack",
                                "level": 40
                            }, {
                                "move": "Agility",
                                "level": 44
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [
                            {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DRAGONAIR": {
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 10
                            }, {
                                "move": "Agility",
                                "level": 20
                            }, {
                                "move": "Slam",
                                "level": 35
                            }, {
                                "move": "Dragon Rage",
                                "level": 45
                            }, {
                                "move": "Hyper Beam",
                                "level": 55
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DRAGONITE": {
                    "label": "Dragon",
                    "sprite": "Water",
                    "info": [
                        "An extremely rarely seen marine %%%%%%%POKEMON%%%%%%%. Its intelligence is said to match that of humans."
                    ],
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
                        "natural": [
                            {
                                "move": "Agility",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 10
                            }, {
                                "move": "Agility",
                                "level": 20
                            }, {
                                "move": "Slam",
                                "level": 35
                            }, {
                                "move": "Dragon Rage",
                                "level": 45
                            }, {
                                "move": "Hyper Beam",
                                "level": 60
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DRATINI": {
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 10
                            }, {
                                "move": "Agility",
                                "level": 20
                            }, {
                                "move": "Slam",
                                "level": 30
                            }, {
                                "move": "Dragon Rage",
                                "level": 40
                            }, {
                                "move": "Hyper Beam",
                                "level": 50
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DROWZEE": {
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
                        "natural": [
                            {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 12
                            }, {
                                "move": "Confusion",
                                "level": 17
                            }, {
                                "move": "Headbutt",
                                "level": 24
                            }, {
                                "move": "Poison Gas",
                                "level": 29
                            }, {
                                "move": "Psychic",
                                "level": 32
                            }, {
                                "move": "Meditate",
                                "level": 37
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Dream Eater",
                                "level": 42
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "DUGTRIO": {
                    "label": "Mole",
                    "sprite": "Water",
                    "info": [
                        "A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground."
                    ],
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
                        "natural": [
                            {
                                "move": "Dig",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 15
                            }, {
                                "move": "Dig",
                                "level": 19
                            }, {
                                "move": "Sand Attack",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 35
                            }, {
                                "move": "Earthquake",
                                "level": 47
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Dig",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 15
                            }, {
                                "move": "Dig",
                                "level": 19
                            }, {
                                "move": "Sand Attack",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 35
                            }, {
                                "move": "Earthquake",
                                "level": 47
                            }]
                    }
                },
                "EEVEE": {
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
                        "natural": [
                            {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 27
                            }, {
                                "move": "Tail Whip",
                                "level": 31
                            }, {
                                "move": "Bite",
                                "level": 37
                            }, {
                                "move": "Take Down",
                                "level": 45
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 8
                            }, {
                                "move": "Growl",
                                "level": 16
                            }, {
                                "move": "Quick Attack",
                                "level": 23
                            }, {
                                "move": "Bite",
                                "level": 30
                            }, {
                                "move": "Focus Energy",
                                "level": 36
                            }, {
                                "move": "Take Down",
                                "level": 42
                            }]
                    }
                },
                "EKANS": {
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Poison Sting",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 17
                            }, {
                                "move": "Glare",
                                "level": 24
                            }, {
                                "move": "Screech",
                                "level": 31
                            }, {
                                "move": "Acid",
                                "level": 38
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ELECTABUZZ": {
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 34
                            }, {
                                "move": "Screech",
                                "level": 37
                            }, {
                                "move": "Thunder Punch",
                                "level": 42
                            }, {
                                "move": "Light Screen",
                                "level": 49
                            }, {
                                "move": "Thunder",
                                "level": 54
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ELECTRODE": {
                    "label": "Ball",
                    "sprite": "Water",
                    "info": [
                        "It stores electric energy under very high pressure. It often explodes with little or no provocation."
                    ],
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
                        "natural": [
                            {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Sonic Boom",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sonic Boom",
                                "level": 17
                            }, {
                                "move": "Self-Destruct",
                                "level": 22
                            }, {
                                "move": "Light Screen",
                                "level": 29
                            }, {
                                "move": "Swift",
                                "level": 40
                            }, {
                                "move": "Explosion",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [{
                            "move": "Toxic",
                            "level": 6
                        }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "EXEGGCUTE": {
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
                        "natural": [
                            {
                                "move": "Barrage",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Reflect",
                                "level": 25
                            }, {
                                "move": "Leech Seed",
                                "level": 28
                            }, {
                                "move": "Stun Spore",
                                "level": 32
                            }, {
                                "move": "Poison Powder",
                                "level": 37
                            }, {
                                "move": "Solar Beam",
                                "level": 42
                            }, {
                                "move": "Sleep Powder",
                                "level": 48
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Barrage",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Reflect",
                                "level": 25
                            }, {
                                "move": "Leech Seed",
                                "level": 28
                            }, {
                                "move": "Stun Spore",
                                "level": 32
                            }, {
                                "move": "Poison Powder",
                                "level": 37
                            }, {
                                "move": "Solar Beam",
                                "level": 42
                            }, {
                                "move": "Sleep Powder",
                                "level": 48
                            }]
                    }
                },
                "EXEGGUTOR": {
                    "label": "Coconut",
                    "sprite": "Water",
                    "info": [
                        "Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE."
                    ],
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
                        "natural": [
                            {
                                "move": "Barrage",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 28
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [{
                            "move": "Strength",
                            "level": 4
                        }]
                    }
                },
                "FARFETCHD": {
                    "label": "Wild Duck",
                    "sprite": "Water",
                    "info": [
                        "The sprig of green onions it holds is its weapon. It is used much like a metal sword."
                    ],
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
                        "natural": [
                            {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 7
                            }, {
                                "move": "Fury Attack",
                                "level": 15
                            }, {
                                "move": "Swords Dance",
                                "level": 23
                            }, {
                                "move": "Agility",
                                "level": 31
                            }, {
                                "move": "Slash",
                                "level": 39
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "FEAROW": {
                    "label": "Beak",
                    "sprite": "Water",
                    "info": [
                        "With its huge and magnificent wings, it can keep aloft without ever having to land for rest."
                    ],
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 9
                            }, {
                                "move": "Fury Attack",
                                "level": 15
                            }, {
                                "move": "Mirror Move",
                                "level": 25
                            }, {
                                "move": "Drill Peck",
                                "level": 34
                            }, {
                                "move": "Agility",
                                "level": 43
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "FLAREON": {
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 27
                            }, {
                                "move": "Ember",
                                "level": 31
                            }, {
                                "move": "Tail Whip",
                                "level": 37
                            }, {
                                "move": "Bite",
                                "level": 40
                            }, {
                                "move": "Leer",
                                "level": 42
                            }, {
                                "move": "Fire Spin",
                                "level": 44
                            }, {
                                "move": "Rage",
                                "level": 48
                            }, {
                                "move": "Flamethrower",
                                "level": 54
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GASTLY": {
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
                        "natural": [
                            {
                                "move": "Confuse Ray",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 1
                            }, {
                                "move": "Night Shade",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 27
                            }, {
                                "move": "Dream Eater",
                                "level": 35
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Confuse Ray",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 1
                            }, {
                                "move": "Night Shade",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 27
                            }, {
                                "move": "Dream Eater",
                                "level": 35
                            }]
                    }
                },
                "GENGAR": {
                    "label": "Shadow",
                    "sprite": "Water",
                    "info": [
                        "Under a full moon, this %%%%%%%POKEMON%%%%%%% likes to mimic the shadows of people and laugh at their fright."
                    ],
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
                        "natural": [
                            {
                                "move": "Confuse Ray",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 1
                            }, {
                                "move": "Night Shade",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 29
                            }, {
                                "move": "Dream Eater",
                                "level": 38
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Dream Eater",
                                "level": 42
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GEODUDE": {
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Defense Curl",
                                "level": 11
                            }, {
                                "move": "Rock Throw",
                                "level": 16
                            }, {
                                "move": "Self-Destruct",
                                "level": 21
                            }, {
                                "move": "Harden",
                                "level": 26
                            }, {
                                "move": "Earthquake",
                                "level": 31
                            }, {
                                "move": "Explosion",
                                "level": 36
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GLOOM": {
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
                        "natural": [
                            {
                                "move": "Absorb",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Stun Spore",
                                "level": 17
                            }, {
                                "move": "Sleep Powder",
                                "level": 19
                            }, {
                                "move": "Acid",
                                "level": 28
                            }, {
                                "move": "Petal Dance",
                                "level": 38
                            }, {
                                "move": "Solar Beam",
                                "level": 52
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GOLBAT": {
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
                        "natural": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 15
                            }, {
                                "move": "Confuse Ray",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 32
                            }, {
                                "move": "Haze",
                                "level": 43
                            }],
                        "hm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 15
                            }, {
                                "move": "Confuse Ray",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 32
                            }, {
                                "move": "Haze",
                                "level": 43
                            }]
                    }
                },
                "GOLDEEN": {
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
                        "natural": [
                            {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 19
                            }, {
                                "move": "Horn Attack",
                                "level": 24
                            }, {
                                "move": "Fury Attack",
                                "level": 30
                            }, {
                                "move": "Waterfall",
                                "level": 37
                            }, {
                                "move": "Horn Drill",
                                "level": 45
                            }, {
                                "move": "Agility",
                                "level": 54
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GOLDUCK": {
                    "label": "Duck",
                    "sprite": "Water",
                    "info": [
                        "Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa."
                    ],
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
                        "natural": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 28
                            }, {
                                "move": "Disable",
                                "level": 31
                            }, {
                                "move": "Confusion",
                                "level": 39
                            }, {
                                "move": "Fury Swipes",
                                "level": 48
                            }, {
                                "move": "Hydro Pump",
                                "level": 59
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GOLEM": {
                    "label": "Megaton",
                    "sprite": "Water",
                    "info": [
                        "Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage."
                    ],
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
                        "natural": [
                            {
                                "move": "Defense Curl",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Defense Curl",
                                "level": 11
                            }, {
                                "move": "Rock Throw",
                                "level": 16
                            }, {
                                "move": "Self-Destruct",
                                "level": 21
                            }, {
                                "move": "Harden",
                                "level": 29
                            }, {
                                "move": "Earthquake",
                                "level": 36
                            }, {
                                "move": "Explosion",
                                "level": 43
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GRAVELER": {
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
                        "natural": [
                            {
                                "move": "Defense Curl",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Defense Curl",
                                "level": 11
                            }, {
                                "move": "Rock Throw",
                                "level": 16
                            }, {
                                "move": "Self-Destruct",
                                "level": 21
                            }, {
                                "move": "Harden",
                                "level": 29
                            }, {
                                "move": "Earthquake",
                                "level": 36
                            }, {
                                "move": "Explosion",
                                "level": 43
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "GRIMER": {
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
                        "natural": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 30
                            }, {
                                "move": "Minimize",
                                "level": 33
                            }, {
                                "move": "Sludge",
                                "level": 37
                            }, {
                                "move": "Harden",
                                "level": 42
                            }, {
                                "move": "Screech",
                                "level": 48
                            }, {
                                "move": "Acid Armor",
                                "level": 55
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 30
                            }, {
                                "move": "Minimize",
                                "level": 33
                            }, {
                                "move": "Sludge",
                                "level": 37
                            }, {
                                "move": "Harden",
                                "level": 42
                            }, {
                                "move": "Screech",
                                "level": 48
                            }, {
                                "move": "Acid Armor",
                                "level": 55
                            }]
                    }
                },
                "GROWLITHE": {
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
                        "natural": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Roar",
                                "level": 1
                            }, {
                                "move": "Ember",
                                "level": 18
                            }, {
                                "move": "Leer",
                                "level": 23
                            }, {
                                "move": "Take Down",
                                "level": 30
                            }, {
                                "move": "Agility",
                                "level": 39
                            }, {
                                "move": "Flamethrower",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Roar",
                                "level": 1
                            }, {
                                "move": "Ember",
                                "level": 18
                            }, {
                                "move": "Leer",
                                "level": 23
                            }, {
                                "move": "Take Down",
                                "level": 30
                            }, {
                                "move": "Agility",
                                "level": 39
                            }, {
                                "move": "Flamethrower",
                                "level": 50
                            }]
                    }
                },
                "GYARADOS": {
                    "label": "Atrocious",
                    "sprite": "Water",
                    "info": [
                        "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage."
                    ],
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
                        "natural": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Dragon Rage",
                                "level": 1
                            }, {
                                "move": "Hydro Pump",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 20
                            }, {
                                "move": "Dragon Rage",
                                "level": 25
                            }, {
                                "move": "Leer",
                                "level": 32
                            }, {
                                "move": "Hydro Pump",
                                "level": 41
                            }, {
                                "move": "Hyper Beam",
                                "level": 52
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }]
                    }
                },
                "HAUNTER": {
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
                        "natural": [
                            {
                                "move": "Confuse Ray",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 1
                            }, {
                                "move": "Night Shade",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 29
                            }, {
                                "move": "Dream Eater",
                                "level": 38
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Confuse Ray",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 1
                            }, {
                                "move": "Night Shade",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 29
                            }, {
                                "move": "Dream Eater",
                                "level": 38
                            }]
                    }
                },
                "HITMONCHAN": {
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
                        "natural": [
                            {
                                "move": "Agility",
                                "level": 1
                            }, {
                                "move": "Comet Punch",
                                "level": 1
                            }, {
                                "move": "Fire Punch",
                                "level": 33
                            }, {
                                "move": "Ice Punch",
                                "level": 38
                            }, {
                                "move": "Thunder Punch",
                                "level": 43
                            }, {
                                "move": "Mega Punch",
                                "level": 48
                            }, {
                                "move": "Counter",
                                "level": 53
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "HITMONLEE": {
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
                        "natural": [
                            {
                                "move": "Double Kick",
                                "level": 1
                            }, {
                                "move": "Meditate",
                                "level": 1
                            }, {
                                "move": "Rolling Kick",
                                "level": 33
                            }, {
                                "move": "Jump Kick",
                                "level": 38
                            }, {
                                "move": "Focus Energy",
                                "level": 43
                            }, {
                                "move": "High Jump Kick",
                                "level": 48
                            }, {
                                "move": "Mega Kick",
                                "level": 53
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "HORSEA": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Smokescreen",
                                "level": 19
                            }, {
                                "move": "Leer",
                                "level": 24
                            }, {
                                "move": "Water Gun",
                                "level": 30
                            }, {
                                "move": "Agility",
                                "level": 37
                            }, {
                                "move": "Hydro Pump",
                                "level": 45
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "HYPNO": {
                    "label": "Hypnosis",
                    "sprite": "Water",
                    "info": [
                        "When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION."
                    ],
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 12
                            }, {
                                "move": "Confusion",
                                "level": 17
                            }, {
                                "move": "Headbutt",
                                "level": 24
                            }, {
                                "move": "Poison Gas",
                                "level": 33
                            }, {
                                "move": "Psychic",
                                "level": 37
                            }, {
                                "move": "Meditate",
                                "level": 43
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Dream Eater",
                                "level": 42
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "IVYSAUR": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leech Seed",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Leech Seed",
                                "level": 7
                            }, {
                                "move": "Vine Whip",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 22
                            }, {
                                "move": "Razor Leaf",
                                "level": 30
                            }, {
                                "move": "Growth",
                                "level": 38
                            }, {
                                "move": "Sleep Powder",
                                "level": 46
                            }, {
                                "move": "Solar Beam",
                                "level": 54
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "JIGGLYPUFF": {
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
                        "natural": [
                            {
                                "move": "Sing",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 9
                            }, {
                                "move": "Disable",
                                "level": 14
                            }, {
                                "move": "Defense Curl",
                                "level": 19
                            }, {
                                "move": "Double Slap",
                                "level": 24
                            }, {
                                "move": "Rest",
                                "level": 29
                            }, {
                                "move": "Body Slam",
                                "level": 34
                            }, {
                                "move": "Double-Edge",
                                "level": 39
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "JOLTEON": {
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
                        "natural": [
                            {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 27
                            }, {
                                "move": "Thunder Shock",
                                "level": 31
                            }, {
                                "move": "Tail Whip",
                                "level": 37
                            }, {
                                "move": "Thunder Wave",
                                "level": 40
                            }, {
                                "move": "Double Kick",
                                "level": 42
                            }, {
                                "move": "Agility",
                                "level": 44
                            }, {
                                "move": "Pin Missile",
                                "level": 48
                            }, {
                                "move": "Thunder",
                                "level": 54
                            }],
                        "hm": [],
                        "tm": [{
                            "move": "Flash",
                            "level": 5
                        }]
                    }
                },
                "JYNX": {
                    "label": "Human Shape",
                    "sprite": "Water",
                    "info": [
                        "It seductively wiggles its hips as it walks. It can cause people to dance in unison with it."
                    ],
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
                        "natural": [
                            {
                                "move": "Lovely Kiss",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 18
                            }, {
                                "move": "Double Slap",
                                "level": 23
                            }, {
                                "move": "Ice Punch",
                                "level": 31
                            }, {
                                "move": "Body Slam",
                                "level": 39
                            }, {
                                "move": "Thrash",
                                "level": 47
                            }, {
                                "move": "Blizzard",
                                "level": 58
                            }],
                        "hm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Lovely Kiss",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Lick",
                                "level": 18
                            }, {
                                "move": "Double Slap",
                                "level": 23
                            }, {
                                "move": "Ice Punch",
                                "level": 31
                            }, {
                                "move": "Body Slam",
                                "level": 39
                            }, {
                                "move": "Thrash",
                                "level": 47
                            }, {
                                "move": "Blizzard",
                                "level": 58
                            }]
                    }
                },
                "KABUTO": {
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
                        "natural": [
                            {
                                "move": "Harden",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Absorb",
                                "level": 34
                            }, {
                                "move": "Slash",
                                "level": 39
                            }, {
                                "move": "Leer",
                                "level": 44
                            }, {
                                "move": "Hydro Pump",
                                "level": 49
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "KABUTOPS": {
                    "label": "Shellfish",
                    "sprite": "Water",
                    "info": [
                        "Its sleek shape is perfect for swimming. It slashes prey with its claws and drains the body fluids."
                    ],
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
                        "natural": [
                            {
                                "move": "Absorb",
                                "level": 1
                            }, {
                                "move": "Harden",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Absorb",
                                "level": 34
                            }, {
                                "move": "Slash",
                                "level": 39
                            }, {
                                "move": "Leer",
                                "level": 46
                            }, {
                                "move": "Hydro Pump",
                                "level": 53
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "KADABRA": {
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Teleport",
                                "level": 1
                            }, {
                                "move": "Confusion",
                                "level": 16
                            }, {
                                "move": "Disable",
                                "level": 20
                            }, {
                                "move": "Psybeam",
                                "level": 27
                            }, {
                                "move": "Recover",
                                "level": 31
                            }, {
                                "move": "Psychic",
                                "level": 38
                            }, {
                                "move": "Reflect",
                                "level": 42
                            }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "KAKUNA": {
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
                            "move": "Harden",
                            "level": 1
                        }],
                        "hm": [],
                        "tm": [{
                            "move": "Harden",
                            "level": 1
                        }]
                    }
                },
                "KANGASKHAN": {
                    "label": "Parent",
                    "sprite": "Water",
                    "info": [
                        "The infant rarely ventures out of its mother's protective pouch until it is 3 years old."
                    ],
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
                        "natural": [
                            {
                                "move": "Comet Punch",
                                "level": 1
                            }, {
                                "move": "Rage",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 26
                            }, {
                                "move": "Tail Whip",
                                "level": 31
                            }, {
                                "move": "Mega Punch",
                                "level": 36
                            }, {
                                "move": "Leer",
                                "level": 41
                            }, {
                                "move": "Dizzy Punch",
                                "level": 46
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "KINGLER": {
                    "label": "Pincer",
                    "sprite": "Water",
                    "info": [
                        "The large pincer has 10000 hp of crushing power. However, its huge size makes it unwieldy to use."
                    ],
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Vice Grip",
                                "level": 1
                            }, {
                                "move": "Vice Grip",
                                "level": 20
                            }, {
                                "move": "Guillotine",
                                "level": 25
                            }, {
                                "move": "Stomp",
                                "level": 34
                            }, {
                                "move": "Crabhammer",
                                "level": 42
                            }, {
                                "move": "Harden",
                                "level": 49
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "KOFFING": {
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
                        "natural": [
                            {
                                "move": "Smog",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sludge",
                                "level": 32
                            }, {
                                "move": "Smokescreen",
                                "level": 37
                            }, {
                                "move": "Self-Destruct",
                                "level": 40
                            }, {
                                "move": "Haze",
                                "level": 45
                            }, {
                                "move": "Explosion",
                                "level": 48
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Smog",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sludge",
                                "level": 32
                            }, {
                                "move": "Smokescreen",
                                "level": 37
                            }, {
                                "move": "Self-Destruct",
                                "level": 40
                            }, {
                                "move": "Haze",
                                "level": 45
                            }, {
                                "move": "Explosion",
                                "level": 48
                            }]
                    }
                },
                "KRABBY": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Vice Grip",
                                "level": 20
                            }, {
                                "move": "Guillotine",
                                "level": 25
                            }, {
                                "move": "Stomp",
                                "level": 30
                            }, {
                                "move": "Crabhammer",
                                "level": 35
                            }, {
                                "move": "Harden",
                                "level": 40
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "LAPRAS": {
                    "label": "Transport",
                    "sprite": "Water",
                    "info": [
                        "A %%%%%%%POKEMON%%%%%%% that has been overhunted almost to extinction. It can ferry people across the water."
                    ],
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Sing",
                                "level": 16
                            }, {
                                "move": "Mist",
                                "level": 20
                            }, {
                                "move": "Body Slam",
                                "level": 25
                            }, {
                                "move": "Confuse Ray",
                                "level": 31
                            }, {
                                "move": "Ice Beam",
                                "level": 38
                            }, {
                                "move": "Hydro Pump",
                                "level": 46
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "LICKITUNG": {
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
                        "natural": [
                            {
                                "move": "Supersonic",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 7
                            }, {
                                "move": "Disable",
                                "level": 15
                            }, {
                                "move": "Defense Curl",
                                "level": 23
                            }, {
                                "move": "Slam",
                                "level": 31
                            }, {
                                "move": "Screech",
                                "level": 39
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MACHAMP": {
                    "label": "Superpower",
                    "sprite": "Water",
                    "info": [
                        "Using its heavy muscles, it throws powerful punches that can send the victim clear over the horizon."
                    ],
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
                        "natural": [
                            {
                                "move": "Karate Chop",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Low Kick",
                                "level": 1
                            }, {
                                "move": "Low Kick",
                                "level": 20
                            }, {
                                "move": "Leer",
                                "level": 25
                            }, {
                                "move": "Focus Energy",
                                "level": 36
                            }, {
                                "move": "Seismic Toss",
                                "level": 44
                            }, {
                                "move": "Submission",
                                "level": 52
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MACHOKE": {
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
                        "natural": [
                            {
                                "move": "Karate Chop",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Low Kick",
                                "level": 1
                            }, {
                                "move": "Low Kick",
                                "level": 20
                            }, {
                                "move": "Leer",
                                "level": 25
                            }, {
                                "move": "Focus Energy",
                                "level": 36
                            }, {
                                "move": "Seismic Toss",
                                "level": 44
                            }, {
                                "move": "Submission",
                                "level": 52
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MACHOP": {
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
                        "natural": [
                            {
                                "move": "Karate Chop",
                                "level": 1
                            }, {
                                "move": "Low Kick",
                                "level": 20
                            }, {
                                "move": "Leer",
                                "level": 25
                            }, {
                                "move": "Focus Energy",
                                "level": 32
                            }, {
                                "move": "Seismic Toss",
                                "level": 39
                            }, {
                                "move": "Submission",
                                "level": 46
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MAGIKARP": {
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
                        "natural": [
                            {
                                "move": "Splash",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 15
                            }],
                        "hm": [],
                        "tm": []
                    }
                },
                "MAGMAR": {
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 36
                            }, {
                                "move": "Confuse Ray",
                                "level": 39
                            }, {
                                "move": "Fire Punch",
                                "level": 43
                            }, {
                                "move": "Smokescreen",
                                "level": 48
                            }, {
                                "move": "Smog",
                                "level": 52
                            }, {
                                "move": "Flamethrower",
                                "level": 55
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MAGNEMITE": {
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sonic Boom",
                                "level": 21
                            }, {
                                "move": "Thunder Shock",
                                "level": 25
                            }, {
                                "move": "Supersonic",
                                "level": 29
                            }, {
                                "move": "Thunder Wave",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 41
                            }, {
                                "move": "Screech",
                                "level": 47
                            }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MAGNETON": {
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
                        "natural": [
                            {
                                "move": "Sonic Boom",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 1
                            }, {
                                "move": "Sonic Boom",
                                "level": 21
                            }, {
                                "move": "Thunder Shock",
                                "level": 25
                            }, {
                                "move": "Supersonic",
                                "level": 29
                            }, {
                                "move": "Thunder Wave",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 46
                            }, {
                                "move": "Screech",
                                "level": 54
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MANKEY": {
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
                        "natural": [
                            {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Karate Chop",
                                "level": 15
                            }, {
                                "move": "Fury Swipes",
                                "level": 21
                            }, {
                                "move": "Focus Energy",
                                "level": 27
                            }, {
                                "move": "Seismic Toss",
                                "level": 33
                            }, {
                                "move": "Thrash",
                                "level": 39
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MAROWAK": {
                    "label": "Bone Keeper",
                    "sprite": "Water",
                    "info": [
                        "The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets."
                    ],
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
                        "natural": [
                            {
                                "move": "Bone Club",
                                "level": 1
                            }, {
                                "move": "Focus Energy",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 25
                            }, {
                                "move": "Focus Energy",
                                "level": 33
                            }, {
                                "move": "Thrash",
                                "level": 41
                            }, {
                                "move": "Bonemerang",
                                "level": 48
                            }, {
                                "move": "Rage",
                                "level": 55
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MEOWTH": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 12
                            }, {
                                "move": "Pay Day",
                                "level": 17
                            }, {
                                "move": "Screech",
                                "level": 24
                            }, {
                                "move": "Fury Swipes",
                                "level": 33
                            }, {
                                "move": "Slash",
                                "level": 44
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 12
                            }, {
                                "move": "Pay Day",
                                "level": 17
                            }, {
                                "move": "Screech",
                                "level": 24
                            }, {
                                "move": "Fury Swipes",
                                "level": 33
                            }, {
                                "move": "Slash",
                                "level": 44
                            }]
                    }
                },
                "METAPOD": {
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
                            "move": "Harden",
                            "level": 1
                        }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Harden",
                                "level": 1
                            }, {
                                "move": "Harden",
                                "level": 7
                            }]
                    }
                },
                "MEW": {
                    "label": "New Species",
                    "sprite": "Water",
                    "info": [
                        "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide."
                    ],
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
                        "natural": [
                            {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Transform",
                                "level": 10
                            }, {
                                "move": "Mega Punch",
                                "level": 20
                            }, {
                                "move": "Metronome",
                                "level": 30
                            }, {
                                "move": "Psychic",
                                "level": 40
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Fly",
                                "level": 2
                            }, {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Dragon Rage",
                                "level": 23
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Egg Bomb",
                                "level": 37
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Soft-Boiled",
                                "level": 41
                            }, {
                                "move": "Dream Eater",
                                "level": 42
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MEWTWO": {
                    "label": "Genetic",
                    "sprite": "Water",
                    "info": [
                        "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments."
                    ],
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Psychic",
                                "level": 1
                            }, {
                                "move": "Swift",
                                "level": 1
                            }, {
                                "move": "Barrier",
                                "level": 63
                            }, {
                                "move": "Psychic",
                                "level": 66
                            }, {
                                "move": "Recover",
                                "level": 70
                            }, {
                                "move": "Mist",
                                "level": 75
                            }, {
                                "move": "Amnesia",
                                "level": 81
                            }],
                        "hm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MOLTRES": {
                    "label": "Flame",
                    "sprite": "Water",
                    "info": [
                        "Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames."
                    ],
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
                        "natural": [
                            {
                                "move": "Fire Spin",
                                "level": 1
                            }, {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 51
                            }, {
                                "move": "Agility",
                                "level": 55
                            }, {
                                "move": "Sky Attack",
                                "level": 60
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MrHyphenMime": {
                    "label": "Barrier",
                    "sprite": "Water",
                    "info": [
                        "If interrupted while it is miming, it will slap around the offender with its broad hands."
                    ],
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
                        "natural": [
                            {
                                "move": "Barrier",
                                "level": 1
                            }, {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Confusion",
                                "level": 15
                            }, {
                                "move": "Light Screen",
                                "level": 23
                            }, {
                                "move": "Double Slap",
                                "level": 31
                            }, {
                                "move": "Meditate",
                                "level": 39
                            }, {
                                "move": "Substitute",
                                "level": 47
                            }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "MUK": {
                    "label": "Sludge",
                    "sprite": "Water",
                    "info": [
                        "Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison."
                    ],
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
                        "natural": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 30
                            }, {
                                "move": "Minimize",
                                "level": 33
                            }, {
                                "move": "Sludge",
                                "level": 37
                            }, {
                                "move": "Harden",
                                "level": 45
                            }, {
                                "move": "Screech",
                                "level": 53
                            }, {
                                "move": "Acid Armor",
                                "level": 60
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 1
                            }, {
                                "move": "Pound",
                                "level": 1
                            }, {
                                "move": "Poison Gas",
                                "level": 30
                            }, {
                                "move": "Minimize",
                                "level": 33
                            }, {
                                "move": "Sludge",
                                "level": 37
                            }, {
                                "move": "Harden",
                                "level": 45
                            }, {
                                "move": "Screech",
                                "level": 53
                            }, {
                                "move": "Acid Armor",
                                "level": 60
                            }]
                    }
                },
                "NIDOKING": {
                    "label": "Drill",
                    "sprite": "Water",
                    "info": [
                        "It uses its powerful tail in battle to smash, constrict, then break the prey's bones."
                    ],
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
                        "natural": [
                            {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Poison Sting",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Thrash",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 8
                            }, {
                                "move": "Poison Sting",
                                "level": 14
                            }, {
                                "move": "Thrash",
                                "level": 23
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }]
                    }
                },
                "NIDOQUEEN": {
                    "label": "Drill",
                    "sprite": "Water",
                    "info": [
                        "Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves."
                    ],
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
                        "natural": [
                            {
                                "move": "Body Slam",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 8
                            }, {
                                "move": "Poison Sting",
                                "level": 14
                            }, {
                                "move": "Body Slam",
                                "level": 23
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }]
                    }
                },
                "NIDORANFemaleSymbol": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            },
                            {
                                "move": "Tackle",
                                "level": 1
                            },
                            {
                                "move": "Scratch",
                                "level": 8
                            },
                            {
                                "move": "Double Kick",
                                "level": 12
                            },
                            {
                                "move": "Poison Sting",
                                "level": 17
                            },
                            {
                                "move": "Tail Whip",
                                "level": 23
                            },
                            {
                                "move": "Bite",
                                "level": 30
                            },
                            {
                                "move": "Fury Swipes",
                                "level": 38
                            },
                        ],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "NIDORANMaleSymbol": {
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
                        "natural": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "NIDORINA": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 8
                            }, {
                                "move": "Poison Sting",
                                "level": 14
                            }, {
                                "move": "Tail Whip",
                                "level": 23
                            }, {
                                "move": "Bite",
                                "level": 32
                            }, {
                                "move": "Fury Swipes",
                                "level": 41
                            }, {
                                "move": "Double Kick",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 8
                            }, {
                                "move": "Double Kick",
                                "level": 12
                            }, {
                                "move": "Poison Sting",
                                "level": 19
                            }, {
                                "move": "Tail Whip",
                                "level": 27
                            }, {
                                "move": "Bite",
                                "level": 36
                            }, {
                                "move": "Fury Swipes",
                                "level": 46
                            }]
                    }
                },
                "NIDORINO": {
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
                        "natural": [
                            {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 8
                            }, {
                                "move": "Poison Sting",
                                "level": 14
                            }, {
                                "move": "Focus Energy",
                                "level": 23
                            }, {
                                "move": "Fury Attack",
                                "level": 32
                            }, {
                                "move": "Horn Drill",
                                "level": 41
                            }, {
                                "move": "Double Kick",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 8
                            }, {
                                "move": "Double Kick",
                                "level": 12
                            }, {
                                "move": "Poison Sting",
                                "level": 19
                            }, {
                                "move": "Focus Energy",
                                "level": 27
                            }, {
                                "move": "Fury Attack",
                                "level": 36
                            }, {
                                "move": "Horn Drill",
                                "level": 46
                            }]
                    }
                },
                "NINETALES": {
                    "label": "Fox",
                    "sprite": "Water",
                    "info": [
                        "Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse."
                    ],
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Roar",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ODDISH": {
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
                        "natural": [
                            {
                                "move": "Absorb",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Stun Spore",
                                "level": 17
                            }, {
                                "move": "Sleep Powder",
                                "level": 19
                            }, {
                                "move": "Acid",
                                "level": 24
                            }, {
                                "move": "Petal Dance",
                                "level": 33
                            }, {
                                "move": "Solar Beam",
                                "level": 46
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "OMANYTE": {
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
                        "natural": [
                            {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Withdraw",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 34
                            }, {
                                "move": "Leer",
                                "level": 39
                            }, {
                                "move": "Spike Cannon",
                                "level": 46
                            }, {
                                "move": "Hydro Pump",
                                "level": 53
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "OMASTAR": {
                    "label": "Spiral",
                    "sprite": "Water",
                    "info": [
                        "A prehistoric %%%%%%%POKEMON%%%%%%% that died out when its heavy shell made it impossible to catch prey."
                    ],
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
                        "natural": [
                            {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Withdraw",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 34
                            }, {
                                "move": "Leer",
                                "level": 39
                            }, {
                                "move": "Spike Cannon",
                                "level": 44
                            }, {
                                "move": "Hydro Pump",
                                "level": 49
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ONIX": {
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
                        "natural": [
                            {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Bind",
                                "level": 15
                            }, {
                                "move": "Rock Throw",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 25
                            }, {
                                "move": "Slam",
                                "level": 33
                            }, {
                                "move": "Harden",
                                "level": 43
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PARAS": {
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
                        "natural": [
                            {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 13
                            }, {
                                "move": "Leech Life",
                                "level": 20
                            }, {
                                "move": "Spore",
                                "level": 27
                            }, {
                                "move": "Slash",
                                "level": 34
                            }, {
                                "move": "Growth",
                                "level": 41
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PARASECT": {
                    "label": "Mushroom",
                    "sprite": "Water",
                    "info": [
                        "A host-parasite pair in which the parasite mushroom has taken over the host bug. Prefers damp places."
                    ],
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
                        "natural": [
                            {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 13
                            }, {
                                "move": "Leech Life",
                                "level": 20
                            }, {
                                "move": "Spore",
                                "level": 30
                            }, {
                                "move": "Slash",
                                "level": 39
                            }, {
                                "move": "Growth",
                                "level": 48
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PERSIAN": {
                    "label": "Classy Cat",
                    "sprite": "Water",
                    "info": [
                        "Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness."
                    ],
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
                        "natural": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 12
                            }, {
                                "move": "Pay Day",
                                "level": 17
                            }, {
                                "move": "Screech",
                                "level": 24
                            }, {
                                "move": "Fury Swipes",
                                "level": 37
                            }, {
                                "move": "Slash",
                                "level": 51
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Bite",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Bite",
                                "level": 12
                            }, {
                                "move": "Pay Day",
                                "level": 17
                            }, {
                                "move": "Screech",
                                "level": 24
                            }, {
                                "move": "Fury Swipes",
                                "level": 37
                            }, {
                                "move": "Slash",
                                "level": 51
                            }]
                    }
                },
                "PIDGEOT": {
                    "label": "Bird",
                    "sprite": "Water",
                    "info": [
                        "When hunting, it skims the surface of water at high speed to pick off unwary prey such as MAGIKARP."
                    ],
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
                        "natural": [
                            {
                                "move": "Gust",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 5
                            }, {
                                "move": "Quick Attack",
                                "level": 12
                            }, {
                                "move": "Whirlwind",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 31
                            }, {
                                "move": "Agility",
                                "level": 44
                            }, {
                                "move": "Mirror Move",
                                "level": 54
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PIDGEOTTO": {
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
                        "natural": [
                            {
                                "move": "Gust",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 5
                            }, {
                                "move": "Quick Attack",
                                "level": 12
                            }, {
                                "move": "Whirlwind",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 31
                            }, {
                                "move": "Agility",
                                "level": 40
                            }, {
                                "move": "Mirror Move",
                                "level": 49
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PIDGEY": {
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
                        "natural": [
                            {
                                "move": "Gust",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 5
                            }, {
                                "move": "Quick Attack",
                                "level": 12
                            }, {
                                "move": "Whirlwind",
                                "level": 19
                            }, {
                                "move": "Wing Attack",
                                "level": 28
                            }, {
                                "move": "Agility",
                                "level": 36
                            }, {
                                "move": "Mirror Move",
                                "level": 44
                            }],
                        "hm": [{
                            "move": "Fly",
                            "level": 2
                        }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PIKACHU": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 9
                            }, {
                                "move": "Quick Attack",
                                "level": 16
                            }, {
                                "move": "Swift",
                                "level": 26
                            }, {
                                "move": "Agility",
                                "level": 33
                            }, {
                                "move": "Thunder",
                                "level": 43
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PINSIR": {
                    "label": "Stag Beetle",
                    "sprite": "Water",
                    "info": [
                        "If it fails to crush the victim in its pincers, it will swing it around and toss it hard."
                    ],
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
                        "natural": [
                            {
                                "move": "Vice Grip",
                                "level": 1
                            }, {
                                "move": "Seismic Toss",
                                "level": 25
                            }, {
                                "move": "Guillotine",
                                "level": 30
                            }, {
                                "move": "Focus Energy",
                                "level": 36
                            }, {
                                "move": "Harden",
                                "level": 43
                            }, {
                                "move": "Slash",
                                "level": 49
                            }, {
                                "move": "Swords Dance",
                                "level": 54
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "POLIWAG": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 16
                            }, {
                                "move": "Water Gun",
                                "level": 19
                            }, {
                                "move": "Double Slap",
                                "level": 25
                            }, {
                                "move": "Body Slam",
                                "level": 31
                            }, {
                                "move": "Amnesia",
                                "level": 38
                            }, {
                                "move": "Hydro Pump",
                                "level": 45
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "POLIWHIRL": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 16
                            }, {
                                "move": "Water Gun",
                                "level": 19
                            }, {
                                "move": "Double Slap",
                                "level": 26
                            }, {
                                "move": "Body Slam",
                                "level": 33
                            }, {
                                "move": "Amnesia",
                                "level": 41
                            }, {
                                "move": "Hydro Pump",
                                "level": 49
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "POLIWRATH": {
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
                        "natural": [
                            {
                                "move": "Body Slam",
                                "level": 1
                            }, {
                                "move": "Double Slap",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Hypnosis",
                                "level": 16
                            }, {
                                "move": "Water Gun",
                                "level": 19
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }]
                    }
                },
                "PONYTA": {
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 30
                            }, {
                                "move": "Stomp",
                                "level": 32
                            }, {
                                "move": "Growl",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 39
                            }, {
                                "move": "Take Down",
                                "level": 43
                            }, {
                                "move": "Agility",
                                "level": 48
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 30
                            }, {
                                "move": "Stomp",
                                "level": 32
                            }, {
                                "move": "Growl",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 39
                            }, {
                                "move": "Take Down",
                                "level": 43
                            }, {
                                "move": "Agility",
                                "level": 48
                            }]
                    }
                },
                "PORYGON": {
                    "label": "Virtual",
                    "sprite": "Water",
                    "info": [
                        "A %%%%%%%POKEMON%%%%%%% that consists entirely of programming code. Capable of moving freely in cyberspace."
                    ],
                    "evolvesInto": "Porygon2",
                    "evolvesVia": "trade holding Up-Grade",
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
                        "natural": [
                            {
                                "move": "Conversion",
                                "level": 1
                            }, {
                                "move": "Sharpen",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Psybeam",
                                "level": 23
                            }, {
                                "move": "Recover",
                                "level": 28
                            }, {
                                "move": "Agility",
                                "level": 35
                            }, {
                                "move": "Tri Attack",
                                "level": 42
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PRIMEAPE": {
                    "label": "Pig Monkey",
                    "sprite": "Water",
                    "info": [
                        "Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught."
                    ],
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
                        "natural": [
                            {
                                "move": "Fury Swipes",
                                "level": 1
                            }, {
                                "move": "Karate Chop",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Karate Chop",
                                "level": 15
                            }, {
                                "move": "Fury Swipes",
                                "level": 21
                            }, {
                                "move": "Focus Energy",
                                "level": 27
                            }, {
                                "move": "Seismic Toss",
                                "level": 37
                            }, {
                                "move": "Thrash",
                                "level": 46
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "PSYDUCK": {
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
                        "natural": [
                            {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 28
                            }, {
                                "move": "Disable",
                                "level": 31
                            }, {
                                "move": "Confusion",
                                "level": 36
                            }, {
                                "move": "Fury Swipes",
                                "level": 43
                            }, {
                                "move": "Hydro Pump",
                                "level": 52
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "RAICHU": {
                    "label": "Mouse",
                    "sprite": "Water",
                    "info": [
                        "Its long tail serves as a ground to protect itself from its own high voltage power."
                    ],
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 1
                            }, {
                                "move": "Thunder Wave",
                                "level": 1
                            }],
                        "hm": [{
                            "move": "Flash",
                            "level": 5
                        }],
                        "tm": [{
                            "move": "Flash",
                            "level": 5
                        }]
                    }
                },
                "RAPIDASH": {
                    "label": "Fire Horse",
                    "sprite": "Water",
                    "info": [
                        "Very competitive, this %%%%%%%POKEMON%%%%%%% will chase anything that moves fast in the hopes of racing it."
                    ],
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 30
                            }, {
                                "move": "Stomp",
                                "level": 32
                            }, {
                                "move": "Growl",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 39
                            }, {
                                "move": "Take Down",
                                "level": 47
                            }, {
                                "move": "Agility",
                                "level": 55
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 30
                            }, {
                                "move": "Stomp",
                                "level": 32
                            }, {
                                "move": "Growl",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 39
                            }, {
                                "move": "Take Down",
                                "level": 47
                            }, {
                                "move": "Agility",
                                "level": 55
                            }]
                    }
                },
                "RATICATE": {
                    "label": "Mouse",
                    "sprite": "Water",
                    "info": [
                        "It uses its whiskers to maintain its balance. It apparently slows down if they are cut off."
                    ],
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
                        "natural": [
                            {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 7
                            }, {
                                "move": "Hyper Fang",
                                "level": 14
                            }, {
                                "move": "Focus Energy",
                                "level": 27
                            }, {
                                "move": "Super Fang",
                                "level": 41
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 7
                            }, {
                                "move": "Hyper Fang",
                                "level": 14
                            }, {
                                "move": "Focus Energy",
                                "level": 27
                            }, {
                                "move": "Super Fang",
                                "level": 41
                            }]
                    }
                },
                "RATTATA": {
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 7
                            }, {
                                "move": "Hyper Fang",
                                "level": 14
                            }, {
                                "move": "Focus Energy",
                                "level": 23
                            }, {
                                "move": "Super Fang",
                                "level": 34
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 7
                            }, {
                                "move": "Hyper Fang",
                                "level": 14
                            }, {
                                "move": "Focus Energy",
                                "level": 23
                            }, {
                                "move": "Super Fang",
                                "level": 34
                            }]
                    }
                },
                "RHYDON": {
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
                        "natural": [
                            {
                                "move": "Fury Attack",
                                "level": 1
                            }, {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 30
                            }, {
                                "move": "Tail Whip",
                                "level": 35
                            }, {
                                "move": "Fury Attack",
                                "level": 40
                            }, {
                                "move": "Horn Drill",
                                "level": 48
                            }, {
                                "move": "Leer",
                                "level": 55
                            }, {
                                "move": "Take Down",
                                "level": 64
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "RHYHORN": {
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
                        "natural": [
                            {
                                "move": "Horn Attack",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 30
                            }, {
                                "move": "Tail Whip",
                                "level": 35
                            }, {
                                "move": "Fury Attack",
                                "level": 40
                            }, {
                                "move": "Horn Drill",
                                "level": 45
                            }, {
                                "move": "Leer",
                                "level": 50
                            }, {
                                "move": "Take Down",
                                "level": 55
                            }],
                        "hm": [{
                            "move": "Strength",
                            "level": 4
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SANDSHREW": {
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
                        "natural": [
                            {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 10
                            }, {
                                "move": "Slash",
                                "level": 17
                            }, {
                                "move": "Poison Sting",
                                "level": 24
                            }, {
                                "move": "Swift",
                                "level": 31
                            }, {
                                "move": "Fury Swipes",
                                "level": 38
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SANDSLASH": {
                    "label": "Mouse",
                    "sprite": "Water",
                    "info": [
                        "Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape."
                    ],
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
                        "natural": [
                            {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Scratch",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 10
                            }, {
                                "move": "Slash",
                                "level": 17
                            }, {
                                "move": "Poison Sting",
                                "level": 27
                            }, {
                                "move": "Swift",
                                "level": 36
                            }, {
                                "move": "Fury Swipes",
                                "level": 47
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SCYTHER": {
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
                        "natural": [
                            {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 17
                            }, {
                                "move": "Focus Energy",
                                "level": 20
                            }, {
                                "move": "Double Team",
                                "level": 24
                            }, {
                                "move": "Slash",
                                "level": 29
                            }, {
                                "move": "Swords Dance",
                                "level": 35
                            }, {
                                "move": "Agility",
                                "level": 42
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SEADRA": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Smokescreen",
                                "level": 1
                            }, {
                                "move": "Smokescreen",
                                "level": 19
                            }, {
                                "move": "Leer",
                                "level": 24
                            }, {
                                "move": "Water Gun",
                                "level": 30
                            }, {
                                "move": "Agility",
                                "level": 41
                            }, {
                                "move": "Hydro Pump",
                                "level": 52
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SEAKING": {
                    "label": "Goldfish",
                    "sprite": "Water",
                    "info": [
                        "In the autumn spawning season, they can be seen swimming powerfully up rivers and creeks."
                    ],
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
                        "natural": [
                            {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 19
                            }, {
                                "move": "Horn Attack",
                                "level": 24
                            }, {
                                "move": "Fury Attack",
                                "level": 30
                            }, {
                                "move": "Waterfall",
                                "level": 39
                            }, {
                                "move": "Horn Drill",
                                "level": 48
                            }, {
                                "move": "Agility",
                                "level": 54
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SEEL": {
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
                        "natural": [
                            {
                                "move": "Headbutt",
                                "level": 1
                            }, {
                                "move": "Growl",
                                "level": 30
                            }, {
                                "move": "Aurora Beam",
                                "level": 35
                            }, {
                                "move": "Rest",
                                "level": 40
                            }, {
                                "move": "Take Down",
                                "level": 45
                            }, {
                                "move": "Ice Beam",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SHELLDER": {
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Withdraw",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 18
                            }, {
                                "move": "Clamp",
                                "level": 23
                            }, {
                                "move": "Aurora Beam",
                                "level": 30
                            }, {
                                "move": "Leer",
                                "level": 39
                            }, {
                                "move": "Ice Beam",
                                "level": 50
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SLOWBRO": {
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Headbutt",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 18
                            }, {
                                "move": "Headbutt",
                                "level": 22
                            }, {
                                "move": "Growl",
                                "level": 27
                            }, {
                                "move": "Water Gun",
                                "level": 33
                            }, {
                                "move": "Withdraw",
                                "level": 37
                            }, {
                                "move": "Amnesia",
                                "level": 44
                            }, {
                                "move": "Psychic",
                                "level": 55
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "Slowpoke": {
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
                        "natural": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 18
                            }, {
                                "move": "Headbutt",
                                "level": 22
                            }, {
                                "move": "Growl",
                                "level": 27
                            }, {
                                "move": "Water Gun",
                                "level": 33
                            }, {
                                "move": "Amnesia",
                                "level": 40
                            }, {
                                "move": "Psychic",
                                "level": 48
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SNORLAX": {
                    "label": "Sleeping",
                    "sprite": "Water",
                    "info": [
                        "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful."
                    ],
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
                        "natural": [
                            {
                                "move": "Amnesia",
                                "level": 1
                            }, {
                                "move": "Headbutt",
                                "level": 1
                            }, {
                                "move": "Rest",
                                "level": 1
                            }, {
                                "move": "Body Slam",
                                "level": 35
                            }, {
                                "move": "Harden",
                                "level": 41
                            }, {
                                "move": "Double-Edge",
                                "level": 48
                            }, {
                                "move": "Hyper Beam",
                                "level": 56
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Strength",
                                "level": 4
                            }],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Pay Day",
                                "level": 16
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Metronome",
                                "level": 35
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Rock Slide",
                                "level": 48
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SPEAROW": {
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Peck",
                                "level": 1
                            }, {
                                "move": "Leer",
                                "level": 9
                            }, {
                                "move": "Fury Attack",
                                "level": 15
                            }, {
                                "move": "Mirror Move",
                                "level": 22
                            }, {
                                "move": "Drill Peck",
                                "level": 29
                            }, {
                                "move": "Agility",
                                "level": 36
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "SQUIRTLE": {
                    "label": "TinyTurtle",
                    "sprite": "Water",
                    "info": [
                        "After birth, its back swells and hardens into a shell.",
                        "Powerfully sprays foam from its mouth."
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Bubble",
                                "level": 8
                            }, {
                                "move": "Water Gun",
                                "level": 15
                            }, {
                                "move": "Bite",
                                "level": 22
                            }, {
                                "move": "Withdraw",
                                "level": 28
                            }, {
                                "move": "Skull Bash",
                                "level": 35
                            }, {
                                "move": "Hydro Pump",
                                "level": 42
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "STARMIE": {
                    "label": "Mysterious",
                    "sprite": "Water",
                    "info": [
                        "Its central core glows with the seven colors of the rainbow. Some people value the core as a gem."
                    ],
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
                        "natural": [
                            {
                                "move": "Harden",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }],
                        "hm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Surf",
                                "level": 3
                            }, {
                                "move": "Flash",
                                "level": 5
                            }]
                    }
                },
                "STARYU": {
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 17
                            }, {
                                "move": "Harden",
                                "level": 22
                            }, {
                                "move": "Recover",
                                "level": 27
                            }, {
                                "move": "Swift",
                                "level": 32
                            }, {
                                "move": "Minimize",
                                "level": 37
                            }, {
                                "move": "Light Screen",
                                "level": 42
                            }, {
                                "move": "Hydro Pump",
                                "level": 47
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Tri Attack",
                                "level": 49
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "TANGELA": {
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
                        "natural": [
                            {
                                "move": "Bind",
                                "level": 1
                            }, {
                                "move": "Constrict",
                                "level": 1
                            }, {
                                "move": "Absorb",
                                "level": 29
                            }, {
                                "move": "Poison Powder",
                                "level": 32
                            }, {
                                "move": "Stun Spore",
                                "level": 36
                            }, {
                                "move": "Sleep Powder",
                                "level": 39
                            }, {
                                "move": "Slam",
                                "level": 45
                            }, {
                                "move": "Growth",
                                "level": 49
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "TAUROS": {
                    "label": "Wild Bull",
                    "sprite": "Water",
                    "info": [
                        "When it targets an enemy, it charges furiously while whipping its body with its long tails."
                    ],
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
                        "natural": [
                            {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Stomp",
                                "level": 21
                            }, {
                                "move": "Tail Whip",
                                "level": 28
                            }, {
                                "move": "Leer",
                                "level": 35
                            }, {
                                "move": "Rage",
                                "level": 44
                            }, {
                                "move": "Take Down",
                                "level": 51
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Horn Drill",
                                "level": 7
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Earthquake",
                                "level": 26
                            }, {
                                "move": "Fissure",
                                "level": 27
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "TENTACOOL": {
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
                        "natural": [
                            {
                                "move": "Acid",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 7
                            }, {
                                "move": "Wrap",
                                "level": 13
                            }, {
                                "move": "Poison Sting",
                                "level": 18
                            }, {
                                "move": "Water Gun",
                                "level": 22
                            }, {
                                "move": "Constrict",
                                "level": 27
                            }, {
                                "move": "Barrier",
                                "level": 33
                            }, {
                                "move": "Screech",
                                "level": 40
                            }, {
                                "move": "Hydro Pump",
                                "level": 48
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Surf",
                                "level": 3
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "TENTACRUEL": {
                    "label": "Jellyfish",
                    "sprite": "Water",
                    "info": [
                        "The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey."
                    ],
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
                        "natural": [
                            {
                                "move": "Acid",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 7
                            }, {
                                "move": "Wrap",
                                "level": 13
                            }, {
                                "move": "Poison Sting",
                                "level": 18
                            }, {
                                "move": "Water Gun",
                                "level": 22
                            }, {
                                "move": "Constrict",
                                "level": 27
                            }, {
                                "move": "Barrier",
                                "level": 35
                            }, {
                                "move": "Screech",
                                "level": 43
                            }, {
                                "move": "Hydro Pump",
                                "level": 50
                            }],
                        "hm": [
                            {
                                "move": "Cut",
                                "level": 1
                            }, {
                                "move": "Surf",
                                "level": 3
                            }],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "VAPOREON": {
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
                        "natural": [
                            {
                                "move": "Quick Attack",
                                "level": 1
                            }, {
                                "move": "Sand Attack",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Water Gun",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 27
                            }, {
                                "move": "Water Gun",
                                "level": 31
                            }, {
                                "move": "Tail Whip",
                                "level": 37
                            }, {
                                "move": "Bite",
                                "level": 40
                            }, {
                                "move": "Acid Armor",
                                "level": 42
                            }, {
                                "move": "Haze",
                                "level": 44
                            }, {
                                "move": "Mist",
                                "level": 48
                            }, {
                                "move": "Hydro Pump",
                                "level": 54
                            }],
                        "hm": [{
                            "move": "Surf",
                            "level": 3
                        }],
                        "tm": [{
                            "move": "Surf",
                            "level": 3
                        }]
                    }
                },
                "VENOMOTH": {
                    "label": "Poison Moth",
                    "sprite": "Water",
                    "info": [
                        "The dust-like scales covering its wings are color coded to indicate the kinds of poison it has."
                    ],
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
                        "natural": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 24
                            }, {
                                "move": "Leech Life",
                                "level": 27
                            }, {
                                "move": "Stun Spore",
                                "level": 30
                            }, {
                                "move": "Psybeam",
                                "level": 38
                            }, {
                                "move": "Sleep Powder",
                                "level": 43
                            }, {
                                "move": "Psychic",
                                "level": 50
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Confusion",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 22
                            }, {
                                "move": "Leech Life",
                                "level": 27
                            }, {
                                "move": "Stun Spore",
                                "level": 30
                            }, {
                                "move": "Psybeam",
                                "level": 38
                            }, {
                                "move": "Sleep Powder",
                                "level": 43
                            }, {
                                "move": "Psychic",
                                "level": 50
                            }]
                    }
                },
                "VENONAT": {
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
                        "natural": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 24
                            }, {
                                "move": "Leech Life",
                                "level": 27
                            }, {
                                "move": "Stun Spore",
                                "level": 30
                            }, {
                                "move": "Psybeam",
                                "level": 35
                            }, {
                                "move": "Sleep Powder",
                                "level": 38
                            }, {
                                "move": "Psychic",
                                "level": 43
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Psychic",
                                "level": 29
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Psywave",
                                "level": 46
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 11
                            }, {
                                "move": "Confusion",
                                "level": 19
                            }, {
                                "move": "Poison Powder",
                                "level": 22
                            }, {
                                "move": "Leech Life",
                                "level": 27
                            }, {
                                "move": "Stun Spore",
                                "level": 30
                            }, {
                                "move": "Psybeam",
                                "level": 35
                            }, {
                                "move": "Sleep Powder",
                                "level": 38
                            }, {
                                "move": "Psychic",
                                "level": 43
                            }]
                    }
                },
                "VENUSAUR": {
                    "label": "Seed",
                    "sprite": "Water",
                    "info": [
                        "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."
                    ],
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
                        "natural": [
                            {
                                "move": "Growl",
                                "level": 1
                            }, {
                                "move": "Leech Seed",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Vine Whip",
                                "level": 1
                            }, {
                                "move": "Leech Seed",
                                "level": 7
                            }, {
                                "move": "Vine Whip",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 22
                            }, {
                                "move": "Razor Leaf",
                                "level": 30
                            }, {
                                "move": "Growth",
                                "level": 43
                            }, {
                                "move": "Sleep Powder",
                                "level": 55
                            }, {
                                "move": "Solar Beam",
                                "level": 65
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "VICTREEBEL": {
                    "label": "Flycatcher",
                    "sprite": "Water",
                    "info": [
                        "Said to live in huge colonies deep in jungles, although no one has ever returned from there."
                    ],
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
                        "natural": [
                            {
                                "move": "Acid",
                                "level": 1
                            }, {
                                "move": "Razor Leaf",
                                "level": 1
                            }, {
                                "move": "Sleep Powder",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Sleep Powder",
                                "level": 18
                            }],
                        "hm": [{
                            "move": "Cut",
                            "level": 1
                        }],
                        "tm": [{
                            "move": "Cut",
                            "level": 1
                        }]
                    }
                },
                "VILEPLUME": {
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
                        "natural": [
                            {
                                "move": "Acid",
                                "level": 1
                            }, {
                                "move": "Petal Dance",
                                "level": 1
                            }, {
                                "move": "Sleep Powder",
                                "level": 1
                            }, {
                                "move": "Stun Spore",
                                "level": 1
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Stun Spore",
                                "level": 17
                            }, {
                                "move": "Sleep Powder",
                                "level": 19
                            }],
                        "hm": [],
                        "tm": [{
                            "move": "Cut",
                            "level": 1
                        }]
                    }
                },
                "VOLTORB": {
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
                        "natural": [
                            {
                                "move": "Screech",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sonic Boom",
                                "level": 17
                            }, {
                                "move": "Self-Destruct",
                                "level": 22
                            }, {
                                "move": "Light Screen",
                                "level": 29
                            }, {
                                "move": "Swift",
                                "level": 36
                            }, {
                                "move": "Explosion",
                                "level": 43
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Teleport",
                                "level": 30
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "VULPIX": {
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
                        "natural": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 16
                            }, {
                                "move": "Roar",
                                "level": 21
                            }, {
                                "move": "Confuse Ray",
                                "level": 28
                            }, {
                                "move": "Flamethrower",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 42
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Ember",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Quick Attack",
                                "level": 16
                            }, {
                                "move": "Roar",
                                "level": 21
                            }, {
                                "move": "Confuse Ray",
                                "level": 28
                            }, {
                                "move": "Flamethrower",
                                "level": 35
                            }, {
                                "move": "Fire Spin",
                                "level": 42
                            }]
                    }
                },
                "WARTORTLE": {
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
                        "natural": [
                            {
                                "move": "Bubble",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Tail Whip",
                                "level": 1
                            }, {
                                "move": "Bubble",
                                "level": 8
                            }, {
                                "move": "Water Gun",
                                "level": 15
                            }, {
                                "move": "Bite",
                                "level": 24
                            }, {
                                "move": "Withdraw",
                                "level": 31
                            }, {
                                "move": "Skull Bash",
                                "level": 39
                            }, {
                                "move": "Hydro Pump",
                                "level": 47
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Mega Punch",
                                "level": 1
                            }, {
                                "move": "Mega Kick",
                                "level": 5
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Body Slam",
                                "level": 8
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Bubble Beam",
                                "level": 11
                            }, {
                                "move": "Water Gun",
                                "level": 12
                            }, {
                                "move": "Ice Beam",
                                "level": 13
                            }, {
                                "move": "Blizzard",
                                "level": 14
                            }, {
                                "move": "Submission",
                                "level": 17
                            }, {
                                "move": "Counter",
                                "level": 18
                            }, {
                                "move": "Seismic Toss",
                                "level": 19
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Dig",
                                "level": 28
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Skull Bash",
                                "level": 40
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "WEEDLE": {
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
                        "natural": [
                            {
                                "move": "Poison Sting",
                                "level": 1
                            }, {
                                "move": "String Shot",
                                "level": 1
                            }],
                        "hm": [],
                        "tm": []
                    }
                },
                "WEEPINBELL": {
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
                        "natural": [
                            {
                                "move": "Growth",
                                "level": 1
                            }, {
                                "move": "Vine Whip",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 1
                            }, {
                                "move": "Wrap",
                                "level": 13
                            }, {
                                "move": "Poison Powder",
                                "level": 15
                            }, {
                                "move": "Sleep Powder",
                                "level": 18
                            }, {
                                "move": "Stun Spore",
                                "level": 23
                            }, {
                                "move": "Acid",
                                "level": 29
                            }, {
                                "move": "Razor Leaf",
                                "level": 38
                            }, {
                                "move": "Slam",
                                "level": 49
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Swords Dance",
                                "level": 3
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Mega Drain",
                                "level": 21
                            }, {
                                "move": "Solar Beam",
                                "level": 22
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "WEEZING": {
                    "label": "Poison Gas",
                    "sprite": "Water",
                    "info": [
                        "Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years."
                    ],
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
                        "natural": [
                            {
                                "move": "Sludge",
                                "level": 1
                            }, {
                                "move": "Smog",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sludge",
                                "level": 32
                            }, {
                                "move": "Smokescreen",
                                "level": 39
                            }, {
                                "move": "Self-Destruct",
                                "level": 43
                            }, {
                                "move": "Haze",
                                "level": 49
                            }, {
                                "move": "Explosion",
                                "level": 53
                            }],
                        "hm": [
                            {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Self-Destruct",
                                "level": 36
                            }, {
                                "move": "Fire Blast",
                                "level": 38
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Explosion",
                                "level": 47
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }],
                        "tm": [
                            {
                                "move": "Sludge",
                                "level": 1
                            }, {
                                "move": "Smog",
                                "level": 1
                            }, {
                                "move": "Tackle",
                                "level": 1
                            }, {
                                "move": "Sludge",
                                "level": 32
                            }, {
                                "move": "Smokescreen",
                                "level": 39
                            }, {
                                "move": "Self-Destruct",
                                "level": 43
                            }, {
                                "move": "Haze",
                                "level": 49
                            }, {
                                "move": "Explosion",
                                "level": 53
                            }]
                    }
                },
                "WIGGLYTUFF": {
                    "label": "Balloon",
                    "sprite": "Water",
                    "info": [
                        "The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size."
                    ],
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
                        "natural": [
                            {
                                "move": "Defense Curl",
                                "level": 1
                            }, {
                                "move": "Disable",
                                "level": 1
                            }, {
                                "move": "Double Slap",
                                "level": 1
                            }, {
                                "move": "Sing",
                                "level": 1
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Strength",
                                "level": 4
                            }, {
                                "move": "Flash",
                                "level": 5
                            }]
                    }
                },
                "ZAPDOS": {
                    "label": "Electric",
                    "sprite": "Water",
                    "info": [
                        "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear from clouds while dropping enormous lightning bolts."
                    ],
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
                        "natural": [
                            {
                                "move": "Drill Peck",
                                "level": 1
                            }, {
                                "move": "Thunder Shock",
                                "level": 1
                            }, {
                                "move": "Thunder",
                                "level": 51
                            }, {
                                "move": "Agility",
                                "level": 55
                            }, {
                                "move": "Light Screen",
                                "level": 60
                            }],
                        "hm": [
                            {
                                "move": "Fly",
                                "level": 2
                            }, {
                                "move": "Flash",
                                "level": 5
                            }],
                        "tm": [
                            {
                                "move": "Razor Wind",
                                "level": 2
                            }, {
                                "move": "Whirlwind",
                                "level": 4
                            }, {
                                "move": "Toxic",
                                "level": 6
                            }, {
                                "move": "Take Down",
                                "level": 9
                            }, {
                                "move": "Double-Edge",
                                "level": 10
                            }, {
                                "move": "Hyper Beam",
                                "level": 15
                            }, {
                                "move": "Rage",
                                "level": 20
                            }, {
                                "move": "Thunderbolt",
                                "level": 24
                            }, {
                                "move": "Thunder",
                                "level": 25
                            }, {
                                "move": "Mimic",
                                "level": 31
                            }, {
                                "move": "Double Team",
                                "level": 32
                            }, {
                                "move": "Reflect",
                                "level": 33
                            }, {
                                "move": "Bide",
                                "level": 34
                            }, {
                                "move": "Swift",
                                "level": 39
                            }, {
                                "move": "Sky Attack",
                                "level": 43
                            }, {
                                "move": "Rest",
                                "level": 44
                            }, {
                                "move": "Thunder Wave",
                                "level": 45
                            }, {
                                "move": "Substitute",
                                "level": 50
                            }]
                    }
                },
                "ZUBAT": {
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
                        "natural": [
                            {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 15
                            }, {
                                "move": "Confuse Ray",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 28
                            }, {
                                "move": "Haze",
                                "level": 36
                            }],
                        "hm": [],
                        "tm": [
                            {
                                "move": "Leech Life",
                                "level": 1
                            }, {
                                "move": "Supersonic",
                                "level": 10
                            }, {
                                "move": "Bite",
                                "level": 15
                            }, {
                                "move": "Confuse Ray",
                                "level": 21
                            }, {
                                "move": "Wing Attack",
                                "level": 28
                            }, {
                                "move": "Haze",
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
             *         "type": row.children[1].innerText.trim(),
             *         "damage": tryNumber(row.children[2].children[0].className.replace("damage-category-block ", "")),
             *         "power": tryNumber(row.children[3].innerText.split(/\s+/g)[1]),
             *         "accuracy": tryNumber(row.children[4].innerText.split(/\s+/g)[1]),
             *         "pp": tryNumber(row.children[5].innerText.split(/\s+/g)[1]),
             *         "description": row.children[6].innerText
             *     };
             * });
             * 
             * JSON.stringify(output);
             */
            "moves": {
                "Absorb": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Leeches 50% of the damage dealt."
                },
                "Acid": {
                    "type": "Poison",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "10% chance to lower the target's Defense by one stage."
                },
                "Acid Armor": {
                    "type": "Poison",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "Boosts the user's Defense by two stages."
                },
                "Agility": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Boosts the user's Speed by two stages. Negates the Speed drop of paralysis."
                },
                "Amnesia": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Boosts the user's Special by two stages."
                },
                "Aurora Beam": {
                    "type": "Ice",
                    "damage": "Special",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "10% chance to lower the user's Attack by one stage."
                },
                "Barrage": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "Hits two to five times."
                },
                "Barrier": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Boosts the user's Defense by two stages."
                },
                "Bide": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Charges for two to three turns; returns double the damage received in those turns."
                },
                "Bind": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "75%",
                    "PP": 20,
                    "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
                },
                "Bite": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 60,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "10% chance of causing the target to flinch."
                },
                "Blizzard": {
                    "type": "Ice",
                    "damage": "Special",
                    "power": 120,
                    "accuracy": "90%",
                    "PP": 5,
                    "description": "10% chance to freeze the target."
                },
                "Body Slam": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 85,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "30% chance to paralyze the target."
                },
                "Bone Club": {
                    "type": "Ground",
                    "damage": "Physical",
                    "power": 65,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "10% chance of causing the target to flinch."
                },
                "Bonemerang": {
                    "type": "Ground",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "90%",
                    "PP": 10,
                    "description": "Hits twice."
                },
                "Bubble": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "10% chance to lower the target's Speed by one stage."
                },
                "Bubble Beam": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "10% chance to lower the target's Speed by one stage."
                },
                "Clamp": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 35,
                    "accuracy": "75%",
                    "PP": 10,
                    "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
                },
                "Comet Punch": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 18,
                    "accuracy": "85%",
                    "PP": 15,
                    "description": "Hits two to five times."
                },
                "Confuse Ray": {
                    "type": "Ghost",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "Confuses the target."
                },
                "Confusion": {
                    "type": "Psychic",
                    "damage": "Special",
                    "power": 50,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "10% chance to confuse the target."
                },
                "Constrict": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 10,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "10% chance to lower the target Speed by one stage."
                },
                "Conversion": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Changes the user into the opponent's type."
                },
                "Counter": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "If hit by a Normal- or Fighting-type attack, deals double the damage taken."
                },
                "Crabhammer": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 90,
                    "accuracy": "85%",
                    "PP": 10,
                    "description": "High critical hit rate."
                },
                "Cut": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "95%",
                    "PP": 30,
                    "description": "No additional effect.",
                    "partyActivate": Animations.prototype.partyActivateCut,
                    "characterName": "CuttableTree",
                    "requiredBadge": "Cascade"
                } as IHMMoveSchema,
                "Defense Curl": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "Boosts the user's Defense by one stage."
                },
                "Dig": {
                    "type": "Ground",
                    "damage": "Physical",
                    "power": 100,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "User is made invulnerable for one turn, then hits the next turn."
                },
                "Disable": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "55%",
                    "PP": 20,
                    "description": "Randomly disables a foe's move for 0-6 turns."
                },
                "Dizzy Punch": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 70,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Double Kick": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 30,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "Hits twice."
                },
                "Double Slap": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "85%",
                    "PP": 10,
                    "description": "Hits two to five times."
                },
                "Double Team": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 15,
                    "description": "Boosts the user's evasion by one stage."
                },
                "Double-Edge": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 100,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Has 1/4 recoil."
                },
                "Dragon Rage": {
                    "type": "Dragon",
                    "damage": "Special",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "Always does 40 HP damage."
                },
                "Dream Eater": {
                    "type": "Psychic",
                    "damage": "Special",
                    "power": 100,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Leeches 50% of the damage dealt. Only works if the target is asleep."
                },
                "Drill Peck": {
                    "type": "Flying",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "No additional effect."
                },
                "Earthquake": {
                    "type": "Ground",
                    "damage": "Physical",
                    "power": 100,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Egg Bomb": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 100,
                    "accuracy": "75%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Ember": {
                    "type": "Fire",
                    "damage": "Special",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "10% chance to burn the target."
                },
                "Explosion": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 170,
                    "accuracy": "100%",
                    "PP": 5,
                    "description": "Faints the user."
                },
                "Fire Blast": {
                    "type": "Fire",
                    "damage": "Special",
                    "power": 120,
                    "accuracy": "85%",
                    "PP": 5,
                    "description": "30% chance to burn the target."
                },
                "Fire Punch": {
                    "type": "Fire",
                    "damage": "Special",
                    "power": 75,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "10% chance to burn the target."
                },
                "Fire Spin": {
                    "type": "Fire",
                    "damage": "Special",
                    "power": 15,
                    "accuracy": "70%",
                    "PP": 15,
                    "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
                },
                "Fissure": {
                    "type": "Ground",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "30%",
                    "PP": 5,
                    "description": "OHKOes the target."
                },
                "Flamethrower": {
                    "type": "Fire",
                    "damage": "Special",
                    "power": 95,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "10% chance to burn the target."
                },
                "Flash": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "70%",
                    "PP": 20,
                    "description": "Lowers the target's accuracy by one stage.",
                    "requiredBadge": "Boulder"
                } as IHMMoveSchema,
                "Fly": {
                    "type": "Flying",
                    "damage": "Physical",
                    "power": 70,
                    "accuracy": "95%",
                    "PP": 15,
                    "description": "User is made invulnerable for one turn, then hits the next turn.",
                    "requiredBadge": "Thunder"
                } as IHMMoveSchema,
                "Focus Energy": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Reduces the user's critical hit rate."
                },
                "Fury Attack": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "Hits two to five times."
                },
                "Fury Swipes": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 18,
                    "accuracy": "80%",
                    "PP": 15,
                    "description": "Hits two to five times."
                },
                "Glare": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "75%",
                    "PP": 30,
                    "description": "Paralyzes the target."
                },
                "Growl": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 40,
                    "description": "Lowers the target's Attack by one stage."
                },
                "Growth": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "Boosts Special one stage."
                },
                "Guillotine": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "30%",
                    "PP": 5,
                    "description": "OHKOes the target."
                },
                "Gust": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Harden": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Boosts the user's Defense by one stage."
                },
                "Haze": {
                    "type": "Ice",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Eliminates all stat changes."
                },
                "Headbutt": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 70,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "30% chance of causing the target to flinch."
                },
                "High Jump Kick": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 85,
                    "accuracy": "90%",
                    "PP": 20,
                    "description": "User takes 1 HP recoil if attack misses or fails."
                },
                "Horn Attack": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "No additional effect."
                },
                "Horn Drill": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "30%",
                    "PP": 5,
                    "description": "OHKOes the target."
                },
                "Hydro Pump": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 120,
                    "accuracy": "80%",
                    "PP": 5,
                    "description": "No additional effect."
                },
                "Hyper Beam": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 150,
                    "accuracy": "90%",
                    "PP": 5,
                    "description": "User cannot move next turn, unless opponent or Substitute was KOed."
                },
                "Hyper Fang": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "90%",
                    "PP": 15,
                    "description": "10% chance of causing the target to flinch."
                },
                "Hypnosis": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "60%",
                    "PP": 20,
                    "description": "Puts the foe to sleep."
                },
                "Ice Beam": {
                    "type": "Ice",
                    "damage": "Special",
                    "power": 95,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "10% chance to freeze."
                },
                "Ice Punch": {
                    "type": "Ice",
                    "damage": "Special",
                    "power": 75,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "10% chance to freeze."
                },
                "Jump Kick": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 70,
                    "accuracy": "95%",
                    "PP": 25,
                    "description": "User takes 1 HP recoil if attack misses."
                },
                "Karate Chop": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "High critical hit rate."
                },
                "Kinesis": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "80%",
                    "PP": 15,
                    "description": "Lowers the target's accuracy by one stage."
                },
                "Leech Life": {
                    "type": "Bug",
                    "damage": "Physical",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Leeches 50% of the damage dealt."
                },
                "Leech Seed": {
                    "type": "Grass",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "90%",
                    "PP": 10,
                    "description": "Leeches 1/16 of the target's HP each turn."
                },
                "Leer": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "Lowers the target's Defense by one stage."
                },
                "Lick": {
                    "type": "Ghost",
                    "damage": "Physical",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "30% chance to paralyze the target."
                },
                "Light Screen": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Halves Special damage done to user."
                },
                "Lovely Kiss": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "75%",
                    "PP": 10,
                    "description": "Puts the target to sleep."
                },
                "Low Kick": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "90%",
                    "PP": 20,
                    "description": "30% chance of causing the target to flinch foe."
                },
                "Meditate": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "Boosts the user's Attack by one stage."
                },
                "Mega Drain": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "Leeches 50% of the damage dealt."
                },
                "Mega Kick": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 120,
                    "accuracy": "75%",
                    "PP": 5,
                    "description": "No additional effect."
                },
                "Mega Punch": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "No additional effect."
                },
                "Metronome": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Uses a random move."
                },
                "Mimic": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Copies a random move the foe knows."
                },
                "Minimize": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Boosts the user's evasion by one stage."
                },
                "Mirror Move": {
                    "type": "Flying",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Use the move the foe just used."
                },
                "Mist": {
                    "type": "Ice",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Prevents moves that only lower stats from working for 5 turns."
                },
                "Night Shade": {
                    "type": "Ghost",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Deals damage equal to the user's level."
                },
                "Pay Day": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "No competitive effect."
                },
                "Peck": {
                    "type": "Flying",
                    "damage": "Physical",
                    "power": 35,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Petal Dance": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 70,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Repeats for two to three turns. Confuses the user at the end."
                },
                "Pin Missile": {
                    "type": "Bug",
                    "damage": "Physical",
                    "power": 14,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "Hits two to five times."
                },
                "Poison Gas": {
                    "type": "Poison",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "55%",
                    "PP": 40,
                    "description": "Poisons the target."
                },
                "Poison Powder": {
                    "type": "Poison",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "75%",
                    "PP": 35,
                    "description": "Poisons the target."
                },
                "Poison Sting": {
                    "type": "Poison",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "20% chance to poison the target."
                },
                "Pound": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Psybeam": {
                    "type": "Psychic",
                    "damage": "Special",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "10% chance to confuse the target."
                },
                "Psychic": {
                    "type": "Psychic",
                    "damage": "Special",
                    "power": 90,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "30% chance to lower the target's Special by one stage."
                },
                "Psywave": {
                    "type": "Psychic",
                    "damage": "Special",
                    "power": "-",
                    "accuracy": "80%",
                    "PP": 15,
                    "description": "Does random damage equal to .5x-1.5x the user's level."
                },
                "Quick Attack": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "Priority +1.",
                    "priority": 1
                },
                "Rage": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Boosts Attack by one stage if hit, but can only use Rage after that."
                },
                "Razor Leaf": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 55,
                    "accuracy": "95%",
                    "PP": 25,
                    "description": "High critical hit rate."
                },
                "Razor Wind": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "75%",
                    "PP": 10,
                    "description": "Charges first turn; attacks on the second."
                },
                "Recover": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Heals 50% of the user's max HP."
                },
                "Reflect": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Lowers the physical damage done to user."
                },
                "Rest": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "The user goes to sleep for two turns, restoring all HP."
                },
                "Roar": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Has no effect."
                },
                "Rock Slide": {
                    "type": "Rock",
                    "damage": "Physical",
                    "power": 75,
                    "accuracy": "90%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Rock Throw": {
                    "type": "Rock",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "90%",
                    "PP": 15,
                    "description": "No additional effect."
                },
                "Rolling Kick": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 60,
                    "accuracy": "85%",
                    "PP": 15,
                    "description": "30% chance of causing the target to flinch."
                },
                "Sand Attack": {
                    "type": "Ground",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Lowers the target's accuracy by one stage."
                },
                "Scratch": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Screech": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "85%",
                    "PP": 40,
                    "description": "Lowers the target's Defense by two stages."
                },
                "Seismic Toss": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Deals damage equal to the user's level."
                },
                "Self-Destruct": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 130,
                    "accuracy": "100%",
                    "PP": 5,
                    "description": "Faints the user."
                },
                "Sharpen": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Boosts the user's Attack by one stage."
                },
                "Sing": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "55%",
                    "PP": 15,
                    "description": "Puts the target to sleep."
                },
                "Skull Bash": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 100,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Charges turn one; attacks turn two."
                },
                "Sky Attack": {
                    "type": "Flying",
                    "damage": "Physical",
                    "power": 140,
                    "accuracy": "90%",
                    "PP": 5,
                    "description": "Hits the turn after being used."
                },
                "Slam": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "75%",
                    "PP": 20,
                    "description": "No additional effect."
                },
                "Slash": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 70,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "High critical hit rate."
                },
                "Sleep Powder": {
                    "type": "Grass",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "75%",
                    "PP": 15,
                    "status": "Sleep",
                    "description": "Puts the target to sleep."
                },
                "Sludge": {
                    "type": "Poison",
                    "damage": "Physical",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "29.7% chance to poison the target."
                },
                "Smog": {
                    "type": "Poison",
                    "damage": "Physical",
                    "power": 20,
                    "accuracy": "70%",
                    "PP": 20,
                    "description": "40% chance to poison the target."
                },
                "Smokescreen": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Lowers the target's accuracy by one stage."
                },
                "Soft-Boiled": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Heals 50% of the user's max HP."
                },
                "Solar Beam": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 120,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "Charges turn 1; attacks turn 2."
                },
                "Sonic Boom": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "90%",
                    "PP": 20,
                    "description": "Does 20 damage. Ghosts take regular damage."
                },
                "Spike Cannon": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 20,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Hits two to five times."
                },
                "Splash": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "No effect whatsoever."
                },
                "Spore": {
                    "type": "Grass",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "Puts the target to sleep."
                },
                "Stomp": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 65,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "30% chance of causing the target to flinch."
                },
                "Strength": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "No additional effect.",
                    "partyActivate": Animations.prototype.partyActivateStrength,
                    "characterName": "StrengthBoulder",
                    "requiredBadge": "Rainbow"
                } as IHMMoveSchema,
                "String Shot": {
                    "type": "Bug",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "95%",
                    "PP": 40,
                    "description": "Lowers the target's Speed by one stage."
                },
                "Struggle": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 50,
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Has 1/2 recoil. Ghost-types take damage."
                },
                "Stun Spore": {
                    "type": "Grass",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "75%",
                    "PP": 30,
                    "description": "Paralyzes the target."
                },
                "Submission": {
                    "type": "Fighting",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "80%",
                    "PP": 25,
                    "description": "Has 1/4 recoil."
                },
                "Substitute": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Takes 1/4 the user's max HP to create a Substitute that takes damage for the user."
                },
                "Super Fang": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": "-",
                    "accuracy": "90%",
                    "PP": 10,
                    "description": "Deals damage equal to half the target's current HP."
                },
                "Supersonic": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "55%",
                    "PP": 20,
                    "description": "Confuses the target."
                },
                "Surf": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 95,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "No additional effect.",
                    "partyActivate": Animations.prototype.partyActivateSurf,
                    "characterName": "WaterEdge",
                    "requiredBadge": "Soul"
                } as IHMMoveSchema,
                "Swift": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 60,
                    "accuracy": "-",
                    "PP": 20,
                    "description": "Always hits."
                },
                "Swords Dance": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 30,
                    "description": "Boosts the user's Attack by two stages.",
                    "effect": "Raise",
                    "raise": "Attack",
                    "amount": 1
                },
                "Tackle": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 35,
                    "accuracy": "95%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Tail Whip": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "Lowers the Defense of all opposing adjacent Pokemon by one stage."
                },
                "Take Down": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 90,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "Has 1/4 recoil."
                },
                "Teleport": {
                    "type": "Psychic",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 20,
                    "description": "No competitive effect."
                },
                "Thrash": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 90,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Repeats for three to four turns. Confuses the user at the end."
                },
                "Thunder": {
                    "type": "Electric",
                    "damage": "Special",
                    "power": 120,
                    "accuracy": "70%",
                    "PP": 10,
                    "description": "10% chance to paralyze the target."
                },
                "Thunder Punch": {
                    "type": "Electric",
                    "damage": "Special",
                    "power": 75,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "10% chance to paralyze the target."
                },
                "Thunder Shock": {
                    "type": "Electric",
                    "damage": "Special",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "10% chance to paralyze the target."
                },
                "Thunder Wave": {
                    "type": "Electric",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Paralyzes the target."
                },
                "Thunderbolt": {
                    "type": "Electric",
                    "damage": "Special",
                    "power": 95,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "10% chance to paralyze the target."
                },
                "Toxic": {
                    "type": "Poison",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "85%",
                    "PP": 10,
                    "description": "Badly poisons the target."
                },
                "Transform": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 10,
                    "description": "Transforms the user into the target, copying its type, stats, stat changes, moves, and ability."
                },
                "Tri Attack": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 80,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Twineedle": {
                    "type": "Bug",
                    "damage": "Physical",
                    "power": 25,
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Hits twice. Each hit has a 20% chance to poison the target."
                },
                "Vice Grip": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 55,
                    "accuracy": "100%",
                    "PP": 30,
                    "description": "No additional effect."
                },
                "Vine Whip": {
                    "type": "Grass",
                    "damage": "Special",
                    "power": 35,
                    "accuracy": "100%",
                    "PP": 10,
                    "description": "No additional effect."
                },
                "Water Gun": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 40,
                    "accuracy": "100%",
                    "PP": 25,
                    "description": "No additional effect."
                },
                "Waterfall": {
                    "type": "Water",
                    "damage": "Special",
                    "power": 80,
                    "accuracy": "100%",
                    "PP": 15,
                    "description": "No additional effect."
                },
                "Whirlwind": {
                    "type": "Normal",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "100%",
                    "PP": 20,
                    "description": "Has no effect."
                },
                "Wing Attack": {
                    "type": "Flying",
                    "damage": "Physical",
                    "power": 35,
                    "accuracy": "100%",
                    "PP": 35,
                    "description": "No additional effect."
                },
                "Withdraw": {
                    "type": "Water",
                    "damage": "Non-Damaging",
                    "power": "-",
                    "accuracy": "-",
                    "PP": 40,
                    "description": "Boosts the user's Defense by one stage."
                },
                "Wrap": {
                    "type": "Normal",
                    "damage": "Physical",
                    "power": 15,
                    "accuracy": "85%",
                    "PP": 20,
                    "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
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
                    "price": undefined,
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
                    "category": "Key",
                    "error": "No cycling allowed here.",
                    "bagActivate": Cycling.prototype.toggleCycling
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
                    "category": "Key",
                    "bagActivate": Fishing.prototype.startFishing,
                    "title": "Good Rod",
                    "type": "good"
                } as IRod,
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
                    "category": "Key",
                    "bagActivate": Fishing.prototype.startFishing,
                    "title": "Old Rod",
                    "type": "old"
                } as IRod,
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
                    "category": "Key",
                    "bagActivate": Fishing.prototype.startFishing,
                    "title": "Super Rod",
                    "type": "super"
                } as IRod,
                "Town Map": {
                    "effect": "Shows your position in the Pokemon World",
                    "category": "Key"
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
            }
        }
    };
}

/* tslint:enable max-line-length */
/* tslint:enable object-literal-key-quotes */
