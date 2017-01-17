import { Team } from "battlemovr/lib/Teams";

import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Runs the Growl battle move.
 */
export class GrowlMove<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * Starting x-position for notes.
     */
    private noteStartX: number = this.teamAndAction.source.team === Team.player
        ? this.menu.left + this.attackerThing.width / 2
        : this.menu.right - this.attackerThing.width / 2;

    /**
     * Starting y-position for notes.
     */
    private noteStartY: number = this.teamAndAction.source.team === Team.player
        ? this.menu.bottom - this.attackerThing.height
        : this.menu.top + this.attackerThing.height;

    /**
     * Horizontal delta for note movements.
     */
    private noteDifferenceX: number = this.teamAndAction.source.team === Team.player
        ? this.menu.right - this.noteStartX
        : this.menu.left - this.noteStartX;

    /**
     * Vertical delta for note movements.
     */
    private noteDifferenceY: number = this.teamAndAction.source.team === Team.player
        ? (this.menu.top + this.defenderThing.height / 2) - this.noteStartY
        : (this.menu.bottom - this.defenderThing.height) - this.noteStartY;

    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const notes: [IThing, IThing] = [
            this.gameStarter.objectMaker.make<IThing>("Note"),
            this.gameStarter.objectMaker.make<IThing>("Note")
        ];

        this.animateNote(notes[0], 10);
        this.animateNote(notes[1], 12);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(3, 0, 6, undefined, callback);
            },
            50);
    }

    /**
     * Schedules a note's animations.
     * 
     * @param note   A note Thing.
     * @param dt   Time delay between changes.
     */
    private animateNote(note: IThing, dt: number): void {
        let flip: -1 | 1 = 1;

        for (let i: number = 1; i <= 4; i += 1) {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    this.shiftNote(note, flip);
                    flip *= -1;
                },
                dt * i);
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(note),
            dt + 40);
    }

    /**
     * Shifts a note.
     * 
     * @param note   A note Thing.
     * @param flip   Whether it's flipped.
     */
    private shiftNote(note: IThing, flip: -1 | 1): void {
        this.gameStarter.physics.shiftHoriz(note, this.noteDifferenceX / 4);

        if (flip === 1) {
            this.gameStarter.physics.shiftVert(note, this.noteDifferenceY / 60);
        } else {
            this.gameStarter.physics.shiftVert(note, this.noteDifferenceY / -8);
        }
    }
}
