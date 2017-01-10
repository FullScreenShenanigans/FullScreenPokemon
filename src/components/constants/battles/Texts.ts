import { IUnderEachTeam } from "battlemovr/lib/Teams";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";

/**
 * Texts a team uses in battle.
 */
export interface ITeamsTexts {
    /**
     * Text for a Pokemon using a move.
     */
    move: [string, string, string];

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
        teams: {
            player: {
                move: ["", " used ", "!"],
                sendOut: ["", "Go! ", "!"]
            },
            opponent: {
                move: ["ENEMY ", " used ", "!"],
                sendOut: ["", " sent out ", "!"]
            }
        },
        start: ["", " wants to fight!"]
    };
};
