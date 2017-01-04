import { IActor, IStatistic, IStatistics } from "battlemovr/lib/Actors";
import * as iteams from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Animations } from "./battles/Animations";
import { Moves } from "./battles/Moves";
import { IStatus } from "./battles/Statuses";
import { IStateSaveable } from "./Saves";

/**
 * 
 */
export interface IPokemon extends IActor, IStateSaveable {
    /**
     * How likely a critical hit is from this Pokemon, for the criticalHit equation.
     */
    raisedCriticalHitProbability?: boolean;

    /**
     * Accumulated effort value points.
     */
    ev: IValuePoints;

    /**
     * Accumulated individual value points.
     */
    iv: IValuePoints;

    /**
     * Battle attribute statistics.
     */
    statistics: IPokemonStatistics;

    /**
     * Any current status effect.
     */
    status?: IStatus;

    /**
     * What types this Pokemon is, such as "Water".
     */
    types: string[];
}

/**
 * 
 */
export interface IValuePoints {
    /**
     * Attack EV points.
     */
    attack: number;

    /**
     * Defense EV points.
     */
    defense: number;

    /**
     * Special EV points.
     */
    special: number;

    /**
     * Speed EV points.
     */
    speed: number;
}

/**
 * 
 */
export interface IPokemonStatistics extends IStatistics {
    /**
     * The Pokemon's attack.
     */
    attack: IStatistic;

    /**
     * The pokemon's defense.
     */
    defense: IStatistic;

    /**
     * The Pokemon's special.
     */
    special: IStatistic;

    /**
     * The Pokemon's speed.
     */
    speed: IStatistic;
}

/**
 * 
 */
export interface IEnemyTeam extends iteams.ITeam {
    /**
     * A badge to gift when defeated.
     */
    badge?: string;

    /**
     * Whether this opponent doesn't understand status effects, for the opponentMove equation.
     */
    dumb?: boolean;

    /**
     * A gift to give after defeated in battle.
     */
    giftAfterBattle?: string;

    /**
     * A cutscene to trigger after defeated in battle.
     */
    nextCutscene?: string;

    /**
     * A monetary reward to give after defeated in battle.
     */
    reward?: number;
}

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Battle animations used by FullScreenPokemon instances.
     */
    public readonly animations: Animations<TGameStartr> = new Animations(this.gameStarter);

    /**
     * Battle move functions used by FullScreenPokemon instances.
     */
    public readonly moves: Moves<TGameStartr> = new Moves(this.gameStarter);

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: IPokemon): void {
        for (const statisticName of this.gameStarter.constants.pokemon.statisticNames) {
            pokemon.statistics[statisticName].current = pokemon.statistics[statisticName].normal;
        }

        for (const move of pokemon.moves) {
            move.remaining = this.gameStarter.constants.moves.byName[move.title].PP;
        }

        pokemon.status = undefined;
    }
}
