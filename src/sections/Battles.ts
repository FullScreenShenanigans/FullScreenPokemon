import { member } from "babyioc";
import {
    Actor as BattleMovrActor,
    BattleInfo as BattleInfoBase,
    OnBattleComplete,
    Statistic,
    Statistics,
    TeamBase,
    TeamDescriptor,
    UnderEachTeam,
    TeamId,
} from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { ActionsOrderer } from "./battles/ActionsOrderer";
import { Animations } from "./battles/Animations";
import { Decorations } from "./battles/Decorations";
import { Selectors } from "./battles/Selectors";
import { Status } from "./battles/Statuses";
import { Actors } from "./battles/Actors";
import { BattleTextGenerators, PartialTextGenerators } from "./constants/battles/Texts";
import { Menu } from "./Menus";
import { StateSaveable } from "./Saves";
import { Actor } from "./Actors";

/**
 * Party Pokemon that can participate in battles.
 */
export interface Pokemon extends BattleMovrActor, StateSaveable {
    /**
     * How many experience points the actor has.
     */
    experience: number;

    /**
     * Power level the actor is.
     */
    level: number;

    /**
     * Accumulated effort value points.
     */
    ev: ValuePoints;

    /**
     * Item held by the actor.
     */
    item?: string[];

    /**
     * Accumulated individual value points.
     */
    iv: ValuePoints;

    /**
     * How likely a critical hit is from this Pokemon.
     */
    raisedCriticalHitProbability?: boolean;

    /**
     * Battle attribute statistics.
     */
    statistics: PokemonStatistics;

    /**
     * Any current status effect.
     */
    status?: Status;

    /**
     * What types this Pokemon is, such as "Water".
     */
    types: string[];
}

/**
 * Effort or individual value points for a Pokemon.
 */
export interface ValuePoints {
    /**
     * Attack value points.
     */
    attack: number;

    /**
     * Defense value points.
     */
    defense: number;

    /**
     * Health value points.
     */
    health: number;

    /**
     * Special value points.
     */
    special: number;

    /**
     * Speed value points.
     */
    speed: number;
}

/**
 * Statistics for a Pokemon.
 */
export interface PokemonStatistics extends Statistics {
    /**
     * The Pokemon's attack.
     */
    attack: Statistic;

    /**
     * The pokemon's defense.
     */
    defense: Statistic;

    /**
     * The Pokemon's special.
     */
    special: Statistic;

    /**
     * The Pokemon's speed.
     */
    speed: Statistic;
}

/**
 * An enemy team attacking the player.
 */
export interface EnemyTeam extends TeamDescriptor {
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
 * Actors displayed in a battle.
 */
export interface BattleActors extends UnderEachTeam<Actor> {
    /**
     * Solid background color behind everyactor.
     */
    background: Actor;

    /**
     * Menu surrounding the battle area.
     */
    menu: Menu;
}

/**
 * Battle options specific to FullScreenPokemon.
 */
export interface PokemonBattleOptions {
    /**
     * Texts to display in menus.
     */
    texts: BattleTextGenerators;

    /**
     * Audio theme to play during the battle.
     */
    theme: string;

    /**
     * Actors displayed in the battle.
     */
    actors: BattleActors;
}

/**
 * Minimum options to start a new battle.
 */
export interface PartialBattleOptions {
    /**
     * Whether the battle should advance its menus automatically.
     */
    automaticMenus?: boolean;

    /**
     * Actors that should be visible above the starting animation.
     */
    keptActors?: Actor[];

    /**
     * Callback for when the battle is complete.
     */
    onComplete?: OnBattleComplete;

    /**
     * Transition name to start with, if not a random one.
     */
    startTransition?: string;

    /**
     * Opposing teams in the battle.
     */
    teams?: Partial<UnderEachTeam<Partial<TeamDescriptor>>> & {
        opponent?: Partial<EnemyTeam>;
    };

    /**
     * Texts to display in menus.
     */
    texts?: Partial<PartialTextGenerators>;

    /**
     * Audio theme to be played after the battle is done.
     */
    endingtheme?: string;
}

/**
 * Complete options to start a new battle.
 */
export interface BattleOptions extends PartialBattleOptions {
    /**
     * Callback for when the battle is complete.
     */
    onComplete: OnBattleComplete;

    /**
     * Opposing teams in the battle.
     */
    teams: UnderEachTeam<TeamDescriptor>;
}

/**
 * Common attributes for teams of Pokemon.
 */
export interface BattleTeam extends TeamBase, EnemyTeam {
    /**
     * Pokemon that will fight.
     */
    actors: Pokemon[];

