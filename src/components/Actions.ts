import { Component } from "eightbittr/lib/Component";
import { IMenuDialogRaw } from "menugraphr/lib/IMenuGraphr";
import { ITimeEvent } from "timehandlr/lib/ITimeHandlr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Following } from "./actions/Following";
import { Grass } from "./actions/Grass";
import { Ledges } from "./actions/Ledges";
import { Roaming } from "./actions/Roaming";
import { Shrinking } from "./actions/Shrinking";
import { Sliding } from "./actions/Sliding";
import { Walking } from "./actions/Walking";
import { IPokemon } from "./Battles";
import { Direction } from "./Constants";
import { IHMMoveSchema } from "./constants/Moves";
import { IArea, IMap/*, IWildPokemonSchema*/ } from "./Maps";
import { IDialog, IDialogOptions } from "./Menus";
import {
    IAreaGate, IAreaSpawner, ICharacter, IDetector, IEnemy, IGymDetector, IHMCharacter,
    IMenuTriggerer, IPlayer, ISightDetector, IThemeDetector, IThing, ITransporter,
    ITransportSchema
} from "./Things";

/**
 * Settings for a color fade animation.
 */
export interface IColorFadeSettings {
    /**
     * What color to fade to/from (by default, "White").
     */
    color?: string;

    /**
     * How much to change the color's opacity each tick (by default, .33).
     */
    change?: number;

    /**
     * How many game upkeeps are between each tick (by default, 4).
     */
    speed?: number;

    /**
     * A callback for when the animation completes.
     */
    callback?: () => void;
}

/**
 * Action functions used by FullScreenPokemon instances.
 */
