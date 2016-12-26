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
import { Saves } from "./components/Saves";
import { Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { ModuleSettingsGenerator } from "./settings/ModuleSettingsGenerator";
import { IMapScreenr, IModuleSettings, IPlayer, IThing } from "./IFullScreenPokemon";

/**
 * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
 */
export class FullScreenPokemon extends GameStartr {
    /**
     * Static settings passed to individual reset Functions.
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
     * 
     */
    public resetModules(settings: IProcessedSizeSettings): void {
        super.resetModules(settings);

        this.battleMover = this.createBattleMover(this.moduleSettings, settings);
        this.menuGrapher = this.createMenuGrapher(this.moduleSettings, settings);
        this.stateHolder = this.createStateHolder(this.moduleSettings, settings);
        this.userWrapper = this.createUserWrapper(this.moduleSettings, settings);

        this.areaSpawner.setCommandScope(this.maps);
        this.inputWriter.setEventScope(this.inputs);
        this.mapsCreator.setScope(this.maps);
        this.timeHandler.setClassScope(this.graphics);
        this.thingHitter.setGeneratorScope(this.collisions);

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
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the FullScreenPokemon class.
     * @returns A new internal BattleMovr.
     */
    protected createBattleMover(moduleSettings: IModuleSettings, _settings: IProcessedSizeSettings): IBattleMovr {
        return new BattleMovr({
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
            modifierScope: this.menus,
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

    /**
     * Processes raw instantiation settings for sizing.
     * 
     * @param settings   Raw instantiation settings.
     * @returns Initialization settings with filled out, finite sizes.
     */
    protected processSettings(rawSettings: ISizeSettings = {}): IProcessedSizeSettings {
        const settings: ISizeSettings = { ...rawSettings };

        if (!settings.size && !settings.width && !settings.height) {
            settings.size = this.moduleSettings.ui.sizeDefault;
        }

        if (settings.size) {
            settings.height = this.moduleSettings.ui.sizes![settings.size].height;
            settings.width = this.moduleSettings.ui.sizes![settings.size].width;
        }

        return super.processSettings(settings);
    }
}

FullScreenPokemon.prototype.moduleSettings = new ModuleSettingsGenerator().generate();
FullScreenPokemon.prototype.scale = Scale;
