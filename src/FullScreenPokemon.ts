import { BattleMovr } from "battlemovr/lib/BattleMovr";
import { IBattleMovr } from "battlemovr/lib/IBattleMovr";
import { GameStartr } from "gamestartr/lib/GameStartr";
import { IGameStartrSettings, IGameStartrProcessedSettings } from "gamestartr/lib/IGameStartr";
import { IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { MenuGraphr } from "menugraphr/lib/MenuGraphr";
import { ScenePlayr } from "sceneplayr/lib/ScenePlayr";
import { IStateHoldr } from "stateholdr/lib/IStateHoldr";
import { StateHoldr } from "stateholdr/lib/StateHoldr";
import { IUserWrappr } from "userwrappr/lib/IUserWrappr";
import { UserWrappr } from "userwrappr/lib/UserWrappr";

import { Animations } from "./components/Animations";
import { Battles } from "./components/Battles";
import { Collisions } from "./components/Collisions";
import { Cutscenes } from "./components/Cutscenes";
import { Cycling } from "./components/Cycling";
import { Fishing } from "./components/Fishing";
import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Inputs } from "./components/Inputs";
import { Macros } from "./components/Macros";
import { Maintenance } from "./components/Maintenance";
import { Maps } from "./components/Maps";
import { Menus } from "./components/Menus";
import { Physics } from "./components/Physics";
import { Scrolling } from "./components/Scrolling";
import { Storage } from "./components/Storage";
import { Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { Scale } from "./Constants";
import { IMapScreenr, IModuleSettings, IPlayer, IThing } from "./IFullScreenPokemon";
import { ModuleSettingsGenerator } from "./ModuleSettingsGenerator";

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
 */
export class FullScreenPokemon extends GameStartr {
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
     * Animation functions used by this instance.
     */
    public animations: Animations;

    /**
     * Battle functions used by this instance.
     */
    public battles: Battles;

    /**
     * Collision functions used by this instance.
     */
    public collisions: Collisions;

    /**
     * Cutscene functions used by this instance.
     */
    public cutscenes: Cutscenes;

    /**
     * Cycling functions used by this instance.
     */
    public cycling: Cycling;

    /**
     * Fishing functions used by this instance.
     */
    public fishing: Fishing;

    /**
     * Gameplay functions used by this instance.
     */
    public gameplay: Gameplay;

    /**
     * Graphics functions used by this instance.
     */
    public graphics: Graphics;

    /**
     * Input functions used by this instance.
     */
    public inputs: Inputs;

    /**
     * Macro functions used by this instance.
     */
    public macros: Macros;

    /**
     * Maintenance functions used by this instance.
     */
    public maintenance: Maintenance;

    /**
     * Maps functions used by this instance.
     */
    public maps: Maps;

    /**
     * Menu functions used by this instance.
     */
    public menus: Menus;

    /**
     * Physics functions used by this instance.
     */
    public physics: Physics;

    /**
     * Thing manipulation functions used by this instance.
     */
    public things: Things;

    /**
     * Scrolling functions used by this instance.
     */
    public scrolling: Scrolling;

    /**
     * Storage functions used by this instance.
     */
    public storage: Storage;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities;

    /**
     * Static settings passed to individual reset Functions.
     */
    public moduleSettings: IModuleSettings;

    /**
     * How much to scale each pixel from PixelDrawr to the real canvas.
     */
    public scale: number;

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
    public constructor(settings: IGameStartrSettings = {}) {
        if (!settings.size && !settings.width && !settings.height) {
            settings.size = FullScreenPokemon.prototype.moduleSettings.ui.sizeDefault;
        }

        if (settings.size) {
            settings.height = FullScreenPokemon.prototype.moduleSettings.ui.sizes![settings.size].height;
            settings.width = FullScreenPokemon.prototype.moduleSettings.ui.sizes![settings.size].width;
        }

        super(settings);

        this.scale = FullScreenPokemon.prototype.scale;

        this.gameplay.gameStart();
    }

    /**
     * 
     */
    protected reset(rawSettings: IGameStartrSettings): void {
        super.reset(rawSettings);

        // this.resetMathDecider();
        // this.resetMenuGrapher();
        // this.resetStateHolder();
        // this.resetBattleMover();
        // this.resetUserWrapper();

        // this.areaSpawner.setCommandScope(this.maps);
        // this.inputWriter.setEventScope(this.inputs);
        // this.mapsCreator.setScope(this.maps);
        // this.timeHandler.setClassScope(this.graphics);
        // this.thingHitter.setGeneratorScope(this.collisions);

        this.pixelDrawer.setThingArrays([
            this.groupHolder.getGroup("Terrain") as IThing[],
            this.groupHolder.getGroup("Solid") as IThing[],
            this.groupHolder.getGroup("Scenery") as IThing[],
            this.groupHolder.getGroup("Character") as IThing[],
            this.groupHolder.getGroup("Text") as IThing[]
        ]);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal BattleMovr.
     */
    protected resetBattleMover(): void {
        this.battleMover = new BattleMovr({
            gameStarter: this,
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
            ],
            ...this.moduleSettings.battles
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal MenuGraphr.
     */
    protected resetMenuGrapher(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IMenuGraphr {
        return new MenuGraphr({
            gameStarter: this,
            modifierScope: this.menus,
            ...moduleSettings.menus
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal ScenePlayer.
     */
    protected createScenePlayer(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IScenePlayr {
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
    protected createStateHolder(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IStateHoldr {
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
    protected createUserWrapper(): IUserWrappr {
        return new UserWrappr({
            gameStarter: this,
            ...this.moduleSettings.ui
        });
    }

    /**
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new HTML container containing all game elements.
     */
    protected createContainer(settings: IGameStartrProcessedSettings): HTMLDivElement {
        const container: HTMLDivElement = super.createContainer(settings);

        container.style.fontFamily = "Press Start";
        container.className += " FullScreenPokemon";

        return container;
    }
}

// Prototype constants are defined first so settings files can use them
FullScreenPokemon.prototype.scale = Scale;
FullScreenPokemon.prototype.moduleSettings = new ModuleSettingsGenerator().generate();
