import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { IWildPokemonSchema } from "../Maps";
import { ICharacter, IPlayer } from "../Things";

import { Encounters } from "./walking/Encounters";

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
export type IWalkingInstructionGenerator = (thing: ICharacter) => IWalkingInstruction | void;

/**
 * Instructions to generate a walking path.
 */
export type IWalkingInstructions = (IWalkingInstruction | IWalkingInstructionGenerator)[];

/**
 * Starts, continues, and stops characters walking.
 */
export class Walking extends Section<FullScreenPokemon> {
    /**
     * Checks for and starts wild Pokemon encounters during walking.
     */
    @member(Encounters)
    public readonly encounters: Encounters;

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

        let instructionIndex = 0;
        let currentInstruction: IWalkingInstruction = this.parseWalkingInstruction(
            path[0],
            thing
        );
        let remainingBlocks: number = currentInstruction.blocks;

        if (!remainingBlocks) {
            this.stopWalking(thing);
            return;
        }

        thing.nextDirection = undefined;
        this.startWalking(thing, currentInstruction.direction, (): void => {
            remainingBlocks -= 1;

            while (!remainingBlocks) {
                instructionIndex += 1;

                if (instructionIndex >= path.length) {
                    thing.wantsToWalk = false;

                    if (thing.direction !== currentInstruction.direction) {
                        this.game.actions.animateCharacterSetDirection(
                            thing,
                            currentInstruction.direction
                        );
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
    public startWalking(
        thing: ICharacter,
        direction: Direction,
        onContinueWalking?: Function
    ): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(thing);

        this.setWalkingAttributes(thing, direction);
        this.setWalkingGraphics(thing);

        if (thing.follower) {
            this.startWalking(
                thing.follower,
                this.game.physics.getDirectionBetween(thing.follower, thing)
            );
        }

        this.game.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock, onContinueWalking),
            ticksPerBlock + 1
        );
    }

    /**
     * Checks whether a Character should continue walking after a block.
     *
     * @param thing   A Character to continue walking.
     * @param ticksPerBlock   How many ticks it takes to span a block.
     * @param onContinueWalking   Callback to run before continuing walking.
     */
    public continueWalking(
        thing: ICharacter,
        ticksPerBlock: number,
        onContinueWalking?: Function
    ): void {
        if (onContinueWalking) {
            onContinueWalking();
        }

        if (
            !thing.wantsToWalk ||
            (thing.player && this.tryStartWildPokemonEncounter(thing as IPlayer))
        ) {
            this.stopWalking(thing);
            return;
        }

        if (thing.nextDirection !== undefined) {
            this.setWalkingAttributes(thing, thing.nextDirection);
        }

        if (thing.follower) {
            this.game.actions.following.continueFollowing(
                thing.follower,
                this.game.physics.getDirectionBetween(thing.follower, thing)
            );
        }

        this.game.physics.snapToGrid(thing);

        this.game.timeHandler.addEvent(
            (): void => this.continueWalking(thing, ticksPerBlock, onContinueWalking),
            ticksPerBlock
        );
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

        this.game.graphics.classes.removeClasses(thing, "walking", "standing");
        this.game.classCycler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            this.game.timeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        if (thing.follower) {
            this.game.actions.following.pauseFollowing(thing.follower);
        }

        if (thing.sightDetector) {
            this.game.actions.animatePositionSightDetector(thing);
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
            this.game.mapScreener.blockInputs = true;
        }
    }

    /**
     *
     * @param thing @
     * @returns Whether a wild Pokemon encounter was started.
     */
    private tryStartWildPokemonEncounter(thing: IPlayer): boolean {
        if (this.game.menuGrapher.getActiveMenu()) {
            return false;
        }

        const wildPokemonOptions:
            | IWildPokemonSchema[]
            | undefined = this.encounters.choices.getWildEncounterPokemonOptions(thing);
        if (wildPokemonOptions === undefined || wildPokemonOptions.length === 0) {
            return false;
        }

        this.encounters.starting.startWildEncounterBattle(thing, wildPokemonOptions);

        return true;
    }

    /**
     * Sets the logical attributes of a walking Character.
     *
     * @param thing   The walking Character.
     * @param direction   What direction to walk in.
     */
    private setWalkingAttributes(thing: ICharacter, direction: Direction): void {
        thing.walking = true;

        this.game.actions.animateCharacterSetDirection(thing, direction);

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
    private setWalkingGraphics(thing: ICharacter): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(thing);
        const ticksPerStep: number = ticksPerBlock / 2;

        this.game.timeHandler.addEvent((): void => {
            this.game.classCycler.addClassCycle(
                thing,
                ["walking", "standing"],
                "walking",
                ticksPerStep
            );

            thing.walkingFlipping = this.game.timeHandler.addEventInterval(
                (): void => {
                    if (thing.direction % 2 === 0) {
                        if (thing.flipHoriz) {
                            this.game.graphics.flipping.unflipHoriz(thing);
                        } else {
                            this.game.graphics.flipping.flipHoriz(thing);
                        }
                    }
                },
                ticksPerStep * 2,
                Infinity
            );
        }, ticksPerStep);
    }

    /**
     *
     */
    private parseWalkingInstruction(
        instruction: IWalkingInstruction | IWalkingInstructionGenerator,
        thing: ICharacter
    ): IWalkingInstruction {
        if (typeof instruction !== "function") {
            return instruction;
        }

        return (
            instruction(thing) || {
                blocks: 0,
                direction: thing.direction,
            }
        );
    }
}
