import { Team } from "battlemovr";

import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates a Growl battle move.
 */
export class Growl extends Move {
    /**
     * Starting x-position for notes.
     */
    private readonly noteStartX: number =
        this.teamAndAction.source.team === Team.player
            ? this.menu.left + this.attackerThing.width / 2
            : this.menu.right - this.attackerThing.width / 2;

    /**
     * Starting y-position for notes.
     */
    private readonly noteStartY: number =
        this.teamAndAction.source.team === Team.player
            ? this.menu.bottom - this.attackerThing.height
            : this.menu.top + this.attackerThing.height;

    /**
     * Horizontal delta for note movements.
     */
    private readonly noteDifferenceX: number =
        this.teamAndAction.source.team === Team.player
            ? this.menu.right - this.noteStartX
            : this.menu.left - this.noteStartX;

    /**
     * Vertical delta for note movements.
     */
    private readonly noteDifferenceY: number =
        this.teamAndAction.source.team === Team.player
            ? this.menu.top + this.defenderThing.height / 2 - this.noteStartY
            : this.menu.bottom - this.defenderThing.height - this.noteStartY;

    /**
     * Runs the move's animation.
     *
     * @param onComplete   Callback for when the animation is done.
     */
    public runAnimation(onComplete: () => void): void {
        const notes: [IThing, IThing] = [
            this.game.objectMaker.make<IThing>(this.game.things.names.note),
            this.game.objectMaker.make<IThing>(this.game.things.names.note),
        ];

        this.animateNote(notes[0], 10);
        this.animateNote(notes[1], 12);

        this.game.timeHandler.addEvent((): void => {
            this.game.battles.animations.things.shake({
                callback: onComplete,
                dx: 3,
                clearTime: 6,
            });
        }, 50);
    }

    /**
     * Schedules a note's animations.
     *
     * @param note   A note Thing.
     * @param dt   Time delay between changes.
     */
    private animateNote(note: IThing, dt: number): void {
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
     * @param note   A note Thing.
     * @param flip   Whether it's flipped.
     */
    private shiftNote(note: IThing, flip: -1 | 1): void {
        this.game.physics.shiftHoriz(note, this.noteDifferenceX / 4);

        if (flip === 1) {
            this.game.physics.shiftVert(note, this.noteDifferenceY / 60);
        } else {
            this.game.physics.shiftVert(note, this.noteDifferenceY / -8);
        }
    }
}
