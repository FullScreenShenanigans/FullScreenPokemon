import { IAudioPlayr } from "audioplayr/lib/IAudioPlayr";
import { IBattleMovr, IMove } from "battlemovr/lib/IBattleMovr";
import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";
import { IMathDecidr } from "mathdecidr/lib/IMathDecidr";
import { IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { IModAttachr } from "modattachr/lib/IModAttachr";
import { INumberMakr } from "numbermakr/lib/INumberMakr";
import { IThingHittr } from "thinghittr/lib/IThingHittr";
import { IScenePlayr } from "sceneplayr/lib/IScenePlayr";
import { ITimeHandlr } from "timehandlr/lib/ITimeHandlr";

import {
    IBattleInfo, IBattler, IMenu, IPlayer, IPokemon, IThing, IWildPokemonSchema
} from "../IFullScreenPokemon";
import { Actions } from "./Actions";
import { Cutscenes } from "./Cutscenes";
import { Graphics } from "./Graphics";
import { Menus } from "./Menus";
import { Physics } from "./Physics";
import { Utilities } from "./Utilities";

/**
 * Settings to initialize a new instance of the Battles class.
 */
export interface IBattleSettings {
    /**
     * Action functions used by FullScreenPokemon instances.
     */
    actions: Actions;

    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    audioPlayer: IAudioPlayr;

    /**
     * A driver for RPG-like battles between two collections of actors.
     */
    battleMover: IBattleMovr;

    /**
     * Cutscene functions used by FullScreenPokemon instances.
     */
    cutscenes: Cutscenes;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    graphics: Graphics;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    itemsHolder: IItemsHoldr;

    /**
     * A computation utility to automate running common equations.
     */
    mathDecider: IMathDecidr;

    /**
     * Menu management system.
     */
    menuGrapher: IMenuGraphr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    menus: Menus;

    /**
     * Hookups for extensible triggered mod events.
     */
    modAttacher: IModAttachr;

    /**
     * State based random number generator.
     */
    numberMaker: INumberMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    physics: Physics;

    /**
     * Automation for physics collisions and reactions.
     */
    thingHitter: IThingHittr;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    scenePlayer: IScenePlayr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    timeHandler: ITimeHandlr;

    /**
     * Utility functions used by FullScreenPokemon instances.
     */
    utilities: Utilities;
}

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles {
    /**
     * Action functions used by FullScreenPokemon instances.
     */
    protected readonly actions: Actions;

    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    protected readonly audioPlayer: IAudioPlayr;

    /**
     * A driver for RPG-like battles between two collections of actors.
     */
    protected readonly battleMover: IBattleMovr;

    /**
     * Cutscene functions used by FullScreenPokemon instances.
     */
    protected readonly cutscenes: Cutscenes;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    protected readonly graphics: Graphics;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    protected readonly itemsHolder: IItemsHoldr;

    /**
     * A computation utility to automate running common equations.
     */
    protected readonly mathDecider: IMathDecidr;

    /**
     * Menu management system.
     */
    protected readonly menuGrapher: IMenuGraphr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    protected readonly menus: Menus;

    /**
     * Hookups for extensible triggered mod events.
     */
    protected readonly modAttacher: IModAttachr;

    /**
     * State based random number generator.
     */
    protected readonly numberMaker: INumberMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    protected readonly physics: Physics;

    /**
     * Automation for physics collisions and reactions.
     */
    protected readonly thingHitter: IThingHittr;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    protected readonly scenePlayer: IScenePlayr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    protected readonly timeHandler: ITimeHandlr;

    /**
     * Utility functions used by FullScreenPokemon instances.
     */
    protected readonly utilities: Utilities;

    /**
     * Initializes a new instance of the Battles class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IBattleSettings) {
        this.actions = settings.actions;
        this.audioPlayer = settings.audioPlayer;
        this.battleMover = settings.battleMover;
        this.cutscenes = settings.cutscenes;
        this.graphics = settings.graphics;
        this.itemsHolder = settings.itemsHolder;
        this.mathDecider = settings.mathDecider;
        this.menuGrapher = settings.menuGrapher;
        this.menus = settings.menus;
        this.modAttacher = settings.modAttacher;
        this.numberMaker = settings.numberMaker;
        this.physics = settings.physics;
        this.thingHitter = settings.thingHitter;
        this.scenePlayer = settings.scenePlayer;
        this.timeHandler = settings.timeHandler;
        this.utilities = settings.utilities;
    }

    /**
     * Starts a Pokemon battle.
     * 
     * @param battleInfo   Settings for the battle.
     */
    public startBattle(battleInfo: IBattleInfo): void {
        this.modAttacher.fireEvent("onBattleStart", battleInfo);

        const animations: string[] = battleInfo.animations || [
            // "LineSpiral", "Flash"
            "Flash"
        ];
        const animation: string = this.numberMaker.randomArrayMember(animations);
        let player: any = battleInfo.battlers.player;

        if (!player) {
            battleInfo.battlers.player = player = {} as any;
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || this.itemsHolder.getItem("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        this.modAttacher.fireEvent("onBattleReady", battleInfo);

        this.audioPlayer.playTheme(battleInfo.theme || "Battle Trainer");

        (this.cutscenes as any)["cutsceneBattleTransition" + animation](
            {
                battleInfo,
                callback: (): void => this.battleMover.startBattle(battleInfo)
            }
        );

        this.graphics.moveBattleKeptThingsToText(battleInfo);
    }

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: IPokemon): void {
        const moves: IMove[] = this.mathDecider.getConstant("moves");
        const statisticNames: string[] = this.mathDecider.getConstant("statisticNames");

        for (let statisticName of statisticNames) {
            (pokemon as any)[statisticName] = (pokemon as any)[statisticName + "Normal"];
        }

        for (let move of pokemon.moves) {
            move.remaining = (moves as any)[move.title].PP;
        }

        pokemon.status = "";
    }

    /**
     * Starts grass battle if a Player is in grass, using the doesGrassEncounterHappen
     * equation.
     * 
     * @param thing   An in-game Player.
     */
    public checkPlayerGrassBattle(thing: IPlayer): boolean {
        if (!thing.grass || this.menuGrapher.getActiveMenu()) {
            return false;
        }

        if (!this.thingHitter.checkHitForThings(thing as any, thing.grass as any)) {
            delete thing.grass;
            return false;
        }

        if (!this.mathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
            return false;
        }

        thing.keys = thing.getKeys();
        this.actions.animateGrassBattleStart(thing, thing.grass);

        return true;
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    public chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        const choice: number = this.numberMaker.random();
        let sum: number = 0;

        for (const option of options) {
            sum += option.rate;
            if (sum >= choice) {
                return option;
            }
        }

        throw new Error("Failed to pick random wild Pokemon from options.");
    }

    /**
     * Adds Ball and BallEmpty Things to a menu representing inventory Pokemon.
     * 
     * @param menu   A menu to add the Things to.
     * @param battler   Information on the Pokemon to add balls for.
     */
    public addBattleDisplayPokeballs(menu: IMenu, battler: IBattler, opposite?: boolean): void {
        const text: string[][] = [];
        let i: number;

        for (i = 0; i < battler.actors.length; i += 1) {
            text.push(["Ball"]);
        }

        for (; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (opposite) {
            text.reverse();
        }

        this.menuGrapher.addMenuDialog(menu.name, [text]);
    }

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for.
     */
    public addBattleDisplayPokemonHealth(battlerName: "player" | "opponent"): void {
        const battleInfo: IBattleInfo = this.battleMover.getBattleInfo() as IBattleInfo;
        const pokemon: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const menu: string = [
            "Battle",
            battlerName[0].toUpperCase(),
            battlerName.slice(1),
            "Health"
        ].join("");

        this.menuGrapher.createMenu(menu);
        this.menuGrapher.createMenu(menu + "Title");
        this.menuGrapher.createMenu(menu + "Level");
        this.menuGrapher.createMenu(menu + "Amount");

        this.setBattleDisplayPokemonHealthBar(
            battlerName,
            pokemon.HP,
            pokemon.HPNormal);

        this.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     * @param hp   How much health the battler's Pokemon currently has.
     * @param hp   The battler's Pokemon's normal maximum health.
     */
    public setBattleDisplayPokemonHealthBar(battlerName: string, hp: number, hpNormal: number): void {
        const nameUpper: string = battlerName[0].toUpperCase() + battlerName.slice(1);
        const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
        const bar: IThing = this.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.mathDecider.compute("widthHealthBar", 25, hp, hpNormal);
        const healthDialog: string = this.utilities.makeDigit(hp, 3, "\t")
            + "/"
            + this.utilities.makeDigit(hpNormal, 3, "\t");

        if (this.menuGrapher.getMenu(menuNumbers)) {
            for (const menu of this.menuGrapher.getMenu(menuNumbers).children) {
                this.physics.killNormal(menu as IThing);
            }

            this.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }

    /**
     * Animates a Pokemon's health bar to increase or decrease its width.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     * @param hpStart   The battler's Pokemon's starting health.
     * @param hpEnd   The battler's Pokemon's ending health.
     * @param hpNormal   The battler's Pokemon's normal maximum health.
     * @param callback   A callback for when the bar is done resizing.
     */
    public animateBattleDisplayPokemonHealthBar(
        battlerName: string,
        hpStart: number,
        hpEnd: number,
        hpNormal: number,
        callback?: (...args: any[]) => void): void {
        const direction: number = hpStart > hpEnd ? -1 : 1;
        const hpNew: number = Math.round(hpStart + direction);

        this.setBattleDisplayPokemonHealthBar(battlerName, hpNew, hpNormal);

        if (hpNew === hpEnd) {
            if (callback) {
                callback();
            }
            return;
        }

        this.timeHandler.addEvent(
            (): void => this.animateBattleDisplayPokemonHealthBar(
                battlerName,
                hpNew,
                hpEnd,
                hpNormal,
                callback),
            2);
    }

    /**
     * Opens the in-battle moves menu.
     */
    public openBattleMovesMenu(): void {
        const actorMoves: IMove[] = this.battleMover.getBattleInfo().battlers.player!.selectedActor!.moves;
        const options: any[] = actorMoves.map((move: IMove): any => {
            return {
                text: move.title.toUpperCase(),
                remaining: move.remaining,
                callback: (): void => {
                    this.battleMover.playMove(move.title);
                }
            };
        });

        for (let i: number = actorMoves.length; i < 4; i += 1) {
            options.push({
                text: "-"
            });
        }

        this.menuGrapher.createMenu("BattleFightList");
        this.menuGrapher.addMenuList("BattleFightList", { options });
        this.menuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     */
    public openBattleItemsMenu(): void {
        this.menus.openPokemonMenu({
            position: {
                horizontal: "right",
                vertical: "bottom",
                offset: {
                    left: 0
                }
            },
            size: {
                height: 44
            },
            container: "Battle",
            backMenu: "BattleOptions"
        });
    }

    /**
     * Opens the in-battle Pokemon menu.
     */
    public openBattlePokemonMenu(): void {
        this.menus.openItemsMenu({
            backMenu: "BattleOptions",
            container: "Battle"
        });
    }

    /**
     * Starts the dialog to exit a battle.
     */
    public startBattleExit(): void {
        if (this.battleMover.getBattleInfo().battlers.opponent!.category === "Trainer") {
            this.scenePlayer.playRoutine("BattleExitFail");
            return;
        }

        this.menuGrapher.deleteMenu("BattleOptions");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            this.battleMover.getBattleInfo().exitDialog
                || this.battleMover.getDefaults().exitDialog || "",
            (): void => {
                this.battleMover.closeBattle();
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }
}
