/// <reference path="../typings/AreaSpawnr.d.ts" />
/// <reference path="../typings/AudioPlayr.d.ts" />
/// <reference path="../typings/ChangeLinr.d.ts" />
/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/EightBittr.d.ts" />
/// <reference path="../typings/FPSAnalyzr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/GroupHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/MathDecidr.d.ts" />
/// <reference path="../typings/ModAttachr.d.ts" />
/// <reference path="../typings/NumberMakr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/PixelDrawr.d.ts" />
/// <reference path="../typings/PixelRendr.d.ts" />
/// <reference path="../typings/QuadsKeepr.d.ts" />
/// <reference path="../typings/ScenePlayr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />
/// <reference path="../typings/ThingHittr.d.ts" />
/// <reference path="../typings/TimeHandlr.d.ts" />
/// <reference path="../typings/TouchPassr.d.ts" />
/// <reference path="../typings/WorldSeedr.d.ts" />
declare namespace GameStartr {
    /**
     * Extra CSS styles that may be added to a page.
     */
    interface IPageStyles {
        [i: string]: {
            [j: string]: string | number;
        };
    }
    /**
     * Settings to be passed in order to ITimeHandlr::addClassCycle.
     */
    interface ISpriteCycleSettings {
        /**
         * Classes to create a class cycling event.
         */
        0: TimeHandlr.ITimeCycleSettings;
        /**
         * An optional name to store the cycling event under.
         */
        1?: string;
        /**
         * An optional way to determine how long to wait between classes.
         */
        2?: number | TimeHandlr.INumericCalculator;
    }
    /**
     * Custom settings to initialize a new instance of the IGameStartr interface.
     */
    interface IGameStartrSettings extends EightBittr.IEightBittrSettings {
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
         * Options for mods that, if true, should be immediately enabled.
         */
        mods?: {
            [i: string]: boolean;
        };
        /**
         * Any additional styles that should be added to the page immediately.
         */
        style?: IPageStyles;
    }
    /**
     * Stored settings to be stored separately and kept within a GameStartr.
     */
    interface IGameStartrStoredSettings {
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
         * Settings regarding maps, particularly for an IAreaSpawnr, an
         * IMapScreenr, and an IMapsCreatr.
         */
        maps: IMapCustoms;
        /**
         * Settings regarding math equations, particularly for an IMathDecidr.
         */
        math: IMathDecidrCustoms;
        /**
         * Settings regarding mods, particularly for an IModAttachr.
         */
        mods: IModAttachrCustoms;
        /**
         * Settings regarding in-game object generation, particularly for an IObjectMakr.
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
         */
        items: IItemsHoldrCustoms;
        /**
         * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
         */
        touch: ITouchPassrCustoms;
        /**
         * Any other settings for a GameStartr generally inherit from IGameStartrSettingsObject.
         */
        [i: string]: IGameStartrSettingsObject;
    }
    /**
     * Each settings file contains an Object that has its contents passed to the
     * corresponding module, either directly or via a partial copy.
     */
    interface IGameStartrSettingsObject {
        [i: string]: any;
    }
    /**
     * Settings regarding audio playback, particularly for an IAudioPlayr.
     */
    interface IAudioPlayrCustoms extends IGameStartrSettingsObject {
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
        library: AudioPlayr.ILibrarySettings;
    }
    /**
     * Settings regarding device input detection, particularly for an IDeviceLayr.
     */
    interface IDeviceLayrCustoms extends IGameStartrSettingsObject {
    }
    /**
     * Settings regarding upkeep Functions, particularly for an IGroupHoldr.
     */
    interface IGamesRunnrCustoms extends IGameStartrSettingsObject {
        /**
         * How often updates should be called.
         */
        interval?: number;
        /**
         * Functions to be run on every upkeep.
         */
        games: Function[];
    }
    /**
     * Settings regarding groups holding in-game Things, particularly for an IGroupHoldr.
     */
    interface IGroupHoldrCustoms extends IGameStartrSettingsObject, GroupHoldr.IGroupHoldrSettings {
    }
    /**
     * Settings regarding keyboard and mouse inputs, particularly for an IInputWritr.
     */
    interface IInputWritrCustoms extends IGameStartrSettingsObject {
        /**
         * Arguments to be directly passed to the InputWritr.
         */
        InputWritrArgs: InputWritr.IInputWritrSettings;
    }
    /**
     * Settings regarding persistent and temporary statistics, particularly for an IItemsHoldr.
     */
    interface IItemsHoldrCustoms extends IGameStartrSettingsObject {
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
     * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
     * and MapsCreatr.
     */
    interface IMapCustoms extends IGameStartrSettingsObject {
        /**
         * The names of groups Things may be in.
         */
        groupTypes: string[];
        /**
         * A default map to spawn in initially.
         */
        mapDefault: string;
        /**
         * A default map to spawn in initially.
         */
        locationDefault: string;
        /**
         * Function for when a PreThing is to be spawned.
         *
         * @param prething   A PreThing entering the map.
         */
        onSpawn?: (prething: MapsCreatr.IPreThing) => void;
        /**
         * Function for when a PreThing is to be un-spawned.
         *
         * @param prething   A PreThing leaving the map.
         */
        onUnspawn?: (prething: MapsCreatr.IPreThing) => void;
        /**
         * Whether Locations must have an entrance Function defined by "entry" (by
         * default, false).
         */
        requireEntrance?: boolean;
        /**
         * Any property names to copy from Areas to MapScreenr.
         */
        screenAttributes?: string[];
        /**
         * A mapping of Functions to generate member variables that should be
         * recomputed on screen change, keyed by variable name.
         */
        screenVariables?: MapScreenr.IVariableFunctions;
        /**
         * If stretches exists, a Function to add stretches to an Area.
         */
        stretchAdd?: AreaSpawnr.ICommandAdder;
        /**
         * If afters exists, a Function to add afters to an Area.
         */
        afterAdd?: AreaSpawnr.ICommandAdder;
        /**
         * Macro functions to create PreThings, keyed by String alias.
         */
        macros: {
            [i: string]: MapsCreatr.IMacro;
        };
        /**
         * Allowed entrance Functions, keyed by string alias.
         */
        entrances: {
            [i: string]: MapsCreatr.IEntrance;
        };
        /**
         * Known map Objects, keyed by name.
         */
        library: {
            [i: string]: IMapRaw;
        };
    }
    /**
     * A raw JSON-friendly description of a map.
     */
    interface IMapRaw extends MapsCreatr.IMapRaw {
        /**
         * A default location to spawn into.
         */
        locationDefault: number | string;
        /**
         * Descriptions of areas within the map.
         */
        areas: {
            [i: string]: IAreaRaw;
        };
    }
    /**
     * A raw JSON-friendly description of a map area.
     */
    interface IAreaRaw extends MapsCreatr.IAreaRaw {
        /**
         * A background color for the area, if not the default for the setting.
         */
        background?: string;
    }
    /**
     * Settings regarding math equations, particularly for an IMathDecidr.
     */
    interface IMathDecidrCustoms extends IGameStartrSettingsObject, MathDecidr.IMathDecidrSettings {
    }
    /**
     * Settings regarding mods, particularly for an IModAttachr.
     */
    interface IModAttachrCustoms extends IGameStartrSettingsObject {
        /**
         * Whether mod statuses should be stored locally by default.
         */
        storeLocally?: boolean;
        /**
         * Descriptions of available mods.
         */
        mods: ModAttachr.IMod[];
    }
    /**
     * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
     */
    interface IPixelDrawrCustoms extends IGameStartrSettingsObject {
        /**
         * Names of groups to refill.
         */
        groupNames: string[];
        /**
         * The maximum size of a SpriteMultiple to pre-render.
         */
        spriteCacheCutoff?: number;
    }
    /**
     * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
     */
    interface IPixelRendrCustoms extends IGameStartrSettingsObject {
        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * vertically (by default, "flip-vert").
         */
        flipVert?: string;
        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * horizontally (by default, "flip-vert").
         */
        flipHoriz?: string;
        /**
         * What key in attributions should contain sprite widths (by default,
         * "spriteWidth").
         */
        spriteWidth?: string;
        /**
         * What key in attributions should contain sprite heights (by default,
         * "spriteHeight").
         */
        spriteHeight?: string;
        /**
         * The palette of colors to use for sprites. This should be a number[][]
         * of RGBA values.
         */
        paletteDefault: number[][];
        /**
         * A nested library of sprites to process.
         */
        library?: any;
        /**
         * Filters that may be used by sprites in the library.
         */
        filters?: PixelRendr.IFilterContainer;
    }
    /**
     * Settings regarding in-game object generation, particularly for an IObjectMakr.
     */
    interface IObjectMakrCustoms extends IGameStartrSettingsObject, ObjectMakr.IObjectMakrSettings {
    }
    /**
     * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
     */
    interface IQuadsKeeprCustoms extends IGameStartrSettingsObject {
        /**
         * How many QuadrantRows to keep at a time.
         */
        numRows: number;
        /**
         * How many QuadrantCols to keep at a time.
         */
        numCols: number;
        /**
         * The groups Things may be placed into within Quadrants.
         */
        groupNames: string[];
    }
    /**
     * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
     */
    interface IScenePlayrCustoms extends IGameStartrSettingsObject {
    }
    /**
     * Settings regarding collision detection, particularily for an IThingHittr.
     */
    interface IThingHittrCustoms extends IGameStartrSettingsObject, ThingHittr.IThingHittrSettings {
    }
    /**
     * Settings regarding timed events, particularly for an ITimeHandlr.
     */
    interface ITimeHandlrCustoms extends IGameStartrSettingsObject {
        /**
         * The default time separation between events in cycles (by default, 1).
         */
        timingDefault?: number;
        /**
         * Attribute name to store listings of cycles in objects (by default,
         * "cycles").
         */
        keyCycles?: string;
        /**
         * Atribute name to store class name in objects (by default, "className").
         */
        keyClassName?: string;
        /**
         * Key to check for a callback before a cycle starts in objects (by default,
         * "onClassCycleStart").
         */
        keyOnClassCycleStart?: string;
        /**
         * Key to check for a callback after a cycle starts in objects (by default,
         * "doClassCycleStart").
         */
        keyDoClassCycleStart?: string;
        /**
         * Optional attribute to check for whether a cycle may be given to an
         * object (if not given, ignored).
         */
        keyCycleCheckValidity?: string;
        /**
         * Whether a copy of settings should be made in setClassCycle.
         */
        copyCycleSettings?: boolean;
    }
    /**
     * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
     */
    interface ITouchPassrCustoms extends IGameStartrSettingsObject, TouchPassr.ITouchPassrSettings {
    }
    /**
     * Settings regarding map generation, particularly for an IWorldSeedr.
     */
    interface IWorldSeedrCustoms extends IGameStartrSettingsObject {
        /**
         * The possibilities that can appear in random maps.
         */
        possibilities: WorldSeedr.IPossibilityContainer;
    }
    /**
     * A standard in-game thing, with size, velocity, position, and other information.
     */
    interface IThing extends EightBittr.IThing, MapsCreatr.IThing, PixelDrawr.IThing, ThingHittr.IThing, TimeHandlr.IThing {
        /**
         * Whether this is currently alive and well.
         */
        alive: boolean;
        /**
         * A search query for a PixelDrawr sprite to represent this Thing visually.
         */
        className: string;
        /**
         * Whether this has had its appearance and/or position changed since the last
         * game upkeep.
         */
        changed: boolean;
        /**
         * Which group this Thing is a member of.
         */
        groupType: string;
        /**
         * The maximum number of quadrants this can be a part of, based on size.
         */
        maxquads: number;
        /**
         * An additional name to add to the Thing's .className.
         */
        name?: string;
        /**
         * Whether this has been placed into the game.
         */
        placed?: boolean;
        /**
         * A storage container for Quadrants this Thing may be in.
         */
        quadrants: QuadsKeepr.IQuadrant<IThing>[];
        /**
         * Any additional attributes triggered by thingProcessAttributes.
         */
        attributes?: any;
        /**
         * A sprite cycle to start upon spawning.
         */
        spriteCycle?: ISpriteCycleSettings;
        /**
         * A synched sprite cycle to start upon spawning.
         */
        spriteCycleSynched?: ISpriteCycleSettings;
        /**
         * Scratch horizontal velocity for pausing movement.
         */
        xvelOld?: number;
        /**
         * Scratch vertical velocity for pausing movement.
         */
        yvelOld?: number;
        /**
         * A horizontal multiplier for scrolling, if not 1 (no change).
         */
        parallaxHoriz?: number;
        /**
         * A vertical multiplier for scrolling, if not 1 (no change).
         */
        parallaxVert?: number;
        /**
         * Whether this is currently flipped horizontally.
         */
        flipHoriz?: boolean;
        /**
         * Whether this is currently flipped vertically.
         */
        flipVert?: boolean;
        /**
         * Whether this is allowed to scroll horizontally.
         */
        noshiftx?: boolean;
        /**
         * Whether this is allowed to scroll vertically.
         */
        noshifty?: boolean;
        /**
         * A Function to move during an upkeep event.
         */
        movement?: Function;
        /**
         * What to call when this is added to the active pool of Things (during
         * thingProcess), before sizing is set.
         */
        onThingMake?: Function;
        /**
         * What to call when this is added to the active pool of Things (during
         * thingProcess), before the sprite is set.
         */
        onThingAdd?: (thing: IThing) => void;
        /**
         * What to call when this is added to the active pool of Things (during
         * thingProcess), after the sprite is set.
         */
        onThingAdded?: (thing: IThing) => void;
        /**
         * What to call when this is deleted from its Things group.
         */
        onDelete?: Function;
    }
    /**
     * A general-use game engine for 2D 8-bit games.
     */
    abstract class GameStartr extends EightBittr.EightBittr {
        /**
         * Loads GameStartr maps to spawn and unspawn areas on demand.
         */
        AreaSpawner: AreaSpawnr.IAreaSpawnr;
        /**
         * An audio library to automate preloading and controlled playback of multiple
         * audio tracks, with support for different browsers' preferred file types.
         */
        AudioPlayer: AudioPlayr.IAudioPlayr;
        /**
         * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
         */
        DeviceLayer: DeviceLayr.IDeviceLayr;
        /**
         * Storage and analysis for framerate measurements.
         */
        FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;
        /**
         * Runs a series of callbacks on a timed interval.
         */
        GamesRunner: GamesRunnr.IGamesRunnr;
        /**
         * A general storage abstraction for keyed containers of items.
         */
        GroupHolder: GroupHoldr.IGroupHoldr;
        /**
         * A configurable wrapper, recorder, and playback manager around user inputs.
         */
        InputWriter: InputWritr.IInputWritr;
        /**
         * A versatile container to store and manipulate values in localStorage, and
         * optionally keep an updated HTML container showing these values.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        /**
         * A typed MersenneTwister, which is a state-based random number generator.
         * Options exist for changing or randomizing state and producing random
         * booleans, integers, and real numbers.
         */
        NumberMaker: NumberMakr.INumberMakr;
        /**
         * Storage container and lazy loader for GameStartr maps that is the back-end
         * counterpart to MapsHandlr. Maps are created with their custom Location and
         * Area members, which are initialized the first time the map is retrieved.
         */
        MapsCreator: MapsCreatr.IMapsCreatr;
        /**
         * A simple container for Map attributes given by switching to an Area within
         * that map. A bounding box of the current viewport is kept, along with a bag
         * of assorted variable values.
         */
        MapScreener: MapScreenr.IMapScreenr;
        /**
         * A computation utility to automate running common equations with access
         * to a set of constant values.
         */
        MathDecider: MathDecidr.IMathDecidr;
        /**
         * Hookups for extensible triggered mod events.
         */
        ModAttacher: ModAttachr.IModAttachr;
        /**
         * A abstract factory for dynamic attribute-based JavaScript classes.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;
        /**
         * A front-end to PixelRendr to automate drawing mass amounts of sprites.
         */
        PixelDrawer: PixelDrawr.IPixelDrawr;
        /**
         * Compresses images into text blobs in real time with fast cached lookups.
         */
        PixelRender: PixelRendr.IPixelRendr;
        /**
         * Adjustable quadrant-based collision detection.
         */
        QuadsKeeper: QuadsKeepr.IQuadsKeepr<IThing>;
        /**
         * A cutscene runner for jumping between scenes and their routines.
         */
        ScenePlayer: ScenePlayr.IScenePlayr;
        /**
         * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
         * Functions for checking whether a Thing may collide, checking whether it collides
         * with another Thing, and reacting to a collision are generated and cached for
         * each Thing type, based on the overarching Thing groups.
         */
        ThingHitter: ThingHittr.IThingHittr;
        /**
         * A flexible, pausable alternative to setTimeout.
         */
        TimeHandler: TimeHandlr.ITimeHandlr;
        /**
         * A GUI touch layer layer on top of InputWritr that provides an extensible
         * API for adding touch-based control elements into an HTML element.
         */
        TouchPasser: TouchPassr.ITouchPassr;
        /**
         * A randomization utility to automate random, recursive generation of
         * possibilities based on position and probability schemas.
         */
        WorldSeeder: WorldSeedr.IWorldSeedr;
        /**
         * Graphics functions used by this instance.
         */
        graphics: Graphics<GameStartr>;
        /**
         * Gameplay functions used by this instance.
         */
        gameplay: Gameplay<GameStartr>;
        /**
         * Maps functions used by this instance.
         */
        maps: Maps<GameStartr>;
        /**
         * Physics functions used by this instance.
         */
        physics: Physics<GameStartr>;
        /**
         * Thing manipulation functions used by this instance.
         */
        things: Things<GameStartr>;
        /**
         * Scrolling functions used by this instance.
         */
        scrolling: Scrolling<GameStartr>;
        /**
         * Utility functions used by this instance.
         */
        utilities: Utilities<GameStartr>;
        /**
         * Settings for individual modules are stored as sub-Objects here.
         */
        settings: IGameStartrStoredSettings;
        /**
         * HTML container containing all game elements.
         */
        container: HTMLDivElement;
        /**
         * Canvas upon which the game's screen is constantly drawn.
         */
        canvas: HTMLCanvasElement;
        /**
         * How much to scale each pixel from PixelDrawr to the real canvas.
         */
        scale: number;
        /**
         * Initializes a new instance of the GameStartr class.
         *
         * @param settings   Any additional user-provided settings.
         */
        constructor(settings?: IGameStartrSettings);
        /**
         * Resets the major system modules.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetModules(settings: IGameStartrSettings): void;
        /**
         * Sets this.ObjectMaker.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetObjectMaker(settings: IGameStartrSettings): void;
        /**
         * Sets this.QuadsKeeper.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetQuadsKeeper(settings: IGameStartrSettings): void;
        /**
         * Sets this.PixelRender.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetPixelRender(settings: IGameStartrSettings): void;
        /**
         * Sets this.PixelDrawer.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetPixelDrawer(settings: IGameStartrSettings): void;
        /**
         * Sets this.TimeHandler.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetTimeHandler(settings: IGameStartrSettings): void;
        /**
         * Sets this.AudioPlayer.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetAudioPlayer(settings: IGameStartrSettings): void;
        /**
         * Sets this.GamesRunner.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetGamesRunner(settings: IGameStartrSettings): void;
        /**
         * Sets this.ItemsHolder.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetItemsHolder(settings: IGameStartrSettings): void;
        /**
         * Sets this.GroupHolder.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetGroupHolder(settings: IGameStartrSettings): void;
        /**
         * Sets this.ThingHitter.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetThingHitter(settings: IGameStartrSettings): void;
        /**
         * Sets this.MapScreener.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetMapScreener(settings: IGameStartrSettings): void;
        /**
         * Sets this.NumberMaker.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetNumberMaker(settings: IGameStartrSettings): void;
        /**
         * Sets this.MapCreator.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetMapsCreator(settings: IGameStartrSettings): void;
        /**
         * Sets this.AreaSpawner.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetAreaSpawner(settings: IGameStartrSettings): void;
        /**
         * Sets this.InputWriter.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetInputWriter(settings: IGameStartrSettings): void;
        /**
         * Sets this.DeviceLayer.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetDeviceLayer(settings: IGameStartrSettings): void;
        /**
         * Sets this.InputWriter.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetTouchPasser(settings: IGameStartrSettings): void;
        /**
         * Sets this.WorldSeeder.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetWorldSeeder(settings: IGameStartrSettings): void;
        /**
         * Sets this.ScenePlayer.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetScenePlayer(settings: IGameStartrSettings): void;
        /**
         * Sets this.MathDecider.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetMathDecider(settings: IGameStartrSettings): void;
        /**
         * Sets this.ModAttacher.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetModAttacher(settings: IGameStartrSettings): void;
        /**
         * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
         * is fired.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected startModAttacher(settings: IGameStartrSettings): void;
        /**
         * Resets the parent HTML container. Width and height are set by customs,
         * and canvas, ItemsHolder, and TouchPassr container elements are added.
         *
         * @param settings   Any additional user-provided settings.
         */
        protected resetContainer(settings: IGameStartrSettings): void;
    }
    /**
     * Gameplay functions used by IGameStartr instances.
     */
    class Gameplay<TIEightBittr extends GameStartr> extends EightBittr.Component<TIEightBittr> {
        /**
         * Triggered Function for when the game closes. The mod event is fired.
         */
        onClose(): void;
        /**
         * Triggered Function for when the game is unpaused. Music resumes, and
         * the mod event is fired.
         */
        onPlay(): void;
        /**
         * Triggered Function for when the game is paused. Music stops, and the
         * mod event is fired.
         */
        onPause(): void;
        /**
         * Checks whether inputs can be fired, which by default is always true.
         *
         * @returns Whether inputs can be fired, which is always true.
         */
        canInputsTrigger(): boolean;
        /**
         * Generic Function to start the game. Nothing actually happens here.
         */
        gameStart(): void;
    }
    /**
     * Graphics functions used by GameStartr instances.
     */
    class Graphics<TIEightBittr extends GameStartr> extends EightBittr.Component<TIEightBittr> {
        /**
         * Generates a key for a Thing based off the Thing's basic attributes.
         * This key should be used for PixelRender.get calls, to cache the Thing's
         * sprite.
         *
         * @param thing
         * @returns A key that to identify the Thing's sprite.
         */
        generateThingKey(thing: IThing): string;
        /**
         * Sets the class of a Thing, sets the new sprite for it, and marks it as
         * having changed appearance. The class is stored in the Thing's internal
         * .className attribute.
         *
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClass(thing: IThing, className: string): void;
        /**
         * A version of setClass to be used before the Thing's sprite attributes
         * have been set. This just sets the internal .className.
         *
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClassInitial(thing: IThing, className: string): void;
        /**
         * Adds a string to a Thing's class after a " ", updates the Thing's
         * sprite, and marks it as having changed appearance.
         *
         * @param thing
         * @param className   A class to add to the Thing.
         */
        addClass(thing: IThing, className: string): void;
        /**
         * Adds multiple strings to a Thing's class after a " ", updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param thing
         * @param classes   Any number of classes to add to the Thing.
         */
        addClasses(thing: IThing, ...classes: (string | string[])[]): void;
        /**
         * Removes a string from a Thing's class, updates the Thing's sprite, and
         * marks it as having changed appearance.
         *
         * @param thing
         * @param className   A class to remove from the Thing.
         */
        removeClass(thing: IThing, className: string): void;
        /**
         * Removes multiple strings from a Thing's class, updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param thing
         * @param classes   Any number of classes to remove from the Thing.
         */
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void;
        /**
         * @param thing
         * @param className   A class to check for in the Thing.
         * @returns  Whether the Thing's class contains the class.
         */
        hasClass(thing: IThing, className: string): boolean;
        /**
         * Removes the first class from a Thing and adds the second. All typical
         * sprite updates are called.
         *
         * @param thing
         * @param classNameOut   A class to remove from the Thing.
         * @param classNameIn   A class to add to the thing.
         */
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void;
        /**
         * Marks a Thing as being flipped horizontally by setting its .flipHoriz
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        flipHoriz(thing: IThing): void;
        /**
         * Marks a Thing as being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        flipVert(thing: IThing): void;
        /**
         * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
         * attribute to false and giving it a "flipped" class.
         *
         * @param thing
         */
        unflipHoriz(thing: IThing): void;
        /**
         * Marks a Thing as not being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        unflipVert(thing: IThing): void;
        /**
         * Sets the opacity of the Thing and marks its appearance as changed.
         *
         * @param thing
         * @param opacity   A number in [0,1].
         */
        setOpacity(thing: IThing, opacity: number): void;
    }
    /**
     * Maps functions used by IGameStartr instances.
     */
    abstract class Maps<TEightBittr extends GameStartr> extends EightBittr.Component<TEightBittr> {
        /**
         * Sets the current location.
         */
        abstract setLocation(...args: any[]): any;
        /**
         * Sets the current map.
         */
        abstract setMap(...args: any[]): any;
        /**
         * Spawns all Things within a given area that should be there.
         *
         * @param this
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaSpawn(direction: string, top: number, right: number, bottom: number, left: number): void;
        /**
         * "Unspawns" all Things within a given area that should be gone by marking
         * their PreThings as not in game.
         *
         * @param this
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaUnspawn(direction: string, top: number, right: number, bottom: number, left: number): void;
        /**
         * Runs through commands generated by a WorldSeedr and evaluates all of
         * to create PreThings via MapsCreator.analyzePreSwitch.
         *
         * @param this
         * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
         */
        placeRandomCommands(generatedCommands: WorldSeedr.ICommand[]): void;
    }
    /**
     * Scrolling functions used by GameStartr instances.
     */
    class Physics<TIEightBittr extends GameStartr> extends EightBittr.Physics<TIEightBittr> {
        /**
         * Generically kills a Thing by setting its alive to false, hidden to true,
         * and clearing its movement.
         *
         * @param thing
         */
        killNormal(thing: IThing): void;
        /**
         * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
         * to redraw the Thing and its quadrant.
         *
         * @param thing
         */
        markChanged(thing: IThing): void;
        /**
         * Shifts a Thing vertically using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param thing
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void;
        /**
         * Shifts a Thing horizontally using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param thing
         * @param dx   How far to shift the Thing horizontally.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void;
        /**
         * Sets a Thing's top using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param thing
         * @param top   A new top border for the Thing.
         */
        setTop(thing: IThing, top: number): void;
        /**
         * Sets a Thing's right using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param thing
         * @param right   A new right border for the Thing.
         */
        setRight(thing: IThing, right: number): void;
        /**
         * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param thing
         * @param bottom   A new bottom border for the Thing.
         */
        setBottom(thing: IThing, bottom: number): void;
        /**
         * Sets a Thing's left using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param thing
         * @param left   A new left border for the Thing.
         */
        setLeft(thing: IThing, left: number): void;
        /**
         * Shifts a thing both horizontally and vertically. If the Thing marks
         * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
         * proportion of movement is respected (.5 = half, etc.).
         *
         * @param thing
         * @param dx   How far to shift the Thing horizontally.
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void;
        /**
         * Calls shiftBoth on all members of an Array.
         *
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         * @param notChanged   Whether to skip marking the Things as changed (by
         *                     default, false).
         */
        shiftThings(things: IThing[], dx: number, dy: number, notChanged?: boolean): void;
        /**
         * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
         *
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         */
        shiftAll(dx: number, dy: number): void;
        /**
         * Sets the width and unitwidth of a Thing, and optionally updates the
         * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param thing
         * @param width   A new width for the Thing.
         * @param updateSprite   Whether to update the Thing's spritewidth and
         *                       spritewidthpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void;
        /**
         * Sets the height and unitheight of a Thing, and optionally updates the
         * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param thing
         * @param height   A new height for the Thing.
         * @param updateSprite   Whether to update the Thing's spriteheight and
         *                       spriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        /**
         * Utility to call both setWidth and setHeight on a Thing.
         *
         * @param thing
         * @param width   A new width for the Thing.
         * @param height   A new height for the Thing.
         * @param updateSprite   Whether to update the Thing's spritewidth,
         *                       spriteheight, spritewidthpixels, and
         *                       spritspriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        /**
         * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
         * shiftHoriz and shiftVert.
         *
         * @param thing
         */
        updatePosition(thing: IThing): void;
        /**
         * Completely updates the size measurements of a Thing. That means the
         * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
         * spriteheightpixels attributes. The Thing's sprite is then updated by the
         * PixelDrawer, and its appearance is marked as changed.
         *
         * @param thing
         */
        updateSize(thing: IThing): void;
        /**
         * Reduces a Thing's width by pushing back its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param thing
         * @param dx   How much to reduce the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param thing
         * @param dy   How much to reduce the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void;
        /**
         * Increases a Thing's width by pushing forward its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param thing
         * @param dx   How much to increase the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param thing
         * @param dy   How much to increase the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void;
    }
    /**
     * Scrolling functions used by GameStartr instances.
     */
    class Scrolling<TIEightBittr extends GameStartr> extends EightBittr.Component<TIEightBittr> {
        /**
         * Scrolls the game window by shifting all Things and checking for quadrant
         * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
         *
         * @param customs   Any optional custom settings.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollWindow(dx: number, dy?: number): void;
        /**
         * Scrolls everything but a single Thing.
         *
         * @param thing   The only Thing that shouldn't move on the screen.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollThing(thing: IThing, dx: number, dy?: number): void;
    }
    /**
     * Thing manipulation functions used by IGameStartr instances.
     */
    class Things<TEightBittr extends GameStartr> extends EightBittr.Component<TEightBittr> {
        /**
         * Adds a new Thing to the game at a given position, relative to the top
         * left corner of the screen.
         *
         * @param thingRaw   What type of Thing to add. This may be a String of
         *                   the class title, an Array containing the String
         *                   and an Object of settings, or an actual Thing.
         * @param left   The horizontal point to place the Thing's left at (by default, 0).
         * @param top   The vertical point to place the Thing's top at (by default, 0).
         */
        add(thingRaw: string | IThing | [string, any], left?: number, top?: number): IThing;
        /**
         * Processes a Thing so that it is ready to be placed in gameplay. There are
         * a lot of steps here: width and height must be set with defaults and given
         * to spritewidth and spriteheight, a quadrants Array must be given, the
         * sprite must be set, attributes and onThingMake called upon, and initial
         * class cycles and flipping set.
         *
         * @param thing   The Thing being processed.
         * @param title   What type Thing this is (the name of the class).
         * @param settings   Additional settings to be given to the Thing.
         * @param defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        process(thing: IThing, title: string, settings: any, defaults: any): void;
        /**
         * Processes additional Thing attributes. For each attribute the Thing's
         * class says it may have, if it has it, the attribute's key is appeneded to
         * the Thing's name and the attribute value proliferated onto the Thing.
         *
         * @param thing
         * @param attributes   A lookup of attributes that may be added to the Thing's class.
         */
        processAttributes(thing: IThing, attributes: {
            [i: string]: string;
        }): void;
    }
    /**
     * Miscellaneous utility functions used by GameStartr instances.
     */
    class Utilities<TIEightBittr extends GameStartr> extends EightBittr.Utilities<TIEightBittr> {
        /**
         * Removes a Thing from an Array using Array.splice. If the thing has an
         * onDelete, that is called.
         *
         * @param thing
         * @param array   The group containing the thing.
         * @param location   The index of the Thing in the Array, for speed's
         *                   sake (by default, it is found using Array.indexOf).
         */
        arrayDeleteThing(thing: IThing, array: IThing[], location?: number): void;
        /**
         * Takes a snapshot of the current screen canvas by simulating a click event
         * on a dummy link.
         *
         * @param name   A name for the image to be saved as.
         * @param format   A format for the image to be saved as (by default, png).
         * @remarks For security concerns, browsers won't allow this unless it's
         *          called within a callback of a genuine user-triggered event.
         */
        takeScreenshot(name: string, format?: string): void;
        /**
         * Adds a set of CSS styles to the page.
         *
         * @param styles   CSS styles represented as JSON.
         */
        addPageStyles(styles: IPageStyles): void;
    }
}
declare var module: any;
