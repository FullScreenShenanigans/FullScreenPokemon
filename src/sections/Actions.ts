import { member } from "babyioc";
import { Section } from "eightbittr";
import { MenuDialogRaw } from "menugraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Following } from "./actions/Following";
import { Grass } from "./actions/Grass";
import { Ledges } from "./actions/Ledges";
import { Roaming } from "./actions/Roaming";
import { Walking } from "./actions/Walking";
import { Pokemon } from "./Battles";
import { Direction } from "./Constants";
import { HMMoveSchema } from "./constants/Moves";
import { Area, Map } from "./Maps";
import { Dialog, DialogOptions } from "./Menus";
import {
    Actor,
    AreaGate,
    AreaSpawner,
    Character,
    Detector,
    Enemy,
    GymDetector,
    HMCharacter,
    MenuTriggerer,
    Player,
    Pokeball,
    RoamingCharacter,
    SightDetector,
    ThemeDetector,
    Transporter,
    TransportSchema,
} from "./Actors";

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
     * @param actor   A newly placed Character.
     */
    public spawnCharacter = (actor: Character): void => {
        if (actor.sight) {
            actor.sightDetector = this.game.actors.add<SightDetector>([
                this.game.actors.names.sightDetector,
                {
                    direction: actor.direction,
                    width: actor.sight * 8,
                },
            ]);
            actor.sightDetector.viewer = actor;
            this.animatePositionSightDetector(actor);
        }

        if (actor.roaming) {
            this.game.timeHandler.addEvent(
                (): void => this.roaming.startRoaming(actor as RoamingCharacter),
                this.game.numberMaker.randomInt(70)
            );
        }
    };

    /**
     * Collision callback for a Player and a Pokeball it's interacting with.
     *
     * @param actor   A Player interacting with other.
     * @param other   A Pokeball being interacted with by actor.
     */
    public activatePokeball = (actor: Player, other: Pokeball): void => {
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
                    player: actor,
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
     * @param actor   A newly placed WindowDetector.
     */
    public spawnWindowDetector = (actor: Detector): void => {
        if (!this.checkWindowDetector(actor)) {
            this.game.timeHandler.addEventInterval(
                (): boolean => this.checkWindowDetector(actor),
                7,
                Infinity
            );
        }
    };

    /**
     * Freezes a Character to start a dialog.
     *
     * @param actor   A Player to freeze.
     */
    public animatePlayerDialogFreeze(actor: Player): void {
        this.walking.animateCharacterPreventWalking(actor);
        this.game.classCycler.cancelClassCycle(actor, "walking");

        if (actor.walkingFlipping) {
            this.game.timeHandler.cancelEvent(actor.walkingFlipping);
            actor.walkingFlipping = undefined;
        }
    }

    /**
     * Freezes a Character and starts a battle with an enemy.
     *
     * @param _   A Character about to start a battle with other.
     * @param other   An enemy about to battle actor.
     */
    public animateTrainerBattleStart(actor: Character, other: Enemy): void {
        console.log("should start battle", actor, other);
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
        //                 (schema: WildPokemonSchema): Pokemon => {
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
     * Creates and positions a set of four Actors around a point.
     *
     * @param x   The horizontal value of the point.
     * @param y   The vertical value of the point.
     * @param title   A title for each Actor to create.
     * @param settings   Additional settings for each Actor.
     * @param groupType   Which group to move the Actors into, if any.
     * @returns The four created Actors.
     */
    public animateActorCorners(
        x: number,
        y: number,
        title: string,
        settings: any,
        groupType?: string
    ): [Actor, Actor, Actor, Actor] {
        const actors: Actor[] = [];

        for (let i = 0; i < 4; i += 1) {
            actors.push(this.game.actors.add([title, settings]));
        }

        if (groupType) {
            for (const actor of actors) {
                this.game.groupHolder.switchGroup(actor, actor.groupType, groupType);
            }
        }

        this.game.physics.setLeft(actors[0], x);
        this.game.physics.setLeft(actors[1], x);

        this.game.physics.setRight(actors[2], x);
        this.game.physics.setRight(actors[3], x);

        this.game.physics.setBottom(actors[0], y);
        this.game.physics.setBottom(actors[3], y);

        this.game.physics.setTop(actors[1], y);
        this.game.physics.setTop(actors[2], y);

        this.game.graphics.flipping.flipHoriz(actors[0]);
        this.game.graphics.flipping.flipHoriz(actors[1]);

        this.game.graphics.flipping.flipVert(actors[1]);
        this.game.graphics.flipping.flipVert(actors[2]);

        return actors as [Actor, Actor, Actor, Actor];
    }

    /**
     * Moves a set of four Actors away from a point.
     *
     * @param actors   The four Actors to move.
     * @param amount   How far to move each Actor horizontally and vertically.
     */
    public animateExpandCorners(actors: [Actor, Actor, Actor, Actor], amount: number): void {
        this.game.physics.shiftHoriz(actors[0], amount);
        this.game.physics.shiftHoriz(actors[1], amount);
        this.game.physics.shiftHoriz(actors[2], -amount);
        this.game.physics.shiftHoriz(actors[3], -amount);

        this.game.physics.shiftVert(actors[0], -amount);
        this.game.physics.shiftVert(actors[1], amount);
        this.game.physics.shiftVert(actors[2], amount);
        this.game.physics.shiftVert(actors[3], -amount);
    }

    /**
     * Creates a small smoke animation from a point.
     *
     * @param x   The horizontal location of the point.
     * @param y   The vertical location of the point.
     * @param callback   A callback for when the animation is done.
     */
    public animateSmokeSmall(x: number, y: number, callback: (actor: Actor) => void): void {
        const actors: Actor[] = this.animateActorCorners(x, y, "SmokeSmall", undefined, "Text");

        this.game.timeHandler.addEvent((): void => {
            for (const actor of actors) {
                this.game.death.kill(actor);
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
    public animateSmokeMedium(x: number, y: number, callback: (actor: Actor) => void): void {
        const actors: [Actor, Actor, Actor, Actor] = this.animateActorCorners(
            x,
            y,
            "SmokeMedium",
            undefined,
            "Text"
        );

        this.game.timeHandler.addEvent((): void => this.animateExpandCorners(actors, 4), 7);

        this.game.timeHandler.addEvent((): void => {
            for (const actor of actors) {
                this.game.death.kill(actor);
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
    public animateSmokeLarge(x: number, y: number, callback: (actor: Actor) => void): void {
        const actors: [Actor, Actor, Actor, Actor] = this.animateActorCorners(
            x,
            y,
            "SmokeLarge",
            undefined,
            "Text"
        );

        this.animateExpandCorners(actors, 10);

        this.game.timeHandler.addEvent((): void => this.animateExpandCorners(actors, 8), 7);

        this.game.timeHandler.addEvent((): void => {
            for (const actor of actors) {
                this.game.death.kill(actor);
            }
        }, 21);

        if (callback) {
            this.game.timeHandler.addEvent(callback, 21);
        }
    }

    /**
     * Animates an exclamation mark above An Actor.
     *
     * @param actor   An Actor to show the exclamation over.
     * @param timeout   How long to keep the exclamation (by default, 140).
     * @param callback   A callback for when the exclamation is removed.
     * @returns The exclamation Actor.
     */
    public animateExclamation(actor: Actor, timeout = 140, callback?: () => void): Actor {
        const exclamation: Actor = this.game.actors.add(this.game.actors.names.exclamation);

        this.game.physics.setMidXObj(exclamation, actor);
        this.game.physics.setBottom(exclamation, actor.top);

        this.game.timeHandler.addEvent((): void => this.game.death.kill(exclamation), timeout);

        if (callback) {
            this.game.timeHandler.addEvent(callback, timeout);
        }

        return exclamation;
    }

    /**
     * Sets An Actor facing a particular direction.
     *
     * @param actor   An in-game Actor.
     * @param direction   A direction for actor to face.
     * @todo Add more logic here for better performance.
     */
    public animateCharacterSetDirection(actor: Actor, direction: Direction): void {
        actor.direction = direction;

        if (direction % 2 === 1) {
            this.game.graphics.flipping.unflipHoriz(actor);
        }

        this.game.graphics.classes.removeClasses(
            actor,
            this.game.constants.directionClasses[Direction.Top],
            this.game.constants.directionClasses[Direction.Right],
            this.game.constants.directionClasses[Direction.Bottom],
            this.game.constants.directionClasses[Direction.Left]
        );

        this.game.graphics.classes.addClass(
            actor,
            this.game.constants.directionClasses[direction]
        );

        if (direction === Direction.Right) {
            this.game.graphics.flipping.flipHoriz(actor);
            this.game.graphics.classes.addClass(
                actor,
                this.game.constants.directionClasses[Direction.Left]
            );
        }
    }

    /**
     * Sets An Actor facing a random direction.
     *
     * @param actor   An in-game Actor.
     */
    public animateCharacterSetDirectionRandom(actor: Actor): void {
        this.animateCharacterSetDirection(actor, this.game.numberMaker.randomIntWithin(0, 3));
    }

    /**
     * Positions a Character's detector in front of it as its sight.
     *
     * @param actor   A Character that should be able to see.
     */
    public animatePositionSightDetector(actor: Character): void {
        const detector: SightDetector = actor.sightDetector!;
        const direction: Direction = actor.direction;

        if (detector.direction !== direction) {
            if (actor.direction % 2 === 0) {
                this.game.physics.setWidth(detector, actor.width);
                this.game.physics.setHeight(detector, actor.sight! * 8);
            } else {
                this.game.physics.setWidth(detector, actor.sight! * 8);
                this.game.physics.setHeight(detector, actor.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                this.game.physics.setBottom(detector, actor.top);
                this.game.physics.setMidXObj(detector, actor);
                break;
            case 1:
                this.game.physics.setLeft(detector, actor.right);
                this.game.physics.setMidYObj(detector, actor);
                break;
            case 2:
                this.game.physics.setTop(detector, actor.bottom);
                this.game.physics.setMidXObj(detector, actor);
                break;
            case 3:
                this.game.physics.setRight(detector, actor.left);
                this.game.physics.setMidYObj(detector, actor);
                break;
            default:
                throw new Error("Unknown direction: " + direction + ".");
        }
    }

    /**
     * Animates the various logic pieces for finishing a dialog, such as pushes,
     * gifts, options, and battle starting or disabling.
     *
     * @param actor   A Player that's finished talking to other.
     * @param other   A Character that actor has finished talking to.
     */
    public animateCharacterDialogFinish(actor: Player, other: Character): void {
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onDialogFinish, other);

        actor.talking = false;
        other.talking = false;

        if (other.directionPreferred) {
            this.animateCharacterSetDirection(other, other.directionPreferred);
        }

        if (other.transport) {
            other.active = true;
            this.activateTransporter(actor, other as any);
            return;
        }

        if (other.pushSteps) {
            this.walking.startWalkingOnPath(actor, other.pushSteps);
        }

        if (other.gift) {
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
            this.game.menuGrapher.addMenuDialog(
                "GeneralText",
                "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!",
                (): void => this.animateCharacterDialogFinish(actor, other)
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
            this.animateCharacterDialogOptions(actor, other, other.dialogOptions);
        } else if (other.trainer && !(other as Enemy).alreadyBattled) {
            this.animateTrainerBattleStart(actor, other as Enemy);
            (other as Enemy).alreadyBattled = true;
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
     * @param actor   A Player that's finished talking to other.
     * @param other   A Character that actor has finished talking to.
     * @param dialog   The dialog settings that just finished.
     */
    public animateCharacterDialogOptions(actor: Player, other: Character, dialog: Dialog): void {
        if (!dialog.options) {
            throw new Error("Dialog should have .options.");
        }

        const options: DialogOptions = dialog.options;
        const generateCallback = (callbackDialog: string | Dialog): (() => void) | undefined => {
            if (!callbackDialog) {
                return undefined;
            }

            let callback: (...args: any[]) => void;
            let words: MenuDialogRaw;

            if (callbackDialog.constructor === Object && (callbackDialog as Dialog).options) {
                words = (callbackDialog as Dialog).words;
                callback = (): void => {
                    this.animateCharacterDialogOptions(actor, other, callbackDialog as Dialog);
                };
            } else {
                words = (callbackDialog as Dialog).words || (callbackDialog as string);
                if ((callbackDialog as Dialog).cutscene) {
                    callback = this.game.scenePlayer.bindCutscene(
                        (callbackDialog as Dialog).cutscene!,
                        {
                            player: actor,
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
     * @param actor   A Player triggering other.
     * @param other   A Detector triggered by actor.
     */
    public activateCutsceneTriggerer = (actor: Player, other: Detector): void => {
        if (other.removed || actor.collidedTrigger === other) {
            return;
        }

        actor.collidedTrigger = other;
        this.animatePlayerDialogFreeze(actor);

        if (!other.keepAlive) {
            if (other.id.indexOf("Anonymous") !== -1) {
                console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
            }

            this.game.stateHolder.addChange(other.id, "alive", false);
            this.game.death.kill(other);
        }

        if (other.cutscene) {
            this.game.scenePlayer.startCutscene(other.cutscene, {
                player: actor,
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
     * @param actor   A Player triggering other.
     * @param other   A Detector triggered by actor.
     */
    public activateThemePlayer = async (actor: Player, other: ThemeDetector): Promise<void> => {
        if (
            !actor.player ||
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
     * @param actor   A Player triggering other.
     * @param other   A Detector triggered by actor.
     */
    public activateCutsceneResponder(actor: Character, other: Detector): void {
        if (!actor.player || other.removed) {
            return;
        }

        if (other.dialog) {
            this.activateMenuTriggerer(actor, other);
            return;
        }

        this.game.scenePlayer.startCutscene(other.cutscene!, {
            player: actor,
            triggerer: other,
        });
    }

    /**
     * Activates a Detector to open a menu, and potentially a dialog.
     *
     * @param actor   A Character triggering other.
     * @param other   A Detector triggered by actor.
     */
    public activateMenuTriggerer = (actor: Character, other: MenuTriggerer): void => {
        if (other.removed || actor.collidedTrigger === other) {
            return;
        }

        if (!other.dialog) {
            throw new Error("MenuTriggerer should have .dialog.");
        }

        const name: string = other.menu || "GeneralText";
        const dialog: MenuDialogRaw | MenuDialogRaw[] = other.dialog;

        actor.collidedTrigger = other;
        this.walking.animateCharacterPreventWalking(actor);

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
                    delete actor.collidedTrigger;
                };

                this.game.menuGrapher.deleteMenu("GeneralText");

                if (other.pushSteps) {
                    this.walking.startWalkingOnPath(actor, [...other.pushSteps, complete]);
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
     * @param actor   A Character triggering other.
     * @param other   A sight detector being triggered by actor.
     */
    public activateSightDetector = (actor: Character, other: SightDetector): void => {
        if (other.viewer.talking) {
            return;
        }

        other.viewer.talking = true;
        other.active = false;

        this.game.mapScreener.blockInputs = true;

        this.game.scenePlayer.startCutscene("TrainerSpotted", {
            player: actor,
            sightDetector: other,
            triggerer: other.viewer,
        });
    };

    /**
     * Activation callback for level transports (any Actor with a .transport
     * attribute). Depending on the transport, either the map or location are
     * shifted to it.
     *
     * @param actor   A Character attempting to enter other.
     * @param other   A transporter being entered by actor.
     */
    public activateTransporter = (actor: Character, other: Transporter): void => {
        if (!actor.player || !other.active) {
            return;
        }

        if (!other.transport) {
            throw new Error("No transport given to activateTransporter");
        }

        const transport: TransportSchema = other.transport as TransportSchema;
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
     * @param actor   A Player activating other.
     * @param other   A gym statue being activated by actor.
     */
    public activateGymStatue = (actor: Character, other: GymDetector): void => {
        if (actor.direction !== 0) {
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
     * @param actor   The Solid to be affected.
     */
    public activateHMCharacter = (player: Player, actor: HMCharacter): void => {
        if (
            actor.requiredBadge &&
            !this.game.itemsHolder.getItem(this.game.storage.names.badges)[actor.requiredBadge]
        ) {
            return;
        }

        for (const pokemon of this.game.itemsHolder.getItem(
            this.game.storage.names.pokemonInParty
        )) {
            for (const move of pokemon.moves) {
                if (move.title === actor.moveName) {
                    actor.moveCallback(player, pokemon);
                    return;
                }
            }
        }
    };

    /**
     * Activates a Spawner by calling its .activate.
     *
     * @param actor   A newly placed Spawner.
     */
    public activateSpawner = (actor: Detector): void => {
        if (!actor.activate) {
            throw new Error("Spawner should have .activate.");
        }

        actor.activate.call(this, actor);
    };

    /**
     * Checks if a WindowDetector is within frame, and activates it if so.
     *
     * @param actor   An in-game WindowDetector.
     */
    public checkWindowDetector(actor: Detector): boolean {
        if (
            actor.bottom < 0 ||
            actor.left > this.game.mapScreener.width ||
            actor.top > this.game.mapScreener.height ||
            actor.right < 0
        ) {
            return false;
        }

        if (!actor.activate) {
            throw new Error("WindowDetector should have .activate.");
        }

        actor.activate.call(this, actor);
        this.game.death.kill(actor);
        return true;
    }

    /**
     * Activates an AreaSpawner. If it's for a different Area than the current,
     * that area is spawned in the appropriate direction.
     *
     * @param actor   An AreaSpawner to activate.
     */
    public spawnAreaSpawner = (actor: AreaSpawner): void => {
        const map: Map = this.game.areaSpawner.getMap(actor.map) as Map;
        const area: Area = map.areas[actor.area];

        if (area === this.game.areaSpawner.getArea()) {
            this.game.death.kill(actor);
            return;
        }

        if (
            area.spawnedBy &&
            area.spawnedBy === (this.game.areaSpawner.getArea() as Area).spawnedBy
        ) {
            this.game.death.kill(actor);
            return;
        }

        area.spawnedBy = (this.game.areaSpawner.getArea() as Area).spawnedBy;

        this.game.maps.activateAreaSpawner(actor, area);
    };

    /**
     * Activation callback for an AreaGate. The Player is marked to now spawn
     * in the new Map and Area.
     *
     * @param actor   A Character walking to other.
     * @param other   An AreaGate potentially being triggered.
     */
    public activateAreaGate = (actor: Character, other: AreaGate): void => {
        if (!actor.player || !actor.walking || actor.direction !== other.direction) {
            return;
        }

        const area: Area = this.game.areaSpawner.getMap(other.map).areas[other.area] as Area;
        let areaOffsetX: number;
        let areaOffsetY: number;

        switch (actor.direction) {
            case Direction.Top:
                areaOffsetX = actor.left - other.left;
                areaOffsetY = area.height! - actor.height;
                break;

            case Direction.Right:
                areaOffsetX = 0;
                areaOffsetY = actor.top - other.top;
                break;

            case Direction.Bottom:
                areaOffsetX = actor.left - other.left;
                areaOffsetY = 0;
                break;

            case Direction.Left:
                areaOffsetX = area.width! - actor.width;
                areaOffsetY = actor.top - other.top;
                break;

            default:
                throw new Error(`Unknown direction: '${actor.direction}'.`);
        }

        const screenOffsetX: number = areaOffsetX - actor.left;
        const screenOffsetY: number = areaOffsetY - actor.top;

        this.game.mapScreener.top = screenOffsetY;
        this.game.mapScreener.right = screenOffsetX + this.game.mapScreener.width;
        this.game.mapScreener.bottom = screenOffsetY + this.game.mapScreener.height;
        this.game.mapScreener.left = screenOffsetX;
        this.game.mapScreener.activeArea = this.game.areaSpawner.getMap().areas[
            other.area
        ] as Area;

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
     * @todo Refactor to give borderedActor a .hmActivate property.
     */
    public partyActivateCheckActor(player: Player, pokemon: Pokemon, move: HMMoveSchema): void {
        const borderedActor: Actor | undefined = player.bordering[player.direction];

        if (borderedActor && borderedActor.title.indexOf(move.characterName!) !== -1) {
            move.partyActivate!(player, pokemon);
        }
    }

    /**
     * Cuts a CuttableTree.
     *
     * @param player   The Player.
     * @todo Add an animation for what happens when the CuttableTree is cut.
     */
    public partyActivateCut = (player: Player): void => {
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
    public partyActivateStrength = (player: Player): void => {
        const boulder: HMCharacter = player.bordering[player.direction] as HMCharacter;

        this.game.menuGrapher.deleteAllMenus();
        this.game.menus.pause.close();

        if (
            !this.game.actorHitter.checkHitForActors(player as any, boulder as any) ||
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
    public partyActivateSurf = (player: Player): void => {
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
