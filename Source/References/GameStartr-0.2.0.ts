/// <reference path="AudioPlayr-0.2.1.ts" />
/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="DeviceLayr-0.2.0.ts" />
/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="FPSAnalyzr-0.2.1.ts" />
/// <reference path="GamesRunnr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="LevelEditr-0.2.0.ts" />
/// <reference path="MapsCreatr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="MapsHandlr-0.2.0.ts" />
/// <reference path="MathDecidr-0.2.0.ts" />
/// <reference path="ModAttachr-0.2.2.ts" />
/// <reference path="NumberMakr-0.2.2.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="PixelDrawr-0.2.0.ts" />
/// <reference path="PixelRendr-0.2.0.ts" />
/// <reference path="QuadsKeepr-0.2.1.ts" />
/// <reference path="ScenePlayr-0.2.0.ts" />
/// <reference path="StringFilr-0.2.1.ts" />
/// <reference path="ThingHittr-0.2.0.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />
/// <reference path="TouchPassr-0.2.0.ts" />
/// <reference path="UserWrappr-0.2.0.ts" />
/// <reference path="WorldSeedr-0.2.0.ts" />
/// <reference path="js_beautify.ts" />

declare module GameStartr {
    /**
     * Extra CSS styles that may be added to a page.
     */
    export interface IPageStyles {
        [i: string]: {
            [j: string]: string | number;
        }
    }

    /**
     * Custom settings to initialize a new instance of the IGameStartr interface.
     */
    export interface IGameStartrSettings extends EightBittr.IEightBittrSettings {
        /**
         * Any extra reset functions that should be called after the standard ones.
         */
        extraResets?: string[];

        /**
         * A nickname for the size settings.
         */
        size?: string;

        /**
         * Whether the game should be expanded to full-screen size.
         */
        full?: boolean;

        /**
         * How wide the screen should be. Infinity is an option.
         */
        width?: number;

        /**
         * How tall the screen should be. Infinity is an option.
         */
        height?: number;

        /**
         * Whether the reset Functions should be timed for performance.
         */
        resetTimed?: boolean;

        /**
         * Options for mods that, if true, should be immediately enabled.
         */
        mods?: {
            [i: string]: boolean;
        }

        /**
         * Any additional styles that should be added to the page immediately.
         */
        style?: IPageStyles;
    }

    /**
     * Stored settings to be stored separately and kept within a GameStartr.
     */
    export interface IGameStartrStoredSettings {
        /**
         * Settings regarding audio playback, particularly for an IAudioPlayr.
         */
        audio: IAudioPlayrCustoms;

        /**
         * Settings regarding collision detection, particularily for an IThingHittr.
         */
        collisions: IThingHittrCustoms;

        /**
         * Settings regarding device input detection, particularly for an IDeviceLayr.
         */
        devices: IDeviceLayrCustoms;

        /**
         * Settings regarding the level editor, particularly for an ILevelEditr.
         */
        editor: ILevelEditrCustoms;

        /**
         * Settings regarding map generation, particularly for an IWorldSeedr.
         */
        generator: IWorldSeedrCustoms;

        /**
         * Settings regarding in-memory Thing groups, particularly for an IGroupHoldr.
         */
        groups: IGroupHoldrCustoms;

        /**
         * Settings regarding timed events, particularly for an ITimeHandlr.
         */
        events: ITimeHandlrCustoms;

        /**
         * Settings regarding key and mouse inputs, particularly for an IInputWritr.
         */
        input: IInputWritrCustoms;

        /**
         * Settings regarding map layouts, particularly for an IMapsCreatr and an IMapsHandlr.
         */
        maps: IMapsCreatrCustoms;

        /**
         * Settings regarding computations, particularly for an IMathDecidr.
         */
        math: IMathDecidrCustoms;

        /**
         * Settings regarding mods, particularly for an IModAttachr.
         */
        mods: IModAttachrCustoms;

        /**
         * Settings regarding Thing generation, particularly for an IObjectMakr.
         */
        objects: IObjectMakrCustoms;

        /**
         * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
         */
        quadrants: IQuadsKeeprCustoms;

        /**
         * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
         */
        renderer: IPixelDrawrCustoms;

        /**
         * Settings regarding timed upkeep running, particularly for an IGamesRunnr.
         */
        runner: IGamesRunnrCustoms;

        /**
         * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
         */
        scenes: IScenePlayrCustoms;

        /**
         * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
         */
        sprites: IPixelRendrCustoms;

        /**
         * Settings regarding locally stored stats, particularly for an IItemsHoldr.
         * 
         * @remarks This will be renamed to items eventually..
         */
        statistics: IItemsHoldrCustoms;

        /**
         * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
         */
        touch: ITouchPassrCustoms;

        /**
         * Settings regarding the visible interface, particularly for an IUserWrappr.
         */
        ui: IUserWrapprCustoms;

        /**
         * Any other settings for a GameStartr generally inherit from IGameStartrSettingsObject.
         */
        [i: string]: IGameStartrSettingsObject;
    }

    /**
     * Each settings file contains an Object that has its contents passed to the
     * corresponding module, either directly or via a partial copy.
     */
    export interface IGameStartrSettingsObject {
        [i: string]: any;
    }
    
    /**
     * Settings regarding audio playback, particularly for an IAudioPlayr.
     */
    export interface IAudioPlayrCustoms extends IGameStartrSettingsObject {
        /**
         * The directory in which all sub-directories of audio files are stored.
         */
        directory: string;

        /**
         * The allowed filetypes for each audio file. Each of these should have a
         * directory of their name under the main directory, which should contain
         * each file of the filetype.
         */
        fileTypes: string[];

        /**
         * The names of the audio files to be preloaded for on-demand playback.
         */
        library: {
            [i: string]: {
                [i: string]: string[];
            }
        };
    }

    /**
     * Settings regarding device input detection, particularly for an IDeviceLayr.
     */
    export interface IDeviceLayrCustoms extends IGameStartrSettingsObject { }

    /**
     * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
     */
    export interface IGamesRunnrCustoms extends IGameStartrSettingsObject {
        interval?: number;
        games: Function[]
    }

    export interface IGroupHoldrCustoms extends IGameStartrSettingsObject, GroupHoldr.IGroupHoldrSettings { }

    export interface IInputWritrCustoms extends IGameStartrSettingsObject {
        "InputWritrArgs": {
            triggers: InputWritr.IInputWritrTriggerContainer;
            eventInformation?: any;
            getTimestamp?: () => number;
            aliases?: { [i: string]: any[] };
            keyAliasesToCodes?: { [i: string]: number };
            keyCodesToAliases?: { [i: number]: string };
            isRecording?: boolean | InputWritr.IInputWriterBooleanGetter;
        }
    }

    export interface IItemsHoldrCustoms extends IGameStartrSettingsObject {
        "prefix": string;
        "doMakeContainer"?: boolean;
        "displayChanges"?: { [i: string]: string };
        "containersArguments": any[][];
        "defaults": { [i: string]: string };
        "values": { [i: string]: ItemsHoldr.IItemValueSettings };
    }

