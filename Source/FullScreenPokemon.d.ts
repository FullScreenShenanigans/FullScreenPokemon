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
        scrollability: string;
        thingsById: {
            [i: string]: IThing;
        }
    }

    export interface IPlayer extends GameStartr.IThing {

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

    export interface IPreThing extends MapsCreatr.IPreThing {
        thing: IThing;
    }

    export interface IThing extends GameStartr.IThing {
        FSP: FullScreenPokemon;
        activate(activator: IThing, activated: IThing): void;
        areaName: string;
        bordering: IThing[];
        direction: Direction;
        id: string;
        keys: IPlayerKeys;
        getKeys(): IPlayerKeys;
        mapName: string;
        position: string;
        spawned: boolean; // part of the big MapsHandlr expansion to be added back
    }

    export interface ICharacter extends IThing {
        grass?: IThing;
        isMoving: boolean;
        onWalkingStart(character: ICharacter, direction: Direction): void;
        outerOk?: boolean;
        shadow?: IThing;
        shouldWalk: boolean;
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
        canKeyWalking: boolean;
        nextDirection?: Direction;
        turning?: Direction;
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