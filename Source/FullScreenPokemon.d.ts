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
        boundaries: IAreaBoundaries;
        cutscene?: string;
        playerDirection: Direction;
        scrollability: string;
        theme?: string;
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

    export interface IPokedexListing {
        caught: boolean;
        height: string[]; // ["feet", "inches"] (e.x. ["1", "8"])
        seen: boolean;
        title: string;
        label: string;
        index: number;
        sprite: string;
        info: string[];
        evolvesInto: string;
        evolvesVia: number;
        weight: number;
        types: string[];
        HP: number;
        Attack: number;
        Defense: number;
        Special: number;
        Speed: number;
        moves: IPokedexMovesListing;
    }

    export interface IPokedexMovesListing {
        natural: IPokedexMove[];
        hm: IPokedexMove;
        tm: IPokedexMove;
    }

    export interface IPokedexMove {
        move: string;
        level?: number;
    }

    export interface ISaveFile {
        [i: string]: any;
    }

    export interface IMap extends MapsCreatr.IMapsCreatrMap {
        areas: {
            [i: string]: IArea;
            [i: number]: IArea;
        };
        locationDefault?: string;
        seed?: number;
        theme?: string;
        name: string;
    }

    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        background: string;
        boundaries: IAreaBoundaries;
        height: number;
        map: IMap;
        spawned: boolean;
        spawnedBy: IAreaSpawnedBy;
        theme?: string
        width: number;
        wildPokemon: IAreaWildPokemonOptionGroups;
    }

    export interface IAreaBoundaries {
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
    }

    export interface IAreaSpawnedBy {
        name: string;
        timestamp: number;
    }

    export interface IAreaWildPokemonOptionGroups {
        grass?: IAreaWildPokemonOptionGroup;
        [i: string]: IAreaWildPokemonOptionGroup;
    }

    export interface IAreaWildPokemonOptionGroup {

    }

    export interface ILocation extends MapsCreatr.IMapsCreatrLocation {
        area: IArea;
        cutscene?: string;
        direction?: Direction;
        push?: boolean;
        routine?: string;
        theme?: string;
        xloc?: number;
        yloc?: number;
    }

    export interface IPokemonSchema {
        title: string;
        level: number;
        levels?: number[];
        moves?: string[];
    }

    export interface IPokemon {
        Attack: number;
        AttackNormal: number;
        Defense: number;
        DefenseNormal: number;
        HP: number;
        HPNormal: number;
        Special: number;
        SpecialNormal: number;
        Speed: number;
        SpeedNormal: number;
        level: number;
        moves: IPokemonMove[];
        nickname: string;
        status: string;
        title: string;
    }

    export interface IPokemonMove {
        remaining: number;
        title: string;
    }

    export interface IBattleInfo extends BattleMovr.IBattleInfo {
        animations?: string[];
        automaticMenus?: boolean;
        badge?: string;
        giftAfterBattle?: string;
        giftAfterBattleAmount?: number;
        keptThings?: (string | IPlayer)[];
        noBlackout?: boolean;
        textAfterBattle?: string[];
        textOpponentSendOut?: string[];
        textPlayerSendOut?: string[];
        textStart: string[];
        textVictory?: string[];
        theme?: string;
        player: any;
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
        direction?: Direction;
        thing: IThing;
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface IThing extends GameStartr.IThing {
        FSP: FullScreenPokemon;
        activate?: (activator: IThing, activated?: IThing) => void;
        areaName: string;
        bordering: IThing[];
        collide(thing: IThing, other: IThing): boolean;
        cycles?: any;
        dead?: boolean;
        direction: Direction;
        flickering?: boolean;
        id: string;
        mapName: string;
        numquads: number;
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
        collidedTrigger?: IDetector;
        cutscene?: string;
        destination: number;
        dialog?: string | string[];
        dialogDirections?: Direction[];
        dialogNext?: string | string[];
        dialogOptions?: IDialogOptions;
        directionPreferred?: Direction;
        distance: number;
        follower?: ICharacter;
        following?: ICharacter;
        followingLoop?: TimeHandlr.IEvent;
        gift?: string;
        grass?: IThing;
        heightGrass?: number;
        heightOld?: number;
        isMoving: boolean;
        ledge?: IThing;
        onWalkingStart(character: ICharacter, direction: Direction): void;
        onWalkingStop(character: ICharacter, onStop: any[]): void;
        outerOk?: boolean;
        player?: boolean;
        pushDirection?: Direction;
        pushSteps?: any[];
        roaming?: boolean;
        roamingDirections?: Direction[];
        sight?: boolean;
        sightDetector?: ISightDetector;
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
        isWalking?: boolean;
        keys: IPlayerKeys;
        nextDirection?: Direction;
    }

    export interface IGrass extends IThing {

    }

    export interface IDetector extends IThing {
        active?: boolean;
        activate?: (thing: IDetector) => void;
        cutscene?: string;
        dialog?: string | string[];
        keepAlive?: boolean;
        requireDirection?: Direction;
        requireOverlap?: boolean;
        routine?: string;
        singleUse?: boolean;
    }

    export interface IAreaSpawner extends IDetector {
        map: string;
        area: string;
    }

    export interface IGymDetector extends IDetector {
        gym: string;
        leader: string;
    }

    export interface IMenuTriggerer extends IDetector {
        menu?: string;
        pushDirection?: Direction;
        pushSteps?: any[];
    }

    export interface ISightDetector extends IDetector {
        viewer: ICharacter;
    }

    export interface IThemeDetector extends IDetector {
        theme: string;
    }

    export interface ITransporter extends IDetector {
        transport: string | ITransportSchema
    }

    export interface ITransportSchema {
        map?: string;
        location?: string;
    }

    export interface IPokeball extends IDetector {
        action: string;
        amount?: number;
        dialog?: string;
        item?: string;
        pokemon?: string;
        routine?: string;
    }

    export interface IMenu extends MenuGraphr.IMenu, IThing {
        children: IThing[];
    }

    export interface IKeyboardKeysMenu extends IMenu {
        gridColumns: number;
        gridRows: number;
        selectedIndex: number[];
    }

    export interface IKeyboardKey extends IThing {
        text: string;
    }

    export interface IKeyboardResultsMenu extends IMenu {
        blinker: IThing;
        completeValue: string;
        displayedValue: string;
        selectedChild: number;
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