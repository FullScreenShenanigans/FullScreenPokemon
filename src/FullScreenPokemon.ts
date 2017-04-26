import { BattleMovr } from "battlemovr/lib/BattleMovr";
import { IBattleMovr } from "battlemovr/lib/IBattleMovr";
import { GameStartr } from "gamestartr/lib/GameStartr";
import { IProcessedSizeSettings, ISizeSettings } from "gamestartr/lib/IGameStartr";
import { IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { MenuGraphr } from "menugraphr/lib/MenuGraphr";
import { IScenePlayr } from "sceneplayr/lib/IScenePlayr";
import { ScenePlayr } from "sceneplayr/lib/ScenePlayr";
import { IStateHoldr } from "stateholdr/lib/IStateHoldr";
import { StateHoldr } from "stateholdr/lib/StateHoldr";
import { IUserWrappr } from "userwrappr/lib/IUserWrappr";
import { UserWrappr } from "userwrappr/lib/UserWrappr";

import { Actions } from "./components/Actions";
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
import { Macros } from "./components/Macros";
import { Maintenance } from "./components/Maintenance";
import { IMapScreenr, Maps } from "./components/Maps";
import { Menus } from "./components/Menus";
import { Mods } from "./components/Mods";
import { Physics } from "./components/Physics";
import { Saves } from "./components/Saves";
import { Scrolling } from "./components/Scrolling";
import { IPlayer, IThing, Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { IModuleSettings, ModuleSettingsGenerator } from "./settings/ModuleSettings";

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
 */
export class FullScreenPokemon extends GameStartr {
    /**
     * Module settings passed to individual create* members.
     */
    public moduleSettings: IModuleSettings;

    /**
     * How much to scale each pixel from PixelDrawr to the real canvas.
     */
    public scale: number;

    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    public battleMover: IBattleMovr;

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map.
     */
    public mapScreener: IMapScreenr;

    /**
     * In-game menu and dialog management system for GameStartr.
     */
    public menuGrapher: IMenuGraphr;

    /**
     * General localStorage saving for collections of state.
     */
    public stateHolder: IStateHoldr;

    /**
     * General localStorage saving for collections of state.
     */
    public userWrapper: IUserWrappr;

    /**
     * Action functions used by this instance.
     */
    public actions: Actions<FullScreenPokemon>;

    /**
     * Battle functions used by this instance.
     */
    public battles: Battles<FullScreenPokemon>;

    /**
     * Collision functions used by this instance.
     */
    public collisions: Collisions<FullScreenPokemon>;

    /**
     * Constants used by this instance.
     */
    public constants: Constants<FullScreenPokemon>;

    /**
     * Cutscene functions used by this instance.
     */
    public cutscenes: Cutscenes<FullScreenPokemon>;

    /**
     * Cycling functions used by this instance.
     */
    public cycling: Cycling<FullScreenPokemon>;

    /**
     * Equations used by this instance.
     */
    public equations: Equations<FullScreenPokemon>;

    /**
     * Evolution functions used by this instance.
     */
    public evolution: Evolution<FullScreenPokemon>;

    /**
     * Experience functions used by this instance.
     */
    public experience: Experience<FullScreenPokemon>;

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
     * Mods used by this instance.
     */
    public mods: Mods<FullScreenPokemon>;

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
    public saves: Saves<FullScreenPokemon>;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities<FullScreenPokemon>;

    /**
     * The game's single player.
     */
    public players: [IPlayer];

    /**
     * The total FPSAnalyzr ticks that have elapsed since the constructor or saving.
     */
    public ticksElapsed: number;

    /**
     * Initializes a new instance of the FullScreenPokemon class.
     *
     * @param settings   Any additional settings.
     */
    public constructor(settings?: ISizeSettings) {
        super(settings);
    }

    /**
     * Resets the system components.
     */
    protected resetComponents(): void {
        this.actions = new Actions(this);
        this.collisions = new Collisions(this);
        this.constants = new Constants(this);
        this.cutscenes = new Cutscenes(this);
        this.equations = new Equations(this);
        this.gameplay = new Gameplay(this);
        this.graphics = new Graphics(this);
        this.inputs = new Inputs(this);
        this.macros = new Macros(this);
        this.maintenance = new Maintenance(this);
        this.maps = new Maps(this);
        this.menus = new Menus(this);
        this.mods = new Mods(this);
        this.physics = new Physics(this);
        this.things = new Things(this);
        this.scrolling = new Scrolling(this);
        this.saves = new Saves(this);
        this.utilities = new Utilities(this);

        this.registerLazy("battles", (): Battles<this> => new Battles(this));
        this.registerLazy("cutscenes", (): Cutscenes<this> => new Cutscenes(this));
        this.registerLazy("cycling", (): Cycling<this> => new Cycling(this));
        this.registerLazy("fishing", (): Fishing<this> => new Fishing(this));
        this.registerLazy("evolution", (): Evolution<this> => new Evolution(this));
        this.registerLazy("experience", (): Experience<this> => new Experience(this));
    }

    /**
     * Resets the system modules.
     * 
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     */
    protected resetModules(settings: IProcessedSizeSettings): void {
        super.resetModules(settings);

        this.stateHolder = this.createStateHolder(this.moduleSettings, settings);
        this.menuGrapher = this.createMenuGrapher(this.moduleSettings, settings);
        this.battleMover = this.createBattleMover(this.moduleSettings, settings);
        this.userWrapper = this.createUserWrapper(this.moduleSettings, settings);

        this.pixelDrawer.setThingArrays([
            this.groupHolder.getGroup("Terrain") as IThing[],
            this.groupHolder.getGroup("Solid") as IThing[],
            this.groupHolder.getGroup("Scenery") as IThing[],
            this.groupHolder.getGroup("Character") as IThing[],
            this.groupHolder.getGroup("Text") as IThing[]
        ]);

        this.gameplay.gameStart();
    }

    /**
     * Creates the settings for individual modules.
     * 
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns Settings for individual modules.
     */
    protected createModuleSettings(settings: IProcessedSizeSettings): IModuleSettings {
        return {
            ...new ModuleSettingsGenerator().generate(this),
            ...settings.moduleSettings
        };
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal BattleMovr.
     */
    protected createBattleMover(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IBattleMovr {
        return new BattleMovr({
            gameStarter: this,
            menuGrapher: this.menuGrapher,
            ...moduleSettings.battles
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal MenuGraphr.
     */
    protected createMenuGrapher(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IMenuGraphr {
        return new MenuGraphr({
            gameStarter: this,
            modifierScope: this,
            ...moduleSettings.menus
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal ScenePlayer.
     */
    protected createScenePlayer(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IScenePlayr {
        return new ScenePlayr({
            scope: this.cutscenes,
            ...moduleSettings.scenes
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal StateHoldr.
     */
    protected createStateHolder(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IStateHoldr {
        return new StateHoldr({
            itemsHolder: this.itemsHolder,
            ...moduleSettings.state
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal UserWrappr.
     */
    protected createUserWrapper(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IUserWrappr {
        return new UserWrappr({
            gameStarter: this,
            ...moduleSettings.ui
        });
    }
}

FullScreenPokemon.prototype.scale = Constants.scale;
