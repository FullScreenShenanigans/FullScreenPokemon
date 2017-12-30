import { BattleMovr, IBattleMovr } from "battlemovr";
import { FlagSwappr, IFlagSwappr } from "flagswappr";
import { GameStartr, IGameStartrSettings } from "gamestartr";
import { IMenuGraphr, MenuGraphr } from "menugraphr";
import { IScenePlayr, ScenePlayr } from "sceneplayr";
import { IStateHoldr, StateHoldr } from "stateholdr";

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
import { IFlags } from "./settings/Flags";
import { IModuleSettings, ModuleSettingsGenerator } from "./settings/ModuleSettings";

/**
 * Reset settings for a FullScreenPokemon instance.
 */
export interface IFullScreenPokemonSettings extends IGameStartrSettings {
    /**
     * Module settings overrides.
     */
    moduleSettings?: Partial<IModuleSettings>;
}

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
     * Gates flags behind generational gaps.
     */
    public flagSwapper: IFlagSwappr<IFlags>;

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
     * Resets the system components.
     */
    protected resetComponents(): void {
        this.actions = new Actions(this);
        this.collisions = new Collisions(this);
        this.constants = new Constants(this);
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
    protected resetModules(settings: IFullScreenPokemonSettings): void {
        super.resetModules(settings);

        this.stateHolder = this.createStateHolder(this.moduleSettings, settings);
        this.menuGrapher = this.createMenuGrapher(this.moduleSettings, settings);
        this.battleMover = this.createBattleMover(this.moduleSettings, settings);

        this.pixelDrawer.setThingArrays([
            this.groupHolder.getGroup("Terrain") as IThing[],
            this.groupHolder.getGroup("Solid") as IThing[],
            this.groupHolder.getGroup("Scenery") as IThing[],
            this.groupHolder.getGroup("Character") as IThing[],
            this.groupHolder.getGroup("Text") as IThing[],
        ]);

        this.gameplay.gameStart();
    }

    /**
     * Creates the settings for individual modules.
     *
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns Settings for individual modules.
     */
    protected createModuleSettings(settings: IFullScreenPokemonSettings): IModuleSettings {
        return {
            ...new ModuleSettingsGenerator().generate(this),
            ...settings.moduleSettings,
        } as IModuleSettings;
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal BattleMovr.
     */
    protected createBattleMover(moduleSettings: IModuleSettings, _settings: IFullScreenPokemonSettings): IBattleMovr {
        return new BattleMovr(moduleSettings.battles);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal FlagSwappr.
     */
    protected createFlagSwapper(moduleSettings: IModuleSettings, _settings: IFullScreenPokemonSettings): IFlagSwappr<IFlags> {
        return new FlagSwappr<IFlags>(moduleSettings.flags);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal MenuGraphr.
     */
    protected createMenuGrapher(moduleSettings: IModuleSettings, _settings: IFullScreenPokemonSettings): IMenuGraphr {
        return new MenuGraphr({
            gameStarter: this,
            ...moduleSettings.menus,
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal ScenePlayer.
     */
    protected createScenePlayer(moduleSettings: IModuleSettings, _settings: IFullScreenPokemonSettings): IScenePlayr {
        return new ScenePlayr({
            scope: this.cutscenes,
            ...moduleSettings.scenes,
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal StateHoldr.
     */
    protected createStateHolder(moduleSettings: IModuleSettings, _settings: IFullScreenPokemonSettings): IStateHoldr {
        return new StateHoldr({
            itemsHolder: this.itemsHolder,
            ...moduleSettings.state,
        });
    }
}

FullScreenPokemon.prototype.scale = Constants.scale;
