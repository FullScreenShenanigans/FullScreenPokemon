import { factory, member } from "babyioc";
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
    @member(Actions)
    public readonly actions: Actions;

    /**
     * Generic animations for Things.
     */
    @member(Animations)
    public readonly animations: Animations;

    /**
     * Friendly sound aliases and names for audio.
     */
    @member(Audio)
    public readonly audio: Audio<this>;

    /**
     * BattleMovr hooks to run trainer battles.
     */
    @member(Battles)
    public readonly battles: Battles;

    /**
     * ThingHittr collision function generators.
     */
    @member(Collisions)
    public readonly collisions: Collisions<this>;

    /**
     * Universal game constants.
     */
    @member(Constants)
    public readonly constants: Constants;

    /**
     * ScenePlayr cutscenes, keyed by name.
     */
    @member(Cutscenes)
    public readonly cutscenes: Cutscenes;

    /**
     * Starts and stop characters cycling.
     */
    @member(Cycling)
    public readonly cycling: Cycling;

    /**
     * Common equations.
     */
    @member(Equations)
    public readonly equations: Equations;

    /**
     * Logic for what Pokemon are able to evolve into.
     */
    @member(Evolution)
    public readonly evolution: Evolution;

    /**
     * Calculates experience gains and level ups for Pokemon.
     */
    @member(Experience)
    public readonly experience: Experience;

    /**
     * Runs the player trying to fish for Pokemon.
     */
    @member(Fishing)
    public readonly fishing: Fishing;

    /**
     * Event hooks for major gameplay state changes.
     */
    @member(Gameplay)
    public readonly gameplay: Gameplay<this>;

    /**
     * Changes the visual appearance of Things.
     */
    @member(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Collection settings for IThing group names.
     */
    @member(Groups)
    public readonly groups: Groups<this>;

    /**
     * How to advance each frame of the game.
     */
    @member(Frames)
    public readonly frames: Frames<this>;

    /**
     * Stores arrays of Things by their group name.
     */
    public readonly groupHolder: GroupHoldr<IGroups>;

    /**
     * User input filtering and handling.
     */
    @member(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Storage keys and value settings.
     */
    @member(Items)
    public readonly items: Items<this>;

    /**
     * Maintains Things during FrameTickr ticks.
     */
    @member(Maintenance)
    public readonly maintenance: Maintenance;

    /**
     * A flexible container for map attributes and viewport.
     */
    public readonly mapScreener: IMapScreenr;

    /**
     * Enters and spawns map areas.
     */
    @member(Maps)
    public readonly maps: Maps<this>;

    /**
     * Manipulates MenuGraphr menus.
     */
    @member(Menus)
    public readonly menus: Menus;

    /**
     * Creates ModAttachr from mod classes.
     */
    @member(Mods)
    public readonly mods: Mods<this>;

    /**
     * Creates MoveAdder to teach Pokemon new moves.
     */
    @member(MoveAdder)
    public readonly moveAdder: MoveAdder;

    /**
     * Raw ObjectMakr factory settings.
     */
    @member(Objects)
    public readonly objects: Objects<this>;

    /**
     * Physics functions to move Things around.
     */
    @member(Physics)
    public readonly physics: Physics<this>;

    /**
     * Saves and load game data.
     */
    @member(Saves)
    public readonly saves: Saves;

    /**
     * Moves the screen and Things in it.
     */
    @member(Scrolling)
    public readonly scrolling: Scrolling<this>;

    /**
     * Settings for storing items in ItemsHoldrs.
     */
    @member(Storage)
    public readonly storage: Storage;

    /**
     * Adds and processes new Things into the game.
     */
    @member(Things)
    public readonly things: Things<this>;

    /**
     * Timing constants for delayed events.
     */
    @member(Timing)
    public readonly timing: Timing<this>;

    /**
     * Miscellaneous utility functions.
     */
    @member(Utilities)
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
