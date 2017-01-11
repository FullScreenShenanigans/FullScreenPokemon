import { IActor, IStatistic, IStatistics } from "battlemovr/lib/Actors";
import { IOnBattleComplete } from "battlemovr/lib/Animations";
import { IBattleInfo as IBattleInfoBase } from "battlemovr/lib/Battles";
import { ITeamBase, ITeamDescriptor, IUnderEachTeam } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { ActionsOrderer } from "./battles/ActionsOrderer";
import { Animations } from "./battles/Animations";
import { Decorations } from "./battles/Decorations";
import { Selectors } from "./battles/Selectors";
import { IStatus } from "./battles/Statuses";
import { Things } from "./battles/Things";
import { IBattleTextGenerators } from "./constants/Battles/Texts";
import { IMenu } from "./Menus";
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
 * Effort or individual value points for a Pokemon.
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
 * Statistics for a Pokemon.
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
 * An enemy team attacking the player.
 */
export interface IEnemyTeam extends ITeamDescriptor {
    /**
     * A badge to gift when defeated.
     */
    badge?: string;

    /**
     * Whether this opponent doesn't understand status effects in move priority generation.
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

    /**
     * Whether this opponent should override its type for better moves in move priority generation.
     */
    smart?: boolean;
}

/**
 * Things displayed in a battle.
 */
export interface IBattleThings extends IUnderEachTeam<IThing> {
    /**
     * Solid background color behind everything.
     */
    background: IThing;

    /**
     * Menu surrounding the battle area.
     */
    menu: IMenu;
}

/**
 * Battle options specific to FullScreenPokemon.
 */
export interface IPokemonBattleOptions {
    /**
     * Things that should be visible above the starting animation.
     */
    keptThings?: IThing[];

    /**
     * Texts to display in menus.
     */
    texts: IBattleTextGenerators;

    /**
     * Audio theme to play during the battle.
     */
    theme: string;

    /**
     * Things displayed in the battle.
     */
    things: IBattleThings;
}

/**
 * Minimum options to start a new battle.
 */
export interface IPartialBattleOptions {
    /**
     * Whether the battle should advance its menus automatically.
     */
    automaticMenus?: boolean;

    /**
     * Opposing teams in the battle.
     */
    teams: Partial<IUnderEachTeam<Partial<ITeamDescriptor>>>;

    /**
     * Texts to display in menus.
     */
    texts?: Partial<IBattleTextGenerators>;
}

/**
 * Complete options to start a new battle.
 */
export interface IBattleOptions extends IPartialBattleOptions {
    /**
     * Callback for when the battle is complete.
     */
    onComplete: IOnBattleComplete;

    /**
     * Opposing teams in the battle.
     */
    teams: IUnderEachTeam<ITeamDescriptor>;
}

/**
 * Common attributes for teams of Pokemon.
 */
export interface IBattleTeam extends ITeamBase, IEnemyTeam {
    /**
     * Pokemon that will fight.
     */
    actors: IPokemon[];

    /**
     * The currently selected Pokemon.
     */
    selectedActor: IPokemon;
}

/**
 * Information on an in-progress battle.
 */
export type IBattleInfo = IBattleInfoBase & IBattleOptions & IPokemonBattleOptions & {
    /**
     * How many times the player has failed to flee.
     */
    fleeAttempts: number;

    /**
     * Opposing teams in the battle.
     */
    teams: IUnderEachTeam<IBattleTeam>;
};

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Actions orderer used by this FullScreenPokemon instance.
     */
    public readonly actionsOrderer: ActionsOrderer<TGameStartr> = new ActionsOrderer(this.gameStarter);

    /**
     * Battle animations used by this FullScreenPokemon instance.
     */
    public readonly animations: Animations<TGameStartr> = new Animations(this.gameStarter);

    /**
     * Decoration handlers used by this FullScreenPokemon instance.
     */
    public readonly decorations: Decorations<TGameStartr> = new Decorations(this.gameStarter);

    /**
     * Battle action selectors used by this FullScreenPokemon instance.
     */
    public readonly selectors: Selectors<TGameStartr> = new Selectors(this.gameStarter);

    /**
     * Thing visual handlers used by this FullScreenPokemon instance.
     */
    public readonly things: Things<TGameStartr> = new Things(this.gameStarter);

    /**
     * Starts a new battle.
     *
     * @param partialBattleOptions   Options to start the battle.
     */
    public startBattle(partialBattleOptions: IPartialBattleOptions): void {
        const battleOptions: IBattleOptions = this.fillOutBattleOptions(partialBattleOptions);

        this.gameStarter.battleMover.startBattle(battleOptions);
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
    private fillOutBattleOptions(partialBattleOptions: IPartialBattleOptions): IBattleOptions {
        return this.gameStarter.utilities.proliferate(
            {
                fleeAttempts: 0,
                teams: {
                    player: {
                        actors: this.gameStarter.itemsHolder.getItem("PokemonInParty") as IPokemon[],
                        leader: {
                            nickname: this.gameStarter.itemsHolder.getItem("name"),
                            title: "Player".split("")
                        },
                        selector: "player"
                    },
                    opponent: {
                        actors: [],
                        selector: "opponent"
                    }
                },
                texts: this.gameStarter.constants.battles.texts.defaultBattleTexts,
                theme: "Battle Trainer"
            },
            partialBattleOptions);
    }
}
