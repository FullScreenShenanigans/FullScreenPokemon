import { AudioPlayr, AudioPlayrSettings } from "audioplayr";
import { factory, member } from "babyioc";
import { BattleMovr } from "battlemovr";
import { ClassCyclr, ClassCyclrSettings } from "classcyclr";
import {
    EightBittr,
    ComponentSettings,
    EightBittrConstructorSettings,
    EightBittrSettings,
} from "eightbittr";
import { FlagSwappr, FlagSwapprSettings } from "flagswappr";
import { GroupHoldr } from "groupholdr";
import { ItemsHoldr } from "itemsholdr";
import { MenuGraphr } from "menugraphr";
import { ModAttachrSettings, ModAttachr, ModsItemsHoldr } from "modattachr";
import { NumberMakrSettings, NumberMakr } from "numbermakr";
import { ScenePlayr } from "sceneplayr";
import { StateHoldr, StateItemsHoldr } from "stateholdr";

import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createBattleMover } from "./creators/createBattleMover";
import { createClassCycler } from "./creators/createClassCycler";
import { createFlagSwapper, Flags } from "./creators/createFlagSwapper";
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
import { Frames } from "./sections/Frames";
import { Gameplay } from "./sections/Gameplay";
import { Graphics } from "./sections/Graphics";
import { ActorGroups, Groups } from "./sections/Groups";
import { Inputs } from "./sections/Inputs";
import { Items } from "./sections/Items";
import { Maintenance } from "./sections/Maintenance";
import { MapScreenr, Maps } from "./sections/Maps";
import { Menus } from "./sections/Menus";
import { Mods } from "./sections/Mods";
import { MoveAdder } from "./sections/MoveAdder";
import { Objects } from "./sections/Objects";
import { Physics } from "./sections/Physics";
import { Quadrants } from "./sections/Quadrants";
import { Saves } from "./sections/Saves";
import { Scrolling } from "./sections/Scrolling";
import { StorageItems, Storage } from "./sections/Storage";
import { Player, Actors } from "./sections/Actors";
import { Timing } from "./sections/Timing";
import { Utilities } from "./sections/Utilities";

/**
 * Settings to initialize a new FullScreenPokemon.
 */
export interface FullScreenPokemonComponentSettings extends ComponentSettings {
    /**
     * Setings overrides for the game's AudioPlayr.
     */
    audioPlayer?: Partial<AudioPlayrSettings>;

    /**
     * Setings overrides for the game's ClassCyclr.
     */
    classCycler?: Partial<ClassCyclrSettings>;

    /**
     * Setings overrides for the game's FlagSwappr.
     */
    flagSwapper?: Partial<FlagSwapprSettings<Flags>>;

    /**
     * Setings overrides for the game's ModAttachr.
     */
    modAttacher?: Partial<ModAttachrSettings>;

    /**
     * Setings overrides for the game's NumberMakr.
     */
    numberMaker?: Partial<NumberMakrSettings>;
}

/**
 * Filled-out settings to initialize a new FullScreenPokemon.
 */
export interface FullScreenPokemonConstructorSettings extends EightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components?: Partial<FullScreenPokemonComponentSettings>;
}

/**
 * Settings to initialize a new FullScreenPokemon.
 */
export interface FullScreenPokemonSettings extends EightBittrSettings {
    /**
     * Component settings overrides.
     */
    components: Partial<FullScreenPokemonComponentSettings>;
}

/**
 * HTML5 remake of the original Pokemon, expanded for modern browsers.
 */
export class FullScreenPokemon extends EightBittr {
    /**
     * Screen and component reset settings.
     */
    public readonly settings: FullScreenPokemonSettings;

    @factory(createAudioPlayer)
    public readonly audioPlayer: AudioPlayr;

    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    @factory(createBattleMover)
    public readonly battleMover: BattleMovr;

    /**
     * Cycles through class names using TimeHandlr events.
     */
    @factory(createClassCycler)
    public readonly classCycler: ClassCyclr;

    /**
     * Gates flags behind generational gaps.
     */
    @factory(createFlagSwapper)
    public readonly flagSwapper: FlagSwappr<Flags>;

    /**
     * Stores arrays of Actors by their group name.
     */
    public readonly groupHolder: GroupHoldr<ActorGroups>;

    /**
     * Cache-based wrapper around localStorage.
     */
    public readonly itemsHolder: ItemsHoldr<StorageItems> & ModsItemsHoldr & StateItemsHoldr;

    /**
     * A flexible container for map attributes and viewport.
     */
    public readonly mapScreener: MapScreenr;

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
     * Generic animations for Actors.
     */
    @member(Animations)
    public readonly animations: Animations;

    /**
     * Friendly sound aliases and names for audio.
     */
    @member(Audio)
    public readonly audio: Audio;

    /**
     * BattleMovr hooks to run trainer battles.
     */
    @member(Battles)
    public readonly battles: Battles;

    /**
     * ActorHittr collision function generators.
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
     * How to advance each frame of the game.
     */
    @member(Frames)
    public readonly frames: Frames<this>;

    /**
     * Event hooks for major gameplay state changes.
     */
    @member(Gameplay)
    public readonly gameplay: Gameplay;

    /**
     * Changes the visual appearance of Actors.
     */
    @member(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Collection settings for Actor group names.
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
     * Maintains Actors during FrameTickr ticks.
     */
    @member(Maintenance)
    public readonly maintenance: Maintenance<this>;

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
    public readonly mods: Mods;

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
     * Physics functions to move Actors around.
     */
    @member(Physics)
    public readonly physics: Physics<this>;

    /**
     * Saves and load game data.
     */
    @member(Saves)
    public readonly saves: Saves;

    /**
     * Moves the screen and Actors in it.
     */
    @member(Scrolling)
    public readonly scrolling: Scrolling<this>;

    /**
     * Settings for storing items in ItemsHoldrs.
     */
    @member(Storage)
    public readonly storage: Storage;

    /**
     * Adds and processes new Actors into the game.
     */
    @member(Actors)
    public readonly actors: Actors<this>;

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
    public readonly players: [Player] = [undefined as any];

    /**
     * Total FpsAnalyzr ticks that have elapsed since the constructor or saving.
     */
    public ticksElapsed: number;

    /**
     * Initializes a new instance of the FullScreenPokemon class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: FullScreenPokemonConstructorSettings) {
        super(settings);

        this.itemsHolder.setAutoSave(this.itemsHolder.getItem(this.storage.names.autoSave));
    }
}
