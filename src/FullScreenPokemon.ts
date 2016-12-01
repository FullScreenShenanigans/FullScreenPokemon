import { BattleMovr } from "battlemovr/lib/BattleMovr";
import { IBattleMovr } from "battlemovr/lib/IBattleMovr";
import { GameStartr } from "gamestartr/lib/GameStartr";
import { IGameStartrSettings } from "gamestartr/lib/IGameStartr";
import { MenuGraphr } from "menugraphr/lib/MenuGraphr";
import { IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { ScenePlayr } from "sceneplayr/lib/ScenePlayr";
import { StateHoldr } from "stateholdr/lib/StateHoldr";
import { IStateHoldr } from "stateholdr/lib/IStateHoldr";
import { IUserWrappr } from "userwrappr/lib/IUserWrappr";

import { Animations } from "./Animations";
import { Battles } from "./Battles";
import { Collisions } from "./Collisions";
import { Scale, Unitsize } from "./Constants";
import { Cutscenes } from "./Cutscenes";
import { Cycling } from "./Cycling";
import { Fishing } from "./Fishing";
import { Gameplay } from "./Gameplay";
import { Graphics } from "./Graphics";
import { IModuleSettings, IMapScreenr, IPlayer, IThing } from "./IFullScreenPokemon";
import { Inputs } from "./Inputs";
import { Macros } from "./Macros";
import { Maintenance } from "./Maintenance";
import { Maps } from "./Maps";
import { Menus } from "./Menus";
import { Physics } from "./Physics";
import { Scrolling } from "./Scrolling";
import { ModuleSettingsGenerator } from "./ModuleSettingsGenerator";
import { Storage } from "./Storage";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
 */
export class FullScreenPokemon extends GameStartr {
    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    public BattleMover: IBattleMovr;

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map.
     */
    public MapScreener: IMapScreenr;

    /**
     * In-game menu and dialog management system for GameStartr.
     */
    public MenuGrapher: IMenuGraphr;

    /**
     * General localStorage saving for collections of state.
     */
    public StateHolder: IStateHoldr;

    /**
     * General localStorage saving for collections of state.
     */
    public UserWrapper: IUserWrappr;

    /**
     * Animation functions used by this instance.
     */
    public animations: Animations<FullScreenPokemon>;

    /**
     * Battle functions used by this instance.
     */
    public battles: Battles<FullScreenPokemon>;

    /**
     * Collision functions used by this instance.
     */
    public collisions: Collisions<FullScreenPokemon>;

    /**
     * Cutscene functions used by this instance.
     */
    public cutscenes: Cutscenes<FullScreenPokemon>;

    /**
     * Cycling functions used by this instance.
     */
    public cycling: Cycling<FullScreenPokemon>;

    /**
     * Fishing functions used by this instance.
     */
    public fishing: Fishing<FullScreenPokemon>;

    /**
     * Gameplay functions used by this instance.
     */
    public gameplay: Gameplay<FullScreenPokemon>;

    /**
     * Graphics functions used by this instance.
     */
    public graphics: Graphics<FullScreenPokemon>;

    /**
     * Input functions used by this instance.
     */
    public inputs: Inputs<FullScreenPokemon>;

    /**
     * Macro functions used by this instance.
     */
    public macros: Macros<FullScreenPokemon>;

    /**
     * Maintenance functions used by this instance.
     */
    public maintenance: Maintenance<FullScreenPokemon>;

    /**
     * Maps functions used by this instance.
     */
    public maps: Maps<FullScreenPokemon>;

    /**
     * Menu functions used by this instance.
     */
    public menus: Menus<FullScreenPokemon>;

    /**
     * Physics functions used by this instance.
     */
    public physics: Physics<FullScreenPokemon>;

    /**
     * Thing manipulation functions used by this instance.
     */
    public things: Things<FullScreenPokemon>;

    /**
     * Scrolling functions used by this instance.
     */
    public scrolling: Scrolling<FullScreenPokemon>;

    /**
     * Storage functions used by this instance.
     */
    public storage: Storage<FullScreenPokemon>;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities<FullScreenPokemon>;

    /**
     * Static settings passed to individual reset Functions.
     */
    public moduleSettings: IModuleSettings;

    /**
     * How much to scale each pixel from PixelDrawr to the real canvas.
     */
    public scale: number;

    /**
     * How much to expand each pixel from raw sizing measurements to in-game.
     */
    public unitsize: number;

    /**
     * The game's player, which (when defined) will always be a Player Thing.
     */
    public player: IPlayer;

    /**
     * The total FPSAnalyzr ticks that have elapsed since the constructor or saving.
     */
    public ticksElapsed: number;

    /**
     * Initializes a new instance of the FullScreenPokemon class.
     *
     * @param settings   Any additional settings.
     */
    public constructor(settings: IGameStartrSettings) {
        if (!settings.unitsize) {
            settings.unitsize = FullScreenPokemon.prototype.unitsize;
        }

        super(settings);

        this.scale = FullScreenPokemon.prototype.scale;
    }

    /**
     * Resets the minor system components.
     */
    protected resetComponents(): void {
        this.animations = new Animations(this);
        this.battles = new Battles(this);
        this.collisions = new Collisions(this);
        this.cutscenes = new Cutscenes(this);
        this.cycling = new Cycling(this);
        this.fishing = new Fishing(this);
        this.gameplay = new Gameplay(this);
        this.graphics = new Graphics(this);
        this.inputs = new Inputs(this);
        this.macros = new Macros(this);
        this.maintenance = new Maintenance(this);
        this.maps = new Maps(this);
        this.menus = new Menus(this);
        this.physics = new Physics(this);
        this.scrolling = new Scrolling(this);
        this.storage = new Storage(this);
        this.things = new Things(this);
        this.utilities = new Utilities(this);
    }

    /**
     * Resets the major system modules.
     * 
     * @param settings   Any additional settings.
     */
    protected resetModules(settings: IGameStartrSettings): void {
        super.resetModules(settings);
        this.resetMathDecider();
        this.resetMenuGrapher();
        this.resetStateHolder();
        this.resetBattleMover();

        this.AreaSpawner.setCommandScope(this.maps);
        this.InputWriter.setEventScope(this.inputs);
        this.MapsCreator.setScope(this.maps);
        this.TimeHandler.setClassScope(this.graphics);
        this.ThingHitter.setGeneratorScope(this.collisions);
    }

    /**
     * Sets this.ScenePlayer.
     * 
     * @param settings   Any additional settings.
     */
    protected resetScenePlayer(): void {
        this.ScenePlayer = new ScenePlayr(
            this.utilities.proliferate(
                {
                    scope: this.cutscenes,
                },
                this.moduleSettings.scenes));
    }

    /**
     * Sets this.StateHolder.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetStateHolder(): void {
        this.StateHolder = new StateHoldr(
            this.utilities.proliferate(
                {
                    ItemsHolder: this.ItemsHolder
                },
                this.moduleSettings.state));
    }

    /**
     * Sets this.MenuGrapher.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetMenuGrapher(): void {
        this.MenuGrapher = new MenuGraphr(
            this.utilities.proliferate(
                {
                    GameStarter: this,
                    modifierScope: this.menus
                },
                this.moduleSettings.menus));
    }

    /**
     * Sets this.BattleMover.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetBattleMover(): void {
        this.BattleMover = new BattleMovr(
            this.utilities.proliferate(
                {
                    GameStarter: this,
                    battleOptions: [
                        {
                            text: "FIGHT",
                            callback: (): void => {
                                this.battles.openBattleMovesMenu();
                            }
                        },
                        {
                            text: "ITEM",
                            callback: (): void => {
                                this.battles.openBattleItemsMenu();
                            }
                        },
                        {
                            text: ["Poke", "Mon"],
                            callback: (): void => {
                                this.battles.openBattlePokemonMenu();
                            }
                        },
                        {
                            text: "RUN",
                            callback: (): void => {
                                this.battles.startBattleExit();
                            }
                        }
                    ]
                },
                this.moduleSettings.battles));
    }

    /**
     * Sets this.container.
     * 
     * The container is given the "Press Start" font, and the PixelRender is told
     * which groups to draw in order.
     * 
     * @param settings   Extra settings such as screen size.
     */
    protected resetContainer(settings: IGameStartrSettings): void {
        super.resetContainer(settings);

        this.container.style.fontFamily = "Press Start";
        this.container.className += " FullScreenPokemon";

        this.PixelDrawer.setThingArrays([
            this.GroupHolder.getGroup("Terrain") as IThing[],
            this.GroupHolder.getGroup("Solid") as IThing[],
            this.GroupHolder.getGroup("Scenery") as IThing[],
            this.GroupHolder.getGroup("Character") as IThing[],
            this.GroupHolder.getGroup("Text") as IThing[]
        ]);
    }
}

// Prototype constants are defined first so settings files can use them
FullScreenPokemon.prototype.scale = Scale;
FullScreenPokemon.prototype.unitsize = Unitsize;
FullScreenPokemon.prototype.moduleSettings = new ModuleSettingsGenerator().generate();
