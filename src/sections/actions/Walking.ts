import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { WildPokemonSchema } from "../Maps";
import { Character, Player } from "../Actors";

import { Encounters } from "./walking/Encounters";

/**
 * A single instruction on a walking path.
 */
export interface WalkingInstruction {
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
 * @param actor   An Actor walking on a path.
 */
export type WalkingInstructionGenerator = (actor: Character) => WalkingInstruction | void;

/**
 * Instructions to generate a walking path.
 */
export type WalkingInstructions = (WalkingInstruction | WalkingInstructionGenerator)[];

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
     * @param actor   The walking Character.
     * @param path   A path to walk along.
     */
    public startWalkingOnPath(actor: Character, path: WalkingInstructions): void {
        if (!path.length) {
            throw new Error("Walking path must have instructions.");
        }

        let instructionIndex = 0;
        let currentInstruction: WalkingInstruction = this.parseWalkingInstruction(path[0], actor);
        let remainingBlocks: number = currentInstruction.blocks;

        if (!remainingBlocks) {
            this.stopWalking(actor);
            return;
        }

        actor.nextDirection = undefined;
        this.startWalking(actor, currentInstruction.direction, (): void => {
            remainingBlocks -= 1;

            while (!remainingBlocks) {
                instructionIndex += 1;

                if (instructionIndex >= path.length) {
                    actor.wantsToWalk = false;

                    if (actor.direction !== currentInstruction.direction) {
                        this.game.actions.animateCharacterSetDirection(
                            actor,
                            currentInstruction.direction
                        );
                    }

                    return;
                }

                currentInstruction = this.parseWalkingInstruction(path[instructionIndex], actor);
                remainingBlocks = currentInstruction.blocks;
                actor.nextDirection = currentInstruction.direction;
            }

            actor.wantsToWalk = true;
        });
    }

    /**
     * Starts a Character walking in a direction.
     *
     * @param actor   A Character to start walking.
     * @param commands   Instructions on how to walk.
     * @param onContinueWalking   Callback to run before continuing walking.
     */
    public startWalking(
        actor: Character,
        direction: Direction,
        onContinueWalking?: () => void
    ): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(actor);

        this.setWalkingAttributes(actor, direction);
        this.setWalkingGraphics(actor);

        if (actor.follower) {
            this.startWalking(
                actor.follower,
                this.game.physics.getDirectionBetween(actor.follower, actor)
            );
        }

        this.game.timeHandler.addEvent(
            (): void => this.continueWalking(actor, ticksPerBlock, onContinueWalking),
            ticksPerBlock + 1
        );
    }

    /**
     * Checks whether a Character should continue walking after a block.
     *
     * @param actor   A Character to continue walking.
     * @param ticksPerBlock   How many ticks it takes to span a block.
     * @param onContinueWalking   Callback to run before continuing walking.
     */
    public continueWalking(
        actor: Character,
        ticksPerBlock: number,
        onContinueWalking?: () => void
    ): void {
        if (onContinueWalking) {
            onContinueWalking();
        }

        if (
            !actor.wantsToWalk ||
            (actor.player && this.tryStartWildPokemonEncounter(actor as Player))
        ) {
            this.stopWalking(actor);
            return;
        }

        if (actor.nextDirection !== undefined) {
            this.setWalkingAttributes(actor, actor.nextDirection);
        }

        if (actor.follower) {
            this.game.actions.following.continueFollowing(
                actor.follower,
                this.game.physics.getDirectionBetween(actor.follower, actor)
            );
        }

        this.game.physics.snapToGrid(actor);

        this.game.timeHandler.addEvent(
            (): void => this.continueWalking(actor, ticksPerBlock, onContinueWalking),
            ticksPerBlock
        );
    }

    /**
     * Stops a Character walking.
     *
     * @param actor   A Character to start walking.
     */
    public stopWalking(actor: Character): void {
        actor.xvel = 0;
        actor.yvel = 0;
        actor.walking = false;

        this.game.graphics.classes.removeClasses(actor, "walking", "standing");
        this.game.classCycler.cancelClassCycle(actor, "walking");

        if (actor.walkingFlipping) {
            this.game.timeHandler.cancelEvent(actor.walkingFlipping);
            actor.walkingFlipping = undefined;
        }

        if (actor.follower) {
            this.game.actions.following.pauseFollowing(actor.follower);
        }

        if (actor.sightDetector) {
            this.game.actions.animatePositionSightDetector(actor);
            actor.sightDetector.nocollide = false;
        }
    }

    /**
     * Animates a Character to no longer be able to walk.
     *
     * @param actor   A Character that shouldn't be able to walk.
     */
    public animateCharacterPreventWalking(actor: Character): void {
        actor.xvel = actor.yvel = 0;
        actor.wantsToWalk = false;

        if (actor.player) {
            (actor as Player).keys = (actor as Player).getKeys();
            this.game.mapScreener.blockInputs = true;
        }
    }

    /**
     *
     * @param actor @
     * @returns Whether a wild Pokemon encounter was started.
     */
    private tryStartWildPokemonEncounter(actor: Player): boolean {
        if (this.game.menuGrapher.getActiveMenu()) {
            return false;
        }

        const wildPokemonOptions:
            | WildPokemonSchema[]
            | undefined = this.encounters.choices.getWildEncounterPokemonOptions(actor);
        if (wildPokemonOptions === undefined || wildPokemonOptions.length === 0) {
            return false;
        }

        this.encounters.starting.startWildEncounterBattle(actor, wildPokemonOptions);

        return true;
    }

    /**
     * Sets the logical attributes of a walking Character.
     *
     * @param actor   The walking Character.
     * @param direction   What direction to walk in.
     */
    private setWalkingAttributes(actor: Character, direction: Direction): void {
        actor.walking = true;

        this.game.actions.animateCharacterSetDirection(actor, direction);

        if (actor.sightDetector) {
            actor.sightDetector.nocollide = true;
        }

        switch (direction) {
            case 0:
                actor.xvel = 0;
                actor.yvel = -actor.speed;
                break;

            case 1:
                actor.xvel = actor.speed;
                actor.yvel = 0;
                break;

            case 2:
                actor.xvel = 0;
                actor.yvel = actor.speed;
                break;

            case 3:
                actor.xvel = -actor.speed;
                actor.yvel = 0;
                break;

            default:
                throw new Error("Unknown direction: " + actor.direction + ".");
        }
    }

    /**
     * Sets the visual attributes of a walking Character.
     *
     * @param actor   The walking Character.
     */
    private setWalkingGraphics(actor: Character): void {
        const ticksPerBlock: number = this.game.equations.walkingTicksPerBlock(actor);
        const ticksPerStep: number = ticksPerBlock / 2;

        this.game.timeHandler.addEvent((): void => {
            this.game.classCycler.addClassCycle(
                actor,
                ["walking", "standing"],
                "walking",
                ticksPerStep
            );

            actor.walkingFlipping = this.game.timeHandler.addEventInterval(
                (): void => {
                    if (actor.direction % 2 === 0) {
                        if (actor.flipHoriz) {
                            this.game.graphics.flipping.unflipHoriz(actor);
                        } else {
                            this.game.graphics.flipping.flipHoriz(actor);
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
        instruction: WalkingInstruction | WalkingInstructionGenerator,
        actor: Character
    ): WalkingInstruction {
        if (typeof instruction !== "function") {
            return instruction;
        }

        return (
            instruction(actor) || {
                blocks: 0,
                direction: actor.direction,
            }
        );
    }
}
