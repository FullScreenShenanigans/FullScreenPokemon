import { AreaSpawnr } from "areaspawnr";
import { AudioPlayr } from "audioplayr";
import { component } from "babyioc";
import { BattleMovr } from "battlemovr";
import { EightBittr, IComponentSettings, IEightBittrConstructorSettings, IEightBittrSettings } from "eightbittr";
import { FlagSwappr, IFlagSwapprSettings } from "flagswappr";
import { FrameTickr } from "frametickr";
import { GroupHoldr } from "groupholdr";
import { InputWritr } from "inputwritr";
import { ItemsHoldr } from "itemsholdr";
import { MapsCreatr } from "mapscreatr";
import { MenuGraphr } from "menugraphr";
import { ModAttachr } from "modattachr";
import { ObjectMakr } from "objectmakr";
import { PixelDrawr } from "pixeldrawr";
import { PixelRendr } from "pixelrendr";
import { QuadsKeepr } from "quadskeepr";
import { ScenePlayr } from "sceneplayr";
import { StateHoldr } from "stateholdr";
import { ThingHittr } from "thinghittr";
import { TimeHandlr } from "timehandlr";

import { Actions } from "./components/Actions";
import { Animations } from "./components/Animations";
import { Audio } from "./components/Audio";
import { Battles } from "./components/Battles";
import { Collisions } from "./components/Collisions";
import { Constants } from "./components/Constants";
import { Cutscenes } from "./components/Cutscenes";
import { Cycling } from "./components/Cycling";
import { Equations } from "./components/Equations";
import { Evolution } from "./components/Evolution";
import { Experience } from "./components/Experience";
import { Fishing } from "./components/Fishing";
import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Inputs } from "./components/Inputs";
import { Maintenance } from "./components/Maintenance";
import { IMapScreenr, Maps } from "./components/Maps";
import { Menus } from "./components/Menus";
import { Mods } from "./components/Mods";
import { MoveAdder } from "./components/MoveAdder";
import { Physics } from "./components/Physics";
import { Saves } from "./components/Saves";
import { Scrolling } from "./components/Scrolling";
import { IStorageItems, Storage } from "./components/Storage";
import { IPlayer, IThing, Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { createAreaSpawner } from "./creators/createAreaSpawner";
import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createBattleMover } from "./creators/createBattleMover";
import { createFlagSwapper, IFlags } from "./creators/createFlagSwapper";
import { createFrameTicker } from "./creators/createFrameTicker";
import { createGroupHolder, IGroups } from "./creators/createGroupHolder";
import { createInputWriter } from "./creators/createInputWriter";
import { createItemsHolder } from "./creators/createItemsHolder";
import { createMapsCreator } from "./creators/createMapsCreator";
import { createMapScreener } from "./creators/createMapScreener";
import { createMenuGrapher } from "./creators/createMenuGrapher";
import { createModAttacher } from "./creators/createModAttacher";
import { createObjectMaker } from "./creators/createObjectMaker";
import { createPixelDrawer } from "./creators/createPixelDrawer";
import { createPixelRender } from "./creators/createPixelRender";
import { createQuadsKeeper } from "./creators/createQuadsKeeper";
import { createScenePlayer } from "./creators/createScenePlayer";
import { createStateHolder } from "./creators/createStateHolder";
import { createThingHitter } from "./creators/createThingHitter";
import { createTimeHandler } from "./creators/createTimeHandler";

/**
 * Settings to initialize a new FullScreenPokemon.
 */
export interface IFullScreenPokemonComponentSettings extends IComponentSettings {
    /**
     * Settings for feature flags, particularly for a FlagSwappr.
     */
    flagSwapper?: Partial<IFlagSwapprSettings<IFlags>>;
}

/**
 * Filled-out settings to initialize a new FullScreenPokemon.
 */
export interface IFullScreenPokemonConstructorSettings extends IEightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components?: Partial<IFullScreenPokemonComponentSettings>;
}

/**
 * Settings to initialize a new FullScreenPokemon.
 */
export interface IFullScreenPokemonSettings extends IEightBittrSettings {
    /**
     * Component settings overrides.
     */
    components: Partial<IFullScreenPokemonComponentSettings>;
}

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web.
 */
export class FullScreenPokemon extends EightBittr {
    /**
     * Screen and component reset settings.
     */
    public readonly settings: IFullScreenPokemonSettings;

    /**
     * Loads EightBittr maps to spawn and unspawn areas on demand.
     */
    @component(createAreaSpawner)
    public readonly areaSpawner: AreaSpawnr;

    /**
     * Playback for persistent and on-demand sounds and themes.
     */
    @component(createAudioPlayer)
    public readonly audioPlayer: AudioPlayr;

    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    @component(createBattleMover)
    public readonly battleMover: BattleMovr;

    /**
     * Gates flags behind generational gaps.
     */
    @component(createFlagSwapper)
    public readonly flagSwapper: FlagSwappr<IFlags>;

    /**
     * Runs a callback on a roughly precise interval.
     */
    @component(createFrameTicker)
    public readonly frameTicker: FrameTickr;

    /**
     * Storage for separate group arrays of members with unique IDs.
     */
    @component(createGroupHolder)
    public readonly groupHolder: GroupHoldr<IGroups>;

