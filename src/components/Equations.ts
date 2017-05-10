import { IMove, IStatistic } from "battlemovr/lib/Actors";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon, IPokemonStatistics, IValuePoints } from "./Battles";
import { IBattleBall } from "./constants/Items";
import { IPokemonListing, IPokemonMoveListing } from "./constants/Pokemon";
import { Moves } from "./equations/Moves";
import { IWildPokemonSchema } from "./Maps";
import { ICharacter, IGrass } from "./Things";

/**
 * Common equations used by FullScreenPokemon instances.
 */
export class Equations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Move equations used by this FullScreenPokemon instance.
     */
    public readonly moves: Moves<TGameStartr> = new Moves(this.gameStarter);

    /**
     * Calculates how many game ticks it will take for a Character to traverse a block.
     * 
     * @param thing   A walking Character.
     * @returns how many game ticks it will take for thing to traverse a block.
     */
    public walkingTicksPerBlock(thing: ICharacter): number {
        return 32 / thing.speed;
    }

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
                average += wildPokemon.level * wildPokemon.rate!;
                continue;
            }

            if (!wildPokemon.levels) {
                throw new Error("Wild Pokemon must have wither .level of .levels defined.");
            }

            let levelAverage: number = 0;

            for (const level of wildPokemon.levels) {
                levelAverage += level * (1 / wildPokemon.levels.length);
            }

            average += levelAverage * wildPokemon.rate!;
        }

        return Math.round(average);
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    public chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        const choice: number = this.gameStarter.numberMaker.random();
        let sum: number = 0;

        for (const option of options) {
            sum += option.rate!;
            if (sum >= choice) {
                return option;
            }
        }

        throw new Error("Failed to pick random wild Pokemon from options.");
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
    public newPokemon(title: string[], level?: number, moves?: IMove[]): IPokemon {
        const ev: IValuePoints = this.newPokemonEVs();
        const iv: IValuePoints = this.newPokemonIVs();
        level = level || 1;

        return {
            experience: this.experienceStarting(title, level || 1),
            ev,
            iv,
            level,
            moves: moves || this.newPokemonMoves(title, level || 1),
            nickname: title,
            statistics: this.newPokemonStatistics(title, level, ev, iv),
            title: title,
            types: this.gameStarter.constants.pokemon.byName[title.join("")].types
        };
    }

    /**
     * Generates statistics for a Pokemon.
     * 
     * @param title   The type of Pokemon to create.
     * @param level   The level of the new Pokemon (by default, 1).
     * @param iv   What IV points the Pokemon should start with.
     * @param ev   What EV points the Pokemon should start with.
     * @returns Statistics for the Pokemon.
     * @see http://bulbapedia.bulbagarden.net/wiki/Statistic#In_Generations_I_and_II
     */
    public newPokemonStatistics(title: string[], level: number, ev: IValuePoints, iv: IValuePoints): IPokemonStatistics {
        const schema: IPokemonListing = this.gameStarter.constants.pokemon.byName[title.join("")];

        const attack: IStatistic = this.pokemonStatistic("attack", schema.attack, level, ev.attack, iv.attack);
        const defense: IStatistic = this.pokemonStatistic("defense", schema.defense, level, ev.defense, iv.defense);
        const health: IStatistic = this.pokemonStatistic("health", schema.health, level, ev.health, iv.health);
        const special: IStatistic = this.pokemonStatistic("special", schema.special, level, ev.special, iv.special);
        const speed: IStatistic = this.pokemonStatistic("speed", schema.speed, level, ev.speed, iv.speed);

        return { attack, defense, health, special, speed };
    }

    /**
     * Computes the default new moves for a Pokemon based on its type and level.
     * 
     * @param title   The type of Pokemon.
     * @param level   The level of the Pokemon.
     * @returns The default moves of the Pokemon.
     * @see http://bulbapedia.bulbagarden.net/wiki/XXXXXXX_(Pok%C3%A9mon)/Generation_I_learnset
     */
    public newPokemonMoves(title: string[], level: number): IMove[] {
        const possibilities: IPokemonMoveListing[] = this.gameStarter.constants.pokemon.byName[title.join("")].moves.natural;
        const output: IMove[] = [];
        let move: IPokemonMoveListing;
        let newMove: IMove;
        let end: number;

        for (end = 0; end < possibilities.length; end += 1) {
            if (possibilities[end].level! > level) {
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
     * @see http://bulbapedia.bulbagarden.net/wiki/Individual_values
     * @todo Implement the bit procedure for health.
     */
    public newPokemonIVs(): IValuePoints {
        return {
            attack: this.gameStarter.numberMaker.randomIntWithin(0, 15),
            defense: this.gameStarter.numberMaker.randomIntWithin(0, 15),
            health: 0,
            speed: this.gameStarter.numberMaker.randomIntWithin(0, 15),
            special: this.gameStarter.numberMaker.randomIntWithin(0, 15)
        };
    }

    /**
     * Computes a blank set of EV points for a new Pokemon.
     * 
     * @returns A blank set of EV points.
     */
    public newPokemonEVs(): IValuePoints {
        return {
            attack: 0,
            defense: 0,
            health: 0,
            speed: 0,
            special: 0
        };
    }

    /**
     * Computes a Pokemon's new statistic based on its IVs and EVs.
     * 
     * @param statistic   Which statistic to compute.
     * @param base   Base modifier for the statistic.
     * @param level   Pokemon level getting the statistic.
     * @param ev   Effort value points for the statistic.
     * @param iv   Individual value points for the statistic.
     * @returns A new value for the statistic.
     * @see http://bulbapedia.bulbagarden.net/wiki/Individual_values
     * @remarks Note: the page mentions rounding errors... 
     */
    public pokemonStatistic(statistic: keyof IPokemonStatistics, base: number, level: number, ev: number, iv: number): IStatistic {
        const normal: number = this.pokemonStatisticNormal(statistic, base, level, ev, iv);

        return {
            current: normal,
            normal
        };
    }

    /**
     * Computes a Pokemon's new statistic based on its IVs and EVs.
     * 
     * @param statistic   Which statistic to compute.
     * @param base   Base modifier for the statistic.
     * @param level   Pokemon level getting the statistic.
     * @param ev   Effort value points for the statistic.
     * @param iv   Individual value points for the statistic.
     * @returns A new value for the statistic.
     * @see http://bulbapedia.bulbagarden.net/wiki/Individual_values
     * @remarks Note: the page mentions rounding errors... 
     */
    public pokemonStatisticNormal(statistic: keyof IPokemonStatistics, base: number, level: number, ev: number, iv: number): number {
        const numerator: number = ((base + iv) * 2 + Math.floor(Math.ceil(Math.sqrt(ev)) / 4)) * level;
        const fractional: number = Math.floor(numerator / 100);
        const addition: number = statistic === "health"
            ? level + 10
            : 5;

        return fractional + addition;
    }

    /**
     * Determines whether a wild encounter should occur when walking through grass.
     * 
     * @param grass   The grass Thing being walked through.
     * @returns Whether a wild encounter should occur.
     * @see http://bulbapedia.bulbagarden.net/wiki/Tall_grass
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
     * @see http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
     */
    public canCatchPokemon(pokemon: IPokemon, ball: IBattleBall): boolean {
        // 1. If a Master Ball is used, the Pokemon is caught.
        if (ball.type === "Master") {
            return true;
        }

        // 2. Generate a random number, N, depending on the type of ball used.
        const n: number = this.gameStarter.numberMaker.randomInt(ball.probabilityMax);

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
        const catchRate: number | undefined = this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].catchRate;
        if (catchRate === undefined) {
            console.warn("Catch rate hasn't yet been added for", pokemon);
        }
        if (n - this.gameStarter.constants.statuses.levels[pokemon.status || "normal"] > catchRate!) {
            return false;
        }

        // 5. If not, generate a random value, M, between 0 and 255.
        const m: number = this.gameStarter.numberMaker.randomInt(255);

        // 6. Calculate f.
        const f: number = Math.max(
            Math.min(
                (pokemon.statistics.health.normal * 255 * 4) | 0 / (pokemon.statistics.health.current * ball.rate) | 0,
                255),
            1);

        // 7. If f is greater than or equal to M, the Pokemon is caught. Otherwise, the Pokemon breaks free.
        return f > m;
    }

    /**
     * Calculates how many times a failed Pokeball should shake.
     * 
     * @param pokemon   The wild Pokemon the ball is failing to catch.
     * @param ball   The Pokeball attempting to catch the wild Pokemon.
     * @returns How many times the ball should shake.
     * @see http://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_.28Generation_I.29
     */
    public numBallShakes(pokemon: IPokemon, ball: IBattleBall): number {
        // 1. Calculate d.
        const catchRate: number | undefined = this.gameStarter.constants.pokemon.byName[pokemon.title.join("")].catchRate;
        if (catchRate === undefined) {
            console.warn("Catch rate hasn't yet been added for", pokemon);
        }
        const d: number = catchRate! * 100 / ball.rate;

        // 2. If d is greater than or equal to 256, the ball shakes three times before the Pokemon breaks free.
        if (d >= 256) {
            return 3;
        }

        // 3. If not, calculate x = d * f / 255 + s, where s is:
        //    * 10 if the Pokemon is asleep orfrozen
        //    * 5 if it is paralyzed, poisoned, or burned.
        const f: number = Math.max(
            Math.min(
                (pokemon.statistics.health.normal * 255 * 4) | 0 / (pokemon.statistics.health.normal * ball.rate) | 0,
                255),
            1);
        const x: number = d * f / 255 + this.gameStarter.constants.statuses.shaking[pokemon.status || "normal"];

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
     * Checks whether a Pokemon contains any of the given types.
     * 
     * @param pokemon   A Pokemon.
     * @param types   The types to check.
     * @returns Whether the Pokemon's types includes any of the given types.
     */
    public pokemonMatchesTypes(pokemon: IPokemon, types: string[]): boolean {
        for (const type of types) {
            if (pokemon.types.indexOf(type) !== -1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Computes how much experience a new Pokemon should start with.
     * 
     * @param title   The name of the Pokemon.
     * @param level   The level of the Pokemon.
     * @returns An amount of experience.
     * @see http://m.bulbapedia.bulbagarden.net/wiki/Experience#Relation_to_level
     * @remarks Wild Pokémon of any level will always have the base amount of experience
     *          required to reach that level when caught, as will Pokémon hatched from Eggs.
     */
    public experienceStarting(title: string[], level: number): number {
        const reference: IPokemonListing = this.gameStarter.constants.pokemon.byName[title.join("")];

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
     * @see http://bulbapedia.bulbagarden.net/wiki/Experience#Gain_formula
     */
    public experienceGained(player: any /* IBattler */, opponent: any /* IBattler */): number {
        // a is equal to 1 if the fainted Pokemon is wild, or 1.5 if the fainted Pokemon is owned by a Trainer
        const a: number = opponent.category === "Trainer" ? 1.5 : 1;

        // b is the base experience yield of the fainted Pokemon's species
        const b: number = 64; // (Bulbasaur) Todo: add this in

        // lf is the level of the fainted Pokemon
        const lf: number = opponent.selectedActor.level;

        // s is equal to (in Gen I), if Exp. All is not in the player's Bag...
        // Todo: Account for modifies like Exp. All
        const s: number = 1;

        // t is equal to 1 if the winning Pokemon's curent owner is its OT, or 1.5 if the Pokemon was gained in a domestic trade
        const t: number = player.selectedActor.traded ? 1.5 : 1;

        return (((a * t * b * lf) | 0) / ((7 * s) | 0)) | 0;
    }

    /**
     * Computes how wide a health bar should be.
     * 
     * @param widthFullBar   The maximum possible width.
     * @param statistic   Statistic for the displayed health.
     * @returns How wide the health bar should be.
     */
    public widthHealthBar(widthFullBar: number, statistic: IStatistic): number {
        return (widthFullBar - 4) * statistic.current / statistic.normal;
    }
}