export class Actions<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Following functions used by the FullScreenPokemon instance.
     */
    public readonly following: Following<TGameStartr> = new Following(this.gameStarter);

    /**
     * Grass functions used by the FullScreenPokemon instance.
     */
    public readonly grass: Grass<TGameStartr> = new Grass(this.gameStarter);

    /**
     * Ledge functions used by the FullScreenPokemon instance.
     */
    public readonly ledges: Ledges<TGameStartr> = new Ledges(this.gameStarter);

    /**
     * Roaming functions used by the FullScreenPokemon instance.
     */
    public readonly roaming: Roaming<TGameStartr> = new Roaming(this.gameStarter);

    /**
     * Shrinking functions used by the FullScreenPokemon instance.
     */
    public readonly shrinking: Shrinking<TGameStartr> = new Shrinking(this.gameStarter);

    /**
     * Sliding functions used by the FullScreenPokemon instance.
     */
    public readonly sliding: Sliding<TGameStartr> = new Sliding(this.gameStarter);

    /**
     * Walking functions used by the FullScreenPokemon instance.
     */
    public readonly walking: Walking<TGameStartr> = new Walking(this.gameStarter);

    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     * 
     * @param thing   A newly placed Character.
     */
    public spawnCharacter(thing: ICharacter): void {
        if (thing.sight) {
            thing.sightDetector = this.gameStarter.things.add(
                [
                    this.gameStarter.things.names.SightDetector,
                    {
                        direction: thing.direction,
                        width: thing.sight * 8
                    }
                ]) as ISightDetector;
            thing.sightDetector.viewer = thing;
            this.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            this.gameStarter.timeHandler.addEvent(
                (): void => this.roaming.startRoaming(thing),
                this.gameStarter.numberMaker.randomInt(70));
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
            this.gameStarter.timeHandler.addEventInterval(
                (): boolean => this.checkWindowDetector(thing),
                7,
                Infinity);
        }
    }

    /**
     * Freezes a Character to start a dialog.
     * 
     * @param thing   A Player to freeze.
     */
    public animatePlayerDialogFreeze(thing: IPlayer): void {
        this.walking.animateCharacterPreventWalking(thing);
        this.gameStarter.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.gameStarter.timeHandler.cancelEvent(thing.walkingFlipping);
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

        return this.gameStarter.timeHandler.addEvent(
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
     * Freezes a Character and starts a battle with an enemy.
     * 
     * @param _   A Character about to start a battle with other.
     * @param other   An enemy about to battle thing.
     */
    public animateTrainerBattleStart(thing: ICharacter, other: IEnemy): void {
        console.log("should start battle", thing, other);
        // const battleName: string = other.battleName || other.title;
        // const battleSprite: string = other.battleSprite || battleName;

        // this.gameStarter.battles.startBattle({
        //     battlers: {
        //         opponent: {
        //             name: battleName.split(""),
        //             sprite: battleSprite + "Front",
        //             category: "Trainer",
        //             hasActors: true,
        //             reward: other.reward,
        //             actors: other.actors.map(
        //                 (schema: IWildPokemonSchema): IPokemon => {
        //                     return this.gameStarter.utilities.createPokemon(schema);
        //                 })
        //         }
        //     },
        //     textStart: ["", " wants to fight!"],
        //     textDefeat: other.textDefeat,
        //     textAfterBattle: other.textAfterBattle,
        //     giftAfterBattle: other.giftAfterBattle,
        //     badge: other.badge,
        //     textVictory: other.textVictory,
        //     nextCutscene: other.nextCutscene
        // });
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
            things.push(this.gameStarter.things.add([title, settings]));
        }

        if (groupType) {
            for (const thing of things) {
                this.gameStarter.groupHolder.switchMemberGroup(thing, thing.groupType, groupType);
            }
        }

        this.gameStarter.physics.setLeft(things[0], x);
        this.gameStarter.physics.setLeft(things[1], x);

        this.gameStarter.physics.setRight(things[2], x);
        this.gameStarter.physics.setRight(things[3], x);

        this.gameStarter.physics.setBottom(things[0], y);
        this.gameStarter.physics.setBottom(things[3], y);

        this.gameStarter.physics.setTop(things[1], y);
        this.gameStarter.physics.setTop(things[2], y);

        this.gameStarter.graphics.flipHoriz(things[0]);
        this.gameStarter.graphics.flipHoriz(things[1]);

        this.gameStarter.graphics.flipVert(things[1]);
        this.gameStarter.graphics.flipVert(things[2]);

        return things as [IThing, IThing, IThing, IThing];
    }

    /**
     * Moves a set of four Things away from a point.
     * 
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    public animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.gameStarter.physics.shiftHoriz(things[0], amount);
        this.gameStarter.physics.shiftHoriz(things[1], amount);
        this.gameStarter.physics.shiftHoriz(things[2], -amount);
        this.gameStarter.physics.shiftHoriz(things[3], -amount);

        this.gameStarter.physics.shiftVert(things[0], -amount);
        this.gameStarter.physics.shiftVert(things[1], amount);
        this.gameStarter.physics.shiftVert(things[2], amount);
        this.gameStarter.physics.shiftVert(things[3], -amount);
    }

    /**
     * Creates a small smoke animation from a point.
     * 
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeSmall(x: number, y: number, callback: (thing: IThing) => void): void {
        const things: IThing[] = this.animateThingCorners(x, y, "SmokeSmall", undefined, "Text");

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.gameStarter.physics.killNormal(thing);
                }
            },
            7);

        this.gameStarter.timeHandler.addEvent(
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

        this.gameStarter.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4),
            7);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.gameStarter.physics.killNormal(thing);
                }
            },
            14);

        this.gameStarter.timeHandler.addEvent(
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

        this.gameStarter.timeHandler.addEvent(
            (): void => this.animateExpandCorners(things, 4 * 2),
            7);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const thing of things) {
                    this.gameStarter.physics.killNormal(thing);
                }
            },
            21);

        if (callback) {
            this.gameStarter.timeHandler.addEvent(callback, 21);
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
        const exclamation: IThing = this.gameStarter.things.add(this.gameStarter.things.names.Exclamation);

        timeout = timeout || 140;

        this.gameStarter.physics.setMidXObj(exclamation, thing);
        this.gameStarter.physics.setBottom(exclamation, thing.top);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(exclamation),
            timeout);

        if (callback) {
            this.gameStarter.timeHandler.addEvent(callback, timeout);
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
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(color + this.gameStarter.things.names.Square, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 0
        });

        this.gameStarter.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            speed,
            (): void => {
                this.gameStarter.physics.killNormal(blank);
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
        const blank: IThing = this.gameStarter.objectMaker.make<IThing>(color + this.gameStarter.things.names.Square, {
            width: this.gameStarter.mapScreener.width,
            height: this.gameStarter.mapScreener.height,
            opacity: 1
        });

        this.gameStarter.things.add(blank);

        this.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            (): void => {
                this.gameStarter.physics.killNormal(blank);
                if (callback) {
                    callback(settings, ...args);
                }
            });

        return blank;
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
            this.gameStarter.graphics.unflipHoriz(thing);
        }

        this.gameStarter.graphics.removeClasses(
            thing,
            this.gameStarter.constants.directionClasses[Direction.Top],
            this.gameStarter.constants.directionClasses[Direction.Right],
            this.gameStarter.constants.directionClasses[Direction.Bottom],
            this.gameStarter.constants.directionClasses[Direction.Left]);

        this.gameStarter.graphics.addClass(thing, this.gameStarter.constants.directionClasses[direction]);

        if (direction === Direction.Right) {
            this.gameStarter.graphics.flipHoriz(thing);
            this.gameStarter.graphics.addClass(thing, this.gameStarter.constants.directionClasses[Direction.Left]);
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    public animateCharacterSetDirectionRandom(thing: IThing): void {
        this.animateCharacterSetDirection(thing, this.gameStarter.numberMaker.randomIntWithin(0, 3));
    }

    /**
     * Positions a Character's detector in front of it as its sight.
     * 
     * @param thing   A Character that should be able to see.
     */
    public animatePositionSightDetector(thing: ICharacter): void {
        const detector: ISightDetector = thing.sightDetector!;
        const direction: Direction = thing.direction;

        if (detector.direction !== direction) {
            if (thing.direction % 2 === 0) {
                this.gameStarter.physics.setWidth(detector, thing.width);
                this.gameStarter.physics.setHeight(detector, thing.sight! * 8);
            } else {
                this.gameStarter.physics.setWidth(detector, thing.sight! * 8);
                this.gameStarter.physics.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.gameStarter.physics.setBottom(detector, thing.top);
                this.gameStarter.physics.setMidXObj(detector, thing);
                break;
            case 1:
                this.gameStarter.physics.setLeft(detector, thing.right);
                this.gameStarter.physics.setMidYObj(detector, thing);
                break;
            case 2:
                this.gameStarter.physics.setTop(detector, thing.bottom);
                this.gameStarter.physics.setMidXObj(detector, thing);
                break;
            case 3:
                this.gameStarter.physics.setRight(detector, thing.left);
                this.gameStarter.physics.setMidYObj(detector, thing);
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
        this.gameStarter.modAttacher.fireEvent("onDialogFinish", other);

        thing.talking = false;
        other.talking = false;

        if (other.directionPreferred) {
            this.animateCharacterSetDirection(other, other.directionPreferred);
        }

        if (other.transport) {
            other.active = true;
            this.activateTransporter(thing, other as any);
            return;
        }

        if (other.pushSteps) {
            this.walking.startWalkingOnPath(thing, other.pushSteps);
        }

        if (other.gift) {
            this.gameStarter.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true
            });
            this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(thing, other));
            this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

            this.gameStarter.saves.addItemToBag(other.gift);

            other.gift = undefined;
            this.gameStarter.stateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.gameStarter.stateHolder.addChange(other.id, "dialog", other.dialog);
            this.gameStarter.stateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(other as IEnemy).alreadyBattled) {
            this.animateTrainerBattleStart(thing, other as IEnemy);
            (other as IEnemy).alreadyBattled = true;
            this.gameStarter.stateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.gameStarter.stateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.gameStarter.stateHolder.addChange(other.id, "sight", undefined);
            }
        }

        if (!other.dialogOptions) {
            this.gameStarter.saves.autoSave();
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
        const generateCallback: (inDialog: string | IDialog) => void = (callbackDialog: string | IDialog): (() => void) | void => {
            if (!callbackDialog) {
                return;
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
                    callback = this.gameStarter.scenePlayer.bindCutscene(
                        (callbackDialog as IDialog).cutscene!,
                        {
                            player: thing,
                            tirggerer: other
                        });
                }
            }

            return (): void => {
                this.gameStarter.menuGrapher.deleteMenu("Yes/No");
                this.gameStarter.menuGrapher.createMenu("GeneralText", {
                    // "deleteOnFinish": true
                });
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText", words, callback);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            };
        };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.gameStarter.menuGrapher.createMenu("Yes/No", {
            position: {
                offset: {
                    left: 28
                }
            }
        });
        this.gameStarter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: generateCallback(options.Yes)
                }, {
                    text: "NO",
                    callback: generateCallback(options.No)
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
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

            this.gameStarter.stateHolder.addChange(other.id, "alive", false);
            this.gameStarter.physics.killNormal(other);
        }

        if (other.cutscene) {
            this.gameStarter.scenePlayer.startCutscene(other.cutscene, {
                player: thing,
                triggerer: other
            });
        }

        if (other.routine) {
            this.gameStarter.scenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * Activates a Detector to play an audio theme.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateThemePlayer(thing: IPlayer, other: IThemeDetector): void {
        if (!thing.player || this.gameStarter.audioPlayer.getThemeName() === other.theme) {
            return;
        }

        this.gameStarter.audioPlayer.playTheme(other.theme);
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

        this.gameStarter.scenePlayer.startCutscene(other.cutscene!, {
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
        this.walking.animateCharacterPreventWalking(thing);

        if (!other.keepAlive) {
            this.gameStarter.physics.killNormal(other);
        }

        if (!this.gameStarter.menuGrapher.getMenu(name)) {
            this.gameStarter.menuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.gameStarter.menuGrapher.addMenuDialog(
                name,
                dialog,
                (): void => {
                    const complete: () => void = (): void => {
                        this.gameStarter.mapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    };

                    this.gameStarter.menuGrapher.deleteMenu("GeneralText");

                    if (other.pushSteps) {
                        this.walking.startWalkingOnPath(
                            thing,
                            [
                                ...other.pushSteps,
                                complete
                            ]);
                    } else {
                        complete();
                    }
                });
        }

        this.gameStarter.menuGrapher.setActiveMenu(name);
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

        this.gameStarter.mapScreener.blockInputs = true;

        this.gameStarter.scenePlayer.startCutscene("TrainerSpotted", {
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

        if (!other.transport) {
            throw new Error("No transport given to activateTransporter");
        }

        const transport: ITransportSchema = other.transport as ITransportSchema;
        let callback: () => void;

        if (typeof transport === "string") {
            callback = (): void => {
                this.gameStarter.maps.setLocation(transport);
            };
        } else if (typeof transport.map !== "undefined") {
            callback = (): void => {
                this.gameStarter.maps.setMap(transport.map, transport.location);
            };
        } else if (typeof transport.location !== "undefined") {
            callback = (): void => {
                this.gameStarter.maps.setLocation(transport.location);
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
            `${gym.toUpperCase()}\n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: ${leader.toUpperCase()}`,
            "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%"
        ];

        if (this.gameStarter.itemsHolder.getItem("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", dialog);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     * 
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    public activateHMCharacter(player: IPlayer, thing: IHMCharacter): void {
        if (thing.requiredBadge && !this.gameStarter.itemsHolder.getItem("badges")[thing.requiredBadge]) {
            return;
        }

        for (const pokemon of this.gameStarter.itemsHolder.getItem("PokemonInParty")) {
            for (const move of pokemon.moves) {
                if (move.title === thing.moveName) {
                    thing.moveCallback(player, pokemon);
                    return;
                }
            }
        }
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
            || thing.left > this.gameStarter.mapScreener.width
            || thing.top > this.gameStarter.mapScreener.height
            || thing.right < 0) {
            return false;
        }

        if (!thing.activate) {
            throw new Error("WindowDetector should have .activate.");
        }

        thing.activate.call(this, thing);
        this.gameStarter.physics.killNormal(thing);
        return true;
    }

    /**
     * Activates an IAreaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     * 
     * @param thing   An areaSpawner to activate.
     */
    public spawnAreaSpawner(thing: IAreaSpawner): void {
        const map: IMap = this.gameStarter.areaSpawner.getMap(thing.map) as IMap;
        const area: IArea = map.areas[thing.area];

        if (area === this.gameStarter.areaSpawner.getArea()) {
            this.gameStarter.physics.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === (this.gameStarter.areaSpawner.getArea() as IArea).spawnedBy
        ) {
            this.gameStarter.physics.killNormal(thing);
            return;
        }

        area.spawnedBy = (this.gameStarter.areaSpawner.getArea() as IArea).spawnedBy;

        this.gameStarter.maps.activateAreaSpawner(thing, area);
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

        const area: IArea = this.gameStarter.areaSpawner.getMap(other.map).areas[other.area] as IArea;
        let areaOffsetX: number;
        let areaOffsetY: number;

        switch (thing.direction) {
            case Direction.Top:
                areaOffsetX = thing.left - other.left;
                areaOffsetY = area.height! - thing.height;
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
                areaOffsetX = area.width! - thing.width;
                areaOffsetY = thing.top - other.top;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        const screenOffsetX: number = areaOffsetX - thing.left;
        const screenOffsetY: number = areaOffsetY - thing.top;

        this.gameStarter.mapScreener.top = screenOffsetY;
        this.gameStarter.mapScreener.right = screenOffsetX + this.gameStarter.mapScreener.width;
        this.gameStarter.mapScreener.bottom = screenOffsetY + this.gameStarter.mapScreener.height;
        this.gameStarter.mapScreener.left = screenOffsetX;

        this.gameStarter.itemsHolder.setItem("map", other.map);
        this.gameStarter.itemsHolder.setItem("area", other.area);
        this.gameStarter.itemsHolder.setItem("location", undefined);

        this.gameStarter.stateHolder.setCollection(`${area.map.name}::${area.name}`);

        other.active = false;
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                other.active = true;
            },
            2);
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
        this.gameStarter.menuGrapher.deleteAllMenus();
        this.gameStarter.menus.closePauseMenu();
        this.gameStarter.physics.killNormal(player.bordering[player.direction]!);
    }

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @todo Verify the exact speed, sound, and distance.
     */
    public partyActivateStrength(player: IPlayer): void {
        const boulder: IHMCharacter = player.bordering[player.direction] as IHMCharacter;

        this.gameStarter.menuGrapher.deleteAllMenus();
        this.gameStarter.menus.closePauseMenu();

        if (!this.gameStarter.thingHitter.checkHitForThings(player as any, boulder as any)
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

        this.gameStarter.timeHandler.addEventInterval(
            (): void => this.gameStarter.physics.shiftBoth(boulder, xvel, yvel),
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
        this.gameStarter.menuGrapher.deleteAllMenus();
        this.gameStarter.menus.closePauseMenu();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        this.gameStarter.graphics.addClass(player, "surfing");
        console.log("Should start walking");
        // this.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    }
}
