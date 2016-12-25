import { IAreaSpawnr } from "areaspawnr/lib/IAreaSpawnr";
import { IAudioPlayr } from "audioplayr/lib/IAudioPlayr";
import { IMove } from "battlemovr/lib/IBattleMovr";
import { IGroupHoldr } from "groupholdr/lib/IGroupHoldr";
import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";
import { IMathDecidr } from "mathdecidr/lib/IMathDecidr";
import { IMenuDialogRaw, IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { IModAttachr } from "modattachr/lib/IModAttachr";
import { INumberMakr } from "numbermakr/lib/INumberMakr";
import { IObjectMakr } from "objectmakr/lib/IObjectMakr";
import { IPixelDrawr } from "pixeldrawr/lib/IPixelDrawr";
import { IScenePlayr } from "sceneplayr/lib/IScenePlayr";
import { IStateHoldr } from "stateholdr/lib/IStateHoldr";
import { IThingHittr } from "thinghittr/lib/IThingHittr";
import { IEventCallback, ITimeEvent, ITimeHandlr } from "timehandlr/lib/ITimeHandlr";

import { Direction, DirectionAliases, DirectionClasses } from "../Constants";
import {
    IArea, IAreaGate, IareaSpawner, ICharacter, IColorFadeSettings, IDetector, IDialog,
    IDialogOptions, IEnemy, IGymDetector, IHMCharacter, IHMMoveSchema, IMap, IMapScreenr,
    IMenuTriggerer, IPlayer, IPokemon, ISightDetector, IThemeDetector, IThing,
    ITransporter, ITransportSchema, IWalkingOnStop, IWalkingOnStopCommandFunction,
    IWildPokemonSchema
} from "../IFullScreenPokemon";
import { Battles } from "./Battles";
import { Graphics } from "./Graphics";
import { Maps } from "./Maps";
import { Menus } from "./Menus";
import { Physics } from "./Physics";
import { Saves } from "./Saves";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * Settings to initialize a new instance of the Action class.
 */
export interface IActionsSettings {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    areaSpawner: IAreaSpawnr;

    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    audioPlayer: IAudioPlayr;

    /**
     * Battle functions used by FullScreenPokemon instances.
     */
    battles: Battles;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    groupHolder: IGroupHoldr;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    itemsHolder: IItemsHoldr;

    /**
     * Map functions used by FullScreenPokemon instances.
     */
    maps: Maps;

    /**
     * A flexible container for map attributes and viewport.
     */
    mapScreener: IMapScreenr;

    /**
     * A computation utility to automate running common equations.
     */
    mathDecider: IMathDecidr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    menus: Menus;

    /**
     * Menu management system.
     */
    menuGrapher: IMenuGraphr;

    /**
     * Hookups for extensible triggered mod events.
     */
    modAttacher: IModAttachr;

    /**
     * State-based random number generator.
     */
    numberMaker: INumberMakr;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    objectMaker: IObjectMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    physics: Physics;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    pixelDrawer: IPixelDrawr;

    /**
     * Storage functions used by FullScreenPokemon instances.
     */
    saves: Saves;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    scenePlayer: IScenePlayr;

    /**
     * General storage saving for collections of state.
     */
    stateHolder: IStateHoldr;

    /**
     * Thing manipulation functions used by FullScreenPokemon instances.
     */
    things: Things;

    /**
     * Automation for physics collisions and reactions.
     */
    thingHitter: IThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    timeHandler: ITimeHandlr;

    /**
     * Miscellaneous utility functions used by FullScreenPokemon instances.
     */
    utilities: Utilities;
}

/**
 * Action functions used by FullScreenPokemon instances.
 */
export class Actions {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    protected readonly areaSpawner: IAreaSpawnr;

    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    protected readonly audioPlayer: IAudioPlayr;

    /**
     * Battle functions used by FullScreenPokemon instances.
     */
    protected readonly battles: Battles;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    protected readonly graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    protected readonly groupHolder: IGroupHoldr;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    protected readonly itemsHolder: IItemsHoldr;

    /**
     * Map functions used by FullScreenPokemon instances.
     */
    protected readonly maps: Maps;

    /**
     * A flexible container for map attributes and viewport.
     */
    protected readonly mapScreener: IMapScreenr;

    /**
     * A computation utility to automate running common equations.
     */
    protected readonly mathDecider: IMathDecidr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    protected readonly menus: Menus;

    /**
     * Menu management system.
     */
    protected readonly menuGrapher: IMenuGraphr;

    /**
     * Hookups for extensible triggered mod events.
     */
    protected readonly modAttacher: IModAttachr;

    /**
     * State-based random number generator.
     */
    protected readonly numberMaker: INumberMakr;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    protected readonly objectMaker: IObjectMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    protected readonly physics: Physics;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    protected readonly pixelDrawer: IPixelDrawr;

    /**
     * Storage functions used by FullScreenPokemon instances.
     */
    protected readonly saves: Saves;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    protected readonly scenePlayer: IScenePlayr;

    /**
     * General storage saving for collections of state.
     */
    protected readonly stateHolder: IStateHoldr;

    /**
     * Thing manipulation functions used by FullScreenPokemon instances.
     */
    protected readonly things: Things;

    /**
     * Automation for physics collisions and reactions.
     */
    protected readonly thingHitter: IThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    protected readonly timeHandler: ITimeHandlr;

    /**
     * Miscellaneous utility functions used by FullScreenPokemon instances.
     */
    protected readonly utilities: Utilities;

    /**
     * Initializes a new instance of the Actions class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IActionsSettings) {
        this.areaSpawner = settings.areaSpawner;
        this.audioPlayer = settings.audioPlayer;
        this.battles = settings.battles;
        this.graphics = settings.graphics;
        this.groupHolder = settings.groupHolder;
        this.itemsHolder = settings.itemsHolder;
        this.maps = settings.maps;
        this.mapScreener = settings.mapScreener;
        this.mathDecider = settings.mathDecider;
        this.menus = settings.menus;
        this.menuGrapher = settings.menuGrapher;
        this.modAttacher = settings.modAttacher;
        this.numberMaker = settings.numberMaker;
        this.objectMaker = settings.objectMaker;
        this.physics = settings.physics;
        this.pixelDrawer = settings.pixelDrawer;
        this.saves = settings.saves;
        this.scenePlayer = settings.scenePlayer;
        this.things = settings.things;
        this.thingHitter = settings.thingHitter;
        this.timeHandler = settings.timeHandler;
        this.utilities = settings.utilities;
    }

    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     * 
     * @param thing   A newly placed Character.
     */
    public spawnCharacter(thing: ICharacter): void {
        if (thing.sight) {
            thing.sightDetector = this.things.add(
                [
                    "SightDetector",
                    {
                        direction: thing.direction,
                        width: thing.sight * 8
                    }
                ]) as ISightDetector;
            thing.sightDetector.viewer = thing;
            this.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            this.timeHandler.addEvent(
                (): boolean => this.activateCharacterRoaming(thing),
                this.numberMaker.randomInt(70));
        }
    }

    /**
     * Activates a WindowDetector by immediately starting its cycle of
     * checking whether it's in-frame to activate.
     * 
     * @param thing   A newly placed WindowDetector.
     */
    public spawnWindowDetector(thing: IDetector): void {
        if (!this.checkWindowDetector(thing)) {
            this.timeHandler.addEventInterval(
                (): boolean => this.checkWindowDetector(thing),
                7,
                Infinity);
        }
    }

    /**
     * Snaps a moving Thing to a predictable grid position.
     * 
     * @param thing   A Thing to snap the position of.
     */
    public animateSnapToGrid(thing: IThing): void {
        const grid: number = 4 * 8;
        const x: number = (this.mapScreener.left + thing.left) / grid;
        const y: number = (this.mapScreener.top + thing.top) / grid;

        this.physics.setLeft(thing, Math.round(x) * grid - this.mapScreener.left);
        this.physics.setTop(thing, Math.round(y) * grid - this.mapScreener.top);
    }

    /**
     * Freezes a Character to start a dialog.
     * 
     * @param thing   A Character to freeze.
     */
    public animatePlayerDialogFreeze(thing: ICharacter): void {
        this.animateCharacterPreventWalking(thing);
        this.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }
    }

    /**
     * Gradually changes a numeric attribute over time.
     * 
     * @param thing   A Thing whose attribute is to change.
     * @param attribute   The name of the attribute to change.
     * @param change   How much to change the attribute each tick.
     * @param goal   A final value for the attribute to stop at.
     * @param speed   How many ticks between changes.
     * @param onCompletion   A callback for when the attribute reaches the goal.
     * @returns The in-progress TimeEvent, if started.
     */
    public animateFadeAttribute(
        thing: IThing,
        attribute: string,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): ITimeEvent | undefined {
        (thing as any)[attribute] += change;

        if (change > 0) {
            if ((thing as any)[attribute] >= goal) {
                (thing as any)[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return undefined;
            }
        } else {
            if ((thing as any)[attribute] <= goal) {
                (thing as any)[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return undefined;
            }
        }

        return this.timeHandler.addEvent(
            (): void => {
                this.animateFadeAttribute(
                    thing,
                    attribute,
                    change,
                    goal,
                    speed,
                    onCompletion);
            },
            speed);
    }

    /**
     * Slides a Thing across the screen horizontally over time.
     * 
     * @param thing   A Thing to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midX location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onCompletion   A callback for when the Thing reaches the goal.
     * @returns The in-progress TimeEvent.
     */
    public animateSlideHorizontal(
        thing: IThing,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): void {
        this.physics.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.physics.getMidX(thing) >= goal) {
                this.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.physics.getMidX(thing) <= goal) {
                this.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.timeHandler.addEvent(
            (): void => {
                this.animateSlideHorizontal(
                    thing,
                    change,
                    goal,
                    speed,
                    onCompletion);
            },
            speed);
    }

    /**
     * Slides a Thing across the screen vertically over time.
     * 
     * @param thing   A Thing to slide across the screen.
     * @param change   How far to move each tick.
     * @param goal   A midY location to stop sliding at.
     * @param speed   How many ticks between movements.
     * @param onCompletion   A callback for when the Thing reaches the goal.
     * @returns The in-progress TimeEvent.
     */
    public animateSlideVertical(
        thing: IThing,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): void {
        this.physics.shiftVert(thing, change);

        if (change > 0) {
            if (this.physics.getMidY(thing) >= goal) {
                this.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.physics.getMidY(thing) <= goal) {
                this.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.timeHandler.addEvent(
            (): void => {
                this.animateSlideVertical(
                    thing,
                    change,
                    goal,
                    speed,
                    onCompletion);
            },
            speed);
    }

    /**
     * Freezes a Character in grass and calls startBattle.
     * 
     * @param thing   A Character about to start a battle.
     * @param grass   Grass the Character is walking in.
     */
    public animateGrassBattleStart(thing: ICharacter, grass: IThing): void {
        const grassMap: IMap = this.areaSpawner.getMap(grass.mapName) as IMap;
        const grassArea: IArea = grassMap.areas[grass.areaName] as IArea;
        const options: IWildPokemonSchema[] | undefined = grassArea.wildPokemon.grass;
        if (!options) {
            throw new Error("Grass doesn't have any wild Pokemon options defined.");
        }

        const chosen: IWildPokemonSchema = this.battles.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.utilities.createPokemon(chosen);

        this.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.graphics.removeClass(thing.shadow, "walking");
        }

        this.animateCharacterPreventWalking(thing);

        this.battles.startBattle({
            battlers: {
                opponent: {
                    name: chosen.title,
                    actors: [chosenPokemon],
                    category: "Wild",
                    sprite: chosen.title.join("") + "Front"
                }
            }
        });
    }

    /**
     * Freezes a Character and starts a battle with an enemy.
     * 
     * @param _   A Character about to start a battle with other.
     * @param other   An enemy about to battle thing.
     */
    public animateTrainerBattleStart(_: ICharacter, other: IEnemy): void {
        const battleName: string = other.battleName || other.title;
        const battleSprite: string = other.battleSprite || battleName;

        this.battles.startBattle({
            battlers: {
                opponent: {
                    name: battleName.split(""),
                    sprite: battleSprite + "Front",
                    category: "Trainer",
                    hasActors: true,
                    reward: other.reward,
                    actors: other.actors.map(
                        (schema: IWildPokemonSchema): IPokemon => {
                            return this.utilities.createPokemon(schema);
                        })
                }
            },
            textStart: ["", " wants to fight!"],
            textDefeat: other.textDefeat,
            textAfterBattle: other.textAfterBattle,
            giftAfterBattle: other.giftAfterBattle,
            badge: other.badge,
            textVictory: other.textVictory,
            nextCutscene: other.nextCutscene
        });
    }

    /**
     * Creates and positions a set of four Things around a point.
     * 
     * @param x   The horizontal value of the point.
     * @param y   The vertical value of the point.
     * @param title   A title for each Thing to create.
     * @param settings   Additional settings for each Thing.
     * @param groupType   Which group to move the Things into, if any.
     * @returns The four created Things.
     */
    public animateThingCorners(
        x: number,
        y: number,
        title: string,
        settings: any,
        groupType?: string): [IThing, IThing, IThing, IThing] {
        const things: IThing[] = [];

        for (let i: number = 0; i < 4; i += 1) {
            things.push(this.things.add([title, settings]));
        }

        if (groupType) {
            for (const thing of things) {
                this.groupHolder.switchMemberGroup(thing, thing.groupType, groupType);
            }
        }

        this.physics.setLeft(things[0], x);
        this.physics.setLeft(things[1], x);

        this.physics.setRight(things[2], x);
        this.physics.setRight(things[3], x);

        this.physics.setBottom(things[0], y);
        this.physics.setBottom(things[3], y);

        this.physics.setTop(things[1], y);
        this.physics.setTop(things[2], y);

        this.graphics.flipHoriz(things[0]);
        this.graphics.flipHoriz(things[1]);

        this.graphics.flipVert(things[1]);
        this.graphics.flipVert(things[2]);

        return things as [IThing, IThing, IThing, IThing];
    }

    /**
     * Moves a set of four Things away from a point.
     * 
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    public animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.physics.shiftHoriz(things[0], amount);
        this.physics.shiftHoriz(things[1], amount);
        this.physics.shiftHoriz(things[2], -amount);
        this.physics.shiftHoriz(things[3], -amount);

        this.physics.shiftVert(things[0], -amount);
        this.physics.shiftVert(things[1], amount);
        this.physics.shiftVert(things[2], amount);
        this.physics.shiftVert(things[3], -amount);
    }

    /**
     * Creates a small smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeSmall(x: number, y: number, callback: (thing: IThing) => void): void {
        let things: IThing[] = this.animateThingCorners(x, y, "SmokeSmall", undefined, "Text");

        this.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.physics.killNormal(thing);
                }
            },
            7);

        this.timeHandler.addEvent(
            (): void => this.animateSmokeMedium(x, y, callback),
            7);
    }

    /**
     * Creates a medium-sized smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeMedium(x: number, y: number, callback: (thing: IThing) => void): void {
        const things: [IThing, IThing, IThing, IThing] = this.animateThingCorners(x, y, "SmokeMedium", undefined, "Text");

        this.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4),
            7);

        this.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.physics.killNormal(thing);
                }
            },
            14);

        this.timeHandler.addEvent(
            (): void => this.animateSmokeLarge(x, y, callback),
            14);
    }

    /**
     * Creates a large smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeLarge(x: number, y: number, callback: (thing: IThing) => void): void {
        const things: [IThing, IThing, IThing, IThing] = this.animateThingCorners(x, y, "SmokeLarge", undefined, "Text");

        this.animateExpandCorners(things, 4 * 2.5);

        this.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4 * 2),
            7);

        this.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.physics.killNormal(thing);
                }
            },
            21);

        if (callback) {
            this.timeHandler.addEvent(callback, 21);
        }
    }

    /**
     * Animates an exclamation mark above a Thing.
     * 
     * @param thing   A Thing to show the exclamation over.
     * @param timeout   How long to keep the exclamation (by default, 140).
     * @param callback   A callback for when the exclamation is removed.
     * @returns The exclamation Thing.
     */
    public animateExclamation(thing: IThing, timeout?: number, callback?: () => void): IThing {
        let exclamation: IThing = this.things.add("Exclamation");

        timeout = timeout || 140;

        this.physics.setMidXObj(exclamation, thing);
        this.physics.setBottom(exclamation, thing.top);

        this.timeHandler.addEvent(
            (): void => this.physics.killNormal(exclamation),
            timeout);

        if (callback) {
            this.timeHandler.addEvent(callback, timeout);
        }

        return exclamation;
    }

    /**
     * Fades the screen out to a solid color.
     * 
     * @param settings   Settings for the animation.
     * @returns The solid color Thing.
     */
    public animateFadeToColor(settings: IColorFadeSettings = {}): IThing {
        const color: string = settings.color || "White";
        const callback: ((...args: any[]) => void) | undefined = settings.callback;
        const change: number = settings.change || .33;
        const speed: number = settings.speed || 4;
        const blank: IThing = this.objectMaker.make(color + "Square", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 0
        });

        this.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            speed,
            (): void => {
                this.physics.killNormal(blank);
                if (callback) {
                    callback();
                }
            });

        return blank;
    }

    /**
     * Places a solid color over the screen and fades it out.
     * 
     * @param settings   Settings for the animation.
     * @returns The solid color Thing.
     */
    public animateFadeFromColor(settings: IColorFadeSettings = {}, ...args: any[]): IThing {
        const color: string = settings.color || "White";
        const callback: ((...args: any[]) => void) | undefined = settings.callback;
        const change: number = settings.change || .33;
        const speed: number = settings.speed || 4;
        const blank: IThing = this.objectMaker.make(color + "Square", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 1
        });

        this.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            (): void => {
                this.physics.killNormal(blank);
                if (callback) {
                    callback(settings, ...args);
                }
            });

        return blank;
    }

    /**
     * Animates a "flicker" effect on a Thing by repeatedly toggling its hidden
     * flag for a little while.
     * 
     * @param thing   A Thing to flicker.
     * @param cleartime   How long to wait to stop the effect (by default, 49).
     * @param interval   How many steps between hidden toggles (by default, 2).
     * @param callback   A Function to called on the Thing when done flickering.
     * @returns The flickering time event.
     */
    public animateFlicker(
        thing: IThing,
        cleartime: number = 49,
        interval: number = 2,
        callback?: (thing: IThing) => void): ITimeEvent {
        thing.flickering = true;

        this.timeHandler.addEventInterval(
            (): void => {
                thing.hidden = !thing.hidden;
                if (!thing.hidden) {
                    this.pixelDrawer.setThingSprite(thing);
                }
            },
            interval | 0,
            cleartime | 0);

        return this.timeHandler.addEvent(
            (): void => {
                thing.flickering = thing.hidden = false;
                this.pixelDrawer.setThingSprite(thing);

                if (callback) {
                    callback(thing);
                }
            },
            ((cleartime * interval) | 0) + 1);
    }

    /**
     * Shakes all Things on the screen back and forth for a little bit.
     * 
     * 
     * @param eightBitter
     * @param dx   How far to shift horizontally (by default, 0).
     * @param dy   How far to shift horizontally (by default, 0).
     * @param cleartime   How long until the screen is done shaking.
     * @param interval   How many game upkeeps between movements.
     * @returns The shaking time event.
     */
    public animateScreenShake(
        dx: number = 0,
        dy: number = 0,
        cleartime: number = 8,
        interval: number = 8,
        callback?: IEventCallback): ITimeEvent {
        this.timeHandler.addEventInterval(
            (): void => {
                this.groupHolder.callOnAll(this.physics, this.physics.shiftHoriz, dx);
                this.groupHolder.callOnAll(this.physics, this.physics.shiftVert, dy);
            },
            1,
            cleartime * interval);

        return this.timeHandler.addEvent(
            (): void => {
                dx *= -1;
                dy *= -1;

                this.timeHandler.addEventInterval(
                    (): void => {
                        dx *= -1;
                        dy *= -1;
                    },
                    interval,
                    cleartime);

                if (callback) {
                    this.timeHandler.addEvent(callback, interval * cleartime);
                }
            },
            (interval / 2) | 0);
    }

    /**
     * Sets a Character's xvel and yvel based on its speed and direction, and marks
     * its destination endpoint.
     * 
     * @param thing   A moving Character.
     * @param distance   How far the Character is moving.
     */
    public animateCharacterSetDistanceVelocity(thing: ICharacter, distance: number): void {
        thing.distance = distance;

        switch (thing.direction) {
            case 0:
                thing.xvel = 0;
                thing.yvel = -thing.speed;
                thing.destination = thing.top - distance;
                break;

            case 1:
                thing.xvel = thing.speed;
                thing.yvel = 0;
                thing.destination = thing.right + distance;
                break;

            case 2:
                thing.xvel = 0;
                thing.yvel = thing.speed;
                thing.destination = thing.bottom + distance;
                break;

            case 3:
                thing.xvel = -thing.speed;
                thing.yvel = 0;
                thing.destination = thing.left - distance;
                break;

            default:
                throw new Error("Unknown direction: " + thing.direction + ".");
        }
    }

    /**
     * Starts a Character's walking cycle regardless of the direction.
     * 
     * @param thing   A Character to start walking.
     * @param direction   What direction the Character should turn to face.
     * @param onStop   A queue of commands as alternating directions and distances.
     */
    public animateCharacterStartWalkingCycle(thing: ICharacter, direction: Direction, onStop?: IWalkingOnStop): void {
        if (!onStop || onStop.length === 0) {
            return;
        }

        // If the first queued command is a 0 distance, walking might be complete
        if (onStop[0] === 0) {
            // More commands indicates walking isn't done, and to continue turning/walking
            if (onStop.length > 1) {
                if (typeof onStop[1] === "function") {
                    (onStop[1] as IWalkingOnStopCommandFunction)(thing);
                    return;
                }

                this.animateCharacterSetDirection(thing, DirectionAliases[onStop[1] as number]);

                this.animateCharacterStartWalkingCycle(
                    thing,
                    DirectionAliases[onStop[1] as number],
                    onStop.slice(2));
            }

            return;
        }

        if (thing.follower) {
            thing.walkingCommands!.push(direction);
        }

        this.animateCharacterStartWalking(thing, direction, onStop);

        if (!thing.bordering[direction]) {
            this.physics.shiftBoth(thing, -thing.xvel, -thing.yvel);
        }
    }

    /**
     * Starts a Character walking in the given direction as part of a walking cycle.
     * 
     * @param thing   The Character to start walking.
     * @param direction   What direction to walk in (by default, up).
     * @param onStop   A queue of commands as alternating directions and distances.
     */
    public animateCharacterStartWalking(thing: ICharacter, direction: Direction = Direction.Top, onStop?: any): void {
        const repeats: number = this.mathDecider.compute("speedWalking", thing);
        const distance: number = repeats * thing.speed;

        thing.walking = true;
        this.animateCharacterSetDirection(thing, direction);
        this.animateCharacterSetDistanceVelocity(thing, distance);

        if (!thing.cycles || !(thing.cycles as any).walking) {
            this.timeHandler.addClassCycle(
                thing,
                ["walking", "standing"],
                "walking",
                repeats / 2);
        }

        if (!thing.walkingFlipping) {
            thing.walkingFlipping = this.timeHandler.addEventInterval(
                (): void => this.animateSwitchFlipOnDirection(thing),
                repeats,
                Infinity,
                thing);
        }

        if (thing.sight) {
            thing.sightDetector!.nocollide = true;
        }

        this.timeHandler.addEventInterval(
            (): void => thing.onWalkingStop.call(this, thing, onStop),
            repeats,
            Infinity,
            thing,
            onStop);

        if (!thing.bordering[direction]) {
            this.physics.shiftBoth(thing, thing.xvel, thing.yvel);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     * 
     * @param thing   A roaming Character.
     */
    public animateCharacterStartWalkingRandom(thing: ICharacter): void {
        if (!thing.roamingDirections) {
            throw new Error("Roaming Thing should define a .roamingDirections.");
        }

        let totalAllowed: number = 0;
        let direction: Direction;
        let i: number;

        for (const border of thing.bordering) {
            if (!border) {
                totalAllowed += 1;
            }
        }

        if (totalAllowed === 0) {
            return;
        }

        direction = this.numberMaker.randomInt(totalAllowed);

        for (i = 0; i <= direction; i += 1) {
            if (thing.bordering[i]) {
                direction += 1;
            }
        }

        if (thing.roamingDirections.indexOf(direction) === -1) {
            this.animateCharacterSetDirection(thing, direction);
        } else {
            this.animateCharacterStartWalking(thing, direction);
        }
    }

    /**
     * Continues a Character's walking cycle after taking a step. If .turning
     * is provided, the Character turns. If a Player is provided, its keys
     * and .canKeyWalking are respected.
     * 
     * @param thing   A Character mid-step.
     */
    public animateCharacterRepeatWalking(thing: ICharacter): void {
        if (typeof thing.turning !== "undefined") {
            if (!thing.player || !(thing as any).keys[thing.turning]) {
                this.animateCharacterSetDirection(thing, thing.turning);
                thing.turning = undefined;
                return;
            }

            thing.turning = undefined;
        }

        if (thing.player) {
            (thing as IPlayer).canKeyWalking = false;
        }

        this.animateCharacterStartWalking(thing, thing.direction);
    }

    /**
     * Reacts to a Character finishing a step and either stops all walking or moves to
     * the next action in the onStop queue.
     * 
     * @param thing   A Character finishing a walking step.
     * @param onStop   A queue of commands as alternating directions and distances.
     * @returns True, unless the next onStop is a Function to return the result of.
     */
    public animateCharacterStopWalking(thing: ICharacter, onStop?: IWalkingOnStop): boolean {
        thing.xvel = 0;
        thing.yvel = 0;
        thing.walking = false;

        this.graphics.removeClasses(thing, "walking", "standing");
        this.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        this.animateSnapToGrid(thing);

        if (thing.sight) {
            thing.sightDetector!.nocollide = false;
            this.animatePositionSightDetector(thing);
        }

        if (!onStop) {
            return true;
        }

        switch (onStop.constructor) {
            case Number:
                this.animateCharacterRepeatWalking(thing);
                break;

            case Array:
                if (onStop[0] > 0) {
                    onStop[0] = onStop[0] as number - 1;
                    this.animateCharacterStartWalkingCycle(thing, thing.direction, onStop);
                } else if (onStop.length === 0) {
                    break;
                } else {
                    if (onStop[1] instanceof Function) {
                        return (onStop[1] as IWalkingOnStopCommandFunction)(thing) as boolean;
                    }
                    this.animateCharacterStartWalkingCycle(
                        thing,
                        DirectionAliases[onStop[1] as number],
                        onStop.slice(2));
                }
                break;

            case Function:
                return (onStop as any)(thing);

            default:
                throw new Error("Unknown onStop: " + onStop + ".");
        }

        return true;
    }

    /**
     * Animates a Player to stop walking, which is the same logic for a normal
     * Character as well as MenuGrapher and following checks.
     * 
     * @param thing   A Player to stop walking.
     * @param onStop   A queue of commands as alternating directions and distances.
     * @returns True, unless the next onStop is a Function to return the result of.
     */
    public animatePlayerStopWalking(thing: IPlayer, onStop: IWalkingOnStop): boolean {
        if (this.battles.checkPlayerGrassBattle(thing)) {
            thing.canKeyWalking = true;
            return false;
        }

        if (thing.following) {
            return this.animateCharacterStopWalking(thing, onStop);
        }

        if (
            !this.menuGrapher.getActiveMenu()
            && (thing.keys as any)[thing.direction]) {
            this.animateCharacterSetDistanceVelocity(thing, thing.distance);
            return false;
        }

        if (typeof thing.nextDirection !== "undefined") {
            if (thing.nextDirection !== thing.direction && !thing.ledge) {
                this.physics.setPlayerDirection(thing, thing.nextDirection);
            }

            delete thing.nextDirection;
        } else {
            thing.canKeyWalking = true;
        }

        return this.animateCharacterStopWalking(thing, onStop);
    }

    /**
     * Animates a Character to no longer be able to walk.
     * 
     * @param thing   A Character that shouldn't be able to walk.
     */
    public animateCharacterPreventWalking(thing: ICharacter): void {
        thing.shouldWalk = false;
        thing.xvel = thing.yvel = 0;

        if (thing.player) {
            (thing as IPlayer).keys = (thing as IPlayer).getKeys();
        }

        this.mapScreener.blockInputs = true;
    }

    /**
     * Sets a Thing facing a particular direction.
     * 
     * @param thing   An in-game Thing.
     * @param direction   A direction for thing to face.
     * @todo Add more logic here for better performance.
     */
    public animateCharacterSetDirection(thing: IThing, direction: Direction): void {
        thing.direction = direction;

        if (direction % 2 === 1) {
            this.graphics.unflipHoriz(thing);
        }

        this.graphics.removeClasses(
            thing,
            DirectionClasses[Direction.Top],
            DirectionClasses[Direction.Right],
            DirectionClasses[Direction.Bottom],
            DirectionClasses[Direction.Left]);

        this.graphics.addClass(thing, DirectionClasses[direction]);

        if (direction === Direction.Right) {
            this.graphics.flipHoriz(thing);
            this.graphics.addClass(thing, DirectionClasses[Direction.Left]);
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    public animateCharacterSetDirectionRandom(thing: IThing): void {
        this.animateCharacterSetDirection(thing, this.numberMaker.randomIntWithin(0, 3));
    }

    /**
     * Flips or unflips a Character if its direction is vertical.
     * 
     * @param thing   A Character to flip or unflip.
     */
    public animateSwitchFlipOnDirection(thing: ICharacter): void {
        if (thing.direction % 2 !== 0) {
            return;
        }

        if (thing.flipHoriz) {
            this.graphics.unflipHoriz(thing);
        } else {
            this.graphics.flipHoriz(thing);
        }
    }

    /**
     * Positions a Character's detector in front of it as its sight.
     * 
     * @param thing   A Character that should be able to see.
     */
    public animatePositionSightDetector(thing: ICharacter): void {
        const detector: ISightDetector = thing.sightDetector!;
        let direction: Direction = thing.direction;

        if (detector.direction !== direction) {
            if (thing.direction % 2 === 0) {
                this.physics.setWidth(detector, thing.width);
                this.physics.setHeight(detector, thing.sight * 8);
            } else {
                this.physics.setWidth(detector, thing.sight * 8);
                this.physics.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.physics.setBottom(detector, thing.top);
                this.physics.setMidXObj(detector, thing);
                break;
            case 1:
                this.physics.setLeft(detector, thing.right);
                this.physics.setMidYObj(detector, thing);
                break;
            case 2:
                this.physics.setTop(detector, thing.bottom);
                this.physics.setMidXObj(detector, thing);
                break;
            case 3:
                this.physics.setRight(detector, thing.left);
                this.physics.setMidYObj(detector, thing);
                break;
            default:
                throw new Error("Unknown direction: " + direction + ".");
        }
    }

    /**
     * Animates the various logic pieces for finishing a dialog, such as pushes,
     * gifts, options, and battle starting or disabling.
     * 
     * @param thing   A Player that's finished talking to other.
     * @param other   A Character that thing has finished talking to.
     */
    public animateCharacterDialogFinish(thing: IPlayer, other: ICharacter): void {
        let onStop: IWalkingOnStop | undefined = other.pushSteps;

        this.modAttacher.fireEvent("onDialogFinish", other);

        thing.talking = false;
        other.talking = false;
        thing.canKeyWalking = true;

        if (other.directionPreferred) {
            this.animateCharacterSetDirection(other, other.directionPreferred);
        }

        if (other.transport) {
            other.active = true;
            this.activateTransporter(thing, other as any);
            return;
        }

        if (typeof other.pushDirection !== "undefined") {
            this.animateCharacterStartWalkingCycle(thing, other.pushDirection, onStop);
        }

        if (other.gift) {
            this.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true
            });
            this.menuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(thing, other));
            this.menuGrapher.setActiveMenu("GeneralText");

            this.saves.addItemToBag(other.gift);

            other.gift = undefined;
            this.stateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.stateHolder.addChange(other.id, "dialog", other.dialog);
            this.stateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(other as IEnemy).alreadyBattled) {
            this.animateTrainerBattleStart(thing, other as IEnemy);
            (other as IEnemy).alreadyBattled = true;
            this.stateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.stateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.stateHolder.addChange(other.id, "sight", undefined);
            }
        }

        if (!other.dialogOptions) {
            this.saves.autoSave();
        }
    }

    /**
     * Displays a yes/no options menu for after a dialog has completed.
     * 
     * 
     * @param thing   A Player that's finished talking to other.
     * @param other   A Character that thing has finished talking to.
     * @param dialog   The dialog settings that just finished.
     */
    public animateCharacterDialogOptions(thing: IPlayer, other: ICharacter, dialog: IDialog): void {
        if (!dialog.options) {
            throw new Error("Dialog should have .options.");
        }

        const options: IDialogOptions = dialog.options;
        const generateCallback: (inDialog: string | IDialog) => void = (callbackDialog: string | IDialog): (() => void) | undefined => {
            if (!callbackDialog) {
                return undefined;
            }

            let callback: (...args: any[]) => void;
            let words: IMenuDialogRaw;

            if (callbackDialog.constructor === Object && (callbackDialog as IDialog).options) {
                words = (callbackDialog as IDialog).words;
                callback = (): void => {
                    this.animateCharacterDialogOptions(thing, other, callbackDialog as IDialog);
                };
            } else {
                words = (callbackDialog as IDialog).words || callbackDialog as string;
                if ((callbackDialog as IDialog).cutscene) {
                    callback = this.scenePlayer.bindCutscene(
                        (callbackDialog as IDialog).cutscene!,
                        {
                            player: thing,
                            tirggerer: other
                        });
                }
            }

            return (): void => {
                this.menuGrapher.deleteMenu("Yes/No");
                this.menuGrapher.createMenu("GeneralText", {
                    // "deleteOnFinish": true
                });
                this.menuGrapher.addMenuDialog(
                    "GeneralText", words, callback);
                this.menuGrapher.setActiveMenu("GeneralText");
            };
        };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.menuGrapher.createMenu("Yes/No", {
            position: {
                offset: {
                    left: 28
                }
            }
        });
        this.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: generateCallback(options.Yes)
                }, {
                    text: "NO",
                    callback: generateCallback(options.No)
                }]
        });
        this.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Starts a Character walking behind another Character. The leader is given a
     * .walkingCommands queue of recent steps that the follower will mimic.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    public animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
        let direction: Direction | undefined = this.physics.getDirectionBordering(thing, other);
        if (!direction) {
            throw new Error("Characters are too far away to follow.");
        }

        thing.nocollide = true;

        if (thing.player) {
            (thing as IPlayer).allowDirectionAsKeys = true;
            (thing as IPlayer).shouldWalk = false;
        }

        thing.following = other;
        other.follower = thing;

        this.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = other.speed;

        other.walkingCommands = [];

        this.animateCharacterSetDirection(thing, direction);

        switch (direction) {
            case 0:
                this.physics.setTop(thing, other.bottom);
                break;
            case 1:
                this.physics.setRight(thing, other.left);
                break;
            case 2:
                this.physics.setBottom(thing, other.top);
                break;
            case 3:
                this.physics.setLeft(thing, other.right);
                break;
            default:
                break;
        }

        // Manually start the walking process without giving a 0 onStop,
        // so that it continues smoothly in the walking interval
        this.animateCharacterStartWalking(thing, direction);

        thing.followingLoop = this.timeHandler.addEventInterval(
            (): void => this.animateCharacterFollowContinue(thing, other),
            this.mathDecider.compute("speedWalking", thing),
            Infinity);
    }

    /**
     * Continuation helper for a following cycle. The next walking command is
     * played, if it exists.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    public animateCharacterFollowContinue(thing: ICharacter, other: ICharacter): void {
        if (!other.walkingCommands) {
            throw new Error("Thing should have .walkingCommands.");
        }

        if (other.walkingCommands.length === 0) {
            return;
        }

        const direction: Direction = other.walkingCommands.shift()!;

        this.animateCharacterStartWalking(thing, direction, 0);
    }

    /**
     * Animates a Character to stop having a follower.
     * 
     * @param thing   The leading Character.
     * @returns True, to stop TimeHandlr cycles.
     */
    public animateCharacterFollowStop(thing: ICharacter): boolean {
        const other: ICharacter | undefined = thing.following;
        if (!other) {
            return true;
        }

        thing.nocollide = false;
        delete thing.following;
        delete other.follower;

        this.animateCharacterStopWalking(thing);
        this.timeHandler.cancelEvent(thing.followingLoop!);

        return true;
    }

    /**
     * Animates a Character to hop over a ledge.
     * 
     * @param thing   A walking Character.
     * @param other   A ledge for thing to hop over.
     */
    public animateCharacterHopLedge(thing: ICharacter, other: IThing): void {
        const shadow: IThing = this.things.add("Shadow");
        const speed: number = 2;
        let dy: number = -4;
        let steps: number = 14;
        let changed: number = 0;

        thing.shadow = shadow;
        thing.ledge = other;

        // Center the shadow below the Thing
        this.physics.setMidXObj(shadow, thing);
        this.physics.setBottom(shadow, thing.bottom);

        // Continuously ensure The Thing still moves off the ledge if not walking
        this.timeHandler.addEventInterval(
            (): boolean => {
                if (thing.walking) {
                    return false;
                }

                this.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return true;
            },
            1,
            steps * speed - 1);

        // Keep the shadow below the Thing, and move the Thing's offsetY
        this.timeHandler.addEventInterval(
            (): void => {
                this.physics.setBottom(shadow, thing.bottom);

                if (changed % speed === 0) {
                    thing.offsetY += dy;
                }

                changed += 1;
            },
            1,
            steps * speed);

        // Inverse the Thing's offsetY changes halfway through the hop
        this.timeHandler.addEvent(
            (): void => {
                dy *= -1;
            },
            speed * (steps / 2) | 0);

        // Delete the shadow after the jump is done
        this.timeHandler.addEvent(
            (): void => {
                delete thing.ledge;
                this.physics.killNormal(shadow);

                if (!thing.walking) {
                    this.animateCharacterStopWalking(thing);
                }

                if (thing.player) {
                    (thing as IPlayer).canKeyWalking = true;
                    this.mapScreener.blockInputs = false;
                }
            },
            steps * speed);
    }

    /**
     * Activates a Detector to trigger a cutscene and/or routine.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateCutsceneTriggerer(thing: IPlayer, other: IDetector): void {
        if (!other.alive || thing.collidedTrigger === other) {
            return;
        }

        thing.collidedTrigger = other;
        this.animatePlayerDialogFreeze(thing);

        if (!other.keepAlive) {
            other.alive = false;

            if (other.id.indexOf("Anonymous") !== -1) {
                console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
            }

            this.stateHolder.addChange(other.id, "alive", false);
            this.physics.killNormal(other);
        }

        if (other.cutscene) {
            this.scenePlayer.startCutscene(other.cutscene, {
                player: thing,
                triggerer: other
            });
        }

        if (other.routine) {
            this.scenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * Activates a Detector to play an audio theme.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateThemePlayer(thing: IPlayer, other: IThemeDetector): void {
        if (!thing.player || this.audioPlayer.getThemeName() === other.theme) {
            return;
        }

        this.audioPlayer.playTheme(other.theme);
    }

    /**
     * Activates a Detector to play a cutscene, and potentially a dialog.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateCutsceneResponder(thing: ICharacter, other: IDetector): void {
        if (!thing.player || !other.alive) {
            return;
        }

        if (other.dialog) {
            this.activateMenuTriggerer(thing, other);
            return;
        }

        this.scenePlayer.startCutscene(other.cutscene!, {
            player: thing,
            triggerer: other
        });
    }

    /**
     * Activates a Detector to open a menu, and potentially a dialog.
     * 
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateMenuTriggerer(thing: ICharacter, other: IMenuTriggerer): void {
        if (!other.alive || thing.collidedTrigger === other) {
            return;
        }

        if (!other.dialog) {
            throw new Error("MenuTriggerer should have .dialog.");
        }

        const name: string = other.menu || "GeneralText";
        const dialog: IMenuDialogRaw | IMenuDialogRaw[] = other.dialog;

        thing.collidedTrigger = other;
        this.animateCharacterPreventWalking(thing);

        if (!other.keepAlive) {
            this.physics.killNormal(other);
        }

        if (!this.menuGrapher.getMenu(name)) {
            this.menuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.menuGrapher.addMenuDialog(
                name,
                dialog,
                (): void => {
                    let onStop: IWalkingOnStop | undefined = undefined;

                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }

                    this.menuGrapher.deleteMenu("GeneralText");

                    if (typeof other.pushDirection !== "undefined") {
                        if (onStop) {
                            onStop.push((): void => {
                                this.mapScreener.blockInputs = false;
                                delete thing.collidedTrigger;
                            });
                            this.animateCharacterStartWalkingCycle(
                                thing, other.pushDirection, onStop);
                        }
                    } else {
                        this.mapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    }
                });
        }

        this.menuGrapher.setActiveMenu(name);
    }

    /**
     * Activates a Character's sight detector for when another Character walks
     * into it.
     * 
     * @param thing   A Character triggering other.
     * @param other   A sight detector being triggered by thing.
     */
    public activateSightDetector(thing: ICharacter, other: ISightDetector): void {
        if (other.viewer.talking) {
            return;
        }

        other.viewer.talking = true;
        other.active = false;

        this.mapScreener.blockInputs = true;

        this.scenePlayer.startCutscene("TrainerSpotted", {
            player: thing,
            sightDetector: other,
            triggerer: other.viewer
        });
    }

    /**
     * Activation callback for level transports (any Thing with a .transport 
     * attribute). Depending on the transport, either the map or location are 
     * shifted to it.
     * 
     * @param thing   A Character attempting to enter other.
     * @param other   A transporter being entered by thing.
     */
    public activateTransporter(thing: ICharacter, other: ITransporter): void {
        if (!thing.player || !other.active) {
            return;
        }

        if (typeof other.transport === "undefined") {
            throw new Error("No transport given to activateTransporter");
        }

        const transport: ITransportSchema = other.transport as ITransportSchema;
        let callback: () => void;

        if (typeof transport === "string") {
            callback = (): void => {
                this.maps.setLocation(transport);
            };
        } else if (typeof transport.map !== "undefined") {
            callback = (): void => {
                this.maps.setMap(transport.map, transport.location);
            };
        } else if (typeof transport.location !== "undefined") {
            callback = (): void => {
                this.maps.setLocation(transport.location);
            };
        } else {
            throw new Error(`Unknown transport type: '${transport}'`);
        }

        other.active = false;

        this.animateFadeToColor({
            callback,
            color: "Black"
        });
    }

    /**
     * Activation trigger for a gym statue. If the Player is looking up at it,
     * it speaks the status of the gym leader.
     * 
     * @param thing   A Player activating other.
     * @param other   A gym statue being activated by thing.
     */
    public activateGymStatue(thing: ICharacter, other: IGymDetector): void {
        if (thing.direction !== 0) {
            return;
        }

        const gym: string = other.gym;
        const leader: string = other.leader;
        const dialog: string[] = [
            gym.toUpperCase()
            + " \n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: "
            + leader.toUpperCase(),
            "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%"
        ];

        if (this.itemsHolder.getItem("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog("GeneralText", dialog);
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     * 
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    public activateHMCharacter(player: IPlayer, thing: IHMCharacter): void {
        if (thing.requiredBadge && !this.itemsHolder.getItem("badges")[thing.requiredBadge]) {
            return;
        }

        let partyPokemon: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");

        for (let pokemon of partyPokemon) {
            let moves: IMove[] = pokemon.moves;

            for (let move of moves) {
                if (move.title === thing.moveName) {
                    thing.moveCallback(player, pokemon);
                    return;
                }
            }
        }
    }

    /**
     * Starts a Character roaming in random directions.
     * 
     * @param thing   A Character to start roaming.
     * @returns Whether the time cycle should stop (thing is dead).
     */
    public activateCharacterRoaming(thing: ICharacter): boolean {
        if (!thing.alive) {
            return true;
        }

        this.timeHandler.addEvent(
            (): boolean => this.activateCharacterRoaming(thing),
            70 + this.numberMaker.randomInt(210));

        if (!thing.talking && !this.menuGrapher.getActiveMenu()) {
            this.animateCharacterStartWalkingRandom(thing);
        }

        return false;
    }

    /**
     * Activates a Spawner by calling its .activate.
     * 
     * @param thing   A newly placed Spawner.
     */
    public activateSpawner(thing: IDetector): void {
        if (!thing.activate) {
            throw new Error("Spawner should have .activate.");
        }

        thing.activate.call(this, thing);
    }

    /**
     * Checks if a WindowDetector is within frame, and activates it if so.
     * 
     * @param thing   An in-game WindowDetector.
     */
    public checkWindowDetector(thing: IDetector): boolean {
        if (
            thing.bottom < 0
            || thing.left > this.mapScreener.width
            || thing.top > this.mapScreener.height
            || thing.right < 0) {
            return false;
        }

        if (!thing.activate) {
            throw new Error("WindowDetector should have .activate.");
        }

        thing.activate.call(this, thing);
        this.physics.killNormal(thing);
        return true;
    }

    /**
     * Activates an areaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     * 
     * @param thing   An areaSpawner to activate.
     */
    public spawnareaSpawner(thing: IareaSpawner): void {
        const map: IMap = this.areaSpawner.getMap(thing.map) as IMap;
        const area: IArea = map.areas[thing.area] as IArea;

        if (area === this.areaSpawner.getArea()) {
            this.physics.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === (this.areaSpawner.getArea() as IArea).spawnedBy
        ) {
            this.physics.killNormal(thing);
            return;
        }

        area.spawnedBy = (this.areaSpawner.getArea() as IArea).spawnedBy;

        this.maps.activateareaSpawner(thing, area);
    }

    /**
     * Activation callback for an AreaGate. The Player is marked to now spawn
     * in the new Map and Area.
     * 
     * @param thing   A Character walking to other.
     * @param other   An AreaGate potentially being triggered.
     */
    public activateAreaGate(thing: ICharacter, other: IAreaGate): void {
        if (!thing.player || !thing.walking || thing.direction !== other.direction) {
            return;
        }

        const area: IArea = this.areaSpawner.getMap(other.map).areas[other.area] as IArea;
        let areaOffsetX: number;
        let areaOffsetY: number;

        switch (thing.direction) {
            case Direction.Top:
                areaOffsetX = thing.left - other.left;
                areaOffsetY = area.height * 4 - thing.height;
                break;

            case Direction.Right:
                areaOffsetX = 0;
                areaOffsetY = thing.top - other.top;
                break;

            case Direction.Bottom:
                areaOffsetX = thing.left - other.left;
                areaOffsetY = 0;
                break;

            case Direction.Left:
                areaOffsetX = area.width * 4 - thing.width;
                areaOffsetY = thing.top - other.top;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        const screenOffsetX: number = areaOffsetX - thing.left;
        const screenOffsetY: number = areaOffsetY - thing.top;

        this.mapScreener.top = screenOffsetY;
        this.mapScreener.right = screenOffsetX + this.mapScreener.width;
        this.mapScreener.bottom = screenOffsetY + this.mapScreener.height;
        this.mapScreener.left = screenOffsetX;

        this.itemsHolder.setItem("map", other.map);
        this.itemsHolder.setItem("area", other.area);
        this.itemsHolder.setItem("location", undefined);

        this.stateHolder.setCollection(area.map.name + "::" + area.name);

        other.active = false;
        this.timeHandler.addEvent(
            (): void => {
                other.active = true;
            },
            2);
    };

    /**
     * Makes sure that Player is facing the correct HMCharacter
     *
     * @param player   The Player.
     * @param pokemon   The Pokemon using the move.
     * @param move   The move being used.
     * @todo Add context for what happens if player is not bordering the correct HMCharacter.
     * @todo Refactor to give borderedThing a .hmActivate property.
     */
    public partyActivateCheckThing(player: IPlayer, pokemon: IPokemon, move: IHMMoveSchema): void {
        const borderedThing: IThing | undefined = player.bordering[player.direction];

        if (borderedThing && borderedThing.title.indexOf(move.characterName!) !== -1) {
            move.partyActivate!(player, pokemon);
        }
    }

    /**
     * Cuts a CuttableTree.
     *
     * @param player   The Player.
     * @todo Add an animation for what happens when the CuttableTree is cut.
     */
    public partyActivateCut(player: IPlayer): void {
        this.menuGrapher.deleteAllMenus();
        this.menus.closePauseMenu();
        this.physics.killNormal(player.bordering[player.direction]!);
    }

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @todo Verify the exact speed, sound, and distance.
     */
    public partyActivateStrength(player: IPlayer): void {
        let boulder: IHMCharacter = player.bordering[player.direction] as IHMCharacter;

        this.menuGrapher.deleteAllMenus();
        this.menus.closePauseMenu();

        if (!this.thingHitter.checkHitForThings(player as any, boulder as any)
            || boulder.bordering[player.direction] !== undefined) {
            return;
        }

        let xvel: number = 0;
        let yvel: number = 0;

        switch (player.direction) {
            case 0:
                yvel = -4;
                break;

            case 1:
                xvel = 4;
                break;

            case 2:
                yvel = 4;
                break;

            case 3:
                xvel = -4;
                break;

            default:
                throw new Error(`Unknown direction: '${player.direction}'.`);
        }

        this.timeHandler.addEventInterval(
            (): void => this.physics.shiftBoth(boulder, xvel, yvel),
            1,
            8);

        for (let i: number = 0; i < boulder.bordering.length; i += 1) {
            boulder.bordering[i] = undefined;
        }
    }

    /**
     * Starts the Player surfing.
     *
     * @param player   The Player.
     * @todo Add the dialogue for when the Player starts surfing.
     */
    public partyActivateSurf(player: IPlayer): void {
        this.menuGrapher.deleteAllMenus();
        this.menus.closePauseMenu();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        this.graphics.addClass(player, "surfing");
        this.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    }
}