    /**
     * Bridges input events to known actions.
     */
    @component(createInputWriter)
    public readonly inputWriter: InputWritr;

    /**
     * Cache-based wrapper around localStorage.
     */
    @component(createItemsHolder)
    public readonly itemsHolder: ItemsHoldr<IStorageItems>;

    /**
     * Storage container and lazy loader for EightBittr maps.
     */
    @component(createMapsCreator)
    public readonly mapsCreator: MapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area within that map.
     */
    @component(createMapScreener)
    public readonly mapScreener: IMapScreenr;

    /**
     * In-game menu and dialog management system for EightBittr.
     */
    @component(createMenuGrapher)
    public readonly menuGrapher: MenuGraphr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @component(createModAttacher)
    public readonly modAttacher: ModAttachr;

    /**
     * An abstract factory for dynamic attribute-based classes.
     */
    @component(createObjectMaker)
    public readonly objectMaker: ObjectMakr;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    @component(createPixelDrawer)
    public readonly pixelDrawer: PixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    @component(createPixelRender)
    public readonly pixelRender: PixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    @component(createQuadsKeeper)
    public readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * A stateful cutscene runner for jumping between scenes and their routines.
     */
    @component(createScenePlayer)
    public readonly scenePlayer: ScenePlayr;

    /**
     * General localStorage saving for collections of state.
     */
    @component(createStateHolder)
    public readonly stateHolder: StateHoldr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    @component(createTimeHandler)
    public readonly timeHandler: TimeHandlr;

    /**
     * Automation for physics collisions and reactions.
     */
    @component(createThingHitter)
    public readonly thingHitter: ThingHittr;

    /**
     * Actions characters may perform walking around.
     */
    @component(Actions)
    public readonly actions: Actions<this>;

    /**
     * Generic animations for Things.
     */
    @component(Animations)
    public readonly animations: Animations<this>;

    /**
     * Friendly sound aliases and names for audio.
     */
    @component(Audio)
    public readonly audio: Audio<this>;

    /**
     * BattleMovr hooks to run trainer battles.
     */
    @component(Battles)
    public readonly battles: Battles<this>;

    /**
     * ThingHittr collision function generators.
     */
    @component(Collisions)
    public readonly collisions: Collisions<this>;

    /**
     * Universal game constants.
     */
    @component(Constants)
    public readonly constants: Constants<this>;

    /**
     * ScenePlayr cutscenes, keyed by name.
     */
    @component(Cutscenes)
    public readonly cutscenes: Cutscenes<this>;

    /**
     * Starts and stop characters cycling.
     */
    @component(Cycling)
    public readonly cycling: Cycling<this>;

    /**
     * Common equations.
     */
    @component(Equations)
    public readonly equations: Equations<this>;

    /**
     * Logic for what Pokemon are able to evolve into.
     */
    @component(Evolution)
    public readonly evolution: Evolution<this>;

    /**
     * Calculates experience gains and level ups for Pokemon.
     */
    @component(Experience)
    public readonly experience: Experience<this>;

    /**
     * Runs the player trying to fish for Pokemon.
     */
    @component(Fishing)
    public readonly fishing: Fishing<this>;

    /**
     * Event hooks for major gameplay state changes.
     */
    @component(Gameplay)
    public readonly gameplay: Gameplay<this>;

    /**
     * Changes the visual appearance of Things.
     */
    @component(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Routes user input.
     */
    @component(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Maintains Things during FrameTickr ticks.
     */
    @component(Maintenance)
    public readonly maintenance: Maintenance<this>;

    /**
     * Enters and spawns map areas.
     */
    @component(Maps)
    public readonly maps: Maps<this>;

    /**
     * Manipulates MenuGraphr menus.
     */
    @component(Menus)
    public readonly menus: Menus<this>;

    /**
     * Creates ModAttachr from mod classes.
     */
    @component(Mods)
    public readonly mods: Mods<this>;

    /**
     * Creates MoveAdder to teach Pokemon new moves.
     */
    @component(MoveAdder)
    public readonly moveadder: MoveAdder<this>;

    /**
     * Physics functions to move Things around.
     */
    @component(Physics)
    public readonly physics: Physics<this>;

    /**
     * Saves and load game data.
     */
    @component(Saves)
    public readonly saves: Saves<this>;

    /**
     * Moves the screen and Things in it.
     */
    @component(Scrolling)
    public readonly scrolling: Scrolling<this>;

    /**
     * Settings for storing items in ItemsHoldrs.
     */
    @component(Storage)
    public readonly storage: Storage<this>;

    /**
     * Adds and processes new Things into the game.
     */
    @component(Things)
    public readonly things: Things<this>;

    /**
     * Miscellaneous utility functions.
     */
    @component(Utilities)
    public readonly utilities: Utilities<this>;

    /**
     * The game's single player.
     *
     * @remarks We assume nobody will try to access this before a map entrance.
     */
    public readonly players: [IPlayer] = [undefined as any];

    /**
     * Total FpsAnalyzr ticks that have elapsed since the constructor or saving.
     */
    public ticksElapsed: number;

    /**
     * Initializes a new instance of the FullScreenPokemon class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IFullScreenPokemonConstructorSettings) {
        super(settings);
    }
}
