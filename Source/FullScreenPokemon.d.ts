declare module FullScreenPokemon {
    export enum Direction { }

    // TS2413: Numeric index type 'string' is not assignable to string index type 'Direction'.
    //export interface IDirections {
    //    [i: number]: string;
    //    [i: string]: Direction;
    //}

    export interface IDirectionsToAliases {
        [i: number]: string;
    }

    export interface IDirectionAliases {
        [i: string]: Direction;
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

    export interface IBattleMovrCustoms extends GameStartr.IGameStartrSettingsObject {
        GameStarter: GameStartr.IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }

    export interface IMenuGraphrCustoms extends GameStartr.IGameStartrSettingsObject {
        GameStarter: GameStartr.IGameStartr;
    }

    export interface IStateHoldrCustoms extends GameStartr.IGameStartrSettingsObject {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
    }

    export interface IPokedexListing {
        caught: boolean;
        height: string[]; // ["feet", "inches"] (e.x. ["1", "8"])
        seen: boolean;
        title: string;
        label: string;
        number: number;
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
        attributes?: {
            [i: string]: any;
        };
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
        grass?: IPokemonSchema[];
        [i: string]: IPokemonSchema[];
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
        rate?: number;
    }

    export interface IBattleInfo extends BattleMovr.IBattleInfo {
        animations?: string[];
        automaticMenus?: boolean;
        badge?: string;
        giftAfterBattle?: string;
        giftAfterBattleAmount?: number;
        keptThings?: (string | IPlayer)[];
        noBlackout?: boolean;
        opponent?: IBattleThingInfo;
        player?: IBattleThingInfo;
        textAfterBattle?: string[];
        textDefeat?: string[];
        textOpponentSendOut?: string[][];
        textPlayerSendOut?: string[][];
        textStart?: string[][];
        textVictory?: string[];
        theme?: string;
    }

    export interface IBattleThingInfo extends BattleMovr.IBattleThingInfo {
        reward?: number;
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
        dialogOptions?: IDialog;
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
        switchDirectionOnDialog?: boolean;
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
        textDefeat?: string[];
        textAfterBattle?: string[];
        textVictory?: string[];
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
        activate?: (thing: IDetector, other?: IThing) => void;
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
        menuAttributes?: any;
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

    export interface IMenu extends MenuGraphr.IMenuBase, IThing {
        children: IThing[];
        settings?: any;
    }

    export interface IKeyboardKeysMenu extends IMenu {
        gridColumns: number;
        gridRows: number;
        selectedIndex: number[];
    }

    export interface IKeyboardKey extends IThing {
        text: [string];
        value: string;
    }

    export interface IKeyboardResultsMenu extends IMenu {
        blinker: IThing;
        completeValue: string[];
        displayedValue: string[];
        selectedChild: number;
    }

    export interface IPlayerKeys {
        a: boolean;
        b: boolean;
        [i: number]: boolean; // Array-style usage, for direction numbers
    }

    export interface ICutsceneSettings extends ScenePlayr.ICutsceneSettings {

    }

    export interface IFullScreenPokemonSettings {

    }

    export interface IFullScreenPokemon {

    }
}
