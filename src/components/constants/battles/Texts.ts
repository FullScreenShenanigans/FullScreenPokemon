import { IUnderEachTeam } from "battlemovr/lib/Teams";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";

/**
 * Texts for the player attempting to flee a battle.
 */
export interface IFleeTexts {
    /**
     * Text for the player failing to flee a battle.
     */
    fail: string;

    /**
     * Text for the player succeeding in fleeing a battle.
     */
    success: string;
}

/**
 * Texts a team uses in battle.
 */
export interface ITeamsTexts {
    /**
     * Text for a Pokemon using a move.
     */
    move: [string, string, string];

    /**
     * Text for a trainer retracting a Pokemon.
     */
    retract: [string, string, string];

    /**
     * Text for a trainer sending out a Pokemon.
     */
    sendOut: [string, string, string];

    /**
     * Text to display upon victory.
     */
    victory?: IMenuDialogRaw;
}

/**
 * Texts to display in battle menus.
 */
export interface IBattleTexts {
    /**
     * Text to display after a battle victory when in the real world again.
     */
    afterBattle?: IMenuDialogRaw;

    /**
     * Texts for the player attempting to flee the battle.
     */
    flee: IFleeTexts;

    /**
     * Text for when the battle starts. The opponent's name is between the strings.
     */
    start: [string, string];

    /**
     * Texts specific to each team.
     */
    teams: IUnderEachTeam<ITeamsTexts>;
}

/**
 * Battle text constants used by FullScreenPokemon instances.
 */
export class Texts {
    /**
     * Default options for battle texts.
     */
    public readonly defaultBattleTexts: IBattleTexts = {
        flee: {
            fail: "Can't escape!",
            success: "Got away safely!"
        },
        teams: {
            player: {
                move: ["", " used ", "!"],
                retract: ["", "", " enough! Come back!"],
                sendOut: ["", "Go! ", "!"]
            },
            opponent: {
                move: ["ENEMY ", " used ", "!"],
                retract: ["", "", " enough! Come back!"],
                sendOut: ["", " sent out ", "!"]
            }
        },
        start: ["", " wants to fight!"]
    };
};