    /**
     * The currently selected Pokemon.
     */
    selectedActor: Pokemon;
}

/**
 * Information on an in-progress battle.
 */
export type BattleInfo = BattleInfoBase &
    BattleOptions &
    PokemonBattleOptions & {
        /**
         * How many times the player has failed to flee.
         */
        fleeAttempts: number;

        /**
         * Opposing teams in the battle.
         */
        teams: UnderEachTeam<BattleTeam>;
    };

/**
 * BattleMovr hooks to run trainer battles.
 */
export class Battles extends Section<FullScreenPokemon> {
    /**
     * Orders chosen actions by priority and/or speed.
     */
    @member(ActionsOrderer)
    public readonly actionsOrderer: ActionsOrderer;

    /**
     * Animations for battle events.
     */
    @member(Animations)
    public readonly animations: Animations;

    /**
     * Places decorative in-battle Actors.
     */
    @member(Decorations)
    public readonly decorations: Decorations;

    /**
     * Selects actions for each team.
     */
    @member(Selectors)
    public readonly selectors: Selectors;

    /**
     * Sets Actors visually representing each team.
     */
    @member(Actors)
    public readonly actors: Actors;

    /**
     * Starts a new battle.
     *
     * @param partialBattleOptions   Options to start the battle.
     */
    public startBattle(partialBattleOptions: PartialBattleOptions): void {
        const battleOptions: BattleOptions = this.fillOutBattleOptions(partialBattleOptions);

        this.game.battleMover.startBattle(battleOptions);
    }

    /**
     * Heals a Pokemon back to full health.
     *
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: Pokemon): void {
        for (const statisticName of this.game.constants.pokemon.statisticNames) {
            pokemon.statistics[statisticName].current = pokemon.statistics[statisticName].normal;
        }

        for (const move of pokemon.moves) {
            move.remaining = this.game.constants.moves.byName[move.title].PP;
        }

        pokemon.status = undefined;
    }

    /**
     * Tests to see if all party Pokemon have fainted.
     *
     * @returns Whether a player's party is wiped.
     */
    public isPartyWiped(): boolean {
        for (const chosenPokemon of this.game.itemsHolder.getItem(
            this.game.storage.names.pokemonInParty
        )) {
            if (chosenPokemon.statistics.health.current !== 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Heals party back to full health.
     */
    public healParty(): void {
        for (const pokemon of this.game.itemsHolder.getItem(
            this.game.storage.names.pokemonInParty
        )) {
            this.game.battles.healPokemon(pokemon);
        }
    }

    /**
     * Checks whether a team is allowed to flee (not facing a trainer).
     *
     * @param teamId   A team in battle.
     * @returns Whether the team can flee.
     */
    public canTeamAttemptFlee(teamId: TeamId): boolean {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;
        return !(teamId === TeamId.opponent ? battleInfo.teams.player : battleInfo.teams.opponent)
            .leader;
    }

    /**
     * Fills in default values for battle options.
     *
     * @param partialBattleOptions   Partial options to start a battle.
     * @returns Completed options to start a battle.
     */
    private fillOutBattleOptions(partialBattleOptions: PartialBattleOptions): BattleOptions {
        const texts: BattleTextGenerators = this.game.utilities.proliferate(
            {},
            {
                ...this.game.constants.battles.texts.defaultBattleTexts,
                ...partialBattleOptions.texts,
            }
        );

        const teams: UnderEachTeam<TeamDescriptor> = {
            opponent: {
                actors: [],
                selector: "opponent",
            },
            player: {
                actors: this.game.itemsHolder.getItem(this.game.storage.names.pokemonInParty),
                leader: {
                    nickname: this.game.itemsHolder.getItem(this.game.storage.names.name),
                    title: "PlayerBack".split(""),
                },
                selector: "player",
            },
        };

        if (partialBattleOptions.teams) {
            if (partialBattleOptions.teams.opponent) {
                teams.opponent = {
                    ...teams.opponent,
                    ...partialBattleOptions.teams.opponent,
                } as TeamDescriptor;
            }

            if (partialBattleOptions.teams.player) {
                teams.player = {
                    ...teams.player,
                    ...partialBattleOptions.teams.player,
                };
            }
        }

        if (partialBattleOptions.endingtheme === undefined) {
            partialBattleOptions.endingtheme = this.game.mapScreener.theme;
        }

        return {
            ...partialBattleOptions,
            fleeAttempts: 0,
            teams,
            texts,
            theme: "Battle Trainer",
        } as BattleOptions;
    }
}
