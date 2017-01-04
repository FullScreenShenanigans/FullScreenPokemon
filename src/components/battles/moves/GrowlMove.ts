import { Team } from "battlemovr/lib/Teams";

import { IThing } from "../../Things";
import { Move } from "./Move";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

/**
 * Runs the Growl battle move.
 */
export class GrowlMove<TGameStartr extends FullScreenPokemon> extends Move<TGameStartr> {
    /**
     * 
     */
    private noteStartX: number = this.source === Team.player
        ? this.menu.left + this.attackerThing.width / 2
        : this.menu.right - this.attackerThing.width / 2;

    /**
     * 
     */
    private noteStartY: number = this.source === Team.player
        ? this.menu.bottom - this.attackerThing.height
        : this.menu.top + this.attackerThing.height;

    /**
     * 
     */
    private noteDifferenceX: number = this.source === Team.player
        ? this.menu.right - this.noteStartX
        : this.menu.left - this.noteStartX;

    /**
     * 
     */
    private noteDifferenceY: number = this.source === Team.player
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
     * 
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
     * 
     */
    private shiftNote(note: IThing, flip: -1 | 1): void {
        this.gameStarter.physics.shiftHoriz(note, this.noteDifferenceX / 4);

        if (flip === 1) {
            this.gameStarter.physics.shiftVert(note, this.noteDifferenceY / 10 * 6);
        } else {
            this.gameStarter.physics.shiftVert(note, this.noteDifferenceY / -8);
        }
    }
}
