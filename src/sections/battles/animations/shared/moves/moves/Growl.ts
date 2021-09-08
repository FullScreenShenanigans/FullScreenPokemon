import { TeamId } from "battlemovr";

import { Actor } from "../../../../../Actors";
import { Move } from "../Move";

/**
 * Animates a Growl battle move.
 */
export class Growl extends Move {
    /**
     * Starting x-position for notes.
     */
    private readonly noteStartX: number =
        this.teamAndAction.source.team === TeamId.player
            ? this.menu.left + this.attackerActor.width / 2
            : this.menu.right - this.attackerActor.width / 2;

    /**
     * Starting y-position for notes.
     */
    private readonly noteStartY: number =
        this.teamAndAction.source.team === TeamId.player
            ? this.menu.bottom - this.attackerActor.height
            : this.menu.top + this.attackerActor.height;

    /**
     * Horizontal delta for note movements.
     */
    private readonly noteDifferenceX: number =
        this.teamAndAction.source.team === TeamId.player
            ? this.menu.right - this.noteStartX
            : this.menu.left - this.noteStartX;

    /**
     * Vertical delta for note movements.
     */
    private readonly noteDifferenceY: number =
        this.teamAndAction.source.team === TeamId.player
            ? this.menu.top + this.defenderActor.height / 2 - this.noteStartY
            : this.menu.bottom - this.defenderActor.height - this.noteStartY;

    /**
     * Runs the move's animation.
     *
     * @param onComplete   Callback for when the animation is done.
     */
    public runAnimation(onComplete: () => void): void {
        const notes: [Actor, Actor] = [
            this.game.objectMaker.make<Actor>(this.game.actors.names.note),
            this.game.objectMaker.make<Actor>(this.game.actors.names.note),
        ];

        this.animateNote(notes[0], 10);
        this.animateNote(notes[1], 12);

        this.game.timeHandler.addEvent((): void => {
            this.game.battles.animations.actors.shake({
                callback: onComplete,
                dx: 3,
                clearTime: 6,
            });
        }, 50);
    }

    /**
     * Schedules a note's animations.
     *
     * @param note   A note Actor.
     * @param dt   Time delay between changes.
     */
    private animateNote(note: Actor, dt: number): void {
        let flip: -1 | 1 = 1;

        for (let i = 1; i <= 4; i += 1) {
            this.game.timeHandler.addEvent((): void => {
                this.shiftNote(note, flip);
                flip *= -1;
            }, dt * i);
        }

        this.game.timeHandler.addEvent((): void => this.game.death.kill(note), dt + 40);
    }

    /**
     * Shifts a note.
     *
     * @param note   A note Actor.
     * @param flip   Whether it's flipped.
     */
    private shiftNote(note: Actor, flip: -1 | 1): void {
        this.game.physics.shiftHoriz(note, this.noteDifferenceX / 4);

        if (flip === 1) {
            this.game.physics.shiftVert(note, this.noteDifferenceY / 60);
        } else {
            this.game.physics.shiftVert(note, this.noteDifferenceY / -8);
        }
    }
}
