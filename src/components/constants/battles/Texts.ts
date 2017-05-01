import { IUnderEachTeam } from "battlemovr/lib/Teams";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";

import { IBattleTeam } from "../../Battles";

/**
 * Texts for the player attempting to flee a battle.
 */
export interface IFleeTextGenerators {
    /**
     * Text for the player failing to flee a battle.
     */
    fail: () => string;

    /**
     * Text for the player succeeding in fleeing a battle.
     */
    success: () => string;
}

/**
 * Generates text for a Pokemon using a move.
 * 
 * @param team   Team controlling the Pokemon.
 * @param pokemon   Name of the Pokemon using the move.
 * @param move   Name of the move.
 * @returns Text for the Pokemon using the move.
 */
export interface IMoveTextGenerator {
    (team: IBattleTeam, pokemon: string, move: string): IMenuDialogRaw;
}

/**
 * 
 */
export interface IRetractTextGenerator {
    (team: IBattleTeam, pokemon: string): IMenuDialogRaw;
}

/**
 * 
 */
export interface ISendOutTextGenerator {
    (team: IBattleTeam, pokemon: string): IMenuDialogRaw;
}

/**
 * 
 */
export interface IVictoryTextGenerator {
    (victor: IBattleTeam, loser: IBattleTeam): IMenuDialogRaw;
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
 * 
 */
export interface ITextStartGenerator {
    (team: IBattleTeam): IMenuDialogRaw;
}

/**
 * 
 */
export interface IBattleOutcomeTextGenerator {
    (): IMenuDialogRaw;
}

/**
 * 
 */
export interface IBattleOutcomeTextGenerators {
    [i: number /* BattleOutcome */]: IBattleOutcomeTextGenerator;
}

/**
 * Optional texts to display in battle menus.
 */
export interface IPartialTextGenerators {
    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?: () => IMenuDialogRaw;

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
 * Battle text constants used by FullScreenPokemon instances.
 */
export class Texts {
    /**
     * Default options for battle texts.
     */
    public readonly defaultBattleTexts: IBattleTextGenerators = {
        flee: {
            fail: (): string => "Can't escape!",
            success: (): string => "Got away safely!"
        },
        outcomes: {},
        teams: {
            player: {
                move: (_team: IBattleTeam, pokemon: string, move: string): string => {
                    return `${pokemon} used ${move}!`;
                },
                retract: (_team: IBattleTeam, pokemon: string): string => {
                    return `${pokemon}, enough! Come back!`;
                },
                sendOut: (_team: IBattleTeam, pokemon: string): string => {
                    return `Go, ${pokemon}!`;
                }
            },
            opponent: {
                move: (_team: IBattleTeam, pokemon: string, move: string): string => {
                    return `ENEMY ${pokemon} used ${move}!`;
                },
                retract: (): string => "wat",
                sendOut: (team: IBattleTeam, pokemon: string): string => {
                    let text: string = ` sent out ${pokemon}!`;

                    if (team.leader) {
                        text = `${team.leader.nickname.join("")}${text}`;
                    }

                    return "ENEMY " + text;
                }
            }
        },
        start: (team: IBattleTeam): string => {
            return team.leader
                ? `${team.leader.nickname.join("")} wants to fight!`
                : `WILD ${team} appeared!`;
        }
    };
}
