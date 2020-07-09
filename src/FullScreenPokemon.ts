import { AudioPlayr } from "audioplayr";
import { factory, member } from "babyioc";
import { BattleMovr } from "battlemovr";
import { EightBittr, IComponentSettings, IEightBittrConstructorSettings, IEightBittrSettings } from "eightbittr";
import { FlagSwappr, IFlagSwapprSettings } from "flagswappr";
import { GroupHoldr } from "groupholdr";
import { ItemsHoldr } from "itemsholdr";
import { MenuGraphr } from "menugraphr";
import { ModAttachr } from "modattachr";
import { NumberMakr } from 'numbermakr';
import { ScenePlayr } from "sceneplayr";
import { StateHoldr } from "stateholdr";

import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createBattleMover } from "./creators/createBattleMover";
import { createFlagSwapper, IFlags } from "./creators/createFlagSwapper";
import { createMenuGrapher } from "./creators/createMenuGrapher";
import { createModAttacher } from "./creators/createModAttacher";
import { createNumberMaker } from "./creators/createNumberMaker";
import { createScenePlayer } from "./creators/createScenePlayer";
import { createStateHolder } from "./creators/createStateHolder";
import { Actions } from "./sections/Actions";
import { Animations } from "./sections/Animations";
import { Audio } from "./sections/Audio";
import { Battles } from "./sections/Battles";
import { Collisions } from "./sections/Collisions";
import { Constants } from "./sections/Constants";
import { Cutscenes } from "./sections/Cutscenes";
import { Cycling } from "./sections/Cycling";
import { Equations } from "./sections/Equations";
import { Evolution } from "./sections/Evolution";
import { Experience } from "./sections/Experience";
import { Fishing } from "./sections/Fishing";
import { Gameplay } from "./sections/Gameplay";
import { Graphics } from "./sections/Graphics";
import { Groups, IGroups } from "./sections/Groups";
import { Inputs } from "./sections/Inputs";
import { Items } from "./sections/Items";
import { Maintenance } from "./sections/Maintenance";
import { IMapScreenr, Maps } from "./sections/Maps";
import { Menus } from "./sections/Menus";
import { Mods } from "./sections/Mods";
import { MoveAdder } from "./sections/MoveAdder";
import { Objects } from "./sections/Objects";
import { Physics } from "./sections/Physics";
import { Quadrants } from "./sections/Quadrants";
import { Saves } from "./sections/Saves";
import { Scrolling } from "./sections/Scrolling";
import { IStorageItems, Storage } from "./sections/Storage";
import { IPlayer, Things } from "./sections/Things";
import { Timing } from "./sections/Timing";
import { Utilities } from "./sections/Utilities";

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
 * HTML5 remake of the original Pokemon, expanded for modern browsers.
 */
export class FullScreenPokemon extends EightBittr {
    /**
     * Screen and component reset settings.
     */
    public readonly settings: IFullScreenPokemonSettings;

    @factory(createAudioPlayer)
    public readonly audioPlayer: AudioPlayr;

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
     * Stores arrays of Things by their group name.
     */
    public readonly groupHolder: GroupHoldr<IGroups>;

    /**
     * Cache-based wrapper around localStorage.
     */
    public readonly itemsHolder: ItemsHoldr<IStorageItems>;

    /**
     * A flexible container for map attributes and viewport.
     */
    public readonly mapScreener: IMapScreenr;

    /**
     * In-game menu and dialog management system.
     */
    @factory(createMenuGrapher)
    public readonly menuGrapher: MenuGraphr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @factory(createModAttacher)
    public readonly modAttacher: ModAttachr;

    /**
     * Configurable Mersenne Twister implementation.
     */
    @factory(createNumberMaker)
    public readonly numberMaker: NumberMakr;

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
     * Arranges game physics quadrants.
     */
    @member(Quadrants)
    public readonly quadrants: Quadrants<this>;

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
