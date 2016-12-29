import { IActorExperience, IMove } from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IBattleInfo, IBattler, IMovePossibility, IPokemon } from "./Battles";
import { IBattleModification } from "./constants/BattleModifications";
import { IBattleBall } from "./constants/Items";
import { IMoveSchema } from "./constants/Moves";
import { IPokemonListing, IPokemonMoveListing } from "./constants/Pokemon";
import { IWildPokemonSchema } from "./Maps";
import { IGrass } from "./Things";

/**
 * Math functions used by FullScreenPokemon instances.
 */
export class Equations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * @param pokemon   A group of Pokemon.
     * @returns The average level of the Pokemon.
     */
    public averageLevel(pokemon: IPokemon[]): number {
        let average: number = 0;

        for (const actor of pokemon) {
            average += actor.level;
        }

        return Math.round(average / pokemon.length);
    }

    /**
     * @param options   Wild pokemon schemas.
     * @returns The average level from among the schemas.
     */
    public averageLevelWildPokemon(options: IWildPokemonSchema[]): number {
        let average: number = 0;

        for (const wildPokemon of options) {
            if (wildPokemon.level) {
                average += wildPokemon.level * wildPokemon.rate;
                continue;
            }

            if (!wildPokemon.levels) {
                throw new Error("Wild Pokemon must have wither .level of .levels defined.");
            }

            let levelAverage: number = 0;

            for (const level of wildPokemon.levels) {
                levelAverage += level * (1 / wildPokemon.levels.length);
            }

            average += levelAverage * wildPokemon.rate;
        }

        return Math.round(average);
    }

    /**
     * Generates a new Pokemon with the given traits.
     * 
     * @param title   The type of Pokemon to create.
     * @param level   The level of the new Pokemon (by default, 1).
     * @param moves   What moves the Pokemon has (by default, generated from its type
     *                and level).
     * @param iv   What IV points the Pokemon should start with (by default, generated 
     *             from the newPokemonIVs equation.
     * @param ev   What EV points the Pokemon should start with (by default, generated
     *             from the newPokemonEVs equation).
     * @returns A newly created Pokemon.
     */
    public newPokemon(title: string[], level?: number, moves?: IMove[], iv?: number, ev?: number): IPokemon {
        const statisticNames: string[] = this.gameStarter.constants.pokemon.statisticNames;
        const pokemon: any = {
            "title": title,
            "nickname": title,
            "level": level || 1,
            "moves": moves || this.newPokemonMoves(title, level || 1),
            "types": this.gameStarter.constants.pokemon.byName[title.join("")].types,
            "status": "",
            "IV": iv || this.newPokemonIVs(),
            "EV": ev || this.newPokemonEVs(),
            "experience": this.newPokemonExperience(title, level || 1)
        };

        for (const statistic of statisticNames) {
            pokemon[statistic] = this.pokemonStatistic(pokemon, statistic);
            pokemon[statistic + "Normal"] = pokemon[statistic];
        }

        return pokemon;
    }

    /**
     * Computes the default new moves for a Pokemon based on its type and level.
     * 
     * @param title   The type of Pokemon.
     * @param level   The level of the Pokemon.
     * @returns The default moves of the Pokemon.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/XXXXXXX_(Pok%C3%A9mon)/Generation_I_learnset
     */
    public newPokemonMoves(title: string[], level: number): IMove[] {
        const possibilities: IPokemonMoveListing[] = this.gameStarter.constants.pokemon.byName[title.join("")].moves.natural;
        const output: IMove[] = [];
        let move: IPokemonMoveListing;
        let newMove: IMove;
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
                remaining: this.gameStarter.constants.moves.byName[move.move].PP,
                uses: this.gameStarter.constants.moves.byName[move.move].PP
            };

            output.push(newMove);
        }

        return output;
    }

    /**
     * Computes a random set of IV points for a new Pokemon.
     * 
     * @returns A random set of IV points.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Individual_values
     */
    public newPokemonIVs(): { [i: string]: number } {
        const attack: number = this.gameStarter.numberMaker.randomIntWithin(0, 15);
        const defense: number = this.gameStarter.numberMaker.randomIntWithin(0, 15);
        const speed: number = this.gameStarter.numberMaker.randomIntWithin(0, 15);
        const special: number = this.gameStarter.numberMaker.randomIntWithin(0, 15);
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
    }

    /**
     * Computes a blank set of EV points for a new Pokemon.
     * 
     * @returns A blank set of EV points.
     */
    public newPokemonEVs(): { [i: string]: number } {
        return {
            "Attack": 0,
            "Defense": 0,
            "Speed": 0,
            "Special": 0
        };
    }

    /**
     * Computes how much experience a new Pokemon should start with, based on its
     * type and level.
     * 
     * @param title   The type of Pokemon.
     * @param level   The level of the Pokemon.
     * @returns How much experience the Pokemon should start with.
     */
    public newPokemonExperience(title: string[], level: number): IActorExperience {
        return {
            current: this.experienceStarting(title, level),
            next: this.experienceStarting(title, level + 1)
        };
    }

    /**
     * Computes a Pokemon's new statistic based on its IVs and EVs.
     * 
     * @param statistic   Which statistic to compute.
     * @returns A new value for the statistic.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Individual_values
     * @remarks Note: the page mentions rounding errors... 
     */
    public pokemonStatistic(pokemon: IPokemon, statistic: string): number {
        let topExtra: number = 0;
        let added: number = 5;
        let base: number = (this.gameStarter.constants.pokemon.byName[pokemon.title.join("")] as any)[statistic];
        let iv: number = (pokemon.IV as any)[statistic] || 0;
        let ev: number = (pokemon.EV as any)[statistic] || 0;
        let level: number = pokemon.level;

        if (statistic === "HP") {
            topExtra = 50;
            added = 10;
        }

        let numerator: number = (iv + base + (Math.sqrt(ev) / 8) + topExtra) * level;

        return (numerator / 50 + added) | 0;
    }

    /**
     * Determines whether a wild encounter should occur when walking through grass.
     * 
     * @param grass   The grass Thing being walked through.
     * @returns Whether a wild encounter should occur.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Tall_grass
     */
    public doesGrassEncounterHappen(grass: IGrass): boolean {
        return this.gameStarter.numberMaker.randomBooleanFraction(grass.rarity, 187.5);
    }

    /**
     * Determines whether a Pokemon may be caught by a ball.
     * 
     * @param pokemon   The Pokemon the ball is attempting to catch.
     * @param ball   The ball attempting to catch the Pokemon.
     * @returns Whether the Pokemon may be caught.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
     */
    public canCatchPokemon(pokemon: IPokemon, ball: IBattleBall): boolean {
        // 1. If a Master Ball is used, the Pokemon is caught.
        if (ball.type === "Master") {
            return true;
        }

        // 2. Generate a random number, N, depending on the type of ball used.
        let n: number = this.gameStarter.numberMaker.randomInt(ball.probabilityMax);

        // 3. The Pokemon is caught if...
        if (pokemon.status) { // ... it is asleep or frozen and N is less than 25.
            if (n < 25) {
                if (this.gameStarter.constants.statuses.probability25[pokemon.status]) {
                    return true;
                }
            } else if (n < 12) { // ... it is paralyzed, burned, or poisoned and N is less than 12.
                if (this.gameStarter.constants.statuses.probability12[pokemon.status]) {
                    return true;
                }
            }
        }

        // 4. Otherwise, if N minus the status value is greater than the Pokemon's catch rate, the Pokemon breaks free.
        if (n - this.gameStarter.constants.statuses.levels[pokemon.status] > pokemon.catchRate) {
            return false;
        }

        // 5. If not, generate a random value, M, between 0 and 255.
        let m: number = this.gameStarter.numberMaker.randomInt(255);

        // 6. Calculate f.
        let f: number = Math.max(
            Math.min(
                (pokemon.HPNormal * 255 * 4) | 0 / (pokemon.HP * ball.rate) | 0,
                255),
            1);

        // 7. If f is greater than or equal to M, the Pokemon is caught. Otherwise, the Pokemon breaks free.
        return f > m;
    }

    /**
     * Determines whether the player may flee a wild Pokemon encounter.
     * 
     * @param pokemon   The player's current Pokemon.
     * @param enemy   The wild Pokemon.
     * @param battleInfo   Information on the current battle.
     * @returns Whether the player may flee.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Escape#Generation_I_and_II
     */
    public canEscapePokemon(pokemon: IPokemon, enemy: IPokemon, battleInfo: IBattleInfo): boolean {
        const a: number = pokemon.Speed;
        const b: number = (enemy.Speed / 4) % 256;
        const c: number = battleInfo.currentEscapeAttempts || 0;
        const f: number = (a * 32) / b + 30 * c;

        if (f > 255 || b === 0) {
            return true;
        }

        return this.gameStarter.numberMaker.randomInt(256) < f;
    }

    /**
     * Calculates how many times a failed Pokeball should shake.
     * 
     * @param pokemon   The wild Pokemon the ball is failing to catch.
     * @param ball   The Pokeball attempting to catch the wild Pokemon.
     * @returns How many times the balls hould shake.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
     */
    public numBallShakes(pokemon: IPokemon, ball: IBattleBall): number {
        // 1. Calculate d.
        const d: number = pokemon.catchRate * 100 / ball.rate;

        // 2. If d is greater than or equal to 256, the ball shakes three times before the Pokemon breaks free.
        if (d >= 256) {
            return 3;
        }

        // 3. If not, calculate x = d * f / 255 + s, where s is:
        //    * 10 if the Pokemon is asleep orfrozen
        //    * 5 if it is paralyzed, poisoned, or burned.
        const f: number = Math.max(
            Math.min(
                (pokemon.HPNormal * 255 * 4) | 0 / (pokemon.HP * ball.rate) | 0,
                255),
            1);
        const x: number = d * f / 255 + this.gameStarter.constants.statuses.shaking[pokemon.status];

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
    }

    /**
     * Determines what move an opponent should take in battle.
     * 
     * @param player   The in-battle player.
     * @param opponent   The in-battle opponent.
     * @returns The contatenated name of the move the opponent will choose.
     * @remarks http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
     * @remarks Todo: Also filter for moves with > 0 remaining remaining...
     */
    public opponentMove(player: IBattler, opponent: IBattler): string {
        let possibilities: IMovePossibility[] = opponent.selectedActor!.moves.map(
            (move: IMove): IMovePossibility => ({
                move: move.title,
                priority: 10
            }));

        // Wild Pokemon just choose randomly
        if (opponent.category === "Wild") {
            return this.gameStarter.numberMaker.randomArrayMember(possibilities).move;
        }

        // Modification 1: Do not use a move that only statuses (e.g. Thunder Wave) if the player's pokémon already has a status.
        if (player.selectedActor!.status && !opponent.dumb) {
            for (const possibility of possibilities) {
                if (this.moveOnlyStatuses(this.gameStarter.constants.moves.byName[possibility.move])) {
                    possibility.priority += 5;
                }
            }
        }

        // Modification 2: On the second turn the pokémon is out, prefer a move with one of the following effects...
        if (this.pokemonMatchesTypes(opponent.selectedActor!, this.gameStarter.constants.battleModifications.turnTwo.opponentType)) {
            for (const possibility of possibilities) {
                this.applyMoveEffectPriority(
                    possibility,
                    this.gameStarter.constants.battleModifications.turnTwo,
                    player.selectedActor!,
                    1);
            }
        }

        // Modification 3 (Good AI): Prefer a move that is super effective.
        // Do not use moves that are not very effective as long as there is an alternative.
        if (this.pokemonMatchesTypes(opponent.selectedActor!, this.gameStarter.constants.battleModifications.goodAi.opponentType)) {
            for (let i: number = 0; i < possibilities.length; i += 1) {
                this.applyMoveEffectPriority(
                    possibilities[i],
                    this.gameStarter.constants.battleModifications.goodAi,
                    player.selectedActor!,
                    1);
            }
        }

        // The AI uses rejection sampling on the four moves with ratio 63:64:63:66,
        // with only the moves that are most favored after applying the modifications being acceptable.
        let lowest: number = possibilities[0].priority;
        if (possibilities.length > 1) {
            for (const possibility of possibilities) {
                if (possibility.priority < lowest) {
                    lowest = possibility.priority;
                }
            }

            possibilities = possibilities.filter(function (possibility: IMovePossibility): boolean {
                return possibility.priority === lowest;
            });
        }

        return this.gameStarter.numberMaker.randomArrayMember(possibilities).move;
    }

    /**
     * Checks whether a Pokemon contains any of the given types.
     * 
     * @param pokemon   A Pokemon.
     * @param types   The types to check.
     * @returns Whether the Pokemon's types includes any of the given types.
     */
    public pokemonMatchesTypes(pokemon: IPokemon, types: string[]): boolean {
        for (let i: number = 0; i < types.length; i += 1) {
            if (pokemon.types.indexOf(types[i]) !== -1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks whether a move only has a status effect (does no damage, or nothing).
     * 
     * @param move   The move.
     * @returns Whether the moves has only a status effect.
     */
    public moveOnlyStatuses(move: IMoveSchema): boolean {
        return move.damage === "Non-Damaging" && move.effect === "Status";
    }

    /**
     * Modifies a move possibility's priority based on battle state.
     * 
     * @param possibility   A move possibility.
     * @param modification   A modification summary for a part of the battle state.
     * @param target   The Pokemon being targeted.
     * @param amount   How much to modify the move's priority.
     */
    public applyMoveEffectPriority(
        possibility: IMovePossibility,
        modification: IBattleModification,
        target: IPokemon,
        amount: number): void {
        const preferences: ([string, string, number] | [string, string])[] = modification.preferences;
        const move: IMoveSchema = this.gameStarter.constants.moves.byName[possibility.move];

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
    }

    /**
     * Determines whether a player's Pokemon should move before the opponent's.
     * 
     * @param player   The in-battle player.
     * @param choicePlayer   The concatenated name of the move the player chose.
     * @param opponent   The in-battle opponent.
     * @param choiesOpponent   The concatenated name of the move the opponent chose.
     * @returns Whether the player will move before the opponent.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Priority
     * @remarks Todo: Account for items, switching, etc.
     * @remarks Todo: Factor in spec differences from paralyze, etc.
     */
    public playerMovesFirst(player: IBattler, choicePlayer: string, opponent: IBattler, choiceOpponent: string): boolean {
        const movePlayer: IMoveSchema = this.gameStarter.constants.moves.byName[choicePlayer];
        const moveOpponent: IMoveSchema = this.gameStarter.constants.moves.byName[choiceOpponent];

        if (movePlayer.priority === moveOpponent.priority) {
            return player.selectedActor!.Speed > opponent.selectedActor!.Speed;
        }

        return movePlayer.priority > moveOpponent.priority;
    }

    /**
     * Computes how much damage a move should do to a Pokemon.
     * 
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking pokemon.
     * @param defender   The defending Pokemon.
     * @returns How much damage should be dealt.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     * @remarks Todo: Factor in spec differences from burns, etc.
     */
    public damage(move: string, attacker: IPokemon, defender: IPokemon): number {
        let base: string | number = this.gameStarter.constants.moves.byName[move].power;

        // A base attack that's not numeric means no damage, no matter what
        if (!base || isNaN(base as number)) {
            return 0;
        }

        // Don't bother calculating infinite damage: it's going to be infinite
        if (!isFinite(base as number)) {
            return Infinity;
        }

        const critical: boolean = this.criticalHit(move, attacker);
        const level: number = attacker.level * Number(critical);
        const attack: number = attacker.Attack;
        const defense: number = defender.Defense;
        const modifier: number = this.damageModifier(move, attacker, defender);

        return Math.round(
            Math.max(
                ((((2 * level + 10) / 250) * (attack / defense) * (base as number) + 2) | 0) * modifier,
                1));
    }

    /**
     * Determines the damage modifier against a defending Pokemon.
     * 
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking Pokemon.
     * @param defender   The defending Pokemon.
     * @returns The damage modifier, as a multiplication constant.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     */
    public damageModifier(move: string, attacker: IPokemon, defender: IPokemon): number {
        const moveSchema: IMoveSchema = this.gameStarter.constants.moves.byName[move];
        const stab: number = attacker.types.indexOf(moveSchema.type) !== -1 ? 1.5 : 1;
        const type: number = this.typeEffectiveness(move, defender);

        return stab * type * this.gameStarter.numberMaker.randomWithin(.85, 1);
    }

    /**
     * Determines whether a move should be a critical hit.
     * 
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking Pokemon.
     * @returns Whether the move should be a critical hit.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Critical_hit
     */
    public criticalHit(move: string, attacker: IPokemon): boolean {
        const moveInfo: IMoveSchema = this.gameStarter.constants.moves.byName[move];
        const baseSpeed: number = this.gameStarter.constants.pokemon.byName[attacker.title.join("")].Speed;
        let denominator: number = 512;

        // Moves with a high critical-hit ratio, such as Slash, are eight times more likely to land a critical hit,
        // resulting in a probability of BaseSpeed / 64.
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

        // As with move accuracy in the handheld games, if the probability of landing a critical hit would be 100%,
        // it instead becomes 255/256 or about 99.6%.
        return this.gameStarter.numberMaker.randomBooleanProbability(Math.max(baseSpeed / denominator, 255 / 256));
    }

    /**
     * Determines the type effectiveness of a move on a defending Pokemon.
     * 
     * @param move   The concatenated name of the move.
     * @param defender   The defending Pokemon.
     * @returns A damage modifier, as a multiplication constant.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
     */
    public typeEffectiveness(move: string, defender: IPokemon): number {
        const defenderTypes: string[] = this.gameStarter.constants.pokemon.byName[defender.title.join("")].types;
        const typeIndices: { [i: string]: number } = this.gameStarter.constants.types.indices;
        const moveIndex: number = typeIndices[this.gameStarter.constants.moves.byName[move].type];
        let total: number = 1;

        for (let i: number = 0; i < defenderTypes.length; i += 1) {
            const effectivenesses: number[] = this.gameStarter.constants.types.effectivenessTable[moveIndex];
            total *= effectivenesses[typeIndices[defenderTypes[i]]];
        }

        return total;
    }

    /**
     * Computes how much experience a new Pokemon should start with.
     * 
     * @param title   The name of the Pokemon.
     * @param level   The level of the Pokemon.
     * @returns An amount of experience.
     * @remarks http://m.bulbapedia.bulbagarden.net/wiki/Experience#Relation_to_level
     * @remarks Wild Pokémon of any level will always have the base amount of experience
     *          required to reach that level when caught, as will Pokémon hatched from Eggs.
     */
    public experienceStarting(title: string[], level: number): number {
        let reference: IPokemonListing = this.gameStarter.constants.pokemon.byName[title.join("")];

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
    }

    /**
     * Computes how much experience should be gained from defeating a Pokemon.
     * 
     * @returns How much experience is to be gained.
     * @remarks This will need to be changed to accomodate rewarding multiple Pokemon.
     * @remarks http://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
     */
    public experienceGained(player: IBattler, opponent: IBattler): number {
        // a is equal to 1 if the fainted Pokemon is wild, or 1.5 if the fainted Pokemon is owned by a Trainer
        let a: number = opponent.category === "Trainer" ? 1.5 : 1;

        // b is the base experience yield of the fainted Pokemon's species
        let b: number = 64; // (Bulbasaur) Todo: add this in

        // lf is the level of the fainted Pokemon
        let lf: number = opponent.selectedActor!.level;

        // s is equal to (in Gen I), if Exp. All is not in the player's Bag...
        // Todo: Account for modifies like Exp. All
        let s: number = 1;

        // t is equal to 1 if the winning Pokemon's curent owner is its OT, or 1.5 if the Pokemon was gained in a domestic trade
        let t: number = player.selectedActor!.traded ? 1.5 : 1;

        return (((a * t * b * lf) | 0) / ((7 * s) | 0)) | 0;
    }

    /**
     * Computes how wide a health bar should be.
     * 
     * @param widthFullBar   The maximum possible width.
     * @param hp   How much HP a Pokemon currently has.
     * @param hpNormal   The maximum HP the Pokemon may have.
     * @returns How wide the health bar should be.
     */
    public widthHealthBar(widthFullBar: number, hp: number, hpNormal: number): number {
        return (widthFullBar - 1) * hp / hpNormal;
    }
}
