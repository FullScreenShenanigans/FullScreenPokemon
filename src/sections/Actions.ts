import { member } from "babyioc";
import { Section } from "eightbittr";
import { IMenuDialogRaw } from "menugraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Following } from "./actions/Following";
import { Grass } from "./actions/Grass";
import { Ledges } from "./actions/Ledges";
import { Roaming } from "./actions/Roaming";
import { Walking } from "./actions/Walking";
import { IPokemon } from "./Battles";
import { Direction } from "./Constants";
import { IHMMoveSchema } from "./constants/Moves";
import { IArea, IMap } from "./Maps";
import { IDialog, IDialogOptions } from "./Menus";
import {
    IAreaGate,
    IAreaSpawner,
    ICharacter,
    IDetector,
    IEnemy,
    IGymDetector,
    IHMCharacter,
    IMenuTriggerer,
    IPlayer,
    IPokeball,
    IRoamingCharacter,
    ISightDetector,
    IThemeDetector,
    IThing,
    ITransporter,
    ITransportSchema,
} from "./Things";

/**
 * Actions characters may perform walking around.
 */
export class Actions extends Section<FullScreenPokemon> {
    /**
     * Sets characters following each other.
     */
    @member(Following)
    public readonly following: Following;

    /**
     * Visual and battle updates for walking in tall grass.
     */
    @member(Grass)
    public readonly grass: Grass;

    /**
     * Hops characters down ledges.
     */
    @member(Ledges)
    public readonly ledges: Ledges;

    /**
     * Idle characters turning and walking in random directions.
     */
    @member(Roaming)
    public readonly roaming: Roaming;

    /**
     * Starts, continues, and stops characters walking.
     */
    @member(Walking)
    public readonly walking: Walking;

    /**
     * Spawning callback for Characters. Sight and roaming are accounted for.
     *
     * @param thing   A newly placed Character.
     */
    public spawnCharacter = (thing: ICharacter): void => {
        if (thing.sight) {
            thing.sightDetector = this.game.things.add([
                this.game.things.names.sightDetector,
                {
                    direction: thing.direction,
                    width: thing.sight * 8,
                },
            ]) as ISightDetector;
            thing.sightDetector.viewer = thing;
            this.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            this.game.timeHandler.addEvent(
                (): void => this.roaming.startRoaming(thing as IRoamingCharacter),
                this.game.numberMaker.randomInt(70)
            );
        }
    };

