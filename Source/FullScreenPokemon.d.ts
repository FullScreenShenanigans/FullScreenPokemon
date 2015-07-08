// Module exists in libgme.js
declare var Module: GBSEmulatr.IModule;

declare module FullScreenPokemon {
    enum Direction {
        Top = 0,
        Right = 1,
        Bottom = 2,
        Left = 3
    }

    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        blockInputs: boolean;
        scrollability: string;
        thingsById: {
            [i: string]: IThing;
        }
    }

    export interface IFullScreenPokemonStoredSettings extends GameStartr.IGameStartrStoredSettings {
        battles: IBattleMovrCustoms;
        menus: IMenuGraphrCustoms;
        states: IStateHoldrCustoms;
    }

    export interface IBattleMovrCustoms extends GameStartr.IGameStartrCustomsObject {
        GameStarter: GameStartr.IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }

    export interface IMenuGraphrCustoms extends GameStartr.IGameStartrCustomsObject {
        GameStarter: GameStartr.IGameStartr;
    }

    export interface IStateHoldrCustoms extends GameStartr.IGameStartrCustomsObject {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
    }

    export interface ISaveFile {
        [i: string]: any;
    }

    export interface IMap extends MapsCreatr.IMapsCreatrMap { }

    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        wildPokemon: IAreaWildPokemonOptionGroups;
    }

    export interface IAreaWildPokemonOptionGroups {
        grass?: IAreaWildPokemonOptionGroup;
        [i: string]: IAreaWildPokemonOptionGroup;
    }

    export interface IAreaWildPokemonOptionGroup {

    }

    export interface IPokemonSchema {
        title: string;
    }

    export interface IPokemon {

    }

    export interface IDialog {
        cutscene?: string;
        options?: IDialogOptions;
        words: string;
    }

    export interface IDialogOptions {
        Yes: string | IDialog;
        No: string | IDialog;
    }

    export interface IPreThing extends MapsCreatr.IPreThing {
        thing: IThing;
    }

    export interface IThing extends GameStartr.IThing {
        FSP: FullScreenPokemon;
        activate(activator: IThing, activated: IThing): void;
        areaName: string;
        bordering: IThing[];
        cycles?: any;
        direction: Direction;
        flickering?: boolean;
        id: string;
        mapName: string;
        offsetX?: number;
        offsetY?: number;
        position: string;
        spawned: boolean; // part of the big MapsHandlr expansion to be added back
        tolBottom: number;
        tolLeft: number;
        tolRight: number;
        tolTop: number;
    }

    export interface ICharacter extends IThing {
        active?: boolean;
        destination: number;
        dialog?: string | string[];
        dialogNext?: string | string[];
        dialogOptions?: IDialogOptions;
        directionPreferred?: Direction;
        distance: number;
        follower?: ICharacter;
        following?: ICharacter;
        followingLoop?: TimeHandlr.IEvent;
        gift?: string;
        grass?: IThing;
        isMoving: boolean;
        ledge?: IThing;
        onWalkingStart(character: ICharacter, direction: Direction): void;
        onWalkingStop(character: ICharacter, onStop: any[]): void;
        outerOk?: boolean;
        player?: boolean;
        pushDirection?: Direction;
        pushSteps?: any[];
        roamingDirections?: Direction[];
        sight?: boolean;
        sightDetector?: ICharacter;
        shadow?: IThing;
        shouldWalk: boolean;
        speed: number;
        speedOld?: number;
        talking?: boolean;
        trainer?: boolean;
        transport?: any;
        turning?: Direction;
        walkingCommands?: Direction[];
        walkingFlipping?: TimeHandlr.IEvent;
    }

    export interface IEnemy extends ICharacter {
        actors: IPokemonSchema[];
        badge?: string;
        battleName?: string;
        battleSprite?: string;
        giftAfterBattle?: string;
        nextCutscene?: string;
        reward: number;
        textDefeat?: string;
        textAfterBattle?: string;
        textVictory?: string;
    }

    export interface IPlayer extends ICharacter {
        allowDirectionAsKeys?: boolean;
        canKeyWalking: boolean;
        getKeys(): IPlayerKeys;
        keys: IPlayerKeys;
        nextDirection?: Direction;
    }

    export interface IGrass extends IThing {

    }

    export interface IPlayerKeys {
        a: boolean;
        b: boolean;
        [i: number]: boolean; // Array-style usage, for direction numbers
    }

    export interface IFullScreenPokemonSettings {

    }

    export interface IFullScreenPokemon {

    }
}