    export interface ILevelEditrCustoms extends IGameStartrSettingsObject {
        "blocksize": number;
        "mapDefault": MapsCreatr.IMapsCreatrMapRaw;
        "mapSettingDefault": string;
        "mapEntryDefault": string;
        "prethings": {
            [i: string]: {
                [i: string]: any;
            }
        };
        "thingGroups": string[];
        "thingKeys": string[];
        "macros": {
            [i: string]: {
                "description": string;
                "options": any;
            }
        }
    }

    export interface IMapsCreatrCustoms extends IGameStartrSettingsObject {
        "mapDefault": string;
        "locationDefault": string;
        "groupTypes": string[];
        "requireEntrance"?: boolean;
        "screenAttributes"?: string[];
        "screenVariables": { [i: string]: Function };
        "onSpawn": (prething: MapsCreatr.IPreThing) => void;
        "onUnspawn": (prething: MapsCreatr.IPreThing) => void;
        "stretchAdd"?: (thing: string | MapsCreatr.IPreThingSettings, index: number) => void;
        "afterAdd"?: (thing: string | MapsCreatr.IPreThingSettings, index: number) => void;
        "macros": { [i: string]: MapsCreatr.IMapsCreatrMacro };
        "entrances": { [i: string]: MapsCreatr.IMapsCreatrEntrance };
        "patterns"?: any;
        "library": { [i: string]: MapsCreatr.IMapsCreatrMapRaw };
    }

    export interface IMathDecidrCustoms extends IGameStartrSettingsObject { }

    export interface IModAttachrCustoms extends IGameStartrSettingsObject {
        "storeLocally"?: boolean;
        "mods": ModAttachr.IModAttachrMod[];
    }

    export interface IPixelDrawrCustoms extends IGameStartrSettingsObject {
        "groupNames": string[];
        "spriteCacheCutoff"?: number;
    }

    export interface IPixelRendrCustoms extends IGameStartrSettingsObject {
        "spriteWidth": string;
        "spriteHeight": string;
        "flipVert": string;
        "flipHoriz": string;
        "paletteDefault": number[][];
        "filters": any;
        "library": any;
    }

    export interface IObjectMakrCustoms extends IGameStartrSettingsObject {
        "onMake"?: string;
        "indexMap"?: any;
        "doPropertiesFull"?: boolean;
        "inheritance": any;
        "properties": { [i: string]: any };
    }

    export interface IQuadsKeeprCustoms extends IGameStartrSettingsObject {
        "numRows": number;
        "numCols": number;
        "tolerance"?: number;
        "groupNames": string[];
    }

    export interface IScenePlayrCustoms extends IGameStartrSettingsObject { }

    export interface IThingHittrCustoms extends IGameStartrSettingsObject, ThingHittr.IThingHittrSettings { }

    export interface ITimeHandlrCustoms extends IGameStartrSettingsObject {
        "timingDefault": number;
        "keyCycles"?: string;
        "keyClassName"?: string;
        "keyOnClassCycleStart"?: string;
        "keyDoClassCycleStart"?: string;
        "keyCycleCheckValidity"?: string;
        "copyCycleSettings"?: boolean;
    }

    export interface ITouchPassrCustoms extends IGameStartrSettingsObject, TouchPassr.ITouchPassrSettings { }

    export interface IUserWrapprCustoms extends IGameStartrSettingsObject { }

    export interface IWorldSeedrCustoms extends IGameStartrSettingsObject {
        possibilities: WorldSeedr.IPossibilityContainer;
    }

    export interface IThing extends EightBittr.IThing, LevelEditr.IThing, QuadsKeepr.IThing {
        GameStarter: IGameStartr;
        name: string;
        groupType: string;
        className: string;
        alive?: boolean;
        placed?: boolean;
        changed?: boolean;
        maxquads: number;
        quadrants: QuadsKeepr.IQuadrant[];
        imageData: ImageData;
        attributes?: any;
        spriteCycle?: any[];
        spriteCycleSynched?: any[];
        xvelOld?: number;
        yvelOld?: number;
        parallaxHoriz?: number;
        parallaxVert?: number;
        flipHoriz?: boolean;
        flipVert?: boolean;
        noshiftx?: boolean;
        noshifty?: boolean;
        nofall?: boolean;
        nofallOld?: boolean;
        nocollide?: boolean;
        nocollideOld?: boolean;
        movement?: Function;
        movementOld?: Function;
        onThingAdd?: Function;
        onThingAdded?: Function;
        onThingMake?: Function;
        onDelete?: Function;
    }

