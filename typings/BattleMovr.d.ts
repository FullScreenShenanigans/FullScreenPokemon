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
         * The IGameStartr providing Thing and actor informtaion.
         */
        private GameStarter;
        /**
         *
         */
        private things;
        /**
         * The type of Thing to create and use as the background.
         */
        private backgroundType;
        /**
         *
         */
        private backgroundThing;
        /**
         *
         */
        private battleMenuName;
        /**
         *
         */
        private battleOptionNames;
        /**
         *
         */
        private menuNames;
        /**
         *
         */
        private battleInfo;
        /**
         *
         */
        private inBattle;
        /**
         *
         */
        private defaults;
        /**
         *
         */
        private positions;
        /**
         *
         */
        private openItemsMenuCallback;
        /**
         *
         */
        private openActorsMenuCallback;
        /**
         * @param {IBattleMovrSettings} settings
         */
        constructor(settings: IBattleMovrSettings);
        /**
         *
         */
        getGameStarter(): IGameStartr;
        /**
         *
         */
        getThings(): IThingsContainer;
        /**
         *
         */
        getThing(name: string): IThing;
        /**
         *
         */
        getBattleInfo(): IBattleInfo;
        /**
         *
         */
        getBackgroundType(): string;
        /**
         *
         */
        getBackgroundThing(): IThing;
        /**
         *
         */
        getInBattle(): boolean;
        /**
         *
         */
        startBattle(settings: IBattleSettings): void;
        /**
         *
         */
        closeBattle(callback?: () => void): void;
        /**
         *
         */
        showPlayerMenu(): void;
        /**
         *
         */
        setThing(name: string, title: string, settings?: any): IThing;
        /**
         *
         */
        openMovesMenu(): void;
        /**
         *
         */
        openItemsMenu(): void;
        /**
         *
         */
        openActorsMenu(callback: (settings: any) => void): void;
        /**
         *
         */
        playMove(choicePlayer: string): void;
        /**
         *
         */
        switchActor(battlerName: string, i: number): void;
        /**
         *
         */
        startBattleExit(): void;
        /**
         *
         */
        createBackground(): void;
        /**
         *
         */
        deleteBackground(): void;
    }
    interface IGameStartr extends GameStartr.GameStartr {
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }
    interface IPosition {
        left?: number;
        top?: number;
    }
    interface IThingsContainer {
        menu?: IThing;
        [i: string]: IThing;
    }
    interface IThing extends GameStartr.IThing {
        groupType: string;
    }
    interface IMenu extends IThing {
    }
    interface IBattleSettings {
        nextCutscene: string;
        nextCutsceneSettings: string;
    }
    interface IBattleInfo {
        exitDialog?: string;
        items?: any;
        nextCutscene?: string;
        nextCutsceneSettings?: any;
        nextRoutine?: string;
        nextRoutineSettings?: any;
        opponent?: IBattleThingInfo;
        player?: IBattleThingInfo;
    }
    interface IBattleInfoDefaults {
        exitDialog: string;
    }
    interface IBattleThingInfo {
        actors: IActor[];
        category: string;
        hasActors?: boolean;
        name: string[];
        selectedActor?: IActor;
        selectedIndex?: number;
        sprite: string;
    }
    interface IActor {
        Attack: number;
        AttackNormal: number;
        Defense: number;
        DefenseNormal: number;
        EV: {
            Attack: number;
            Defense: number;
            Special: number;
            Speed: number;
        };
        HP: number;
        HPNormal: number;
        IV: {
            Attack: number;
            Defense: number;
            HP: number;
            Special: number;
            Speed: number;
        };
        Special: number;
        SpecialNormal: number;
        Speed: number;
        SpeedNormal: number;
        experience: IActorExperience;
        level: number;
        moves: IMove[];
        nickname: string[];
        status: string;
        title: string[];
        types: string[];
    }
    interface IActorExperience {
        current: number;
        next: number;
        remaining: number;
    }
    interface IMove {
        title: string;
        remaining: number;
    }
    interface IBattleMovrSettings {
        GameStarter: IGameStartr;
        battleMenuName: string;
        battleOptionNames: string;
        menuNames: string;
        openItemsMenuCallback: (settings: any) => void;
        openActorsMenuCallback: (settings: any) => void;
        defaults?: any;
        backgroundType?: string;
        positions?: any;
    }
    /**
     * A driver for RPG-like battles between two collections of actors.
     */
    interface IBattleMovr {
        getGameStarter(): IGameStartr;
        getThings(): {
            [i: string]: IThing;
        };
        getThing(name: string): IThing;
        getBattleInfo(): IBattleInfo;
        getBackgroundType(): string;
        getBackgroundThing(): IThing;
        getInBattle(): boolean;
        startBattle(settings: IBattleSettings): void;
        closeBattle(callback?: () => void): void;
        showPlayerMenu(): void;
        setThing(name: string, title: string, settings?: any): IThing;
        openMovesMenu(): void;
        openItemsMenu(): void;
        openActorsMenu(callback: (settings: any) => void): void;
        playMove(choicePlayer: string): void;
        switchActor(battlerName: string, i: number): void;
        startBattleExit(): void;
        createBackground(): void;
        deleteBackground(): void;
    }
}
declare var module: any;
