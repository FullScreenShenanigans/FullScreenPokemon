import { IActor, IStatistic, IStatistics } from "battlemovr/lib/Actors";
import { IBattleInfo as IBattleInfoBase, IBattleOptions as IBattleOptionsBase } from "battlemovr/lib/Battles";
import * as iteams from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Animations } from "./battles/Animations";
import { Moves } from "./battles/Moves";
import { IStatus } from "./battles/Statuses";
import { IStateSaveable } from "./Saves";
import { IThing } from "./Things";

/**
 * Party Pokemon that can participate in battles.
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
 * Texts to display in battle menus.
 */
export interface IBattleTexts {
    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle: IMenuDialogRaw;

    /**
     * Text to display upon defeat.
     */
    defeat: IMenuDialogRaw;

    /**
     * Text for when the opponent sends out a Pokemon. The opponent's name and the
     * Pokemon's nickname are between the Strings.
     */
    opponentSendOut: [string, string, string];

    /**
     * Text for when the player sends out a Pokemon. The Pokemon's name is between the 
     * Strings.
     */
    playerSendOut: [string, string];

    /**
     * Text for when the battle starts. The opponent's name is between the Strings.
     */
    start: [string, string];

    /**
     * Text to display upon victory.
     */
    victory: IMenuDialogRaw;
}

/**
 * Battle options specific to FullScreenPokemon
 */
export interface IPokemonBattleOptions {
    /**
     * Things that should be visible above the starting animation.
     */
    keptThings?: IThing[];

    /**
     * Texts to display in menus.
     */
    texts: IBattleTexts;

    /**
     * Audio theme to play during the battle.
     */
    theme: string;
}

/**
 * Options to start a new battle.
 */
export type IBattleOptions = IBattleOptionsBase & Partial<IPokemonBattleOptions>;

/**
 * Information on an in-progress battle.
 */
export type IBattleInfo = IBattleInfoBase & IPokemonBattleOptions;

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
     * Starts a new battle.
     *
     * @param partialBattleOptions   Options to start the battle.
     */
    public startBattle(partialBattleOptions: Partial<IBattleOptions>): void {
        const battleOptions: IBattleOptions = this.fillOutBattleOptions(partialBattleOptions);
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.startBattle(battleOptions) as IBattleInfo;

        this.gameStarter.scenePlayer.startCutscene("Battle", { battleInfo });
    }

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

    /**
     * Fills in default values for battle options.
     * 
     * @param partialBattleOptions   Partial options to start a battle.
     * @returns Completed options to start a battle.
     */
    protected fillOutBattleOptions(partialBattleOptions: Partial<IBattleOptions>): IBattleOptions {
        return this.gameStarter.utilities.proliferate(
            {
                onComplete: (): void => { /* ... */ },
                teams: {
                    player: {
                        actors: this.gameStarter.itemsHolder.getItem("PokemonInParty") as IPokemon[],
                        selector: "player"
                    },
                    opponent: {
                        actors: [],
                        selector: "opponent"
                    }
                },
                theme: "Battle Trainer"
            },
            partialBattleOptions);
    }
}
