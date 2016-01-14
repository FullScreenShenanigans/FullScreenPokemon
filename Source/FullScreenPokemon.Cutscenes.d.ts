declare module FullScreenPokemon {
    export interface IBattleTransitionSettings {
        /**
         * In-game state and settings for the upcoming battle.
         */
        battleInfo?: IBattleInfo;

        /**
         * A callback for when the transition completes.
         */
        callback?: () => void;
    }

    /**
     * Settings for the TransitionLineSpiral battle animation routine.
     */
    export interface ITransitionLineSpiralSettings extends IBattleTransitionSettings {
        /**
         * How large the lines should be in units (by default, 15).
         */
        divisor?: number;
    }

    /**
     * Settings for the TransitionFlash battle animation routine.
     */
    export interface ITransitionFlashSettings extends IBattleTransitionSettings {
        /**
         * How much to change opacity each tick (by default, .33).
         */
        change?: number;

        /**
         * How many flashes in total (by default, 6).
         */
        flashes?: number;

        /**
         * The ordered flash colors (by default, ["Black", "White"]).
         */
        flashColors?: string[];

        /**
         * How many upkeeps between change ticks (by default, 1).
         */
        speed?: number;
    }

    /**
     * Settings for the Battle cutscene routines.
     */
    export interface IBattleCutsceneSettings {
        /**
         * In-game state and settings for the ongoing battle.
         */
        battleInfo: IBattleInfo;

        /**
         * The left position of the in-game opponent Thing.
         */
        opponentLeft?: number;

        /**
         * The top position of the in-game opponent Thing.
         */
        opponentTop?: number;

        /**
         * Things used in the battle, stored by id.
         */
        things: IBattleThingsById;
    }

    /**
     * Settings for a typical routine in the Battle cutscene.
     */
    export interface IBattleRoutineSettings {
        /**
         * A callback for when the routine is done, if applicable.
         */
        callback?: (...args: any[]) => void;

        /**
         * A name of a routine to play when this is done, if applicable.
         */
        nextRoutine?: string;
    }

    /**
     * Settings for a typical move-based routine in the Battle cutscene.
     */
    export interface IBattleMoveRoutineSettings extends IBattleRoutineSettings {
        /**
         * The name of the attacking battler, as "player" or "opponent".
         */
        attackerName?: string;

        /**
         * A callback for when the move is done.
         */
        callback?: () => void;

        /**
         * The move chosen by the user.
         */
        choiceOpponent?: string;

        /**
         * The move chosen by the user.
         */
        choicePlayer?: string;

        /**
         * How much damage will be done by the move.
         */
        damage?: number;

        /**
         * The name of the attacking battler, as "player" or "opponent".
         */
        defenderName?: string;

        /**
         * Whether the opponent has already moved this round.
         */
        moveOpponentDone?: boolean;

        /**
         * Whether the user has already moved this round.
         */
        movePlayerDone?: boolean;
    }

    /**
     * Settings for a typical action-based routine in the Battle cutscene.
     */
    export interface IBattleActionRoutineSettings extends IBattleRoutineSettings {
        /**
         * Which battler this animation applies to.
         */
        battlerName?: string;

        /**
         * How much damage this will do, if applicable.
         */
        damage?: number;
    }

    /**
     * Settings for a typical level-based routine in the Battle cutscene.
     */
    export interface IBattleLevelRoutineSettings extends IBattleRoutineSettings {
        /**
         * How many experience points were gained, if applicable.
         */
        experienceGained?: number;
    }

    /**
     * Settings for an attacking move in battle.
     */
    export interface IBattleAttackRoutineSettings extends IBattleRoutineSettings {
        /**
         * The attacking battler's name, as "player" or "opponent".
         */
        attackerName?: string;

        /**
         * The defending battler's name, as "player" or "opponent".
         */
        defenderName?: string;
    }

    /**
     * Settings for changing a defender's statistic in battle.
     */
    export interface IBattleStatisticRoutineSettings extends IBattleAttackRoutineSettings {
        /**
         * How much to change the statistic.
         */
        amount?: number;

        /**
         * The name of the targeted statistic.
         */
        statistic?: string;
    }
}
