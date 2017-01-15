import { IMoveAction } from "battlemovr/lib/Actions";
import { IDamageEffect } from "battlemovr/lib/Effects";
import { ITeamAndAction } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { Calculator } from "./damage/Calculator";

/**
 * Runs damage effect animations for FullScreenPokemon instances.
 */
export class Damage<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Calculates damage dealt from battle moves.
     */
    private readonly calculator: Calculator<TGameStartr> = new Calculator(this.gameStarter);

    /**
     * Runs the damage animation for a battle move effect.
     * 
     * @param teamAndAction   Team and move being performed.
     * @param effect   Effect of the move whose damage is being calculated.
     * @param onComplete   Handler for when this is done.
     */
    public run(teamAndAction: ITeamAndAction<IMoveAction>, effect: IDamageEffect, onComplete: () => void): void {
        const amount: number = this.calculator.calculateDamage(teamAndAction, effect);

        console.log("Will damage by", amount);

        onComplete();
    }
}
