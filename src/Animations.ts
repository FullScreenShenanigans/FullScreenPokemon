/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IThing } from "./IFullScreenPokemon";

/**
 * Animation functions used by FullScreenPokemon instances.
 */
export class Animations<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     * 
     * @param thing   A newly placed Character.
     */
    spawnCharacter(thing: ICharacter): void {
        if (thing.sight) {
            thing.sightDetector = <ISightDetector>thing.FSP.addThing(
                [
                    "SightDetector",
                    {
                        "direction": thing.direction,
                        "width": thing.sight * 8
                    }
                ]);
            thing.sightDetector.viewer = thing;
            thing.FSP.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            thing.FSP.TimeHandler.addEvent(
                thing.FSP.activateCharacterRoaming,
                thing.FSP.NumberMaker.randomInt(70),
                thing);
        }
    }

    /**
     * Activates a WindowDetector by immediately starting its cycle of
     * checking whether it's in-frame to activate.
     * 
     * @param thing   A newly placed WindowDetector.
     */
    spawnWindowDetector(thing: IDetector): void {
        if (!thing.FSP.checkWindowDetector(thing)) {
            thing.FSP.TimeHandler.addEventInterval(
                thing.FSP.checkWindowDetector, 7, Infinity, thing);
        }
    }
    
    /**
     * Snaps a moving Thing to a predictable grid position.
     * 
     * @param thing   A Thing to snap the position of.
     */
    animateSnapToGrid(thing: IThing): void {
        let grid: number = this.unitsize * 8,
            x: number = (this.MapScreener.left + thing.left) / grid,
            y: number = (this.MapScreener.top + thing.top) / grid;

        this.setLeft(thing, Math.round(x) * grid - this.MapScreener.left);
        this.setTop(thing, Math.round(y) * grid - this.MapScreener.top);
    }

    /**
     * Freezes a Character to start a dialog.
     * 
     * @param thing   A Character to freeze.
     */
    animatePlayerDialogFreeze(thing: ICharacter): void {
        this.animateCharacterPreventWalking(thing);
        this.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.TimeHandler.cancelEvent(thing.walkingFlipping);
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
    animateFadeAttribute(
        thing: IThing,
        attribute: string,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): TimeHandlr.ITimeEvent {

        thing[attribute] += change;

        if (change > 0) {
            if (thing[attribute] >= goal) {
                thing[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (thing[attribute] <= goal) {
                thing[attribute] = goal;
                if (typeof onCompletion === "function") {
                    onCompletion(thing);
                }
                return;
            }
        }

        return thing.FSP.TimeHandler.addEvent(
            thing.FSP.animateFadeAttribute,
            speed,
            thing,
            attribute,
            change,
            goal,
            speed,
            onCompletion);
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
    animateSlideHorizontal(
        thing: IThing,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): void {
        this.shiftHoriz(thing, change);

        if (change > 0) {
            if (this.getMidX(thing) >= goal) {
                this.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.getMidX(thing) <= goal) {
                this.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.TimeHandler.addEvent(
            this.animateSlideHorizontal.bind(this),
            speed,
            thing,
            change,
            goal,
            speed,
            onCompletion);
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
    animateSlideVertical(
        thing: IThing,
        change: number,
        goal: number,
        speed: number,
        onCompletion?: (thing: IThing) => void): void {
        this.shiftVert(thing, change);

        if (change > 0) {
            if (this.getMidY(thing) >= goal) {
                this.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (this.getMidY(thing) <= goal) {
                this.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        this.TimeHandler.addEvent(
            this.animateSlideVertical.bind(this),
            speed,
            thing,
            change,
            goal,
            speed,
            onCompletion);
    }

    /**
     * Freezes a Character in grass and calls startBattle.
     * 
     * @param thing   A Character about to start a battle.
     * @param grass   Grass the Character is walking in.
     */
    animateGrassBattleStart(thing: ICharacter, grass: IThing): void {
        let grassMap: IMap = <IMap>this.AreaSpawner.getMap(grass.mapName),
            grassArea: IArea = <IArea>grassMap.areas[grass.areaName],
            options: IWildPokemonSchema[] = grassArea.wildPokemon.grass,
            chosen: IWildPokemonSchema = this.chooseRandomWildPokemon(options),
            chosenPokemon: IPokemon = this.createPokemon(chosen);

        this.removeClass(thing, "walking");
        if (thing.shadow) {
            this.removeClass(thing.shadow, "walking");
        }

        this.animateCharacterPreventWalking(thing);

        this.startBattle({
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
    animateTrainerBattleStart(thing: ICharacter, other: IEnemy): void {
        let battleName: string = other.battleName || other.title,
            battleSprite: string = other.battleSprite || battleName;

        this.startBattle({
            "opponent": {
                "name": battleName.split(""),
                "sprite": battleSprite + "Front",
                "category": "Trainer",
                "hasActors": true,
                "reward": other.reward,
                "actors": <IPokemon[]>other.actors.map(this.createPokemon.bind(thing.FSP))
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
    animateThingCorners(
        x: number,
        y: number,
        title: string,
        settings: any,
        groupType?: string): [IThing, IThing, IThing, IThing] {
        let things: IThing[] = [];

        for (let i: number = 0; i < 4; i += 1) {
            things.push(this.addThing([title, settings]));
        }

        if (groupType) {
            for (let thing of things) {
                this.GroupHolder.switchMemberGroup(thing, thing.groupType, groupType);
            }
        }

        this.setLeft(things[0], x);
        this.setLeft(things[1], x);

        this.setRight(things[2], x);
        this.setRight(things[3], x);

        this.setBottom(things[0], y);
        this.setBottom(things[3], y);

        this.setTop(things[1], y);
        this.setTop(things[2], y);

        this.flipHoriz(things[0]);
        this.flipHoriz(things[1]);

        this.flipVert(things[1]);
        this.flipVert(things[2]);

        return <[IThing, IThing, IThing, IThing]>things;
    }

    /**
     * Moves a set of four Things away from a point.
     * 
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.shiftHoriz(things[0], amount);
        this.shiftHoriz(things[1], amount);
        this.shiftHoriz(things[2], -amount);
        this.shiftHoriz(things[3], -amount);

        this.shiftVert(things[0], -amount);
        this.shiftVert(things[1], amount);
        this.shiftVert(things[2], amount);
        this.shiftVert(things[3], -amount);
    }

    /**
     * Creates a small smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    animateSmokeSmall(x: number, y: number, callback: (thing: IThing) => void): void {
        let things: IThing[] = this.animateThingCorners(x, y, "SmokeSmall", undefined, "Text");

        this.TimeHandler.addEvent(things.forEach.bind(things), 7, this.killNormal);

        this.TimeHandler.addEvent(this.animateSmokeMedium.bind(this), 7, x, y, callback);
    }

    /**
     * Creates a medium-sized smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    animateSmokeMedium(x: number, y: number, callback: (thing: IThing) => void): void {
        let things: IThing[] = this.animateThingCorners(x, y, "SmokeMedium", undefined, "Text");

        this.TimeHandler.addEvent(this.animateExpandCorners.bind(this), 7, things, this.unitsize);

        this.TimeHandler.addEvent(things.forEach.bind(things), 14, this.killNormal);

        this.TimeHandler.addEvent(this.animateSmokeLarge.bind(this), 14, x, y, callback);
    }

    /**
     * Creates a large smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    animateSmokeLarge(x: number, y: number, callback: (thing: IThing) => void): void {
        let things: [IThing, IThing, IThing, IThing] = this.animateThingCorners(x, y, "SmokeLarge", undefined, "Text");

        this.animateExpandCorners(things, this.unitsize * 2.5);

        this.TimeHandler.addEvent(
            this.animateExpandCorners.bind(this),
            7,
            things,
            this.unitsize * 2);

        this.TimeHandler.addEvent(things.forEach.bind(things), 21, this.killNormal);

        if (callback) {
            this.TimeHandler.addEvent(callback, 21);
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
    animateExclamation(thing: IThing, timeout?: number, callback?: () => void): IThing {
        let exclamation: IThing = this.addThing("Exclamation");

        timeout = timeout || 140;

        this.setMidXObj(exclamation, thing);
        this.setBottom(exclamation, thing.top);

        this.TimeHandler.addEvent(this.killNormal.bind(this), timeout, exclamation);

        if (callback) {
            this.TimeHandler.addEvent(callback, timeout);
        }

        return exclamation;
    }

    /**
     * Fades the screen out to a solid color.
     * 
     * @param FSP
     * @param settings   Settings for the animation.
     * @returns The solid color Thing.
     */
    animateFadeToColor(FSP: FullScreenPokemon, settings: IColorFadeSettings = {}): IThing {
        let color: string = settings.color || "White",
            callback: (...args: any[]) => void = settings.callback,
            change: number = settings.change || .33,
            speed: number = settings.speed || 4,
            blank: IThing = FSP.ObjectMaker.make(color + "Square", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });

        FSP.addThing(blank);

        FSP.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            speed,
            function (): void {
                FSP.killNormal(blank);
                if (callback) {
                    callback.call(FSP, FSP);
                }
            });

        return blank;
    }

    /**
     * Places a solid color over the screen and fades it out.
     * 
     * @param FSP
     * @param settings   Settings for the animation.
     * @returns The solid color Thing.
     */
    animateFadeFromColor(FSP: FullScreenPokemon, settings: IColorFadeSettings = {}): IThing {
        let color: string = settings.color || "White",
            callback: (...args: any[]) => void = settings.callback,
            change: number = settings.change || .33,
            speed: number = settings.speed || 4,
            blank: IThing = FSP.ObjectMaker.make(color + "Square", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 1
            }),
            args: IArguments = arguments;

        FSP.addThing(blank);

        FSP.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            function (): void {
                FSP.killNormal(blank);
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
    animateFlicker(
        thing: IThing,
        cleartime: number = 49,
        interval: number = 2,
        callback?: (thing: IThing) => void): TimeHandlr.ITimeEvent {
        thing.flickering = true;

        thing.FSP.TimeHandler.addEventInterval(
            function (): void {
                thing.hidden = !thing.hidden;
                if (!thing.hidden) {
                    thing.FSP.PixelDrawer.setThingSprite(thing);
                }
            },
            interval | 0,
            cleartime | 0);

        return thing.FSP.TimeHandler.addEvent(
            function (): void {
                thing.flickering = thing.hidden = false;
                thing.FSP.PixelDrawer.setThingSprite(thing);

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
     * @param FSP
     * @param dx   How far to shift horizontally (by default, 0).
     * @param dy   How far to shift horizontally (by default, 0).
     * @param cleartime   How long until the screen is done shaking.
     * @param interval   How many game upkeeps between movements.
     * @returns The shaking time event.
     */
    animateScreenShake(
        FSP: FullScreenPokemon,
        dx: number = 0,
        dy: number = 0,
        cleartime: number = 8,
        interval: number = 8,
        callback?: TimeHandlr.IEventCallback): TimeHandlr.ITimeEvent {
        FSP.TimeHandler.addEventInterval(
            function (): void {
                FSP.GroupHolder.callOnAll(FSP, FSP.shiftHoriz, dx);
                FSP.GroupHolder.callOnAll(FSP, FSP.shiftVert, dy);
            },
            1,
            cleartime * interval);

        return FSP.TimeHandler.addEvent(
            function (): void {
                dx *= -1;
                dy *= -1;

                FSP.TimeHandler.addEventInterval(
                    function (): void {
                        dx *= -1;
                        dy *= -1;
                    },
                    interval,
                    cleartime);

                if (callback) {
                    FSP.TimeHandler.addEvent(callback, interval * cleartime, FSP);
                }
            },
            (interval / 2) | 0);
    }


    /* Character movement animations
    */

    /**
     * Sets a Character's xvel and yvel based on its speed and direction, and marks
     * its destination endpoint.
     * 
     * @param thing   A moving Character.
     * @param distance   How far the Character is moving.
     */
    animateCharacterSetDistanceVelocity(thing: ICharacter, distance: number): void {
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
    animateCharacterStartWalkingCycle(thing: ICharacter, direction: Direction, onStop: IWalkingOnStop): void {
        if (onStop.length === 0) {
            return;
        }

        // If the first queued command is a 0 distance, walking might be complete
        if (onStop[0] === 0) {
            // More commands indicates walking isn't done, and to continue turning/walking
            if (onStop.length > 1) {
                if (typeof onStop[1] === "function") {
                    (<IWalkingOnStopCommandFunction>onStop[1])(thing);
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
            this.shiftBoth(thing, -thing.xvel, -thing.yvel);
        }
    }

    /**
     * Starts a Character walking in the given direction as part of a walking cycle.
     * 
     * @param thing   The Character to start walking.
     * @param direction   What direction to walk in (by default, up).
     * @param onStop   A queue of commands as alternating directions and distances.
     */
    animateCharacterStartWalking(thing: ICharacter, direction: Direction = Direction.Top, onStop?: any): void {
        let repeats: number = thing.FSP.MathDecider.compute("speedWalking", thing),
            distance: number = repeats * thing.speed;

        thing.walking = true;
        thing.FSP.animateCharacterSetDirection(thing, direction);
        thing.FSP.animateCharacterSetDistanceVelocity(thing, distance);

        if (!thing.cycles || !(<any>thing.cycles).walking) {
            thing.FSP.TimeHandler.addClassCycle(
                thing,
                ["walking", "standing"],
                "walking",
                repeats / 2);
        }

        if (!thing.walkingFlipping) {
            thing.walkingFlipping = thing.FSP.TimeHandler.addEventInterval(
                thing.FSP.animateSwitchFlipOnDirection.bind(thing.FSP), repeats, Infinity, thing);
        }

        if (thing.sight) {
            thing.sightDetector.nocollide = true;
        }

        thing.FSP.TimeHandler.addEventInterval(
            thing.onWalkingStop, repeats, Infinity, thing, onStop);

        if (!thing.bordering[direction]) {
            thing.FSP.shiftBoth(thing, thing.xvel, thing.yvel);
        }
    }

    /**
     * Starts a roaming Character walking in a random direction, determined
     * by the allowed directions it may use (that aren't blocked).
     * 
     * @param thing   A roaming Character.
     */
    animateCharacterStartWalkingRandom(thing: ICharacter): void {
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

        direction = this.NumberMaker.randomInt(totalAllowed);

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
    animateCharacterRepeatWalking(thing: ICharacter): void {
        if (typeof thing.turning !== "undefined") {
            if (!thing.player || !(<IPlayer>thing).keys[thing.turning]) {
                this.animateCharacterSetDirection(thing, thing.turning);
                thing.turning = undefined;
                return;
            }

            thing.turning = undefined;
        }

        if (thing.player) {
            (<IPlayer>thing).canKeyWalking = false;
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
    animateCharacterStopWalking(thing: ICharacter, onStop?: IWalkingOnStop): boolean {
        thing.xvel = 0;
        thing.yvel = 0;
        thing.walking = false;

        thing.FSP.removeClasses(thing, "walking", "standing");
        thing.FSP.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            thing.FSP.TimeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        thing.FSP.animateSnapToGrid(thing);

        if (thing.sight) {
            thing.sightDetector.nocollide = false;
            thing.FSP.animatePositionSightDetector(thing);
        }

        if (!onStop) {
            return true;
        }

        switch (onStop.constructor) {
            case Number:
                thing.FSP.animateCharacterRepeatWalking(thing);
                break;

            case Array:
                if (onStop[0] > 0) {
                    onStop[0] = <number>onStop[0] - 1;
                    thing.FSP.animateCharacterStartWalkingCycle(thing, thing.direction, onStop);
                } else if (onStop.length === 0) {
                    break;
                } else {
                    if (onStop[1] instanceof Function) {
                        return <boolean>(<IWalkingOnStopCommandFunction>onStop[1])(thing);
                    }
                    thing.FSP.animateCharacterStartWalkingCycle(
                        thing,
                        DirectionAliases[<number>onStop[1]],
                        onStop.slice(2));
                }
                break;

            case Function:
                return (<any>onStop)(thing);

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
    animatePlayerStopWalking(thing: IPlayer, onStop: IWalkingOnStop): boolean {
        if (thing.FSP.checkPlayerGrassBattle(thing)) {
            thing.canKeyWalking = true;
            return false;
        }

        if (thing.following) {
            return thing.FSP.animateCharacterStopWalking(thing, onStop);
        }

        if (
            !thing.FSP.MenuGrapher.getActiveMenu()
            && thing.keys[thing.direction]) {
            thing.FSP.animateCharacterSetDistanceVelocity(thing, thing.distance);
            return false;
        }

        if (typeof thing.nextDirection !== "undefined") {
            if (thing.nextDirection !== thing.direction && !thing.ledge) {
                thing.FSP.setPlayerDirection(thing, thing.nextDirection);
            }

            delete thing.nextDirection;
        } else {
            thing.canKeyWalking = true;
        }

        return thing.FSP.animateCharacterStopWalking(thing, onStop);
    }

    /**
     * Animates a Character to no longer be able to walk.
     * 
     * @param thing   A Character that shouldn't be able to walk.
     */
    animateCharacterPreventWalking(thing: ICharacter): void {
        thing.shouldWalk = false;
        thing.xvel = thing.yvel = 0;

        if (thing.player) {
            (<IPlayer>thing).keys = (<IPlayer>thing).getKeys();
        }

        this.MapScreener.blockInputs = true;
    }

    /**
     * Sets a Thing facing a particular direction.
     * 
     * @param thing   An in-game Thing.
     * @param direction   A direction for thing to face.
     * @todo Add more logic here for better performance.
     */
    animateCharacterSetDirection(thing: IThing, direction: Direction): void {
        thing.direction = direction;

        if (direction % 2 === 1) {
            this.unflipHoriz(thing);
        }

        this.removeClasses(
            thing,
            DirectionClasses[Direction.Top],
            DirectionClasses[Direction.Right],
            DirectionClasses[Direction.Bottom],
            DirectionClasses[Direction.Left]);

        this.addClass(thing, DirectionClasses[direction]);

        if (direction === Direction.Right) {
            this.flipHoriz(thing);
            this.addClass(thing, DirectionClasses[Direction.Left]);
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    animateCharacterSetDirectionRandom(thing: IThing): void {
        thing.FSP.animateCharacterSetDirection(thing, thing.FSP.NumberMaker.randomIntWithin(0, 3));
    }

    /**
     * Flips or unflips a Character if its direction is vertical.
     * 
     * @param thing   A Character to flip or unflip.
     */
    animateSwitchFlipOnDirection(thing: ICharacter): void {
        if (thing.direction % 2 !== 0) {
            return;
        }

        if (thing.flipHoriz) {
            this.unflipHoriz(thing);
        } else {
            this.flipHoriz(thing);
        }
    }

    /**
     * Positions a Character's detector in front of it as its sight.
     * 
     * @param thing   A Character that should be able to see.
     */
    animatePositionSightDetector(thing: ICharacter): void {
        let detector: ISightDetector = thing.sightDetector,
            direction: Direction = thing.direction,
            sight: number = Number(thing.sight);

        if (detector.direction !== direction) {
            if (thing.direction % 2 === 0) {
                this.setWidth(detector, thing.width);
                this.setHeight(detector, sight * 8);
            } else {
                this.setWidth(detector, sight * 8);
                this.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.setBottom(detector, thing.top);
                this.setMidXObj(detector, thing);
                break;
            case 1:
                this.setLeft(detector, thing.right);
                this.setMidYObj(detector, thing);
                break;
            case 2:
                this.setTop(detector, thing.bottom);
                this.setMidXObj(detector, thing);
                break;
            case 3:
                this.setRight(detector, thing.left);
                this.setMidYObj(detector, thing);
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
    animateCharacterDialogFinish(thing: IPlayer, other: ICharacter): void {
        let onStop: IWalkingOnStop;

        this.ModAttacher.fireEvent("onDialogFinish", other);

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
            this.activateTransporter(thing, <ITransporter><any>other);
            return;
        }

        if (typeof other.pushDirection !== "undefined") {
            this.animateCharacterStartWalkingCycle(
                thing, other.pushDirection, onStop
            );
        }

        if (other.gift) {
            this.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": true
            });
            this.MenuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                this.animateCharacterDialogFinish.bind(this, thing, other)
            );
            this.MenuGrapher.setActiveMenu("GeneralText");

            this.addItemToBag(other.gift);

            other.gift = undefined;
            this.StateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.StateHolder.addChange(other.id, "dialog", other.dialog);
            this.StateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(<IEnemy>other).alreadyBattled) {
            this.animateTrainerBattleStart(thing, <IEnemy>other);
            (<IEnemy>other).alreadyBattled = true;
            this.StateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.StateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.StateHolder.addChange(other.id, "sight", undefined);
            }
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
    animateCharacterDialogOptions(thing: IPlayer, other: ICharacter, dialog: IDialog): void {
        let options: IDialogOptions = dialog.options,
            generateCallback: any = function (dialog: string | IDialog): () => void {
                if (!dialog) {
                    return undefined;
                }

                let callback: (...args: any[]) => void,
                    words: MenuGraphr.IMenuDialogRaw;

                if (dialog.constructor === Object && (<IDialog>dialog).options) {
                    words = (<IDialog>dialog).words;
                    callback = this.animateCharacterDialogOptions.bind(
                        this, thing, other, dialog);
                } else {
                    words = (<IDialog>dialog).words || <string>dialog;
                    if ((<IDialog>dialog).cutscene) {
                        callback = this.ScenePlayer.bindCutscene(
                            (<IDialog>dialog).cutscene,
                            {
                                "player": thing,
                                "tirggerer": other
                            });
                    }
                }

                return function (): void {
                    thing.FSP.MenuGrapher.deleteMenu("Yes/No");
                    thing.FSP.MenuGrapher.createMenu("GeneralText", {
                        // "deleteOnFinish": true
                    });
                    thing.FSP.MenuGrapher.addMenuDialog(
                        "GeneralText", words, callback);
                    thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
                };
            };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.MenuGrapher.createMenu("Yes/No", {
            "position": {
                "offset": {
                    "left": 28
                }
            }
        });
        this.MenuGrapher.addMenuList("Yes/No", {
            "options": [
                {
                    "text": "YES",
                    "callback": generateCallback(options.Yes)
                }, {
                    "text": "NO",
                    "callback": generateCallback(options.No)
                }]
        });
        this.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Starts a Character walking behind another Character. The leader is given a
     * .walkingCommands queue of recent steps that the follower will mimic.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
        let direction: Direction = this.getDirectionBordering(thing, other);

        thing.nocollide = true;

        if (thing.player) {
            (<IPlayer>thing).allowDirectionAsKeys = true;
            (<IPlayer>thing).shouldWalk = false;
        }

        thing.following = other;
        other.follower = thing;

        this.addStateHistory(thing, "speed", thing.speed);
        thing.speed = other.speed;

        other.walkingCommands = [];

        this.animateCharacterSetDirection(thing, direction);

        switch (direction) {
            case 0:
                this.setTop(thing, other.bottom);
                break;
            case 1:
                this.setRight(thing, other.left);
                break;
            case 2:
                this.setBottom(thing, other.top);
                break;
            case 3:
                this.setLeft(thing, other.right);
                break;
            default:
                break;
        }

        // Manually start the walking process without giving a 0 onStop,
        // so that it continues smoothly in the walking interval
        this.animateCharacterStartWalking(thing, direction);

        thing.followingLoop = this.TimeHandler.addEventInterval(
            this.animateCharacterFollowContinue.bind(this),
            this.MathDecider.compute("speedWalking", thing),
            Infinity,
            thing,
            other);
    }

    /**
     * Continuation helper for a following cycle. The next walking command is
     * played, if it exists.
     * 
     * @param thing   The following Character.
     * @param other   The leading Character.
     */
    animateCharacterFollowContinue(thing: ICharacter, other: ICharacter): void {
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
    animateCharacterFollowStop(thing: ICharacter): boolean {
        let other: ICharacter = thing.following;
        if (!other) {
            return true;
        }

        thing.nocollide = false;
        delete thing.following;
        delete other.follower;

        this.animateCharacterStopWalking(thing);
        this.TimeHandler.cancelEvent(thing.followingLoop);

        return true;
    }

    /**
     * Animates a Character to hop over a ledge.
     * 
     * @param thing   A walking Character.
     * @param other   A ledge for thing to hop over.
     */
    animateCharacterHopLedge(thing: ICharacter, other: IThing): void {
        let shadow: IThing = this.addThing("Shadow"),
            dy: number = -this.unitsize,
            speed: number = 2,
            steps: number = 14,
            changed: number = 0;

        thing.shadow = shadow;
        thing.ledge = other;

        // Center the shadow below the Thing
        this.setMidXObj(shadow, thing);
        this.setBottom(shadow, thing.bottom);

        // Continuously ensure The Thing still moves off the ledge if not walking
        thing.FSP.TimeHandler.addEventInterval(
            function (): boolean {
                if (thing.walking) {
                    return false;
                }

                thing.FSP.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return true;
            },
            1,
            steps * speed - 1);

        // Keep the shadow below the Thing, and move the Thing's offsetY
        thing.FSP.TimeHandler.addEventInterval(
            function (): void {
                thing.FSP.setBottom(shadow, thing.bottom);

                if (changed % speed === 0) {
                    thing.offsetY += dy;
                }

                changed += 1;
            },
            1,
            steps * speed);

        // Inverse the Thing's offsetY changes halfway through the hop
        thing.FSP.TimeHandler.addEvent(
            function (): void {
                dy *= -1;
            },
            speed * (steps / 2) | 0);

        // Delete the shadow after the jump is done
        thing.FSP.TimeHandler.addEvent(
            function (): void {
                delete thing.ledge;
                thing.FSP.killNormal(shadow);

                if (!thing.walking) {
                    thing.FSP.animateCharacterStopWalking(thing);
                }

                if (thing.player) {
                    (<IPlayer>thing).canKeyWalking = true;
                    thing.FSP.MapScreener.blockInputs = false;
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
        thing.FSP.animatePlayerDialogFreeze(thing);

        if (!other.keepAlive) {
            other.alive = false;

            if (other.id.indexOf("Anonymous") !== -1) {
                console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
            }

            thing.FSP.StateHolder.addChange(other.id, "alive", false);
            thing.FSP.killNormal(other);
        }

        if (other.cutscene) {
            thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                "player": thing,
                "triggerer": other
            });
        }

        if (other.routine) {
            thing.FSP.ScenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * Activates a Detector to play an audio theme.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    activateThemePlayer(thing: IPlayer, other: IThemeDetector): void {
        if (!thing.player || thing.FSP.AudioPlayer.getThemeName() === other.theme) {
            return;
        }

        thing.FSP.AudioPlayer.playTheme(other.theme);
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
            thing.FSP.activateMenuTriggerer(thing, other);
            return;
        }

        thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
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
            this.killNormal(other);
        }

        if (!this.MenuGrapher.getMenu(name)) {
            this.MenuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.MenuGrapher.addMenuDialog(
                name,
                dialog,
                (): void => {
                    let onStop: IWalkingOnStop;

                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }

                    this.MenuGrapher.deleteMenu("GeneralText");

                    if (typeof other.pushDirection !== "undefined") {
                        onStop.push((): void => {
                            this.MapScreener.blockInputs = false;
                            delete thing.collidedTrigger;
                        });
                        this.animateCharacterStartWalkingCycle(
                            thing, other.pushDirection, onStop);
                    } else {
                        this.MapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    }
                });
        }

        this.MenuGrapher.setActiveMenu(name);
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

        thing.FSP.MapScreener.blockInputs = true;

        thing.FSP.ScenePlayer.startCutscene("TrainerSpotted", {
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

        let transport: ITransportSchema = <ITransportSchema>other.transport,
            callback: Function,
            args: any[];

        if (transport.constructor === String) {
            callback = thing.FSP.setLocation.bind(thing.FSP);
            args = [transport];
        } else if (typeof transport.map !== "undefined") {
            callback = thing.FSP.setMap.bind(thing.FSP);
            args = [transport.map, transport.location];
        } else if (typeof transport.location !== "undefined") {
            callback = thing.FSP.setLocation.bind(thing.FSP);
            args = [transport.location];
        } else {
            throw new Error("Unknown transport type:" + transport);
        }

        other.active = false;

        thing.FSP.animateFadeToColor(thing.FSP, {
            "color": "Black",
            "callback": callback.apply.bind(callback, thing.FSP, args)
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

        if (thing.FSP.ItemsHolder.getItem("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        thing.FSP.MenuGrapher.createMenu("GeneralText");
        thing.FSP.MenuGrapher.addMenuDialog("GeneralText", dialog);
        thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     * 
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    activateHMCharacter(player: IPlayer, thing: IHMCharacter): void {
        if (thing.requiredBadge && !player.FSP.ItemsHolder.getItem("badges")[thing.requiredBadge]) {
            return;
        }

        let partyPokemon: IPokemon[] = player.FSP.ItemsHolder.getItem("PokemonInParty");

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
    activateCharacterRoaming(thing: ICharacter): boolean {
        if (!thing.alive) {
            return true;
        }

        thing.FSP.TimeHandler.addEvent(
            thing.FSP.activateCharacterRoaming,
            70 + thing.FSP.NumberMaker.randomInt(210),
            thing);

        if (!thing.talking && !thing.FSP.MenuGrapher.getActiveMenu()) {
            thing.FSP.animateCharacterStartWalkingRandom(thing);
        }

        return false;
    }

    /**
     * Activates a Spawner by calling its .activate.
     * 
     * @param thing   A newly placed Spawner.
     */
    activateSpawner(thing: IDetector): void {
        thing.activate(thing);
    }

    /**
     * Checks if a WindowDetector is within frame, and activates it if so.
     * 
     * @param thing   An in-game WindowDetector.
     */
    checkWindowDetector(thing: IDetector): boolean {
        if (
            thing.bottom < 0
            || thing.left > thing.FSP.MapScreener.width
            || thing.top > thing.FSP.MapScreener.height
            || thing.right < 0) {
            return false;
        }

        thing.activate(thing);
        thing.FSP.killNormal(thing);
        return true;
    }

    /**
     * Activates an AreaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     * 
     * @param thing   An AreaSpawner to activate.
     */
    spawnAreaSpawner(thing: IAreaSpawner): void {
        let map: IMap = <IMap>thing.FSP.AreaSpawner.getMap(thing.map),
            area: IArea = <IArea>map.areas[thing.area];

        if (area === thing.FSP.AreaSpawner.getArea()) {
            thing.FSP.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === (<IArea>thing.FSP.AreaSpawner.getArea()).spawnedBy
        ) {
            thing.FSP.killNormal(thing);
            return;
        }

        area.spawnedBy = (<IArea>thing.FSP.AreaSpawner.getArea()).spawnedBy;

        thing.FSP.activateAreaSpawner(thing, area);
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
    partyActivateCheckThing(player: IPlayer, pokemon: IPokemon, move: IHMMoveSchema): void {
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
    partyActivateCut(player: IPlayer, pokemon: IPokemon): void {
        player.FSP.MenuGrapher.deleteAllMenus();
        player.FSP.closePauseMenu();
        player.FSP.killNormal(player.bordering[player.direction]);
    }

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @param pokemon   The Pokemon using Strength.
     * @todo Verify the exact speed, sound, and distance.
     */
    partyActivateStrength(player: IPlayer, pokemon: IPokemon): void {
        let boulder: IHMCharacter = <IHMCharacter>player.bordering[player.direction];

        player.FSP.MenuGrapher.deleteAllMenus();
        player.FSP.closePauseMenu();

        if (!player.FSP.ThingHitter.checkHitForThings(player, boulder) || boulder.bordering[player.direction] !== undefined) {
            return;
        }

        let xvel: number = 0,
            yvel: number = 0;

        switch (player.direction) {
            case 0:
                yvel = -boulder.FSP.unitsize;
                break;

            case 1:
                xvel = boulder.FSP.unitsize;
                break;

            case 2:
                yvel = boulder.FSP.unitsize;
                break;

            case 3:
                xvel = -boulder.FSP.unitsize;
                break;

            default:
                throw new Error("Unknown direction: " + player.direction + ".");
        }

        player.FSP.TimeHandler.addEventInterval(
            function (): void {
                boulder.FSP.shiftBoth(boulder, xvel, yvel);
            },
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
        player.FSP.MenuGrapher.deleteAllMenus();
        player.FSP.closePauseMenu();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        player.FSP.addClass(player, "surfing");
        player.FSP.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    }
}
