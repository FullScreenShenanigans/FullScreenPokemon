import { BattleOutcome, IAnimations } from "battlemovr/lib/Animations";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Opponent } from "./animations/Opponent";
import { Player } from "./animations/Player";
import { Starting } from "./animations/Starting";

/**
 * Battle animations used by FullScreenPokemon instances.
 */
export class Animations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IAnimations {
    /**
     * Opponent animations used by the FullScreenPokemon instance.
     */
    public readonly opponent: Opponent<TGameStartr> = new Opponent(this.gameStarter);

    /**
     * Player animations used by the FullScreenPokemon instance.
     */
    public readonly player: Player<TGameStartr> = new Player(this.gameStarter);

    /**
     * Battle start animations used by FullScreenPokemon instances.
     */
    private readonly starting: Starting<TGameStartr> = new Starting(this.gameStarter);

    /**
     * Animation for a battle starting.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public readonly start = (onComplete: () => void): void => this.starting.start(onComplete);

    /**
     * Animation for when the battle is complete.
     * 
     * @param outcome   Descriptor of what finished the battle.
     */
    public complete(outcome: BattleOutcome): void {
        console.log("Battle complete:", outcome);
    }
}
