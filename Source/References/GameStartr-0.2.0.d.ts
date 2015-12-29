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
         * Settings regarding map layouts, particularly for an IMapsCreatr and an IAreaSpawnr.
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
     * Settings regarding upkeep Functions, particularly for an IGroupHoldr.
     */
    export interface IGamesRunnrCustoms extends IGameStartrSettingsObject {
        /**
         * How often updates should be called.
         */
        interval?: number;

        /**
         * Functions to be run on every upkeep.
         */
        games: Function[]
    }

    /**
     * Settings regarding groups holding in-game Things, particularly for an IGroupHoldr.
     */
    export interface IGroupHoldrCustoms extends IGameStartrSettingsObject, GroupHoldr.IGroupHoldrSettings { }

    /**
     * Settings regarding keyboard and mouse inputs, particularly for an IInputWritr.
     */
    export interface IInputWritrCustoms extends IGameStartrSettingsObject {
        /**
         * Arguments to be directly passed to the InputWritr.
         */
        InputWritrArgs: InputWritr.IInputWritrSettings;
    }

    /**
     * Settings regarding persistent and temporary statistics, particularly for an IItemsHoldr.
     */
    export interface IItemsHoldrCustoms extends IGameStartrSettingsObject {
        /**
         * A prefix to add before IItemsValue keys.
         */
        prefix: string;
        
        /**
         * Whether an HTML container should be created to house the IItemValue elements.
         */
        doMakeContainer?: boolean;
        
        /**
         * Any hardcoded changes to element content, such as "INF" for Infinity.
         */
        displayChanges?: {
            [i: string]: string;
        };

        /**
         * An Array of elements as createElement arguments, outside-to-inside.
         */
        containersArguments: any[][];

        /**
         * Default attributes for all ItemValues.
         */
        defaults: {
            [i: string]: string;
        };
        
        /**
         * Initial item values (defaults) to store.
         */
        values: ItemsHoldr.IItemValueDefaults;
    }

    /**
     * Settings regarding the level editor, particularly for an ILevelEditr.
     */
    export interface ILevelEditrCustoms extends IGameStartrSettingsObject {
        blocksize?: number;
        mapDefault: MapsCreatr.IMapsCreatrMapRaw;
        mapSettingDefault: string;
        mapEntryDefault: string;
        prethings: {
            [i: string]: {
                [i: string]: any;
            }
        };
        thingGroups: string[];
        thingKeys: string[];
        macros: {
            [i: string]: {
                description: string;
                options: any;
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
        "onUnspawn"?: (prething: MapsCreatr.IPreThing) => void;
        "stretchAdd"?: (thing: string | MapsCreatr.IPreThingSettings, index: number) => void;
        "afterAdd"?: (thing: string | MapsCreatr.IPreThingSettings, index: number) => void;
        "macros": { [i: string]: MapsCreatr.IMapsCreatrMacro };
        "entrances": { [i: string]: MapsCreatr.IMapsCreatrEntrance };
        "patterns"?: any;
        "library": { [i: string]: IMapsCreatrMapRaw };
    }

    export interface IMapsCreatrMapRaw extends MapsCreatr.IMapsCreatrMapRaw {
        locationDefault: string;
        areas: {
            [i: string]: IMapsCreatrAreaRaw;
        };
    }

    export interface IMapsCreatrAreaRaw extends MapsCreatr.IMapsCreatrAreaRaw {
        background?: string;
    }

    export interface IMathDecidrCustoms extends IGameStartrSettingsObject, MathDecidr.IMathDecidrSettings { }

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
        AreaSpawner: AreaSpawnr.IAreaSpawnr;
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
        resetAreaSpawner(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
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
