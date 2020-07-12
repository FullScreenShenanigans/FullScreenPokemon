import { BattleOutcome, IUnderEachTeam } from "battlemovr";
import { IMenuDialogRaw } from "menugraphr";

import { IBattleTeam } from "../../Battles";

/**
 * Texts for the player attempting to flee a battle.
 */
export interface IFleeTextGenerators {
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
export type IMoveTextGenerator = (
    team: IBattleTeam,
    pokemon: string,
    move: string
) => IMenuDialogRaw;

/**
 * Generates text for a Pokemon being retracted.
 *
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon being retracted.
 * @returns Text for the Pokemon being retracted.
 */
export type IRetractTextGenerator = (team: IBattleTeam, pokemon: string) => IMenuDialogRaw;

/**
 * Generates text for a Pokemon being sent out.
 *
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon being sent out.
 * @returns Text for the Pokemon being sent out.
 */
export type ISendOutTextGenerator = (team: IBattleTeam, pokemon: string) => IMenuDialogRaw;

/**
 * Generates text for a team winning a battle.
 *
 * @param victor   Winning team.
 * @param loser   Losing team.
 * @returns Text for the victor winning a battle.
 */
export type IVictoryTextGenerator = (victor: IBattleTeam, loser: IBattleTeam) => IMenuDialogRaw;

/**
 * Generates text for a battle starting.
 *
 * @param team   Team starting a battle.
 * @returns Text for the team starting a battle.
 */
export type ITextStartGenerator = (team: IBattleTeam) => IMenuDialogRaw;

/**
 * Generates text for a battle concluding.
 *
 * @param outcome   Why the battle finished.
 * @returns Text for the battle concluding.
 */
export type IBattleOutcomeTextGenerator = (outcome: BattleOutcome) => IMenuDialogRaw;

/**
 * Generators for a battle concluding, keyed by outcome descriptor.
 */
export interface IBattleOutcomeTextGenerators {
    [i: number /* BattleOutcome */]: IBattleOutcomeTextGenerator;
}

/**
 * Texts a team uses in battle.
 */
export interface ITeamsTexts {
    /**
     * Text for a Pokemon using a move.
     */
    move: IMoveTextGenerator;

    /**
     * Text for a trainer retracting a Pokemon.
     */
    retract: IRetractTextGenerator;

    /**
     * Text for a trainer sending out a Pokemon.
     */
    sendOut: ISendOutTextGenerator;
}
/**
 * Optional texts to display in battle menus.
 */
export interface IPartialTextGenerators {
    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?(): IMenuDialogRaw;

    /**
     * Texts for the player attempting to flee the battle.
     */
    flee?: Partial<IFleeTextGenerators>;

    /**
     * Text generators for the outcome of the battle.
     */
    outcomes?: IBattleOutcomeTextGenerators;

    /**
     * Text for when the battle starts. The opponent's name is between the strings.
     */
    start?: Partial<ITextStartGenerator>;

    /**
     * Texts specific to each team.
     */
    teams?: IUnderEachTeam<Partial<ITeamsTexts>>;
}

/**
 * Texts to display in battle menus.
 */
export interface IBattleTextGenerators extends IPartialTextGenerators {
    /**
     * Texts for the player attempting to flee the battle.
     */
    flee: IFleeTextGenerators;

    /**
     * Text generators for the outcome of the battle.
     */
    outcomes: IBattleOutcomeTextGenerators;

    /**
     * Text for when the battle starts. The opponent's name is between the strings.
     */
    start: ITextStartGenerator;

    /**
     * Texts specific to each team.
     */
    teams: IUnderEachTeam<ITeamsTexts>;

    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?(): IMenuDialogRaw;
}

/**
 * Battle text generators.
 */
export class Texts {
    /**
     * Default options for battle texts.
     */
    public readonly defaultBattleTexts: IBattleTextGenerators = {
        flee: {
            fail: (): string => "Can't escape!",
            success: (): string => "Got away safely!",
        },
        outcomes: {},
        teams: {
            player: {
                move: (_team: IBattleTeam, pokemon: string, move: string): string =>
                    `${pokemon} used ${move}!`,
                retract: (_team: IBattleTeam, pokemon: string): string =>
                    `${pokemon}, enough! Come back!`,
                sendOut: (_team: IBattleTeam, pokemon: string): string => `Go, ${pokemon}!`,
            },
            opponent: {
                move: (_team: IBattleTeam, pokemon: string, move: string): string =>
                    `ENEMY ${pokemon} used ${move}!`,
                retract: (): string => "wat",
                sendOut: (team: IBattleTeam, pokemon: string): string => {
                    let text = ` sent out ${pokemon}!`;

                    if (team.leader) {
                        text = `${team.leader.nickname.join("")}${text}`;
                    }

                    return "ENEMY " + text;
                },
            },
        },
        start: (team: IBattleTeam): string =>
            team.leader
                ? `${team.leader.nickname.join("")} wants to fight!`
                : `WILD ${team.actors[0].title.join("")} appeared!`,
    };
}
