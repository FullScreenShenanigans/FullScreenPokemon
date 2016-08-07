/// <reference path="../typings/BattleMovr.d.ts" />
/// <reference path="../typings/GameStartr.d.ts" />
/// <reference path="../typings/MenuGraphr.d.ts" />
/// <reference path="../typings/StateHoldr.d.ts" />

import { Animations } from "./Animations";
import { Battles } from "./Battles";
import { Collisions } from "./Collisions";
import { Cutscenes } from "./Cutscenes";
import { Cycling } from "./Cycling";
import { Fishing } from "./Fishing";
import { Gameplay } from "./Gameplay";
import { Graphics } from "./Graphics";
import { IFullScreenPokemonStoredSettings, IMapScreenr, IPlayer } from "./IFullScreenPokemon";
import { Macros } from "./Macros";
import { Maintenance } from "./Maintenance";
import { Maps } from "./Maps";
import { Menus } from "./Menus";
import { Physics } from "./Physics";
import { Scrolling } from "./Scrolling";
import { Storage } from "./Storage";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
 */
export class FullScreenPokemon extends GameStartr.GameStartr {

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with a bag
     * of assorted variable values.
     */
    public MapScreener: IMapScreenr;

    /**
     * A utility to save collections of game state using an ItemsHoldr.
     * Keyed changes to named collections can be saved temporarily or permanently.
     */
    public StateHolder: StateHoldr.IStateHoldr;

    /**
     * A menu management system. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    public MenuGrapher: MenuGraphr.IMenuGraphr;

    /**
     * An in-game battle management system for RPG-like battles between actors.
     */
    public BattleMover: BattleMovr.IBattleMovr;

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
    public settings: IFullScreenPokemonStoredSettings;

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
     * @param settings   Any additional user-provided settings.
     */
    protected resetModules(settings: GameStartr.IGameStartrSettings): void {
        this.resetMathDecider(settings);
        this.resetStateHolder(settings);
        this.resetMenuGrapher(settings);
        super.resetModules(settings);
    }

    /**
     * Sets this.StateHolder.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetStateHolder(settings: GameStartr.IGameStartrSettings): void {
        this.StateHolder = new StateHoldr.StateHoldr(
            this.utilities.proliferate(
                {
                    "ItemsHolder": this.ItemsHolder
                },
                this.settings.states));
    }

    /**
     * Sets this.MathDecider, adding its existing NumberMaker to the constants.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetMathDecider(settings: GameStartr.IGameStartrSettings): void {
        this.MathDecider = new MathDecidr.MathDecidr(
            this.utilities.proliferate(
                {
                    "constants": {
                        "NumberMaker": this.NumberMaker
                    }
                },
                this.settings.math));
    }

    /**
     * Sets this.MenuGrapher.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetMenuGrapher(settings: GameStartr.IGameStartrSettings): void {
        this.MenuGrapher = new MenuGraphr.MenuGraphr(
            this.utilities.proliferate(
                {
                    "GameStarter": this
                },
                this.settings.menus));
    }

    /**
     * Sets this.BattleMover.
     * 
     * @param customs   Any optional custom settings.
     */
    protected resetBattleMover(settings: GameStartr.IGameStartrSettings): void {
        this.BattleMover = new BattleMovr.BattleMovr(
            this.utilities.proliferate(
                {
                    "GameStarter": this,
                    "MenuGrapher": this.MenuGrapher,
                    "openItemsMenuCallback": this.menus.openItemsMenu.bind(this),
                    "openActorsMenuCallback": this.menus.openPokemonMenu.bind(this)
                },
                this.settings.battles));
    }

    /**
     * Sets this.container.
     * 
     * The container is given the "Press Start" font, and the PixelRender is told
     * which groups to draw in order.
     * 
     * @param settings   Extra settings such as screen size.
     */
    protected resetContainer(settings: GameStartr.IGameStartrSettings): void {
        super.resetContainer(settings);

        this.container.style.fontFamily = "Press Start";
        this.container.className += " FullScreenPokemon";

        this.PixelDrawer.setThingArrays([
            this.GroupHolder.getGroup("Terrain") as GameStartr.IThing[],
            this.GroupHolder.getGroup("Solid") as GameStartr.IThing[],
            this.GroupHolder.getGroup("Scenery") as GameStartr.IThing[],
            this.GroupHolder.getGroup("Character") as GameStartr.IThing[],
            this.GroupHolder.getGroup("Text") as GameStartr.IThing[]
        ]);
    }
}