    /**
     * Collision callback for a Player and a Pokeball it's interacting with.
     *
     * @param thing   A Player interacting with other.
     * @param other   A Pokeball being interacted with by thing.
     */
    public activatePokeball = (thing: IPlayer, other: IPokeball): void => {
        switch (other.action) {
            case "item":
                if (!other.item) {
                    throw new Error("Pokeball must have an item for the item action.");
                }

                this.game.menuGrapher.createMenu("GeneralText");
                this.game.menuGrapher.addMenuDialog(
                    "GeneralText",
                    ["%%%%%%%PLAYER%%%%%%% found " + other.item + "!"],
                    (): void => {
                        this.game.menuGrapher.deleteActiveMenu();
                        this.game.death.kill(other);
                        this.game.stateHolder.addChange(other.id, "alive", false);
                    }
                );
                this.game.menuGrapher.setActiveMenu("GeneralText");

                this.game.saves.addItemToBag(other.item, other.amount);
                break;

            case "cutscene":
                if (!other.cutscene) {
                    throw new Error("Pokeball must have a cutscene for the cutscene action.");
                }

                this.game.scenePlayer.startCutscene(other.cutscene, {
                    player: thing,
                    triggerer: other,
                });
                if (other.routine) {
                    this.game.scenePlayer.playRoutine(other.routine);
                }
                break;

            case "pokedex":
                if (!other.pokemon) {
                    throw new Error("Pokeball must have a Pokemon for the cutscene action.");
                }

                this.game.menus.pokedex.openPokedexListing(other.pokemon);
                break;

            case "dialog":
                if (!other.dialog) {
                    throw new Error("Pokeball must have a dialog for the cutscene action.");
                }

                this.game.menuGrapher.createMenu("GeneralText");
                this.game.menuGrapher.addMenuDialog("GeneralText", other.dialog);
                this.game.menuGrapher.setActiveMenu("GeneralText");
                break;

            case "yes/no":
                this.game.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.game.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: (): void => console.log("What do, yes?"),
                        },
                        {
                            text: "NO",
                            callback: (): void => console.log("What do, no?"),
                        },
                    ],
                });
                this.game.menuGrapher.setActiveMenu("Yes/No");
                break;

            default:
                throw new Error("Unknown Pokeball action: " + other.action + ".");
        }
    };

    /**
     * Activates a WindowDetector by immediately starting its cycle of
     * checking whether it's in-frame to activate.
     *
     * @param thing   A newly placed WindowDetector.
     */
    public spawnWindowDetector = (thing: IDetector): void => {
        if (!this.checkWindowDetector(thing)) {
            this.game.timeHandler.addEventInterval(
                (): boolean => this.checkWindowDetector(thing),
                7,
                Infinity
            );
        }
    };

    /**
     * Freezes a Character to start a dialog.
     *
     * @param thing   A Player to freeze.
     */
    public animatePlayerDialogFreeze(thing: IPlayer): void {
        this.walking.animateCharacterPreventWalking(thing);
        this.game.classCycler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.game.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }
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

        // this.game.battles.startBattle({
        //     battlers: {
        //         opponent: {
        //             name: battleName.split(""),
        //             sprite: battleSprite + "Front",
        //             category: "Trainer",
        //             hasActors: true,
        //             reward: other.reward,
        //             actors: other.actors.map(
        //                 (schema: IWildPokemonSchema): IPokemon => {
        //                     return this.game.equations.createPokemon(schema);
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
        groupType?: string
    ): [IThing, IThing, IThing, IThing] {
        const things: IThing[] = [];

        for (let i = 0; i < 4; i += 1) {
            things.push(this.game.things.add([title, settings]));
        }

        if (groupType) {
            for (const thing of things) {
                this.game.groupHolder.switchGroup(thing, thing.groupType, groupType);
            }
        }

        this.game.physics.setLeft(things[0], x);
        this.game.physics.setLeft(things[1], x);

        this.game.physics.setRight(things[2], x);
        this.game.physics.setRight(things[3], x);

        this.game.physics.setBottom(things[0], y);
        this.game.physics.setBottom(things[3], y);

        this.game.physics.setTop(things[1], y);
        this.game.physics.setTop(things[2], y);

        this.game.graphics.flipping.flipHoriz(things[0]);
        this.game.graphics.flipping.flipHoriz(things[1]);

        this.game.graphics.flipping.flipVert(things[1]);
        this.game.graphics.flipping.flipVert(things[2]);

        return things as [IThing, IThing, IThing, IThing];
    }

    /**
     * Moves a set of four Things away from a point.
     *
     * @param things   The four Things to move.
     * @param amount   How far to move each Thing horizontally and vertically.
     */
    public animateExpandCorners(things: [IThing, IThing, IThing, IThing], amount: number): void {
        this.game.physics.shiftHoriz(things[0], amount);
        this.game.physics.shiftHoriz(things[1], amount);
        this.game.physics.shiftHoriz(things[2], -amount);
        this.game.physics.shiftHoriz(things[3], -amount);

        this.game.physics.shiftVert(things[0], -amount);
        this.game.physics.shiftVert(things[1], amount);
        this.game.physics.shiftVert(things[2], amount);
        this.game.physics.shiftVert(things[3], -amount);
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

        this.game.timeHandler.addEvent((): void => {
            for (const thing of things) {
                this.game.death.kill(thing);
            }
        }, 7);

        this.game.timeHandler.addEvent((): void => this.animateSmokeMedium(x, y, callback), 7);
    }

    /**
     * Creates a medium-sized smoke animation from a point.
     *
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeMedium(x: number, y: number, callback: (thing: IThing) => void): void {
        const things: [IThing, IThing, IThing, IThing] = this.animateThingCorners(
            x,
            y,
            "SmokeMedium",
            undefined,
            "Text"
        );

        this.game.timeHandler.addEvent((): void => this.animateExpandCorners(things, 4), 7);

        this.game.timeHandler.addEvent((): void => {
            for (const thing of things) {
                this.game.death.kill(thing);
            }
        }, 14);

        this.game.timeHandler.addEvent((): void => this.animateSmokeLarge(x, y, callback), 14);
    }

    /**
     * Creates a large smoke animation from a point.
     *
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeLarge(x: number, y: number, callback: (thing: IThing) => void): void {
        const things: [IThing, IThing, IThing, IThing] = this.animateThingCorners(
            x,
            y,
            "SmokeLarge",
            undefined,
            "Text"
        );

        this.animateExpandCorners(things, 10);

        this.game.timeHandler.addEvent((): void => this.animateExpandCorners(things, 8), 7);

        this.game.timeHandler.addEvent((): void => {
            for (const thing of things) {
                this.game.death.kill(thing);
            }
        }, 21);

        if (callback) {
            this.game.timeHandler.addEvent(callback, 21);
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
    public animateExclamation(
        thing: IThing,
        timeout: number = 140,
        callback?: () => void
    ): IThing {
        const exclamation: IThing = this.game.things.add(this.game.things.names.exclamation);

        this.game.physics.setMidXObj(exclamation, thing);
        this.game.physics.setBottom(exclamation, thing.top);

        this.game.timeHandler.addEvent((): void => this.game.death.kill(exclamation), timeout);

        if (callback) {
            this.game.timeHandler.addEvent(callback, timeout);
        }

        return exclamation;
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
            this.game.graphics.flipping.unflipHoriz(thing);
        }

        this.game.graphics.classes.removeClasses(
            thing,
            this.game.constants.directionClasses[Direction.Top],
            this.game.constants.directionClasses[Direction.Right],
            this.game.constants.directionClasses[Direction.Bottom],
            this.game.constants.directionClasses[Direction.Left]
        );

        this.game.graphics.classes.addClass(
            thing,
            this.game.constants.directionClasses[direction]
        );

        if (direction === Direction.Right) {
            this.game.graphics.flipping.flipHoriz(thing);
            this.game.graphics.classes.addClass(
                thing,
                this.game.constants.directionClasses[Direction.Left]
            );
        }
    }

    /**
     * Sets a Thing facing a random direction.
     *
     * @param thing   An in-game Thing.
     */
    public animateCharacterSetDirectionRandom(thing: IThing): void {
        this.animateCharacterSetDirection(thing, this.game.numberMaker.randomIntWithin(0, 3));
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
                this.game.physics.setWidth(detector, thing.width);
                this.game.physics.setHeight(detector, thing.sight! * 8);
            } else {
                this.game.physics.setWidth(detector, thing.sight! * 8);
                this.game.physics.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.game.physics.setBottom(detector, thing.top);
                this.game.physics.setMidXObj(detector, thing);
                break;
            case 1:
                this.game.physics.setLeft(detector, thing.right);
                this.game.physics.setMidYObj(detector, thing);
                break;
            case 2:
                this.game.physics.setTop(detector, thing.bottom);
                this.game.physics.setMidXObj(detector, thing);
                break;
            case 3:
                this.game.physics.setRight(detector, thing.left);
                this.game.physics.setMidYObj(detector, thing);
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
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onDialogFinish, other);

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
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
            this.game.menuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(thing, other)
            );
            this.game.menuGrapher.setActiveMenu("GeneralText");

            this.game.saves.addItemToBag(other.gift);

            other.gift = undefined;
            this.game.stateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            this.game.stateHolder.addChange(other.id, "dialog", other.dialog);
            this.game.stateHolder.addChange(other.id, "dialogNext", undefined);
        }

        if (other.dialogOptions) {
            this.animateCharacterDialogOptions(thing, other, other.dialogOptions);
        } else if (other.trainer && !(other as IEnemy).alreadyBattled) {
            this.animateTrainerBattleStart(thing, other as IEnemy);
            (other as IEnemy).alreadyBattled = true;
            this.game.stateHolder.addChange(other.id, "alreadyBattled", true);
        }

        if (other.trainer) {
            other.trainer = false;
            this.game.stateHolder.addChange(other.id, "trainer", false);

            if (other.sight) {
                other.sight = undefined;
                this.game.stateHolder.addChange(other.id, "sight", undefined);
            }
        }

        if (!other.dialogOptions) {
            this.game.saves.autoSaveIfEnabled();
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
    public animateCharacterDialogOptions(
        thing: IPlayer,
        other: ICharacter,
        dialog: IDialog
    ): void {
        if (!dialog.options) {
            throw new Error("Dialog should have .options.");
        }

        const options: IDialogOptions = dialog.options;
        const generateCallback = (callbackDialog: string | IDialog): (() => void) | undefined => {
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
                words = (callbackDialog as IDialog).words || (callbackDialog as string);
                if ((callbackDialog as IDialog).cutscene) {
                    callback = this.game.scenePlayer.bindCutscene(
                        (callbackDialog as IDialog).cutscene!,
                        {
                            player: thing,
                            tirggerer: other,
                        }
                    );
                }
            }

            return (): void => {
                this.game.menuGrapher.deleteMenu("Yes/No");
                this.game.menuGrapher.createMenu("GeneralText", {
                    deleteOnFinish: true,
                });
                this.game.menuGrapher.addMenuDialog("GeneralText", words, callback);
                this.game.menuGrapher.setActiveMenu("GeneralText");
            };
        };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        this.game.menuGrapher.createMenu("Yes/No", {
            position: {
                offset: {
                    left: 28,
                },
            },
        });
        this.game.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: generateCallback(options.Yes),
                },
                {
                    text: "NO",
                    callback: generateCallback(options.No),
                },
            ],
        });
        this.game.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Activates a Detector to trigger a cutscene and/or routine.
     *
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateCutsceneTriggerer = (thing: IPlayer, other: IDetector): void => {
        if (other.removed || thing.collidedTrigger === other) {
            return;
        }

        thing.collidedTrigger = other;
        this.animatePlayerDialogFreeze(thing);

        if (!other.keepAlive) {
            if (other.id.indexOf("Anonymous") !== -1) {
                console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
            }

            this.game.stateHolder.addChange(other.id, "alive", false);
            this.game.death.kill(other);
        }

        if (other.cutscene) {
            this.game.scenePlayer.startCutscene(other.cutscene, {
                player: thing,
                triggerer: other,
            });
        }

        if (other.routine) {
            this.game.scenePlayer.playRoutine(other.routine);
        }
    };

    /**
     * Activates a Detector to play an audio theme.
     *
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateThemePlayer = async (thing: IPlayer, other: IThemeDetector): Promise<void> => {
        if (
            !thing.player ||
            this.game.audioPlayer.hasSound(this.game.audio.aliases.theme, other.theme)
        ) {
            return;
        }

        await this.game.audioPlayer.play(other.theme, {
            alias: this.game.audio.aliases.theme,
            loop: true,
        });
    };

    /**
     * Activates a Detector to play a cutscene, and potentially a dialog.
     *
     * @param thing   A Player triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateCutsceneResponder(thing: ICharacter, other: IDetector): void {
        if (!thing.player || other.removed) {
            return;
        }

        if (other.dialog) {
            this.activateMenuTriggerer(thing, other);
            return;
        }

        this.game.scenePlayer.startCutscene(other.cutscene!, {
            player: thing,
            triggerer: other,
        });
    }

    /**
     * Activates a Detector to open a menu, and potentially a dialog.
     *
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     */
    public activateMenuTriggerer = (thing: ICharacter, other: IMenuTriggerer): void => {
        if (other.removed || thing.collidedTrigger === other) {
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
            this.game.death.kill(other);
        }

        if (!this.game.menuGrapher.getMenu(name)) {
            this.game.menuGrapher.createMenu(name, other.menuAttributes);
        }

        if (dialog) {
            this.game.menuGrapher.addMenuDialog(name, dialog, (): void => {
                const complete: () => void = (): void => {
                    this.game.mapScreener.blockInputs = false;
                    delete thing.collidedTrigger;
                };

                this.game.menuGrapher.deleteMenu("GeneralText");

                if (other.pushSteps) {
                    this.walking.startWalkingOnPath(thing, [...other.pushSteps, complete]);
                } else {
                    complete();
                }
            });
        }

        this.game.menuGrapher.setActiveMenu(name);
    };

    /**
     * Activates a Character's sight detector for when another Character walks
     * into it.
     *
     * @param thing   A Character triggering other.
     * @param other   A sight detector being triggered by thing.
     */
    public activateSightDetector = (thing: ICharacter, other: ISightDetector): void => {
        if (other.viewer.talking) {
            return;
        }

        other.viewer.talking = true;
        other.active = false;

        this.game.mapScreener.blockInputs = true;

        this.game.scenePlayer.startCutscene("TrainerSpotted", {
            player: thing,
            sightDetector: other,
            triggerer: other.viewer,
        });
    };

    /**
     * Activation callback for level transports (any Thing with a .transport
     * attribute). Depending on the transport, either the map or location are
     * shifted to it.
     *
     * @param thing   A Character attempting to enter other.
     * @param other   A transporter being entered by thing.
     */
    public activateTransporter = (thing: ICharacter, other: ITransporter): void => {
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
                this.game.maps.setLocation(transport);
            };
        } else if (typeof transport.map !== "undefined") {
            callback = (): void => {
                this.game.maps.setMap(transport.map, transport.location);
            };
        } else if (typeof transport.location !== "undefined") {
            callback = (): void => {
                this.game.maps.setLocation(transport.location);
            };
        } else {
            throw new Error(`Unknown transport type: '${transport}'`);
        }

        other.active = false;

        this.game.animations.fading.animateFadeToColor({
            callback,
            color: "Black",
        });
    };

    /**
     * Activation trigger for a gym statue. If the Player is looking up at it,
     * it speaks the status of the gym leader.
     *
     * @param thing   A Player activating other.
     * @param other   A gym statue being activated by thing.
     */
    public activateGymStatue = (thing: ICharacter, other: IGymDetector): void => {
        if (thing.direction !== 0) {
            return;
        }

        const gym: string = other.gym;
        const leader: string = other.leader;
        const dialog: string[] = [
            `${gym.toUpperCase()}\n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: ${leader.toUpperCase()}`,
            "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%",
        ];

        if (this.game.itemsHolder.getItem(this.game.storage.names.badges)[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", dialog);
        this.game.menuGrapher.setActiveMenu("GeneralText");
    };

    /**
     * Calls an HMCharacter's partyActivate Function when the Player activates the HMCharacter.
     *
     * @param player   The Player.
     * @param thing   The Solid to be affected.
     */
    public activateHMCharacter = (player: IPlayer, thing: IHMCharacter): void => {
        if (
            thing.requiredBadge &&
            !this.game.itemsHolder.getItem(this.game.storage.names.badges)[thing.requiredBadge]
        ) {
            return;
        }

        for (const pokemon of this.game.itemsHolder.getItem(
            this.game.storage.names.pokemonInParty
        )) {
            for (const move of pokemon.moves) {
                if (move.title === thing.moveName) {
                    thing.moveCallback(player, pokemon);
                    return;
                }
            }
        }
    };

    /**
     * Activates a Spawner by calling its .activate.
     *
     * @param thing   A newly placed Spawner.
     */
    public activateSpawner = (thing: IDetector): void => {
        if (!thing.activate) {
            throw new Error("Spawner should have .activate.");
        }

        thing.activate.call(this, thing);
    };

    /**
     * Checks if a WindowDetector is within frame, and activates it if so.
     *
     * @param thing   An in-game WindowDetector.
     */
    public checkWindowDetector(thing: IDetector): boolean {
        if (
            thing.bottom < 0 ||
            thing.left > this.game.mapScreener.width ||
            thing.top > this.game.mapScreener.height ||
            thing.right < 0
        ) {
            return false;
        }

        if (!thing.activate) {
            throw new Error("WindowDetector should have .activate.");
        }

        thing.activate.call(this, thing);
        this.game.death.kill(thing);
        return true;
    }

    /**
     * Activates an IAreaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     *
     * @param thing   An IAreaSpawner to activate.
     */
    public spawnAreaSpawner = (thing: IAreaSpawner): void => {
        const map: IMap = this.game.areaSpawner.getMap(thing.map) as IMap;
        const area: IArea = map.areas[thing.area];

        if (area === this.game.areaSpawner.getArea()) {
            this.game.death.kill(thing);
            return;
        }

        if (
            area.spawnedBy &&
            area.spawnedBy === (this.game.areaSpawner.getArea() as IArea).spawnedBy
        ) {
            this.game.death.kill(thing);
            return;
        }

        area.spawnedBy = (this.game.areaSpawner.getArea() as IArea).spawnedBy;

        this.game.maps.activateAreaSpawner(thing, area);
    };

    /**
     * Activation callback for an AreaGate. The Player is marked to now spawn
     * in the new Map and Area.
     *
     * @param thing   A Character walking to other.
     * @param other   An AreaGate potentially being triggered.
     */
    public activateAreaGate = (thing: ICharacter, other: IAreaGate): void => {
        if (!thing.player || !thing.walking || thing.direction !== other.direction) {
            return;
        }

        const area: IArea = this.game.areaSpawner.getMap(other.map).areas[other.area] as IArea;
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

        this.game.mapScreener.top = screenOffsetY;
        this.game.mapScreener.right = screenOffsetX + this.game.mapScreener.width;
        this.game.mapScreener.bottom = screenOffsetY + this.game.mapScreener.height;
        this.game.mapScreener.left = screenOffsetX;
        this.game.mapScreener.activeArea = this.game.areaSpawner.getMap().areas[
            other.area
        ] as IArea;

        this.game.itemsHolder.setItem(this.game.storage.names.map, other.map);
        this.game.itemsHolder.setItem(this.game.storage.names.area, other.area);
        this.game.itemsHolder.setItem(this.game.storage.names.location, undefined);

        this.game.maps.setStateCollection(area);

        other.active = false;
        this.game.timeHandler.addEvent((): void => {
            other.active = true;
        }, 2);
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
    public partyActivateCheckThing(
        player: IPlayer,
        pokemon: IPokemon,
        move: IHMMoveSchema
    ): void {
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
    public partyActivateCut = (player: IPlayer): void => {
        this.game.menuGrapher.deleteAllMenus();
        this.game.menus.pause.close();
        this.game.death.kill(player.bordering[player.direction]!);
    };

    /**
     * Makes a StrengthBoulder move.
     *
     * @param player   The Player.
     * @todo Verify the exact speed, sound, and distance.
     */
    public partyActivateStrength = (player: IPlayer): void => {
        const boulder: IHMCharacter = player.bordering[player.direction] as IHMCharacter;

        this.game.menuGrapher.deleteAllMenus();
        this.game.menus.pause.close();

        if (
            !this.game.thingHitter.checkHitForThings(player as any, boulder as any) ||
            boulder.bordering[player.direction] !== undefined
        ) {
            return;
        }

        let xvel = 0;
        let yvel = 0;

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

        this.game.timeHandler.addEventInterval(
            (): void => this.game.physics.shiftBoth(boulder, xvel, yvel),
            1,
            8
        );

        for (let i = 0; i < boulder.bordering.length; i += 1) {
            boulder.bordering[i] = undefined;
        }
    };

    /**
     * Starts the Player surfing.
     *
     * @param player   The Player.
     * @todo Add the dialogue for when the Player starts surfing.
     */
    public partyActivateSurf = (player: IPlayer): void => {
        this.game.menuGrapher.deleteAllMenus();
        this.game.menus.pause.close();

        if (player.cycling) {
            return;
        }

        player.bordering[player.direction] = undefined;
        this.game.graphics.classes.addClass(player, "surfing");
        console.log("Should start walking");
        // this.animateCharacterStartWalking(player, player.direction, [1]);
        player.surfing = true;
    };
}