    export interface IGameStartr extends EightBittr.IEightBittr {
        settings: { [i: string]: IGameStartrSettingsObject; };
        container: HTMLDivElement;
        canvas: HTMLCanvasElement;
        scale: number;
        AudioPlayer: AudioPlayr.IAudioPlayr;
        DeviceLayer: DeviceLayr.IDeviceLayr;
        GamesRunner: GamesRunnr.IGamesRunnr;
        GroupHolder: GroupHoldr.IGroupHoldr;
        InputWriter: InputWritr.IInputWritr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        LevelEditor: LevelEditr.ILevelEditr;
        NumberMaker: NumberMakr.INumberMakr;
        MapsCreator: MapsCreatr.IMapsCreatr;
        MapScreener: MapScreenr.IMapScreenr;
        MapsHandler: MapsHandlr.IMapsHandlr;
        MathDecider: MathDecidr.IMathDecidr;
        ModAttacher: ModAttachr.IModAttachr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        PixelDrawer: PixelDrawr.IPixelDrawr;
        PixelRender: PixelRendr.IPixelRendr;
        QuadsKeeper: QuadsKeepr.IQuadsKeepr;
        ScenePlayer: ScenePlayr.IScenePlayr;
        ThingHitter: ThingHittr.IThingHittr;
        TimeHandler: TimeHandlr.ITimeHandlr;
        TouchPasser: TouchPassr.ITouchPassr;
        UserWrapper: UserWrappr.IUserWrappr;
        WorldSeeder: WorldSeedr.IWorldSeedr;
        reset(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTimed(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetAudioPlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetGamesRunner(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetGroupHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetInputWriter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetDeviceLayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTouchPasser(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetLevelEditor(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetNumberMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapsCreator(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapScreener(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapsHandler(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMathDecider(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetPixelRender(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetPixelDrawer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetObjectMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetItemsHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetThingHitter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTimeHandler(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetQuadsKeeper(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetWorldSeeder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetScenePlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMathDecider(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        startModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetContainer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        scrollWindow(dx: number, dy?: number): void;
        scrollThing(thing: IThing, dx: number, dy?: number): void;
        onAreaSpawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;
        onAreaUnspawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;
        addThing(thingRaw: string | IThing | any[], left?: number, top?: number): IThing;
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;
        thingProcessAttributes(thing: IThing, attributes: any): void;
        mapPlaceRandomCommands(GameStarter: IGameStartr, generatedCommands: WorldSeedr.ICommand[]): void;
        onGamePlay(GameStarter: IGameStartr): void;
        onGamePause(GameStarter: IGameStartr): void;
        canInputsTrigger(GameStarter: IGameStartr): boolean;
        gameStart(): void;
        killNormal(thing: IThing): void;
        markChanged(thing: IThing): void;
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void;
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void;
        setTop(thing: IThing, top: number): void;
        setRight(thing: IThing, right: number): void;
        setBottom(thing: IThing, bottom: number): void;
        setLeft(thing: IThing, left: number): void;
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void;
        shiftThings(things: IThing[], dx: number, dy: number, notChanged): void;
        shiftAll(dx: number, dy: number): void;
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void;
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        updatePosition(thing: IThing): void;
        updateSize(thing: IThing): void;
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void;
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void;
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        thingPauseVelocity(thing: IThing, keepMovement?: boolean): void;
        thingResumeVelocity(thing: IThing, noVelocity?: boolean): void;
        generateObjectKey(thing: IThing): string;
        setClass(thing: IThing, className: string): void;
        setClassInitial(thing: IThing, className: string): void;
        addClass(thing: IThing, className: string): void;
        addClasses(thing: IThing, ...classes: (string | string[])[]): void;
        removeClass(thing: IThing, className: string): void;
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void;
        hasClass(thing: IThing, className: string): boolean;
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void;
        flipHoriz(thing: IThing): void;
        flipVert(thing: IThing): void;
        unflipHoriz(thing: IThing): void;
        unflipVert(thing: IThing): void;
        setOpacity(thing: IThing, opacity: number): void;
        ensureCorrectCaller(current: any): IGameStartr;
        arrayDeleteThing(thing: IThing, array: any[], location?: number): void;
        takeScreenshot(name: string, format?: string): void;
        addPageStyles(styles: any): void;
    }
}

declare module MapsCreatr {
    export interface IMapsCreatrArea {
        setting: string;
    }
}


module GameStartr {
    "use strict";

    /**
     * A general-use game engine for 2D 8-bit games.
     */
    export class GameStartr extends EightBittr.EightBittr implements IGameStartr {
        public AudioPlayer: AudioPlayr.IAudioPlayr;
        public DeviceLayer: DeviceLayr.IDeviceLayr;
        public FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;
        public GamesRunner: GamesRunnr.IGamesRunnr;
        public GroupHolder: GroupHoldr.IGroupHoldr;
        public InputWriter: InputWritr.IInputWritr;
        public ItemsHolder: ItemsHoldr.IItemsHoldr;
        public LevelEditor: LevelEditr.ILevelEditr;
        public NumberMaker: NumberMakr.INumberMakr;
        public MapsCreator: MapsCreatr.IMapsCreatr;
        public MapScreener: MapScreenr.IMapScreenr;
        public MapsHandler: MapsHandlr.IMapsHandlr;
        public MathDecider: MathDecidr.IMathDecidr;
        public ModAttacher: ModAttachr.IModAttachr;
        public ObjectMaker: ObjectMakr.IObjectMakr;
        public PixelDrawer: PixelDrawr.IPixelDrawr;
        public PixelRender: PixelRendr.IPixelRendr;
        public QuadsKeeper: QuadsKeepr.IQuadsKeepr;
        public ScenePlayer: ScenePlayr.IScenePlayr;
        public ThingHitter: ThingHittr.IThingHittr;
        public TimeHandler: TimeHandlr.ITimeHandlr;
        public TouchPasser: TouchPassr.ITouchPassr;
        public UserWrapper: UserWrappr.IUserWrappr;
        public WorldSeeder: WorldSeedr.IWorldSeedr;

        /**
         * Settings for individual modules are stored as sub-Objects here.
         */
        public settings: IGameStartrStoredSettings;

        /**
         * Default list of reset Functions to call during this.reset or this.resetTimed, in order.
         */
        public resets: string[] = [
            "resetObjectMaker",
            "resetPixelRender",
            "resetTimeHandler",
            "resetItemsHolder",
            "resetAudioPlayer",
            "resetQuadsKeeper",
            "resetGamesRunner",
            "resetGroupHolder",
            "resetThingHitter",
            "resetMapScreener",
            "resetPixelDrawer",
            "resetNumberMaker",
            "resetMapsCreator",
            "resetMapsHandler",
            "resetInputWriter",
            "resetDeviceLayer",
            "resetTouchPasser",
            "resetLevelEditor",
            "resetWorldSeeder",
            "resetScenePlayer",
            "resetMathDecider",
            "resetModAttacher",
            "startModAttacher",
            "resetContainer"
        ];

        /**
         * HTML container containing all game elements.
         */
        public container: HTMLDivElement;

        /**
         * Canvas upon which the game's screen is constantly drawn.
         */
        public canvas: HTMLCanvasElement;

        /**
         * How much to scale each pixel from PixelDrawr to the real canvas.
         */
        public scale: number;

        /**
         * Initializes a new instance of the GameStartr class.
         * 
         * @param customs   Any optional custom settings.
         */
        constructor(settings: IGameStartrSettings = {}) {
            super({
                "unitsize": settings.unitsize,
                "constantsSource": settings.constantsSource,
                "constants": settings.constants
            });

            if (settings.extraResets) {
                this.resets.push.apply(this.resets, settings.extraResets);
            }

            if (settings.resetTimed) {
                this.resetTimed(this, settings);
            } else {
                this.reset(this, settings);
            }
        }


        /* Resets
        */

        /**
         * Resets the GameStartr by calling the parent EightBittr.prototype.reset.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        reset(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            super.reset(GameStarter, GameStarter.resets, settings);
        }

        /**
         * Resets the EightBittr and records the time by calling the parent 
         * EightBittr.prototype.resetTimed.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @returns {Array} How long each reset Function took followed by the entire
         *                 operation, in milliseconds.
         */
        resetTimed(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            super.resetTimed(GameStarter, GameStarter.resets, settings);
        }

        /**
         * Sets this.ObjectMaker.
         * 
         * Because many Thing functions require access to other FSM modules, each is
         * given a reference to this container FSM via properties.thing.GameStarter. 
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): objects.js (settings/objects.js)
         */
        resetObjectMaker(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ObjectMaker = new ObjectMakr.ObjectMakr(
                GameStarter.proliferate(
                    {
                        "properties": {
                            "Quadrant": {
                                "EightBitter": GameStarter,
                                "GameStarter": GameStarter
                            },
                            "Thing": {
                                "EightBitter": GameStarter,
                                "GameStarter": GameStarter
                            }
                        }
                    },
                    GameStarter.settings.objects));
        }

        /**
         * Sets this.QuadsKeeper.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): quadrants.js (settings/quadrants.js)
         */
        resetQuadsKeeper(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            var quadrantWidth: number = settings.width / (GameStarter.settings.quadrants.numCols - 3),
                quadrantHeight: number = settings.height / (GameStarter.settings.quadrants.numRows - 2);

            GameStarter.QuadsKeeper = new QuadsKeepr.QuadsKeepr(
                GameStarter.proliferate(
                    {
                        "ObjectMaker": GameStarter.ObjectMaker,
                        "createCanvas": GameStarter.createCanvas,
                        "quadrantWidth": quadrantWidth,
                        "quadrantHeight": quadrantHeight,
                        "startLeft": -quadrantWidth,
                        "startHeight": -quadrantHeight,
                        "onAdd": GameStarter.onAreaSpawn.bind(GameStarter, GameStarter),
                        "onRemove": GameStarter.onAreaUnspawn.bind(GameStarter, GameStarter)
                    },
                    GameStarter.settings.quadrants));
        }

        /**
         * Sets this.PixelRender.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): sprites.js (settings/sprites.js)
         */
        resetPixelRender(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.PixelRender = new PixelRendr.PixelRendr(
                GameStarter.proliferate(
                    {
                        "scale": GameStarter.scale,
                        "QuadsKeeper": GameStarter.QuadsKeeper,
                        "unitsize": GameStarter.unitsize
                    },
                    GameStarter.settings.sprites));
        }

        /**
         * Sets this.PixelDrawer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): renderer.js (settings/renderer.js)
         */
        resetPixelDrawer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.PixelDrawer = new PixelDrawr.PixelDrawr(
                GameStarter.proliferate(
                    {
                        "PixelRender": GameStarter.PixelRender,
                        "MapScreener": GameStarter.MapScreener,
                        "createCanvas": GameStarter.createCanvas,
                        "unitsize": GameStarter.unitsize,
                        "generateObjectKey": GameStarter.generateObjectKey
                    },
                    GameStarter.settings.renderer));
        }

        /**
         * Sets EightBitter.TimeHandler.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): events.js (settings/events.js)
         */
        resetTimeHandler(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.TimeHandler = new TimeHandlr.TimeHandlr(
                GameStarter.proliferate(
                    {
                        "classAdd": GameStarter.addClass,
                        "classRemove": GameStarter.removeClass
                    },
                    GameStarter.settings.events));
        }

        /**
         * Sets this.AudioPlayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): audio.js (settings/audio.js)
         */
        resetAudioPlayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.AudioPlayer = new AudioPlayr.AudioPlayr(
                GameStarter.proliferate(
                    {
                        "ItemsHolder": GameStarter.ItemsHolder
                    },
                    GameStarter.settings.audio));
        }

        /**
         * Sets this.GamesRunner.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): runner.js (settings/runner.js)
         */
        resetGamesRunner(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.GamesRunner = new GamesRunnr.GamesRunnr(
                GameStarter.proliferate(
                    {
                        "adjustFramerate": true,
                        "interval": 1000 / 60,
                        "scope": GameStarter,
                        "onPlay": GameStarter.onGamePlay.bind(GameStarter, GameStarter),
                        "onPause": GameStarter.onGamePause.bind(GameStarter, GameStarter),
                        "FPSAnalyzer": new FPSAnalyzr.FPSAnalyzr()
                    },
                    GameStarter.settings.runner));
        }

        /**
         * Sets this.ItemsHolder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): statistics.js (settings/statistics.js)
         */
        resetItemsHolder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ItemsHolder = new ItemsHoldr.ItemsHoldr(
                GameStarter.proliferate(
                    {
                        "callbackArgs": [GameStarter]
                    },
                    GameStarter.settings.statistics));
        }

        /**
         * Sets this.GroupHolder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): groups.js (settings/groups.js)
         */
        resetGroupHolder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.GroupHolder = new GroupHoldr.GroupHoldr(GameStarter.settings.groups);
        }

        /**
         * Sets this.ThingHitter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): collisions.js (settings/collisions.js)
         */
        resetThingHitter(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ThingHitter = new ThingHittr.ThingHittr(
                GameStarter.proliferate(
                    {
                        "scope": GameStarter
                    },
                    GameStarter.settings.collisions));
        }

        /**
         * Sets this.MapScreener.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        resetMapScreener(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MapScreener = new MapScreenr.MapScreenr({
                "EightBitter": GameStarter,
                "unitsize": GameStarter.unitsize,
                "width": settings.width,
                "height": settings.height,
                "variableArgs": [GameStarter],
                "variables": GameStarter.settings.maps.screenVariables
            });
        }

        /**
         * Sets this.NumberMaker.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetNumberMaker(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.NumberMaker = new NumberMakr.NumberMakr();
        }

        /**
         * Sets this.MapCreator.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        resetMapsCreator(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MapsCreator = new MapsCreatr.MapsCreatr({
                "ObjectMaker": GameStarter.ObjectMaker,
                "groupTypes": GameStarter.settings.maps.groupTypes,
                "macros": GameStarter.settings.maps.macros,
                "entrances": GameStarter.settings.maps.entrances,
                "maps": GameStarter.settings.maps.library,
                "scope": GameStarter
            });
        }

        /**
         * Sets this.MapsHandler.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): maps.js (settings/maps.js)
         */
        resetMapsHandler(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MapsHandler = new MapsHandlr.MapsHandlr({
                "MapsCreator": GameStarter.MapsCreator,
                "MapScreener": GameStarter.MapScreener,
                "screenAttributes": GameStarter.settings.maps.screenAttributes,
                "onSpawn": GameStarter.settings.maps.onSpawn,
                "onUnspawn": GameStarter.settings.maps.onUnspawn,
                "stretchAdd": GameStarter.settings.maps.stretchAdd,
                "afterAdd": GameStarter.settings.maps.afterAdd,
                "commandScope": GameStarter
            });
        }

        /**
         * Sets this.InputWriter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): input.js (settings/input.js)
         */
        resetInputWriter(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.InputWriter = new InputWritr.InputWritr(
                GameStarter.proliferate(
                    {
                        "canTrigger": GameStarter.canInputsTrigger.bind(GameStarter, GameStarter),
                        "eventInformation": GameStarter
                    },
                    GameStarter.settings.input.InputWritrArgs));
        }

        /**
         * Sets this.DeviceLayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): devices.js (settings/devices.js)
         */
        resetDeviceLayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.DeviceLayer = new DeviceLayr.DeviceLayr(
                GameStarter.proliferate(
                    {
                        "InputWriter": GameStarter.InputWriter
                    },
                    GameStarter.settings.devices));
        }

        /**
         * Sets this.InputWriter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): touch.js (settings/touch.js)
         */
        resetTouchPasser(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.TouchPasser = new TouchPassr.TouchPassr(
                GameStarter.proliferate(
                    {
                        "InputWriter": GameStarter.InputWriter
                    },
                    GameStarter.settings.touch));
        }

        /**
         * Sets this.LevelEditor.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): editor.js (settings/editor.js)
         */
        resetLevelEditor(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.LevelEditor = new LevelEditr.LevelEditr(
                GameStarter.proliferate(
                    {
                        "GameStarter": GameStarter,
                        "beautifier": js_beautify
                    },
                    GameStarter.settings.editor));
        }

        /**
         * Sets this.WorldSeeder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): generator.js (settings/generator.js)
         */
        resetWorldSeeder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.WorldSeeder = new WorldSeedr.WorldSeedr(
                GameStarter.proliferate(
                    {
                        "random": GameStarter.NumberMaker.random.bind(GameStarter.NumberMaker),
                        "onPlacement": GameStarter.mapPlaceRandomCommands.bind(GameStarter, GameStarter)
                    },
                    GameStarter.settings.generator));
        }

        /**
         * Sets this.ScenePlayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): scenes.js (settings/scenes.js)
         */
        resetScenePlayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ScenePlayer = new ScenePlayr.ScenePlayr(
                GameStarter.proliferate(
                    {
                        "cutsceneArguments": [GameStarter]
                    },
                    GameStarter.settings.scenes));
        }

        /**
         * Sets this.MathDecider.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): math.js (settings/math.js)
         */
        resetMathDecider(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MathDecider = new MathDecidr.MathDecidr(GameStarter.settings.math);
        }

        /**
         * Sets this.ModAttacher.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @remarks Requirement(s): mods.js (settings/mods.js)
         */
        resetModAttacher(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ModAttacher = new ModAttachr.ModAttachr(
                GameStarter.proliferate(
                    {
                        "scopeDefault": GameStarter,
                        "ItemsHoldr": GameStarter.ItemsHolder
                    },
                    GameStarter.settings.mods));
        }

        /** 
         * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
         * is fired.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        startModAttacher(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            var mods: { [i: string]: boolean } = settings.mods,
                i: string;

            if (mods) {
                for (i in mods) {
                    if (mods.hasOwnProperty(i) && mods[i]) {
                        GameStarter.ModAttacher.enableMod(i);
                    }
                }
            }

            GameStarter.ModAttacher.fireEvent("onReady", GameStarter, GameStarter);
        }

        /**
         * Resets the parent HTML container. Width and height are set by customs, 
         * and canvas, ItemsHolder, and TouchPassr container elements are added.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetContainer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.container = <HTMLDivElement>GameStarter.createElement("div", {
                "className": "EightBitter",
                "style": GameStarter.proliferate(
                    {
                        "position": "relative",
                        "width": settings.width + "px",
                        "height": settings.height + "px"
                    },
                    settings.style)
            });

            GameStarter.canvas = GameStarter.createCanvas(settings.width, settings.height);
            GameStarter.PixelDrawer.setCanvas(GameStarter.canvas);
            GameStarter.container.appendChild(GameStarter.canvas);

            GameStarter.TouchPasser.setParentContainer(GameStarter.container);
        }


        /* Global manipulations
        */

        /**
         * Scrolls the game window by shifting all Things and checking for quadrant
         * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollWindow(dx: number, dy?: number): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this);

            dx = dx | 0;
            dy = dy | 0;

            if (!dx && !dy) {
                return;
            }

            GameStarter.MapScreener.shift(dx, dy);
            GameStarter.shiftAll(-dx, -dy);

            GameStarter.QuadsKeeper.shiftQuadrants(-dx, -dy);
        }

        /**
         * Scrolls everything but a single Thing.
         * 
         * @param thing   The only Thing that shouldn't move on the screen.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollThing(thing: IThing, dx: number, dy?: number): void {
            var saveleft: number = thing.left,
                savetop: number = thing.top;

            thing.GameStarter.scrollWindow(dx, dy);
            thing.GameStarter.setLeft(thing, saveleft);
            thing.GameStarter.setTop(thing, savetop);
        }

        /**
         * Spawns all Things within a given area that should be there. 
         * 
         * @param GameStarter
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaSpawn(GameStarter: GameStartr, direction: string, top: number, right: number, bottom: number, left: number): void {
            GameStarter.MapsHandler.spawnMap(
                direction,
                (top + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (right + GameStarter.MapScreener.left) / GameStarter.unitsize,
                (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (left + GameStarter.MapScreener.left) / GameStarter.unitsize
            );
        }

        /**
         * "Unspawns" all Things within a given area that should be gone by marking
         * their PreThings as not in game.
         * 
         * @param GameStarter
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaUnspawn(GameStarter: GameStartr, direction: string, top: number, right: number, bottom: number, left: number): void {
            GameStarter.MapsHandler.unspawnMap(
                direction,
                (top + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (right + GameStarter.MapScreener.left) / GameStarter.unitsize,
                (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (left + GameStarter.MapScreener.left) / GameStarter.unitsize
            );
        }

        /**
         * Adds a new Thing to the game at a given position, relative to the top
         * left corner of the screen. 
         * 
         * @param thingRaw   What type of Thing to add. This may be a String of
         *                           the class title, an Array containing the String
         *                           and an Object of settings, or an actual Thing.
         * @param left   The horizontal point to place the Thing's left at (by default, 0).
         * @param top   The vertical point to place the Thing's top at (by default, 0).
         */
        addThing(thingRaw: string | IThing | any[], left: number = 0, top: number = 0): IThing {
            var thing: IThing;

            if (typeof thingRaw === "string" || thingRaw instanceof String) {
                thing = this.ObjectMaker.make(<string>thingRaw);
            } else if (thingRaw.constructor === Array) {
                thing = this.ObjectMaker.make.apply(this.ObjectMaker, <any[]>thingRaw);
            } else {
                thing = <IThing>thingRaw;
            }

            if (arguments.length > 2) {
                thing.GameStarter.setLeft(thing, left);
                thing.GameStarter.setTop(thing, top);
            } else if (arguments.length > 1) {
                thing.GameStarter.setLeft(thing, left);
            }

            thing.GameStarter.updateSize(thing);

            thing.GameStarter.GroupHolder.getFunctions().add[thing.groupType](thing);
            thing.placed = true;

            // This will typically be a TimeHandler.cycleClass call
            if (thing.onThingAdd) {
                thing.onThingAdd(thing);
            }

            thing.GameStarter.PixelDrawer.setThingSprite(thing);

            // This will typically be a spawn* call
            if (thing.onThingAdded) {
                thing.onThingAdded(thing);
            }

            thing.GameStarter.ModAttacher.fireEvent("onAddThing", thing, left, top);

            return thing;
        }

        /**
         * Processes a Thing so that it is ready to be placed in gameplay. There are
         * a lot of steps here: width and height must be set with defaults and given
         * to spritewidth and spriteheight, a quadrants Array must be given, the 
         * sprite must be set, attributes and onThingMake called upon, and initial
         * class cycles and flipping set.
         * 
         * @param thing
         * @param title   What type Thing this is (the name of the class).
         * @param settings   Additional settings to be given to the Thing.
         * @param defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void {
            var maxQuads: number = 4,
                num: number,
                cycle: any;

            // If the Thing doesn't specify its own title, use the type by default
            thing.title = thing.title || title;

            // If a width/height is provided but no spritewidth/height,
            // use the default spritewidth/height
            if (thing.width && !thing.spritewidth) {
                thing.spritewidth = defaults.spritewidth || defaults.width;
            }
            if (thing.height && !thing.spriteheight) {
                thing.spriteheight = defaults.spriteheight || defaults.height;
            }

            // Each thing has at least 4 maximum quadrants for the QuadsKeepr
            num = Math.floor(
                thing.width * (
                    thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantWidth()
                )
            );
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            num = Math.floor(thing.height * thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantHeight());
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            thing.maxquads = maxQuads;
            thing.quadrants = new Array(maxQuads);

            // Basic sprite information
            thing.spritewidth = thing.spritewidth || thing.width;
            thing.spriteheight = thing.spriteheight || thing.height;

            // Sprite sizing
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;

            // Canvas, context, imageData
            thing.canvas = thing.GameStarter.createCanvas(
                thing.spritewidthpixels, thing.spriteheightpixels
            );
            thing.context = <CanvasRenderingContext2D>thing.canvas.getContext("2d");
            thing.imageData = thing.context.getImageData(0, 0, thing.spritewidthpixels, thing.spriteheightpixels);

            if (thing.opacity !== 1) {
                thing.GameStarter.setOpacity(thing, thing.opacity);
            }

            // Attributes, such as Koopa.smart
            if (thing.attributes) {
                thing.GameStarter.thingProcessAttributes(thing, thing.attributes);
            }

            // Important custom functions
            if (thing.onThingMake) {
                thing.onThingMake(thing, settings);
            }

            // Initial class / sprite setting
            thing.GameStarter.setSize(thing, thing.width, thing.height);
            thing.GameStarter.setClassInitial(thing, thing.name || thing.title);

            // Sprite cycles
            if (thing.spriteCycle) {
                cycle = thing.spriteCycle;
                thing.GameStarter.TimeHandler.addClassCycle(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }
            if (cycle = thing.spriteCycleSynched) {
                thing.GameStarter.TimeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }

            // flipHoriz and flipVert initially 
            if (thing.flipHoriz) {
                thing.GameStarter.flipHoriz(thing);
            }
            if (thing.flipVert) {
                thing.GameStarter.flipVert(thing);
            }

            // Mods!
            thing.GameStarter.ModAttacher.fireEvent("onThingMake", thing.GameStarter, thing, title, settings, defaults);
        }

        /**
         * Processes additional Thing attributes. For each attribute the Thing's
         * class says it may have, if it has it, the attribute's key is appeneded to
         * the Thing's name and the attribute value proliferated onto the Thing.
         * 
         * @param thing
         * @param attributes   A lookup of attributes that may be added to the Thing's class.
         */
        thingProcessAttributes(thing: IThing, attributes: { [i: string]: string }): void {
            var attribute: string;

            // For each listing in the attributes...
            for (attribute in attributes) {
                // If the thing has that attribute as true:
                if (thing[attribute]) {
                    // Add the extra options
                    thing.GameStarter.proliferate(thing, attributes[attribute]);

                    // Also add a marking to the name, which will go into the className
                    if (thing.name) {
                        thing.name += " " + attribute;
                    } else {
                        thing.name = thing.title + " " + attribute;
                    }
                }
            }
        }

        /**
         * Runs through commands generated by a WorldSeedr and evaluates all of 
         * to create PreThings via MapsCreator.analyzePreSwitch. 
         * 
         * @param GameStarter
         * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
         */
        mapPlaceRandomCommands(GameStarter: GameStartr, generatedCommands: WorldSeedr.ICommand[]): void {
            var MapsCreator: MapsCreatr.IMapsCreatr = GameStarter.MapsCreator,
                MapsHandler: MapsHandlr.IMapsHandlr = GameStarter.MapsHandler,
                prethings: { [i: string]: MapsCreatr.IPreThing[] } = MapsHandler.getPreThings(),
                area: MapsCreatr.IMapsCreatrArea = MapsHandler.getArea(),
                map: MapsCreatr.IMapsCreatrMap = MapsHandler.getMap(),
                command: WorldSeedr.ICommand,
                output: any,
                i: number;

            for (i = 0; i < generatedCommands.length; i += 1) {
                command = generatedCommands[i];

                output = {
                    "thing": command.title,
                    "x": command.left,
                    "y": command.top
                };

                if (command.arguments) {
                    GameStarter.proliferateHard(output, command.arguments, true);
                }

                MapsCreator.analyzePreSwitch(output, prethings, area, map);
            }
        }

        /**
         * Triggered Function for when the game is unpaused. Music resumes, and
         * the mod event is fired.
         * 
         * @param GameStartr
         */
        onGamePlay(GameStarter: GameStartr): void {
            GameStarter.AudioPlayer.resumeAll();
            GameStarter.ModAttacher.fireEvent("onGamePlay");
        }

        /**
         * Triggered Function for when the game is paused. Music stops, and the
         * mod event is fired.
         * 
         * @param GameStartr
         */
        onGamePause(GameStarter: GameStartr): void {
            GameStarter.AudioPlayer.pauseAll();
            GameStarter.ModAttacher.fireEvent("onGamePause");
        }

        /**
         * Checks whether inputs can be fired, which by default is always true.
         * 
         * @param GameStartr
         */
        canInputsTrigger(GameStarter: GameStartr): boolean {
            return true;
        }

        /**
         * Generic Function to start the game. Nothing actually happens here.
         */
        gameStart(): void {
            this.ModAttacher.fireEvent("onGameStart");
        }


        /* Physics & similar
        */

        /**
         * Generically kills a Thing by setting its alive to false, hidden to true,
         * and clearing its movement.
         * 
         * @param thing
         */
        killNormal(thing: IThing): void {
            if (!thing) {
                return;
            }

            thing.alive = false;
            thing.hidden = true;
            thing.movement = undefined;
        }

        /** 
         * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
         * to redraw the Thing and its quadrant.
         * 
         * @param thing
         */
        markChanged(thing: IThing): void {
            thing.changed = true;
        }

        /**
         * Shifts a Thing vertically using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         * 
         * @param thing
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by 
         *                     default, false).
         */
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void {
            EightBittr.EightBittr.prototype.shiftVert(thing, dy);

            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Shifts a Thing horizontally using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         * 
         * @param thing
         * @param dx
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void {
            EightBittr.EightBittr.prototype.shiftHoriz(thing, dx);

            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Sets a Thing's top using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         * 
         * @param thing
         * @param top
         */
        setTop(thing: IThing, top: number): void {
            EightBittr.EightBittr.prototype.setTop(thing, top);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's right using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         * 
         * @param thing
         * @param right
         */
        setRight(thing: IThing, right: number): void {
            EightBittr.EightBittr.prototype.setRight(thing, right);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         * 
         * @param thing
         * @param bottom
         */
        setBottom(thing: IThing, bottom: number): void {
            EightBittr.EightBittr.prototype.setBottom(thing, bottom);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's left using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         * 
         * @param thing
         * @param left
         */
        setLeft(thing: IThing, left: number): void {
            EightBittr.EightBittr.prototype.setLeft(thing, left);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Shifts a thing both horizontally and vertically. If the Thing marks 
         * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
         * proportion of movement is respected (.5 = half, etc.).
         * 
         * @param thing
         * @param dx
         * @param dy
         * @param notChanged   Whether to skip marking the Thing as changed (by 
         *                     default, false).
         */
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void {
            dx = dx || 0;
            dy = dy || 0;

            if (!thing.noshiftx) {
                if (thing.parallaxHoriz) {
                    thing.GameStarter.shiftHoriz(thing, thing.parallaxHoriz * dx, notChanged);
                } else {
                    thing.GameStarter.shiftHoriz(thing, dx, notChanged);
                }
            }

            if (!thing.noshifty) {
                if (thing.parallaxVert) {
                    thing.GameStarter.shiftVert(thing, thing.parallaxVert * dy, notChanged);
                } else {
                    thing.GameStarter.shiftVert(thing, dy, notChanged);
                }
            }
        }

        /**
         * Calls shiftBoth on all members of an Array.
         * 
         * @param dx
         * @param dy
         * @param notChanged   Whether to skip marking the Thing as changed (by 
         *                     default, false).
         */
        shiftThings(things: IThing[], dx: number, dy: number, notChanged?: boolean): void {
            for (var i: number = things.length - 1; i >= 0; i -= 1) {
                things[i].GameStarter.shiftBoth(things[i], dx, dy, notChanged);
            }
        }

        /**
         * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
         * 
         * @this {EightBittr}
         * @param dx
         * @param dy
         */
        shiftAll(dx: number, dy: number): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this);
            GameStarter.GroupHolder.callAll(GameStarter, GameStarter.shiftThings, dx, dy, true);
        }

        /**
         * Sets the width and unitwidth of a Thing, and optionally updates the
         * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         * 
         * @param thing
         * @param width
         * @param updateSprite   Whether to update the Thing's spritewidth and 
         *                       spritewidthpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by 
         *                     default, false).
         */
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.width = width;
            thing.unitwidth = width * thing.GameStarter.unitsize;

            if (updateSprite) {
                thing.spritewidth = width;
                thing.spritewidthpixels = width * thing.GameStarter.unitsize;
            }

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }

            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets the height and unitheight of a Thing, and optionally updates the
         * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         * 
         * @param thing
         * @param height
         * @param updateSprite   Whether to update the Thing's spriteheight and
         *                       spriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by 
         *                     default, false).
         */
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.height = height;
            thing.unitheight = height * thing.GameStarter.unitsize;

            if (updateSprite) {
                thing.spriteheight = height;
                thing.spriteheightpixels = height * thing.GameStarter.unitsize;
            }

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }

            thing.GameStarter.markChanged(thing);
        }

        /**
         * Utility to call both setWidth and setHeight on a Thing.
         * 
         * @param thing
         * @param width
         * @param height
         * @param updateSprite   Whether to update the Thing's spritewidth,
         *                       spriteheight, spritewidthpixels, and
         *                       spritspriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by 
         *                     default, false).
         */
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.GameStarter.setWidth(thing, width, updateSprite, updateSize);
            thing.GameStarter.setHeight(thing, height, updateSprite, updateSize);
        }

        /**
         * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
         * shiftHoriz and shiftVert.
         * 
         * @param thing
         */
        updatePosition(thing: IThing): void {
            thing.GameStarter.shiftHoriz(thing, thing.xvel);
            thing.GameStarter.shiftVert(thing, thing.yvel);
        }

        /**
         * Completely updates the size measurements of a Thing. That means the
         * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
         * spriteheightpixels attributes. The Thing's sprite is then updated by the
         * PixelDrawer, and its appearance is marked as changed.
         * 
         * @param thing
         */
        updateSize(thing: IThing): void {
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;

            thing.canvas.width = thing.spritewidthpixels;
            thing.canvas.height = thing.spriteheightpixels;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);

            thing.GameStarter.markChanged(thing);
        }

        /**
         * Reduces a Thing's width by pushing back its right and decreasing its 
         * width. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dx
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void {
            thing.right -= dx;
            thing.width -= dx / thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its 
         * height. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dy
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void {
            thing.top += dy;
            thing.height -= dy / thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its 
         * height. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dy
         * @param updateSize   Whether to also call updateSize on the Thing 
         *                     (by default, false).
         */
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void {
            thing.top -= dy;
            thing.height += dy / thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Increases a Thing's width by pushing forward its right and decreasing its 
         * width. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dx
         * @param updateSize   Whether to also call updateSize on the Thing 
         *                     (by default, false).
         */
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void {
            thing.right += dx;
            thing.width += dx / thing.GameStarter.unitsize;
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Completely pauses a Thing by setting its velocities to zero and disabling
         * it from falling, colliding, or moving. Its old attributes for those are
         * saved so thingResumeVelocity may restore them.
         * 
         * @param thing
         * @param keepMovement   Whether to keep movement instead of wiping it
         *                      (by default, false).
         */
        thingPauseVelocity(thing: IThing, keepMovement?: boolean): void {
            thing.xvelOld = thing.xvel || 0;
            thing.yvelOld = thing.yvel || 0;

            thing.nofallOld = thing.nofall || false;
            thing.nocollideOld = thing.nocollide || false;
            thing.movementOld = thing.movement || thing.movementOld;

            thing.nofall = thing.nocollide = true;
            thing.xvel = thing.yvel = 0;

            if (!keepMovement) {
                thing.movement = undefined;
            }
        }

        /**
         * Resumes a Thing's velocity and movements after they were paused by
         * thingPauseVelocity.
         * 
         * @param thing
         * @param noVelocity   Whether to skip restoring the Thing's velocity
         *                     (by default, false).
         */
        thingResumeVelocity(thing: IThing, noVelocity?: boolean): void {
            if (!noVelocity) {
                thing.xvel = thing.xvelOld || 0;
                thing.yvel = thing.yvelOld || 0;
            }

            thing.movement = thing.movementOld || thing.movement;
            thing.nofall = thing.nofallOld || false;
            thing.nocollide = thing.nocollideOld || false;
        }


        /* Appearance utilities
        */

        /**
         * Generates a key for a Thing based off the current area and the Thing's
         * basic attributes. This key should be used for PixelRender.get calls, to
         * cache the Thing's sprite.
         * 
         * @param thing
         * @returns A key that to identify the Thing's sprite.
         */
        generateObjectKey(thing: IThing): string {
            return thing.GameStarter.MapsHandler.getArea().setting
                + " " + thing.groupType + " "
                + thing.title + " " + thing.className;
        }

        /**
         * Sets the class of a Thing, sets the new sprite for it, and marks it as 
         * having changed appearance. The class is stored in the Thing's internal
         * .className attribute.
         * 
         * @param thing
         * @param className   The new internal .className for the Thing.
         */
        setClass(thing: IThing, className: string): void {
            thing.className = className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * A version of setClass to be used before the Thing's sprite attributes
         * have been set. This just sets the internal .className.
         * 
         * @param thing
         * @param className   The new internal .className for the Thing.
         */
        setClassInitial(thing: IThing, className: string): void {
            thing.className = className;
        }

        /**
         * Adds a string to a Thing's class after a ' ', updates the Thing's 
         * sprite, and marks it as having changed appearance.
         * 
         * @param thing
         * @param className   A class to add to the Thing.
         */
        addClass(thing: IThing, className: string): void {
            thing.className += " " + className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Adds multiple strings to a Thing's class after a " ", updates the Thing's 
         * sprite, and marks it as having changed appearance. Strings may be given 
         * as Arrays or Strings; Strings will be split on " ". Any number of 
         * additional arguments may be given.
         * 
         * @param thing
         * @param classes   Any number of classes to add to the Thing.
         */
        addClasses(thing: IThing, ...classes: (string | string[])[]): void {
            var adder: string | string[],
                i: number,
                j: number;

            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];

                if (adder.constructor === String || typeof adder === "string") {
                    adder = (<string>adder).split(" ");
                }

                for (j = adder.length - 1; j >= 0; j -= 1) {
                    thing.GameStarter.addClass(thing, adder[j]);
                }
            }
        }

        /**
         * Removes a string from a Thing's class, updates the Thing's sprite, and
         * marks it as having changed appearance.
         * 
         * @param thing
         * @param className   A class to remove from the Thing.
         */
        removeClass(thing: IThing, className: string): void {
            if (!className) {
                return;
            }
            if (className.indexOf(" ") !== -1) {
                thing.GameStarter.removeClasses(thing, className);
            }
            thing.className = thing.className.replace(new RegExp(" " + className, "gm"), "");
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
        }

        /**
         * Removes multiple strings from a Thing's class, updates the Thing's 
         * sprite, and marks it as having changed appearance. Strings may be given 
         * as Arrays or Strings; Strings will be split on " ". Any number of 
         * additional arguments may be given.
         * 
         * @param thing
         * @param classes   Any number of classes to remove from the Thing.
         */
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void {
            var adder: string | string[],
                i: number,
                j: number;

            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];

                if (adder.constructor === String || typeof adder === "string") {
                    adder = (<string>adder).split(" ");
                }

                for (j = adder.length - 1; j >= 0; --j) {
                    thing.GameStarter.removeClass(thing, adder[j]);
                }
            }
        }

        /**
         * @param thing
         * @param className   A class to check for in the Thing.
         * @returns  Whether the Thing's class contains the class.
         */
        hasClass(thing: IThing, className: string): boolean {
            return thing.className.indexOf(className) !== -1;
        }

        /**
         * Removes the first class from a Thing and adds the second. All typical
         * sprite updates are called.
         * 
         * @param thing
         * @param classNameOut   A class to remove from the Thing.
         * @param classNameIn   A class to add to the thing.
         */
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void {
            thing.GameStarter.removeClass(thing, classNameOut);
            thing.GameStarter.addClass(thing, classNameIn);
        }

        /**
         * Marks a Thing as being flipped horizontally by setting its .flipHoriz
         * attribute to true and giving it a "flipped" class.
         * 
         * @param
         */
        flipHoriz(thing: IThing): void {
            thing.flipHoriz = true;
            thing.GameStarter.addClass(thing, "flipped");
        }

        /**
         * Marks a Thing as being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         * 
         * @param
         */
        flipVert(thing: IThing): void {
            thing.flipVert = true;
            thing.GameStarter.addClass(thing, "flip-vert");
        }

        /**
         * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
         * attribute to false and giving it a "flipped" class.
         * 
         * @param
         */
        unflipHoriz(thing: IThing): void {
            thing.flipHoriz = false;
            thing.GameStarter.removeClass(thing, "flipped");
        }

        /**
         * Marks a Thing as not being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         * 
         * @param
         */
        unflipVert(thing: IThing): void {
            thing.flipVert = false;
            thing.GameStarter.removeClass(thing, "flip-vert");
        }

        /**
         * Sets the opacity of the Thing and marks its appearance as changed.
         * 
         * @param thing
         * @param opacity   A number in [0,1].
         */
        setOpacity(thing: IThing, opacity: number): void {
            thing.opacity = opacity;
            thing.GameStarter.markChanged(thing);
        }


        /* Miscellaneous utilities
        */

        /**
         * Ensures the current object is a GameStartr by throwing an error if it 
         * is not. This should be used for functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         * 
         * @param current   
         */
        ensureCorrectCaller(current: any): GameStartr {
            if (!(current instanceof GameStartr)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated GameStartr object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        }

        /**
         * Removes a Thing from an Array using Array.splice. If the thing has an 
         * onDelete, that is called.
         * 
         * @param thing
         * @param array
         * @param location   The index of the Thing in the Array, for speed's
         *                   sake (by default, it is found using Array.indexOf).
         */
        arrayDeleteThing(thing: IThing, array: any[], location: number = array.indexOf(thing)): void {
            if (location === -1) {
                return;
            }

            array.splice(location, 1);

            if (typeof (thing.onDelete) === "function") {
                thing.onDelete(thing);
            }
        }

        /**
         * Takes a snapshot of the current screen canvas by simulating a click event
         * on a dummy link.
         * 
         * @param name   A name for the image to be saved as.
         * @param format   A format for the image to be saved as (by default, png).
         * @remarks For security concerns, browsers won't allow this unless it's
         *          called within a callback of a genuine user-triggered event.
         */
        takeScreenshot(name: string, format: string = "image/png"): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this),
                link: HTMLLinkElement = <HTMLLinkElement>GameStarter.createElement("a", {
                    "download": name + "." + format.split("/")[1],
                    "href": GameStarter.canvas.toDataURL(format).replace(format, "image/octet-stream")
                });

            link.click();
        }

        /**
         * Adds a set of CSS styles to the page.
         * 
         * @param styles   CSS styles represented as JSON.
         */
        addPageStyles(styles: IPageStyles): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this),
                sheet: HTMLStyleElement = <HTMLStyleElement>GameStarter.createElement("style", {
                    "type": "text/css"
                }),
                compiled: string = "",
                i: string,
                j: string;

            for (i in styles) {
                if (!styles.hasOwnProperty(i)) {
                    continue;
                }

                compiled += i + " { \r\n";
                for (j in styles[i]) {
                    if (styles[i].hasOwnProperty(j)) {
                        compiled += "  " + j + ": " + styles[i][j] + ";\r\n";
                    }
                }
                compiled += "}\r\n";
            }

            if ((<any>sheet).styleSheet) {
                (<any>sheet).style.cssText = compiled;
            } else {
                sheet.appendChild(document.createTextNode(compiled));
            }

            document.querySelector("head").appendChild(sheet);
        }
    }
}
