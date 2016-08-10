/// <reference path="../typings/EightBittr.d.ts" />

import { Direction, DirectionAliases, DirectionClasses } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IArea, IAreaSpawner, ICharacter, IColorFadeSettings, IDetector, IDialog, IDialogOptions,
    IEnemy, IGymDetector, IHMCharacter, IHMMoveSchema, IMap, IMenuTriggerer, IPlayer,
    IPokemon, ISightDetector, IThemeDetector, IThing, ITransporter, ITransportSchema,
    IWalkingOnStop, IWalkingOnStopCommandFunction,
    IWildPokemonSchema
} from "./IFullScreenPokemon";

/**
 * Animation functions used by FullScreenPokemon instances.
 */
export class Animations<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     * 
     * @param thing   A newly placed Character.
     */
    public spawnCharacter(thing: ICharacter): void {
        if (thing.sight) {
            thing.sightDetector = this.EightBitter.things.add(
                [
                    "SightDetector",
                    {
                        "direction": thing.direction,
                        "width": thing.sight * 8
                    }
                ]) as ISightDetector;
            thing.sightDetector.viewer = thing;
            this.EightBitter.animations.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            this.EightBitter.TimeHandler.addEvent(
                (): boolean => this.EightBitter.animations.activateCharacterRoaming(thing),
                this.EightBitter.NumberMaker.randomInt(70));
        }
    }

    /**
     * Activates a WindowDetector by immediately starting its cycle of
     * checking whether it's in-frame to activate.
     * 
     * @param thing   A newly placed WindowDetector.
     */
    public spawnWindowDetector(thing: IDetector): void {
        if (!this.EightBitter.animations.checkWindowDetector(thing)) {
            this.EightBitter.TimeHandler.addEventInterval(
                (): boolean => this.EightBitter.animations.checkWindowDetector(thing),
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
        const grid: number = this.EightBitter.unitsize * 8;
        const x: number = (this.EightBitter.MapScreener.left + thing.left) / grid;
        const y: number = (this.EightBitter.MapScreener.top + thing.top) / grid;

        this.EightBitter.physics.setLeft(thing, Math.round(x) * grid - this.EightBitter.MapScreener.left);
        this.EightBitter.physics.setTop(thing, Math.round(y) * grid - this.EightBitter.MapScreener.top);
    }

    /**
     * Freezes a Character to start a dialog.
     * 
     * @param thing   A Character to freeze.
     */
    public animatePlayerDialogFreeze(thing: ICharacter): void {
        this.animateCharacterPreventWalking(thing);
        this.EightBitter.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.EightBitter.TimeHandler.cancelEvent(thing.walkingFlipping);
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
     * @returns The in-progress TimeEvent.
     */
    public animateFadeAttribute(
        thing: IThing,
        attribute: string,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): TimeHandlr.ITimeEvent {

        (thing as any)[attribute] += change;

        if (change > 0) {
            if ((thing as any)[attribute] >= goal) {
                (thing as any)[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if ((thing as any)[attribute] <= goal) {
                (thing as any)[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return;
            }
        }

        return this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
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
        this.EightBitter.physics.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.EightBitter.physics.getMidX(thing) >= goal) {
                this.EightBitter.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.EightBitter.physics.getMidX(thing) <= goal) {
                this.EightBitter.physics.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.EightBitter.TimeHandler.addEvent(
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
        this.EightBitter.physics.shiftVert(thing, change);

        if (change > 0) {
            if (this.EightBitter.physics.getMidY(thing) >= goal) {
                this.EightBitter.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.EightBitter.physics.getMidY(thing) <= goal) {
                this.EightBitter.physics.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.EightBitter.TimeHandler.addEvent(
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
        const grassMap: IMap = this.EightBitter.AreaSpawner.getMap(grass.mapName) as IMap;
        const grassArea: IArea = grassMap.areas[grass.areaName] as IArea;
        const options: IWildPokemonSchema[] = grassArea.wildPokemon.grass;
        const chosen: IWildPokemonSchema = this.EightBitter.battles.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.EightBitter.utilities.createPokemon(chosen);

        this.EightBitter.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.EightBitter.graphics.removeClass(thing.shadow, "walking");
        }

        this.animateCharacterPreventWalking(thing);

        this.EightBitter.battles.startBattle({
            "opponent": {
                "name": chosen.title,
                "actors": [chosenPokemon],
                "category": "Wild",
                "sprite": chosen.title.join("") + "Front"
            }
        });
    }

    /**
     * Freezes a Character and starts a battle with an enemy.
     * 
     * @param thing   A Character about to start a battle with other.
     * @param other   An enemy about to battle thing.
     */
    public animateTrainerBattleStart(thing: ICharacter, other: IEnemy): void {
        const battleName: string = other.battleName || other.title;
        const battleSprite: string = other.battleSprite || battleName;

        this.EightBitter.battles.startBattle({
            "opponent": {
                "name": battleName.split(""),
                "sprite": battleSprite + "Front",
                "category": "Trainer",
                "hasActors": true,
                "reward": other.reward,
                "actors": other.actors.map(
                    (schema: IWildPokemonSchema): IPokemon => {
                        return this.EightBitter.utilities.createPokemon(schema);
                    })
            },
            "textStart": ["", " wants to fight!"],
            "textDefeat": other.textDefeat,
            "textAfterBattle": other.textAfterBattle,
            "giftAfterBattle": other.giftAfterBattle,
            "badge": other.badge,
            "textVictory": other.textVictory,
            "nextCutscene": other.nextCutscene
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
        let things: IThing[] = [];

        for (let i: number = 0; i < 4; i += 1) {
            things.push(this.EightBitter.things.add([title, settings]));
        }

        if (groupType) {
            for (let thing of things) {
                this.EightBitter.GroupHolder.switchMemberGroup(thing, thing.groupType, groupType);
            }
        }

        this.EightBitter.physics.setLeft(things[0], x);
        this.EightBitter.physics.setLeft(things[1], x);

        this.EightBitter.physics.setRight(things[2], x);
        this.EightBitter.physics.setRight(things[3], x);

        this.EightBitter.physics.setBottom(things[0], y);
        this.EightBitter.physics.setBottom(things[3], y);

        this.EightBitter.physics.setTop(things[1], y);
        this.EightBitter.physics.setTop(things[2], y);

        this.EightBitter.graphics.flipHoriz(things[0]);
        this.EightBitter.graphics.flipHoriz(things[1]);

        this.EightBitter.graphics.flipVert(things[1]);
        this.EightBitter.graphics.flipVert(things[2]);

        return things as [IThing, IThing, IThing, IThing];
    }

    /**
     * Moves a set of four Things away from a point.
     * 
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    public animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.EightBitter.physics.shiftHoriz(things[0], amount);
        this.EightBitter.physics.shiftHoriz(things[1], amount);
        this.EightBitter.physics.shiftHoriz(things[2], -amount);
        this.EightBitter.physics.shiftHoriz(things[3], -amount);

        this.EightBitter.physics.shiftVert(things[0], -amount);
        this.EightBitter.physics.shiftVert(things[1], amount);
        this.EightBitter.physics.shiftVert(things[2], amount);
        this.EightBitter.physics.shiftVert(things[3], -amount);
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

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.EightBitter.physics.killNormal(thing);
                }
            },
            7);

        this.EightBitter.TimeHandler.addEvent(
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

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.animateExpandCorners(things, this.EightBitter.unitsize),
            7);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.EightBitter.physics.killNormal(thing);
                }
            },
            14);

        this.EightBitter.TimeHandler.addEvent(
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

        this.animateExpandCorners(things, this.EightBitter.unitsize * 2.5);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.animateExpandCorners(things, this.EightBitter.unitsize * 2),
            7);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.EightBitter.physics.killNormal(thing);
                }
            },
            21);

        if (callback) {
            this.EightBitter.TimeHandler.addEvent(callback, 21);
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
        let exclamation: IThing = this.EightBitter.things.add("Exclamation");

        timeout = timeout || 140;

        this.EightBitter.physics.setMidXObj(exclamation, thing);
        this.EightBitter.physics.setBottom(exclamation, thing.top);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.killNormal(exclamation),
            timeout);

        if (callback) {
            this.EightBitter.TimeHandler.addEvent(callback, timeout);
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
        let color: string = settings.color || "White",
            callback: (...args: any[]) => void = settings.callback,
            change: number = settings.change || .33,
            speed: number = settings.speed || 4,
            blank: IThing = this.EightBitter.ObjectMaker.make(color + "Square", {
                "width": this.EightBitter.MapScreener.width,
                "height": this.EightBitter.MapScreener.height,
                "opacity": 0
            });

        this.EightBitter.things.add(blank);

        this.EightBitter.animations.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            speed,
            (): void => {
                this.EightBitter.physics.killNormal(blank);
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
    public animateFadeFromColor(settings: IColorFadeSettings = {}): IThing {
        let color: string = settings.color || "White",
            callback: (...args: any[]) => void = settings.callback,
            change: number = settings.change || .33,
            speed: number = settings.speed || 4,
            blank: IThing = this.EightBitter.ObjectMaker.make(color + "Square", {
                "width": this.EightBitter.MapScreener.width,
                "height": this.EightBitter.MapScreener.height,
                "opacity": 1
            }),
            args: IArguments = arguments;

        this.EightBitter.things.add(blank);

        this.EightBitter.animations.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            (): void => {
                this.EightBitter.physics.killNormal(blank);
                if (callback) {
                    callback.apply(this, args);
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
        callback?: (thing: IThing) => void): TimeHandlr.ITimeEvent {
        thing.flickering = true;

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                thing.hidden = !thing.hidden;
                if (!thing.hidden) {
                    this.EightBitter.PixelDrawer.setThingSprite(thing);
                }
            },
            interval | 0,
            cleartime | 0);

        return this.EightBitter.TimeHandler.addEvent(
            (): void => {
                thing.flickering = thing.hidden = false;
                this.EightBitter.PixelDrawer.setThingSprite(thing);

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
     * @param EightBitter
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
        callback?: TimeHandlr.IEventCallback): TimeHandlr.ITimeEvent {
        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                this.EightBitter.GroupHolder.callOnAll(this.EightBitter.physics, this.EightBitter.physics.shiftHoriz, dx);
                this.EightBitter.GroupHolder.callOnAll(this.EightBitter.physics, this.EightBitter.physics.shiftVert, dy);
            },
            1,
            cleartime * interval);

        return this.EightBitter.TimeHandler.addEvent(
            (): void => {
                dx *= -1;
                dy *= -1;

                this.EightBitter.TimeHandler.addEventInterval(
                    (): void => {
                        dx *= -1;
                        dy *= -1;
                    },
                    interval,
                    cleartime);

                if (callback) {
                    this.EightBitter.TimeHandler.addEvent(callback, interval * cleartime);
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
    public animateCharacterStartWalkingCycle(thing: ICharacter, direction: Direction, onStop: IWalkingOnStop): void {
        if (onStop.length === 0) {
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

                this.animateCharacterSetDirection(thing, DirectionAliases[<number>onStop[1]]);

                this.animateCharacterStartWalkingCycle(
                    thing,
                    DirectionAliases[<number>onStop[1]],
                    onStop.slice(2));
            }

            return;
        }

        if (thing.follower) {
            thing.walkingCommands.push(direction);
        }

        this.animateCharacterStartWalking(thing, direction, onStop);

        if (!thing.bordering[direction]) {
            this.EightBitter.physics.shiftBoth(thing, -thing.xvel, -thing.yvel);
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
        let repeats: number = this.EightBitter.MathDecider.compute("speedWalking", thing),
            distance: number = repeats * thing.speed;

        thing.walking = true;
        this.EightBitter.animations.animateCharacterSetDirection(thing, direction);
        this.EightBitter.animations.animateCharacterSetDistanceVelocity(thing, distance);

        if (!thing.cycles || !(<any>thing.cycles).walking) {
            this.EightBitter.TimeHandler.addClassCycle(
                thing,
                ["walking", "standing"],
                "walking",
                repeats / 2);
        }

        if (!thing.walkingFlipping) {
            thing.walkingFlipping = this.EightBitter.TimeHandler.addEventInterval(
                (): void => this.EightBitter.animations.animateSwitchFlipOnDirection(thing),
                repeats,
                Infinity,
                thing);
        }

        if (thing.sight) {
            thing.sightDetector.nocollide = true;
        }

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => thing.onWalkingStop.call(this.EightBitter.animations, thing, onStop),
            repeats,
            Infinity,
            thing,
            onStop);

        if (!thing.bordering[direction]) {
            this.EightBitter.physics.shiftBoth(thing, thing.xvel, thing.yvel);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     * 
     * @param thing   A roaming Character.
     */
    public animateCharacterStartWalkingRandom(thing: ICharacter): void {
        let totalAllowed: number = 0,
            direction: Direction,
            i: number;

        for (let border of thing.bordering) {
            if (!border) {
                totalAllowed += 1;
            }
        }

        if (totalAllowed === 0) {
            return;
        }

        direction = this.EightBitter.NumberMaker.randomInt(totalAllowed);

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

        this.EightBitter.graphics.removeClasses(thing, "walking", "standing");
        this.EightBitter.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.EightBitter.TimeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        this.EightBitter.animations.animateSnapToGrid(thing);

        if (thing.sight) {
            thing.sightDetector.nocollide = false;
            this.EightBitter.animations.animatePositionSightDetector(thing);
        }

        if (!onStop) {
            return true;
        }

        switch (onStop.constructor) {
            case Number:
                this.EightBitter.animations.animateCharacterRepeatWalking(thing);
                break;

            case Array:
                if (onStop[0] > 0) {
                    onStop[0] = <number>onStop[0] - 1;
                    this.EightBitter.animations.animateCharacterStartWalkingCycle(thing, thing.direction, onStop);
                } else if (onStop.length === 0) {
                    break;
                } else {
                    if (onStop[1] instanceof Function) {
                        return <boolean>(<IWalkingOnStopCommandFunction>onStop[1])(thing);
                    }
                    this.EightBitter.animations.animateCharacterStartWalkingCycle(
                        thing,
                        DirectionAliases[<number>onStop[1]],
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
        if (this.EightBitter.battles.checkPlayerGrassBattle(thing)) {
            thing.canKeyWalking = true;
            return false;
        }

        if (thing.following) {
            return this.EightBitter.animations.animateCharacterStopWalking(thing, onStop);
        }

        if (
            !this.EightBitter.MenuGrapher.getActiveMenu()
            && (thing.keys as any)[thing.direction]) {
            this.EightBitter.animations.animateCharacterSetDistanceVelocity(thing, thing.distance);
            return false;
        }

        if (typeof thing.nextDirection !== "undefined") {
            if (thing.nextDirection !== thing.direction && !thing.ledge) {
                this.EightBitter.physics.setPlayerDirection(thing, thing.nextDirection);
            }

            delete thing.nextDirection;
        } else {
            thing.canKeyWalking = true;
        }

        return this.EightBitter.animations.animateCharacterStopWalking(thing, onStop);
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

        this.EightBitter.MapScreener.blockInputs = true;
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
            this.EightBitter.graphics.unflipHoriz(thing);
        }

        this.EightBitter.graphics.removeClasses(
            thing,
            DirectionClasses[Direction.Top],
            DirectionClasses[Direction.Right],
            DirectionClasses[Direction.Bottom],
            DirectionClasses[Direction.Left]);

        this.EightBitter.graphics.addClass(thing, DirectionClasses[direction]);

        if (direction === Direction.Right) {
            this.EightBitter.graphics.flipHoriz(thing);
            this.EightBitter.graphics.addClass(thing, DirectionClasses[Direction.Left]);
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    public animateCharacterSetDirectionRandom(thing: IThing): void {
        this.EightBitter.animations.animateCharacterSetDirection(thing, this.EightBitter.NumberMaker.randomIntWithin(0, 3));
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
            this.EightBitter.graphics.unflipHoriz(thing);
        } else {
            this.EightBitter.graphics.flipHoriz(thing);
        }
    }

    /**
     * Positions a Character's detector in front of it as its sight.
     * 
     * @param thing   A Character that should be able to see.
     */
    public animatePositionSightDetector(thing: ICharacter): void {
        let detector: ISightDetector = thing.sightDetector,
            direction: Direction = thing.direction,
            sight: number = Number(thing.sight);

        if (detector.direction !== direction) {
            if (thing.direction % 2 === 0) {
                this.EightBitter.physics.setWidth(detector, thing.width);
                this.EightBitter.physics.setHeight(detector, sight * 8);
            } else {
                this.EightBitter.physics.setWidth(detector, sight * 8);
                this.EightBitter.physics.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.EightBitter.physics.setBottom(detector, thing.top);
                this.EightBitter.physics.setMidXObj(detector, thing);
                break;
            case 1:
                this.EightBitter.physics.setLeft(detector, thing.right);
                this.EightBitter.physics.setMidYObj(detector, thing);
                break;
            case 2:
                this.EightBitter.physics.setTop(detector, thing.bottom);
                this.EightBitter.physics.setMidXObj(detector, thing);
                break;
            case 3:
                this.EightBitter.physics.setRight(detector, thing.left);
                this.EightBitter.physics.setMidYObj(detector, thing);
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
        let onStop: IWalkingOnStop;

        this.EightBitter.ModAttacher.fireEvent("onDialogFinish", other);

        if (other.pushSteps) {
            onStop = other.pushSteps;
        }

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
            this.animateCharacterStartWalkingCycle(
                thing, other.pushDirection, onStop
            );
        }

        if (other.gift) {
            this.EightBitter.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": true
            });
            this.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(thing, other));
            this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

            this.EightBitter.storage.addItemToBag(other.gift);

            other.gift = undefined;
            this.EightBitter.StateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.EightBitter.StateHolder.addChange(other.id, "dialog", other.dialog);
            this.EightBitter.StateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(other as IEnemy).alreadyBattled) {
            this.animateTrainerBattleStart(thing, other as IEnemy);
            (other as IEnemy).alreadyBattled = true;
            this.EightBitter.StateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.EightBitter.StateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.EightBitter.StateHolder.addChange(other.id, "sight", undefined);
            }
        }

        if (!other.dialogOptions) {
            this.EightBitter.storage.autoSave();
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
        let options: IDialogOptions = dialog.options,
            generateCallback: any = (dialog: string | IDialog): () => void => {
                if (!dialog) {
                    return undefined;
                }

                let callback: (...args: any[]) => void;
                let words: MenuGraphr.IMenuDialogRaw;

                if (dialog.constructor === Object && (dialog as IDialog).options) {
                    words = (dialog as IDialog).words;
                    callback = (): void => {
                        this.animateCharacterDialogOptions(thing, other, dialog as IDialog);
                    };
                } else {
                    words = (dialog as IDialog).words || <string>dialog;
                    if ((dialog as IDialog).cutscene) {
                        callback = this.EightBitter.ScenePlayer.bindCutscene(
                            (dialog as IDialog).cutscene,
                            {
                                player: thing,
                                tirggerer: other
                            });
                    }
                }

                return (): void => {
                    this.EightBitter.MenuGrapher.deleteMenu("Yes/No");
                    this.EightBitter.MenuGrapher.createMenu("GeneralText", {
                        // "deleteOnFinish": true
                    });
                    this.EightBitter.MenuGrapher.addMenuDialog(
                        "GeneralText", words, callback);
                    this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
                };
            };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.EightBitter.MenuGrapher.createMenu("Yes/No", {
            "position": {
                "offset": {
                    "left": 28
                }
            }
        });
        this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
            "options": [
                {
                    "text": "YES",
                    "callback": generateCallback(options.Yes)
                }, {
                    "text": "NO",
                    "callback": generateCallback(options.No)
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Starts a Character walking behind another Character. The leader is given a
     * .walkingCommands queue of recent steps that the follower will mimic.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    public animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
        let direction: Direction = this.EightBitter.physics.getDirectionBordering(thing, other);

        thing.nocollide = true;

        if (thing.player) {
            (<IPlayer>thing).allowDirectionAsKeys = true;
            (<IPlayer>thing).shouldWalk = false;
        }

        thing.following = other;
        other.follower = thing;

        this.EightBitter.storage.addStateHistory(thing, "speed", thing.speed);
        thing.speed = other.speed;

        other.walkingCommands = [];

        this.animateCharacterSetDirection(thing, direction);

        switch (direction) {
            case 0:
                this.EightBitter.physics.setTop(thing, other.bottom);
                break;
            case 1:
                this.EightBitter.physics.setRight(thing, other.left);
                break;
            case 2:
                this.EightBitter.physics.setBottom(thing, other.top);
                break;
            case 3:
                this.EightBitter.physics.setLeft(thing, other.right);
                break;
            default:
                break;
        }

        // Manually start the walking process without giving a 0 onStop,
        // so that it continues smoothly in the walking interval
        this.animateCharacterStartWalking(thing, direction);

        thing.followingLoop = this.EightBitter.TimeHandler.addEventInterval(
            (): void => this.animateCharacterFollowContinue(thing, other),
            this.EightBitter.MathDecider.compute("speedWalking", thing),
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
        if (other.walkingCommands.length === 0) {
            return;
        }

        let direction: Direction = other.walkingCommands.shift();

        this.animateCharacterStartWalking(thing, direction, 0);
    }

    /**
     * Animates a Character to stop having a follower.
     * 
     * @param thing   The leading Character.
     * @returns True, to stop TimeHandlr cycles.
     */
    public animateCharacterFollowStop(thing: ICharacter): boolean {
        let other: ICharacter = thing.following;
        if (!other) {
            return true;
        }

        thing.nocollide = false;
        delete thing.following;
        delete other.follower;

        this.animateCharacterStopWalking(thing);
        this.EightBitter.TimeHandler.cancelEvent(thing.followingLoop);

        return true;
    }

    /**
     * Animates a Character to hop over a ledge.
     * 
     * @param thing   A walking Character.
     * @param other   A ledge for thing to hop over.
     */
    public animateCharacterHopLedge(thing: ICharacter, other: IThing): void {
        let shadow: IThing = this.EightBitter.things.add("Shadow"),
            dy: number = -this.EightBitter.unitsize,
            speed: number = 2,
            steps: number = 14,
            changed: number = 0;

        thing.shadow = shadow;
        thing.ledge = other;

        // Center the shadow below the Thing
        this.EightBitter.physics.setMidXObj(shadow, thing);
        this.EightBitter.physics.setBottom(shadow, thing.bottom);

        // Continuously ensure The Thing still moves off the ledge if not walking
        this.EightBitter.TimeHandler.addEventInterval(
            (): boolean => {
                if (thing.walking) {
                    return false;
                }

                this.EightBitter.animations.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return true;
            },
            1,
            steps * speed - 1);

        // Keep the shadow below the Thing, and move the Thing's offsetY
        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                this.EightBitter.physics.setBottom(shadow, thing.bottom);

                if (changed % speed === 0) {
                    thing.offsetY += dy;
                }

                changed += 1;
            },
            1,
            steps * speed);

        // Inverse the Thing's offsetY changes halfway through the hop
        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                dy *= -1;
            },
            speed * (steps / 2) | 0);

        // Delete the shadow after the jump is done
        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                delete thing.ledge;
                this.EightBitter.physics.killNormal(shadow);

                if (!thing.walking) {
                    this.EightBitter.animations.animateCharacterStopWalking(thing);
                }

                if (thing.player) {
                    (<IPlayer>thing).canKeyWalking = true;
                    this.EightBitter.MapScreener.blockInputs = false;
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
    activateCutsceneTriggerer(thing: IPlayer, other: IDetector): void {
        if (!other.alive || thing.collidedTrigger === other) {
            return;
        }

        thing.collidedTrigger = other;
        this.EightBitter.animations.animatePlayerDialogFreeze(thing);

        if (!other.keepAlive) {
            other.alive = false;

            if (other.id.indexOf("Anonymous") !== -1) {
                console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
            }

            this.EightBitter.StateHolder.addChange(other.id, "alive", false);
            this.EightBitter.physics.killNormal(other);
        }

        if (other.cutscene) {
            this.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                "player": thing,
                "triggerer": other
            });
        }

        if (other.routine) {
            this.EightBitter.ScenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * Activates a Detector to play an audio theme.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    activateThemePlayer(thing: IPlayer, other: IThemeDetector): void {
        if (!thing.player || this.EightBitter.AudioPlayer.getThemeName() === other.theme) {
            return;
        }

        this.EightBitter.AudioPlayer.playTheme(other.theme);
    }

    /**
     * Activates a Detector to play a cutscene, and potentially a dialog.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    activateCutsceneResponder(thing: ICharacter, other: IDetector): void {
        if (!thing.player || !other.alive) {
            return;
        }

        if (other.dialog) {
            this.EightBitter.animations.activateMenuTriggerer(thing, other);
            return;
        }

        this.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
            "player": thing,
            "triggerer": other
        });
    }

    /**
     * Activates a Detector to open a menu, and potentially a dialog.
     * 
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     */
    activateMenuTriggerer(thing: ICharacter, other: IMenuTriggerer): void {
        if (!other.alive || thing.collidedTrigger === other) {
            return;
        }

        let name: string = other.menu || "GeneralText",
            dialog: MenuGraphr.IMenuDialogRaw | MenuGraphr.IMenuDialogRaw[] = other.dialog;

        thing.collidedTrigger = other;
        this.animateCharacterPreventWalking(thing);

        if (!other.keepAlive) {
            this.EightBitter.physics.killNormal(other);
        }

        if (!this.EightBitter.MenuGrapher.getMenu(name)) {
            this.EightBitter.MenuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.EightBitter.MenuGrapher.addMenuDialog(
                name,
                dialog,
                (): void => {
                    let onStop: IWalkingOnStop;

                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }

                    this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

                    if (typeof other.pushDirection !== "undefined") {
                        onStop.push((): void => {
                            this.EightBitter.MapScreener.blockInputs = false;
                            delete thing.collidedTrigger;
                        });
                        this.animateCharacterStartWalkingCycle(
                            thing, other.pushDirection, onStop);
                    } else {
                        this.EightBitter.MapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    }
                });
        }

        this.EightBitter.MenuGrapher.setActiveMenu(name);
    }

    /**
     * Activates a Character's sight detector for when another Character walks
     * into it.
     * 
     * @param thing   A Character triggering other.
     * @param other   A sight detector being triggered by thing.
     */
    activateSightDetector(thing: ICharacter, other: ISightDetector): void {
        if (other.viewer.talking) {
            return;
        }

        other.viewer.talking = true;
        other.active = false;

        this.EightBitter.MapScreener.blockInputs = true;

        this.EightBitter.ScenePlayer.startCutscene("TrainerSpotted", {
            "player": thing,
            "sightDetector": other,
            "triggerer": other.viewer
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
    activateTransporter(thing: ICharacter, other: ITransporter): void {
        if (!thing.player || !other.active) {
            return;
        }

        if (typeof other.transport === "undefined") {
            throw new Error("No transport given to activateTransporter");
        }

        const transport: ITransportSchema = <ITransportSchema>other.transport;
        let callback: () => void;

        if (transport.constructor === String) {
            callback = (): void => this.EightBitter.maps.setLocation(transport as any);
        } else if (typeof transport.map !== "undefined") {
            callback = (): void => this.EightBitter.maps.setMap(transport.map, transport.location);
        } else if (typeof transport.location !== "undefined") {
            callback = (): void => this.EightBitter.maps.setLocation(transport.location);
        } else {
            throw new Error(`Unknown transport type: '${transport}'`);
        }

        other.active = false;

        this.EightBitter.animations.animateFadeToColor({
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
    activateGymStatue(thing: ICharacter, other: IGymDetector): void {
        if (thing.direction !== 0) {
            return;
        }

        let gym: string = other.gym,
            leader: string = other.leader,
            dialog: string[] = [
                gym.toUpperCase()
                + " \n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: "
                + leader.toUpperCase(),
                "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%"
            ];

        if (this.EightBitter.ItemsHolder.getItem("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog("GeneralText", dialog);
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     * 
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    activateHMCharacter(player: IPlayer, thing: IHMCharacter): void {
        if (thing.requiredBadge && !this.EightBitter.ItemsHolder.getItem("badges")[thing.requiredBadge]) {
            return;
        }

        let partyPokemon: IPokemon[] = this.EightBitter.ItemsHolder.getItem("PokemonInParty");

        for (let pokemon of partyPokemon) {
            let moves: BattleMovr.IMove[] = pokemon.moves;

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

        this.EightBitter.TimeHandler.addEvent(
            (): boolean => this.EightBitter.animations.activateCharacterRoaming(thing),
            70 + this.EightBitter.NumberMaker.randomInt(210));

        if (!thing.talking && !this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.animations.animateCharacterStartWalkingRandom(thing);
        }

        return false;
    }

    /**
     * Activates a Spawner by calling its .activate.
     * 
     * @param thing   A newly placed Spawner.
     */
    public activateSpawner(thing: IDetector): void {
        thing.activate(thing);
    }

    /**
     * Checks if a WindowDetector is within frame, and activates it if so.
     * 
     * @param thing   An in-game WindowDetector.
     */
    public checkWindowDetector(thing: IDetector): boolean {
        if (
            thing.bottom < 0
            || thing.left > this.EightBitter.MapScreener.width
            || thing.top > this.EightBitter.MapScreener.height
            || thing.right < 0) {
            return false;
        }

        thing.activate(thing);
        this.EightBitter.physics.killNormal(thing);
        return true;
    }

    /**
     * Activates an AreaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     * 
     * @param thing   An AreaSpawner to activate.
     */
    public spawnAreaSpawner(thing: IAreaSpawner): void {
        let map: IMap = <IMap>this.EightBitter.AreaSpawner.getMap(thing.map),
            area: IArea = <IArea>map.areas[thing.area];

        if (area === this.EightBitter.AreaSpawner.getArea()) {
            this.EightBitter.physics.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === (<IArea>this.EightBitter.AreaSpawner.getArea()).spawnedBy
        ) {
            this.EightBitter.physics.killNormal(thing);
            return;
        }

        area.spawnedBy = (<IArea>this.EightBitter.AreaSpawner.getArea()).spawnedBy;

        this.EightBitter.maps.activateAreaSpawner(thing, area);
    }


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
        let borderedThing: IThing = player.bordering[player.direction];

        if (borderedThing && borderedThing.title.indexOf(move.characterName) !== -1) {
            move.partyActivate(player, pokemon);
        }
    }

    /**
     * Cuts a CuttableTree.
     *
     * @param player   The Player.
     * @param pokemon   The Pokemon using Cut.
     * @todo Add an animation for what happens when the CuttableTree is cut.
     */
    public partyActivateCut(player: IPlayer, pokemon: IPokemon): void {
        this.EightBitter.MenuGrapher.deleteAllMenus();
        this.EightBitter.menus.closePauseMenu();
        this.EightBitter.physics.killNormal(player.bordering[player.direction]);
    }

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @param pokemon   The Pokemon using Strength.
     * @todo Verify the exact speed, sound, and distance.
     */
    public partyActivateStrength(player: IPlayer, pokemon: IPokemon): void {
        let boulder: IHMCharacter = <IHMCharacter>player.bordering[player.direction];

        this.EightBitter.MenuGrapher.deleteAllMenus();
        this.EightBitter.menus.closePauseMenu();

        if (!this.EightBitter.ThingHitter.checkHitForThings(player as any, boulder as any)
            || boulder.bordering[player.direction] !== undefined) {
            return;
        }

        let xvel: number = 0,
            yvel: number = 0;

        switch (player.direction) {
            case 0:
                yvel = -this.EightBitter.unitsize;
                break;

            case 1:
                xvel = this.EightBitter.unitsize;
                break;

            case 2:
                yvel = this.EightBitter.unitsize;
                break;

            case 3:
                xvel = -this.EightBitter.unitsize;
                break;

            default:
                throw new Error("Unknown direction: " + player.direction + ".");
        }

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => this.EightBitter.physics.shiftBoth(boulder, xvel, yvel),
            1,
            8);

        for (let border of boulder.bordering) {
            border = undefined;
        }
    }


    /**
     * Starts the Player surfing.
     *
     * @param player   The Player.
     * @param pokemon   The Pokemon using Strength.
     * @todo Add the dialogue for when the Player starts surfing.
     */
    partyActivateSurf(player: IPlayer, pokemon: IPokemon): void {
        this.EightBitter.MenuGrapher.deleteAllMenus();
        this.EightBitter.menus.closePauseMenu();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        this.EightBitter.graphics.addClass(player, "surfing");
        this.EightBitter.animations.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    }
}
