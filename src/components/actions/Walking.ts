import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * 
 */
export type IWalkingCommands = (IWalkingCommand | IWalkingCommandGenerator)[];

/**
 * 
 */
export interface IWalkingCommand {
    direction: Direction;
    blocks: number;
}

/**
 * 
 */
export interface IWalkingCommandGenerator {
    (thing: ICharacter): IWalkingCommand;
}

/**
 * A callback to run on a Character mid-step. This may return true to indicate to the
 * managing TimeHandlr to stop the walking cycle.
 * 
 * @param thing   The Character mid-step.
 * @returns Either nothing or whether the walking cycle should stop.
 */
export interface IWalkingStepCommandFunction {
    (thing: ICharacter): number | undefined;
}

/**
 * 
 */
export class Walking<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Thing walking in a direction forever.
     * 
     * @param thing   A Thing to start walking.
     * @param commands   Instructions on how to walk.
     */
    public startWalking(thing: ICharacter, direction: Direction): void {
        const ticksPerBlock: number = 32 / thing.speed;

        this.setWalkingAttributes(thing, direction);
        this.setWalkingGraphics(thing);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock),
            ticksPerBlock);
    }

    /**
     * 
     */
    protected continueWalking(thing: ICharacter, ticksPerBlock: number): void {
        if (!thing.wantsToWalk || (thing.player && this.gameStarter.battles.checkPlayerGrassBattle(thing as IPlayer))) {
            this.stopWalking(thing);
            return;
        }

        if (thing.nextDirection !== undefined) {
            this.setWalkingAttributes(thing, thing.nextDirection);
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock),
            ticksPerBlock);
    }

    /**
     * Stops a Thing walking.
     * 
     * @param thing   A Thing to start walking.
     * @param commands   Any extra instructions on how to walk.
     */
    protected stopWalking(thing: ICharacter): void {
        thing.xvel = 0;
        thing.yvel = 0;
        thing.walking = false;

        this.gameStarter.graphics.removeClasses(thing, "walking", "standing");
        this.gameStarter.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.gameStarter.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        if (thing.sightDetector) {
            this.gameStarter.actions.animatePositionSightDetector(thing);
            thing.sightDetector.nocollide = false;
        }
    }

    /**
     * Animates a Character to no longer be able to walk.
     * 
     * @param thing   A Character that shouldn't be able to walk.
     */
    public animateCharacterPreventWalking(thing: ICharacter): void {
        thing.xvel = thing.yvel = 0;

        if (thing.player) {
            (thing as IPlayer).keys = (thing as IPlayer).getKeys();
            this.gameStarter.mapScreener.blockInputs = true;
        }
    }

    // /**
    //  * Starts a Character walking behind another Character. The leader is given a
    //  * .walkingCommands queue of recent steps that the follower will mimic.
    //  * 
    //  * @param thing   The following Character.
    //  * @param other   The leading Character.
    //  */
    // public animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
    //     let direction: Direction | undefined = this.gameStarter.physics.getDirectionBordering(thing, other);
    //     if (!direction) {
    //         throw new Error("Characters are too far away to follow.");
    //     }

    //     thing.nocollide = true;

    //     if (thing.player) {
    //         (thing as IPlayer).allowDirectionAsKeys = true;
    //         (thing as IPlayer).shouldWalk = false;
    //     }

    //     thing.following = other;
    //     other.follower = thing;

    //     this.gameStarter.saves.addStateHistory(thing, "speed", thing.speed);
    //     thing.speed = other.speed;

    //     other.walkingCommands = [];

    //     this.animateCharacterSetDirection(thing, direction);

    //     switch (direction) {
    //         case 0:
    //             this.gameStarter.physics.setTop(thing, other.bottom);
    //             break;
    //         case 1:
    //             this.gameStarter.physics.setRight(thing, other.left);
    //             break;
    //         case 2:
    //             this.gameStarter.physics.setBottom(thing, other.top);
    //             break;
    //         case 3:
    //             this.gameStarter.physics.setLeft(thing, other.right);
    //             break;
    //         default:
    //             break;
    //     }

    //     // Manually start the walking process without giving a 0 onStop,
    //     // so that it continues smoothly in the walking interval
    //     this.animateCharacterStartWalking(thing, direction);

    //     thing.followingLoop = this.gameStarter.timeHandler.addEventInterval(
    //         (): void => this.animateCharacterFollowContinue(thing, other),
    //         this.gameStarter.equations.speedWalking(thing),
    //         Infinity);
    // }

    // /**
    //  * Continuation helper for a following cycle. The next walking command is
    //  * played, if it exists.
    //  * 
    //  * @param thing   The following Character.
    //  * @param other   The leading Character.
    //  */
    // public animateCharacterFollowContinue(thing: ICharacter, other: ICharacter): void {
    //     if (!other.walkingCommands) {
    //         throw new Error("Thing should have .walkingCommands.");
    //     }

    //     if (other.walkingCommands.length === 0) {
    //         return;
    //     }

    //     const direction: Direction = other.walkingCommands.shift()!;

    //     this.animateCharacterStartWalking(thing, direction, 0);
    // }

    // /**
    //  * Animates a Character to stop having a follower.
    //  * 
    //  * @param thing   The leading Character.
    //  * @returns True, to stop TimeHandlr cycles.
    //  */
    // public animateCharacterFollowStop(thing: ICharacter): boolean {
    //     const other: ICharacter | undefined = thing.following;
    //     if (!other) {
    //         return true;
    //     }

    //     thing.nocollide = false;
    //     delete thing.following;
    //     delete other.follower;

    //     this.animateCharacterStopWalking(thing);
    //     this.gameStarter.timeHandler.cancelEvent(thing.followingLoop!);

    //     return true;
    // }

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

        this.gameStarter.timeHandler.addEvent(
            (): boolean => this.activateCharacterRoaming(thing),
            70 + this.gameStarter.numberMaker.randomInt(210));

        if (!thing.talking && !this.gameStarter.menuGrapher.getActiveMenu()) {
            // this.animateCharacterStartWalkingRandom(thing);
        }

        return false;
    }

    /**
     * 
     */
    protected setWalkingAttributes(thing: ICharacter, direction: Direction): void {
        thing.walking = true;

        this.gameStarter.actions.animateCharacterSetDirection(thing, direction);

        if (thing.sightDetector) {
            thing.sightDetector.nocollide = true;
        }

        switch (direction) {
            case 0:
                thing.xvel = 0;
                thing.yvel = -thing.speed;
                break;

            case 1:
                thing.xvel = thing.speed;
                thing.yvel = 0;
                break;

            case 2:
                thing.xvel = 0;
                thing.yvel = thing.speed;
                break;

            case 3:
                thing.xvel = -thing.speed;
                thing.yvel = 0;
                break;

            default:
                throw new Error("Unknown direction: " + thing.direction + ".");
        }
    }

    /**
     * 
     */
    protected setWalkingGraphics(thing: ICharacter): void {
        const ticksPerBlock: number = 32 / thing.speed;
        const ticksPerStep: number = ticksPerBlock / 2;

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.timeHandler.addClassCycle(
                    thing,
                    ["walking", "standing"],
                    "walking",
                    ticksPerStep / 2);

                thing.walkingFlipping = this.gameStarter.timeHandler.addEventInterval(
                    (): void => {
                        if (thing.direction % 2 === 0) {
                            if (thing.flipHoriz) {
                                this.gameStarter.graphics.unflipHoriz(thing);
                            } else {
                                this.gameStarter.graphics.flipHoriz(thing);
                            }
                        }
                    },
                    ticksPerStep,
                    Infinity);
            },
            ticksPerStep);
    }
}
