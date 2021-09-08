import { BattleOutcome, UnderEachTeam } from "battlemovr";
import { MenuDialogRaw } from "menugraphr";

import { BattleTeam } from "../../Battles";

/**
 * Texts for the player attempting to flee a battle.
 */
export interface FleeTextGenerators {
    /**
     * Text for the player failing to flee a battle.
     */
    fail(): string;

    /**
     * Text for the player succeeding in fleeing a battle.
     */
    success(): string;
}

/**
 * Generates text for a Pokemon using a move.
 *
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon using the move.
 * @param move   Name of the move.
 * @returns Text for the Pokemon using the move.
 */
export type MoveTextGenerator = (
    team: BattleTeam,
    pokemon: string,
    move: string
) => MenuDialogRaw;

/**
 * Generates text for a Pokemon being retracted.
 *
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon being retracted.
 * @returns Text for the Pokemon being retracted.
 */
export type RetractTextGenerator = (team: BattleTeam, pokemon: string) => MenuDialogRaw;

/**
 * Generates text for a Pokemon being sent out.
 *
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon being sent out.
 * @returns Text for the Pokemon being sent out.
 */
export type SendOutTextGenerator = (team: BattleTeam, pokemon: string) => MenuDialogRaw;

/**
 * Generates text for a team winning a battle.
 *
 * @param victor   Winning team.
 * @param loser   Losing team.
 * @returns Text for the victor winning a battle.
 */
export type VictoryTextGenerator = (victor: BattleTeam, loser: BattleTeam) => MenuDialogRaw;

/**
 * Generates text for a battle starting.
 *
 * @param team   Team starting a battle.
 * @returns Text for the team starting a battle.
 */
export type TextStartGenerator = (team: BattleTeam) => MenuDialogRaw;

/**
 * Generates text for a battle concluding.
 *
 * @param outcome   Why the battle finished.
 * @returns Text for the battle concluding.
 */
export type BattleOutcomeTextGenerator = (outcome: BattleOutcome) => MenuDialogRaw;

/**
 * Generators for a battle concluding, keyed by outcome descriptor.
 */
export interface BattleOutcomeTextGenerators {
    [i: number /* BattleOutcome */]: BattleOutcomeTextGenerator;
}

/**
 * Texts a team uses in battle.
 */
export interface TeamsTexts {
    /**
     * Text for a Pokemon using a move.
     */
    move: MoveTextGenerator;

    /**
     * Text for a trainer retracting a Pokemon.
     */
    retract: RetractTextGenerator;

    /**
     * Text for a trainer sending out a Pokemon.
     */
    sendOut: SendOutTextGenerator;
}
/**
 * Optional texts to display in battle menus.
 */
export interface PartialTextGenerators {
    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?(): MenuDialogRaw;

    /**
     * Texts for the player attempting to flee the battle.
     */
    flee?: Partial<FleeTextGenerators>;

    /**
     * Text generators for the outcome of the battle.
     */
    outcomes?: BattleOutcomeTextGenerators;

    /**
     * Text for when the battle starts. The opponent's name is between the strings.
     */
    start?: Partial<TextStartGenerator>;

    /**
     * Texts specific to each team.
     */
    teams?: UnderEachTeam<Partial<TeamsTexts>>;
}

/**
 * Texts to display in battle menus.
 */
export interface BattleTextGenerators extends PartialTextGenerators {
    /**
     * Texts for the player attempting to flee the battle.
     */
    flee: FleeTextGenerators;

    /**
     * Text generators for the outcome of the battle.
     */
    outcomes: BattleOutcomeTextGenerators;

    /**
     * Text for when the battle starts. The opponent's name is between the strings.
     */
    start: TextStartGenerator;

    /**
     * Texts specific to each team.
     */
    teams: UnderEachTeam<TeamsTexts>;

    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?(): MenuDialogRaw;
}

/**
 * Battle text generators.
 */
export class Texts {
    /**
     * Default options for battle texts.
     */
    public readonly defaultBattleTexts: BattleTextGenerators = {
        flee: {
            fail: (): string => "Can't escape!",
            success: (): string => "Got away safely!",
        },
        outcomes: {},
        teams: {
            player: {
                move: (_team: BattleTeam, pokemon: string, move: string): string =>
                    `${pokemon} used ${move}!`,
                retract: (_team: BattleTeam, pokemon: string): string =>
                    `${pokemon}, enough! Come back!`,
                sendOut: (_team: BattleTeam, pokemon: string): string => `Go, ${pokemon}!`,
            },
            opponent: {
                move: (_team: BattleTeam, pokemon: string, move: string): string =>
                    `ENEMY ${pokemon} used ${move}!`,
                retract: (): string => "wat",
                sendOut: (team: BattleTeam, pokemon: string): string => {
                    let text = ` sent out ${pokemon}!`;

                    if (team.leader) {
                        text = `${team.leader.nickname.join("")}${text}`;
                    }

                    return "ENEMY " + text;
                },
            },
        },
        start: (team: BattleTeam): string =>
            team.leader
                ? `${team.leader.nickname.join("")} wants to fight!`
                : `WILD ${team.actors[0].title.join("")} appeared!`,
    };
}
