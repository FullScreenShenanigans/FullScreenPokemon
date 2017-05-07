import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * A single instruction on a walking path.
 */
export interface IWalkingInstruction {
    /**
     * How many blocks long this should take.
     */
    blocks: number;

    /**
     * What direction to walk in.
     */
    direction: Direction;
}

/**
 * Generates a walking instruction for a path.
 * 
 * @param thing   A Thing walking on a path.
 */
export interface IWalkingInstructionGenerator {
    (thing: ICharacter): IWalkingInstruction | void;
}

/**
 * Instructions to generate a walking path.
 */
export type IWalkingInstructions = (IWalkingInstruction | IWalkingInstructionGenerator)[];

/**
 * Walking functions used by FullScreenPokemon instances.
 */
export class Walking<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Character walking on a predetermined path.
     * 
     * @param thing   The walking Character.
     * @param path   A path to walk along.
     */
    public startWalkingOnPath(thing: ICharacter, path: IWalkingInstructions): void {
        if (!path.length) {
            throw new Error("Walking path must have instructions.");
        }

        let instructionIndex: number = 0;
        let currentInstruction: IWalkingInstruction = this.parseWalkingInstruction(path[0], thing);
        let remainingBlocks: number = currentInstruction.blocks;

        if (!remainingBlocks) {
            this.stopWalking(thing);
            return;
        }

        thing.nextDirection = undefined;
        this.startWalking(
            thing,
            currentInstruction.direction,
            (): void => {
                remainingBlocks -= 1;

                while (!remainingBlocks) {
                    instructionIndex += 1;

                    if (instructionIndex >= path.length) {
                        thing.wantsToWalk = false;

                        if (thing.direction !== currentInstruction.direction) {
                            this.gameStarter.actions.animateCharacterSetDirection(thing, currentInstruction.direction);
                        }

                        return;
                    }

                    currentInstruction = this.parseWalkingInstruction(path[instructionIndex], thing);
                    remainingBlocks = currentInstruction.blocks;
                    thing.nextDirection = currentInstruction.direction;
                }

                thing.wantsToWalk = true;
            });
    }

    /**
     * Starts a Character walking in a direction.
     * 
     * @param thing   A Character to start walking.
     * @param commands   Instructions on how to walk.
     * @param onContinueWalking   Callback to run before continuing walking.
     */
    public startWalking(thing: ICharacter, direction: Direction, onContinueWalking?: Function): void {
        const ticksPerBlock: number = this.gameStarter.equations.walkingTicksPerBlock(thing);

        this.setWalkingAttributes(thing, direction);
        this.setWalkingGraphics(thing);

        if (thing.follower) {
            this.startWalking(thing.follower, this.gameStarter.physics.getDirectionBetween(thing.follower, thing));
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock, onContinueWalking),
            ticksPerBlock + 1);
    }

    /**
     * Checks whether a Character should continue walking after a block.
     * 
     * @param thing   A Character to continue walking.
     * @param ticksPerBlock   How many ticks it takes to span a block.
     * @param onContinueWalking   Callback to run before continuing walking.
     */
    public continueWalking(thing: ICharacter, ticksPerBlock: number, onContinueWalking?: Function): void {
        if (onContinueWalking) {
            onContinueWalking();
        }

        if (!thing.wantsToWalk || (thing.player && this.gameStarter.actions.grass.checkPlayerGrassBattle(thing as IPlayer))) {
            this.stopWalking(thing);
            return;
        }

        if (thing.nextDirection !== undefined) {
            this.setWalkingAttributes(thing, thing.nextDirection);
        }

        if (thing.follower) {
            this.gameStarter.actions.following.continueFollowing(
                thing.follower,
                this.gameStarter.physics.getDirectionBetween(thing.follower, thing));
        }

        this.gameStarter.physics.snapToGrid(thing);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock, onContinueWalking),
            ticksPerBlock);
    }

    /**
     * Stops a Character walking.
     * 
     * @param thing   A Character to start walking.
     */
    public stopWalking(thing: ICharacter): void {
        thing.xvel = 0;
        thing.yvel = 0;
        thing.walking = false;

        this.gameStarter.graphics.removeClasses(thing, "walking", "standing");
        this.gameStarter.timeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.gameStarter.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        if (thing.follower) {
            this.gameStarter.actions.following.pauseFollowing(thing.follower);
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
        thing.wantsToWalk = false;

        if (thing.player) {
            (thing as IPlayer).keys = (thing as IPlayer).getKeys();
            this.gameStarter.mapScreener.blockInputs = true;
        }
    }

    /**
     * Sets the logical attributes of a walking Character.
     * 
     * @param thing   The walking Character.
     * @param direction   What direction to walk in.
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
     * Sets the visual attributes of a walking Character.
     * 
     * @param thing   The walking Character.
     */
    protected setWalkingGraphics(thing: ICharacter): void {
        const ticksPerBlock: number = this.gameStarter.equations.walkingTicksPerBlock(thing);
        const ticksPerStep: number = ticksPerBlock / 2;

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.timeHandler.addClassCycle(
                    thing,
                    ["walking", "standing"],
                    "walking",
                    ticksPerStep);

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
                    ticksPerStep * 2,
                    Infinity);
            },
            ticksPerStep);
    }

    /**
     * 
     */
    protected parseWalkingInstruction(
        instruction: IWalkingInstruction | IWalkingInstructionGenerator,
        thing: ICharacter): IWalkingInstruction {
        if (typeof instruction !== "function") {
            return instruction;
        }

        return instruction(thing) || {
            blocks: 0,
            direction: thing.direction
        };
    }
}
