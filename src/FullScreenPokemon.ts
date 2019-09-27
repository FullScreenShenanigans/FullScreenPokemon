import { component, factory } from "babyioc";
import { BattleMovr } from "battlemovr";
import { EightBittr, IComponentSettings, IEightBittrConstructorSettings, IEightBittrSettings } from "eightbittr";
import { FlagSwappr, IFlagSwapprSettings } from "flagswappr";
import { GroupHoldr } from "groupholdr";
import { ItemsHoldr } from "itemsholdr";
import { MenuGraphr } from "menugraphr";
import { ScenePlayr } from "sceneplayr";
import { StateHoldr } from "stateholdr";

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
import { Frames } from "./components/Frames";
import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Groups, IGroups } from "./components/Groups";
import { Inputs } from "./components/Inputs";
import { Items } from "./components/Items";
import { Maintenance } from "./components/Maintenance";
import { IMapScreenr, Maps } from "./components/Maps";
import { Menus } from "./components/Menus";
import { Mods } from "./components/Mods";
import { MoveAdder } from "./components/MoveAdder";
import { Objects } from "./components/Objects";
import { Physics } from "./components/Physics";
import { Quadrants } from "./components/Quadrants";
import { Saves } from "./components/Saves";
import { Scrolling } from "./components/Scrolling";
import { IStorageItems, Storage } from "./components/Storage";
import { IPlayer, Things } from "./components/Things";
import { Timing } from "./components/Timing";
import { Utilities } from "./components/Utilities";
import { createBattleMover } from "./creators/createBattleMover";
import { createFlagSwapper, IFlags } from "./creators/createFlagSwapper";
import { createMenuGrapher } from "./creators/createMenuGrapher";
import { createScenePlayer } from "./creators/createScenePlayer";
import { createStateHolder } from "./creators/createStateHolder";

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
     * An in-game battle management system for RPG-like battles between actors.
     */
    @factory(createBattleMover)
    public readonly battleMover: BattleMovr;

    /**
     * Gates flags behind generational gaps.
     */
    @factory(createFlagSwapper)
    public readonly flagSwapper: FlagSwappr<IFlags>;

    /**
     * Cache-based wrapper around localStorage.
     */
    public readonly itemsHolder: ItemsHoldr<IStorageItems>;

    /**
     * In-game menu and dialog management system for EightBittr.
     */
    @factory(createMenuGrapher)
    public readonly menuGrapher: MenuGraphr;

    /**
     * A stateful cutscene runner for jumping between scenes and their routines.
     */
    @factory(createScenePlayer)
    public readonly scenePlayer: ScenePlayr;

    /**
     * General localStorage saving for collections of state.
     */
    @factory(createStateHolder)
    public readonly stateHolder: StateHoldr;

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
     * Collection settings for IThing group names.
     */
    @component(Groups)
    public readonly groups: Groups<this>;

    /**
     * How to advance each frame of the game.
     */
    @component(Frames)
    public readonly frames: Frames<this>;

    /**
     * Stores arrays of Things by their group name.
     */
    public readonly groupHolder: GroupHoldr<IGroups>;

    /**
     * User input filtering and handling.
     */
    @component(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Storage keys and value settings.
     */
    @component(Items)
    public readonly items: Items<this>;

    /**
     * Maintains Things during FrameTickr ticks.
     */
    @component(Maintenance)
    public readonly maintenance: Maintenance<this>;

    /**
     * A flexible container for map attributes and viewport.
     */
    public readonly mapScreener: IMapScreenr;

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
    public readonly moveAdder: MoveAdder<this>;

    /**
     * Raw ObjectMakr factory settings.
     */
    @component(Objects)
    public readonly objects: Objects<this>;

    /**
     * Physics functions to move Things around.
     */
    @component(Physics)
    public readonly physics: Physics<this>;

    /**
     * Arranges game physics quadrants.
     */
    @component(Quadrants)
    public readonly quadrants: Quadrants<this>;

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
     * Timing constants for delayed events.
     */
    @component(Timing)
    public readonly timing: Timing<this>;

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

        this.itemsHolder.setAutoSave(this.itemsHolder.getItem(this.storage.names.autoSave));
    }
}
