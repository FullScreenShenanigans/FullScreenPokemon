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

    export interface IDirectionOpposites {
        [i: string]: string;
    }

    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        blockInputs: boolean;
        boundaries: IAreaBoundaries;
        cutscene?: string;
        playerDirection: Direction;
        scrollability: string;
        theme?: string;
        thingsById: IThingsById;
    }

    export interface IThingsById {
        [i: string]: IThing;
    }

    export interface IFullScreenPokemonStoredSettings extends GameStartr.IGameStartrStoredSettings {
        battles: IBattleMovrCustoms;
        math: IMathDecidrCustoms;
        menus: IMenuGraphrCustoms;
        states: IStateHoldrCustoms;
    }

    export interface IBattleMovrCustoms extends GameStartr.IGameStartrSettingsObject {
        GameStarter: GameStartr.IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }

    export interface IMathDecidrCustoms extends GameStartr.IMathDecidrCustoms {
        constants: IMathConstants;
        equations: IMathEquations;
    }

    export interface IMathConstants {
        NumberMaker?: NumberMakr.INumberMakr;
        statisticNames?: string[];
        statisticNamesDisplayed?: string[];
        statuses: {
            names: string[];
            probability25: {
                [i: string]: boolean;
            };
            probability12: {
                [i: string]: boolean;
            };
            levels: {
                [i: string]: number;
            };
            shaking: {
                [i: string]: number;
            }
        };
        /**
         * [X, Y] coordinates for spots on the Town Map to display Thing icons.
         */
        townMapLocations: {
            [i: string]: [number, number];
        };
        types: {
            names: string[];
            indices: {
                [i: string]: number;
            };
            table: number[][];
        };
        pokemon: {
            [i: string]: IPokemonListing;
        };
        moves: {
            [i: string]: IMoveSchema;
        };
        items: {
            [i: string]: IItemSchema;
        };
        battleModifications: {
            [i: string]: IBattleModification;
        };
    }

    export interface IMathEquations extends MathDecidr.IEquationContainer {
        newPokemon: (constants: IMathConstants, equations: IMathEquations, title: string[], level?: number, moves?: BattleMovr.IMove[], iv?: number, ev?: number) => IPokemon;
        newPokemonMoves: (constants: IMathConstants, equations: IMathEquations, title: string[], level: number) => BattleMovr.IMove[];
        newPokemonIVs: (constants: IMathConstants, equations: IMathEquations) => { [i: string]: number };
        newPokemonEVs: (constants: IMathConstants, equations: IMathEquations) => { [i: string]: number };
        newPokemonExperience: (constants: IMathConstants, equations: IMathEquations, title: string[], level: number) => IExperience;
        pokemonStatistic: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, statistic: string) => number;
        doesGrassEncounterHappen: (constants: IMathConstants, equations: IMathEquations, grass: IGrass) => boolean;
        canCatchPokemon: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall) => boolean;
        canEscapePokemon: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, enemy: IPokemon, battleInfo: IBattleInfo) => boolean;
        numBallShakes: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall) => number;
        opponentMove: (constants: IMathConstants, equations: IMathEquations, player: IBattleThingInfo, opponent: IBattleThingInfo) => string;
        opponentMatchesTypes: (constants: IMathConstants, equations: IMathEquations, opponent: IPokemon, types: string[]) => boolean;
        moveOnlyStatuses: (constants: IMathConstants, equations: IMathEquations, move: IMoveSchema) => boolean;
        applyMoveEffectPrority: (constants: IMathConstants, equations: IMathEquations, possibility: IMovePossibility, modification: IBattleModification, target: IPokemon, amount: number) => void;
        playerMovesFirst: (constants: IMathConstants, equations: IMathEquations, player: IBattleThingInfo, choicePlayer: string, opponent: IBattleThingInfo, choiceOpponent: string) => boolean;
        damage: (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon, defender: IPokemon) => number;
        damageModifier: (constants: IMathConstants, equations: IMathEquations, move: IMoveSchema, critical: boolean, attacker: IPokemon, defender: IPokemon) => number;
        criticalHit: (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon) => boolean;
        typeEffectiveness: (constants: IMathConstants, equations: IMathEquations, move: string, defender: IPokemon) => number;
        experienceGained: (constants: IMathConstants, equations: IMathEquations, player: IBattleThingInfo, opponent: IBattleThingInfo) => number;
        widthHealthBar: (constants: IMathConstants, equations: IMathEquations, widthFullBar: number, hp: number, hpNormal: number) => number;
    }

    export interface IMenuGraphrCustoms extends GameStartr.IGameStartrSettingsObject {
        GameStarter?: GameStartr.IGameStartr;
        schemas?: {
            [i: string]: IMenuSchema;
        };
        aliases?: {
            [i: string]: string;
        };
        replacements?: MenuGraphr.IReplacements;
        replacerKey?: string;
        replaceFromItemsHolder?: boolean;
        replacementStatistics?: {
            [i: string]: boolean;
        };
    }

    export interface IStateHoldrCustoms extends GameStartr.IGameStartrSettingsObject {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
    }

    export interface IPokemonListing {
        height: string[]; // ["feet", "inches"] (e.x. ["1", "8"])
        label: string;
        number: number;
        sprite: string;
        info: string[];
        evolvesInto?: string;
        evolvesVia?: string;
        experienceType?: string; // Todo: once all are known, make non-optional
        weight: number;
        types: string[];
        HP: number;
        Attack: number;
        Defense: number;
        Special: number;
        Speed: number;
        moves: IPokemonMovesListing;
    }

    export interface IPokedexListing extends IPokemonListing {
        caught?: boolean;
        seen?: boolean;
        title: string;
    }

    export interface IPokedexInformation {
        caught: boolean;
        seen: boolean;
        title: string[];
    }

    export interface IPokedex {
        [i: string]: IPokedexInformation;
    }

    export interface IPokemonMovesListing {
        natural: IPokemonMoveListing[];
        hm: IPokemonMoveListing[];
        tm: IPokemonMoveListing[];
    }

    export interface IPokemonMoveListing {
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
        grass?: IWildPokemonSchema[];
        [i: string]: IWildPokemonSchema[];
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

    export interface IWildPokemonSchema {
        title: string[];
        level?: number;
        levels?: number[];
        moves?: string[];
        rate?: number;
    }

    export interface IMoveSchema {
        type: string;
        damage: string;
        power: string | number;
        effect?: string;
        accuracy: string;
        PP: number;
        description: string;
        amount?: number;
        criticalRaised?: boolean;
        lower?: string;
        priority?: number;
        raise?: string;
        status?: string;
    }

    export interface IItemSchema {
        effect: string;
        category: string;
        price?: number;
    }

    export interface IMovePossibility {
        move: string;
        priority: number;
    }

    export interface IBattleBall extends IItemSchema {
        probabilityMax: number;
        rate: number;
        type: string;
    }

    export interface IBattleModification {
        opponentType: string[];
        preferences: ([string, string, number] | [string, string])[];
    }

    export interface IBattleInfo extends BattleMovr.IBattleInfo {
        animations?: string[];
        automaticMenus?: boolean;
        badge?: string;
        currentEscapeAttempts?: number;
        giftAfterBattle?: string;
        giftAfterBattleAmount?: number;
        keptThings?: IThing[];
        noBlackout?: boolean;
        opponent?: IBattleThingInfo;
        player?: IBattleThingInfo;
        textAfterBattle?: string[];
        textDefeat?: string[];
        textOpponentSendOut?: string[];
        textPlayerSendOut?: string[];
        textStart?: string[];
        textVictory?: string[];
        theme?: string;
    }

    export interface IBattleThingInfo extends BattleMovr.IBattleThingInfo {
        actors: IPokemon[];
        dumb?: boolean;
        reward?: number;
        selectedActor?: IPokemon;
    }

    export interface IPokemon extends BattleMovr.IActor {
        catchRate?: number;
        criticalHitProbability?: boolean;
        traded?: boolean;
    }

    export interface IExperience {
        current: number;
        next: number;
        remaining: number;
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

        /**
         * Whether this is barred from colliding with other Things.
         */
        nocollide?: boolean;
        numquads: number;
        offsetX?: number;
        offsetY?: number;
        position: string;
        spawned: boolean;
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
        followingLoop?: TimeHandlr.ITimeEvent;
        gift?: string;
        grass?: IGrass;
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
        sight?: number;
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
        walking?: boolean;
        walkingCommands?: Direction[];
        walkingFlipping?: TimeHandlr.ITimeEvent;
    }

    export interface IEnemy extends ICharacter {
        actors: IWildPokemonSchema[];
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
        rarity: number;
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
        pokemon?: string[];
        routine?: string;
    }

    export interface IMenuBase extends MenuGraphr.IMenuBase {
        arrowXOffset?: number;
        arrowYOffset?: number;
        dirty?: boolean;
        light?: boolean;
        lined?: boolean;
        plain?: boolean;
        watery?: boolean;
    }

    export interface IMenuSchema extends IMenuBase {
        hidden?: boolean;
        position?: MenuGraphr.IMenuSchemaPosition;
    }

    export interface IMenu extends IMenuBase, IThing {
        children: IThing[];
        height: number;
        settings?: any;
        width: number;
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
