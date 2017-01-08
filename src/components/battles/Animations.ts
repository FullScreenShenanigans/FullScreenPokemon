import { BattleOutcome, IAnimations } from "battlemovr/lib/Animations";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Introductions } from "./animations/Introductions";
import { OnActions } from "./animations/OnActions";
import { Starting } from "./animations/Starting";

/**
 * Battle animations used by FullScreenPokemon instances.
 */
export class Animations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IAnimations {
    /**
     * Introduction animations used by the FullScreenPokemon instance.
     */
    public readonly introductions: Introductions<TGameStartr> = new Introductions(this.gameStarter);

    /**
     * Action animations used by the FullScreenPokemon instance.
     */
    public readonly onActions: OnActions<TGameStartr> = new OnActions(this.gameStarter);

    /**
     * Battle start animations used by FullScreenPokemon instances.
     */
    private readonly starting: Starting<TGameStartr> = new Starting(this.gameStarter);

    /**
     * Animation for a battle starting.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public readonly onStart = (onComplete: () => void): void => this.starting.start(onComplete);

    /**
     * Animation for when the battle is complete.
     * 
     * @param outcome   Descriptor of what finished the battle.
     */
    public onComplete(outcome: BattleOutcome): void {
        console.log("Battle complete:", outcome);
    }

    /**
     * Animation for when an actor's health changes.
     * 
     * @param team   Which team's actor is being affected.
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public onHealthChange(team: Team, health: number, onComplete: () => void): void {
        console.log("Health change:", team, health);
        onComplete();
    }

    /**
     * Animation for when an actor gets knocked out.
     * 
     * @param team   Which team's actor is knocked out.
     * @param onComplete   Callback for when this is done.
     */
    public onKnockout(team: Team, onComplete: () => void): void {
        console.log("Knockout:", team);
        onComplete();
    }
}
