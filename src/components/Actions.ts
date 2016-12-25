import { IMove } from "battlemovr/lib/IBattleMovr";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";
import { IEventCallback, ITimeEvent } from "timehandlr/lib/ITimeHandlr";

import { Direction, DirectionAliases, DirectionClasses } from "../Constants";
import {
    IArea, IAreaGate, IareaSpawner, ICharacter, IColorFadeSettings, IDetector, IDialog,
    IDialogOptions, IEnemy, IGymDetector, IHMCharacter, IHMMoveSchema, IMap,
    IMenuTriggerer, IPlayer, IPokemon, ISightDetector, IThemeDetector, IThing,
    ITransporter, ITransportSchema, IWalkingOnStop, IWalkingOnStopCommandFunction,
    IWildPokemonSchema
} from "../IFullScreenPokemon";
import { Component } from "./Component";

/**
 * Action functions used by FullScreenPokemon instances.
 */
export class Actions extends Component {
    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     * 
     * @param thing   A newly placed Character.
     */
    public spawnCharacter(thing: ICharacter): void {
        if (thing.sight) {
            thing.sightDetector = this.fsp.things.add(
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
            this.fsp.timeHandler.addEvent(
                (): boolean => this.activateCharacterRoaming(thing),
                this.fsp.numberMaker.randomInt(70));
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
            this.fsp.timeHandler.addEventInterval(
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
        const x: number = (this.fsp.mapScreener.left + thing.left) / grid;
        const y: number = (this.fsp.mapScreener.top + thing.top) / grid;

        this.fsp.physics.setLeft(thing, Math.round(x) * grid - this.fsp.mapScreener.left);
        this.fsp.physics.setTop(thing, Math.round(y) * grid - this.fsp.mapScreener.top);
    }

    /**
     * Freezes a Character to start a dialog.
     * 
     * @param thing   A Character to freeze.
     */
    public animatePlayerDialogFreeze(thing: ICharacter): void {
        this.animateCharacterPreventWalking(thing);
        this.fsp.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.fsp.timeHandler.cancelEvent(thing.walkingFlipping);
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

        return this.fsp.timeHandler.addEvent(
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
        this.fsp.physics.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.fsp.physics.getMidX(thing) >= goal) {
                this.fsp.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.fsp.physics.getMidX(thing) <= goal) {
                this.fsp.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.fsp.timeHandler.addEvent(
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
        this.fsp.physics.shiftVert(thing, change);

        if (change > 0) {
            if (this.fsp.physics.getMidY(thing) >= goal) {
                this.fsp.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.fsp.physics.getMidY(thing) <= goal) {
                this.fsp.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.fsp.timeHandler.addEvent(
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
        const grassMap: IMap = this.fsp.areaSpawner.getMap(grass.mapName) as IMap;
        const grassArea: IArea = grassMap.areas[grass.areaName] as IArea;
        const options: IWildPokemonSchema[] | undefined = grassArea.wildPokemon.grass;
        if (!options) {
            throw new Error("Grass doesn't have any wild Pokemon options defined.");
        }

        const chosen: IWildPokemonSchema = this.fsp.battles.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.fsp.utilities.createPokemon(chosen);

        this.fsp.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.fsp.graphics.removeClass(thing.shadow, "walking");
        }

        this.animateCharacterPreventWalking(thing);

        this.fsp.battles.startBattle({
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

        this.fsp.battles.startBattle({
            battlers: {
                opponent: {
                    name: battleName.split(""),
                    sprite: battleSprite + "Front",
                    category: "Trainer",
                    hasActors: true,
                    reward: other.reward,
                    actors: other.actors.map(
                        (schema: IWildPokemonSchema): IPokemon => {
                            return this.fsp.utilities.createPokemon(schema);
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
            things.push(this.fsp.things.add([title, settings]));
        }

        if (groupType) {
            for (const thing of things) {
                this.fsp.groupHolder.switchMemberGroup(thing, thing.groupType, groupType);
            }
        }

        this.fsp.physics.setLeft(things[0], x);
        this.fsp.physics.setLeft(things[1], x);

        this.fsp.physics.setRight(things[2], x);
        this.fsp.physics.setRight(things[3], x);

        this.fsp.physics.setBottom(things[0], y);
        this.fsp.physics.setBottom(things[3], y);

        this.fsp.physics.setTop(things[1], y);
        this.fsp.physics.setTop(things[2], y);

        this.fsp.graphics.flipHoriz(things[0]);
        this.fsp.graphics.flipHoriz(things[1]);

        this.fsp.graphics.flipVert(things[1]);
        this.fsp.graphics.flipVert(things[2]);

        return things as [IThing, IThing, IThing, IThing];
    }

    /**
     * Moves a set of four Things away from a point.
     * 
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    public animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.fsp.physics.shiftHoriz(things[0], amount);
        this.fsp.physics.shiftHoriz(things[1], amount);
        this.fsp.physics.shiftHoriz(things[2], -amount);
        this.fsp.physics.shiftHoriz(things[3], -amount);

        this.fsp.physics.shiftVert(things[0], -amount);
        this.fsp.physics.shiftVert(things[1], amount);
        this.fsp.physics.shiftVert(things[2], amount);
        this.fsp.physics.shiftVert(things[3], -amount);
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

        this.fsp.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.fsp.physics.killNormal(thing);
                }
            },
            7);

        this.fsp.timeHandler.addEvent(
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

        this.fsp.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4),
            7);

        this.fsp.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.fsp.physics.killNormal(thing);
                }
            },
            14);

        this.fsp.timeHandler.addEvent(
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

        this.fsp.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4 * 2),
            7);

        this.fsp.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.fsp.physics.killNormal(thing);
                }
            },
            21);

        if (callback) {
            this.fsp.timeHandler.addEvent(callback, 21);
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
        let exclamation: IThing = this.fsp.things.add("Exclamation");

        timeout = timeout || 140;

        this.fsp.physics.setMidXObj(exclamation, thing);
        this.fsp.physics.setBottom(exclamation, thing.top);

        this.fsp.timeHandler.addEvent(
            (): void => this.fsp.physics.killNormal(exclamation),
            timeout);

        if (callback) {
            this.fsp.timeHandler.addEvent(callback, timeout);
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
        const blank: IThing = this.fsp.objectMaker.make(color + "Square", {
            width: this.fsp.mapScreener.width,
            height: this.fsp.mapScreener.height,
            opacity: 0
        });

        this.fsp.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            speed,
            (): void => {
                this.fsp.physics.killNormal(blank);
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
        const blank: IThing = this.fsp.objectMaker.make(color + "Square", {
            width: this.fsp.mapScreener.width,
            height: this.fsp.mapScreener.height,
            opacity: 1
        });

        this.fsp.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            (): void => {
                this.fsp.physics.killNormal(blank);
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

        this.fsp.timeHandler.addEventInterval(
            (): void => {
                thing.hidden = !thing.hidden;
                if (!thing.hidden) {
                    this.fsp.pixelDrawer.setThingSprite(thing);
                }
            },
            interval | 0,
            cleartime | 0);

        return this.fsp.timeHandler.addEvent(
            (): void => {
                thing.flickering = thing.hidden = false;
                this.fsp.pixelDrawer.setThingSprite(thing);

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
        this.fsp.timeHandler.addEventInterval(
            (): void => {
                this.fsp.groupHolder.callOnAll(this.fsp.physics, this.fsp.physics.shiftHoriz, dx);
                this.fsp.groupHolder.callOnAll(this.fsp.physics, this.fsp.physics.shiftVert, dy);
            },
            1,
            cleartime * interval);

        return this.fsp.timeHandler.addEvent(
            (): void => {
                dx *= -1;
                dy *= -1;

                this.fsp.timeHandler.addEventInterval(
                    (): void => {
                        dx *= -1;
                        dy *= -1;
                    },
                    interval,
                    cleartime);

                if (callback) {
                    this.fsp.timeHandler.addEvent(callback, interval * cleartime);
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
            this.fsp.physics.shiftBoth(thing, -thing.xvel, -thing.yvel);
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
        const repeats: number = this.fsp.mathDecider.compute("speedWalking", thing);
        const distance: number = repeats * thing.speed;

        thing.walking = true;
        this.animateCharacterSetDirection(thing, direction);
        this.animateCharacterSetDistanceVelocity(thing, distance);

        if (!thing.cycles || !(thing.cycles as any).walking) {
            this.fsp.timeHandler.addClassCycle(
                thing,
                ["walking", "standing"],
                "walking",
                repeats / 2);
        }

        if (!thing.walkingFlipping) {
            thing.walkingFlipping = this.fsp.timeHandler.addEventInterval(
                (): void => this.animateSwitchFlipOnDirection(thing),
                repeats,
                Infinity,
                thing);
        }

        if (thing.sight) {
            thing.sightDetector!.nocollide = true;
        }

        this.fsp.timeHandler.addEventInterval(
            (): void => thing.onWalkingStop.call(this, thing, onStop),
            repeats,
            Infinity,
            thing,
            onStop);

        if (!thing.bordering[direction]) {
            this.fsp.physics.shiftBoth(thing, thing.xvel, thing.yvel);
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

        direction = this.fsp.numberMaker.randomInt(totalAllowed);

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

        this.fsp.graphics.removeClasses(thing, "walking", "standing");
        this.fsp.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.fsp.timeHandler.cancelEvent(thing.walkingFlipping);
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
        if (this.fsp.battles.checkPlayerGrassBattle(thing)) {
            thing.canKeyWalking = true;
            return false;
        }

        if (thing.following) {
            return this.animateCharacterStopWalking(thing, onStop);
        }

        if (
            !this.fsp.menuGrapher.getActiveMenu()
            && (thing.keys as any)[thing.direction]) {
            this.animateCharacterSetDistanceVelocity(thing, thing.distance);
            return false;
        }

        if (typeof thing.nextDirection !== "undefined") {
            if (thing.nextDirection !== thing.direction && !thing.ledge) {
                this.fsp.physics.setPlayerDirection(thing, thing.nextDirection);
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

        this.fsp.mapScreener.blockInputs = true;
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
            this.fsp.graphics.unflipHoriz(thing);
        }

        this.fsp.graphics.removeClasses(
            thing,
            DirectionClasses[Direction.Top],
            DirectionClasses[Direction.Right],
            DirectionClasses[Direction.Bottom],
            DirectionClasses[Direction.Left]);

        this.fsp.graphics.addClass(thing, DirectionClasses[direction]);

        if (direction === Direction.Right) {
            this.fsp.graphics.flipHoriz(thing);
            this.fsp.graphics.addClass(thing, DirectionClasses[Direction.Left]);
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    public animateCharacterSetDirectionRandom(thing: IThing): void {
        this.animateCharacterSetDirection(thing, this.fsp.numberMaker.randomIntWithin(0, 3));
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
            this.fsp.graphics.unflipHoriz(thing);
        } else {
            this.fsp.graphics.flipHoriz(thing);
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
                this.fsp.physics.setWidth(detector, thing.width);
                this.fsp.physics.setHeight(detector, thing.sight * 8);
            } else {
                this.fsp.physics.setWidth(detector, thing.sight * 8);
                this.fsp.physics.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.fsp.physics.setBottom(detector, thing.top);
                this.fsp.physics.setMidXObj(detector, thing);
                break;
            case 1:
                this.fsp.physics.setLeft(detector, thing.right);
                this.fsp.physics.setMidYObj(detector, thing);
                break;
            case 2:
                this.fsp.physics.setTop(detector, thing.bottom);
                this.fsp.physics.setMidXObj(detector, thing);
                break;
            case 3:
                this.fsp.physics.setRight(detector, thing.left);
                this.fsp.physics.setMidYObj(detector, thing);
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

        this.fsp.modAttacher.fireEvent("onDialogFinish", other);

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
            this.fsp.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true
            });
            this.fsp.menuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(thing, other));
            this.fsp.menuGrapher.setActiveMenu("GeneralText");

            this.fsp.saves.addItemToBag(other.gift);

            other.gift = undefined;
            this.fsp.stateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.fsp.stateHolder.addChange(other.id, "dialog", other.dialog);
            this.fsp.stateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(other as IEnemy).alreadyBattled) {
            this.animateTrainerBattleStart(thing, other as IEnemy);
            (other as IEnemy).alreadyBattled = true;
            this.fsp.stateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.fsp.stateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.fsp.stateHolder.addChange(other.id, "sight", undefined);
            }
        }

        if (!other.dialogOptions) {
            this.fsp.saves.autoSave();
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
                    callback = this.fsp.scenePlayer.bindCutscene(
                        (callbackDialog as IDialog).cutscene!,
                        {
                            player: thing,
                            tirggerer: other
                        });
                }
            }

            return (): void => {
                this.fsp.menuGrapher.deleteMenu("Yes/No");
                this.fsp.menuGrapher.createMenu("GeneralText", {
                    // "deleteOnFinish": true
                });
                this.fsp.menuGrapher.addMenuDialog(
                    "GeneralText", words, callback);
                this.fsp.menuGrapher.setActiveMenu("GeneralText");
            };
        };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.fsp.menuGrapher.createMenu("Yes/No", {
            position: {
                offset: {
                    left: 28
                }
            }
        });
        this.fsp.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: generateCallback(options.Yes)
                }, {
                    text: "NO",
                    callback: generateCallback(options.No)
                }]
        });
        this.fsp.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Starts a Character walking behind another Character. The leader is given a
     * .walkingCommands queue of recent steps that the follower will mimic.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    public animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
        let direction: Direction | undefined = this.fsp.physics.getDirectionBordering(thing, other);
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

        this.fsp.saves.addStateHistory(thing, "speed", thing.speed);
        thing.speed = other.speed;

        other.walkingCommands = [];

        this.animateCharacterSetDirection(thing, direction);

        switch (direction) {
            case 0:
                this.fsp.physics.setTop(thing, other.bottom);
                break;
            case 1:
                this.fsp.physics.setRight(thing, other.left);
                break;
            case 2:
                this.fsp.physics.setBottom(thing, other.top);
                break;
            case 3:
                this.fsp.physics.setLeft(thing, other.right);
                break;
            default:
                break;
        }

        // Manually start the walking process without giving a 0 onStop,
        // so that it continues smoothly in the walking interval
        this.animateCharacterStartWalking(thing, direction);

        thing.followingLoop = this.fsp.timeHandler.addEventInterval(
            (): void => this.animateCharacterFollowContinue(thing, other),
            this.fsp.mathDecider.compute("speedWalking", thing),
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
        this.fsp.timeHandler.cancelEvent(thing.followingLoop!);

        return true;
    }

    /**
     * Animates a Character to hop over a ledge.
     * 
     * @param thing   A walking Character.
     * @param other   A ledge for thing to hop over.
     */
    public animateCharacterHopLedge(thing: ICharacter, other: IThing): void {
        const shadow: IThing = this.fsp.things.add("Shadow");
        const speed: number = 2;
        let dy: number = -4;
        let steps: number = 14;
        let changed: number = 0;

        thing.shadow = shadow;
        thing.ledge = other;

        // Center the shadow below the Thing
        this.fsp.physics.setMidXObj(shadow, thing);
        this.fsp.physics.setBottom(shadow, thing.bottom);

        // Continuously ensure The Thing still moves off the ledge if not walking
        this.fsp.timeHandler.addEventInterval(
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
        this.fsp.timeHandler.addEventInterval(
            (): void => {
                this.fsp.physics.setBottom(shadow, thing.bottom);

                if (changed % speed === 0) {
                    thing.offsetY += dy;
                }

                changed += 1;
            },
            1,
            steps * speed);

        // Inverse the Thing's offsetY changes halfway through the hop
        this.fsp.timeHandler.addEvent(
            (): void => {
                dy *= -1;
            },
            speed * (steps / 2) | 0);

        // Delete the shadow after the jump is done
        this.fsp.timeHandler.addEvent(
            (): void => {
                delete thing.ledge;
                this.fsp.physics.killNormal(shadow);

                if (!thing.walking) {
                    this.animateCharacterStopWalking(thing);
                }

                if (thing.player) {
                    (thing as IPlayer).canKeyWalking = true;
                    this.fsp.mapScreener.blockInputs = false;
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

            this.fsp.stateHolder.addChange(other.id, "alive", false);
            this.fsp.physics.killNormal(other);
        }

        if (other.cutscene) {
            this.fsp.scenePlayer.startCutscene(other.cutscene, {
                player: thing,
                triggerer: other
            });
        }

        if (other.routine) {
            this.fsp.scenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * Activates a Detector to play an audio theme.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateThemePlayer(thing: IPlayer, other: IThemeDetector): void {
        if (!thing.player || this.fsp.audioPlayer.getThemeName() === other.theme) {
            return;
        }

        this.fsp.audioPlayer.playTheme(other.theme);
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

        this.fsp.scenePlayer.startCutscene(other.cutscene!, {
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
            this.fsp.physics.killNormal(other);
        }

        if (!this.fsp.menuGrapher.getMenu(name)) {
            this.fsp.menuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.fsp.menuGrapher.addMenuDialog(
                name,
                dialog,
                (): void => {
                    let onStop: IWalkingOnStop | undefined = undefined;

                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }

                    this.fsp.menuGrapher.deleteMenu("GeneralText");

                    if (typeof other.pushDirection !== "undefined") {
                        if (onStop) {
                            onStop.push((): void => {
                                this.fsp.mapScreener.blockInputs = false;
                                delete thing.collidedTrigger;
                            });
                            this.animateCharacterStartWalkingCycle(
                                thing, other.pushDirection, onStop);
                        }
                    } else {
                        this.fsp.mapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    }
                });
        }

        this.fsp.menuGrapher.setActiveMenu(name);
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

        this.fsp.mapScreener.blockInputs = true;

        this.fsp.scenePlayer.startCutscene("TrainerSpotted", {
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
                this.fsp.maps.setLocation(transport);
            };
        } else if (typeof transport.map !== "undefined") {
            callback = (): void => {
                this.fsp.maps.setMap(transport.map, transport.location);
            };
        } else if (typeof transport.location !== "undefined") {
            callback = (): void => {
                this.fsp.maps.setLocation(transport.location);
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

        if (this.fsp.itemsHolder.getItem("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        this.fsp.menuGrapher.createMenu("GeneralText");
        this.fsp.menuGrapher.addMenuDialog("GeneralText", dialog);
        this.fsp.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     * 
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    public activateHMCharacter(player: IPlayer, thing: IHMCharacter): void {
        if (thing.requiredBadge && !this.fsp.itemsHolder.getItem("badges")[thing.requiredBadge]) {
            return;
        }

        let partyPokemon: IPokemon[] = this.fsp.itemsHolder.getItem("PokemonInParty");

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

        this.fsp.timeHandler.addEvent(
            (): boolean => this.activateCharacterRoaming(thing),
            70 + this.fsp.numberMaker.randomInt(210));

        if (!thing.talking && !this.fsp.menuGrapher.getActiveMenu()) {
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
            || thing.left > this.fsp.mapScreener.width
            || thing.top > this.fsp.mapScreener.height
            || thing.right < 0) {
            return false;
        }

        if (!thing.activate) {
            throw new Error("WindowDetector should have .activate.");
        }

        thing.activate.call(this, thing);
        this.fsp.physics.killNormal(thing);
        return true;
    }

    /**
     * Activates an areaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     * 
     * @param thing   An areaSpawner to activate.
     */
    public spawnareaSpawner(thing: IareaSpawner): void {
        const map: IMap = this.fsp.areaSpawner.getMap(thing.map) as IMap;
        const area: IArea = map.areas[thing.area] as IArea;

        if (area === this.fsp.areaSpawner.getArea()) {
            this.fsp.physics.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === (this.fsp.areaSpawner.getArea() as IArea).spawnedBy
        ) {
            this.fsp.physics.killNormal(thing);
            return;
        }

        area.spawnedBy = (this.fsp.areaSpawner.getArea() as IArea).spawnedBy;

        this.fsp.maps.activateareaSpawner(thing, area);
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

        const area: IArea = this.fsp.areaSpawner.getMap(other.map).areas[other.area] as IArea;
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

        this.fsp.mapScreener.top = screenOffsetY;
        this.fsp.mapScreener.right = screenOffsetX + this.fsp.mapScreener.width;
        this.fsp.mapScreener.bottom = screenOffsetY + this.fsp.mapScreener.height;
        this.fsp.mapScreener.left = screenOffsetX;

        this.fsp.itemsHolder.setItem("map", other.map);
        this.fsp.itemsHolder.setItem("area", other.area);
        this.fsp.itemsHolder.setItem("location", undefined);

        this.fsp.stateHolder.setCollection(area.map.name + "::" + area.name);

        other.active = false;
        this.fsp.timeHandler.addEvent(
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
        this.fsp.menuGrapher.deleteAllMenus();
        this.fsp.menus.closePauseMenu();
        this.fsp.physics.killNormal(player.bordering[player.direction]!);
    }

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @todo Verify the exact speed, sound, and distance.
     */
    public partyActivateStrength(player: IPlayer): void {
        let boulder: IHMCharacter = player.bordering[player.direction] as IHMCharacter;

        this.fsp.menuGrapher.deleteAllMenus();
        this.fsp.menus.closePauseMenu();

        if (!this.fsp.thingHitter.checkHitForThings(player as any, boulder as any)
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

        this.fsp.timeHandler.addEventInterval(
            (): void => this.fsp.physics.shiftBoth(boulder, xvel, yvel),
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
        this.fsp.menuGrapher.deleteAllMenus();
        this.fsp.menus.closePauseMenu();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        this.fsp.graphics.addClass(player, "surfing");
        this.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    }
}
