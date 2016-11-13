/// <reference path="../typings/ChangeLinr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/EightBittr.d.ts" />
/// <reference path="../typings/AudioPlayr.d.ts" />
/// <reference path="../typings/FPSAnalyzr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/GroupHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MathDecidr.d.ts" />
/// <reference path="../typings/ModAttachr.d.ts" />
/// <reference path="../typings/NumberMakr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/QuadsKeepr.d.ts" />
/// <reference path="../typings/AreaSpawnr.d.ts" />
/// <reference path="../typings/PixelRendr.d.ts" />
/// <reference path="../typings/PixelDrawr.d.ts" />
/// <reference path="../typings/ScenePlayr.d.ts" />
/// <reference path="../typings/ThingHittr.d.ts" />
/// <reference path="../typings/TimeHandlr.d.ts" />
/// <reference path="../typings/TouchPassr.d.ts" />
/// <reference path="../typings/WorldSeedr.d.ts" />
/// <reference path="../typings/GameStartr.d.ts" />
/// <reference path="../typings/MenuGraphr.d.ts" />
declare namespace BattleMovr {
    /**
     * A driver for RPG-like battles between two collections of actors.
     */
    class BattleMovr implements IBattleMovr {
        /**
         * The IGameStartr providing Thing and actor information.
         */
        protected GameStarter: IGameStartr;
        /**
         * Names of known MenuGraphr menus.
         */
        protected menuNames: IMenuNames;
        /**
         * Option menus the player may select during battle.
         */
        protected battleOptions: IBattleOption[];
        /**
         * Default settings for running battles.
         */
        protected defaults: IBattleInfoDefaults;
        /**
         * Default positions of in-battle Things.
         */
        protected positions: IPositions;
        /**
         * Current settings for a running battle.
         */
        protected battleInfo: IBattleInfo;
        /**
         * All in-battle Things.
         */
        protected things: IThingsContainer;
        /**
         * The type of Thing to create and use as a background.
         */
        private backgroundType;
        /**
         * The created Thing used as a background.
         */
        private backgroundThing;
        /**
         * Whether a battle is currently happening.
         */
        private inBattle;
        /**
         * Initializes a new instance of the BattleMovr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IBattleMovrSettings);
        /**
         * @returns The IGameStartr providing Thing and actor information.
         */
        getGameStarter(): IGameStartr;
        /**
         * @returns Names of known MenuGraphr menus.
         */
        getMenuNames(): IMenuNames;
        /**
         * @returns Default settings for running battles.
         */
        getDefaults(): IBattleInfoDefaults;
        /**
         * @returns All in-battle Things.
         */
        getThings(): IThingsContainer;
        /**
         * @param name   A name of an in-battle Thing.
         * @returns The named in-battle Thing.
         */
        getThing(name: string): GameStartr.IThing;
        /**
         * @returns Current settings for a running battle.
         */
        getBattleInfo(): IBattleInfo;
        /**
         * @returns Whether a battle is currently happening.
         */
        getInBattle(): boolean;
        /**
         * @returns The type of Thing to create and use as a background.
         */
        getBackgroundType(): string;
        /**
         * @returns The created Thing used as a background.
         */
        getBackgroundThing(): GameStartr.IThing;
        /**
         * Starts a battle.
         *
         * @param settings   Settings for running the battle.
         */
        startBattle(settings: IBattleInfo): void;
        /**
         * Closes any current battle.
         *
         * @param callback   A callback to run after the battle is closed.
         * @remarks The callback will run after deleting menus but before the next cutscene.
         */
        closeBattle(callback?: () => void): void;
        /**
         * Shows the player menu.
         */
        showPlayerMenu(): void;
        /**
         * Creates and displays an in-battle Thing.
         *
         * @param name   The storage name of the Thing.
         * @param title   The Thing's in-game type.
         * @param settings   Any additional settings to create the Thing.
         * @returns The created Thing.
         */
        setThing(name: string, title: string, settings?: any): GameStartr.IThing;
        /**
         * Starts a round of battle with a player's move.
         *
         * @param choisePlayer   The player's move choice.
         */
        playMove(choicePlayer: string): void;
        /**
         * Switches a battler's actor.
         *
         * @param battlerName   The name of the battler.
         */
        switchActor(battlerName: "player" | "opponent", i: number): void;
        /**
         * Creates the battle background.
         *
         * @param type   A type of background, if not the default.
         */
        createBackground(type?: string): void;
        /**
         * Deletes the battle background.
         */
        deleteBackground(): void;
    }
    /**
     * Extended IGameStartr with menus.
     */
    interface IGameStartr extends GameStartr.GameStartr {
        /**
         * In-game menu and dialog creation and management for GameStartr.
         */
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }
    /**
     * Description of a menu available during battle.
     */
    interface IBattleOption {
        /**
         * A callback that opens the menu.
         */
        callback: () => void;
        /**
         * Text displayed in the options menu.
         */
        text: MenuGraphr.IMenuDialogRaw;
    }
    /**
     * Names of known MenuGraphr menus.
     */
    interface IMenuNames {
        /**
         * The primary backdrop battle menu.
         */
        battle: string;
        /**
         * The initial display when a battle starts.
         */
        battleDisplayInitial: string;
        /**
         * The player's options menu.
         */
        player: string;
        /**
         * General dialog text container.
         */
        generalText: string;
    }
    /**
     * Positions of in-battle Things, keyed by name.
     */
    interface IPositions {
        [i: string]: IPosition;
    }
    /**
     * Position of an in-battle Thing.
     */
    interface IPosition {
        /**
         * The Thing's left.
         */
        left?: number;
        /**
         * The Thing's top.
         */
        top?: number;
    }
    /**
     * A container for all in-battle Things.
     */
    interface IThingsContainer {
        /**
         * Any initial battle display menu.
         */
        menu?: GameStartr.IThing;
        [i: string]: GameStartr.IThing;
    }
    /**
     * Default settings for running a battle.
     */
    interface IBattleInfoDefaults {
        /**
         * A dialog to display after the battle.
         */
        exitDialog?: MenuGraphr.IMenuDialogRaw;
        /**
         * A next cutscene to play after the battle.
         */
        nextCutscene?: string;
        /**
         * Any settings for the next cutscene.
         */
        nextCutsceneSettings?: ScenePlayr.ICutsceneSettings;
        /**
         * A next routine to play in a next cutscene.
         */
        nextRoutine?: string;
        /**
         * Any settings for the next cutscene's routine.
         */
        nextRoutineSettings?: any;
        [i: string]: any;
    }
    /**
     * Settings for running a battle.
     */
    interface IBattleInfo extends IBattleInfoDefaults {
        /**
         * The players controlling battling actors.
         */
        battlers: IBattlers;
    }
    /**
     * In-battle players controlling battling actors.
     */
    interface IBattlers {
        /**
         * The opponent battler's information.
         */
        opponent?: IBattler;
        /**
         * The player's battle information.
         */
        player?: IBattler;
        [i: string]: IBattler;
    }
    /**
     * An in-battle player.
     */
    interface IBattler {
        /**
         * Actors that may be sent out to battle.
         */
        actors?: IActor[];
        /**
         * The game-specific category of fighter, such as "Trainer" or "Wild".
         */
        category: string;
        /**
         * Whether the player has actors, rather than fighting alone.
         */
        hasActors?: boolean;
        /**
         * The name of the player.
         */
        name: string[];
        /**
         * Which actor is currently selected to battle, if any.
         */
        selectedActor?: IActor;
        /**
         * The index of the currently selected actor, if any.
         */
        selectedIndex?: number;
        /**
         * A sprite name to send out to battle.
         */
        sprite: string;
    }
    /**
     * An actor that may be sent out in battle.
     */
    interface IActor {
        /**
         * Experience points for leveling up.
         */
        experience: IActorExperience;
        /**
         * The actor's current level.
         */
        level: number;
        /**
         * Moves the actor knows.
         */
        moves: IMove[];
        /**
         * The primary title of the actor.
         */
        title: string[];
    }
    /**
     * An actor's experience points for leveling up.
     */
    interface IActorExperience {
        /**
         * Current amount of experience points.
         */
        current: number;
        /**
         * How many experience points are needed for the next level.
         */
        next: number;
    }
    /**
     * An actor's knowledge of a battle move.
     */
    interface IMove {
        /**
         * The name of the battle move.
         */
        title: string;
        /**
         * How many uses are remaining.
         */
        remaining: number;
        /**
         * How many total uses of this move are allowed.
         */
        uses: number;
    }
    /**
     * Settings to initialize a new IBattleMovr instance.
     */
    interface IBattleMovrSettings {
        /**
         * The IGameStartr providing Thing and actor information.
         */
        GameStarter: IGameStartr;
        /**
         * Names of known MenuGraphr menus.
         */
        menuNames: IMenuNames;
        /**
         * Option menus the player may select during battle.
         */
        battleOptions: IBattleOption[];
        /**
         * Default settings for running battles.
         */
        defaults?: IBattleInfoDefaults;
        /**
         * Default positions of in-battle Things.
         */
        positions?: IPositions;
        /**
         * The type of Thing to create and use as a background.
         */
        backgroundType?: string;
    }
    /**
     * A driver for RPG-like battles between two collections of actors.
     */
    interface IBattleMovr {
        /**
         * @returns The IGameStartr providing Thing and actor information.
         */
        getGameStarter(): IGameStartr;
        /**
         * @returns Names of known MenuGraphr menus.
         */
        getMenuNames(): IMenuNames;
        /**
         * @returns Default settings for running battles.
         */
        getDefaults(): IBattleInfoDefaults;
        /**
         * @returns All in-battle Things.
         */
        getThings(): IThingsContainer;
        /**
         * @param name   A name of an in-battle Thing.
         * @returns The named in-battle Thing.
         */
        getThing(name: string): GameStartr.IThing;
        /**
         * @returns Current settings for a running battle.
         */
        getBattleInfo(): IBattleInfo;
        /**
         * @returns Whether a battle is currently happening.
         */
        getInBattle(): boolean;
        /**
         * @returns The type of Thing to create and use as a background.
         */
        getBackgroundType(): string;
        /**
         * @returns The created Thing used as a background.
         */
        getBackgroundThing(): GameStartr.IThing;
        /**
         * Starts a battle.
         *
         * @param settings   Settings for running the battle.
         */
        startBattle(settings: IBattleInfo): void;
        /**
         * Closes any current battle.
         *
         * @param callback   A callback to run after the battle is closed.
         * @remarks The callback will run after deleting menus but before the next cutscene.
         */
        closeBattle(callback?: () => void): void;
        /**
         * Shows the player menu.
         */
        showPlayerMenu(): void;
        /**
         * Creates and displays an in-battle Thing.
         *
         * @param name   The storage name of the Thing.
         * @param title   The Thing's in-game type.
         * @param settings   Any additional settings to create the Thing.
         * @returns The created Thing.
         */
        setThing(name: string, title: string, settings?: any): GameStartr.IThing;
        /**
         * Starts a round of battle with a player's move.
         *
         * @param choisePlayer   The player's move choice.
         */
        playMove(choicePlayer: string): void;
        /**
         * Switches a battler's actor.
         *
         * @param battlerName   The name of the battler.
         */
        switchActor(battlerName: "player" | "opponent", i: number): void;
        /**
         * Creates the battle background.
         *
         * @param type   A type of background, if not the default.
         */
        createBackground(type?: string): void;
        /**
         * Deletes the battle background.
         */
        deleteBackground(): void;
    }
}
declare var module: any;
