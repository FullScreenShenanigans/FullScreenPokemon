import { AreaSpawnr } from "areaspawnr";
import { AudioPlayr } from "audioplayr";
import { component, container } from "babyioc";
import { BattleMovr } from "battlemovr";
import { FlagSwappr } from "flagswappr";
import { GamesRunnr } from "gamesrunnr";
import { GameStartr, IGameStartrConstructorSettings } from "gamestartr";
import { GroupHoldr } from "groupholdr";
import { InputWritr } from "inputwritr";
import { ItemsHoldr } from "itemsholdr";
import { MapsCreatr } from "mapscreatr";
import { MapScreenr } from "mapscreenr";
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
import { Physics } from "./components/Physics";
import { Saves } from "./components/Saves";
import { Scrolling } from "./components/Scrolling";
import { IPlayer, IThing, Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { createAreaSpawner } from "./creators/createAreaSpawner";
import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createBattleMover } from "./creators/createBattleMover";
import { createFlagSwapper, IFlags } from "./creators/createFlagSwapper";
import { createGamesRunner } from "./creators/createGamesRunner";
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
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web.
 */
@container
export class FullScreenPokemon extends GameStartr {
    /**
     * Action functions used by this instance.
     */
    @component(Actions)
    public readonly actions: Actions<this>;

    /**
     * Friendly sound aliases and names for audio.
     */
    @component(Audio)
    public readonly audio: Audio<this>;

    /**
     * Battle functions used by this instance.
     */
    @component(Battles)
    public readonly battles: Battles<this>;

    /**
     * Collision functions used by this instance.
     */
    @component(Collisions)
    public readonly collisions: Collisions<this>;

    /**
     * Constants used by this instance.
     */
    @component(Constants)
    public readonly constants: Constants<this>;

    /**
     * Cutscene functions used by this instance.
     */
    @component(Cutscenes)
    public readonly cutscenes: Cutscenes<this>;

    /**
     * Cycling functions used by this instance.
     */
    @component(Cycling)
    public readonly cycling: Cycling<this>;

    /**
     * Equations used by this instance.
     */
    @component(Equations)
    public readonly equations: Equations<this>;

    /**
     * Evolution functions used by this instance.
     */
    @component(Evolution)
    public readonly evolution: Evolution<this>;

    /**
     * Experience functions used by this instance.
     */
    @component(Experience)
    public readonly experience: Experience<this>;

    /**
     * Fishing functions used by this instance.
     */
    @component(Fishing)
    public readonly fishing: Fishing<this>;

    /**
     * Gameplay functions used by this instance.
     */
    @component(Gameplay)
    public readonly gameplay: Gameplay<this>;

    /**
     * Graphics functions used by this instance.
     */
    @component(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Input functions used by this instance.
     */
    @component(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Maintenance functions used by this instance.
     */
    @component(Maintenance)
    public readonly maintenance: Maintenance<this>;

    /**
     * Maps functions used by this instance.
     */
    @component(Maps)
    public readonly maps: Maps<this>;

    /**
     * Menu functions used by this instance.
     */
    @component(Menus)
    public readonly menus: Menus<this>;

    /**
     * Mods used by this instance.
     */
    @component(Mods)
    public readonly mods: Mods<this>;

    /**
     * Physics functions used by this instance.
     */
    @component(Physics)
    public readonly physics: Physics<this>;

    /**
     * Thing manipulation functions used by this instance.
     */
    @component(Things)
    public readonly things: Things<this>;

    /**
     * Scrolling functions used by this instance.
     */
    @component(Scrolling)
    public readonly scrolling: Scrolling<this>;

    /**
     * Storage functions used by this instance.
     */
    @component(Saves)
    public readonly saves: Saves<this>;

    /**
     * Utility functions used by this instance.
     */
    @component(Utilities)
    public readonly utilities: Utilities<this>;

    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    @component(createAreaSpawner, AreaSpawnr)
    public readonly areaSpawner: AreaSpawnr;

    /**
     * Playback for persistent and on-demand sounds and themes.
     */
    @component(createAudioPlayer, AudioPlayr)
    public readonly audioPlayer: AudioPlayr;

    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    @component(createBattleMover, BattleMovr)
    public readonly battleMover: BattleMovr;

    /**
     * Gates flags behind generational gaps.
     */
    @component(createFlagSwapper, FlagSwappr)
    public readonly flagSwapper: FlagSwappr<IFlags>;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    @component(createGamesRunner, GamesRunnr)
    public readonly gamesRunner: GamesRunnr;

    /**
     * Storage for separate group arrays of members with unique IDs.
     */
    @component(createGroupHolder, GroupHoldr)
    public readonly groupHolder: GroupHoldr<IGroups>;

    /**
     * Bridges input events to known actions.
     */
    @component(createInputWriter, InputWritr)
    public readonly inputWriter: InputWritr;

    /**
     * Cache-based wrapper around localStorage.
     */
    @component(createItemsHolder, ItemsHoldr)
    public readonly itemsHolder: ItemsHoldr;

    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    @component(createMapsCreator, MapsCreatr)
    public readonly mapsCreator: MapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area within that map.
     */
    @component(createMapScreener, MapScreenr)
    public readonly mapScreener: IMapScreenr;

    /**
     * In-game menu and dialog management system for GameStartr.
     */
    @component(createMenuGrapher, MenuGraphr)
    public readonly menuGrapher: MenuGraphr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @component(createModAttacher, ModAttachr)
    public readonly modAttacher: ModAttachr;

    /**
     * An abstract factory for dynamic attribute-based classes.
     */
    @component(createObjectMaker, ObjectMakr)
    public readonly objectMaker: ObjectMakr;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    @component(createPixelDrawer, PixelDrawr)
    public readonly pixelDrawer: PixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    @component(createPixelRender, PixelRendr)
    public readonly pixelRender: PixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    @component(createQuadsKeeper, QuadsKeepr)
    public readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * A stateful cutscene runner for jumping between scenes and their routines.
     */
    @component(createScenePlayer, ScenePlayr)
    public readonly scenePlayer: ScenePlayr;

    /**
     * General localStorage saving for collections of state.
     */
    @component(createStateHolder, StateHoldr)
    public readonly stateHolder: StateHoldr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    @component(createTimeHandler, TimeHandlr)
    public readonly timeHandler: TimeHandlr;

    /**
     * Automation for physics collisions and reactions.
     */
    @component(createThingHitter, ThingHittr)
    public readonly thingHitter: ThingHittr;

    /**
     * The game's single player.
     *
     * @remarks We assume nobody will try to access this before a map entrance.
     * @remarks There's probably a better way.
     */
    public readonly players: [IPlayer] = [] as any;

    /**
     * Total FpsAnalyzr ticks that have elapsed since the constructor or saving.
     */
    public ticksElapsed: number;
}
